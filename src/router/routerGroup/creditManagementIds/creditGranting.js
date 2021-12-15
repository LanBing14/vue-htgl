// 授信管理
export default {
    creditGranting: () => ({
        component: () => import("@/views/blank"),
        meta: { title: "授信管理", icon: "dashboard" }
    }),
    creditPolicy: () => ({
        component: () =>
            import(
                "@/views/creditManagement/creditGranting/creditPolicy/index"
            ),
        meta: { title: "信用政策管理" }
    }),
    customer: () => ({
        component: () =>
            import("@/views/creditManagement/creditGranting/customer/index"),
        meta: { title: "客户授信管理" }
    }),
    creditApplication: () => ({
        name: "creditApplication",
        component: () =>
            import(
                "@/views/creditManagement/creditGranting/creditApplication/index"
            ),
        meta: { title: "客户授信申请" }
    }),
    creditApproval: () => ({
        component: () =>
            import(
                "@/views/creditManagement/creditGranting/creditApproval/index"
            ),
        meta: { title: "客户授信审批" }
    })
};
