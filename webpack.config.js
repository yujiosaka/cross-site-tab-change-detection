// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodeExternals = require("webpack-node-externals");

module.exports = [
  {
    mode: "development",
    entry: {
      client: "./src/client.ts",
    },
    output: {
      filename: "[name].js",
      path: `${__dirname}/public`,
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
    resolve: {
      extensions: [".ts", ".js"],
    },
  },
  {
    mode: "development",
    entry: {
      server: "./src/server.ts",
    },
    target: "node",
    node: {
      __dirname: false,
      __filename: false,
    },
    externals: [nodeExternals()],
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".js"],
    },
  },
];
