<template>
  <Dialog
    ref="drawer"
    title="新增经营环境"
    :visible.sync="visible"
    :btns="drawerBtns"
    :close="closeDialog"
  >
    <el-form ref="form" :model="form" label-width="160px" style="padding: 0 16px">
      <el-form-item label="组织框架图" prop="pic">
        <el-upload
          :action="uploadUrl"
          :before-upload="beforeUpload"
          :file-list="form.uploadFileList"
          :http-request="handleUpload"
          :limit="3"
          :on-exceed="handleExceed"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          accept=".jpg, .jpeg, .png, .JPG, .JPEG, .PNG"
          list-type="picture-card"
          multiple
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img :src="dialogImageUrl" alt width="100%" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="主要内部管理制度简述" prop="inner">
        <el-input type="textarea" :rows="3" v-model="form.inner"></el-input>
      </el-form-item>
      <el-form-item label="财务管理制度简述" prop="finance">
        <el-input type="textarea" :rows="3" v-model="form.finance"></el-input>
      </el-form-item>
      <el-form-item label="知识产权保护制度简述" prop="property">
        <el-input type="textarea" :rows="3" v-model="form.property"></el-input>
      </el-form-item>
      <el-form-item label="法律风险防范制度简述" prop="law">
        <el-input type="textarea" :rows="3" v-model="form.law"></el-input>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script>
import { Api_upload } from "@/api/baseApi";
export default {
  name: "NewCorporateGovernance",
  data() {
    return {
      visible: false,
      uploadUrl: "/user/center/common/file/ajaxUpload",
      dialogImageUrl: "",
      dialogVisible: false,
      form: {
        uploadFileList: [],
        inner: "",
        finance: "",
        property: "",
        law: ""
      },
      drawerBtns: [
        {
          text: "返回",
          click: () => {
            this.visible = false;
          }
        },
        {
          text: "确定",
          type: "primary",
          click: () => {
            this.visible = false;
          }
        }
      ]
    };
  },
  methods: {
    open() {
      this.visible = true;
    },
    closeDialog() {
      this.visible = false;
    },
    beforeUpload(file) {
      const isMatch = /\.(jpg|jpeg|png|JPG|JPEG|PNG)$/.test(file.name);
      const isLt2M = file.size / 1024 < 1024 * 2;
      if (!isMatch) {
        this.$message.warning("仅支持jpg、jpeg、png格式");
      }
      if (!isLt2M) {
        this.$message.warning("图片大小不超过2M");
      }
      return isMatch && isLt2M;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleRemove(file, fileList) {
      this.form.uploadFileList = fileList;
    },
    handleUpload(content) {
      const formData = new FormData();
      formData.append("files", content.file);
      this.batchLoading = true;
      Api_upload(this.uploadUrl, formData).then(res => {
        if (res.stateCode === "1") {
          if (res.data.fail.length > 0) {
            this.$message.warning(res.data.fail[0].msg);
          } else {
            res.data.success[0].url = res.data.success[0].path;
            this.form.uploadFileList.push(res.data.success[0]);
          }
        } else {
          this.$message.warning("上传文件失败");
        }
      });
    },
    handleExceed(files, fileList) {
      this.$message.warning("最多可以上传3张图片");
    }
  }
};
</script>

<style>
</style>
