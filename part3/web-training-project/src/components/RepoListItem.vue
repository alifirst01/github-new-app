<template lang="pug">
    li.w-100.cf
        .fl.w-10.pv2
            img.br4.w3.h3(v-bind:src="repo.avatarUrl")
        .fr.w-90.pv2.pl3
            h3-link
                a(v-bind:href="repo.unameUrl") {{repo.username}}
                |  / 
                a(v-bind:href="repo.url") {{repo.name}}
            p {{repo.description}}  
                  
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend ({
    name: 'RepoListItem',
    props: ['repo'],

});
</script>