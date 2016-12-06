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

const ChooseProxy = {
  template: '#proxies-template',
  data() {
    return {
      proxy: proxies[0],
      proxies: proxies,
    }
  },
  methods: {
    choseProxy(evt) {
      this.proxy = evt.target.textContent
    }
  }
}

const routes = [
  { path: '/', component: Main },
  { path: '/proxies', component: ChooseProxy }
]

const router = new VueRouter({
  routes,
  linkActiveClass: 'active',
})

const app = new Vue({
  router
}).$mount('#app')
