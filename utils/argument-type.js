/**
 * Block argument types
 * @enum {string}
 */
const ArgumentType = {
    /**
     * Numeric value with angle picker
     */
    ANGLE: 'angle',
  
    /**
     * Boolean value with hexagonal placeholder
     */
    BOOLEAN: 'Boolean',
  
    /**
     * Numeric value with color picker
     */
    COLOR: 'color',
  
    /**
     * Numeric value with text field
     */
    NUMBER: 'number',
  
    /**
     * String value with text field
     */
    STRING: 'string',
  
    /**
     * String value with matrix field
     */
    MATRIX: 'matrix',
  
    /**
     * MIDI note number with note picker (piano) field
     */
    NOTE: 'note',
  
    /**
     * Inline image on block (as part of the label)
     */
    IMAGE: 'image',
  
    SETTINGS: 'settings',
  
    FORMSETTING: 'form_settings',
  
    TEXTPREVIEW: 'text_preview',
  
    IMGPREVIEW: 'img_preview',
  
    RANGE: 'range',
  
    IMGSETTINGS: 'img_setting',
  
    ONLINEIMGSETTING: 'online_img_setting',
  
    DIRSETTINGS: 'dir_setting',
  
    COLORPALETTE: 'colour_palette',
  
    PIANO: 'piano',
  
    MATRIXICONS: 'matrix_icons',
  
    INFRAREDTEXT: 'infraredBtn',
  
    SLIDER: 'slider',
  
    TEXTAREA: 'textarea',
  
    BUILTINIMG: 'builtin_img',
  
    OBLOQPARAMETER: 'obloq_initial_parameter',
  
    MQTTPARAMETER: 'mqtt_setting_parameter',
  
    EVENTHEADINNER: 'specialBlock_eventHead_origin'
  
  };
  
export default ArgumentType;
  