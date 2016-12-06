const proxies = [
  {name: 'Anaconda', addr: '111.111.111.111'},
  {name: 'Bananarama', addr: '222.222.222.222'},
  {name: 'Cornucopia', addr: '333.333.333.333'},
]


const store = new Vuex.Store({
  state: {
    currentProxy: proxies[0],
    proxies: proxies,
  },
  mutations: {
    setCurrentProxy(state, proxy) {
      state.currentProxy = proxy
    },
    addProxy(state, proxy) {
      state.proxies.push(proxy)
    },
    deleteProxy(state, proxy) {
      let delIndex = state.proxies.indexOf(proxy)
      state.proxies.splice(delIndex, 1)
    },
  }
})

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
  computed: {
    currentProxy() {
      return this.$store.state.currentProxy
    },
    proxies() {
      return this.$store.state.proxies
    },
  },
  methods: {
    choseProxy(evt) {
      let name = evt.target.textContent
      let proxy = this.$store.state.proxies.find(x => x.name === name)
      this.$store.commit('setCurrentProxy', proxy)
    }
  }
}

const EditProxies = {
  template: '#edit-proxies-template',
  computed: {
    currentProxy() {
      return this.$store.state.currentProxy
    },
    proxies() {
      return this.$store.state.proxies
    },
  },
  methods: {
    deleteProxy(name) {
      let proxy = this.$store.state.proxies.find(x => x.name === name)
      this.$store.commit('deleteProxy', proxy)
    }
  }
}

const routes = [
  { path: '/', component: Main },
  { path: '/proxies', component: ChooseProxy },
  { path: '/proxies/edit', component: EditProxies },
]

const router = new VueRouter({
  routes,
  linkActiveClass: 'active',
})

const app = new Vue({
  router,
  store,
}).$mount('#app')
