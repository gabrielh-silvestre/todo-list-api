const path = require("path");
const nodeExternals = require("webpack-node-externals");
const tsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const { NODE_ENV = "production" } = process.env;

module.exports = {
  entry: "./src/infra/api/server.ts",
  mode: NODE_ENV,
  target: "node",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "server.js",
  },
  resolve: {
    extensions: [".ts", ".js"],
    plugins: [new tsconfigPathsPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  externals: [nodeExternals()],
};
