<template>
  <Dialog
    ref="drawer"
    title="新增供应商"
    :visible.sync="visible"
    :btns="drawerBtns"
    :close="closeDialog"
    width="40%"
  >
    <el-form ref="form" :model="form" label-width="120px" style="padding: 0 16px">
      <el-form-item label="供应商名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="采购产品" prop="production">
        <el-input v-model="form.production"></el-input>
      </el-form-item>
      <el-form-item label="采购金额(万元)" prop="amount">
        <el-input v-model="form.amount"></el-input>
      </el-form-item>
      <el-form-item label="采购金额占比" prop="proportion">
        <el-input v-model="form.proportion"></el-input>
      </el-form-item>
      <el-form-item label="采购周期" prop="cycle">
        <el-input v-model="form.cycle"></el-input>
      </el-form-item>
      <el-form-item label="付款方式" prop="terms">
        <el-input v-model="form.terms"></el-input>
      </el-form-item>
      <el-form-item label="合作年限" prop="year">
        <el-input v-model="form.year"></el-input>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script>
export default {
  name: "NewSupplier",
  data() {
    return {
      visible: false,
      form: {
        name: undefined,
        production: undefined,
        amount: undefined,
        proportion: undefined,
        cycle: undefined,
        terms: undefined,
        year: undefined
      },
      drawerBtns: [
        {
          text: "返回",
          click: () => {
            this.visible = false;
          }
        },
        {
          text: "确定",
          type: "primary",
          click: () => {
            this.visible = false;
          }
        }
      ]
    };
  },
  methods: {
    open() {
      this.visible = true;
    },
    closeDialog() {
      this.visible = false;
    }
  }
};
</script>

<style>
</style>
