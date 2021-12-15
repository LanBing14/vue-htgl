<template>
  <div class="report-dialog">
    <el-dialog title="申请报告订单"  append-to-body :visible.sync="dialogVisible" :close-on-click-modal="false" width="550px">
      <el-form
        class="report-form"
        :model="downloadReportForm"
        :rules="rules"
        ref="downloadReportForm"
        label-width="90px"
        @submit.native.prevent
      >
        <el-form-item label="目标企业：">{{ companyName || '-' }}</el-form-item>
        <el-form-item label="报告类型：">
          <el-radio-group v-model="PDFType" size="medium" @change="getReportType()">
            <el-radio-button label="基础信息报告"></el-radio-button>
            <el-radio-button label="标准信用报告"></el-radio-button>
            <!--<el-radio-button label="风险评级报告"></el-radio-button>-->
            <el-tooltip class="item" effect="dark" content="报告功能尚未正式发布" placement="top-start">
              <el-radio-button label="风险评级报告" disabled></el-radio-button>
            </el-tooltip>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="报告内容：">
          <p>
            一、基础信息；
            <br />二、知识产权信息；
            <br />三、经营状况；
            <br />四、经营风险；
            <br />五、司法风险
          </p>
        </el-form-item>
        <el-form-item label="接收邮箱：" prop="email">
          <el-input
            v-model="downloadReportForm.email"
            placeholder="请输入接收邮箱"
            size="medium"
            @keyup.enter.native="confirm"
          ></el-input>
        </el-form-item>
        <el-form-item label="订单金额：">
          <span
            style="text-decoration: line-through"
            v-if="oldPrice&&Number(oldPrice)!=Number(orderPrice)"
          >￥{{ oldPrice | Fixed(2) }}元</span>
          <span style="font-size: 20px">￥{{ orderPrice | Fixed(2) }}元</span>
        </el-form-item>
        <el-form-item label="请选择支付方式：" class="pay-select-title" v-if="showNum">
          <el-checkbox
            :disabled="freeNum<=0"
            v-model="checked"
            @change="freeChange"
          >剩余免费次数为: {{ freeNum>=0?freeNum:0 }}</el-checkbox>
        </el-form-item>
        <el-form-item label class="pay-select" v-if="isShow">
          <div class="pay-type" :class="{'active': payType === '1' }" @click="payType = '1'">
            <img src="../../../../assets/images/pay/AliLogo.png" width="66px" />
          </div>
          <div class="pay-type" :class="{'active': payType === '2' }">
            <el-tooltip class="item" effect="dark" content="暂时尚不支持微信支付，正在对接中..." placement="top-start">
              <img src="../../../../assets/images/pay/WePayLogo.png" width="80px" />
            </el-tooltip>
          </div>
        </el-form-item>
        <el-row :gutter="10" class="report-price">
          <el-col :span="24" align="right" style="margin-bottom: 6px">
            实付款：
            <span class="fxb-blue fontwb">{{ (!checked?orderPrice:0) | Fixed(2) }}元</span>
          </el-col>
          <el-col :span="24" align="right">
            <el-button type="primary" :loading="confirmLoading" @click="confirm">确认订单并支付</el-button>
            <!--<el-tooltip
                            content="支付功能接入中，敬请期待"
                            placement="top">
                            <el-button
                                type="primary"
                                style="width:196px;margin-top: 16px;background-color: #a5cef9;border-color: #a5cef9;"
                                :loading="confirmLoading"
                            >确认订单并支付
                            </el-button>
            </el-tooltip>-->
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <!--        <el-dialog :visible.sync="dialogVisible" title="联系我们" width="500px">-->
    <!--            <el-form label-width="5em" class="form">-->
    <!--                <el-form-item label="电话:">0512-88880812</el-form-item>-->
    <!--                <el-form-item label="邮箱:">marketing@citgc.com</el-form-item>-->
    <!--            </el-form>-->
    <!--        </el-dialog>-->
  </div>
</template>

<script>
import {
  Api_DownloadReportPDF,
  Api_GenReportOrder,
  Api_GetReportType,
  Api_GetFreeNum,
} from "@/api/advanceSearch";
import { Fixed, toAliPay } from "@/utils/index";

