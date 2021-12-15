<template>
  <!--    学历构成-->
  <div>
    <el-form v-if="isView" class="display" ref="form" :model="formData" label-width="200px">
      <div class="base-info-container">
        <div class="base-info-content">
          <div class="info-title">
            <div>员工总数</div>
          </div>
          <div class="info-content">{{data.totalNum?data.totalNum+' 人':'暂无'}}</div>
        </div>
        <div class="base-info-content">
          <div class="info-title">
            <div>研究生及以上</div>
          </div>
          <div class="info-content">{{!isNaN(data.postgraduateNum)?data.postgraduateNum+' 人':'暂无'}}</div>
        </div>
        <div class="base-info-content">
          <div class="info-title">
            <div>本科</div>
          </div>
          <div class="info-content">{{!isNaN(data.undergraduateNum)?data.undergraduateNum+' 人':'暂无'}}</div>
        </div>
        <div class="base-info-content">
          <div class="info-title">
            <div>大专</div>
          </div>
          <div class="info-content">{{!isNaN(data.juniorCollegeNum)?data.juniorCollegeNum+' 人':'暂无'}}</div>
        </div>
        <div class="base-info-content">
          <div class="info-title">
            <div>大专以下</div>
          </div>
          <div
            class="info-content"
          >{{!isNaN(data.juniorCollegeBelowNum)?data.juniorCollegeBelowNum+' 人':'暂无'}}</div>
        </div>
      </div>
      <!-- <el-form-item prop="totalNum" label="员工总数">
        <span v-bind:class="{'text-none':!data.totalNum}">{{data.totalNum?data.totalNum+' 人':'暂无'}}</span>
      </el-form-item>
      <el-form-item prop="postgraduateNum" label="研究生及以上">
        <span
          v-bind:class="{'text-none':isNaN(data.postgraduateNum)}"
        >{{!isNaN(data.postgraduateNum)?data.postgraduateNum+' 人':'暂无'}}</span>
      </el-form-item>
      <el-form-item prop="undergraduateNum" label="本科">
        <span
          v-bind:class="{'text-none':isNaN(data.undergraduateNum)}"
        >{{!isNaN(data.undergraduateNum)?data.undergraduateNum+' 人':'暂无'}}</span>
      </el-form-item>
      <el-form-item prop="juniorCollegeNum" label="大专">
        <span
          v-bind:class="{'text-none':isNaN(data.juniorCollegeNum)}"
        >{{!isNaN(data.juniorCollegeNum)?data.juniorCollegeNum+' 人':'暂无'}}</span>
      </el-form-item>
      <el-form-item prop="juniorCollegeBelowNum" label="大专以下">
        <span
          v-bind:class="{'text-none':isNaN(data.juniorCollegeBelowNum)}"
        >{{!isNaN(data.juniorCollegeBelowNum)?data.juniorCollegeBelowNum+' 人':'暂无'}}</span>
      </el-form-item>-->
    </el-form>
    <el-form v-else ref="form" :model="formData" :rules="formRules" label-width="8em">
      <el-form-item prop="totalNum" label="员工总数">
        <el-input v-model="formData.totalNum" placeholder="请输入员工总数">
          <template slot="append">人</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="postgraduateNum" label="研究生及以上">
        <el-input v-model="formData.postgraduateNum" placeholder="请输入研究生及以上">
          <template slot="append">人</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="undergraduateNum" label="本科">
        <el-input v-model="formData.undergraduateNum" placeholder="请输入本科">
          <template slot="append">人</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="juniorCollegeNum" label="大专">
        <el-input v-model="formData.juniorCollegeNum" placeholder="请输入大专">
          <template slot="append">人</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="juniorCollegeBelowNum" label="大专以下">
        <el-input v-model="formData.juniorCollegeBelowNum" placeholder="请输入大专以下">
          <template slot="append">人</template>
        </el-input>
      </el-form-item>
    </el-form>
    <slot></slot>
  </div>
</template>

<script>
import { Api_SearchCompany } from "@/api/creditManagement/customerProfile/customerManagement";

export default {
  name: "Comp73",
  props: {
    id: String, //  企业id
    modelStatus: Boolean, // 新增或修改状态
    data: Object, // 详情数据
    isView: Boolean
  },
  data() {
    const createRules = this.$createRules;
    return {
      date: null,
      formData: {
        totalNum: "", // 	员工总数
        postgraduateNum: "", // 	研究生及以上
        undergraduateNum: "", // 	本科
        juniorCollegeNum: "", // 	大专
        juniorCollegeBelowNum: "" // 		大专以下
      },
      formRules: {
        totalNum: createRules({
          msg: "员工总数",
          required: true,
          cipint0: true,
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error("员工总数必填"));
              return;
            }
            if (Number(value) > 100000) {
              callback(new Error("员工总数不能大于10万"));
            } else {
              callback();
            }
          }
        }),
        postgraduateNum: createRules({
          msg: "研究生及以上",
          required: true,
          cipint1: true,
          validator: (rule, value, callback) => {
            this.validatorTotal("研究生及以上", rule, value, callback);
          }
        }),
        undergraduateNum: createRules({
          msg: "本科",
          required: true,
          cipint1: true,
          validator: (rule, value, callback) => {
            this.validatorTotal("本科", rule, value, callback);
          }
        }),
        juniorCollegeNum: createRules({
          msg: "大专",
          required: true,
          cipint1: true,
          validator: (rule, value, callback) => {
            this.validatorTotal("大专", rule, value, callback);
          }
        }),
        juniorCollegeBelowNum: createRules({
          msg: "大专以下",
          required: true,
          cipint1: true,
          validator: (rule, value, callback) => {
            this.validatorTotal("大专以下", rule, value, callback);
          }
        })
      }
    };
  },
  watch: {
    data(val) {
      console.log(val);
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
        this.formData[key] = !isNaN(data[key]) ? String(data[key]) : "";
      });
    },
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => {
          if (valid) {
            const {
              totalNum,
              postgraduateNum,
              undergraduateNum,
              juniorCollegeNum,
              juniorCollegeBelowNum
            } = this.formData;
            const t =
              Number(postgraduateNum) +
              Number(undergraduateNum) +
              Number(juniorCollegeNum) +
              Number(juniorCollegeBelowNum);
            if (t > totalNum) {
              this.$alert("各学历组成人员数之和大于员工总数，请检查后再保存", "提示");
              reject();
              return;
            }
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
    // 企业模糊查询
    querySearch(queryString, cb) {
      if (!queryString) {
        cb([]);
        return;
      }
      console.log(queryString);
      Api_SearchCompany({
        companyName: queryString
      })
        .then(res => {
          const temp = [];
          for (const elem of res.returnData) {
            temp.push({
              value: elem.name,
              companyId: elem.id,
              operName: elem.operName,
              creditCode: elem.creditCode
            });
          }
          cb(temp);
        })
        .catch(e => {
          cb([]);
          this.$message.error(e);
        });
    },
    validatorTotal(msg, rule, value, callback) {
      if (!value) {
        callback(new Error(msg + "必填"));
        return;
      }
      if (this.totalNum && Number(value) > Number(this.totalNum)) {
        callback(new Error(msg + "不能大于员工总数"));
      } else {
        callback();
      }
    },
    reset() {
      this.$refs.form.resetFields();
    }
  }
};
</script>

<style scoped lang="scss">
.el-date-editor.el-range-editor {
  width: 100%;
}
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
