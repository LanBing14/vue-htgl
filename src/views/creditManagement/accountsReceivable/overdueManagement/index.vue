<template>
    <div>
        <div v-show="!showOverdueAccountDetails">
            <div class="page-header">
                <h1 class="page-name">
                    <span>逾期账款管理</span>
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
                            start-placeholder="预计付款日期起"
                            end-placeholder="预计付款日期止"
                            value-format="yyyy-MM-dd"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item class="btns">
                        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
                        <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset('searchForm')">重置</el-button>
                    </el-form-item>
                    <RadioText :options="groupIdsOptions" newName="延期状态" labelKey="name" @change="switchStatus"></RadioText>
                </el-form>
                <div class="page-content-body">
                    <TableWrapper ref="child" :fetchDataFn="Api_PlanDelaypage" :query="listQuery" :columns="tableCol" />
                </div>
            </div>
        </div>
        <ExtendDueDate ref="ref_ExtendDueDate" @getList="getList"></ExtendDueDate>
        <OverdueAccountDetails
            ref="ref_OverdueAccountDetails"
            v-show="showOverdueAccountDetails"
            @hideOverdueAccountDetails="hideOverdueAccountDetails"
            @getList="getList"
        ></OverdueAccountDetails>
    </div>
</template>

<script type="text/jsx">
import { Api_PlanDelaypage } from "@/api/creditManagement/accountsReceivable/overdueManagement.js";
// department & user BEGIN
import { Api_DepartmentsFetchTree, Api_DepartmentUserList } from "@/api/settings/dept.js";
// department & user END
import ExtendDueDate from "./ExtendDueDate";
import OverdueAccountDetails from "./OverdueAccountDetails";
import RadioText from "@/components/RadioText";

export default {
    name: "OverdueManagement",
    components: { OverdueAccountDetails, ExtendDueDate, RadioText },
    data() {
        return {
            Api_PlanDelaypage,
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
                { id: "1", name: "待审核" },
                { id: "2", name: "已签批" },
                { id: "3", name: "已打回" }
            ],
            tableCol: [
                {
                    key: "payPlanCode",
                    label: "应收编码",
                    width: 150,
                    props: {
                        "show-overflow-tooltip": true
                    },
                    render: (h, data, row) => {
                        return (
                            <span class="canClick" onClick={this.overdueAccountDetails.bind(this, row)}>
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
                            <span class="canClick" onClick={this.$gotoContractDetail.bind(this, row.contractId)}>
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
                    key: "endDate",
                    label: "到期日",
                    render: (h, data, row) => {
                        return this.$dateFormat(data, "yyyy-MM-dd");
                    }
                },
                {
                    key: "overDueMoney",
                    label: "逾期金额(元)",
                    align: "right",
                    render: (h, data, row) => {
                        return this.$toMoney(data);
                    }
                },
                { key: "overDueDay", label: "逾期天数", align: "right" },
                {
                    key: "amount",
                    label: "延期天数",
                    align: "right",
                    render: (h, data, row) => {
                        return data || 0;
                    }
                },
                {
                    key: "viewState",
                    label: "延期状态",
                    render: (h, data, row) => {
                        return data === "0" ? "打回" : data === "1" ? "待审核" : data === "2" ? "签批" : "-";
                    }
                },
                {
                    key: "username",
                    label: "合同负责人",
                    render: (h, data, row) => {
                        return (
                            <el-tooltip class="item" effect="dark" content={data + "/" + row.deptName} placement="top">
                                <span>{data}</span>
                            </el-tooltip>
                        );
                    }
                },
                {
                    key: null,
                    label: "操作",
                    render: (h, data, row) => {
                        return (
                            <button-dropdown
                                data={[
                                    row.editable &&
                                        !row.viewState && {
                                            text: "延长到期日",
                                            click: this.extendDueDate.bind(this, row)
                                        },
                                    row.editable &&
                                        row.viewState && {
                                            text: "逾期账款详情",
                                            click: this.overdueAccountDetails.bind(this, row)
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
            showOverdueAccountDetails: false
        };
    },
    mounted() {
        this.$nextTick(() => {
            // department & user BEGIN
            Api_DepartmentsFetchTree().then(res => {
                this.treeData = res;
            });
            // department & user END
            this.getList();
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
            console.log(1)
            this.getList();
        },
        // 重置查询条件
        handleReset(formName) {
            this.$refs[formName].resetFields();
            // department & user BEGIN
            this.listQuery.headId = "";
            this.listQuery.headDept = "";
            // department & user END
            this.listQuery.groupId = "";
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
        extendDueDate(row) {
            this.$nextTick(() => {
                this.$refs.ref_ExtendDueDate.open(row);
            });
        },
        overdueAccountDetails(_row) {
            this.showOverdueAccountDetails = true;
            this.$refs.ref_OverdueAccountDetails.open(_row);
        },
        hideOverdueAccountDetails() {
            this.showOverdueAccountDetails = false;
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
        }
        // department & user END
    }
};
</script>

<style scoped>
.text-blue {
    color: #4a9df2;
}
</style>
