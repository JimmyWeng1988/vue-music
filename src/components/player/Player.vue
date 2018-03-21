<template>
  <div class="player" v-show='playList.length > 0'>
    <transition name="normal"
                @enter='enter'
                @after-enter='afterEnter'
                @leave='leave'
                @after-leave='afterLeave'
    >
      <div class="normal-player" v-show='fullScreen'>
        <div class="background">
          <img :src="currentSong.cover" width="100%" height="100%" />
        </div>
        <!-- 顶部 （返回／标题／副标题）-->
        <div class="top">
          <div class="back" @click='back'>
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle" @touchstart.prevent='middleTouchStart'
                            @touchmove.prevent='middleTouchMove'
                            @touchend.prevent="middleTouchEnd">
          <!-- 唱片图片转动页面 -->
          <div class="middle-l" ref='middleCd'>
            <div class="cd-wrapper" ref='cdwrapper'>
              <div class="cd" :class='cdClass'>
                <img :src="currentSong.cover" class="image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <!-- 歌词播放页面 -->
          <!-- 引用scroll组件 -->
          <scroll class="middle-r" ref='lyricList' :data='currentLyric && currentLyric.lines'>
            <div class="lyric-wrapper">
              <div v-if='currentLyric'>
                <p ref='lyricLine'
                    class="text"
                    v-for="(line, index) in currentLyric.lines"
                    :key='index'
                    :class="{'current':currentLineNum === index}"
                >{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <!-- 操作功能区 -->
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <div class="time time-l">{{_format(currentTime)}}</div>
            <div class="progress-bar-wrapper">
              <progress-bar :percent='percent' @progressupdate='progressUpdate'></progress-bar>
            </div>
            <div class="time time-r">{{_format(currentSong.duration)}}</div>
          </div>
          <div class="operators">
            <div class="icon i-left" @click='changeMode'>
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableClass">
              <i class="icon-prev" @click='prev'></i>
            </div>
            <div class="icon i-center">
              <i :class="playIcon" @click='togglePlaying'></i>
            </div>
            <div class="icon i-right" :class="disableClass">
              <i class="icon-next" @click='next'></i>
            </div>
            <div class="icon i-right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- 迷你播放 -->
    <transition name="mini">
    <div class="mini-player" v-show='!fullScreen' @click='open'>
      <div class="icon">
        <img :class="cdClass" width="40" height="40" :src="currentSong.cover" />
      </div>
      <div class="text">
        <h2 class="name" v-html="currentSong.name"></h2>
        <p class="desc" v-html="currentSong.singer"></p>
      </div>
      <div class="control">
        <progress-circle :radius='circleRadius' :percent='percent'>
          <!-- 要阻止冒泡 -->
          <i :class="miniPlayIcon" class="icon-mini" @click.stop="togglePlaying"></i>
        </progress-circle>
      </div>
      <!-- 歌曲列表 -->
      <div class="control">
        <i class="icon-playlist"></i>
      </div>
    </div>
    </transition>
    <audio ref='audio' :src="currentSong.url"
        @play='songReady'
        @error='songError'
        @timeupdate='updateTime'
        @ended='end'
    ></audio>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
// 导入 动画插件
import animations from 'create-keyframe-animation'
import {prefixStyle} from 'assets/js/dom'
import ProgressBar from '@/base/progress-bar/ProgressBar'
import ProgressCircle from '@/base/progress-circle/ProgressCircle'
import {playMode} from 'assets/js/config'
import {shuffle} from 'assets/js/util'
import LyricParser from 'lyric-parser'
import Scroll from '@/base/scroll/Scroll'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')

export default {
  data() {
    return {
      // 歌曲是否准备好了
      isReady: false,
      // 歌曲当前播放时间
      currentTime: 0,
      // 圆形进度条
      circleRadius: 32,
      // 歌词
      currentLyric: null,
      currentLineNum: 0,

      currentShow: 'cd',
      playingLyric: ''
    }
  },
  computed: {
    cdClass() {
      return this.playing ? 'play' : 'play pause'
    },
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniPlayIcon() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    iconMode() {
      return this.mode === playMode.seq ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    disableClass() {
      return this.isReady ? '' : 'disable'
    },
    percent() {
      return this.currentTime / this.currentSong.duration
    },
    ...mapGetters([
      'fullScreen',
      'playList',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList'
    ])
  },
  created() {
    this.touch = {}
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!newSong.id) {
        return
      }
      if (newSong.id === oldSong.id) {
        return
      }

      if (this.currentLyric) {
        this.currentLyric.stop()
      }
      this.playingLyric = ''
      // 加延时，使其加载完成 ,兼容手机浏览器
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$refs.audio.play()
        this.getLyric()
      }, 1000)
    },
    // 监听 playing 的状态
    playing(newPlaying) {
      console.log('状态变化：' + newPlaying)
      this.$nextTick(() => {
        const audio = this.$refs.audio
        newPlaying ? audio.play() : audio.pause()
      })
    }
  },
  methods: {
    // 播放／暂停
    togglePlaying() {
      if (!this.isReady) {
        return
      }
      this.setPlayingState(!this.playing)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    // 歌曲是否准备好
    songReady() {
      this.isReady = true
    },
    // 倘若歌曲播放源出错，也可以切换
    songError() {
      this.isReady = true
    },
    // 歌曲播放进度更新
    updateTime(e) {
      this.currentTime = e.target.currentTime
    },
    // 切换模式
    changeMode() {
      let mode = (this.mode + 1) % 3
      this.setPlayMode(mode)

      let list = null

      // 判断当前模式
      if (this.mode === playMode.random) {
        console.log('随机---')
        // 打乱成随机序列
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      // 设置播放模式之前，应该重置 当前播放歌曲的索引
      this._resetCurrentIndex(list)
      this.setPlayList(list)
    },

    // 左右滑动
    middleTouchStart(e) {
      this.touch.init = true
      const theTouch = e.touches[0]
      // 记录 滑动 起点
      this.touch.startX = theTouch.pageX
      this.touch.startY = theTouch.pageY
    },
    middleTouchMove(e) {
      if (!this.touch.init) {
        return
      }
      const theTouch = e.touches[0]
      let delX = theTouch.pageX - this.touch.startX
      let delY = theTouch.pageY - this.touch.startY
      // 只支持 横向手势动作
      if (Math.abs(delY) > Math.abs(delX)) {
        return
      }
      // 判断当前显示
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      const width = Math.min(0, Math.max(-window.innerWidth, left + delX))
      this.touch.movePercent = Math.abs(width / window.innerWidth)
      this.$refs.lyricList.$el.style[transform] = `translate3d(${width}px, 0, 0)`
      this.$refs.lyricList.$el.style[transitionDuration] = 0
      // cd画面 变半透明 消失
      this.$refs.middleCd.style.opacity = 1 - this.touch.movePercent
      this.$refs.middleCd.style[transitionDuration] = 0
    },
    middleTouchEnd() {
      let moveWidth = 0
      let opacity = 1
      if (this.currentShow === 'cd') {
        // 右向 左
        if (this.touch.movePercent > 0.1) {
          // 修改状态
          this.currentShow = 'lyric'
          moveWidth = -window.innerWidth
          opacity = 0
        } else {
          moveWidth = 0
          opacity = 1
        }
      } else {
        if (this.touch.movePercent < 0.9) {
          moveWidth = 0
          opacity = 1
          // 修改状态
          this.currentShow = 'cd'
        } else {
          moveWidth = -window.innerWidth
          opacity = 0
        }
      }
      const time = 300
      // cd 页面的透明度改变
      this.$refs.middleCd.style.opacity = opacity
      this.$refs.middleCd.style[transitionDuration] = `${time}ms`
      // 计算完数值，开始移动
      this.$refs.lyricList.$el.style[transform] = `translate3d(${moveWidth}px, 0, 0)`
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
    },

    _resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    // 更新当前歌曲的播放进度
    progressUpdate(percent) {
      percent = Math.min(1, percent)
      const currentTime = this.currentSong.duration * percent
      this.$refs.audio.currentTime = currentTime
      // 更新完进度后，播放
      if (!this.playing) {
        this.togglePlaying()
      }
      // 同步歌词的位置
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    // 结束一首歌的时候
    end() {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    loop() {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    // 上一首
    prev() {
      if (!this.isReady) {
        return
      }
      if (this.playList.length === 1) {
        this.loop()
        return
      } else {
        let index = this.currentIndex - 1
        if (index < 0) {
          index = this.playList.length - 1
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
      }
      // 每次切换，设置标志，等待ready
      this.isReady = false
    },
    // 下一首
    next() {
      if (!this.isReady) {
        return
      }
      if (this.playList.length === 1) {
        this.loop()
        return
      } else {
        let index = this.currentIndex + 1
        // 顺序播放
        if (index === this.playList.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
      }
      // 每次切换，设置标志，等待ready
      this.isReady = false
    },
    back() {
      this.setFullScreen(false)
    },
    open() {
      this.setFullScreen(true)
    },
    enter(el, done) {
      const {x, y, scale} = this._getPosAndScale()
      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      }
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })
      animations.runAnimation(this.$refs.cdwrapper, 'move', done)
    },
    afterEnter() {
      animations.unregisterAnimation('move')
      this.$refs.cdwrapper.style.animation = ''
    },
    leave(el, done) {
      this.$refs.cdwrapper.style.transition = 'all 0.4s'
      const {x, y, scale} = this._getPosAndScale()
      this.$refs.cdwrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      this.$refs.cdwrapper.addEventListener('transitionend', done)
    },
    afterLeave() {
      this.$refs.cdwrapper.style.transition = ''
      this.$refs.cdwrapper.style[transform] = ''
    },
    getLyric() {
      this.currentSong.getLyric().then((lyric) => {
        if (this.currentSong.lyric !== lyric) {
          return
        }
        this.currentLyric = new LyricParser(lyric, this.handleLyric)
        // console.log(this.currentLyric)
        if (this.playing) {
          this.currentLyric.play()
        }
      }).catch(() => {
        this.currentLyric = null
        this.playingLyric = ''
        this.currentLineNum = 0
      })
    },
    // 使当前歌词高亮
    handleLyric({lineNum, txt}) {
      // console.log(txt)
      this.currentLineNum = lineNum
      // 为了高亮在较好的居中位置
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        // 滚动当前行
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        // 五行以内 ，滚动到顶部
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
      this.playingLyric = txt
    },
    _format(duration) {
      duration = duration | 0
      const minute = duration / 60 | 0
      const second = duration % 60
      // return `${this._beautyNum(minute)}:${this._beautyNum(second)}`
      return `${this._pad(minute)}:${this._pad(second)}`
    },
    // _beautyNum(num) {
    //   if (num >= 10) {
    //     return num
    //   } else {
    //     return '0' + num
    //   }
    // },
    // 补全数位
    _pad(num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    _getPosAndScale() {
      const smallWidth = 40
      const smallLeft = 20 + 20
      const smallBottom = 10 + 20

      const bigTop = 80
      const bigWidth = window.innerWidth * 0.8
      const scale = smallWidth / bigWidth
      // x轴 平移的距离
      const x = -(window.innerWidth / 2 - smallLeft)
      // y轴
      const y = window.innerHeight - bigTop - bigWidth / 2 - smallBottom
      return {x, y, scale}
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    })
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~assets/stylus/variable"
@import "~assets/stylus/mixin"

.player
  .normal-player
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 150
    background: $color-background
    .background
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 100%
      z-index: -1
      opacity: 0.6
      filter: blur(20px)
    .top
      position: relative
      margin-bottom: 25px
      .back
        position absolute
        top: 0
        left: 6px
        z-index: 50
        .icon-back
          display: block
          padding: 9px
          font-size: $font-size-large-x
          color: $color-theme
          transform: rotate(-90deg)
      .title
        width: 70%
        margin: 0 auto
        line-height: 40px
        text-align: center
        no-wrap()
        font-size: $font-size-large
        color: $color-text
      .subtitle
        line-height: 20px
        text-align: center
        font-size: $font-size-medium
        color: $color-text
    .middle
      position: fixed
      width: 100%
      top: 80px
      bottom: 170px
      white-space: nowrap
      font-size: 0
      .middle-l
        display: inline-block
        vertical-align: top
        position: relative
        width: 100%
        height: 0
        padding-top: 80%
        .cd-wrapper
          position: absolute
          left: 10%
          top: 0
          width: 80%
          height: 100%
          .cd
            width: 100%
            height: 100%
            box-sizing: border-box
            border: 10px solid rgba(255, 255, 255, 0.1)
            border-radius: 50%
            &.play
              animation: rotate 20s linear infinite
            &.pause
              animation-play-state: paused
            .image
              position: absolute
              left: 0
              top: 0
              width: 100%
              height: 100%
              border-radius: 50%

        .playing-lyric-wrapper
          width: 80%
          margin: 30px auto 0 auto
          overflow: hidden
          text-align: center
          .playing-lyric
            height: 20px
            line-height: 20px
            font-size: $font-size-medium
            color: $color-text-l
      .middle-r
        display: inline-block
        vertical-align: top
        width: 100%
        height: 100%
        overflow: hidden
        .lyric-wrapper
          width: 80%
          margin: 0 auto
          overflow: hidden
          text-align: center
          .text
            line-height: 32px
            color: $color-text-l
            font-size: $font-size-medium
            &.current
              color: $color-text
    .bottom
      position: absolute
      bottom: 50px
      width: 100%
      .dot-wrapper
        text-align: center
        font-size: 0
        .dot
          display: inline-block
          vertical-align: middle
          margin: 0 4px
          width: 8px
          height: 8px
          border-radius: 50%
          background: $color-text-l
          &.active
            width: 20px
            border-radius: 5px
            background: $color-text-ll
      .progress-wrapper
        display: flex
        align-items: center
        width: 80%
        margin: 0px auto
        padding: 10px 0
        .time
          color: $color-text
          font-size: $font-size-small
          flex: 0 0 30px
          line-height: 30px
          width: 30px
          &.time-l
            text-align: left
            padding-right: 7px
          &.time-r
            text-align: right
            padding-left: 7px
        .progress-bar-wrapper
          flex: 1
      .operators
        display: flex
        align-items: center
        .icon
          flex: 1
          color: $color-theme
          &.disable
            color: $color-theme-d
          i
            font-size: 30px
        .i-left
          text-align: right
        .i-center
          padding: 0 20px
          text-align: center
          i
            font-size: 40px
        .i-right
          text-align: left
        .icon-favorite
          color: $color-sub-theme
    &.normal-enter-active, &.normal-leave-active
      transition: all 0.4s
      .top, .bottom
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
    &.normal-enter, &.normal-leave-to
      opacity: 0
      .top
        transform: translate3d(0, -100px, 0)
      .bottom
        transform: translate3d(0, 100px, 0)
  .mini-player
    display: flex
    align-items: center
    position: fixed
    left: 0
    bottom: 0
    z-index: 180
    width: 100%
    height: 60px
    background: $color-highlight-background
    &.mini-enter-active, &.mini-leave-active
      transition: all 0.4s
    &.mini-enter, &.mini-leave-to
      opacity: 0
    .icon
      flex: 0 0 40px
      width: 40px
      padding: 0 10px 0 20px
      img
        border-radius: 50%
        &.play
          animation: rotate 10s linear infinite
        &.pause
          animation-play-state: paused
    .text
      display: flex
      flex-direction: column
      justify-content: center
      flex: 1
      line-height: 20px
      overflow: hidden
      .name
        margin-bottom: 2px
        no-wrap()
        font-size: $font-size-medium
        color: $color-text
      .desc
        no-wrap()
        font-size: $font-size-small
        color: $color-text-d
    .control
      flex: 0 0 30px
      width: 30px
      padding: 0 10px
      .icon-play-mini, .icon-pause-mini, .icon-playlist
        font-size: 30px
        color: $color-theme-d
      .icon-mini
        font-size: 32px
        position: absolute
        left: 0
        top: 0

@keyframes rotate
  0%
    transform: rotate(0)
  100%
    transform: rotate(360deg)
</style>