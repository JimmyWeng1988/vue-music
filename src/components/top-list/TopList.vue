<template>
  <transition name='slide'>
    <music-list :title='title' :bg-img='bgImg' :songs='songs' :rank='rank'></music-list>
  </transition>
</template>

<script>
import MusicList from 'comps/music-list/MusicList'
import {mapGetters} from 'vuex'
import {getTopListDetail} from 'api/rank'
import {ERR_OK} from 'api/config'
import {createSong} from 'assets/js/song'
export default {
  data() {
    return {
      songs: [],
      rank: true
    }
  },
  computed: {
    title() {
      return this.topList.topTitle
    },
    bgImg() {
      if (this.songs.length) {
        return this.songs[0].cover
      }
      return this.topList.picUrl
    },
    ...mapGetters([
      'topList'
    ])
  },
  created() {
    // console.log(this.topList)
    this._getTopList()
  },
  methods: {
    _getTopList() {
      if (!this.topList.id) {
        this.$router.push('/rank')
        return
      }
      getTopListDetail(this.topList.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.songlist)
        }
        // 修改
        // console.log(res)
      })
    },
    _normalizeSongs(list) {
      let res = []
      let songTmp
      list.forEach((item) => {
        songTmp = item.data
        if (songTmp.songmid && songTmp.albummid) {
          res.push(createSong(songTmp))
        }
      })
      return res
    }
  },
  components: {
    MusicList
  }
}
</script>
<style scoped lang="stylus" rel='stylesheet/stylus'>
.slide-enter-active, .slide-leave-active
  transition: all 0.3s

.slide-enter, .slide-leave-to
  transform: translate3d(100%, 0, 0)
</style>