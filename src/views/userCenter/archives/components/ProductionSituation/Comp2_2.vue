<template>
  <!--    经营场所视察情况-->
  <div>
    <el-form ref="form" class="display" :model="formData" label-width="200px" v-if="isView">
      <div class="base-info-container">
        <div class="base-info-content">
          <div class="info-title">
            <div>占地面积</div>
          </div>
          <div class="info-content">{{ data.floorArea ? data.floorArea+'公顷' : '暂无' }}</div>
        </div>
        <div class="base-info-content">
          <div class="info-title">
            <div>地理位置及周边环境</div>
          </div>
          <div class="info-content">{{ data.surroundingEnvironment || '暂无' }}</div>
        </div>
        <div class="base-info-content">
          <div class="info-title">
            <div>经营场所所有权</div>
          </div>
          <div class="info-content">{{ data.ownership || '暂无' }}</div>
        </div>
        <div class="base-info-content">
          <div class="info-title">
            <div>经营地址内部环境</div>
          </div>
          <div class="info-content">{{ data.internalEnvironment || '暂无' }}</div>
        </div>
        <div class="base-info-content">
          <div class="info-title">
            <div>主要经营设施</div>
          </div>
          <div class="info-content">{{ data.mainFacilities || '暂无' }}</div>
        </div>
        <div class="base-info-content">
          <div class="info-title">
            <div>经营设施使用情况</div>
          </div>
          <div class="info-content">{{ data.useFacilities || '暂无' }}</div>
        </div>
        <div class="base-info-content">
          <div class="info-title">
            <div>员工素质</div>
          </div>
          <div class="info-content">{{ data.staffQuality || '暂无' }}</div>
        </div>
        <div class="base-info-content">
          <div class="info-title">
            <div>员工工作积极性</div>
          </div>
          <div class="info-content">{{ data.enthusiasmEmployees || '暂无' }}</div>
        </div>
        <div class="base-info-content">
          <div class="info-title">
            <div>员工对上级评价</div>
          </div>
          <div class="info-content">{{ data.employeEvaluationSuperior || '暂无' }}</div>
        </div>
        <div class="base-info-content">
          <div class="info-title">
            <div>管理层素质</div>
          </div>
          <div class="info-content">{{ data.qualityManagement || '暂无' }}</div>
        </div>
        <div class="base-info-content">
          <div class="info-title">
            <div>管理风格和水平</div>
          </div>
          <div class="info-content">{{ data.managementStyleLevel || '暂无' }}</div>
        </div>
      </div>
      <!-- <el-form-item prop="floorArea" label="占地面积">
        <span v-bind:class="{'text-none':!data.floorArea}">{{ data.floorArea ? data.floorArea+'公顷' : '暂无' }}</span>
      </el-form-item>
      <el-form-item prop="surroundingEnvironment" label="地理位置及周边环境">
        <span
          v-bind:class="{'text-none':!data.surroundingEnvironment}"
        >{{ data.surroundingEnvironment || '暂无' }}</span>
      </el-form-item>
      <el-form-item prop="ownership" label="经营场所所有权">
        <span v-bind:class="{'text-none':!data.ownership}">{{ data.ownership || '暂无' }}</span>
      </el-form-item>
      <el-form-item prop="internalEnvironment" label="经营地址内部环境">
        <span v-bind:class="{'text-none':!data.internalEnvironment}">{{ data.internalEnvironment || '暂无' }}</span>
      </el-form-item>
      <el-form-item prop="mainFacilities" label="主要经营设施">
        <span v-bind:class="{'text-none':!data.mainFacilities}">{{ data.mainFacilities || '暂无' }}</span>
      </el-form-item>
      <el-form-item prop="useFacilities" label="经营设施使用情况">
        <span v-bind:class="{'text-none':!data.useFacilities}">{{ data.useFacilities || '暂无' }}</span>
      </el-form-item>
      <el-form-item prop="staffQuality" label="员工素质">
        <span v-bind:class="{'text-none':!data.staffQuality}">{{ data.staffQuality || '暂无' }}</span>
      </el-form-item>
      <el-form-item prop="enthusiasmEmployees" label="员工工作积极性">
        <span v-bind:class="{'text-none':!data.enthusiasmEmployees}">{{ data.enthusiasmEmployees || '暂无' }}</span>
      </el-form-item>
      <el-form-item prop="employeEvaluationSuperior" label="员工对上级评价">
        <span
          v-bind:class="{'text-none':!data.employeEvaluationSuperior}"
        >{{ data.employeEvaluationSuperior || '暂无' }}</span>
      </el-form-item>
      <el-form-item prop="qualityManagement" label="管理层素质">
        <span v-bind:class="{'text-none':!data.qualityManagement}">{{ data.qualityManagement || '暂无' }}</span>
      </el-form-item>
      <el-form-item prop="managementStyleLevel" label="管理风格和水平">
        <span v-bind:class="{'text-none':!data.managementStyleLevel}">{{ data.managementStyleLevel || '暂无' }}</span>
      </el-form-item>-->
    </el-form>
    <el-form v-else ref="form" :model="formData" :rules="formRules" label-width="10em" label-position="left">
      <el-form-item prop="floorArea" label="占地面积">
        <el-input v-model="formData.floorArea" placeholder="请输入占地面积">
          <template slot="append">公顷</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="surroundingEnvironment" label="地理位置及周边环境">
        <el-input
          v-model="formData.surroundingEnvironment"
          :rows="4"
          type="textarea"
          placeholder="请输入地理位置及周边环境"
        />
      </el-form-item>
      <el-form-item prop="ownership" label="经营场所所有权">
        <el-input v-model="formData.ownership" :rows="4" type="textarea" placeholder="请输入经营场所所有权" />
      </el-form-item>
      <el-form-item prop="internalEnvironment" label="经营地址内部环境">
        <el-input v-model="formData.internalEnvironment" :rows="4" type="textarea" placeholder="请输入经营地址内部环境" />
      </el-form-item>
      <el-form-item prop="mainFacilities" label="主要经营设施">
        <el-input v-model="formData.mainFacilities" :rows="4" type="textarea" placeholder="请输入主要经营设施" />
      </el-form-item>
      <el-form-item prop="useFacilities" label="经营设施使用情况">
        <el-input v-model="formData.useFacilities" :rows="4" type="textarea" placeholder="请输入经营设施使用情况" />
      </el-form-item>
      <el-form-item prop="staffQuality" label="员工素质">
        <el-input v-model="formData.staffQuality" :rows="4" type="textarea" placeholder="请输入员工素质" />
      </el-form-item>
      <el-form-item prop="enthusiasmEmployees" label="员工工作积极性">
        <el-input v-model="formData.enthusiasmEmployees" :rows="4" type="textarea" placeholder="请输入员工工作积极性" />
      </el-form-item>
      <el-form-item prop="employeEvaluationSuperior" label="员工对上级评价">
        <el-input
          v-model="formData.employeEvaluationSuperior"
          :rows="4"
          type="textarea"
          placeholder="请输入员工对上级评价"
        />
      </el-form-item>
      <el-form-item prop="qualityManagement" label="管理层素质">
        <el-input v-model="formData.qualityManagement" :rows="4" type="textarea" placeholder="请输入管理层素质" />
      </el-form-item>
      <el-form-item prop="managementStyleLevel" label="管理风格和水平">
        <el-input v-model="formData.managementStyleLevel" :rows="4" type="textarea" placeholder="请输入管理风格和水平" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { differenceWith } from "lodash";

