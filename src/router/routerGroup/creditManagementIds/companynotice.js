//企业通知

export default {
    'noticeblank': () => ({
        component: () =>
            import ("@/views/blank"),
        meta: { title: '企业通知', icon: 'dashboard' }
    }),
    'notice': () => ({
        path: "notice",
        component: () =>
            import ("@/views/creditManagement/companyNotice/index"),
        meta: { title: "企业通知" }
    })
};