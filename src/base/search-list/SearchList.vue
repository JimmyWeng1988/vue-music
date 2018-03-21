<template>
  <div class="search-list" v-show='searches.length'>
    <ul>
      <li class="search-item" v-for="(item, index) in searches" :key='index' @click='select(item)'>
        <span class="text">{{item}}</span>
        <span class="clear">
          <i class="icon-delete" @click.stop="del(item)"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    searches: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    select(item) {
      this.$emit('select', item)
    },
    del(item) {
      this.$emit('del', item)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~assets/stylus/variable'

.search-list
  .search-item
    display: flex
    align-items: center
    height: 40px
    overflow: hidden
    &.list-enter-active, &.list-leave-active
      transition: all 0.1s
    &.list-enter, &.list-leave-to
      height: 0
    .text
      flex: 1
      color: $color-text-l
    .icon
      extend-click()
      .icon-delete
        font-size: $font-size-small
        color: $color-text-d
</style>