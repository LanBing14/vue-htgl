<template>
    <div>
        <div class="page-header">
            <h1 class="page-name">
                <span>授信额度审批{{ modelStatus ? '':'——查看' }}</span>
            </h1>
            <div>
                <el-button size="small" @click="back">返回</el-button>
            </div>
        </div>
        <div class="page-content">
            <el-form :model="formData" label-width="9em" label-position="left" class="form">
                <el-alert :closable="false" title="授信申请信息" type="info"></el-alert>
                <div style="padding: 0 0 0 36px;">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="信用额度">
                                {{ baseData.creditQuota }}&nbsp;
                                <span class="unit-number">万元</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="单笔限额">
                                {{ baseData.singleQuota }}&nbsp;
                                <span class="unit-number">万元</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="信用账期">{{ baseData.creditPeriod }}&nbsp;天</el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="逾期天数">{{ baseData.overdueDays }}&nbsp;天</el-form-item>
                        </el-col>
                        <el-col v-if="baseData.creditType === '0'" :span="8">
                            <el-form-item label="循环授信">
                                <el-switch
                                    v-model="baseData.revolvingCreditState"
                                    active-value="1"
                                    inactive-value="0"
                                    active-color="#409eff"
                                    inactive-color="#dcdfe6"
                                    disabled
                                ></el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="生效日期">{{ baseData.effectiveDate }}</el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="有效日期">{{ baseData.expirationDate }}</el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="状态(待审核)">{{ baseData.creditState | filterCreditState }}</el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <el-alert :closable="false" title="客户授信信息" type="info" style="margin-top: 20px;"></el-alert>
                <div style="padding: 0 0 0 36px;">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="客户编号">{{ baseData.customerNo }}</el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="授信对象">{{ baseData.companyName }}</el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="area">
                        <el-col :span="8">
                            <el-form-item label="信用等级">{{ companyBaseData.grade }}</el-form-item>
                            <el-form-item label="信用账期">{{ companyBaseData.creditPeriod }}&nbsp;天</el-form-item>
                            <el-form-item label="授信额度">
                                {{ companyBaseData.fixedQuoto }}&nbsp;
                                <span class="unit-number">万元</span>
                            </el-form-item>
                            <el-form-item label="临时授信额度">
                                {{ companyBaseData.tempQuoto }}&nbsp;
                                <span class="unit-number">万元</span>
                            </el-form-item>
                            <el-form-item label="剩余可用额度">
                                {{ companyBaseData.availableQuoto }}&nbsp;
                                <span class="unit-number">万元</span>
                            </el-form-item>
                            <el-button size="small" class="area-btn" type="text" style="margin-left: 15px;">
                                信用等级
                                <br />及授信情况
                            </el-button>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="应收金额">
                                {{ contractPaymentCurrent.planAmount }}&nbsp;
                                <span class="unit-number">万元</span>
                            </el-form-item>
                            <el-form-item label="逾期金额">
                                {{ contractPaymentCurrent.overdueMoney }}&nbsp;
                                <span class="unit-number">万元</span>
                            </el-form-item>
                            <el-form-item
                                label="逾期笔数占比"
                            >{{ contractPaymentCurrent.overdueSize }}/{{ contractPaymentCurrent.overdueSizeTotal }}</el-form-item>
                            <el-form-item label="最长逾期天数">{{ contractPaymentCurrent.overdueDay }}&nbsp;天</el-form-item>
                            <el-form-item label="最大单笔逾期">{{ contractPaymentCurrent.maxOverdueMoney }}</el-form-item>
                            <el-button size="small" class="area-btn" type="text" style="margin-left: 15px;">
                                当前合同
                                <br />付款履约情况
                            </el-button>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item
                                label="历史逾期情况"
                            >{{ contractPaymentHistory.hisOverdue }}/{{ contractPaymentHistory.contractsCount }}</el-form-item>
                            <el-form-item
                                label="历史逾期(120+)"
                            >{{ contractPaymentHistory.hisOverdueOther }}/{{ contractPaymentHistory.contractsCount }}</el-form-item>
                            <el-form-item
                                label="近1年逾期情况"
                            >{{ contractPaymentHistory.yearOverdue }}/{{ contractPaymentHistory.yearContractsCount }}</el-form-item>
                            <el-form-item
                                label="近1年逾期(120+)"
                            >{{ contractPaymentHistory.yearOverdueOther }}/{{ contractPaymentHistory.yearContractsCount }}</el-form-item>
                            <el-button size="small" class="area-btn" type="text" style="margin-left: 15px;">
                                历史合同
                                <br />付款履约情况
                            </el-button>
                        </el-col>
                    </el-row>
                </div>
                <div style="padding: 0 0 0 36px;">
                    <div class="title-dot">固定授信额度</div>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="信用额度">
                                {{ fixedData.credit_quota || '-' }}&nbsp;
                                <span class="unit-number">万元</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="单笔限额">
                                {{ fixedData.single_quota || '-' }}&nbsp;
                                <span class="unit-number">万元</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="信用账期">
                                {{ fixedData.credit_period || '-' }}&nbsp;
                                <span class="unit-number">天</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="逾期天数">
                                {{ fixedData.overdue_days || '-' }}&nbsp;
                                <span class="unit-number">天</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="循环授信">
                                <el-switch
                                    v-model="fixedData.revolving_credit_state"
                                    active-value="1"
                                    inactive-value="0"
                                    active-color="#409eff"
                                    inactive-color="#dcdfe6"
                                    disabled
                                ></el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="生效日期">{{ fixedData.effective_date }}</el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="有效日期">{{ fixedData.expiration_date }}</el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="当前状态">{{ fixedData.credit_state | filterCreditState }}</el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div style="padding: 0 0 0 36px;">
                    <div class="title-dot">临时授信额度</div>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="信用额度">
                                {{ notFixedData.credit_quota || '-' }}&nbsp;
                                <span class="unit-number">万元</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="单笔限额">
                                {{ notFixedData.single_quota || '-' }}&nbsp;
                                <span class="unit-number">万元</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="信用账期">
                                {{ notFixedData.credit_period || '-' }}&nbsp;
                                <span class="unit-number">天</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="逾期天数">
                                {{ notFixedData.overdue_days || '-' }}&nbsp;
                                <span class="unit-number">天</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="生效日期">{{ notFixedData.effective_date }}</el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="有效日期">{{ notFixedData.expiration_date }}</el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="当前状态">{{ fixedData.notFixedData | filterCreditState }}</el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </el-form>
            <slot></slot>
        </div>
    </div>
