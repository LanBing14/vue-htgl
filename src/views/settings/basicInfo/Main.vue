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
    <el-form-item>
     <div class="avarUpload">
      <el-upload
      action=""
      :auto-upload="false"
      :on-change='handleExceed'
      :show-file-list="false"
      accept=".jpg, .png"
      >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" >
      <img  v-else src="@/assets/images/touxiang_jg.png" class="avatar" >
      <el-button size="large" type="primary" class="btnavatar">修改头像</el-button>
    </el-upload>
     </div>
  </el-form-item>
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
      <el-form-item label="所属公司" v-if="false">
        <template v-if="!isChildUser">
          <el-input v-model="basicInfoForm.companyName"  :disabled="disabledconpany"></el-input>
          <p style="color: #F56C6C;font-size: 12px" class="company" v-if="hasCompany">请输入所属公司名</p>
          <el-button
            v-if="historyData.status!=='1'&& historyData.status!=='2'" 
            type="primary"
            size="medium"
            @click="confirmCompany()"
            style="position: absolute; right: -108px; top: 2px;">{{ confirmState }}</el-button>
          <span v-if="historyData.status==='1'|| historyData.status==='2'" style="color: #67C23A;position: absolute; right: -66px; top: 2px;">{{confirmState}}</span>
          <!-- <span v-if="historyData.status==='2'" class="rz-success">认证成功，如果认证信息已变更请再次认证</span> -->
        </template>

        <el-input v-else v-model="userInfo.saasName" :disabled="disabled"></el-input>
      </el-form-item>
      <!--            <el-form-item label="职位" prop="position">-->
      <!--                <el-input v-model="basicInfoForm.position" placeholder="请输入职位"></el-input>-->
      <!--            </el-form-item>-->
      <el-form-item label="所属部门" v-if="isChildUser">
        <el-input v-model="userInfo.deptName" disabled></el-input>
      </el-form-item>

      <el-form-item style="padding-top:8px;">
        <el-button type="primary" @click="submitForm('basicInfoForm')" style="width: 98px;">保存</el-button>
        <el-button @click="resetUserInfo()" style="margin-left: 9px;">重置</el-button>
      </el-form-item>
    </el-form>

    <el-dialog
      title="修改手机号"
      :before-close="changePhoneBeforeClose"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      :append-to-body="true"
      width="500px"
    >
      <el-form
        :model="changePhoneForm"
        :rules="rules1"
        v-loading="loading"
        ref="changePhoneForm"
        label-width="100px"
        class="change-phone"
      >
        <el-form-item label="手机号码" prop="mobile" class="">
          <el-input v-model="changePhoneForm.mobile" placeholder="请输入新手机号码" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="图形验证码" prop="code" style="position: relative;">
          <el-input v-model="changePhoneForm.code" placeholder="请填写图形验证码" size="medium"></el-input>
          <span @click="changeCaptcha" class="change-code" style="position: absolute; right: 7px; top: -1px;">
            <img :src="codeSrc" alt="验证码" height="100%" width="80" />
          </span>
        </el-form-item>
        <el-form-item label="短信验证码" prop="smsCode" style="position: relative;">
          <el-input v-model.number="changePhoneForm.smsCode" placeholder="请填写短信验证码" size="medium"></el-input>
          <div></div>
          <el-button
            :loading="loading"
            :disabled="sum < 61"
            @click.native.prevent="checkPhone(changePhoneForm.mobile)"
            type="primary"
            size="small"
            style="position: absolute; right: 6px; top: 4px; padding: 9px 10px"
          >
            {{ sum === 61 ? '获取验证码' : sum +
            's后重新获取' }}
          </el-button>
        </el-form-item>
        <div style="text-align: center; margin: 35px 0 15px">
          <el-button
            type="primary"
            @click="saveEditPhone('changePhoneForm')"
            size="medium"
            :loading="submitLoading"
          >保存</el-button>
          <el-button @click="cancelEditPhone" size="medium">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog title="图片剪裁" :visible.sync="dialogVisibleSure" append-to-body>
      <div class="cropper-content">
        <div class="cropper" style="text-align:center">
          <vueCropper
            ref="cropper"
            :img="option.imageUrl"
            :outputType="option.outputType"
            :info="option.info"
            :canScale="option.canScale"
            :autoCrop="option.autoCrop"
            :autoCropWidth="option.autoCropWidth"
            :autoCropHeight="option.autoCropHeight"
            :fixed="option.fixed"
            :fixedBox="option.fixedBox"
            :fixedNumber="option.fixedNumber"
          ></vueCropper>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleSure = false">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="finish" >确认</el-button>
      </div>
    </el-dialog>
    
  </el-row>
