<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input type="text" class="box" :placeholder='placeholder' v-model='query' ref='input'>
    <i v-show='query' class="icon-dismiss" @click='clear'></i>
  </div>
</template>

<script>
import {debounce} from 'assets/js/util'
export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲／歌手'
    }
  },
  data() {
    return {
      query: ''
    }
  },
  methods: {
    clear() {
      this.query = ''
    },
    // 设置关键词
    setQuery(q) {
      this.query = q
    },
    blur() {
      this.$refs.input.blur()
    }
  },
  created() {
    // 延时执行事件派发，做节流
    this.$watch('query', debounce((newQuery) => {
      this.$emit('query', newQuery)
    }, 300))
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~assets/stylus/variable'

.search-box
  display: flex
  align-items: center
  box-sizing: border-box
  width: 100%
  padding: 0 6px
  height: 40px
  background: $color-highlight-background
  border-radius: 6px
  .icon-search
    font-size: 24px
    color: $color-text-d
  .box
    flex: 1
    margin: 0 5px
    outline: none
    line-height: 18px
    background: $color-highlight-background
    color: $color-text
    font-size: $font-size-medium
    &::placeholder
      color: $color-text-d
  .icon-dismiss
    font-size: 16px
    color: $color-text-d
</style>