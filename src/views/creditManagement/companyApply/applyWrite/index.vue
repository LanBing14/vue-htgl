<template>
    <div class="apply-wrapper-read">
        <div class="title-name">
            <span class="name-1">征集信息填报</span>
            <el-button class="name-back" @click="returnApply">返回</el-button>
             
        </div>
        <div class="apply-write-content ">
            <p class="write-title">{{ declarationList.declarationSubject }}</p>
            <p class="write-time">征集下发时间： {{ declarationList.issuingTime }}</p>
            <div class="write-wrapper clearfix">
                <p class="apply-name">征集说明：</p>
                <p class="apply-explain"> {{ declarationList.declarationExplain }}</p>
            </div>
            <div class="write-wrapper clearfix" v-if="fillStatus.status  > 2">
                <p class="apply-name">审核状态：</p>
                <div class="apply-enclosure">
                    <!-- 1未填报 2未审核 3审核通过 4审核不通过 5驳回未提交 -->
                    <span class="apply-pass" v-if="fillStatus.status == 1">未填报</span>
                    <span class="apply-pass" v-if="fillStatus.status == 2">未审核</span>
                    <span class="apply-pass" v-if="fillStatus.status == 3">审核通过</span>
                    <span class="apply-pass" v-if="fillStatus.status == 4">审核不通过</span>
                    <span class="apply-pass" v-if="fillStatus.status == 5">驳回未提交</span>
                </div>
            </div>
            <div class="write-wrapper clearfix" v-if="fillStatus.status  > 2">
                <p class="apply-name">意见：</p>
                <p class="apply-enclosure" style="width: 80%; ">{{ fillStatus.remark }}</p>
            </div>
            <div class="downLoad clearfix">
                <div class="fl apply-name">相关附件:</div>
                <div class="fl">
                    <p class="detail-attach" v-for="item in declarationList.uploadFiles" ::key="item.id"
                       @click="checkFiles(item)">{{ item.fileName }}</p>
                </div>
            </div>
            <div style="display: flex;justify-content: center;">
                <span class="removeOtherHandle" @click="handleTarget">移交他人处理</span>
            </div>
        </div>

        <div class="apply-write-next ">
            <el-form :model="resultData" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <div class="next-item ">
                    <div :key="item.questionId" v-for="(item,index) in resultData.questions">
                        <el-form-item v-if="item.questionType == 'fill_blank'"
                                      :rules="{required: true, message: '不能为空', trigger: 'blur'}"
                                      :prop="'questions.' + index + '.fillblankanswer'">
                            <div class="left-num">{{ item.configOrder }}:</div>
                            <div class="right-content-next clearfix">
                                <div class="right-next-title">
                                        <span class="require"
                                              v-if="item.isRequired == 1">*</span>
                                    {{ item.questionName }} 【填空形式】
                                </div>
                                <div class="right-next-remind">{{ item.auxiliaryExplain }}</div>
                                <div class="search-next">
                                    <el-input type="textarea" autosize v-model="item.fillblankanswer"
                                              placeholder="请输入内容">
                                    </el-input>
                                </div>
                            </div>
                        </el-form-item>

                        <el-form-item v-if="item.questionType == 'single_choice'"
                                      :rules="{required: true, message: '不能为空', trigger: 'change'}"
                                      :prop="'questions.' + index + '.singlechoiceanswer'"
                        >
                            <div class="left-num ">{{ item.configOrder }}:</div>
                            <div class="right-content-next">
                                <div class="right-next-title"><span class="require"
                                                                    v-if="item.isRequired == 1">*</span>{{ item.questionName }}
                                    【单选形式】
                                </div>
                                <div class="right-next-remind">{{ item.auxiliaryExplain }}</div>
                                <div class="search-next">
                                    <el-radio-group v-model="item.singlechoiceanswer">
                                        <el-radio v-for="items in item.option" :label="items.id" :key="items.id">
                                            {{ items.itemsName }}
                                        </el-radio>
                                    </el-radio-group>
                                </div>
                            </div>
                        </el-form-item>

                        <el-form-item v-if="item.questionType == 'multiple_choice'"
                                      :rules="{required: true, message: '不能为空', trigger: 'change'}"
                                      :prop="'questions.' + index + '.multiplechoiceanswer'"
                        >
                            <div class="left-num ">{{ item.configOrder }}:</div>
                            <div class="right-content-next">
                                <div class="right-next-title"><span class="require"
                                                                    v-if="item.isRequired == 1">*</span>{{ item.questionName }}
                                    【多选形式】
                                </div>
                                <div class="right-next-remind">{{ item.auxiliaryExplain }}</div>
                                <div class="search-next">
                                    <el-checkbox-group v-model="item.multiplechoiceanswer">
                                        <el-checkbox
                                            v-for="items in item.option"
                                            :label="items.id"
                                            :key="items.id"
                                        >{{ items.itemsName }}
                                        </el-checkbox>
                                    </el-checkbox-group>
                                </div>
                            </div>
                        </el-form-item>

                        <el-form-item v-if="item.questionType == 'pull_down'"
                                      :rules="{required: true, message: '不能为空', trigger: 'change'}"
                                      :prop="'questions.' + index + '.pulldownanswer'">
                            <div class="left-num ">{{ item.configOrder }}:</div>
                            <div class="right-content-next">
                                <div class="right-next-title"><span class="require"
                                                                    v-if="item.isRequired == 1">*</span>{{ item.questionName }}
                                    【下拉形式】
                                </div>
                                <div class="right-next-remind">{{ item.auxiliaryExplain }}</div>
                                <div class="search-next">
                                    <el-select v-model="item.pulldownanswer" placeholder="请选择">
                                        <el-option v-for="item in item.option" :key="item.id" :label="item.itemsName"
                                                   :value="item.id">
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                        </el-form-item>

                        <el-form-item v-if="item.questionType == '0'"
                                      :rules="{required: true, message: '不能为空', trigger: 'change'}"
                                      :prop="'questions.' + index + '.fileuploadanswer'"
                        >
                            <div class="left-num ">{{ item.configOrder }}:</div>
                            <div class="right-content-next">
                                <div class="right-next-title"><span class="require">*</span>
                                    {{ item.questionName }}
                                    【附件上传】
                                </div>
                                <div class="right-next-remind">{{ item.auxiliaryExplain }}</div>
                                <div class="search-next">
                                    <Upload class="uploadBtn" v-model="item.fileuploadanswer" :fileSize="10" :limit="1"
                                            fileType="jpg,png,doc,xlsx,xls,pdf" tip="支持上传doc,xlsx,xls,pdf,jpg,png；单个附件大小不能超过10M ; 只允许上传一个文件;"></Upload>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item v-if="item.questionType == '1'"
                                      :rules="{required: true, message: '不能为空', trigger: 'change'}"
                                      :prop="'questions.' + index + '.timeselectanswer'"
                        >
                            <div class="left-num ">{{ item.configOrder }}:</div>
                            <div class="right-content-next">
                                <div class="right-next-title"><span class="require">*</span>
                                    时间选择
                                    【时间选择】
                                </div>
                                <div class="right-next-remind">{{ item.auxiliaryExplain }}</div>
                                <div class="search-next">
                                    <el-date-picker
                                        v-model="item.timeselectanswer"
                                        type="date"
                                        value-format="yyyy-MM-dd"
                                        placeholder="选择日期">
                                    </el-date-picker>
                                </div>
                            </div>
                        </el-form-item>

                    </div>

                </div>

                <div class="form-bottom-btns" v-if="resultData.questions&&resultData.questions.length>0">
                    <el-button type="primary" @click="handleSave('ruleForm',1)">保存</el-button>
                    <el-button type="primary" @click="handleSave('ruleForm',2)">提交</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>
