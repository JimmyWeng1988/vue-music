<template>
  <scroll class="listview" ref='listview'
          :data="listdata"
          :listenScroll="listenScroll"
          :probeType="probeType"
          @scroll='scroll'>
    <ul>
      <li class="list-group" v-for="(group,index) in listdata" :key='index' ref="listgroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.items" @click='selectItem(item)' class="list-group-item" :key="item.id">
            <img v-lazy="item.avatar" class="avatar" />
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item,index) in shortcutList" class="item" :key="index" :data-index="index" :class="{current:currentIndex===index}">{{item}}</li>
      </ul>
    </div>
    <div class="list-group-fixed" v-show='fixedTitle' ref='fixedtitle'>
      <h2 class="fixed-title" v-text="fixedTitle"></h2>
    </div>
    <div class="loading-container" v-show='!listdata.length'>
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from '@/base/scroll/Scroll'
import Loading from '@/base/loading/Loading'
import {getData} from 'assets/js/dom'
// 快捷列表 元素的高度
const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30

export default {
  props: {
    listdata: {
      type: Array,
      default: null
    }
  },
  // 这里创建变量 不用于渲染
  created() {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      listGroupDiff: -1
    }
  },
  computed: {
    shortcutList() {
      return this.listdata.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    // 固定标题
    fixedTitle() {
      if (this.scrollY > 0) {
        return ''
      }
      return this.listdata[this.currentIndex] ? this.listdata[this.currentIndex].title : ''
    }
  },
  components: {
    Scroll,
    Loading
  },
  methods: {
    selectItem(item) {
      this.$emit('selected', item)
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    onShortcutTouchStart(e) {
      let anchorIndex = getData(e.target, 'index')
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      // this.$refs.listview.scrollToElement(this.$refs.listgroup[anchorIndex], 0)
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove(e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      let offsetY = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      let anchorIndex = parseInt(this.touch.anchorIndex) + offsetY
      // console.log(anchorIndex)
      this._scrollTo(anchorIndex)
    },
    refresh() {
      this.$refs.listview.refresh()
    },
    _scrollTo(index) {
      // console.log('index:' + index)
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > (this.listHeight.length - 2)) {
        index = this.listHeight.length - 2
      }
      // 当前高度 所在的集合
      this.scrollY = -this.listHeight[index]
      this.$refs.listview.scrollToElement(this.$refs.listgroup[index], 0)
    },
    // 计算 每个分组集合的高度 利用其定位
    _calHeight() {
      let list = this.$refs.listgroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  watch: {
    listdata() {
      setTimeout(() => {
        this._calHeight()
      }, 20)
    },
    scrollY(newY) {
      const listHeight = this.listHeight
      // 当滚动到顶部 newY > 0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 在中间部分
      for (let i = 0; i < listHeight.length - 1; i++) {
        let h1 = listHeight[i]
        let h2 = listHeight[i + 1]
        if ((-newY >= h1 && -newY < h2)) {
          this.currentIndex = i
          // console.log(this.currentIndex)
          this.listGroupDiff = h2 + newY
          return
        }
      }
      // 滚动到底部
      this.currentIndex = listHeight.length - 2
    },
    //
    listGroupDiff(newDiff) {
      let fixedTop = (newDiff > 0 && newDiff < TITLE_HEIGHT) ? newDiff - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixedtitle.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~assets/stylus/variable"
.listview
  position: relative
  width: 100%
  height: 100%
  overflow: hidden
  background: $color-background
  .list-group
    padding-bottom: 30px
    .list-group-title
      height: 30px
      line-height: 30px
      padding-left: 20px
      font-size: $font-size-small
      color: $color-text-l
      background: $color-highlight-background
    .list-group-item
      display: flex
      align-items: center
      padding: 20px 0 0 30px
      .avatar
        width: 50px
        height: 50px
        border-radius: 50%
      .name
        margin-left: 20px
        color: $color-text-l
        font-size: $font-size-medium
  .list-shortcut
    position: absolute
    z-index: 30
    right: 0
    top: 50%
    transform: translateY(-50%)
    width: 20px
    padding: 20px 0
    border-radius: 10px
    text-align: center
    background: $color-background-d
    font-family: Helvetica
    .item
      padding: 3px
      line-height: 1
      color: $color-text-l
      font-size: $font-size-small
      &.current
        color: $color-theme
  .list-group-fixed
    position: absolute
    top: 0
    left: 0
    width: 100%
    .fixed-title
      height: 30px
      line-height: 30px
      padding-left: 20px
      font-size: $font-size-small
      color: $color-text-l
      background: $color-highlight-background
  .loading-container
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
</style>