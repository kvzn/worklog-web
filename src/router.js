import VueRouter from "vue-router";
import Overview from "./components/Overview.vue";
import WorklogForm from "./components/WorklogForm.vue";
import Login from "./components/Login.vue";
import ChangePassword from "./components/ChangePassword.vue";

const routes = [
    { path: "/", component: Overview },
    { path: "/worklogs/create", component: WorklogForm },
    { path: "/login", component: Login },
    { path: "/user/changePassword", component: ChangePassword },
];

const router = new VueRouter({
    routes
});

router.beforeEach((to, from, next) => {
    const publicPages = ['/login'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = localStorage.getItem("accessToken") != null;

    if (authRequired && !loggedIn) {
        return next(`/login?redirect=${to.path}`);
    }
    next();
});

export { router }