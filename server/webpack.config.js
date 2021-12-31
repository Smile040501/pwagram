const path = require("path");

const nodeExternals = require("webpack-node-externals");

module.exports = {
    mode: "development",
    watch: true,

    entry: "./app.js",

    output: {
        path: path.resolve(__dirname, "build"),
        filename: "app.bundle.js",
        clean: true,
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
                test: /\.(graphql|gql)$/,
                exclude: /node_modules/,
                use: [{ loader: "webpack-graphql-loader" }],
            },
        ],
    },

    externalsPresets: { node: true }, // in order to ignore built-in modules like path, fs, etc.

    externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
};
