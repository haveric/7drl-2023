const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');

let numCyclesDetected = 0;

module.exports = {
    entry: {
        app: './src/index.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: '7DRL 2023',
        }),
        new ESLintPlugin(),
        new CircularDependencyPlugin({
            failOnError: false,
            allowAsyncCycles: true,
            onStart({compilation}) {
                numCyclesDetected = 0;
            },
            onDetected({module: webpackModuleRecord, paths, compilation}) {
                console.log(paths.join(' -> '),"\n");
                numCyclesDetected++;
                //compilation.errors.push(new Error(paths.join(' -> ')))
            },
            onEnd({compilation}) {
                if (numCyclesDetected > 0) {
                    console.log(`Detected ${numCyclesDetected} cycles`);
                    // compilation.errors.push(new Error(
                    //     `Detected ${numCyclesDetected} cycles`
                    // ));
                }
            },
        })
    ],
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'docs'),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.html$/i,
                include: path.resolve(__dirname, 'src/html'),
                type: 'asset/source',
            },
            {
                test: /\.css$/i,
                include: path.resolve(__dirname, 'src/styles'),
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                include: path.resolve(__dirname, 'src/img'),
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                include: path.resolve(__dirname, 'src/fonts'),
                type: 'asset/resource',
            },
        ],
    },
    optimization: {
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
                fonts: {
                    test: /[\\/]src[\\/]fonts[\\/]/,
                    name: 'fonts',
                    chunks: 'all',
                },
                html: {
                    test: /[\\/]src[\\/]html[\\/]/,
                    name: 'html',
                    chunks: 'all',
                },
                json: {
                    test: /[\\/]src[\\/]json[\\/]/,
                    name: 'json',
                    chunks: 'all',
                }
            }
        }
    }
};