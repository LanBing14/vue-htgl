<template>
    <div>
        <div class="page-header">
            <h1 class="page-name">
                <span>应收账款明细</span>
            </h1>
            <div>
                <el-button @click="backClick">返回</el-button>
            </div>
        </div>
        <div class="page-content">
            <el-form ref="searchForm" :model="listQuery" :inline="true">
                <el-form-item label="客户名称">
                    <el-select
                        v-model="listQuery.customerId"
                        filterable
                        remote
                        reserve-keyword
                        placeholder="请输入关键词"
                        :remote-method="remoteMethod"
                        :loading="loading"
                        style="width: 300px"
                    >
                        <el-option
                            v-for="item in customerOptions"
                            :key="item.customer_id"
                            :label="item.company_name"
                            :value="item.customer_id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <RadioText :options="statusOptions" newName="状态" @change="onStatusChange"></RadioText>
                <el-form-item label="到期日期">
                    <div class="block">
                        <el-date-picker
                            v-model="comboDate"
                            type="monthrange"
                            value-format="yyyy-MM-dd"
                            range-separator="-"
                            start-placeholder="账款到期日起"
                            end-placeholder="账款到期日止"
                        ></el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
                    <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset('searchForm')">重置</el-button>
                </el-form-item>
            </el-form>
            <StatisticsBlock :col="statisticCol" :query="listQuery" :fn="Api_ReportDetailStatistics" ref="ref_StatisticsBlock"></StatisticsBlock>
            <TableWrapper
                ref="child"
                :fetchDataFn="Api_ReportDetail"
                :query="listQuery"
                :columns="tableCol"
                :order="order"
                :orderProperty="orderProperty"
                :sort-change="onChange"
                :tableProps="{'default-sort':{prop:'endDate',order:'ascending'}}"
            />
        </div>
    </div>
</template>

<script type="text/jsx">
import RadioText from "@/components/RadioText";
import { Api_ReportDetail, Api_ReportDetailStatistics } from "@/api/creditManagement/statisticsAnalysis/receivablesReport";
import { Api_ClientGetList } from "@/api/creditManagement/contractManagement/contract.js";
import StatisticsBlock from "@/components/StatisticsBlock/index.vue";

