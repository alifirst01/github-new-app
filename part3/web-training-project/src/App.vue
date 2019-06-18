<template lang="pug">
  #app
    vue-progress-bar
    
    #nav.bg-dark.pv4.ph5.tr
      router-link(to='/').f3.white Trending
      router-link(to='/issues').f3.white.ml4 Issues
    
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
