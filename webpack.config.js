const ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');

var provideJQuery = new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery"
});

module.exports = {
    context: __dirname + "/app",
    entry: "./index.js",
    output: {
        path: __dirname + "/www",
        filename: "scripts.js"
    },
    // devtool: 'eval-source-map',
    module: {
        rules: [{
                test: /\.jsx?$/,
                use: [{
                    loader: "babel-loader",
                    options: {
                        presets: ["es2015"]
                    }
                }],
                exclude: [/node_modules/, /export/]
            }, {
                test: /\.s?css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    //resolve-url-loader may be chained before sass-loader if necessary 
                    use: ['css-loader?sourceMap', 'resolve-url-loader?sourceMap', 'sass-loader?sourceMap']
                })
            },
            {
                test: /\.(jpe?g|gif|png|svg)$/,
                loader: 'file-loader?emitFile=false&name=./images/[name].[ext]'
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('./style.css'),
        provideJQuery
    ]
};