<template lang="pug">
  #app
    vue-progress-bar
    #nav.bg-dark.pv3.ph4.pv4-ns.ph5-ns.tr
      router-link(to='/').f4.f3-ns.white Trending
      router-link(to='/issues').f4.f3-ns.white.ml3.ml4-ns Issues
    
    #app-main-content.tc
      router-view
</template>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
}
#nav {
  a {
    text-decoration: none;
    &.router-link-exact-active {
      text-decoration: underline;
    }
  }
}
</style>
