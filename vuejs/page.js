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
    editProxy(state, payload) {
      // let index = state.proxies.indexOf(payload.proxy)
      // Vue.set(state.proxies, index, payload.values)
      payload.proxy.name = payload.values.name
      payload.proxy.addr = payload.values.addr
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
    return {
      proxy: null,
      errors: {},
      title: '',
      name: '',
      addr: ''
    }
  },
  created() {
    let name = this.$route.params.name
    if (name !== undefined) {
      let proxy = this.$store.state.proxies.find(x => x.name === name)
      this.proxy = proxy
      this.title = `Editing Proxy "${proxy.name}"`
      this.name = proxy.name
      this.addr = proxy.addr
    } else {
      this.proxy = null
      this.title = 'Add New Proxy'
    }
  },
  methods: {
    hasError(name) {
      return name in this.errors
    },
    nameIsAlreadyUsed(proxy, name) {
      return this.$store.state.proxies.some(
        x => x.name.toLowerCase() === name.toLowerCase() && proxy !== x)
    },
    submit() {
      if (this.name === '') {
        Vue.set(this.errors, 'name', 'Name must not be blank')
      } else {
        Vue.delete(this.errors, 'name')
      }
      if (this.nameIsAlreadyUsed(this.proxy, this.name)) {
        Vue.set(this.errors, 'name', 'Name is already used')
      } else {
        Vue.delete(this.errors, 'name')
      }
      if (this.addr === '') {
        Vue.set(this.errors, 'addr', 'Address must not be blank')
      } else {
        Vue.delete(this.errors, 'addr')
      }
      if (Object.keys(this.errors).length > 0) {
        return
      }

      let values = {name: this.name, addr: this.addr}
      if (this.proxy === null) {
        this.$store.commit('addProxy', values)
      } else {
        this.$store.commit('editProxy', {proxy: this.proxy, values})
      }
      this.$router.go(-1)
    }
  }
}

const routes = [
  { path: '/', component: Main },
  { path: '/proxies', component: ChooseProxy },
  { path: '/proxies/edit', component: EditProxies },
  { path: '/proxies/add', component: EditProxy },
  { path: '/proxies/:name/edit', component: EditProxy },
]

const router = new VueRouter({
  routes,
  linkActiveClass: 'active',
})

const app = new Vue({
  router,
  store,
}).$mount('#app')
