import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'comps/recommend/Recommend'
import Rank from 'comps/rank/Rank'
import Singer from 'comps/singer/Singer'
import SingerDetail from 'comps/singer-detail/SingerDetail'
import Search from 'comps/search/Search'
import Disc from 'comps/disc/Disc'
import TopList from 'comps/top-list/TopList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          // 歌单的ID作为子路由
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          // ID作为子路由
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    }
  ]
})
