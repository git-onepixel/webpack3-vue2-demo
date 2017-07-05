let webpack = require('webpack');
let path = require('path');

//提取样式
let ExtractTextPlugin = require('extract-text-webpack-plugin'); 

//自动生成Html
let HtmlWebpackPlugin = require('html-webpack-plugin');

//清理文件夹插件
let CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry:{
        app:'./src/main.js',
        vendor:['jquery','vue']
    },

    output:{
        path:__dirname + '/build',
        filename:'[name].bundle.js?[hash:8]'
    },

    module:{
        noParse:'/es6-promise\.js$/',
        loaders:[
            {
                test:/\.vue$/,
                loader:'vue-loader'
            },
            {
                test:/\.js$/,
                exclude: /node_modules|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
                loader:'babel-loader',
                query:{
                    presets:['es2015'],
                    plugins: ['transform-runtime']
                }
            },
            {
                test:/\.(css|less)$/,
                use: ExtractTextPlugin.extract({
                    use:[{
                            loader: 'css-loader',
                            options: {
                                minimize: true
                            }
                        },
                        {
                            loader: 'less-loader' 
                        }
                    ]
                })
            },
            {   
                test:/\.(png|jpg|gif)$/,
                loader: 'url-loader',
                query:{
                    limit:8192,
                    name:'images/[hash:8].[name].[ext]'
                } 
            }
        ]
    }
}
if(process.env.NODE_ENV === 'production'){
    module.exports.plugins = [
        //设置生产环境标识
        new webpack.DefinePlugin({
            'process.env':{
                NODE_ENV:JSON.stringify('production')
            }
        }),
        
        //暴露全局变量
        new webpack.ProvidePlugin({
            $:'jquery'
        }),
        
        //JS文件混淆压缩
        new webpack.optimize.UglifyJsPlugin({
            //需要在根目录下新建.babelrc文件，并设置babel解析格式
            mangle:{
                except:['$super','$','exports','require']
            },
            compress:{
                warnings:false
            },
            output: {
                comments: false,
            }
        }),
 
        //抽离公共模块 
        new webpack.optimize.CommonsChunkPlugin({
            name:'vendor',
            filename:'common.bundle.js?[hash:8]',
            minChunks:Infinity
        }),
 
        //提取样式文件 
        new ExtractTextPlugin({
            filename:'app.bundle.css?[hash:8]'
        }),

        //build之前清理发布文件夹 
        new CleanWebpackPlugin(['build'],{
            root:__dirname,
            verbose: true,
            dry:false
        }),
 
        //自动生成html
        new HtmlWebpackPlugin({
            title:'App',
            template:__dirname + '/src/template.html',
            inject:'body',
            filename:'index.html',
            minify:{
                minifyJS:true,
                minifyCSS:true,
                removeComments: true,
                collapseWhitespace: true,
                conservativeCollapse: true 
            } 
        }),

        new webpack.optimize.OccurrenceOrderPlugin()
    ]
}else{
    module.exports.plugins = [
        //暴露全局变量
        new webpack.ProvidePlugin({
            $:'jquery'
        }),
        
        //抽离公共模块 
        new webpack.optimize.CommonsChunkPlugin({
            name:'vendor',
            filename:'common.bundle.js',
            minChunks:Infinity
        }),
 
        //提取样式文件 
        new ExtractTextPlugin({
            filename:'app.bundle.css'
        }),

        new webpack.optimize.OccurrenceOrderPlugin()
    ]
    module.exports.devtool = '#souce-map'
}