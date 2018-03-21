import {mapGetters} from 'vuex'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  // ready
  mounted() {
    this.handlePlayList(this.playList)
  },
  // 激活的时候
  activated() {
    this.handlePlayList(this.playList)
  },
  watch: {
    playList(newList) {
      this.handlePlayList(newList)
    }
  },
  methods: {
    handlePlayList() {
      throw new Error('component must implement handlePlayList method')
    }
  }
}