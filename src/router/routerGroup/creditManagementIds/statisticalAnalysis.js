// 统计分析
export default {
    statisticsAnalysis: () => ({
        component: () => import("@/views/blank"),
        meta: { title: "统计分析" }
    }),
    statisticsOverview: () => ({
        component: () => import("@/views/creditManagement/statisticsAnalysis/statisticsOverview/index"),
        meta: { title: "统计概览" }
    }),
    receivablesReport: () => ({
        name: 'receivablesReport',
        component: () => import("@/views/creditManagement/statisticsAnalysis/receivablesReport/index"),
        meta: { title: "应收账款报表" }
    }),
    warningReport: () => ({
        name: 'warningReport',
        component: () => import("@/views/creditManagement/statisticsAnalysis/warningReport/index"),
        meta: {title: "应收预警报表"}
    }),
    overdueReport: () => ({
        name: 'overdueReport',
        component: () => import("@/views/creditManagement/statisticsAnalysis/overdueReport/index"),
        meta: {title: "逾期应收报表"}
    }),
    expectedReport: () => ({
        component: () => import("@/views/creditManagement/statisticsAnalysis/expectedReport/index"),
        meta: { title: "预期应收报表" }
    }),
    receivablesTurnover: () => ({
        name: 'receivablesTurnover',
        component: () => import("@/views/creditManagement/statisticsAnalysis/receivablesTurnover/index"),
        meta: {title: "应收周转情况"}
    }),
    creditAlert: () => ({
        name: 'creditAlert',
        component: () => import("@/views/creditManagement/statisticsAnalysis/creditAlert/index"),
        meta: {title: "客户信用预警"}
    }),
    creditAnalysis: () => ({
        name: 'creditAnalysis',
        component: () => import("@/views/creditManagement/statisticsAnalysis/creditAnalysis/index"),
        meta: {title: "客户授信分析"}
    }),
    letterAnalysis: () => ({
        name: 'letterAnalysis',
        component: () => import("@/views/creditManagement/statisticsAnalysis/letterAnalysis/index"),
        meta: {title: "客户用信分析"}
    }),
    applicationAnalysis: () => ({
        name: 'applicationAnalysis',
        component: () => import("@/views/creditManagement/statisticsAnalysis/applicationAnalysis/index"),
        meta: {title: "授信申请分析"}
    })
};
