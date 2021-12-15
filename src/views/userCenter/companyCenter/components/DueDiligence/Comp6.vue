<template>
  <!--    高层管理人员-->
  <div>
    <el-form ref="form" :model="formData" :rules="formRules" label-width="6em">
      <el-form-item prop="name" label="姓名">
        <el-input v-model="formData.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item prop="job" label="职务">
        <el-input v-model="formData.job" placeholder="请输入职务" />
      </el-form-item>
      <el-form-item prop="sort" label="排序">
        <el-input v-model="formData.sort" placeholder="请输入排序" />
      </el-form-item>
      <el-form-item prop="resume" label="工作简历">
        <el-input v-model="formData.resume" :rows="4" type="textarea" placeholder="请输入工作简历" />
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
      formData: {
        name: "", // 	姓名
        job: "", // 	职务
        resume: "", // 	工作简历
        sort: "" // 	排序
      },
      formRules: {
        name: createRules({
          msg: "姓名",
          max: 20,
          required: true
        }),
        job: createRules({
          msg: "职务",
          max: 10,
          required: true
        }),
        resume: createRules({
          msg: "工作简历",
          max: 200,
          required: true
        }),
        sort: createRules({
          msg: "排序",
          required: true,
          cipint0: true,
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error("排序必填"));
              return;
            }
            if (Number(value) < 1 || Number(value) > 999) {
              callback(new Error("请输入1-999之间的整数"));
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
      if (!data || !data.id) {
        this.$nextTick(() => {
          this.$refs.form.resetFields();
          return;
        });
      }
      this.formData.name = data.name;
      this.formData.job = data.job;
      this.formData.resume = data.resume;
      this.formData.sort = data.sort;
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

<style scoped>
</style>
