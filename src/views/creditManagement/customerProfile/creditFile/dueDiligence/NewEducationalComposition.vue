<template>
  <Dialog
    ref="drawer"
    title="新增岗位构成"
    :visible.sync="visible"
    :btns="drawerBtns"
    :close="closeDialog"
    width="500px"
  >
    <el-form ref="form" :model="form" label-width="130px" style="padding: 0 16px">
      <el-form-item label="员工总数" prop="totalStaff">
        <el-input v-model="form.totalStaff"></el-input>
      </el-form-item>
      <el-form-item label="研究生及以上(人)" prop="graduate">
        <el-input v-model="form.graduate"></el-input>
      </el-form-item>
      <el-form-item label="本科(人)" prop="underGraduate">
        <el-input v-model="form.underGraduate"></el-input>
      </el-form-item>
      <el-form-item label="大专(人)" prop="college">
        <el-input v-model="form.college"></el-input>
      </el-form-item>
      <el-form-item label="大专以下(人)" prop="undercollege">
        <el-input v-model="form.undercollege"></el-input>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script>
export default {
  name: "NewEducationalComposition",
  data() {
    return {
      visible: false,
      form: {
        totalStaff: "",
        graduate: "",
        underGraduate: "",
        college: "",
        undercollege: ""
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
