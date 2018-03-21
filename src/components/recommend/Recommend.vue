<template>
   <div class="recommend" ref='recommend'>
    <scroll ref="scroll" class="recommend-content" :data="dissList">
      <div>
        <!-- 幻灯片 -->
        <div class="slider-wrapper" v-if='recommendList.length'>
          <slider>
            <div v-for="item in recommendList" :key="item.id">
              <a :href="item.linkUrl">
                <img @load="loadImg" :src="item.picUrl" class="needsclick">
              </a>
            </div>
          </slider>
        </div>
        <!-- 歌单列表 -->
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li class="item" v-for="item in dissList" :key="item.dissid" @click='selected(item)'>
              <div class="icon">
                <img v-lazy="item.imgurl" height="60" />
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show='!dissList.length'>
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
   </div>
</template>

<script type="text/ecmascript-6">
import {getRecommend, getDissList} from 'api/recommend'
import {ERR_OK} from 'api/config'
import Slider from '@/base/slider/Slider'
import Scroll from '@/base/scroll/Scroll'
import Loading from '@/base/loading/Loading'
import {playlistMixin} from 'assets/js/mixin'

import {mapMutations} from 'vuex'

export default {
  mixins: [playlistMixin],
  data() {
    return {
      recommendList: [],
      dissList: [],
      sliderImgLoad: false
    }
  },
  components: {
    Slider,
    Scroll,
    Loading
  },
  created() {
    this._getRecommend()
    this._getDissList()
    // 延迟加载
    // setTimeout(() => {
    // }, 3100)
  },
  methods: {
    handlePlayList(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''

      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    selected(item) {
      this.$router.push({
        path: `/recommend/${item.dissid}`
      })
      // console.log(item)
      this.setDisc(item)
    },
    _getRecommend() {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          // console.log(res.data)
          this.recommendList = res.data.slider
        }
      })
    },
    _getDissList() {
      getDissList().then((res) => {
        if (res.code === ERR_OK) {
          console.log(res.data)
          this.dissList = res.data.list
        }
      })
    },
    loadImg() {
      if (!this.sliderImgLoad) {
        this.$refs.scroll.refresh()
        this.sliderImgLoad = true
      }
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~assets/stylus/variable"

.recommend
  position:fixed
  width: 100%
  top: 88px
  bottom: 0
  .recommend-content
    height: 100%
    overflow: hidden
    .slider-wrapper
      position: relative
      width: 100%
      overflow: hidden
      z-index: 3
    .recommend-list
      .list-title
        height: 65px
        line-height: 65px
        text-align: center
        font-size: $font-size-medium
        color: $color-theme
      .item
        display: flex
        box-sizing: border-box
        align-items: center
        padding: 0 20px 20px 20px
        .icon
          flex: 0 0 60px
          width: 60px
          padding-right: 20px
        .text
          display: flex
          flex-direction: column
          justify-content: center
          flex: 1
          line-height: 20px
          overflow: hidden
          font-size: $font-size-medium
          .name
            margin-bottom: 10px
            color: $color-text
          .desc
            color: $color-text-d
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>