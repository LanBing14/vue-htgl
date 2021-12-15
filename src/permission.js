import router from "./router";
import store from "./store";
import { getToken } from "@/utils/auth"; // getToken from cookie
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import PerLogin from "@/views/login/ploginexp";

NProgress.configure({ showSpinner: false }); // NProgress Configuration
const whiteList = [
    "/",
    "/login",
    "/register",
   "/applyOther",
   "/loginAuth"
    // "/auth-redirect",
    // "/advanceSearch",
    // "/creditRepair",
    // "/creditRestoration",
    // "/creditTrain",
    // "/trainClass",
    // "/trainClass/classInfo",
    // "/creditTrain/trainCourse",
    // "/creditTrain/trainCourse/courseInfo",
    // "/creditTeacherList",
    // "/creditTeacherList/teacherInfo",
    // "/channel",
    // "/about",
    // "/agreement",
    // "/buy",
    // "/riskIndex",
    // "/blankSingIn"
]; // no redirect whitelist

router.beforeEach((to, from, next) => {
    NProgress.start();
    if (getToken()) {
        // determine if there has token
        if (!store.state.user.userInfo.id) {
            store.dispatch("GetUserInfo").then(_userInfo => {
                next();
            });
        }
        if (!store.getters.menusStatus) {
            const sessionMenus = sessionStorage.getItem("menus");
            if (sessionMenus) {
                store.commit("SET_MENUSSTATUS", true);
                store
                    .dispatch("GenerateRoutes", JSON.parse(sessionMenus))
                    .then(res => {
                        router.addRoutes(res); // 动态添加可访问路由表
                    });
            } else {
                store.dispatch("GetSysMenus").then(menus => {
                    sessionStorage.setItem("menus", JSON.stringify(menus));
                    store.commit("SET_MENUSSTATUS", true);
                    store.dispatch("GenerateRoutes", menus).then(res => {
                        router.addRoutes(res); // 动态添加可访问路由表
                    });
                });
            }
        }
        next();
    } else {
        /* has no token*/
        if (whiteList.indexOf(to.path) !== -1) {
            // 在免登录白名单，直接进入
            next();
        } else {
            // PerLogin.login();
            router.push('/login')
            NProgress.done(); // if current page is login will not trigger afterEach hook, so manually handle it
        }
    }
   
});

router.afterEach(() => {
    NProgress.done(); // finish progress bar
});