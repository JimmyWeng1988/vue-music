<template>
  <transition name="slide">
    <music-list :title="title" :bg-img="bgImg" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import {mapGetters} from 'vuex'
import {getSingerDetail} from 'api/singer'
import {ERR_OK} from 'api/config'
import {createSong} from 'assets/js/song'
import MusicList from 'comps/music-list/MusicList'

export default {
  data() {
    return {
      songs: []
    }
  },
  computed: {
    title() {
      return this.singer.name
    },
    bgImg() {
      return this.singer.avatar
    },
    ...mapGetters([
      'singer'
    ])
  },
  components: {
    MusicList
  },
  created() {
    this._getDetail()
    // console.log(this.singer)
  },
  methods: {
    _getDetail() {
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          // console.log(res.data.list[0])
          this.songs = this._serializeSongs(res.data.list)
        }
      })
    },
    _serializeSongs(list) {
      let res = []
      list.forEach((item) => {
        let {musicData} = item
        if (musicData.songid && musicData.albummid) {
          res.push(createSong(musicData))
        }
      })
      return res
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~assets/stylus/variable'

.singer-detail
  position: fixed
  z-index: 100
  top: 0
  left: 0
  width:100%
  height:100%
  background: $color-background-d

.slide-enter-active,.slide-leave-active
  transition: all 0.3s
.slide-enter,.slide-leave-to
  transform: translate3d(100%, 0, 0)
</style>