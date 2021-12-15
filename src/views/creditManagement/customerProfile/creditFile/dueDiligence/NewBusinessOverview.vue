<template>
  <Dialog
    ref="drawer"
    title="新增业务概况"
    :visible.sync="visible"
    :btns="drawerBtns"
    :close="closeDialog"
  >
    <el-form ref="form" :model="form" label-width="150px" style="padding: 0 16px">
      <el-form-item label="主要产品和服务" prop="production">
        <el-input type="textarea" :rows="3" v-model="form.production"></el-input>
      </el-form-item>
      <el-form-item label="主营业务概述" prop="brief">
        <el-input type="textarea" :rows="3" v-model="form.brief"></el-input>
      </el-form-item>
      <el-form-item label="地域分布" prop="area">
        <el-input type="textarea" :rows="3" v-model="form.area"></el-input>
      </el-form-item>
      <el-form-item label="知识产权数量" prop="property">
        <el-input type="textarea" :rows="3" v-model="form.property"></el-input>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script>
export default {
  name: "NewBusinessOverview",
  data() {
    return {
      visible: false,
      form: {
        production: undefined,
        brief: undefined,
        area: undefined,
        property: undefined
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
