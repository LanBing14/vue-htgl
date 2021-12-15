<template>
  <Dialog
    ref="drawer"
    title="跟踪调查"
    :visible.sync="visible"
    :onOk="handleSure"
    width="500px"
    :close="closeDialog"
    class="size-btn-change"
  >
    <el-form ref="form" v-loading="loading" :model="form" label-width="90px">
      <el-form-item label="风险类型" prop="type" :rules="$createRules({required:true,msg:'风险类型'})">
        <el-select v-model="form.type" placeholder="请选择风险类型" style="width:100%">
          <el-option label="经营管理" value="1"></el-option>
          <el-option label="财务状态" value="2"></el-option>
          <el-option label="宏观经济" value="3"></el-option>
          <el-option label="行业风险" value="4"></el-option>
          <el-option label="区域风险" value="5"></el-option>
          <el-option label="供应链风险" value="6"></el-option>
          <el-option label="其他" value="7"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="风险等级" prop="riskRank" :rules="$createRules({required:true,msg:'风险等级'})">
        <el-select v-model="form.riskRank" placeholder="请选择风险等级" style="width:100%">
          <el-option label="高风险" value="1"></el-option>
          <el-option label="中风险" value="2"></el-option>
          <el-option label="低风险" value="3"></el-option>
          <el-option label="不详" value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="风险描述" prop="remark" :rules="$createRules({required:true,max:200,msg:'风险描述'})">
        <el-input v-model="form.remark" type="textarea" :rows="4" placeholder="请输入风险详细描述信息"></el-input>
      </el-form-item>
      <el-form-item label="信息来源" prop="source" :rules="$createRules({required:true,max:20,msg:'信息来源'})">
        <el-input v-model="form.source" placeholder="请输入信息来源途径"></el-input>
      </el-form-item>
      <el-form-item label="可信度" prop="credibility" :rules="$createRules({required:true,msg:'可信度'})">
        <el-select v-model="form.credibility" placeholder="请选择信息可信程度(%)" style="width:100%">
          <el-option label="100%" value="100%"></el-option>
          <el-option label="80%" value="80%"></el-option>
          <el-option label="60%" value="60%"></el-option>
          <el-option label="40%" value="40%"></el-option>
          <el-option label="20%" value="20%"></el-option>
          <el-option label="10%" value="10%"></el-option>
          <el-option label="不确定" value="不确定"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="提示时间" prop="reminderTime" :rules="$createRules({required:true,msg:'提示时间'})">
        <el-date-picker
          v-model="form.reminderTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择提示时间"
          style="width:100%"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="佐证材料" prop="urls" id="upload-btn-wrap">
        <Upload id="upload-btn-size" v-model="urls" fileType="jpg,png,doc,docx,xls,xlsx,pdf,zip,rar" :limit="5" :fileSize="20"></Upload>
      </el-form-item>
      <el-input v-model="form.surveyId" v-show="false"></el-input>
    </el-form>
  </Dialog>
</template>

<script>
import Upload from "@/components/Upload/index.vue";
import {
  Api_trackingSurvey,
  Api_trackingSurveyDetail,
} from "@/api/creditManagement/customerProfile/customerManagement.js";

export default {
  name: "FollowUpInves",
  components: { Upload },
  data() {
    return {
      visible: false,
      rowData: {},
      form: {
        customerId: null,
        type: null,
        riskRank: null,
        remark: null,
        source: null,
        credibility: null,
        reminderTime: this.$dateFormat(new Date()),
        surveyId: null,
        urls: [],
      },
      urls: [],
      loading: false,
      details: {},
    };
  },
  methods: {
    open(row, _status, row2) {
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["form"].resetFields();
        this.urls = [];
        this.form.customerId = row.id;
        if (_status === "edit") {
          this.form.surveyId = row2.id;
          this.rowData = row2;
          this.loading = true;
          Api_trackingSurveyDetail(row2.id)
            .then((res) => {
              this.loading = false;
              this.details = res;
              this.form.type = res.type;
              this.form.riskRank = res.riskRank;
              this.form.remark = res.remark;
              this.form.source = res.source;
              this.form.credibility = res.credibility;
              this.form.reminderTime = this.$dateFormat(res.reminderTime);
              this.urls = res.attachmentVos.map((i) => ({ name: i.originalName, url: i.url }));
            })
            .catch((res) => {
              this.loading = false;
            });
        }
      });
    },
    handleSure() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.urls = this.urls.map((i) => i.url);
          const loading = this.$openLoading();
          Api_trackingSurvey(this.form)
            .then((res) => {
              loading.close();
              this.$message.success(res);
              this.visible = false;
              this.$emit("getList");
            })
            .catch((res) => {
              loading.close();
              this.$message.error(res);
            });
        }
      });
    },
    closeDialog() {
      this.visible = false;
    },
  },
};
</script>

<style>
</style>
