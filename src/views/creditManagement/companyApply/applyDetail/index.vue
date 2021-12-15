<template>
    <div class="apply-wrapper-read">
        <div class="title-name">
            <span class="name-1">征集信息填报</span>
            <el-button class="name-back" @click="returnApply">返回</el-button>
        </div>
        <div class="apply-see-content ">
            <el-row>
                <el-col :span="24">
                    <div class="see-wrapper">
                        <p class="apply-name">征集主题</p>
                        <p class="apply-enclosure">{{declarationList.declarationSubject}}</p>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <div class="see-wrapper">
                        <p class="apply-name">征集下发时间</p>
                        <p class="apply-enclosure">{{declarationList.issuingTime}}</p>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="see-wrapper">
                        <p class="apply-name">提交时间</p>
                        <p class="apply-enclosure">{{declarationList.createTime}}</p>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <div class="see-wrapper">
                        <p class="apply-name">企业</p>
                        <p class="apply-enclosure">江苏未至科技股份有限公司</p>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="see-wrapper">
                        <p class="apply-name">审核状态</p>
                        <div class="apply-enclosure">
                            <!-- 1未填报 2未审核 3审核通过 4审核不通过 5驳回未提交 -->
                          <!-- <span class="apply-pass" v-if="fillStatus.status == 1">未填报</span>
                          <span class="apply-pass" v-if="fillStatus.status == 2">未审核</span> -->
                            <span class="apply-pass" v-if="fillStatus.status == 1">未填报</span>
                            <span class="apply-pass" v-if="fillStatus.status == 2">未审核</span>
                          <span class="apply-pass" v-if="fillStatus.status == 3">审核通过</span>
                          <span class="apply-pass" v-if="fillStatus.status == 4">审核不通过</span>
                          <span class="apply-pass" v-if="fillStatus.status == 5">驳回未提交</span>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <!-- 已填报的页面内，查看页面增加附件的显示，增加填报说明的显示 -->
            <el-row>
                <div class="see-wrapper">
                    <p class="apply-name">填报说明</p>
                    <p class="apply-enclosure" style="width: 80%;">
                        {{declarationList.declarationExplain}}
                    </p>
                </div>
            </el-row>
            <el-row>
                <div class="see-wrapper">
                    <p class="apply-name">附件</p>
                    <div class="apply-enclosure">
                        <a
                            v-if=" declarationList.uploadFiles.length > 0"
                            v-for="(el,index) in declarationList.uploadFiles"
                            :key="index"
                            :href="downUrl + el.filePath"
                            class=" a-block"
                            target="_blank"
                            download
                            >{{el.fileName}}</a>
                    </div>
                </div>
            </el-row>
            <el-row>
                <div class="see-wrapper">
                    <p class="apply-name">意见</p>
                    <p class="apply-enclosure" style="width: 80%; min-height: 60px;">{{fillStatus.remark}}</p>
                </div>
            </el-row>
        </div>
        <p class="title-p leftline">征集详情</p>
        <div class="apply-see-next ">
            <div class="next-item clearfix" v-for="(item,index) in resultData.questions" ::key="item.questionId">
                <div class="left-num ">{{item.configOrder}}:</div>
                <div class="right-content-next">
                    <div class="right-next-title"> <span class="require" v-if="item.isRequired == 1">*</span>{{item.questionName}}

                        {{
                            item.questionType=="fill_blank"?'【填空形式】'
                            : item.questionType=="Single_choice"?'【单选形式】'
                            : item.questionType=="multiple_choice"?'【多选形式】'
                            : item.questionType=="pull_down"? '【下拉形式】'
                            : item.questionType=="0" ?  '【相关附件】': '【日期选择】'
                        }}
                     </div>
                    <div class="search-next">
                        <div v-if="item.questionType == 'fill_blank'">
                            <el-input type="textarea" autosize v-model="item.fillblankanswer"  disabled placeholder="请输入内容">
                            </el-input>
                        </div>
                        <div  v-if="item.questionType == 'single_choice'">
                            <el-radio-group v-model="item.singlechoiceanswer" >
                                <el-radio v-for="items in item.option" :label="items.id" :key="items.id" disabled>
                                    {{items.itemsName}}</el-radio>
                            </el-radio-group>
                        </div>
                        <div  v-if="item.questionType == 'multiple_choice'">
                            <el-checkbox-group v-model="item.multiplechoiceanswer" >
                                <el-checkbox
                                    v-for="items in item.option"
                                    :label="items.id"
                                    :key="items.id"
                                    disabled
                                    >{{items.itemsName}}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div  v-if="item.questionType == 'pull_down'">
                            <el-select v-model="item.pulldownanswer" placeholder="请选择" disabled>
                                <el-option v-for="item in item.option" :key="item.id" :label="item.itemsName"
                                    :value="item.itemsName"
                                    >
                                </el-option>
                            </el-select>
                         </div>
                         <div  v-if="item.questionType == '0'">
                           <div v-for="items in item.fileuploadanswer" :key="items.name" style="margin-left: 10px;color: #409eff;">
                            <i class="el-icon-document" style="margin-right: 5px;"></i>  {{items.name}}
                           </div>
                         </div>
                         <div  v-if="item.questionType == '1'">
                            <el-input type="textarea" autosize v-model="item.timeselectanswer"  disabled placeholder="请输入内容">
                            </el-input>
                         </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {Api_GetApplyDetail} from  "@/api/creditManagement/companyApply/index";
    export default {
        props:{
            modelId:  {
                type: String,
            },
        },
        data() {
            return {
                resultData :{},
                declarationList:{
                    declarationSubject:''
                },
                questionsList:[],
                downUrl: process.env.VUE_APP_FILE_IMG_API,
                // 附件假数据
                uploadFiles:[],
                fillStatus:{}

            }
        },
        methods: {
            returnApply(){
                this.$emit('handleReturn',true)
            },
            async getList(){
               const result = await Api_GetApplyDetail(this.modelId)
               this.declarationList = result.declaration
               this.questionsList = result.questions
               this.fillStatus = result.fill
               this.resultData = result
            }
        },
        created() {
            this.getList()
        },
    }
</script>
<style lang="scss" scoped>
    .apply-wrapper-read {
        background-color: #fff;
        /deep/.el-checkbox{
            display: block;
            height: 30px;
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
        .title-p {
            color: #333;
            font-size: 16px;
            padding-left: 20px;
            line-height: 21px;
            width: 100%;
            position: relative;

        }
        .title-p::before  {
                content:'';
                position: absolute;
                top:0;
                left: 0;
                width: 4px;
                height: 21px;
                background-color: #3399e6;
        }
        .apply-see-content{
            .see-wrapper{
                display: flex;
                color: #606266;
                margin-top: 5px;
                line-height: 38px;
                font-size: 14px;
                .apply-name{
                    width: 110px;
                    margin-right: 25px;
                    text-align: right;
                }

                .apply-explain{
                    width: 83%;
                }

                .apply-enclosure {
                    color: #4b9df3;

                    .apply-pass {
                        padding: 4px 7px;
                        background: #67c23a;
                        border-radius: 3px;
                        font-size: 14px;
                        color: #fff;
                    }
                }

            }
        }
        .apply-see-next {
            padding: 0 30px;
            margin-top: 35px;
            .next-item{

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

                    .right-next-title {
                        .require {
                            color: #f25050;
                        }
                    }


                    .search-next {
                        margin-top: 20px;
                        .el-input {
                            width: 100%;
                        }
                        /deep/.el-radio {
                            display: block;
                            line-height: 40px;
                        }
                    }
                }
            }
        }

    }
</style>
