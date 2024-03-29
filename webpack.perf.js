const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {
        app: './src/perf.js',
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, "dist"),
        },
    },
});