<template>
  <div class="animation" :class="{'goHeighter': isShowSituationBox}">
    <div class="container" v-loading="loading">
      <div class="content" id="changflex">
        <div class="item" style="border: 1px solid #eef0f5">
          <div class="title">
            信用等级及授信情况
            <div class="title-left"></div>
            <div class="title-right"></div>
          </div>
          <div class="item-container">
            <div class="item-content">
              <div class="text-container">
                <p class="text-title">信用等级</p>
                <p class="text-content">{{ creditStatus.grade || '-' }}</p>
              </div>
              <div class="text-container">
                <p class="text-title">授信额度</p>
                <p class="text-content" style="display: flex">
                  <span
                    class="text-money"
                    style="color: #5e9dec; flex: 1"
                  >{{ creditStatus.fixedQuota===null?'-':$toMoney(creditStatus.fixedQuota, 2) }}</span>
                  <span style="flex: 0">元</span>
                </p>
              </div>
              <div class="text-container">
                <p class="text-title">临时授信额度</p>
                <p class="text-content" style="display: flex">
                  <span
                    class="text-money"
                    style="color: #5e9dec; flex: 1"
                  >{{ creditStatus.tempQuota===null?'-':$toMoney(creditStatus.tempQuota, 2) }}</span>
                  <span style="flex: 0">元</span>
                </p>
              </div>
            </div>
            <div class="item-content">
              <div class="text-container">
                <p class="text-title">已占用额度</p>
                <p class="text-content" style="display: flex">
                  <span
                    class="text-money"
                    style="color: #f29d38; flex: 1"
                  >{{ creditStatus.occupyQuota===null?'-':$toMoney(creditStatus.occupyQuota, 2) }}</span>
                  <span style="flex: 0">元</span>
                </p>
              </div>
              <div class="text-container">
                <p class="text-title">剩余可用额度</p>
                <p class="text-content" style="display: flex">
                  <span
                    class="text-money"
                    style="color: #8fc585; flex: 1"
                  >{{ creditStatus.availableQuoto===null?'-':$toMoney(creditStatus.availableQuoto, 2) }}</span>
                  <span style="flex: 0">元</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="item" style="border: 1px solid #eef0f5">
          <div class="title">
            当前客户付款履约情况
            <div class="title-left"></div>
            <div class="title-right"></div>
          </div>
          <div class="item-container">
            <div class="item-content">
              <div class="text-container">
                <p class="text-title">应收未收金额</p>
                <p class="text-content" style="display: flex">
                  <span
                    class="text-money"
                    style="color: #5e9dec; flex: 1"
                  >{{ currentCompliance.planAmount===null?'-':$toMoney(currentCompliance.planAmount,2) }}</span>
                  <span style="flex: 0">元</span>
                </p>
              </div>
              <div class="text-container">
                <p class="text-title">逾期金额</p>
                <p class="text-content" style="display: flex">
                  <span
                    class="text-money"
                    style="color: #d9544e; flex: 1"
                  >{{ currentCompliance.overdueMoney===null?'-':$toMoney(currentCompliance.overdueMoney,2) }}</span>
                  <span style="flex: 0">元</span>
                </p>
              </div>
              <div class="text-container">
                <p class="text-title">逾期笔数占比</p>
                <p class="text-content">
                  <span class="text-money" style="color: #d9544e; flex: 1">{{ currentCompliance.overdueSize }}</span>
                  <span
                    class="text-money"
                    style="color: #5e9dec; flex: 1"
                  >/{{currentCompliance.overdueSizeTotal}}</span>
                </p>
              </div>
            </div>
            <div class="item-content">
              <div class="text-container">
                <p class="text-title">最长逾期天数</p>
                <p class="text-content" style="display: flex">
                  <span
                    class="text-money"
                    style="color: #d9544e; flex: 1"
                  >{{ currentCompliance.overdueDay===null?'-':currentCompliance.overdueDay }}</span>
                  <span style="flex: 0">天</span>
                </p>
              </div>
              <div class="text-container">
                <p class="text-title">最大单笔逾期</p>
                <p class="text-content" style="display: flex">
                  <span
                    class="text-money"
                    style="color: #d9544e; flex: 1"
                  >{{ currentCompliance.maxOverdueMoney===null?'-':$toMoney(currentCompliance.maxOverdueMoney,2) }}</span>
                  <span style="flex: 0">元</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="JSON.stringify(zs.creditStatus)!=='{}'||JSON.stringify(cs.creditStatus)!=='{}'||JSON.stringify(fq.creditStatus)!=='{}'"
          class="item-s"
        >
          <el-timeline :reverse="true" style="margin-top: 12px">
            <el-timeline-item
              v-if="JSON.stringify(zs.creditStatus)!=='{}'"
              class="canClick"
              :type="nowState===4?'primary':''"
            >
              <span @click="changeState(4)">终审</span>
            </el-timeline-item>
            <el-timeline-item
              v-if="JSON.stringify(cs.creditStatus)!=='{}'"
              class="canClick"
              :type="nowState===3?'primary':''"
            >
              <span @click="changeState(3)">初审</span>
            </el-timeline-item>
            <el-timeline-item
              v-if="JSON.stringify(fq.creditStatus)!=='{}'"
              class="canClick"
              :type="nowState===2?'primary':''"
            >
              <span @click="changeState(2)">发起</span>
            </el-timeline-item>
            <el-timeline-item class="canClick" :type="nowState===1?'primary':''">
              <span @click="changeState(1)">实时</span>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Api_CreaditRating,
  Api_CurrentContractPayment
} from "@/api/creditManagement/contractManagement/contract.js";
import { Api_GetCreditHis } from "@/api/creditManagement/creditGranting/customer.js";