export default {
  name: "DownloadReport",
  filters: {
    Fixed,
  },
  props: {
    companyName: String,
  },
  data() {
    return {
      PDFType: "基础信息报告",
      confirmLoading: false,
      dialogVisible: false,
      getCompanyName: "",
      payType: "3",
      isShow: false,
      showNum: true,
      oldPrice: 0,
      orderPrice: 0,
      checked: false,
      freeNum: "",
      downloadReportForm: {
        email: this.$store.state.user.userInfo.email,
      },
      rules: {
        email: [
          {
            required: false,
            message: "请输入邮箱",
            trigger: "blur",
          },
          {
            type: "email",
            message: "请正确填写邮箱",
            trigger: ["blur", "change"],
          },
          {
            message: "邮箱最大长度300个字符",
            max: 300,
          },
        ],
      },
      getReportInfo: {
        reportType: "",
        companyName: "",
        // creditCode: "",
        companyId: "",
        receiveEmail: this.$store.state.user.userInfo.email,
        payType: "",
      },
      PDFCode: "",
    };
  },
  watch: {
        companyName: {
          handler(newVal) {
            this.getCompanyName=newVal;
          },
          immediate: true
    }
  },
  methods: {
    confirm() {
      this.$refs["downloadReportForm"].validate((valid) => {
        if (valid) {
          if (!this.payType) {
            this.$message.warning("请先选择支付方式");
            return;
          }

          // 微信支付暂时禁用
          if (this.payType === "2") {
            this.$message.warning("暂时尚不支持微信支付，正在对接中...");
            return;
          }

          this.openLoading();

          // 验证通过后获取企业数据并传给后台
          if (this.PDFType === "基础信息报告") {
            this.getReportInfo.reportType = "basic";
          }
          if (this.PDFType === "标准信用报告") {
            this.getReportInfo.reportType = "standard";
          }

          this.getReportInfo.companyName = this.getCompanyName;
          // this.getReportInfo.creditCode = this.$route.query.creditCode;
          // this.getReportInfo.companyId = this.$route.query.id;
          this.getReportInfo.companyId = this.$store.getters.userInfo.companyId;
          this.getReportInfo.receiveEmail = this.downloadReportForm.email;
          this.getReportInfo.payType = this.payType;

          if (
            this.PDFType !== "" &&
            this.payType !== "" &&
            this.getReportInfo.companyName !== "" &&
            this.getReportInfo.companyId !== ""
          ) {
            Api_GenReportOrder(this.getReportInfo)
              .then((res) => {
                this.closeLoading();
                const orderNo = res.orderNo;
                if (this.payType === "3") {
                  this.$message.success("支付成功");
                  setTimeout(() => {
                    location.reload();
                  }, 1000);
                } else {
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
                }
              })
              .catch((e) => {
                this.closeLoading();
                this.$message.error(e);
              });
          }else{
            this.$message.error('当前企业查询不到，无法为您生成报告，请检查后重试..');
            this.closeLoading();
            return false;
          }
        } else {
          this.closeLoading();
          return false;
        }
      });
    },
    downloadPDF() {
      Api_DownloadReportPDF({
        orderNo: this.PDFCode,
      }).then(() => {});
    },
    openDialog(PDFType) {
      this.PDFType = PDFType;
      this.dialogVisible = true;
      if (this.$refs["downloadReportForm"]) {
        this.$refs["downloadReportForm"].resetFields();
      }
      this.getReportType();
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
    getFreeNum() {
      Api_GetFreeNum()
        .then((res) => {
          this.checked = res > 0;
          this.freeNum = res;
          this.$nextTick(() => {
            this.freeChange(this.checked);
          });
        })
        .catch((res) => {
          this.$message.error(res);
        });
    },
    freeChange(value) {
      this.isShow = !value;
      // this.payType = "1";
      if (value) {
        this.payType = "3";
      } else {
        this.payType = "1";
      }
    },
    // 根据报告类型获取价格
    getReportType() {
      let typeCode = "";
      if (this.PDFType === "基础信息报告") {
        typeCode = "basic";
        this.isShow = false;
        this.showNum = true;
        this.getFreeNum();
      }
      if (this.PDFType === "标准信用报告") {
        typeCode = "standard";
        this.isShow = true;
        this.showNum = false;
        this.payType = "1";
        this.checked = false;
      }
      if (this.PDFType === "风险评级报告") {
        typeCode = "grade";
        this.isShow = true;
        this.showNum = false;
        this.payType = "1";
        this.checked = false;
      }
      if (typeCode) {
        Api_GetReportType({
          typeCode: typeCode,
        }).then((res) => {
          this.orderPrice = this.$toMoney(res.price);
          this.oldPrice = res.oldPrice ? this.$toMoney(res.oldPrice) : null;
        });
      }
    },
  },
};
</script>

<style lang="scss">
.report-dialog {
  .el-dialog__body {
    padding: 30px;
  }
}

.report-form {
  .el-form-item {
    margin-bottom: 16px;
  }

  .el-form-item__label {
    text-align: left;
    font-size: 14px;
    font-weight: 500;
    line-height: 30px;
  }

  .el-form-item__content {
    line-height: 30px;
  }

  .el-input__inner {
    width: 281px;
    margin-left: 1px;
  }

  .el-textarea__inner {
    width: 281px;
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
}
</style>

<style lang="scss" scoped>
.report-price {
  margin-top: 25px;
}

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
  background-image: url(../../../../assets/images/pay/paycheck.png);
  background-repeat: no-repeat;
  background-position: -297px -4px;
}

.pay-type.active::after {
  background-position: -129px -4px;
}

.form {
  margin: 20px 0 40px 0;

  /deep/ {
    .el-form-item__label,
    .el-form-item__content {
      font-size: 24px;
      font-weight: normal;
    }
  }
}
</style>
