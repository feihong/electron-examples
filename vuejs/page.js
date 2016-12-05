const Foo = {
  template: '#foo-template'
}
const Bar = {
  template: '#bar-template'
}

const routes = [
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar }
]

const router = new VueRouter({
  routes // short for routes: routes
})

const app = new Vue({
  router
}).$mount('#app')
