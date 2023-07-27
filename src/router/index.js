import Vue from 'vue'
import Router from 'vue-router'
import home from '@/view/home'
import main from '@/view/main'
import insured_data from '@/view/insured_data'
import login from '@/view/login'
import settle_data from '@/view/settle_data'
import empty from '@/view/empty'
import change_password from '@/view/change_password'
import insured_rate from '@/view/insured_rate'
import special_insured_rate from '@/view/special_insured_rate'
import staff from '@/view/staff'
import check_data from '@/view/check_data'
import civil_pay from '@/view/civil_pay'
import open_data from '@/view/open_data'
import user from '@/view/user'

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
        {
          path: '/insured_rate', 
          component: insured_rate
        }, 
        {
          path: '/special_insured_rate', 
          component: special_insured_rate
        },
        {
          path: '/staff', 
          component: staff, 
        },
        {
          path: '/check_data', 
          component: check_data, 
          name: 'check_data', 
        },
        {
          path: '/civil_pay', 
          component: civil_pay, 
          name: 'civil_pay', 
        },
        {
          path: '/open_data', 
          component: open_data, 
          name: 'open_data', 
        },
        {
          path: '/user', 
          component: user, 
          name: 'user', 
        },
      ]
    }, 
    {
      path: '*',
      component: login
    }
  ]
})
