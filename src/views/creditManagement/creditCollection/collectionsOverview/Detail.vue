<template>
    <div>
        <div class="page-header">
            <h1 class="page-name">
                <span>客户催收详情</span>
            </h1>
            <div>
                <el-button size="small" @click="back">返回</el-button>
            </div>
        </div>
        <div class="page-content">
            <el-form>
                <el-form-item label="客户名称">
                    <span class="canClick"
                          @click="$gotoCustomerDetail(selectData.companyId)">{{ selectData.companyName }}</span>
                </el-form-item>
                <el-divider class="detail-divider"></el-divider>
                <EnterpriseFile :enterpriseID="selectData.companyId"></EnterpriseFile>
                <!--                <el-row>-->
                <!--                    <el-col :span="8">-->
                <!--                        <el-form-item label="客户编码">{{ formData.customerNo }}</el-form-item>-->
                <!--                    </el-col>-->
                <!--                    <el-col :span="8">-->
                <!--                        <el-form-item label="客户名称">-->
                <!--                            <span class="canClick" @click="$gotoCustomerDetail(selectData.companyId)">{{ formData.companyName }}</span>-->
                <!--                        </el-form-item>-->
                <!--                    </el-col>-->
                <!--                    <el-col :span="8">-->
                <!--                        <el-form-item label="应收未收">{{ $toMoney(formData.overdueMoney) }} 元</el-form-item>-->
                <!--                    </el-col>-->
                <!--                </el-row>-->
                <!--                <el-row>-->
                <!--                    <el-col :span="8">-->
                <!--                        <el-form-item label="逾期金额">{{ $toMoney(formData.oweMoney) }} 元</el-form-item>-->
                <!--                    </el-col>-->
                <!--                    <el-col :span="8">-->
                <!--                        <el-form-item label="最大逾期天数">{{ formData.day }}</el-form-item>-->
                <!--                    </el-col>-->
                <!--                    <el-col :span="8">-->
                <!--                        <el-form-item label="逾期笔数">{{ formData.count }}</el-form-item>-->
                <!--                    </el-col>-->
                <!--                </el-row>-->
                <!--                <el-row>-->
                <!--                    <el-col :span="8">-->
                <!--                        <el-form-item label="新增笔数">{{ formData.addCount }}</el-form-item>-->
                <!--                    </el-col>-->
                <!--                    <el-col :span="8">-->
                <!--                        <el-form-item label="逾期更新时间">{{ $dateFormat(formData.newDate) }}</el-form-item>-->
                <!--                    </el-col>-->
                <!--                </el-row>-->
            </el-form>
            <el-tabs value="1" class="tabs-sub-title">
                <el-tab-pane label="逾期账款明细" name="1">
                    <TableWrapper
                        ref="table1"
                        :fetchDataFn="Api_CollectionOverviewOverdue"
                        :query="listQuery1"
                        :columns="tableCol1"
                        :size="5"
                        :pageSizes="[5,10,15,25,50]"
                    />
                </el-tab-pane>
                <el-tab-pane label="催收登记情况" name="2">
                    <TableWrapper
                        ref="table2"
                        :fetchDataFn="Api_CollectionOverviewCollection"
                        :query="listQuery2"
                        :columns="tableCol2"
                        :size="5"
                        :pageSizes="[5,10,15,25,50]"
                    />
                </el-tab-pane>
            </el-tabs>
            <!--            -->
            <!--            <div class="sub-title">催收登记情况</div>-->
            <!--            <TableWrapper-->
            <!--                ref="table2"-->
            <!--                :fetchDataFn="Api_CollectionOverviewCollection"-->
            <!--                :query="listQuery2"-->
            <!--                :columns="tableCol2"-->
            <!--                :size="5"-->
            <!--                :pageSizes="[5,10,15,25,50]"-->
            <!--            />-->
            <!--            <div class="sub-title">催收期间逾期收款情况</div>-->
            <!--            <TableWrapper-->
            <!--                ref="table3"-->
            <!--                :fetchDataFn="Api_CollectionOverviewPay"-->
            <!--                :query="listQuery3"-->
            <!--                :columns="tableCol3"-->
            <!--                :size="5"-->
            <!--                :pageSizes="[5,10,15,25,50]"-->
            <!--            />-->
        </div>
    </div>
</template>

