var path = require('path');
var webpack = require('webpack');
var javascriptPath = '../../backend/python/static/javascript/';

module.exports = {
    entry: {
        preload: '../compiled-components/index.js'
    },
    output: {
        path: javascriptPath,
        publicPath: javascriptPath,
        filename: '[name].bundle.js',
        chunkFilename: '[id].bundle.js'
    },
    node: {
        fs: "empty"
    }
};