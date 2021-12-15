<template>
  <Dialog title="等级授信方案" :visible.sync="visible" :onOk="handleSure" width="500px" @close="onClose">
    <el-form ref="form" :model="formData" :rules="formRules" label-width="90px">
      <el-form-item label="信用等级">{{ gradeName }}</el-form-item>
      <el-form-item label="信用额度" prop="creditQuota">
        <el-input v-model="formData.creditQuota" placeholder="请填写信用额度">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="信用账期" prop="accountDays">
        <el-input v-model.number="formData.accountDays" placeholder="请填写信用账期">
          <template slot="append">天</template>
        </el-input>
      </el-form-item>
      <el-form-item label="逾期额度" prop="overdueQuota">
        <el-input v-model="formData.overdueQuota" placeholder="请填写逾期额度">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="逾期天数" prop="overdueDays">
        <el-input v-model.number="formData.overdueDays" placeholder="请填写逾期天数">
          <template slot="append">天</template>
        </el-input>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script>
import { Api_CreditCustomerPlan } from "@/api/creditManagement/creditGranting/customer";

export default {
  name: "Comp2",
  data() {
    return {
      visible: false,
      index: 0,
      id: "",
      gradeName: "",
      formData: {
        // modelGradeHisId: '',
        // gradeName: '',
        creditQuota: "",
        // singleQuota: '',
        overdueQuota: "",
        overdueDays: "",
        accountDays: "",
      },
      formRules: {
        creditQuota: [
          {
            required: true,
            message: "信用额度必填",
          },
          {
            pattern: /^\d{1,9}$|^\d{1,9}\.\d{1,2}$/,
            message: "信用额度必须为整数或小数，且整数部分不超过9位，小数部分不超过2位",
          },
        ],
        // singleQuota: [{
        //     required: true,
        //     message: '单笔限额必填'
        // }, {
        //     pattern: /((^[1-9]\d*)|^0)(\.\d{1,2}){0,1}$/,
        //     message: '单笔限额必须为整数或小数，且整数部分不超过9位，小数部分不超过2位'
        // }, {
        //     validator: this.validatorMoney
        // }],
        overdueQuota: [
          {
            required: true,
            message: "逾期额度必填",
          },
          {
            pattern: /^\d{1,9}$|^\d{1,9}\.\d{1,2}$/,
            message: "逾期额度必须为整数或小数，且整数部分不超过9位，小数部分不超过2位",
          },
        ],
        overdueDays: [
          {
            required: true,
            message: "逾期天数必填",
          },
          {
            type: "number",
            max: 365,
            min: 0,
            message: "请输入0-365之间的数字",
          },
        ],
        accountDays: [
          {
            required: true,
            message: "信用账期必填",
          },
          {
            type: "number",
            max: 365,
            min: 0,
            message: "请输入0-365之间的数字",
          },
        ],
      },
    };
  },
  methods: {
    open(data, index) {
      this.id = data.id;
      this.formData.creditQuota = this.$turnMoney(data.creditQuota, false);
      // this.formData.singleQuota = this.$turnMoney(data.singleQuota, false);
      this.formData.overdueQuota = this.$turnMoney(data.overdueQuota, false);
      this.formData.overdueDays = data.overdueDays;
      this.formData.accountDays = data.accountDays;
      this.gradeName = data.gradeName;
      this.visible = true;
      this.index = index;
    },
    // 验证“应收总额”是否超过
    validatorMoney(rule, value, callback) {
      if (this.formData.creditQuota && Number(value) > Number(this.formData.creditQuota)) {
        callback(new Error("不能超过信用额度"));
        return;
      }
      callback();
    },
    handleSure() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          Api_CreditCustomerPlan(this.id, this.formData)
            .then((res) => {
              this.$message.success(res);
              this.$emit("ok");
              this.visible = false;
            })
            .catch((res) => {
              this.$message.error(res);
            });
        }
      });
    },
    onClose() {
      this.$refs.form.resetFields();
      this.gradeName = "";
    },
  },
};
</script>

<style scoped>
</style>
