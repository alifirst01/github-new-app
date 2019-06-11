<template lang="pug">
    .trending.w-80.center
        h1.center Trending
        
        #loading.pv6(v-if="loading")
            pulse-loader(:loading='loading', :color='color', :size='size')
            p Fetching Trending Repositories
        
        #t-repos(v-else)
            p.center See what the TypeScript community is most excited about today.
            #main-content
                .fl.w-80
                    ul 
                        repo-list-item.tl(v-for="trepo in trendingRepos"
                                          v-bind:repo="trepo")   
                .fr.tr.w-20
                    button(v-on:click="getTrendingRepos") Refresh
                    p(v-model="lastUpdated").f7 Last Updated: {{timeDiff}}     
</template>

<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import RepoListItem from "@/components/RepoListItem.vue"
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import axios from 'axios';

@Component({
    name: "trending",
    components: {
        RepoListItem,
        PulseLoader,
    }
})
export default class Trending extends Vue{
    timer:any = ""
    timeDiff:string = ""
    loading:boolean = true
    lastUpdated:Date = Date.now()
    trendingRepos:Array<Object> = []

    beforeMount(){
        this.getTrendingRepos();
    }

    created() {
        this.timer = setInterval(this.updateTimeDiff, 65000);
        this.updateTimeDiff();
    }

    beforeDestroy() {
        clearInterval(this.timer)
    }

    @Watch('lastUpdated')
    updateTimeDiff()

    updateTimeDiff(){
        var dateNow = new Date();
        var seconds = Math.floor((dateNow - this.lastUpdated) / 1000);
        var minutes = Math.floor(seconds / 60);
        var hours = Math.floor(minutes / 60);
        
        minutes = minutes % 60
        
        this.timeDiff = "";
        if(minutes > 0)
            this.timeDiff += minutes.toString() + (minutes == 1) ? " min " : " mins "        
        if(hours > 0)
            this.timeDiff = hours.toString() + (hours == 1) ? " hr " : " hrs "
        console.log('Updating ', `${minutes}, ${hours}`);
        this.timeDiff = (this.timeDiff == "") ? "now" : this.timeDiff + " ago"  
    }

    async getTrendingRepos(): Promise<void> {
        console.log('Github API Call');
        var yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
        var url = 'https://api.github.com/search/repositories';
        
        this.loading = true;
        return await axios.get(url, {
            params: {
            'q': 'typescript',
            'sort': 'stars',
            'order': 'desc',
            'pushed': yesterday + '..*',
            }
        })
        .then(response => {
            this.loading = false;
            this.trendingRepos = response.data.items;
            this.lastUpdated = new Date();
            var outdatedResults = this.trendingRepos.filter(item => {
                return new Date(item.updated_at) < yesterday;
            });
            console.log('Outdated Results', outdatedResults);
            console.log('Trending Repos:', this.trendingRepos);
        })
        .catch(error => {
            this.loading = false;
            console.log('Error: ', error);
        });
    }

    
};
</script>

