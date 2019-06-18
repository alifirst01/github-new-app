<template lang="pug">
    .trending.w-80.w-90-ns.pt4.center        
        #loading.w-40.center.pv6.tl(v-if="loading==0")
            h1.f3 {{loadingMessage.m1}}
            h3(v-if="'m2' in loadingMessage") {{loadingMessage.m2}}
        #error.pv6.red(v-else-if=("loading==1"))
            p.red.center.w-50 {{loadingMessage.m1}}
        #t-repos(v-else)
            div.f2.f1-ns.center Trending
            div.f7.f5-ns.center See what the TypeScript community is most excited about today.
            #main-content
                .fr-ns.tr.w-20-ns.pt3.pt4-ns
                    button.f5-ns.f7(v-on:click="getTrendingRepos") Refresh
                    p(v-model="lastUpdated").f7 Last Updated: {{timeDiff}}  
                .fl-ns.w-80-ns
                    ul.pl0.pl4-ns
                        repo-list-item.tl(v-for="trepo in trendingRepos"
                                          v-bind:repo="trepo")   
                   
</template>

<script lang="ts">
import { Component, Watch, Vue, Prop } from "vue-property-decorator";
import RepoListItem from "@/components/RepoListItem.vue"
import axios from 'axios';

@Component({
    name: "trending",
    components: {
        RepoListItem,
    }
})
export default class Trending extends Vue{
    timer:any = ""
    timeDiff:string = ""
    loading:number = 0
    loadingMessage:Object = {}
    lastUpdated:Date = new Date()
    trendingRepos:Array<Object> = []

    created(){
        this.timer = setInterval(this.updateTimeDiff, 65000);
    }

    beforeMount(){
        this.getTrendingRepos();
    }

    beforeDestroy() {
        clearInterval(this.timer)
    }

    @Watch('lastUpdated', { immediate: true })
    onChange(val, oldVal){ this.updateTimeDiff() }

    updateTimeDiff(){
        var dateNow = new Date();
        var seconds = Math.floor((dateNow - this.lastUpdated) / 1000);
        var minutes = Math.floor(seconds / 60);
        var hours = Math.floor(minutes / 60);
        
        minutes = minutes % 60
        
        this.timeDiff = "";
        if(minutes > 0)
            this.timeDiff += minutes.toString() + ((minutes == 1) ? " min " : " mins ")        
        if(hours > 0)
            this.timeDiff = hours.toString() + ((hours == 1) ? " hr " : " hrs ")
        this.timeDiff = (this.timeDiff == "") ? "now" : this.timeDiff + " ago"  
    }

    async getTrendingRepos(): Promise<void> {
        var yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
        var url = 'https://api.github.com/search/repositories';
        
        this.loading = 0;
        this.loadingMessage = {m1: "Fetching Trending Repositories"};
        this.$Progress.start();
        return await axios.get(url, {
            params: {
            'q': 'typescript',
            'sort': 'stars',
            'order': 'desc',
            'pushed': yesterday + '..*',
            }
        })
        .then(response => {
            this.loading = 2;
            this.$Progress.finish();
            this.trendingRepos = response.data.items;
            this.lastUpdated = new Date();
            var outdatedResults = this.trendingRepos.filter(item => {
                return new Date(item.updated_at) < yesterday;
            });
        })
        .catch(error => {
            this.loading = 1;
            this.loadingMessage = {m1: "An error occured while fetching the trending repositories from Github. Try again later...."}
            this.$Progress.fail();
            console.log('Error: ', error);
        });
    }

    
};
</script>

