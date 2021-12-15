<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>订单签订审批{{ modelStatus ? '':'——查看' }}</span>
      </h1>
      <div>
        <el-button @click="back">返回</el-button>
      </div>
    </div>
    <div v-loading="baseLoading" class="page-content">
      <el-form :model="formData" label-width="8em" label-position="left" class="form">
        <div style="padding: 0 0 0 36px;">
          <el-row>
            <el-col :span="24">
              <el-form-item label="订单名称">{{ baseData.contractCode }} / {{ baseData.contractName }}</el-form-item>
            </el-col>
            <!--                        <el-col :span="8">-->
            <!--                            <el-form-item label="订单金额">-->
            <!--                                {{ $toMoney(baseData.contractAvailable) }}&nbsp;-->
            <!--                                <span class="unit-number">元</span>-->
            <!--                            </el-form-item>-->
            <!--                        </el-col>-->
          </el-row>
          <el-divider class="detail-divider"></el-divider>
          <el-row>
            <el-col :span="16">
              <el-form-item label="客户名称">
                <span
                  class="canClick"
                  @click="$gotoCustomerDetail(baseData.customerId)"
                >{{ baseData.customerName }}</span>
              </el-form-item>
            </el-col>
            <el-col v-if="contractPaymentHistory.hisOverdue && contractPaymentHistory.hisOverdue>0" :span="8">
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
          <EnterpriseFile :enterpriseID="baseData.customerId"></EnterpriseFile>
          <template v-if="baseData.refContractId">
            <el-row>
              <el-col :span="8">
                <el-form-item label="合同名称">
                  <span
                    class="canClick"
                    @click="$gotoContractDetail(baseData.refContractId)"
                  >{{ baseData.refContractName }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-divider class="detail-divider"></el-divider>
          </template>
          <el-row>
            <el-col :span="8">
              <el-form-item label="负责人员">{{ (baseData.headDeptName||'-')+'/'+(baseData.headName||'-') }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="订单状态">{{ baseData.state | filterState }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="申请日期">{{ baseData.createDate&&baseData.createDate.substr(0,10) }}</el-form-item>
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
              <el-form-item label="有效期止">{{ $dateFormat(baseData.effectiveDateEnd) }}</el-form-item>
            </el-col>
          </el-row>
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
        <div style="padding-left: 36px;margin-top: 20px;">
          <el-row>
            <el-col :span="8">
              <el-form-item label="订单金额">
                {{ $toMoney(baseData.contractAvailable) }}
                <span class="unit-number">元</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="折扣">{{ baseData.discount||'-' }}%</el-form-item>
            </el-col>
          </el-row>
          <el-divider class="detail-divider"></el-divider>
          <el-row>
            <el-col :span="8">
              <el-form-item label="应收确定日期">{{ baseData.confirmType==='1'?'按订单签约日期':'按发票登记日期' }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否预付">
                <el-switch :value="baseData.prepaid" disabled></el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider class="detail-divider"></el-divider>
          <template v-if="baseData.prepaid">
            <el-row>
              <el-col :span="8">
                <el-form-item label="预付金额">{{ $toMoney(baseData.payAmount) }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="预付日期">{{ $dateFormat(baseData.payAmountDate) }}</el-form-item>
              </el-col>
            </el-row>
            <el-divider class="detail-divider"></el-divider>
          </template>
          <el-form-item label="发货日期">{{ $dateFormat(baseData.outGoodsDate) }}</el-form-item>
          <el-divider class="detail-divider"></el-divider>
          <el-form-item label="收货地址">{{ baseData.address?baseData.address.split(',')[1]:'-' }}</el-form-item>
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
          <el-divider class="detail-divider"></el-divider>
          <el-form-item label="订单备注">{{ baseData.remark||'-' }}</el-form-item>
          <el-divider class="detail-divider"></el-divider>
          <el-form-item label="订单附件">
            <!-- <template v-if="baseData.uploadFiles.length">
              <a
                v-for="(el,index) in baseData.uploadFiles"
                :key="index"
                :href="el.url"
                class="a-link"
                target="_blank"
                download
              >{{ el.originalName }}</a>
            </template>
            <span v-else>-</span> -->
              <div>
                <yuViewPdf :urls="baseData.uploadFiles" v-if="baseData.uploadFiles&&baseData.uploadFiles.length"></yuViewPdf>
                <span v-else>
                  -
                </span>
              </div>
          </el-form-item>
        </div>
      </el-form>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import EnterpriseFile from "@/components/EnterpriseFile/index.vue";
import { Api_CreditCustomerGetCustomerCredit } from "@/api/creditManagement/creditGranting/customer";
import {
  Api_AgencyMattersGetContractInfo,
  Api_AgencyMattersDeal,
  Api_AgencyMattersReject,
  Api_AgencyMattersGetAuditPage
} from "@/api/creditManagement/todo/index";
import {
  Api_CurrentContractPayment,
  Api_HistoryContractPayment
} from "@/api/creditManagement/contractManagement/contract";
import { Api_PaymentConditionsList } from "@/api/creditManagement/accountsReceivable/paymentManagement.js";
import yuViewPdf from "@/components/yuViewPdf/yuViewPdf.vue";
export default {
  name: "Order",
  components: { EnterpriseFile,yuViewPdf },
  filters: {
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
  props: {
    modelStatus: Boolean,
    row: Object
  },
  data() {
    const createRules = this.$createRules;
    return {
      formData: {
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
      baseLoading: false,
      baseData: {
        // 基础详情数据
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
        transientGoodsInfo: [], // 发货清单
        confirmType: "",
        refContractName: "",
        refContractId: "",
        discount: "",
        prepaid: "",
        payAmountDate: "",
        outGoodsDate: "",
        address: "",
        headDeptName: "",
        createDate: "",
        effectiveDateStart: "",
        effectiveDateEnd: ""
      },
      // companyBaseData: {}, // 信用等级及授信情况
      contractPaymentCurrent: {}, // 当前订单付款履约情况
      contractPaymentHistory: {}, // 历史订单付款履约情况
      signList: [], // 签批信息列表
      isSign: true, // 是否签批
      payConditionIdOptions: []
    };
  },
  created() {
    const { business_key } = this.row;
    Api_PaymentConditionsList({ currentPage: 1, pageSize: 100, name: "", status: 1 }).then(res => {
      this.payConditionIdOptions = res.data;
    });

    // 订单详情
    this.baseLoading = true;
    Api_AgencyMattersGetContractInfo(business_key)
      .then(res => {
        this.baseData = res;
        this.baseLoading = false;
      })
      .catch(e => {
        this.baseLoading = false;
        this.$message.error(e);
      });
  },

  methods: {
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
<style scoped lang="scss">
/deep/ .el-form-item__label {
  padding-right: 0;
}
</style>
