const path = require('path');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { argv } = require('process');

const BASE_DIR = path.resolve(__dirname, "..");

const LOW_CODE_DIR = path.join(BASE_DIR, 'low-code-editor');
const DATA_MAPPER_DIR = path.join(BASE_DIR, 'data-mapper');

// Add any new modules, for which coverage reports are needed, here.
const LOW_CODE_MODULES = [
    path.join(BASE_DIR, "expression-editor"),
    path.join(BASE_DIR, "low-code-diagram"),
    path.join(BASE_DIR, "low-code-editor"),
    path.join(BASE_DIR, "low-code-editor-commons"),
    path.join(BASE_DIR, "low-code-ui-components"),
    path.join(BASE_DIR, "statement-editor"),
];

function getConfig(mode, entrypointName, entrypointPath, outputPath, disableChunks = false, isTestArtifact = false) {
    const optionalPlugins = [];
    const optionalRules = [];
    if (disableChunks) {
        optionalPlugins.push(
            new webpack.optimize.LimitChunkCountPlugin({
                maxChunks: 1
            })
        );
    }
    if (isTestArtifact) {
        optionalPlugins.push(
            new HtmlWebpackPlugin({
                title: isTestArtifact.title,
                template: isTestArtifact.template
            })
        );
        optionalRules.push({
            test: /\.(js|jsx)$/,
            use: "@jsdevtools/coverage-istanbul-loader",
            include: LOW_CODE_MODULES,
        })
    }
    return {
        mode: 'none',
        entry: {
            [entrypointName]: entrypointPath,
        },
        target: 'web',
        devtool: "source-map",
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
                "child_process": false
            },
            fallback: {
                buffer: require.resolve('buffer/'),
            },
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
                    use: ['style-loader', 'css-loader'],
                },
                {
                    test: /\.(woff|woff2|ttf|otf|eot)$/,
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
                },
                ...optionalRules
            ],
        },
        ignoreWarnings: [/Failed to parse source map/],
        output: {
            filename: '[name].js',
            path: outputPath,
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
            new ForkTsCheckerWebpackPlugin(), // run TSC on a separate thread,
            new MonacoWebpackPlugin({
                languages: ['ballerina', 'yaml', 'json']
            }),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(mode)
            }),
            ...optionalPlugins
        ]
    };
}

module.exports = [
    (env, argv) => (getConfig(
        argv.mode,
        "BLCEditor",
        path.join(__dirname, 'src', 'index.tsx'),
        path.resolve(__dirname, 'build'),
        true,
        false
    )),
    (env, argv) => (getConfig(
        "development",
        "BLCEditor",
        path.join(__dirname, 'src', 'app', 'index.tsx'),
        path.resolve(__dirname, 'build-app'),
        false,
        {
            title: "BLC Editor Standalone",
            template: path.join(__dirname, 'src', 'app', 'index.html')
        }
    ))
];

