/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-labels */

const path = require("path");

module.exports = {
  configureWebpack: {
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.pug$/,
                loader: "pug-plain-loader"
            }
        ]
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, './src/styles/_global.scss')
      ]
    }
  }
};
