const proxies = ['anaconda', 'bananarama', 'cornucopia']


const Main = {
  template: '#main-template',
  data() {
    return {
      address: '123.0.0.1',
      proxyAddress: '456.0.0.1',
    }
  }
}
const Proxies = {
  template: '#proxies-template',
  data() {
    return {
      proxy: proxies[0],
      proxies: proxies,
    }
  }
}

const routes = [
  { path: '/', component: Main },
  { path: '/proxies', component: Proxies }
]

const router = new VueRouter({
  routes,
  linkActiveClass: 'active',
})

const app = new Vue({
  router
}).$mount('#app')
