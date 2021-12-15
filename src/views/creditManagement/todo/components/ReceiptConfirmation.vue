<template>
    <div>
        <div class="page-header">
            <h1 class="page-name">
                <span>应收账款确认{{ modelStatus ? '':'——查看' }}</span>
            </h1>
            <div>
                <el-button @click="back">返回</el-button>
            </div>
        </div>
        <div class="page-content">
            <div style="text-align: center" class="size-btn-change">
                <el-button type="primary" @click="handleSign(true)">签批</el-button>
                <el-button @click="handleSign(false)">打回</el-button>
            </div>
            <Dialog
                v-if="modelStatus"
                :title="isSign?'签批':'退回'"
                :visible.sync="visibleSign"
                :onOk="signSure"
                class="size-btn-change"
                @close="signClose"
            >
                <el-form ref="signForm" :model="signFormData" :rules="signFormRules" label-width="100px">
                    <el-form-item label="审核意见：" prop="auditOpinion">
                        <el-input v-model="signFormData.auditOpinion" :rows="4" type="textarea" placeholder="请输入审核意见"></el-input>
                    </el-form-item>
                </el-form>
            </Dialog>
        </div>
    </div>
</template>

<script>
import { Api_AgencyMattersDeal, Api_AgencyMattersReject } from "@/api/creditManagement/todo/index";

export default {
    name: "ReceiptConfirmation",
    props: {
        modelStatus: Boolean,
        row: Object
    },
    data() {
        const createRules = this.$createRules;
        return {
            isSign: true,
            visibleSign: false,
            signFormData: {
                auditOpinion: ""
            },
            signFormRules: {
                auditOpinion: createRules({
                    msg: "审核意见",
                    required: true,
                    max: 200
                })
            }
        };
    },
    methods: {
        back() {
            this.$emit("edit", false);
        },
        handleSign(flag) {
            this.isSign = flag;
            this.visibleSign = true;
        },
        // 签批或打回
        signSure() {
            this.$refs.signForm.validate(valid => {
                if (valid) {
                    if (this.isSign) {
                        this.$confirm("确定通过审核吗？", "提示", {
                            type: "warning"
                        }).then(() => {
                            const { id, business_id: businessId } = this.row;
                            const loading = this.$openLoading();
                            Api_AgencyMattersDeal(id, {
                                businessId,
                                processOperate: 2,
                                processRemark: this.signFormData.auditOpinion
                            })
                                .then(msg => {
                                    this.$message.success(msg);
                                    loading.close();
                                    this.visibleSign = false;
                                    this.back();
                                })
                                .catch(e => {
                                    this.$message.error(e);
                                    loading.close();
                                });
                        });
                    } else {
                        this.$confirm("确定打回申请吗？", "提示", {
                            type: "warning"
                        }).then(() => {
                            const { id, business_id: businessId } = this.row;
                            const loading = this.$openLoading();
                            Api_AgencyMattersReject(id, {
                                businessId,
                                processOperate: 4,
                                processRemark: this.signFormData.auditOpinion
                            })
                                .then(msg => {
                                    this.$message.success(msg);
                                    loading.close();
                                    this.visibleSign = false;
                                    this.back();
                                })
                                .catch(e => {
                                    this.$message.error(e);
                                    loading.close();
                                });
                        });
                    }
                }
            });
        },
        signClose() {
            this.$refs.signForm.resetFields();
            this.visibleSign = false;
        }
    }
};
</script>

<style>
</style>
