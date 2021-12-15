<template>
  <Dialog
    ref="drawer"
    title="新增生产、经营场所"
    :visible.sync="visible"
    :btns="drawerBtns"
    :close="closeDialog"
    width="500px"
  >
    <el-form ref="form" :model="form" label-width="50px" style="padding: 0 16px">
      <el-form-item label="类别" prop="type">
        <el-select v-model="form.type" style="width: 100%">
          <el-option
            :label="item.label"
            :value="item.value"
            :key="item.value"
            v-for="item in typeOptions"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="总计" prop="total">
        <el-input v-model="form.total"></el-input>
      </el-form-item>
      <el-form-item label="自有" prop="own">
        <el-input v-model="form.own"></el-input>
      </el-form-item>
      <el-form-item label="按揭" prop="mortgage">
        <el-input v-model="form.mortgage"></el-input>
      </el-form-item>
      <el-form-item label="租赁" prop="rent">
        <el-input v-model="form.rent"></el-input>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script>
export default {
  name: "NewProductionStatus",
  data() {
    return {
      visible: false,
      form: {
        type: undefined,
        total: undefined,
        own: undefined,
        mortgage: undefined,
        rent: undefined
      },
      typeOptions: [
        { label: "企业占地面积(平方米)", value: "1" },
        { label: "办公用房面积(平方米)", value: "2" },
        { label: "房产原值或年租金(万元)", value: "3" }
      ],
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
