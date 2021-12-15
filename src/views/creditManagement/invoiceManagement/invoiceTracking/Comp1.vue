<template>
    <Dialog ref="drawer" title="打回开票申请信息" :visible.sync="visible" onlyClose :close="closeDialog">
        <el-form ref="form" :model="form" label-width="110px">
            <el-form-item label="客户名称">{{ form.companyName }}</el-form-item>
            <el-form-item label="订单名称">{{ form.contractCode }}/{{ form.contractName }}</el-form-item>
            <el-form-item label="发票抬头">{{ form.archivesInvoice }}</el-form-item>
            <el-form-item label="发票类型">{{ form.invoiceType === '0' ? '增值税普通发票' : '增值税专用发票' }}</el-form-item>
            <el-form-item label="开票金额">{{ form.applyContractMoney }}元</el-form-item>
            <el-form-item label="开票备注">{{ form.remark }}</el-form-item>
        </el-form>
    </Dialog>
</template>

<script>
    export default {
        name: "Comp1",
        data() {
            return {
                visible: false,
                form: {
                    companyName: '',
                    contractCode: '',
                    contractName: '',
                    archivesInvoice: '',
                    invoiceType: '',
                    applyContractMoney: '',
                    remark: ''
                }
            }
        },
        methods: {
            open(row) {
                this.form.companyName = row.companyName;
                this.form.contractCode = row.contractCode;
                this.form.contractName = row.contractName;
                this.form.archivesInvoice = row.invoice;
                this.form.invoiceType = row.invoiceType;
                this.form.applyContractMoney = this.$toMoney(row.applyContractMoney, 2);
                this.form.remark = row.remark;
                this.visible = true
            },
            closeDialog() {
                this.visible = false
            }
        }
    }
</script>

<style scoped>

</style>
