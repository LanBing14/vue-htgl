<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>发票登记</span>
      </h1>
      <div>
        <el-button @click="back">返回</el-button>
      </div>
    </div>
    <div class="page-content">
      <el-form ref="form" :model="form" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户名称">
              <span class="canClick" @click="clientProfileDetail">{{ form.companyName }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <div>
          <el-row>
            <el-col :span="8">
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
                <el-form-item label="订单金额">{{ form.contractAmount }}元</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="待开金额">{{ form.dkAmount }}元</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="已申请金额">{{ form.ysqAmount }}元</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="已开金额">{{ form.ykAmount }}元</el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-row style="margin-top: 20px">
            <el-col :span="6">
              <el-form-item label="申请编码">{{ form.invoiceCode }}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="发票抬头">
                <span class="canClick" @click="openDetail">{{ form.archivesInvoiceName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-divider class="detail-divider"></el-divider>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="发票类型">{{ form.invoiceType === '0' ? '增值税普通发票' : '增值税专用发票' }}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="开票金额">{{ form.applyContractMoney }}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-divider class="detail-divider"></el-divider>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item label="备注">{{ form.remark }}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="申请人">{{ form.createName }}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="申请状态">{{ form.status | filterStatus }}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="申请时间">{{ form.createDate }}</el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>

      <div style="text-align: center; margin-top: 20px" class="size-btn-change">
        <el-button @click="reject" type="primary">打回</el-button>
        <el-button @click="openWin" type="success">发票登记</el-button>
      </div>
    </div>
    <Registration ref="ref_Registration" @back="back"></Registration>
    <TitleDetail ref="ref_TitleDetail"></TitleDetail>
  </div>
</template>

<script>
import Registration from "./Registration";
import TitleDetail from "../invoiceList/TitleDetail";
import { Api_invoiceDetail, Api_invoiceWaitBack } from "@/api/creditManagement/invoice/invoiceTracking.js";

export default {
  name: "RegDetail",
  components: { Registration, TitleDetail },
  filters: {
    filterStatus(value) {
      switch (value) {
        case "0":
          return "开票申请";
        case "1":
          return "发票待开";
        case "2":
          return "待领取";
        case "3":
          return "待签收";
        case "4":
          return "已签收";
        case "5":
          return ":签收异常";
        case "6":
          return "已作废";
      }
    },
  },
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
        companyName: "",
        contractCode: "",
        contractName: "",
        contractAmount: "",
        dkAmount: "",
        ysqAmount: "",
        ykAmount: "",
        invoiceCode: "",
        archivesInvoiceName: "",
        invoiceType: "",
        applyContractMoney: "",
        remark: "",
        createName: "",
        createDate: "",
        status: "",
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      Api_invoiceDetail(this.selectData.id)
        .then((res) => {
          this.form.dkAmount = this.$toMoney(res.dkAmount, 2);
          this.form.ysqAmount = this.$toMoney(res.ysqAmount, 2);
          this.form.ykAmount = this.$toMoney(res.ykAmount, 2);
          console.log(res.invoice.contractMoney);
          this.form.companyName = res.invoice.companyName;
          this.form.contractCode = res.invoice.contractCode;
          this.form.contractName = res.invoice.contractName;
          this.form.contractAmount = this.$toMoney(res.invoice.contractMoney, 2);
          this.form.invoiceCode = res.invoice.invoiceCode;
          this.form.archivesInvoiceName = res.invoice.archivesInvoiceName;
          this.form.invoiceType = res.invoice.invoiceType;
          this.form.applyContractMoney = this.$toMoney(res.invoice.applyContractMoney, 2);
          this.form.remark = res.invoice.remark;
          this.form.createName = res.invoice.createName;
          this.form.createDate = res.invoice.createDate;
          this.form.status = res.invoice.status;
        })
        .catch((res) => {
          this.$message.error(res);
        });
    });
  },
  methods: {
    // 返回列表
    back() {
      this.$emit("edit", false);
    },
    // 跳转客户档案
    clientProfileDetail() {
      this.$gotoCustomerDetail(this.selectData.companyId);
    },
    // 打开发票登记弹窗
    openWin() {
      this.$nextTick(() => {
        this.$refs.ref_Registration.open(this.selectData);
      });
    },
    // 打回
    reject() {
      // 发票待开-打回
      this.$prompt("请输入打回原因，不超过200字", "打回", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^.{1,300}$/,
        inputErrorMessage: "打回原因格式不正确",
      })
        .then(({ value }) => {
          const loading = this.$openLoading();
          Api_invoiceWaitBack(this.selectData.id, value)
            .then((res) => {
              loading.close();
              this.$message.success(res);
              this.$emit("edit", false);
            })
            .catch((res) => {
              loading.close();
              this.$message.error(res);
            });
        })
        .catch(() => {});
      // this.$emit("edit", false);
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
    // 发票抬头详情
    openDetail() {
      this.$refs.ref_TitleDetail.open(this.selectData.archivesInvoiceId);
    },
  },
};
</script>

<style scoped>
</style>
