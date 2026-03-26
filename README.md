# Xiaozhi MCP Client (小智 MCP 客户端)

![Xiaozhi MCP Client Cover](extension/public/cover.png)

## Introduction

Mind+ upload mode extension that enables boards to act as an MCP (Model Context Protocol) client for the Xiaozhi AI service. It connects via WebSocket and supports registering sensor tools that Xiaozhi can call.

- Extension ID: xiaozhimcp
- Version: 0.0.1
- Author: Nick
- Mode: Upload Mode (upload)

## Version History

| Version | Date | Changes |
| --- | --- | --- |
| 0.0.1 | 2026-03-26 | Initial release |

## Compatible Hardware

| Device | Support |
| --- | --- |
| UNIHIKER K10 Board (dev-DFRobot-unihikerK10) | ✓ |
| FireBeetle ESP32 (dev-DFRobot-firebeetleEsp32) | ✓ |
| FireBeetle ESP32-E (dev-DFRobot-firebeetleEsp32E) | ✓ |
| FireBeetle ESP8266 (dev-DFRobot-firebeetleEsp8266) | ✓ |
| Handcraft ESP32 (dev-DFRobot-handpyEsp32) | ✓ |

> This extension requires a WiFi network connection to connect to the MCP server.

## Feature Overview

Provides the following block capabilities for WebSocket MCP communication:

| opcode | Description (EN) | Description (ZH) |
| --- | --- | --- |
| initWiFi | Initialize WiFi SSID [SSID] Password [PASSWORD] | 初始化 WiFi 名称[SSID] 密码[PASSWORD] |
| initMCP | Initialize MCP Connection Endpoint [ENDPOINT] | 初始化 MCP 连接 端点[ENDPOINT] |
| mcpLoop | Maintain MCP Connection | 保持 MCP 连接 |
| registerTool | Register Tool [TOOL_NAME] Description [DESCRIPTION] | 注册工具 [TOOL_NAME] 描述[DESCRIPTION] |
| mcpAcceptTool | When MCP receives tool call [TOOL_NAME] | 当 MCP 接收到工具 [TOOL_NAME] 调用时 |
| mcpReturnResult | Return MCP result [KEY] : [VALUE] | 返回 MCP 结果 [KEY]的值为 [VALUE] |

## Dependencies

This extension depends on the following Arduino libraries:
- **WiFi**: WiFi connection
- **WebSocketMCP**: WebSocket client for MCP protocol
- **ArduinoJson**: JSON parsing and serialization library

## Block Description

### Initialization

#### Initialize WiFi SSID [SSID] Password [PASSWORD]
Configure and maintain a WiFi connection. Automatically attempts to reconnect if the connection drops.
- `SSID`: The name of the WiFi network
- `PASSWORD`: The WiFi password

#### Initialize MCP Connection Endpoint [ENDPOINT]
Set up the WebSocket connection to the MCP server. Automatically registers all tools once connected.
- `ENDPOINT`: The WebSocket URL for the MCP server (e.g., `wss://api.xiaozhi.me/mcp/?token=your_token`)

### Main Loop

#### Maintain MCP Connection
Must be placed in the main execution sequence to keep the WebSocket connection alive and process incoming messages. It also continuously checks the WiFi status.

### Tool Registration & Handling

#### Register Tool [TOOL_NAME] Description [DESCRIPTION]
Registers a new tool that the AI can call.
- `TOOL_NAME`: The identifier for the tool
- `DESCRIPTION`: A description of what the tool does (helps the AI understand when to call it)

#### When MCP receives tool call [TOOL_NAME]
An event block (Hat block) that triggers when the AI decides to use the registered tool.
- `TOOL_NAME`: The identifier for the tool being called

#### Return MCP result [KEY] : [VALUE]
Sends data back to the AI after a tool has been executed. This must be used inside the "When MCP receives tool call" block.
- `KEY`: The JSON key for the return data
- `VALUE`: The corresponding value to return
