// import jsonp from 'assets/js/jsonp.js'
// import {commonParams, options} from './config.js'
import {commonParams} from './config.js'
import axios from 'axios'

export function getHotKey() {
  const url = '/api/getHotKey'
  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    uin: 0,
    format: 'json',
    platform: 'h5',
    needNewCode: 1
  })
  // return jsonp(url, data, options)
  return axios.get(url, {
    params: data
  }).then((response) => {
    return Promise.resolve(response.data)
  })
}

export function search(query, page, zhida, pagesize = 20) {
  const url = '/api/search'
  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    uin: 0,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    w: query,
    zhidaqu: 1,
    catZhida: zhida ? 1 : 0,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage: pagesize,
    n: pagesize,
    p: page,
    remoteplace: 'txt.mqq.all'
  })
  return axios.get(url, {
    params: data
  }).then((response) => {
    return Promise.resolve(response.data)
  })
}