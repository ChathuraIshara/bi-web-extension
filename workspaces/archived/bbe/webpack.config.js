const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    watch: false,
    mode: "production",
    entry: {
        BBEViewer: path.resolve(__dirname, 'src', 'index.ts'),
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js',
        library: 'BBEViewer',
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json']
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /(node_modules)|(tests)/,
                include: [path.resolve(__dirname, 'src')]
            },
            {
                test: /\.js$/,
                use: ["source-map-loader"],
                enforce: "pre",
                include: [path.resolve(__dirname, 'src')]
            },
            {
                test: /\.css|\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ],
                include: [path.resolve(__dirname, 'src')]
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'svg-url-loader',
                        options: {
                        },
                    },
                ],
                include: [path.resolve(__dirname, 'src')]
            }
        ]
    },
    watchOptions: {
        ignored: [
            "/build/"
        ]
    },
    devServer: {
        disableHostCheck: true,
        contentBase: path.join(__dirname, 'build'),
        port: 9000,
        headers: {
            'Access-Control-Allow-Origin': '*',
        }
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { context: path.resolve(__dirname, 'theme'), from: 'lib', to: 'themes' }
            ]
        })
    ],
    devtool: 'source-map',
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    keep_fnames: true,
                }
            })
        ]
    }
}
