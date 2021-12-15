<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>客户账龄分析</span>
      </h1>
      <div style="line-height: 40px; color: #C0C4CC; font-size: 13px">更新时间： {{ updateTime }}</div>
    </div>
    <div class="page-content">
      <el-form ref="searchForm" :model="listQuery" :inline="true">
        <el-form-item prop="name">
          <el-input
            v-model="listQuery.name"
            placeholder="客户名称"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item prop="state">
          <el-select v-model="listQuery.state" placeholder="状态">
            <el-option value="0" label="逾期"></el-option>
            <el-option value="1" label="正常"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="btns">
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset('searchForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="page-content-body">
        <TableWrapper
          ref="child"
          :fetchDataFn="Api_AccountAgeGetList"
          :query="listQuery"
          :columns="tableCol"
        />
      </div>
    </div>
  </div>
</template>

<script type="text/jsx">
import PageHead from "@/components/PageHead";
import Button from "@/components/Button";
import { Api_AccountAgeGetList } from "@/api/creditManagement/contractManagement/contract.js";

export default {
  name: "CustomerAnalysis",
  components: { PageHead },
  data() {
    return {
      Api_AccountAgeGetList,
      updateTime: this.$dateFormat(new Date()),
      listQuery: { name: undefined, state: undefined },
      list: [], // 主列表数据
      tableCol: [
        {
          key: "companyName",
          label: "客户名称",
          align: "left",
          width: 120,
          props: {
            "show-overflow-tooltip": true,
          },
          render: (h, data, row) => {
            return (
              <span class="a-link" onClick={this.$gotoCustomerDetail.bind(this, row.companyId)}>
                {data}
              </span>
            );
          },
        },
        {
          key: "total",
          label: "应收未收金额",
          align: "right",
          render: (h, data, row) => {
            return data ? this.$toMoney(data) : "-";
          },
        },
        {
          key: "var0",
          label: "账期内金额",
          align: "right",
          render: (h, data, row) => {
            return data ? this.$toMoney(data) : "-";
          },
        },
        {
          key: "var1",
          label: "1-30天",
          align: "right",
          render: (h, data, row) => {
            return data ? this.$toMoney(data) : "-";
          },
        },
        {
          key: "var2",
          label: "31-60天",
          align: "right",
          render: (h, data, row) => {
            return data ? this.$toMoney(data) : "-";
          },
        },
        {
          key: "var3",
          label: "61-90天",
          align: "right",
          render: (h, data, row) => {
            return data ? this.$toMoney(data) : "-";
          },
        },
        {
          key: "var4",
          label: "91-120天",
          align: "right",
          render: (h, data, row) => {
            return data ? this.$toMoney(data) : "-";
          },
        },
        {
          key: "var5",
          label: "121-180天",
          align: "right",
          render: (h, data, row) => {
            return data ? this.$toMoney(data) : "-";
          },
        },
        {
          key: "var5",
          label: "180天以上",
          align: "right",
          render: (h, data, row) => {
            return data ? this.$toMoney(data) : "-";
          },
        },
        {
          key: "state",
          label: "状态",
          render: (h, data) => {
            return data ? "正常" : "逾期";
          },
        },
      ],
    };
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
    // 根据查询条件获取数据
    handleFilter() {
      this.updateTime = this.$dateFormat(new Date());
      this.getList();
    },
    // 重置查询条件
    handleReset(formName) {
      this.updateTime = this.$dateFormat(new Date());
      this.$refs[formName].resetFields();
    },
    // 重置form表单
    resetForm(formName) {
      this.updateTime = this.$dateFormat(new Date());
      this.$refs[formName].resetFields();
    },
    // 新增
    handleAdd() {},
  },
};
</script>

<style scoped>
</style>
