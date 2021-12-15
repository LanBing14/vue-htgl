export default {
    'workbench':() => ({
        path:'workbench',
        component: () => import("@/views/creditManagement/workbench/index"),
        meta: {title: '工作台', icon: 'dashboard'}
    }),
    'workportal': () => ({
        component: () => import("@/views/blank"),
        meta: {title: '工作门户', icon: 'dashboard'}
    }),
    'apply': () => ({
        path: 'apply',
        component: () => import("@/views/creditManagement/companyApply/index"),
        meta: {title: "征集信息"}
    }),
    'notice': () => ({
        path: "notice",
        component: () =>
            import ("@/views/creditManagement/companyNotice/index"),
        meta: { title: "企业通知" }
    }),
    'activities': () => ({
        path: "activities",
        component: () =>
            import ("@/views/creditManagement/companyActivity/companyActivity"),
        meta: { title: "创新活动" }
    }),
    'accountManagement': () => ({
        path: "accountManagement",
        component: () =>
            import ("@/views/creditManagement/accountManagement/accountNoticeList"),
        meta: { title: "账务管理" }
    }),
    'accountNoticeList': () => ({
        path: "accountManagement/accountNoticeList",
        component: () =>
            import ("@/views/creditManagement/accountManagement/accountNoticeList"),
        meta: { title: "收款通知单" }
    }),
    'reminderNoticeList': () => ({
        path: "accountManagement/reminderNoticeList",
        component: () =>
            import ("@/views/creditManagement/accountManagement/reminderNoticeList"),
        meta: { title: "收款通知单" }
    }),
};