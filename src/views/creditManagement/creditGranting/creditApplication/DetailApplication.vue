<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>授信申请详情</span>
      </h1>
      <div>
        <el-button @click="returnMain" size="small">返回</el-button>
      </div>
    </div>
    <div class="page-content">
      <el-form ref="addForm" :model="addForm" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="授信申请编码">{{ isAdd.apply_no }}</el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="授信对象" prop="customerId">
              <span class="canClick" @click="clientProfileDetail">{{ companyName }}</span>
              <!--<el-select
                                v-model="addForm.customerId"
                                placeholder="请输入申请授信客户名称"
                                filterable
                                remote
                                disabled
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
              </el-select>-->
            </el-form-item>
          </el-col>
          <!--<el-col :span="3" style="padding: 0">
                        <span class="canClick" style="line-height: 30px;" @click="clientProfileDetail">客户档案</span>
          </el-col>-->
          <el-col :span="6">
            <el-form-item label="集团授信" v-if="is_bloc === '1' ? true : false">
              {{ is_bloc === '1'?'是':'否' }}
              <el-switch
                v-if="this.is_bloc === '1'"
                v-model="addForm.isBlocCredit"
                :active-value="true"
                :inactive-value="false"
                active-color="#409eff"
                inactive-color="#dcdfe6"
                disabled
              ></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <EnterpriseFile :enterpriseID="addForm.customerId" :stateID="isAdd.id"></EnterpriseFile>

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
            <!-- 授信申请详情 -->
            <el-row>
              <el-col :span="8">
                <el-form-item label="额度类型" prop="creditType">
                  <el-radio-group v-model="addForm.creditType" disabled>
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
                <el-form-item label="信用账期" prop="overdueDays">{{ addForm.accountDays }} 天</el-form-item>
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
                <el-form-item label="生效日期" prop="effectiveDate">
                  {{ $dateFormat(addForm.effectiveDate)
                  }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="有效日期" prop="expirationDate">
                  {{ $dateFormat(addForm.expirationDate)
                  }}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-divider class="detail-divider"></el-divider>
              </el-col>
              <el-col :span="8" v-if="is_bloc === '1'">
                <el-form-item label="成员额度">
                  <el-radio-group v-model="addForm.quotaType" disabled>
                    <el-radio label="0">共享额度</el-radio>
                    <el-radio label="1">单独分配</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-divider class="detail-divider"></el-divider>
            <div
              v-if="addForm.quotaType === '1' && is_bloc === '1' && addForm.isBlocCredit"
              class="payment-plan"
            >
              <div class="payment-plan-thead">
                <div style="flex: 0 50px" class="payment-plan-th payment-plan-th-color">序号</div>
                <div style="flex: 1" class="payment-plan-th payment-plan-th-color">集团成员名称</div>
                <div style="flex: 1" class="payment-plan-th payment-plan-th-color">分配额度(元)</div>
              </div>
              <div
                class="payment-plan-tbody"
                v-for="(item, index) in addForm.creditCustomers"
                :key="index"
              >
                <div style="flex: 0 50px" class="payment-plan-th">{{ index + 1 }}</div>
                <div style="flex: 1" class="payment-plan-th">{{ item.companyName }}</div>
                <div style="flex: 1" class="payment-plan-th">
                  <el-input v-model="item.creditQuota" disabled class="plan-input"></el-input>
                </div>
              </div>
            </div>
            <div>
              <el-form-item label="申请备注" prop="applyRemark">{{ addForm.applyRemark||'-' }}</el-form-item>
            </div>
          </el-tab-pane>
          <el-tab-pane label="授信建议信息" v-if="applyState !== '1' && applyState !== '2'" name="2">
            <el-col :span="6">
              <el-form-item label="信用等级">{{ formData.gradeName }}</el-form-item>
            </el-col>
            <el-col :span="6">
              <span class="canClick" style="line-height: 30px;" @click="assessment">评估详情</span>
            </el-col>
            <el-col :span="12">
              <el-form-item label="评估日期">{{ formData.evaluationDate }}</el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="授信总额">
                {{ $toMoney(formData.creditQuota, 2) }}&nbsp;
                <span class="unit-number">元</span>
              </el-form-item>
            </el-col>
            <!--<el-col :span="5">
              <el-form-item label="单笔限额">
                {{ $toMoney(formData.singleQuota, 2) }}&nbsp;
                <span class="unit-number">元</span>
              </el-form-item>
            </el-col>-->
            <el-col :span="5">
              <el-form-item label="逾期额度">
                {{ $toMoney(formData.overdueQuota, 2) }}&nbsp;
                <span class="unit-number">元</span>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="逾期天数">
                {{ formData.overdueDays }}&nbsp;
                <span class="unit-number">天</span>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="信用账期">
                {{ formData.accountDays }}&nbsp;
                <span class="unit-number">天</span>
              </el-form-item>
            </el-col>
          </el-tab-pane>
          <el-tab-pane
            label="信用初审详情"
            v-if="applyState === '4' || applyState === '5' || applyState === '6'"
            name="3"
          >
            <!-- 信用初审详情 -->
            <el-row>
              <el-col :span="8">
                <el-form-item label="额度类型" prop="creditType">
                  <el-radio-group v-model="approvalForm.creditType" disabled>
                    <el-radio label="0">固定额度</el-radio>
                    <el-radio label="1">临时额度</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="循环授信">
                  <el-switch
                    v-model="approvalForm.revolvingCreditState"
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
                <el-form-item label="信用额度">{{ approvalForm.creditQuota }}元</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="信用账期" prop="accountDays">{{ approvalForm.accountDays }}天</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-divider class="detail-divider"></el-divider>
              </el-col>
              <el-col :span="8">
                <el-form-item label="单笔限额">{{ approvalForm.singleQuota }}元</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="逾期额度">{{ approvalForm.overdueQuota }}元</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="逾期天数" prop="overdueDays">{{ approvalForm.overdueDays }}天</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-divider class="detail-divider"></el-divider>
              </el-col>
              <el-col :span="8">
                <el-form-item label="生效日期" prop="effectiveDate">{{ approvalForm.effectiveDate }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="有效日期" prop="expirationDate">{{ approvalForm.expirationDate }}</el-form-item>
              </el-col>
              <el-col :span="8" v-if="isAdd">
                <el-form-item label="当前状态">{{ applyState | filterApplyState }}</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-divider class="detail-divider"></el-divider>
              </el-col>
              <el-col :span="8" v-if="is_bloc === '1'">
                <el-form-item label="成员额度">
                  <el-radio-group v-model="approvalForm.quotaType" disabled>
                    <el-radio label="0">共享额度</el-radio>
                    <el-radio label="1">单独分配</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-divider class="detail-divider"></el-divider>
            <div
              v-if="approvalForm.quotaType === '1' && is_bloc === '1' && approvalForm.isBlocCredit"
              class="payment-plan"
            >
              <div class="payment-plan-thead">
                <div style="flex: 0 50px" class="payment-plan-th payment-plan-th-color">序号</div>
                <div style="flex: 1" class="payment-plan-th payment-plan-th-color">集团成员名称</div>
                <div style="flex: 1" class="payment-plan-th payment-plan-th-color">分配额度(元)</div>
              </div>
              <div
                class="payment-plan-tbody"
                v-for="(item, index) in approvalForm.creditCustomers"
                :key="index"
              >
                <div style="flex: 0 50px" class="payment-plan-th">{{ index + 1 }}</div>
                <div style="flex: 1" class="payment-plan-th">{{ item.companyName }}</div>
                <div style="flex: 1" class="payment-plan-th">
                  <el-input v-model="item.creditQuota" disabled class="plan-input"></el-input>
                </div>
              </div>
            </div>
            <div>
              <el-form-item label="初审意见">{{ approvalForm.auditRemarkChu }}</el-form-item>
            </div>
            <el-row>
              <el-col :span="24">
                <el-divider class="detail-divider"></el-divider>
              </el-col>
              <el-col :span="8">
                <el-form-item label="初审人">{{ approvalForm.creatorNameChu }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="初审时间">{{ approvalForm.createDateChu }}</el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="流程审批信息" v-if="applyState === '5' || applyState === '6'" name="4">
            <!--流程审批信息-->
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
    </div>
  </div>
</template>

<script>
import EnterpriseFile from "@/components/EnterpriseFile/index.vue";
import {
  Api_CustomerGetCustomerList,
  Api_ApplicationDetai,
  Api_ApprovalDetail,
  Api_CreditCustomerGetGradeSchemeHis
} from "@/api/creditManagement/creditGranting/customer";
import { dateFormat } from "@/utils/index";
import { Api_AgencyMattersGetAuditPage } from "@/api/creditManagement/todo/index";

export default {
  name: "DetailApplication",
  filters: {
    dateFormat,
    filterStatus (value) {
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
    },
    filterApplyState (value) {
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
    }
  },
  components: { EnterpriseFile },
  props: {
    isAdd: {
      type: Object,
      default () {
        return {};
      }
    }
  },
  data () {
    const curDate = new Date();
    const nextYear = curDate.getFullYear() + 1;
    const nextDate = new Date(new Date().setFullYear(nextYear));
    const nextDay = nextDate.getDate() - 1;
    nextDate.setDate(nextDay);
    return {
      customerIdOptions: [],
      loading: false,
      isShowSituationBox: false,
      isSelected: "0",
      customerId: "",
      companyName: '',
      addForm: {
        customerId: "",
        isBlocCredit: false,
        creditQuota: "",
        singleQuota: "",
        overdueQuota: "",
        overdueDays: "",
        accountDays: '',
        quotaType: "0",
        creditType: "1",
        revolvingCreditState: "1",
        effectiveDate: this.$dateFormat(new Date(), "yyyy-MM-dd"),
        expirationDate: this.$dateFormat(nextDate, "yyyy-MM-dd"),
        applyRemark: "",
        creditCustomers: []
      },
      approvalForm: {
        isBlocCredit: false,
        creditQuota: "",
        singleQuota: "",
        overdueQuota: "",
        overdueDays: "",
        accountDays: '',
        quotaType: "0",
        creditType: "1",
        revolvingCreditState: "1",
        effectiveDate: this.$dateFormat(new Date(), "yyyy-MM-dd"),
        expirationDate: this.$dateFormat(nextDate, "yyyy-MM-dd"),
        creatorNameChu: "",
        createDateChu: "",
        auditRemarkChu: "",
        creditCustomers: []
      },
      // 设置生效日期范围
      setEffectiveDate: {
        disabledDate: time => {
          return time.getTime() < Date.now() - 1000 * 60 * 60 * 24;
        }
      },
      memberListAdd: [],
      companyBaseData: {},
      contractPaymentCurrent: {},
      contractPaymentHistory: {},
      company_id: "",
      is_bloc: "",
      applyState: "",
      editId: "",
      creatorName: "",
      createDate: "",
      operateUser: "",
      createDateZ: "",
      processRemark: "",
      formData: {}
    };
  },
  mounted () {
    if (this.isAdd) {
      // 授信申请详情
      Api_ApplicationDetai(this.isAdd.id).then(res => {
        this.editId = res.id;
        this.company_id = res.companyId;
        this.companyName = res.companyName;
        this.remoteMethod(res.companyName, () => {
          this.addForm.customerId = res.companyId;
          for (let i = 0; i < this.customerIdOptions.length; i++) {
            if (res.companyId === this.customerIdOptions[i].company_id) {
              this.customerId = this.customerIdOptions[i].customer_id;
              this.is_bloc = this.customerIdOptions[i].is_bloc;
            }
          }
        });
        this.addForm.isBlocCredit = res.isBlocCredit;
        this.addForm.creditType = res.creditType;
        this.addForm.creditQuota = this.$toMoney(res.creditQuota, 2);
        this.addForm.singleQuota = this.$toMoney(res.singleQuota, 2);
        this.addForm.overdueQuota = this.$toMoney(res.overdueQuota, 2);
        this.addForm.overdueDays = res.overdueDays;
        this.addForm.accountDays = res.accountDays;
        this.addForm.revolvingCreditState = res.revolvingCreditState;
        this.addForm.effectiveDate = res.effectiveDate;
        this.addForm.expirationDate = res.expirationDate;
        this.addForm.quotaType = res.quotaType;
        this.addForm.applyRemark = res.applyRemark;
        if (res.isBloc) {
          this.is_bloc = "1";
        } else {
          this.is_bloc = "0";
        }
        if (res.members) {
          for (let i = 0; i < res.members.length; i++) {
            this.$set(this.addForm.creditCustomers, i, {
              id: res.members[i].customerId,
              companyName: res.members[i].companyName,
              creditQuota: res.members[i].creditQuota
            })
          }
        } else {
          this.addForm.creditCustomers = [];
        }
        this.applyState = res.applyState;
        // if (res.applyState === "1") {
        //     this.applyState = "待提交";
        // }
        // if (res.applyState === "2") {
        //     this.applyState = "待评估";
        // }
        // if (res.applyState === "3") {
        //     this.applyState = "初审中";
        // }
        // if (res.applyState === "4") {
        //     this.applyState = "待审核";
        // }
        // if (res.applyState === "5") {
        //     this.applyState = "已生效";
        // }
        // if (res.applyState === "6") {
        //     this.applyState = "已驳回";
        // }
        this.creatorName = res.creatorName;
        this.createDate = res.createDate;
      }).catch(res => {
        console.log(res)
        this.$message.error(res);
      });
      // 授信初审详情
      Api_ApprovalDetail(this.isAdd.id).then(res => {
        this.approvalForm.creditType = res.creditType;
        this.approvalForm.isBlocCredit = res.isBlocCredit;
        this.approvalForm.creditQuota = this.$toMoney(res.creditQuota, 2);
        this.approvalForm.singleQuota = this.$toMoney(res.singleQuota, 2);
        this.approvalForm.overdueQuota = this.$toMoney(res.overdueQuota, 2);
        this.approvalForm.overdueDays = res.overdueDays;
        this.approvalForm.accountDays = res.accountDays;
        this.approvalForm.revolvingCreditState = res.revolvingCreditState;
        this.approvalForm.effectiveDate = res.effectiveDate;
        this.approvalForm.expirationDate = res.expirationDate;
        this.approvalForm.quotaType = res.quotaType;
        this.approvalForm.creatorNameChu = res.creatorName;
        this.approvalForm.createDateChu = res.createDate;
        this.approvalForm.auditRemarkChu = res.auditRemark;
        if (res.members) {
          for (let i = 0; i < res.members.length; i++) {
            this.$set(this.approvalForm.creditCustomers, i, {
              id: res.members[i].customerId,
              companyName: res.members[i].companyName,
              creditQuota: res.members[i].creditQuota
            })
          }
        } else {
          this.approvalForm.creditCustomers = [];
        }
      }).catch(res => {
        this.$message.error(res);
      });
      // 获取建议信息
      Api_CreditCustomerGetGradeSchemeHis(this.isAdd.id).then(res => {
        this.formData = res
      }).catch(res => {
        this.$message.error(res)
      });
      Api_AgencyMattersGetAuditPage({
        businessKey: this.isAdd.id
      }).then(res => {
        if (res.length > 0) {
          for (let i = 0; i < res.length; i++) {
            if (res[i].processOperate !== "1") {
              this.operateUser = res[i].operateUser;
              this.createDateZ = res[i].createDate;
              this.processRemark = res[i].processRemark;
            }
          }
        }
      }).catch(res => {
        this.$message.error(res);
      });
    }
  },
  methods: {
    // 返回
    returnMain () {
      this.$emit("edit", false);
    },
    // 获取企业对象
    remoteMethod (query, cd) {
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
    // 授信对象e
    searchObj () {
      this.isShowSituationBox = true;
    },
    // 跳转客户档案
    clientProfileDetail () {
      if (this.addForm.customerId) {
        this.$gotoCustomerDetail(this.addForm.customerId);
      } else {
        this.$alert("请先填写客户！", "提示", { confirmButtonText: "确定", type: "warning" });
      }
    },
    // 挑战评估详情
    assessment () {
      if (this.isAdd.id) {
        this.$gotoAssessmentDetail(this.isAdd.id);
      } else {
        this.$alert("暂无评估记录！", "提示", { confirmButtonText: "确定", type: "warning" });
      }
    }
  }
};
</script>

<style scoped lang="scss">
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
