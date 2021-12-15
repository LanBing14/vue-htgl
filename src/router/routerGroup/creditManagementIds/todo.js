// 代办事项
export default {
    'todo': () => ({
        path: 'todo',
        component: () => import("@/views/creditManagement/todo/index"),
        meta: {title: '待办事项', icon: 'dashboard'}
    })
}
