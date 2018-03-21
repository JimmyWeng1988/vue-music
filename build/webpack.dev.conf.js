'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
// 添加代理-1
const axios = require('axios')
const express = require('express')
const app = express()
let apiRoutes = express.Router()
app.use('/api',apiRoutes)
// 1-end!!!
const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    },
    // 添加代理-2  添加 before
    before(app) {
      // 获取歌单
      app.get('/api/getDissList', (req,res) => {
        let url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://y.qq.com/portal/playlist.html'
          },
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((err) => {
          console.log('GetDissList Err:' + err)
        })
      }) // end of getDissList
      // 获取歌手列表
      app.get('/api/getSingerList', (req, res) => {
        let url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://y.qq.com/portal/singer_list.html'
          },
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((err) => {
          console.log('GetSingerList Err:' + err)
        })
      })// end of getSingerList
      // 获取歌手详情
      app.get('/api/getSingerDetail', (req, res) => {
        let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
        axios.get(url, {
          headers: {
            referer: `https://y.qq.com/n/yqq/singer/${req.query.singermid}.html`
          },
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((err) => {
          console.log('getSingerDetail Err:' + err)
        })
      })// end of getSingerDetail
      // 获取歌词
      app.get('/api/getLyric', (req, res) => {
        let url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
        axios.get(url, {
          headers: {
            referer: `https://y.qq.com/portal/player.html`
          },
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((err) => {
          console.log('getLyric Err:' + err)
        })
      })// end of getLyric
      // 获取歌单的歌曲列表
      app.get('/api/getDiscSongs', (req, res) => {
        let url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
        axios.get(url, {
          headers: {
            referer: `https://y.qq.com/n/yqq/playsquare/${req.query.disstid}.html`
          },
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((err) => {
          console.log('getDiscSongs Err:' + err)
        })
      })// end of getDiscSongs
      // 获取排行榜的歌曲列表
      app.get('/api/getTopListSongs', (req, res) => {
        let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
        axios.get(url, {
          headers: {
            origin: `https://y.qq.com`,
            referer: `https://y.qq.com/w/toplist.html?ADTAG=myqq&from=myqq&channel=10007100&id=${req.query.topid}&type=top`
          },
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((err) => {
          console.log('getTopListSongs Err:' + err)
        })
      })// end of getDiscSongs
      // 获取热门搜索关键词
      app.get('/api/getHotKey', (req, res) => {
        let url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
        axios.get(url, {
          headers: {
            origin: `https://m.y.qq.com`,
            referer: `https://m.y.qq.com/`
          },
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((err) => {
          console.log('getTopListSongs Err:' + err)
        })
      })// end of getHotKey
      // 搜索结果
      app.get('/api/search', (req, res) => {
        let url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
        axios.get(url, {
          headers: {
            origin: `https://m.y.qq.com`,
            referer: `https://m.y.qq.com/`
          },
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((err) => {
          console.log('Search Err:' + err)
        })
      })// end of getHotKey
    }
    // 2-end!!!
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
