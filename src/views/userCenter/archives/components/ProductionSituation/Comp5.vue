<template>
  <!--    公司治理和内控制度-->
  <div>
    <el-form v-if="isView" ref="form" class="display" :model="formData" label-width="200px">
      <div class="base-info-container">
        <div class="base-info-content">
          <div class="info-title">
            <div>组织框架图</div>
          </div>
          <div class="info-content">
            <ImgView :urls="urls"></ImgView>
          </div>
        </div>
        <div class="base-info-content">
          <div class="info-title">
            <div>主要内部管理制度简述</div>
          </div>
          <div class="info-content">{{ data.managementSketch || '暂无' }}</div>
        </div>
        <div class="base-info-content">
          <div class="info-title">
            <div>财务管理制度简述</div>
          </div>
          <div class="info-content">{{ data.financeSketch || '暂无' }}</div>
        </div>
        <div class="base-info-content">
          <div class="info-title">
            <div>知识产权保护制度简述</div>
          </div>
          <div class="info-content">{{ data.knowledgeSketch || '暂无' }}</div>
        </div>
        <div class="base-info-content">
          <div class="info-title">
            <div>法律风险防范制度简述</div>
          </div>
          <div class="info-content">{{ data.lawSketch || '暂无' }}</div>
        </div>
      </div>
      <!-- <el-form-item prop="uploadFileUrls" label="组织框架图">
        <template>
          <ImgView :urls="urls"></ImgView>
        </template>
      </el-form-item>
      <el-form-item prop="managementSketch" label="主要内部管理制度简述">
        <span v-bind:class="{'text-none':!data.managementSketch}">{{ data.managementSketch || '暂无' }}</span>
      </el-form-item>
      <el-form-item prop="financeSketch" label="财务管理制度简述">
        <span v-bind:class="{'text-none':!data.financeSketch}">{{ data.financeSketch || '暂无' }}</span>
      </el-form-item>
      <el-form-item prop="knowledgeSketch" label="知识产权保护制度简述">
        <span v-bind:class="{'text-none':!data.knowledgeSketch}">{{ data.knowledgeSketch || '暂无' }}</span>
      </el-form-item>
      <el-form-item prop="lawSketch" label="法律风险防范制度简述">
        <span v-bind:class="{'text-none':!data.lawSketch}">{{ data.lawSketch || '暂无' }}</span>
      </el-form-item>-->
    </el-form>
    <el-form v-else ref="form" :model="formData" :rules="formRules" label-width="11em">
      <el-form-item prop="uploadFileUrls" label="组织框架图">
        <Upload v-model="formData.uploadFileUrls" :fileSize="2" fileType="jpg,png"></Upload>
      </el-form-item>
      <el-form-item prop="managementSketch" label="主要内部管理制度简述">
        <el-input v-model="formData.managementSketch" :rows="4" type="textarea" placeholder="请输入主要内部管理制度简述" />
      </el-form-item>
      <el-form-item prop="financeSketch" label="财务管理制度简述">
        <el-input v-model="formData.financeSketch" :rows="4" type="textarea" placeholder="请输入财务管理制度简述" />
      </el-form-item>
      <el-form-item prop="knowledgeSketch" label="知识产权保护制度简述">
        <el-input v-model="formData.knowledgeSketch" :rows="4" type="textarea" placeholder="请输入知识产权保护制度简述" />
      </el-form-item>
      <el-form-item prop="lawSketch" label="法律风险防范制度简述">
        <el-input v-model="formData.lawSketch" :rows="4" type="textarea" placeholder="请输入法律风险防范制度简述" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Upload from "@/components/Upload/index";
import ImgView from "@/components/ImgView/index";

export default {
  name: "Comp5",
  components: {
    Upload,
    ImgView
  },
  props: {
    id: String, //  企业id
    modelStatus: Boolean, // 新增或修改状态
    data: Object, // 详情数据
    isView: Boolean
  },
  data() {
    const createRules = this.$createRules;
    return {
      sourceOptions: [
        { label: "企业组织框架图(平方米)", value: "0" },
        { label: "办公用房面积(平方米)", value: "1" },
        { label: "房产原值或年租金(平方米)", value: "2" }
      ],
      options: [],
      formData: {
        uploadFileUrls: [], // 	组织框架图附件
        managementSketch: "", // 	主要内部管理制度简述
        financeSketch: "", // 	财务管理制度简述
        knowledgeSketch: "", // 	知识产权保护制度简述
        lawSketch: "" // 	法律风险防范制度简述
      },
      formRules: {
        managementSketch: createRules({ msg: "主要内部管理制度简述", max: 200 }),
        financeSketch: createRules({ msg: "财务管理制度简述", max: 200 }),
        knowledgeSketch: createRules({ msg: "知识产权保护制度简述", max: 200 }),
        lawSketch: createRules({ msg: "法律风险防范制度简述", max: 200 })
      }
    };
  },
  computed: {
    urls() {
      return this.formData.uploadFileUrls.map(i => i.url);
    }
  },
  watch: {
    data(val) {
      this.mergeData(val);
    }
  },
  created() {
    this.mergeData(this.data);
  },
  methods: {
    mergeData(data) {
      if (!data || !data.id) return;
      this.formData.uploadFileUrls = data.uploadFiles.map(i => ({
        url: i.url,
        name: i.originalName
      }));
      this.formData.managementSketch = data.managementSketch;
      this.formData.financeSketch = data.financeSketch;
      this.formData.knowledgeSketch = data.knowledgeSketch;
      this.formData.lawSketch = data.lawSketch;
    },
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => {
          if (valid) {
            resolve({
              ...this.formData,
              uploadFileUrls: this.formData.uploadFileUrls.map(i => i.url),
              id: this.data.id,
              companyId: this.id // 	企业id
            });
          } else {
            reject();
          }
        });
      });
    },
    reset() {
      this.$refs.form.resetFields();
    }
  }
};
</script>

<style scoped lang="scss">
/deep/ .display {
  border-bottom: 1px solid #ebeef5;
  .el-form-item {
    margin-bottom: 0;
    margin-right: 0;
    border-top: 1px solid #ebeef5;
    border-left: 1px solid #ebeef5;
    border-right: 1px solid #ebeef5;
    .el-form-item__label {
      line-height: 48px;
      background-color: #f7f8fc;
      padding: 0 16px;
    }
    .el-form-item__content {
      line-height: 48px;
      padding: 0 16px;
    }
  }
}
.text-none {
  color: #909399;
}

.base-info-container {
  border-top: 1px solid #e4e4e4;
  .base-info-content {
    display: flex;
    border-left: 1px solid #e4e4e4;
    border-bottom: 1px solid #e4e4e4;
    border-right: 1px solid #e4e4e4;
    .info-title {
      > div {
        align-self: center;
        text-align: center;
        flex: 1;
      }
      flex: 0 190px;
      color: #333;
      white-space: nowrap;
      font-weight: normal;
      background: #f7f8fc;
      display: flex;
    }
    .info-content {
      flex: 1;
      font-size: 13px;
      color: #888;
      padding: 15px;
      line-height: 20px;
    }
  }
}
</style>
