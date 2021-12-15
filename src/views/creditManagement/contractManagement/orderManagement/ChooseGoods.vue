<template>
  <Dialog
    ref="drawer"
    title="选择产品"
    :visible.sync="visible"
    :onOk="handleSure"
    width="600px"
    :close="closeDialog"
  >
    <el-form
      ref="searchForm"
      :model="listQuery"
      :inline="true"
      class="demo-form-inline searchForm-wrap"
      @submit.native.prevent
    >
      <el-form-item>
        <el-input
          v-model="listQuery.name"
          placeholder="请输入产品/服务名称"
          class="filter-item"
          @blur="clearAll"
          @keyup.enter.native="handleFilter"
        />
      </el-form-item>
      <el-form-item class="btns">
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
        <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
    <TableWrapper
      ref="ref_goods"
      checkbox
      :data="filteredTableData"
      :query="listQuery"
      :columns="goodsCol"
      @onCheckedChange="getChenckedData"
    />
  </Dialog>
</template>

<script>
import { Api_getContractGoods } from "@/api/creditManagement/contractManagement/contract.js";

export default {
  name: "ChooseGoods",
  props: {
    cID: {
      default: "",
      type: String
    },
    checkedIds: {
      default: () => [],
      type: Array
    }
  },
  data() {
    return {
      visible: false,
      listQuery: { name: null },
      goodsCol: [
        { label: "产品/服务名称", key: "name", props: { "show-overflow-tooltip": true } },
        { label: "销售单位", key: "company", width: 100 },
        { label: "待发数量", key: "num", width: 100 }
      ],
      tableData: [],
      selectedData: [],
      filteredTableData: []
    };
  },
  watch: {
    cID(_v) {
      if (_v) {
        const loading = this.$openLoading();
        Api_getContractGoods(this.cID).then(res => {
          loading.close();
          this.tableData = res.transientGoodsInfo;
          this.filteredTableData = res.transientGoodsInfo;
          this.$emit("getController", res.controller);
        });
      }
    }
  },
  methods: {
    open() {
      this.visible = true;
      this.$nextTick(() => {
        this.selectedData = [];
        for (let i = 0; i < this.checkedIds.length; i++) {
          this.$refs.ref_goods.$refs.table.toggleRowSelection(
            this.tableData.filter(item => item.id === this.checkedIds[i])[0],
            true
          );
          this.selectedData.push(this.tableData.filter(item => item.id === this.checkedIds[i])[0]);
        }
      });
    },
    handleFilter() {
      this.filteredTableData = this.tableData.filter(
        data => !this.listQuery.name || data.name.toLowerCase().includes(this.listQuery.name.toLowerCase())
      );
    },
    handleReset() {
      this.listQuery.name = "";
      this.handleFilter();
    },
    getChenckedData(_data) {
      this.selectedData = _data;
    },
    handleSure() {
      this.visible = false;
      this.$emit("setList", this.selectedData);
    },
    clearAll() {
      this.$refs.ref_goods.$refs.table.clearSelection();
    },
    closeDialog() {
      this.listQuery.name = "";
    }
  }
};
</script>

<style>
</style>
