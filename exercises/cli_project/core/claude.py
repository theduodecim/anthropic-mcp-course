# uncomment this if you have a Claude API key
# from anthropic import Anthropic
# from anthropic.types import Message

import os
import json
import requests


class OpenRouterContentBlock:
    """Mimics anthropic TextBlock / ToolUseBlock for duck-typing compatibility."""
    def __init__(self, type, text=None, name=None, id=None, input=None):
        self.type = type    # "text" or "tool_use"
        self.text = text    # populated when type == "text"
        self.name = name    # populated when type == "tool_use"
        self.id = id        # populated when type == "tool_use"
        self.input = input  # populated when type == "tool_use"


class OpenRouterMessage:
    """Mimics anthropic.types.Message for duck-typing compatibility."""
    def __init__(self, content: list, stop_reason: str):
        self.content = content          # list[OpenRouterContentBlock]
        self.stop_reason = stop_reason  # "end_turn" or "tool_use"


class Claude:
    def __init__(self, model: str):
        # uncomment this if you have a Claude API key
        # self.client = Anthropic()
        self.model = model
        self.api_key = os.getenv("OPENROUTER_API_KEY", "")
        self.base_url = "https://openrouter.ai/api/v1/chat/completions"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    def add_user_message(self, messages: list, message):
        # Handle tool result lists (from ToolManager.execute_tool_requests)
        if isinstance(message, list) and message and isinstance(message[0], dict) and message[0].get("type") == "tool_result":
            for result in message:
                messages.append({
                    "role": "tool",
                    "tool_call_id": result["tool_use_id"],
                    "content": result.get("content", ""),
                })
            return

        user_message = {
            "role": "user",
            "content": message.content
            # uncomment this if you have a Claude API key
            # if isinstance(message, Message)
            if isinstance(message, OpenRouterMessage)
            else message,
        }
        messages.append(user_message)

    def add_assistant_message(self, messages: list, message):
        # NOTE: For OpenRouter, when the assistant used tool_calls, we must
        # reconstruct the message in OpenAI format (with tool_calls array),
        # not as an Anthropic content block list.
        if isinstance(message, OpenRouterMessage):
            tool_calls = []
            text_parts = []
            for block in message.content:
                if block.type == "tool_use":
                    tool_calls.append({
                        "id": block.id,
                        "type": "function",
                        "function": {
                            "name": block.name,
                            "arguments": json.dumps(block.input),
                        },
                    })
                elif block.type == "text" and block.text:
                    text_parts.append(block.text)
            assistant_msg = {"role": "assistant", "content": "\n".join(text_parts) or None}
            if tool_calls:
                assistant_msg["tool_calls"] = tool_calls
            messages.append(assistant_msg)
        else:
            # uncomment this if you have a Claude API key
            # assistant_message = {
            #     "role": "assistant",
            #     "content": message.content if isinstance(message, Message) else message,
            # }
            # messages.append(assistant_message)
            messages.append({"role": "assistant", "content": message})

    def text_from_message(self, message: OpenRouterMessage):
        return "\n".join(
            [block.text for block in message.content if block.type == "text" and block.text]
        )

    def chat(
        self,
        messages,
        system=None,
        temperature=1.0,
        stop_sequences=[],
        tools=None,
        thinking=False,       # Anthropic-only — ignored in OpenRouter path
        thinking_budget=1024, # Anthropic-only — ignored in OpenRouter path
    ) -> OpenRouterMessage:

        # uncomment this if you have a Claude API key
        # params = {
        #     "model": self.model,
        #     "max_tokens": 8000,
        #     "messages": messages,
        #     "temperature": temperature,
        #     "stop_sequences": stop_sequences,
        # }
        # if thinking:
        #     params["thinking"] = {"type": "enabled", "budget_tokens": thinking_budget}
        # if tools:
        #     params["tools"] = tools
        # if system:
        #     params["system"] = system
        # message = self.client.messages.create(**params)
        # return message

        # Build message list — prepend system as a system-role message if provided
        openrouter_messages = []
        if system:
            openrouter_messages.append({"role": "system", "content": system})
        openrouter_messages.extend(messages)

        payload = {
            "model": self.model,
            "messages": openrouter_messages,
            "temperature": temperature,
            "max_tokens": 8000,
            "reasoning": {"enabled": True},  # Enable reasoning for nemotron model
        }

        if stop_sequences:
            payload["stop"] = stop_sequences

        # Translate tools from Anthropic format to OpenAI function-calling format
        if tools:
            payload["tools"] = [
                {
                    "type": "function",
                    "function": {
                        "name": t["name"],
                        "description": t.get("description", ""),
                        "parameters": t.get("input_schema", {}),
                    },
                }
                for t in tools
            ]
            payload["tool_choice"] = "auto"

        try:
            resp = requests.post(self.base_url, headers=self.headers, data=json.dumps(payload))
            if not resp.ok:
                raise RuntimeError(
                    f"OpenRouter request failed [{resp.status_code}]: {resp.text}"
                )
            response_json = resp.json()
        except requests.RequestException as e:
            raise RuntimeError(f"OpenRouter network error: {e}") from e

        # Parse response into duck-typed OpenRouterMessage
        choice = response_json["choices"][0]
        finish_reason = choice.get("finish_reason", "stop")
        msg = choice["message"]

        content_blocks: list[OpenRouterContentBlock] = []

        # Text content (may include reasoning prefix from the model)
        if msg.get("content"):
            content_blocks.append(OpenRouterContentBlock(type="text", text=msg["content"]))

        # Tool calls
        for tool_call in msg.get("tool_calls", []):
            content_blocks.append(OpenRouterContentBlock(
                type="tool_use",
                id=tool_call["id"],
                name=tool_call["function"]["name"],
                input=json.loads(tool_call["function"]["arguments"]),
            ))

        # Map finish_reason to Anthropic-style stop_reason
        stop_reason = "tool_use" if finish_reason == "tool_calls" else "end_turn"

        return OpenRouterMessage(content=content_blocks, stop_reason=stop_reason)
