import Layout from "@/views/layouts/fxb/index";

/**
 * 信用培训router列表
 */

export default [
    {
        path: "/creditTrain",
        component: () => import("@/views/creditTrain/index"),
        meta: {
            title: "风信标-信用培训"
        }
    },
    {
        path: "/creditTeacherList",
        component: Layout,
        children: [
            {
                path: "",
                component: () => import("@/views/creditTrain/TeacherList"),
                meta: {
                    title: "风信标-信用教师"
                }
            },
            {
                path: "teacherInfo",
                component: () => import("@/views/creditTrain/TeacherInfo"),
                meta: {
                    title: "风信标-信用教师详情"
                }
            }
        ]
    },
    {
        path: "/trainClass",
        component: Layout,
        children: [
            {
                path: "",
                component: () => import("@/views/creditTrain/TrainClass"),
                meta: {
                    title: "风信标-培训班级"
                }
            },
            {
                path: "classInfo",
                component: () => import("@/views/creditTrain/ClassInfo"),
                meta: {
                    title: "风信标-培训班详情"
                }
            }
        ]
    },
    {
        path: "/creditTrain/trainCourse",
        component: Layout,
        children: [
            {
                path: "",
                component: () => import("@/views/creditTrain/TrainCourse"),
                meta: {
                    title: "风信标-培训课程"
                }
            },
            {
                path: "courseInfo",
                component: () => import("@/views/creditTrain/CourseInfo"),
                meta: {
                    title: "风信标-培训课程详情"
                }
            }
        ]
    },
    {
        path: "/creditTrain/video",
        component: () => import("@/views/creditTrain/Video"),
        meta: {
            title: "风信标-培训视频"
        }
    },
    // 在线考试
    {
        path: "/onlineTest/:exampaperId/:trainId",
        component: () => import("@/views/onlineTest/Index"),
        meta: {
            title: "风信标-在线考试"
        }
    }
];
