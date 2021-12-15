<template>
    <Dialog ref="drawer" title="发票抬头详情" :visible.sync="visible" onlyClose width="500px" :close="closeDialog">
        <el-form class="choose-dialog-container" style="padding: 15px 30px 10px;">
            <div style="line-height: 36px;font-weight: bold;font-size: 16px">{{ form.companyName }}</div>
            <el-form-item label="税号">{{ form.taxId }}</el-form-item>
            <el-form-item label="企业地址">{{ form.unitAddress }}</el-form-item>
            <el-form-item label="企业电话">{{ form.phone }}</el-form-item>
            <el-form-item label="开户银行">{{ form.bankName }}</el-form-item>
            <el-form-item label="银行账号">{{ form.bankAccount }}</el-form-item>
        </el-form>
    </Dialog>
</template>

<script>
    import {
        Api_GetInvoiceTitleDetail
    } from "@/api/creditManagement/invoice/invoice.js";

    export default {
        name: "TitleDetail",
        data() {
            return {
                visible: false,
                form: {
                    companyName: '',
                    taxId: '',
                    unitAddress: '',
                    phone: '',
                    bankName: '',
                    bankAccount: ''
                }
            }
        },
        methods: {
            open(id) {
                Api_GetInvoiceTitleDetail(id).then(res => {
                    this.form.companyName = res.companyName;
                    this.form.taxId = res.taxId;
                    this.form.unitAddress = res.unitAddress;
                    this.form.phone = res.phone;
                    this.form.bankName = res.bankName;
                    this.form.bankAccount = res.bankAccount;
                }).catch(res => {
                    this.$message.error(res)
                })
                this.visible = true
            },
            handleSure() {
                this.visible = false;
            },
            closeDialog() {
                this.visible = false;
            }
        }
    }
</script>

<style scoped type="text/css">
    /deep/.el-radio__label {
        display: none;
    }
</style>
