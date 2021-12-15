// 信用催收
export default {
    'creditCollection': () => ({
        component: () => import("@/views/blank"),
        name: "creditCollection",
        meta: {title: "信用催收", icon: "dashboard"}
    }),
    'collectionsOverview': () => ({
        component: () => import("@/views/creditManagement/creditCollection/collectionsOverview/index"),
        meta: {title: "催收总览"}
    }),
    'overdueCollection': () => ({
        name: 'overdueCollection',
        component: () => import("@/views/creditManagement/creditCollection/overdueCollection/index"),
        meta: {title: "逾期催收"}
    }),
    'collectionWarning': () => ({
        name: 'collectionWarning',
        component: () => import("@/views/creditManagement/creditCollection/collectionWarning/index"),
        meta: {title: "催收预警"}
    }),
    'collectionPlan': () => ({
        component: () => import("@/views/creditManagement/creditCollection/collectionPlan/index"),
        meta: {title: "催收方案管理"}
    })
};
