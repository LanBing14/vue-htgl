<template>
  <el-row class="logo-bg-wrapper">
    <div class="logo-bg-title">
      <img src="../../assets/enterprise-images/login/login-logo.png" alt="">
      <span class="logo-1">至信云创</span>
      <span class="logo-2">|</span>
      <span class="logo-3">企业中心平台</span>
    </div>
    <div class="content-title-left">
      <p class="title-1">企业服务平台，服务零距离</p>
      <p class="title-2">相伴企业成长，促进更好更快发展</p>
    </div>
    <div class="right-content login-container">

      <!-- 登录注册 -->
      <div class="right-content-item" v-if="!resetPassword">
        <el-tabs v-model="loginType" class="login-tabs" @tab-click="handleClick">
          <!-- <el-tab-pane label="密码登录" name="1">
            <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on"
              label-position="left">
              <el-form-item prop="userName">
                <span class="svg-container">
                  <svg-icon icon-class="user" />
                </span>
                <el-input v-model="loginForm.userName" placeholder="输入手机号码/用户名" name="userName" type="text"
                  auto-complete="off" />
              </el-form-item>

              <el-form-item prop="password">
                <span class="svg-container">
                  <svg-icon icon-class="password" />
                </span>
                <el-input v-model="loginForm.password" :type="passwordType" placeholder="请输入登录密码" name="password"
                  auto-complete="off" @keyup.enter.native="handleLogin" />
                <span class="show-pwd" @click="showPwd">
                  <svg-icon :icon-class="
                          passwordType === 'password'
                              ? 'eye'
                              : 'eye-open'
                      " />
                </span>
              </el-form-item>

              <el-form-item prop="captcha">
                <span class="svg-container">
                  <svg-icon icon-class="VerificationCode" style="transform: scale(1.3);" />
                </span>
                <el-input v-model="loginForm.captcha" @keyup.enter.native="handleLogin" auto-complete="off"
                  name="captcha" placeholder="请输入图形验证码" />
                <span @click="changeCaptcha" class="change-code">
                  <img :src="codeSrc" alt="验证码" height="100%" />
                </span>
              </el-form-item>
            </el-form>
          </el-tab-pane> -->
          <el-tab-pane label="短信验证" name="2">
            <el-form ref="msgLoginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on"
              label-position="left">
              <el-form-item prop="phoneNo">
                <span class="svg-container">
                  <svg-icon icon-class="phone" />
                </span>
                <el-input v-model="loginForm.phoneNo" placeholder="请输入11位手机号码" name="phoneNo" type="text"
                  auto-complete="on" />
              </el-form-item>
              <el-form-item prop="captcha">
                <span class="svg-container">
                  <svg-icon icon-class="VerificationCode" style="transform: scale(1.3);" />
                </span>
                <el-input v-model="loginForm.captcha" @keyup.enter.native="handleLogin" auto-complete="off"
                  name="captcha" placeholder="请输入图形验证码" />
                <span @click="changeCaptcha" class="change-code">
                  <img :src="codeSrc" alt="验证码" height="100%" />
                </span>
              </el-form-item>

              <el-form-item prop="code">
                <el-row align="middle" type="flex">
                  <el-col :span="24">
                    <span class="svg-container">
                      <svg-icon icon-class="message" />
                    </span>
                    <el-input v-model="loginForm.code" placeholder="请输入6位短信验证码" name="code" type="text"
                      auto-complete="on" />
                  </el-col>
                  <el-button :loading="loading" :disabled="sum < 61" @click.native.prevent="checkPhone" type="primary"
                    size="medium" style="text-align: right; margin-right: 6px; padding: 10px;position: absolute;
                      right: 0;">
                    {{
                    sum === 61
                    ? "获取验证码"
                    : sum + "s后重新获取"
                    }}
                  </el-button>
                </el-row>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <!-- <el-row :span="24" align="middle" class="tips" justify="space-between" type="flex">
          <span :span="12">
          </span>
          <span :span="6" align="right" @click="findPassword" style="font-size: 12px;">忘记密码</span>
        </el-row> -->
        <el-button :loading="loginLoading" @click.native.prevent="handleLogin" size="medium" style="width:100%;"
          type="primary">登录</el-button>
        <!-- <el-row :span="24" class="tips" justify="space-between" type="flex">
          <p style="margin: 10px auto 0;font-size: 12px;" @click="goRegister">
            <span style="color: #606266;">还没有账号？</span>
            <span>注册账号</span>
          </p>
        </el-row> -->
        <el-row :span="24"  justify="space-between" type="flex">
          <p style="margin: 15px auto 0;font-size: 14px;color: #606266;" >
             其他登录方式
          </p>
        </el-row>
        <el-row :span="24"  justify="space-between" type="flex">
          <div @click="otherLogin" style="margin: 10px auto;">
            <img src="../../assets/images/weixin.png" alt="" style="width: 32px;height:
            32px">
          </div>
        </el-row>
      </div>


      <!-- 重置密码 -->
      <div class="right-content-item" v-if="resetPassword">
        <p class="top-title">重置密码</p>
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" v-loading="loading" class="login-form"
          auto-complete="on" label-position="left">
          <el-form-item prop="phoneNo">
            <span class="svg-container">
              <svg-icon icon-class="phone" />
            </span>
            <el-input v-model="loginForm.phoneNo" placeholder="请输手机号" name="phoneNo" type="text" auto-complete="on" />
          </el-form-item>

          <el-form-item prop="captcha">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input v-model="loginForm.captcha" @keyup.enter.native="handleLogin" auto-complete="off" name="captcha"
              placeholder="验证码" style="width: 60%;" />
            <span @click="changeCaptcha" class="change-code">
              <img :src="codeSrc" alt="验证码" height="100%" />
            </span>
          </el-form-item>

          <el-form-item prop="code">
            <el-row align="middle" type="flex">
              <el-col :span="24">
                <span class="svg-container">
                  <svg-icon icon-class="message" />
                </span>
                <el-input style="width: 70%;" v-model="loginForm.code" placeholder="请输入短信验证码" name="code" type="text"
                  auto-complete="off" />
              </el-col>
              <el-button :loading="loading" :disabled="sum < 61" @click.native.prevent="checkPhone" type="primary"
                size="medium" style="text-align: right; margin-right: 6px;">
                {{ sum === 61 ? "获取验证码" : sum + "s后重新获取" }}
              </el-button>
            </el-row>
          </el-form-item>

          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input :type="passwordType" v-model="loginForm.password" placeholder="请输入密码" name="password"
              auto-complete="on" @keyup.enter.native="handleLogin" />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="
                            passwordType === 'password' ? 'eye' : 'eye-open'
                        " />
            </span>
          </el-form-item>

          <el-button @click.native.prevent="handleSure('loginForm')" size="medium" style="width:100%;" type="primary">
            提交修改
          </el-button>

          <el-row :span="24" class="tips" justify="space-between" type="flex">
            <p style="margin: 10px auto;font-size: 12px;" @click="returnLogin">
              <span style="color: #606266;">还没有账号？</span>
              <span>返回登录</span>
            </p>
          </el-row>
        </el-form>
      </div>
    </div>
  </el-row>
