<template>
    <div id="loginAuth-box">
        <el-container style="background-color:#fff;">
            <el-header>
                <!-- <FxbHeader @reload="reload" /> -->
                <div class="fxb-header3"></div>
            </el-header>

            <!-- 认证企业 -->
            <div class="auth-title-top" v-show="isShowPage == 2">
                <div class="auth-title">
                    <div class="add-title">登录验证</div>
                </div>
                <el-form :model="confirmCompanyForm" :rules="confirmCompanyRules" v-loading="loading"
                    ref="confirmCompanyForm" label-width="100px" class="confirm-company">
                    <el-form-item label="企业名称：" prop="name" style="margin-top:50px">
                        <el-input v-if="historyData.id && historyData.verifyBefore" v-model="confirmCompanyForm.companyName"
                            ref="companyRef" auto-complete="off" autofocus="true"></el-input>
                        <el-autocomplete ref="companyRef" v-model="confirmCompanyForm.companyName"
                            :fetch-suggestions="querySearch" :trigger-on-focus="false" placeholder="请输入企业名称"
                            style="width: 100%;" @select="handleSelect"></el-autocomplete>
                    </el-form-item>

                    <el-form-item label="姓名：" prop="name">
                        <el-input v-model="confirmCompanyForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号：" prop="phone">
                        <el-input v-model="confirmPhoneForm.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="邀请码：" prop="inviteCode">
                        <el-input v-model="confirmCompanyForm.inviteCode"></el-input>
                    </el-form-item>
                    <div style="text-align: center;margin-top:50px;">
                        <el-button type="primary" @click="saveCompanyForm('confirmCompanyForm')">加入企业
                        </el-button>
                    </div>
                </el-form>

            </div>

            <!-- 手机号 -->
            <div class="auth-title-top" v-show="isShowPage == 1">
                <div class="auth-title">
                    <div class="add-title">登录验证</div>
                </div>
                <div class="auth-phone clearfix">
                    <div class="auth-next">
                        <div class="line-next"></div>
                        <div class="fl auth-phone-item">
                            <div class="title-phone">绑定手机号</div>
                            <img src="../../assets/images/login/choose.png" alt="">
                        </div>
                        <div class="fr auth-phone-item">
                            <div class="title-phone">加入企业</div>
                            <img src="../../assets/images/login/nochoose.png" alt="">
                        </div>
                    </div>
                    <el-form class="phone-confirm" :rules="loginRules" >
                        <el-form-item label="手机号码：" prop="phone" style="position: relative">
                            <el-input v-model="confirmPhoneForm.phone" placeholder="请输入手机号码"
                                style="position: relative;width: 100%;margin-left: 0px;width: 52%;" name="phone">
                            </el-input>
                            <el-button :loading="loading1" :disabled="sum1 < 61"
                                @click.native.prevent="checkPhone" type="primary" size="small"
                                style="position: absolute; right: 0px; top: 0px;padding: 12px 15px">
                                {{ sum1 === 61 ? '获取验证码' : sum1 +
                                's后重新获取' }}
                            </el-button>
                        </el-form-item>
                        <el-form-item label="验证码：" label-width='92px' class="stylemargin"  prop="code">
                            <el-input v-model.number="confirmPhoneForm.code" placeholder="请输入验证码" name="smsCode">
                            </el-input>
                        </el-form-item>
                        <div style="text-align: center;">
                            <el-button type="primary" size="small" style='padding: 10px 19px;
                        font-size: 14px;' @click="submitBtn">确认</el-button>
                        </div>
                    </el-form>

                </div>

            </div>

            <!-- 加入企业认证成功 -->
            <div class="auth-title-top" v-show="isShowPage == 3">
                <div class="auth-title">
                    <div class="add-title">登录验证</div>
                </div>
                <div class="auth-phone clearfix">
                    <div class="auth-next">
                        <div class="line-next"></div>
                        <div class="fl auth-phone-item">
                            <div class="title-phone">绑定手机号</div>
                            <img src="../../assets/images/login/choose.png" alt="">
                        </div>
                        <div class="fr auth-phone-item">
                            <div class="title-phone">加入企业</div>
                            <img src="../../assets/images/login/choose.png" alt="">
                        </div>
                    </div>
                    <div>
                        <div class="pic-logo"> <img  v-if="headPortrait" :src="imgUrl + headPortrait" alt="" style="width: 100%;height: 100%;"></div>
                        <div class="pic-title">{{infoList.saasName}} </div>
                        <div class="pic-line"></div>
                        <div class="pic-name">
                            <span class="left-name">姓名</span>
                            <span>{{infoList.name}}</span>
                        </div>
                        <div class="pic-name">
                            <span class="left-name">部门</span>
                            <span>{{infoList.deptName}} </span>
                        </div>
                        <div style="text-align: center;">
                            <el-button type="primary" size="small" style='padding: 10px 19px;
                        font-size: 14px;margin-top: 15px;' @click="step3Btn">确认</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </el-container>
    </div>
