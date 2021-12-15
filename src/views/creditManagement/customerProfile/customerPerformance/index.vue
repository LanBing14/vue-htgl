<template>
    <div>
        <div v-show="isShow">
            <div class="page-header">
                <h1 class="page-name">
                    <span>客户履约情况</span>
                </h1>
            </div>
            <div class="page-content">
                <el-form ref="searchForm" :model="listQuery" :inline="true">
                    <el-form-item prop="companyName">
                        <el-input
                            v-model="listQuery.companyName"
                            placeholder="企业名称"
                            class="filter-item"
                            @keyup.enter.native="handleFilter"
                        />
                    </el-form-item>
                    <el-form-item class="btns">
                        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
                        <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset('searchForm')">重置</el-button>
                    </el-form-item>
                    <RadioText :options="groupIdsOptions" labelKey="group_name" @change="switchBusinessGroup"></RadioText>
                </el-form>
                <div class="page-content-body">
                    <TableWrapper ref="child" :fetchDataFn="Api_GetPerformList" :query="listQuery" :columns="tableCol" />
                </div>
            </div>
            <AddBadCustomer ref="ref_addBadCustomer" @getList="getList"></AddBadCustomer>
        </div>
        <div v-show="!isShow">
            <div class="page-header">
                <h1 class="page-name">
                    <span>应收账款明细</span>
                </h1>
                <div>
                    <el-button @click="showDetail">返回</el-button>
                </div>
            </div>
            <div class="page-content">
                <div class="page-content-body">
                    <el-form ref="detailForm" label-width="100px">
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <div class="grid-content bg-purple">
                                    <el-form-item label="客户编码">{{ customerNo }}</el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="8">
                                <div class="grid-content bg-purple">
                                    <el-form-item label="客户名称">{{ companyName }}</el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="24">
                                <el-divider class="detail-divider"></el-divider>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <div class="grid-content bg-purple">
                                    <el-form-item label="应收未收金额">{{ $toMoney(oweMoney, 2) }}元</el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="8">
                                <div class="grid-content bg-purple">
                                    <el-form-item label="逾期金额" prop="overAmount">{{ $toMoney(overdueMoney, 2) }}元</el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="8">
                                <div class="grid-content bg-purple">
                                    <el-form-item label="最长逾期天数">{{ maxDay || '-' }}天</el-form-item>
                                </div>
                            </el-col>
                        </el-row>
                    </el-form>
                    <TableWrapper ref="detailList" :columns="detailTableCol" :fetchDataFn="Api_GetDetail" :query="detailQuery"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/jsx">
import PageHead from "@/components/PageHead";
import Button from "@/components/Button";
import {
    Api_GetCustomerGroup,
    Api_GetPerformList,
    Api_GetDetail
} from "@/api/creditManagement/customerProfile/customerPerformance.js";
import AddBadCustomer from "./AddBadCustomer";
import RadioText from "@/components/RadioText";

