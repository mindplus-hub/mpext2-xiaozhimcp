/**
 * data type for input or boolean/reporter block
 * @enum {string}
 */
const DataType = {
    /**
     * 数字类型
     */
    INT32_T: 'int32_t',

    /**
     * 数字类型
     */
    UINT32_T: 'uint32_t',
    /**
     * 字符类型
     */
    STRING: 'string',

    /**
     * 浮点类型
     */
    FLOAT: 'float',

    /**
     * 布尔类型
     */
    BOOL: 'bool',

    /**
     * 空类型
     */
    VOID: 'void',

    /**
     * void*
     */
    VOIDX: 'void*',

    /**
     * 颜色
     */
    COLOR: 'color',

    /**
     * 表情
     */
    EXPRESSION: 'expression',

    /**
     * 掌控的屏幕显示文字预览
     */
    PREVIEW: 'preview',

    /**
     * 所有的设置下拉框
     */
    SETTING: 'setting',

    /**
     * 数字集合类型
     */
    NUMBER: ['int32_t', 'uint32_t', 'float', 'bool']
};

export default DataType;
