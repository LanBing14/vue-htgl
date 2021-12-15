//企业通知

export default {
    'applyblank': () => ({
        component: () => import("@/views/blank"),
        meta: {title: '企业通知', icon: 'dashboard'}
    }),
    'apply': () => ({
        path: 'apply',
        component: () => import("@/views/creditManagement/companyApply/index"),
        meta: {title: "企业通知"}
    })
};
