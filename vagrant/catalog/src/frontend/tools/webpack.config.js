var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: ['../compiled-components/index.js'],
    output: { path: __dirname, filename: 'main.js' },
    debug: true,
    module: {
        loaders: [{
            test: /\.js?$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
                presets: ['es2016','react']
            }
        }
        ]
    },
    node: {
        fs: "empty"
    }
};