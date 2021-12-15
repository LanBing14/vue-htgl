import Vue from "vue";
import Router from "vue-router";
import PublicRouter from "./routerGroup/PublicRouter"; // 公共路由
// import CreditFiling from "./routerGroup/CreditFiling"; // 信用建档
// import Monitor from "./routerGroup/Monitor"; // 信用监测
// import CreditTrain from "./routerGroup/CreditTrain"; // 信用培训
import UserCenter from "./routerGroup/UserCenter"; // 用户中心
import creditManagementIds from "./routerGroup/creditManagementIds"; // 信用管理
import settingsIds from "./routerGroup/settingsIds"; // 信用管理
// import relation from "./routerGroup/relation"; // 关系探寻
// import Channel from "./routerGroup/Channel"; // 渠道
// import creditRestoration from "./routerGroup/Creditrestoration"; // 信用修复页面
import ServiceFair from "./routerGroup/serviceFair"
Vue.use(Router);
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
export const constantRouterMap = [
    ...PublicRouter,
    // ...CreditFiling,
    // ...Monitor,
    // ...CreditTrain,
    ...UserCenter,
    // ...relation,
    creditManagementIds.creditManagement(),
    // settingsIds.settings(),
    // ...Channel,
    // ...creditRestoration
    ...ServiceFair

];
/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
 **/

// 菜单key对应的路由组件
export const menuIdComponents = {
    'blank': () => ({
        path: '',
        component: Blank,
        name: '',
        meta: {
            title: ''
        }
    }),
    ...creditManagementIds,
    ...settingsIds,

};
// 导出路由对象
export default new Router({
    mode: "history", // require service support
    routes: constantRouterMap,
    scrollBehavior(to, from, savedPosition) {
        // return 期望滚动到哪个的位置
        return {
            y: 0
        }
    }
});

// 空白组件，用于承载多级菜单下的路由组件
export const Blank = () =>
    import ("@/views/blank");
