<template>
    <div>
        <Dialog ref="drawer" title="发票登记" :visible.sync="visible" :onOk="handleSure" width="500px" :close="closeDialog">
            <el-form ref="form" :model="form" :rules="rules" label-width="110px">
                <el-form-item label="发票抬头">
                <span class="canClick" @click="openDetail">
                    {{ invoice }}
                </span>
                </el-form-item>
                <el-form-item label="税号">{{ taxId }}</el-form-item>
                <el-form-item label="发票类型">{{ invoiceType === '0' ? '增值税普通发票' : '增值税专用发票' }}</el-form-item>
                <el-divider style="margin-top: 0"></el-divider>
                <el-form-item label="发票号码" prop="invoiceCode">
                    <el-input v-model="form.invoiceCode" placeholder="请输入发票号码"></el-input>
                </el-form-item>
                <el-form-item label="申请开票金额" prop="applyContractMoney">
                    <el-input v-model="form.applyContractMoney" placeholder="请输入申请开票金额">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="开票日期" prop="invoiceDate">
                    <el-date-picker
                        v-model="form.invoiceDate"
                        value-format="yyyy-MM-dd"
                        type="date"
                        :picker-options="setEffectiveDate"
                        placeholder="选择日期"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="附件上传" prop="invoiceRegisterFileUrls">
                    <Upload v-model="form.invoiceRegisterFileUrls" fileType="png,jpg" :limit="5" :fileSize="10"></Upload>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入开票登记备注信息"></el-input>
                </el-form-item>
            </el-form>
        </Dialog>
        <TitleDetail ref="ref_TitleDetail"></TitleDetail>
    </div>
</template>

<script>
    import {merge} from 'lodash';
    import {Api_GetInvoiceTrackingInfo, Api_invoiceRegister} from "@/api/creditManagement/invoice/invoiceTracking.js";
    import Upload from "@/components/Upload/index.vue";
    import TitleDetail from "../invoiceList/TitleDetail";

    export default {
        name: "Registration",
        components: {Upload, TitleDetail},
        data() {
            return {
                visible: false,
                fileList: [],
                invoiceType: "",
                invoice: "",
                taxId: "",
                archivesInvoiceId: '',
                form: {
                    invoiceId: "",
                    contractName: "",
                    totalMoney: "",
                    waitMoney: "",
                    invoiceMoney: "",
                    alreadyMoney: "",
                    invoiceCode: "",
                    applyContractMoney: "",
                    remark: "",
                    invoiceDate: this.$dateFormat(new Date(), "yyyy-MM-dd"),
                    invoiceRegisterFileUrls: []
                },
                // 设置生效日期范围
                setEffectiveDate: {
                    disabledDate: time => {
                        return time.getTime() < Date.now() - 1000 * 60 * 60 * 24;
                    }
                },
                rules: {
                    invoiceCode: [{required: true, message: "发票号码必填"}],
                    invoiceDate: [{required: true, message: "日期必填"}],
                    applyContractMoney: [{required: true, message: "申请开票金额必填"}, {
                        validator: this.validatorMoney
                    }, {
                        pattern: /^\d{1,9}$|^\d{1,9}\.\d{1,2}$/,
                        message: "申请开票金额必须为整数或小数，且整数部分不超过9位，小数部分不超过2位"
                    }],
                    remark: [{max: 200, message: "开票备注最多200个字"}],
                    invoiceRegisterFileUrls: [{required: true, message: "上传附件", type: 'array'}]
                }
            };
        },
        methods: {
            open(_row) {
                Api_GetInvoiceTrackingInfo(_row.id, _row.status).then(res => {
                    this.invoiceType = res.invoice.invoiceType;
                    this.invoice = res.archive.invoice;
                    this.taxId = res.archive.taxId;
                    this.companyName = res.invoice.companyName;
                    this.form.invoiceId = res.invoice.id;
                    this.form.contractName = res.invoice.contractName;
                    this.form.totalMoney = res.invoice.totalMoney;
                    this.form.waitMoney = res.invoice.waitMoney;
                    this.form.invoiceMoney = res.invoice.applyContractMoney;
                    this.form.alreadyMoney = res.invoice.alreadyMoney;
                    this.archivesInvoiceId = res.invoice.archivesInvoiceId
                }).catch(res => {
                    this.$message.error(res);
                });
                this.visible = true;
            },
            handleSure() {
                this.$refs["form"].validate(valid => {
                    if (valid) {
                        const loading = this.$openLoading();
                        const postData = merge({}, this.form);
                        postData.invoiceRegisterFileUrls = this.form.invoiceRegisterFileUrls.map(item => item.url);
                        Api_invoiceRegister(postData).then(res => {
                            this.$message.success(res);
                            loading.close();
                            this.visible = false;
                            this.$emit("back");
                        }).catch(res => {
                            this.$message.error(res);
                            loading.close();
                        });
                    }
                });
            },
            closeDialog() {
                this.visible = false;
            },
            validatorMoney(rule, value, callback) {
                if (Number(value) > Number(this.form.totalMoney)) {
                    callback(new Error("不能超过订单金额"));
                    return;
                }
                if (Number(value) !== Number(this.form.invoiceMoney)) {
                    callback(new Error("必须等于开票金额"));
                    return;
                }
                callback();
            },
            // 发票抬头详情
            openDetail() {
                this.$refs.ref_TitleDetail.open(this.archivesInvoiceId);
            }
        }
    };
</script>

<style scoped>
</style>