</template>

<script>
  import Wxlogin from "./wxlogin";
  import { Api_wxloginoauth2 } from "@/api/wxlogin";
  import { getJessionID, getUserStore, setJessionID, setToken, setRefToken } from "@/utils/auth";
  import { uuid, validPhone } from "@/utils/index";
  import { Api_PhoneExist, Api_Send2, Api_Send } from "@/api/baseApi";
  import store from "@/store";
  import router from "@/router";
  import { Api_getKaptcha, Api_LoginByUsername, Api_LoginByMsg,  Api_forgetPwd } from "@/api/login";
  import CryptoJS from "crypto-js";

  export default {
    components: { Wxlogin },
    name: "Login",
    props: {
      showtype: Number,
    },
    data() {
      const createRules = this.$createRules;
      return {
        // 二维码
        visibleErweima: false,
        disabled: true,
        // 重置密码
        resetPassword: false,
        tableTabs: [
          { name: "2", title: "短信登录" },
          { name: "1", title: "密码登录" },
        ],
        content: "",
        loginType: "2", // 登录类型 1：正常登录 2：短信登录
        loginForm: {
          userName: "",
          password: "",
          captcha: "",
          phoneNo: "",
          code: "",
        },
        loginRules: {
          userName: [{ required: true, trigger: "change", message: "用户名必填" }],
          phoneNo: [
            {
              required: true,
              trigger: "change",
              message: "手机必填",
            },
            {
              pattern: /^1[3456789]\d{9}$/,
              message: "请输入正确的手机号",
            },
          ],
          password: [{ required: true, trigger: "change", message: "密码必填" }],
          code: [
            {
              required: true,
              trigger: "change",
              message: "手机验证码必填",
            },
          ],
          captcha: createRules({ masgKey: "验证码", required: true, max: 4 }, "change"),
        },
        msgLoginRules: {
          phoneNo: [
            {
              required: true,
              trigger: "change",
              message: "手机必填",
            },
            {
              pattern: /^1[3456789]\d{9}$/,
              message: "请输入正确的手机号",
            },
          ],
          code: [
            {
              required: true,
              trigger: "change",
              message: "手机验证码必填",
            },
          ],
          captcha: createRules({ masgKey: "验证码", required: true, max: 4 }, "change"),
        },
        passwordType: "password",
        loading: false,
        redirect: undefined,
        randomNum: Math.random(),
        sum: 61,
        timer: "",
        checked: false,
        // 登录加载
        loginLoading: false,
        key: "deskeyfor#90!she",
      };
    },
    computed: {
      randomStr() {
        const UUID = uuid();
        setJessionID(UUID);
        return UUID;
      },
      codeSrc() {
        return Api_getKaptcha() + this.randomStr + "?" + this.randomNum;
        // const userStore = getUserStore();
        // const user = store.state.user;
        // if (userStore.jessionID) {
        //     return `${user.codeUrl +
        //         userStore.jessionID +
        //         "&" +
        //         this.randomNum}`;
        // } else {
        //     const UUID = uuid();
        //     setJessionID(UUID);
        //     return `${user.codeUrl + UUID + "&" + this.randomNum}`;
        // }
      },
    },
    mounted() {
      this.disabled = false;
    },
    methods: {
      otherLogin(){
        Api_wxloginoauth2().then(res=>{
           window.location.href = res
        })
      },
      returnLogin() {
        this.resetPassword = false
      },
      goRegister() {
        this.$router.push('/register')
      },
      handleClick() {
        // this.changeCaptcha();
        // this.$refs["loginForm"].resetFields();
        // this.$refs["msgLoginForm"].resetFields();
      },
      // 密码显隐
      showPwd() {
        if (this.passwordType === "password") {
          this.passwordType = "";
        } else {
          this.passwordType = "password";
        }
      },
      // 验证码
      changeCaptcha() {
        this.randomNum = Math.random();
      },
      // 验证手机
      checkPhone() {
        if (!validPhone(this.loginForm.phoneNo)) {
          this.$message({
            message: "请输入正确的11位手机号码",
            type: "warning",
            duration: 5 * 1000,
          });
          return;
        }
        if (this.loginForm.captcha === "") {
          this.$message({
            message: "请输入图形验证码",
            type: "warning",
            duration: 5 * 1000,
          });
          return;
        }
        Api_Send({
          templateType: "1", // 登录
          mobile: this.loginForm.phoneNo,
          randomStr: this.randomStr,
          sms: "1",
          code: this.loginForm.captcha,
        })
          .then((data) => {
            console.log(data);
            this.sendMsg();
          })
          .catch((e) => {
            this.$message.error(e);
          });
      },
      // 发送短信验证码
      sendMsg() {
        // 倒计时60秒后,可以重新发送短信
        this.sum = 61;
        this.timer = setInterval(() => {
          this.sum--;
          if (this.sum < 1) {
            this.sum = 61;
            clearInterval(this.timer);
          }
        }, 1000);
      },
      // DES 解密 加密
      encryptByDES(message, key) {
        const keyHex = CryptoJS.enc.Utf8.parse(key);
        const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7,
        });
        return encrypted.toString();
      },
      // 登录
      handleLogin() {
        if (this.loginLoading) {
          return;
        }
        const dataForm = this.loginType === "1" ? "loginForm" : "msgLoginForm";
        this.$refs[dataForm].validate((valid) => {
          if (valid) {
            this.loginLoading = true;
            const loginPromise =
              this.loginType === "1"
                ? Api_LoginByUsername({
                  username: this.loginForm.userName,
                  password: this.encryptByDES(this.loginForm.password, this.key),
                  randomStr: this.randomStr,
                  code: this.loginForm.captcha,
                  roleType: "1",
                  grant_type: "password",
                  "remember-me": this.checked,
                })
                : Api_LoginByMsg({
                  mobile: this.loginForm.phoneNo,
                  smsCode: this.loginForm.code,
                  randomStr: this.randomStr,
                  code: this.loginForm.captcha,
                  roleType: "1",
                  grant_type: "custom_mobile_sms",
                  "remember-me": this.checked,
                });
            loginPromise
              .then(({ expires_in, refresh_token, access_token }) => {
                store.commit("SAVE_refresh_token", refresh_token);
                /*if (expires_in < 43199) {
                  Api_LoginByUsername({
                    grant_type: "refresh_token",
                    refresh_token
                  }).then(({ access_token }) => {
                    this.loginSuccess(access_token);
                  });
                } else {

                }*/
                this.loginSuccess(access_token, refresh_token);
              })
              .catch((e) => {
                this.changeCaptcha();
                this.resetForm();
                this.loginLoading = false;
                this.$message({
                  message: e,
                  type: "error",
                  duration: 5 * 1000,
                });
              });
          }
        });
      },
      findPassword() {
        this.resetPassword = true
      },
      loginSuccess(access_token, refresh_token) {
        this.loginLoading = false;
        this.resetForm();
        this.changeCaptcha();
        setToken(access_token);
        setRefToken(refresh_token);
        store.dispatch("GetUserInfo");
        this.$router.replace('/front/workportal/notice')
        this.$message({
          message: "登录成功",
          type: "success",
          duration: 1000,
        });

      },
      resetForm() {
        if (this.$refs.loginForm) {
          this.$refs.loginForm.resetFields();
        }
        if (this.$refs.msgLoginForm) {
          this.$refs.msgLoginForm.resetFields();
        }
      },
      // 确认
      handleSure(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.loading = true;
            Api_forgetPwd({
              mobile: this.loginForm.phoneNo,
              smsCode: this.loginForm.code,
              randomStr: this.randomStr,
              code: this.loginForm.captcha,
              password: this.encryptByDES(this.loginForm.password, this.key)
            }).then(data => {
              if (data) {
                this.loading = false;
                setToken(data.access_token);
                setRefToken(data.refresh_token);
                this.$message({
                  message: "修改成功",
                  type: "success",
                  duration: 5 * 1000
                });
                setTimeout(() => {
                  window.location.reload();
                }, 3000)
              }
            }).catch(e => {
              this.loading = false;
              this.$message({
                message: e,
                type: "error",
                duration: 5 * 1000
              });
            })
          }
        });
      }

    },
  };
