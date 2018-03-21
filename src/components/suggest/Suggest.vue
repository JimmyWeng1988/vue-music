<template>
  <scroll class="suggest"
          :data="result"
          :pull='pull'
          @scrollToEnd='loadingMore'
          ref='suggest'
          :beforeScroll="beforeScroll"
          @beforeScroll='listScroll'
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item,index) in result" :key="index" @click='selectItem(item)'>
        <div :class="getIconClass(item)">
          <i></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show='hasMore' txt=''></loading>
    </ul>
    <div class="no-result-wrapper" v-show='!hasMore && !result.length'>
      <no-result text="Sorry，暂无找到相关结果"></no-result>
    </div>
  </scroll>
</template>

<script>
import {search} from 'api/search'
import {ERR_OK} from 'api/config'
import {createSong} from 'assets/js/song'
import Scroll from '@/base/scroll/Scroll'
import Loading from '@/base/loading/Loading'
import NoResult from '@/base/no-result/NoResult'
import Singer from 'assets/js/singer'
import {mapMutations, mapActions} from 'vuex'

const TYPE_SINGER = 'singer'
const PAGE_SIZE = 27

export default {
  data() {
    return {
      page: 1,
      result: [],
      pull: true,
      hasMore: true,
      beforeScroll: true
    }
  },
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    selectItem(item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        // 跳转到二级路由
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
      } else {
        console.log(item)
        this.searchPlay(item)
      }
      // 处理完组件内的事务， 派发一个事件到上层
      this.$emit('select', item)
    },
    refresh() {
      this.$refs.suggest.refresh()
    },
    // 当query的值变化时，执行请求搜索
    search() {
      if (this.query !== '') {
        // 首次搜索，重置状态
        // 标志位状态
        this.hasMore = true
        this.page = 1
        this.$refs.suggest.scrollTo(0, 0)
        search(this.query, this.page, this.showSinger, PAGE_SIZE).then((res) => {
          console.log(res)
          if (res.code === ERR_OK) {
            this.result = this._formatResult(res.data)
            // 检测是否还有更多数据
            this._checkMore(res.data)
          }
          // console.log(this.result)
        })
      }
    },
    loadingMore() {
      if (!this.hasMore) {
        return
      }
      this.page++
      search(this.query, this.page, this.showSinger, PAGE_SIZE).then((res) => {
        console.log(res)
        if (res.code === ERR_OK) {
          this.result = this.result.concat(this._formatResult(res.data))
          // 检测是否还有更多数据
          this._checkMore(res.data)
        }
        // console.log(this.result)
      })
    },
    _checkMore(data) {
      const song = data.song
      if (!song.list.length || (song.curnum + song.curpage * 20) >= song.totalnum) {
        this.hasMore = false
      }
    },
    listScroll() {
      // 再往上 派发事件
      this.$emit('listScroll')
    },
    getIconClass(item) {
      if (item.type === TYPE_SINGER) {
        return 'icon icon-mine'
      } else {
        return 'icon icon-music'
      }
    },
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name} - ${item.singer}`
      }
    },
    // 格式化数据
    _formatResult(data) {
      // console.log(data)
      let res = []
      if (data.zhida && data.zhida.singerid) {
        res.push({...data.zhida, ...{type: TYPE_SINGER}})
      }
      if (data.song.list.length > 0) {
        res = res.concat(this._normalizeSongs(data.song.list))
      }
      // console.log(res)
      return res
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((musicData) => {
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'searchPlay'
    ])
  },
  watch: {
    query(newVal, oldVal) {
      this.search()
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~assets/stylus/variable'
@import '~assets/stylus/mixin'

.suggest
  height: 100%
  overflow: hidden
  .suggest-list
    padding: 0 30px
    .suggest-item
      display: flex
      align-items: center
      padding-bottom: 20px
    .icon
      flex: 0 0 30px
      width: 30px
      [class^="icon-"]
        font-size: 14px
        color: $color-text-d
    .name
      flex: 1
      font-size: $font-size-medium
      color: $color-text-d
      overflow: hidden
      .text
        no-wrap()
  .no-result-wrapper
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
</style>
