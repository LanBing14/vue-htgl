<template>
    <div class="xinyi-online-author">
        <p class="marT30 marB30 fxb-999 taCenter">
            授权仅用于本次填报相关数据的借贷评估，在无授权情况下我们将严格保护您的数据安全
        </p>
        <el-form
            class="form-step two"
            ref="authForm"
            :model="authForm"
            :rules="authRules"
            label-width="150px"
            v-loading="formLoading"
        >
            <el-form-item label="企业名称" prop="companyName">
                <el-input v-model="authForm.companyName" disabled></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="linkMan">
                <el-input v-model="authForm.linkMan" disabled></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="phoneNo">
                <el-input
                    v-model="authForm.phoneNo"
                    name="phoneNo"
                    disabled
                ></el-input>
            </el-form-item>
            <el-form-item label="授权验证码" prop="messageCode">
                <el-row align="middle" type="flex">
                    <el-col :span="15">
                        <el-input
                            v-model="authForm.messageCode"
                            placeholder="请输入授权验证码"
                            name="messageCode"
                            type="text"
                            auto-complete="on"
                        />
                    </el-col>
                    <el-col :span="6" :offset="1">
                        <el-button
                            :loading="loading"
                            :disabled="sum < 61"
                            @click.native.prevent="sendMsg"
                            type="primary"
                            size="small"
                            style="text-align: right; margin-right: 6px;"
                        >
                            {{
                                sum === 61 ? "获取验证码" : sum + "s后重新获取"
                            }}
                        </el-button>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="">
                <el-checkbox v-model="authForm.check"
                    >我已阅读并同意 <a href="">《用户授权服务协议》</a>
                </el-checkbox>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="nextStep()">下一步</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { getUserInfo } from "@/utils/auth";
import { Api_SaveTemp } from "@/api/xinYiLoan";
import { Api_Send2, Api_GetCompanyInfoById } from "@/api/baseApi";

export default {
    data() {
        return {
            formLoading: false,
            loading: false,
            productId: "",
            companyId: "",
            curStep: "two",
            sum: 61,
            companyInfo: {},
            authForm: {
                companyName: "", // 公司名称
                linkMan: "", // 联系人
                phoneNo: "", // 电话号码
                messageCode: "", // 授权验证码
                check: false
            },
            authRules: {
                messageCode: [
                    {
                        required: true,
                        trigger: "change",
                        message: "授权验证码必填"
                    }
                ]
            }
        };
    },
    mounted() {
        this.productId = this.$route.query.id || null;
        this.loadUserInfo();
    },
    methods: {
        loadUserInfo() {
            this.formLoading = true;
            Api_GetCompanyInfoById({ userId: getUserInfo().userId }).then(data => {
                this.formLoading = false;
                if (data.stateCode === "1") {
                    this.authForm.linkMan = data.data.username;
                    this.authForm.phoneNo = "13962523029"; // data.data.phoneNo;
                    this.authForm.companyName = "测试测试测试"; // data.data.companyName;
                }
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

            Api_Send2({
                mobile: this.authForm.phoneNo,
                msg: "授权验证码"
            }).then(res => {
                const stateCode = res.stateCode;
                if (stateCode !== "0") {
                    let msg = "";
                    switch (stateCode) {
                        case "00002":
                            msg = "信息发送失败，请重新发送";
                            break;
                        case "00005":
                            msg =
                                "获取短信验证码受限，由于您今日请求次数已达上限，请明日再试";
                            break;
                        default:
                            msg = "短信发送失败";
                            break;
                    }
                    this.sum = 60;
                    this.$message({
                        message: msg,
                        type: "error",
                        duration: 5 * 1000
                    });
                }
            });
        },
        nextStep() {
            // 接口调用
            this.$refs["authForm"].validate(valid => {
                if (valid) {
                    if (!this.authForm.check) {
                        this.$message({
                            message: "请选择用户授权服务协议",
                            type: "error",
                            duration: 5 * 1000
                        });
                        return false;
                    }
                    const stepData = this.$store.state.global.setpData;
                    if (stepData) {
                        Api_SaveTemp(
                            Object.assign(stepData, this.authForm)
                        ).then(res => {
                            if (res.stateCode === "1") {
                                this.$router.push({
                                    path: "/xinYiLoan/xinYiStep/infopush",
                                    query: { financeApplicationId: res.data }
                                });
                            }
                        });
                    }
                } else {
                    return false;
                }
            });
        }
    }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.form-step {
    width: 440px;
    margin: 0 auto;
}
</style>
