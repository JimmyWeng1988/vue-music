import * as types from './mutation-types'
import {playMode} from 'assets/js/config'
import {shuffle} from 'assets/js/util'
import {saveSearch} from 'assets/js/cache'

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const selectedPlay = function({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = function ({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 搜索结果列表的歌曲播放
export const searchPlay = function({commit, state}, song) {
  let playList = state.playList.slice()
  let seqList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 保存当前歌曲
  let currentSong = playList[currentIndex]
  // !!!
  // splice() 方法 从数组中添加/删除项目，然后返回被删除的项目。
  // 注释：该方法会改变原始数组。
  // !!!
  // 【1】当前播放列表！！！
  // 试图在当前播放列表查找该歌曲（搜索结果的）
  let fIndex = findIndex(playList, song)
  // 插入当前播放列表
  currentIndex++
  playList.splice(currentIndex, 0, song)
  // 插入新歌曲后，须判断是否已经存在，
  if (fIndex > -1) {
    // 若存在，则删除原有歌曲！！！
    // 判断其插入的位置，在 当前播放歌曲的 前面 或者 后面
    if (currentIndex > fIndex) {
      // 在前面
      // 删除
      playList.splice(fIndex, 1)
      // 因数组长度发生变化，当前播放索引减1
      currentIndex--
    } else {
      // 在后面
      // 因为前面插入一个新的数据，所以之前查询到的数据的索引 需要加1
      playList.splice(fIndex + 1, 1)
    }
  }

  // 【2】顺序播放列表！！！
  // 当前歌曲在 顺序播放列表中的索引 + 1 = 要插入的位置
  let curSIndex = findIndex(seqList, currentSong) + 1
  // 要插入的歌曲 是否存在
  let fsIndex = findIndex(seqList, song)
  // 在当前歌曲之后，插入要插入的歌曲
  seqList.splice(curSIndex, 0, song)

  if (fsIndex > -1) {
    if (curSIndex > fsIndex) {
      seqList.splice(fsIndex, 1)
    } else {
      seqList.splice(fsIndex + 1, 1)
    }
  }

  // 【3】提交修改、
  commit(types.SET_PLAYLIST, playList)
  commit(types.SET_SEQUENCE_LIST, seqList)
  // commit(types.SET_PLAY_MODE, playMode.random)
  // let randomList = shuffle(list)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
// 保存搜索记录
export const saveSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}