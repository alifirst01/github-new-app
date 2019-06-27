<template lang="pug">
    #login-loading.w-70.w-40-ns.center.pv6.tl(v-if="loading==0")
        h1.f4.f3-ns {{loadingMsg.m1}}
        h3.f5.f4-ns(v-if="'m2' in loadingMsg") {{loadingMsg.m2}}
    
    #issues-content(v-else)
        #logout-button.fr.pv3.ph4
            h3-link.f4.f3-ns.pointer(v-on:click="logout") Logout 
        br
        .tl.mt4.w-70.w-50-m.w-40-l.center
            h1.f2.f1-ns Github Issues
            h3.f4.f3-ns.ma0.mt3.w-100 Issues created by you, mentioning you, or assigned to you
            
            #refresh-button.ma0.mt2.tr
                img.pointer(src="@/assets/ic_refresh.svg" v-on:click="getAllUserIssues")

            #issues-loading.pv3.tc(v-if="loading == 2")
                pulse-loader(:loading="loading == 2" :color="color" :size="size")
                h1.f5.f4-ns {{loadingMsg.m1}}
                h3.f6.f5-ns(v-if="'m2' in loadingMsg") {{loadingMsg.m2}}
            #issues-error.pv2.red(v-else-if=("loading == 3"))
                p.red.tc {{loadingMsg.m1}}
            #issues-main-content(v-else)
                div.background.mt3(v-if="issues.length > 0")
                    ul.list.ph3
                        li(v-for="issue in issues")
                            h3-link
                                a.f4.f3-ns(v-bind:href="issue.url") {{issue.title}}
                            p.f6.f5-ns {{issue.username}} / {{issue.repository}}
</template>

<script lang="ts">
import Vue from "vue"
import axios from "axios"
import store from "@/store"
import router from "@/router"
import Component from "vue-class-component"
import PulseLoader from "vue-spinner/src/PulseLoader.vue"
import IssuesController from "@/controllers/IssuesController"
import IssuesRepositoryImpl from "@/repositories/IssuesRepository"
import GithubAuthController from "@/controllers/GithubAuthController"
import GithubAuthRepositoryImpl from "@/repositories/GithubAuthRepository"

Component.registerHooks([
    'beforeRouteEnter',
])

@Component({
    name: "issues",
    components: {
        PulseLoader,
    }
})
export default class Issues extends Vue { 
    issues: Issue[] = [];
    loading: number = 0;
    loadingMsg: Object = {};
    issuesController: IssuesController = new IssuesController(new IssuesRepositoryImpl(axios.create({})))
    githubAuthController: GithubAuthController = new GithubAuthController(new GithubAuthRepositoryImpl(axios.create({})))

    beforeRouteEnter(to: any, from: any, next: any) {
        var query = window.location.href;
        if (store.getters.isLoggedIn == false && !query.includes('code')){
            router.push("/login");
            from();
        }
        next();
    }

    created() {
        var query = window.location.href;
        if(this.$store.getters.isLoggedIn == true ){
            this.getAllUserIssues();
        }
        else{
            var code = query.split("?")[1].split('=')[1];
            this.getGithubAccessToken(code).then(accessToken => {
                this.$store.dispatch("setCode", accessToken);
                this.$Progress.finish();
                this.getAllUserIssues();
            });
        }
    }

    async getGithubAccessToken(accessCode: string): Promise<string> {
        this.loading = 0;
        this.loadingMsg = {m1: "Finishing GitHub login", m2: "It should only be a second or two…"};
        this.$Progress.start();

        return await this.githubAuthController.getGithubAccessToken(accessCode)
        .then((tokenResult: GetGithubAuthResult) => {
            if (tokenResult.error){
                this.$Progress.fail();
                alert(tokenResult.error.message);
                this.$router.push("/login");
            }
            else{
                this.loading = 1;
                return tokenResult.accessToken;
            }
        })
    }

    async getAllUserIssues() {
        this.loading = 2;
        this.loadingMsg = {m1: "Fetching issues from public repositories"};
        return await this.issuesController.getUserIssues().then((issuesResult: GetIssuesResult) => {
            if (issuesResult.error){
                this.loading = 3;
                this.loadingMsg = {m1: issuesResult.error.message};
            }
            else{
                this.loading = 4;
                this.issues = issuesResult.issues!;
            }
        });
    }

    logout() {
        this.$store.dispatch("setCode", null);
        this.$router.push("/login");
    }
}
</script>
