<template>
    <div>
        <div class="page-header">
            <h1 class="page-name">
                <span>月度账单历史</span>
            </h1>
            <div>
                <el-button @click="backClick">返回</el-button>
            </div>
        </div>
        <div class="page-content">
            <el-form ref="searchForm" :model="listQuery" :inline="true">
                <el-form-item label="客户名称">
                    <el-input
                        v-model="listQuery.companyName"
                        placeholder="客户名称"
                        class="filter-item"
                        @keyup.enter.native="handleFilter"
                    />
                </el-form-item>
                <el-form-item label="到期日期">
                    <div class="block">
                        <el-date-picker v-model="listQuery.month" type="month" value-format="yyyyMM" placeholder="选择月"></el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
                    <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset('searchForm')">重置</el-button>
                </el-form-item>
            </el-form>
            <TableWrapper
                ref="child"
                :fetchDataFn="Api_ReportMonth"
                :query="listQuery"
                :columns="tableCol"
                :order="order"
                :orderProperty="orderProperty"
                :sort-change="onChange"
                :tableProps="{'default-sort':{prop:'month',order:'descending'}}"
            />
        </div>
    </div>
</template>

<script>
import { Api_ReportMonth } from "@/api/creditManagement/statisticsAnalysis/receivablesReport.js";

export default {
    name: "MonthlyBillingHistory",
    data() {
        return {
            listQuery: {
                companyName: "",
                customerId: "",
                month: ""
            },
            order: "descending",
            orderProperty: "month",
            tableCol: [
                { label: "客户编码", key: "customerCode" },
                {
                    label: "客户名称",
                    key: "companyName",
                    align: "left",
                    render: (h, data, row) => {
                        return (
                            <span class="canClick" onClick={this.gotoCustomerDetail.bind(this, row)}>
                                {data}
                            </span>
                        );
                    }
                },
                {
                    label: "期初账款余额(元)",
                    props: { sortable: "custom" },
                    key: "startMoney",
                    align: "right",
                    render: (h, data, row) => {
                        return this.$toMoney(data);
                    }
                },
                {
                    label: "本月新增应收(元)",
                    props: { sortable: "custom" },
                    key: "totalMoney",
                    align: "right",
                    render: (h, data, row) => {
                        return this.$toMoney(data);
                    }
                },
                {
                    label: "本月收款金额(元)",
                    props: { sortable: "custom" },
                    key: "payMoney",
                    align: "right",
                    render: (h, data, row) => {
                        return this.$toMoney(data);
                    }
                },
                {
                    label: "本月折扣金额(元)",
                    props: { sortable: "custom" },
                    key: "discountMoney",
                    align: "right",
                    render: (h, data, row) => {
                        return this.$toMoney(data);
                    }
                },
                {
                    label: "期末账款余额(元)",
                    props: { sortable: "custom" },
                    key: "endMoney",
                    align: "right",
                    render: (h, data, row) => {
                        return this.$toMoney(data);
                    }
                },
                {
                    label: "期末逾期金额(元)",
                    props: { sortable: "custom" },
                    key: "oweMoney",
                    align: "right",
                    render: (h, data, row) => {
                        return this.$toMoney(data);
                    }
                },
                { label: "统计月度", props: { sortable: "custom" }, key: "month" }
            ]
        };
    },
    methods: {
        Api_ReportMonth,
        open(_row) {

                let _year = new Date().getFullYear();
                let _month = new Date().getMonth();
                

                // 若是月是0，说明是1月份，那么上个月就是12月份
                
                if(_month==0){
                    _month="12";
                    _year=_year-1+"";
                }else{
                    _month=_month+"";
                }


                if(_month.length==2){
                    this.listQuery.month=_year+""+_month+""
                }else{
                    this.listQuery.month=_year+""+"0"+_month
                }
                

    
        


            


            

            this.listQuery.customerId = _row.customerId;
            this.$nextTick(() => {
                this.getList();
            });
        },
        backClick() {
            this.$emit("hideMonthlyBillingHistory");
        },
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
            this.comboDate = [];
            this.$refs[formName].resetFields();
            this.getList();
        },
        gotoCustomerDetail(_row) {
            const newpage = this.$router.resolve({
                name: "customerManagement",
                query: {
                    id: _row.companyId
                }
            });
            window.open(newpage.href, "_blank");
        },
        // 排序
        onChange({ column, prop, order }) {
            this.orderProperty = prop;
            this.order = order;
            this.$nextTick(() => {
                this.getList();
            });
        }
    }
};
</script>

<style>
</style>
