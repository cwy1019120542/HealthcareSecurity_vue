import Vue from 'vue'
import Router from 'vue-router'
import home from '@/view/home'
import main from '@/view/main'
import insured_data_list from '@/view/insured_data_list'
import login from '@/view/login'
import settle_data_statistic from '@/view/settle_data_statistic'
import empty from '@/view/empty'
import change_password from '@/view/change_password'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: login,
    },
    {
      path: '/home',
      component: home,
      children: [
        {
          path: '/insured_data/list',
          component: insured_data_list
        }, 
        {
          path: '/settle_data/statistic',
          component: settle_data_statistic
        },
        {
          path: '/change_password',
          component: change_password
        }, 
        {
          path: '/empty',
          component: empty
        },
        {
          path: '/main', 
          component: main
        }, 
      ]
    }, 
    {
      path: '*',
      component: login
    }
  ]
})
