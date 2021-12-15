<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>逾期应收报表</span>
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
        <el-form-item label="到期日期">
          <div class="block">
            <el-date-picker
              v-model="comboDate"
              type="daterange"
              align="right"
              unlink-panels
              value-format="yyyy-MM-dd"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
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
        :fn="Api_overdueReportStatistics"
        ref="ref_StatisticsBlock"
      ></StatisticsBlock>
      <TableWrapper
        ref="child"
        :fetchDataFn="Api_overdueReportPage"
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
import {
  Api_overdueReportPage,
  Api_overdueReportStatistics,
} from "@/api/creditManagement/statisticsAnalysis/overdueReport";
import StatisticsBlock from "@/components/StatisticsBlock/index.vue";

export default {
  name: "OverdueReport",
  components: { StatisticsBlock },
  data() {
    return {
      comboDate: [],
      listQuery: { companyName: "", startDate: "", endDate: "" },
      order: "ascending",
      orderProperty: "endDate",
      tableCol: [
        {
          label: "应收账款编码",
          key: "code",
          width: 140,
          props: {
            "show-overflow-tooltip": true,
          },
          render: (h, data, row) => {
            return (
              <span class="canClick" onClick={this.$gotoReceivablesDetail.bind(this, row.id)}>
                {data}
              </span>
            );
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
              <span class="canClick" onClick={this.$gotoCustomerDetail.bind(this, row.companyId)}>
                {data}
              </span>
            );
          },
        },
        {
          label: "合同编码/名称",
          key: "contractName",
          align: "left",
          render: (h, data, row) => {
            return (
              <span class="canClick" onClick={this.$gotoOrderDetail.bind(this, row.contractId)}>
                {row.contractNo + "/" + data}
              </span>
            );
          },
        },
        {
          label: "确认日期",
          props: { sortable: "custom" },
          key: "payDate",
          render: (h, data, row) => {
            return this.$dateFormat(data);
          },
        },
        {
          label: "到期日",
          props: { sortable: "custom" },
          key: "endDate",
          render: (h, data, row) => {
            return this.$dateFormat(data);
          },
        },
        {
          label: "应收金额",
          props: { sortable: "custom" },
          key: "payAmount",
          align: "right",
          render: (h, data, row) => {
            return this.$toMoney(data);
          },
        },
        {
          label: "收款金额",
          props: { sortable: "custom" },
          key: "receivable",
          align: "right",
          render: (h, data, row) => {
            return this.$toMoney(data);
          },
        },
        {
          label: "逾期金额",
          props: { sortable: "custom" },
          key: "oweMoney",
          align: "right",
          render: (h, data, row) => {
            return this.$toMoney(data);
          },
        },
        { label: "逾期天数", props: { sortable: "custom" }, key: "day" },
        {
          label: "合同负责人",
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
      pickerOptions: {
        shortcuts: [
          {
            text: "当天到期",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "1-3天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() + 3600 * 1000 * 24 * 1);
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 3);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "4-7天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() + 3600 * 1000 * 24 * 4);
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "8-15天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() + 3600 * 1000 * 24 * 8);
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 15);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "16-30天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() + 3600 * 1000 * 24 * 16);
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setMonth(end.getMonth() + 1);
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setMonth(end.getMonth() + 3);
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "近六个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setMonth(end.getMonth() + 6);
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "近一年",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setMonth(end.getMonth() + 12);
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      statisticCol: [
        { name: "应收账款金额", key: "payAmount", isMoney: true },
        { name: "已收款金额", key: "receivable", isMoney: true },
        { name: "逾期金额", key: "oweMoney", isMoney: true },
        { name: "逾期账款笔数", key: "count", isMoney: false },
      ],
    };
  },
  created() {
    this.listQuery.companyName = this.$route.query.companyName;
  },
  mounted() {
    this.$nextTick(() => {
      this.getList();
    });
  },
  methods: {
    Api_overdueReportPage,
    Api_overdueReportStatistics,
    // 获取主列表数据
    getList() {
      this.listQuery.startDate = this.comboDate.length > 0 ? this.comboDate[0] : "";
      this.listQuery.endDate = this.comboDate.length > 0 ? this.comboDate[1] : "";
      this.$refs.child.fetchData();
      this.$refs.ref_StatisticsBlock.fetch();
    },
    // 根据查询条件获取数据
    handleFilter() {
      this.getList();
    },
    // 重置查询条件
    handleReset(formName) {
      this.comboDate = [];
      this.$refs[formName].resetFields();
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