export default {
    name: "CustomerPerformance",
    components: { PageHead, AddBadCustomer, RadioText },
    data() {
        return {
            Api_GetPerformList,
            Api_GetDetail,
            listQuery: { companyName: "", groupId: "" },
            detailQuery: { id: "" },
            groupIdsOptions: [
                {
                    group_name: "全部",
                    id: ""
                }
            ],
            customerNo: "",
            companyName: "",
            groupName: "",
            oweMoney: "",
            overdueMoney: "",
            maxDay: "",
            tableCol: [
                {
                    key: "companyName",
                    label: "企业名称",
                    align: "left",
                    props: { "show-overflow-tooltip": true, "min-width": 150 },
                    render: (h, data, row) => {
                        return [
                            row.editable === true ?
                                <el-link type="primary" onClick={this.$gotoCustomerDetail.bind(this, row.companyId)}>{data}</el-link> :
                                <el-link type="info" disabled> {data} </el-link>,
                        ]
                    }
                },
                { key: "groupName", align: "left", label: "企业分组" },
                {
                    key: "oweMoney",
                    label: "应收未收金额(元)",
                    align: "right",
                    render: (h, data) => {
                        return this.$toMoney(data, 2);
                    }
                },
                {
                    key: "overdueMoney",
                    label: "逾期金额(元)",
                    align: "right",
                    render: (h, data) => {
                        return this.$toMoney(data, 2);
                    }
                },
                {
                    key: "maxDay",
                    label: "最长逾期天数",
                    align: "right",
                    render: (h, data, row) => {
                        return data || "-";
                    }
                },
                {
                    key: "dutyName",
                    label: "客户负责人",
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
                    width: 110,
                    render: (h, data, row) => {
                        return [
                            (row.editable === true || row.status !== "0") ?
                                <el-link type="primary" onClick={this.openBadCustomer.bind(this, row)}> 列入不良客户 </el-link> :
                                <el-link type="info" disabled> 列入不良客户 </el-link>,
                        ]
                    }
                }
            ],
            detailList: [],
            detailTableCol: [
                {
                    key: "contractCode",
                    label: "合同编码/名称",
                    props: { "show-overflow-tooltip": true, "min-width": 150 },
                    render: (h, data, row) => {
                        return data + "/" + row.contractName;
                    }
                },
                {
                    key: "confirmDate",
                    label: "确认日期",
                    render: (h, data) => {
                        return this.$dateFormat(data);
                    }
                },
                {
                    key: "expireDate",
                    label: "到期日",
                    render: (h, data) => {
                        return this.$dateFormat(data);
                    }
                },
                {
                    key: "totalMoney",
                    label: "应收金额(元)",
                    align: "right",
                    render: (h, data) => {
                        return this.$toMoney(data, 2);
                    }
                },
                {
                    key: "alreadyMoney",
                    label: "已收金额(元)",
                    align: "right",
                    render: (h, data) => {
                        return this.$toMoney(data, 2);
                    }
                },
                {
                    key: "oweMoney",
                    label: "应收未收金额(元)",
                    align: "right",
                    render: (h, data) => {
                        return this.$toMoney(data, 2);
                    }
                },
                {
                    key: "overdueMoney",
                    label: "逾期金额(元)",
                    align: "right",
                    render: (h, data) => {
                        return this.$toMoney(data, 2);
                    }
                },
                {
                    key: "overdueDay",
                    label: "逾期天数"
                },
                {
                    key: "dutyName",
                    label: "合同负责人"
                }
            ],
            isShow: true
        };
    },
    mounted() {
        this.getGroups();
    },
    created() {
        this.$nextTick(() => {
            this.getList();
        });
    },
    methods: {
        // 获取主列表数据
        getList() {
            this.$refs.child.fetchData();
        },
        // 获取企业分组
        getGroups() {
            Api_GetCustomerGroup().then(res => {
                this.groupIdsOptions = this.groupIdsOptions.concat(res || []);
            });
        },
        // 根据查询条件获取数据
        handleFilter() {
            this.getList();
        },
        // 重置查询条件
        handleReset(formName) {
            this.$refs[formName].resetFields();
            this.listQuery.groupId = "";
        },
        switchBusinessGroup(_id) {
            this.listQuery.groupId = _id;
            this.getList();
        },
        // 打开不良客户页面
        openBadCustomer(row) {
            this.$nextTick(() => {
                this.$refs.ref_addBadCustomer.open(row);
            });
        },
        //打开应收账款明细
        openDetail(row) {
            // this.isShow = false;
            // this.customerNo = row.customerNo;
            // this.companyName = row.companyName;
            // this.overdueMoney = row.overdueMoney;
            // this.oweMoney = row.oweMoney;
            // this.maxDay = row.maxDay;
            // this.detailQuery.id = row.id;
            // this.$nextTick(() => {
            //     this.$refs.detailList.fetchData();
            // })
            const url = this.$route.path;
            this.$router.push({
                path: url,
                query: {
                    id: row.company_id,
                },
            });
            // Api_GetDetail(row.id)
            //     .then(res => {
            //         this.detailList = res.receivableDetailPageable.data;
            //     })
            //     .catch(res => {
            //         this.$message.error(res);
            //     });
        },
        // 返回
        showDetail() {
            this.isShow = true;
        }
    }
};
</script>

<style scoped>
.text-blue {
    color: #4a9df2;
}
</style>
