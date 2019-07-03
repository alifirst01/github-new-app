<template lang="pug">
    #search-query(v-if="search")
        h1.w-70-ns.f3.f2-m.f1-l.center Search Trending Repositories on Github
        .w-90.w-60-m.w-50-l.h5.center.tl
            #search-bar.overflow-hidden
                .w-80.fl.pv2.ph3-ns
                    input.w-100.pa2.pa3-ns.ba.b--black-20.br3.outline-0(type="text" v-model="kword" @keyup.enter="addKeyWord" placeholder="Enter keywords e.g. TypeScript")
                .w-20.fr.pv2.pv0-ns.tl
                    font-awesome-icon.w2.h2.w3-ns.h3-ns.grow.pointer(:icon="['fas', 'plus-square']" size="3x" @click="addKeyWord")
            #keywords.tl
                ul.pa0.pl3-ns
                    li.dib.mr2.ph2.ba.b--black-20.br4(v-for="(kword, index) in queryParams.keywords")
                        p.fl.mv1 {{ kword }}
                        font-awesome-icon.pointer.fr.ml2.mv1(:icon="['fas', 'times-circle']" @click="queryParams.keywords.splice(index, 1)")
            #filters.ph3-ns.mt3
                #sort-order-filter.overflow-hidden
                    #sort-filter.w-40.fl-ns
                        label(for="sortby").i Sort By:  
                        select#sortby.pa2.ba.b--black-20.br3.outline-0(v-model="queryParams.sortBy")
                            option(value="") ---
                            option(value="stars") Stars
                            option(value="forks") Forks
                            option(value="help-wanted-issues") Help wanted issues
                    #order-filter(v-if="queryParams.sortBy != ''").mt3.mt0-ns.w-40.fl-ns.pl4-ns
                        label(for="orderby").i Order By:  
                        select#orderby.pa2.ba.b--black-20.br3.outline-0(v-model="queryParams.orderBy")
                            option(value="") ---
                            option(value="asc") Ascending
                            option(value="desc") Descending
                #last-updated.mt3.w-40
                    label(for="updatedsince").i Last Updated:  
                    select#updatedsince.pa2.ba.b--black-20.br3.outline-0()
                        option(value=0) ---
                        option(value=1) 24 hours ago
                        option(value=7) 1 week ago
                        option(value=30) 1 month ago
                        option(value=90) 3 months ago
                        option(value=180) 6 months ago
                button(v-on:click="getTrendingRepos").f5.ph3.pv2.mt3.white.bg-black.b--black.br3.pointer Search

    #search-results.tl.mt4.w-70.w-60-m.w-50-l.center(v-else)      
        #trending-loading.center.pv6.tc(v-if="loading==0")
            h1.f5.f4-ns {{loadingMessage.m1}}
            h3.f6.f5-ns(v-if="'m2' in loadingMessage") {{loadingMessage.m2}}
        #trending-error.pv6.red(v-else-if=("loading==1"))
            p.red.center.w-60-ns {{loadingMessage.m1}} 
        #trending-content(v-else)
            h1.f2.f1-ns GitHub Trending repos
            h3.f4.f3-ns.ma0.mt3 Explore the trending public repositories on Github.
            
            div.ma0.mt2
                #icons.overflow-hidden
                    .fl
                        img.w3.h3.pointer(src="@/assets/back.png" v-on:click="search = true")
                    .fr
                        img.mt2.pt2.pointer(src="@/assets/ic_refresh.svg" v-on:click="getTrendingRepos") 
                #text.overflow-hidden
                    .fl
                        p.f7.ma0 Back to Search
                    .fr
                        p.f7.ma0 Last Updated: {{timeDiff}}
            div.background.mt3.mb3(v-if="trendingRepos.length > 0")
                ul.list.ph2
                    repo-list-item(v-for="trepo in trendingRepos"
                                      v-bind:repo="trepo") 
                   
</template>

<script lang="ts">
import { Component, Watch, Vue, Mixins } from "vue-property-decorator"
import TrendingController from "@/controllers/TrendingController"
import TrendingRepositoryImpl from "@/repositories/TrendingRepository"
import RepoListItem from "@/components/RepoListItem.vue"
import DateMixin from "@/mixins/DateMixin"
import axios from "axios"

@Component({
    name: "trending",
    components: {
        RepoListItem,
    }
})
export default class Trending extends Mixins(DateMixin) {
    timer: any = ""
    kword: string = ""
    loading: number = 0
    search: boolean = true
    loadingMessage: Object = {}
    trendingRepos: Array<Repo> = []
    queryParams: SearchQueryParams = {
        keywords: [],
        orderBy: "",
        sortBy: "",
        lastUpdated: new Date(),
    }

    controller: TrendingController = new TrendingController(new TrendingRepositoryImpl(axios.create({})))

    beforeDestroy() {
        clearInterval(this.timer)
    }

    addKeyWord(){
        var word = this.kword.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
        if (word.length != 0 && !(this.queryParams.keywords.includes(word)))
            this.queryParams.keywords.push(word);
        this.kword = ""
    }

    set queryLastUpdated(days: number){
        this.queryParams.lastUpdated = new Date()
        this.queryParams.lastUpdated.setDate(this.queryParams.lastUpdated.getDate() - days)
    }

    @Watch('lastUpdated', { immediate: true })
    onChange(val: any, oldVal: any){ this.updateTimeDiff() }

    async getTrendingRepos(): Promise<void> {
        this.addKeyWord();
        this.loading = 0;
        this.search = false;
        this.loadingMessage = {m1: "Fetching Trending Repositories"};
        this.$Progress.start();
        return await this.controller.getTrendingRepos(this.queryParams).then((reposResult: GetReposResult) => {
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
        this.timer = setInterval(this.updateTimeDiff, 65000);
    }
};
</script>

