<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>{{ isToDo ? '授信签批' : '授信签批详情' }}</span>
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
          <el-col :span="8">
            <el-form-item label="授信对象" prop="customerId">
              <span class="canClick" @click="clientProfileDetail">{{ companyName }}</span>
              <span
                v-if="is_bloc==='1'"
                style="border: 1px solid rgb(143, 197, 133);border-radius: 5px;padding: 0 5px; margin-left: 4px; font-size:13px; color:rgb(143, 197, 133)"
              >集团</span>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="集团授信" v-if="is_bloc === '1' ? true : false">
              <!-- {{ is_bloc === '1'?'是':'否' }} -->
              <el-switch
                v-if="is_bloc === '1'"
                v-model="detailForm.isBlocCredit"
                :active-value="true"
                :inactive-value="false"
                active-color="#409eff"
                inactive-color="#dcdfe6"
                disabled
              ></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <EnterpriseFile :enterpriseID="detailForm.customerId" :stateID="isAdd"></EnterpriseFile>

        <el-row>
          <el-col :span="6">
            <el-form-item label="当前状态">{{ applyState | filterApplyState }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请人">{{ creatorName }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="申请时间">{{ createDate }}</el-form-item>
          </el-col>
        </el-row>
        <el-tabs value="1" type="border-card">
          <el-tab-pane label="授信申请详情" name="1">
            <el-row>
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
                    v-model="detailForm.revolvingCreditState"
                    active-value="1"
                    inactive-value="0"
                    disabled
                    active-color="#409eff"
                    inactive-color="#dcdfe6"
                  ></el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-divider class="detail-divider"></el-divider>
              </el-col>
              <el-col :span="8">
                <el-form-item label="信用额度">{{ detailForm.creditQuota }} 元</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="信用账期">{{ detailForm.accountDays }} 天</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-divider class="detail-divider"></el-divider>
              </el-col>
              <el-col :span="8">
                <el-form-item label="单笔限额">{{ detailForm.singleQuota }} 元</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="逾期额度">{{ detailForm.overdueQuota }} 元</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="逾期天数">{{ detailForm.overdueDays }} 天</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-divider class="detail-divider"></el-divider>
              </el-col>
              <el-col :span="8">
                <el-form-item label="生效日期">
                  {{
                  detailForm.effectiveDate?$dateFormat(detailForm.effectiveDate):'-' }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="有效日期">
                  {{
                  detailForm.expirationDate?$dateFormat(detailForm.expirationDate):'-' }}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-divider class="detail-divider"></el-divider>
              </el-col>
              <el-col :span="8" v-if="is_bloc === '1'&&detailForm.isBlocCredit">
                <el-form-item label="成员额度">
                  <el-radio-group v-model="detailForm.quotaType" disabled>
                    <el-radio label="0">共享额度</el-radio>
                    <el-radio label="1">单独分配</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="备注">{{detailForm.auditRemark?detailForm.auditRemark:detailForm.applyRemark}}</el-form-item>
            <div
              v-if="detailForm.quotaType === '1' && is_bloc === '1' && detailForm.isBlocCredit"
              class="payment-plan"
            >
              <div class="payment-plan-thead">
                <div style="flex: 0 50px" class="payment-plan-th payment-plan-th-color">序号</div>
                <div style="flex: 1" class="payment-plan-th payment-plan-th-color">集团成员名称</div>
                <div style="flex: 1" class="payment-plan-th payment-plan-th-color">分配额度(元)</div>
              </div>
              <div class="payment-plan-tbody" v-for="(item, index) in memberList" :key="index">
                <div style="flex: 0 50px" class="payment-plan-th">{{ index + 1 }}</div>
                <div style="flex: 1" class="payment-plan-th">{{ item.companyName }}</div>
                <div style="flex: 1" class="payment-plan-th">
                  {{item.creditQuota?$toMoney(item.creditQuota):'-'}}
                  <!-- <el-input v-model="item.creditQuota" disabled class="plan-input"></el-input> -->
                </div>
              </div>
            </div>
            <div v-if="applyType !== '0'">
              <div>
                <el-form-item label="申请备注">{{ detailForm.applyRemark }}</el-form-item>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="授信建议信息" v-if="!isSales && (applyState !== '1' || applyState !== '2')" name="2">
            <el-row>
              <el-col :span="6">
                <el-form-item label="信用等级">{{ gradeName?gradeName:'-' }}</el-form-item>
              </el-col>
              <el-col :span="6">
                <span class="canClick" style="line-height: 30px;" @click="assessment">评估详情</span>
              </el-col>
              <el-col :span="12">
                <el-form-item label="评估日期">{{ evaluationDate?evaluationDate:'-' }}</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-divider class="detail-divider"></el-divider>
              </el-col>
              <el-col :span="5">
                <el-form-item label="信用额度">{{ $toMoney(creditQuota, 2) }} 元</el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="信用账期">{{ accountDays }} 天</el-form-item>
              </el-col>
              <!--<el-col :span="5">
                <el-form-item label="单笔限额">{{ $toMoney(singleQuota, 2) }} 元</el-form-item>
              </el-col>-->
              <el-col :span="5">
                <el-form-item label="逾期额度">{{ $toMoney(overdueQuota, 2) }} 元</el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="逾期天数">{{ overdueDays }} 天</el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane
            label="信用初审详情"
            v-if="!isSales && (applyState === '4' || applyState === '5' || applyState === '6')"
            name="3"
          >
            <el-row>
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
                    disabled
                    active-color="#409eff"
                    inactive-color="#dcdfe6"
                  ></el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-divider class="detail-divider"></el-divider>
              </el-col>
              <el-col :span="8">
                <el-form-item label="信用额度" prop="creditQuota">{{ addForm.creditQuota }} 元</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="信用账期">{{ addForm.accountDays }} 天</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-divider class="detail-divider"></el-divider>
              </el-col>
              <el-col :span="8">
                <el-form-item label="单笔限额" prop="singleQuota">{{ addForm.singleQuota }} 元</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="逾期额度" prop="overdueQuota">{{ addForm.overdueQuota }} 元</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="逾期天数" prop="overdueDays">{{ addForm.overdueDays }} 天</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-divider class="detail-divider"></el-divider>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="生效日期"
                  prop="effectiveDate"
                >{{ addForm.effectiveDate?$dateFormat(addForm.effectiveDate):'-' }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="有效日期"
                  prop="expirationDate"
                >{{ addForm.expirationDate?$dateFormat(addForm.expirationDate):'-' }}</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-divider class="detail-divider"></el-divider>
              </el-col>
              <el-col :span="8" v-if="is_bloc === '1'&&detailForm.isBlocCredit">
                <el-form-item label="成员额度">
                  <el-radio-group v-model="addForm.quotaType" disabled>
                    <el-radio label="0">共享额度</el-radio>
                    <el-radio label="1">单独分配</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <div
              v-if="addForm.quotaType === '1' && is_bloc === '1' && addForm.isBlocCredit"
              class="payment-plan"
            >
              <div class="payment-plan-thead">
                <div style="flex: 0 50px" class="payment-plan-th payment-plan-th-color">序号</div>
                <div style="flex: 1" class="payment-plan-th payment-plan-th-color">集团成员名称</div>
                <div style="flex: 1" class="payment-plan-th payment-plan-th-color">分配额度(元)</div>
              </div>
              <div class="payment-plan-tbody" v-for="(item, index) in memberListAdd" :key="index">
                <div style="flex: 0 50px" class="payment-plan-th">{{ index + 1 }}</div>
                <div style="flex: 1" class="payment-plan-th">{{ item.companyName }}</div>
                <div style="flex: 1" class="payment-plan-th">
                  {{ item.creditQuota?$toMoney(item.creditQuota):'-' }}
                  <!-- <el-input v-model="item.creditQuota" disabled class="plan-input"></el-input> -->
                </div>
              </div>
            </div>
            <el-row>
              <el-col :span="8">
                <el-form-item label="初审人" prop="expirationDate">{{ creatorNameChu }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="初审时间" prop="expirationDate">{{ createDateChu }}</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-divider class="detail-divider"></el-divider>
              </el-col>
            </el-row>
            <div>
              <el-form-item label="初审意见" prop="auditRemark">{{ addForm.auditRemark }}</el-form-item>
            </div>
          </el-tab-pane>
          <el-tab-pane label="流程审批信息" name="4" v-if="!isSales && (applyState === '5' || applyState === '6')">
            <el-row>
              <el-col :span="8">
                <el-form-item label="申请状态">{{ applyState | filterApplyState }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="终审人">{{ operateUser }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="审批时间">{{ createDateZ }}</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-divider class="detail-divider"></el-divider>
              </el-col>
              <el-col :span="8">
                <el-form-item label="审批意见">{{ processRemark }}</el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <slot></slot>
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
  Api_ApprovalDetail,
  Api_CreditCustomerGetGradeSchemeHis,
  Api_GetCreditHis,
} from "@/api/creditManagement/creditGranting/customer";
import { dateFormat } from "@/utils/index";
import { Api_AgencyMattersGetAuditPage } from "@/api/creditManagement/todo/index";

export default {
  name: "Detail",
  filters: {
    dateFormat,
    filterStatus(value) {
      return value === "0"
        ? "待审核"
        : value === "1"
        ? "正常"
        : value === "2"
        ? "冻结"
        : value === "3"
        ? "失效"
        : "-";
    },
    filterApplyState(value) {
      switch (value) {
        case "1":
          return "待提交";
        case "2":
          return "待评估";
        case "3":
          return "初审中";
        case "4":
          return "待审核";
        case "5":
          return "已生效";
        case "6":
          return "已驳回";
      }
    },
  },
  components: { EnterpriseFile },
  props: {
    isToDo: {
      type: Boolean,
      default: false,
    },
    isAdd: {
      type: String,
      default: "",
    },
    row: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    const curDate = new Date();
    const nextYear = curDate.getFullYear() + 1;
    const nextDate = new Date(new Date().setFullYear(nextYear));
    const nextDay = nextDate.getDate() - 1;
    nextDate.setDate(nextDay);
    return {
      id: "",
      isSales: false,
      customerIdOptions: [],
      loading: false,
      isSelected: "0",
      customerId: "",
      companyName: "",
      applyNo: "",
      addForm: {
        isBlocCredit: false,
        creditQuota: "",
        singleQuota: "",
        overdueQuota: "",
        overdueDays: "",
        accountDays: "",
        quotaType: "0",
        revolvingCreditState: "1",
        effectiveDate: this.$dateFormat(new Date(), "yyyy-MM-dd"),
        expirationDate: this.$dateFormat(nextDate, "yyyy-MM-dd"),
        auditRemark: "",
      },
      detailForm: {
        isBlocCredit: false,
        customerId: "",
        creditQuota: "",
        singleQuota: "",
        overdueQuota: "",
        overdueDays: "",
        accountDays: "",
        quotaType: "0",
        creditType: "1",
        revolvingCreditState: "1",
        effectiveDate: this.$dateFormat(new Date(), "yyyy-MM-dd"),
        expirationDate: this.$dateFormat(nextDate, "yyyy-MM-dd"),
        applyRemark: "",
      },
      // 设置生效日期范围
      setEffectiveDate: {
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 1000 * 60 * 60 * 24;
        },
      },
      memberListAdd: [],
      memberList: [],
      companyBaseData: {},
      contractPaymentCurrent: {},
      contractPaymentHistory: {},
      company_id: "",
      is_bloc: "",
      applyState: "",
      creatorName: "",
      createDate: "",
      creatorNameChu: "",
      createDateChu: "",
      rules: {
        // customerId: [{
        //     required: true,
        //     message: '授信对象'
        // }],
        // creditType: [{
        //     required: true,
        //     message: '额度类型'
        // }],
        // creditQuota: [
        //     {
        //         required: true,
        //         message: "信用额度"
        //     },
        //     {
        //         pattern: /^\d{1,9}$|^\d{1,9}\.\d{1,4}$/,
        //         message: "信用额度必须为整数或小数，且整数部分不超过9位，小数部分不超过4位"
        //     }
        // ],
        // singleQuota: [
        //     {
        //         required: true,
        //         message: "单笔限额"
        //     },
        //     {
        //         pattern: /^\d{1,9}$|^\d{1,9}\.\d{1,4}$/,
        //         message: "单笔限额必须为整数或小数，且整数部分不超过9位，小数部分不超过4位"
        //     }
        // ],
        // overdueQuota: [
        //     {
        //         required: true,
        //         message: "逾期额度必填"
        //     },
        //     {
        //         pattern: /^\d{1,9}$|^\d{1,9}\.\d{1,4}$/,
        //         message: "单笔限额必须为整数或小数，且整数部分不超过9位，小数部分不超过4位"
        //     }
        // ],
        // overdueDays: [
        //     {
        //         required: true,
        //         message: "逾期天数必填"
        //     }
        // ],
        // effectiveDate: [
        //     {
        //         required: true,
        //         message: "生效日期必填"
        //     }
        // ],
        // expirationDate: [
        //     {
        //         required: true,
        //         message: "有效日期必填"
        //     }
        // ],
        // auditRemark: [
        //     {
        //         required: true,
        //         max: 200,
        //         message: "逾期额度必填,长度不超过200"
        //     }
        // ]
      },
      modelGradeHisId: "",
      gradeName: "",
      evaluationDate: "",
      creditQuota: "",
      singleQuota: "",
      overdueQuota: "",
      overdueDays: "",
      accountDays: "",
      applyType: "",
      operateUser: "",
      createDateZ: "",
      processRemark: "",
    };
  },
  mounted() {
    let newId = "";
    if (this.row.business_key) {
      newId = this.row.business_key;
    }
    // 授信申请详情
    if (this.isAdd) {
      newId = this.isAdd;
    }
    Api_ApplicationDetai(newId)
      .then((res) => {
        if (res.applyType === "0") {
          this.isSales = true;
        } else {
          this.isSales = false;
        }
        this.id = res.id;
        this.applyType = res.applyType;
        this.applyNo = res.applyNo;
        this.company_id = res.companyId;
        this.companyName = res.companyName;
        this.remoteMethod(res.companyName, () => {
          this.detailForm.customerId = res.companyId;
          for (let i = 0; i < this.customerIdOptions.length; i++) {
            if (res.companyId === this.customerIdOptions[i].company_id) {
              this.customerId = this.customerIdOptions[i].customer_id;
              this.is_bloc = this.customerIdOptions[i].is_bloc;
            }
          }
          // this.$nextTick(() => {
          // 获取集团成员列表
          // Api_getMemberDetai(this.customerId).then(res => {
          //   if (res) {
          //     this.memberListAdd = res;
          //   }
          // });
          // });
        });
        this.detailForm.isBlocCredit = res.isBlocCredit;
        this.detailForm.creditType = res.creditType;
        this.detailForm.creditQuota = this.$toMoney(res.creditQuota, 2);
        this.detailForm.singleQuota = this.$toMoney(res.singleQuota, 2);
        this.detailForm.overdueQuota = this.$toMoney(res.overdueQuota, 2);
        this.detailForm.overdueDays = res.overdueDays;
        this.detailForm.accountDays = res.accountDays;
        this.detailForm.revolvingCreditState = res.revolvingCreditState;
        this.detailForm.effectiveDate = res.effectiveDate;
        this.detailForm.expirationDate = res.expirationDate;
        this.detailForm.quotaType = res.quotaType;
        this.detailForm.applyRemark = res.applyRemark;
        if (res.isBloc) {
          this.is_bloc = "1";
        } else {
          this.is_bloc = "0";
        }
        if (res.members) {
          for (let i = 0; i < res.members.length; i++) {
            this.memberList[i] = {};
            this.memberList[i].id = res.members[i].customerId;
            this.memberList[i].companyName = res.members[i].companyName;
            this.memberList[i].creditQuota = res.members[i].creditQuota;
          }
        } else {
          this.memberList = [];
        }
        this.applyState = res.applyState;
        this.creatorName = res.creatorName;
        this.createDate = res.createDate;
        this.$nextTick(() => {
          // 根据企业信用等级获取授信策略方案等级配置
          Api_CreditCustomerGetGradeSchemeHis(res.id).then((res) => {
            this.modelGradeHisId = res.modelGradeHisId;
            this.gradeName = res.gradeName;
            this.evaluationDate = res.evaluationDate;
            this.creditQuota = res.creditQuota;
            this.singleQuota = res.singleQuota;
            this.overdueQuota = res.overdueQuota;
            this.overdueDays = res.overdueDays;
            this.accountDays = res.accountDays;
          });
          Api_ApprovalDetail(newId)
            .then((res) => {
              this.addForm.isBlocCredit = res.isBlocCredit;
              this.addForm.creditQuota = this.$toMoney(res.creditQuota, 2);
              this.addForm.singleQuota = this.$toMoney(res.singleQuota, 2);
              this.addForm.overdueQuota = this.$toMoney(res.overdueQuota, 2);
              this.addForm.overdueDays = res.overdueDays;
              this.addForm.accountDays = res.accountDays;
              this.addForm.revolvingCreditState = res.revolvingCreditState;
              this.addForm.effectiveDate = res.effectiveDate;
              this.addForm.expirationDate = res.expirationDate;
              this.addForm.quotaType = res.quotaType;
              this.addForm.auditRemark = res.auditRemark;
              if (res.members) {
                for (let i = 0; i < res.members.length; i++) {
                  this.memberListAdd[i] = {};
                  this.memberListAdd[i].id = res.members[i].customerId;
                  this.memberListAdd[i].companyName = res.members[i].companyName;
                  this.memberListAdd[i].creditQuota = res.members[i].creditQuota;
                }
              } else {
                this.memberListAdd = [];
              }
              this.creatorNameChu = res.creatorName;
              this.createDateChu = res.createDate;
            })
            .catch((res) => {
              this.$message.error(res);
            });
        });
      })
      .catch((res) => {
        this.$message.error(res);
      });
    Api_AgencyMattersGetAuditPage({
      businessKey: newId,
    })
      .then((res) => {
        if (res.length > 0) {
          for (let i = 0; i < res.length; i++) {
            if (res[i].processOperate !== "1") {
              this.operateUser = res[i].operateUser;
              this.createDateZ = res[i].createDate;
              this.processRemark = res[i].processRemark;
            }
          }
        }
      })
      .catch((res) => {
        this.$message.error(res);
      });
  },
  methods: {
    // 返回
    returnMain() {
      this.$emit("edit", false);
    },
    // 获取企业对象
    remoteMethod(query, cd) {
      if (query !== "") {
        this.loading = true;
        Api_CustomerGetCustomerList(query).then((res) => {
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
    // 授信对象信息
    searchObj(value) {
      this.company_id = value;
      for (let i = 0; i < this.customerIdOptions.length; i++) {
        if (value === this.customerIdOptions[i].company_id) {
          this.customerId = this.customerIdOptions[i].customer_id;
          this.is_bloc = this.customerIdOptions[i].is_bloc;
        }
      }
    },
    // 实时发起时初审时终审时
    isChange(val) {
      this.isSelected = val;
      let newId = "";
      if (this.row.business_key) {
        newId = this.row.business_key;
      }
      // 授信申请详情
      if (this.isAdd) {
        newId = this.isAdd;
      }
    },
    // 跳转客户档案
    clientProfileDetail() {
      if (this.detailForm.customerId) {
        this.$gotoCustomerDetail(this.detailForm.customerId);
      } else {
        this.$alert("请先填写客户！", "提示", { confirmButtonText: "确定", type: "warning" });
      }
    },
    // 挑战评估详情
    assessment() {
      let newId = "";
      if (this.row.business_key) {
        newId = this.row.business_key;
      }
      // 授信申请详情
      if (this.isAdd) {
        newId = this.isAdd;
      }
      if (newId) {
        this.$gotoAssessmentDetail(newId);
      } else {
        this.$alert("暂无评估记录！", "提示", { confirmButtonText: "确定", type: "warning" });
      }
    },
  },
};
</script>

<style scoped lang="scss">
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
  width: 100% !important;
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

.isSelected {
  color: #4a9df2;
}
</style>
