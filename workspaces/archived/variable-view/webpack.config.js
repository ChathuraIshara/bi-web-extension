const path = require("path");
const webpack = require("webpack");
module.exports = {
    entry: "./src/components/index.tsx",
    mode: "production",
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "VariableView.js",
        library: "variableView",
    },
    resolve: {
        extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: "ts-loader",
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader",
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: "process/browser",
        }),
    ],
};
