<template>
  <div class="loading">
    <img height="30" src="./loading_halfcircle.svg" />
    <p class="desc">{{txt}}</p>
  </div>
</template>

<script>
export default {
  props: {
    txt: {
      type: String,
      default: '载入中...'
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~assets/stylus/variable"
.loading
  width: 100%
  text-align: center
  .desc
    line-height: 20px
    font-size: $font-size-small
    color: $color-text-l
</style>