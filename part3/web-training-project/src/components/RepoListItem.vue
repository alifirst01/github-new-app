<template lang="pug">
    li.list 
        #repo-name.f5.f3-ns
            a(v-bind:href="repo.html_url").link.blue {{repo.full_name}}
        p.f7.f5-ns {{repo.description}}
        p.f7 Stars Count: {{repo.stargazers_count}}
        hr    
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend ({
    name: 'RepoListItem',
    props: ['repo'],

});
</script>