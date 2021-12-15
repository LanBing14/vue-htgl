import Layout from '@/views/layouts/fxb/index';

/**
 * router列表
 */

export default [{
        path: '/redirect',
        component: Layout,
        children: [{
            path: '/redirect/:path*',
            component: () =>
                import ('@/views/redirect/index')
        }]
    },
    {
        path: '/',
        component: () =>
            import ('@/views/index/home'),
        redirect: '/front/workportal/notice',
        meta: {
            title: '风信标-SaaS化服务，助力企业建立全面风险管理！'
        },
    },
    {
        path: '/login',
        name: 'login',
        component: () =>
            import ('@/views/login/Login'),
    },
    {
        path: '/loginAuth',
        name: 'loginAuth',
        component: () =>
            import ('@/views/login/loginAuth'),
    },
    {
        path: '/register',
        name: 'register',
        component: () =>
            import ('@/views/login/Register'),
    },
    // // 单点登录空白页面
    {
        path: '/blankSingIn',
        name: 'blankSingIn',
        component: () =>
            import ('@/views/blankSingIn/blankSingIn.vue'),
    },
    {
        path: '/applyOther',
        name: 'applyOther',
        component: () =>
        import("@/views/creditManagement/companyApply/applyWrite/removeOtherHandle"),
    },
    // {
    //     path: '/riskIndex',
    //     name: 'riskIndex',
    //     component: () =>
    //         import ('@/views/riskIndex/index'),
    //     meta: {
    //         title: '风信标-风险指数'
    //     }
    // },
    // {
    //     path: '/creditRepair',
    //     component: () =>
    //         import ('@/views/creditRepair/index'),
    //     meta: {
    //         title: '风信标-信用修复'
    //     }
    // },
    // {
    //     path: '/creditRestoration',
    //     component: () =>
    //         import ('@/views/creditRestoration/index'),
    //     meta: {
    //         title: '风信标-信用修复'
    //     }
    // },
    // {
    //     path: '/checkAll',
    //     component: () =>
    //         import ('@/views/checkAll/index'),
    //     meta: {
    //         title: '风信标-批量查询'
    //     }
    // },

    // {
    //     path: '/checkAllResults',
    //     name: 'checkAllResults',
    //     component: () =>
    //         import ('@/views/checkAllResults/checkAllResults.vue'),
    //     meta: {
    //         title: '风信标-批量查询结果页'
    //     }
    // },

    // // 企业认证页面

    // {
    //     path: '/enterpriseCertification',
    //     name: 'enterpriseCertification',
    //     component: () =>
    //         import ('@/views/enterpriseCertification/enterpriseCertification.vue'),
    //     meta: {
    //         title: '风信标-企业认证'
    //     }

    // },





    // {
    //     path: '/payment',
    //     component: Layout,
    //     meta: {
    //         title: '风信标-在线支付'
    //     },
    //     children: [{
    //         path: '',
    //         component: () =>
    //             import ('@/views/payment/payment')
    //     }]
    // },
    // {
    //     path: '/paySuccess',
    //     component: Layout,
    //     meta: {
    //         title: '风信标-支付成功'
    //     },
    //     children: [{
    //         path: '',
    //         component: () =>
    //             import ('@/views/payment/paySuccess')
    //     }]
    // },
    // {
    //     path: '/advanceSearch',
    //     component: () =>
    //         import ('@/views/advanceSearch/index'),
    //     children: [{
    //             path: '',
    //             component: () =>
    //                 import ('@/views/advanceSearch/SearchHome'),
    //             meta: {
    //                 title: '风信标-信用查询'
    //             }
    //         },
    //         {
    //             path: 'result',
    //             component: () =>
    //                 import ('@/views/advanceSearch/SearchResult'),
    //             meta: {
    //                 title: '风信标-信用查询-结果'
    //             }
    //         }
    //     ]
    // },
    // // 测试
    // {
    //     path: '/news',
    //     name: 'news',
    //     component: () =>
    //         import ('@/views/creditMonitor/credit/components/News')
    // },
    // {
    //     path: '/test',
    //     component: () =>
    //         import ('@/views/creditManagement/customerProfile/creditFile/index'),
    //     redirect: '/test/test',
    //     children: [
    //         // 基本信息
    //         {
    //             path: 'test1',
    //             name: 'test1',
    //             component: () =>
    //                 import ('@/views/creditManagement/customerProfile/creditFile/test1')
    //         },
    //         // 司法风险
    //         {
    //             path: 'test2',
    //             name: 'test2',
    //             component: () =>
    //                 import ('@/views/creditManagement/customerProfile/creditFile/test2')
    //         },
    //         // 经营状况
    //         {
    //             path: 'test3',
    //             name: 'test3',
    //             component: () =>
    //                 import ('@/views/creditManagement/customerProfile/creditFile/test3')
    //         },
    //         // 知识产权
    //         {
    //             path: 'test4',
    //             name: 'test4',
    //             component: () =>
    //                 import ('@/views/creditManagement/customerProfile/creditFile/test4')
    //         },
    //         // 尽职调查
    //         {
    //             path: 'test5',
    //             name: 'test5',
    //             component: () =>
    //                 import ('@/views/creditManagement/customerProfile/creditFile/dueDiligence/index')
    //         }
    //     ]
    // },
    // // 公司档案
    // {
    //     path: '/creditFile',
    //     component: () =>
    //         import ('@/views/advanceSearch/CreditFile'),
    //     redirect: '/creditFile/creditEval',
    //     children: [
    //         // 信用评价
    //         {
    //             path: 'creditEval',
    //             name: 'creditEval',
    //             component: () =>
    //                 import ('@/views/advanceSearch/creditFile/CreditEval.vue')
    //         },
    //         // 基本档案
    //         {
    //             path: 'basicArchive',
    //             name: 'basicArchive',
    //             component: () =>
    //                 import ('@/views/advanceSearch/creditFile/BasicArchive.vue')
    //         },
    //         // 企业图谱
    //         {
    //             path: 'companyMap',
    //             name: 'companyMap',
    //             component: () =>
    //                 import ('@/views/advanceSearch/creditFile/CompanyMap.vue'),
    //             redirect: '/creditFile/companyMap/qiYe',
    //             children: [{
    //                     path: 'qiYe',
    //                     name: 'qiYe',
    //                     components: {
    //                         creditMap: () =>
    //                             import ('@/views/advanceSearch/creditFile/map/QiYe.vue')
    //                     }
    //                 },
    //                 {
    //                     path: 'guanLian',
    //                     name: 'guanLian',
    //                     components: {
    //                         creditMap: () =>
    //                             import ('@/views/advanceSearch/creditFile/map/GuanLian.vue')
    //                     }
    //                 },
    //                 {
    //                     path: 'guQuan',
    //                     name: 'guQuan',
    //                     components: {
    //                         creditMap: () =>
    //                             import ('@/views/advanceSearch/creditFile/map/GuQuan.vue')
    //                     }
    //                 },
    //                 {
    //                     path: 'beneficiaryShareholders',
    //                     name: 'beneficiaryShareholders',
    //                     components: {
    //                         creditMap: () =>
    //                             import ('@/views/advanceSearch/creditFile/map/BeneficiaryShareholders.vue')
    //                     }
    //                 }
    //             ]
    //         },
    //         // 司法信息
    //         {
    //             path: 'judicialInfo',
    //             name: 'judicialInfo',
    //             component: () =>
    //                 import ('@/views/advanceSearch/creditFile/JudicialInfo.vue')
    //         },
    //         // 经营风险
    //         {
    //             path: 'businessRisk',
    //             name: 'businessRisk',
    //             component: () =>
    //                 import ('@/views/advanceSearch/creditFile/BusinessRisk.vue')
    //         },
    //         // 经营状况
    //         {
    //             path: 'operateCond',
    //             name: 'operateCond',
    //             component: () =>
    //                 import ('@/views/advanceSearch/creditFile/OperateCond.vue')
    //         },
    //         // 知识产权
    //         {
    //             path: 'knowledgePro',
    //             name: 'knowledgePro',
    //             component: () =>
    //                 import ('@/views/advanceSearch/creditFile/KnowledgePro.vue')
    //         },
    //         // 动态监测
    //         {
    //             path: 'dynamicMon',
    //             name: 'dynamicMon',
    //             component: () =>
    //                 import ('@/views/advanceSearch/creditFile/DynamicMon.vue')
    //         }
    //     ]
    // },
    // {
    //     path: '/buy',
    //     name: 'buy',
    //     component: () =>
    //         import ('@/views/buy/index'),
    //     meta: {
    //         title: '产品定价'
    //     }
    // },
    // {
    //     path: '/about',
    //     component: () =>
    //         import ('@/views/aboutUs/index'),
    //     meta: {
    //         title: '关于我们'
    //     }
    // },
    // {
    //     path: '/agreement',
    //     component: () =>
    //         import ('@/views/agreement/index'),
    //     meta: {
    //         title: '用户服务协议与隐私政策'
    //     }
    // },
    {
        path: '/404',
        component: () =>
            import ('@/views/errorPage/404'),
        meta: {
            title: '404找不到页面了'
        }
    },
    {
        path: '/401',
        component: () =>
            import ('@/views/errorPage/401')
    }
];