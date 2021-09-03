/* eslint-disable */
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = (env) => {
  const isDevelopment = env.mode !== "production";

  const config = {
    entry: "./src/module.ts",
    mode: isDevelopment ? "development" : "production",
    resolve: {
      extensions: [".wasm", ".mjs", ".ts", ".js", ".tsx", ".json"],
    },
    output: {
      filename: "module.js",
      path: path.resolve(__dirname, "dist"),
      publicPath: "",
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: ["ts-loader"],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new CopyPlugin({ patterns: [{ from: "static" }] }),
    ],

    watch: env.watch ?? false,
    devtool: isDevelopment ? "inline-source-map" : undefined,
    devServer: isDevelopment
      ? {
          writeToDisk: true,
          proxy: [
            {
              context: (pathname) => {
                return !pathname.match("^/sockjs");
              },
              target: "http://localhost:30000",
              ws: true,
            },
          ],
        }
      : undefined,
  };

  return config;
};
