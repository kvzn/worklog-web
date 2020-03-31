import VueRouter from "vue-router";
import UserCreate from "./components/admin/UserCreate.vue";
import UserList from "./components/admin/UserList.vue";
import AdminWorklogList from "./components/admin/WorklogList.vue";
import WorklogList from "./components/WorklogList.vue";
import WorklogForm from "./components/WorklogForm.vue";
import Login from "./components/Login.vue";
import ChangePassword from "./components/ChangePassword.vue";

const routes = [
    { path: "/", component: WorklogList },
    { path: "/admin/users/list", component: UserList },
    { path: "/admin/users/create", component: UserCreate },
    { path: "/admin/worklogs/list", component: AdminWorklogList },
    { path: "/worklogs/list", component: WorklogList },
    { path: "/worklogs/create", component: WorklogForm },
    { path: "/worklogs/:id/edit", component: WorklogForm },
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