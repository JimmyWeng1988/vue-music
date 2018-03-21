<template>
  <div class="music-list">
    <div class="back" @click='back'>
      <span class="icon-back"></span>
    </div>
    <h1 class="title" v-text='title'></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImg">
      <div class="play-wrapper">
        <div class="play" v-show="songs.length > 0" ref='playbtn' @click='random'>
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref='filter'></div>
    </div>
    <div class="bg-layer" ref='bglayer'></div>
    <scroll :probe-type='probeType'
            :listen-scroll="listenScroll"
            :data='songs'
            @scroll='scroll'
            class="list" ref="songlist">
      <div class="song-list-wrapper">
        <song-list :songs="songs" :rank='rank' @select='selected'></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from '@/base/scroll/Scroll'
import SongList from '@/base/song-list/SongList'
import Loading from '@/base/loading/Loading'
import {prefixStyle} from 'assets/js/dom'
// vuex语法糖
import {mapActions} from 'vuex'
import {playlistMixin} from 'assets/js/mixin'

const TITLE_HEIGHT = 40
const transform = prefixStyle('transform')
const backdropFilter = prefixStyle('backdrop-filter')

export default {
  mixins: [playlistMixin],
  // 调用组件 需传入的值
  props: {
    bgImg: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: null
    },
    title: {
      type: String,
      default: ''
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImg})`
    }
  },
  mounted() {
    // 记录图片高度
    this.bgImgHeight = this.$refs.bgImg.clientHeight
    // 最小滚动
    this.minTranslateY = -this.bgImgHeight + TITLE_HEIGHT
    this.$refs.songlist.$el.style.top = `${this.bgImgHeight}px`
  },
  created() {
    this.probeType = 3
    this.listenScroll = true
  },
  data() {
    return {
      scrollY: 0
    }
  },
  methods: {
    scroll(pos) {
      this.scrollY = pos.y
    },
    back() {
      this.$router.back()
    },
    selected (item, index) {
      this.selectedPlay({
        list: this.songs,
        index: index
      })
      // 清空播放器的歌词
    },
    random() {
      this.randomPlay({list: this.songs})
    },
    handlePlayList(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.songlist.$el.style.bottom = bottom
      this.$refs.songlist.refresh()
    },
    ...mapActions([
      'selectedPlay',
      'randomPlay'
    ])
  },
  watch: {
    scrollY(newY) {
      let translateY = Math.max(this.minTranslateY, newY)
      let zIndex = 0
      // 图片缩放因子
      let scale = 1
      let blur = 0
      console.log(`${newY}.....${translateY}`)
      this.$refs.bglayer.style[transform] = `translate3d(0,${translateY}px,0)`
      // 计算缩放比例
      const percent = Math.abs(newY / this.bgImgHeight)
      if (newY > 0) {
        scale = 1 + percent
        zIndex = 10
      } else {
        blur = Math.min(20 * percent, 20)
      }
      // 修改背景图片的状态
      if (newY < this.minTranslateY) {
        // 移动距离大于最小值
        zIndex = 10
        this.$refs.bgImg.style.paddingTop = 0
        this.$refs.bgImg.style.height = `${TITLE_HEIGHT}px`
        this.$refs.playbtn.style.display = 'none'
      } else {
        this.$refs.bgImg.style.paddingTop = '70%'
        this.$refs.bgImg.style.height = 0
        this.$refs.playbtn.style.display = ''
      }
      this.$refs.bgImg.style.zIndex = zIndex
      // 实现图片缩放
      this.$refs.bgImg.style[transform] = `scale(${scale})`
      // 实现高斯模糊
      this.$refs.filter.style[backdropFilter] = `blur(${blur}px)`
    }
  },
  components: {
    Scroll,
    SongList,
    Loading
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~assets/stylus/variable"
@import "~assets/stylus/mixin"

.music-list
  position: fixed
  z-index: 100
  top: 0
  left: 0
  bottom: 0
  right: 0
  background: $color-background
  .back
    position: absolute
    top: 0
    left: 6px
    z-index: 50
    cursor: pointer
    .icon-back
      display: block
      padding: 10px
      font-size: $font-size-large-x
      color: $color-theme
  .title
    position: absolute
    top: 0
    left: 10%
    z-index: 40
    width: 80%
    no-wrap()
    text-align: center
    line-height: 40px
    font-size: $font-size-large
    color: $color-text
  .bg-image
    position: relative
    width: 100%
    height: 0
    padding-top: 70%
    transform-origin: top
    background-size: cover
    .play-wrapper
      position: absolute
      bottom: 20px
      z-index: 50
      width: 100%
      .play
        box-sizing: border-box
        width: 135px
        padding: 7px 0
        margin: 0 auto
        text-align: center
        border: 1px solid $color-theme
        color: $color-theme
        border-radius: 100px
        font-size: 0
        .icon-play
          display: inline-block
          vertical-align: middle
          margin-right: 6px
          font-size: $font-size-medium-x
        .text
          display: inline-block
          vertical-align: middle
          font-size: $font-size-small
    .filter
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      background: rgba(7, 17, 27, 0.4)
  .bg-layer
    position: relative
    height: 100%
    background: $color-background
  .list
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    background: $color-background
    .song-list-wrapper
      padding: 20px 30px
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>