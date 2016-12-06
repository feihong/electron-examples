const proxies = ['anaconda', 'bananarama', 'cornucopia']


const Foo = {
  template: '#main-template',
  data() {
    return {
      address: '123.0.0.1',
      proxyAddress: '456.0.0.1',
    }
  }
}
const Bar = {
  template: '#proxies-template',
  data() {
    return {
      proxies: proxies
    }
  }
}

const routes = [
  { path: '/', component: Foo },
  { path: '/proxies', component: Bar }
]

const router = new VueRouter({
  routes,
  linkActiveClass: 'active',
})

const app = new Vue({
  router
}).$mount('#app')
