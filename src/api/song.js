import {commonParams} from './config.js'
import axios from 'axios'

export function getLyric(mid) {
  let url = '/api/getLyric'
  const data = Object.assign({}, commonParams, {
    pcachetime: new Date(),
    songmid: mid,
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0
  })
  return axios.get(url, {
    params: data
  }).then((response) => {
    return Promise.resolve(response.data)
  })
}