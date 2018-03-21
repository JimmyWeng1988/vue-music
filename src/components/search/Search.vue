<template>
   <div class="search">
      <div class="search-box-wrapper">
        <search-box ref='searchBox' @query='onQueryChange'></search-box>
      </div>
      <div class="shortcut-wrapper" v-show='!query' ref='shortcutWrapper'>
        <scroll class="shortcut" :data='shortcutData' ref='shortcut'>
          <div>
            <!-- 热门搜索 -->
            <div class="hot-key">
              <h1 class="title">热门搜索</h1>
              <ul>
                <li @click='selectQuery(item.k)' class="item" v-for="(item,index) in hotKey" :key='index'>
                  <span>{{item.k}}</span>
                </li>
              </ul>
            </div>
            <!-- 热门搜索 END -->
            <!-- 搜索历史 -->
            <div class="search-history" v-show='searchHistory.length'>
              <h1 class="title">
                <span class="text">搜索历史</span>
                <span class="clear" @click.stop='showConfirm'>
                  <i class="icon-clear"></i>
                </span>
              </h1>
              <search-list :searches='searchHistory' @select='selectQuery' @del='delSearch'></search-list>
            </div>
          </div>
        </scroll>
      </div>
      <!-- end of shortcut -->
      <div ref="searchResult" class="search-result" v-show='query'>
        <suggest ref='suggest' :query="query" @listScroll='inputBlur' @select='saveSearch'></suggest>
      </div>
      <confirm ref='confirm' text='你确定要清空搜索历史么？' confirmBtnText='清空' @confirm='clearSearchHistory'></confirm>
      <router-view></router-view>
   </div>
</template>

<script type="text/ecmascript-6">
// 内嵌3个组件
// 搜索输入框／
// 搜索结果列表（内含滚动组件）
// 搜索历史列表
import SearchBox from '@/base/search-box/SearchBox'
import SearchList from '@/base/search-list/SearchList'
import Scroll from '@/base/scroll/Scroll'
import Confirm from '@/base/confirm/Confirm'
import Suggest from 'comps/suggest/Suggest'
import {getHotKey} from 'api/search'
import {ERR_OK} from 'api/config'
import {mapActions, mapGetters, mapMutations} from 'vuex'

import {playlistMixin} from 'assets/js/mixin'
import {deleteSearch, clearSearch} from 'assets/js/cache'

export default {
  mixins: [playlistMixin],
  data() {
    return {
      hotKey: [],
      query: '',
      shortcutData: []
    }
  },
  computed: {
    // shortcutData() {
    //   return this.hotKey.concat(this.searchHistory)
    // },
    ...mapGetters([
      'searchHistory'
    ])
  },
  watch: {
    searchHistory(newVal) {
      if (newVal) {
        this.shortcutData = this.hotKey.concat(this.searchHistory)
        console.log(this.shortcutData)
        this.$refs.suggest.refresh()
        this.$refs.shortcut.refresh()
      }
    }
  },
  methods: {
    handlePlayList(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''

      this.$refs.searchResult.style.bottom = bottom
      this.$refs.suggest.refresh()
      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.shortcut.refresh()
    },
    _getHotKey() {
      getHotKey().then((res) => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 9)
        }
        // console.log(res)
      })
    },
    onQueryChange(query) {
      this.query = query
    },
    // 热搜的选择
    selectQuery(key) {
      this.$refs.searchBox.setQuery(key)
    },
    inputBlur() {
      // 调用子组件的方法
      this.$refs.searchBox.blur()
    },
    // 插入搜索关键词,保存
    saveSearch() {
      console.log(5555000)
      this.saveSearchHistory(this.query)
      // this.setSearchHistory(this.searchHistory)
      // this.$refs.shortcut.refresh()
      this.$refs.suggest.refresh()
    },
    // 删除单个记录
    delSearch(item) {
      this.setSearchHistory(deleteSearch(item))
    },
    showConfirm() {
      this.$refs.confirm.show()
    },
    // 清空全部记录
    clearSearchHistory() {
      this.setSearchHistory(clearSearch())
    },
    ...mapActions([
      'saveSearchHistory'
    ]),
    ...mapMutations({
      setSearchHistory: 'SET_SEARCH_HISTORY'
    })
  },
  created() {
    this._getHotKey()
    setTimeout(() => {
      this.shortcutData = this.hotKey.concat(this.searchHistory)
    }, 500)
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Scroll,
    Confirm
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~assets/stylus/variable'
@import '~assets/stylus/mixin'

.search
  .search-box-wrapper
    margin: 20px
  .shortcut-wrapper
    position: fixed
    top: 178px
    bottom: 0
    width: 100%
    .shortcut
      height: 100%
      overflow: hidden
      .hot-key
        margin: 0 20px 20px 20px
        .title
          margin-bottom: 20px
          font-size: $font-size-medium
          color: $color-text-l
        .item
          display: inline-block
          padding: 5px 10px
          margin: 0 20px 10px 0
          border-radius: 6px
          background: $color-highlight-background
          font-size: $font-size-medium
          color: $color-text-d
      .search-history
        position: relative
        margin: 0 20px
        .title
          display: flex
          align-items: center
          height: 40px
          font-size: $font-size-medium
          color: $color-text-l
          .text
            flex: 1
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
  .search-result
    position: fixed
    width: 100%
    top: 178px
    bottom: 0
</style>