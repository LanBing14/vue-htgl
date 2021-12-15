<template>
    <div>
        <div class="page-header">
            <h1 class="page-name">
                <span>合同变更审批{{ modelStatus ? '':'——查看' }}</span>
            </h1>
            <div>
                <el-button @click="back">返回</el-button>
            </div>
        </div>
        <div class="page-content">
            <el-form :model="formData" label-width="90px" label-position="left" class="form">
                <el-alert :closable="false" title="变更申请" type="info"></el-alert>
                <div style="padding: 0 0 0 35px;">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="申请类型">{{ baseData.transientChange.applyType | filterApplyType }}</el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="申请时间">{{ $dateFormat(baseData.transientChange.applyDate) }}</el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="申请附件">
                                <a
                                    v-for="(el,index) in baseData.transientChange.applyUploadFiles"
                                    :key="index"
                                    :href="el.url"
                                    class="a-link"
                                    target="_blank"
                                    download
                                >{{ el.originalName }}</a>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-divider class="detail-divider"></el-divider>
                    <el-row>
                        <el-col>
                            <el-form-item label="申请描述">{{ baseData.transientChange.applyDesc }}</el-form-item>
                        </el-col>
                    </el-row>
                    <el-divider class="detail-divider"></el-divider>
                </div>
                <el-alert :closable="false" title="合同信息" type="info" style="margin-top: 20px;"></el-alert>
                <div style="padding: 0 0 0 35px">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="合同编号">
                                {{ baseData.contractCode }}
                                <template
                                    v-if="showOld && baseData.contractCode!==oldData.contractCode"
                                >
                                    <span class="red">{{ oldData.contractCode }}</span>
                                </template>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="合同名称">
                                {{ baseData.contractName }}
                                <template
                                    v-if="showOld && baseData.contractName!==oldData.contractName"
                                >
                                    <span class="red">{{ oldData.contractName }}</span>
                                </template>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="合同金额" label-width="100px">
                                {{ $toMoney(baseData.contractAvailable) }}&nbsp;
                                <template
                                    v-if="showOld && baseData.contractAvailable!==oldData.contractAvailable"
                                >
                                    <span class="red">{{ $toMoney(oldData.contractAvailable) }}</span>
                                </template>
                                <span class="unit-number">元</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-divider class="detail-divider"></el-divider>
                    <el-row>
                        <el-col :span="16">
                            <el-form-item label="客户名称">
                                {{ baseData.customerName }}
                                <template
                                    v-if="showOld && baseData.customerName!==oldData.customerName"
                                >
                                    <span class="red">{{ oldData.customerName }}</span>
                                </template>
                                <el-button type="text" style="margin-left: 15px;" @click="$gotoCustomerDetail(baseData.customerId)">客户档案</el-button>
                            </el-form-item>
                        </el-col>
                        <el-col
                            v-if="contractPaymentHistory.hisOverdue && contractPaymentHistory.hisOverdue>0"
                            :span="8"
                        >
                            <el-form-item>
                                <el-alert
                                    :closable="false"
                                    title="Tips：当前企业存在逾期行为，需谨慎赊销"
                                    type="warning"
                                    style="line-height: normal"
                                ></el-alert>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-divider class="detail-divider"></el-divider>
                    <EnterpriseFile :enterpriseID="baseData.customerId"></EnterpriseFile>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="应收确定方式">
                                {{ baseData.confirmType === '1' ? '按销售出库确认' : '按付款计划确认' }}&nbsp;
                                <template
                                    v-if="showOld && baseData.confirmType!==oldData.confirmType"
                                >
                                    <span class="red">{{ oldData.confirmType === '1' ? '按销售出库确认' : '按付款计划确认' }}&nbsp;</span>
                                </template>
                            </el-form-item>
                        </el-col>
                        <!--                        <el-col :span="8">-->
                        <!--                            <el-form-item label="付款条件">-->
                        <!--                                {{ turnPayConditionId(baseData.payConditionId) }}&nbsp;-->
                        <!--                                <template v-if="showOld && baseData.payConditionId!==oldData.payConditionId">-->
                        <!--                                    <span class="red">{{ turnPayConditionId(oldData.payConditionId) }}</span>-->
                        <!--                                </template>-->
                        <!--                            </el-form-item>-->
                        <!--                        </el-col>-->
                        <!--                        <el-col :span="8">-->
                        <!--                            <el-form-item label="是否预付" label-width="100px">-->
                        <!--                                {{ baseData.prepaid === 1 ? '是' : '否' }}-->
                        <!--                                <template v-if="showOld && baseData.prepaid!==oldData.prepaid">-->
                        <!--                                    <span class="red">{{ oldData.prepaid === 1 ? '是' : '否' }}</span>-->
                        <!--                                </template>-->
                        <!--                            </el-form-item>-->
                        <!--                        </el-col>-->
                    </el-row>
                    <el-divider class="detail-divider"></el-divider>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="预付金额">
                                {{ $toMoney(baseData.payAmount) }}
                                <template
                                    v-if="showOld && baseData.payAmount!==oldData.payAmount"
                                >
                                    <span class="red">{{ $toMoney(oldData.payAmount) }}</span>
                                </template>&nbsp;
                                <span class="unit-number">元</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="负责人员">
                                {{ baseData.headName }}
                                <template v-if="showOld && baseData.headName!==oldData.headName">
                                    <span class="red">{{ oldData.headName }}</span>
                                </template>
                            </el-form-item>
                        </el-col>
                        <!--                        <el-col :span="8">-->
                        <!--                            <el-form-item>-->
                        <!--                                <span slot="label" style="color: rgba(255, 0, 0, 1)">赊销金额</span>-->
                        <!--                                {{ $toMoney(baseData.creditAmount) }}-->
                        <!--                                <template v-if="showOld && baseData.creditAmount!==oldData.creditAmount">-->
                        <!--                                    <span class="red">{{ $toMoney(oldData.creditAmount) }}</span>-->
                        <!--                                </template>&nbsp;-->
                        <!--                                <span class="unit-number">元</span>-->
                        <!--                            </el-form-item>-->
                        <!--                        </el-col>-->
                    </el-row>
                    <el-divider class="detail-divider"></el-divider>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="合同状态">
                                {{ baseData.state | filterState }}
                                <template
                                    v-if="showOld && baseData.state!==oldData.state"
                                >
                                    <span class="red">{{ oldData.state | filterState }}</span>
                                </template>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="合同附件">
                                <div>
                                    <a
                                        v-for="(el,index) in baseData.uploadFiles"
                                        :key="index"
                                        :href="el.url"
                                        class="a-link"
                                        target="_blank"
                                        download
                                    >{{ el.originalName }}</a>
                                </div>
                                <template v-if="showOld && !isEqual(baseData.uploadFiles, oldData.uploadFiles)">
                                    <div>
                                        <a
                                            v-for="(el,index) in oldData.uploadFiles"
                                            :key="index"
                                            :href="el.url"
                                            class="a-link red"
                                            target="_blank"
                                            download
                                        >
                                            <span class="red">{{ el.originalName }}</span>
                                        </a>
                                    </div>
                                </template>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-divider class="detail-divider"></el-divider>
                    <el-row>
                        <el-col>
                            <el-form-item label="合同概述">
                                {{ baseData.remark }}
                                <template v-if="showOld && baseData.remark!==oldData.remark">
                                    <div class="red">{{ oldData.remark }}</div>
                                </template>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>

                <el-alert
                    :closable="false"
                    title="合同清单"
                    type="info"
                    style="margin-bottom: 0;border-bottom: 1px solid #EBEEF5;"
                ></el-alert>
                <el-table :data="baseData.transientGoodsInfo" style="width: 100%">
                    <el-table-column prop="name" label="产品/服务名称" align="center"></el-table-column>
                    <!--                    <el-table-column prop="type" label="规格型号" align="center"></el-table-column>-->
                    <el-table-column prop="company" label="销售单位" align="center"></el-table-column>
                    <el-table-column prop="num" label="销售数量" align="center"></el-table-column>
                    <!--                    <el-table-column prop="unitPrice" label="单价(元)" align="right">-->
                    <!--                        <template slot-scope="scope">{{ $toMoney(scope.row.unitPrice) }}</template>-->
                    <!--                    </el-table-column>-->
                    <!--                    <el-table-column label="销售金额(元)" align="right">-->
                    <!--                        <template slot-scope="scope">-->
                    <!--                            {{ $toMoney($divide($multiply(scope.row.unitPrice,scope.row.num),10000)) }}-->
                    <!--                        </template>-->
                    <!--                    </el-table-column>-->
                    <!--                    <el-table-column prop="time" label="要货日期" align="center">-->
                    <!--                        <template slot-scope="scope">-->
                    <!--                            {{ $dateFormat(scope.row.time) }}-->
                    <!--                        </template>-->
                    <!--                    </el-table-column>-->
                    <el-table-column prop="remark" label="备注" align="center"></el-table-column>
                </el-table>
                <template v-if="showOld && !isEqual(baseData.transientGoodsInfo, oldData.transientGoodsInfo)">
                    <el-table :data="oldData.transientGoodsInfo" class="red" style="width: 100%">
                        <el-table-column prop="name" label="产品/服务名称" align="center"></el-table-column>
                        <!--                        <el-table-column prop="type" label="规格型号" align="center"></el-table-column>-->
                        <el-table-column prop="company" label="销售单位" align="center"></el-table-column>
                        <el-table-column prop="num" label="销售数量" align="center"></el-table-column>
                        <!--                        <el-table-column prop="unitPrice" label="单价(元)" align="right">-->
                        <!--                            <template slot-scope="scope">{{ $toMoney(scope.row.unitPrice) }}</template>-->
                        <!--                        </el-table-column>-->
                        <!--                        <el-table-column label="销售金额(元)" align="right">-->
                        <!--                            <template slot-scope="scope">-->
                        <!--                                {{ $toMoney($divide($multiply(scope.row.unitPrice,scope.row.num),10000)) }}-->
                        <!--                            </template>-->
                        <!--                        </el-table-column>-->
                        <!--                        <el-table-column prop="time" label="要货日期" align="center">-->
                        <!--                            <template slot-scope="scope">-->
                        <!--                                {{ $dateFormat(scope.row.time) }}-->
                        <!--                            </template>-->
                        <!--                        </el-table-column>-->
                        <el-table-column prop="remark" label="备注" align="center"></el-table-column>
                    </el-table>
                </template>

                <!--                <el-alert :closable="false" title="付款计划" type="info"-->
                <!--                          style="margin-top: 20px;margin-bottom: 0;border-bottom: 1px solid #EBEEF5;">-->
                <!--                    <el-button v-if="showOld && !isEqual(baseData.transientPayPlansHis, oldData.transientPayPlansHis)"-->
                <!--                               @click="showPlans = !showPlans">-->
                <!--                        <i-->
                <!--                            v-if="!showPlans"-->
                <!--                            class="el-icon-plus"/>-->
                <!--                        <i-->
                <!--                            v-else-->
                <!--                            class="el-icon-minus"/>-->
                <!--                        变更前-->
                <!--                    </el-button>-->
                <!--                </el-alert>-->
                <!--                <el-table-->
                <!--                    :data="baseData.transientPayPlansHis"-->
                <!--                    style="width: 100%">-->
                <!--                    <el-table-column prop="paymentDescribe" label="付款描述" align="center"></el-table-column>-->
                <!--                    <el-table-column prop="paymentCondition" label="付款条件" align="center"></el-table-column>-->
                <!--                    <el-table-column prop="planAmount" label="计划付款金额(元)" align="right">-->
                <!--                        <template slot-scope="scope">{{ $toMoney(scope.row.planAmount) }}</template>-->
                <!--                    </el-table-column>-->
                <!--                    <el-table-column label="计划付款比例(%)" align="center">-->
                <!--                        <template slot-scope="scope">-->
                <!--                            {{ $multiply($divide(scope.row.planAmount, baseData.contractAvailable), 100) }}-->
                <!--                        </template>-->
                <!--                    </el-table-column>-->
                <!--                    <el-table-column prop="payDate" label="计划付款日期" align="center"></el-table-column>-->
                <!--                    <el-table-column prop="endDate" label="到期日" align="center"></el-table-column>-->
                <!--                    <el-table-column prop="receivable" label="收款金额(元)" align="right">-->
                <!--                        <template slot-scope="scope">{{ $toMoney(scope.row.receivable) }}</template>-->
                <!--                    </el-table-column>-->
                <!--                    <el-table-column prop="lastPayTime" label="最近收款时间" align="center"></el-table-column>-->
                <!--                    <el-table-column prop="payPlanState" label="状态" align="center">-->
                <!--                        <template slot-scope="scope">-->
                <!--                            <template v-if="scope.row.payPlanState === '9'">未开始</template>-->
                <!--                            <template v-if="scope.row.payPlanState === '1'">未完成</template>-->
                <!--                            <template v-if="scope.row.payPlanState === '2'">逾期未完成</template>-->
                <!--                            <template v-if="scope.row.payPlanState === '3'">已完成</template>-->
                <!--                            <template v-if="scope.row.payPlanState === '4'">逾期完成</template>-->
                <!--                        </template>-->
                <!--                    </el-table-column>-->
                <!--                </el-table>-->
                <!--                <template v-if="showOld && !isEqual(baseData.transientPayPlansHis, oldData.transientPayPlansHis)">-->
                <!--                    <el-table v-if="showPlans" :data="oldData.transientPayPlansHis" class="red" style="width: 100%">-->
                <!--                        <el-table-column prop="paymentDescribe" label="付款描述" align="center"></el-table-column>-->
                <!--                        <el-table-column prop="paymentCondition" label="付款条件" align="center"></el-table-column>-->
                <!--                        <el-table-column prop="planAmount" label="计划付款金额(元)" align="right">-->
                <!--                            <template slot-scope="scope">{{ $toMoney(scope.row.planAmount) }}</template>-->
                <!--                        </el-table-column>-->
                <!--                        <el-table-column label="计划付款比例(%)" align="center">-->
                <!--                            <template slot-scope="scope">-->
                <!--                                {{ $multiply($divide(scope.row.planAmount, oldData.contractAvailable), 100) }}-->
                <!--                            </template>-->
                <!--                        </el-table-column>-->
                <!--                        <el-table-column prop="payDate" label="计划付款日期" align="center"></el-table-column>-->
                <!--                        <el-table-column prop="endDate" label="到期日" align="center"></el-table-column>-->
                <!--                        <el-table-column prop="receivable" label="收款金额(元)" align="right">-->
                <!--                            <template slot-scope="scope">{{ $toMoney(scope.row.receivable) }}</template>-->
                <!--                        </el-table-column>-->
                <!--                        <el-table-column prop="lastPayTime" label="最近收款时间" align="center"></el-table-column>-->
                <!--                        <el-table-column prop="payPlanState" label="状态" align="center">-->
                <!--                            <template slot-scope="scope">-->
                <!--                                <template v-if="scope.row.payPlanState === '9'">未开始</template>-->
                <!--                                <template v-if="scope.row.payPlanState === '1'">未完成</template>-->
                <!--                                <template v-if="scope.row.payPlanState === '2'">逾期未完成</template>-->
                <!--                                <template v-if="scope.row.payPlanState === '3'">已完成</template>-->
                <!--                                <template v-if="scope.row.payPlanState === '4'">逾期完成</template>-->
                <!--                            </template>-->
                <!--                        </el-table-column>-->
                <!--                    </el-table>-->
                <!--                </template>-->
                <el-alert :closable="false" title="补充信息" type="info" style="margin-top: 25px;"></el-alert>
                <el-row style="padding: 0 20px;">
                    <el-form-item label="签订日期">
                        {{ $dateFormat(baseData.signDate) }}
                        <template
                            v-if="showOld && !isEqual(baseData.signDate, oldData.signDate)"
                        >
                            <span class="red">{{ $dateFormat(baseData.signDate) }}</span>
                        </template>
                    </el-form-item>
                    <el-divider class="detail-divider"></el-divider>
                    <el-form-item label="有效日期">
                        {{ $dateFormat(baseData.effectiveDate) }}
                        <template
                            v-if="showOld && !isEqual(baseData.effectiveDate, oldData.effectiveDate)"
                        >
                            <span class="red">{{ $dateFormat(baseData.effectiveDate) }}</span>
                        </template>
                    </el-form-item>
                    <el-divider class="detail-divider"></el-divider>
                    <el-form-item label="附件(已盖章)">
                        <div>
                            <a
                                v-for="(el,index) in baseData.additionalUploadFiles"
                                :key="index"
                                :href="el.url"
                                class="a-link"
                                target="_blank"
                                download
                            >{{ el.originalName }}</a>
                        </div>
                        <template
                            v-if="showOld && !isEqual(baseData.additionalUploadFiles, oldData.additionalUploadFiles)"
                        >
                            <div>
                                <a
                                    v-for="(el,index) in baseData.additionalUploadFiles"
                                    :key="index"
                                    :href="el.url"
                                    class="a-link red"
                                    target="_blank"
                                    download
                                >{{ el.originalName }}</a>
                            </div>
                        </template>
                    </el-form-item>
                    <el-divider class="detail-divider"></el-divider>
                </el-row>
            </el-form>
            <slot></slot>
        </div>
    </div>
