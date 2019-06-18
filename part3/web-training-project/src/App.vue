<template lang="pug">
  #app
    vue-progress-bar
    #loading.w-40.center.pv6.tl(v-if="loading==0")
      h1.f3 {{loadingMessage.m1}}
      h3(v-if="'m2' in loadingMessage") {{loadingMessage.m2}}
    #app-content(v-else)
      #nav.bg-dark.pv4.ph5.tr
        router-link(to='/').f3.white Trending
        router-link(to='/issues').f3.white.ml4 Issues
      #app-main-content.tc
        router-view
      
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import axios from 'axios';

@Component
export default class App extends Vue{
    
  @Prop({default: 'default'})
  code: string

  loading:number = 1
  loadingMessage:Object = {}

  created() {
    // console.log('My code', this.code);
    // console.log('Route', this.$route.query)   
    var query = window.location.href;
    if(this.$store.getters.isLoggedIn == false && query.includes('code')){
      query = query.split('?')[1];
      var code = query.split('=')[1].split('#')[0];
      
      this.getGithubAccessToken(code).then(accessToken => {
          this.$store.dispatch('setCode', accessToken);
          this.$router.push('/issues');
      });
    };
  }

  async getGithubAccessToken(accessCode):Promise<string>{
    var tokenUrl = "https://github-app-login.foundersclubsoftware.now.sh/auth";

    this.loading = 0;
    this.loadingMessage = {m1: "Finishing GitHub login", m2: "It should only be a second or two…"};
    this.$Progress.start();
    console.log('Stating progress app', this.$Progress);
    return await axios({
      method: 'post',
      url: tokenUrl,
      data: {
      'code': accessCode,  
      'state': '12345',
      }
    })
    .then(response => {
      this.loading = 2;
      this.$Progress.finish();
      console.log('finished progress app');
      return response.data.access_token;
    }).catch(error => {
      this.loading = 1;
      this.$Progress.fail();
      alert('Error: Could not retreive accessToken from github.com... Try again later');
      console.log("Error", error);
      this.$router.push('/login'); 
    });
  }
}
</script>


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
