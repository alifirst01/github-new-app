<template lang="pug">
  div(class="about")
    h1 This is an about page
    HelloWorld(msg="This is the helloWorld component being used in About component")
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src

@Component({
  components: {
    HelloWorld
  }
})
export default class About extends Vue {}
</script>
