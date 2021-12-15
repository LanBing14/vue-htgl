<template>
    <div>
        <div class="page-header">
            <h1 class="page-name">
                <span>订单变更审批{{ modelStatus ? '':'——查看' }}</span>
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
                            <el-form-item label="申请类型">{{ baseData.transientChange.applyType | filterApplyType }}
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="申请时间">{{ $dateFormat(baseData.transientChange.applyDate) }}
                            </el-form-item>
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
                <el-alert :closable="false" title="订单信息" type="info" style="margin-top: 20px;"></el-alert>
                <div style="padding: 0 0 0 35px">
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="订单名称">
                                <template>
                                    <span  class="canClick"
                                           @click="$gotoOrderDetail(baseData.contractId)"> {{ baseData.contractCode }}</span>
                                    <template
                                        v-if="showOld && baseData.contractCode!==oldData.contractCode"
                                    >
                                        <span class="canClick"
                                              @click="$gotoOrderDetail(baseData.contractId)">>{{ oldData.contractCode }}</span>
                                    </template>
                                </template>

                                <span  class="canClick"
                                       @click="$gotoOrderDetail(baseData.contractId)">  / {{ baseData.contractName }}</span>
                                <template
                                    v-if="showOld && baseData.contractName!==oldData.contractName"
                                >
                                    <span class="canClick"
                                          @click="$gotoOrderDetail(baseData.contractId)">>   /{{ oldData.contractName }}</span>
                                </template>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-divider class="detail-divider"></el-divider>
                    <el-row>
                        <el-col :span="16">
                            <el-form-item label="客户名称">
                                <span class="canClick" @click="$gotoCustomerDetail(baseData.customerId)">
                                         {{ baseData.customerName }}
                                <template
                                    v-if="showOld && baseData.customerName!==oldData.customerName"
                                >
                                    <span class="red">{{ oldData.customerName }}</span>
                                </template>
                                </span>
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
                    <template v-if="baseData.refContractId">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="合同名称">
                                    <span class="canClick" @click="$gotoContractDetail(baseData.refContractId)">{{ baseData.refContractName }}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-divider class="detail-divider"></el-divider>
                    </template>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="负责人员">
                                {{ baseData.headDeptName }}
                                <template v-if="showOld && baseData.headDeptName!==oldData.headDeptName">
                                    <span class="red">{{ oldData.headDeptName }}</span>
                                </template>
                                /
                                {{ baseData.headName }}
                                <template v-if="showOld && baseData.headName!==oldData.headName">
                                    <span class="red">{{ oldData.headName }}</span>
                                </template>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="订单状态">
                                {{ baseData.state | filterState }}
                                <template
                                    v-if="showOld && baseData.state!==oldData.state"
                                >
                                    <span class="red">{{ oldData.state | filterState }}</span>
                                </template>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="申请日期">{{ baseData.createDate&&baseData.createDate.substr(0,10) }}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-divider class="detail-divider"></el-divider>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="签约日期">{{ $dateFormat(baseData.signDate) }}</el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="有效期始">{{ $dateFormat(baseData.effectiveDateStart) }}</el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="有效期止">
                                {{ $dateFormat(baseData.effectiveDateEnd) }}
                                <template
                                    v-if="showOld && baseData.effectiveDateEnd!==oldData.effectiveDateEnd"
                                >
                                    <span class="red">{{ $dateFormat(oldData.effectiveDateEnd) }}</span>
                                </template>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!--                    <el-divider class="detail-divider"></el-divider>-->
                    <!--                    <el-row>-->
                    <!--                        <el-col :span="8">-->
                    <!--                            <el-form-item label="应收确定方式">-->
                    <!--                                {{ baseData.confirmType === '1' ? '按订单签约日期' : '按发票登记日期' }}&nbsp;-->
                    <!--                                <template-->
                    <!--                                    v-if="showOld && baseData.confirmType!==oldData.confirmType"-->
                    <!--                                >-->
                    <!--                                    <span class="red">{{ oldData.confirmType === '1' ? '按订单签约日期' : '按发票登记日期' }}&nbsp;</span>-->
                    <!--                                </template>-->
                    <!--                            </el-form-item>-->
                    <!--                        </el-col>-->
                    <!--                    </el-row>-->
                    <!--                    <el-row>-->
                    <!--                        <el-col :span="8">-->
                    <!--                            <el-form-item label="订单状态">-->
                    <!--                                {{ baseData.state | filterState }}-->
                    <!--                                <template-->
                    <!--                                    v-if="showOld && baseData.state!==oldData.state"-->
                    <!--                                >-->
                    <!--                                    <span class="red">{{ oldData.state | filterState }}</span>-->
                    <!--                                </template>-->
                    <!--                            </el-form-item>-->
                    <!--                        </el-col>-->
                    <!--                        <el-col :span="8">-->
                    <!--                            <el-form-item label="订单附件">-->
                    <!--                                <div>-->
                    <!--                                    <a-->
                    <!--                                        v-for="(el,index) in baseData.uploadFiles"-->
                    <!--                                        :key="index"-->
                    <!--                                        :href="el.url"-->
                    <!--                                        class="a-link"-->
                    <!--                                        target="_blank"-->
                    <!--                                        download-->
                    <!--                                    >{{ el.originalName }}</a>-->
                    <!--                                </div>-->
                    <!--                                <template v-if="showOld && !isEqual(baseData.uploadFiles, oldData.uploadFiles)">-->
                    <!--                                    <div>-->
                    <!--                                        <a-->
                    <!--                                            v-for="(el,index) in oldData.uploadFiles"-->
                    <!--                                            :key="index"-->
                    <!--                                            :href="el.url"-->
                    <!--                                            class="a-link red"-->
                    <!--                                            target="_blank"-->
                    <!--                                            download-->
                    <!--                                        >-->
                    <!--                                            <span class="red">{{ el.originalName }}</span>-->
                    <!--                                        </a>-->
                    <!--                                    </div>-->
                    <!--                                </template>-->
                    <!--                            </el-form-item>-->
                    <!--                        </el-col>-->
                    <!--                    </el-row>-->
                    <!--                    <el-divider class="detail-divider"></el-divider>-->
                    <!--                    <el-row>-->
                    <!--                        <el-col>-->
                    <!--                            <el-form-item label="订单概述">-->
                    <!--                                {{ baseData.remark }}-->
                    <!--                                <template v-if="showOld && baseData.remark!==oldData.remark">-->
                    <!--                                    <div class="red">{{ oldData.remark }}</div>-->
                    <!--                                </template>-->
                    <!--                            </el-form-item>-->
                    <!--                        </el-col>-->
                    <!--                    </el-row>-->
                </div>

                <el-alert
                    :closable="false"
                    title="发货清单"
                    type="info"
                    style="margin-bottom: 0;margin-top: 15px;border-bottom: 1px solid #EBEEF5;"
                ></el-alert>
                <el-table :data="baseData.transientGoodsInfo" style="width: 100%">
                    <el-table-column prop="name" label="产品/服务名称" align="center"></el-table-column>
                    <el-table-column prop="company" label="销售单位" align="center"></el-table-column>
                    <el-table-column prop="unitPrice" label="单价(元)" align="right">
                        <template slot-scope="scope">{{ $toMoney(scope.row.unitPrice) }}</template>
                    </el-table-column>
                    <el-table-column prop="num" label="销售数量" align="center"></el-table-column>
                    <el-table-column prop="num" label="总价(元)" align="center">
                        <template slot-scope="scope">{{ $toMoney(scope.row.num * scope.row.unitPrice) }}</template>
                    </el-table-column>
                    <el-table-column prop="discount" label="折扣(%)" align="center"></el-table-column>
                    <el-table-column label="实际成交价(元)" align="center">
                        <template slot-scope="scope">
                            {{ $toMoney(((scope.row.num * scope.row.unitPrice * scope.row.discount) / 100).toFixed(2))
                            }}
                        </template>
                    </el-table-column>
                </el-table>
                <template v-if="showOld && !isEqual(baseData.transientGoodsInfo, oldData.transientGoodsInfo)">
                    <el-table :data="oldData.transientGoodsInfo" class="red" style="width: 100%">
                        <el-table-column prop="name" label="产品/服务名称" align="center"></el-table-column>
                        <el-table-column prop="company" label="销售单位" align="center"></el-table-column>
                        <el-table-column prop="unitPrice" label="单价(元)" align="right">
                            <template slot-scope="scope">{{ $toMoney(scope.row.unitPrice) }}</template>
                        </el-table-column>
                        <el-table-column prop="num" label="销售数量" align="center"></el-table-column>
                        <el-table-column prop="num" label="总价(元)" align="center">
                            <template slot-scope="scope">{{ $toMoney(scope.row.num * scope.row.unitPrice) }}</template>
                        </el-table-column>
                        <el-table-column prop="discount" label="折扣(%)" align="center"></el-table-column>
                        <el-table-column label="实际成交价(元)" align="center">
                            <template slot-scope="scope">
                                {{ $toMoney(((scope.row.num * scope.row.unitPrice * scope.row.discount) /
                                100).toFixed(2)) }}
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
                <div style="padding-left: 36px;margin-top: 20px;">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="订单金额" label-width="100px">
                                {{ $toMoney(baseData.contractAvailable) }}&nbsp;
                                <template
                                    v-if="showOld && baseData.contractAvailable!==oldData.contractAvailable"
                                >
                                    <span class="red order-old-money" >{{ $toMoney(oldData.contractAvailable) }}</span>
                                </template>
                                <span class="unit-number">元</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="折扣" label-width="100px">
                                {{ baseData.discount }}%&nbsp;
                                <template
                                    v-if="showOld && baseData.discount!==oldData.discount"
                                >
                                    <span class="red">{{ oldData.discount }}%</span>
                                </template>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-divider class="detail-divider"></el-divider>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="应收确定日期" label-width="100px">
                                {{ baseData.confirmType==='1'?'按订单签约日期':'按发票登记日期' }}&nbsp;
                                <template
                                    v-if="showOld && baseData.confirmType!==oldData.confirmType"
                                >
                                    <span class="red">{{ oldData.confirmType==='1'?'按订单签约日期':'按发票登记日期' }}</span>
                                </template>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="是否预付" label-width="100px">
                                {{ (baseData.prepaid!==null&&baseData.prepaid!==undefined) ? (baseData.prepaid ? '是'
                                :'否') :'' }}&nbsp;
                                <template
                                    v-if="showOld && baseData.prepaid!==oldData.prepaid"
                                >
                                    <span class="red">{{ oldData.prepaid? '是' :'否' }}</span>
                                </template>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <template v-if="baseData.prepaid">
                        <el-divider class="detail-divider"></el-divider>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="预付金额" label-width="100px">
                                    {{ $toMoney(baseData.payAmount) }}&nbsp;元
                                    <template
                                        v-if="showOld && baseData.payAmount!==oldData.payAmount"
                                    >
                                        <span class="red">{{ $toMoney(oldData.payAmount) }} 元</span>
                                    </template>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="预付日期" label-width="100px">
                                    {{ $dateFormat(baseData.payAmountDate) }}&nbsp;
                                    <template
                                        v-if="showOld && baseData.payAmountDate!==oldData.payAmountDate"
                                    >
                                        <span class="red">{{ $dateFormat(oldData.payAmountDate) }}</span>
                                    </template>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </template>
                    <el-divider class="detail-divider"></el-divider>
                    <el-form-item label="发货日期" label-width="100px">
                        {{ $dateFormat(baseData.outGoodsDate) }}&nbsp;
                        <template
                            v-if="showOld && baseData.outGoodsDate!==oldData.outGoodsDate"
                        >
                            <span class="red">{{ $dateFormat(oldData.outGoodsDate) }}</span>
                        </template>
                    </el-form-item>
                    <el-divider class="detail-divider"></el-divider>
                    <el-form-item label="收货地址" label-width="100px">
                        {{ baseData.address.split(',')[1] }}&nbsp;
                        <template
                            v-if="showOld && baseData.address!==oldData.address"
                        >
                            <span class="red">{{ oldData.address.split(',')[1] }}</span>
                        </template>
                    </el-form-item>
                    <el-divider class="detail-divider"></el-divider>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="拖欠罚金">
                                {{baseData.defaultMoney==='1'?'不使用罚金':
                                baseData.defaultMoney==='2'?'一次性收取':
                                baseData.defaultMoney==='3'?'按天收取':'-'}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" v-if="baseData.defaultMoney==='2'||baseData.defaultMoney==='3'">
                            <el-form-item label="计算依据">
                                {{baseData.defaultBasis==='1'?'订单金额':
                                baseData.defaultBasis==='2'?'应收账款余额':'-'}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" v-if="baseData.defaultMoney==='2'||baseData.defaultMoney==='3'">
                            <el-form-item label="计算比率">{{baseData.defaultPercent}}  %</el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="订单备注" label-width="100px">
                        <div>
                            {{ baseData.remark || '-' }}&nbsp;
                        </div>
                        <template
                            v-if="showOld && baseData.remark!==oldData.remark"
                        >
                            <span class="red">{{ oldData.remark || '-' }}</span>
                        </template>
                    </el-form-item>
                    <el-divider class="detail-divider"></el-divider>
                    <el-form-item label="订单附件">
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
                </div>
                <el-alert :closable="false" title="补充信息" type="info" style="margin-top: 25px;"></el-alert>
                <el-row style="padding-left: 35px;">
                    <el-form-item label="签订日期">
                        {{ $dateFormat(baseData.signDate) }}
                        <template
                            v-if="showOld && !isEqual(baseData.signDate, oldData.signDate)"
                        >
                            <span class="red">{{ $dateFormat(baseData.signDate) }}</span>
                        </template>
                    </el-form-item>
                    <el-divider class="detail-divider"></el-divider>
                    <el-form-item label="有效期始">
                        {{ $dateFormat(baseData.effectiveDateStart) }}
                        <template
                            v-if="showOld && !isEqual(baseData.effectiveDateStart, oldData.effectiveDateStart)"
                        >
                            <span class="red">{{ $dateFormat(baseData.effectiveDateStart) }}</span>
                        </template>
                    </el-form-item>
                    <el-divider class="detail-divider"></el-divider>
                    <el-form-item label="有效期止">
                        {{ $dateFormat(baseData.effectiveDateEnd) }}
                        <template
                            v-if="showOld && !isEqual(baseData.effectiveDateEnd, oldData.effectiveDateEnd)"
                        >
                            <span class="red">{{ $dateFormat(baseData.effectiveDateEnd) }}</span>
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
    import {isEqual} from "lodash";
    import {Api_CreditCustomerGetCustomerCredit} from "@/api/creditManagement/creditGranting/customer";
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
    import {Api_PaymentConditionsList} from "@/api/creditManagement/accountsReceivable/paymentManagement.js";
    import EnterpriseFile from "@/components/EnterpriseFile/index.vue";

    export default {
        name: "OrderChange",
        filters: {
            filterApplyType(val) {
                if (val === "2") {
                    return "订单变更";
                } else if (val === "3") {
                    return "履约完成";
                } else if (val === "4") {
                    return "订单取消";
                }
            },
            filterState(val) {
                switch (val) {
                    case "0":
                        return "待提交";
                    case "1":
                        return "待审核";
                    case "2":
                        return "待签约";
                    case "3":
                        return "订单执行";
                    case "4":
                        return "订单完成";
                    case "5":
                        return "订单取消";
                    default:
                        return "订单作废";
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
                    contractId :"",//合同id
                    contractCode: "", // 	订单编码
                    contractName: "", // 	订单名称
                    contractAvailable: "", // 	订单金额
                    customerId: "", //      客户id
                    customerName: "", // 	客户名称
                    payAmount: "", // 	预付金额
                    creditAmount: "", // 	赊销金额
                    phase: "", // 	付款期次
                    headName: "", // 	负责人员
                    remark: "", // 	订单概述
                    state: "", // 	订单状态:0-订单拟定，1-订单审核，2-订单执行，3-履约完成，4-订单取消
                    uploadFiles: [], // 	订单附件
                    signDate: "", // 	签订日期
                    effectiveDate: "", // 	有效日期
                    additionalUploadFiles: [], // 	补充信息附件
                    transientPayPlansHis: [], // 付款计划
                    transientChange: {
                        // 变更信息
                        applyCode: "", // 申请编码
                        applyType: "", // 申请类型：1-订单变更 2-履约完成 3-订单取消
                        applyDesc: "", // 申请描述
                        applyDate: "", // 申请时间
                        applyUploadFiles: [] // 	申请附件
                    },
                    transientGoodsInfo: [], // 发货清单
                    address: "",
                    discount: "",
                    confirmType: '',
                    prepaid: '',
                    outGoodsDate: '',
                    payAmountDate: '',
                    effectiveDateStart: '',
                    defaultMoney:'',
                    defaultBasis:'',
                    defaultPercent:'',
                    effectiveDateEnd: '',
                    refContractName: '',
                    refContractId: '',
                    headDeptName: '',
                    createDate: '',
                },
                oldData: {}, // 订单变更时的旧数据
                companyBaseData: {}, // 信用等级及授信情况
                contractPaymentCurrent: {}, // 当前订单付款履约情况
                contractPaymentHistory: {}, // 历史订单付款履约情况
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
            const {business_key} = this.row;
            Api_PaymentConditionsList({currentPage: 1, pageSize: 100, name: "", status: 1}).then(res => {
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
            back() {
                this.$emit("edit", false);
            }
        }
    };
</script>
<style lang="scss" scoped>
    .red {
        /* color: red; */

        table {
            td,
            th {
                /* color: red; */
            }
        }
    }
    .order-old-money{
        text-decoration: line-through;
    }
    .form /deep/ .el-form-item__label {
        padding-right: 0;
    }
</style>
