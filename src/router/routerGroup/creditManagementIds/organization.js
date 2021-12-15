// 组织架构
export default {
    'organization': () => ({
        component: () => import("@/views/creditManagement/organization/index"),
        meta: {title: '组织架构', icon: 'dashboard'}
    })
}
