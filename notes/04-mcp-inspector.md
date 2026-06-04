# The MCP Inspector

## Overview

The MCP Python SDK includes a built-in browser-based inspector that allows developers to test and debug MCP servers without connecting them to a full client application.

The inspector provides a convenient way to validate tools, resources, prompts, and server behavior during development.

---

## Starting the Inspector

Before launching the inspector, ensure the project's Python environment is activated.

Run:

```bash
mcp dev mcp_server.py
```

This starts a local development server and displays a URL similar to:

```text
http://127.0.0.1:6274
```

Open the URL in a browser to access the MCP Inspector.

---

## Inspector Interface

The inspector UI may change over time because it is actively developed, but the core workflow remains the same.

Typical interface elements include:

* Connect button
* Resources tab
* Tools tab
* Prompts tab
* Tool execution panel
* Server status indicator

Before testing anything, click **Connect**.

Once connected, the status changes from:

```text
Disconnected
```

to:

```text
Connected
```

---

## Listing Available Tools

Navigate to the **Tools** section.

Click:

```text
List Tools
```

The inspector retrieves all tools exposed by the MCP server.

For each tool, the inspector displays:

* Tool name
* Description
* Input parameters
* Execution interface

---

## Testing a Tool

Example workflow using a document reader tool:

1. Select `read_doc_contents`
2. Enter a document ID

```text
deposition.md
```

3. Click **Run Tool**
4. Inspect the returned result

The inspector displays:

* Success or failure status
* Returned data
* Error messages (if any)

This allows rapid validation of tool behavior.

---

## Testing Tool Interactions

One of the most useful features of the inspector is testing multiple tools in sequence.

Example:

1. Run `edit_document`
2. Modify a document
3. Run `read_doc_contents`
4. Verify the modification was applied

Because the inspector keeps the server running between calls, state changes persist during the session.

This makes it possible to test complete workflows without writing additional scripts.

---

## Development Benefits

The MCP Inspector provides a fast feedback loop during development.

Advantages include:

* Rapid testing of new tools
* Validation of input schemas
* Verification of tool outputs
* Testing error conditions
* Debugging stateful workflows
* Exploring resources and prompts
* Avoiding the need for custom test clients

---

## Typical Development Workflow

A common MCP development cycle is:

1. Implement a tool
2. Start the inspector

```bash
mcp dev mcp_server.py
```

3. Connect to the server
4. Test the tool
5. Fix issues
6. Retest immediately

This workflow significantly speeds up MCP server development compared to integrating directly with a full application.

---

## Takeaway

The MCP Inspector is the primary development and debugging tool provided by the MCP Python SDK. It enables developers to test tools, resources, prompts, and stateful interactions directly from a browser, providing immediate feedback while building MCP servers.
