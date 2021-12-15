<template>
    <div>
        <el-form ref="form" :model="form" label-width="120px">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="申请类型" prop="applyType">
                        <el-select
                            v-model="form.applyType"
                            placeholder="请选择申请类型"
                            @change="changeType"
                            style="width: 100%"
                        >
                            <el-option
                                v-for="item in applyTypeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="申请描述" prop="applyDesc" :rules="$createRules({msg:'申请描述',required:true})">
                        <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入变更申请描述信息"
                            v-model="form.applyDesc"
                            style="width: 100%; top: 0"
                        ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="申请附件">
                        <Upload v-model="uploadFiles" fileType="jpg,png" :limit="5" :fileSize="10"></Upload>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-divider></el-divider>
    </div>
</template>

<script>
import { merge } from "lodash";
import Upload from "@/components/Upload/index.vue";
import { Api_upload, Api_DownloadFileByPath } from "@/api/baseApi";

export default {
    name: "ChangeApplication",
    components: { Upload },
    props: { appType: { type: String, default: "" } },
    data() {
        return {
            form: {
                applyCode: "",
                applyType: "2",
                applyDesc: "",
                applyDate: this.$dateFormat(new Date(), "yyyy-MM-dd"),
                applyUploadFileUrls: []
            },
            applyTypeOptions: [
                { label: "订单变更", value: "2" },
                { label: "订单完成", value: "3" },
                { label: "订单取消", value: "4" }
            ],
            uploadFiles: []
        };
    },
    // watch: {
    //     appType(_v) {
    //         console.log(_v);

    //         this.form.applyType = _v;
    //         this.changeType();
    //     }
    // },
    methods: {
        changeType() {
            if (this.form.applyType === "2") {
                this.$emit("falseContractChange");
            } else {
                this.$emit("trueContractChange");
            }
        },
        setForm(_data) {
            this.form.applyType = _data.applyType;
            this.form.applyCode = _data.applyCode;
            this.changeType();
            this.form.applyDesc = _data.applyDesc;
            this.uploadFiles = _data.applyUploadFiles.map(item => ({ url: item.url, name: item.originalName }));
        },
        getForms(_s) {
            return new Promise((resolve, reject) => {
                if (_s === "save") {
                    this.form.applyUploadFileUrls = this.uploadFiles.map(item => item.url);
                    resolve(this.form);
                } else {
                    this.$refs["form"].validate(valid => {
                        if (valid) {
                            this.form.applyUploadFileUrls = this.uploadFiles.map(item => item.url);
                            resolve(this.form);
                        } else {
                            reject();
                        }
                    });
                }
            });
        }
    }
};
</script>

<style>
</style>
