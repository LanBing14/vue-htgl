<template>
    <div class="credit-tab-content">
        <h4>合同签约情况</h4>
        <TableWrapper
            ref="ref_tableEvaluation"
            :fetchDataFn="Api_ContractGetList"
            :query="{companyId:id}"
            :columns="colEvaluation"
        />
        <h4>付款计划跟踪</h4>
        <TableWrapper ref="ref_tableHistory" :fetchDataFn="Api_PaymentGetList" :query="{companyId:id}" :columns="colHistory" />
        <h4>付款历史</h4>
        <TableWrapper
            ref="ref_tableTemporary"
            :fetchDataFn="Api_PaymentGetList"
            :query="{companyId:id,isArchivesState:true}"
            :columns="colTemporary"
        />
    </div>
</template>

<script>
import { Api_ContractGetList, Api_PaymentGetList } from "@/api/creditManagement/contractManagement/contract.js";

export default {
    name: "TransactionPerformance",
    props: {
        id: String // 客户id，用于查询详情数据
    },
    data() {
        return {
            colEvaluation: [
                {
                    key: "contractCode",
                    label: "合同名称/编码",
                    render: (h, data, row) => {
                        return row.contractName + "/" + data;
                    }
                },
                {
                    key: "headName",
                    label: "负责人/部门",
                    render: (h, data, row) => {
                        return row.headName + "/" + row.headDeptName;
                    }
                },
                { key: "contractAvailable", label: "合同金额(万元)" },
                { key: "surplusAmount", label: "待收金额(万元)" },
                { key: "overdueDay", label: "逾期天数" },
                { key: "overdueMoney", label: "逾期金额(万元)" },
                {
                    key: "state",
                    label: "合同状态",
                    render: (h, data) => {
                        return data === "0"
                            ? "合同拟定"
                            : data === "1"
                            ? "合同审核"
                            : data === "2"
                            ? "合同签约"
                            : data === "3"
                            ? "合同执行"
                            : data === "4"
                            ? "履约完成"
                            : data === "5"
                            ? "合同取消"
                            : "合同作废";
                    }
                },
                {
                    key: "signDate",
                    label: "签订日期",
                    render: (h, data, row) => {
                        return this.$dateFormat(data, "yyyy-MM-dd");
                    }
                }
            ],
            colHistory: [
                {
                    key: "contractName",
                    label: "合同名称/编码",
                    render: (h, data, row) => {
                        return data + "/" + row.contractNo;
                    }
                },
                { key: "payDescribe", label: "付款描述" },
                {
                    key: "payDate",
                    label: "确认日期",
                    render: (h, data, row) => {
                        return this.$dateFormat(data, "yyyy-MM-dd");
                    }
                },
                {
                    key: "endDate",
                    label: "到期日",
                    render: (h, data, row) => {
                        return this.$dateFormat(data, "yyyy-MM-dd");
                    }
                },
                {
                    key: "payAmount",
                    label: "应收金额",
                    render: (h, data, row) => {
                        return data + " 万元";
                    }
                },
                {
                    key: null,
                    label: "收款比例",
                    render: (h, data, row) => {
                        return (Number(row.receivable) * 100) / Number(row.payAmount) + "%";
                    }
                },
                {
                    key: "lastPayDate",
                    label: "最近收款日期",
                    render: (h, data, row) => {
                        return data ? this.$dateFormat(data, "yyyy-MM-dd") : "-";
                    }
                },
                {
                    key: "amount",
                    label: "待核销金额",
                    render: (h, data, row) => {
                        return data || 0;
                    }
                },
                {
                    key: "viewState",
                    label: "状态",
                    render: (h, data) => {
                        return data === "9" || data === "1" || data === "3" ? "账期内" : "逾期";
                    }
                },
                {
                    key: "username",
                    label: "负责人员/部门",
                    render: (h, data, row) => {
                        return row.username + " / " + row.deptName;
                    }
                }
            ],
            colTemporary: [
                {
                    key: "contractName",
                    label: "合同名称/编码",
                    render: (h, data, row) => {
                        return data + "/" + row.contractNo;
                    }
                },
                { key: "payDescribe", label: "付款描述" },
                {
                    key: "payDate",
                    label: "确认日期",
                    render: (h, data, row) => {
                        return this.$dateFormat(data, "yyyy-MM-dd");
                    }
                },
                {
                    key: "endDate",
                    label: "到期日",
                    render: (h, data, row) => {
                        return this.$dateFormat(data, "yyyy-MM-dd");
                    }
                },
                {
                    key: "payAmount",
                    label: "应收金额",
                    render: (h, data, row) => {
                        return data + " 万元";
                    }
                },
                {
                    key: null,
                    label: "收款比例",
                    render: (h, data, row) => {
                        return (Number(row.receivable) * 100) / Number(row.payAmount) + "%";
                    }
                },
                {
                    key: "lastPayDate",
                    label: "最近收款日期",
                    render: (h, data, row) => {
                        return data ? this.$dateFormat(data, "yyyy-MM-dd") : "-";
                    }
                },
                {
                    key: "amount",
                    label: "待核销金额",
                    render: (h, data, row) => {
                        return data || 0;
                    }
                },
                {
                    key: null,
                    label: "状态",
                    render: () => {
                        return "已完成";
                    }
                },
                {
                    key: "username",
                    label: "负责人员/部门",
                    render: (h, data, row) => {
                        return row.username + " / " + row.deptName;
                    }
                },
                {
                    label: "是否逾期",
                    key: "viewState",
                    render: (h, data, row) => {
                        return data === "4" ? "是" : "否";
                    }
                }
            ]
        };
    },
    mounted() {
        this.getList();
    },
    methods: {
        Api_ContractGetList,
        Api_PaymentGetList,
        getList() {
            this.$refs.ref_tableEvaluation.fetchData();
            this.$refs.ref_tableHistory.fetchData();
            this.$refs.ref_tableTemporary.fetchData();
        }
    }
};
</script>

<style>
</style>
