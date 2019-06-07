/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-labels */

const path = require("path");

configureWebpack: {
    module: {
        rules: [
            {
                test: /\.pug$/,
                loader: "pug-plain-loader"
            }
        ]
    }
}

module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, './src/styles/_global.scss')
      ]
    }
  }
};
