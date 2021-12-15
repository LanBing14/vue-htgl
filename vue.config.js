"use strict";
const path = require("path");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
//     .BundleAnalyzerPlugin;
const CompressionPlugin = require("compression-webpack-plugin");

function resolve(dir) {
    return path.join(__dirname, dir);
}

// 接口代理地址
// const proxyTarget = 'http://localhost:8110/' // 本地
// const proxyTarget = 'http://192.168.20.58:8110/' //  邸诗震后台服务地址
// const proxyTarget = 'http://192.168.20.180:8110/' // 朱春盛后台服务地址
// const proxyTarget = 'http://192.168.20.160:8110/' // 朱春盛后台服务地址
// const proxyTarget = 'http://192.168.20.60:8110/' // 张国阳后台服务地址
// const proxyTarget = 'http://10.191.30.144:8110/' // 测试环境后台服务地址
// const proxyTarget = 'http://192.168.20.115:8110' //王启梦后台服务地址
// const proxyTarget = 'http://192.168.20.251:8110'  // 林鹏接口地址
const proxyTarget = 'http://10.191.30.251:8110'  // 林鹏接口地址
// const proxyTarget = 'http://192.168.20.73:8110/'  // 朱春盛接口地址


const name = "fxb-web"; // page title
// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
const port = 9529; // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
    /**
     * You will need to set publicPath if you plan to deploy your site under a sub path,
     * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
     * then publicPath should be set to "/bar/".
     * In most cases please use '/' !!!
     * Detail: https://cli.vuejs.org/config/#publicpath
     */
    publicPath: "/",
    outputDir: "dist",
    assetsDir: "static",
    lintOnSave: process.env.NODE_ENV === "development",
    productionSourceMap: false,
    devServer: {
        port: port,
        host: "0.0.0.0",
        open: true,
        overlay: {
            warnings: false,
            errors: true
        },
        proxy: {
            // change xxx-api/login => mock/login
            // detail: https://cli.vuejs.org/config/#devserver-proxy
            [process.env.VUE_APP_BASE_API]: {
                target: proxyTarget,
                changeOrigin: true
                    // pathRewrite: {[`^${process.env.VUE_APP_BASE_API}`] : ""}
            },
            "/dev": {
                target: "https://fxb-1253553876.cos.ap-nanjing.myqcloud.com",
                changeOrigin: true
            }
        },
        disableHostCheck: true
    },
    configureWebpack: () => {
        const plugins = [];
        if (process.env.NODE_ENV === "production") {
            //plugins.push(new BundleAnalyzerPlugin())
            plugins.push(
                new CompressionPlugin({
                    test: /\.js$|\.html$|.\css/, //匹配文件名
                    threshold: 10240 //对超过10k的数据压缩
                })
            );
        }
        return {
            // provide the app's title in webpack's name field, so that
            // it can be accessed in index.html to inject the correct title.
            name: name,
            resolve: {
                extensions: [".js", ".vue", ".json"],
                alias: {
                    "@": resolve("src")
                }
            },
            plugins
        };
    },
    chainWebpack(config) {
        config.plugins.delete("preload"); // TODO: need test
        config.plugins.delete("prefetch"); // TODO: need test

        // set svg-sprite-loader
        config.module
            .rule("svg")
            .exclude.add(resolve("src/icons"))
            .end();
        config.module
            .rule("icons")
            .test(/\.svg$/)
            .include.add(resolve("src/icons"))
            .end()
            .use("svg-sprite-loader")
            .loader("svg-sprite-loader")
            .options({
                symbolId: "icon-[name]"
            })
            .end();

        // set preserveWhitespace
        config.module
            .rule("vue")
            .use("vue-loader")
            .loader("vue-loader")
            .tap(options => {
                options.compilerOptions.preserveWhitespace = true;
                return options;
            })
            .end();

        config
        // https://webpack.js.org/configuration/devtool/#development
            .when(process.env.NODE_ENV === "development", config =>
            config.devtool("cheap-source-map")
        );

        config.when(process.env.NODE_ENV !== "development", config => {
            config
                .plugin("ScriptExtHtmlWebpackPlugin")
                .after("html")
                .use("script-ext-html-webpack-plugin", [{
                    // `runtime` must same as runtimeChunk name. default is `runtime`
                    inline: /runtime\..*\.js$/
                }])
                .end();
            config.optimization.splitChunks({
                chunks: "all",
                cacheGroups: {
                    libs: {
                        name: "chunk-libs",
                        test: /[\\/]node_modules[\\/]/,
                        priority: 10,
                        chunks: "initial" // only package third parties that are initially dependent
                    },
                    elementUI: {
                        name: "chunk-elementUI", // split elementUI into a single package
                        priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                        test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                    },
                    commons: {
                        name: "chunk-commons",
                        test: resolve("src/components"), // can customize your rules
                        minChunks: 3, //  minimum common number
                        priority: 5,
                        reuseExistingChunk: true
                    }
                }
            });
            config.optimization.runtimeChunk("single");
        });
    },
    css: {
        loaderOptions: {
            scss: {
                prependData: `
                    @import "~@/styles/variables.scss";
                    @import "~@/styles/mixin.scss";`
            }
        }
    }
};
