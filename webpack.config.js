const path = require('path');
const fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

console.log(process.env.npm_config_target)
let extensions = [path.resolve('./extension')]
if (process.env.npm_config_test === "true") {
    extensions = fs.readdirSync("./examples").map(item => path.resolve('./examples', item))

} else if (process.env.npm_config_target) {
    extensions = [path.resolve('./extensions', process.env.npm_config_target)]
}

module.exports = extensions.map(extensionPath => {
    const configPath = path.join(extensionPath, 'public/config.json');
    const configJson = JSON.parse(fs.readFileSync(configPath));
    const distName = `${configJson.isDevice ? "dev" : "ext"}-` + `${configJson.author}-${configJson.id}@${configJson.version}`;
    const buildExtensionPath = path.join(__dirname, 'build', distName);
    return {
    mode: 'production',
    target: 'web',
    entry: path.join(extensionPath, 'index.js'),
    output: {
        path: buildExtensionPath,
        filename: 'main.js',
        libraryTarget: 'commonjs2',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                include: [
                    path.join(__dirname, 'utils'),
                    extensionPath,
                ],
                options: {
                    babelrc: false,
                    plugins: [
                        "@babel/plugin-transform-runtime",
                        "@babel/plugin-transform-modules-commonjs"
                    ],
                    presets: ['@babel/preset-env']
                }
            },
            {
                test: /\.(png|svg|jpg|gif|jpeg|ico)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 819200
                        }
                    }
                ]
            }
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false
            })
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.join(extensionPath, 'public/'),
                    to: path.join(buildExtensionPath, "/")
                }
            ]
        })
    ]
}
})