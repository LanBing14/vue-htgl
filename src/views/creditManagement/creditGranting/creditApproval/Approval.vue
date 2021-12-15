<template>
    <div>
        <div class="page-header">
            <h1 class="page-name">
                <span>信用初审</span>
            </h1>
            <div>
                <el-button @click="returnMain" size="small">返回</el-button>
            </div>
        </div>
        <div class="page-content">
            <el-form ref="addForm" :model="addForm" :rules="rules" label-width="100px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="申请编码">{{ applyNo }}</el-form-item>
                    </el-col>
                    <el-col :span="8" style="padding-right: 0!important;">
                        <el-form-item label="授信对象" prop="customerId">
                            <el-select
                                v-model="detailForm.customerId"
                                placeholder="请输入申请授信客户名称"
                                filterable
                                disabled
                                remote
                                reserve-keyword
                                :remote-method="remoteMethod"
                                :loading="loading"
                                style="width: 100%"
                                @change="searchObj"
                            >
                                <el-option
                                    v-for="item in customerIdOptions"
                                    :key="item.company_id"
                                    :label="item.company_name"
                                    :value="item.company_id"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3" style="padding: 0">
                        <span class="canClick" style="line-height: 30px;"
                              @click="clientProfileDetail">客户档案</span>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="集团授信"  v-if="is_bloc === '1' ? true : false">
                            {{ is_bloc === '1'?'是':'否' }}
                            <el-switch
                                v-if="this.is_bloc === '1'"
                                v-model="addForm.isBlocCredit"
                                :active-value="true"
                                :inactive-value="false"
                                active-color="#409eff"
                                inactive-color="#dcdfe6"
                            ></el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
                <EnterpriseFile :enterpriseID="detailForm.customerId" :stateID="isAdd"></EnterpriseFile>
                <div class="sub-title" style="margin-top: 0;">授信建议信息</div>
                <el-row style="padding-top: 20px ;">
                    <el-col :span="5">
                        <el-form-item label="信用等级">{{ formDataDeng.gradeName }}</el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <span class="canClick" style="line-height: 30px;padding-left: 32px;" @click="assessment">评估详情</span>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="评估日期">{{ formDataDeng.evaluationDate }}</el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="授信总额">
                            {{ $toMoney(formDataDeng.creditQuota, 2) }}&nbsp;
                        <span class="unit-number">元</span>
                        </el-form-item>
                    </el-col>
                    <!--<el-col :span="5">
                        <el-form-item label="单笔限额">
                            {{ $toMoney(formDataDeng.singleQuota, 2) }}&nbsp;
                        <span class="unit-number">元</span>
                        </el-form-item>
                    </el-col>-->
                    <el-col :span="5">
                        <el-form-item label="逾期额度">
                            {{ $toMoney(formDataDeng.overdueQuota, 2) }}&nbsp;
                        <span class="unit-number">元</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="逾期天数">
                            {{ formDataDeng.overdueDays }}&nbsp;
                        <span class="unit-number">天</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="信用账期">
                            {{ formDataDeng.accountDays }}&nbsp;
                        <span class="unit-number">天</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class="sub-title">信用初审信息</div>
                <el-row style="margin-top: 20px">
                    <el-col :span="8">
                        <el-form-item label="额度类型">
                            <el-radio-group v-model="detailForm.creditType" disabled>
                                <el-radio label="0">固定额度</el-radio>
                                <el-radio label="1">临时额度</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="循环授信">
                            <el-switch
                                v-model="addForm.revolvingCreditState"
                                active-value="1"
                                inactive-value="0"
                                active-color="#409eff"
                                inactive-color="#dcdfe6"
                            ></el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="信用额度" prop="creditQuota">
                            <el-input v-model="addForm.creditQuota" placeholder="请输入信用额度"></el-input>
                            &nbsp;&nbsp;<span>元(RMB)</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="信用账期" prop="accountDays">
                            <el-input v-model.number="addForm.accountDays" placeholder="请输入信用账期"></el-input>
                            &nbsp;&nbsp;<span>天</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="单笔限额" prop="singleQuota">
                            <el-input v-model="addForm.singleQuota" placeholder="请输入单笔限额"></el-input>
                            &nbsp;&nbsp;<span>元(RMB)</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="逾期额度" prop="overdueQuota">
                            <el-input v-model="addForm.overdueQuota" placeholder="请输入逾期额度"></el-input>
                            &nbsp;&nbsp;<span>元(RMB)</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="逾期天数" prop="overdueDays">
                            <el-input v-model.number="addForm.overdueDays" placeholder="请输入逾期天数"></el-input>
                            &nbsp;&nbsp;<span>天</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="生效日期" prop="effectiveDate">
                            <el-date-picker
                                v-model="addForm.effectiveDate"
                                value-format="yyyy-MM-dd"
                                type="date"
                                :picker-options="setEffectiveDate"
                                placeholder="选择日期"
                            ></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="有效日期" prop="expirationDate">
                            <el-date-picker
                                v-model="addForm.expirationDate"
                                value-format="yyyy-MM-dd"
                                type="date"
                                :picker-options="setEffectiveDate"
                                placeholder="选择日期"
                            ></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8" v-if="is_bloc === '1'">
                        <el-form-item label="成员额度">
                            <el-radio-group v-model="addForm.quotaType">
                                <el-radio label="0">共享额度</el-radio>
                                <el-radio label="1">单独分配</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div v-if="addForm.quotaType === '1' && is_bloc === '1'&& addForm.isBlocCredit " class="payment-plan">
                    <div class="payment-plan-thead">
                        <div style="flex: 0 50px" class="payment-plan-th payment-plan-th-color">序号</div>
                        <div style="flex: 1" class="payment-plan-th payment-plan-th-color">集团成员名称</div>
                        <div style="flex: 1" class="payment-plan-th payment-plan-th-color">分配额度(元)</div>
                    </div>
                    <div class="payment-plan-tbody" v-for="(item, index) in addForm.members" :key="index">
                        <div style="flex: 0 50px" class="payment-plan-th">{{ index + 1 }}</div>
                        <div style="flex: 1" class="payment-plan-th">{{ item.companyName }}</div>
                        <div style="flex: 1" class="payment-plan-th">
                            <el-form-item
                                :prop="'members.'+index+'.creditQuota'"
                                :rules="[{
                                    required:true,
                                    message:'请输入金额'
                                    }, {
                                    pattern: /((^[1-9]\d*)|^0)(\.\d{1,2}){0,1}$/,
                                    message: '金额必须为整数或小数，且整数部分不超过9位，小数部分不超过2位'
                                }]"
                            >
                                <el-input v-model="item.creditQuota" class="plan-input"></el-input>
                            </el-form-item>
                        </div>
                    </div>
                </div>
                <div>
                    <el-form-item label="初审意见" prop="auditRemark">
                        <el-input type="textarea" :rows="2" placeholder="请输入初审意见" style="width: 27.5%"
                                  v-model="addForm.auditRemark"></el-input>
                    </el-form-item>
                </div>
            </el-form>
            <div style="text-align: center; margin-top: 20px" class="size-btn-change">
                <el-button @click="saveForm" type="success">保存</el-button>
                <el-button @click="submitForm" type="primary">提交</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import EnterpriseFile from "@/components/EnterpriseFile/index.vue";
    import {
        Api_CustomerGetCustomerList,
        Api_CreditCustomerGetLatestRecord,
        Api_getMemberDetai,
        Api_ApplicationDetai,
        Api_ApprovalSubmit,
        Api_ApprovalSave,
        Api_ApprovalDetail,
        Api_CreditCustomerGetGradeScheme
    } from "@/api/creditManagement/creditGranting/customer";
    import {dateFormat} from "@/utils/index";
    import {merge} from "lodash";

    export default {
        name: "Approval",
        filters: {
            dateFormat,
            filterStatus(value) {
                switch (value) {
                    case "0":
                        return "待审核";
                    case "1":
                        return "正常";
                    case "2":
                        return "冻结";
                    case "3":
                        return "失效";
                }
            }
        },
        components: {EnterpriseFile},
        props: {
            isAdd: {
                type: String,
                default: ""
            },
            applyNo: {
                type: String,
                default: ""
            }
        },
        data() {
            const curDate = new Date();
            const nextYear = curDate.getFullYear() + 1;
            const nextDate = new Date(new Date().setFullYear(nextYear));
            const nextDay = nextDate.getDate() - 1;
            nextDate.setDate(nextDay);
            return {
                formDataDeng:{},
                id: "",
                customerIdOptions: [],
                loading: false,
                isShowSituationBox: false,
                customerId: "",
                addForm: {
                    isBlocCredit: false,
                    creditQuota: "",
                    singleQuota: "",
                    overdueQuota: "",
                    overdueDays: "",
                    accountDays: '',
                    quotaType: "0",
                    revolvingCreditState: "1",
                    effectiveDate: this.$dateFormat(new Date(), "yyyy-MM-dd"),
                    expirationDate: this.$dateFormat(nextDate, "yyyy-MM-dd"),
                    auditRemark: "",
                    members: []
                },
                detailForm: {
                    customerId: "",
                    creditQuota: "",
                    singleQuota: "",
                    overdueQuota: "",
                    overdueDays: "",
                    accountDays: '',
                    quotaType: "0",
                    creditType: "0",
                    revolvingCreditState: "1",
                    effectiveDate: this.$dateFormat(new Date(), "yyyy-MM-dd"),
                    expirationDate: this.$dateFormat(nextDate, "yyyy-MM-dd"),
                    applyRemark: ""
                },
                // 设置生效日期范围
                setEffectiveDate: {
                    disabledDate: time => {
                        return time.getTime() < Date.now() - 1000 * 60 * 60 * 24;
                    }
                },
                // memberListAdd: [],
                // memberList: [],
                fixedData: {}, // 固定授信
                notFixedData: {}, // 临时授信
                fixedMemberList: [], // 固定
                notFixedMemberList: [], // 临时
                companyBaseData: {},
                contractPaymentCurrent: {},
                contractPaymentHistory: {},
                company_id: "",
                is_bloc: "",
                rules: {
                    creditQuota: [
                        {required: true, message: "信用额度"},
                        {
                            pattern: /((^[1-9]\d*)|^0)(\.\d{1,2}){0,1}$/,
                            message: "信用额度必须为整数或小数，且整数部分不超过9位，小数部分不超过2位"
                        }
                    ],
                    singleQuota: [
                        {required: true, message: "单笔限额"},
                        {
                            pattern: /((^[1-9]\d*)|^0)(\.\d{1,2}){0,1}$/,
                            message: "单笔限额必须为整数或小数，且整数部分不超过9位，小数部分不超过2位"
                        },
                        {
                            validator: this.validatorMoney
                        }
                    ],
                    overdueQuota: [
                        {required: true, message: "逾期额度必填"},
                        {
                            pattern: /((^[1-9]\d*)|^0)(\.\d{1,2}){0,1}$/,
                            message: "单笔限额必须为整数或小数，且整数部分不超过9位，小数部分不超过2位"
                        },
                        {
                            validator: this.validatorMoney
                        }
                    ],
                    overdueDays: [{
                        required: true, message: "逾期天数必填"
                    }, {
                        type: "integer",
                        max: 365,
                        min: 0,
                        message: "请输入0-365之间的数字"
                    }],
                    accountDays: [{
                        required: true, message: "信用账期必填"
                    }, {
                        type: "integer",
                        max: 365,
                        min: 0,
                        message: "请输入0-365之间的数字"
                    }],
                    effectiveDate: [{required: true, message: "生效日期必填"}],
                    expirationDate: [{required: true, message: "有效日期必填"}],
                    auditRemark: [{required: true, max: 200, message: "初审意见必填,长度不超过200"}]
                }
            };
        },
        mounted() {
            // 授信申请详情
            if (this.isAdd) {
                Api_ApplicationDetai(this.isAdd).then(res => {
                    this.id = res.id;
                    this.company_id = res.companyId;
                    // 获取建议信息
                    Api_CreditCustomerGetGradeScheme(res.companyId).then(res => {
                        this.formDataDeng = res
                    }).catch(res => {
                        this.$message.error(res)
                    });
                    this.remoteMethod(res.companyName, () => {
                        this.detailForm.customerId = res.companyId;
                        for (let i = 0; i < this.customerIdOptions.length; i++) {
                            if (res.companyId === this.customerIdOptions[i].company_id) {
                                this.customerId = this.customerIdOptions[i].customer_id;
                                this.is_bloc = this.customerIdOptions[i].is_bloc;
                            }
                        }
                        this.addForm.isBlocCredit = res.isBlocCredit;
                        this.addForm.creditQuota = res.creditQuota;
                        this.addForm.singleQuota = res.singleQuota;
                        this.addForm.overdueQuota = res.overdueQuota;
                        this.addForm.overdueDays = res.overdueDays;
                        this.addForm.accountDays = res.accountDays;
                        this.addForm.revolvingCreditState = res.revolvingCreditState;
                        this.addForm.effectiveDate = res.effectiveDate;
                        this.addForm.expirationDate = res.expirationDate;
                        this.addForm.quotaType = res.quotaType;
                        if (res.members) {
                            for (let i = 0; i < res.members.length; i++) {
                                this.$set(this.addForm.members, i, {
                                    id: res.members[i].customerId,
                                    companyName: res.members[i].companyName,
                                    creditQuota: res.members[i].creditQuota
                                })
                            }
                            console.log(this.addForm.members)
                        } else {
                            // 获取集团成员列表
                            Api_getMemberDetai(this.customerId).then(res => {
                                if (res) {
                                    this.addForm.members = res;
                                }
                            });
                        }
                        Api_ApprovalDetail(this.isAdd).then(res => {
                            if (res.creditQuota !== null) {
                                this.addForm.isBlocCredit = res.isBlocCredit;
                                this.addForm.creditQuota = res.creditQuota;
                                this.addForm.singleQuota = res.singleQuota;
                                this.addForm.overdueQuota = res.overdueQuota;
                                this.addForm.overdueDays = res.overdueDays;
                                this.addForm.accountDays = res.accountDays;
                                this.addForm.revolvingCreditState = res.revolvingCreditState;
                                this.addForm.effectiveDate = res.effectiveDate;
                                this.addForm.expirationDate = res.expirationDate;
                                this.addForm.quotaType = res.quotaType;
                                this.addForm.auditRemark = res.auditRemark;
                                if (res.members) {
                                    for (let i = 0; i < res.members.length; i++) {
                                        this.$set(this.addForm.members, i, {
                                            id: res.members[i].customerId,
                                            companyName: res.members[i].companyName,
                                            creditQuota: res.members[i].creditQuota
                                        })
                                    }
                                } else {
                                    this.addForm.members = [];
                                }
                            }
                        }).catch(res => {
                            this.$message.error(res);
                        });
                    });
                }).catch(res => {
                    this.$message.error(res);
                });
            }
        },
        methods: {
            //评估详情
            assessment(){
                console.log(this.isAdd)
                if (this.isAdd) {
                    this.$gotoAssessmentDetail(this.isAdd);
                } else {
                    this.$alert("暂无评估记录！", "提示", { confirmButtonText: "确定", type: "warning" });
                }
            },
            // 返回
            returnMain() {
                this.$emit("edit", false);
            },
            // 获取企业对象
            remoteMethod(query, cd) {
                if (query !== "") {
                    this.loading = true;
                    Api_CustomerGetCustomerList(query).then(res => {
                        this.loading = false;
                        this.customerIdOptions = res;
                        this.$nextTick(() => {
                            cd && cd();
                        });
                    });
                } else {
                    this.customerIdOptions = [];
                }
            },
            // 不超过信用额度
            validatorMoney(rule, value, callback) {
                if (this.addForm.creditQuota && Number(value) > Number(this.addForm.creditQuota)) {
                    callback(new Error("不能超过信用额度"));
                    return;
                }
                callback();
            },
            // 授信对象信息
            searchObj(value) {
                this.company_id = value;
                this.isShowSituationBox = true;
                for (let i = 0; i < this.customerIdOptions.length; i++) {
                    if (value === this.customerIdOptions[i].company_id) {
                        this.customerId = this.customerIdOptions[i].customer_id;
                        this.is_bloc = this.customerIdOptions[i].is_bloc;
                    }
                }
            },
            // 提交
            submitForm() {
                if (this.addForm.members.length > 0) {
                    let totalMoney;
                    for (let i = 0; i < this.addForm.members.length; i++) {
                        totalMoney += Number(this.addForm.members[i].creditQuota)
                    }
                    if (totalMoney > this.addForm.creditQuota) {
                        this.$alert("成员分配额度总额不能超过信用额度！", "提示", {confirmButtonText: "确定", type: "warning"});
                        return;
                    }
                }
                this.$refs["addForm"].validate(valid => {
                    if (valid) {
                        const postData = merge({}, this.addForm);
                        postData.members = postData.members.map(i => ({
                            customerId: i.id,
                            creditQuota: i.creditQuota
                        }));
                        postData.suggestId = this.formDataDeng.id;
                        // console.log("aaaaaaaa:")
                        // console.log(postData)
                        const loading = this.$openLoading();
                        Api_ApprovalSubmit(this.isAdd, postData)
                            .then(res => {
                                this.$message.success(res);
                                loading.close();
                                this.$emit("edit", false);
                            })
                            .catch(res => {
                                this.$message.error(res);
                                loading.close();
                            });
                    }
                });
            },
            // 保存
            saveForm() {
                if (this.addForm.members.length > 0) {
                    let totalMoney;
                    for (let i = 0; i < this.addForm.members.length; i++) {
                        totalMoney += Number(this.addForm.members[i].creditQuota)
                    }
                    if (totalMoney > this.addForm.creditQuota) {
                        this.$alert("成员分配额度总额不能超过信用额度！", "提示", {confirmButtonText: "确定", type: "warning"});
                        return;
                    }
                }
                this.$refs["addForm"].validate(valid => {
                    if (valid) {
                        const postData = merge({}, this.addForm);
                        postData.members = postData.members.map(i => ({
                            customerId: i.id,
                            creditQuota: i.creditQuota
                        }));
                        postData.suggestId = this.formDataDeng.id;
                        const loading = this.$openLoading();
                        Api_ApprovalSave(this.isAdd, postData)
                            .then(res => {
                                this.$message.success(res);
                                loading.close();
                                this.$emit("edit", false);
                            })
                            .catch(res => {
                                this.$message.error(res);
                                loading.close();
                            });
                    }
                });
            },
            // 跳转客户档案
            clientProfileDetail() {
                if (this.detailForm.customerId) {
                    this.$gotoCustomerDetail(this.detailForm.customerId);
                } else {
                    this.$alert("请先填写客户！", "提示", {confirmButtonText: "确定", type: "warning"});
                }
            }
        }
    };
