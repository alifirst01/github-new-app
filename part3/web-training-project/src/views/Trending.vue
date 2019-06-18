<template lang="pug">
    
    .tl.mt4.w-50.center      
        #loading.center.pv6.tc(v-if="loading==0")
            h1.f4 {{loadingMessage.m1}}
            h3(v-if="'m2' in loadingMessage") {{loadingMessage.m2}}
        #error.pv6.red(v-else-if=("loading==1"))
            p.red.center.w-50 {{loadingMessage.m1}} 
        #t-repos(v-else)
            h1.w-100 GitHub Trending repos
            h3.ma0.mt3.w-100 Explore the top starred Typescript public repositories in the past 24 hours.
            
            div.ma0.mt2.w-100.tr
                img.br2.pointer(src="@/assets/ic_refresh.svg" v-on:click="getTrendingRepos")
                p(v-model="lastUpdated").f7 Last Updated: {{timeDiff}}
            div.background.mt3(v-if="trendingRepos.length > 0")
                ul.list.pl2
                    repo-list-item(v-for="trepo in trendingRepos"
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
        this.trendingRepos = [];
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
            response.data.items.forEach(item => {
                this.trendingRepos.push({
                    url: item.html_url,
                    name: item.name,
                    description: item.description,
                    username: item.owner.login,
                    unameUrl: item.owner.html_url,
                    avatarUrl: item.owner.avatar_url,
                })
            });
            this.loading = 2;
            this.$Progress.finish();
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

