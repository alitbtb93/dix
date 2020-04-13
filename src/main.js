import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import vueRouter from 'vue-router'
import {routes} from './routes'
import {store} from './store'
import VueResource from 'vue-resource'

Vue.config.productionTip = false
Vue.use(vueRouter)
Vue.use(VueResource)

Vue.http.options.root = 'http://213.233.180.121:8000/api/sso';
export const router=new vueRouter({
  routes,
  mode:'history'
})
new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
