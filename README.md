# anthropic-mcp-course

A hands-on Python project built while learning the **Model Context Protocol (MCP)** — Anthropic's open standard for connecting AI applications to external tools, data, and reusable workflows.

The repo contains course notes and a fully working CLI chat application that puts every concept into practice.

---

## Repository Structure

```
anthropic-mcp-course/
├── notes/                        # Markdown notes for each course lesson
│   ├── 01-introducing-mcp.md
│   ├── 02-mcp-clients.md
│   └── ...
└── exercises/
    └── cli_project/              # The main project (run this)
        ├── main.py               # Entry point
        ├── mcp_server.py         # MCP Server (tools, resources, prompts)
        ├── mcp_client.py         # MCP Client wrapper
        └── core/
            ├── claude.py         # Claude / OpenRouter service layer
            ├── cli.py            # prompt-toolkit CLI with autocomplete
            ├── cli_chat.py       # Chat logic: resource injection & commands
            ├── chat.py           # Base chat loop with tool execution
            └── tools.py          # Tool discovery and execution manager
```

---

## What the CLI Project Does

`cli_project` is a terminal chat app powered by an MCP server that manages an in-memory document store. It demonstrates all three MCP primitives working together:

| Primitive | Implementation | What it does |
|-----------|---------------|--------------|
| **Tools** | `read_doc_contents`, `edit_document` | Let Claude read and edit documents |
| **Resources** | `docs://documents`, `docs://documents/{doc_id}` | Expose the document list and individual docs |
| **Prompts** | `/format` | Rewrite a document in Markdown via a server-defined template |

### Key features

- **`@mention` document injection** — type `@report.pdf` and the document content is fetched from the MCP server and injected directly into the prompt before it reaches the model, no tool call needed.
- **`/command` prompt execution** — type `/format plan.md` to run a server-side prompt template. Tab-completion shows available commands and document IDs.
- **Multi-client support** — `main.py` always connects a `doc_client` (the built-in document server) and can load additional MCP servers by passing their script paths as CLI arguments.
- **OpenRouter support** — works out of the box with a free OpenRouter key (defaults to `nvidia/nemotron-3-super-120b-a12b:free`). Switching to Claude directly requires uncommenting a few lines (see [Switching to Claude](#switching-to-claude)).

---

## Prerequisites

- Python 3.10+
- [`uv`](https://github.com/astral-sh/uv) (recommended) **or** plain `pip`
- An [OpenRouter API key](https://openrouter.ai/) (free) **or** an [Anthropic API key](https://console.anthropic.com/)

---

## Setup

### 1. Clone and enter the project

```bash
git clone https://github.com/theduodecim/anthropic-mcp-course.git
cd anthropic-mcp-course/exercises/cli_project
```

### 2. Configure environment variables

Edit the `.env` file (already present, never committed):

```bash
# Default: OpenRouter (free tier available)
OPENROUTER_API_KEY="your-openrouter-key"
OPENROUTER_MODEL="nvidia/nemotron-3-super-120b-a12b:free"   # or any OpenRouter model

# Set to 1 if running with uv, 0 if using plain python
USE_UV=1

# --- Optional: switch to Claude directly ---
# ANTHROPIC_API_KEY="your-anthropic-key"
# CLAUDE_MODEL="claude-sonnet-4-5"
```

### 3. Install dependencies

**With uv (recommended):**

```bash
uv venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
uv pip install -e .
```

**With pip:**

```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install anthropic python-dotenv prompt-toolkit "mcp[cli]==1.8.0"
```

---

## Running the App

```bash
# With uv
uv run main.py

# With plain Python
python main.py
```

You'll get an interactive `>` prompt.

### Connect additional MCP servers

```bash
uv run main.py path/to/other_server.py
```

---

## Usage

### Chat normally

```
> What are the main points in the spec?
```

### Mention a document with `@`

The document content is fetched via MCP resource and injected into the prompt — no tool call required.

```
> Summarize @report.pdf
> Compare @plan.md and @spec.txt
```

### Run a prompt command with `/`

Use Tab to autocomplete the command name and the document ID.

```
> /format deposition.md
```

Available commands come from the MCP server's registered prompts. Right now: `format`.

---

## Development

### Adding documents

Edit the `docs` dictionary in `mcp_server.py`:

```python
docs = {
    "my_doc.md": "Content goes here.",
    ...
}
```

### Adding a new tool

```python
@mcp.tool(name="my_tool", description="Does something useful.")
def my_tool(param: str = Field(description="A parameter")) -> str:
    return f"Result for {param}"
```

### Adding a new prompt command

```python
@mcp.prompt(name="summarize", description="Summarizes a document.")
def summarize_document(doc_id: str = Field(description="ID of the document")) -> list[base.Message]:
    return [base.UserMessage(f"Summarize the document with id {doc_id}. Use the read_doc_contents tool to read it first.")]
```

### Testing the server in isolation

The MCP Inspector lets you test tools, resources, and prompts in the browser without running the full app:

```bash
uv run mcp dev mcp_server.py
```

Open `http://127.0.0.1:6274`, click **Connect**, then explore the Tools, Resources, and Prompts tabs.

---

## Switching to Claude

The app ships configured for OpenRouter so it works without an Anthropic key. To use Claude directly:

1. Set `ANTHROPIC_API_KEY` and `CLAUDE_MODEL` in `.env`
2. In `main.py`, comment out the OpenRouter lines and uncomment the Claude lines
3. In `core/claude.py`, uncomment the `Anthropic` client block and comment out the OpenRouter block
4. In `pyproject.toml`, uncomment `anthropic>=0.51.0`

---

## Dependencies

| Package | Purpose |
|---------|---------|
| `mcp[cli]` | MCP server + client SDK |
| `prompt-toolkit` | Terminal UI with autocomplete |
| `python-dotenv` | `.env` loading |
| `requests` | OpenRouter HTTP calls |
| `anthropic` *(optional)* | Direct Claude API access |