import jsonp from 'assets/js/jsonp.js'
import {commonParams, options} from './config.js'
import axios from 'axios'

export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  return jsonp(url, data, options)
}

export function getDissList() {
  // https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg
  const url = '/api/getDissList'
  const data = Object.assign({}, commonParams, {
    picmid: 1,
    rnd: Math.random(),
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    categoryId: 10000000,
    sortId: 5,
    sin: 0,
    ein: 29,
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then((response) => {
    return Promise.resolve(response.data)
  })
}

export function getDiscSongs(dissid) {
  const url = '/api/getDiscSongs'
  const data = Object.assign({}, commonParams, {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    disstid: dissid,
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    platform: 'yqq',
    needNewCode: 0
  })
  return axios.get(url, {
    params: data
  }).then((response) => {
    return Promise.resolve(response.data)
  })
}