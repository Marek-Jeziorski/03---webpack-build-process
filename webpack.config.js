const currentTask = process.env.npm_lifecycle_event;
console.log(currentTask);

const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const fse = require("fs-extra");

const postCSSPlugins = [
  require("postcss-mixins"),
  require("postcss-import"),
  require("postcss-simple-vars"),
  require("postcss-nested"),
  require("autoprefixer"),
];

class MyRunAfterCompile {
  apply(compiler) {
    compiler.hooks.done.tap("Copy images", function () {
      fse.copySync("src/assets/images", "dev/assets/images");
    });
  }
}

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

let pages = fse
  .readdirSync("src")
  .filter(function (file) {
    return file.endsWith(".html");
  })
  .map(function (page) {
    return new HtmlWebpackPlugin({
      filename: page,
      template: `src/${page}`,
    });
  });

// main webpack config
let config = {
  entry: path.resolve(__dirname, "src/assets/scripts/App.js"),

  devtool: "inline-source-map",

  module: {
    rules: [cssConfig],
  },

  plugins: pages,
};

// DEVELOPMENT
if (currentTask == "dev") {
  config.mode = "development";
  cssConfig.use.unshift("style-loader");

  config.output = {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dev"),
  };

  config.devServer = {
    static: "dev",
    watchFiles: path.join(__dirname, "src/**/*.html"),
    port: 3000,
  };

  config.plugins.push(new MyRunAfterCompile());
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
    new MiniCssExtractPlugin({ filename: "styles.[chunkhash].css" }),
    new MyRunAfterCompile()
  );
}

module.exports = config;
