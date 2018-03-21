<template>
  <div class="m-slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="slider-ctrl">
      <span class="dot" v-for="(item, index) in sliderCtrls" :key="index" :class="{active: currentIndex === index}"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import {addClass} from 'assets/js/dom.js'
export default {
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 3000
    }
  },
  mounted() {
    setTimeout(() => {
      this._setSliderWidth()
      this._initSliderCtrl()
      this._initSlider()
      if (this.autoPlay) {
        this._play()
      }
    }, 20)
    // 监听窗口大小改变
    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this._setSliderWidth(true)
      this.slider.refresh()
    })
  },
  data() {
    return {
      sliderCtrls: [],
      currentIndex: 0
    }
  },
  methods: {
    _play() {
      let currentIndex = this.currentIndex + 1
      if (this.loop) {
        currentIndex += 1
      }
      this.timer = setTimeout(() => {
        this.slider.goToPage(currentIndex, 0, 400)
      }, this.interval)
    },
    _initSliderCtrl() {
      this.sliderCtrls = new Array(this.children.length)
    },
    _setSliderWidth(isResize) {
      // 获取元素
      this.children = this.$refs.sliderGroup.children
      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth
      for (var i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClass(child, 'slider-item')
        // 设置宽度
        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      if (this.loop && !isResize) {
        width += 2 * sliderWidth
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: true,
        snapLoop: this.loop,
        snapThreshold: 0.3,
        snapSpeed: 400
      })
      this.slider.on('scrollEnd', () => {
        let currentIndex = this.slider.getCurrentPage().pageX
        if (this.loop) {
          currentIndex -= 1
        }
        this.currentIndex = currentIndex
        if (this.autoPlay) {
          clearTimeout(this.timer)
          this._play()
        }
      })
    }
  },
  destroyed() {
    clearTimeout(this.timer)
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~assets/stylus/variable.styl"
.m-slider
  position: relative
  min-height: 1px
  .slider-group
    position: relative
    overflow: hidden
    white-space: nowrap
    .slider-item
      float: left
      box-sizing: border-box
      overflow: hidden
      text-align: center
      a
        display: block
        width: 100%
        overflow: hidden
        text-decoration: none
      img
        display: block
        width: 100%
  .slider-ctrl
    position: absolute
    right: 0
    left: 0
    bottom: 12px
    text-align: center
    font-size: 0
    .dot
      display: inline-block
      margin: 0 4px
      width: 8px
      height: 8px
      border-radius: 50%
      background: $color-text-l
      &.active
        width: 20px
        border-radius: 5px
        background: $color-text-ll
</style>
