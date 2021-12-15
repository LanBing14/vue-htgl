<template>
  <!--    生产、经营场所-->
  <div>
    <el-form ref="form" :model="formData" :rules="formRules" label-width="60px">
      <el-form-item prop="type" label="类别">
        <el-select
          v-model="formData.type"
          :disabled="!modelStatus"
          class="w-100"
          placeholder="请选择类别"
          style="height:30px"
        >
          <el-option v-for="(el, index) in options" :key="index" :label="el.label" :value="el.value" />
        </el-select>
      </el-form-item>
      <el-form-item prop="total" label="总计">
        <el-input v-model="formData.total" placeholder="请输入总计" />
      </el-form-item>
      <el-form-item prop="own" label="自有">
        <el-input v-model="formData.own" placeholder="请输入自有" />
      </el-form-item>
      <el-form-item prop="mortgage" label="按揭">
        <el-input v-model="formData.mortgage" placeholder="请输入按揭" />
      </el-form-item>
      <el-form-item prop="lease" label="租赁">
        <el-input v-model="formData.lease" placeholder="请输入租赁" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { differenceWith } from "lodash";

export default {
  name: "Comp21",
  props: {
    id: String, //  企业id
    modelStatus: Boolean, // 新增或修改状态
    data: {
      // 详情数据
      type: Object,
      default: () => ({})
    },
    sourceData: {
      // 表格源数据
      type: Array,
      default: () => []
    }
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
        type: "", // 	类别
        total: "", // 	总计
        own: "", // 	自有
        mortgage: "", // 	按揭
        lease: "" // 	租赁
      },
      formRules: {
        type: createRules({
          msg: "类别",
          required: true
        }),
        total: createRules({
          msg: "总计",
          require: true,
          numberFloatUp: true,
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error("总计必填"));
              return;
            }
            if (Number(value) > 100000000) {
              callback(new Error("总计不能大于1亿"));
            } else {
              callback();
            }
          }
        }),
        own: createRules({
          msg: "自有",
          require: true,
          numberFloatUp: true,
          validator: (rule, value, callback) => {
            this.validatorMoreTotal("自有", rule, value, callback);
          }
        }),
        mortgage: createRules({
          msg: "按揭",
          require: true,
          numberFloatUp: true,
          validator: (rule, value, callback) => {
            this.validatorMoreTotal("按揭", rule, value, callback);
          }
        }),
        lease: createRules({
          msg: "租赁",
          require: true,
          numberFloatUp: true,
          validator: (rule, value, callback) => {
            this.validatorMoreTotal("租赁", rule, value, callback);
          }
        })
      }
    };
  },
  watch: {
    data(val) {
      this.mergeData(val);
    },
    sourceData(val) {
      this.mergeSourceData(val);
    }
  },
  created() {
    this.mergeSourceData(this.sourceData);
    this.mergeData(this.data);
  },
  methods: {
    mergeData(data) {
      if (!this.modelStatus) {
        this.$nextTick(() => {
          this.options = this.sourceOptions.filter(i => i.value === data.type);
        });
      }
      if (!data || !data.id) {
        this.$nextTick(() => {
          this.$refs.form.resetFields();
          return;
        });
      }
      Object.keys(this.formData).forEach(key => {
        this.formData[key] = data[key] ? String(data[key]) : "";
      });
    },
    mergeSourceData() {
      const d = this.sourceData.map(i => ({
        value: i.type
      }));
      this.options = differenceWith(this.sourceOptions, d, (arrVal, othVal) => {
        return arrVal.value === othVal.value;
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
    // 验证值是否大于总计
    validatorMoreTotal(msg, rule, value, callback) {
      if (!value) {
        callback(new Error(msg + "必填"));
        return;
      }
      if (this.formData.total && Number(value) > Number(this.formData.total)) {
        callback(new Error(msg + "不能大于总计"));
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

<style scoped>
</style>
