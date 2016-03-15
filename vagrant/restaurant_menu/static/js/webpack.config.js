var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: ['./dist/index.js'],
    output: { path: __dirname, filename: 'main.js' },
    debug: true,
    module: {
        loaders: [{
            test: /\.js?$/,
            loader: 'babel',
            exclude: /node_modules/,
            query: {
                presets: ['es2015','react']
            }
        }
        ]
    },
};