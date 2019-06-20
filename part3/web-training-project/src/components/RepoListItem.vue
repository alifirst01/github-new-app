<template lang="pug">
    li.w-100.cf
        .fl.w-10.pv3.dn.db-ns
            img.br4-l.w2-m.h2-m.w3-l.h3-l(v-bind:src="repo.avatarUrl")
        .fr-ns.w-90-ns.pv2.pv3-ns.pl1.pl3-ns
            h3-link
                a.f4.f3-ns(v-bind:href="repo.unameUrl") {{repo.username}}
                span.black.f4  / 
                a.f4.f3-ns(v-bind:href="repo.url") {{repo.name}}
            p.f6.f5-ns {{repo.description}}  
                  
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend ({
    name: 'RepoListItem',
    props: ['repo'],

});
</script>