import creditEstimate from "./creditEstimate"; // 信用评估
import contractManagement from "./contractManagement"; // 合同管理
// import organization from "./organization"; // 组织架构
import customerProfile from "./customerProfile"; // 客户档案
import creditGranting from "./creditGranting"; // 授信管理
import shippingManagement from "./shippingManagement"; // 发货管理
import accountsReceivable from "./accountsReceivable"; // 应收账款
import invoiceManagement from "./invoiceManagement"; // 发票管理
import creditCollection from "./creditCollection"; // 信用催收
import statisticalAnalysis from "./statisticalAnalysis"; // 统计分析
// import companynotice from "./companynotice"; // 企业通知
// import companyapply from "./companyApply"; // 申请
import workportal from "./workportal";

// import monitor from "./monitor"; // 信用监测
/**
 * 信用管理
 */
export default {
    creditManagement: () => ({
        path: "/front/creditManagement",
        component: () => import("@/views/creditManagement/index"),
        name: "creditManagement",
        meta: { title: "工作门户", icon: "dashboard" },
        redirect: "/front/workportal/notice",
        children: [
            {
                hidden: true,
                path: "/front/workportal/notice",
                component: () =>
                    import("@/views/creditManagement/companyNotice/index"),
                meta: { title: "企业通知", icon: "icon-desktop" }
            },
            {
                hidden: true,
                path: "/front/creditManagement/addActivity",
                name: "addActivities",
                component: () =>
                    import(
                        "@/views/creditManagement/companyActivity/addActivity"
                    ),
                meta: { title: "", icon: "" }
            },
            {
                hidden: true,
                path: "/front/creditManagement/:id/companyActivitiesDetails",
                name: "companyActivitiesDetails",
                component: () =>
                    import(
                        "@/views/creditManagement/companyActivity/companyActivitiesDetails"
                    ),
                meta: {
                    title: "",
                    icon: "",
                    GuidePath: true,
                    JumpPath: "/front/workportal/activities"
                }
            },
            {
                hidden: true,
                path: "/front/creditManagement/:id/accountDetail",
                name: "accountDetails",
                component: () =>
                    import(
                        "@/views/creditManagement/accountManagement/accountDetails"
                    ),
                meta: {
                    title: "",
                    icon: "",
                    GuidePath: true,
                    JumpPath:
                        "/front/workportal/accountManagement/accountNoticeList"
                }
            },
            {
                hidden: true,
                path: "/front/accountManagement/:id/reminderNoticeDetail",
                name: "reminderNoticeDetail",
                component: () =>
                    import(
                        "@/views/creditManagement/accountManagement/reminderNoticeDetail"
                    ),
                meta: {
                    title: "",
                    icon: "",
                    GuidePath: true,
                    JumpPath:
                        "/front/workportal/accountManagement/reminderNoticeList"
                }
            },
            // 工作台
            {
                path: "/workbench",
                name: "workbench",
                component: () => import("@/views/creditManagement/workbench/index")
            }
        ]
    }),
    ...workportal
    // ...creditEstimate,
    // ...contractManagement,
    // // ...organization,
    // ...customerProfile,
    // ...creditGranting,
    // ...shippingManagement,
    // ...accountsReceivable,
    // ...invoiceManagement,
    // ...creditCollection,
    // ...statisticalAnalysis
    // ...monitor
};
