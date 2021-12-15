/**
 * 信用监测router列表
 */

export default [{
    path: "/monitor",
    component: () =>
        import ("@/views/creditMonitor/CreditMonitor.vue"),
    meta: {
        title: "信用监测"
    },
    redirect: "monitor/overView",
    children: [
        // 监测概览
        {
            path: "overView",
            name: "overView",
            component: () =>
                import ("@/views/creditMonitor/credit/overview.vue"),
            meta: {
                title: "监测概览",
                icon: 'icon-xiangmugailan'
            }
        },

        // 监测列表
        {
            path: "creditList",
            name: "creditList",
            component: () =>
                import ("@/views/creditMonitor/credit/CreditList.vue"),
            meta: {
                title: "监测列表",
                icon: 'icon-container'
            }
        },
        // 监测信息 => 改为监测动态
        {
            path: "creditInfo",
            name: "creditInfo",
            component: () =>
                import ("@/views/creditMonitor/credit/creditInfo/index.vue"),
            meta: {
                title: "监测动态",
                icon: 'icon-barchart'
            }
        },
        // 监测预警
        {
            path: "creditWarning",
            name: "creditWarning",
            component: () =>
                import ("@/views/creditMonitor/credit/CreditWarning.vue"),
            meta: {
                title: "监测预警",
                icon: 'icon-warning-circle'
            }
        },
        // 监测设置
        {
            path: "creditSet",
            name: "creditSet",
            component: () =>
                import ("@/views/creditMonitor/credit/CreditSet.vue"),
            meta: {
                title: "监测设置",
                icon: 'icon-setting'
            }
        },
        // 舆情动态
        {
            path: "publicOpinionDynamics",
            name: "publicOpinionDynamics",
            component: () =>
                import ("@/views/creditMonitor/credit/PublicOpinionDynamics.vue"),
            meta: {
                title: "舆情动态",
                icon: 'icon-linechart'
            }
        }
    ]
}];