</template>
<script>
    import { Api_Send2, Api_fileUrl } from "@/api/baseApi";
    import { Api_CompanySearch } from "@/api/creditMonitor";
    import {uuid, validPhone} from "@/utils/index";
    import { Api_wxlogin, Api_wxSaveUserUnionId , Api_wxloginPhone,Api_wxloginoauth2} from "@/api/wxlogin";
    import FxbHeader from "@/views/layouts/fxb/components/FxbHeader";
    import {  Api_LoginByMsg ,Api_LoginByUsername} from "@/api/login";
    import { getJessionID, getUserStore, setJessionID, setToken, setRefToken } from "@/utils/auth";
    import store from "@/store";
    import router from "@/router";
    export default {
        name: "loginAuth",
        components: {
            FxbHeader,
        },
        data() {
            return {
                noConfirmCompany: false,
                loading: false,
                loading1: false,
                isShowPage: 0,
                headPortrait:'',
                imgUrl:process.env.VUE_APP_FILE_API,
                sum1: 61,
                code:'',
                unionId:'',
                historyData: {}, // 企业认证历史
                confirmCompanyRules: {
                    companyName: [{ required: true, message: "请输入企业名称", trigger: "blur" }, { max: 50, message: "长度不能超过50位" }],
                    name: [{ required: true, message: "请输入用户名", trigger: "blur" }, { max: 50, message: "长度不能超过50位" }],
                    inviteCode: [{ required: true, message: "请输入邀请码", trigger: "blur" }, { max: 50, message: "长度不能超过50位" }],
                },
                confirmPhoneForm: {
                    code: '',
                    phone: ''
                },
                confirmCompanyForm: {
                    unionId: "",
                    name: "",
                    companyId: "",
                    companyName: "",
                    inviteCode:''
                },
                infoList:{},
                companyList:{},
                loginRules: {
                    phone: [
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
                    code: [{ required: true, trigger: "change", message: "密码必填" }],
                }
            }
        },

        created() {
            this.code = this.getUrlKey("code")
            this.getWeixin(this.code)
        },
        computed: {
            randomStr() {
                const UUID = uuid();
                setJessionID(UUID);
                return UUID;
            }
        },
        watch: {
            $route(){
                if(this.$route.query.code!=undefined){
                    console.log( this.$route.query.code);
                    this.getWeixin(this.$route.query.code);
                }
            }
        },
        methods: {
            // 加入企业成功详细信息确认
            step3Btn(){
                this.confirmCompanyForm.unionId = this.unionId
                this.confirmCompanyForm.phone = this.confirmPhoneForm.phone 
                this.confirmCompanyForm.companyId = this.infoList.companyId
                Api_wxSaveUserUnionId(this.confirmCompanyForm).then(res=>{
                     // 直接登录
                     this.loginNext()
                }).catch(error=>{
                    this.$message({
                        message: error,
                        type: "error",
                        duration: 5 * 1000,
                    });
                })
            },
            // 登录接口
            loginNext(){
                Api_LoginByMsg({
                  mobile: this.confirmPhoneForm.phone,
                  smsCode: this.confirmPhoneForm.code,
                  randomStr: this.randomStr,
                  code:'',
                  roleType: "1",
                  grant_type: "custom_mobile_sms",
                  "remember-me": false,
                  loginType: 'wx',
                  unionId: this.unionId
                }).then(({ expires_in, refresh_token, access_token }) => {
                    store.commit("SAVE_refresh_token", refresh_token);
                    if (expires_in < 43199) {
                    Api_LoginByUsername({
                        grant_type: "refresh_token",
                        refresh_token,
                    }).then(({ access_token }) => {
                        this.loginSuccess(access_token);
                    });
                    } else {
                    this.loginSuccess(access_token, refresh_token);
                    }
                })
                .catch((e) => {
                    this.$message({
                        message: e,
                        type: "error",
                        duration: 5 * 1000,
                    });
                });
          
            }, 
            // 登录成功保存数据
            loginSuccess(access_token, refresh_token) {
                setToken(access_token);
                setRefToken(refresh_token);
                store.dispatch("GetUserInfo");
                this.$router.replace({ name: "companyCenterMain" });
                this.$router.push({ name: "companyCenterMain" });
                this.$message({
                    message: "登录成功",
                    type: "success",
                    duration: 1000,
                });
            },
            // 手机认证
            submitBtn(){
                if (this.confirmPhoneForm.code == "") {
                    this.$message({
                        message: "请输入验证码",
                        type: "warning",
                        duration: 5 * 1000
                    });
                    return;
                }
                var paramsPhone ={
                    phone: this.confirmPhoneForm.phone,
                    code: this.confirmPhoneForm.code
                }
                Api_wxloginPhone(paramsPhone).then(res =>{
                    if(res.status == 0) {
                        this.$message.error('手机验证码错误')
                    }else if(res.status == 1){
                        // 手动绑定企业
                        this.isShowPage = 2
                    }else if(res.status == 2){
                        // 有对应的企业
                        this.isShowPage = 3
                        this.infoList = res.data
                        this.companyList.unionId = this.unionId
                        this.companyList.phone = this.confirmPhoneForm.phone
                        this.headPortrait =  res.data.headPortrait ? res.data.headPortrait:""

                    }
                })
            },
            // 获取地址栏code
            getUrlKey (name) {
                var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
                var r = window.location.search.substr(1).match(reg);
                if (r!=null) return unescape(r[2]); return null;
            },
            // 根据code获取unid
            getWeixin(code){
                var params = {
                    code: code
                }
                Api_wxlogin(params).then(res=>{
                    this.unionId = res.unionId
                    if (res.status == 1){
                        // 直接登录
                        this.loginNext()
                    }else if(res.status == 0){
                      // 需要用户填写手机号
                      this.isShowPage = 1
                    }else if (res.status == 3) {
                        Api_wxloginoauth2().then(res=>{
                          window.location.href = res
                        })
                    }
                })
            },
            // 企业认证id
            handleSelect(item) {
                this.confirmCompanyForm.companyId = item.id;
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
                    })
                    .catch(e => {
                        cb([]);
                        this.$message.warning("请输入更详细的关键词");
                    });
            },
             // 验证手机
            checkPhone() {
                if (!validPhone(this.confirmPhoneForm.phone)) {
                    this.$message({
                        message: "请输入正确的11位手机号码",
                        type: "warning",
                        duration: 5 * 1000
                    });
                    return;
                }
                this.sendMsg()
            },
            // 发送短信验证码
            sendMsg() {
                this.sum1 = 61;
                this.timer = setInterval(() => {
                  this.sum1--;
                    if (this.sum1 < 1) {
                        this.sum1 = 61;
                        clearInterval(this.timer);
                    }
                }, 1000);

                Api_Send2({
                    mobile: this.confirmPhoneForm.phone,
                    templateType: "2" 
                }).then(res => {
                    this.$message.success(res)
                }).catch(res => {
                    this.$message.error(res)
                });

            },
            reload() {
                this.isRouterAlive = false;
                this.$nextTick(() => (this.isRouterAlive = true));
            },
            // 加入企业
            saveCompanyForm(formName) {
                this.confirmCompanyForm.unionId = this.unionId
                this.confirmCompanyForm.phone = this.confirmPhoneForm.phone 
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Api_wxSaveUserUnionId(this.confirmCompanyForm).then(res=>{
                            if (res == true) {
                                // 直接登录
                               this.loginNext()
                            }else if (res == false){
                                // 需要等审核
                                this.$router.push('/login')
                            }
                        }).catch(error=>{
                            this.$message({
                                message: '接口错误',
                                type: "error",
                                duration: 5 * 1000,
                            });
                        })
                       
                    } 
                });
            },

        },
    }
