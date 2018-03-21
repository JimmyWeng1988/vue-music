<template>
   <div class="singer" ref='singer'>
      <list-view :listdata="singers" ref="list" @selected="selectItem"></list-view>
      <router-view></router-view>
   </div>
</template>

<script type="text/ecmascript-6">
import {getSingers} from 'api/singer'
import {ERR_OK} from 'api/config'
import Singer from 'assets/js/singer'
import ListView from '@/base/listview/ListView'
import {mapMutations} from 'vuex'
import {playlistMixin} from 'assets/js/mixin'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10
export default {
  mixins: [playlistMixin],
  data() {
    return {
      // 歌手列表
      singers: []
    }
  },
  components: {
    ListView
  },
  created() {
    setTimeout(() => {
      this._getSingers()
    }, 200)
  },
  methods: {
    selectItem(singer) {
      // 调用存储
      this.setSinger(singer)
      // 跳转详情页
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      // console.log(singer.id)
    },
    handlePlayList(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.list.refresh()
    },
    _getSingers() {
      getSingers().then((response) => {
        // console.log(response)
        if (response.code === ERR_OK) {
          this.singers = this._serializeSinger(response.data.list)
          // console.log(this.singers)
        }
      })
    },
    // 重组歌手的数据结构
    _serializeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        // 1.热门组合
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
        const key = item.Findex
        // 2.按字母组合
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }))
      })// end of forEach
      // console.log(map)
      // 3.将组合排序
      let hotArr = []
      let azArr = []
      for (let key in map) {
        let item = map[key]
        if (item.title.match(/[a-zA-Z]/)) {
          azArr.push(item)
        } else if (item.title === HOT_NAME) {
          hotArr.push(item)
        }
      }
      azArr.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      // console.log(hotArr)
      // console.log(azArr)
      return hotArr.concat(azArr)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.singer
  position: fixed
  top: 88px
  bottom: 0
  width: 100%
</style>