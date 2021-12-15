
/**
 * 信易贷router列表
 */

export default [// 信易贷
    {
        path: "/xinYiLoan/xinYi",
        name: "xinYi",
        component: () => import("@/views/xinYiLoan/XinYi.vue")
    },
    {
        path: "/xinYiLoan",
        component: () => import("@/views/xinYiLoan/index"),
        redirect: "/xinYiLoan/xinYi",
        children: [
            // 信易贷流程
            {
                path: "xinYiStep",
                name: "xinYiStep",
                component: () => import("@/views/xinYiLoan/XiYiStep.vue"),
                redirect: "/xinYiLoan/xinYiStep/demandFill",
                children: [
                    {
                        path: "demandFill",
                        name: "demandFill",
                        components: {
                            step: () =>
                                import(
                                    "@/views/xinYiLoan/xinYiStep/DemandFill.vue"
                                )
                        }
                    },
                    {
                        path: "onlineAuthor",
                        name: "onlineAuthor",
                        components: {
                            step: () =>
                                import(
                                    "@/views/xinYiLoan/xinYiStep/OnlineAuthor.vue"
                                )
                        }
                    },
                    {
                        path: "infoPush",
                        name: "infoPush",
                        components: {
                            step: () =>
                                import(
                                    "@/views/xinYiLoan/xinYiStep/infoPush.vue"
                                )
                        }
                    }
                ]
            },
            // 金融产品列表
            {
                path: "productList",
                name: "productList",
                component: () => import("@/views/xinYiLoan/ProductList.vue")
            },
            // 金融产品详情
            {
                path: "productDetail",
                name: "productDetail",
                component: () => import("@/views/xinYiLoan/ProductDetail.vue")
            }
        ]
    }
]
