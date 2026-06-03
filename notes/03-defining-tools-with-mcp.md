# Defining Tools with MCP

## Overview

The official MCP Python SDK simplifies tool creation by allowing developers to define tools using Python functions and decorators instead of manually writing JSON schemas.

Using type hints and Pydantic field descriptions, the SDK automatically generates the tool schema required by MCP clients such as Claude.

---

## Creating an MCP Server

A server can be initialized with a single line:

```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("DocumentMCP", log_level="ERROR")
```

The server name identifies the MCP server, while optional parameters such as `log_level` control runtime behavior.

---

## Example Data Store

In this example, documents are stored in memory using a Python dictionary:

```python
docs = {
    "deposition.md": "This deposition covers the testimony of Angela Smith, P.E.",
    "report.pdf": "The report details the state of a 20m condenser tower.",
    "financials.docx": "These financials outline the project's budget and expenditures",
    "outlook.pdf": "This document presents the projected future performance of the system",
    "plan.md": "The plan outlines the steps for the project's implementation.",
    "spec.txt": "These specifications define the technical requirements for the equipment"
}
```

Document IDs act as keys, while document contents are stored as values.

---

## Defining Tools with Decorators

The `@mcp.tool()` decorator registers a Python function as an MCP tool.

The decorator defines:

* Tool name
* Tool description

Function parameters define:

* Input arguments
* Types
* Validation rules
* Parameter descriptions

The SDK automatically converts this information into the schema exposed to MCP clients.

---

## Read Document Tool

Example tool for reading document contents:

```python
@mcp.tool(
    name="read_doc_contents",
    description="Read the contents of a document and return it as a string."
)
def read_document(
    doc_id: str = Field(description="Id of the document to read")
):
    if doc_id not in docs:
        raise ValueError(f"Doc with id {doc_id} not found")

    return docs[doc_id]
```

### Key points

* `doc_id` is required.
* `Field()` provides metadata for the parameter.
* The SDK generates the corresponding MCP schema automatically.
* Errors can be handled using standard Python exceptions.

---

## Edit Document Tool

Example tool for updating document contents using a find-and-replace operation:

```python
@mcp.tool(
    name="edit_document",
    description="Edit a document by replacing a string in the documents content with a new string."
)
def edit_document(
    doc_id: str = Field(description="Id of the document that will be edited"),
    old_str: str = Field(description="The text to replace. Must match exactly, including whitespace."),
    new_str: str = Field(description="The new text to insert in place of the old text.")
):
    if doc_id not in docs:
        raise ValueError(f"Doc with id {doc_id} not found")

    docs[doc_id] = docs[doc_id].replace(old_str, new_str)
```

### Key points

* Receives the target document ID.
* Finds the exact text specified by `old_str`.
* Replaces it with `new_str`.
* Updates the document in memory.
* Uses standard Python error handling.

---

## Why Use the MCP Python SDK?

Compared to manually writing tool schemas, the SDK provides several advantages:

* No manual JSON schema creation.
* Automatic schema generation from Python type hints.
* Built-in validation through Pydantic.
* Cleaner and more maintainable code.
* Easier error handling using Python exceptions.
* Automatic tool registration through decorators.

---

## Takeaway

The MCP Python SDK turns tool development into a standard Python programming task. Developers define normal Python functions, annotate parameters with types and descriptions, and the SDK handles schema generation and tool registration automatically.

This significantly reduces boilerplate and makes MCP servers easier to build, maintain, and extend.
