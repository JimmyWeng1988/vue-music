// import jsonp from 'assets/js/jsonp.js'
import {commonParams} from './config.js'
import axios from 'axios'
// 获取歌手列表
export function getSingers() {
  let url = '/api/getSingerList'
  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    g_tk: 714275674,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    loginUin: 0,
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then((response) => {
    return Promise.resolve(response.data)
  })
}
// 获取歌手详情
export function getSingerDetail(singerId) {
  const url = '/api/getSingerDetail'
  const data = Object.assign({}, commonParams, {
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    singermid: singerId,
    order: 'listen',
    begin: 0,
    num: 50,
    songstatus: 1,
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then((response) => {
    return Promise.resolve(response.data)
  })
}
