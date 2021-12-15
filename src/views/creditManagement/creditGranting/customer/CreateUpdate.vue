<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>新增申请</span>
      </h1>
      <div>
        <el-button @click="returnMain" size="small">返回</el-button>
      </div>
    </div>
    <div class="page-content">
      <el-form ref="addForm" :model="addForm" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="8" style="padding-right: 0!important;">
            <el-form-item label="授信对象" prop="customerId">
              <el-select
                v-model="addForm.customerId"
                placeholder="请输入申请授信客户名称"
                filterable
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
                <template slot="empty">
                  <div v-if="loading" style="text-align: center;padding: 28px 10px">加载中</div>
                  <div v-else style="text-align: center;padding: 28px 10px">
                    <span>查询不到相关客户，请</span>
                    <span style="color: #00BFF3;cursor: pointer" @click="noText">添加客户</span>
                  </div>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3" style="padding: 0" v-if="addForm.customerId">
            <span class="canClick" style="line-height: 30px;" @click="clientProfileDetail">客户档案</span>
          </el-col>
          <el-col :span="8">
            <el-form-item label="集团授信" v-if="is_bloc === '1' ? true : false">
              <!-- {{ is_bloc === '1'?'是':'否' }} -->
              <el-switch
                v-if="is_bloc === '1'"
                v-model="addForm.isBlocCredit"
                :active-value="true"
                :inactive-value="false"
                active-color="#409eff"
                inactive-color="#dcdfe6"
              ></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <EnterpriseFile :enterpriseID="addForm.customerId" :stateID="row.id"></EnterpriseFile>
        <el-row>
          <el-col :span="8">
            <el-form-item label="额度类型" prop="creditType">
              <el-radio-group v-model="addForm.creditType" @change="showCycle">
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
                :disabled="isCycle"
              ></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="信用额度" prop="creditQuota">
              <el-input v-model="addForm.creditQuota" placeholder="请输入信用额度">
                <template slot="append">元(RMB)</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="信用账期" prop="accountDays">
              <el-input v-model.number="addForm.accountDays" placeholder="请输入信用账期">
                <template slot="append">天</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="单笔限额" prop="singleQuota">
              <el-input v-model="addForm.singleQuota" placeholder="请输入单笔限额">
                <template slot="append">元(RMB)</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="逾期额度" prop="overdueQuota">
              <el-input v-model="addForm.overdueQuota" placeholder="请输入逾期额度">
                <template slot="append">元(RMB)</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="逾期天数" prop="overdueDays">
              <el-input v-model.number="addForm.overdueDays" placeholder="请输入逾期天数">
                <template slot="append">天</template>
              </el-input>
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
                style="width: 100%"
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
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" v-if="is_bloc === '1'&&addForm.isBlocCredit">
            <el-form-item label="成员额度">
              <el-radio-group v-model="addForm.quotaType">
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
          <div
            class="payment-plan-tbody"
            v-for="(item, index) in addForm.creditCustomers"
            :key="index"
          >
            <div style="flex: 0 50px" class="payment-plan-th">{{ index + 1 }}</div>
            <div style="flex: 1" class="payment-plan-th">{{ item.companyName }}</div>
            <div style="flex: 1" class="payment-plan-th">
              <el-form-item
                :prop="'creditCustomers.'+index+'.creditQuota'"
                :rules="[{required:true,message:'请输入金额'}, {pattern: /((^[1-9]\d*)|^0)(\.\d{1,2}){0,1}$/,message: '金额必须为整数或小数，且整数部分不超过9位，小数部分不超过2位'}]"
              >
                <el-input v-model="item.creditQuota" class="plan-input"></el-input>
              </el-form-item>
            </div>
          </div>
        </div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="申请备注" prop="applyRemark">
              <el-input
                type="textarea"
                :rows="3"
                placeholder="请输入申请授信额度描述信息"
                v-model="addForm.applyRemark"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="form-bottom-btns size-btn-change">
        <el-button type="success" @click="saveForm">保存</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </div>
      <AddBusiness ref="ref_addBusiness" @getId="getId"></AddBusiness>
    </div>
  </div>
</template>

<script>
import EnterpriseFile from "@/components/EnterpriseFile/index.vue";
import AddBusiness from "../creditApplication/AddBusiness.vue";
import {
  Api_CustomerGetCustomerList,
  Api_getMemberDetai,
  Api_CreditCustomerCheckCredit,
  Api_CreditCustomerSaveCreditCustomer,
  Api_CreditCustomerSubCreditCustomer,
  Api_getCreditDetai,
  Api_isCycle,
} from "@/api/creditManagement/creditGranting/customer";
import { dateFormat } from "@/utils/index";
import { merge } from "lodash";

