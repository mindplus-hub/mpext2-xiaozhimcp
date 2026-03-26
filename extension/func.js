class func {
    constructor(runtime, extensionId) {
        this.runtime = runtime;
        this.extensionId = extensionId;
        this.toolRegistrations = [];
    }

    initWiFi(generator, block, parameter) {
        let ssid = parameter.SSID.code;
        let password = parameter.PASSWORD.code;

        generator.addInclude('WiFi', 'WiFi.h');
        generator.addObject('wifi_ssid', `const char* WIFI_SSID = ${ssid};`);
        generator.addObject('wifi_pass', `const char* WIFI_PASS = ${password};`);

        generator.addFunction(`void keepWiFiAlive() {
    if (WiFi.status() != WL_CONNECTED) {
      Serial.println("[WiFi] Connecting...");
      WiFi.disconnect();
      WiFi.begin(WIFI_SSID, WIFI_PASS);
      int retry = 0;
      while (WiFi.status() != WL_CONNECTED && retry < 20) {
        delay(500);
        Serial.print(".");
        retry++;
      }
      if (WiFi.status() == WL_CONNECTED) {
        Serial.println("\\n[WiFi] Connected!");
      }
    }
}`);

        generator.addSetup('wifi_init', `keepWiFiAlive();`, 9);
        return '';
    }

    initMCP(generator, block, parameter) {
        let endpoint = parameter.ENDPOINT.code;

        generator.addInclude('WebSocketMCP', 'WebSocketMCP.h');
        generator.addInclude('ArduinoJson', 'ArduinoJson.h');

        generator.addObject('mcp_endpoint', `const char* MCP_ENDPOINT = ${endpoint};`);
        generator.addObject('mcp_client', 'WebSocketMCP mcpClient;');

        generator.addFunction(`void onMcpConnectionChange(bool connected) {
    if (connected) {
      Serial.println("[MCP] Connected!");
      registerAllMcpTools();
    } else {
      Serial.println("[MCP] Disconnected!");
    }
}`);

        generator.addSetup('mcp_init', `mcpClient.begin(MCP_ENDPOINT, onMcpConnectionChange);`, 5);
        return '';
    }

    mcpLoop(generator, block, parameter) {
        if (this.toolRegistrations.length > 0) {
            let registrations = this.toolRegistrations.join('\n\n');
            generator.addFunction(`void registerAllMcpTools() {
    ${registrations}
}`);
            this.toolRegistrations = [];
        }

        return `mcpClient.loop();
    static unsigned long lastWiFiCheck = 0;
    if (millis() - lastWiFiCheck > 10000) {
      keepWiFiAlive();
      lastWiFiCheck = millis();
    }`;
    }

    registerTool(generator, block, parameter) {
        let toolNameRaw = parameter.TOOL_NAME.code;
        let toolName = toolNameRaw.replace(/["']/g, '');
        let description = parameter.DESCRIPTION.code;

        generator.addObject('mcp_globals', `String mcp_current_args = "";\nString mcp_return_value = "{}";`);

        let funcName = `onMcpTool_${toolName.replace(/[^a-zA-Z0-9_]/g, '_')}`;

        this.toolRegistrations.push(`// 注册：${toolName}
    mcpClient.registerTool(${toolNameRaw}, ${description}, R"json({"type":"object","properties":{}})json", [](const String& args) -> WebSocketMCP::ToolResponse {
        mcp_current_args = args;
        mcp_return_value = "{}";
        ${funcName}();
        return WebSocketMCP::ToolResponse(mcp_return_value);
    });`);

        return '';
    }

    mcpAcceptTool(generator, block, parameter) {
        let toolName = parameter.TOOL_NAME.code.replace(/["']/g, '');
        let funcName = `onMcpTool_${toolName.replace(/[^a-zA-Z0-9_]/g, '_')}`;

        return `void ${funcName}() \n`;
    }

    mcpReturnResult(generator, block, parameter) {
        let key = parameter.KEY.code.replace(/["']/g, '');
        let value = parameter.VALUE.code;

        return `{
    StaticJsonDocument<200> doc;
    doc["${key}"] = ${value};
    serializeJson(doc, mcp_return_value);
}\n`;
    }

}

export default func;
