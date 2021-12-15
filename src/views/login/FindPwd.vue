<template>
    <el-row>
        <p class="top-title">重置密码</p>
        <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            v-loading="loading"
            class="login-form"
            auto-complete="on"
            label-position="left"
        >
            <el-form-item prop="phoneNo">
                <span class="svg-container">
                    <svg-icon icon-class="phone"/>
                </span>
                <el-input
                    v-model="loginForm.phoneNo"
                    placeholder="请输手机号"
                    name="phoneNo"
                    type="text"
                    auto-complete="on"
                />
            </el-form-item>

            <el-form-item prop="captcha">
                <span class="svg-container">
                    <svg-icon icon-class="password"/>
                </span>
                <el-input
                    v-model="loginForm.captcha"
                    @keyup.enter.native="handleLogin"
                    auto-complete="off"
                    name="captcha"
                    placeholder="验证码"
                    style="width: 60%;"
                />
                <span @click="changeCaptcha" class="change-code">
                    <img :src="codeSrc" alt="验证码" height="100%"/>
                </span>
            </el-form-item>

            <el-form-item prop="code">
                <el-row align="middle" type="flex">
                    <el-col :span="24">
                        <span class="svg-container">
                            <svg-icon icon-class="message"/>
                        </span>
                        <el-input
                            v-model="loginForm.code"
                            placeholder="请输入短信验证码"
                            name="code"
                            type="text"
                            auto-complete="off"
                        />
                    </el-col>
                    <el-button
                        :loading="loading"
                        :disabled="sum < 61"
                        @click.native.prevent="checkPhone"
                        type="primary"
                        size="medium"
                        style="text-align: right; margin-right: 6px;"
                    >
                        {{ sum === 61 ? "获取验证码" : sum + "s后重新获取" }}
                    </el-button>
                </el-row>
            </el-form-item>

            <el-form-item prop="password">
                <span class="svg-container">
                    <svg-icon icon-class="password"/>
                </span>
                <el-input
                    :type="passwordType"
                    v-model="loginForm.password"
                    placeholder="请输入密码"
                    name="password"
                    auto-complete="on"
                    @keyup.enter.native="handleLogin"
                />
                <span class="show-pwd" @click="showPwd">
                    <svg-icon
                        :icon-class="
                            passwordType === 'password' ? 'eye' : 'eye-open'
                        "
                    />
                </span>
            </el-form-item>

            <el-button
                @click.native.prevent="handleSure('loginForm')"
                size="medium"
                style="width:100%;"
                type="primary"
            >
                提交修改
            </el-button>
        </el-form>
    </el-row>
</template>