</script>

<style lang="scss" scoped>
    #loginAuth-box {

        .fxb-header3{
            color: #cbcbcb;
            background-color: #032c59;
            height: 50px;
            line-height: 50px;
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            z-index: 20;
            transition: background-color 0.3s;
        }

        .el-container {
            background-color: #f7f8fa !important;
            min-height: 100vh;
        }

        .confirm-company {
            width: 60%;
            margin: 0 auto;

            .el-form-item {
                margin-bottom: 20px;
            }
        }

        .auth-title-top {
            padding: 10px 26px;
            width: 1200px;
            background-color: #fff;
            min-height: calc(100vh - 90px);
            margin: 20px auto 0;

            .auth-title {
                display: flex;
                justify-content: space-between;

                .add-title {
                    font-family: MicrosoftYaHei;
                    font-size: 16px;
                    font-weight: normal;
                    font-stretch: normal;
                    line-height: 42px;
                    border-bottom: 2px solid #4b9df3;
                    letter-spacing: 0px;
                    color: #333333;
                }
            }
        }

        .common_title {
            font-family: MicrosoftYaHei;
            font-size: 16px;
            font-weight: normal;
            font-stretch: normal;
            line-height: 16px;
            letter-spacing: 0px;
            color: #333333;
            border-left: 4px solid #4b9df3;
            padding-left: 15px;
            margin-top: 30px;
        }

        /* 手机 */
        .auth-phone {
            width: 415px;
            margin: 25px auto 0;
            height: 260px;
            position: relative;
            padding-top: 10px;

            .phone-confirm {
                .el-form-item {
                    margin-bottom: 20px;
                }

                .el-form-item__content {
                    float: left;
                    width: 75%;
                }

              /deep/  .el-form-item__label{
                    width: 92px;
                }
            }

            .stylemargin {
                .el-form-item__content {
                    margin-left: 0 !important;
                }
            }

            .line-next {
                height: 3px;
                width: 220px;
                position: absolute;
                background-color: #409eff;
                top: 62px;
                left: 50%;
                transform: translateX(-50%);
            }

            .auth-next {
                width: 320px;
                height: 110px;
                margin: 0 auto;

                .auth-phone-item {
                    margin: 0 auto;

                    .title-phone {
                        font-size: 16px;
                        color: #333333;
                    }
                }
            }

            .pic-logo {
                margin-top: 40px;
                width: 80px;
                height: 80px;
                background-color: #4b9df3;
                border-radius: 8px;
                margin: 0 auto 10px;

                img {
                    width: 100%;
                    height: 100%
                }
            }

            .pic-line {
                width: 80px;
                height: 3px;
                background-color: #4b9df3;
                margin: 0 auto 25px;
            }

            .pic-title {
                font-size: 18px;
                font-weight: 600;
                font-stretch: normal;
                line-height: 47px;
                letter-spacing: 0px;
                color: #333333;
                text-align: center;
            }

            .pic-name {
                line-height: 47px;
                text-align: center;

                .left-name {
                    font-size: 14px;
                    color: #606266;
                    margin-right: 26px;
                }
            }

        }
    }
</style>
