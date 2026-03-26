const defaultLocale = 'en';
let _localeData = null;

export function setLocaleData(data) {
    _localeData = data;
}

let _locale = 'en';

export function setLocale(locale) {
    _locale = locale;
}

export function getLocale(){
    return _locale;
}

export function formatMessage(message) {
    if (!_localeData) throw new Error(`Translation Messages is empty.`);
    if (typeof message === 'string') 
        return (_localeData[_locale] || _localeData[defaultLocale] || {})[message] || '';

    if (typeof message !== 'object' && message.id) 
        throw new Error(`Error in translation: id cannot be empty.`);
    
    if (_localeData[_locale] && _localeData[_locale][message.id])
        return _localeData[_locale][message.id];

    return message.default || (_localeData[defaultLocale] || {})[message] || '';
}