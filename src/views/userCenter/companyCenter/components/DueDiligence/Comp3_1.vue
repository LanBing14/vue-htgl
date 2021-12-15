<template>
  <!--    业务概况-->
  <div>
    <el-form ref="form" class="display" :model="formData" label-width="200px" v-if="isView">
      <div class="base-info-container">
        <div class="base-info-content">
          <div class="info-title">
            <div>主要产品和服务</div>
          </div>
          <div class="info-content">{{ data.productsServices||'暂无' }}</div>
        </div>
        <div class="base-info-content">
          <div class="info-title">
            <div>主营业务概述</div>
          </div>
          <div class="info-content">{{ data.mainBusiness||'暂无' }}</div>
        </div>
        <div class="base-info-content">
          <div class="info-title">
            <div>地域分布</div>
          </div>
          <div class="info-content">{{ data.areaDistribution||'暂无' }}</div>
        </div>
        <div class="base-info-content">
          <div class="info-title">
            <div>知识产权数量</div>
          </div>
          <div class="info-content">{{ data.intellectualNum||'暂无' }}</div>
        </div>
      </div>
      <!-- <el-form-item prop="productsServices" label="主要产品和服务">
        <span v-bind:class="{'text-none':!data.productsServices}">{{ data.productsServices||'暂无' }}</span>
      </el-form-item>
      <el-form-item prop="mainBusiness" label="主营业务概述">
        <span v-bind:class="{'text-none':!data.mainBusiness}">{{ data.mainBusiness||'暂无' }}</span>
      </el-form-item>
      <el-form-item prop="areaDistribution" label="地域分布">
        <span v-bind:class="{'text-none':!data.areaDistribution}">{{ data.areaDistribution||'暂无' }}</span>
      </el-form-item>
      <el-form-item prop="intellectualNum" label="知识产权数量">
        <span v-bind:class="{'text-none':!data.intellectualNum}">{{ data.intellectualNum||'暂无' }}</span>
      </el-form-item>-->
    </el-form>
    <el-form ref="form" :model="formData" :rules="formRules" label-width="8em" v-else>
      <el-form-item prop="productsServices" label="主要产品和服务">
        <el-input v-model="formData.productsServices" :rows="4" type="textarea" placeholder="请输入主要产品和服务" />
      </el-form-item>
      <el-form-item prop="mainBusiness" label="主营业务概述">
        <el-input v-model="formData.mainBusiness" :rows="4" type="textarea" placeholder="请输入主营业务概述" />
      </el-form-item>
      <el-form-item prop="areaDistribution" label="地域分布">
        <el-input v-model="formData.areaDistribution" :rows="4" type="textarea" placeholder="请输入地域分布" />
      </el-form-item>
      <el-form-item prop="intellectualNum" label="知识产权数量">
        <el-input v-model="formData.intellectualNum" placeholder="请输入知识产权数量" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Comp31",
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
        {
          label: "企业主要产品和服务(平方米)",
          value: "0"
        },
        {
          label: "办公用房面积(平方米)",
          value: "1"
        },
        {
          label: "房产原值或年租金(平方米)",
          value: "2"
        }
      ],
      options: [],
      formData: {
        productsServices: "", // 	总计
        mainBusiness: "", // 	主营业务概述
        areaDistribution: "", // 	地域分布
        intellectualNum: "" // 	知识产权数量
      },
      formRules: {
        productsServices: createRules({
          msg: "主要产品和服务",
          max: 200
        }),
        mainBusiness: createRules({
          msg: "主营业务概述",
          max: 200
        }),
        areaDistribution: createRules({
          msg: "地域分布",
          max: 200
        }),
        intellectualNum: createRules({
          msg: "知识产权数量",
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error("主要产品和服务必填"));
              return;
            }
            if (!/^[0-9]*$/.test(value)) {
              callback(new Error("请输入0或正正数"));
            } else if (Number(value) > 100000) {
              callback(new Error("主要产品和服务不能大于10万"));
            } else {
              callback();
            }
          }
        })
      }
    };
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
      Object.keys(this.formData).forEach(key => {
        this.formData[key] = data[key] ? String(data[key]) : "";
      });
    },
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => {
          if (valid) {
            resolve({
              ...this.formData,
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
