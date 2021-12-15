// 登录验证
export default [
    {
        path: '/loginAuth',
        name: 'loginAuth',
        component: () =>
            import ('@/views/login/loginAuth'),
    },
]