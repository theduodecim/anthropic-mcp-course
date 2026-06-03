# MCP Clients

## What is an MCP Client?

The MCP Client acts as the communication bridge between an application and one or more MCP Servers.

Its purpose is to handle all protocol communication so that the application can focus on business logic instead of managing server interactions directly.

The client is responsible for:

* Discovering available tools.
* Calling tools.
* Accessing resources.
* Using prompts exposed by MCP Servers.
* Managing protocol communication.

---

## Transport Agnostic Design

One of MCP's core features is that it is transport agnostic.

This means the protocol does not depend on a specific communication method.

Common transport options include:

* Standard Input / Output (stdio)
* HTTP
* WebSockets
* Other network protocols

The same MCP Client can communicate with MCP Servers using different transports without changing the application logic.

---

## MCP Communication Model

Application
↓
MCP Client
↓
MCP Server
↓
External Service

The MCP Client hides communication details from the application.

The application only needs to request tools or resources through the client.

---

## Main Message Types

### ListToolsRequest

Used when the client wants to know which tools are available.

Example:

Client → Server

"Which tools do you provide?"

---

### ListToolsResult

Response containing all available tools exposed by the MCP Server.

Example:

Server → Client

* get_repos
* get_pull_requests
* get_issues

---

### CallToolRequest

Used when the client wants the server to execute a specific tool.

Includes:

* Tool name
* Arguments

Example:

Call get_repos(user="juan")

---

### CallToolResult

Contains the result produced by the tool execution.

Example:

* Repo A
* Repo B
* Repo C

---

## Example Flow: GitHub Repositories

User question:

"What repositories do I have?"

### Step 1

The user sends a request to the application.

---

### Step 2

The application asks the MCP Client for available tools.

---

### Step 3

The MCP Client sends a ListToolsRequest to the MCP Server.

---

### Step 4

The MCP Server responds with a ListToolsResult.

Available tools might include:

* get_repos
* get_issues
* get_pull_requests

---

### Step 5

The application sends the user question and tool definitions to Claude.

---

### Step 6

Claude decides that it needs to call get_repos().

---

### Step 7

The application instructs the MCP Client to execute the tool.

---

### Step 8

The MCP Client sends a CallToolRequest to the MCP Server.

---

### Step 9

The MCP Server performs the actual GitHub API request.

---

### Step 10

GitHub returns repository information.

---

### Step 11

The MCP Server returns a CallToolResult to the MCP Client.

---

### Step 12

The application sends the tool result back to Claude.

---

### Step 13

Claude generates a natural language response using the repository data.

---

### Step 14

The application returns the final answer to the user.

---

## Why Use MCP Clients?

Without an MCP Client:

* Applications must implement communication logic.
* Tool discovery becomes manual.
* Protocol handling increases complexity.

With an MCP Client:

* Tool discovery is automatic.
* Communication is standardized.
* External services become easier to integrate.
* Application code remains simpler.

---

## Key Takeaway

The MCP Client is the intermediary between applications and MCP Servers.

It discovers available tools, executes tool requests, receives results, and hides protocol complexity from the application, allowing developers to focus on application behavior rather than integration details.