</template>

<script>
import {
    Api_AgencyMattersGetCustomerCredit,
    Api_AgencyMattersGetAuditPage,
    Api_AgencyMattersAudit
} from "@/api/creditManagement/todo/index";
import {
    Api_CreditCustomerGetCustomerCredit,
    Api_CreditCustomerGetLatestRecord
} from "@/api/creditManagement/creditGranting/customer";
import { Api_CurrentContractPayment, Api_HistoryContractPayment } from "@/api/creditManagement/contractManagement/contract";

export default {
    name: "CreditLine",
    filters: {
        filterCreditState(val) {
            if (val === "0") {
                return "待审核";
            } else if (val === "1") {
                return "生效";
            } else if (val === "2") {
                return "冻结";
            } else if (val === "3") {
                return "失效";
            }
        }
    },
    props: {
        modelStatus: Boolean,
        row: Object
    },
    data() {
        const createRules = this.$createRules;
        return {
            formData: {
                key1: "asdf",
                status: 1,
                tableData1: [],
                tableData2: []
            },
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
            },
            baseData: {
                // 基础详情数据
                creditQuota: "", // 信用额度
                singleQuota: "", // 单笔限额/万元
                creditPeriod: "", // 信用账期/天
                overdueDays: "", // 逾期天数
                revolvingCreditState: "", // (固定授信才有)循环授信状态（0-禁用，1-启用）
                effectiveDate: "", // 生效日期
                expirationDate: "", // 失效日期
                creditType: "", // 授信类型（0-固定授信，1-临时授信）
                creditState: "", // 当前状态（0-待审核、1-生效、2-冻结、3-失效）
                companyId: "", // 企业id
                companyName: "", // 企业名称
                customerNo: "" // 客户编码
            },
            companyBaseData: {}, // 信用等级及授信情况
            contractPaymentCurrent: {}, // 当前合同付款履约情况
            contractPaymentHistory: {}, // 历史合同付款履约情况
            signList: [], // 签批信息列表
            fixedData: {}, // 固定授信
            notFixedData: {}, // 临时授信
            isSign: true // 是否签批
        };
    },
    created() {
        const { id, business_id: businessId, company_id: companyId } = this.row;

        // 授信基础详情信息
        Api_AgencyMattersGetCustomerCredit(id, {
            businessType: 2
        }).then(res => {
            this.baseData = res;
        });
        // 最新一条授信记录(固定授信)
        Api_CreditCustomerGetLatestRecord({
            companyId,
            creditType: 0
        }).then(res => {
            this.fixedData = res;
        });
        // 最新一条授信记录(临时授信)
        Api_CreditCustomerGetLatestRecord({
            companyId,
            creditType: 1
        }).then(res => {
            this.notFixedData = res;
        });
        // 获取“签批信息列表”
        // Api_AgencyMattersGetAuditPage({
        //     id,
        //     businessId,
        //     businessType: 2
        // }).then(res => {
        //     this.signList = res;
        // });
        // 获取“信用等级及授信情况”
        Api_CreditCustomerGetCustomerCredit(companyId).then(res => {
            this.companyBaseData = res;
        });
        this.getContractPaymentCurrent();
        this.getContractPaymentHistory();
    },
    methods: {
        // 当前合同付款履约情况
        getContractPaymentCurrent() {
            Api_CurrentContractPayment(this.row.business_id).then(res => {
                this.contractPaymentCurrent = res;
            });
        },
        // 企业历史合同付款履约情况
        getContractPaymentHistory() {
            Api_HistoryContractPayment(this.row.business_id).then(res => {
                this.contractPaymentHistory = res;
            });
        },
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
                    const msg = this.isSign ? "确定通过审核吗？" : "确定打回申请吗？";
                    this.$confirm(msg, "提示", {
                        type: "warning"
                    }).then(() => {
                        const { id, business_id: businessId } = this.row;
                        const loading = this.$openLoading();
                        Api_AgencyMattersAudit(id, {
                            businessId,
                            businessType: 2,
                            auditState: this.isSign ? 1 : 2,
                            auditOpinion: this.signFormData.auditOpinion
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
            });
        },
        signClose() {
            this.$refs.signForm.resetFields();
            this.visibleSign = false;
        }
    }
};
</script>

<style scoped lang="scss">
.btns {
    margin-bottom: 20px;
    margin-top: 40px;
    text-align: center;

    .el-button--primary {
        background-color: $--color-primary;
        border-color: $--color-primary;
    }

    .el-button {
        width: 100px;
    }
}

.title-dot {
    margin-left: -15px;
    padding-left: 15px;
    margin-bottom: 15px;
    margin-top: 10px;
    position: relative;
    padding-bottom: 9px;
    border-bottom: 1px solid rgba(238, 238, 238, 1);
    font-size: 16px;

    &::before {
        content: "";
        display: inline-block;
        width: 4px;
        left: 0;
        top: 7px;
        height: 4px;
        background-color: rgba(51, 153, 230, 1);
        position: absolute;
    }
}
</style>
