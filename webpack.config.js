const currentTask = process.env.npm_lifecycle_event;
console.log(currentTask);

const path = require("path");
const postCSSPlugins = [
  require("postcss-mixins"),
  require("postcss-import"),
  require("postcss-simple-vars"),
  require("postcss-nested"),
  require("autoprefixer"),
];

// COMMON
let config = {
  entry: {
    bundle: path.resolve(__dirname, "app/assets/scripts/App.js"),
  },
  devtool: "inline-source-map",

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: { postcssOptions: { plugins: postCSSPlugins } },
          },
        ],
      },
    ],
  },
};

// DEVELOPMENT
if (currentTask == "dev") {
  config.mode = "development";

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

  config.output = {
    path: path.resolve(__dirname, "docs"),
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js",
    clean: true,
  };

  config.optimization = {
    splitChunks: { chunks: "all" },
  };
}

module.exports = config;
