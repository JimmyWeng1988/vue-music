import jsonp from 'assets/js/jsonp.js'
import {commonParams, options} from './config.js'
import axios from 'axios'

export function getTopList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    uin: 0,
    format: 'jsonp',
    platform: 'h5',
    needNewCode: 1
  })
  return jsonp(url, data, options)
}

export function getTopListDetail(topid) {
  const url = '/api/getTopListSongs'
  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    uin: 0,
    platform: 'h5',
    needNewCode: 1,
    tpl: 3,
    page: 'detail',
    type: 'top',
    topid: topid
  })
  return axios.get(url, {
    params: data
  }).then((response) => {
    return Promise.resolve(response.data)
  })
}