<template>
  <div>
    <div v-show="!showReceivablesDetail&&!showMonthlyBillingHistory">
      <div class="page-header">
        <h1 class="page-name">
          <span>应收账款报表</span>
        </h1>
      </div>
      <div class="page-content">
        <el-form ref="searchForm" :model="listQuery" :inline="true">
          <el-form-item label="客户名称" prop="companyName">
            <el-input
              v-model="listQuery.companyName"
              placeholder="客户名称"
              class="filter-item"
              @keyup.enter.native="handleFilter"
            />
          </el-form-item>
          <el-form-item class="btns">
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
            <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset('searchForm')">重置</el-button>
          </el-form-item>
        </el-form>
        <StatisticsBlock
          :col="statisticCol"
          :query="listQuery"
          :fn="Api_ReportStatistics"
          ref="ref_StatisticsBlock"
        ></StatisticsBlock>
        <TableWrapper
          ref="child"
          :fetchDataFn="Api_ReportPage"
          :query="listQuery"
          :columns="tableCol"
          :order="order"
          :orderProperty="orderProperty"
          :sort-change="onChange"
          :tableProps="{'default-sort':{prop:'oweMoney',order:'descending'}}"
        />
      </div>
    </div>
    <ReceivablesDetail
      ref="ref_ReceivablesDetail"
      v-show="showReceivablesDetail"
      @hideReceivablesDetail="hideReceivablesDetail"
    ></ReceivablesDetail>
    <MonthlyBillingHistory
      ref="ref_MonthlyBillingHistory"
      v-show="showMonthlyBillingHistory"
      @hideMonthlyBillingHistory="hideMonthlyBillingHistory"
    ></MonthlyBillingHistory>
  </div>
</template>

<script type="text/jsx">
import ReceivablesDetail from "./ReceivablesDetail";
import MonthlyBillingHistory from "./MonthlyBillingHistory";
import {
  Api_ReportPage,
  Api_ReportStatistics,
} from "@/api/creditManagement/statisticsAnalysis/receivablesReport";
import StatisticsBlock from "@/components/StatisticsBlock/index.vue";

export default {
  name: "ReceivablesReport",
  components: { ReceivablesDetail, MonthlyBillingHistory, StatisticsBlock },
  data() {
    return {
      Api_ReportPage,
      listQuery: { companyName: "" },
      order: "",
      orderProperty: "oweMoney",
      tableCol: [
        {
          label: "客户编码",
          key: "customerCode",
          width: 100,
          props: {
            "show-overflow-tooltip": true,
          },
        },
        {
          label: "客户名称",
          key: "companyName",
          align: "left",
          width: 120,
          props: {
            "show-overflow-tooltip": true,
          },
          render: (h, data, row) => {
            return (
              <span class="canClick" onClick={this.receivablesDetail.bind(this, row)}>
                {data}
              </span>
            );
          },
        },
        {
          label: "应收未收金额",
          props: { sortable: "custom" },
          key: "oweMoney",
          align: "right",
          render: (h, data, row) => {
            return this.$toMoney(data);
          },
        },
        {
          label: "账期内金额",
          props: { sortable: "custom" },
          key: "undueMoney",
          align: "right",
          render: (h, data, row) => {
            return this.$toMoney(data);
          },
        },
        {
          label: "逾期金额",
          props: { sortable: "custom" },
          key: "overdueMoney",
          align: "right",
          render: (h, data, row) => {
            return this.$toMoney(data);
          },
        },
        { label: "逾期笔数", props: { sortable: "custom" }, key: "count", align: "right" },
        {
          label: "单笔最大逾期",
          props: { sortable: "custom" },
          key: "maxMoney",
          align: "right",
          render: (h, data, row) => {
            return this.$toMoney(data);
          },
        },
        {
          label: "最长逾期天数",
          props: { sortable: "custom" },
          key: "overdueDay",
          align: "right",
          render: (h, data, row) => {
            return data || "-";
          },
        },
        {
          label: "操作",
          key: null,
          render: (h, data, row) => {
            return  [
                <el-link type="primary" onClick={  this.monthlyBillingHistory.bind(this, row)}> 历史账单 </el-link>
            ]
          },
        },
      ],
      showReceivablesDetail: false,
      showMonthlyBillingHistory: false,
      statisticCol: [
        { name: "应收未收金额", key: "oweMoney", isMoney: true },
        { name: "账期内金额", key: "undueMoney", isMoney: true },
        { name: "逾期账款金额", key: "overdueMoney", isMoney: true },
        { name: "逾期账款笔数", key: "count", isMoney: false },
      ],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getList();
    });
  },
  methods: {
    Api_ReportStatistics,
    // 获取主列表数据
    getList() {
      this.$refs.child.fetchData();
      this.$refs.ref_StatisticsBlock.fetch();
    },
    // 根据查询条件获取数据
    handleFilter() {
      this.getList();
    },
    // 重置查询条件
    handleReset(formName) {
      this.$refs[formName].resetFields();
    },
    // 应收账款明细
    receivablesDetail(_row) {
      this.showReceivablesDetail = true;
      this.$refs.ref_ReceivablesDetail.open(_row);
    },
    // 月度账单历史
    monthlyBillingHistory(_row) {
      this.showMonthlyBillingHistory = true;
      this.$refs.ref_MonthlyBillingHistory.open(_row);
    },
    hideReceivablesDetail() {
      this.showReceivablesDetail = false;
    },
    hideMonthlyBillingHistory() {
      this.showMonthlyBillingHistory = false;
    },
    // 排序
    onChange({ column, prop, order }) {
      this.orderProperty = prop;
      this.order = order;
      this.$nextTick(() => {
        this.getList();
      });
    },
  },
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