</script>

<style scoped lang="scss">
   /deep/ .el-form-item.canClick .el-form-item__label{
        color: #409eff!important;
    }
    .box1-container {
        display: flex;

        .box1-first {
            flex: 0 132px;
        }

        .box1-second {
            flex: 1;
        }
    }

    .payment-plan {
        margin-bottom: 20px;
        border-top: 1px solid #dee2e6;
        border-left: 1px solid #dee2e6;
        border-right: 1px solid #dee2e6;

        .payment-plan-th-color {
            color: #7088a4;
            font-weight: bold;
        }

        .payment-plan-th {
            text-align: center;
            // height: 48px;
            // line-height: 48px;
            // border-right: 1px solid #dee2e6;

            .plan-input {
                margin: 0 4px;
                width: calc(100% - 8px);
            }
        }
    }

    /deep/ .no-label {
        .el-form-item__content {
            margin-left: 0 !important;
        }
    }

    /deep/ .payment-plan .el-input__icon {
        line-height: 30px !important;
    }

    /deep/ .el-input {
        width: 65% !important;
    }

    .payment-plan {
        margin-bottom: 20px;
        border-top: 1px solid #dee2e6;
        border-left: 1px solid #dee2e6;
        border-right: 1px solid #dee2e6;

        .payment-plan-thead {
            display: flex;
            height: 48px;
            align-items: center;
            background-color: #eaedf4;
            border-bottom: 1px solid #dee2e6;
        }

        .payment-plan-tbody {
            display: flex;
            height: 48px;
            align-items: center;
            border-bottom: 1px solid #dee2e6;
        }

        .payment-plan-th-color {
            color: #7088a4;
            font-weight: bold;
        }

        .payment-plan-th {
            text-align: center;
            padding: 0 4px;
            // height: 48px;
            // line-height: 48px;
            // border-right: 1px solid #dee2e6;

            .plan-input {
                width: 100%;
            }
        }
    }

    /deep/ .payment-plan .el-input__icon {
        line-height: 30px !important;
    }

    /deep/ .el-select > .el-input {
        width: 100% !important;
    }
</style>
