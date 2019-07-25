<template lang="pug">

    //- Trending repositories query's search page 
    #search-query(v-if="search")            
        h1.w-70-ns.f3.f2-m.f1-l.center Search Trending Repositories on Github
        
        .w-90.w-60-m.w-50-l.h5.center.tl
            #search-bar.overflow-hidden
                .w-80.fl.pv2.ph3-ns
                    input.w-100.pa2.pa3-ns.ba.b--black-20.br3.outline-0(type="text" v-model="kword" @keyup.enter="addKeyWord" placeholder="Add keyword/s e.g. java")
                .w-20.fr.pv2.pv0-ns.tl
            #keywords.tl
                ul.pa0.pl3-ns
                    li.dib.mr2.ph2.ba.b--black-20.br4(v-for="(kword, index) in queryParams.keywords")
                        p.fl.mv1 {{ kword }}
                        font-awesome-icon.pointer.fr.ml2.mv1(:icon="['fas', 'times-circle']" @click="queryParams.keywords.splice(index, 1)")
            #filters.ph3-ns.mt3
                #sort-and-order-filter.overflow-hidden
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
                button(v-on:click="handleSearchSubmit").f5.ph3.pv2.mt3.white.bg-black.b--black.br3.pointer Search

    //- Trending repositories query's result page
    #search-results.tl.mt4.w-70.w-60-m.w-50-l.center(v-else)

        //- Loading screen when fetching trending repositories     
        #trending-loading.center.pv6.tc(v-if="loading==0")
            h1.f5.f4-ns {{loadingMessage.m1}}
            h3.f6.f5-ns(v-if="'m2' in loadingMessage") {{loadingMessage.m2}}

        //- Error display screen
        #trending-error.pv4.red(v-else-if=("loading==1"))
            img.w2.h2.w3-ns.h3-ns.pointer(src="@/assets/back.png" v-on:click="backtoSearchPage")
            p.f7.ma0 Back to Search
            p.red.center.w-60-ns {{loadingMessage.m1}}

        //- List of trending repositories screen
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
            
            //- List showing trending repos data
            .background.mt3.mb3(v-if="trendingRepos.length > 0")
                ul.list.ph2
                    repo-list-item#repo-item(v-for="trepo in trendingRepos"
                                      v-bind:repo="trepo")
                //- Pagination component
                paginate(v-model="queryParams.pageNum"
                        :page-count="noOfPages"
                        :click-handler="handlePaginationCallback"
                        :prev-text="'Prev'"
                        :next-text="'Next'"
                        :container-class="'pagination'"
                        :page-class="'page-item'"
                        :page-link-class="'page-item-link'"
                        :active-class="'page-item-active'"
                        :prev-class="'page-item'"
                        :next-class="'page-item'"
                        :prev-link-class="'page-item-link'"
                        :next-link-class="'page-item-link'"
                        :disabled-class="'page-item-disabled'")
        
            h4(v-else).mt4.green.tc No repositories found that match the given filters
                   
</template>

<style lang="sass">
    .pagination
        text-align: center
        padding: 0
    
    .page-item
        display: inline-block
    
    .page-item-disabled
        a
            color: #8c8c8c
            cursor: default
            background-color: white

    .page-item-active
        margin: 0
        padding: 7px 0px 7px
        color: #fff
        cursor: default
        background-color: #151515
        border-color: #242424
        border-radius: 3px

    .page-item-link
        border-radius: 3px
        padding: 7px 12px 7px
        border: 1px solid lightGray
        text-decoration: none

    .page-item-link:focus
        outline: 0
        -moz-outline-style: none
    

</style>

<script lang="ts">
import { Component, Watch, Vue, Mixins } from "vue-property-decorator";
import {container, TYPE, inject} from "@/repositories/Container";
import "@/controllers/TrendingController";
import TrendingController from "@/controllers/TrendingController";
import RepoListItem from "@/components/RepoListItem.vue";
import DateMixin from "@/mixins/DateMixin";

@Component({
    name: "trending",
    components: {
        RepoListItem,
    }
})
export default class Trending extends Mixins(DateMixin) {
    timer: any = ""
    kword: string = ""
    loading: number = 0                 // 0 -> loading tag, 1 -> Error message tag, 2 -> List of trending repositories tag
    search: boolean = true              // true -> Trending search page,  false -> Trending repositories page
    noOfPages: number = 0
    loadingMessage: Object = {}
    trendingRepos: Array<Repo> = []
    queryParams: SearchQueryParams = {
        keywords: [],
        orderBy: "",
        sortBy: "",
        lastUpdated: new Date(),
        pageNum: 1,
    }

    @inject(TYPE.TrendingController)
    controller!: TrendingController;

    beforeDestroy() {
        clearInterval(this.timer);
    }

    /**
     * Call updateTimeDiff everytime lastUpdate attribute changes
     */
    @Watch('lastUpdated', { immediate: true })                 
    onChange(val: any, oldVal: any){ this.updateTimeDiff() }

    /**
     * Add input keyword to the list of keywords
     */
    addKeyWord(){
        var word = this.kword.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");     // Removing all punctuations from the keyword
        if (word.length != 0 && !(this.queryParams.keywords.includes(word.toLowerCase())))
            this.queryParams.keywords.push(word.toLowerCase());
        this.kword = "";
    }

    /**
     * Update the lastUpdated parameter in queryParams object
     */
    set queryLastUpdated(days: number){
        this.queryParams.lastUpdated = new Date()
        this.queryParams.lastUpdated.setDate(this.queryParams.lastUpdated.getDate() - days)
    }

    handlePaginationCallback(pageNum: number){
        this.queryParams.pageNum = pageNum;
        this.getTrendingRepos();
    }

    backtoSearchPage(){
        clearInterval(this.timer);
        this.search = true;
    }

    handleSearchSubmit(){
        this.getTrendingRepos();
        this.timer = setInterval(this.updateTimeDiff, 65000);
    }

    /**
     * Get the list of trending repositories with given query parameters
     */
    async getTrendingRepos(): Promise<void> {
        this.addKeyWord();          // Add keyword in case user forgot to press + button before search 
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
                if(this.noOfPages == 0)
                    this.noOfPages = reposResult.no_of_pages!;
                this.loading = 2;
                this.$Progress.finish();
                this.lastUpdated = new Date();
            }
        });
        
    }
};
</script>

