/**
 * 全局安装WP： webpack -g
 * 本地安装WP:  webpack --save-dev 
 * 配置开发服务器：webpack-dev-server --save-dev
 * 配置跨平台环境：cross-env --save-dev
 * 安装Promise: es6-promise --save
 * 安装Vue和路由: vue vue-router --save
 */

const webpack = require('webpack');

/**
 * 作用：默认样式会被打包在HTML中,该插件的作用就是独立打包样式文件
 * 安装：extract-text-webpack-plugin --save-dev  
 */
const ExtractTextPlugin = require('extract-text-webpack-plugin'); 

/**
 * 作用：根据模板动态生成html页面，并将output的资源添加到文件中
 * 安装：html-webpack-plugin --save-dev
 */
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * 作用：发布前自动清空发布目录里的内容
 * 安装：clean-webpack-plugin --save-dev
 */
const CleanWebpackPlugin = require('clean-webpack-plugin');


module.exports = {
    /**
     * 入口文件
     * 如果以key/value的形式指定，则一个key就是一个chunk
     * 这在分离公共模块的时候会用到
     */
    entry: {
        //主程序入口文件
        app: './src/main.js',
        //指定公共模块
        vendor: ['jquery','fastclick','vue']
    },
    
    /**
     * 输出文件
     */
    output: {
        path: __dirname + '/build',
        filename: '[name].bundle.js?[chunkhash:8]'
    },
    
    /**
     * webpack-dev-server
     */
    devServer: {
        host: '0.0.0.0', // 允许通过localhost、127.0.0.1以及IP地址访问
        disableHostCheck: true, // 关于host检测，否则无法通过本机IP访问
        // 代理配置
        proxy: {
          '/some/path*': {
             target: 'https://other-server.example.com',
             secure: false
          }
        }
        
    },
    
    module:{

        /**
         * ES6 Loader 规范定义了 System.import 方法，用于在运行时动态加载 ES6 模块;
         * Webpack 把 System.import 作为拆分点，然后把被请求的模块放入一个单独的 "块" (chunk)中;
         * 这种分块加载机制依赖于Promise，因此在旧版浏览器下需提供一个Promise的 Polyfill.
         */
        noParse: '/es6-promise\.js$/',
        
        /**
         * Loaders 被应用于应用程序的资源文件中，通常用来做转换;
         * 它们都是函数(运行在Nodejs中)，将资源文件的源码作为入参，处理完后，返回新的源码文件;
         * Loaders 能被链式调用，它们以管道的形式应用于资源中，最后一个Loader需要返回Javascript;
         * 而其他所有的Loader(传递给下一个Loader)可以返回任意格式;
         * webpack2要求所有的Loaders全称输入，如vue-loaders，而是不是vue;
         * Loaders 接受参数查询
         */
        loaders:[
            {
                /**
                 * 作用：解析vue文件
                 * 安装：vue-loader vue-html-loader vue-template-compiler --save-dev
                 */
                test:/\.vue$/,
                loader:'vue-loader'
            },
            {
                /**
                 * 安装：babel-core babel-loader babel-plugin-transform-runtime babel-preset-es2015 babel-runtime --save-dev
                 * 
                 * 作用：
                 * Babel 是把ES2015语法转换为ES5语法，让代码在老式浏览器里也能运行，但还需要做以下配置：
                 * 
                 * 新建文件.babelrc，存放在项目的根目录下,并添加如下配置：
                 * { 
                 *    "presets": ["es2015"], 
                 *    "plugins": ["transform-runtime"] 
                 * }
                 * 
                 * 其主要作用是配合Babel，设定转码规则、语法填充(polyfills) 和 辅助函数(helper functions)
                 * 
                 * presets提供以下的规则集，你可以根据需要安装：
                 *  # ES2015转码规则
                 *    babel-preset-es2015  -> [es2015]
                 *  # react转码规则
                 *    babel-preset-react -> [react]
                 *  # ES7不同阶段语法提案的转码规则(共有4个阶段)，选装一个
                 *    babel-preset-stage-0 -> [stage-0]
                 *    babel-preset-stage-1
                 *    babel-preset-stage-2
                 *    babel-preset-stage-3
                 * 
                 * Loader Options 须和 .babelrc 配置内容一样
                 * 
                 */
                test: /\.js$/,
                exclude: /node_modules|vue\/dist|vue-router\/|vue-loader\//,
                loader: 'babel-loader',
                options: {
                    //设定转码规则
                    presets: ['es2015'],
                    //语法填充 和 辅助函数
                    plugins: ['transform-runtime']
                }
            },
            {
                /**
                 * 安装：style-loader css-loader less less-loader --save-dev
                 * 
                 * 每个Loader的作用如下：
                 * 
                 * #css-loader 处理css中路径引用等问题
                 * #style-loader 动态把样式写入html
                 * #less-loader 把less转化为css
                 * 
                 * Loader的执行顺序是从右到左，从下往上，因此要注意每个loader的顺序
                 * 
                 * 当应用多个loader时，使用 use[]
                 * 
                 * ExtractTextPlugin.extract() 是将样式文件独立打包，此外在plugins中还需配置output的文件信息：
                 * new ExtractTextPlugin({ 
                 *     filename:'app.bundle.css?[hash:8]' 
                 * })
                 * 
                 */
                test: /\.(css|less)$/,
                use: ExtractTextPlugin.extract({
                    // 当use中的loaders 执行失败时，回退到内联模式
                    fallback: 'style-loader',
                    
                    //配置多loader
                    use: [{
                            loader: 'css-loader',
                            options: {
                                //CSS压缩(生产环境)
                                minimize: process.env.NODE_ENV === 'production'
                            }
                         },
                         {
                            loader: 'less-loader' 
                         }
                    ]
                })
            },
            {   
                /**
                 * 安装：url-loader file-loader --save-dev
                 * 
                 * 作用：
                 *
                 * 如果图片大小在8k以内,则转化为base64内联到css中
                 * 如果图片大于8k,则将图片拷贝到发布目录中，并对url重新设置
                 * 网络图片不做任何处理
                 * 
                 */
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader',
                query: {
                    limit: 8192,
                    name: 'images/[name].[hash:8].[ext]'
                } 
            }
        ]
    }
}

