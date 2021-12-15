<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>预期应收报表</span>
      </h1>
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
        <el-form-item class="btns">
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset('searchForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <StatisticsBlock
        :col="statisticCol"
        :query="listQuery"
        :fn="Api_receiveReportStatistics"
        ref="ref_StatisticsBlock"
      ></StatisticsBlock>
      <TableWrapper
        ref="child"
        :fetchDataFn="Api_receiveReportPage"
        :query="listQuery"
        :columns="tableCol"
        :order="order"
        :orderProperty="orderProperty"
        :sort-change="onChange"
        :tableProps="{'default-sort':{prop:'oweMoney',order:'descending'}}"
      />
    </div>
  </div>
</template>

<script type="text/jsx">
import {
  Api_receiveReportPage,
  Api_receiveReportStatistics,
} from "@/api/creditManagement/statisticsAnalysis/expectedReport";
import StatisticsBlock from "@/components/StatisticsBlock/index.vue";

export default {
  name: "ExpectedReport",
  components: { StatisticsBlock },
  data() {
    return {
      listQuery: { companyName: "" },
      order: "descending",
      orderProperty: "oweMoney",
      tableCol: [
        {
          label: "客户编码",
          key: "customerNo",
          width: 100,
          props: { "show-overflow-tooltip": true },
        },
        {
          label: "客户名称",
          key: "companyName",
          align: "left",
          width: 120,
          props: { "show-overflow-tooltip": true },
          render: (h, data, row) => {
            return (
              <span class="canClick" onClick={this.$gotoCustomerDetail.bind(this, row.companyId)}>
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
          label: "逾期金额",
          props: { sortable: "custom" },
          key: "overdueMoney",
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
          label: "30天内",
          props: { sortable: "custom" },
          key: "thirtyMoney",
          align: "right",
          render: (h, data, row) => {
            return this.$toMoney(data);
          },
        },
        {
          label: "31-60天",
          props: { sortable: "custom" },
          key: "sixtyMoney",
          align: "right",
          render: (h, data, row) => {
            return this.$toMoney(data);
          },
        },
        {
          label: "61-90天",
          props: { sortable: "custom" },
          key: "ninetyMoney",
          align: "right",
          render: (h, data, row) => {
            return this.$toMoney(data);
          },
        },
        {
          label: "90天以上",
          props: { sortable: "custom" },
          key: "overNinetyMoney",
          align: "right",
          render: (h, data, row) => {
            return this.$toMoney(data);
          },
        },
      ],
      statisticCol: [
        { name: "30天内预期应收", key: "thirtyMoney", isMoney: true },
        { name: "31-60天预期应收", key: "sixtyMoney", isMoney: true },
        { name: "61-90天预期应收", key: "ninetyMoney", isMoney: true },
        { name: "90天以上预期应收", key: "overNinetyMoney", isMoney: true },
      ],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getList();
    });
  },
  methods: {
    Api_receiveReportPage,
    Api_receiveReportStatistics,
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
    gotoReceivablesDetail(_row) {},
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
</style>
