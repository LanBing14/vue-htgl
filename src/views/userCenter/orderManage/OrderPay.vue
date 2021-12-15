<template>
  <div class="usercenter-container">
    <el-dialog
      title="订单支付"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="500px"
      append-to-body
    >
      <el-form ref="orderPayForm" class="orderPayForm" label-width="120px">
        <el-form-item label="订单编号：">{{ orderNo || '-' }}</el-form-item>
        <el-form-item label="订单内容：">
          <p>{{ content || '-' }}</p>
        </el-form-item>
        <el-form-item label="订单金额：">￥{{ orderPrice | Fixed(2) }}元</el-form-item>
        <el-form-item label="请选择支付方式：" class="pay-select-title"></el-form-item>
        <el-form-item label class="pay-select">
          <div class="pay-type" :class="{'active': payType === '1' }" @click="payType = '1'">
            <img src="../../../assets/images/pay/AliLogo.png" width="66px" />
          </div>
          <div class="pay-type" :class="{'active': payType === '2' }">
            <el-tooltip class="item" effect="dark" content="暂时尚不支持微信支付，正在对接中..." placement="top-start">
              <img src="../../../assets/images/pay/WePayLogo.png" width="80px" />
            </el-tooltip>
          </div>
        </el-form-item>
        <el-row :gutter="10" class="report-price">
          <el-col :span="24" align="right">
            实付款：
            <span class="fxb-blue fontwb">{{ orderPrice | Fixed(2) }}元</span>
          </el-col>
          <el-col :span="24" align="right">
            <el-button
              type="primary"
              style="width:196px;margin-top: 16px;"
              :loading="confirmLoading"
              @click="confirm"
            >去支付</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { Fixed, toAliPay } from "@/utils/index";

export default {
  name: "OrderPay",
  filters: { Fixed },
  data() {
    return {
      payType: "",
      orderNo: "",
      content: "",
      orderPrice: 0,
      actualAmount: 0,
      confirmLoading: false,
      dialogVisible: false,
    };
  },
  methods: {
    confirm() {
      if (!this.payType) {
        this.$message.warning("请先选择支付方式");
        return;
      }

      // 微信支付暂时禁用
      if (this.payType === "2") {
        this.$message.warning("暂时尚不支持微信支付，正在对接中...");
        return;
      }

      this.closeDialog();
      this.$message.success("请在60分钟内完成支付，否则订单会被自动取消");
      if (this.payType === "1") {
        // 支付宝支付
        toAliPay(this.orderNo);
      } else if (this.payType === "2") {
        // 微信
        const Router = this.$router.resolve({
          path: "/payment",
          query: {
            orderNo: this.orderNo,
          },
        });
        window.open(Router.href, "_blank");
      }
      this.$confirm("支付完成后，请根据支付情况点击以下按钮", "网上支付提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "支付成功",
        cancelButtonText: "支付遇到问题",
      })
        .then(() => {
          location.reload();
          // this.$router.push("/userCenter/order/report");
        })
        .catch((action) => {
          if (action === "cancel") {
            this.$router.push({
              path: "/userCenter/contact",
            });
          } else {
            // location.reload();
          }
        });
    },
    openDialog(orderNo, content, orderPrice, actualAmount, payType) {
      this.orderNo = orderNo;
      this.content = content;
      this.orderPrice = orderPrice;
      this.actualAmount = actualAmount;
      this.payType = payType;
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    openLoading() {
      this.confirmLoading = true;
    },
    closeLoading() {
      this.confirmLoading = false;
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.pay-type {
  text-align: center;
  width: 152px;
  height: 54px;
  line-height: 54px;
  border: 1px solid #d3d3d3;
  float: left;
  margin-right: 18px;
  position: relative;
  cursor: pointer;
}
.pay-type.active {
  border: 1px solid #00c800;
}
.pay-type::after {
  content: "";
  width: 26px;
  height: 26px;
  position: absolute;
  top: 0;
  right: 0;
  background-image: url(../../../assets/images/pay/paycheck.png);
  background-repeat: no-repeat;
  background-position: -297px -4px;
}
.pay-type.active::after {
  background-position: -129px -4px;
}
</style>
<style lang="scss">
.orderPayForm .el-form-item__label {
  text-align: left;
  padding-left: 19px;
  font-size: 14px;
  font-weight: 500;
}

.pay-select-title {
  .el-form-item__label {
    width: 150px !important;
  }
}
.pay-select {
  .el-form-item__content {
    margin-left: 20px !important;
  }
}
.report-price {
  margin-bottom: 41px;
  margin-top: 32px;
}
</style>
