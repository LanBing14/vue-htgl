<template>
  <el-dialog
    :title="showType?'开通会员':title"
    :visible.sync="visible"
    width="500px"
    :before-close="handleClose"
    class="vip-dialog"
    append-to-body
  >
    <el-form ref="form" v-loading="loading" class="my-form" :model="form" label-width="130px">
      <el-form-item label="会员类型：" prop v-if="showType">
        <el-radio-group v-model="form.versionType">
          <el-radio-button label="company">企业版</el-radio-button>
          <el-radio-button label="profession">专业版</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="开通账号：" prop>{{$store.state.user.userInfo.username}}</el-form-item>
      <el-form-item
        label="有效期限："
        prop
      >{{form.versionType==='company'?products[1].effectiveMonth:products[2].effectiveMonth||'-'}}个月</el-form-item>
      <el-form-item label="到期时间：" prop>{{endTime}}</el-form-item>
      <el-form-item label="实际支付：" prop>
        <span class="old">¥ {{form.versionType==='company'?products[1].oldPrice:products[2].oldPrice||'-'}}</span>
        <span class="new">¥ {{form.versionType==='company'?products[1].newPrice:products[2].newPrice||'-'}}</span>
      </el-form-item>
      <el-form-item label="请选择支付方式：" prop>
        <div style="display: flex">
          <div
            class="pay-type"
            style="margin-right:5px"
            :class="{'active': payType === '1' }"
            @click="payType = '1'"
          >
            <img src="../../../assets/images/pay/AliLogo.png" width="66px" />
          </div>
          <div class="pay-type" style="margin-left:5px" :class="{'active': payType === '2' }">
            <el-tooltip class="item" effect="dark" content="暂时尚不支持微信支付，正在对接中..." placement="top-start">
              <img src="../../../assets/images/pay/WePayLogo.png" width="80px" />
            </el-tooltip>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSure">立即支付</el-button>
      <div style="color:#999; margin-top:10px; font-size:13px">请扫码完成支付，自支付完成之时起5分钟内生效</div>
    </span>
  </el-dialog>
</template>

<script>
import {
  Api_versionPage,
  Api_versionOrder,
  Api_versionRenewalOrder,
  Api_versionUpgradeOrder,
} from "@/api/userCenter/vip.js";
import { Fixed, toAliPay } from "@/utils/index";

export default {
  name: "OpenVip",
  data() {
    return {
      showType: true,
      title: null,
      visible: false,
      form: { versionType: "company" },
      products: [{}, {}, {}],
      loading: false,
      payType: "1",
      endTime: this.$dateFormat(new Date().getTime() + 3600 * 24 * 1000 * 365),
      promiseFunc: null,
    };
  },
  methods: {
    open(tag, endDate, isUpgrade) {
        if(!this.$store.state.user.userInfo.registerFlag){
            this.$alert("平台暂时不支持企业团队成员申请开通会员！", "提示", { type: "warning" });
            return false;
        }
      if (tag) {
        this.showType = false;
        this.form.versionType = tag === "1" ? "company" : tag === "2" ? "profession" : null;
        if (endDate) {
          this.endTime = this.$dateFormat(new Date(endDate).getTime() + 3600 * 24 * 1000 * 365);
          if (isUpgrade) {
            this.title = "升级会员";
            this.promiseFunc = Api_versionUpgradeOrder;
          } else {
            this.title = tag === "1" ? "续费会员企业版" : tag === "2" ? "续费会员专业版" : null;
            this.promiseFunc = Api_versionRenewalOrder;
          }
        } else {
          this.title = tag === "1" ? "开通会员企业版" : tag === "2" ? "开通会员专业版" : null;
          this.promiseFunc = Api_versionOrder;
        }
      } else {
        this.title = tag === "1" ? "开通会员企业版" : tag === "2" ? "开通会员专业版" : null;
        this.promiseFunc = Api_versionOrder;
      }
      this.visible = true;
      this.$nextTick(() => {
        this.getProducts();
      });
    },
    handleSure() {
      if (!this.payType) {
        this.$message.warning("请先选择支付方式");
        return;
      }
      // 微信支付暂时禁用
      if (this.payType === "2") {
        this.$message.warning("暂时尚不支持微信支付，正在对接中...");
        return;
      }
      const loading = this.$openLoading();
      this.promiseFunc({ ...this.form, payType: this.payType })
        .then((res) => {
          loading.close();
          // this.$message.success("会员开通成功");
          // this.visible = false;
          // this.$emit("getVipInfo");

          const orderNo = res.orderNo;
          this.$message.success("请在60分钟内完成支付，否则订单会被自动取消");
          if (this.payType === "1") {
            // 支付宝支付
            toAliPay(orderNo);
          } else if (this.payType === "2") {
            // 微信
            const Router = this.$router.resolve({
              path: "/payment",
              query: {
                orderNo: orderNo,
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
              this.visible = false;
              this.$emit("getVipInfo");
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
        })
        .catch((res) => {
          loading.close();
          this.$message.success(res);
        });
    },
    handleClose() {
      this.visible = false;
    },
    getProducts() {
      this.loading = true;
      Api_versionPage()
        .then((res) => {
          this.products = res.data;
          console.log(res);
          this.loading = false;
        })
        .catch((res) => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.vip-dialog {
  /deep/ .el-dialog__footer {
    text-align: center;
  }
}

.my-form {
  /deep/ .el-form-item__label {
    text-align: left;
  }

  /deep/ .el-form-item__content {
    text-align: right;
  }
}

.old {
  text-decoration: line-through;
  font-size: 13px;
  color: #999;
}

.new {
  color: #409eff;
  font-weight: bold;
  font-size: 19px;
  margin-left: 10px;
}

.report-price {
  margin-top: 25px;
}

.pay-type {
  text-align: center;
  flex: 1;
  height: 54px;
  line-height: 54px;
  border: 1px solid #d3d3d3;
  // float: left;
  // margin-right: 18px;
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