<script>
    import {getJessionID, getUserStore, setJessionID, setToken, setRefToken} from "@/utils/auth";
    import {MD5, isNull} from "@/utils/commonUtils";
    import {uuid, validPhone} from "@/utils/index";
    import {Api_PhoneExist, Api_Send} from "@/api/baseApi";
    import {Api_SetNewPwd, Api_getKaptcha, Api_forgetPwd} from "@/api/login";
    import CryptoJS from "crypto-js";
    import store from "@/store";

    export default {
        name: "FindPwd",
        data() {
            const createRules = this.$createRules;
            const validPhone = (rule, value, callback) => {
                if (!value) {
                    callback(new Error("手机必填"));
                } else if (!validPhone(value)) {
                    callback(new Error("请输入正确的11位手机号码"));
                } else {
                    callback();
                }
            };
            return {
                content: "",
                loginForm: {},
                loginRules: {
                    userName: [
                        {required: true, trigger: "blur", message: "用户名必填"}
                    ],
                    password: [
                        {required: true, trigger: "blur", message: "密码必填"},
                        {
                            pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])(.{8,20})$/,
                            message: "8-20位，包含字母、数字"
                        }
                    ],
                    phoneNo: [
                        {
                            required: true,
                            trigger: "blur",
                            message: "手机必填"
                        },
                        {
                            pattern: /^1[3456789]\d{9}$/,
                            message: "请输入正确的手机号"
                        }
                    ],
                    code: [
                        {
                            required: true,
                            trigger: "blur",
                            message: "手机验证码必填"
                        }
                    ],
                    captcha: createRules(
                        {msg: "验证码", required: true, max: 4},
                        "blur"
                    )
                },
                passwordType: "password",
                loading: false,
                redirect: undefined,
                randomNum: Math.random(),
                sum: 61,
                timer: "",
                checked: false,
                key: "deskeyfor#90!she"
            };
        },
        computed: {
            randomStr() {
                const UUID = uuid();
                setJessionID(UUID);
                return UUID
            },
            codeSrc() {
                return Api_getKaptcha() + this.randomStr + '?' + this.randomNum
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
            }
        },
        methods: {
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
                        duration: 5 * 1000
                    });
                    return;
                }
                if (isNull(this.loginForm.captcha)) {
                    this.$message({
                        message: "请输入验证码",
                        type: "warning",
                        duration: 5 * 1000
                    });
                    return;
                }
                this.sendMsg();
                // Api_PhoneExist({
                //     phone: this.loginForm.phoneNo,
                //     captcha: this.loginForm.captcha,
                //     jessionID: getJessionID(),
                //     type: "1",
                //     delCaptcha: "1"
                // }).then(data => {
                //     if (data.stateCode === "20119") {
                //         // 手机号不存在
                //         this.$message({
                //             message: "该用户不存在，请检查手机号码是否正确",
                //             type: "error",
                //             duration: 5 * 1000
                //         });
                //     } else if (data.stateCode === "20115") {
                //         // 验证码错误
                //         this.$message({
                //             message: "图形验证码错误，请重新输入!",
                //             type: "error",
                //             duration: 5 * 1000
                //         });
                //         // 清空图形验证码
                //         this.loginForm.captcha = "";
                //         this.changeCaptcha();
                //     } else {
                //         this.sendMsg();
                //     }
                // });
            },
            // 发送短信验证码
            sendMsg() {
                Api_Send({
                    mobile: this.loginForm.phoneNo,
                    sms: '1',
                    code: this.loginForm.captcha,
                    randomStr: this.randomStr,
                    templateType: "3" // 忘记密码
                }).then(res => {
                    // 倒计时60秒后,可以重新发送短信
                    this.sum = 61;
                    this.timer = setInterval(() => {
                        this.sum--;
                        if (this.sum < 1) {
                            this.sum = 61;
                            clearInterval(this.timer);
                        }
                    }, 1000);
                    console.log(res)
                    // const stateCode = res.stateCode;
                    // if (stateCode !== "0") {
                    //     let msg = "";
                    //     switch (stateCode) {
                    //         case "00002":
                    //             msg = "信息发送失败，请重新发送";
                    //             break;
                    //         case "00005":
                    //             msg =
                    //                 "获取短信验证码受限，由于您今日请求次数已达上限，请明日再试";
                    //             break;
                    //         case "20115":
                    //             msg = "验证码错误";
                    //             // 刷新验证码
                    //             this.changeCaptcha();
                    //             // 清空输入的错误验证码
                    //             this.loginForm.captcha = "";
                    //             break;
                    //         default:
                    //             msg = "短信发送失败";
                    //             break;
                    //     }
                    //     this.$message({
                    //         message: msg,
                    //         type: "error",
                    //         duration: 5 * 1000
                    //     });
                    // }
                }).catch(e => {
                    this.$message.error(e)
                });
            },
            // DES 解密 加密
            encryptByDES(message, key) {
                const keyHex = CryptoJS.enc.Utf8.parse(key);
                const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
                    mode: CryptoJS.mode.ECB,
                    padding: CryptoJS.pad.Pkcs7
                });
                return encrypted.toString();
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
                                },3000)
                            }
                        }).catch(e => {
                            this.loading = false;
                            this.$message({
                                message: e,
                                type: "error",
                                duration: 5 * 1000
                            });
                        })
                        // Api_SetNewPwd({
                        //     captcha: this.loginForm.captcha,
                        //     code: this.loginForm.code,
                        //     delCaptcha: "1",
                        //     jessionID: getJessionID(),
                        //     password: MD5(this.loginForm.password),
                        //     userName: this.loginForm.phoneNo
                        // }).then(data => {
                        //     this.loading = false;
                        //     if (data.stateCode !== "30409") {
                        //         // 不成功返回的消息
                        //         let msg;
                        //         switch (data.stateCode) {
                        //             default:
                        //                 msg = "服务器偷懒了~~";
                        //                 break;
                        //             case "30411":
                        //                 msg = "图形验证码错误";
                        //                 break;
                        //             case "30410":
                        //                 msg = "短信验证码错误，请重新输入";
                        //                 break;
                        //             case "30401":
                        //                 msg = "密码为空";
                        //                 break;
                        //             case "00003":
                        //                 msg = "短信验证码超时";
                        //                 break;
                        //             case "30403":
                        //                 msg = "用户ID为空";
                        //                 break;
                        //             case "30407":
                        //                 msg = "用户不存在";
                        //                 break;
                        //         }
                        //         this.$message({
                        //             message: msg,
                        //             type: "error",
                        //             duration: 5 * 1000
                        //         });
                        //     } else {
                        //         this.$message({
                        //             message: "修改成功",
                        //             type: "success",
                        //             duration: 5 * 1000
                        //         });
                        //         window.location.reload();
                        //     }
                        // });
                    }
                });
            }
        }
    };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    $dark_gray: #889aa4;
    $orange: #fd4a37;
    $light-blue: #28abef;
    .top-title {
        font-size: 20px;
        margin: 0;
        font-weight: 500;
        text-align: center;
        color: #303133;
    }

    .login-form {
        width: 100%;
        margin-top: 15px;
        background: rgba(255, 255, 255, 0.6);
    }

    .tips {
        font-size: 14px;
        color: #fff;

        span {
            color: $light-blue;

            &:hover {
                cursor: pointer;
                color: lighten($light-blue, 3%);
            }
        }
    }

    .svg-container {
        padding: 0 5px 0 15px;
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
        text-align: right;
        position: absolute;
        right: 6px;
        top: 4px;
        bottom: 4px;
        font-size: 0;
        line-height: normal;
        cursor: pointer;
        user-select: none;
    }
</style>
