<template>
    <Dialog
        ref="drawer"
        title="选择合同"
        :visible.sync="visible"
        :onOk="handleSure"
        width="600px"
        @close="closeDialog"
    >
        <el-form
            ref="searchForm"
            :model="listQuery"
            :inline="true"
            class="demo-form-inline searchForm-wrap"
            @submit.native.prevent
            v-loading="loading"
        >
            <el-form-item>
                <el-input
                    v-model="listQuery.contractName"
                    placeholder="请输入合同编码/名称"
                    class="filter-item"
                    @blur="clearAll"
                    @keyup.enter.native="handleFilter"
                />
            </el-form-item>
            <el-form-item class="btns">
                <el-button
                    class="filter-item"
                    type="primary"
                    icon="el-icon-search"
                    @click="handleFilter"
                >查询</el-button>
                <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset">重置</el-button>
            </el-form-item>
        </el-form>
        <!--        <el-radio-group v-model="radioChecked" style="width: 100%;">-->
        <TableWrapper
            ref="ref_goods"
            radio
            :data="filteredTableData"
            :query="listQuery"
            :columns="goodsCol"
            @radioChange="onRadioChange"
        />
        <!--        </el-radio-group>-->
    </Dialog>
</template>

<script type="text/jsx">
import { Api_GetContractList } from "@/api/creditManagement/customerProfile/customerManagement.js";

export default {
    name: "ChooseContract",
    props: { cID: { default: "", type: String } },
    data() {
        return {
            loading: false,
            radioChecked: "",
            visible: false,
            listQuery: { contractName: null },
            goodsCol: [
                {
                    label: "合同编码/名称",
                    key: "contractName",
                    props: { "show-overflow-tooltip": true },
                    align: "center",
                    render: (h, data, row) => {
                        return (
                            <span
                                class="canClick"
                                onClick={this.$gotoContractDetail.bind(this, row.id)}
                            >
                                {row.contractCode + "/" + data}
                            </span>
                        );
                    }
                },
                { label: "待发数量", key: "unSend", align: "right", width: 100 },
                {
                    label: "订单发货控制",
                    key: "controller",
                    width: 120,
                    render: (h, data, row) => {
                        return data ? "是" : "否";
                    }
                }
            ],
            tableData: [],
            selectedData: [],
            filteredTableData: []
        };
    },
    watch: {
        cID(_v) {
            if (_v) {
                this.loading = true;
                Api_GetContractList({ customerId: this.cID })
                    .then(res => {
                        this.loading = false;
                        this.tableData = res.filter(item => {
                            return (item.controller && item.unSend > 0) || !item.controller;
                        });
                        this.handleFilter();
                    })
                    .catch(res => {
                        this.loading = false;
                    });
            }
        }
    },
    methods: {
        open() {
            this.visible = true;
            this.handleFilter();
        },
        handleFilter() {
            this.filteredTableData = this.tableData.filter(data => {
                return (
                    !this.listQuery.contractName ||
                    data.contractName
                        .toLowerCase()
                        .includes(this.listQuery.contractName.toLowerCase())
                );
            });
        },
        handleReset() {
            this.listQuery.contractName = "";
            this.handleFilter();
        },
        handleSure() {
            if (!this.radioChecked) {
                this.$alert("请选择一项合同条目！", "提示", {
                    confirmButtonText: "确定",
                    type: "warning"
                });
                return false;
            }
            this.$emit(
                "handleContractSelected",
                this.tableData.find(item => item.id === this.radioChecked)
            );
            this.visible = false;
        },
        clearAll() {
            this.$refs.ref_goods.$refs.table.clearSelection();
        },
        closeDialog() {
            this.listQuery.contractName = "";
            this.radioChecked = "";
        },
        onRadioChange(id) {
            this.radioChecked = id;
        }
    }
};
</script>

<style>
</style>
