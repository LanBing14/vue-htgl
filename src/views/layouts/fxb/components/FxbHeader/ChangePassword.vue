\<template>
  <el-dialog
    title="密码重置"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="500px"
    :append-to-body="true"
  >
    <el-form
      :model="passwordForm"
      :rules="rules"
      ref="passwordForm"
      label-width="80px"
      class="basic-info-form"
    >
      <el-form-item label="原密码" prop="oldPassword">
        <el-input v-model="passwordForm.oldPassword" type="password" size="medium" placeholder="请输入原密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="passwordForm.newPassword" type="password" size="medium" placeholder="请输入新密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="repeatPassword">
        <el-input v-model="passwordForm.repeatPassword" type="password" size="medium" placeholder="请再次输入新密码"></el-input>
      </el-form-item>
      <div style="text-align: center; margin: 25px 0 15px">
        <el-button
          size="medium"
          type="primary"
          @click="submitForm('passwordForm')"
          :loading="submitLoading"
        >保存</el-button>
        <el-button size="medium" @click="resetForm('passwordForm')">重置</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { Api_ChangePwd } from "@/api/userCenter/baseInfo";
import { getUserInfo } from "@/utils/auth";
import { MD5 } from "@/utils/commonUtils";
import CryptoJS from "crypto-js";

export default {
  name: "ChangePassword",
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.passwordForm.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      key: "deskeyfor#90!she",
      dialogVisible: false,
      submitLoading: false,
      passwordForm: {
        oldPassword: "",
        newPassword: "",
        repeatPassword: "",
      },
      rules: {
        oldPassword: [
          {
            required: true,
            message: "请输入原密码",
            trigger: "blur",
          },
          {
            pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])(.{8,20})$/,
            message: "8-20位，包含字母、数字",
          },
        ],
        newPassword: [
          {
            required: true,
            message: "请输入新密码",
            trigger: "blur",
          },
          {
            pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])(.{8,20})$/,
            message: "8-20位，包含字母、数字",
          },
        ],
        repeatPassword: [
          {
            required: true,
            message: "请输入确认密码",
            trigger: "blur",
          },
          {
            validator: validatePass,
            trigger: "blur",
          },
          {
            pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])(.{8,20})$/,
            message: "8-20位，包含字母、数字",
            // pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{8,20}$/,
            // message: "以字母开头，字母加数字，长度在8-20之间"
          },
        ],
      },
    };
  },
  methods: {
    showClick() {
      this.dialogVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          Api_ChangePwd({
            oldPassword: this.encryptByDES(this.passwordForm.oldPassword),
            newPassword: this.encryptByDES(this.passwordForm.newPassword),
          })
            .then((data) => {
              this.submitLoading = false;
              this.$message.success(data);
              window.location.reload();
              // if (data.stateCode === "30405") {
              //     this.$message({
              //         message: "原始密码不正确",
              //         type: "error",
              //         duration: 5 * 1000
              //     });
              // } else if (data.stateCode === "1") {
              //     this.$message({
              //         message: "修改成功",
              //         type: "success",
              //         duration: 5 * 1000
              //     });
              //     window.location.reload();
              // }
            })
            .catch((res) => {
              this.submitLoading = false;
              this.$message.error(res);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // DES 解密 加密
    encryptByDES(message) {
      const keyHex = CryptoJS.enc.Utf8.parse(this.key);
      const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      });
      return encrypted.toString();
    },
  },
};
</script>
<style lang="scss">
    .basic-info-form {
        .el-form-item{
            margin-bottom: 25px;
        }
    }
</style>
<style lang="scss" scoped>
.basic-info-form {
  margin: 0 auto;
  width: 420px;
}
</style>
