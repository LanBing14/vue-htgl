<template>
    <div>
        <div v-show="!showPaymentTermsOperation">
            <div class="page-header">
                <h1 class="page-name">
                    <span>付款条件管理</span>
                </h1>
                <div>
                    <el-button @click="createPaymentConditions">新增</el-button>
                </div>
            </div>
            <div class="page-content">
                <el-form ref="searchForm" :model="listQuery" :inline="true">
                    <el-form-item prop="name">
                        <el-input
                            v-model="listQuery.name"
                            placeholder="付款条件名称"
                            class="filter-item"
                            @keyup.enter.native="handleFilter"
                        />
                    </el-form-item>
                    <el-form-item prop="status">
                        <el-select v-model="listQuery.status" placeholder="请选择状态">
                            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="btns">
                        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
                        <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset('searchForm')">重置</el-button>
                    </el-form-item>
                </el-form>
                <div class="page-content-body">
                    <TableWrapper ref="child" :fetchDataFn="Api_PaymentConditionsList" :query="listQuery" :columns="tableCol" />
                </div>
            </div>
        </div>
        <PaymentTermsOperation
            ref="ref_PaymentTermsOperation"
            :dialog-status="dialogStatus"
            @getList="getList"
            @hideCreatePaymentConditions="hideCreatePaymentConditions"
            v-show="showPaymentTermsOperation"
        ></PaymentTermsOperation>
    </div>
</template>

<script type="text/jsx">
import PaymentTermsOperation from "./PaymentTermsOperation";
import {
    Api_PaymentConditionsList,
    Api_PaymentConditionsDel,
    Api_PaymentConditionsEnable
} from "@/api/creditManagement/accountsReceivable/paymentManagement.js";

export default {
    name: "PaymentManagement",
    components: { PaymentTermsOperation },
    data() {
        return {
            Api_PaymentConditionsList,
            updateTime: new Date(),
            comboDate: [],
            listQuery: { name: "", status: "" },
            statusOptions: [
                { label: "启用", value: "1" },
                { label: "禁用", value: "0" }
            ],
            tableCol: [
                {
                    key: "code", label: "编码",
                    width: 150,
                    props: {
                        "show-overflow-tooltip": true
                    }
                },
                {
                    key: "name",
                    label: "付款条件名称",
                    align: "left",
                    render: (h, data, row) => {
                        return (
                            <span class="a-link" onClick={this.paymentConditionsDetail.bind(this, row)}>
                                {data}
                            </span>
                        );
                    }
                },
                {
                    key: "describe",
                    label: "付款条件描述",
                    align: "left",
                    render: (h, data, row) => {
                        return data.length > 20 ? (
                            <el-tooltip class="item" effect="dark" content={data} placement="top">
                                <span>{data.substr(0, 20) + "..."}</span>
                            </el-tooltip>
                        ) : (
                            data
                        );
                    }
                },
                {
                    key: "createDate",
                    label: "创建日期",
                    render: (h, data, row) => {
                        return data ? data.substr(0, 10) : "-";
                    }
                },
                {
                    key: "modifyDate",
                    label: "更新日期",
                    render: (h, data, row) => {
                        return data ? data.substr(0, 10) : "-";
                    }
                },
                {
                    key: "status", // 0 禁用 1 启用
                    label: "状态",
                    render: (h, data, row) => {
                        return (
                            <el-switch
                                value={row.status}
                                onChange={() => {
                                    row.status = !row.status;
                                    const loading = this.$openLoading();
                                    Api_PaymentConditionsEnable(row.id)
                                        .then(() => {
                                            loading.close();
                                            this.$message.success((row.status ? "启用" : "禁用") + "成功！");
                                        })
                                        .catch(() => {
                                            loading.close();
                                            this.$message.error((row.status ? "启用" : "禁用") + "失败了！");
                                        });
                                }}
                            ></el-switch>
                        );
                    }
                },
                {
                    key: null,
                    label: "操作",
                    width: 100,
                    render: (h, data, row) => {
                        return (
                            <button-dropdown
                                data={[
                                    row.editable &&
                                    row.status && {
                                        text: "编辑",
                                        click: this.paymentConditionsEdit.bind(this, row)
                                    },
                                    row.editable && {
                                        text: "详情",
                                        click: this.paymentConditionsDetail.bind(this, row)
                                    },
                                    row.editable &&
                                    !row.status && {
                                        text: "删除",
                                        click: this.paymentConditionsDelete.bind(this, row)
                                    }
                                ]}
                            />
                        );
                    }
                }
            ],
            showPaymentTermsOperation: false,
            dialogStatus: "add"
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.getList();
        });
    },
    methods: {
        // 获取主列表数据
        getList() {
            this.$refs.child.fetchData();
        },
        // 根据查询条件获取数据
        handleFilter() {
            this.getList();
        },
        // 重置查询条件
        handleReset(formName) {
            this.$refs[formName].resetFields();
            this.listQuery.groupId = "";
            this.getList();
        },
        // 重置form表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.listQuery.groupId = "";
        },
        createPaymentConditions() {
            this.showPaymentTermsOperation = true;
            this.dialogStatus = "add";
            this.$nextTick(() => {
                this.$refs.ref_PaymentTermsOperation.initComponent();
            });
        },
        hideCreatePaymentConditions() {
            this.showPaymentTermsOperation = false;
        },
        paymentConditionsEdit(_row) {
            this.showPaymentTermsOperation = true;
            this.dialogStatus = "edit";
            this.$nextTick(() => {
                this.$refs.ref_PaymentTermsOperation.initComponent(_row);
            });
        },
        paymentConditionsDetail(_row) {
            this.showPaymentTermsOperation = true;
            this.dialogStatus = "info";
            this.$nextTick(() => {
                this.$refs.ref_PaymentTermsOperation.initComponent(_row);
            });
        },
        paymentConditionsDelete(_row) {
            this.$confirm("确定要删除此条付款计划吗?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                Api_PaymentConditionsDel(_row.id)
                    .then(() => {
                        this.$message.success("删除成功！");
                        this.getList();
                    })
                    .catch(() => {
                        this.$message.error("删除失败了！");
                    });
            });
        }
    }
};
</script>

<style scoped>
.text-blue {
    color: #4a9df2;
}
</style>
