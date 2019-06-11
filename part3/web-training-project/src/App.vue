<template lang="pug">
  #app
      #nav.bg-dark.white
        router-link(to='/') Home
        |  |  
        router-link(to='/about') About
        |  |  
        router-link(to='/trending', v-bind:trendingrepos='trendingRepos') Trending

      router-view
</template>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: white;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
