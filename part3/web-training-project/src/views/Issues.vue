<template lang="pug">
    #login-loading.w-40.center.pv6.tl(v-if="loading==0")
        h1.f3 {{loadingMsg.m1}}
        h3(v-if="'m2' in loadingMsg") {{loadingMsg.m2}}
    
    #issues-content(v-else)
        #logout-button.fr.pv3.ph4
            h3-link(v-on:click="logout") Logout 
        br
        .tl.mt4.w-40.center
            h1.w-100 Github Issues
            h3.ma0.mt3.w-100 Issues created by you, mentioning you, or assigned to you
            
            #refresh-button.ma0.mt2.w-100.tr.pointer
                img(src="@/assets/ic_refresh.svg" v-on:click="getAllUserIssues")

            #issues-loading.pv3.tc(v-if="loading == 2")
                pulse-loader(:loading="loading == 2" :color="color" :size="size")
                h1.f4 {{loadingMsg.m1}}
                h3(v-if="'m2' in loadingMsg") {{loadingMsg.m2}}
            #issues-error.pv2.red(v-else-if=("loading == 3"))
                p.red.tc {{loadingMsg.m1}}
            #issues-main-content(v-else)
                div.background.mt3(v-if="issues.length > 0")
                    ul.list.ph3
                        li(v-for="issue in issues")
                            h3-link
                                a(v-bind:href="issue.url") {{issue.title}}
                            p {{issue.username}} / {{issue.repository}}
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import axios from 'axios';
import store from '@/store';
import router from '@/router';

Component.registerHooks([
    'beforeRouteEnter',
])

@Component({
    name: "issues",
    components: {
        PulseLoader,
    }
})
export default class Issues extends Vue{ 
    issues: Array<Object> = [];
    loading:number = 0;
    loadingMsg:Object = {}
    

    beforeRouteEnter(to, from, next) {
        var query = window.location.href;
        if (store.getters.isLoggedIn == false && !query.includes('code')){
            router.push('/login');
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
            var code = query.split('?')[1].split('=')[1];
            this.getGithubAccessToken(code).then(accessToken => {
                this.$store.dispatch('setCode', accessToken);
                this.$Progress.finish();
                this.getAllUserIssues();
            });
        }
    }

    async getGithubAccessToken(accessCode):Promise<string>{
        var tokenUrl = "https://github-app-login.foundersclubsoftware.now.sh/auth";

        this.loading = 0;
        this.loadingMsg = {m1: "Finishing GitHub login", m2: "It should only be a second or two…"};
        this.$Progress.start();

        return await axios({
            method: 'post',
            url: tokenUrl,
            data: {
                'code': accessCode,  
                'state': '12345',
            }
        })
        .then(response => {
            this.loading = 1;
            return response.data.access_token;
        }).catch(error => {
            this.$Progress.fail();
            alert('Error: Could not retreive accessToken from github.com. Please try again');
            console.log("Error", error);
            this.$router.push('/login'); 
        });
    }

    async getAllUserIssues(){
        this.issues = [];
        var accessToken = this.$store.getters.code;
        var url = 'https://api.github.com/user'
        var headers = {'Authorization': 'token ' + accessToken}
        
        this.loading = 2;
        this.loadingMsg = {m1: "Fetching issues from public repositories"};
        
        return await axios.get(url, {
            headers: headers
        })
        .then(response => {
            var repoUrl = "https://api.github.com/users/" + response.data.login + "/repos";
            return axios.get(repoUrl, {
                headers: headers
            });
        })
        .then(response => {
            var repos = response.data;
            var params = {'state': 'all'};
            
            repos.forEach(repo => {
                let repoName = repo.name;     
                let issuesUrl = repo.issues_url.split('{')[0];
                axios.get(issuesUrl, {
                    headers: headers,
                    params: params,
                }).then(res => {
                    res.data.forEach(issue => {
                        this.issues.push({
                            title: issue.title,
                            url: issue.html_url,
                            username: issue.user.login,
                            repository: repoName,
                        })
                    });
                    this.loading = 4;
                })
            })
        })
        .catch(error => {
            this.loading = 3;
            this.loadingMsg = {m1: "An error occured in fetching github issues. Please try again"};
            console.log('Error in fetching issues: ', error);
        });
    }

    logout(){
        this.$store.dispatch('setCode', null);
        this.$router.push('/login');
    }
}
</script>