<script type="text/jsx">
    import EnterpriseFile from "@/components/EnterpriseFile/index.vue";

    import {
        Api_CollectionOverviewDetail,
        Api_CollectionOverviewOverdue,
        Api_CollectionOverviewCollection,
        Api_CollectionOverviewPay
    } from "@/api/creditManagement/creditCollection/collectionsOverview";
    import router from "../../../../router";

    export default {
        name: "Detail",
        components: {
            EnterpriseFile
        },
        props: {
            selectData: Object
        },
        data() {
            return {
                tabKey: "",
                formData: {
                    addCount: "", // 新增笔数
                    oweMoney: "", // 	应收未收/逾期金额
                    customerNo: "", // 	客户编码
                    companyName: "", // 	客户名称
                    overdueMoney: "", // 	应收未收
                    day: "", // 	最大逾期天数
                    count: "", // 	逾期笔数
                    newDate: "" // 	逾期更新时间
                },
                listQuery1: {
                    companyId: "",
                    saasCode: ""
                },
                listQuery2: {
                    companyId: "",
                    saasCode: ""
                },
                listQuery3: {
                    companyId: "",
                    saasCode: ""
                },
                tableCol1: [
                    {
                        key: "code",
                        label: "应收编码",
                        render: (h, data, row) => {
                            return <span class="canClick"
                                         onClick={this.$gotoReceivablesDetail.bind(this, row.id)}>{data}</span>;
                        }
                    },
                    {
                        key: "contractName",
                        label: "合同编码/名称",
                        render: (h, data, row) => {
                            const {orders} = row
                            const fn = orders ? this.$gotoOrderDetail.bind(this, row.contractId) : this.$gotoContractDetail.bind(this, row.contractId)
                            return (
                                <span class="canClick"
                                      onClick={fn}>
                                    {row.contractNo}/{row.contractName}
                                </span>
                            );
                        }
                    },
                    {
                        key: "payDate",
                        label: "确认日期",
                        render: (h, data) => {
                            return this.$dateFormat(data);
                        }
                    },
                    {
                        key: "endDate",
                        label: "到期日",
                        render: (h, data) => {
                            return this.$dateFormat(data);
                        }
                    },
                    {
                        key: "overdueMoney",
                        label: "逾期金额(元)",
                        align: "right",
                        render: (h, data, row) => {
                            return this.$toMoney(data);
                        }
                    },
                    // {
                    //     key: "count",
                    //     label: "到期日延长次数",
                    //     align: "right",
                    //     render: (h, data, row) => {
                    //         return data || "-";
                    //     }
                    // },
                    // {
                    //     key: "delayDay",
                    //     label: "累计延长天数",
                    //     align: "right",
                    //     render: (h, data, row) => {
                    //         return data || "-";
                    //     }
                    // },
                    {
                        key: "userName",
                        label: "负责人",
                        render: (h, data) => {
                            return data ? data.name : "";
                        }
                    }
                ],
                tableCol2: [
                    {
                        key: "collectionCode",
                        label: "催收编码",
                        render: (h, data, row) => {
                            return <span class="canClick"
                                         onClick={() => {
                                             const {type} = row;
                                             const name = type === '0' ? 'overdueCollection' : 'collectionWarning'
                                             const newpage = router.resolve({
                                                 name: name,
                                                 query: {
                                                     id: row.id
                                                 }
                                             });
                                             window.open(newpage.href, "_blank");
                                         }}>{data}</span>;
                        }
                    },
                    {
                        key: "registerDate",
                        label: "催收日期",
                        render: (h, data) => {
                            return this.$dateFormat(data);
                        }
                    },
                    {
                        key: "receivableCode",
                        label: "应收编码",
                        render: (h, data, row) => {
                            return <span class="canClick"
                                         onClick={this.$gotoReceivablesDetail.bind(this, row.id)}>{data}</span>;
                        }
                    },
                    {
                        key: "oweMoney",
                        label: "逾期金额(元)",
                        render: (h, data, row) => {
                            return this.$toMoney(data);
                        }
                    },
                    {
                        key: "collectionType",
                        label: "催收类型"
                    },
                    {
                        key: "returnDesire",
                        label: "还款意愿",
                        render: (h, data) => {
                            if (data === "0") {
                                return "积极";
                            } else if (data === "1") {
                                return "消极";
                            } else if (data === "2") {
                                return "不清楚";
                            }
                            return "";
                        }
                    },
                    {
                        key: "remark",
                        label: "催收描述"
                    },
                    {
                        key: "overdueFile",
                        label: "催收附件",
                        props: {"show-overflow-tooltip": true},
                        render: (h, data) => {
                            return (
                                data &&
                                data.map(item => (
                                    <a href={item.url} download class="canClick">
                                        {item.originalName}
                                    </a>
                                ))
                            );
                        }
                    },
                    {
                        key: "collectionPerson",
                        label: "催收登记人"
                    }
                ]
                // tableCol3: [
                //     {
                //         key: "code",
                //         label: "应收编码"
                //     },
                //     {
                //         key: "contractNo",
                //         label: "合同编码/名称",
                //         render: (h, data, row) => {
                //             return data + "/" + row.contractName;
                //         }
                //     },
                //     {
                //         key: "payDate",
                //         label: "确认日期",
                //         render: (h, data) => {
                //             return this.$dateFormat(data);
                //         }
                //     },
                //     {
                //         key: "endDate",
                //         label: "到期日",
                //         render: (h, data) => {
                //             return this.$dateFormat(data);
                //         }
                //     },
                //     {
                //         key: "payAmount",
                //         label: "收款金额(万元)"
                //     },
                //     {
                //         key: "date",
                //         label: "收款日期"
                //     },
                //     {
                //         key: "userName",
                //         label: "收款登记人"
                //     }
                // ]
            };
        },
        mounted() {
            const {companyId, customerNo, companyName, overdueMoney, day, count, newDate, saasCode} = this.selectData;

            Api_CollectionOverviewDetail({
                companyId: companyId,
                saasCode: saasCode,
                newDate: this.selectData.newDate
            }).then(res => {
                this.formData.addCount = res.addCount;
                this.formData.oweMoney = res.oweMoney;
            });
            this.formData.customerNo = customerNo;
            this.formData.companyName = companyName;
            this.formData.overdueMoney = overdueMoney;
            this.formData.day = day;
            this.formData.count = count;
            this.formData.newDate = newDate;

            this.listQuery1.companyId = companyId;
            this.listQuery1.saasCode = saasCode;
            this.listQuery2.companyId = companyId;
            this.listQuery2.saasCode = saasCode;
            this.listQuery3.companyId = companyId;
            this.listQuery3.saasCode = saasCode;
            this.$refs.table1.fetchData(true);
            this.$refs.table2.fetchData(true);
            // this.$refs.table3.fetchData(true);
        },
        methods: {
            Api_CollectionOverviewOverdue,
            Api_CollectionOverviewCollection,
            Api_CollectionOverviewPay,
            back() {
                this.$emit("edit", false);
            }
        }
    };
</script>

<style scoped>
</style>
