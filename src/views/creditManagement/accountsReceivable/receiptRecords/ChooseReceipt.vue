<template>
  <Dialog
    ref="drawer"
    title="选择应收账款"
    :visible.sync="visible"
    :onOk="handleSure"
    width="800px"
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
          placeholder="请输入合同/订单名称"
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
      v-loading="loading"
      ref="ref_goods"
      checkbox
      :data="tableData.filter(data => !listQuery.name || data.contract_name.toLowerCase().includes(listQuery.name.toLowerCase()))"
      :query="listQuery"
      :columns="goodsCol"
      @onCheckedChange="getChenckedData"
    />
  </Dialog>
</template>

<script>
import { Api_getPayPlanCode } from "@/api/creditManagement/accountsReceivable/receiptRecords.js";

export default {
  name: "ChooseReceipt",
  data() {
    return {
      visible: false,
      listQuery: { name: null },
      goodsCol: [
        {
          label: "应收账款编码",
          key: "pay_plan_code",
          align: "left",
          props: { "show-overflow-tooltip": true },
          render: (h, data, row) => {
            return (
              <span class="canClick" onClick={this.$gotoReceivablesDetail.bind(this, row.pay_plan_id)}>
                {data}
              </span>
            );
          }
        },
        {
          label: "订单编码/名称",
          key: "contract_name",
          align: "left",
          props: { "show-overflow-tooltip": true },
          render: (h, data, row) => {
            return (
              <span class="canClick" onClick={this.$gotoOrderDetail.bind(this, row.contract_id)}>
                {row.contract_no + "/" + row.contract_name}
              </span>
            );
          }
        },
        {
          label: "应收未收金额",
          key: "pay_amount",
          align: "right",
          props: { "show-overflow-tooltip": true },
          width: 120,
          render: (h, data, row) => {
            return this.$toMoney(data - row.receivable);
          }
        },
        {
          label: "到期日",
          key: "end_date",
          props: { "show-overflow-tooltip": true },
          width: 100,
          render: (h, data, row) => {
            return this.$dateFormat(data);
          }
        }
      ],
      tableData: [],
      selectedData: [],
      loading: false
    };
  },
  methods: {
    open(_cid, _pid) {
      this.selectedData = [];
      this.visible = true;
      this.$nextTick(() => {
        this.loading = true;
        Api_getPayPlanCode({ companyId: _cid })
          .then(res => {
            this.loading = false;
            this.tableData = res;
            if (_pid) {
              this.$nextTick(() => {
                this.$refs.ref_goods.$refs.table.toggleRowSelection(
                  this.tableData.filter(item => item.pay_plan_id === _pid)[0],
                  true
                );
                this.selectedData = this.tableData.filter(item => item.pay_plan_id === _pid);
              });
            }
          })
          .catch(() => {
            this.loading = false;
          });
      });
    },
    handleFilter(companyId) {},
    getChenckedData(_data) {
      this.selectedData = _data;
    },
    handleSure() {
      if (this.selectedData.length !== 1) {
        this.$alert("请选择一项应收帐款条目！", "提示", { confirmButtonText: "确定", type: "warning" });
        return false;
      }
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