</template>

<script>
import { VueCropper } from 'vue-cropper'
import {
  API_GetInfoByCurrentUser,
  API_GetStatusByCompanyId,
  API_SaveEnterpriseCertification,
  Api_EditPhoneNo,
  Api_UpdateUserInfo,
  API_EnterpriseCertHistory, 
  Api_checkCompanyIsCheck
} from "@/api/userCenter/baseInfo";
import { Api_CompanySearch } from "@/api/creditMonitor";
import { Api_Send2, Api_fileUrl,Api_Send3 ,Api_fileUrl1} from "@/api/baseApi";
import { Api_LoginByUsername,Api_UserSelfInfo } from "@/api/login";
import {
  getJessionID,
  getUserInfo,
  getUserStore,
  setJessionID,
  setToken,
  setRefToken,
  getRefToken,
} from "@/utils/auth";
import { uuid, validPhone } from "@/utils/index";
import axios from 'axios'
import store from "@/store";
import { isNull } from "@/utils/commonUtils";
import { Api_upload, Api_GetCompanyInfoById ,userPicture} from "@/api/baseApi";
import { Api_getKaptcha } from "@/api/login";
import { fxb } from "@/utils/variables";

export default {
  name: "BasicInfo",
  components: {
     VueCropper,
  },
  data() {
    return {
      hasCompany: false,
      loading: false,
      option: {
        imageUrl: '', // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputType: 'jpeg', // 裁剪生成图片的格式
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 150, // 默认生成截图框宽度
        autoCropHeight: 150, // 默认生成截图框高度
        fixedBox: false, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [1, 1], // 截图框的宽高比例
        full: true, // 是否输出原图比例的截图
        canMoveBox: false, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: false, // 截图框是否被限制在图片里面
        infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        canMove:true,
      },
       dialogVisibleSure: false,
       dialogImageUrl: '',
       imageUrl:'',
        dialogVisible: false,
        dialogVisibleRemind: false,
        historyDataName:'',
        disabled: false,
        disabledconpany: false,
      fileUrlBase: process.env.VUE_APP_FILE_API,
      fxb,
      baseUrl: process.env.VUE_APP_BASE_API,
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
        companyName: "",
        email: "",
        position: "",
        jobInfo2: "",
      },
      rules: {
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { pattern: /^1[3456789]\d{9}$/, message: "请输入正确的手机号" },
        ],
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { max: 100, message: "长度不能超过100个字" },
        ],
        email: [
          { required: true, message: "请输入电子邮箱", trigger: "blur" },
          { max: 300, message: "长度不能超过300个字" },
          {
            pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
            message: "请输入正确的邮箱",
          },
        ],
        position: [
          {  required: true, message: "请输入所属公司名", trigger: "blur" },
          { max: 50, message: "长度不能超过50个字", trigger: "blur" }
        ],
      },
      // 修改手机号
      dialogVisible: false,
      changePhoneForm: {
        mobile: "",
        smsCode: "",
        code: "",
      },
      rules1: {
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { pattern: /^1[3456789]\d{9}$/, message: "请输入正确的手机号" },
        ],
        smsCode: [
          { required: true, message: "请输入短信验证码", trigger: "blur" },
          {
            message: "必须为数字，且长度不能超过6位",
            trigger: "blur",
            pattern: /^\d{6}$/,
          },
        ],
        code: [
          { required: true, message: "请输入图形验证码", trigger: "blur" },
          { max: 4, message: "长度不能超过4位", trigger: "blur" },
        ],
      },
      randomNum: Math.random(),
      confirmCompanyVisible: false,
      confirmCompanyForm: {
        id: "",
        code: "",
        companyId: "",
        name: "",
        smsCode: "",
        yyzzAtt: "",
        wtsqsAtt: "",
        version: "",
      },
      fileList: [],
      confirmCompanyRules: {
        name: [{ required: true, message: "请输入企业名称", trigger: "blur" }],
        code: [
          { required: true, message: "查询不到统一社会信用代码" },
          { max: 50, message: "长度不能超过50位" },
        ],
        smsCode: [
          { required: true, message: "请输入短信验证码", trigger: "blur" },
          {
            max: 6,
            message: "必须为数字，且长度为6位",
            trigger: "blur",
            pattern: /^\d{6}$/,
          },
        ],
        yyzzAtt: [{ required: true, trigger: "blur", message: "请上传营业执照" }],
        wtsqsAtt: [{ required: true, trigger: "blur", message: "请上传授权委托书扫描件" }],
      },
      dialogAddVisibleLoading: false,
      batchLoading: false,
      uploadUrl: Api_fileUrl() + "image/",
      uploadUrl1: Api_fileUrl1() + "0",
      // confirmState: "企业认证",
      confirmStateCode: "",
      returnData: "",
      auditRemark: "",
      copySelectCompanyName: "", // 备份一份用户认证时候从列表里选择的企业名称
      // isChildUser: false,
      isConfirm1: false,
      historyData: {}, // 企业认证历史
      curUploadFileNum1: -1, // 传递给后台的图片顺序
      curUploadFileNum2: -1, // 传递给后台的图片顺序
      fileUrl:'',
    };
  },
  computed: {
     // 上传的服务器url
     actionBaseUrl() {
      return   Api_fileUrl() + "image/"
    },
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
      if (this.historyData.id && this.historyData.status === "3") {
        return "认证失败";
      }
      if (this.historyData.id && this.historyData.status === "2") {
        this.disabledconpany = true
        return "认证成功";
      }
      if (this.historyData.id && this.historyData.status === "1") {
        this.disabledconpany = true
        return "认证中";
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
    },
},
  watch: {
    userInfo() {
      this.initData();
    },
    'basicInfoForm.companyName'(){
      if (this.basicInfoForm.companyName){
        this.hasCompany = false
      }
     
    }  
  },
  // 初始化数据
  mounted() {
    this.getHistory();
    this.initData();
    Api_UserSelfInfo().then(res=>{
      this.imageUrl = (res.headPortrait && res.headPortrait.url) ? process.env.VUE_APP_FILE_IMG_API + res.headPortrait.url : ' '
      this.fileUrl = res.headPortrait && res.headPortrait.url
      this.historyDataName = res.saasName;
      this.basicInfoForm.companyName = this.historyData.name ?this.historyData.name : res.saasName;
      if (!this.$store.state.user.userInfo.registerFlag) {
       this.disabledconpany = true
      }
    })
  },
  methods: {
    finish() {
      this.$refs.cropper.getCropData((data) => {
          this.dialogVisibleSure = false
          let formData = new FormData()
          this.imageUrl = data
          formData.append("baseFile",data);
          userPicture(formData).then(res=>{
            this.fileUrl = res.url
            Api_UpdateUserInfo({
              name: this.basicInfoForm.name,
              email: this.basicInfoForm.email,
              position: this.basicInfoForm.position,
              url: res.url,
              companyName: this.basicInfoForm.companyName
             })
              .then((data) => {
                this.$message.success("保存成功");
                this.$store.commit('SET_HeadImage', res.url)
                this.refreshUserInfo();
              })
              .catch((e) => {
                console.log(e);
                this.$message.error(e);
              });
          }) 
         
      })
    },
    handleExceed(file){
      const isMatch = /\.(jpg|png|JPG|PNG)$/.test(file.name);
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isMatch) {
        this.$message.warning("仅支持jpg、jpeg、png格式");
        return false
      }
      if (!isLt2M) {
        this.$message.warning("图片大小不超过5M");
        return false
      }
      this.fileinfo = file
        //上传成功后将图片地址赋值给裁剪框显示图片
      this.$nextTick(() => {
        this.option.imageUrl = URL.createObjectURL(file.raw)
        this.dialogVisibleSure = true
      })
    },
    // 获取企业认证历史
    getHistory() {
      API_EnterpriseCertHistory().then((res) => {
        this.historyData = res || {};
        if (res && res.status && res.status === "2") {
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
      this.basicInfoForm.companyName = this.userInfo.saasName;
     
    },
    // 修改密码关闭清空数据
    changePhoneBeforeClose() {
      this.dialogVisible = false;
      this.sum = 61;
      clearInterval(this.timer);
      this.resetForm("changePhoneForm");
    },
    // 修改手机号码弹窗验证手机
    checkPhone(formNamePhone) {
      if (!validPhone(formNamePhone)) {
        this.$message({
          message: "请输入正确的11位手机号码",
          type: "warning",
          duration: 5 * 1000,
        });
        return false;
      }

      if (isNull(this.changePhoneForm.code)) {
        this.$message({
          message: "请输入图形验证码",
          type: "warning",
          duration: 5 * 1000,
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
      Api_Send3({
        mobile: formNamePhone,
        templateType: "3",
      })
        .then((res) => {
          this.$message.success(res);
        })
        .catch((e) => {
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
        templateType: "2",
      })
        .then((res) => {
          this.$message.success(res);
        })
        .catch((e) => {
          this.$message.error(e);
        });
    },
    // 保存修改手机号
    saveEditPhone(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          Api_EditPhoneNo({
            mobile: this.changePhoneForm.mobile,
            smsCode: this.changePhoneForm.smsCode,
            randomStr: this.randomStr,
            code: this.changePhoneForm.code,
          })
            .then((data) => {
              this.$message.success(data);
              this.submitLoading = false;
              // 修改成功
              this.dialogVisible = false;
              this.basicInfoForm.mobile = this.changePhoneForm.mobile;
              this.refreshUserInfo();
              this.resetForm("changePhoneForm");
            })
            .catch((e) => {
              this.submitLoading = false;
              this.$message.error(e);
              // 清空验证码输入框
              // this.changePhoneForm.picNo = "";
              this.changeCaptcha();
            });
        }
      });
    },
    cancelEditPhone(){
      this.sum = 61;
      clearInterval(this.timer);
      this.dialogVisible = false;
      this.resetForm("changePhoneForm");
    }, 
    submitForm(formName) {
      let $this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          $this.handelSelf()
          // if (!$this.basicInfoForm.companyName) {
          //   $this.hasCompany = true
            
          //   return false
          // }
        //  //校验企业
        //   Api_checkCompanyIsCheck({companyName: $this.basicInfoForm.companyName}).then(res=>{
        //     $this.hasCompany = false
        //     if (res.result){
        //       $this.handelSelf()
        //     }else {
        //       $this.$alert("该企业已被认证，请重新输入！如有疑义，请联系客服。", "提示", { type: "warning" });
        //       return false
        //     }
        //  })
        }
      });
    },
    //  保存
    handelSelf(){
      let $this = this
      Api_UpdateUserInfo({
              name: $this.basicInfoForm.name,
              email: $this.basicInfoForm.email,
              position: $this.basicInfoForm.position,
              url: $this.fileUrl ? $this.fileUrl :' ',
              companyName: $this.basicInfoForm.companyName
             })
              .then((data) => {
                $this.$message.success("保存成功");              
                $this.refreshUserInfo();
              })
              .catch((e) => {
                console.log(e);
                $this.$message.error(e);
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
      if (!this.$store.state.user.userInfo.registerFlag) {
        this.$alert("平台暂时不支持企业团队成员申请认证企业。", "提示", { type: "warning" });
        return false;
      }
      // 修改功能,弹窗不显示
      this.confirmCompanyVisible = false;
      // 改成跳转到认证页面,至于是不是要传参数过去,之后再说
      if (this.basicInfoForm.companyName){
        this.$router.push({
          name:'enterpriseCertification',
          query:{
            name: this.basicInfoForm.companyName
          }
        })
      }else {
        this.$alert("请您输入所属公司的企业名称。", "提示", { type: "warning" });
      }
      Object.keys(this.confirmCompanyForm).forEach((key) => {
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
        .then((res) => {
          const temp = [];
          for (const elem of res.returnData) {
            temp.push({
              value: elem.name,
              id: elem.id,
              code: elem.creditCode,
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
        .catch((e) => {
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
    // 仅支持jpg、jpeg、png格式，大小不超过10M
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
      } else {
        this.curUploadFileNum2++;
        num = this.curUploadFileNum2;
      }
      const formData = new FormData();
      formData.append("file", content.file);
      this.batchLoading = true;
      Api_upload(this.uploadUrl + num, formData)
        .then((res) => {
          if (type === 1) {
            this.confirmCompanyForm.yyzzAtt = res.url;
          } else {
            this.confirmCompanyForm.wtsqsAtt = res.url;
          }
        })
        .catch((e) => {
          this.$message.error(e);
        });
    },
    saveCompanyForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveEnterpriseCertification();
        }
      });
    },
    cancelCompanyForm(){
        this.confirmCompanyVisible = false;
        this.num = 61;
        clearInterval(this.timer);
        this.resetForm("confirmCompanyForm");
        this.copySelectCompanyName = "";
    },
    saveEnterpriseCertification() {
      const loading = this.$openLoading();
      API_SaveEnterpriseCertification(this.confirmCompanyForm)
        .then((data) => {
          this.getHistory();
          this.confirmCompanyVisible = false;
          this.resetForm("confirmCompanyForm");
          loading.close();
          this.$message.success(data);
        })
        .catch((e) => {
          loading.close();
          this.$message.error(e);
        });
    },
    refreshUserInfo() {
      const refresh_token = getRefToken();
      Api_LoginByUsername({
        grant_type: "refresh_token",
        refresh_token,
      }).then(({ access_token, refresh_token }) => {
        setToken(access_token);
        setRefToken(refresh_token);
        store.dispatch("GetUserInfo");
      });
    },
  },
};
</script>

<style lang="scss">
.change-phone{
  .el-form-item{
    margin-bottom:27px;
  }



}
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
.company {
    width: 40%;
    padding: 0 10px;
    background-color: #fef0f0;
    line-height: 30px;
    z-index: 10;
    border-radius: 3px;
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
  position: relative;
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
.cropper-content {
    .cropper {
        width: auto;
        height: 300px;
    }
}
.avarUpload {
  position: absolute;
  top: 45px;
  left: -300px;
  /deep/ .el-button.btnavatar {
    background-color: #fff;
    border: none;
    outline: none;
    color: #4b9df3;
  }
  .avatar {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    display: block;
    margin-bottom: 30px;
  }
}

/deep/ .el-dialog__header {
    border-bottom: none;
}
.fSRemind {
  font-size: 16px;
  line-height: 24px;
  text-align: center;
}
</style>
