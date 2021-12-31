const path = require("path");

const nodeExternals = require("webpack-node-externals");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    mode: "production",

    entry: "./app.js",

    output: {
        path: path.resolve(__dirname, "build"),
        filename: "app.bundle.js",
        clean: true,
    },

    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    parse: { ecma: 8 },
                    compress: { ecma: 5, comparisons: false, inline: 2 },
                    mangle: { safari10: true },
                    output: { ecma: 5, comments: false, ascii_only: true },
                },
            }),
        ],
        splitChunks: {
            chunks: "all",
        },
    },

    resolve: {
        extensions: [".js", ".json"],
    },

    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                use: [{ loader: "babel-loader" }],
            },
            {
                test: /\.graphql|\.gql$/,
                exclude: /node_modules/,
                use: [{ loader: "webpack-graphql-loader" }],
            },
        ],
    },

    externalsPresets: { node: true }, // in order to ignore built-in modules like path, fs, etc.

    externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
};
