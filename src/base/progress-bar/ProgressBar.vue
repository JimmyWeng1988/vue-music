<template>
  <div class="progress-bar" ref='progressBar' @click='progressClick'>
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
            @touchstart.prevent="progressTouchStart"
            @touchmove.prevent ="progressTouchMove"
            @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {prefixStyle} from 'assets/js/dom'

const progressBtnWidth = 16
const transform = prefixStyle('transform')

export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.touch = {}
  },
  methods: {
    progressClick(e) {
      // console.log(e.offsetY+'...'+e.offsetX)
      // dom 元素偏移
      const rect = this.$refs.progressBar.getBoundingClientRect()
      const offsetWidth = e.pageX - rect.left
      this._offsetMove(offsetWidth)
      this._triggerPercent()
    },
    progressTouchStart(e) {
      this.touch.init = true
      // 记录起始位置
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove(e) {
      if (!this.touch.init) {
        return
      }
      // 计算移动距离
      const moveX = e.touches[0].pageX - this.touch.startX
      // 边界处理：不能小于0， 不能大于进度条的宽度
      const offsetX = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + moveX))
      this._offsetMove(offsetX)
    },
    progressTouchEnd() {
      this.touch.init = false
      this._triggerPercent()
    },
    // 触发器，返回进度百分比
    _triggerPercent() {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('progressupdate', percent)
    },
    _offsetMove(offsetX) {
      this.$refs.progress.style.width = `${offsetX}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetX}px, 0, 0)`
    }
  },
  watch: {
    percent(newPercent) {
      if (newPercent >= 0 && !this.touch.init) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const offsetWidth = barWidth * newPercent
        this._offsetMove(offsetWidth)
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~assets/stylus/variable"
.progress-bar
  height: 30px
  .bar-inner
    position: relative
    top: 13px
    height: 4px
    background: rgba(0, 0, 0, 0.3)
    .progress
      position: absolute
      height: 100%
      background: $color-theme
    .progress-btn-wrapper
      position: absolute
      left: -8px
      top: -13px
      width: 30px
      height: 30px
      .progress-btn
        position: relative
        top: 7px
        left: 7px
        box-sizing: border-box
        width: 16px
        height: 16px
        border: 3px solid $color-text
        border-radius: 50%
        background: $color-theme
</style>