<template>
    <Dialog ref="drawer" title="收款登记" :visible.sync="visible" :btns="drawerBtns" :close="closeDialog" width="500px">
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="应收编码">{{ tableRow.payPlanCode }}</el-form-item>
            <el-form-item label="客户名称">{{ tableRow.companyName }}</el-form-item>
            <el-form-item label="合同名称">{{ tableRow.contractName + '/' + tableRow.contractNo }}</el-form-item>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="确认日期">{{ this.$dateFormat(tableRow.payDate, 'yyyy-MM-dd') }}</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="到期日">{{ this.$dateFormat(tableRow.endDate, 'yyyy-MM-dd') }}</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="应收金额">{{ $toMoney(tableRow.payAmount) }} 元</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="已收金额">{{ $toMoney(tableRow.receivable) }} 元</el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="实收金额" prop="payAmount" :rules="$createRules({msg:'实收金额',required:true,numberFloatUp:true})">
                <el-input v-model.number="form.payAmount" placeholder="请输入实收金额">
                    <template slot="append">元</template>
                </el-input>
            </el-form-item>
            <el-form-item
                label="折扣金额"
                prop="discountAmount"
                :rules="$createRules({msg:'折扣金额',required:true,numberFloatUp:true})"
            >
                <el-input v-model.number="form.discountAmount" placeholder="请输入折扣金额">
                    <template slot="append">元</template>
                </el-input>
            </el-form-item>
            <el-form-item label="收款日期" prop="payDate" :rules="$createRules({msg:'收款日期',required:true})">
                <el-date-picker
                    v-model="form.payDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    style="width: 100%"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="备注" prop="remarks" :rules="$createRules({msg:'备注',max:200})">
                <el-input type="textarea" v-model="form.remarks" placeholder="请输入备注" :rows="3"></el-input>
            </el-form-item>
            <el-form-item label="附件上传" prop="pic">
                <Upload v-model="uploadFileUrls" fileType="jpg,png" :limit="3" :fileSize="10" style="margin-top: 6px"></Upload>
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script>
import { Api_upload } from "@/api/baseApi";
import { Api_PaymentRegister } from "@/api/creditManagement/contractManagement/contract.js";
import Upload from "@/components/Upload/index.vue";

export default {
    name: "ReceiptRegistration",
    components: { Upload },
    data() {
        return {
            visible: false,
            tableRow: {
                payPlanCode: "",
                companyName: "",
                contractName: "",
                contractNo: "",
                payDate: "",
                endDate: "",
                payAmount: "",
                receivable: ""
            },
            form: {
                payAmount: null,
                discountAmount: 0,
                payDate: this.$dateFormat(new Date(), "yyyy-MM-dd"),
                remarks: "",
                uploadFileUrls: []
            },
            uploadFileUrls: [],
            drawerBtns: [
                {
                    text: "返回",
                    click: () => {
                        this.visible = false;
                    }
                },
                {
                    text: "确定",
                    type: "primary",
                    click: () => {
                        this.$refs["form"].validate(valid => {
                            if (valid) {
                                let tipLang = "";
                                if (
                                    Number(this.tableRow.pay_amount) ===
                                    Number(this.tableRow.receivable) +
                                        Number(this.form.payAmount) +
                                        Number(this.form.discountAmount)
                                ) {
                                    tipLang = "按照当前计算该项付款计划已履行完成，请检查后再次确认。";
                                } else {
                                    tipLang = "确定提交吗？";
                                }
                                this.$confirm(tipLang, "提示", {
                                    confirmButtonText: "确定",
                                    cancelButtonText: "取消",
                                    type: "warning"
                                })
                                    .then(() => {
                                        this.form.uploadFileUrls = this.uploadFileUrls.map(item => item.url);
                                        const loading = this.$openLoading();
                                        Api_PaymentRegister(this.tableRow.payPlanId, this.form)
                                            .then(() => {
                                                loading.close();
                                                this.$message.success("提交成功！");
                                                this.visible = false;
                                                this.$emit("getList");
                                            })
                                            .catch(res => {
                                                loading.close();
                                                this.$message.error(res);
                                            });
                                    })
                                    .catch(() => {});
                            }
                        });
                    }
                }
            ]
        };
    },
    methods: {
        open(_row) {
            this.tableRow = _row;
            this.visible = true;
            // empty
            this.form = {
                payAmount: null,
                discountAmount: 0,
                payDate: this.$dateFormat(new Date(), "yyyy-MM-dd"),
                remarks: "",
                uploadFileUrls: []
            };
            this.uploadFileUrls = [];
        },
        closeDialog() {
            this.visible = false;
        }
    }
};
</script>

<style>
</style>
