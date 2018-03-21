import {playMode} from 'assets/js/config'
import {loadSearch} from 'assets/js/cache'

const state = {
  singer: {},
  // 播放状态
  playing: false,
  // 播放器的展开状态
  fullScreen: false,
  // 播放列表
  playList: [],
  // 歌曲播放顺序列表
  sequenceList: [],
  // 播放模式
  mode: playMode.seq,
  // 当前播放索引
  currentIndex: -1,
  // 当前歌单
  disc: {},
  // 排行榜
  topList: {},
  // 搜索历史 , 从本地存储读取
  searchHistory: loadSearch()
}

export default state