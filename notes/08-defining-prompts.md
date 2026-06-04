# Defining Prompts in MCP

## Overview

Prompts in MCP allow server authors to provide pre-built, high-quality instructions that clients can use directly.

Instead of forcing users to write prompts from scratch, the server can expose carefully designed prompt templates that produce more consistent and reliable results.

Think of prompts as reusable AI workflows packaged inside an MCP server.

---

# Why Use Prompts?

Users can already ask Claude to perform many tasks directly.

Example:

```text
Reformat report.pdf into Markdown.
```

This may work, but results can vary depending on:

* User wording
* Missing instructions
* Ambiguous requirements
* Lack of structure

MCP prompts solve this problem.

The server author can:

* Test prompts extensively
* Refine instructions
* Handle edge cases
* Improve consistency

Users benefit from expert prompt engineering without needing to become experts themselves.

---

# Core Idea

Without MCP Prompts:

```text
User
  ↓
Writes Prompt
  ↓
Claude
```

With MCP Prompts:

```text
User
  ↓
Selects Prompt
  ↓
Pre-Built Template
  ↓
Claude
```

The prompt logic is centralized and reusable.

---

# Example: Format Command

Suppose we want users to convert documents into Markdown.

User command:

```text
/format report.pdf
```

Expected result:

```text
# Report Title

## Section 1

- Item A
- Item B

| Column |
|---------|
| Value |
```

The prompt handles formatting automatically.

---

# Prompt Workflow

Step 1

User types:

```text
/
```

The application displays available prompts.

Example:

```text
format
summarize
analyze
```

---

Step 2

User selects:

```text
format
```

---

Step 3

User provides:

```text
report.pdf
```

---

Step 4

The MCP server generates a prompt.

---

Step 5

Claude receives the generated messages.

---

Step 6

Claude performs the requested task.

---

# Defining a Prompt

Prompts use a decorator similar to tools and resources.

Example:

```python
@mcp.prompt(
    name="format",
    description="Rewrites the contents of the document in Markdown format."
)
def format_document(
    doc_id: str = Field(
        description="Id of the document to format"
    )
) -> list[base.Message]:
```

This registers a prompt named:

```text
format
```

that clients can discover and execute.

---

# Prompt Parameters

Prompts can accept inputs.

Example:

```python
doc_id: str
```

When the user runs:

```text
/format report.pdf
```

The parameter becomes:

```python
doc_id = "report.pdf"
```

The value is inserted into the prompt template.

---

# Creating the Prompt Content

Example:

```python
prompt = f"""
Your goal is to reformat a document to be written with markdown syntax.

The id of the document you need to reformat is:

<document_id>
{doc_id}
</document_id>

Add in headers, bullet points, tables, etc as necessary.
"""
```

This dynamically builds instructions using user-provided data.

---

# Returning Messages

Prompts return messages.

Example:

```python
return [
    base.UserMessage(prompt)
]
```

The returned messages are sent directly to Claude.

---

# Multiple Messages

A prompt can return more than one message.

Example:

```python
return [
    base.UserMessage(
        "Analyze the document."
    ),
    base.AssistantMessage(
        "I will review the document structure first."
    ),
]
```

This allows creation of more advanced conversational workflows.

---

# Testing Prompts

Use the MCP Inspector:

```bash
uv run mcp dev mcp_server.py
```

Open the Inspector in your browser.

Navigate to:

```text
Prompts
```

The Inspector allows you to:

* View prompt definitions
* Test variables
* Inspect generated messages
* Verify prompt formatting

---

# What the Inspector Shows

The Inspector displays:

Input:

```text
report.pdf
```

Generated prompt:

```text
Your goal is to reformat a document...
```

Final message list:

```text
UserMessage(...)
```

This makes prompt debugging much easier.

---

# Prompt Interpolation

Prompt variables are automatically inserted.

Example template:

```python
f"""
Document:
{doc_id}
"""
```

Input:

```text
report.pdf
```

Generated result:

```text
Document:
report.pdf
```

This process is called interpolation.

---

# Benefits of MCP Prompts

## Consistency

Every user receives the same high-quality instructions.

---

## Expertise

Prompt engineering knowledge is embedded in the server.

---

## Reusability

Multiple applications can use the same prompts.

Example:

* CLI app
* Desktop app
* Web application

All can share identical prompt definitions.

---

## Easier Maintenance

Instead of updating prompts across many clients:

```text
Client A
Client B
Client C
```

You update:

```text
MCP Server
```

Once.

All clients automatically benefit.

---

# Good Prompt Use Cases

Document Servers:

* Format documents
* Summarize content
* Extract action items
* Generate reports

Knowledge Systems:

* Search information
* Explain concepts
* Build study guides

Data Analysis Systems:

* Generate visualizations
* Create reports
* Explain datasets

Prompts are most valuable when they capture domain-specific expertise.

---

# Prompts vs Resources vs Tools

## Resources

Purpose:

Read information.

Examples:

* Documents
* Reports
* Configuration

---

## Tools

Purpose:

Perform actions.

Examples:

* Create files
* Update records
* Send emails

---

## Prompts

Purpose:

Provide structured instructions to the AI.

Examples:

* Format documents
* Summarize content
* Generate reports

---

# MCP Building Blocks

MCP servers generally expose three things:

```text
Resources
    ↓
Information

Tools
    ↓
Actions

Prompts
    ↓
Instructions
```

Together they form the foundation of an MCP-powered application.

---

# Key Takeaways

* Prompts are reusable instruction templates.
* They help users avoid writing prompts from scratch.
* Prompt definitions are registered using @mcp.prompt.
* Prompts can accept parameters.
* Prompts return message objects.
* Multiple messages can be returned.
* The MCP Inspector allows prompt testing.
* Prompts centralize prompt engineering expertise.
* Updating prompts in the server benefits every client automatically.

Interview Summary:

"Prompts in MCP allow server authors to expose reusable, parameterized instruction templates that clients can execute. Unlike resources, which provide data, or tools, which perform actions, prompts provide structured guidance to AI models. They improve consistency, encode domain expertise, and allow prompt engineering improvements to be maintained centrally within the MCP server."
