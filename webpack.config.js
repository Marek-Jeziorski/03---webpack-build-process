const currentTask = process.env.npm_lifecycle_event;
console.log(currentTask);

const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

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

// main webpack config
let config = {
  entry: path.resolve(__dirname, "src/assets/scripts/App.js"),

  devtool: "inline-source-map",

  module: {
    rules: [cssConfig],
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "src/docs/index.html",
    }),
  ],
};

// DEVELOPMENT
if (currentTask == "dev") {
  config.mode = "development";
  cssConfig.use.unshift("style-loader");

  config.output = {
    filename: "bundle.js",
    path: path.resolve(__dirname, "src/docs"),
  };

  config.devServer = {
    static: "src/docs",
    port: 3000,
  };
}

// PRODUCTION
if (currentTask == "build") {
  config.mode = "production";
  cssConfig.use.unshift(MiniCssExtractPlugin.loader);

  config.output = {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js",
    clean: true,
  };

  config.optimization = {
    splitChunks: { chunks: "all" },
    minimize: true,
    minimizer: [`...`, new CssMinimizerPlugin()],
  };

  config.plugins.push(
    new MiniCssExtractPlugin({ filename: "styles.[chunkhash].css" })
  );
}

module.exports = config;
