# Prompts in the Client

## Overview

The final piece of the MCP client is prompt support.

The client must be able to:

1. Discover available prompts from the MCP server
2. Request a specific prompt
3. Pass variables to the prompt
4. Receive the generated messages

This allows applications to use reusable prompt templates defined on the server.

---

# Why Prompt Support Matters

Without prompt support:

```text
User
  ↓
Writes Instructions Manually
  ↓
Claude
```

With prompt support:

```text
User
  ↓
Select Prompt
  ↓
MCP Client
  ↓
MCP Server
  ↓
Generated Messages
  ↓
Claude
```

The server provides carefully designed prompts while the client handles execution.

---

# Listing Available Prompts

The first capability is discovering prompts.

Implementation:

```python
async def list_prompts(self) -> list[types.Prompt]:
    result = await self.session().list_prompts()
    return result.prompts
```

---

## How It Works

Step 1

Request available prompts from the MCP server.

```python
result = await self.session().list_prompts()
```

---

Step 2

Receive a list of prompt definitions.

---

Step 3

Return the prompts.

```python
return result.prompts
```

---

# Example Result

The server might return:

```text
format
summarize
analyze
review
```

Each prompt contains:

* Name
* Description
* Parameters

These can be displayed in the client UI.

---

# Retrieving a Prompt

The second capability is requesting a specific prompt.

Implementation:

```python
async def get_prompt(
    self,
    prompt_name,
    args: dict[str, str]
):
    result = await self.session().get_prompt(
        prompt_name,
        args
    )

    return result.messages
```

This retrieves a fully generated prompt from the server.

---

# Understanding Arguments

Prompts often require parameters.

Example prompt:

```python
format_document(doc_id: str)
```

Client request:

```python
{
    "doc_id": "plan.md"
}
```

The arguments dictionary is passed directly to the prompt function.

---

# Variable Interpolation

Server definition:

```python
def format_document(doc_id: str):
```

Client request:

```python
{
    "doc_id": "plan.md"
}
```

Prompt template:

```text
Format the following document:

{doc_id}
```

Generated result:

```text
Format the following document:

plan.md
```

The server automatically inserts the values.

---

# What get_prompt() Returns

The MCP server does not return raw text.

It returns messages.

Example:

```python
[
    UserMessage(
        content="Format plan.md..."
    )
]
```

or

```python
[
    UserMessage(...),
    AssistantMessage(...)
]
```

These messages are ready to send directly to Claude.

---

# CLI Integration

After implementing prompt support, the CLI can expose prompts as commands.

Example:

User types:

```text
/
```

The application displays:

```text
format
summarize
review
analyze
```

The user selects a prompt.

---

# Example Workflow

User selects:

```text
format
```

The application asks:

```text
Choose a document:
```

Available options:

```text
report.pdf
plan.md
notes.txt
```

User selects:

```text
plan.md
```

The client executes:

```python
await get_prompt(
    "format",
    {
        "doc_id": "plan.md"
    }
)
```

The generated messages are returned.

---

# What Happens Next

After retrieving the prompt:

```text
Client
   ↓
Generated Messages
   ↓
Claude
```

Claude receives:

* Formatting instructions
* Document identifier
* Any additional context

The AI can then use available tools if necessary.

---

# Complete Prompt Lifecycle

## Step 1

Server author creates a prompt.

```python
@mcp.prompt(...)
```

---

## Step 2

Prompt is registered with the MCP server.

---

## Step 3

Client discovers prompts.

```python
list_prompts()
```

---

## Step 4

User selects a prompt.

---

## Step 5

Client sends variables.

```python
get_prompt(...)
```

---

## Step 6

Server generates messages.

---

## Step 7

Messages are returned.

---

## Step 8

Messages are sent to Claude.

---

## Step 9

Claude executes the workflow.

---

# Why This Is Useful

Prompt support provides:

## Reusability

The same prompt can be used repeatedly.

---

## Consistency

Every user receives identical instructions.

---

## Customization

Variables allow prompts to adapt to different situations.

Example:

```text
format(report.pdf)
format(notes.txt)
format(plan.md)
```

Same prompt.

Different inputs.

---

## Centralized Prompt Engineering

Prompt improvements happen on the server.

Clients automatically benefit without updates.

---

# MCP Client Responsibilities

By this point the MCP client can:

## Tools

```python
list_tools()
call_tool()
```

Purpose:

Execute actions.

---

## Resources

```python
read_resource()
```

Purpose:

Retrieve information.

---

## Prompts

```python
list_prompts()
get_prompt()
```

Purpose:

Generate reusable AI instructions.

---

# Complete MCP Client Capabilities

```text
MCP Client
│
├── list_tools()
├── call_tool()
│
├── read_resource()
│
├── list_prompts()
└── get_prompt()
```

At this stage, the client can access all major MCP server features.

---

# Key Takeaways

* Prompts can be discovered using list_prompts().
* Prompt templates are retrieved using get_prompt().
* Variables are passed through an arguments dictionary.
* The server performs variable interpolation.
* Prompts return message objects, not plain text.
* Generated messages can be sent directly to Claude.
* Prompt support enables reusable and parameterized AI workflows.
* Together with tools and resources, prompts complete the MCP client implementation.

Interview Summary:

"Prompt support in an MCP client allows applications to discover available prompts and retrieve fully generated prompt messages from an MCP server. The client uses list_prompts() to discover prompts and get_prompt() to execute them with user-provided variables. This enables reusable, parameterized prompt workflows while centralizing prompt engineering logic on the server."
