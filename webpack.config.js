var path = require('path');

module.exports = {
    devtool: 'eval-source-map',
    entry: "./src/pages/app.js",
    output: {
        path: path.join(__dirname, './public/javascripts'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    mode: 'development',
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader", options: { presets: ['@babel/preset-react'] } },
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            { test: /\.(pdf|png|svg|jpg|gif)$/, use: ['file-loader'] }
        ]
    }
}