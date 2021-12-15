<template>
    <div class="credit-tab-content">
        <h4>信用评估记录</h4>
        <TableWrapper
            ref="ref_tableEvaluation"
            :fetchDataFn="Api_getEvaluationRecordPage"
            :query="{companyId:id}"
            :columns="colEvaluation"
        />
        <h4>历史授信记录</h4>
        <TableWrapper
            ref="ref_tableHistory"
            :fetchDataFn="Api_getCustomerCreditRecordPage"
            :query="{companyId:id, creditType:0}"
            :columns="colHistory"
        />
        <h4>临时授信记录</h4>
        <TableWrapper
            ref="ref_tableTemporary"
            :fetchDataFn="Api_getCustomerCreditRecordPage"
            :query="{companyId:id, creditType:1}"
            :columns="colTemporary"
        />
    </div>
</template>

<script>
import {
    Api_getEvaluationRecordPage,
    Api_getCustomerCreditRecordPage
} from "@/api/creditManagement/customerProfile/customerManagemCustomer/CreditHistory.js";

export default {
    name: "CreditHistory",
    props: {
        id: String // 客户id，用于查询详情数据
    },
    data() {
        return {
            colEvaluation: [
                { label: "评估时间", key: "evaluation_date" },
                { label: "信用评分", key: "score" },
                { label: "信用等级", key: "grade" },
                { label: "评估模型", key: "model_name" },
                { label: "评估人员", key: "username" }
            ],
            colHistory: [
                { label: "授信期限", key: "credit_time" },
                { label: "信用额度(万元)", key: "credit_quota" },
                { label: "单笔限额(万元)", key: "single_quota" },
                { label: "逾期额度(万元)", key: "overdue_quota" },
                { label: "逾期天数", key: "overdue_days" },
                {
                    label: "循环授信",
                    key: "revolving_credit_state",
                    render: (h, data, row) => {
                        return data === "0" ? "禁用" : data === "1" ? "启用" : "-";
                    }
                },
                {
                    label: "当前状态",
                    key: "credit_state",
                    render: (h, data, row) => {
                        return data === "0"
                            ? "待审核"
                            : data === "1"
                            ? "生效"
                            : data === "2"
                            ? "冻结"
                            : data === "3"
                            ? "失效"
                            : "-";
                    }
                }
            ],
            colTemporary: [
                { label: "授信期限", key: "credit_time" },
                { label: "信用额度(万元)", key: "credit_quota" },
                { label: "单笔限额(万元)", key: "single_quota" },
                { label: "逾期额度(万元)", key: "overdue_quota" },
                { label: "逾期天数", key: "overdue_days" },
                {
                    label: "当前状态",
                    key: "credit_state",
                    render: (h, data, row) => {
                        return data === "0"
                            ? "待审核"
                            : data === "1"
                            ? "生效"
                            : data === "2"
                            ? "冻结"
                            : data === "3"
                            ? "失效"
                            : "-";
                    }
                }
            ]
        };
    },
    mounted() {
        this.getList();
    },
    methods: {
        Api_getEvaluationRecordPage,
        Api_getCustomerCreditRecordPage,
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