<script>
import Upload from "@/components/Upload/index";
import {Api_GetApplyDetail, Api_pushApplyDetail} from "@/api/creditManagement/companyApply/index";

export default {
    props: {
        modelId: {
            type: String,
        },
    },
    components: {
        Upload
    },
    data() {
        return {
            declarationList: {
                declarationSubject: '',
                uploadFiles: []
            },
            resultData: {},
            fillStatus: {}
        }
    },
    created() {
        this.getList()
    },
    methods: {
        handleTarget() {
            this.$message.success('复制成功');
            var num = window.location.href.indexOf("/front/workportal/apply")
            var url = window.location.href.substring(0, num)
            var shareLink = url + '/applyOther?modelId=' + this.modelId
            var inputs = document.createElement("input");
            inputs.value = shareLink;
            document.body.appendChild(inputs);
            inputs.select();
            document.execCommand("Copy");
            document.body.removeChild(inputs);
        },
        checkFiles(item) {
            var params = {
                filePath: item.filePath,
                fileName: item.fileName
            }
            var url = `${process.env.VUE_APP_BASE_zxyc_API}/creditCommon/ajaxDownload.action?filePath=${params.filePath}&fileName=${params.fileName}`
            document.location.href = url;
        },
        getList() {
            Api_GetApplyDetail(this.modelId).then((result) => {
                this.declarationList = result.declaration
                this.questionsList = result.questions
                this.fillStatus = result.fill
                this.resultData = result
            })

        },
        returnApply() {
            this.$emit('handleReturn', true)
        },
        handleSave(formName, num) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var aa = this.questionsList.map(item => {
                        if (item.questionType == 'multiple_choice') {
                            return {
                                type: 'multiple_choice',
                                answers: item.multiplechoiceanswer,
                                id: item.questionId
                            }
                        } else if (item.questionType == '0') {
                            var newArr = item.fileuploadanswer.map(items => {
                                return items.url
                            })
                            return {
                                type: '0',
                                answers: newArr,
                                id: item.questionId
                            }
                        } else {
                            return {
                                type: item.questionType,
                                answers: [item.singlechoiceanswer || item.pulldownanswer || item.fillblankanswer || item.timeselectanswer],
                                id: item.questionId
                            }
                        }
                    })
                    var b = {
                        reportInVos: aa
                    }
                    Api_pushApplyDetail(this.modelId, num, b).then(res => {
                        this.$message.success(res);
                        if (num == 2) {
                            this.$emit('handleReturn', true)
                        }
                    })
                } else {
                    this.$message.error('存在未填写的征集内容，请填写完全后再提交')
                    return false;
                }
            });
        }
    },
}
</script>
<style lang="scss" scoped>
.apply-wrapper-read {
    background-color: #fff;

    .removeOtherHandle {
        padding: 8px 10px;
        background-color: #2d8cf0;
        color: #fff;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 20px;
    }

    /deep/ .el-checkbox {
        display: block;
        height: 30px;
    }

    /deep/ .el-form-item__content {
        margin-left: 0 !important;
    }

    /deep/ .el-form-item__error {
        margin-left: 117px;
    }

    .downLoad {
        color: #333;
        line-height: 40px;

        .apply-name {
            width: 8%;
        }

        .detail-attach {
            color: $light-blue;
            font-size: 12px;
            height: 30px;
        }
    }

    .title-name {
        margin-bottom: 20px;
        margin-top: 16px;

        .name-1 {
            display: inline-block;
            font-size: 16px;
            padding-bottom: 11px;
            padding-top: 3px;
            border-bottom: 2px solid $light-blue;
        }

        .name-back {
            // padding: 6px 14px;
            float: right;
            // border: 1px solid #dcdfe6;
            // border-radius: 4px;
            // color: #606266;
        }
    }

    .apply-write-content {
        padding: 0 32px;

        .write-title {
            color: #5f7b9a;
            line-height: 45px;
            font-size: 18px;
        }

        .write-time {
            color: #999;
            font-size: 14px;
            line-height: 40px;

        }

        .write-wrapper {
            display: flex;
            color: #606266;
            margin-top: 5px;
            line-height: 25px;
            font-size: 14px;

            .apply-name {
                width: 8%;
            }

            .apply-explain {
                width: 83%;
            }

            .apply-enclosure {
                color: #4b9df3;
            }

        }
    }

    .apply-write-next {
        padding: 0 30px;
        margin-top: 55px;

        .next-item {

            margin-bottom: 30px;

            .left-num {
                float: left;
                width: 80px;
                text-align: right;
                margin-right: 35px;
            }

            .right-content-next {
                float: left;
                width: 80%;

                .right-next-remind {
                    font-size: 13px;
                    line-height: 52px;
                    color: #999999;
                }

                .right-next-title {
                    .require {
                        color: #f25050;
                    }
                }


                .search-next {
                    .el-input {
                        width: 100%;
                    }

                    /deep/ .el-radio {
                        display: block;
                        line-height: 40px;
                    }
                }
            }
        }
    }

}
</style>
