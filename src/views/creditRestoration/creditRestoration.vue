<template>
    <el-container style="background-color: #fafafa">
        <el-header>
            <FxbHeader />
        </el-header>
        <div class="creditapply">
            <p class="creditTitle">信用修复申请</p>
            <el-form
            :model="confirmCompanyForm"
            :rules="confirmCompanyRules"
            v-loading="loading"
            ref="confirmCompanyForm"
            label-width="168px"
            class="confirm-company"
        >
            <el-form-item label="企业名称：" prop="companyName">
                <el-autocomplete
                    v-model="confirmCompanyForm.companyName"
                    :fetch-suggestions="querySearch"
                    :trigger-on-focus="false"
                    placeholder="请输入企业名称"
                    @select="handleSelect"
                    @blur="isAuth"
                    :disabled="isdisabled"
                ></el-autocomplete>
            </el-form-item>
            <el-form-item label="统一社会信用代码：" prop="code" >
                <el-input v-model="confirmCompanyForm.code"  :disabled="isdisabled"  placeholder="请输入统一社会信用代码" name="code"></el-input>
            </el-form-item>
            <el-form-item label="法定代表人姓名：" prop="legalUserName">
                <el-input
                    v-model="confirmCompanyForm.legalUserName"
                    placeholder="请输入法定代表人姓名"
                    name="legalUserName"
                    :disabled="isdisabled"
                ></el-input>
            </el-form-item>
            <el-form-item label="注册地址：" prop="address">
                <el-input
                    v-model="confirmCompanyForm.address"
                    placeholder="请输入注册地址"
                    name="address"
                ></el-input>
            </el-form-item>
            <el-form-item label="修复要求描述：" prop="remarks">
                <el-input type="textarea" v-model="confirmCompanyForm.remarks" :rows="3" placeholder="请输入修复要求描述" name="remarks"></el-input>
            </el-form-item>
            <el-form-item label="失信修复平台：" style="margin-bottom:0px">
                <el-row :span="24">
                    <el-col :span="12">
                       <el-form-item label="公共信用平台" prop="publicPlats" label-width= '110px'  class="publicPlate" style="margin-bottom: 19px"> 
                            <el-select v-model="confirmCompanyForm.publicPlats"  multiple placeholder="请选择公共信用平台" style="width: 209px;">
                                <el-option
                                    v-for="(el, index) in publicPlatform"
                                        :key="el.id"
                                        :label="el.name"
                                        :value="el.name"
                                    >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col> 
                    <el-col :span="12">
                        <el-form-item label="市场信用平台" prop="marketPlats" label-width= '110px' class="publicPlate" style="margin-bottom: 19px"> 
                            <el-select v-model="confirmCompanyForm.marketPlats"  multiple placeholder="请选择市场信用平台" style="width: 209px;">
                                <el-option
                                    v-for="(el, index) in creditPlatform"
                                    :key="el.id"
                                    :label="el.name"
                                    :value="el.name">
                                </el-option>
                            </el-select>
                          </el-form-item>
                     </el-col> 
                </el-row>
                <el-row :span="24">
                    <el-col :span="24">
                        <el-form-item label="其他" prop="otherPlatform" label-width= '110px' class="otherPlate" style="margin-top: 10px"> 
                            <el-input  v-model="confirmCompanyForm.otherPlatform" name="otherPlatform" placeholder="其他"></el-input>
                          </el-form-item>
                     </el-col> 
                </el-row>
            </el-form-item>
            <el-form-item label="修复信息条数："    style="width: 100%;">
                    <el-input
                        v-model="confirmCompanyForm.repairCount"
                        placeholder="请输入修复信息条数"
                        name="repairCount"
                        onkeyup="value=(value.replace(/\D/g,'')==''?'':parseInt(value))"
                    ></el-input>
            </el-form-item>
            <el-form-item label="期望修复时间："    style="width: 100%;">
                <el-date-picker
                   v-model="confirmCompanyForm.repairDate"
                   type="date"
                   placeholder="选择日期"
                   style="width: 100%;"
                  :picker-options="pickerOptions"
                   >
               </el-date-picker>
            </el-form-item>
            <el-form-item label="申请人姓名：" prop="applyName">
                <el-input
                    v-model="confirmCompanyForm.applyName"
                    placeholder="请输入申请人姓名"
                    name="applyName"
                ></el-input>
            </el-form-item>
                <el-row :span="24">
                    <el-col :span="14">
                         <el-form-item  label="手机号码："  prop="applyPhone"   class="stylePhone1"  style="position: relative">
                             <el-input
                                 v-model="confirmCompanyForm.applyPhone"
                                 placeholder="请输入手机号码"
                                 style="position: relative;width: 100%;margin-left: 0px;"
                                 name="applyPhone"
                             ></el-input>
                             <el-button
                             :loading="loading"
                             :disabled="sum1 < 60"
                             @click.native.prevent="checkPhone2(confirmCompanyForm.applyPhone)"
                             type="primary"
                             size="small"
                             style="position: absolute; right: 36px; top: 4px;"
                         >
                             {{ sum1 === 60 ? '获取验证码' : sum1 +
                             's后重新获取' }}
                         </el-button>
                         </el-form-item>
                    </el-col>
                    <el-col :span="10">
                     <el-form-item
                        label="验证码："
                        prop="smsCode"
                        style="position: relative;width: 100%;"
                        v-if="!switchDisabled"
                        label-width='110px'
                        class="stylePhone"
                    >
                        <el-input  v-model.number="confirmCompanyForm.smsCode"  placeholder="请输入验证码" name="smsCode"  style="width: 100%;"></el-input>
                     </el-form-item>
                     </el-col>
                 </el-row>
            <el-form-item label="电子邮箱："  prop="applyEmail">
                <el-input
                    v-model="confirmCompanyForm.applyEmail"
                    placeholder="请输入电子邮箱"
                    name="applyEmail"
                ></el-input>
            </el-form-item>
            <el-form-item label="企业认证材料：" v-if="isShow" >
                <el-row :span="24" >
                    <el-col :span="7">
                        <el-form-item label-width="0" prop="yyzzAtt" style="padding-right: 10px">
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
                              :src="fileUrlBase+confirmCompanyForm.yyzzAtt"
                              class="avatar"
                              alt/>
                            <div
                              v-else
                              class="certify-pic"
                              :style="{'background-image': 'url('+require('../../assets/images/certifyP1.png')+')'}"
                            ></div>
                            <div
                              slot="tip"
                              class="el-upload__tip"
                              v-if="!switchDisabled"
                              style="text-align: center; font-size: 13px; line-height: 22px; position: absolute; bottom: -37px; width: 100%"
                            >营业执照</div>
                          </el-upload>
                        </el-form-item>
                      </el-col>
                      <el-col :span="10">
                        <el-form-item label-width="0" prop="fddbrsfzAtt" style="padding-right: 10px">
                          <el-upload
                            class="avatar-uploader"
                            :action="uploadUrl"
                            :http-request="(p)=>myUpload(p,3)"
                            :show-file-list="false"
                            :before-upload="beforeAvatarUpload"
                            accept=".jpg, .jpeg, .png, .JPG, .JPEG, .PNG"
                            :disabled="switchDisabled"
                          >
                            <img
                              v-if="confirmCompanyForm.fddbrsfzAtt"
                              :src="fileUrlBase+confirmCompanyForm.fddbrsfzAtt"
                              class="avatar"
                              alt
                            />
                            <div
                              class="certify-pic"
                              v-else
                              :style="{'background-image': 'url('+require('../../assets/images/certifyP2.png')+')'}"
                            ></div>
                            <div
                              slot="tip"
                              class="el-upload__tip"
                              v-if="!switchDisabled"
                              style="text-align: center; font-size: 13px; line-height: 22px; position: absolute; bottom: -38px; width: 100%"
                            >法定代表人身份证(头像面)</div>
                          </el-upload>
                        </el-form-item>
                      </el-col>
                      <el-col :span="7">
                        <el-form-item label-width="0" prop="wtsqsAtt">
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
                              :src="fileUrlBase+confirmCompanyForm.wtsqsAtt"
                              class="avatar"
                              alt
                            />
                            <div
                              v-else
                              class="certify-pic"
                              :style="{'background-image': 'url('+require('../../assets/images/certifyP3.png')+')'}"
                            ></div>
                            <div
                              slot="tip"
                              class="el-upload__tip "
                              v-if="!switchDisabled"
                              style="text-align: center; font-size: 13px; line-height: 22px; position: absolute; bottom: -38px; width: 100%;"
                            >
                              授权书扫描件
                              <a
                                :href="fileUrlBase+'/prod/docx/%E6%8E%88%E6%9D%83%E5%A7%94%E6%89%98%E4%B9%A6%EF%BC%88%E6%A8%A1%E6%9D%BF%EF%BC%89.docx'"
                                class="canClick"
                                target="_blank"
                              >委托书模版下载</a>
                            </div>
                          </el-upload>
                        </el-form-item>
                        
                      </el-col>
                </el-row>
            </el-form-item>
            <el-form-item style="line-height: 22px; margin-top: 40px;margin-bottom: 8px" v-if="isShow">
                <div class="el-upload__tip" style="line-height: 22px; color: #999">
                  1. 仅支持jpg、jpeg、png格式，大小不超过2M
                  <br />2. 营业执照信息必须与工商信息一致
                  <br />3.授权委托书扫描件须加盖公章
                </div>
              </el-form-item>
              <el-form-item v-if="isShow">
                <el-checkbox v-model="checked">同意成为风信标-企业信用风险全面管理平台入驻企业</el-checkbox>
              </el-form-item>
            <div style="text-align: center;margin:20px 0 67px 0;" v-if="!switchDisabled">
                <el-button
                    type="primary"
                    @click="preservation('confirmCompanyForm')"
                    style="width: 149px;height: 45px;font-size: 16px"
                    :loading="loginLoading"
                >提交审核</el-button>
                <el-button
                    @click="cancel('confirmCompanyForm')"
                    style="width: 80px;height: 45px;font-size: 16px;"
                >取消</el-button>
            </div>
        </el-form>       
        </div>
        <el-footer>
            <FxbFooter />
        </el-footer>
    </el-container>
