<template>
    <el-row class="marT33 marB49">
        <el-form
            :model="basicInfoForm"
            :rules="rules"
            v-loading="loading"
            ref="basicInfoForm"
            label-width="120px"
            class="setting-form"
        >
            <el-form-item label="用户名">
                <el-input v-model="basicInfoForm.username" disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
                <el-input v-model="basicInfoForm.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="手机号码">
                <el-input v-model="basicInfoForm.mobile" disabled="disabled"></el-input>
                <el-button
                    type="primary"
                    size="medium"
                    @click="dialogVisible = true"
                    style="position: absolute; right: -80px; top: 2px;"
                >修改</el-button>
            </el-form-item>
            <el-form-item label="电子邮箱" prop="email">
                <el-input v-model="basicInfoForm.email" placeholder="请输入电子邮箱"></el-input>
            </el-form-item>
            <el-form-item label="所属公司">
                <template v-if="!isChildUser">
                    <el-input v-model="historyData.name" disabled="disabled"></el-input>
                    <el-button
                        v-if="historyData.processStatus!=='1'"
                        type="primary"
                        size="medium"
                        @click="confirmCompany()"
                        style="position: absolute; right: -108px; top: 2px;"
                    >{{ confirmState }}</el-button>
                    <span
                        v-if="historyData.processStatus==='1'"
                        style="color: #67C23A;position: absolute; right: -50px; top: 2px;"
                    >认证中</span>
                    <span
                        v-if="historyData.processStatus==='2'"
                        class="rz-success"
                    >认证成功，如果认证信息已变更请再次认证</span>
                </template>
                <el-input v-else v-model="userInfo.saasName" disabled="disabled"></el-input>
            </el-form-item>
            <!--            <el-form-item label="职位" prop="position">-->
            <!--                <el-input v-model="basicInfoForm.position" placeholder="请输入职位"></el-input>-->
            <!--            </el-form-item>-->
            <el-form-item label="所属部门" v-if="isChildUser">
                <el-input v-model="userInfo.deptName" disabled></el-input>
            </el-form-item>
            <el-form-item style="padding-top:8px;">
                <el-button
                    type="primary"
                    @click="submitForm('basicInfoForm')"
                    style="width: 98px;"
                >保存</el-button>
                <el-button @click="resetUserInfo()" style="margin-left: 9px;">重置</el-button>
            </el-form-item>
        </el-form>

        <el-dialog
            title="修改手机号"
            :before-close="changePhoneBeforeClose"
            :close-on-click-modal="false"
            :visible.sync="dialogVisible"
            :append-to-body="true"
            width="30%"
        >
            <el-form
                :model="changePhoneForm"
                :rules="rules1"
                v-loading="loading"
                ref="changePhoneForm"
                label-width="100px"
                class="change-phone"
            >
                <el-form-item label="手机号码" prop="mobile">
                    <el-input v-model="changePhoneForm.mobile"></el-input>
                </el-form-item>
                <el-form-item label="图形验证码" prop="code" style="position: relative;">
                    <el-input v-model="changePhoneForm.code"></el-input>
                    <span
                        @click="changeCaptcha"
                        class="change-code"
                        style="position: absolute; right: 7px; top: 0;"
                    >
                        <img :src="codeSrc" alt="验证码" height="100%" width="90" />
                    </span>
                </el-form-item>
                <el-form-item label="短信验证码" prop="smsCode" style="position: relative;">
                    <el-input v-model.number="changePhoneForm.smsCode"></el-input>
                    <div></div>
                    <el-button
                        :loading="loading"
                        :disabled="sum < 61"
                        @click.native.prevent="checkPhone(changePhoneForm.mobile)"
                        type="primary"
                        size="small"
                        style="position: absolute; right: 6px; top: 4px;"
                    >
                        {{ sum === 61 ? '获取验证码' : sum +
                        's后重新获取' }}
                    </el-button>
                </el-form-item>
                <div style="text-align: center;">
                    <el-button
                        type="primary"
                        @click="saveEditPhone('changePhoneForm')"
                        size="small"
                        :loading="submitLoading"
                    >保存</el-button>
                    <el-button
                        @click="resetForm('changePhoneForm');dialogVisible = false"
                        size="small"
                    >取消</el-button>
                </div>
            </el-form>
        </el-dialog>

        <el-dialog
            title="企业认证"
            :before-close="confirmCompanyBeforeClose"
            :visible.sync="confirmCompanyVisible"
            :close-on-click-modal="false"
            width="580px"
            class="confirm-company-dialog"
            :modal-append-to-body="true"
            :append-to-body="true"
        >
            <el-form
                :model="confirmCompanyForm"
                :rules="confirmCompanyRules"
                v-loading="loading"
                ref="confirmCompanyForm"
                label-width="9em"
                class="confirm-company"
            >
                <el-form-item
                    v-if="historyData.id && historyData.processStatus==='3'"
                    label="失败原因："
                    style="margin-top: -10px; border-bottom: 1px solid #eaedf4;"
                >{{ historyData.latestProcessRemark }}</el-form-item>
                <el-form-item label="企业名称：" prop="name">
                    <el-input
                        v-if="historyData.id && historyData.verifyBefore"
                        v-model="confirmCompanyForm.name"
                    ></el-input>
                    <el-autocomplete
                        v-else
                        v-model="confirmCompanyForm.name"
                        :fetch-suggestions="querySearch"
                        :trigger-on-focus="false"
                        placeholder="请输入企业名称"
                        style="width: 100%;"
                        @select="handleSelect"
                    ></el-autocomplete>
                </el-form-item>
                <el-form-item label prop="code">
                    <el-input v-model="confirmCompanyForm.code" size="small" disabled></el-input>
                </el-form-item>
                <el-form-item label="姓名：" prop="applicant">
                    <el-input
                        v-model="confirmCompanyForm.applicant"
                        placeholder="请输入姓名"
                        :disabled="isConfirm1"
                    ></el-input>
                </el-form-item>
                <el-form-item label="身份证号：" prop="applicantId">
                    <el-input
                        v-model="confirmCompanyForm.applicantId"
                        placeholder="请输入请输入身份证号"
                        :disabled="isConfirm1"
                    ></el-input>
                </el-form-item>
                <el-form-item label="手机号码：">
                    <el-input v-model="basicInfoForm.mobile" disabled></el-input>
                </el-form-item>
                <el-form-item
                    label="短信验证码："
                    prop="smsCode"
                    style="position: relative;"
                    v-if="!switchDisabled"
                >
                    <el-input v-model.number="confirmCompanyForm.smsCode"></el-input>
                    <el-button
                        :loading="loading"
                        :disabled="sum1 < 61"
                        @click.native.prevent="checkPhone2(basicInfoForm.mobile)"
                        type="primary"
                        size="small"
                        style="position: absolute; right: 6px; top: 4px;"
                    >
                        {{ sum1 === 61 ? '获取验证码' : sum1 +
                        's后重新获取' }}
                    </el-button>
                </el-form-item>
                <el-row :span="24" :gutter="10">
                    <el-col :span="12" class="avatar-uploader-row">
                        <el-form-item label="营业执照：" prop="yyzzAtt">
                            <el-upload
                                class="avatar-uploader"
                                :action="uploadUrl"
                                :http-request="(p)=>myUpload(p,1)"
                                :show-file-list="false"
                                :before-upload="beforeAvatarUpload"
                                accept=".jpg, .jpeg, .png, .JPG, .JPEG, .PNG"
                                :disabled="switchDisabled"
                            >
                                <img
                                    v-if="confirmCompanyForm.yyzzAtt"
                                    :src="confirmCompanyForm.yyzzAtt"
                                    class="avatar"
                                    alt
                                />
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                <div
                                    slot="tip"
                                    class="el-upload__tip"
                                    v-if="!switchDisabled"
                                >仅支持jpg、jpeg、png格式，大小不超过2M</div>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" class="avatar-uploader-row">
                        <el-form-item label="授权委托书扫描件：" prop="wtsqsAtt">
                            <el-upload
                                class="avatar-uploader"
                                :action="uploadUrl"
                                :http-request="(p)=>myUpload(p,2)"
                                :show-file-list="false"
                                :before-upload="beforeAvatarUpload"
                                accept=".jpg, .jpeg, .png, .JPG, .JPEG, .PNG"
                                :disabled="switchDisabled"
                            >
                                <img
                                    v-if="confirmCompanyForm.wtsqsAtt"
                                    :src="confirmCompanyForm.wtsqsAtt"
                                    class="avatar"
                                    alt
                                />
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                </el-row>

                <div style="text-align: center;margin-top:20px;" v-if="!switchDisabled">
                    <el-button
                        type="primary"
                        @click="saveCompanyForm('confirmCompanyForm')"
                        size="small"
                    >保存</el-button>
                    <el-button
                        @click="resetForm('confirmCompanyForm');confirmCompanyVisible = false"
                        size="small"
                    >取消</el-button>
                </div>
            </el-form>
        </el-dialog>
    </el-row>
