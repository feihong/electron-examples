const proxies = ['a', 'b', 'c']


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
  routes // short for routes: routes
})

const app = new Vue({
  router
}).$mount('#app')
