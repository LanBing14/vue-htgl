<template>
  <Dialog
    ref="drawer"
    title="新增岗位构成"
    :visible.sync="visible"
    :btns="drawerBtns"
    :close="closeDialog"
    width="500px"
  >
    <el-form ref="form" :model="form" label-width="100px" style="padding: 0 16px">
      <el-form-item label="员工总数" prop="totalStaff">
        <el-input v-model="form.totalStaff"></el-input>
      </el-form-item>
      <el-form-item label="管理人员(人)" prop="manager">
        <el-input v-model="form.manager"></el-input>
      </el-form-item>
      <el-form-item label="生产人员(人)" prop="productionStaff">
        <el-input v-model="form.productionStaff"></el-input>
      </el-form-item>
      <el-form-item label="技术人员(人)" prop="technicalStaff">
        <el-input v-model="form.technicalStaff"></el-input>
      </el-form-item>
      <el-form-item label="销售人员(人)" prop="salesperson">
        <el-input v-model="form.salesperson"></el-input>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script>
export default {
  name: "NewPostComposition",
  data() {
    return {
      visible: false,
      form: {
        totalStaff: "",
        manager: "",
        productionStaff: "",
        technicalStaff: "",
        salesperson: ""
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
