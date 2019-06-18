import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: "/",
      name: "trending",
      component: () =>
        import(/* webpackChunkName: "trending" */ "./views/Trending.vue"),
      props: (route) => ({ code: route.query.code })
    },
    {
      path: "/issues",
      name: "issues",
      component: () =>
        import(/* webpackChunkName: "issues" */ "./views/Issues.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () =>
        import(/* webpackChunkName: "login" */ "./views/Login.vue"),
    },
  ]
});
