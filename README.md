# Xiaozhi MCP Client (小智 MCP 客户端)

![Xiaozhi MCP Client Cover](extension/public/cover.png)

## Introduction

Mind+ upload mode extension that enables boards to act as an MCP (Model Context Protocol) client for the Xiaozhi AI service. It connects via WebSocket and supports registering sensor tools that Xiaozhi can call.

- Extension ID: xiaozhimcp
- Version: 0.0.2
- Author: Nick
- Mode: Upload Mode (upload)

## Version History

| Version | Date | Changes |
| --- | --- | --- |
| 0.0.2 | 2026-04-13 | Add tool parameter declaration blocks (addToolParam, addToolParamChoices); Add MCP argument read blocks (getMcpString, getMcpNumber, getMcpBool); Fix duplicate tool registration; Fix ArduinoJson string parsing |
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
| addToolParam | Add Parameter [PARAM_NAME] Title[PARAM_TITLE] Type[PARAM_TYPE] Desc[PARAM_DESC] | 添加参数 [PARAM_NAME] 标题[PARAM_TITLE] 类型[PARAM_TYPE] 说明[PARAM_DESC] |
| addToolParamChoices | Set Last Param Choices [CHOICES] | 设置上一参数可选值 [CHOICES] |
| mcpAcceptTool | When MCP receives tool call [TOOL_NAME] | 当 MCP 接收到工具 [TOOL_NAME] 调用时 |
| getMcpString | Get MCP string param [KEY] | 获取 MCP 字符串参数 [KEY] |
| getMcpNumber | Get MCP number param [KEY] | 获取 MCP 数量参数 [KEY] |
| getMcpBool | Get MCP boolean param [KEY] | 获取 MCP 开关参数 [KEY] |
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

#### Add Parameter [PARAM_NAME] Title[PARAM_TITLE] Type[PARAM_TYPE] Desc[PARAM_DESC]
Declares a parameter for the **next** `Register Tool` block. Place one or more of these blocks immediately before `Register Tool`. The parameter information is used to build the JSON Schema that tells the AI what arguments to provide.
- `PARAM_NAME`: The parameter key name (used in code to read the value)
- `PARAM_TITLE`: A human-readable title for the parameter
- `PARAM_TYPE`: The data type — `string`, `number`, or `boolean`
- `PARAM_DESC`: A description of what the parameter means

#### Set Last Param Choices [CHOICES]
Sets an `enum` (allowed values list) on the most recently declared parameter. Place immediately after `Add Parameter`.
- `CHOICES`: Comma-separated list of allowed values (e.g., `on,off,blink,flow`)

#### Register Tool [TOOL_NAME] Description [DESCRIPTION]
Registers a new tool that the AI can call. Place after all `Add Parameter` blocks for this tool.
- `TOOL_NAME`: The identifier for the tool
- `DESCRIPTION`: A description of what the tool does (helps the AI understand when to call it)

#### When MCP receives tool call [TOOL_NAME]
An event block (Hat block) that triggers when the AI decides to use the registered tool.
- `TOOL_NAME`: The identifier for the tool being called

#### Get MCP string param [KEY]
Reporter block. Returns the string value of a named argument passed by the AI in the current tool call.
- `KEY`: The parameter name to read

#### Get MCP number param [KEY]
Reporter block. Returns the numeric (float) value of a named argument passed by the AI.
- `KEY`: The parameter name to read

#### Get MCP boolean param [KEY]
Boolean block. Returns `true`/`false` for a named argument passed by the AI.
- `KEY`: The parameter name to read

#### Return MCP result [KEY] : [VALUE]
Sends data back to the AI after a tool has been executed. This must be used inside the "When MCP receives tool call" block.
- `KEY`: The JSON key for the return data
- `VALUE`: The corresponding value to return

## Usage Example

```
Add Parameter "state"  Title["LED状态"] Type[string]  Desc["LED mode"]
Set Last Param Choices "on,off,blink,flow"
Register Tool "led_control"  Description[...]

When MCP receives tool call "led_control"
  → if (Get MCP string param "state") == "on"  →  turn on LED
  → Return MCP result "result" : "done"
```