</template>

<script>
import FxbHeader from "@/views/layouts/fxb/components/FxbHeader";
import FxbMain from "@/views/layouts/fxb/components/FxbMain";
import FxbFooter from "@/views/layouts/fxb/components/FxbFooter";
import { Api_Send2, Api_fileUrl,Api_Send3 ,Api_upload} from "@/api/baseApi";
import {Api_UserSelfInfo} from "@/api/login";
import { Api_CompanySearch } from "@/api/creditMonitor";
import { getToken } from "@/utils/auth"; // getToken from cookie
import {Api_checkCompanyIsCheck,Api_checkCompanyRepair,Api_checkCompanyId} from "@/api/userCenter/baseInfo";
import axios from 'axios'
import qs from 'qs'
export default {
    components: {
        FxbHeader,
        FxbMain,
        FxbFooter
    },
    data() {
        var validatePublicPlats=(rule, value, callback) =>{
           var {publicPlats,otherPlatform} =this.confirmCompanyForm;
            if(publicPlats.length!=0||otherPlatform!=''){
                callback();
            }else if(value.length==0){
                callback(new Error('失信修复平台三者必填其一')); 
            }else if(value.length!=0){
                this.$refs['confirmCompanyForm'].clearValidate('publicPlats');
                this.$refs['confirmCompanyForm'].clearValidate('otherPlatform');
            }
        }

        var validateMarketPlats=(rule, value, callback) =>{
           var {marketPlats,otherPlatform} =this.confirmCompanyForm;
            if(marketPlats!=''||otherPlatform!==''){
                 callback();
            }else if(value.length==0){
                callback(new Error('失信修复平台三者必填其一'));
            }else if(value.length!=0){
                this.$refs['confirmCompanyForm'].clearValidate('marketPlats');
                this.$refs['confirmCompanyForm'].clearValidate('otherPlatform');
            }
        }

        var validateOtherPlatform=(rule, value, callback) =>{
           var {publicPlats,marketPlats} =this.confirmCompanyForm;
            if(publicPlats.length!=0||marketPlats.length!=0){
                 callback();
            }else if(!value){
                callback(new Error('失信修复平台三者必填其一'));
            }else if(value){
                this.$refs['confirmCompanyForm'].clearValidate('marketPlats');
                this.$refs['confirmCompanyForm'].clearValidate('publicPlats');
            }
        }
        var checkPhone = (rule, value, callback) => {
            const phoneReg = /^1[3|4|5|7|8|9|6][0-9]{9}$/
                if (!value) {
                return callback(new Error('电话号码不能为空'))
                }
                setTimeout(() => {
                if (!Number.isInteger(+value)) {
                    callback(new Error('请输入数字值'))
                } else {
                    if (phoneReg.test(value)) {
                    callback()
                    } else {
                    callback(new Error('电话号码格式不正确'))
                    }
                }
            }, 100)
        }
       
        var validateEmail = (rule, value, callback)=> {
            const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
            if (!value) {
                return callback(new Error('邮箱不能为空'))
            }
            if (!mailReg.test(value)) {
                return  callback(new Error('请输入正确的邮箱格式'))
            }
        }
        return {
            isShow: true,
            checked:false,
            loginLoading: false,
            pickerOptions:{
                  disabledDate(time) {
                    //如果没有后面的-8.64e7就是不可以选择今天的 
                      return time.getTime() < Date.now() - 8.64e7;
                  }
            },
            publicPlatform:[  {
                id:1,
               name: '国家信用信息平台'
            },
            {
                id:2,
               name: '省信用信息平台'
            },
            {
                id:3,
                name:'市信用信息平台'
            }],
            sum1: 60,
            creditPlatform: [
            {
                id:1,
               name: '企查查'
            },
            {
                id:2,
               name: '天眼查'
            },
            {
                id:3,
                name:'启信宝'
            }
           ], 
            uploadUrl: Api_fileUrl() + "image/",
            switchDisabled: false,
            loading: false,
            isdisabled: false,
            curUploadFileNum1: -1, // 传递给后台的图片顺序
            curUploadFileNum2: -1, // 传递给后台的图片顺序
            curUploadFileNum3: -1, // 传递给后台的图片顺序
            confirmCompanyForm: {
                companyId:'',
                remarks:'',
                companyName:'',
                legalUserName:'',
                code: "",
                address:'',
                otherPlatform:'',
                repairCount:'',
                repairDate:'',
                applyName:'',
                applyPhone:'',
                applyEmail:'',
                publicPlats:[],//公共平台
                marketPlats:[],//市场平台
                smsCode:'',
                yyzzAtt:'',//营业执照附件
                wtsqsAtt:'',//授权委托书
                fddbrsfzAtt:'',//法定代表人头像照
                fddbrXm:'',
                fddbrSfzh:''
            },
            isAuthNum:false,
            fileUrlBase: process.env.VUE_APP_FILE_API,
            confirmCompanyRules: {
                companyName: [{ required: true, message: "请输入企业名称", trigger: "blur" },{ max: 50, message: "长度不能超过50位" }],
                applyName: [{ required: true, message: "请输入申请人姓名", trigger: "blur" },{ max: 50, message: "长度不能超过50位" }],
                code: [{required: true, message: "请输入统一社会信用代码" ,trigger: "blur" }],
                legalUserName: [{required: true, message: "请输入法定代表人姓名" ,trigger: "blur" }],
                smsCode: [ 
                    { required: true, message: "请输入短信验证码", trigger: "blur" },
                    {
                        max: 6,
                        message: "必须为数字，且长度为6位",
                        trigger: "blur",
                        pattern: /^\d{6}$/
                    }
                ],
                applyEmail: [{required: true, trigger: "blur", message: "邮箱必填"}, {type: "email", message: '邮箱格式不正确',trigger: 'blur'}],
                applyPhone: [{ required: true, message: "请输入手机号码" ,trigger: "blur"},{ validator: checkPhone, trigger: 'blur' }],
                address: [{ required: true, message: "请输入企业注册地址", trigger:"blur" }],
                remarks: [{ required: true, message: "请输入信用修复描述", trigger: "blur" },{ max: 500, message: "长度不能超过500位", trigger: 'blur' }],
                yyzzAtt: [{ required: true,  message: "请上传营业执照" , trigger: 'change'}],
                fddbrsfzAtt:[{ required: true,  message: "请上传正确的身份证件照",trigger: 'change' }],
                wtsqsAtt: [{ required: true, message: "请上传授权委托书扫描件",trigger: 'change' }],
            },
        };
    },
    computed: {
        userInfo() {
            return this.$store.state.user.userInfo;
        }
    },
    mounted() {
        Api_UserSelfInfo().then(res=>{
            this.confirmCompanyForm.applyEmail = res.email
            this.confirmCompanyForm.applyPhone =res.mobile
            this.confirmCompanyForm.applyName = res.name? res.name:''
            this.confirmCompanyForm.companyId = res.companyId
            // if (this.confirmCompanyForm.marketPlats == ""){
            //     this.confirmCompanyForm.marketPlats = []
            // }
            // if (this.confirmCompanyForm.publicPlats == ""){
            //     this.confirmCompanyForm.publicPlats = []
            // }
            this.checkCompanyId(res.companyId)
        })
    },
    methods:{
        checkCompanyId(companyId){
            Api_checkCompanyId(companyId).then(res=>{
                this.confirmCompanyForm.code = res.code == 'NULL'?'无': res.code
                this.confirmCompanyForm.address = res.address
                this.confirmCompanyForm.companyName = res.companyName
                this.confirmCompanyForm.legalUserName = res.legalUserName
                //  false是未认证 true认证了
                if (res.isAuth){
                    this.isdisabled = true
                    this.isShow = false
                    this.isAuthNum = true
                }else {
                    this.isdisabled = false
                    this.isAuthNum = false
                    this.isShow = true
                }
            })
        }, 
        isAuth(){
            return new Promise(resolve=>{
                if (this.confirmCompanyForm.companyName == "") {
                    this.confirmCompanyForm.code = ""
                    this.confirmCompanyForm.address = ""
                    this.confirmCompanyForm.companyName = ""
                    this.confirmCompanyForm.legalUserName = ""
                }else {
                    Api_checkCompanyIsCheck({companyName: this.confirmCompanyForm.companyName}).then(res=>{
                        //判断企业认证false 表示 已经认证过了 就不显示   true 就没认证过 显示
                        if  (res.result){
                            this.isShow = true
                            resolve(res.result)
                        }else{
                            this.$alert("当前企业已被其他用户认证成功，请确认这是否是您所属企业，如有疑问请联系客服进行反馈", "提示", { type: "warning" });
                            this.isShow = false
                            return false
                        }
                    }) 
                }
            })
        },
        handleSelect(item) {
            this.confirmCompanyForm.code = item.creditCode == 'NULL'?'无': item.creditCode;
            this.confirmCompanyForm.address = item.address;
            this.confirmCompanyForm.legalUserName = item.operName;
            this.confirmCompanyForm.companyId = item.companyId
            this.$refs["confirmCompanyForm" ].clearValidate('legalUserName');
            this.$refs["confirmCompanyForm" ].clearValidate('address');
            this.$refs["confirmCompanyForm" ].clearValidate('code');
            this.isAuth()
        },
        cancel(){
            this.$refs["confirmCompanyForm" ].resetFields();
            this.$router.push('/creditRestoration')
        },
        querySearch(queryString, cb) {
            Api_CompanySearch(queryString)
                .then(res => {
                const temp = [];
                for (const elem of res.returnData) {
                    temp.push({
                        value: elem.name,
                        companyId: elem.id,
                        operName: elem.operName,
                        address: elem.address,
                        creditCode: elem.creditCode,
                    });
                }
                    cb(temp);
            })
            .catch(e => {
                cb([]);
               this.$message.warning("请输入更详细的关键词");
            });
        },
        preservation(formName){
            this.$refs['confirmCompanyForm'].validate(valid => {
                if ( this.isAuthNum ){
                    if (valid){
                        if (this.confirmCompanyForm.otherPlatform == "" && this.confirmCompanyForm.marketPlats == ""  && this.confirmCompanyForm.publicPlats == "" ){
                            this.$message.error("请至少选择一种失信修复平台");
                            return false
                        }
                        // if (this.confirmCompanyForm.marketPlats == ""){
                        //     this.confirmCompanyForm.marketPlats = [""]
                        // }
                        // if (this.confirmCompanyForm.publicPlats == ""){
                        //     this.confirmCompanyForm.publicPlats = [""]
                        // }
                        this.loginLoading = true;
                        var temp =  {repairDate: this.$dateFormat(this.confirmCompanyForm.repairDate)}
                        this.confirmCompanyForm = Object.assign({},this.confirmCompanyForm,temp)
                        Api_checkCompanyRepair(this.confirmCompanyForm).then(res=>{
                            this.$message.success(res)
                            this.loginLoading = false;
                            setTimeout(()=>{
                                this.$router.push('/front/creditManagement/todo')
                            },500)
                        }).catch(e => {
                            this.loginLoading = false;
                            this.$message.error(e);
                            // if (this.confirmCompanyForm.marketPlats == ""){
                            //     this.confirmCompanyForm.marketPlats = [];
                            // }
                            // if (this.confirmCompanyForm.publicPlats == ""){
                            //     this.confirmCompanyForm.publicPlats = [];
                            // }
                        }); 
                    }
                }else {
                    this.isAuth().then(res=>{
                        if (res){
                            if (valid){
                                if (this.confirmCompanyForm.otherPlatform == "" && this.confirmCompanyForm.marketPlats == ""  && this.confirmCompanyForm.publicPlats == "" ){
                                    this.$message.error("请至少选择一种失信修复平台");
                                    return false
                                }
                                if(this.checked) {
                                    // if (this.confirmCompanyForm.marketPlats == ""){
                                    //     this.confirmCompanyForm.marketPlats = [""]
                                    // }
                                    // if (this.confirmCompanyForm.publicPlats == ""){
                                    //     this.confirmCompanyForm.publicPlats = [""]
                                    // }
                                    this.loginLoading = true;
                                    var temp =  {repairDate: this.$dateFormat(this.confirmCompanyForm.repairDate)}
                                    this.confirmCompanyForm = Object.assign({},this.confirmCompanyForm,temp)
                                    Api_checkCompanyRepair(this.confirmCompanyForm).then(res=>{
                                        this.$message.success(res)
                                        this.loginLoading = false;
                                        setTimeout(()=>{
                                            this.$router.push('/front/creditManagement/todo')
                                        },500)
                                    }).catch(e => {
                                        this.loginLoading = false;
                                        this.$message.error(e);
                                        // if (this.confirmCompanyForm.marketPlats == ""){
                                        //     this.confirmCompanyForm.marketPlats = [];
                                        // }
                                        // if (this.confirmCompanyForm.publicPlats == ""){
                                        //     this.confirmCompanyForm.publicPlats = [];
                                        // }
                                    }); 
                                }else {
                                    this.loginLoading = false;
                                    this.$message.error("请同意风信标入驻企业平台");
                                    // if (this.confirmCompanyForm.marketPlats == ""){
                                    //     this.confirmCompanyForm.marketPlats = [];
                                    // }
                                    // if (this.confirmCompanyForm.publicPlats == ""){
                                    //     this.confirmCompanyForm.publicPlats = [];
                                    // }
                                }
                            }
                        }
                    })
                }
            })
        },
        checkPhone2(formNamePhone) {
            // 倒计时60秒后,可以重新发送短信
            if(!formNamePhone){
                this.$message.error('请输入手机验证码');
                return 
            }
            
            Api_Send2({
                mobile: formNamePhone,
                templateType: "2"
            })
            .then(res => {
                this.sum1 = 60;
                this.timer1 = setInterval(() => {
                    this.sum1--;
                    if (this.sum1 < 1) {
                        this.sum1 = 60;
                        clearInterval(this.timer1);
                    }
                }, 1000);
                this.$message.success(res);
            })
            .catch(e => {
                this.$message.error(e);
                this.sum1 = 60;
                clearInterval(this.timer1);
                return
            });
        },
        checkSfz(file) {
            var formData = new FormData(); //初始化一个FormData对象
            formData.append("api_key", "gfz2QAgdh7ODJiB6_qAWm1S9v1pwqAzX");
            formData.append("api_secret", "PbSpMk1lBimOLceT7kzPQf_3rv1J5btv");
            formData.append("image_file",  file); //将文件塞入FormData
            axios({
                method: "post",
                url: "https://api-cn.faceplusplus.com/cardpp/v1/ocridcard",
                data: formData,
            }).then(res => {   
                if (res.data.cards.length <= 0) {
                            //图片不是身份证图片
                    this.$alert("二代身份证人像面上传错误！", "提示", { type: "warning" });
                    this.confirmCompanyForm.fddbrsfzAtt = ""
                } else {
                    var sfz_img_type = res.data.cards[0].side;
                    if (sfz_img_type == "back") {
                    this.$alert("二代身份证人像面上传错误！", "提示", { type: "warning" });
                    this.confirmCompanyForm.fddbrsfzAtt = ""
                    } else {
                    //正确上传身份证正面 解析数据
                    this.confirmCompanyForm.fddbrXm = res.data.cards[0].name
                    this.confirmCompanyForm.fddbrSfzh = res.data.cards[0].id_card_number
                    }
                }
            })
        },
        beforeAvatarUpload(file) {
            const isMatch = /\.(jpg|jpeg|png|JPG|JPEG|PNG)$/.test(file.name);
            const isLt2M = file.size / 1024 < 10240;
            if (!isMatch) {
                this.$message.warning("仅支持jpg、jpeg、png格式");
            }
            if (!isLt2M) {
                this.$message.warning("图片大小不超过10M");
            }
            return isMatch && isLt2M;
        },
        myUpload(content, type) {
        let num = 0;
        if (type === 1) {
            this.curUploadFileNum1++;
            num = this.curUploadFileNum1;
        } else if (type === 2) {
            this.curUploadFileNum2++;
            num = this.curUploadFileNum2;
        }else {
            this.curUploadFileNum3++;
            num = this.curUploadFileNum3;
        }
        const formData = new FormData();
        formData.append("file", content.file);
        this.batchLoading = true;
        Api_upload(this.uploadUrl + num, formData)
            .then((res) => { 
            if (type == 1) {
                this.confirmCompanyForm.yyzzAtt = res.url;
                this.$refs["confirmCompanyForm" ].clearValidate('yyzzAtt');
            } else if (type == 2) {
                this.confirmCompanyForm.wtsqsAtt = res.url;
                this.$refs["confirmCompanyForm" ].clearValidate('wtsqsAtt');
            } else if (type == 3) {
                this.confirmCompanyForm.fddbrsfzAtt = res.url;
                this.$refs["confirmCompanyForm" ].clearValidate('fddbrsfzAtt');
                this.checkSfz(content.file)
            } 
            })
            .catch((e) => {
            this.$message.error(e);
            });
        },
    }
};
</script>

