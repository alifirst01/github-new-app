<template lang="pug">
    div(class="trending").w-80.center
        h1.center Trending
        p.center See what the TypeScript community is most excited about today.
        
        ul.fl.w-80
            repo-list-item(v-for="trepo in trendingRepos"
                           v-bind:repo="trepo").tl
                

</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import RepoListItem from "@/components/RepoListItem.vue"
import axios from 'axios';

export default Vue.extend({
    data() {
        return {
            trendingRepos: [],
        }
    },
    components:{
        RepoListItem,
    },
    methods: {
        getTrendingRepos: async function() {
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
            .then(response => {
                this.trendingRepos = response.data.items;
                var outdatedResults = this.trendingRepos.filter(item => {
                    return new Date(item.updated_at) < yesterday;
                });
                console.log('Outdated Results', outdatedResults);
            })
            .catch(error => {
                console.log('Error: ', error);
            });
            console.log('Trending Repos:', this.trendingRepos);
        }
    },
    beforeMount(){
        this.getTrendingRepos();
    }

});
</script>

