<template>
  <el-form ref="form" :model="formData" :rules="formRules" label-width="120px" class="form">
    <el-form-item label="模型名称" prop="modelName">
      <el-input v-model="formData.modelName" placeholder="请输入模型名称"></el-input>
    </el-form-item>
    <el-form-item label="模型描述" prop="modelDesc">
      <el-input v-model="formData.modelDesc" :rows="4" type="textarea" placeholder="请输入模型描述"></el-input>
    </el-form-item>
    <el-form-item label="模型层级" prop="modelLevel" v-if="false">
      <el-radio-group v-model="formData.modelLevel" @change="radioChange" :disabled="rowId?true:false">
        <el-radio label="0">两层</el-radio>
        <el-radio label="1">三层</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item prop="fullScore" label="模型满分分值">
      <el-input v-model="formData.fullScore" placeholder="请输入模型满分分值"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import {
  Api_EvaluateModelFirst,
  Api_EvaluateModelFirstGet,
  Api_EvaluateModelFirstUpdate,
} from "@/api/creditManagement/creditEstimate/model";

export default {
  name: "Step1",
  props: {
    rowId: String, // 当前记录id
    defaultData: Object, // 默认数据，当前步骤返回上一层时有可能作了保存数据的操作，由此重新获得上一次保存的值
  },
  data() {
    const createRules = this.$createRules;
    const f = this.defaultData
      ? this.defaultData
      : {
          modelName: "",
          modelDesc: "",
          modelLevel: "0",
          modelSource: 1,
          fullScore: 100,
        };
    return {
      formData: f,
      version: "", // 数据的版本号
      formRules: {
        modelName: createRules({
          msg: "菜单名称",
          required: true,
          max: 20,
        }),
        modelDesc: createRules({
          msg: "模型描述",
          max: 200,
        }),
        modelLevel: createRules({
          msg: "模型层级",
          required: true,
        }),
        fullScore: createRules({
          msg: "模型满分分值",
          required: true,
        }),
      },
    };
  },
  created() {
    if (this.rowId) {
      Api_EvaluateModelFirstGet(this.rowId).then(
        ({ modelName, modelDesc, modelLevel, modelSource, fullScore, version }) => {
          this.formData.modelName = modelName;
          this.formData.modelDesc = modelDesc;
          this.formData.modelLevel = modelLevel;
          this.formData.modelSource = modelSource;
          this.formData.fullScore = fullScore;
          this.version = version;
          this.radioChange(modelLevel);
        }
      );
    }
  },
  methods: {
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            const promiseRes = this.rowId
              ? Api_EvaluateModelFirstUpdate(this.rowId, {
                  ...this.formData,
                  version: this.version,
                })
              : Api_EvaluateModelFirst(this.formData);
            promiseRes
              .then((id) => {
                this.$emit("addNewId", id);
                resolve(this.formData);
              })
              .catch((e) => {
                this.$message.error(e);
                reject(e);
              });
          } else {
            reject();
          }
        });
      });
    },
    editChange() {
      const string = Object.values(this.formData).join("");
      if (!string) {
        return false;
      }
      return true;
    },
    radioChange(data) {
      this.$emit("levelChange", data === "0");
    },
    clearData() {
      this.$refs.form.resetFields();
    },
  },
};
</script>

<style scoped>
.form {
  max-width: 600px;
  margin: auto;
}
</style>
