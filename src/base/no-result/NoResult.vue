<template>
  <div class="no-result">
    <div class="no-result-icon"></div>
    <div class="no-result-text">{{text}}</div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: 'Sorry，暂无找到相关结果'
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~assets/stylus/variable'
@import "~assets/stylus/mixin"

.no-result
  text-align: center
  .no-result-icon
    width: 86px
    height: 90px
    margin: 0 auto
    bg-image('no-result')
    background-size: 86px 90px
  .no-result-text
    margin-top: 30px
    font-size: $font-size-medium
    color: $color-text-d
</style>