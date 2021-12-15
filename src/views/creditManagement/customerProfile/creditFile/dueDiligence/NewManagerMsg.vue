<template>
  <Dialog
    ref="drawer"
    title="新增经营环境"
    :visible.sync="visible"
    :btns="drawerBtns"
    :close="closeDialog"
    width="500px"
  >
    <el-form ref="form" :model="form" label-width="80px" style="padding: 0 16px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="职务" prop="job">
        <el-input v-model="form.job"></el-input>
      </el-form-item>
      <el-form-item label="工作简历" prop="profile">
        <el-input type="textarea" :rows="3" v-model="form.profile"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="form.sort"></el-input>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script>
export default {
  name: "NewManagerMsg",
  data() {
    return {
      visible: false,
      form: {
        name: "",
        job: "",
        profile: "",
        sort: ""
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