export default {
    name: "ReceivablesDetail",
    components: { RadioText, StatisticsBlock },
    data() {
        return {
            comboDate: [],
            listQuery: {
                customerId: "",
                startDate: "",
                endDate: "",
                type: ""
            },
            customerOptions: [],
            loading: false,
            statusOptions: [
                { id: "", label: "全部" },
                { id: false, label: "未结清" },
                { id: true, label: "已结清" }
            ],
            order: "ascending",
            orderProperty: "endDate",
            tableCol: [
                {
                    label: "应收账款编码",
                    key: "receivableCode",
                    render: (h, data, row) => {
                        return (
                            <span class="canClick" onClick={this.gotoReceivablesDetail.bind(this, row)}>
                                {data}
                            </span>
                        );
                    }
                },
                {
                    label: "合同编码/名称",
                    align: "left",
                    key: "contractName",
                    render: (h, data, row) => {
                        return (
                            <span class="canClick" onClick={this.gotoContractDetail.bind(this, row)}>
                                {row.contractCode + "/" + data}
                            </span>
                        );
                    }
                },
                {
                    label: "确认日期",
                    props: { sortable: "custom" },
                    key: "startDate",
                    render: (h, data, row) => {
                        return this.$dateFormat(data);
                    }
                },
                {
                    label: "到期日",
                    props: { sortable: "custom" },
                    key: "endDate",
                    render: (h, data, row) => {
                        return this.$dateFormat(data);
                    }
                },
                {
                    label: "应收金额(元)",
                    props: { sortable: "custom" },
                    align: "right",
                    key: "totalMoney",
                    render: (h, data, row) => {
                        return this.$toMoney(data);
                    }
                },
                {
                    label: "应收未收金额(元)",
                    props: { sortable: "custom" },
                    align: "right",
                    key: "overdueMoney",
                    render: (h, data, row) => {
                        return this.$toMoney(data);
                    }
                },
                {
                    label: "已收款金额(元)",
                    props: { sortable: "custom" },
                    align: "right",
                    key: "payMoney",
                    render: (h, data, row) => {
                        return this.$toMoney(data);
                    }
                },
                {
                    label: "合同负责人",
                    key: "dutyName",
                    render: (h, data, row) => {
                        return (
                            <el-tooltip class="item" effect="dark" content={data + "/" + row.deptName} placement="top">
                                <span>{data}</span>
                            </el-tooltip>
                        );
                    }
                }
            ],
            statisticCol: [
                { name: "应收账款金额", key: "totalMoney", isMoney: true },
                { name: "应收未收金额", key: "overdueMoney", isMoney: true },
                { name: "已收款金额", key: "payMoney", isMoney: true },
                { name: "逾期账款金额", key: "oweMoney", isMoney: true }
            ]
        };
    },
    methods: {
        Api_ReportDetail,
        Api_ReportDetailStatistics,
        open(_row) {
            this.remoteMethod(_row.companyName, null, null, () => {
                this.listQuery.customerId = _row.customerId;
                this.$nextTick(() => {
                    this.getList();
                });
            });
        },
        backClick() {
            this.$emit("hideReceivablesDetail");
        },
        // 获取主列表数据
        getList() {
            this.listQuery.startDate = this.comboDate.length > 0 ? this.comboDate[0] : "";
            this.listQuery.endDate = this.comboDate.length > 0 ? this.comboDate[1] : "";
            this.$refs.child.fetchData();
            this.$refs.ref_StatisticsBlock.fetch();
        },
        // 根据查询条件获取数据
        handleFilter() {
            if (!this.listQuery.customerId) {
                this.$message.error("请先填写客户名称！");
                return false;
            }
            this.getList();
        },
        // 重置查询条件
        handleReset(formName) {
            this.comboDate = [];
            this.$refs[formName].resetFields();
            this.getList();
        },
        onStatusChange(value) {
           
            // 未结清  0
            // 已结清  1
            if(value===false){

                this.listQuery.type=0

            }else if(value===true){

                this.listQuery.type=1;

            }else{
                this.listQuery.type="";
            }

            
            this.listQuery.status = value;

            this.getList();
        },
        remoteMethod(query, h, j, cb) {
            if (query !== "") {
                this.loading = true;
                setTimeout(() => {
                    Api_ClientGetList({ companyName: query }).then(res => {
                        this.loading = false;
                        this.customerOptions = res;
                        this.$nextTick(() => {
                            cb && cb();
                        });
                    });
                }, 200);
            } else {
                this.customerOptions = [];
            }
        },
        gotoReceivablesDetail(_row) {
            const newpage = this.$router.resolve({
                name: "receivableManagement",
                query: {
                    id: _row.payId
                }
            });
            window.open(newpage.href, "_blank");
        },
        gotoContractDetail(_row) {
            const newpage = this.$router.resolve({
                name: "contractLedger",
                query: {
                    id: _row.contractId
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

<style scoped>
.newStyle1 {
    border-radius: 72px;
    height: 72px;
    width: 72px;
    background-image: url(../../../../assets/images/ysje.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
}

.newStyle2 {
    border-radius: 72px;
    height: 72px;
    width: 72px;
    background-image: url(../../../../assets/images/yqje.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
}

.newStyle3 {
    border-radius: 72px;
    height: 72px;
    width: 72px;
    background-image: url(../../../../assets/images/dayje.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
}

.newStyle4 {
    border-radius: 72px;
    height: 72px;
    width: 72px;
    background-image: url(../../../../assets/images/yqbs.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
}

.title-msg {
    background-color: #fff;
    padding: 12px 16px;
    line-height: 34px;
    border: 1px solid #d7dae2;
}

.head-img-container {
    padding-bottom: 15px;
    background: #f8f9fa;
    position: relative;
    left: -30px;
    top: -20px;
    width: calc(100% + 60px);
    overflow-x: hidden;
}
</style>
