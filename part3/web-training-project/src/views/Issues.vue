<template lang="pug">
    #issues-content
        .fr.pv3.ph4
            h3-link(v-on:click="logout") Logout 
        br
        .tl.mt4.w-40.center
            
            h1.w-100 Github Issues
            h3.ma0.mt3.w-100 Issues created by you, mentioning you, or assigned to you
            
            div.ma0.mt2.w-100.tr
                img(src="@/assets/ic_refresh.svg")
            div.background.mt3(v-if="issues.length > 0")
                ul.list
                    li(v-for="issue in issues")
                        h3-link
                            a(v-bind:href="issue.url") {{issue.title}}
                        p {{issue.username}} / {{issue.repository}}
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component'
import axios from 'axios';
import store from '@/store';
import router from '@/router';

Component.registerHooks([
    'beforeRouteEnter',
])

@Component
export default class Issues extends Vue{ 

    issues: Array<Object> = []

    beforeRouteEnter(to, from, next) {
        if (store.getters.isLoggedIn == false){
            router.push('/login');
            from();
        }
        next();
    }

    created() {
        var accessToken = this.$store.getters.code;
        this.getAllUserIssues(accessToken);
    }

    async getAllUserIssues(accessToken){
        var url = 'https://api.github.com/user'
        var headers = {'Authorization': 'token ' + accessToken}

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
                })
            })
        })
        .catch(error => {
            alert('An error occured in fetching github issues. Please try again')
            console.log('Error in fetching issues: ', error);
        });
    }

    logout(){
        this.$store.dispatch('setCode', null);
        this.$router.push('/login');
    }
}
</script>
