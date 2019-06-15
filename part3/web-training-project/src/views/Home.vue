<template lang="pug">
  .home
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

@Component({
  components: {
    HelloWorld,
    VueLogo
  }
})
export default class Home extends Vue {

  axiosPokemonCall(endPoint:string) {
    try {
      console.log('Pokemon API Call');
      var url = 'https://pokeapi.co/api/v2/' + endPoint;
      axios.get(url).then(response => {
        console.log('Status: ', response.status);
        console.log('Data: ', response.data);
      }).catch(error => {
        console.log('Could not fetch the resource');
        console.log('Error: ', error);
      });
    } catch (error) {
        console.log('Catch Error: ', error);
    }
  }
}
</script>
