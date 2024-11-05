const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const envKeys = Object.keys(process.env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(process.env[next]);
    return prev;
}, {});

module.exports = {
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
        filename: 'move_university_consultant.[contenthash].js', // contenthash를 추가하여 캐싱 최적화
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.js$|jsx/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
            {
                test: /\.css$/i,
                exclude: /\.module\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'], // MiniCssExtractPlugin.loader 사용
            },
            {
                test: /\.module\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                        },
                    },
                ],
            },
            {
                test: /\.(gif|svg|jpg|png|jpeg)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name].[hash][ext]',
                },
            }
        ],
    },
    performance: {
        maxEntrypointSize: 2048000,
        maxAssetSize: 2048000,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@api': path.resolve(__dirname, 'src/appcore/api/'),
            '@hook': path.resolve(__dirname, 'src/appcore/hook/'),
            '@style': path.resolve(__dirname, 'src/common/style/'),
            '@layout': path.resolve(__dirname, 'src/appmain/layout'),
            '@image': path.resolve(__dirname, 'src/common/images/'),
            '@common/component': path.resolve(__dirname, 'src/common/components/')
        },
        extensions: ['.js', '.jsx', '.scss'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public/index.html'),
            favicon: path.resolve(__dirname, 'public/favicon.ico'),
            filename: 'index.html',
        }),
        new webpack.DefinePlugin(envKeys),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css', // contenthash를 추가하여 캐싱 최적화
        })
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 30000,
            maxSize: 250000,
            minChunks: 1,
            maxAsyncRequests: 20,
            maxInitialRequests: 20,
            automaticNameDelimiter: '~',
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                    priority: -10,
                    enforce: true,
                },
                commons: {
                    test: /[\\/]src[\\/]/,
                    name: 'commons',
                    chunks: 'all',
                    minChunks: 2,
                    priority: -20,
                },
            },
        },
    },
    devtool: 'cheap-module-source-map',
    devServer: {
        historyApiFallback: true,
        static: path.resolve(__dirname, 'public'),
        hot: true,
        port: 3000,
    },
    mode: 'production',
};