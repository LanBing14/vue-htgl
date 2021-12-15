<template>
    <Dialog
        title="规则详情"
        :visible.sync="visible"
        onlyClos
        width="500px"
        @close="onClose"
    >
        <el-form
            ref="form"
            :model="formData"
            label-width="5em"
            label-position="left"
            class="form"
            style="width: 95%;margin: auto"
        >
            <el-form-item label="规则名称">{{ formData.name }}</el-form-item>
            <el-form-item label="规则描述">{{ formData.remark }}</el-form-item>

            <el-form-item label="检查信息">{{ formData.reasonName }}
                <!--<el-checkbox-group v-model="formData.overdueQuota">
                    <el-checkbox disabled label="true">逾期额度超标</el-checkbox>
                </el-checkbox-group>
                <el-checkbox-group v-model="formData.overdueDay">
                    <el-checkbox disabled label="true">逾期天数超标</el-checkbox>
                </el-checkbox-group>
                <el-checkbox-group v-model="formData.dishonestyExecute">
                    <el-checkbox disabled label="true">被列入失信被执行人</el-checkbox>
                </el-checkbox-group>
                <el-checkbox-group v-model="formData.revokeLicense">
                    <el-checkbox disabled label="true">被吊销营业执照或注销</el-checkbox>
                </el-checkbox-group>
                <el-checkbox-group v-model="formData.manageAbnormal">
                    <el-checkbox disabled label="true">被列入经营异常名录</el-checkbox>
                </el-checkbox-group>-->
            </el-form-item>
            <el-form-item label="限制措施">
                <el-checkbox-group v-model="formData.isWork">
                    <el-checkbox disabled label="true">停止签约</el-checkbox>
                </el-checkbox-group>
                <el-checkbox-group v-model="formData.isCredit">
                    <el-checkbox disabled label="true">停止赊销</el-checkbox>
                </el-checkbox-group>
                <el-checkbox-group v-model="formData.isSend">
                    <el-checkbox disabled label="true">停止发货</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script>
    import {
        Api_GetDiscountRule
    } from "@/api/creditManagement/creditGranting/customer";

    export default {
        name: "Detail",
        data() {
            return {
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
            }
        },
        methods: {
            open(row) {
                if (row.id) {
                    this.id = row.id;
                    Api_GetDiscountRule(this.id).then(res => {
                        this.formData.name = res.name;
                        this.formData.remark = res.remark;
                        this.formData.reasonName = res.reasonName;
                        // this.formData.overdueQuota = res.overdueQuota;
                        // this.formData.overdueDay = res.overdueDay;
                        // this.formData.dishonestyExecute = res.dishonestyExecute;
                        // this.formData.revokeLicense = res.revokeLicense;
                        // this.formData.manageAbnormal = res.manageAbnormal;
                        this.formData.isCredit = res.isCredit;
                        this.formData.isSend = res.isSend;
                        this.formData.isWork = res.isWork;
                    }).catch(res => {
                        this.$message.error(res)
                    })
                }
                this.visible = true
            },
            onClose() {
                this.$refs.form.resetFields();
                // this.formData.overdueQuota = false;
                // this.formData.overdueDay = false;
                // this.formData.dishonestyExecute = false;
                // this.formData.revokeLicense = false;
                // this.formData.manageAbnormal = false;
                this.formData.isCredit = false;
                this.formData.isSend = false;
                this.formData.isWork = false;
            },
        }
    }
</script>

<style scoped>
    .el-checkbox-group > label {
        display: block!important;
    }
</style>
