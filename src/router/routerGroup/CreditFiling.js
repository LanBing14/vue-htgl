/**
 * 信用建档router列表
 */

export default [
    {
        path: "/creditFiling",
        component: () => import("@/views/creditFiling/index")
    },
    {
        path: "/companyFiling",
        component: () => import("@/views/creditFiling/companyFiling"),
        redirect: "/companyFiling/creditCard",
        children: [
            {
                path: "creditCard",
                components: {
                    filingNav: () =>
                        import("@/views/creditFiling/creditCard/index")
                }
            },
            {
                path: "dataList",
                name: "dataList",
                components: {
                    filingNav: () =>
                        import("@/views/creditFiling/dataList/Index")
                },
                redirect: "/companyFiling/dataList/basicinfo",
                children: [
                    {
                        path: "basicinfo",
                        name: "basicinfo",
                        components: {
                            dataList: () =>
                                import(
                                    "@/views/creditFiling/dataList/BasicInfo"
                                )
                        }
                    }
                ]
            }
        ]
    }
];
