const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const common = require('./webpack.common.js');
const merge = require('webpack-merge');
const webpack = require('webpack');

function recursiveIssuer(m) {
    if (m.issuer) {
      return recursiveIssuer(m.issuer);
    } else if (m.name) {
      return m.name;
    } else {
      return false;
    }
  }



const autoExtractCss = (entryList,option={}) =>{
  if(!Array.isArray(entryList)) throw new Error('type wrong');
  let obj = {};
  entryList.forEach(item=>{
    let fm = item.filename?item.filename:item;
    obj[fm] = {
      name:fm,
      test: (m,c,entry = fm) => m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
      chunks: 'all',
      enforce: true
    }

  })

  return Object.assign(obj,option);
};

const say=s=>{
  console.log(s);
  return s;
};


module.exports = merge(common,{
    mode:'production',
    output:{
        filename:'[name].[contenthash].js',
        chunkFilename:'[name].[contenthash].js'
    },
    resolve: { alias: { 'vue': 'vue/dist/vue.min.js' } },
    module: {
        rules: [
          {
            test: /\.css$/,
            use: [ MiniCssExtractPlugin.loader,"css-loader"]
          }
        ]
    },
    plugins:[
        new CleanWebpackPlugin('build'), 
        new MiniCssExtractPlugin({
            filename:'./css/[id].[contenthash].css'
        }),
        new webpack.HashedModuleIdsPlugin()
    ],
    optimization: {
        minimizer:[
          new UglifyJsPlugin({
            cache: true,
            parallel: true
          }),
          new OptimizeCSSAssetsPlugin()
        ],
        splitChunks: {
          cacheGroups: autoExtractCss([
            'page1','page2'
          ])
        }
      }
 
});