export default {
  name: "CreateUpdate",
  components: { EnterpriseFile, AddBusiness },
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
  props: {
    row: {
      type: Object,
      default () {
        return {};
      },
    },
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
      addForm: {
        customerId: "",
        isBlocCredit: false,
        creditQuota: "",
        singleQuota: "",
        overdueQuota: "",
        overdueDays: "",
        accountDays: "",
        quotaType: "0",
        creditType: "0",
        revolvingCreditState: "1",
        effectiveDate: this.$dateFormat(new Date(), "yyyy-MM-dd"),
        expirationDate: this.$dateFormat(nextDate, "yyyy-MM-dd"),
        applyRemark: "",
        creditCustomers: [],
      },
      // 设置生效日期范围
      setEffectiveDate: {
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 1000 * 60 * 60 * 24;
        },
      },
      rules: {
        customerId: [
          {
            required: true,
            message: "授信对象",
          },
        ],
        creditType: [
          {
            required: true,
            message: "额度类型",
          },
        ],
        creditQuota: [
          {
            required: true,
            message: "信用额度",
          },
          {
            pattern: /^\d{1,9}$|^\d{1,9}\.\d{1,4}$/,
            message: "信用额度必须为整数或小数，且整数部分不超过9位，小数部分不超过4位",
          },
        ],
        singleQuota: [
          {
            required: true,
            message: "单笔限额",
          },
          {
            pattern: /^\d{1,9}$|^\d{1,9}\.\d{1,2}$/,
            message: "单笔限额必须为整数或小数，且整数部分不超过9位，小数部分不超过2位",
          },
          {
            validator: this.validatorMoney,
          },
        ],
        overdueQuota: [
          {
            required: true,
            message: "逾期额度必填",
          },
          {
            pattern: /^\d{1,9}$|^\d{1,9}\.\d{1,2}$/,
            message: "逾期额度必须为整数或小数，且整数部分不超过9位，小数部分不超过2位",
          },
          {
            validator: this.validatorMoney,
          },
        ],
        accountDays: [
          {
            required: true,
            message: "信用账期必填",
          },
          {
            type: "integer",
            max: 365,
            min: 0,
            message: "请输入0-365之间的数字",
          },
        ],
        overdueDays: [
          {
            required: true,
            message: "逾期天数必填",
          },
          {
            type: "integer",
            max: 365,
            min: 0,
            message: "请输入0-365之间的数字",
          },
        ],
        effectiveDate: [
          {
            required: true,
            message: "生效日期必填",
          },
        ],
        expirationDate: [
          {
            required: true,
            message: "有效日期必填",
          },
        ],
        applyRemark: [
          {
            required: true,
            max: 200,
            message: "申请备注必填,长度不超过200",
          },
        ],
      },
      is_bloc: "",
      isCycle: false,
    };
  },
  mounted () {
    if (this.row.id) {
      this.getCreditDetail(this.row.company_id, 1);
    }
  },
  methods: {
    // 获取上次编辑的内容
    getCreditDetail (customerId, sm) {
      Api_getCreditDetai(customerId)
        .then((res) => {
          if (res) {
            if (sm === 2) {
              this.$confirm("检测到上次编辑内容，是否引用?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  this.company_id = res.companyId;
                  this.remoteMethod(res.companyName, () => {
                    this.addForm.customerId = res.companyId;
                    for (let i = 0; i < this.customerIdOptions.length; i++) {
                      if (res.companyId === this.customerIdOptions[i].company_id) {
                        this.customerId = this.customerIdOptions[i].customer_id;
                        this.is_bloc = this.customerIdOptions[i].is_bloc;
                      }
                    }
                  });
                  this.addForm.isBlocCredit = res.isBlocCredit === "1" ? true : false;
                  this.addForm.creditType = res.creditType;
                  this.addForm.creditQuota = res.creditQuota;
                  this.addForm.singleQuota = res.singleQuota;
                  this.addForm.accountDays = res.accountDays;
                  this.addForm.overdueQuota = res.overdueQuota;
                  this.addForm.overdueDays = res.overdueDays;
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
                        creditQuota: res.members[i].creditQuota,
                      });
                    }
                  } else {
                    this.addForm.creditCustomers = [];
                  }
                })
                .catch(() => { });
            } else {
              this.company_id = res.companyId;
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
              this.addForm.creditQuota = res.creditQuota;
              this.addForm.singleQuota = res.singleQuota;
              this.addForm.overdueQuota = res.overdueQuota;
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
                    creditQuota: res.members[i].creditQuota,
                  });
                }
              } else {
                this.addForm.creditCustomers = [];
              }
            }
          }
        })
        .catch((res) => {
          this.$message.error(res);
        });
    },
    // 返回
    returnMain () {
      this.$emit("edit", false);
    },
    // 添加客户
    noText () {
      this.$nextTick(() => {
        this.$refs.ref_addBusiness.open();
      });
    },
    // 获取企业对象
    remoteMethod (query, cd) {
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
    searchObj (value) {
      this.company_id = value;
      for (let i = 0; i < this.customerIdOptions.length; i++) {
        if (value === this.customerIdOptions[i].company_id) {
          this.customerId = this.customerIdOptions[i].customer_id;
          this.is_bloc = this.customerIdOptions[i].is_bloc;
        }
      }
      // 获取集团成员列表
      Api_getMemberDetai(this.customerId).then((res) => {
        if (res) {
          this.addForm.creditCustomers = res;
        }
      });
      this.getCreditDetail(this.company_id, 2);
    },
    // 不超过信用额度
    validatorMoney (rule, value, callback) {
      if (this.addForm.creditQuota && Number(value) > Number(this.addForm.creditQuota)) {
        callback(new Error("不能超过信用额度"));
        return;
      }
      callback();
    },
    // 提交
    submitForm () {
      this.$refs["addForm"].validate((valid) => {
        if (valid) {
          Api_CreditCustomerCheckCredit(this.company_id)
            .then((res) => {
              if (res === true) {
                this.$alert("该授信对象存在待审核授信申请，暂时不能新增授信。", "提示");
              } else {
                const postData = merge({}, this.addForm);
                postData.creditCustomers = postData.creditCustomers.map((i) => ({
                  customerId: i.id,
                  creditQuota: i.creditQuota,
                }));
                const loading = this.$openLoading();
                postData.customerId = this.customerId;
                if (this.row.id) {
                  postData.id = this.row.id;
                  Api_CreditCustomerSubCreditCustomer(postData)
                    .then((res) => {
                      this.$message.success({
                        dangerouslyUseHTMLString: true,
                        message: res,
                      });
                      loading.close();
                      this.$emit("edit", false);
                    })
                    .catch((res) => {
                      this.$message.error(res);
                      loading.close();
                    });
                } else {
                  Api_CreditCustomerSubCreditCustomer(postData)
                    .then((res) => {
                      this.$message.success({
                        dangerouslyUseHTMLString: true,
                        message: res,
                      });
                      loading.close();
                      this.$emit("edit", false);
                    })
                    .catch((res) => {
                      this.$message.error(res);
                      loading.close();
                    });
                }
              }
            })
            .catch((res) => {
              console.log(res);
            });
        }
      });
    },
    // 保存
    saveForm () {
      this.$refs["addForm"].validate((valid) => {
        if (valid) {
          Api_CreditCustomerCheckCredit(this.company_id)
            .then((res) => {
              if (res === true) {
                this.$alert("该授信对象存在待审核授信申请，暂时不能新增授信。", "提示");
              } else {
                const postData = merge({}, this.addForm);
                postData.creditCustomers = postData.creditCustomers.map((i) => ({
                  customerId: i.id,
                  creditQuota: i.creditQuota,
                }));
                const loading = this.$openLoading();
                postData.customerId = this.customerId;
                if (this.row.id) {
                  postData.id = this.row.id;
                  Api_CreditCustomerSaveCreditCustomer(postData)
                    .then((res) => {
                      this.$message.success({
                        dangerouslyUseHTMLString: true,
                        message: res,
                      });
                      loading.close();
                      this.$emit("edit", false);
                    })
                    .catch((res) => {
                      this.$message.error(res);
                      loading.close();
                    });
                } else {
                  Api_CreditCustomerSaveCreditCustomer(postData)
                    .then((res) => {
                      this.$message.success({
                        dangerouslyUseHTMLString: true,
                        message: res,
                      });
                      loading.close();
                      this.$emit("edit", false);
                    })
                    .catch((res) => {
                      this.$message.error(res);
                      loading.close();
                    });
                }
              }
            })
            .catch((res) => {
              console.log(res);
            });
        }
      });
    },
    // 跳转客户档案
    clientProfileDetail () {
      if (this.addForm.customerId) {
        this.$gotoCustomerDetail(this.addForm.customerId);
      } else {
        this.$alert("请先填写客户！", "提示", { confirmButtonText: "确定", type: "warning" });
      }
    },
    getId (res) {
      this.remoteMethod(res.companyName, () => {
        this.addForm.customerId = res.companyId;
        this.company_id = res.companyId;
        for (let i = 0; i < this.customerIdOptions.length; i++) {
          if (res.companyId === this.customerIdOptions[i].company_id) {
            this.customerId = this.customerIdOptions[i].customer_id;
            this.is_bloc = this.customerIdOptions[i].is_bloc;
          }
        }
      });
    },
    // 临时授信时能否循环授信
    showCycle (value) {
      if (this.company_id) {
        if (value === "1") {
          Api_isCycle(this.company_id)
            .then((res) => {
              if (!res) {
                this.isCycle = false;
              } else {
                this.isCycle = true;
                this.addForm.revolvingCreditState = res;
              }
            })
            .catch((res) => {
              this.$message.error(res);
            });
        } else {
          this.isCycle = false;
        }
      } else {
        this.$message.info("请选择授信对象");
        this.addForm.creditType = "0";
        return;
      }
    },
  },
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
