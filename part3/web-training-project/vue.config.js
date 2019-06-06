/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-labels */
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