<style lang="scss" scoped>
.creditapply {
    width: 1160px;
    margin: 0 auto;
    background-color: #fff;
 .creditTitle{
    font-size: 20px;
    line-height: 28px;
    position: relative;
    padding-left: 60px;
    margin-top: 34px;

 }
 .creditTitle::before {
     content:'';
     display: block;
     width: 8px;
     height: 30px;
     position: absolute;
     left: 38px;
     top: -2px;
     background-color: #3399e6;
 }
}
.certify-pic {
  background-color: #f7f8fb;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-repeat: no-repeat;
  background-size: auto 100%;
  background-position: center center;
}
.confirm-company {
  margin-left: 150px;
  margin-right: 155px;
  padding-top: 40px;
  box-sizing: border-box;
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

  /deep/.el-form-item {
    margin-bottom: 27px;
  }
  /deep/.avatar-uploader .el-upload {
    height: 180px !important;
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
    width: 100%;
    height: 100%;
    display: block;
  }
}
/deep/ textarea.el-textarea__inner {
   resize : none !important;
}
/deep/.confirm-company .el-input__inner{
    width: 686px;
}
/deep/ .stylePhone .el-input__inner {
    width: 245px !important;
}
/deep/ .stylePhone1 .el-input__inner {
    width: 300px !important;
}
/deep/ .publicPlate .el-input__inner{
    width: 232px !important;
}
/deep/ .otherPlate .el-input__inner{
    width: 575px !important;
}
</style>
