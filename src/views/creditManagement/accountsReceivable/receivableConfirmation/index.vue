<template>
    <div>
        <div v-show="!showReceivablesEditDetail&&!showReceivablesDetail">
            <div class="page-header">
                <h1 class="page-name">
                    <span>应收确认管理</span>
                </h1>
            </div>
            <div class="page-content">
                <el-form ref="searchForm" :model="listQuery" :inline="true">
                    <el-form-item prop="companyName">
                        <el-input
                            v-model="listQuery.companyName"
                            placeholder="客户名称"
                            class="filter-item"
                            @keyup.enter.native="handleFilter"
                        />
                    </el-form-item>
                    <el-form-item prop="contractNo">
                        <el-input
                            v-model="listQuery.contractNo"
                            placeholder="合同名称"
                            class="filter-item"
                            @keyup.enter.native="handleFilter"
                        />
                    </el-form-item>
                    <!-- department & user BEGIN -->
                    <el-form-item prop="deptName">
                        <el-popover
                            ref="popoverQuery"
                            visible-arrow="false"
                            placement="bottom-start"
                            trigger="click"
                            v-model="treeShowQuery"
                        >
                            <el-tree :data="treeData" :render-content="renderContent" @node-click="handleNodeClickQuery"></el-tree>
                            <el-input
                                v-popover:popoverQuery
                                slot="reference"
                                type="text"
                                readonly
                                placeholder="所属部门"
                                v-model="listQuery.deptName"
                            ></el-input>
                        </el-popover>
                    </el-form-item>
                    <el-form-item prop="userName">
                        <el-select v-model="listQuery.userName" placeholder="登录人员姓名">
                            <el-option
                                :key="item.id"
                                @click.native="selectClick(item.id)"
                                :value="item.name"
                                v-for="item in departmentUsers"
                            >{{ item.name }}</el-option>
                        </el-select>
                    </el-form-item>
                    <!-- department & user END -->
                    <el-form-item prop="comboDate">
                        <el-date-picker
                            v-model="comboDate"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="账款确认日期起"
                            end-placeholder="账款确认日期止"
                            value-format="yyyy-MM-dd"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item class="btns">
                        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
                        <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset('searchForm')">重置</el-button>
                    </el-form-item>
                    <RadioText :options="groupIdsOptions" newName="确认状态" labelKey="name" @change="switchStatus"></RadioText>
                </el-form>
                <div class="page-content-body">
                    <TableWrapper ref="child" :fetchDataFn="Api_ReceivableApplyPage" :query="listQuery" :columns="tableCol" />
                </div>
            </div>
        </div>
        <ReceivablesEditDetail
            ref="ref_ReceivablesEditDetail"
            v-show="showReceivablesEditDetail"
            @getList="getList"
            @hideReceivablesEditDetail="hideReceivablesEditDetail"
        ></ReceivablesEditDetail>
        <ReceivablesDetail
            ref="ref_ReceivablesDetail"
            v-if="showReceivablesDetail"
            @hideReceivablesDetail="hideReceivablesDetail"
        ></ReceivablesDetail>
    </div>
</template>

<script type="text/jsx">
import PageHead from "@/components/PageHead";
import Button from "@/components/Button";
import { Api_GetCustomerGroup, Api_RemoveCustomer } from "@/api/creditManagement/customerProfile/customerManagement.js";
import { Api_ReceivableApplyPage } from "@/api/creditManagement/accountsReceivable/receivableConfirmation.js";
// department & user BEGIN
import { Api_DepartmentsFetchTree, Api_DepartmentUserList } from "@/api/settings/dept.js";
// department & user END
import ReceivablesEditDetail from "./ReceivablesEditDetail";
import ReceivablesDetail from "./ReceivablesDetail";
import RadioText from "@/components/RadioText";

