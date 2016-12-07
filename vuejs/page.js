const PROXIES = [
  {name: 'Anaconda', addr: '111.111.111.111'},
  {name: 'Bananarama', addr: '222.222.222.222'},
  {name: 'Dark Knight', addr: '444.444.444.444'},
  {name: 'Cornucopia', addr: '333.333.333.333'},
]


const store = new Vuex.Store({
  state: {
    currentProxy: PROXIES[0],
    proxies: PROXIES,
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
    choseProxy(proxy) {
      this.$store.commit('setCurrentProxy', proxy)
    }
  }
}

const EditProxies = {
  template: '#edit-proxies-template',
  computed: {
    proxies() {
      return this.$store.state.proxies
    },
  },
  methods: {
    isCurrentProxy(proxy) {
      return this.$store.state.currentProxy === proxy
    },
    deleteProxy(proxy) {
      this.$store.commit('deleteProxy', proxy)
    }
  }
}

const EditProxy = {
  template: '#edit-proxy-template',
  data() {
    return {name: '', addr: ''}
  },
  computed: {
    title() {
      return 'Add Proxy'
    }
  },
  methods: {
    submit() {
      let proxy = {name: this.state.name, addr: this.state.addr}
      this.$store.commit('addProxy', proxy)
    }
  }
}

const routes = [
  { path: '/', component: Main },
  { path: '/proxies', component: ChooseProxy },
  { path: '/proxies/edit', component: EditProxies },
  { path: '/proxies/add', component: EditProxy },
  { path: '/proxies/:index/edit', component: EditProxy },
]

const router = new VueRouter({
  routes,
  linkActiveClass: 'active',
})

const app = new Vue({
  router,
  store,
}).$mount('#app')
