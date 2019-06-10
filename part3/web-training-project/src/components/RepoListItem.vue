<template lang="pug">
    li.list 
        h3
            a(v-bind:href="repo.html_url").link.blue {{repo.full_name}}
        p {{repo.description}}
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