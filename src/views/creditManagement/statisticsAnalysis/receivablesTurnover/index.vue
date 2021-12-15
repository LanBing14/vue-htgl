<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>应收周转情况</span>
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
        <el-form-item label="到期日期" prop="month">
          <div class="block">
            <el-date-picker
              v-model="listQuery.month"
              :clearable="false"
              value-format="yyyyMM"
              type="month"
              placeholder="选择月"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item class="btns">
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset('searchForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <StatisticsBlock
        :col="statisticCol"
        :query="listQuery"
        :fn="Api_turnoverReportStatistics"
        ref="ref_StatisticsBlock"
      ></StatisticsBlock>
      <TableWrapper
        ref="child"
        :fetchDataFn="Api_turnoverReportPage"
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

<script type="text/jsx">
import {
  Api_turnoverReportPage,
  Api_turnoverReportStatistics,
} from "@/api/creditManagement/statisticsAnalysis/receivablesTurnover";
import StatisticsBlock from "@/components/StatisticsBlock/index.vue";

export default {
  name: "ReceivablesTurnover",
  components: { StatisticsBlock },
  data() {
    return {
      listQuery: { companyName: "", month: this.$currentMonth()},
      order: "descending",
      orderProperty: "month",
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
          width: 120,
          align: "left",
          props: {
            "show-overflow-tooltip": true,
          },
          render: (h, data, row) => {
            return (
              <span class="canClick" onClick={this.gotoCustomerDetail.bind(this, row)}>
                {data}
              </span>
            );
          },
        },
        {
          label: "应收账款周转率",
          props: { sortable: "custom" },
          align: "right",
          key: "turnRate",
          render: (h, data, row) => {
            return data === null ? "-" : data;
          },
        },
        {
          label: "应收周转天数",
          props: { sortable: "custom" },
          align: "right",
          key: "turnDay",
          render: (h, data, row) => {
            return data === null ? "-" : data;
          },
        },
        {
          label: "平均信用账期",
          props: { sortable: "custom" },
          key: "averagePayDay",
          align: "right",
          render: (h, data, row) => {
            return data === null ? "-" : data;
          },
        },
        {
          label: "平均拖欠天数",
          props: { sortable: "custom" },
          key: "averageDefaultDay",
          align: "right",
          render: (h, data, row) => {
            return data === null ? "-" : data;
          },
        },
        { label: "统计月度", props: { sortable: "custom" }, key: "month" },
        {
          label: "客户负责人",
          key: "dutyName",
          render: (h, data, row) => {
            return (
              <el-tooltip class="item" effect="dark" content={data + "/" + row.deptName} placement="top">
                <span>{data}</span>
              </el-tooltip>
            );
          },
        },
      ],
      statisticCol: [
        { name: "应收账款周转率", key: "turnRate", isMoney: false },
        { name: "应收周转天数", key: "turnDay", isMoney: false },
        { name: "平均信用账期", key: "averagePayDay", isMoney: false },
        { name: "平均拖欠天数", key: "averageDefaultDay", isMoney: false },
      ],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getList();
    });
  },
  methods: {
    Api_turnoverReportPage,
    Api_turnoverReportStatistics,
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
    gotoCustomerDetail(_row) {
      const newpage = this.$router.resolve({
        name: "customerManagement",
        query: {
          id: _row.companyId,
        },
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
    },
  },
};
</script>

<style scoped>
</style>
