/**
 * 信用管理
 */

export default {
    'settings': () => ({
        path: '/front/settings',
        component: () => import("@/views/settings/index"),
        name: 'settings',
        meta: {title: '设置中心', icon: 'dashboard'},
        // redirect: '/front/settings/basic',
        children: [/* {
            path: '/front/settings/basic',
            component: () => import("@/views/settings/basicInfo/index"),
            name: 'basic',
            meta: {title: '资料设置', icon: 'dashboard'}
        }*/]
    }),
    dept: () => ({
        component: () => import("@/views/settings/dept/index"),
        name: 'dept',
        meta: {title: '组织架构', icon: 'dashboard'}
    }),
    role: () => ({
        component: () => import("@/views/settings/role/index"),
        name: 'role',
        meta: {title: '角色管理', icon: 'dashboard'}
    }),
    workflow: () => ({
        component: () => import("@/views/settings/workflow/index"),
        name: 'workflow',
        meta: {title: '流程管理', icon: 'dashboard'}
    })
};
