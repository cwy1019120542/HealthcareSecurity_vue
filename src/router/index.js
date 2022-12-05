import Vue from 'vue'
import Router from 'vue-router'
import home from '@/view/home'
import main from '@/view/main'
import insured_data from '@/view/insured_data'
import login from '@/view/login'
import settle_data from '@/view/settle_data'
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
          path: '/insured_data',
          component: insured_data
        }, 
        {
          path: '/settle_data',
          component: settle_data
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