export default {
  name: "Comp22",
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
          label: "企业占地面积(平方米)",
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
        floorArea: "", // 	总计
        surroundingEnvironment: "", // 	地理位置及周边环境
        ownership: "", // 	经营场所所有权
        internalEnvironment: "", // 	经营地址内部环境
        mainFacilities: "", // 	主要经营设施
        useFacilities: "", // 	经营设施使用情况
        staffQuality: "", // 	员工素质
        enthusiasmEmployees: "", // 	员工工作积极性
        employeEvaluationSuperior: "", // 	员工对上级评价
        qualityManagement: "", // 	管理层素质
        managementStyleLevel: "" // 	管理风格和水平
      },
      formRules: {
        floorArea: createRules({
          msg: "占地面积",
          numberFloatUp: true,
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error("占地面积必填"));
              return;
            }
            if (Number(value) > 10000) {
              callback(new Error("占地面积不能大于10000"));
            } else {
              callback();
            }
          }
        }),
        surroundingEnvironment: createRules({
          msg: "地理位置及周边环境",
          max: 200
        }),
        ownership: createRules({
          msg: "经营场所所有权",
          max: 200
        }),
        internalEnvironment: createRules({
          msg: "经营地址内部环境",
          max: 200
        }),
        mainFacilities: createRules({
          msg: "主要经营设施",
          max: 200
        }),
        useFacilities: createRules({
          msg: "经营设施使用情况",
          max: 200
        }),
        staffQuality: createRules({
          msg: "员工素质",
          max: 200
        }),
        enthusiasmEmployees: createRules({
          msg: "员工工作积极性",
          max: 200
        }),
        employeEvaluationSuperior: createRules({
          msg: "员工对上级评价",
          max: 200
        }),
        qualityManagement: createRules({
          msg: "管理层素质",
          max: 200
        }),
        managementStyleLevel: createRules({
          msg: "管理风格和水平",
          max: 200
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
      if (!data) return;
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
