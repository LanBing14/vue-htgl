<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>客户授信详情</span>
      </h1>
      <div>
        <el-button size="small" @click="back">返回</el-button>
      </div>
    </div>
    <div class="page-content">
      <el-form :model="formData" label-width="90px" class="form">
        <el-row>
          <!--<el-col :span="8">
                            <el-form-item label="客户编号">{{ company.customer_no }}</el-form-item>
          </el-col>-->
          <el-col :span="8">
            <el-form-item label="授信对象">
              <span class="canClick" @click="clientProfileDetail">{{ company.company_name }}</span>
              <span
                v-if="company.is_bloc==='1'"
                style="border: 1px solid rgb(143, 197, 133);border-radius: 5px;padding: 0 5px; margin-left: 4px; font-size:13px; color:rgb(143, 197, 133)"
              >集团</span>
            </el-form-item>
          </el-col>
          <!--<el-col :span="3" style="padding: 0">
                            <span class="canClick" style="line-height: 30px;"
                                  @click="clientProfileDetail">客户档案</span>
          </el-col>-->
          <el-col :span="8" v-if="company.is_bloc==='1'">
            <el-form-item label="集团授信">
              <!-- {{ company.is_bloc === '1'?'是':'否' }} -->
              <el-switch
                :value="company.is_bloc==='1'&&company.is_bloc_credit === '1'"
                :active-value="true"
                :inactive-value="false"
                active-color="#409eff"
                inactive-color="#dcdfe6"
                disabled
              ></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <EnterpriseFile :enterpriseID="company.company_id" :stateID="company.id"></EnterpriseFile>

        <el-tabs value="1" type="border-card">
          <el-tab-pane label="当前授信情况" name="1">
            <div class="sub-title">固定授信</div>
            <el-row style="margin-top: 20px">
              <el-col :span="24">
                <el-form-item label="循环授信">
                  <el-switch
                    v-model="fixedData.revolvingCreditState"
                    active-value="1"
                    inactive-value="0"
                    active-color="#409eff"
                    inactive-color="#dcdfe6"
                    disabled
                  ></el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-divider class="detail-divider"></el-divider>
              </el-col>
              <el-col :span="8">
                <el-form-item label="信用额度">
                  {{ fixedData.creditQuota?$toMoney(fixedData.creditQuota):'-' }}&nbsp;
                  <span
                    class="unit-number"
                  >元</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="信用账期">
                  {{ fixedData.accountDays }}
                  <span class="unit-number">天</span>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-divider class="detail-divider"></el-divider>
              </el-col>
              <el-col :span="8">
                <el-form-item label="单笔限额">
                  {{ $toMoney(fixedData.singleQuota, 2) }}&nbsp;
                  <span class="unit-number">元</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="逾期额度">
                  {{ $toMoney(fixedData.overdueQuota, 2) }}&nbsp;
                  <span class="unit-number">元</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="逾期天数">
                  {{ fixedData.overdueDays }}&nbsp;
                  <span class="unit-number">天</span>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-divider class="detail-divider"></el-divider>
              </el-col>
              <el-col :span="8">
                <el-form-item label="生效日期">
                  {{ fixedData.effectiveDate | dateFormat('yyyy-MM-dd')
                  }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="有效日期">{{ fixedData.expirationDate | dateFormat('yyyy-MM-dd') }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="当前状态">{{ fixedData.creditState | filterStatus }}</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-divider class="detail-divider"></el-divider>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8" v-if="company.is_bloc === '1'&&company.is_bloc_credit === '1'">
                <el-form-item label="成员额度">
                  <el-radio-group v-model="fixedData.quotaType">
                    <el-radio disabled label="0">共享额度</el-radio>
                    <el-radio disabled label="1">单独分配</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item
              label="备注"
            >{{fixedData.auditRemark?fixedData.auditRemark:fixedData.applyRemark}}</el-form-item>
            <div
              v-if="fixedData.quotaType === '1' && company.is_bloc === '1' && company.is_bloc_credit"
              class="payment-plan"
            >
              <div class="payment-plan-thead">
                <div style="flex: 0 50px" class="payment-plan-th payment-plan-th-color">序号</div>
                <div style="flex: 1" class="payment-plan-th payment-plan-th-color">客户编码</div>
                <div style="flex: 1" class="payment-plan-th payment-plan-th-color">客户名称</div>
                <div style="flex: 1" class="payment-plan-th payment-plan-th-color">分配额度(元)</div>
              </div>
              <div class="payment-plan-tbody" v-for="(item, index) in fixedMemberList" :key="index">
                <div style="flex: 0 50px" class="payment-plan-th">{{ index + 1 }}</div>
                <div style="flex: 1" class="payment-plan-th">{{ item.customerNo }}</div>
                <div style="flex: 1" class="payment-plan-th">{{ item.companyName }}</div>
                <div style="flex: 1" class="payment-plan-th">
                  <el-input
                    disabled
                    :value="item.creditQuota?item.creditQuota:'-'"
                    class="plan-input"
                  ></el-input>
                </div>
              </div>
            </div>
            <div class="sub-title">临时授信</div>
            <div style="margin-top: 20px">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="信用额度">
                    {{ notFixedData.creditQuota?$toMoney(notFixedData.creditQuota):'-' }}&nbsp;
                    <span
                      class="unit-number"
                    >元</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="信用账期">
                    {{ notFixedData.accountDays }}
                    <span class="unit-number">天</span>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-divider class="detail-divider"></el-divider>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="单笔限额">
                    {{ $toMoney(notFixedData.singleQuota, 2) }}&nbsp;
                    <span class="unit-number">元</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="逾期额度">
                    {{ $toMoney(notFixedData.overdueQuota, 2) }}&nbsp;
                    <span class="unit-number">元</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="逾期天数">
                    {{ notFixedData.overdueDays }}&nbsp;
                    <span class="unit-number">天</span>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-divider class="detail-divider"></el-divider>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="生效日期"
                  >{{ notFixedData.effectiveDate | dateFormat('yyyy-MM-dd') }}</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="有效日期"
                  >{{ notFixedData.expirationDate | dateFormat('yyyy-MM-dd') }}</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="当前状态">{{ notFixedData.creditState | filterStatus }}</el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-divider class="detail-divider"></el-divider>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8" v-if="company.is_bloc === '1'&&company.is_bloc_credit === '1'">
                  <el-form-item label="成员额度">
                    <el-radio-group v-model="notFixedData.quotaType">
                      <el-radio disabled label="0">共享额度</el-radio>
                      <el-radio disabled label="1">单独分配</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item
                label="备注"
              >{{notFixedData.auditRemark?notFixedData.auditRemark:notFixedData.applyRemark}}</el-form-item>
              <div
                v-if="notFixedData.quotaType === '1' && company.is_bloc === '1'"
                class="payment-plan"
              >
                <div class="payment-plan-thead">
                  <div style="flex: 0 50px" class="payment-plan-th payment-plan-th-color">序号</div>
                  <div style="flex: 1" class="payment-plan-th payment-plan-th-color">客户编码</div>
                  <div style="flex: 1" class="payment-plan-th payment-plan-th-color">客户名称</div>
                  <div style="flex: 1" class="payment-plan-th payment-plan-th-color">分配额度(元)</div>
                </div>
                <div
                  class="payment-plan-tbody"
                  v-for="(item, index) in notFixedMemberList"
                  :key="index"
                >
                  <div style="flex: 0 50px" class="payment-plan-th">{{ index + 1 }}</div>
                  <div style="flex: 1" class="payment-plan-th">{{ item.customerNo }}</div>
                  <div style="flex: 1" class="payment-plan-th">{{ item.companyName }}</div>
                  <div style="flex: 1" class="payment-plan-th">
                    <el-input
                      disabled
                      :value="item.creditQuota?item.creditQuota:'-'"
                      class="plan-input"
                    ></el-input>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="用信情况" name="2">
            <TableWrapper
              ref="tableCreaditUse"
              :query="{}"
              :data="tableListAccounts"
              :columns="creditUseCol"
            />
          </el-tab-pane>
          <el-tab-pane label="用信明细" name="3">
            <TableWrapper
              ref="tableDetai"
              :query="queryDetail"
              :fetchDataFn="Api_GetDetail"
              :columns="tableListDetail"
            />
          </el-tab-pane>
          <el-tab-pane label="授信历史" name="4">
            <TableWrapper ref="historytable" :data="approvalList" :columns="historyTableCol" />
            <!--<TableWrapper
                            ref="historytable"
                            :fetchDataFn="Api_CreditCustomerGetCreditPage"
                            :query="historyListQuery"
                            :columns="historyTableCol"
            />-->
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
  </div>
</template>

<script type="text/jsx">
import EnterpriseFile from "@/components/EnterpriseFile/index.vue";
import { merge } from "lodash";
import {
  Api_CreditCustomerGetLatestRecord,
  Api_NewCreditCustomerGetLatestRecord,
  Api_CreditCustomerGetCreditPage,
  Api_ApprovalDetail,
  Api_GetHistory,
  Api_GetDetail,
  Api_GetAccounts,
} from "@/api/creditManagement/creditGranting/customer";
import { dateFormat } from "@/utils/index";

export default {
  name: "Detail",
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
  },
  components: { EnterpriseFile },
  props: {
    company: {
      type: Object,
      default: () => ({
        id: "",
        customer_no: "", // 客户编码
        company_id: "", // 企业id
        company_name: "", // 企业名称
        customer_id: "",
        is_bloc: "", // 是否为集团 0:不是 1:是
        is_bloc_credit: "", // 集团授信开关
      }),
    },
  },
  data () {
    const curDate = new Date();
    const nextYear = curDate.getFullYear() + 1;
    const nextDate = new Date(new Date().setFullYear(nextYear));
    const nextDay = nextDate.getDate() - 1;
    nextDate.setDate(nextDay);
    return {
      // Api_CreditCustomerGetCreditPage, // 历史授信列表
      Api_GetDetail,
      fixedData: {}, // 固定授信
      notFixedData: {}, // 临时授信
      formData: {},
      historyTableCol: [
        { key: "creditDays", label: "授信期限" },
        {
          key: "creditQuota",
          label: "信用额度(元)",
          render: (h, data) => {
            return this.$toMoney(data, 2);
          },
        },
        {
          key: "singleQuota",
          label: "单笔限额(元)",
          render: (h, data) => {
            return this.$toMoney(data, 2);
          },
        },
        {
          key: "overdueQuota",
          label: "逾期额度(元)",
          render: (h, data) => {
            return this.$toMoney(data, 2);
          },
        },
        {
          key: "overdueDays",
          label: "逾期天数(天)",
          render: (h, data) => {
            if (data) {
              return data;
            } else {
              return "-";
            }
          },
        },
        {
          key: "revolvingCreditState",
          label: "循环授信",
          render: (h, data) => {
            return data === "0" ? "禁用" : "启用";
          },
        },
        {
          key: "creditState",
          label: "当前状态",
          render: (h, data) => {
            if (data === "0") {
              return "待审核";
            } else if (data === "1") {
              return "生效";
            } else if (data === "2") {
              return "冻结";
            } else if (data === "3") {
              return "失效";
            } else if (data === "4") {
              return "拒绝";
            } else {
              return "-";
            }
          },
        },
      ],
      historyListQuery: {},
      fixedMemberList: [], // 固定
      notFixedMemberList: [], // 临时
      queryDetail: {},
      tableListDetail: [
        { key: "companyName", label: "合同签约客户名称" },
        {
          key: "contractNo",
          label: "合同编码/名称",
          render: (h, data, row) => {
            return data + "/" + row.contractName;
          },
        },
        {
          key: "type",
          label: "类型",
          render: (h, data) => {
            let newData = "";
            if (data === "0") {
              newData = "合同审核冻结";
            }
            if (data === "1") {
              newData = "合同审核释放";
            }
            if (data === "2") {
              newData = "合同签约占用";
            }
            if (data === "3") {
              newData = "合同变更释放";
            }
            if (data === "4") {
              newData = "合同变更占用";
            }
            if (data === "5") {
              newData = "收款核销释放";
            }
            if (data === "6") {
              newData = "交易取消释放";
            }
            if (data === "7") {
              newData = "履约完成释放";
            }
            return newData;
          },
        },
        {
          key: "quota",
          label: "占用/释放额度(元)",
          align: "right",
          render: (h, data) => {
            return this.$toMoney(data, 2);
          },
        },
        {
          key: "totalQuota",
          label: "当前占用总额(元)",
          align: "right",
          render: (h, data) => {
            return this.$toMoney(data, 2);
          },
        },
        { key: "createDate", label: "占用/释放时间" },
      ],
      tableListAccounts: [],
      approvalList: [],
      creditUseCol: [
        { key: "companyName", label: "客户名称" },
        { key: "fixedQuota", label: "授信总额(元)", align: "right" },
        { key: "occupyQuota", label: "已占用额度(元)", align: "right" },
        { key: "oweMoney", label: "应收未收金额(元)", align: "right" },
        { key: "overdueMoney", label: "逾期金额(元)", align: "right" },
      ],
    };
  },
  mounted () {
    this.getFixed();
    this.getNotFixed();
    // this.getContractPaymentCurrent();
    // this.getContractPaymentHistory();
    this.getDetail();
    this.getAccounts();
    this.getHis();
  },
  methods: {
    // 获取“固定授信”
    getFixed () {
      Api_NewCreditCustomerGetLatestRecord(this.company.id, "0").then((res) => {
        this.fixedData = res || {};
        // if (res.members) {
        //   for (let i = 0; i < res.members.length; i++) {
        //     res.members[i].creditQuota = this.$turnMoney(res.members[i].creditQuota, false);
        //   }
        // }
        this.$nextTick(() => {
          this.fixedMemberList = res ? res.members : [];
        });
      });
    },
    // 获取“临时授信”
    getNotFixed () {
      Api_NewCreditCustomerGetLatestRecord(this.company.id, "1").then((res) => {
        this.notFixedData = res || {};
        // if (res.members) {
        //   for (let i = 0; i < res.members.length; i++) {
        //     res.members[i].creditQuota = this.$turnMoney(res.members[i].creditQuota, false);
        //   }
        // }
        this.$nextTick(() => {
          this.notFixedMemberList = res ? res.members : [];
        });
      });
    },
    // 授信额度占用/释放明细
    getDetail () {
      this.queryDetail = {
        customerId: this.company.customer_id,
      };
      this.$nextTick(() => {
        this.$refs.tableDetai.fetchData();
      });
    },
    // 获取授信历史
    getHis () {
      Api_GetHistory(this.company.company_id)
        .then((res) => {
          this.approvalList = res;
        })
        .catch((res) => {
          console.log(res);
          // this.$message.error(res);
        });
      // this.historyListQuery = {
      //     customerId: this.company.customer_id
      // };
      // this.$nextTick(() => {
      //     this.$refs.historytable.fetchData();
      // });
    },
    // 授信额度占用/释放明细
    getAccounts () {
      Api_GetAccounts(this.company.customer_id, { isBlocCredit: this.company.is_bloc_credit }).then((res) => {
        if (res.length > 0) {
          for (let i = 0; i < res.length; i++) {
            res[i].fixedQuota = this.$toMoney(res[i].fixedQuota, 2);
            res[i].occupyQuota = this.$toMoney(res[i].occupyQuota, 2);
            res[i].oweMoney = this.$toMoney(res[i].oweMoney, 2);
            res[i].overdueMoney = this.$toMoney(res[i].overdueMoney, 2);
          }
        }
        this.$nextTick(() => {
          this.tableListAccounts = res;
        });
      });
    },
    back () {
      this.$emit("edit", false);
    },
    // 跳转客户档案
    clientProfileDetail () {
      if (this.company.company_id) {
        this.$gotoCustomerDetail(this.company.company_id);
      } else {
        this.$alert("请先填写客户！", "提示", { confirmButtonText: "确定", type: "warning" });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.area {
  background-color: rgba(51, 153, 230, 0.2);
  margin: 0 0 22px -28px;
  padding: 10px 0px 10px 36px;

  & > .el-col {
    position: relative;
  }

  .el-form-item {
    margin-bottom: 0;

    /deep/ .el-form-item__label {
      font-size: 12px;
      padding-right: 0;
    }
  }

  .area-btn {
    position: absolute;
    left: 50%;
    font-size: 16px;
    line-height: 1.5;
    text-align: left;
    top: 50%;
    transform: translate(-50%, -50%);
  }
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

.sub-title {
  margin-top: 0;
}
</style>
