<template>
  <Dialog
    ref="drawer"
    title="请选择企业分组"
    :visible.sync="visible"
    :onOk="handleSure"
    width="500px"
    @close="onClose"
  >
    <el-form ref="form" v-loading="loading" :model="form" label-width="90px">
      <el-form-item prop="groupIds" label-width="20px" :rules="$createRules({required:true,msg:'企业分组'})">
        <el-checkbox-group v-model="form.groupIds">
          <el-checkbox v-for="(el, index) in groupOptions" :key="index" :label="el.id">{{el.group_name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script>
import {
  Api_GetCustomerGroup,
  Api_SaveCustomerId
} from "@/api/creditManagement/customerProfile/customerManagement.js";

export default {
  name: "QuickAddCustomer",
  data() {
    return {
      visible: false,
      coInfo: {},
      form: { groupIds: [] },
      loading: false,
      groupOptions: []
    };
  },
  methods: {
    open(_coInfo) {
      this.coInfo = _coInfo;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["form"].resetFields();
      });
      this.loading = true;
      Api_GetCustomerGroup()
        .then(res => {
          this.loading = false;
          this.groupOptions = res.filter(i => i.group_name !== "未分组");
        })
        .catch(res => {
          this.loading = false;
        });
    },
    onClose() {
      this.visible = false;
    },
    handleSure() {
      const loading = this.$openLoading();
      Api_SaveCustomerId({
        ...this.coInfo,
        groupIds: this.form.groupIds.join(","),
        isBloc: false,
        isFxb: true,
        isTb: 1,
        pid: ""
      })
        .then(res => {
          loading.close();
          this.$message.success("加入客户成功");
          this.$emit("loadCompany");
          this.visible = false;
        })
        .catch(res => {
          loading.close();
          this.$message.error(res);
        });
    }
  }
};
</script>

<style>
</style>