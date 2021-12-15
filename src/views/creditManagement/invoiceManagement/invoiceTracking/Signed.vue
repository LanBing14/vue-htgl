<template>
    <Dialog ref="drawer" title="发票签收" :visible.sync="visible" :onOk="handleSure" width="500px" :close="closeDialog">
        <el-form ref="form" :model="form" :rules="rules" label-width="110px">
            <el-form-item label="发票签收" prop="signType">
                <el-radio-group v-model="form.signType">
                    <el-radio label="0">正常签收</el-radio>
                    <el-radio label="1">签收异常</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="送达方式" prop="sendType">
                <el-select v-model="form.sendType" placeholder="请选择">
                    <el-option
                        v-for="item in sendTypeOptions"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="签收人" prop="signName">
                <el-input v-model="form.signName" :rows="3" placeholder="请输入签收人"></el-input>
            </el-form-item>
            <el-form-item label="签收时间" prop="signDate">
                <el-date-picker
                    v-model="form.signDate"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="附件上传" prop="invoiceSignFileUrls">
                <Upload v-model="form.invoiceSignFileUrls" fileType="png,jpg" :limit="5" :fileSize="10"></Upload>
            </el-form-item>
            <el-form-item label="签收备注" prop="remark">
                <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入领取备注信息"></el-input>
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script>
    import {
        Api_invoiceSigned
    } from "@/api/creditManagement/invoice/invoiceTracking.js";
    import Upload from "@/components/Upload/index.vue";
    import {merge} from "lodash";

    export default {
        name: "Signed",
        components: { Upload },
        data() {
            return {
                visible: false,
                isReceive: 'true',
                form: {
                    invoiceId: '',
                    signType: '0',
                    sendType: '',
                    signName: '',
                    signDate: this.$dateFormat(new Date(), 'yyyy-MM-dd'),
                    invoiceSignFileUrls: [],
                    remark: ''
                },
                sendTypeOptions: [{
                    id: '0',
                    label: '快递送达'
                }, {
                    id: '1',
                    label: '当面递交'
                }, {
                    id: '2',
                    label: '随货物送达'
                }, {
                    id: '3',
                    label: '其他'
                }],
                // 设置生效日期范围
                setEffectiveDate: {
                    disabledDate: (time) => {
                        return time.getTime() < Date.now() - 1000 * 60 * 60 * 24;
                    }
                },
                rules: {
                    signType: [{
                        required: true,
                        message: "必填"
                    }],
                    sendType: [{
                        required: true,
                        message: "必填"
                    }],
                    signName: [{
                        required: true,
                        message: "必填"
                    }],
                    signDate: [{
                        required: true,
                        message: "领取日期必填"
                    }],
                    remark: [{
                        max: 200,
                        message: "不超过200字"
                    }],
                    invoiceSignFileUrls: [{required: true, message: "上传附件", type: 'array'}]
                }
            };
        },
        methods: {
            open(_row) {
                this.form.invoiceId = _row.id;
                this.visible = true;
            },
            handleSure() {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        const loading = this.$openLoading();
                        const postData = merge({}, this.form);
                        postData.invoiceSignFileUrls = this.form.invoiceSignFileUrls.map(item => item.url);
                        Api_invoiceSigned(postData).then(res => {
                            this.$message.success(res);
                            loading.close();
                            this.visible = false;
                            this.$emit('back')
                        }).catch(res => {
                            this.$message.error(res);
                            loading.close();
                        })
                    }
                })
            },
            closeDialog() {
                this.visible = false;
            }
        }
    }
</script>

<style scoped>

</style>