</template>

<script>
import { isEqual } from "lodash";
import { Api_CreditCustomerGetCustomerCredit } from "@/api/creditManagement/creditGranting/customer";
import {
    Api_AgencyMattersGetContractInfo,
    Api_AgencyMattersGetAuditPage,
    Api_AgencyMattersAudit
} from "@/api/creditManagement/todo/index";
import {
    Api_CurrentContractPayment,
    Api_HistoryContractPayment,
    Api_ContratDetail
} from "@/api/creditManagement/contractManagement/contract";
import { Api_PaymentConditionsList } from "@/api/creditManagement/accountsReceivable/paymentManagement.js";
import EnterpriseFile from "@/components/EnterpriseFile/index.vue";

export default {
    name: "ConstractChange",
    filters: {
        filterApplyType(val) {
            if (val === "2") {
                return "合同变更";
            } else if (val === "3") {
                return "履约完成";
            } else if (val === "4") {
                return "合同取消";
            }
        },
        filterState(val) {
            switch (val) {
                case "0":
                    return "合同拟定";
                case "1":
                    return "合同审核";
                case "2":
                    return "合同签约";
                case "3":
                    return "合同执行";
                case "4":
                    return "履约完成";
                case "5":
                    return "合同取消";
                default:
                    return "合同作废";
            }
        }
    },
    components: {
        EnterpriseFile
    },
    props: {
        modelStatus: Boolean,
        row: Object
    },
    data() {
        const createRules = this.$createRules;
        return {
            isEqual,
            formData: {
                key1: "asdf",
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
                contractCode: "", // 	合同编码
                contractName: "", // 	合同名称
                contractAvailable: "", // 	合同金额
                customerId: "", //      客户id
                customerName: "", // 	客户名称
                payAmount: "", // 	预付金额
                creditAmount: "", // 	赊销金额
                phase: "", // 	付款期次
                headName: "", // 	负责人员
                remark: "", // 	合同概述
                state: "", // 	合同状态:0-合同拟定，1-合同审核，2-合同执行，3-履约完成，4-合同取消
                uploadFiles: [], // 	合同附件
                signDate: "", // 	签订日期
                effectiveDate: "", // 	有效日期
                additionalUploadFiles: [], // 	补充信息附件
                transientPayPlansHis: [], // 付款计划
                transientChange: {
                    // 变更信息
                    applyCode: "", // 申请编码
                    applyType: "", // 申请类型：1-合同变更 2-履约完成 3-合同取消
                    applyDesc: "", // 申请描述
                    applyDate: "", // 申请时间
                    applyUploadFiles: [] // 	申请附件
                },
                transientGoodsInfo: [] // 合同清单
            },
            oldData: {}, // 合同变更时的旧数据
            companyBaseData: {}, // 信用等级及授信情况
            contractPaymentCurrent: {}, // 当前合同付款履约情况
            contractPaymentHistory: {}, // 历史合同付款履约情况
            isSign: true, // 是否签批
            payConditionIdOptions: [],
            showPlans: false
        };
    },
    computed: {
        // 是否显示旧数据
        showOld() {
            return this.baseData.transientChange.applyType === "2";
        }
    },
    created() {
        const { business_key } = this.row;
        Api_PaymentConditionsList({ currentPage: 1, pageSize: 100, name: "", status: 1 }).then(res => {
            this.payConditionIdOptions = res.data;
        });
        Api_AgencyMattersGetContractInfo(business_key).then(res => {
            Object.keys(this.baseData).forEach(key => {
                if (key === "uploadFiles" || key === "additionalUploadFiles" || key === "transientPayPlansHis") {
                    this.baseData[key] = res[key] || [];
                } else if (key === "transientChange") {
                    this.baseData[key] = res[key] || {};
                } else {
                    this.baseData[key] = res[key];
                }
            });
            if (res.transientChange && res.transientChange.applyType === "2") {
                this.oldData = res.transientContract;
            }
            // if (res.transientChange && res.transientChange.applyType === '1') {
            //     this.oldData = res;
            //     this.mergeBaseData(res.transientContract)
            // } else {
            //     this.mergeBaseData(res)
            // }
            // 获取“信用等级及授信情况”
            // Api_CreditCustomerGetCustomerCredit(res.customerId).then(res => {
            //     this.companyBaseData = res;
            // });
        });
    },
    methods: {
        mergeBaseData(res) {
            Object.keys(this.baseData).forEach(key => {
                if (key === "uploadFiles" || key === "additionalUploadFiles" || key === "transientPayPlansHis") {
                    this.baseData[key] = res[key] || [];
                } else if (key === "transientChange") {
                    this.baseData[key] = res[key] || {};
                } else {
                    this.baseData[key] = res[key];
                }
            });
        },
        turnPayConditionId(id) {
            const findRes = this.payConditionIdOptions.find(i => i.id === id);
            return findRes ? findRes.name : "";
        },
        back() {
            this.$emit("edit", false);
        }
    }
};
</script>
<style lang="scss" scoped>
.red {
    color: red;

    table {
        td,
        th {
            color: red;
        }
    }
}

.form /deep/ .el-form-item__label {
    padding-right: 0;
}
</style>
