<template>
  <div>
    <el-form
      :model="confirmCompanyForm"
      :rules="confirmCompanyRules"
      v-loading="loading"
      ref="confirmCompanyForm"
      label-width="100px"
      class="confirm-company"
    >
      <el-form-item
        v-if="historyData.id && historyData.status==='3'"
        label="失败原因："
        style="margin-top: -10px; border-bottom: 1px solid #eaedf4;"
      >{{ historyData.latestProcessRemark }}</el-form-item>
      <el-form-item label="企业名称" prop="name" style="margin-bottom:20px">
        <el-input
          v-if="historyData.id && historyData.verifyBefore"
          v-model="confirmCompanyForm.name"
          ref="companyRef"
          auto-complete="off"
          autofocus="true"
        ></el-input>
        <el-autocomplete
          v-else
          ref="companyRef"
          v-model="confirmCompanyForm.name"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          placeholder="请输入企业名称"
          style="width: 100%;"
          @select="handleSelect"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label prop="code" v-show="false">
        <el-input v-model="confirmCompanyForm.code" size="small" disabled></el-input>
      </el-form-item>
      <el-form-item label="认证材料">
        <el-row :span="24">
          <el-col :span="7">
            <el-form-item label-width="0" prop="yyzzAtt" style="padding-right: 10px">
              <el-upload
                class="avatar-uploader upload1"
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
                  class="certify-pic upload2"
                  :style="{'background-image': 'url('+require('../../../assets/images/certifyP1.png')+')'}"
                ></div>
                <div
                  slot="tip"
                  class="el-upload__tip"
                  v-if="!switchDisabled"
                  style="text-align: center; font-size: 13px; line-height: 22px; position: absolute; bottom: -29px; width: 100%"
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
                  :style="{'background-image': 'url('+require('../../../assets/images/certifyP2.png')+')'}"
                ></div>
                <div
                  slot="tip"
                  class="el-upload__tip"
                  v-if="!switchDisabled"
                  style="text-align: center; font-size: 13px; line-height: 22px; position: absolute; bottom: -29px; width: 100%"
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
                :before-upload="beforeIdUpload"
                accept=".jpg, .jpeg, .png, .JPG, .JPEG, .PNG"
                :disabled="switchDisabled"
              >
                <img
                  v-if="confirmCompanyForm.wtsqsAtt"
                  :src="fileUrlBase+confirmCompanyForm.wtsqsAtt"
                  class="avatar"
                  alt
                />
                <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
                <div
                  v-else
                  class="certify-pic"
                  :style="{'background-image': 'url('+require('../../../assets/images/certifyP3.png')+')'}"
                ></div>
                <div
                  slot="tip"
                  class="el-upload__tip "
                  v-if="!switchDisabled"
                  style="text-align: center; font-size: 13px; line-height: 22px; position: absolute; bottom: -29px; width: 100%;"
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
      <el-form-item style="line-height: 22px; margin-top: 40px">
        <div class="el-upload__tip" style="line-height: 22px; color: #999">
          1. 仅支持jpg、jpeg、png格式，大小不超过2M
          <br />2. 营业执照信息必须与工商信息一致
          <br />3.授权委托书扫描件须加盖公章
        </div>
      </el-form-item>
      <div style="text-align: center;margin-top:30px;" v-if="!switchDisabled">
        <el-button type="primary" @click="saveCompanyForm('confirmCompanyForm')" size="small">提交审核</el-button>
        <el-button @click="cancelCompanyForm('confirmCompanyForm')" size="small">返回</el-button>
      </div>
    </el-form>
    <!-- 认证成功模态框 -->
   <RiskModel v-show="isShow" :isRemind="true" ref="riskCenter"></RiskModel>
