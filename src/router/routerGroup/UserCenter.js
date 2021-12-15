import { getRoleAuthInfo } from "@/utils/auth";

const roleAuthInfo = getRoleAuthInfo();

/**
 * 用户中心router列表
 */

export default [{
    path: "/userCenter",
    component: () =>
        import ("@/views/userCenter/index"),
    redirect: "/userCenter/archives/companyCenterMain",
    children: [{
            path: "",
            name: "UserCenter",
            component: () =>
                import ("@/views/userCenter/index")
        },

        // 合同管理
        {
            path: "contract",
            name: "contract",
            components: {
                userCenter: () =>
                    import ("@/views/userCenter/contractManage/index.vue")
            },
            redirect: "/userCenter/contract/contract",
            children: [{
                    path: "analysis",
                    name: "analysis",
                    components: {
                        contractManage: () =>
                            import (
                                "@/views/userCenter/contractManage/Analysis.vue"
                            )
                    }
                },
                {
                    path: "contract",
                    name: "contract1",
                    components: {
                        contractManage: () =>
                            import (
                                "@/views/userCenter/contractManage/Contract.vue"
                            )
                    }
                },
                {
                    path: "contractadd",
                    name: "contractadd",
                    components: {
                        contractManage: () =>
                            import (
                                "@/views/userCenter/contractManage/ContractAdd.vue"
                            )
                    }
                },
                {
                    path: "contractinfo",
                    name: "contractinfo",
                    components: {
                        contractManage: () =>
                            import (
                                "@/views/userCenter/contractManage/ContractInfo.vue"
                            )
                    }
                },
                {
                    path: "financial",
                    name: "contractFinancial",
                    components: {
                        contractManage: () =>
                            import (
                                "@/views/userCenter/contractManage/Financial.vue"
                            )
                    }
                },
                {
                    path: "matters",
                    name: "matters",
                    components: {
                        contractManage: () =>
                            import (
                                "@/views/userCenter/contractManage/Matters.vue"
                            )
                    }
                },
                {
                    path: "remind",
                    name: "remind",
                    components: {
                        contractManage: () =>
                            import (
                                "@/views/userCenter/contractManage/Remind.vue"
                            )
                    }
                }
            ]
        },

        // 信用修复
        {
            path: "creditPepairing",
            name: "creditPepairing",
            components: {
                userCenter: () =>
                    import ("@/views/userCenter/creditPepairing/index.vue")
            },
            redirect: "/userCenter/creditPepairing/creditrepair",
            children: [{
                    path: "creditrepair",
                    name: "creditrepair",
                    components: {
                        creditPepairing: () =>
                            import (
                                "@/views/userCenter/creditPepairing/CreditRepair.vue"
                            )
                    }
                },
                {
                    path: "trainrecord",
                    name: "trainrecord",
                    components: {
                        creditPepairing: () =>
                            import (
                                "@/views/userCenter/creditPepairing/TrainRecord.vue"
                            )
                    }
                },
                {
                    path: "creditreport",
                    name: "creditreport",
                    components: {
                        creditPepairing: () =>
                            import (
                                "@/views/userCenter/creditPepairing/CreditReport.vue"
                            )
                    }
                }
            ]
        },

        // 档案
        {
            path: 'archives',
            name: 'archives',
            components: {
                userCenter: () =>
                    import ("@/views/userCenter/archives/index.vue")
            },
            redirect: '/userCenter/archives/companyCenterMain',
            children: [{
                path: 'companyCenterMain',
                name: "companyCenterMain",
                components: {
                    archives: () =>
                        import (
                            "@/views/userCenter/archives/companyCenterMain.vue"
                        )
                }
            }]
        },
        // 企业关系绑定 
         {
            path: "business",
            name: "business",
            components: {
                userCenter: () =>
                    import ("@/views/userCenter/businessConnection/index.vue")
            }
        },
        // 企业中心
        {
            path: 'companyCenter',
            name: 'companyCenter',
            components: {
                userCenter: () =>
                    import ("@/views/userCenter/companyCenter/index.vue")
            },
            redirect: '/userCenter/companyCenter/companyCenterMain',
            children: [{
                path: 'companyCenterMain',
                name: "companyCenterMain",
                components: {
                    companyCenter: () =>
                        import (
                            "@/views/userCenter/companyCenter/companyCenterMain.vue"
                        )
                }
            }]
        },

        // 订单管理
        {
            path: "order",
            name: "order",
            components: {
                userCenter: () =>
                    import ("@/views/userCenter/orderManage/index.vue")
            },
            redirect: "/userCenter/order/report",
            children: [{
                    path: "report",
                    name: "report",
                    components: {
                        orderManage: () =>
                            import (
                                "@/views/userCenter/orderManage/CreditReport.vue"
                            )
                    }
                },
                {
                    path: "service",
                    name: "service",
                    components: {
                        orderManage: () =>
                            import (
                                "@/views/userCenter/orderManage/CreditService.vue"
                            )
                    }
                },
                {
                    path: "course",
                    name: "course",
                    components: {
                        orderManage: () =>
                            import (
                                "@/views/userCenter/orderManage/Course.vue"
                            )
                    }
                }
            ]
        },
        // 信用培训
        {
            path: "training",
            name: "training",
            components: {
                userCenter: () =>
                    import ("@/views/userCenter/training/Index.vue")
            },
            redirect: "/userCenter/training",
            children: [{
                path: "",
                name: "learning",
                components: {
                    creditTraining: () =>
                        import (
                            "@/views/userCenter/training/LearningRecord.vue"
                        )
                }
            }]
        },
        {
            path: "convern",
            name: "convern",
            components: {
                userCenter: () =>
                    import ("@/views/userCenter/components/MyConcern.vue")
            }
        },
        // 信用管理
        {
            path: "creditManage",
            name: "creditManage",
            components: {
                userCenter: () =>
                    import ("@/views/userCenter/creditManage/index.vue")
            },
            redirect: () => {
                if (
                    roleAuthInfo.role === null ||
                    roleAuthInfo.role === "0"
                ) {
                    return "/userCenter/creditManage/self";
                } else {
                    return "/userCenter/creditManage/attention/1";
                }
            },
            children: [{
                    path: "self",
                    name: "self",
                    components: {
                        creditManage: () =>
                            import (
                                "@/views/userCenter/creditManage/selfManage.vue"
                            )
                    },
                    beforeEnter: (to, from, next) => {
                        if (
                            roleAuthInfo.role === null ||
                            roleAuthInfo.role === "0"
                        ) {
                            next();
                        }
                    }
                },
                {
                    path: "attention/:groupType",
                    name: "attention",
                    components: {
                        creditManage: () =>
                            import (
                                "@/views/userCenter/creditManage/attention.vue"
                            )
                    }
                },
                {
                    path: "infomaintain/:groupType/:id/:comid",
                    name: "infomaintain",
                    components: {
                        creditManage: () =>
                            import (
                                "@/views/userCenter/creditManage/InfoMaintain.vue"
                            )
                    }
                },
                {
                    path: "accurate/:groupType",
                    name: "accurate",
                    components: {
                        creditManage: () =>
                            import (
                                "@/views/userCenter/creditManage/accurate.vue"
                            )
                    }
                },
                {
                    path: "batchimport/:groupType",
                    name: "batchimport",
                    components: {
                        creditManage: () =>
                            import (
                                "@/views/userCenter/creditManage/batchimport.vue"
                            )
                    }
                }
            ]
        },
        {
            path: "financial",
            name: "financial",
            components: {
                userCenter: () =>
                    import (
                        "@/views/userCenter/components/FinancialService.vue"
                    )
            }
        },
        {
            path: "infopush",
            name: "infopush",
            components: {
                userCenter: () =>
                    import ("@/views/userCenter/components/InfoPush.vue")
            }
        },
        // 消息中心
        {
            path: "message",
            name: "message",
            components: {
                userCenter: () =>
                    import ("@/views/userCenter/messageCenter/index.vue")
            },
            redirect: "/userCenter/message",
            children: [{
                path: "/",
                name: "message1",
                components: {
                    messageManage: () =>
                        import (
                            "@/views/userCenter/messageCenter/MessageCenter.vue"
                        )
                }
            }]
        },

         // 消息中心
         {
            path: "/userInfo",
            name: "userInfo",
            components: {
                userCenter: () =>
                    import ("@/views/settings/basicInfo/Main.vue")
            },
        },
        // 会员信息
        {
            path: "vip",
            name: "vip",
            components: {
                userCenter: () =>
                    import ("@/views/userCenter/vipCenter/index.vue")
            },
            redirect: "/userCenter/vip",
            children: [{
                path: "/",
                name: "vip1",
                components: {
                    vipManage: () =>
                        import (
                            "@/views/userCenter/vipCenter/VipCenter.vue"
                        )
                }
            }]
        },
        // 联系客服
        {
            path: "contact",
            name: "contact",
            components: {
                userCenter: () =>
                    import ("@/views/userCenter/contactService/index.vue")
            },
            redirect: "/userCenter/contact",
            children: [{
                path: "",
                name: "contact1",
                components: {
                    contactManage: () =>
                        import (
                            "@/views/userCenter/contactService/Contact.vue"
                        )
                }
            }]
        },
        // 资料设置
        {
            path: "basic",
            name: "basic",
            components: {
                userCenter: () =>
                    import ("@/views/settings/basicInfo/index.vue")
            },
            redirect: "basic",
            children: [{
                    path: "",
                    name: "basic1",
                    components: {
                        basic: () =>
                            import ("@/views/settings/basicInfo/Main.vue")
                    }
                },
                //  企业认证
                // {
                //     path: "authentication",
                //     name: "authentication",
                //     components: {
                //         basic: () =>
                //             import ("@/views/settings/basicInfo/authentication.vue")
                //     }
                // }

            ]
        },
        // 我的关注
        {
            path: "concern",
            name: "concern",
            components: {
                userCenter: () =>
                    import ("@/views/userCenter/myConcern/index.vue")
            }
            // component: () => import("@/views/userCenter/myConcern/index.vue")
        },
        // 所属机构
        // {
        //     path: "mechanism",
        //     name: "mechanism",
        //     components: {
        //         userCenter: () =>
        //             import ("@/views/userCenter/companyMechanism/index.vue")
        //     }
        // },
         // 服务申请记录
         {
            path: "serveApply",
            name: "serveApply",
            components: {
                userCenter: () =>
                    import ("@/views/userCenter/serveApplyRecord/appointment/index.vue")
            }
        },
        // 服务维修记录
        {
            path: "serveRepair",
            name: "serveRepair",
            components: {
                userCenter: () =>
                    import ("@/views/userCenter/serveApplyRecord/repair/index.vue")
            }
        },
        //
          // 装修服务记录
          {
            path: "serveDecoration",
            name: "serveDecoration",
            components: {
                userCenter: () =>
                    import ("@/views/userCenter/serveApplyRecord/decorationServices/index.vue")
            }
        },

        
        // 设置中心
        /* {
            path: "setting",
            name: "setting",
            components: {
                userCenter: () =>
                    import("@/views/userCenter/settingCenter/Index.vue")
            },
            redirect: "/userCenter/setting/basicinfo",
            children: [
                {
                    path: "basicinfo",
                    name: "basicinfo",
                    components: {
                        settingManage: () =>
                            import(
                                "@/views/userCenter/settingCenter/BasicInfo.vue"
                            )
                    }
                },
                {
                    path: "department",
                    name: "department",
                    components: {
                        settingManage: () =>
                            import(
                                "@/views/userCenter/settingCenter/DepartmentSetting.vue"
                            )
                    }
                },
                {
                    path: "personnel",
                    name: "personnel",
                    components: {
                        settingManage: () =>
                            import(
                                "@/views/userCenter/settingCenter/Personnel.vue"
                            )
                    }
                },
                {
                    path: "model",
                    name: "model",
                    components: {
                        settingManage: () =>
                            import(
                                "@/views/userCenter/settingCenter/actModel/ModelBuild.vue"
                                )
                    }
                }
            ]
        }*/
    ]
}];