<template lang="pug">
    div(class="trending").w-80.center
        h1.center Trending
        p.center See what the TypeScript community is most excited about today.
        
        ul.fl.w-80
            repo-list-item(v-for="trepo in trendingRepos"
                           v-bind:repo="trepo").tl
                

</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import RepoListItem from "@/components/RepoListItem.vue"

@Component({
    name: "trending",
    components: {
        RepoListItem,
    }
})
export default class Trending extends Vue{
    @Prop({default: []})
    trendingRepos
};
</script>

