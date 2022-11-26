const currentTask = process.env.npm_lifecycle_event;
console.log(currentTask);

const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const postCSSPlugins = [
  require("postcss-mixins"),
  require("postcss-import"),
  require("postcss-simple-vars"),
  require("postcss-nested"),
  require("autoprefixer"),
];

// COMMON
let cssConfig = {
  test: /\.css$/i,
  use: [
    "css-loader",
    {
      loader: "postcss-loader",
      options: { postcssOptions: { plugins: postCSSPlugins } },
    },
  ],
};

let config = {
  entry: {
    bundle: path.resolve(__dirname, "app/assets/scripts/App.js"),
  },
  devtool: "inline-source-map",

  module: {
    rules: [cssConfig],
  },
};

// DEVELOPMENT
if (currentTask == "dev") {
  config.mode = "development";
  cssConfig.use.unshift("style-loader");

  config.output = {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  };

  config.devServer = {
    static: "./dist",
    port: 3000,
  };
}

// PRODUCTION
if (currentTask == "build") {
  config.mode = "production";
  cssConfig.use.unshift(MiniCssExtractPlugin.loader);

  config.output = {
    path: path.resolve(__dirname, "docs"),
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js",
    clean: true,
  };

  config.optimization = {
    splitChunks: { chunks: "all" },
    minimize: true,
    minimizer: [`...`, new CssMinimizerPlugin()],
  };

  config.plugins = [
    new MiniCssExtractPlugin({ filename: "styles.[chunkhash].css" }),
  ];
}

module.exports = config;