export default {
    name: "ReceivableConfirmation",
    components: { PageHead, ReceivablesEditDetail, RadioText, ReceivablesDetail },
    data() {
        return {
            Api_ReceivableApplyPage,
            updateTime: new Date(),
            comboDate: [],
            listQuery: {
                companyName: "",
                contractNo: "",
                startDate: "",
                endDate: "",
                groupId: "",
                // department & user BEGIN
                headDept: "",
                headId: "",
                deptName: "",
                userName: ""
                // department & user END
            },
            list: [], // 主列表数据
            groupIdsOptions: [
                { id: "", name: "全部" },
                { id: "1", name: "待提交" },
                { id: "2", name: "待审核" },
                { id: "3", name: "已确认" },
                { id: "0", name: "已打回" }
            ],
            tableCol: [
                {
                    key: "code",
                    label: "应收确认编码",
                    width: 150,
                    props: {
                        "show-overflow-tooltip": true
                    },
                    render: (h, data, row) => {
                        return (
                            <span class="canClick" onClick={this.receivablesDetail.bind(this, row)}>
                                {data}
                            </span>
                        );
                    }
                },
                {
                    key: "contractName",
                    label: "合同名称",
                    align: "left",
                    width: 150,
                    props: {
                        "show-overflow-tooltip": true
                    },
                    render: (h, data, row) => {
                        return (
                            <span class="canClick" onClick={this.gotoContractDetail.bind(this, row.contractId)}>
                                {data}
                            </span>
                        );
                    }
                },
                {
                    key: "companyName",
                    label: "客户名称",
                    align: "left",
                    props: {
                        "show-overflow-tooltip": true,
                        "min-width": 150
                    },
                    render: (h, data, row) => {
                        return (
                            <span class="a-link" onClick={this.$gotoCustomerDetail.bind(this, row.customerId)}>
                                {data}
                            </span>
                        );
                    }
                },
                {
                    key: "money",
                    label: "应收金额(元)",
                    align: "right",
                    render: (h, data) => {
                        return this.$toMoney(data);
                    }
                },
                {
                    key: "confirmDate",
                    label: "确认日期",
                    render: (h, data, row) => {
                        return this.$dateFormat(data, "yyyy-MM-dd");
                    }
                },
                {
                    key: "endDate",
                    label: "到期日",
                    render: (h, data, row) => {
                        return data ? this.$dateFormat(data, "yyyy-MM-dd") : "-";
                    }
                },
                {
                    key: "state",
                    label: "状态",
                    render: (h, data, row) => {
                        return data === "1"
                            ? "待提交"
                            : data === "2"
                            ? "待审核"
                            : data === "3"
                            ? "已确认"
                            : data === "0"
                            ? "已打回"
                            : "";
                    }
                },
                {
                    key: "headName",
                    label: "合同负责人",
                    render: (h, data, row) => {
                        return (
                            <el-tooltip class="item" effect="dark" content={data + "/" + row.headDeptName} placement="top">
                                <span>{data}</span>
                            </el-tooltip>
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
                                        row.state === "1" && {
                                            text: "编辑",
                                            click: this.receivablesEdit.bind(this, row)
                                        },
                                    row.editable &&
                                        row.state !== "1" && {
                                            text: "详情",
                                            click: this.receivablesDetail.bind(this, row)
                                        }
                                ]}
                            />
                        );
                    }
                }
            ],
            // department & user BEGIN
            treeShowQuery: false,
            treeData: [],
            departmentUsers: [],
            // department & user END
            showReceivablesEditDetail: false,
            showReceivablesDetail: false
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.getList();
            // department & user BEGIN
            Api_DepartmentsFetchTree().then(res => {
                this.treeData = res;
            });
            // department & user END
        });
    },
    methods: {
        // 获取主列表数据
        getList() {
            this.listQuery.startDate = this.comboDate.length > 0 ? this.comboDate[0] : "";
            this.listQuery.endDate = this.comboDate.length > 0 ? this.comboDate[1] : "";
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
            // department & user BEGIN
            this.listQuery.headId = "";
            this.listQuery.headDept = "";
            // department & user END
            this.getList();
        },
        // 重置form表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.listQuery.groupId = "";
        },
        switchStatus(_id) {
            this.listQuery.groupId = _id;
            this.getList();
        },
        // department & user BEGIN
        renderContent(h, { node, data }) {
            let name = data.label;
            if (data.label.length > 11) {
                name = data.label.substring(0, 11) + "...";
            }
            return (
                <span class="custom-tree-node" title={data.label}>
                    {" "}
                    {name}{" "}
                </span>
            );
        },
        handleNodeClickQuery(item) {
            this.listQuery.deptName = item.label;
            this.listQuery.headDept = item.id;
            Api_DepartmentUserList({
                currentPage: 1,
                pageSize: 100,
                departmentIds: item.id
            }).then(res => {
                this.listQuery.userName = "";
                this.listQuery.headId = "";
                this.departmentUsers = res.data;
                this.treeShowQuery = false;
            });
        },
        selectClick(id) {
            this.listQuery.headId = id;
        },
        // department & user END
        hideReceivablesEditDetail() {
            this.showReceivablesEditDetail = false;
        },
        /**
         * method@列表编辑
         * _row@行信息
         */
        receivablesEdit(_row) {
            this.showReceivablesEditDetail = true;
            this.$refs.ref_ReceivablesEditDetail.initPage("edit", _row);
        },
        /**
         * method@列表详情
         * _row@行信息
         */
        receivablesDetail(_row) {
            this.showReceivablesDetail = true;
            this.$nextTick(() => {
                this.$refs.ref_ReceivablesDetail.initPage("info", _row);
            });
        },
        hideReceivablesDetail() {
            this.showReceivablesDetail = false;
        },
        gotoContractDetail(_id) {
            const newpage = this.$router.resolve({
                name: "contractLedger",
                query: { id: _id }
            });
            window.open(newpage.href, "_blank");
        }
    }
};
</script>

<style scoped>
.text-blue {
    color: #4a9df2;
}
</style>
