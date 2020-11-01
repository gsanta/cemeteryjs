const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = env => {
    return {
        entry: './src/index.tsx',
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: [/node_modules/, /src\/server/]
                },
                {
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'sass-loader'
                    ]
                },
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader'
                    ]
                },
                {
                    test: /\.gwm$/,
                    use: 'raw-loader'
                },
                {
                    test: /\.(png|jpg|gif|svg)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {}
                        }
                    ]
                },
                {
                    test: /\.ttf$/,
                    use: ['file-loader']
                  }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
            filename: "cemeteryjs-bundle.css",
                allChunks: true
            }),
            new webpack.DefinePlugin({
                DEBUG: env === 'debug' ? true : false
            }),
            new MonacoWebpackPlugin(),
            // new BundleAnalyzerPlugin({
            //     analyzerPort: 8887
            // }),
            new webpack.optimize.LimitChunkCountPlugin({
                maxChunks: 1
            })
        ],
        resolve: {
            extensions: [ '.tsx', '.ts', '.js', 'scss', '.css' ]
        },
        output: {
            filename: 'cemeteryjs-bundle.js',
            libraryTarget: 'var',
            library: 'cemetery',
            publicPath: ''
        },
        // externals: {
        //     "babylonjs": "BABYLON"
        // },
        devtool: 'eval',
        context: __dirname,
        devServer: {
            contentBase: ['.', './test', './assets'],
            port: 8763
        }
    }
};