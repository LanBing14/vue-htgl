<template>
    <div>
        <div v-if="!letterShow">
            <div class="page-header">
                <h1 class="page-name"><span>逾期催收登记</span></h1>
                <div>
                    <el-button @click="handleCreate(row)">生成催收函</el-button>
                    <el-button @click="handleDownload()" :disabled="xiazai&&xiazai.pdfFile.length>0? false:true">下载催收函</el-button>
                    <el-button @click="cancel">返回</el-button>
                </div>
            </div>
            <div class="page-content">
                <el-form
                    ref="form"
                    :model="formData"
                    :rules="formRules"
                    label-width="7em"
                >
                    <el-form-item label="客户名称">
                        <span class="canClick"
                            @click="$gotoCustomerDetail(baseData.companyId)">{{ baseData.companyName }}</span>
                    </el-form-item>
                    <el-form-item label="合同名称">
                        <span class="canClick" @click="getContractFn">
                            {{ baseData.contractNo }}/{{ baseData.contractName }}
                        </span>
                    </el-form-item>
                    <el-form-item label="应收编码">
                        <span class="canClick" @click="$gotoReceivablesDetail(baseData.receivableId)">
                            {{ baseData.receivableCode }}
                        </span>
                    </el-form-item>
                    <ReceivableDetail :data="baseData" :type="false"></ReceivableDetail>
                    <el-form-item label="催收类型">{{ baseData.collectionType }}</el-form-item>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="还款意愿" prop="returnDesire">
                                <el-select v-model="formData.returnDesire" placeholder="请选择客户还款意愿" style="width: 100%;">
                                    <el-option label="积极" value="0"></el-option>
                                    <el-option label="消极" value="1"></el-option>
                                    <el-option label="不清楚" value="2"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="催收日期" prop="registerDate">
                                <el-date-picker
                                    v-model="formData.registerDate"
                                    value-format="yyyy-MM-dd"
                                    type="date"
                                    placeholder="请选择催收日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="附件" prop="files">
                                <Upload v-model="formData.files" fileType="jpg,png" :limit="5" :fileSize="2"></Upload>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="催收描述" prop="remark">
                                <el-input v-model="formData.remark" :rows="4" type="textarea"
                                        placeholder="请输入催收描述"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="form-bottom-btns">
                    <el-button type="success" @click="handleSure(false)">保存</el-button>
                    <el-button type="primary" @click="handleSure(true)">提交</el-button>
                </div>
            </div>
        </div>
        <!-- 催收函 -->
        <div v-if="letterShow">
            <Create
                ref="create"
                :id="row.id"
                :letterShow.sync="letterShow"
                :typeOptions="typeOptions"
                @changeXiazai="changeXiazai"
            ></Create>
        </div>
    </div>
</template>

<script>
    import {merge} from "lodash";
    import Upload from '@/components/Upload';
    import ReceivableDetail from '@/components/ReceivableDetail';
    import {
        Api_CollectionWarningDetail
    } from '@/api/creditManagement/creditCollection/collectionWarning';
    import {
        Api_CollectionOverdue
    } from '@/api/creditManagement/creditCollection/overdueCollection';
    import Create from './Create';
    export default {
        name: "CheckIn",
        components: {
            Upload,
            ReceivableDetail,
            Create
        },
        props: {
            id: String,
            row:Object,
            typeOptions: Array // 催收类型下拉数据
        },

        data() {
            return {

                letterShow:false,//催收函显示还是隐藏
                xiazai:null,
                visible: false,
                baseData: { // 基础信息
                    contractName: '', //    合同名称
                    companyName: '', // 	客户名称
                    oweMoney: '', // 		应收未收
                    startDate: '', // 		确认日期
                    endDate: '', // 		到期日
                    collectionType: '' // 	催收类型
                },
                formData: {
                    returnDesire: '', // 还款意愿
                    remark: '', // 描述
                    registerDate: this.$dateFormat(+new Date()), // 催收日期
                    files: []
                },
                formRules: {
                    returnDesire: [{
                        required: true,
                        message: '还款意愿必填'
                    }],
                    remark: [{
                        required: true,
                        message: '催收描述必填'
                    }, {
                        max: 1000,
                        message: '催收描述最大长度为1000个字'
                    }],
                    registerDate: [{
                        required: true,
                        message: '催收日期必填'
                    }]
                }
            };
        },

        created() {
            const loading = this.$openLoading();
            Api_CollectionWarningDetail(this.id).then(res => {
    
                this.xiazai=res;
                loading.close();
                this.baseData = res
                this.formData.returnDesire = res.returnDesire
                this.formData.remark = res.remark
                this.formData.registerDate = this.$dateFormat(res.registerDate)
                this.formData.files = res.overdueFile.map(({url, originalName: name}) => ({
                    url,
                    name
                }))
                this.$nextTick(() => {
                    this.$refs.form.clearValidate()
                })
            }).catch(e => {
                loading.close();
                this.$message.error(e);
            });
        },
        methods: {
            // 更新下载的row
            changeXiazai(val){
                this.xiazai=val
            },
            // 生成催收函
            handleCreate(row) {
                // 催收函显示
               this.letterShow=true;
            },
            // 下载催收函
            handleDownload() {
                if (this.xiazai.pdfFile && this.xiazai.pdfFile.length) {
                    window.open(process.env.VUE_APP_FILE_API+this.xiazai.pdfFile[0].url);
                }
            },
            handleSure(flag) {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        const postData = merge({}, this.formData);
                        postData.commitType = flag
                        postData.files = postData.files.map(item => item.url);
                        const loading = this.$openLoading();
                        Api_CollectionOverdue(this.baseData.id, postData).then(res => {
                            loading.close();
                            this.$message.success(res);
                            this.cancel();
                        }).catch(e => {
                            loading.close();
                            this.$message.error(e);
                        });
                    }
                });
            },
            cancel() {
                this.$emit('edit', false);
            },
            // 转换催收类型为中文
            getCollectionType(value) {
                const findRes = this.typeOptions.find(item => item.id === value);
                return findRes ? findRes.collectionType : '';
            },
            getContractFn() {
                const {orders, contractId} = this.baseData
                const fn = orders ? this.$gotoOrderDetail(contractId) : this.$gotoContractDetail(contractId)
                return fn
            }
        }
    };
</script>