</template>

<script>
import {
    API_GetInfoByCurrentUser,
    API_GetStatusByCompanyId,
    API_SaveEnterpriseCertification,
    Api_EditPhoneNo,
    Api_UpdateUserInfo,
    API_EnterpriseCertHistory // 获取最近企业认证历史
} from "@/api/userCenter/baseInfo";
import { Api_CompanySearch } from "@/api/creditMonitor";
import { Api_Send2, Api_fileUrl } from "@/api/baseApi";
import { Api_LoginByUsername } from "@/api/login";
import {
    getJessionID,
    getUserInfo,
    getUserStore,
    setJessionID,
    setToken,
    setRefToken,
    getRefToken
} from "@/utils/auth";
import { uuid, validPhone } from "@/utils/index";
import store from "@/store";
import { isNull } from "@/utils/commonUtils";
import { Api_upload, Api_GetCompanyInfoById } from "@/api/baseApi";
import { Api_getKaptcha } from "@/api/login";

export default {
    name: "BasicInfo",
    components: {},
    data() {
        return {
            switchDisabled: false,
            loading: false,
            sum: 61,
            timer: "",
            sum1: 61,
            timer1: "",
            baseUserInfo: {},
            submitLoading: false,
            basicInfoForm: {
                name: "",
                mobile: "",
                // companyName: "",
                email: "",
                position: "",
                jobInfo2: ""
            },
            rules: {
                mobile: [
                    { required: true, message: "请输入手机号码", trigger: "blur" },
                    { pattern: /^1[3456789]\d{9}$/, message: "请输入正确的手机号" }
                ],
                name: [
                    { required: true, message: "请输入姓名", trigger: "blur" },
                    { max: 100, message: "长度不能超过100个字" }
                ],
                email: [
                    { required: true, message: "请输入电子邮箱", trigger: "blur" },
                    { max: 300, message: "长度不能超过300个字" },
                    {
                        pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                        message: "请输入正确的邮箱"
                    }
                ],
                position: [{ max: 50, message: "长度不能超过50个字", trigger: "blur" }]
            },
            // 修改手机号
            dialogVisible: false,
            changePhoneForm: {
                mobile: "",
                smsCode: "",
                code: ""
            },
            rules1: {
                mobile: [
                    { required: true, message: "请输入手机号码", trigger: "blur" },
                    { pattern: /^1[3456789]\d{9}$/, message: "请输入正确的手机号" }
                ],
                smsCode: [
                    { required: true, message: "请输入短信验证码", trigger: "blur" },
                    {
                        message: "必须为数字，且长度不能超过6位",
                        trigger: "blur",
                        pattern: /^\d{6}$/
                    }
                ],
                code: [
                    { required: true, message: "请输入图形验证码", trigger: "blur" },
                    { max: 4, message: "长度不能超过4位", trigger: "blur" }
                ]
            },
            randomNum: Math.random(),
            confirmCompanyVisible: false,
            confirmCompanyForm: {
                id: "",
                code: "",
                companyId: "",
                name: "",
                applicant: "",
                applicantId: "",
                smsCode: "",
                yyzzAtt: "",
                wtsqsAtt: "",
                version: ""
            },
            // imageUrl: "",
            // imageUrl2: "",
            // fileList: [],
            confirmCompanyRules: {
                name: [{ required: true, message: "请输入企业名称", trigger: "blur" }],
                code: [
                    { required: true, message: "查询不到统一社会信用代码" },
                    { max: 50, message: "长度不能超过50位" }
                ],
                applicant: [
                    { required: true, message: "请输入真实姓名", trigger: "blur" },
                    { max: 200, message: "长度不能超过200位", trigger: "blur" }
                ],
                applicantId: [
                    { required: true, message: "请输入身份证号码", trigger: "blur" },
                    {
                        message: "请输入正确身份证号码",
                        trigger: "change",
                        pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
                    }
                ],
                smsCode: [
                    { required: true, message: "请输入短信验证码", trigger: "blur" },
                    {
                        max: 6,
                        message: "必须为数字，且长度为6位",
                        trigger: "blur",
                        pattern: /^\d{6}$/
                    }
                ],
                yyzzAtt: [{ required: true, trigger: "blur", message: "请上传营业执照" }],
                wtsqsAtt: [
                    { required: true, trigger: "blur", message: "请上传授权委托书扫描件" }
                ]
            },
            dialogAddVisibleLoading: false,
            batchLoading: false,
            uploadUrl: Api_fileUrl() + "image/",
            // confirmState: "企业认证",
            confirmStateCode: "",
            returnData: "",
            auditRemark: "",
            copySelectCompanyName: "", // 备份一份用户认证时候从列表里选择的企业名称
            // isChildUser: false,
            isConfirm1: false,
            historyData: {}, // 企业认证历史
            curUploadFileNum1: -1, // 传递给后台的图片顺序
            curUploadFileNum2: -1 // 传递给后台的图片顺序
        };
    },
    computed: {
        FILE_API() {
            return process.env.FILE_API;
        },
        userInfo() {
            return this.$store.state.user.userInfo;
        },
        isChildUser() {
            // 是否是子账号
            return this.userInfo ? this.userInfo.subAccount : false;
        },
        confirmState() {
            if (!this.historyData.id) {
                return "企业认证";
            }
            if (this.historyData.id && this.historyData.processStatus === "3") {
                return "认证失败";
            }
            if (this.historyData.id && this.historyData.processStatus === "2") {
                return "认证成功";
            }
            return "企业认证";
        },
        randomStr() {
            const UUID = uuid();
            setJessionID(UUID);
            return UUID;
        },
        codeSrc() {
            return Api_getKaptcha() + this.randomStr + "?" + this.randomNum;
        }
    },
    watch: {
        userInfo() {
            this.initData();
        }
    },
    // 初始化数据
    mounted() {
        this.initData();
        this.getHistory();
    },
    methods: {
        // 获取企业认证历史
        getHistory() {
            API_EnterpriseCertHistory().then(res => {
                this.historyData = res || {};
                if (res.processStatus === "2") {
                    this.refreshUserInfo();
                }
            });
        },
        // 从全局store中的userInfo中获取用户基础信息
        initData() {
            this.basicInfoForm.username = this.userInfo.username;
            this.basicInfoForm.mobile = this.userInfo.mobile;
            this.basicInfoForm.email = this.userInfo.email;
            this.basicInfoForm.position = this.userInfo.position;
            this.basicInfoForm.name = this.userInfo.name;
            // this.basicInfoForm.companyName = this.historyData.name;
        },
        // 修改密码关闭清空数据
        changePhoneBeforeClose() {
            this.dialogVisible = false;
            clearInterval(this.timer);
            this.resetForm("changePhoneForm");
        },
        // 修改手机号码弹窗验证手机
        checkPhone(formNamePhone) {
            if (!validPhone(formNamePhone)) {
                this.$message({
                    message: "请输入正确的11位手机号码",
                    type: "warning",
                    duration: 5 * 1000
                });
                return false;
            }

            if (isNull(this.changePhoneForm.code)) {
                this.$message({
                    message: "请输入图形验证码",
                    type: "warning",
                    duration: 5 * 1000
                });
                return false;
            }

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
                mobile: formNamePhone,
                templateType: "3"
            })
                .then(res => {})
                .catch(e => {
                    this.$message.error(e);
                });
            // Api_Send2({
            //     mobile: formNamePhone,
            //     msg: "用户登录身份验证",
            //     captcha: this.changePhoneForm.picNo,
            //     jessionID: getJessionID(),
            //     type: "1",
            //     delCaptcha: "1"
            // }).then(res => {
            //     const stateCode = res.stateCode;
            //     if (stateCode !== "0") {
            //         let msg = "";
            //         switch (stateCode) {
            //             case "00002":
            //                 msg = "信息发送失败，请重新发送";
            //                 break;
            //             case "00005":
            //                 msg =
            //                     "获取短信验证码受限，由于您今日请求次数已达上限，请明日再试";
            //                 break;
            //             case "20115":
            //                 msg = "验证码错误";
            //                 // 刷新验证码
            //                 this.changeCaptcha();
            //                 // 清空验证码输入框
            //                 this.changePhoneForm.picNo = "";
            //                 break;
            //             default:
            //                 msg = "短信发送失败";
            //                 break;
            //         }
            //         this.$message({
            //             message: msg,
            //             type: "error",
            //             duration: 5 * 1000
            //         });
            //     }
            // });
        },
        // 企业认证弹窗里的获取验证码
        checkPhone2(formNamePhone) {
            // 倒计时60秒后,可以重新发送短信
            this.sum1 = 61;
            this.timer1 = setInterval(() => {
                this.sum1--;
                if (this.sum1 < 1) {
                    this.sum1 = 61;
                    clearInterval(this.timer1);
                }
            }, 1000);

            Api_Send2({
                mobile: formNamePhone,
                templateType: "2"
            })
                .then(res => {
                    this.$message.success(res);
                })
                .catch(e => {
                    this.$message.error(e);
                });
        },
        // 保存修改手机号
        saveEditPhone(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.submitLoading = true;
                    Api_EditPhoneNo({
                        mobile: this.changePhoneForm.mobile,
                        smsCode: this.changePhoneForm.smsCode,
                        randomStr: this.randomStr,
                        code: this.changePhoneForm.code
                    })
                        .then(data => {
                            this.$message.success(data);
                            this.submitLoading = false;
                            // 修改成功
                            this.dialogVisible = false;
                            this.basicInfoForm.mobile = this.changePhoneForm.mobile;
                            this.refreshUserInfo();
                            this.resetForm("changePhoneForm");
                        })
                        .catch(e => {
                            this.submitLoading = false;
                            this.$message.error(e);
                            // 清空验证码输入框
                            // this.changePhoneForm.picNo = "";
                            this.changeCaptcha();
                        });
                }
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    Api_UpdateUserInfo({
                        name: this.basicInfoForm.name,
                        email: this.basicInfoForm.email,
                        position: this.basicInfoForm.position
                    })
                        .then(data => {
                            this.$message.success("保存成功");
                            this.refreshUserInfo();
                        })
                        .catch(e => {
                            console.log(e);
                            this.$message.error(e);
                        });
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        resetUserInfo() {
            // this.basicInfoForm.name = "";
            // this.basicInfoForm.email = "";
            // this.basicInfoForm.position = "";
            this.initData();
            // this.basicInfoForm = JSON.parse(JSON.stringify(this.baseUserInfo));
        },
        // 验证码
        changeCaptcha() {
            this.randomNum = Math.random();
        },
        // 打开认证弹框
        confirmCompany() {
            this.confirmCompanyVisible = true;
            Object.keys(this.confirmCompanyForm).forEach(key => {
                this.confirmCompanyForm[key] = this.historyData[key];
                // this.confirmCompanyForm = Object.assign({}, this.confirmCompanyForm, this.historyData);
            });
        },
        // 企业认证关闭清空数据
        confirmCompanyBeforeClose() {
            this.confirmCompanyVisible = false;
            clearInterval(this.timer);
            this.resetForm("confirmCompanyForm");
            this.copySelectCompanyName = "";
        },
        querySearch(queryString, cb) {
            Api_CompanySearch(queryString)
                .then(res => {
                    const temp = [];
                    for (const elem of res.returnData) {
                        temp.push({
                            value: elem.name,
                            id: elem.id,
                            code: elem.creditCode
                        });
                    }
                    cb(temp);
                    // if (res.stateCode === "50001") {
                    //     const temp = [];
                    //     for (const elem of res.data.returnData) {
                    //         temp.push({
                    //             value: elem.name,
                    //             id: elem.id,
                    //             code: elem.creditCode
                    //         });
                    //     }
                    //     cb(temp);
                    // } else if (res.stateCode === "50003") {
                    //     this.$message.warning("请输入更详细的关键词");
                    //     cb("");
                    // }
                })
                .catch(e => {
                    cb([]);
                    this.$message.warning("请输入更详细的关键词");
                });
        },
        // 判断企业是否已被其他用户认证成功
        handleSelect(item) {
            // this.confirmCompanyForm.id = item.id;
            this.confirmCompanyForm.code = item.code;
            this.confirmCompanyForm.companyId = item.id;
            /* // 备份一份用户认证时候从列表里选择的企业名称
                this.copySelectCompanyName = item.value;

                API_GetStatusByCompanyId({
                    companyId: item.companyId
                }).then(res => {
                    this.confirmCompanyForm.companyId = item.companyId;
                    /!**
                     * stateCode: 1是接口返回数据成功
                     * data：为空的话就是企业未被认证
                     *!/
                    if (res.stateCode === "1") {
                        if (res.data === "") {
                            // 设置选中的企业的统一社会信用代码
                            this.confirmCompanyForm.code = item.code;
                        } else {
                            this.$message.error(
                                "该企业已被认证，请重新输入！如有疑义，请联系客服"
                            );
                        }
                    } else {
                        console.log("");
                    }
                });*/
        },
        // 上传营业执照时判断图片格式和大小是否满足
        // 仅支持jpg、jpeg、png格式，大小不超过2M
        beforeAvatarUpload(file) {
            const isMatch = /\.(jpg|jpeg|png|JPG|JPEG|PNG)$/.test(file.name);
            const isLt2M = file.size / 1024 < 2048;
            if (!isMatch) {
                this.$message.warning("仅支持jpg、jpeg、png格式");
            }
            if (!isLt2M) {
                this.$message.warning("图片大小不超过2M");
            }
            return isMatch && isLt2M;
        },
        myUpload(content, type) {
            let num = 0;
            if (type === 1) {
                this.curUploadFileNum1++;
                num = this.curUploadFileNum1;
            } else {
                this.curUploadFileNum2++;
                num = this.curUploadFileNum2;
            }
            const formData = new FormData();
            formData.append("file", content.file);
            this.batchLoading = true;
            Api_upload(this.uploadUrl + num, formData)
                .then(res => {
                    if (type === 1) {
                        this.confirmCompanyForm.yyzzAtt = res.url;
                    } else {
                        this.confirmCompanyForm.wtsqsAtt = res.url;
                    }
                })
                .catch(e => {
                    this.$message.error(e);
                });
        },
        saveCompanyForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.saveEnterpriseCertification();
                }
            });
        },
        saveEnterpriseCertification() {
            const loading = this.$openLoading();
            API_SaveEnterpriseCertification(this.confirmCompanyForm)
                .then(data => {
                    this.getHistory();
                    this.confirmCompanyVisible = false;
                    this.resetForm("confirmCompanyForm");
                    loading.close();
                    this.$message.success(data);
                })
                .catch(e => {
                    loading.close();
                    this.$message.error(e);
                });
        },
        refreshUserInfo() {
            const refresh_token = getRefToken();
            Api_LoginByUsername({
                grant_type: "refresh_token",
                refresh_token
            }).then(({ access_token, refresh_token }) => {
                setToken(access_token);
                setRefToken(refresh_token);
                store.dispatch("GetUserInfo");
            });
        }
    }
};
</script>

<style lang="scss">
.confirm-company {
    .avatar-uploader-row {
        .el-form-item__content {
            margin-left: 16px !important;
        }

        .el-form-item__label {
            width: 100% !important;
            text-align: left;
            padding-left: 15px;
        }
    }

    .avatar-uploader,
    .avatar-uploader .el-upload,
    .avatar-uploader-icon {
        width: 100%;
    }

    .avatar-uploader .el-upload {
        height: 180px;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        display: flex;
        justify-content: center;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409eff;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: auto;
        height: 100%;
        display: block;
    }
}

.confirm-company-dialog {
    .el-dialog__body {
        padding-right: 35px;
    }
}
</style>
<style lang="scss" scoped>
.setting-form {
    margin: 0 auto;
    width: 420px;
}

.rz-success {
    color: red;
    position: absolute;
    left: 140%;
    top: 2px;
    font-size: 12px;
    line-height: initial;
    width: 152px;
}
.setting-form {
    .el-form-item {
        margin-bottom: 20px;
    }
}
</style>
