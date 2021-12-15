// 服务集市
export default [{
        path: "/serviceFair",
        component: () =>
            import ("@/views/serviceFair/index"),

        meta: {
            keepAlive: true //此页面需要缓存
        }
    },
    /**报修申请页面 */
    {
        path: "/repair_application",
        component: () =>
            import ("@/views/serviceFair/repair_application")
    },
    /**访客预约登记 */
    {
        path: "/visitorD",
        component: () =>
            import ("@/views/serviceFair/visitor")
    },

    /**装修申请 */
    {
        path: "/decorationApplication",
        component: () =>
            import ("@/views/serviceFair/decorationApplication")
    }
    

]