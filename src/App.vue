<template>
  <div id="app">
    <main-header></main-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import MainHeader from 'comps/main-header/MainHeader'
import Tab from 'comps/tab/Tab'
import Player from 'comps/player/Player'

export default {
  components: {
    MainHeader,
    Tab,
    Player
  }
}
</script>
