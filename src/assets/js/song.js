import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'

export default class Song {
  constructor({id, mid, singer, name, album, duration, cover, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.cover = cover
    this.url = url
  }
  getLyric() {
    // 倘若歌词已经获取
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    // 没有，则请求
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (typeof res === 'string') {
          // 以任意字符+( 开头  )结尾 ， 中间是 非() 字符 ， 正则提取！！！
          let reg = /^\w+\(({[^()]+})\)$/
          let matches = res.match(reg)
          // 字符转JSON
          if (matches) {
            res = JSON.parse(matches[1])
          }
        }
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          console.log(res)
          reject(new Error('No Lyric'))
        }
      })
    })
  }
}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSongSingers(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    cover: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    // url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
    // 借鉴于 https://www.ellyliang.me/article/5a50c9f00fa8a8203ffff39d
    url: `http://isure.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=32`
  })
}

function filterSongSingers(singers) {
  // 定义一个临时空数组
  let arrTmp = []
  if (!singers) {
    return ''
  }
  singers.forEach((singer) => {
    arrTmp.push(singer.name)
  })
  // 用'/'拼接返回
  return arrTmp.join('/')
}