<template>
  <!--    经营环境-->
  <div>
    <el-form ref="form" class="display" :model="formData" label-width="200px" v-if="isView">
      <div class="base-info-container">
        <div class="base-info-content">
          <div class="info-title">
            <div>业务覆盖区域</div>
          </div>
          <div class="info-content">{{ data.businessArea||"暂无" }}</div>
        </div>
        <div class="base-info-content">
          <div class="info-title">
            <div>所属行业及代码</div>
          </div>
          <div class="info-content">{{ data.industryCode||"暂无" }}</div>
        </div>
        <div class="base-info-content">
          <div class="info-title">
            <div>区域信用优势与关注</div>
          </div>
          <div class="info-content">{{ data.advantagesConcerns||"暂无" }}</div>
        </div>
        <div class="base-info-content">
          <div class="info-title">
            <div>行业政策指向</div>
          </div>
          <div class="info-content">{{ data.policyDirection||"暂无" | filterPolicyDirection }}</div>
        </div>
        <div class="base-info-content">
          <div class="info-title">
            <div>行业市场集中度</div>
          </div>
          <div class="info-content">{{ data.marketConcentration||"暂无" }}</div>
        </div>
        <div class="base-info-content">
          <div class="info-title">
            <div>产业链所处位置</div>
          </div>
          <div class="info-content">{{ data.locationIndustrialChain||"暂无" | filterLocationIndustrialChain }}</div>
        </div>
        <div class="base-info-content">
          <div class="info-title">
            <div>行业近期发展趋势</div>
          </div>
          <div class="info-content">{{ data.developingTrend||"暂无" }}</div>
        </div>
        <div class="base-info-content">
          <div class="info-title">
            <div>行业分析</div>
          </div>
          <div class="info-content">{{ data.industryAnalysis||"暂无" }}</div>
        </div>
        <div class="base-info-content">
          <div class="info-title">
            <div>行业风险提示</div>
          </div>
          <div class="info-content">{{ data.riskWarning||"暂无" }}</div>
        </div>
      </div>
      <!-- <el-form-item prop="businessArea" label="业务覆盖区域">
        <span v-bind:class="{'text-none':!data.businessArea}">{{ data.businessArea||"暂无" }}</span>
      </el-form-item>
      <el-form-item prop="industryCode" label="所属行业及代码">
        <span v-bind:class="{'text-none':!data.industryCode}">{{ data.industryCode||"暂无" }}</span>
      </el-form-item>
      <el-form-item prop="advantagesConcerns" label="区域信用优势与关注">
        <span v-bind:class="{'text-none':!data.advantagesConcerns}">{{ data.advantagesConcerns||"暂无" }}</span>
      </el-form-item>
      <el-form-item prop="policyDirection" label="行业政策指向">
        <span
          v-bind:class="{'text-none':!data.policyDirection}"
        >{{ data.policyDirection||"暂无" | filterPolicyDirection }}</span>
      </el-form-item>
      <el-form-item prop="marketConcentration" label="行业市场集中度">
        <span v-bind:class="{'text-none':!data.marketConcentration}">{{ data.marketConcentration||"暂无" }}</span>
      </el-form-item>
      <el-form-item prop="locationIndustrialChain" label="产业链所处位置">
        <span
          v-bind:class="{'text-none':!data.locationIndustrialChain}"
        >{{ data.locationIndustrialChain||"暂无" | filterLocationIndustrialChain }}</span>
      </el-form-item>
      <el-form-item prop="developingTrend" label="行业近期发展趋势">
        <span v-bind:class="{'text-none':!data.developingTrend}">{{ data.developingTrend||"暂无" }}</span>
      </el-form-item>
      <el-form-item prop="industryAnalysis" label="行业分析">
        <span v-bind:class="{'text-none':!data.industryAnalysis}">{{ data.industryAnalysis||"暂无" }}</span>
      </el-form-item>
      <el-form-item prop="riskWarning" label="行业风险提示">
        <span v-bind:class="{'text-none':!data.riskWarning}">{{ data.riskWarning||"暂无" }}</span>
      </el-form-item>-->
    </el-form>
    <el-form v-else ref="form" :model="formData" :rules="formRules" label-width="10em">
      <el-form-item prop="businessArea" label="业务覆盖区域">
        <el-input v-model="formData.businessArea" type="textarea" :rows="4" placeholder="请输入业务覆盖区域" />
      </el-form-item>
      <el-form-item prop="industryCode" label="所属行业及代码">
        <el-input v-model="formData.industryCode" placeholder="请输入所属行业及代码" />
      </el-form-item>
      <el-form-item prop="advantagesConcerns" label="区域信用优势与关注">
        <el-input v-model="formData.advantagesConcerns" :rows="4" type="textarea" placeholder="请输入区域信用优势与关注" />
      </el-form-item>
      <el-form-item prop="policyDirection" label="行业政策指向">
        <el-radio-group v-model="formData.policyDirection">
          <el-radio label="0">鼓励</el-radio>
          <el-radio label="1">限制</el-radio>
          <el-radio label="2">禁止</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="marketConcentration" label="行业市场集中度">
        <el-input v-model="formData.marketConcentration" type="textarea" :rows="4" placeholder="请输入行业市场集中度" />
      </el-form-item>
      <el-form-item prop="locationIndustrialChain" label="产业链所处位置">
        <el-radio-group v-model="formData.locationIndustrialChain">
          <el-radio label="0">良好</el-radio>
          <el-radio label="1">较好</el-radio>
          <el-radio label="2">一般</el-radio>
          <el-radio label="3">恶化</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="developingTrend" label="行业近期发展趋势">
        <el-input v-model="formData.developingTrend" type="textarea" :rows="4" placeholder="请输入行业近期发展趋势" />
      </el-form-item>
      <el-form-item prop="industryAnalysis" label="行业分析">
        <el-input v-model="formData.industryAnalysis" :rows="4" type="textarea" placeholder="请输入行业分析" />
      </el-form-item>
      <el-form-item prop="riskWarning" label="行业风险提示">
        <el-input v-model="formData.riskWarning" :rows="4" type="textarea" placeholder="请输入行业风险提示" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { merge } from "lodash";

