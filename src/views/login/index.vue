<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :append-to-body="true"
    :width="width"
    :before-close="closeDialog"
    id="login-dialog"
  >
    <el-row class="login-container">
      <el-row v-if="loginShowType === 1">
        <LoginPanel ref="loginPanel" :showtype="loginShowType" @showFindPwd="findPwd" />
      </el-row>
      <el-row v-if="loginShowType === 2">
        <FindPwd />
      </el-row>
      <el-row v-if="loginShowType === 3">
        <RegisterPanel ref="register" :key="registerKey" />
      </el-row>
      <el-row class="tips" align="right" style="text-align: center">
        <span style="color: #606266">{{ loginShowType !== 3 ? '还没有账号？' : '已有账号？' }}</span>
        <span @click="loginShowType = 3" v-if="loginShowType !== 3">注册账号</span>
        <span @click="loginShowType = 1" v-if="loginShowType !== 1">返回登录</span>
      </el-row>
    </el-row>
  </el-dialog>
</template>

<script>
import { isMobile } from "@/utils/index";
import LoginPanel from "./Login";
import FindPwd from "./FindPwd";
import RegisterPanel from "./Register";
import router from "@/router/index.js";

export default {
  components: { LoginPanel, FindPwd, RegisterPanel },
  data() {
    return {
      registerKey:0,
      dialogVisible: false,
      loginShowType: 1, //  1：登录 2：找回密码 3：注册
      width: isMobile() ? "90%" : "420px",
      isMobile: isMobile()
    };
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        if (this.$refs.loginPanel) {
          this.$refs.loginPanel.changeCaptcha();
        }
      }
    },
    isMobile(v) {
      if (v) {
        this.width = "90%";
      } else {
        this.width = "420px";
      }
    }
  },
  methods: {
    findPwd: function(type) {
      this.loginShowType = type;
    },
    login() {
      this.dialogVisible = true;
      this.loginShowType = 1;
    },
    register() {
      this.dialogVisible = true;
      this.loginShowType = 3;
    },
    close() {
      this.dialogVisible = false;
      this.loginShowType = 1;
    },
    closeDialog(done) {
      done();
      if (this.$refs.register) {
        this.registerKey++;
        this.$refs.register.resetForm();
      }
      if (this.$refs.loginPanel) {
        this.$refs.loginPanel.resetForm();
      }
      if (window.location.href.indexOf("/creditManagement") !== -1) {
       
        router.push({ path: "/" });
      }
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
.login-container {
  .el-input {
    display: inline-block;
    height: 44px;
    width: 80%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      height: 44px;

      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px #ffffff inset !important;
        -webkit-text-fill-color: #889aa4 !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid #dee2e6;
    background-color: #ffffff;
    border-radius: 5px;
    color: #454545;
    margin-bottom: 15px !important;
  }

  .el-form-item__content {
    border-radius: 3px;
  }
}

#login-dialog {
  .el-dialog__body {
    padding: 20px 40px;
  }

  .el-dialog__header {
    border: none;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$light-blue: #4a9df2;
.login-container {
  height: 100%;
  width: 100%;

  .tips {
    font-size: 14px;
    color: #fff;
    text-align: right;
    margin: 15px 0 15px 0;

    span {
      color: $light-blue;

      &:hover {
        cursor: pointer;
        color: lighten($light-blue, 3%);
      }

      &:last-child {
        margin-left: 10px;
      }
    }
  }
}
</style>
