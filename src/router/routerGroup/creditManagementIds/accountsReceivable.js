// 应收账款
export default {
    accountsReceivable: () => ({
        component: () => import("@/views/blank"),
        meta: { title: "应收账款", icon: "dashboard" }
    }),
    receivableConfirmation: () => ({
        component: () =>
            import("@/views/creditManagement/accountsReceivable/receivableConfirmation/index"),
        meta: { title: "应收确认管理" }
    }),
    receivableManagement: () => ({
        component: () =>
            import("@/views/creditManagement/contractManagement/planTracking/index"),
        name: "receivableManagement",
        meta: { title: "应收账款管理" }
    }),
    overdueManagement: () => ({
        component: () =>
            import("@/views/creditManagement/accountsReceivable/overdueManagement/index"),
        meta: { title: "逾期账款管理" }
    }),
    reconciliationManagement: () => ({
        component: () =>
            import("@/views/creditManagement/accountsReceivable/reconciliationManagement/index"),
        name: "reconciliationManagement",
        meta: { title: "客户对账管理" }
    }),
    customerAnalysis: () => ({
        component: () =>
            import("@/views/creditManagement/contractManagement/customerAnalysis/index"),
        name: "customerAnalysis",
        meta: { title: "客户账龄分析" }
    }),
    paymentManagement: () => ({
        component: () =>
            import("@/views/creditManagement/accountsReceivable/paymentManagement/index"),
        name: "paymentManagement",
        meta: { title: "付款条件管理" }
    }),
    receiptRecords: () => ({
        component: () =>
            import("@/views/creditManagement/accountsReceivable/receiptRecords/index"),
        name: "receiptRecords",
        meta: { title: "收款记录管理" }
    })
};
