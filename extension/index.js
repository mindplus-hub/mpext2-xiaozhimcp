import ArgumentType from '../utils/argument-type';
import BlockType from '../utils/block-type';
import DataType from '../utils/data-type';
import Func from './func';
import { setLocaleData, formatMessage, setLocale } from '../utils/translation';
import LocaleData from './locales';
import menuIconURI from './icon/menuIcon.svg';
import blockIconURI from './icon/blockIcon.svg';

setLocaleData(LocaleData);

class XiaozhiMCPExtension {
    constructor(runtime, extensionId) {
        this.runtime = runtime;
        this.funcs = new Func(runtime, extensionId);
    }

    setLocale(locale) {
        setLocale(locale);
    }

    getCodePrimitives() {
        return this.funcs;
    }

    getInfo() {
        return {
            name: formatMessage({
                id: 'extension.name',
                default: 'Xiaozhi MCP Client'
            }),
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blockIconWidth: 45,
            blockIconHeight: 45,
            color1: '#4A90D9',
            color2: '#3672B9',
            color3: '#5BA0E9',
            blocks: [
                // WiFi 初始化
                {
                    opcode: 'initWiFi',
                    text: formatMessage({
                        id: 'gui.blocklyText.xiaozhiMcp.initWiFi',
                        default: 'Initialize WiFi SSID[SSID] Password[PASSWORD]'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        SSID: {
                            type: ArgumentType.STRING,
                            inputParams: { symbol: '""' },
                            defaultValue: 'ssid'
                        },
                        PASSWORD: {
                            type: ArgumentType.STRING,
                            inputParams: { symbol: '""' },
                            defaultValue: 'password'
                        }
                    }
                },
                // MCP 初始化
                {
                    opcode: 'initMCP',
                    text: formatMessage({
                        id: 'gui.blocklyText.xiaozhiMcp.initMCP',
                        default: 'Initialize MCP Connection Endpoint[ENDPOINT]'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ENDPOINT: {
                            type: ArgumentType.TEXTAREA,
                            inputParams: {
                                inputValue: "",
                                color: "#2792c0",
                            },
                            defaultValue: 'wss://api.xiaozhi.me/mcp/?token=your_token',
                            inputTypes: [DataType.STRING],
                        }
                    }
                },

                // 维持 MCP 连接
                {
                    opcode: 'mcpLoop',
                    text: formatMessage({
                        id: 'gui.blocklyText.xiaozhiMcp.mcpLoop',
                        default: 'Maintain MCP Connection'
                    }),
                    blockType: BlockType.COMMAND
                },
                '---',
                // 注册工具
                {
                    opcode: 'registerTool',
                    text: formatMessage({
                        id: 'gui.blocklyText.xiaozhiMcp.registerTool',
                        default: 'Register Tool [TOOL_NAME] Description[DESCRIPTION]'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TOOL_NAME: {
                            type: ArgumentType.STRING,
                            inputParams: { symbol: '""' },
                            defaultValue: 'my_tool'
                        },
                         DESCRIPTION: {
                            type: ArgumentType.TEXTAREA,
                            inputParams: {
                                inputValue: "",
                                color: "#2792c0",
                            },
                            inputTypes: [DataType.STRING],
                        }
                    }
                },
                // 为下一次注册工具声明参数
                {
                    opcode: 'addToolParam',
                    text: formatMessage({
                        id: 'gui.blocklyText.xiaozhiMcp.addToolParam',
                        default: 'Add Parameter To [TOOL_NAME] Name[PARAM_NAME] Title[PARAM_TITLE] Type[PARAM_TYPE] Desc[PARAM_DESC]'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TOOL_NAME: {
                            type: ArgumentType.STRING,
                            inputParams: { symbol: '""' },
                            defaultValue: 'my_tool'
                        },
                        PARAM_NAME: {
                            type: ArgumentType.STRING,
                            inputParams: { symbol: '""' },
                            defaultValue: 'state'
                        },
                        PARAM_TITLE: {
                            type: ArgumentType.STRING,
                            inputParams: { symbol: '""' },
                            defaultValue: ''
                        },
                        PARAM_TYPE: {
                            type: ArgumentType.STRING,
                            menu: 'mcpParamType',
                            defaultValue: 'string'
                        },
                        PARAM_DESC: {
                            type: ArgumentType.STRING,
                            inputParams: { symbol: '""' },
                            defaultValue: ''
                        }
                    }
                },
                // // 为上一个参数设置可选值（enum）
                // {
                //     opcode: 'addToolParamChoices',
                //     text: formatMessage({
                //         id: 'gui.blocklyText.xiaozhiMcp.addToolParamChoices',
                //         default: 'Set Last Param Choices [CHOICES]'
                //     }),
                //     blockType: BlockType.COMMAND,
                //     arguments: {
                //         CHOICES: {
                //             type: ArgumentType.STRING,
                //             inputParams: { symbol: '""' },
                //             defaultValue: 'on,off,blink,flow'
                //         }
                //     }
                // },
                {

                    opcode: 'mcpAcceptTool',
                    text: formatMessage({
                        id: 'gui.blocklyText.xiaozhiMcp.mcpAcceptTool',
                        default: 'When MCP receives tool call [TOOL_NAME]'
                    }),
                    blockType: BlockType.HAT,
                    arguments: {
                        TOOL_NAME: {
                            type: ArgumentType.STRING,
                            inputParams: { symbol: '""' },
                            defaultValue: 'my_tool'
                        }
                    }
                },
                '---',
                // 读取 MCP 传入的参数值
                {
                    opcode: 'getMcpString',
                    text: formatMessage({
                        id: 'gui.blocklyText.xiaozhiMcp.getMcpString',
                        default: 'Get MCP string param [KEY]'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            inputParams: { symbol: '""' },
                            defaultValue: 'state'
                        }
                    }
                },
                {
                    opcode: 'getMcpNumber',
                    text: formatMessage({
                        id: 'gui.blocklyText.xiaozhiMcp.getMcpNumber',
                        default: 'Get MCP number param [KEY]'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            inputParams: { symbol: '""' },
                            defaultValue: 'state'
                        }
                    }
                },
                {
                    opcode: 'getMcpBool',
                    text: formatMessage({
                        id: 'gui.blocklyText.xiaozhiMcp.getMcpBool',
                        default: 'Get MCP boolean param [KEY]'
                    }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            inputParams: { symbol: '""' },
                            defaultValue: 'state'
                        }
                    }
                },
                '---',
                {
                    opcode: 'mcpReturnResult',
                    text: formatMessage({
                        id: 'gui.blocklyText.xiaozhiMcp.mcpReturnResult',
                        default: 'Return MCP result [KEY] : [VALUE]'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            inputParams: { symbol: '""' },
                            defaultValue: 'result'
                        },
                        VALUE: {
                            type: ArgumentType.STRING,
                            inputParams: { symbol: '""' },
                            defaultValue: 'status'
                        }
                    }
                }
            ],
            menus: {
                mcpParamType: [
                    {
                        text: formatMessage({ id: 'gui.blocklyText.xiaozhiMcp.paramType.string', default: 'String' }),
                        value: 'string'
                    },
                    {
                        text: formatMessage({ id: 'gui.blocklyText.xiaozhiMcp.paramType.number', default: 'Number' }),
                        value: 'number'
                    },
                    {
                        text: formatMessage({ id: 'gui.blocklyText.xiaozhiMcp.paramType.boolean', default: 'Boolean' }),
                        value: 'boolean'
                    }
                ]
            }
        };
    }
}

export default XiaozhiMCPExtension;
