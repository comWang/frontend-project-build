const path = require('path');
const common = require('./webpack.common.js');
const merge = require('webpack-merge');
const webpack = require('webpack');
module.exports = merge(common,{
    mode:'development',
    devtool:'inline-source-map',
    output:{
        filename:'[name].js',
        chunkFilename:'[name].js'
    },
    devServer:{
        index:'index.html',
        hot:true,
        contentBase:path.resolve(__dirname,'./build'),
        port:3000,
        noInfo:true
    },
    module:{
        rules:[
            {
                test:/\.css$/,
                use:['vue-style-loader','css-loader','postcss-loader']
            }
        ]
    },
    plugins:[
        new webpack.HotModuleReplacementPlugin()
    ],
    resolve: { alias: { 'vue': 'vue/dist/vue.js' } }
});