export default {
  name: "EnterpriseFile",
  props: {
    enterpriseID: { type: String, default: "" },
    stateID: { type: String, default: "" }
  },
  data() {
    return {
      isShowSituationBox: false,
      loading: false,
      creditStatus: {
        grade: null,
        fixedQuota: null,
        tempQuota: null,
        occupyQuota: null,
        availableQuoto: null
      },
      currentCompliance: {
        planAmount: null,
        overdueMoney: null,
        overdueSize: null,
        overdueSizeTotal: null,
        overdueDay: null,
        maxOverdueMoney: null
      },
      ss: { creditStatus: {}, currentCompliance: {} },
      cs: { creditStatus: {}, currentCompliance: {} },
      zs: { creditStatus: {}, currentCompliance: {} },
      fq: { creditStatus: {}, currentCompliance: {} },
      nowState: 1
    };
  },
  watch: {
    enterpriseID() {
      this.getInfo();
    },
    stateID() {
      this.getInfo();
    }
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      if (!this.enterpriseID) {
        return;
      }
      this.isShowSituationBox = true;
      this.$nextTick(() => {
        setTimeout(() => {
          this.$emit("show");
        }, 350);
      });
      this.loading = true;
      Api_CreaditRating(this.enterpriseID).then(res => {
        this.loading = false;
        this.ss.creditStatus = {
          grade: res.grade,
          fixedQuota: res.fixedQuota,
          tempQuota: res.tempQuota,
          occupyQuota: res.occupyQuota,
          availableQuoto: res.availableQuoto
        };
        this.creditStatus = { ...this.ss.creditStatus };
        this.$emit("getPeriod", res.creditPeriod);
        this.$emit("getAvailableCredit", res.availableQuoto);
      });
      Api_CurrentContractPayment(this.enterpriseID).then(res => {
        this.ss.currentCompliance = {
          planAmount: res.planAmount,
          overdueMoney: res.overdueMoney,
          overdueSize: res.overdueSize,
          overdueSizeTotal: res.overdueSizeTotal,
          overdueDay: res.overdueDay,
          maxOverdueMoney: res.maxOverdueMoney
        };
        this.currentCompliance = { ...this.ss.currentCompliance };
      });
      if (this.stateID) {
        Api_GetCreditHis(this.stateID).then(res => {
          // fq
          this.fq.creditStatus = res.fqs.id ? { ...JSON.parse(res.fqs.text).var1 } : {};
          this.fq.currentCompliance = res.fqs.id ? { ...JSON.parse(res.fqs.text).var2 } : {};
          // cs
          this.cs.creditStatus = res.css.id ? { ...JSON.parse(res.css.text).var1 } : {};
          this.cs.currentCompliance = res.css.id ? { ...JSON.parse(res.css.text).var2 } : {};
          // zs
          this.zs.creditStatus = res.zss.id ? { ...JSON.parse(res.zss.text).var1 } : {};
          this.zs.currentCompliance = res.zss.id ? { ...JSON.parse(res.zss.text).var2 } : {};
        });
      }
    },
    changeState(val) {
      this.nowState = val;
      if (val === 1) {
        this.creditStatus = { ...this.ss.creditStatus };
        this.currentCompliance = { ...this.ss.currentCompliance };
      } else if (val === 2) {
        this.creditStatus = { ...this.fq.creditStatus };
        this.currentCompliance = { ...this.fq.currentCompliance };
      } else if (val === 3) {
        this.creditStatus = { ...this.cs.creditStatus };
        this.currentCompliance = { ...this.cs.currentCompliance };
      } else if (val === 4) {
        this.creditStatus = { ...this.zs.creditStatus };
        this.currentCompliance = { ...this.zs.currentCompliance };
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  padding: 10px 0 20px;
  position: relative;

  .content {
    display: flex;
    background-color: #f5f7fa;
    padding: 12px 16px 12px 0;

    .item {
      flex: 1;
      margin-left: 16px;
      padding: 16px;
      background-color: #fdfdfe;

      .title {
        font-size: 16px;
        color: #333;
        font-weight: bold;
        margin-bottom: 10px;
        text-align: center;
        color: #5e9dec;
        line-height: 33px;
        position: relative;

        .title-left {
          position: absolute;
          height: 2px;
          width: 115px;
          background: linear-gradient(to left, #a1c6f2, #f7f8f9);
          left: 15px;
          top: 16px;
        }

        .title-right {
          position: absolute;
          height: 2px;
          width: 115px;
          background: linear-gradient(to left, #f7f8f9, #a1c6f2);
          right: 15px;
          top: 16px;
        }
      }

      .item-container {
        display: flex;

        .item-content {
          flex: 0 50%;

          .text-container {
            display: flex;
            line-height: 33px;
            color: #606266;

            .text-title {
              flex: 0 96px;
              font-size: 13px;
              text-align: right;
              padding-right: 6px;
            }

            .text-content {
              flex: 1;
              font-size: 13px;
              padding-left: 6px;

              .text-money {
                font-weight: bold;
                font-style: italic;
                font-size: 16px;
              }
            }
          }
        }

        .item-content:first-child {
          padding-right: 10px;
        }

        .item-content:last-child {
          padding-left: 10px;
        }
      }
    }

    .item-s {
      padding: 16px 0 16px 16px;
      flex: 0 92px;
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
    height: 231px;
  }
}

.goHeighter {
  animation: heighter 0.3s forwards;
}

.animation {
  height: 0;
  overflow: hidden;
}
.item:hover {
  border: 1px solid #8ab8f0 !important;
}
</style>