<!-- 
    <el-dialog
      title="提示"
      :visible.sync="dialogVisibleRemind"
      :close-on-click-modal="false"
      :append-to-body="true" 
      width="420px"
      >
    <span class="fSRemind" style="font-size: 22px; text-align: center">您要认证的企业名称与注册时填写的企业不一致，确定要继续进行认证吗？企业认证审核通过后，您原来填写的企业信息将会被替换，请知悉。</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisibleRemind = false">取 消</el-button>
      <el-button type="primary" @click="nextSure">确 定</el-button>
    </span>
  </el-dialog> -->
   <!-- 从企业档案详情、资料设置、我的企业等页面进入的认证申请，弹框提示 -->
   <!-- <el-dialog
    title="提示"
    :visible.sync="dialogVisibleIsSend"
    width="30%"
    center
    append-to-body
    >
      <span class="fSRemindSend">您的认证已经提交，通过审核后，您的企业将获得企业认证标识，请耐心等待平台审核</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="nextSureSend">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>
<script>
import axios from 'axios'
import { Api_CompanySearch } from "@/api/creditMonitor";
import RiskModel from "@/components/Riskexamination"
import conpanyAuthSuccess from "@/components/Riskexamination/conpanyAuthSuccess"
import { Api_Send2, Api_fileUrl,Api_Send3 ,Api_upload} from "@/api/baseApi";
import {changeCompanyName} from "@/api/checkAllResults/checkAllResults"
import {API_SaveEnterpriseCertification,Api_checkCompanyIsCheck} from "@/api/userCenter/baseInfo";
export default {
  components:{
    RiskModel,
    conpanyAuthSuccess
  },
  data() {
    return {
      isShow: false,
      dialogVisibleIsSend: false,
      curUploadFileNum1: -1, // 传递给后台的图片顺序
      curUploadFileNum2: -1, // 传递给后台的图片顺序
      curUploadFileNum3: -1, // 传递给后台的图片顺序
      loading: false,
      switchDisabled: false,
      fileUrlBase: process.env.VUE_APP_FILE_API,
      confirmCompanyRules: {
        name: [{ required: true, message: "请输入企业名称", trigger: "blur" },{ max: 50, message: "长度不能超过50位" }],
        code: [
          { message: "查询不到统一社会信用代码" },
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
        yyzzAtt: [
          { required: true, trigger: "blur", message: "请上传营业执照" }
        ],
        fddbrsfzAtt:[
           { required: true, trigger: "blur", message: "请上传正确的身份证件照" }
        ],
        wtsqsAtt: [
          { required: true, trigger: "blur", message: "请上传授权委托书扫描件" }
        ]
      },
      uploadUrl: Api_fileUrl() + "image/",
      batchLoading: false,
      dialogVisibleRemind: false,
      confirmCompanyForm: {
        id: "",
        fddbrSfzh:'',
        code: "",
        companyId: "",
        name: "",
        // smsCode: "",
        fddbrXm:'',
        yyzzAtt: "",
        wtsqsAtt: "",
        fddbrsfzAtt:'',
        // version: ""
      },
      historyData: {}, // 企业认证历史
      fileID:""
    };
  },
  created() {
    if(this.$route.query.name){
      this.confirmCompanyForm.name = this.$route.query.name 
      this.getCompanyCode()
    }
  },
  computed: {
    userInfo () {
        return this.$store.getters.userInfo.saasName;
    },
  },
  methods: {
    getCompanyCode(){
      changeCompanyName({name: this.$route.query.name}).then(res=>{
        this.confirmCompanyForm.id = res.companyId;
        this.confirmCompanyForm.code = res.creditCode;
        this.confirmCompanyForm.companyId = res.companyId;
      })
    },
    nextSureSend(){
      this.dialogVisibleIsSend = false
      this.$router.go(-1)
    },
     // 获取企业认证历史
    getHistory() {
          API_EnterpriseCertHistory().then(res => {
              this.historyData = res || {};
              if (res.processStatus === "2") {
                  this.refreshUserInfo();
              }
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
      },
    nextSure(){ 
      this.dialogVisibleRemind = false 
      Api_checkCompanyIsCheck({companyName: this.confirmCompanyForm.name}).then(res=>{
           //判断企业认证信息之后
          if (res.result) {
            this.saveEnterpriseCertification();
            return false;
          }else {
            this.$refs.companyRef.focus()
            this.$alert("该企业已被认证，请重新输入！如有疑义，请联系客服。", "提示", { type: "warning" });
            return false
          }
        })
    },
     
    beforeIdUpload(){},
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
          } else if (type == 2) {
            this.confirmCompanyForm.wtsqsAtt = res.url;
          } else if (type == 3) {
            this.confirmCompanyForm.fddbrsfzAtt = res.url;
            this.checkSfz(content.file)
          } 
        })
        .catch((e) => {
          this.$message.error(e);
        });
    },
    saveCompanyForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if( !this.confirmCompanyForm.companyId){
            this.$alert("查询不到统一社会信用代码。", "提示", { type: "warning" });
            this.$refs.companyRef.focus()
            return false
          }
          if (this.confirmCompanyForm.name !== this.$route.query.name){
            this.$confirm("您要认证的企业名称与注册时填写的企业不一致，确定要继续进行认证吗？企业认证审核通过后，您原来填写的企业信息将会被替换，请知悉。", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              Api_checkCompanyIsCheck({companyName: this.confirmCompanyForm.name}).then(res=>{
                //判断企业认证信息之后
                if (res.result) {
                  this.saveEnterpriseCertification();
                  return false;
                }else {
                  this.$refs.companyRef.focus()
                  this.$alert("该企业已被认证，请重新输入！如有疑义，请联系客服。", "提示", { type: "warning" });
                  return false
                }
              })
            });
            return 
          }else {
              Api_checkCompanyIsCheck({companyName: this.confirmCompanyForm.name}).then(res=>{
              //判断企业认证信息之后
                if (res.result) {
                  this.saveEnterpriseCertification();
                }else {
                  this.$alert("该企业已被认证，请重新输入！如有疑义，请联系客服。", "提示", { type: "warning" });
                  return false
                }
              })
            }
        } else {
          this.$refs.companyRef.focus()
         // this.$alert("请输入更详细的关键词！", "提示", { type: "warning" });
        }
      });
    },
    cancelCompanyForm(){
        this.confirmCompanyVisible = false;
        this.num = 61;
        clearInterval(this.timer);
        this.copySelectCompanyName = "";
        // this.resetForm("confirmCompanyForm");
        this.$router.push('/userCenter/basic')
    },
    // 对身份证做判断
    //调用图片识别接口并校验
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
    handleSelect(item) {
      this.confirmCompanyForm.id = item.id;
      this.confirmCompanyForm.code = item.code;
      this.confirmCompanyForm.companyId = item.id;
    },
    saveEnterpriseCertification() {
      const loading = this.$openLoading();
      API_SaveEnterpriseCertification(this.confirmCompanyForm)
        .then(data => {
          this.confirmCompanyVisible = false;
          // this.resetForm("confirmCompanyForm");
          loading.close();
          this.$message.success(data);
          if (this.$route.query.title == "register") {
            this.isShow = true
          } else {
            this.$confirm("您的认证已经提交，通过审核后，您的企业将获得企业认证标识，请耐心等待平台审核", "提示", {
              confirmButtonText: "确定",
              type: "warning"
            }).then(() => {
              this.$router.go(-1)
            });
          }
        })
        .catch(e => {
          loading.close();
          this.$message.error(e);
        });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>


<style lang="scss">
.change-phone {
  .el-form-item {
    margin-bottom: 27px;
  }
}

.confirm-company {
  padding-top: 40px;
  width: 800px;
  margin: 0 auto;
  
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
    width: 100%;
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
  /deep/.el-input__inner{
    width: 100%;
  }
.setting-form {
  margin: 0 auto;
  width: 420px;
}
/deep/ .el-form > .el-form-item > .el-form-item__content{
  margin-left: 120px !important
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
.certify-pic1 {
    width: 150px;
    height: 170px;
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
/deep/ .el-dialog__header {
    border-bottom: none;
}
.fSRemindSend {
  font-size: 16px;
}

</style>
