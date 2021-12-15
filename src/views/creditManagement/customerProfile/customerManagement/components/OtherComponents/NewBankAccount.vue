<template>
  <Dialog
    ref="drawer"
    :title="pageStatus==='add'?'新增银行账户':'编辑银行账户'"
    :visible.sync="visible"
    :btns="drawerBtns"
    :close="closeDialog"
    width="500px"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="开户银行" prop="bankName">
        <el-input v-model="form.bankName" placeholder="请输入开户银行" :maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="银行账户" prop="bankAccount">
        <el-input v-model="form.bankAccount" placeholder="请输入银行账户" :maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="电话号码" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入电话号码"></el-input>
      </el-form-item>
      <el-form-item label="单位地址" prop="unitAddress">
        <el-input v-model="form.unitAddress" placeholder="请输入单位地址" :maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input v-model="form.remarks" type="textarea" :rows="3" placeholder="请输入备注" :maxlength="200"></el-input>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script>
import {
  Api_saveBankAccount,
  Api_editBankAccount,
} from "@/api/creditManagement/customerProfile/customerManagemCustomer/OtherInformation.js";

export default {
  name: "NewBankAccount",
  data() {
    return {
      pageStatus: "",
      rowData: {},
      form: {
        companyId: "",
        bankName: "",
        bankAccount: "",
        phone: "",
        unitAddress: "",
        remarks: "",
      },
      rules: {
        bankName: [{ required: true, message: "请输入开户银行" }],
        bankAccount: [{ required: true, message: "请输入银行账户" }],
      },
      visible: false,
      drawerBtns: [
        {
          text: "确定",
          type: "primary",
          click: () => {
            if (this.pageStatus === "add") {
              const loading = this.$openLoading();
              Api_saveBankAccount(this.form)
                .then(() => {
                  loading.close();
                  this.$message.success("提交成功！");
                  this.visible = false;
                  this.$emit("getList2");
                })
                .catch((res) => {
                  loading.close();
                  this.$message.error(res);
                });
            } else if (this.pageStatus === "edit") {
              const loading = this.$openLoading();
              Api_editBankAccount(this.rowData.id, this.form)
                .then(() => {
                  loading.close();
                  this.$message.success("编辑成功！");
                  this.visible = false;
                  this.$emit("getList2");
                })
                .catch((res) => {
                  loading.close();
                  this.$message.error(res);
                });
            }
          },
        },
        {
          text: "返回",
          click: () => {
            this.visible = false;
          },
        },
      ],
    };
  },
  methods: {
    open(_pageStatus, _cID, _rowData) {
      this.visible = true;
      this.$nextTick(() => {
        this.$refs.form.resetFields();
        this.pageStatus = _pageStatus;
        _pageStatus === "edit" && (this.rowData = _rowData);
        _pageStatus === "add" &&
          (this.form = {
            companyId: _cID,
            bankName: "",
            bankAccount: "",
            phone: "",
            unitAddress: "",
            remarks: "",
          });
        _pageStatus === "edit" &&
          (this.form = {
            companyId: _cID,
            bankName: _rowData.bankName,
            bankAccount: _rowData.bankAccount,
            phone: _rowData.phone,
            unitAddress: _rowData.unitAddress,
            remarks: _rowData.remarks,
          });
      });
    },
    closeDialog() {
      this.visible = false;
    },
  },
};
</script>

<style>
</style>
