<template>
    <el-row class="marT33 marB49">
        <el-form
            :model="contactForm"
            :rules="rules"
            ref="contactForm"
            label-width="130px"
            class="contact-form"
        >
            <el-form-item label="反馈分类" prop="type">
                <el-select
                    v-model="contactForm.type"
                    placeholder="请选择反馈分类"
                    style="width: 100%;"
                >
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="反馈内容" prop="content">
                <el-input
                    type="textarea"
                    :rows="6"
                    placeholder="请输入反馈内容"
                    v-model="contactForm.content"
                ></el-input>
            </el-form-item>
            <!--<el-form-item label="图片" prop="picture">
                            <el-upload
                                class="upload-demo"
                                :action="uploadUrl"
                                :http-request="myUpload"
                                :multiple="multiple"
                                :before-upload="beforeUpload"
                                :on-preview="handlePreview"
                                :on-remove="handleRemove"
                                :file-list="fileList"
                                list-type="picture"
                            >
                                <el-button size="small" type="primary">点击上传</el-button>
                                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                            </el-upload>
            </el-form-item>-->
            <el-form-item label="手机号码" prop="mobile">
                <el-input v-model="contactForm.mobile"></el-input>
            </el-form-item>
            <el-form-item style="text-align:center">
                <el-button
                    type="primary"
                    @click="submitForm('contactForm')"
                    style="width: 98px;"
                    :loading="loading"
                    >提交</el-button
                >
                <el-button
                    @click="resetForm('contactForm')"
                    style="margin-left: 9px;text-align:center"
                    >重置</el-button
                >
            </el-form-item>
        </el-form>
    </el-row>
</template>

<script>
import { Api_GetDicts, Api_ComboboxDict } from "@/api/baseApi";
import { getUserInfo } from "@/utils/auth";
import { Api_GetCompanyInfoById } from "@/api/baseApi";
import { Api_CommitFeedback } from "@/api/userCenter/contactService";

export default {
    name: "Contact",
    components: {},
    data() {
        return {
            options: [],
            value: "",
            contactForm: {
                type: "",
                content: "",
                mobile: ""
            },
            rules: {
                type: [
                    {
                        required: true,
                        message: "请选择反馈类型",
                        trigger: "blur"
                    }
                ],
                content: [
                    {
                        required: true,
                        message: "请输入反馈内容",
                        trigger: "blur"
                    },
                    {
                        min: 0,
                        max: 500,
                        message: "长度在 0 到 500 个字符",
                        trigger: "blur"
                    }
                ],
                mobile: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "手机必填"
                    },
                    {
                        pattern: /^1[3456789]\d{9}$/,
                        message: "请输入正确的手机号"
                    }
                ]
            },
            loading: false
        };
    },
    created: function() {
        // 带出用户信息
        const { mobile } = this.$store.state.user.userInfo;
        this.contactForm.mobile = mobile;

        // 获取反馈类型
        Api_ComboboxDict("feedback_type").then(res => {
            this.options = res;
        });
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    const formData = this.contactForm;
                    // formData.files = this.fileList;
                    this.loading = true;
                    Api_CommitFeedback(formData)
                        .then(res => {
                            this.loading = false;
                            this.$message.success(
                                "提交成功，平台客服会尽快联系您，请您耐心等待"
                            );
                            // router.push({path: '/userCenter/info'});
                            this.$refs["contactForm"].resetFields();
                        })
                        .catch(e => {
                            this.loading = true;
                            this.$message.error(e);
                        });
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
        /* handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
                console.log(this.fileList);
            },
            beforeUpload(file) {
                const isMatch = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
                const isLt2M = file.size / 1024 < 500;
                if (!isMatch) {
                    this.$message.error('图片格式不匹配')
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 500kb!')
                }
                return isMatch && isLt2M
            },
            myUpload(content) {
                let formData = new FormData();
                formData.append('files', content.file);
                Api_upload(this.uploadUrl, formData).then(res => {
                    if (res.stateCode === '1') {
                        res.data.success.forEach(item => {
                            item.url = item.path;
                            this.fileList.push(item);
                        });
                    }
                })
            }*/
    }
};
</script>

<style lang="scss">
.contact-form {
    margin: 0 auto;
    width: 600px;
    padding-top: 34px;

    .el-form-item {
        margin-bottom: 20px;
    }

    .el-form-item__label {
        text-align: left;
        padding-left: 19px;
        font-size: 16px;
        font-weight: 500;
    }

    .el-input__inner {
        // width: 281px;
        margin-left: 1px;
    }

    .el-textarea__inner {
        // width: 281px;
    }
}
</style>
