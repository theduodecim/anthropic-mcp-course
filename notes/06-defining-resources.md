# Defining Resources in MCP

## Overview

Resources in MCP allow servers to expose data to clients.

Think of resources as the equivalent of HTTP GET endpoints:

* Tools = perform actions
* Resources = fetch information

Resources are ideal when clients need to read data without triggering actions or workflows.

---

# Example: Document Mentions

Imagine building a feature where users can mention documents using:

```text
@document_name
```

This requires two capabilities:

1. List available documents
2. Retrieve the contents of a specific document

Example workflow:

User writes:

```text
Summarize @report.pdf
```

The application:

1. Detects the document mention
2. Fetches the document content through MCP resources
3. Injects the content into the prompt
4. Sends the enriched prompt to Claude

Claude can now answer without needing to call a tool.

---

# How Resources Work

Resources follow a request-response model.

The client requests a resource by URI.

The server processes the request and returns data.

Flow:

```text
Application
    ↓
MCP Client
    ↓
ReadResourceRequest
    ↓
MCP Server
    ↓
Resource Function
    ↓
ReadResourceResult
    ↓
MCP Client
    ↓
Application
```

Resources are identified by URIs.

---

# Types of Resources

There are two main resource types.

## 1. Direct Resources

Direct resources use fixed URIs.

Best for:

* Lists
* Static information
* Endpoints without parameters

Example:

```python
@mcp.resource(
    "docs://documents",
    mime_type="application/json"
)
def list_docs() -> list[str]:
    return list(docs.keys())
```

URI:

```text
docs://documents
```

Characteristics:

* Static URI
* No parameters
* Always returns the same type of data

---

## 2. Templated Resources

Templated resources contain variables inside the URI.

Best for:

* Fetching specific records
* Dynamic content
* Parameterized requests

Example:

```python
@mcp.resource(
    "docs://documents/{doc_id}",
    mime_type="text/plain"
)
def fetch_doc(doc_id: str) -> str:
    if doc_id not in docs:
        raise ValueError(
            f"Doc with id {doc_id} not found"
        )

    return docs[doc_id]
```

Example URI:

```text
docs://documents/report.pdf
```

The SDK automatically extracts:

```python
doc_id = "report.pdf"
```

and passes it to the function.

No manual URI parsing is required.

---

# MIME Types

Resources can return many different formats.

The mime_type parameter tells clients what type of data is being returned.

Common examples:

```text
application/json
```

Structured JSON data.

```text
text/plain
```

Plain text.

```text
application/pdf
```

Binary PDF files.

```text
image/png
```

Images.

Using the correct MIME type helps clients understand how to process the response.

---

# Automatic Serialization

The MCP Python SDK automatically serializes returned data.

You do not need to manually convert objects to JSON.

Example:

```python
return {
    "name": "report.pdf",
    "size": 1024
}
```

The SDK automatically converts the object into the proper response format.

This reduces boilerplate code and simplifies development.

---

# Testing Resources

Launch the MCP Inspector:

```bash
uv run mcp dev mcp_server.py
```

Open the Inspector in your browser.

You will see two sections:

## Resources

Displays all direct/static resources.

Examples:

```text
docs://documents
```

---

## Resource Templates

Displays all templated resources.

Examples:

```text
docs://documents/{doc_id}
```

For templated resources, you can provide parameter values and test different requests.

---

# What the Inspector Shows

The Inspector displays:

* Resource URI
* MIME type
* Serialized response
* Response structure

This makes debugging much easier because you can see exactly what clients will receive.

---

# Resources vs Tools

Resources:

✅ Read data

✅ Retrieve information

✅ Similar to HTTP GET requests

✅ No actions performed

Examples:

* List documents
* Read a document
* Fetch configuration data

Tools:

✅ Perform actions

✅ Execute logic

✅ May modify state

Examples:

* Create a document
* Delete a file
* Send an email
* Update a database record

---

# Key Takeaways

* Resources expose read-only data from an MCP server.
* Resources are identified using URIs.
* Clients request resources through ReadResourceRequest.
* Direct resources use static URIs.
* Templated resources use parameterized URIs.
* The SDK automatically parses URI parameters.
* The SDK automatically serializes returned objects.
* MIME types describe the format of returned data.
* Resources are best for fetching information, while tools are best for performing actions.

Interview Summary:

"Resources in MCP provide a standardized way to expose data from a server. They operate through URI-based requests and are similar to HTTP GET endpoints. Direct resources use static URIs, while templated resources support parameters. The MCP SDK handles URI parsing and serialization automatically, making resources an efficient mechanism for exposing read-only information to clients."
