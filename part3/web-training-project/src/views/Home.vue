<template lang="pug">
  div(class="home")
    VueLogo
    HelloWorld(msg="Welcome to Your New Vue.js + TypeScript App")

</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import VueLogo from "@/components/VueLogo.vue"

@Component({
  components: {
    HelloWorld,
    VueLogo
  }
})
export default class Home extends Vue {}
</script>
