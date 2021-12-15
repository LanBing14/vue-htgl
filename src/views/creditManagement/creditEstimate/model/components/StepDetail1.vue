<template>
    <el-form ref="form" :model="formData" label-width="7em" class="form">
        <el-form-item label="模型名称">{{ formData.modelName }}</el-form-item>
        <el-form-item label="模型描述">{{ formData.modelDesc }}</el-form-item>
        <el-form-item label="模型层级">
            <el-radio-group v-model="formData.modelLevel" @change="radioChange" disabled>
                <el-radio label="0">两层</el-radio>
                <el-radio label="1">三层</el-radio>
            </el-radio-group>
        </el-form-item>
    </el-form>
</template>

<script>
    import {
        Api_EvaluateModelFirst,
        Api_EvaluateModelFirstGet,
        Api_EvaluateModelFirstUpdate
    } from "@/api/creditManagement/creditEstimate/model";

    export default {
        name: "StepDetail1",
        props: {
            rowId: String, // 当前记录id
            defaultData: Object // 默认数据，当前步骤返回上一层时有可能作了保存数据的操作，由此重新获得上一次保存的值
        },
        data() {
            const createRules = this.$createRules;
            const f = this.defaultData
                ? this.defaultData
                : {
                    modelName: "",
                    modelDesc: "",
                    modelLevel: "0",
                    modelSource: 1
                };
            return {
                formData: f,
                version: "" // 数据的版本号
            };
        },
        created() {
            if (this.rowId) {
                Api_EvaluateModelFirstGet(this.rowId).then(
                    ({modelName, modelDesc, modelLevel, modelSource, version}) => {
                        this.formData.modelName = modelName;
                        this.formData.modelDesc = modelDesc;
                        this.formData.modelLevel = modelLevel;
                        this.formData.modelSource = modelSource;
                        this.version = version;
                        this.radioChange(modelLevel);
                    }
                );
            }
        },
        methods: {
            validate() {
                return new Promise((resolve) => {
                    resolve()
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
            }
        }
    }
</script>

<style scoped>
    .form {
        max-width: 600px;
        margin: auto;
    }
</style>
