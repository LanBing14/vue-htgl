// 客户档案
export default {
    'customerProfile': () => ({
        component: () => import("@/views/blank"),
        meta: {title: '客户档案', icon: 'dashboard'}
    }),
    'customerManagement': () => ({
        name: 'customerManagement',
        component: () => import("@/views/creditManagement/customerProfile/customerManagement/index"),
        meta: {title: '客户管理'}
    }),
    'creditFile': () => ({
        component: () => import("@/views/creditManagement/customerProfile/creditFile/index"),
        meta: {title: '客户资信档案'}
    }),
    'customerPerformance': () => ({
        component: () => import("@/views/creditManagement/customerProfile/customerPerformance/index"),
        meta: {title: "客户履约情况"}
    }),
    'badCustomer': () => ({
        component: () => import("@/views/creditManagement/customerProfile/badCustomer/index"),
        meta: {title: "不良客户管理"}
    })
};
