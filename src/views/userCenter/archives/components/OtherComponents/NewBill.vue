<template>
  <Dialog
    ref="drawer"
    :title="pageStatus==='add'?'新增发票抬头':'编辑发票抬头'"
    :visible.sync="visible"
    :onOk="onOk"
    @close="closeDialog"
    width="500px"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="发票抬头" prop="invoice">
        <el-input v-model="form.invoice" placeholder="请输入发票抬头" :maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="税号" prop="taxId">
        <el-input v-model="form.taxId" placeholder="请输入统一社会信用代码" :maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="开户银行" prop="bankName">
        <el-input v-model="form.bankName" placeholder="请输入开户银行"></el-input>
      </el-form-item>
      <el-form-item label="银行账户" prop="bankAccount">
        <el-input v-model="form.bankAccount" placeholder="请输入银行账户" :maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="单位地址" prop="unitAddress">
        <el-input v-model="form.unitAddress" placeholder="请输入单位地址" :maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="电话号码" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入电话号码" :maxlength="50"></el-input>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script>
import {
  Api_InvoiceAdd,
  Api_InvoiceUpdate,
} from "@/api/creditManagement/customerProfile/customerManagemCustomer/OtherInformation.js";

export default {
  name: "NewBill",
  data() {
    const createRules = this.$createRules;
    return {
      pageStatus: "",
      rowData: {},
      form: {
        companyId: "", // 	企业id
        companyName: "", // 企业名称
        invoice: "", // 发票抬头
        taxId: "", // 税号
        bankName: "", // 开户银行
        unitAddress: "", // 单位地址
        bankAccount: "", // 银行账户
        phone: "", // 电话号码
      },
      rules: {
        invoice: createRules({
          msg: "发票抬头",
          required: true,
          max: 50,
        }),
        taxId: createRules({
          msg: "税号",
          required: true,
          max: 20,
        }),
        bankName: createRules({
          msg: "开户银行",
          required: true,
          max: 30,
        }),
        bankAccount: createRules({
          msg: "银行账户",
          required: true,
          max: 20,
          cipint1: true,
        }),
        phone: createRules({
          msg: "电话号码",
          max: 20,
          phone: true,
        }),
        unitAddress: createRules({
          msg: "单位地址",
          max: 50,
        }),
      },
      visible: false,
      dataId: "", // 编辑时才有
    };
  },
  methods: {
    open(_pageStatus, companyId, companyName, _rowData) {
      this.visible = true;
      this.$nextTick(() => {
        this.$refs.form.resetFields();
        this.pageStatus = _pageStatus;
        if (_pageStatus === "edit") {
          this.form.invoice = _rowData.invoice;
          this.form.taxId = _rowData.taxId;
          this.form.bankName = _rowData.bankName;
          this.form.unitAddress = _rowData.unitAddress;
          this.form.bankAccount = _rowData.bankAccount;
          this.form.phone = _rowData.phone;
          this.dataId = _rowData.id;
        } else {
          this.dataId = "";
        }
        this.form.companyId = companyId;
        this.form.companyName = companyName;
      });
    },
    onOk() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const postData = this.form;
          const loading = this.$openLoading();
          const promiseRes =
            this.pageStatus === "add" ? Api_InvoiceAdd(postData) : Api_InvoiceUpdate(this.dataId, postData);
          promiseRes
            .then((res) => {
              loading.close();
              this.$message.success(res);
              this.visible = false;
              this.closeDialog();
              this.$emit("getList");
            })
            .catch((e) => {
              loading.close();
              this.$message.error(e);
            });
        }
      });
    },
    closeDialog() {
      this.$refs.form.resetFields();
    },
  },
};
</script>

<style>
</style>