export default {
  name: "Comp1",
  filters: {
    filterPolicyDirection(val) {
      if (val === "0") {
        return "鼓励";
      } else if (val === "1") {
        return "限制";
      } else if (val === "2") {
        return "禁止";
      }
      return "暂无";
    },
    filterLocationIndustrialChain(val) {
      if (val === "0") {
        return "良好";
      } else if (val === "1") {
        return "较好";
      } else if (val === "2") {
        return "一般";
      } else if (val === "3") {
        return "恶化";
      }
      return "暂无";
    }
  },
  props: {
    isView: Boolean,
    id: String,
    data: {
      type: Object,
      default: () => ({})
    },
    companyName: String
  },
  data() {
    const createRules = this.$createRules;
    return {
      formData: {
        companyId: this.id, // 	企业id
        businessArea: "", // 	业务覆盖区域
        industryCode: "", // 	所属行业及代码
        advantagesConcerns: "", // 		区域信用优势与关注
        policyDirection: "", // 		行业政策指向：0-鼓励、1-限制、2-禁止
        marketConcentration: "", // 		行业市场集中度
        locationIndustrialChain: "", // 		产业链所处位置：0-良好、1-较好、2-一般、3-恶化
        developingTrend: "", // 		行业近期发展趋势
        industryAnalysis: "", // 		行业分析
        riskWarning: "" // 			行业风险
      },
      formRules: {
        businessArea: createRules({ msg: "业务覆盖区域", max: 200 }),
        industryCode: createRules({ msg: "所属行业及代码", max: 40 }),
        advantagesConcerns: createRules({ msg: "区域信用优势与关注", max: 200 }),
        marketConcentration: createRules({ msg: "行业市场集中度", max: 200 }),
        developingTrend: createRules({ msg: "行业近期发展趋势", max: 200 }),
        industryAnalysis: createRules({ msg: "行业分析", max: 200 }),
        riskWarning: createRules({ msg: "行业风险提示", max: 200 })
      }
    };
  },
  watch: {
    data(val) {
      console.log('看看得到的数据111111',val);
      this.mergeData(val);
    }
  },
  created() {
    this.mergeData(this.data);
  },
  methods: {
    mergeData(data) {
      this.formData = merge({}, data, this.formData);
    },
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => {
          if (valid) {
            resolve({ ...this.formData, companyName: this.companyName });
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
