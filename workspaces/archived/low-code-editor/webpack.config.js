const path = require('path');
const fs = require('fs');
const glob = require('glob');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const APP_DIR = path.resolve(__dirname, './src');
const MONACO_DIR = fs.realpathSync(path.resolve(__dirname, './node_modules/monaco-editor'));
const DATA_MAPPER_DIR = path.resolve(__dirname, '../data-mapper');
const FONT_DIR = path.resolve(__dirname, '../../common-libs/font-wso2-vscode');

const CODICON_GLOB_PATH = path.resolve(__dirname, '../../../common/temp/node_modules/.pnpm/@vscode+codicons@*/node_modules/@vscode/codicons/dist');
const CODICON_DIRS = glob.sync(CODICON_GLOB_PATH);

module.exports = (env, argv) => ({
    mode: 'none',
    entry: {
        BLCEditor: path.join(__dirname, 'src', 'index.tsx')
    },
    target: 'web',
    devtool: argv.mode === "production" ? undefined : "source-map",
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".mjs"],
        alias: {
            handlebars: 'handlebars/dist/handlebars.min.js',
            "vscode": require.resolve('monaco-languageclient/lib/vscode-compatibility'),
            "crypto": false,
            "net": false,
            "os": false,
            "path": false,
            "fs": false,
            "child_process": false,
        },
        fallback: {
            buffer: require.resolve('buffer/'),
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|mjs|jsx|ts|tsx)$/,
                enforce: "pre",
                use: ["source-map-loader"],
            },
            {
                test: /\.ts(x?)$/,
                use: [
                    // "@jsdevtools/coverage-istanbul-loader", TODO: Enable this only when we are using final build for cypress
                    'ts-loader'
                ],
                exclude: '/node_modules/'
            },
            {
                test: /\.css$/,
                include: [FONT_DIR, ...CODICON_DIRS],
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(woff|woff2|ttf|otf|eot)$/,
                include: [FONT_DIR, ...CODICON_DIRS],
                type: 'asset/inline'
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            },
            {
                test: /\.css$/,
                include: APP_DIR,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.css$/,
                include: [MONACO_DIR, DATA_MAPPER_DIR],
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(woff|woff2|ttf|otf|eot)$/,
                include: [APP_DIR, MONACO_DIR, DATA_MAPPER_DIR],
                type: 'asset/inline'
            },
            {
                test: /\.svg/,
                use: {
                    loader: 'svg-url-loader',
                    options: {

                    }
                }
            },
            {
                test: /\.svg/,
                include: DATA_MAPPER_DIR,
                use: {
                    loader: 'svg-url-loader',
                    options: {

                    }
                }
            }
        ],
        parser: {
            javascript: {
                reexportExportsPresence: false,
            },
        }
    },
    ignoreWarnings: [/Failed to parse source map/],
    output: {
        filename: 'BLCEditor.js',
        path: path.resolve(__dirname, 'build'),
        library: {
            name: "BLCEditor",
            type: "umd"
        }
    },
    devServer: {
        allowedHosts: 'all',
        port: 9000,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        devMiddleware: {
            mimeTypes: { 'text/css': ['css'] },
        },
    },
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
        }),
        new ForkTsCheckerWebpackPlugin(), // run TSC on a separate thread,
        new MonacoWebpackPlugin({
            languages: ['ballerina', 'yaml', 'json']
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(argv.mode)
        })
    ]
});

