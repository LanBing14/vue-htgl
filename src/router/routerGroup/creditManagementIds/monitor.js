// 信用监测
export default {
    monitor: () => ({
        component: () => import("@/views/blank"),
        meta: { title: "信用监测", icon: "dashboard" }
    }),
    creditList: () => ({
        component: () => import("@/views/creditMonitor/credit/CreditList.vue"),
        meta: { title: "监测列表" }
    }),
    creditInfo: () => ({
        component: () => import("@/views/creditMonitor/credit/Main.vue"),
        meta: {title: "监测动态"}
    }),
    creditWarning: () => ({
        component: () => import("@/views/creditMonitor/credit/CreditWarning.vue"),
        meta: { title: "监测预警" }
    }),
    creditSet: () => ({
        component: () => import("@/views/creditMonitor/credit/CreditSet.vue"),
        meta: { title: "监测设置" }
    }),
    publicOpinionDynamics: () => ({
        component: () => import("@/views/creditMonitor/credit/PublicOpinionDynamics.vue"),
        meta: { title: "舆情动态" }
    })
};
