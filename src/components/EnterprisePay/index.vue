<template>
  <div class="animation" :class="{'goHeighter': isShowSituationBox}">
    <div class="container" v-loading="loading">
      <div class="content">
        <div class="item">
          <div class="title">当前应收账款及已收账款情况</div>
          <div class="item-container">
            <div class="item-content">
              <div class="text-container">
                <!-- 预付款、应收款、罚金 -->
                <p class="text-title">账款类型</p>
                <p
                  class="text-content"
                >{{data.planType==='0'?'预付款':data.planType==='1'?'应付款':data.planType==='2'?'罚金':'-'}}</p>
              </div>
              <div class="text-container">
                <p class="text-title">应收金额</p>
                <p class="text-content">{{ $toMoney(data.planAmount) }} 元</p>
              </div>
            </div>
            <div class="item-content">
              <div class="text-container">
                <p class="text-title">确认日期</p>
                <p class="text-content">{{ $dateFormat(data.payDate) }}</p>
              </div>
              <div class="text-container">
                <p class="text-title">应收未收</p>
                <p class="text-content">{{ $toMoney(data.planAmount - data.receivable) }} 元</p>
              </div>
            </div>
            <div class="item-content">
              <div class="text-container">
                <p class="text-title">到期日</p>
                <p class="text-content">{{ $dateFormat(data.endDate) }}</p>
              </div>
              <div class="text-container">
                <p class="text-title">已收金额</p>
                <p class="text-content">{{ $toMoney(data.receivable) }} 元</p>
              </div>
            </div>
            <div class="item-content">
              <div class="text-container">
                <p class="text-title" style="height: 28px"></p>
                <p class="text-content"></p>
              </div>
              <div class="text-container">
                <p class="text-title">待核销金额</p>
                <p class="text-content">{{ data.uncheckMoney===null?'':$toMoney(data.uncheckMoney)+' 元' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Api_getCurrentReceivableAccounts } from "@/api/creditManagement/accountsReceivable/receiptRecords.js";

export default {
  name: "EnterprisePay",
  props: {
    payPlanId: { type: String, default: "" },
  },
  data() {
    return {
      isShowSituationBox: false,
      loading: false,
      data: {
        planType: null,
        planAmount: null,
        receivable: null,
        payDate: null,
        endDate: null,
        uncheckMoney: null,
      },
    };
  },
  watch: {
    payPlanId() {
      this.getInfo();
    },
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      if (!this.payPlanId) {
        return;
      }
      this.isShowSituationBox = true;
      this.loading = true;
      Api_getCurrentReceivableAccounts(this.payPlanId).then((res) => {
        this.loading = false;
        this.data = {
          planType: res.planType,
          planAmount: res.planAmount,
          receivable: res.receivable,
          payDate: res.payDate,
          endDate: res.endDate,
          uncheckMoney: res.uncheckMoney,
        };
        this.$nextTick(() => {
          this.$emit("setEndDate", res.endDate,res.payDate);
          this.$emit("getPlanAmount", res.planAmount, res.planAmount - res.receivable, res.planType, res.uncheckMoney);
          this.$emit("getConfirmDate", res.payDate);
          this.$emit("setEditPayAmount",res.registers[0]);
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding: 10px 0 20px;
  position: relative;

  .content {
    display: flex;
    background-color: #f5f7fa;
    border: 1px solid #eaedf4;

    .item {
      flex: 0 940px;
      padding: 16px 0 16px 16px;

      .title {
        font-size: 15px;
        color: #7caad6;
        font-weight: bold;
        margin-bottom: 15px;
      }

      .item-container {
        display: flex;

        .item-content {
          flex: 0 50%;
          padding-right: 16px;

          .text-container {
            display: flex;
            line-height: 28px;
            color: #7588a8;

            .text-title {
              flex: 0 80px;
              font-size: 13px;
            }

            .text-content {
              flex: 1;
              font-size: 13px;
            }
          }
        }
      }
    }

    .item-s {
      padding: 16px;
      flex: 0 110px;
      overflow: hidden;
      align-self: center;

      /deep/ .el-tabs__header {
        border-bottom: 0;
      }
    }

    .item:not(:first-child) {
      border-left: 1px solid #eaedf4;
    }
  }
}

/deep/ .el-timeline-item {
  padding-bottom: 8px;
}

/deep/ .el-timeline-item:last-child {
  padding-bottom: 0;
}

@keyframes heighter {
  from {
    height: 0;
  }
  to {
    height: 152px;
  }
}

.goHeighter {
  animation: heighter 0.3s forwards;
}

.animation {
  height: 0;
  overflow: hidden;
}
</style>
