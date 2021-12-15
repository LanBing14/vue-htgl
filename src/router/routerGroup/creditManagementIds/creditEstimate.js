// 信用评估
export default {
    'creditEstimate': () => ({
        component: () =>
            import ("@/views/blank"),
        meta: { title: '信用评估', icon: 'dashboard' }
    }),
    'target': () => ({
        component: () =>
            import ("@/views/creditManagement/creditEstimate/target/index"),
        meta: { title: '评估指标' }
    }),
    'model': () => ({
        component: () =>
            import ("@/views/creditManagement/creditEstimate/model/index"),
        meta: { title: '评估模型' }
    }),
    'record': () => ({
        component: () =>
            import ("@/views/creditManagement/creditEstimate/record/index"),
        name: 'record',
        meta: { title: '评估记录' }
    })
}