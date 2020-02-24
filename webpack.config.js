const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = env => {
    return {
        entry: './src/index.ts',
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
                    test: /\.(png|jpg|gif)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {}
                        }
                    ]
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
            filename: "app.css",
                allChunks: true
            }),
            new webpack.DefinePlugin({
                DEBUG: env === 'debug' ? true : false
            }),
            // new BundleAnalyzerPlugin({
            //     analyzerPort: 8887
            // })
        ],
        resolve: {
            extensions: [ '.tsx', '.ts', '.js', 'scss', '.css' ]
        },
        output: {
            filename: 'app.js',
            path: path.resolve(__dirname, 'build'),
            library: 'worldGenerator',
            publicPath: 'assets',
        },
        externals: {
            "babylonjs": "BABYLON"
        },
        devtool: 'eval',
        devServer: {
            contentBase: ['.', './test', './assets', './demo'],
            port: 8764
        }
    }
};