</script>

<style scoped>
  .erweimaModel {
    height: 300px;
  }
  .right-content {
    width: 20%;
    position: absolute;
    right: 6%;
    top: 50%;
    transform: translateY(-50%);
  }
</style>
<style rel="stylesheet/scss" lang="scss">
  .el-row {
    height: 100%;
  }

  .el-scrollbar__wrap {
    height: 100%;
  }

  .top-title {
    font-size: 20px;
    margin: 0;
    font-weight: 500;
    text-align: center;
    color: #303133;
  }





  .el-tabs__content {
    padding-bottom: 15px !important;
  }

  .login-tabs {
    .el-tabs__nav-wrap::after {
      content: none;
    }

    .el-tabs__nav-scroll {
      width: 100px;
      margin: 0 auto;
      text-align: center;
    }


    .el-tabs__active-bar {
      height: 4px;
    }

    .el-tabs__item {
      font-size: 20px;
      padding: 0 30px;
    }

    .el-tabs__nav-prev,
    .el-tabs__nav-next {
      display: none;
    }
  }
</style>

<style lang="scss" scoped>
  $dark_gray: #889aa4;
  $orange: #fd4a37;
  $light-blue: #4b9df3;

  .el-scrollbar__view {
    height: 100%;

    .logo-bg-wrapper {
      flex: 1;
      overflow: hidden;
      height: 100%;
      background: url(../../assets/enterprise-images/login/login_bg.jpg) no-repeat;
      background-size: 100% 100%;
    }
  }

  .content-title-left {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    position: absolute;
    left: 10%;

    p.title-1 {
      font-size: 52px;
      line-height: 95px;
      letter-spacing: 3px;
      color: #fff;
    }

    p.title-2 {
      font-size: 24px;
      line-height: 47px;
      color: #fff;
    }
  }

  .logo-bg-title {
    position: absolute;
    left: 6%;
    top: 7%;
    color: #fff;

    img {
      margin-top: -20px;
    }

    .logo-1 {
      font-size: 36px;
      margin-left: 10px;
    }

    .logo-2 {
      width: 2px;
      height: 25px;
      background-color: #ffffff;
      margin: 0 25px;
    }

    .logo-3 {
      font-size: 18px;
    }
  }

  .login-container {
    .tips {
      font-size: 14px;
      color: #fff;
      text-align: right;
      margin: 0 0 15px 0;

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

  .login-form {
    width: 100%;
    margin: 0 auto;
    margin-top: 15px;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin: 0 0 15px 0;

    span {
      color: #4a9df2;

      &:hover {
        cursor: pointer;
        color: lighten(#4a9df2, 3%);
      }
    }
  }

  .svg-container {
    padding-left: 17px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $orange;
      margin: 0 auto 40px auto;
      text-align: center;
      font-weight: normal;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .change-code {
    position: absolute;
    right: 6px;
    top: 4px;
    bottom: 4px;
    font-size: 0;
    text-align: right;
    line-height: normal;
    cursor: pointer;
    user-select: none;
  }

  /deep/ .el-select {
    .el-input {
      width: 100%;

      input {
        color: #889aa4 !important;
      }
    }
  }

  /deep/ .el-input__inner {
    padding-left: 55px;
    height: 50px;
    line-height: 50px;
  }




</style>