/**
 * 生产发布环境
 */
if(process.env.NODE_ENV === 'production'){
    module.exports.plugins = [
        /**
         * 设置生产环境
         */
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        
        /**
         * 暴露全局变量
         * 安装:jquery --save
         */
        new webpack.ProvidePlugin({
            $: 'jquery'
        }),
        
        /**
         * JS文件混淆压缩
         */
        new webpack.optimize.UglifyJsPlugin({
            mangle: {
                // 指定模块不参与压缩
                except: ['$super','$','exports','require']
            },
            compress:{
                // 移除警告信息
                warnings: false
            },
            output: {
                //清除代码中的注释
                comments: false,
            }
        }),
 
        /**
         * 抽离公共模块 
         */
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor', // entry中配置的chunk
            filename: 'common.bundle.js?[chunkhash:8]',
            minChunks: Infinity // 最小引用次数
        }),
 
        /**
         * 提取样式文件
         */ 
        new ExtractTextPlugin({
            filename: 'app.bundle.css?[chunkhash:8]'
        }),

        /**
         * build之前清理发布文件夹
         * 路径：根目录下的build文件夹
         */
        new CleanWebpackPlugin(['build'], {
            root: __dirname,
            verbose: true,
            dry: false
        }),
 
        /**
         * 动态生成发布HTML文件
         */
        new HtmlWebpackPlugin({
            //HTML文件标题，模板文件需要配置变量
            title: 'App',

            //模板文件
            template: __dirname + '/src/template.html',
            
            //JS资源添加到body中
            inject: 'body',
            
            //输出文件
            filename: 'index.html',
            
            //压缩配置项
            minify: {
                minifyJS: true,
                minifyCSS: true,
                removeComments: true,
                collapseWhitespace: true,
                conservativeCollapse: true 
            } 
        }),
        
        /**
         * webpack3 新增模块串联功能
         * 以前webpack 会为每个模块创建各自的闭包
         * 使用串联功能将模块连接到一起后，就只需为这真个模块创建一个单独的闭包，从而减少不必要的代码
         */
        new webpack.optimize.ModuleConcatenationPlugin()
    ]
} else {
    /**
     * 开发环境
     */
    module.exports.plugins = [
        /**
         * 配置开发环境
         */
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development')
            }
        }),
        
        /**
         * 暴露全局变量
         */
        new webpack.ProvidePlugin({
            $: 'jquery'
        }),
        
        /**
         * 抽离公共模块 
         */
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'common.bundle.js',
            minChunks: Infinity
        }),
 
        /**
         * 提取样式文件 
         */
        new ExtractTextPlugin({
            filename: 'app.bundle.css'
        })
    ]

    /**
     * 配置开发工具,便于开发阶段源码调试
     * 
     * 常用的配置如下：
     * 
     * #eval 每个模块都封装到 eval 包裹起来，并在后面添加 //# sourceURL
     * #source-map 打包代码同时创建一个新的 sourcemap 文件， 并在打包文件的末尾添加 //# sourceURL 注释行告诉 js 引擎文件在哪儿
     * #hidden-source-map 就是 soucremap 但没注释 
     * #inline-source-map 为每一个文件添加 sourcemap 的 DataUrl，同时这个 DataUrl 是包含一个文件完整 souremap 信息的 Base64 格式化后的字符串，而不是一个 url。
     * #eval-source-map 把 eval 的 sourceURL 换成了完整 souremap 信息的 DataUrl
     * #cheap-source-map 不包含列信息，不包含 loader 的 sourcemap，（譬如 babel 的 sourcemap）
     * #cheap-module-source-map 不包含列信息，同时 loader 的 sourcemap 也被简化为只包含对应行的。最终的 sourcemap 只有一份，它是 webpack 对 loader 生成的 sourcemap 进行简化，然后再次生成的。
     */
    module.exports.devtool = '#source-map'
}
