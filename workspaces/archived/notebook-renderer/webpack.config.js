const path = require("path");
const webpack = require("webpack");
module.exports = {
    entry: "./src/components/index.tsx",
    mode: "production",
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "NotebookRenderer.js",
        libraryTarget: "umd",
    },
    resolve: {
        extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
        alias: {
            react: "preact/compat",
            "react-dom": "preact/compat",
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader",
                    },
                ],
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader",
            },
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: "process/browser",
        }),
    ],
};
