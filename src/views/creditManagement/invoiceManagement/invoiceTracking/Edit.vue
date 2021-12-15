<template>
    <Dialog ref="drawer" title="编辑" :visible.sync="visible" :onOk="handleSure" width="500px" :close="closeDialog">
        <el-form ref="form" :model="form" :rules="rules" label-width="110px">
            <el-form-item label="客户名称">{{ customerName }}</el-form-item>
            <el-form-item label="合同名称">{{ form.contractName }}</el-form-item>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="应收金额">{{ $toMoney(form.totalMoney, 2) }}</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="待开金额">{{ $toMoney(form.waitMoney, 2) }}</el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="已申请金额">{{ $toMoney(form.invoiceMoney, 2) }}</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="已开金额">{{ $toMoney(form.alreadyMoney, 2) }}</el-form-item>
                </el-col>
            </el-row>
            <el-divider style="margin-top: 0"></el-divider>
            <el-form-item label="申请开票金额" prop="applyContractMoney">
                <el-input v-model="form.applyContractMoney" placeholder="请输入申请开票金额">
                    <template slot="append">元</template>
                </el-input>
            </el-form-item>
            <el-form-item label="开票备注" prop="remark">
                <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入开票登记备注信息"></el-input>
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script>
    import {
        Api_GetInvoiceInfoEdit,
        Api_ApplyInvoice
    } from "@/api/creditManagement/invoice/invoice.js";

    export default {
        name: "Edit",
        data() {
            return {
                visible: false,
                id: '',
                customerName: '',
                form: {
                    companyId: '',
                    invoiceId: "",
                    contractCode: "",
                    contractName: "",
                    contractMoney: "",
                    totalMoney: "",
                    waitMoney: "",
                    invoiceMoney: "",
                    alreadyMoney: "",
                    dutyId: "",
                    dutyName: "",
                    deptId: "",
                    deptName: "",
                    applyContractMoney: "",
                    remark: ""
                },
                rules: {
                    applyContractMoney: [{
                        required: true,
                        message: "申请开票金额必填"
                    }],
                    remark: [{
                        required: true,
                        message: "开票备注必填"
                    }]
                }
            };
        },
        methods: {
            open(_row) {
                this.id = _row.id;
                Api_GetInvoiceInfoEdit(this.id).then(res => {
                    this.form.companyId = _row.companyId;
                    this.customerName = res.contract.customerName;
                    this.form.invoiceId = _row.id;
                    this.form.contractCode = res.contract.contractCode;
                    this.form.contractName = res.contract.contractName;
                    this.form.contractMoney = _row.contractAmount;
                    this.form.totalMoney = res.ysAmount;
                    this.form.waitMoney = res.dkAmount;
                    this.form.invoiceMoney = res.ysqAmount;
                    this.form.alreadyMoney = res.ykAmount;
                    this.form.dutyId = _row.userId;
                    this.form.dutyName = _row.deptName;
                    this.form.deptId = _row.deptId;
                    this.form.deptName = _row.deptName;
                    // this.form.applyContractMoney = ;
                    // this.form.remark = ;
                }).catch(res => {
                    this.$message.error(res)
                })
                this.visible = true;
            },
            handleSure() {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        const loading = this.$openLoading();
                        Api_ApplyInvoice(this.form).then(res => {
                            this.$message.success(res);
                            loading.close();
                            this.visible = false;
                            this.$emit('getList')
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
