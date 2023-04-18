// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui';
import qs from 'qs'
import 'element-ui/lib/theme-chalk/index.css';

axios.defaults.baseURL='http://10.68.119.139/api'
// axios.defaults.withCredentials = true
Vue.prototype.$axios = axios
Vue.prototype.$qs = qs
Vue.use(ElementUI)
new Vue({
  el: '#app',
  axios, 
  router,
  components: { App },
  template: '<App/>'
})
