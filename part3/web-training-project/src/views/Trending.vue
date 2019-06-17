<template lang="pug">
    .trending.w-80.w-90-ns.pt4.center
        div.f2.f1-ns.center Trending
        
        #loading.pv6(v-if="loading==0")
            pulse-loader(:loading='loading==0', :color='color', :size='size')
            p Fetching Trending Repositories
        #error.pv6.red(v-else-if=("loading==1"))
            p.red.center.w-50
                | An error occured while fetching the trending repositories from Github. 
                br 
                | Please refresh the page or try again later.
        #t-repos(v-else)
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
    loading:number = 0
    lastUpdated:Date = new Date()
    trendingRepos:Array<Object> = []
    
    @Prop({default: 'default'})
    code: string

    created(){
        // console.log('My code', this.code);
        // console.log('Route', this.$route.query)   
        var query = window.location.href;
        if(this.$store.getters.isLoggedIn == false && query.includes('code')){
            query = query.split('?')[1];
            var code = query.split('=')[1].split('#')[0];
            this.getGithubAccessToken(code).then(accessToken => {
                this.$store.dispatch('setCode', accessToken);
                this.$router.push('/issues');
            });
        };
        this.timer = setInterval(this.updateTimeDiff, 65000);
    }

    async getGithubAccessToken(accessCode):Promise<string>{
        var tokenUrl = "https://github-app-login.foundersclubsoftware.now.sh/auth";
        return await axios({
            method: 'post',
            url: tokenUrl,
            data: {
            'code': accessCode,  
            'state': '12345',
            }
        })
        .then(response => {
            return response.data.access_token;
        }).catch(error => {
            alert('Error: Could not retreive accessToken from github.com... Try again later');
            console.log("Error", error);
            this.$router.push('/login'); 
        });
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
        console.log('Updating ', `${minutes}, ${hours}`);
        this.timeDiff = (this.timeDiff == "") ? "now" : this.timeDiff + " ago"  
    }

    async getTrendingRepos(): Promise<void> {
        console.log('Github API Call');
        var yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
        var url = 'https://api.github.com/search/repositories';
        
        this.loading = 0;
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
            this.trendingRepos = response.data.items;
            this.lastUpdated = new Date();
            var outdatedResults = this.trendingRepos.filter(item => {
                return new Date(item.updated_at) < yesterday;
            });
            console.log('Outdated Results', outdatedResults);
            console.log('Trending Repos:', this.trendingRepos);
        })
        .catch(error => {
            this.loading = 1;
            console.log('Error: ', error);
        });
    }

    
};
</script>

