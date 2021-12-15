<template>
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
                {{ form.companyName }}
                <span
                  class="canClick"
                  style="vertical-align: middle;line-height: 36px; margin-left: 10px"
                  @click="clientProfileDetail"
                >客户档案</span>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <EnterpriseFile :enterpriseID="form.companyId" :stateID="form.id"></EnterpriseFile> -->
        </div>
        <div style="padding: 0 0 0 28px;">
          <el-row>
            <el-col :span="24">
              <el-form-item label="订单名称">
                {{ form.contractCode }}/{{ form.contractName }}
                <span
                  class="canClick"
                  style="vertical-align: middle;line-height: 36px; margin-left: 10px"
                  @click="orderDetail"
                >详情</span>
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
                <el-form-item label="订单金额">{{ form.totalMoney }}</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="待开金额">{{ form.waitMoney }}</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="已申请金额">{{ form.invoiceMoney }}</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="已开金额">{{ form.alreadyMoney }}</el-form-item>
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
              <span style="line-height: 36px; margin-left: 8px" class="canClick" @click="openTitle">选择</span>
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
  Api_ApplyInvoice,
} from "@/api/creditManagement/invoice/invoice.js";
import Title from "../invoiceList/Title";
import TitleDetail from "../invoiceList/TitleDetail";
import { merge } from "lodash";

export default {
  name: "BillingApp",
  components: { EnterpriseFile, Title, TitleDetail },
  props: {
    selectData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
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
        alreadyMoney: "",
      },
      rules: {
        archivesInvoiceId: [{ required: true, message: "发票抬头" }],
        invoiceType: [{ required: true, message: "发票类型" }],
        applyContractMoney: [{ required: true, message: "开票金额" }, { validator: this.validatorMoney }],
        remark: [{ required: true, message: "开票备注" }],
      },
    };
  },
  mounted() {
    if (this.selectData.id) {
      Api_GetInvoiceInfoEdit(this.selectData.id)
        .then((res) => {
          this.form.contractId = this.selectData.contractId;
          this.form.companyId = this.selectData.companyId;
          this.form.contractMoney = this.selectData.contractMoney;
          this.form.headId = res.invoice.dutyId;
          this.form.dutyName = this.selectData.dutyName;
          this.form.headDept = res.invoice.deptId;
          this.form.deptName = this.selectData.deptName;
          this.form.invoiceId = this.selectData.id;

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
        })
        .catch((res) => {
          this.$message.error(res);
        });
    } else {
      Api_GetInvoiceInfo(this.selectData.id)
        .then((res) => {
          this.form.contractId = this.selectData.contractId;
          this.form.companyId = this.selectData.companyId;
          this.form.contractMoney = this.selectData.contractMoney;
          this.form.headId = this.selectData.dutyId;
          this.form.dutyName = this.selectData.dutyName;
          this.form.headDept = this.selectData.deptId;
          this.form.deptName = this.selectData.deptName;

          this.form.companyName = res.contract.customerName;
          this.form.contractCode = res.contract.contractCode;
          this.form.contractName = res.contract.contractName;
          this.form.totalMoney = res.ysAmount;
          this.form.waitMoney = res.dkAmount;
          this.form.invoiceMoney = res.ysqAmount;
          this.form.alreadyMoney = res.ykAmount;
        })
        .catch((res) => {
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
      this.$emit("edit", false);
    },
    // 跳转客户档案
    clientProfileDetail() {
      this.$gotoCustomerDetail(this.form.companyId);
    },
    // 保存
    saveForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const postData = merge({}, this.form);
          postData.commitType = false;
          const loading = this.$openLoading();
          Api_ApplyInvoice(postData)
            .then((res) => {
              this.$message.success(res);
              loading.close();
              this.back();
            })
            .catch((res) => {
              this.$message.error(res);
              loading.close();
            });
        }
      });
    },
    // 提交
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const postData = merge({}, this.form);
          postData.commitType = true;
          const loading = this.$openLoading();
          Api_ApplyInvoice(postData)
            .then((res) => {
              this.$message.success(res);
              loading.close();
              this.back();
            })
            .catch((res) => {
              this.$message.error(res);
              loading.close();
            });
        }
      });
    },
    // 更换发票抬头
    openTitle() {
      this.$refs.ref_Title.open(this.form.companyId, this.form.companyName);
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
      if (this.selectData.orders) {
        // 订单详情
        this.$gotoOrderDetail(this.selectData.contractId);
      } else {
        // 合同详情
        this.$gotoContractDetail(this.selectData.contractId);
      }
    },
    validatorMoney(rule, value, callback) {
      if (Number(value) > Number(this.form.totalMoney)) {
        callback(new Error("不能超过订单金额"));
        return;
      }
      callback();
    },
  },
};
</script>

<style scoped>
</style>
