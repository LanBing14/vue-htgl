<template>
  <Dialog
    ref="drawer"
    :title="pageStatus==='add'?'新增联络信息':'编辑联络信息'"
    :visible.sync="visible"
    :btns="drawerBtns"
    :close="closeDialog"
    width="500px"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="联系人姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入联系人姓名" :maxlength="10"></el-input>
      </el-form-item>
      <el-form-item label="部门" prop="deptName">
        <el-input v-model="form.deptName" placeholder="请输入部门" :maxlength="10"></el-input>
      </el-form-item>
      <el-form-item label="职务" prop="job">
        <el-input v-model="form.job" placeholder="请输入职务" :maxlength="10"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号码"></el-input>
      </el-form-item>
      <el-form-item label="办公电话" prop="officePhone">
        <el-input v-model="form.officePhone" placeholder="请输入办公电话"></el-input>
      </el-form-item>
      <el-form-item label="电子邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入电子邮箱"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input v-model="form.remarks" type="textarea" :rows="3" placeholder="请输入备注" :maxlength="200"></el-input>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script>
import {
  Api_saveContacts,
  Api_editContacts,
} from "@/api/creditManagement/customerProfile/customerManagemCustomer/OtherInformation.js";

export default {
  name: "NewContacts",
  data() {
    return {
      pageStatus: "",
      rowData: {},
      visible: false,
      form: {
        companyId: "",
        name: "",
        deptName: "",
        job: "",
        phone: "",
        officePhone: "",
        email: "",
        remarks: "",
      },
      rules: {
        name: [{ required: true, message: "请输入联系人姓名" }],
        deptName: [{ required: true, message: "请输入部门" }],
        job: [{ required: true, message: "请输入职务" }],
      },
      drawerBtns: [
        {
          text: "确定",
          type: "primary",
          click: () => {
            if (this.pageStatus === "add") {
              const loading = this.$openLoading();
              Api_saveContacts(this.form)
                .then(() => {
                  loading.close();
                  this.$message.success("提交成功！");
                  this.visible = false;
                  this.$emit("getList1");
                })
                .catch((res) => {
                  loading.close();
                  this.$message.error(res);
                });
            } else if (this.pageStatus === "edit") {
              const loading = this.$openLoading();
              Api_editContacts(this.rowData.id, this.form)
                .then(() => {
                  loading.close();
                  this.$message.success("编辑成功！");
                  this.visible = false;
                  this.$emit("getList1");
                })
                .catch((res) => {
                  loading.close();
                  this.$message.error(res);
                });
            }
          },
        },
        {
          text: "取消",
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
            name: "",
            deptName: "",
            job: "",
            phone: "",
            officePhone: "",
            email: "",
            remarks: "",
          });
        _pageStatus === "edit" &&
          (this.form = {
            companyId: _cID,
            name: _rowData.name,
            deptName: _rowData.deptName,
            job: _rowData.job,
            phone: _rowData.phone,
            officePhone: _rowData.officePhone,
            email: _rowData.email,
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
