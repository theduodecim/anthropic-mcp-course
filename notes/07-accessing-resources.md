# Accessing Resources in MCP

## Overview

Resources allow MCP servers to expose information that can be directly included in prompts.

Unlike tools, resources are designed for data retrieval rather than action execution.

This creates a more efficient workflow because the information can be loaded into the model's context before the conversation is processed.

---

# Why Resources Matter

Without resources:

```text
User
  ↓
Claude
  ↓
Tool Call
  ↓
Server
  ↓
Response
  ↓
Claude
```

With resources:

```text
User
  ↓
Application
  ↓
Resource Request
  ↓
Server
  ↓
Resource Content
  ↓
Claude
```

The content is available immediately in the prompt.

This reduces latency and avoids unnecessary tool calls.

---

# Resource Mention Workflow

Example:

```text
What's in @report.pdf?
```

The application detects the resource reference.

Workflow:

1. User mentions a resource
2. Application detects the "@"
3. Client requests the resource
4. MCP server returns the content
5. Content is injected into the prompt
6. Prompt is sent to Claude
7. Claude answers immediately

The model already has the document content available.

No tool execution is required.

---

# Required Imports

To implement resource reading, add:

```python
import json
from pydantic import AnyUrl
```

Purpose:

* json → Parse JSON resources
* AnyUrl → Validate MCP resource URIs

---

# Implementing read_resource()

Core implementation:

```python
async def read_resource(self, uri: str) -> Any:
    result = await self.session().read_resource(
        AnyUrl(uri)
    )

    resource = result.contents[0]

    if isinstance(
        resource,
        types.TextResourceContents
    ):
        if resource.mimeType == "application/json":
            return json.loads(resource.text)

    return resource.text
```

This method retrieves a resource from the MCP server and converts it into a usable Python object.

---

# Step-by-Step Breakdown

## Step 1

Request the resource.

```python
result = await self.session().read_resource(
    AnyUrl(uri)
)
```

The client sends a ReadResourceRequest to the MCP server.

---

## Step 2

Get the returned content.

```python
resource = result.contents[0]
```

The server response contains a contents list.

Most requests return a single resource, so we access the first element.

---

## Step 3

Check the resource type.

```python
isinstance(
    resource,
    types.TextResourceContents
)
```

Determines whether the resource contains text data.

---

## Step 4

Inspect the MIME type.

```python
resource.mimeType
```

The MIME type tells us how to process the content.

---

## Step 5

Parse JSON resources.

```python
json.loads(resource.text)
```

Converts JSON text into a Python dictionary or list.

Example:

```json
{
  "name": "report.pdf",
  "pages": 12
}
```

becomes:

```python
{
  "name": "report.pdf",
  "pages": 12
}
```

---

## Step 6

Return plain text resources.

```python
return resource.text
```

If the content is not JSON, return it as a string.

---

# Understanding the Response Structure

A resource response typically contains:

```text
ReadResourceResult
│
├── contents
│    ├── resource
│
├── mimeType
│
└── metadata
```

Important fields:

## Content

The actual resource data.

Example:

```text
Annual sales report...
```

---

## MIME Type

Describes the data format.

Examples:

```text
application/json
```

```text
text/plain
```

```text
application/pdf
```

---

## Metadata

Additional information about the resource.

May include:

* URI
* Resource name
* Type information

---

# Handling Different Resource Types

## JSON Resources

Example MIME type:

```text
application/json
```

Processing:

```python
json.loads(resource.text)
```

Result:

```python
dict
```

or

```python
list
```

---

## Plain Text Resources

Example MIME type:

```text
text/plain
```

Processing:

```python
return resource.text
```

Result:

```python
str
```

---

# Testing Resource Access

After implementing the client method, run the application.

Example interaction:

```text
What is in @report.pdf?
```

The system will:

1. Detect the resource reference
2. Display matching resources
3. Allow selection through autocomplete
4. Fetch resource content
5. Inject content into the prompt
6. Send everything to Claude

---

# Autocomplete Experience

Resources can power document mention systems.

Example:

User types:

```text
@
```

Application displays:

```text
report.pdf
meeting_notes.txt
sales_data.json
```

The user selects a resource.

The content is automatically loaded.

This creates a workflow similar to mentioning files in modern productivity tools.

---

# Resources vs Tools

## Resources

Purpose:

Read information

Examples:

* Documents
* Configuration
* Reports
* Knowledge base entries

Characteristics:

✅ Fast

✅ Read-only

✅ Included directly in prompts

---

## Tools

Purpose:

Execute actions

Examples:

* Create files
* Update records
* Send emails
* Query databases

Characteristics:

✅ Action-oriented

✅ Executed by Claude

✅ May modify state

---

# Benefits of Resource Access

Advantages:

* Faster responses
* Fewer tool calls
* Simpler architecture
* Better user experience
* Direct context injection

Resources are especially useful when the AI needs information immediately rather than having to retrieve it dynamically.

---

# Key Takeaways

* Resources provide information directly to prompts.
* The client accesses resources through read_resource().
* Resources are requested using URIs.
* ReadResourceResult contains the returned content.
* MIME types determine how content should be parsed.
* JSON resources should be converted into Python objects.
* Plain text resources can be returned directly.
* Resource mentions enable document-style workflows.
* Resources often eliminate the need for separate tool calls.

Interview Summary:

"Accessing resources in MCP allows applications to retrieve information directly from an MCP server and inject it into prompts before sending them to an AI model. The client uses read_resource() to request data by URI, then processes the response according to its MIME type. This approach improves performance and user experience by making context available immediately without requiring additional tool execution."
