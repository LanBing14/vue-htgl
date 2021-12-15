<template>
  <Dialog
    ref="drawer"
    title="新增项目信息"
    :visible.sync="visible"
    :btns="drawerBtns"
    :close="closeDialog"
    width="640px"
  >
    <el-form ref="form" :model="form" label-width="140px" style="padding: 0 16px">
      <el-form-item label="起止时间" prop="date">
        <el-date-picker
          v-model="form.date"
          type="monthrange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 100%"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="项目名称" prop="projectName">
        <el-input v-model="form.projectName"></el-input>
      </el-form-item>
      <el-form-item label="项目人员总数(人)" prop="totalStaff">
        <el-input v-model="form.totalStaff"></el-input>
      </el-form-item>
      <el-form-item label="薪酬总额(万元)" prop="totalAmount">
        <el-input v-model="form.totalAmount"></el-input>
      </el-form-item>
      <el-form-item label="流动率" prop="flowRate">
        <el-input v-model="form.flowRate"></el-input>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script>
export default {
  name: "NewEmployeeInformation",
  data() {
    return {
      visible: false,
      form: {
        date: "",
        projectName: "",
        totalStaff: "",
        totalAmount: "",
        flowRate: ""
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
