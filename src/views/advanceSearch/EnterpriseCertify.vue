<template>
  <el-dialog
    title="企业认证"
    :visible.sync="confirmCompanyVisible"
    width="650px"
    class="confirm-company-dialog"
    :modal-append-to-body="true"
    :append-to-body="true"
  >
    <el-form
      :model="confirmCompanyForm"
      :rules="confirmCompanyRules"
      v-loading="loading"
      ref="confirmCompanyForm"
      label-width="100px"
      class="confirm-company"
    >
      <el-form-item label="企业名称：" prop="name">
        <el-autocomplete
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
      <el-form-item label="认证材料：">
        <el-row :span="24">
          <el-col :span="14" class="avatar-uploader-row">
            <el-form-item label-width="0" prop="yyzzAtt" style="padding-right: 10px">
              <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :http-request="(p)=>myUpload(p,1)"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                accept=".jpg, .jpeg, .png, .JPG, .JPEG, .PNG"
              >
                <img
                  v-if="confirmCompanyForm.yyzzAtt"
                  :src="fileUrlBase+confirmCompanyForm.yyzzAtt"
                  class="avatar"
                  alt
                />
                <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
                <div
                  v-else
                  class="certify-pic"
                  :style="{'background-image': 'url('+require('../../assets/images/certifyP1.png')+')'}"
                ></div>
                <div
                  slot="tip"
                  class="el-upload__tip"
                  style="text-align: center; font-size: 13px; line-height: 22px; position: absolute; bottom: -26px; width: 100%"
                >营业执照</div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="10" class="avatar-uploader-row">
            <el-form-item label-width="0" prop="wtsqsAtt">
              <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :http-request="(p)=>myUpload(p,2)"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                accept=".jpg, .jpeg, .png, .JPG, .JPEG, .PNG"
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
                  :style="{'background-image': 'url('+require('../../assets/images/certifyP2.png')+')'}"
                ></div>
                <div
                  slot="tip"
                  class="el-upload__tip"
                  style="text-align: center; font-size: 13px; line-height: 22px; position: absolute; bottom: -26px; width: 100%"
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
      <el-form-item style="line-height: 22px; margin-top: 32px">
        <div class="el-upload__tip" style="line-height: 22px; color: #999">
          1. 仅支持jpg、jpeg、png格式，大小不超过10M
          <br />2. 营业执照信息必须与工商信息一致
        </div>
      </el-form-item>
      <div style="text-align: center; margin-top:20px;">
        <el-button type="primary" @click="saveCompanyForm('confirmCompanyForm')" size="small">提交审核</el-button>
        <el-button size="small" @click="confirmCompanyVisible=false">取消</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import {
  API_GetInfoByCurrentUser,
  API_GetStatusByCompanyId,
  API_SaveEnterpriseCertification,
  Api_EditPhoneNo,
  Api_UpdateUserInfo,
  API_EnterpriseCertHistory, // 获取最近企业认证历史
} from "@/api/userCenter/baseInfo";
import { Api_CompanySearch } from "@/api/creditMonitor";
import { Api_Send2, Api_fileUrl } from "@/api/baseApi";
import { Api_upload, Api_GetCompanyInfoById } from "@/api/baseApi";
import { fxb } from "@/utils/variables";

export default {
  name: "EnterpriseCertify",
  data() {
    return {
      fxb,
      fileUrlBase: process.env.VUE_APP_FILE_API,
      baseUrl: process.env.VUE_APP_BASE_API,
      loading: false,
      confirmCompanyVisible: false,
      uploadUrl: Api_fileUrl() + "image/",
      confirmCompanyForm: {
        id: "",
        code: "",
        companyId: "",
        name: "",
        yyzzAtt: "",
        wtsqsAtt: "",
        version: "",
      },
      confirmCompanyRules: {
        name: [{ required: true, message: "请输入企业名称", trigger: "blur" }],
        code: [
          { required: true, message: "查询不到统一社会信用代码" },
          { max: 50, message: "长度不能超过50位" },
        ],
        yyzzAtt: [{ required: true, trigger: "blur", message: "请上传营业执照" }],
        wtsqsAtt: [{ required: true, trigger: "blur", message: "请上传授权委托书扫描件" }],
      },
      curUploadFileNum1: -1, // 传递给后台的图片顺序
      curUploadFileNum2: -1, // 传递给后台的图片顺序
    };
  },
  methods: {
    /**
     * @cn company name
     */
    open(cn) {
      this.confirmCompanyVisible = true;
      this.$nextTick(() => {
        this.resetForm("confirmCompanyForm");
        this.confirmCompanyForm.name = cn;
        this.querySearch(cn, (item) => {
          this.$nextTick(() => {
            this.handleSelect(item[0]);
          });
        });
      });
    },
    saveCompanyForm(formName) {
      this.$refs["confirmCompanyForm"].validate((valid) => {
        if (valid) {
          this.saveEnterpriseCertification();
        }
      });
    },
    saveEnterpriseCertification() {
      const loading = this.$openLoading();
      API_SaveEnterpriseCertification(this.confirmCompanyForm)
        .then((data) => {
          // this.getHistory();
          this.confirmCompanyVisible = false;
          loading.close();
          this.$message.success(data);
          this.$emit("loadCompany");
        })
        .catch((e) => {
          loading.close();
          this.$message.error(e);
        });
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
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="scss">
.confirm-company {
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
</style>
