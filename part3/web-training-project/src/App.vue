<template lang="pug">
  #app
      #nav.bg-dark.white
        router-link(to='/') Home
        |  |  
        router-link(to='/about') About
        |  |  
        router-link(to='/trending', v-bind:trendingrepos='trendingRepos') Trending
        
      .pv7(v-if="loading")
        pulse-loader(:loading='loading', :color='color', :size='size')
        p Fetching Trending Repositories
      router-view(v-else)
</template>


<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import axios from 'axios';

@Component({
  components: {
    PulseLoader,
  }
})
export default class App extends Vue{
  
  loading:boolean = true
  trendingRepos:Array<Object> = [{html_url: 'a', full_name: 'b', stargazers_count: 0, description: 'c'}]

  async getTrendingRepos(): Promise<void> {
    console.log('Github API Call');
    var yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
    var url = 'https://api.github.com/search/repositories';

    return await axios.get(url, {
      params: {
      'q': 'typescript',
      'sort': 'stars',
      'order': 'desc',
      'pushed': yesterday + '..*',
      }
    })
    .then(response => {
      this.loading = false;
      this.trendingRepos = response.data.items;
      var outdatedResults = this.trendingRepos.filter(item => {
          return new Date(item.updated_at) < yesterday;
      });
      console.log('Outdated Results', outdatedResults);
      console.log('Trending Repos:', this.trendingRepos);
    })
    .catch(error => {
      this.loading = false;
      console.log('Error: ', error);
    });
  }

  beforeMount(){
    this.getTrendingRepos();
  }  
}
</script>

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
