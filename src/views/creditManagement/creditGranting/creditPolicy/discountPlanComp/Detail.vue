<template>
  <Dialog title="方案详情" :visible.sync="visible" onlyClose width="500px" @close="onClose">
    <el-form
      ref="form"
      :model="formData"
      label-width="5em"
      label-position="left"
      class="form"
      style="width: 95%;margin: auto"
    >
      <el-form-item label="方案名称">{{ formData.name }}</el-form-item>
      <el-form-item label="方案描述">{{ formData.remark }}</el-form-item>
      <el-table
        :data="formData.outVos"
        style="width: 100%;margin-bottom: 6px;margin-right: 6px"
        class="table-no-hidden"
      >
        <el-table-column align="center" type="index" width="50" label="序号"></el-table-column>
        <el-table-column align="center" label="付款天数">
          <template slot-scope="scope">{{ scope.row.payDay }}</template>
        </el-table-column>
        <el-table-column align="center" label="折扣率（%）">
          <template slot-scope="scope">{{ scope.row.discountRate }}</template>
        </el-table-column>
      </el-table>
      <el-form-item
        label="有效期限"
      >{{ $dateFormat(formData.applyStartDate, "yyyy-MM-dd") + '至' + $dateFormat(formData.applyEndDate, "yyyy-MM-dd") }}</el-form-item>
    </el-form>
  </Dialog>
</template>

<script type="text/jsx">
import { Api_GetDiscountPlan } from "@/api/creditManagement/creditGranting/customer";

export default {
  name: "Detail",
  data() {
    return {
      visible: false,
      formData: {
        name: "",
        remark: "",
        applyStartDate: "",
        applyEndDate: "",
        outVos: []
      }
    };
  },
  methods: {
    open(row) {
      this.visible = true;
      Api_GetDiscountPlan(row.id)
        .then(res => {
          this.formData = res;
        })
        .catch(res => {
          this.$message.error(res);
        });
    },
    onClose() {
      this.$refs.form.resetFields();
    }
  }
};
</script>

<style scoped>
</style>
