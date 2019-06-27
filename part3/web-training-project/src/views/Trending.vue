<template lang="pug">
    
    .tl.mt4.w-70.w-60-m.w-50-l.center      
        #trending-loading.center.pv6.tc(v-if="loading==0")
            h1.f5.f4-ns {{loadingMessage.m1}}
            h3.f6.f5-ns(v-if="'m2' in loadingMessage") {{loadingMessage.m2}}
        #trending-error.pv6.red(v-else-if=("loading==1"))
            p.red.center.w-60-ns {{loadingMessage.m1}} 
        #trending-content(v-else)
            h1.f2.f1-ns GitHub Trending repos
            h3.f4.f3-ns.ma0.mt3 Explore the top starred Typescript public repositories in the past 24 hours.
            
            div.ma0.mt2.tr
                img.pointer(src="@/assets/ic_refresh.svg" v-on:click="getTrendingRepos")
                p.f7 Last Updated: {{timeDiff}}
            div.background.mt3.mb3(v-if="trendingRepos.length > 0")
                ul.list.ph2
                    repo-list-item(v-for="trepo in trendingRepos"
                                      v-bind:repo="trepo") 
                   
</template>

<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator"
import TrendingController from "@/controllers/TrendingController"
import TrendingRepositoryImpl from "@/repositories/TrendingRepository"
import RepoListItem from "@/components/RepoListItem.vue"
import DateMixin from "@/mixins/DateMixin"
import axios from "axios"

@Component({
    name: "trending",
    mixins: [DateMixin],
    components: {
        RepoListItem,
    }
})
export default class Trending extends Vue {
    timer: any = ""
    loading: number = 0
    loadingMessage: Object = {}
    trendingRepos: Array<Object> = []
    controller: TrendingController = new TrendingController(new TrendingRepositoryImpl(axios.create({})))

    created(){
        this.timer = setInterval(this.updateTimeDiff, 65000);
    }

    beforeMount() {
        this.getTrendingRepos();
    }

    beforeDestroy() {
        clearInterval(this.timer)
    }

    @Watch('lastUpdated', { immediate: true })
    onChange(val: any, oldVal: any){ this.updateTimeDiff() }

    async getTrendingRepos(): Promise<void> {
        this.loading = 0;
        this.loadingMessage = {m1: "Fetching Trending Repositories"};
        this.$Progress.start();
        return await this.controller.getTrendingRepos().then((reposResult: GetReposResult) => {
            if (reposResult.error){
                this.loading = 1;
                this.loadingMessage = {m1: reposResult.error.message};
                this.$Progress.fail();
            }
            else{
                this.trendingRepos = reposResult.repos!;
                this.loading = 2;
                this.$Progress.finish();
                this.lastUpdated = new Date();
            }
        });
    }
};
</script>

