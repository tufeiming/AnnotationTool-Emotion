const path = require('path');

module.exports = {
    entry: './static/js/index.js',
    output: {
        path: path.resolve(__dirname, 'static/js'),
        filename: 'react.bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    devtool: 'source-map',
    mode: 'development',
};
