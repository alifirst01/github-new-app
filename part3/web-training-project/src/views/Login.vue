<template lang="pug">
    #login-view.tl.mt4.w-70.w-40-ns.center
        h1.f2.f1-ns Login to Github
        h3.ma0.mt3.f4.f3-ns In order to view issues for your GitHub account, you must login to your GitHub account.
        
        .tc.mt4.mt5-ns
            button(v-on:click="redirectgithubLogin")#github-login.f5.ph2.pv2.white.bg-black.b--black.br3.pointer Login to GitHub
        .mt4.mt5-ns.w-90.w-70-ns.tl.center
            p.f6.f5-ns We do not store or share your personal information. We ask the minimum permissions required for the application to work.
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator"
import axios from "axios"

@Component
export default class Login extends Vue {
    redirectgithubLogin() {
        var url = window.location.href.split('/login')[0];
        var params: any = {
            "client_id": "5924f82128dc0c6d3ab7",
            "redirect_uri": url + "/issues"
        }
        var queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
        var redirectUrl = "https://github.com/login/oauth/authorize?" + queryString;
        window.location.assign(redirectUrl);
    }
}

</script>
