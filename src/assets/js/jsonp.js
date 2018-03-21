import OriginJsonp from 'jsonp'

export default function jsonp(url, data, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + params(data)
  // console.log(url)
  return new Promise((resolve, reject) => {
    OriginJsonp(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

function params(data) {
  let url = ''
  for (var k in data) {
    let val = data[k] !== undefined ? data[k] : ''
    url += `&${k} = ${encodeURIComponent(val)}`
    // console.log(val)
  }
  return url ? url.substring(1) : ''
}