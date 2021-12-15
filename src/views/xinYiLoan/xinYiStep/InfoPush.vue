<template>
    <div class="xinyi-online-author">
        <p class="marT30 marB30 fxb-999 taCenter">
            授权仅用于本次填报相关数据的借贷评估，在无授权情况下我们将严格保护您的数据安全
        </p>
        <el-form
            class="form-step"
            ref="uploadForm"
            :model="uploadForm"
            label-width="150px"
        >
            <el-form-item label="征信报告">
                <p class="fxb-999">
                    <svg-icon icon-class="light" class="font16"/>
                    报告为近一个月的人行征信报告
                </p>
                <el-upload
                    class="upload-demo"
                    accept=".xls,.xlsx"
                    :limit="2"
                    :disabled="zxFileList.length === 2"
                    :action="uploadUrl"
                    :http-request="handleUpload"
                    :before-upload="beforeUpload"
                    :on-remove="handleZxRemove"
                    :on-exceed="handleZxExceed"
                >
                    <el-button
                        :loading="qiyeLoading"
                        :disabled="zxFileList.length === 2"
                        type="primary"
                        @click="submitUpload(1)"
                        plain
                        class="font16"
                    >
                        <svg-icon icon-class="paper" class="font35 veral3"/>
                        企业征信报告
                    </el-button>
                    <el-button
                        :loading="kongzrLoading"
                        :disabled="zxFileList.length === 2"
                        type="primary"
                        @click="submitUpload(2)"
                        plain
                        class="font16"
                    >
                        <svg-icon icon-class="paper" class="font35 veral3"/>
                        实际控制人征信报告
                    </el-button>
                </el-upload>
            </el-form-item>
            <el-form-item label="财务报告">
                <p class="fxb-999">
                    <svg-icon icon-class="light" class="font16"/>
                    提示：报告为企业近三年资产负债表，利润表，现金流量表
                </p>
                <el-upload
                    class="upload-demo"
                    accept=".xls,.xlsx"
                    :limit="3"
                    :disabled="cwFileList.length === 3"
                    :action="uploadUrl"
                    :http-request="handleUpload"
                    :before-upload="beforeUpload"
                    :on-remove="handleZxRemove"
                    :on-exceed="handleZxExceed"
                >
                    <el-button
                        size="medium"
                        type="info"
                        @click="submitUpload(3)"
                    >
                        点击上传
                    </el-button>
                    <el-button
                        size="medium"
                        type="info"
                        @click="submitUpload(3)"
                    >
                        点击上传
                    </el-button>
                    <el-button
                        size="medium"
                        type="info"
                        @click="submitUpload(3)"
                    >
                        点击上传
                    </el-button>
                </el-upload>
            </el-form-item>
            <el-form-item label="">
                <p class="fxb-999 linH25">
                    下载标准EXCEL模版进行填报，可以提高审核效率，
                    <br/>缩短审核时间2-3天
                    <a
                        class="fxb-blue"
                        href="../../../../static/template/财务报表上报模版.xlsx"
                    >点击下载</a
                    >
                </p>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="nextStep()">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import {Api_save} from "@/api/xinYiLoan";
    import {Api_upload, Api_fileUrl} from "@/api/baseApi";

    export default {
        data() {
            return {
                loading: false,
                financeApplicationId: "",
                uploadUrl: Api_fileUrl(),
                curUploadFileNum1: -1, // 传递给后台的图片顺序
                curUploadFileNum2: -1, // 传递给后台的图片顺序
                curUploadFileNum3: -1, // 传递给后台的图片顺序
                uploadType: 1, // 1:企业征信报告 2实际控制人报告 3 财务报告
                // 征信报告
                zxFileList: [],
                // 企业征信导
                qiyeLoading: false,
                enterpriseReport: {
                    path: "", // 传 上传返回的路径
                    name: "" // 文件名称
                },
                // 控制人征信导入加载
                kongzrLoading: false,
                personReport: {
                    path: "", // 传 上传返回的路径
                    name: "" // 文件名称
                },
                // 财务报告
                cwFileList: [],
                batchLoading: false,
                enterpriseMoneyInfoList: [],
                // 上传得文件
                uploadFile: "",
                uploadForm: {}
            };
        },
        mounted() {
            this.financeApplicationId =
                this.$route.query.financeApplicationId || null;
        },
        methods: {
            beforeUpload(file) {
                const isMatch = /\.(xls|xlsx|XLS|XLSX)$/.test(file.name);
                const isLt2M = file.size / 1024 < 500;
                let fileFlag = true;
                if (!isMatch) {
                    this.$message.warning("请上传xls，xlsx格式的文件");
                }
                if (!isLt2M) {
                    this.$message.warning("文件大小不能超过500kb");
                }
                let fileList = [];
                if (this.uploadType === 1 || this.uploadType === 2) {
                    fileList = this.zxFileList;
                }
                if (this.uploadType === 3) {
                    fileList = this.cwFileList;
                }
                fileList.forEach(ifile => {
                    if (file.name === ifile.name) {
                        this.$message({
                            message: "上传文件重复",
                            type: "warning"
                        });
                        fileFlag = false;
                    }
                });

                return isMatch && isLt2M && fileFlag;
            },
            submitUpload(type) {
                this.uploadType = type;
            },
            handleUpload(content) {
                let num = 0;
                const self = this;
                const formData = new FormData();
                formData.append("file", content.file);
                switch (this.uploadType) {
                    case 1:
                        this.curUploadFileNum1++;
                        this.qiyeLoading = true;
                        num = this.curUploadFileNum1;
                        break;
                    case 2:
                        this.curUploadFileNum2++;
                        this.kongzrLoading = true;
                        num = this.curUploadFileNum2;
                        break;
                    case 3:
                        this.curUploadFileNum3++;
                        this.batchLoading = true;
                        num = this.curUploadFileNum3;
                        break;
                }
                Api_upload(this.uploadUrl + num, formData).then(res => {
                    switch (self.uploadType) {
                        case 1:
                            self.qiyeLoading = true;
                            self.enterpriseReport.name = content.name;
                            self.enterpriseReport.path = res.url;
                            self.zxFileList.push(content.file);
                            break;
                        case 2:
                            self.kongzrLoading = true;
                            self.personReport.name = content.name;
                            self.personReport.path = res.url;
                            self.zxFileList.push(content.file);
                            break;
                        case 3: {
                            self.batchLoading = true;
                            const upfile = {
                                path: res.url,
                                name: content.name
                            };
                            self.enterpriseMoneyInfoList.push(upfile);
                        }
                            break;
                    }
                }).catch(e => {
                    switch (self.uploadType) {
                        case 1:
                            self.qiyeLoading = false;
                            break;
                        case 2:
                            self.kongzrLoading = false;
                            break;
                        case 3:
                            self.batchLoading = false;
                            break;
                    }
                });
            },
            // 删除文件，初始化信息
            handleZxRemove(file) {
                let i = 0;
                if (this.uploadType === 1 || this.uploadType === 2) {
                    this.zxFileList.forEach((ifile, iindex) => {
                        if (file.name === ifile.name) {
                            i = iindex;
                        }
                    });
                    this.zxFileList.splice(i, 1);
                }
                if (this.uploadType === 3) {
                    this.cwFileList.forEach((ifile, iindex) => {
                        if (file.name === ifile.name) {
                            i = iindex;
                        }
                    });
                    this.cwFileList.splice(i, 1);
                }
            },
            handleZxExceed(files, fileList) {
                this.$message({
                    message: "选择文件超过数量",
                    type: "warning"
                });
            },
            onSubmit() {
                Api_save({
                    financeApplicationId: this.financeApplicationId,
                    enterpriseReport: this.enterpriseReport,
                    personReport: this.personReport,
                    enterpriseMoneyInfoList: this.enterpriseMoneyInfoList
                }).then(res => {
                    this.$router.push({
                        path: "/xinYiLoan/xinYiLoan"
                        // query: res.data.financeApplicationId
                    });
                });
            }
        }
    };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .veral3 {
        vertical-align: -0.32em;
    }

    .linH25 {
        line-height: 25px;
    }

    .form-step {
        width: 650px;
        margin: 0 auto;
    }
</style>
