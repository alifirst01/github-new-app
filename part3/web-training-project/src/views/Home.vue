<template lang="pug">
  div(class="home")
    h1 h1 Some text
    h2 h2 Some text
    .bg-dark
      h3.white h3 Some text
    p p Some text
    VueLogo
    HelloWorld(msg="Welcome to Your New Vue.js + TypeScript App")

</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import VueLogo from "@/components/VueLogo.vue"
import axios from 'axios';

var axiosPokemonCall = (endPoint:string) => {
  console.log('Pokemon API Call');
  var url = 'https://pokeapi.co/api/v2/' + endPoint;
  axios.get(url).then(response => {
    console.log('Status: ', response.status);
    console.log('Data: ', response.data);
  }).catch(error => {
    console.log('Could not fetch the resource');
    console.log('Error: ', error);
  });
}

var githubTrendingAPI = async () => {
  console.log('Github API Call');
  var yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));

  var url = 'https://api.github.com/search/repositories';
  await axios.get(url, {
    params: {
      'q': 'typescript',
      'sort': 'stars',
      'order': 'desc',
      'pushed': yesterday + '..*',
    }
  })
  .then(function (response) {
    console.log('Github API Call');
    console.log('Response: ', response);
    var outdatedResults = response.data.items.filter(item => {
      return new Date(item.updated_at) < yesterday;
    });
    console.log('Outdated Results', outdatedResults);
  })
  .catch(function (error) {
    console.log('Error: ', error);
  });
}

axiosPokemonCall('type/3/');
githubTrendingAPI();

@Component({
  components: {
    HelloWorld,
    VueLogo
  }
})
export default class Home extends Vue {}
</script>
