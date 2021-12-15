// 合同管理
export default {
    contractManagement: () => ({
        component: () => import("@/views/blank"),
        meta: { title: "合同管理", icon: "dashboard" }
    }),
    contractLedger: () => ({
        name: "contractLedger",
        component: () => import("@/views/creditManagement/contractManagement/contractLedger/index"),
        meta: { title: "合同台账" }
    }),
    orderManagement: () => ({
        name: "orderManagement",
        component: () => import("@/views/creditManagement/contractManagement/orderManagement/index"),
        meta: { title: "订单管理" }
    })
};
