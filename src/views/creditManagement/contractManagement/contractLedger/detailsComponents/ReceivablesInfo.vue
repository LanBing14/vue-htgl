<template>
    <div>
        <TableWrapper v-loading="loading" ref="ref_table" :data="tableData" :query="{id:id}" :columns="tableCol" />
    </div>
</template>

<script>
import { Api_paymentDetailList } from "@/api/creditManagement/contractManagement/orders.js";
export default {
    name: "ReceivablesInfo",
    props: { id: { type: String, default: "" } },
    data() {
        return {
            loading: false,
            tableData: [],
            tableCol: [
                {
                    label: "应收编码",
                    key: "code",
                    render: (h, data, row) => {
                        return (
                            <span class="canClick" onClick={this.$gotoReceivablesDetail.bind(this, row.id)}>
                                {data}
                            </span>
                        );
                    }
                },
                {
                    label: "应收账款类型",
                    key: "planType",
                    render: (h, data, row) => {
                        if (data === "0") {
                            return "预付款";
                        } else if (data === "1") {
                            return "应付款";
                        }else if (data === "2") {
                            return "罚金";
                        } else {
                            return "-";
                        }
                        return data ? this.$toMoney(data) : "-";
                    }
                },
                {
                    label: "应收金额(元)",
                    key: "planAmount",
                    align: "right",
                    render: (h, data, row) => {
                        return data ? this.$toMoney(data) : "-";
                    }
                },
                { label: "确认日期", key: "payDate" },
                { label: "到期日", key: "endDate" },
                {
                    label: "收款金额(元)",
                    key: "receivable",
                    align: "right",
                    render: (h, data, row) => {
                        return this.$toMoney(data);
                    }
                },
                {
                    label: "最近收款时间",
                    key: "lastPayTime"
                },
                {
                    label: "状态",
                    key: "state",
                    render: (h, data, row) => {
                        return data === "0"
                            ? "未开始"
                            : data === "1"
                            ? "未完成"
                            : data === "2"
                            ? "逾期"
                            : data === "3"
                            ? "已完成"
                            : "未完成";
                        // 未开始、未完成、逾期、已完成
                    }
                }
            ]
        };
    },
    watch: {
        id(_v) {
            if (_v) {
                this.$nextTick(() => {
                    this.getData(_v);
                });
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            if (this.id) {
                this.getData(this.id);
            }
        });
    },
    methods: {
        getData(_v) {
            this.loading = true;
            Api_paymentDetailList({ id: _v }).then(res => {
                this.loading = false;
                this.tableData = res;
            });
        }
    }
};
</script>

<style>
</style>
