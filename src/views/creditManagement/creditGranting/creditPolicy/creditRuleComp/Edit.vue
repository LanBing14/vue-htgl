<template>
    <Dialog
        :title="title"
        :visible.sync="visible"
        :onOk="handleSure"
        width="500px"
        @close="onClose"
    >
        <el-form
            ref="form"
            :model="formData"
            :rules="formRules"
            label-width="6em"
            label-position="left"
            class="form"
            style="width: 95%;margin: auto"
        >
            <el-form-item label="规则名称" prop="name">
                <el-input v-model="formData.name" placeholder="请填写规则名称"></el-input>
            </el-form-item>
            <el-form-item label="规则描述" prop="remark">
                <el-input type="textarea" :rows="2" placeholder="请输入规则描述" v-model="formData.remark"></el-input>
            </el-form-item>

            <el-form-item label="检查信息">
                {{ formData.reasonName }}
                <!--<el-checkbox-group v-model="formData.overdueQuota">
                    <el-checkbox label="true">逾期额度超标</el-checkbox>
                </el-checkbox-group>
                <el-checkbox-group v-model="formData.overdueDay">
                    <el-checkbox label="true">逾期天数超标</el-checkbox>
                </el-checkbox-group>
                <el-checkbox-group v-model="formData.dishonestyExecute">
                    <el-checkbox label="true">被列入失信被执行人</el-checkbox>
                </el-checkbox-group>
                <el-checkbox-group v-model="formData.revokeLicense">
                    <el-checkbox label="true">被吊销营业执照或注销</el-checkbox>
                </el-checkbox-group>
                <el-checkbox-group v-model="formData.manageAbnormal">
                    <el-checkbox label="true">被列入经营异常名录</el-checkbox>
                </el-checkbox-group>-->
            </el-form-item>
            <el-form-item label="限制措施">
                <el-checkbox-group v-model="formData.isWork">
                    <el-checkbox label="true">停止签约</el-checkbox>
                </el-checkbox-group>
                <el-checkbox-group v-model="formData.isCredit">
                    <el-checkbox label="true">停止赊销</el-checkbox>
                </el-checkbox-group>
                <el-checkbox-group v-model="formData.isSend">
                    <el-checkbox label="true">停止发货</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script type="text/jsx">
    import {
        Api_GetDiscountRule,
        Api_EditCreditCustomerRule
    } from "@/api/creditManagement/creditGranting/customer";

    export default {
        name: "Edit",
        data() {
            return {
                title: '修改规则',
                visible: false,
                id: '',
                formData: {
                    name: '',
                    remark: '',
                    reasonName: '',
                    // overdueQuota: false,
                    // overdueDay: false,
                    // dishonestyExecute: false,
                    // revokeLicense: false,
                    // manageAbnormal: false,
                    isCredit: false,
                    isSend: false,
                    isWork: false
                },
                formRules: {
                    name: [
                        {
                            required: true,
                            message: "规则名称"
                        }
                    ],
                    remark: [
                        {
                            required: true,
                            message: "规则描述"
                        }
                    ]
                }
            }
        },
        methods: {
            open(row) {
                if (row.id) {
                    this.title = '修改规则';
                    this.id = row.id;
                    Api_GetDiscountRule(this.id).then(res => {
                        this.formData.reasonName = res.reasonName;
                        this.formData.isCredit = res.isCredit;
                        this.formData.isSend = res.isSend;
                        this.formData.isWork = res.isWork;
                        if (res.name) {
                            this.formData.name = res.name;
                            this.formData.remark = res.remark;
                            // this.formData.overdueQuota = res.overdueQuota;
                            // this.formData.overdueDay = res.overdueDay;
                            // this.formData.dishonestyExecute = res.dishonestyExecute;
                            // this.formData.revokeLicense = res.revokeLicense;
                            // this.formData.manageAbnormal = res.manageAbnormal;
                        }
                    }).catch(res => {
                        this.$message.error(res)
                    })
                }
                this.visible = true
            },
            handleSure() {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        if (this.id) {
                            const loading = this.$openLoading();
                            Api_EditCreditCustomerRule(this.id, this.formData).then(res => {
                                this.$message.success(res);
                                this.$emit('ok');
                                loading.close();
                                this.visible = false;
                            }).catch(res => {
                                this.$message.error(res)
                            })
                        } else {
                            // const loading = this.$openLoading();
                            // Api_AddCreditCustomerRule(this.formData).then(res => {
                            //     this.$message.success(res);
                            //     this.$emit('ok');
                            //     loading.close();
                            //     this.visible = false;
                            // }).catch(res => {
                            //     this.$message.error(res)
                            // })
                        }

                    }
                });
            },
            onClose() {
                this.$refs.form.resetFields();
                this.formData.overdueQuota = false;
                this.formData.overdueDay = false;
                this.formData.dishonestyExecute = false;
                this.formData.revokeLicense = false;
                this.formData.manageAbnormal = false;
                this.formData.isCredit = false;
                this.formData.isSend = false;
                this.formData.isWork = false;
            }
        }
    }
</script>

<style scoped>
    .el-checkbox-group > label {
        display: block!important;
    }
</style>
