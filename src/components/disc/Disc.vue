<template>
  <transition name='slide'>
    <music-list :title='title' :bg-img="bgImg" :songs='songs'></music-list>
  </transition>
</template>

<script>
import MusicList from 'comps/music-list/MusicList'
import {mapGetters} from 'vuex'
import {getDiscSongs} from 'api/recommend'
import {ERR_OK} from 'api/config'
import {createSong} from 'assets/js/song'
export default {
  computed: {
    ...mapGetters([
      'disc'
    ]),
    title() {
      return this.disc.dissname
    },
    bgImg() {
      return this.disc.imgurl
    }
  },
  created() {
    this._getDiscDetail()
  },
  methods: {
    _getDiscDetail() {
      if (!this.disc.dissid) {
        this.$router.push('/recommend')
        return
      }
      getDiscSongs(this.disc.dissid).then((res) => {
        if (res.code === ERR_OK) {
          console.log(res.cdlist[0])
          this.songs = this._normalizeSongs(res.cdlist[0].songlist)
        }
        // console.log(res)
      })
    },
    _normalizeSongs(list) {
      let res = []
      list.forEach((musicData) => {
        if (musicData.songmid && musicData.albummid) {
          res.push(createSong(musicData))
        }
      })
      return res
    }
  },
  data() {
    return {
      songs: []
    }
  },
  components: {
    MusicList
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

.slide-enter-active, .slide-leave-active
  transition: all 0.3s

.slide-enter, .slide-leave-to
  transform: translate3d(100%, 0, 0)
</style>