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
            div.mt3
                p Hi this is the image
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component'
import store from '@/store';
import router from '@/router';

Component.registerHooks([
    'beforeRouteEnter',
])

@Component
export default class Issues extends Vue{ 
    beforeRouteEnter(to, from, next) {
        if (store.getters.isLoggedIn == false){
            router.push('/login');
        }
        next();
    }

    logout(){
        this.$store.dispatch('setCode', null);
        this.$router.push('/login');
    }
}
</script>
