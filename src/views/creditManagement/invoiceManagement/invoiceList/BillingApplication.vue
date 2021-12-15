<template>
  <!--<Dialog ref="drawer" title="开票申请" :visible.sync="visible" :onOk="handleSure" width="500px" :close="closeDialog">
        <el-form ref="form" :model="form" :rules="rules" label-width="110px">
            <el-form-item label="客户名称">{{ form.companyName }}</el-form-item>
            <el-form-item label="合同名称">{{ form.contractName }}</el-form-item>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="应收金额">{{ $toMoney(form.totalMoney, 2) }}</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="待开金额">{{ $toMoney(form.waitMoney, 2) }}</el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="已申请金额">{{ $toMoney(form.invoiceMoney, 2) }}</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="已开金额">{{ $toMoney(form.alreadyMoney, 2) }}</el-form-item>
                </el-col>
            </el-row>
            <el-divider style="margin-top: 0"></el-divider>
            <el-form-item label="申请开票金额" prop="applyContractMoney">
                <el-input v-model="form.applyContractMoney" placeholder="请输入申请开票金额">
                    <template slot="append">元</template>
                </el-input>
            </el-form-item>
            <el-form-item label="开票备注" prop="remark">
                <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入开票登记备注信息"></el-input>
            </el-form-item>
        </el-form>
  </Dialog>-->
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>开票申请</span>
      </h1>
      <div>
        <el-button @click="back">返回</el-button>
      </div>
    </div>
    <div class="page-content">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <div style="padding: 0 0 0 28px;">
          <el-row>
            <el-col :span="24">
              <el-form-item label="客户名称">
                <span class="canClick" @click="clientProfileDetail">{{ form.companyName }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <!--                    <EnterpriseFile :enterpriseID="form.companyId" :stateID="form.id"></EnterpriseFile>-->
        </div>
        <div style="padding: 0 0 0 28px;">
          <el-row>
            <el-col :span="24">
              <el-form-item label="订单名称">
                <span class="canClick" @click="orderDetail">{{ form.contractCode }}/{{ form.contractName }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <div style="background-color: #f5f7fa;border: 1px solid #eaedf4;padding: 16px">
            <div
              class="title"
              style="margin-bottom: 15px;font-size: 15px;color: #333;font-weight: bold;"
            >当前合同开票情况</div>
            <el-row>
              <el-col :span="6">
                <el-form-item label="订单金额">{{ form.totalMoney }}元</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="待开金额">{{ form.waitMoney }}元</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="已申请金额">{{ form.invoiceMoney }}元</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="已开金额">{{ form.alreadyMoney }}元</el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <div style="padding: 20px 0 0 28px;">
          <el-row>
            <el-col :span="8">
              <el-form-item label="发票抬头" prop="archivesInvoiceId">
                <el-input v-model="form.archivesInvoice" placeholder="请选择发票抬头" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" v-if="form.archivesInvoiceId">
              <span style="line-height: 36px; margin-left: 8px" class="canClick" @click="openDetail">详细信息</span>
            </el-col>
            <el-col :span="2">
              <span style="line-height: 36px;" class="canClick" @click="openTitle">选择</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="发票类型" prop="invoiceType">
                <el-radio v-model="form.invoiceType" label="0">增值税普通发票</el-radio>
                <el-radio v-model="form.invoiceType" label="1">增值税专用发票</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="开票金额" prop="applyContractMoney">
                <el-input v-model="form.applyContractMoney" placeholder="请输入开票金额">
                    <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="开票备注" prop="remark">
                <el-input type="textarea" :rows="2" placeholder="请输入开票备注" v-model="form.remark"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div style="text-align: center; margin-top: 20px" class="size-btn-change">
        <el-button @click="saveForm" type="success">保存</el-button>
        <el-button @click="submitForm" type="primary">提交</el-button>
      </div>
    </div>
    <Title ref="ref_Title" @getInfo="getInfo"></Title>
    <TitleDetail ref="ref_TitleDetail"></TitleDetail>
  </div>
</template>

<script>
import EnterpriseFile from "@/components/EnterpriseFile/index.vue";
import {
  Api_GetInvoiceInfo,
  Api_GetInvoiceInfoEdit,
  Api_ApplyInvoice
} from "@/api/creditManagement/invoice/invoice.js";
import Title from "./Title";
import TitleDetail from "./TitleDetail";
import { merge } from "lodash";

export default {
  name: "BillingApplication",
  components: { EnterpriseFile, Title, TitleDetail },
  props: {
    row: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      customerId: "",
      form: {
        archivesInvoice: "",
        archivesInvoiceId: "",
        invoiceType: "0",
        applyContractMoney: "",
        remark: "",
        invoiceId: "",
        contractId: "",
        companyId: "",
        contractMoney: "",
        headId: "",
        dutyName: "",
        headDept: "",
        deptName: "",
        companyName: "",
        contractCode: "",
        contractName: "",
        totalMoney: "",
        waitMoney: "",
        invoiceMoney: "",
        alreadyMoney: ""
      },
      rules: {
        archivesInvoiceId: [{ required: true, message: "发票抬头" }],
        invoiceType: [{ required: true, message: "发票类型" }],
        applyContractMoney: [
          { required: true, message: "开票金额" },
          {
            pattern: /^\d{1,9}$|^\d{1,9}\.\d{1,2}$/,
            message: "开票金额必须为整数或小数，且整数部分不超过9位，小数部分不超过2位"
          },
          { validator: this.validatorMoney }
        ],
        remark: [{ required: true, message: "开票备注" }]
      }
    };
  },
  mounted() {
    if (this.row.invoiceId) {
      Api_GetInvoiceInfoEdit(this.row.invoiceId)
        .then(res => {
          this.form.contractId = this.row.id;
          this.form.companyId = this.row.companyId;
          this.form.contractMoney = this.row.contractAmount;
          this.form.headId = this.row.userId;
          this.form.dutyName = this.row.deptName;
          this.form.headDept = this.row.deptId;
          this.form.deptName = this.row.deptName;
          this.form.invoiceId = this.row.invoiceId;
          this.form.companyName = res.invoice.companyName;
          this.form.contractCode = res.invoice.contractCode;
          this.form.contractName = res.invoice.contractName;
          this.form.totalMoney = res.ysAmount;
          this.form.waitMoney = res.dkAmount;
          this.form.invoiceMoney = res.ysqAmount;
          this.form.alreadyMoney = res.ykAmount;
          this.form.archivesInvoice = res.invoice.archivesInvoiceName;
          this.form.archivesInvoiceId = res.invoice.archivesInvoiceId;
          this.form.invoiceType = res.invoice.invoiceType;
          this.form.applyContractMoney = res.invoice.applyContractMoney;
          this.form.remark = res.invoice.remark;
          this.customerId = res.contract.customerId;
        })
        .catch(res => {
          this.$message.error(res);
        });
    } else {
      Api_GetInvoiceInfo(this.row.id)
        .then(res => {
          this.form.contractId = this.row.id;
          this.form.companyId = this.row.companyId;
          this.form.contractMoney = this.row.contractAmount;
          this.form.headId = this.row.userId;
          this.form.dutyName = this.row.username;
          this.form.headDept = this.row.deptId;
          this.form.deptName = this.row.deptName;
          this.form.companyName = res.contract.customerName;
          this.form.contractCode = res.contract.contractCode;
          this.form.contractName = res.contract.contractName;
          this.form.totalMoney = res.ysAmount;
          this.form.waitMoney = res.dkAmount;
          this.form.invoiceMoney = res.ysqAmount;
          this.form.alreadyMoney = res.ykAmount;
          this.customerId = res.contract.customerId;
        })
        .catch(res => {
          this.$message.error(res);
        });
    }
  },
  methods: {
    // open() {
    //     // this.form.companyName = _row.companyName;
    //     // this.contractAmount = _row.contractAmount;
    //     // this.dkAmount = _row.dkAmount;
    //     // this.ysqAmount = _row.ysqAmount;
    //     // this.ykAmount = _row.ykAmount;
    //     // this.form.contractId = _row.id;
    //     // this.form.companyId = _row.companyId;
    //     // this.form.contractCode = _row.contractNo;
    //     // this.form.contractName = _row.contractName;
    //     // this.form.dutyName = _row.username;
    //     // this.form.deptName = _row.deptName;
    //     // this.visible = true;
    // },
    // handleSure() {
    //     this.$refs['form'].validate(valid => {
    //         if (valid) {
    //             const loading = this.$openLoading();
    //             Api_ApplyInvoice(this.form).then(res => {
    //                 this.$message.success(res);
    //                 loading.close();
    //                 this.visible = false;
    //             }).catch(res => {
    //                 this.$message.error(res);
    //                 loading.close();
    //             })
    //         }
    //     })
    // },
    // closeDialog() {
    //     this.visible = false;
    // }
    back() {
      this.$emit("showMain");
    },
    // 跳转客户档案
    clientProfileDetail() {
      this.$gotoCustomerDetail(this.form.companyId);
    },
    // 保存
    saveForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const postData = merge({}, this.form);
          postData.commitType = false;
          const loading = this.$openLoading();
          Api_ApplyInvoice(postData)
            .then(res => {
              this.$message.success(res);
              loading.close();
              this.back();
            })
            .catch(res => {
              this.$message.error(res);
              loading.close();
            });
        }
      });
    },
    // 提交
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const postData = merge({}, this.form);
          postData.commitType = true;
          const loading = this.$openLoading();
          Api_ApplyInvoice(postData)
            .then(res => {
              this.$message.success(res);
              loading.close();
              this.back();
            })
            .catch(res => {
              this.$message.error(res);
              loading.close();
            });
        }
      });
    },
    // 更换发票抬头
    openTitle() {
      this.$refs.ref_Title.open(this.form.companyId, this.form.companyName, this.customerId);
    },
    getInfo(form) {
      this.form.archivesInvoice = form.invoice;
      this.form.archivesInvoiceId = form.radio;
    },
    // 发票抬头详情
    openDetail() {
      this.$refs.ref_TitleDetail.open(this.form.archivesInvoiceId);
    },
    // 订单详情
    orderDetail() {
      if (this.row.orders) {
        // 订单详情
        this.$gotoOrderDetail(this.row.id);
      } else {
        // 合同详情
        this.$gotoContractDetail(this.row.id);
      }
    },
    validatorMoney(rule, value, callback) {
      if (Number(value) > Number(this.form.waitMoney)) {
        callback(new Error("不能超过" + Number(this.form.waitMoney)));
        return;
      }
      callback();
    }
  }
};
</script>

<style>
</style>
