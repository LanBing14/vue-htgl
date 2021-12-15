<template>
    <!--    <Dialog :visible.sync="visible" title="催收预警登记" :onOk="handleSure" width="500px" @close="onClose">-->
    <div>
        <div class="page-header">
            <h1 class="page-name">
                <span>催收预警</span>
            </h1>
        </div>
        <div class="page-content">
            <el-form ref="form" :model="formData" :rules="formRules" label-width="7em">
                <el-form-item label="客户名称">
                    <span class="canClick" @click="$gotoCustomerDetail(selectData.companyId)">{{ selectData.companyName }}</span>
                </el-form-item>
                <el-form-item label="合同名称">
                    <span class="canClick" @click="$gotoContractDetail(selectData.contractId)">
                        {{ selectData.contractCode }}/{{ selectData.contractName }}
                    </span>
                </el-form-item>
                <el-form-item label="应收编码">
                    <span class="canClick" @click="$gotoReceivablesDetail(selectData.receivableId)">
                        {{ selectData.receivableCode }}
                    </span>
                </el-form-item>
                <ReceivableDetail :data="selectData"></ReceivableDetail>
                <el-form-item label="催收类型" prop="collectionType">
                    {{ selectData.collectionType }}
                </el-form-item>
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
                            <el-date-picker v-model="formData.registerDate" value-format="yyyy-MM-dd" type="date"
                                            placeholder="请选择催收日期"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="催收描述" prop="remark">
                    <el-input v-model="formData.remark" :rows="4" type="textarea" placeholder="请输入催收描述"></el-input>
                </el-form-item>
                <el-form-item label="附件" prop="files">
                    <Upload v-model="formData.files" fileType="jpg,png" :limit="5" :fileSize="2"></Upload>
                </el-form-item>
            </el-form>
            <div class="form-bottom-btns size-btn-change">
                <el-button type="primary" @click="handleSure">确定</el-button>
                <el-button @click="cancel">取消</el-button>
            </div>
        </div>
    </div>
    <!--    </Dialog>-->
</template>

<script>
    import {merge} from "lodash";
    import Upload from "@/components/Upload";
    import ReceivableDetail from '@/components/ReceivableDetail';
    import {
        Api_CollectionWarningDetail,
        Api_CollectionWarning
    } from "@/api/creditManagement/creditCollection/collectionWarning";

    export default {
        name: "CheckIn",
        components: {
            Upload,
            ReceivableDetail
        },
        props: {
            selectData: Object,
            typeOptions: Array // 催收类型下拉数据
        },
        data() {
            return {
                visible: false,
                baseData: {
                    // 基础信息
                    contractName: "", //    合同名称
                    companyName: "", // 	客户名称
                    oweMoney: "", // 		应收未收
                    startDate: "", // 		确认日期
                    endDate: "", // 		到期日
                    collectionType: "" // 	催收类型
                },
                formData: {
                    returnDesire: "", // 还款意愿
                    remark: "", // 描述
                    registerDate: this.$dateFormat(+new Date()), // registerDate
                    files: []
                },
                formRules: {
                    returnDesire: [{
                        required: true,
                        message: '还款意愿必填'
                    }],
                    remark: [
                        {
                            required: true,
                            message: "催收描述必填"
                        },
                        {
                            max: 200,
                            message: "催收描述最大长度为200个字"
                        }
                    ],
                    registerDate: [{
                        required: true,
                        message: '催收日期必填'
                    }]
                }
            };
        },
        methods: {
            handleSure() {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        const postData = merge({}, this.formData);
                        postData.files = postData.files.map(item => item.url);
                        const loading = this.$openLoading();
                        Api_CollectionWarning(this.selectData.id, postData)
                            .then(res => {
                                loading.close();
                                this.$message.success(res);
                                this.cancel()
                            })
                            .catch(e => {
                                loading.close();
                                this.$message.error(e);
                            });
                    }
                });
            },
            cancel() {
                this.$emit('edit', false);
            },
            onClose() {
                this.$refs.form.resetFields();
            }
            // 转换催收类型为中文
            // getCollectionType(value) {
            //     const findRes = this.typeOptions.find(item => item.id === value);
            //     return findRes ? findRes.collectionType : '';
            // }
        }
    };
</script>

<style scoped>
</style>
