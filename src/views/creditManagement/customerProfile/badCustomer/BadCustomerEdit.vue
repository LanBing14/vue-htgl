<template>
  <Dialog ref="drawer" title="处理办法变更" class="size-btn-change" :visible.sync="visible" :onOk="handleEdit" width="500px">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="客户编码" prop="customer_no">{{ customerNo }}</el-form-item>
      <el-form-item label="客户名称" prop="customerName">{{ companyName }}</el-form-item>
      <el-form-item label="处理办法">
        <el-checkbox-group v-model="form.isCredit">
          <el-checkbox label="true">停止赊销</el-checkbox>
        </el-checkbox-group>
        <el-checkbox-group v-model="form.isSend">
          <el-checkbox label="true">停止发货</el-checkbox>
        </el-checkbox-group>
        <el-checkbox-group v-model="form.isWork">
          <el-checkbox label="true">停止签约</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="变更原因" prop="remark">
        <el-input v-model="form.remark" type="textarea" placeholder="请输入处理办法变更原因，不超过200字" />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script>
import {
  Api_GetCustomerDetail,
  Api_GetCustomerEdit,
} from "@/api/creditManagement/customerProfile/customerBad.js";

export default {
  name: "BadCustomerEdit",
  data() {
    return {
      visible: false,
      id: "",
      customerNo: "",
      companyName: "",
      form: {
        isCredit: "",
        isSend: "",
        isWork: "",
        remark: "",
      },
      rules: {
        remark: [
          {
            required: true,
            message: "请输入详细处理措施描述,不超过200字",
            max: 200,
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    open(row) {
      this.form = {
        isCredit: "",
        isSend: "",
        isWork: "",
        remark: "",
      };
      this.id = row.id;
      this.customerNo = row.customerNo;
      this.companyName = row.companyName;
      this.visible = true;
      Api_GetCustomerDetail(this.id)
        .then((res) => {
          this.form.isCredit = res.isCredit;
          this.form.isSend = res.isSend;
          this.form.isWork = res.isWork;
          this.form.remark = res.remark;
        })
        .catch((res) => {
          console.log(res);
        });
    },
    handleEdit() {
      if (this.form.isCredit === true || this.form.isSend === true || this.form.isWork === true) {
        const loading = this.$openLoading();
        Api_GetCustomerEdit(this.id, this.form)
          .then((res) => {
            this.$message.success({
              dangerouslyUseHTMLString: true,
              message: res,
            });
            loading.close();
            this.visible = false;
            this.$emit("getList");
          })
          .catch((res) => {
            this.$message({
              message: res,
              type: "warning",
            });
          });
      } else {
        this.$message({
          message: "请选择处理办法",
          type: "warning",
        });
        return;
      }
    },
    closeDialog() {
      this.visible = false;
    },
  },
};
</script>

<style scoped>
</style>
