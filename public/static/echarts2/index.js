import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '@/views/layouts/fxb/index'
import {isLoginApi} from '@/api/login'

Vue.use(Router);

// import LayoutSuper from '@/views/layouts/super/index'

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

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
// 常规路由，不需要动态获取
export const constantRouterMap = [
    {
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [{
            path: '/redirect/:path*',
            component: () => import('@/views/redirect/index')
        }]
    },
    {
        path: '/',
        component: () => import('@/views/index/index'),
        hidden: false
    },
    // 信用查询
    {
        path: '/advanceSearch',
        component: Layout,
        hidden: true,
        children: [{
            path: '',
            component: () => import('@/views/advanceSearch/index'),
        }]
    },
    {
        path: '/creditFile',
        component: () => import('@/views/advanceSearch/CreditFile'),
        redirect: '/creditFile/creditEval',
        children: [
            // 信用评价
            {
                path: 'creditEval',
                name: 'creditEval',
                component: () => import('@/views/advanceSearch/creditFile/CreditEval.vue')
            },
            // 基本档案
            {
                path: 'basicArchive',
                name: 'basicArchive',
                component: () => import('@/views/advanceSearch/creditFile/BasicArchive.vue')
            },
            // 企业图谱
            {
                path: 'companyMap',
                name: 'companyMap',
                component: () => import('@/views/advanceSearch/creditFile/CompanyMap.vue'),
                children: [
                    {
                        path: 'qiYe',
                        name: 'qiYe',
                        component: () => import('@/views/advanceSearch/creditFile/map/QiYe.vue')
                    },
                    {
                        path: 'guanLian',
                        name: 'guanLian',
                        component: () => import('@/views/advanceSearch/creditFile/map/GuanLian.vue')
                    },
                    {
                        path: 'guQuan',
                        name: 'guQuan',
                        component: () => import('@/views/advanceSearch/creditFile/map/GuQuan.vue')
                    },
                ]
            },
            // 司法信息
            {
                path: 'judicialInfo',
                name: 'judicialInfo',
                component: () => import('@/views/advanceSearch/creditFile/JudicialInfo.vue')
            },
            // 经营风险
            {
                path: 'businessRisk',
                name: 'businessRisk',
                component: () => import('@/views/advanceSearch/creditFile/BusinessRisk.vue')
            },
            // 经营状况
            {
                path: 'operateCond',
                name: 'operateCond',
                component: () => import('@/views/advanceSearch/creditFile/OperateCond.vue')
            },
            // 知识产权
            {
                path: 'knowledgePro',
                name: 'knowledgePro',
                component: () => import('@/views/advanceSearch/creditFile/KnowledgePro.vue')
            },
            // 动态监测
            {
                path: 'dynamicMon',
                name: 'dynamicMon',
                component: () => import('@/views/advanceSearch/creditFile/DynamicMon.vue')
            },
        ]
    },
    // 企业监测
    {
        path: '/creditMonitor',
        component: Layout,
        children: [{
            path: '',
            component: () => import('@/views/creditMonitor/CreditMonitor'),
        }]
    },
    {
        path: '/404',
        component: () => import('@/views/errorPage/404'),
        hidden: true
    },
    {
        path: '/401',
        component: () => import('@/views/errorPage/401'),
        hidden: true
    },
];

// 导出路由对象
export default new Router({
    mode: 'history', // require service support
    scrollBehavior: () => ({y: 0}),
    routes: constantRouterMap
})

// 空白组件，用于承载多级菜单下的路由组件
export const Blank = () => import('@/views/blank');

// 风信标路游
export const fxbComponents = [
    {
        path: '/userCenter',
        component: () => import('@/views/userCenter/index'),
        children: [
            {
                path: '',
                name: 'UserCenter',
                component: () => import('@/views/userCenter/index')
            },
            {
                path: '/userCenter/info',
                name: 'userInfo',
                components: {
                    'userCenter': () => import('@/views/userCenter/components/UserInfo.vue')
                },
                beforeEnter: (to, from, next) => {
                    console.info('进入页面前面');
                    isLoginApi().then(data => {
                        console.info(data);
                        if (data.stateCode === '20111' || data.stateCode === '40500') {
                            // 已登录 / 不同用户登录同一账号密码被修改时
                            next();
                        } else {
                            // 请登录账号
                            next({
                                path: '/',
                                query: {messageInfo: '请重新登录'}
                            })
                        }
                    });

                },
            },
            {
                path: 'order',
                name: 'order',
                components: {
                    'userCenter': () => import('@/views/userCenter/components/MyOrder.vue')
                }
            },
            {
                path: 'convern',
                name: 'convern',
                components: {
                    'userCenter': () => import('@/views/userCenter/components/MyConcern.vue')
                }
            },
            {
                path: 'message',
                name: 'message',
                components: {
                    'userCenter': () => import('@/views/userCenter/components/MessageCenter.vue')
                }
            },
            {
                path: 'contact',
                name: 'contact',
                components: {
                    'userCenter': () => import('@/views/userCenter/components/Contact.vue')
                }
            }
        ]
    }
];
