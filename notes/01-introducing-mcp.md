# Introducing MCP

## What is MCP?

Model Context Protocol (MCP) is a communication layer that allows Claude to interact with external services, data sources, tools, prompts, and resources without requiring developers to manually create and maintain large numbers of tool definitions.

The main goal of MCP is to reduce integration complexity by delegating tool implementation and execution to specialized MCP Servers.

---

## The Problem MCP Solves

Without MCP, developers must:

* Define tool schemas manually.
* Implement functions for each external service.
* Maintain integrations over time.
* Handle API-specific details.

Example:

If an application needs access to GitHub repositories, pull requests, issues, and projects, developers would need to implement dozens or hundreds of tools and maintain them as GitHub evolves.

This creates significant development and maintenance overhead.

---

## MCP Architecture

Basic architecture:

User → Claude → MCP Client → MCP Server → External Service

Components:

### MCP Client

The application that communicates with MCP Servers.

Responsibilities:

* Discover available tools.
* Invoke tools when requested.
* Consume resources and prompts.

### MCP Server

Provides access to external systems through a standardized interface.

Can expose:

* Tools
* Resources
* Prompts

The MCP Server handles the implementation details of the underlying service.

---

## GitHub Example

Without MCP:

Application → GitHub API

Developer must create and maintain all tool definitions.

With MCP:

Application → GitHub MCP Server → GitHub API

The MCP Server already provides standardized tools such as:

* get_repos()
* list_pull_requests()
* get_issues()

The developer only consumes those capabilities.

---

## Tools, Resources and Prompts

### Tools

Executable actions.

Examples:

* Create issue
* Search repository
* Send message

### Resources

Read-only data exposed by a server.

Examples:

* Documentation
* Configuration files
* Repository metadata

### Prompts

Reusable workflows or predefined instructions.

Examples:

* Code review templates
* Documentation generation workflows

---

## Common Misconceptions

### MCP is not the same as Tool Use

Tool Use describes how Claude executes tools.

MCP provides pre-built tools and schemas.

They work together but solve different problems.

---

## Benefits of MCP

* Less boilerplate code
* Faster integrations
* Standardized interfaces
* Easier maintenance
* Reusable tool ecosystems
* Separation of concerns

---

## Key Takeaway

MCP shifts the responsibility of implementing and maintaining integrations from application developers to specialized MCP Servers, allowing developers to focus on building applications rather than maintaining external service integrations.
