<template lang="pug">
    .tl.mt4.w-40.center
        h1.w-100 Login to Github
        h3.ma0.mt3.w-100 In order to view issues for your GitHub account, you must login to your GitHub account.
        
        .tc.mt5
            button(v-on:click="redirectgithubLogin").f5.ph2.pv2.white.bg-black.b--black.br3.pointer Login to GitHub
        .mt5.w-70.tl.center
            p We do not store or share your personal information. We ask the minimum permissions required for the application to work.
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import axios from 'axios'

@Component
export default class Login extends Vue{
    redirectgithubLogin(){
        var url = window.location.href.split('/login')[0];
        var params = {
            "client_id": "5924f82128dc0c6d3ab7",
            "redirect_uri": url + '/issues'
        }
        var queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
        var redirectUrl = "https://github.com/login/oauth/authorize?" + queryString;
        window.location.href = redirectUrl;
    }
}

</script>
