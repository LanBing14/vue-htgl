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
      <!-- <el-form-item class="btns">
                <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
                <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset('searchForm')">重置</el-button>
      </el-form-item>-->
    </el-form>
    <TableWrapper
      ref="ref_goods"
      checkbox
      :data="tableData.filter(data => !listQuery.name || data.name.toLowerCase().includes(listQuery.name.toLowerCase()))"
      :query="listQuery"
      :columns="goodsCol"
      @onCheckedChange="getChenckedData"
    />
  </Dialog>
</template>

<script>
export default {
  name: "ChooseGoods",
  props: { goods: { type: Array, default: () => [] } },
  data() {
    return {
      visible: false,
      listQuery: { name: null },
      goodsCol: [
        { label: "产品/服务名称", key: "name" },
        { label: "销售单位", key: "company" },
        { label: "已发数量", key: "send" },
        { label: "待发数量", key: "num" }
      ],
      tableData: [],
      selectedData: []
    };
  },
  methods: {
    open(_data) {
      this.visible = true;
      if (_data && _data.length) {
        this.$nextTick(() => {
          this.selectedData = [];
          for (let i = 0; i < _data.length; i++) {
            this.$refs.ref_goods.$refs.table.toggleRowSelection(
              this.tableData.filter(item => item.id === _data[i].goodsId)[0],
              true
            );
            this.selectedData.push(this.tableData.filter(item => item.id === _data[i].goodsId)[0]);
          }
        });
      }
    },
    setGoods(_data) {
      this.tableData = _data;
    },
    handleFilter() {},
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
      this.visible = false;
    }
  }
};
</script>

<style>
</style>
