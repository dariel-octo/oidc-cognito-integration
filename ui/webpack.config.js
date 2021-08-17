const webpack = require('webpack');
const path = require('path');

const config = {
    entry: ['./ui.js'],
    mode: 'production',
    experiments: {
        outputModule: true
    },
    output: {
        path: path.resolve(__dirname),
        filename: 'main.js',
        module: true,
    },
    resolve: {
        fallback: {
            "crypto": require.resolve("crypto-browserify"),
            "stream": require.resolve("stream-browserify")
        }
    }
};

module.exports = config;