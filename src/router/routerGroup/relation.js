// 关联探寻
export default [
    {
        path: "/relation",
        name: 'relation',
        component: () => import("@/views/relation/index"),
        redirect: "relation/relation",
        children: [
            {
                path: "relation",
                component: () => import("@/views/relation/relation/index"),
                name: "relationMain",
                meta: {title: "关系探寻", icon: "dashboard"}
            }
        ]
    }
];
