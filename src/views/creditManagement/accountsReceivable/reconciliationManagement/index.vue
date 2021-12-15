<template>
    <div>
        <div v-show="!showCustomerReconciliationDetails">
            <div class="page-header">
                <h1 class="page-name">
                    <span>客户对账管理</span>
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
                    <el-form-item>
                        <el-select v-model="listQuery.state" placeholder="对账状态">
                            <el-option label="待确认" :value="1"></el-option>
                            <el-option label="确认有差异" :value="2"></el-option>
                            <el-option label="确认无差异" :value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="btns">
                        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
                        <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset('searchForm')">重置</el-button>
                    </el-form-item>
                    <RadioText :options="monthOptions" newName="对账期间" @change="switchMonth">
                        <el-form-item prop="selectMonth" style="margin: 0;">
                            <el-date-picker
                                v-model="listQuery.selectMonth"
                                value-format="yyyyMM"
                                type="month"
                                placeholder="月度期间"
                                @change="changeSelectMonth"
                            ></el-date-picker>
                        </el-form-item>
                    </RadioText>
                    <RadioText :options="statusOptions" newName="快捷筛选" labelKey="name" @change="switchStatus"></RadioText>
                </el-form>
                <div class="page-content-body">
                    <TableWrapper
                        ref="child"
                        :fetchDataFn="Api_ReconciliationPage"
                        :query="listQuery"
                        :columns="tableCol"
                    />
                </div>
            </div>
        </div>
        <BillConfirmation ref="ref_BillConfirmation" @getList="getList"></BillConfirmation>
        <CustomerReconciliationDetails
            ref="ref_CustomerReconciliationDetails"
            v-show="showCustomerReconciliationDetails"
            @getList="getList"
            @hideCustomerReconciliationDetails="hideCustomerReconciliationDetails"
        ></CustomerReconciliationDetails>
    </div>
</template>

<script type="text/jsx">
import PageHead from "@/components/PageHead";
import {
    Api_ReconciliationPage,
    Api_ReconciliationDownload,
    Api_ReconciliationCount,
    Api_ReconciliationRe
} from "@/api/creditManagement/accountsReceivable/reconciliationManagement.js";
import BillConfirmation from "./BillConfirmation";
import CustomerReconciliationDetails from "./CustomerReconciliationDetails";
import RadioText from "@/components/RadioText";

