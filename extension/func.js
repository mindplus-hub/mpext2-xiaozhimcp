const MCP_GLOBALS_AND_HELPERS = `String mcp_current_args = "";
String mcp_return_value = "{}";
StaticJsonDocument<1024> _mcpDoc;

void _mcpParse() {
  _mcpDoc.clear();
  deserializeJson(_mcpDoc, mcp_current_args);
}
String _mcpGetStr(const char* k) {
  const char* val = _mcpDoc[k] | "";
  return String(val);
}
float _mcpGetNum(const char* k) {
  return _mcpDoc[k] | 0.0f;
}
bool _mcpGetBool(const char* k) {
  return _mcpDoc[k] | false;
}`;

class func {
    constructor(runtime, extensionId) {
        this.runtime = runtime;
        this.extensionId = extensionId;
        this.toolRegistrations = new Map();  // key: toolName，防止多次遍历导致重复
        this.pendingParamsByTool = new Map();
        this.lastParamToolName = '';
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
        if (this.toolRegistrations.size > 0) {
            let registrations = [...this.toolRegistrations.values()].join('\n\n');
            generator.addFunction(`void registerAllMcpTools() {
    ${registrations}
}`);
            this.toolRegistrations.clear();
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

        generator.addObject('mcp_globals', MCP_GLOBALS_AND_HELPERS);

        // 从当前工具的参数缓存构建 JSON Schema
        let properties = {};
        let required = [];
        let toolParams = this.pendingParamsByTool.get(toolName) || [];
        for (let p of toolParams) {
            let propDef = { type: p.type };
            if (p.title) propDef.title = p.title;
            if (p.desc) propDef.description = p.desc;
            if (p.enum && p.enum.length > 0) propDef.enum = p.enum;
            properties[p.name] = propDef;
            required.push(p.name);
        }
        this.pendingParamsByTool.delete(toolName);
        let schemaObj = { properties, required, type: 'object' };
        let schema = JSON.stringify(schemaObj);

        let funcName = `onMcpTool_${toolName.replace(/[^a-zA-Z0-9_]/g, '_')}`;

        this.toolRegistrations.set(toolName, `// 注册：${toolName}
    mcpClient.registerTool(${toolNameRaw}, ${description}, R"json(${schema})json", [](const String& args) -> WebSocketMCP::ToolResponse {
        mcp_current_args = args;
        mcp_return_value = "{}";
        _mcpParse();
        ${funcName}();
        return WebSocketMCP::ToolResponse(mcp_return_value);
    });`);

        return '';
    }

    addToolParam(generator, block, parameter) {
        let toolNameCode = parameter.TOOL_NAME ? parameter.TOOL_NAME.code : '""';
        let toolName = toolNameCode.replace(/["']/g, '');
        let name = parameter.PARAM_NAME.code.replace(/["']/g, '');
        let title = parameter.PARAM_TITLE.code.replace(/["']/g, '');
        let type = parameter.PARAM_TYPE.code.replace(/["']/g, '');  // 'string' | 'number' | 'boolean'
        let desc = parameter.PARAM_DESC.code.replace(/["']/g, '');

        if (!toolName) {
            return '';
        }

        this.lastParamToolName = toolName;
        let params = this.pendingParamsByTool.get(toolName) || [];

        // 用 name 去重，同一参数多次遍历只保留最后一次
        let idx = params.findIndex(p => p.name === name);
        if (idx >= 0) {
            params[idx] = { name, title, type, desc, enum: params[idx].enum };
        } else {
            params.push({ name, title, type, desc, enum: [] });
        }
        this.pendingParamsByTool.set(toolName, params);
        return '';
    }

    addToolParamChoices(generator, block, parameter) {
        let choices = parameter.CHOICES.code.replace(/["']/g, '');
        let params = this.pendingParamsByTool.get(this.lastParamToolName) || [];
        if (params.length > 0) {
            let last = params[params.length - 1];
            last.enum = choices.split(',').map(s => s.trim()).filter(s => s.length > 0);
            this.pendingParamsByTool.set(this.lastParamToolName, params);
        }
        return '';
    }

    getMcpString(generator, block, parameter) {
        let key = parameter.KEY.code.replace(/["']/g, '');
        generator.addObject('mcp_globals', MCP_GLOBALS_AND_HELPERS);
        return `_mcpGetStr("${key}")`;
    }

    getMcpNumber(generator, block, parameter) {
        let key = parameter.KEY.code.replace(/["']/g, '');
        generator.addObject('mcp_globals', MCP_GLOBALS_AND_HELPERS);
        return `_mcpGetNum("${key}")`;
    }

    getMcpBool(generator, block, parameter) {
        let key = parameter.KEY.code.replace(/["']/g, '');
        generator.addObject('mcp_globals', MCP_GLOBALS_AND_HELPERS);
        return `_mcpGetBool("${key}")`;
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
