#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const locales = require('./supported-locales.js');

const combineJson = (component) => {
    console.log('combineJson', component);

    return Object.keys(locales).reduce((collection, lang) => {
        try {
            const filePath = path.resolve(component, lang + '.json');

            const langData = JSON.parse(
                fs.readFileSync(filePath, 'utf8')
            );

            collection[lang] = langData;
        } catch {}
        return collection;
    }, {});
};

let extensions = [path.resolve('./extension')]
if (process.env.npm_config_test === "true") {
    extensions = fs.readdirSync("./examples").map(item => path.resolve('./examples', item))

} else if (process.env.npm_config_target) {
    extensions = [path.resolve('./extensions', process.env.npm_config_target)]
}

console.log("Build l10n:", extensions)

extensions.forEach((extensionPath) => {
    const localesPath = path.join(extensionPath, "locales");

    if (fs.existsSync(localesPath)) {
        const blocksMessages = combineJson(localesPath);
        const blockData =
            '// GENERATED FILE:\n' +
            'export default ' +
            JSON.stringify(blocksMessages, null, 2) +
            ';\n';
        fs.writeFileSync(path.join(localesPath, 'index.js'), blockData);
    }
})

process.exit(0);