export default {
    name: "ReconciliationManagement",
    components: { PageHead, CustomerReconciliationDetails, BillConfirmation, RadioText },
    data() {
        const now_date = new Date();
        const d1 =
            now_date.getFullYear() +
            "" +
            (now_date.getMonth() + 1 < 10 ? "0" + (now_date.getMonth() + 1) : now_date.getMonth() + 1);
        const d2 =
            now_date.getMonth() > 0
                ? now_date.getFullYear() +
                  "" +
                  (now_date.getMonth() < 10 ? "0" + now_date.getMonth() : now_date.getMonth())
                : now_date.getFullYear() -
                  1 +
                  "" +
                  (12 - now_date.getMonth() < 10 ? "0" + (12 - now_date.getMonth()) : 12 - now_date.getMonth());
        const d3 =
            now_date.getMonth() - 1 > 0
                ? now_date.getFullYear() +
                  "" +
                  (now_date.getMonth() - 1 < 10 ? "0" + (now_date.getMonth() - 1) : now_date.getMonth() - 1)
                : now_date.getFullYear() -
                  1 +
                  "" +
                  (12 - (1 - now_date.getMonth()) < 10
                      ? "0" + (12 - (1 - now_date.getMonth()))
                      : 12 - (1 - now_date.getMonth()));
        const d4 =
            now_date.getMonth() - 2 > 0
                ? now_date.getFullYear() +
                  "" +
                  (now_date.getMonth() - 2 < 10 ? "0" + (now_date.getMonth() - 2) : now_date.getMonth() - 2)
                : now_date.getFullYear() -
                  1 +
                  "" +
                  (12 - (2 - now_date.getMonth()) < 10
                      ? "0" + (12 - (2 - now_date.getMonth()))
                      : 12 - (2 - now_date.getMonth()));
        const d5 =
            now_date.getMonth() - 3 > 0
                ? now_date.getFullYear() +
                  "" +
                  (now_date.getMonth() - 3 < 10 ? "0" + (now_date.getMonth() - 3) : now_date.getMonth() - 3)
                : now_date.getFullYear() -
                  1 +
                  "" +
                  (12 - (3 - now_date.getMonth()) < 10
                      ? "0" + (12 - (3 - now_date.getMonth()))
                      : 12 - (3 - now_date.getMonth()));
        return {
            Api_ReconciliationPage,
            listQuery: {
                companyName: null,
                state: null,
                month: null,
                monthClick: null,
                selectMonth: d2,
                quickQuery: 0
            },
            statusOptions: [
                { id: 0, name: "全部" },
                { id: 1, name: "我负责的" },
                { id: 2, name: "待我处理" }
            ],
            monthOptions: [
                { label: "全部", id: "" },
                { label: d1, id: d1 },
                { label: d2, id: d2 },
                { label: d3, id: d3 },
                { label: d4, id: d4 },
                { label: d5, id: d5 }
            ],
            tableCol: [
                {
                    key: "dateInt",
                    label: "对账期间",
                    render:(h,data,row)=>{
                        return(
                            <span class="a-link" onClick={this.reconciliationDetails.bind(this, row)}>
                                {data}
                            </span>
                        )
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
                            <span class="a-link" onClick={this.$gotoCustomerDetail.bind(this, row.companyId)}>
                                {data}
                            </span>
                        );
                    }
                },
                {
                    key: "monthEndMoney",
                    label: "期末余额",
                    align: "right",
                    render: (h, data, row) => {
                        return this.$toMoney(data);
                    }
                },
                {
                    key: "addMoney",
                    label: "本期增加",
                    align: "right",
                    render: (h, data, row) => {
                        return this.$toMoney(data);
                    }
                },
                {
                    key: "receivableMoney",
                    label: "本期收款",
                    align: "right",
                    render: (h, data, row) => {
                        return this.$toMoney(data);
                    }
                },
                {
                    key: "responseName",
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
                    key: "state",
                    label: "对账状态",
                    width: 100,
                    render: (h, data, row) => {
                        return data === "0" ? "待确认" : data === "1" ? "无差异" : data === "2" ? "有差异" : "-";
                    }
                },
                {
                    key: "confirmDate",
                    label: "确认时间",
                    width: 100,
                    render: (h, data, row) => {
                        return data ? this.$dateFormat(data) : "-";
                    }
                },
                {
                    key: null,
                    label: "操作",
                    width: 80,
                    render: (h, data, row) => {
                        return (
                            <button-dropdown
                                data={[
                                    row.editable &&
                                        (row.state === "0" || row.state === "2") && {
                                            text: "账单确认",
                                            click: this.billConfirmation.bind(this, row)
                                        },
                                    row.editable && {
                                        text: "对账详情",
                                        click: this.reconciliationDetails.bind(this, row)
                                    },
                                    row.editable &&
                                    (row.state === "0" || row.state === "2") && {
                                            text: "账单下载",
                                            click: this.billDownload.bind(this, row)
                                        },
                                    row.editable &&
                                        row.state === "2" && {
                                            text: "重新生成",
                                            click: this.reBuild.bind(this, row)
                                        }
                                ]}
                            />
                        );
                    }
                }
            ],
            showCustomerReconciliationDetails: false
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
            Api_ReconciliationCount(this.listQuery).then(res => {
                this.statusOptions = [
                    { id: 0, name: "全部" },
                    { id: 1, name: "我负责的" },
                    { id: 2, name: "待我处理" + (res ? "(" + res + ")" : "") }
                ];
            });
        },
        // 根据查询条件获取数据
        handleFilter() {
            this.getList();
        },
        // 重置查询条件
        handleReset(formName) {
            this.$refs[formName].resetFields();
        },
        // 重置form表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        switchMonth(_id) {
            this.listQuery.month = _id;
            this.listQuery.monthClick = _id;
            this.listQuery.selectMonth = "";
            this.getList();
        },
        changeSelectMonth() {
            if (this.listQuery.selectMonth) {
                this.listQuery.monthClick = "";
                this.listQuery.month = this.listQuery.selectMonth;
            }
        },
        hideCustomerReconciliationDetails() {
            this.showCustomerReconciliationDetails = false;
        },
        /**
         * method@账单确认
         */
        billConfirmation(_row) {
            this.$nextTick(() => {
                this.$refs.ref_BillConfirmation.open(_row);
            });
        },
        /**
         * method@对账详情
         */
        reconciliationDetails(_row) {
            this.showCustomerReconciliationDetails = true;
            this.$refs.ref_CustomerReconciliationDetails.open("info", _row);
        },
        /**
         * method@账单下载
         */
        billDownload(_row) {
            Api_ReconciliationDownload(_row.id).then(res => {
                // window.open("/" + res);
                window.open(process.env.VUE_APP_FILE_API + res);
            });
        },
        /**
         * method@重新生成
         */
        reBuild(_row) {
            // 取消监测添加确认框
            this.$confirm("确定重新生成账单吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }) .then(() => {
                    Api_ReconciliationRe(_row.id)
                        .then(() => {
                            this.$message.success("重新生成成功！");
                            this.listQuery.quickQuery = _row.id;
                            this.getList();
                        })
                        .catch(res => {
                            this.$message.error(res);
                        });
                })
                .catch(() => {});

        },
        switchStatus(_id) {
            this.listQuery.quickQuery = _id;
            this.getList();
        }
    }
};
</script>

<style scoped>
.text-blue {
    color: #4a9df2;
}
</style>
