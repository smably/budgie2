var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: './main.js',
    output: { path: __dirname, filename: 'bundle.js' },
    module: {
        loaders: [
        {
            test: /.js$/,
            loader: 'babel-loader',
            exclude: /node-modules/,
            query: {
                presets: [ 'es2015', 'react' ]
            }
        }
        ]
    }
};

