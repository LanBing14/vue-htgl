import Blank from "@/router/index";
import Monitor from "./Monitor"; // 信用监测

/**
 * 信用管理
 */

export default [
  {
    path: "/creditManagement",
    component: () => import("@/views/creditManagement/index"),
    children: [
      {
        path: "creditEstimate",
        component: () => import("@/views/blank"),
        name: "creditEstimate",
        meta: { title: "信用评估", icon: "dashboard" },
        redirect: "creditEstimate/target",
        children: [
          {
            path: "target",
            component: () => import("@/views/creditManagement/creditEstimate/target/index"),
            name: "target",
            meta: { title: "评估指标", icon: "dashboard" }
          },
          {
            path: "model",
            component: () => import("@/views/creditManagement/creditEstimate/model/index"),
            name: "model",
            meta: { title: "评估模型", icon: "dashboard" }
          },
          {
            path: "record",
            component: () => import("@/views/creditManagement/creditEstimate/record/index"),
            name: "record",
            meta: { title: "评估记录", icon: "dashboard" }
          }
        ]
      },
      {
        path: "todo",
        component: () => import("@/views/creditManagement/todo/index"),
        name: "todo",
        meta: { title: "待办事项", icon: "dashboard" }
      },
      {
        path: "contractManagement",
        component: () => import("@/views/blank"),
        name: "contractManagement",
        meta: { title: "合同管理", icon: "dashboard" },
        children: [
          {
            path: "contractLedger",
            component: () => import("@/views/creditManagement/contractManagement/contractLedger/index"),
            name: "contractLedger",
            meta: { title: "合同台账", icon: "dashboard" }
          }
          // {
          //   path: "planTracking",
          //   component: () => import("@/views/creditManagement/contractManagement/planTracking/index"),
          //   name: "planTracking",
          //   meta: { title: "付款计划跟踪", icon: "dashboard" }
          // },
          // {
          //   path: "customerAnalysis",
          //   component: () => import("@/views/creditManagement/contractManagement/customerAnalysis/index"),
          //   name: "customerAnalysis",
          //   meta: { title: "客户账龄分析", icon: "dashboard" }
          // }
        ]
      },
      // {
      //   path: "organization",
      //   component: () => import("@/views/creditManagement/organization/index"),
      //   name: "organization",
      //   meta: { title: "组织架构", icon: "dashboard" }
      // },
      {
        path: "customerProfile",
        component: () => import("@/views/blank"),
        name: "customerProfile",
        meta: { title: "客户档案", icon: "dashboard" },
        children: [
          {
            path: "customerManagement",
            component: () => import("@/views/creditManagement/customerProfile/customerManagement/index"),
            name: "customerManagement",
            meta: { title: "客户管理", icon: "dashboard" }
          },
          {
            path: "creditFile",
            component: () => import("@/views/creditManagement/customerProfile/creditFile/index"),
            name: "creditFile",
            meta: { title: "客户资信档案", icon: "dashboard" }
          },
          {
            path: "customerPerformance",
            component: () => import("@/views/creditManagement/customerProfile/customerPerformance/index"),
            name: "customerPerformance",
            meta: { title: "客户履约情况", icon: "dashboard" }
          },
          {
            path: "badCustomer",
            component: () => import("@/views/creditManagement/customerProfile/badCustomer/index"),
            name: "badCustomer",
            meta: { title: "不良客户管理", icon: "dashboard" }
          }
        ]
      },
      {
        path: "creditGranting",
        component: () => import("@/views/blank"),
        name: "creditGranting",
        meta: { title: "授信管理", icon: "dashboard" },
        children: [
          {
            path: "customer",
            component: () => import("@/views/creditManagement/creditGranting/customer/index"),
            name: "customer",
            meta: { title: "客户授信管理", icon: "dashboard" }
          },
          {
            path: "creditApplication",
            component: () => import("@/views/creditManagement/creditGranting/creditApplication/index"),
            name: "creditApplication",
            meta: { title: "客户授信申请", icon: "dashboard" }
          },
          {
            path: "creditApproval",
            component: () => import("@/views/creditManagement/creditGranting/creditApproval/index"),
            name: "creditApproval",
            meta: { title: "客户授信审批", icon: "dashboard" }
          }
        ]
      },
      {
        path: "shippingManagement",
        component: () => import("@/views/blank"),
        name: "shippingManagement",
        meta: { title: "发货管理", icon: "dashboard" },
        children: [
          {
            path: "shippingTracking",
            component: () => import("@/views/creditManagement/shippingManagement/shippingTracking/index"),
            name: "shippingTracking",
            meta: { title: "发货跟踪", icon: "dashboard" }
          }
        ]
      },
      {
        path: "accountsReceivable",
        component: () => import("@/views/blank"),
        name: "accountsReceivable",
        meta: { title: "应收账款", icon: "dashboard" },
        children: [
          {
            path: "receivableConfirmation",
            component: () => import("@/views/creditManagement/accountsReceivable/receivableConfirmation/index"),
            name: "receivableConfirmation",
            meta: { title: "应收确认管理", icon: "dashboard" }
          },
          {
            path: "receivableManagement",
            component: () => import("@/views/creditManagement/contractManagement/planTracking/index"),
            name: "receivableManagement",
            meta: { title: "应收账款管理", icon: "dashboard" }
          },
          {
            path: "overdueManagement",
            component: () => import("@/views/creditManagement/accountsReceivable/overdueManagement/index"),
            name: "overdueManagement",
            meta: { title: "逾期账款管理", icon: "dashboard" }
          },
          {
            path: "reconciliationManagement",
            component: () => import("@/views/creditManagement/accountsReceivable/reconciliationManagement/index"),
            name: "reconciliationManagement",
            meta: { title: "客户对账管理", icon: "dashboard" }
          },
          {
            path: "customerAnalysis",
            component: () => import("@/views/creditManagement/contractManagement/customerAnalysis/index"),
            name: "customerAnalysis",
            meta: { title: "客户账龄分析", icon: "dashboard" }
          },
          {
            path: "paymentManagement",
            component: () => import("@/views/creditManagement/accountsReceivable/paymentManagement/index"),
            name: "paymentManagement",
            meta: { title: "付款条件管理", icon: "dashboard" }
          }
        ]
      },
      {
        path: "invoiceManagement",
        component: () => import("@/views/blank"),
        name: "invoiceManagement",
        meta: { title: "发票管理", icon: "dashboard" },
        children: [
          {
            path: "invoiceList",
            component: () => import("@/views/creditManagement/invoiceManagement/invoiceList/index"),
            name: "invoiceList",
            meta: { title: "发票管理", icon: "dashboard" }
          },
          {
            path: "invoiceTracking",
            component: () => import("@/views/creditManagement/invoiceManagement/invoiceTracking/index"),
            name: "invoiceTracking",
            meta: { title: "发票跟踪", icon: "dashboard" }
          }
        ]
      },
      {
        path: "creditCollection",
        component: () => import("@/views/blank"),
        name: "creditCollection",
        meta: { title: "信用催收", icon: "dashboard" },
        children: [
          {
            path: "collectionsOverview",
            component: () => import("@/views/creditManagement/creditCollection/collectionsOverview/index"),
            name: "collectionsOverview",
            meta: { title: "催收总览", icon: "dashboard" }
          },
          {
            path: "overdueCollection",
            component: () => import("@/views/creditManagement/creditCollection/overdueCollection/index"),
            name: "overdueCollection",
            meta: { title: "逾期催收", icon: "dashboard" }
          },
          {
            path: "collectionWarning",
            component: () => import("@/views/creditManagement/creditCollection/collectionWarning/index"),
            name: "collectionWarning",
            meta: { title: "催收预警", icon: "dashboard" }
          },
          {
            path: "collectionPlan",
            component: () => import("@/views/creditManagement/creditCollection/collectionPlan/index"),
            name: "collectionPlan",
            meta: { title: "催收方案管理", icon: "dashboard" }
          }
        ]
      },
      ...Monitor
    ]
  }
];
