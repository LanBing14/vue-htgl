<template>
  <div class="wrap">
    <div style="display: flex">
      <div class="flex-primary" style="padding-right: 10px">
        <section class="area1">
          <div class="title">
            <h3 class="title-name">整体应收情况</h3>
            <router-link :to="{name: 'receivablesReport'}" class="action-btn">详情>></router-link>
          </div>
          <el-row :gutter="20" class="con con1">
            <el-col :span="6">
              <div class="item item1">
                <h5>应收未收金额</h5>
                <h1 class="flex" style="color: #2b84dd">
                  <el-tooltip
                    :content="$toMoney(overallReceivables.oweMoney)+'元'"
                    :disabled="disabledTooltip1"
                    placement="top"
                  >
                    <span ref="money1" class="ellipsis">
                      {{ $toMoney(overallReceivables.oweMoney) }}
                      <span class="unit">元</span>
                    </span>
                  </el-tooltip>
                </h1>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="item item2">
                <h5>账期内金额</h5>
                <h1 class="flex" style="color: #e6a23c">
                  <el-tooltip
                    :content="$toMoney(overallReceivables.undueMoney)+'元'"
                    :disabled="disabledTooltip2"
                    placement="top"
                  >
                    <span ref="money2" class="ellipsis">
                      {{ $toMoney(overallReceivables.undueMoney) }}
                      <span class="unit">元</span>
                    </span>
                  </el-tooltip>
                </h1>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="item item3">
                <h5>逾期金额</h5>
                <h1 class="flex" style="color: #67c23a">
                  <el-tooltip
                    :content="$toMoney(overallReceivables.overdueMoney)+'元'"
                    :disabled="disabledTooltip3"
                    placement="top"
                  >
                    <span ref="money3" class="ellipsis">
                      {{ $toMoney(overallReceivables.overdueMoney) }}
                      <span class="unit">元</span>
                    </span>
                  </el-tooltip>
                </h1>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="item item4">
                <h5>180+天逾期金额</h5>
                <h1 class="flex" style="color: #409eff">
                  <el-tooltip
                    :content="$toMoney(overallReceivables.daysOverdueAmount)+'元'"
                    :disabled="disabledTooltip4"
                    placement="top"
                  >
                    <span ref="money4" class="ellipsis">
                      {{ $toMoney(overallReceivables.daysOverdueAmount) }}
                      <span class="unit">元</span>
                    </span>
                  </el-tooltip>
                </h1>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="item item5">
                <h5>客户授信总额</h5>
                <h1 class="flex" style="color: #67c23a">
                  <el-tooltip
                    :content="$toMoney(overallReceivables.creditQuota)+'元'"
                    :disabled="disabledTooltip5"
                    placement="top"
                  >
                    <span ref="money5" class="ellipsis">
                      {{ $toMoney(overallReceivables.creditQuota) }}
                      <span class="unit">元</span>
                    </span>
                  </el-tooltip>
                </h1>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="item item6">
                <h5>当前占用总额</h5>
                <h1 class="flex" style="color: #2b84dd">
                  <el-tooltip
                    :content="$toMoney(overallReceivables.occupyQuota)+'元'"
                    :disabled="disabledTooltip6"
                    placement="top"
                  >
                    <span ref="money6" class="ellipsis">
                      {{ $toMoney(overallReceivables.occupyQuota) }}
                      <span class="unit">元</span>
                    </span>
                  </el-tooltip>
                </h1>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="item item7">
                <h5>应收周转天数</h5>
                <h1 class="flex" style="color: #409eff">
                  <el-tooltip
                    :content="overallReceivables.turnDay===null?'-':String(parseInt(overallReceivables.turnDay))"
                    :disabled="disabledTooltip7"
                    placement="top"
                  >
                    <span ref="money7" class="ellipsis">
                      {{ overallReceivables.turnDay===null?'-':parseInt(overallReceivables.turnDay) }}
                      <span
                        class="unit"
                      >天</span>
                    </span>
                  </el-tooltip>
                </h1>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="item item8">
                <h5>平均信用账期</h5>
                <h1 class="flex" style="color: #2b84dd">
                  <el-tooltip
                    :content="overallReceivables.averagePayDay===null?'-':String(parseInt(overallReceivables.averagePayDay))"
                    :disabled="disabledTooltip8"
                    placement="top"
                  >
                    <span ref="money8" class="ellipsis">
                      {{ overallReceivables.averagePayDay===null?'-':parseInt(overallReceivables.averagePayDay) }}
                      <span
                        class="unit"
                      >天</span>
                    </span>
                  </el-tooltip>
                </h1>
              </div>
            </el-col>
          </el-row>
        </section>
      </div>
      <div class="right-content">
        <section class="right-area flex col">
          <div class="title">
            <h3 class="title-name">应收账龄分布</h3>
            <router-link :to="{name: 'customerAnalysis'}" class="action-btn">详情>></router-link>
          </div>
          <div class="con con2 flex-primary">
            <EchartsModelIns modelId="TB-2004-00002" :query="query1"></EchartsModelIns>
          </div>
        </section>
      </div>
    </div>
    <div style="display: flex; margin-top: 15px">
      <div class="flex-primary" style="padding-right: 10px">
        <section class="flex-primary area3 flex col">
          <div class="title">
            <h3 class="title-name">应收账款趋势</h3>
            <!--                        <span class="action-btn">详情>></span>-->
          </div>
          <div class="con con3 flex-primary">
            <EchartsModelIns modelId="TB-2004-00001" :query="query2"></EchartsModelIns>
          </div>
        </section>
        <el-row :gutter="20">
          <el-col :span="8">
            <section class="flex col area4">
              <div class="title">
                <h3 class="title-name">应收周转天数趋势</h3>
                <router-link :to="{name: 'receivablesTurnover'}" class="action-btn">详情>></router-link>
              </div>
              <div class="con con4 flex-primary">
                <EchartsModelIns modelId="TB-2004-00003" :query="query3"></EchartsModelIns>
              </div>
            </section>
          </el-col>
          <el-col :span="8">
            <section class="flex col area5">
              <div class="title">
                <h3 class="title-name">平均信用账期趋势</h3>
                <router-link :to="{name: 'receivablesTurnover'}" class="action-btn">详情>></router-link>
              </div>
              <div class="con con5 flex-primary">
                <EchartsModelIns modelId="TB-2004-00004" :query="query4"></EchartsModelIns>
              </div>
            </section>
          </el-col>
          <el-col :span="8">
            <section class="flex col area6">
              <div class="title">
                <h3 class="title-name">平均拖欠天数趋势</h3>
                <router-link :to="{name: 'receivablesTurnover'}" class="action-btn">详情>></router-link>
              </div>
              <div class="con con6 flex-primary">
                <EchartsModelIns modelId="TB-2004-00005" :query="query5"></EchartsModelIns>
              </div>
            </section>
          </el-col>
        </el-row>
      </div>
      <div class="right-content">
        <section class="right-area area7">
          <div class="title">
            <h3 class="title-name flex-primary">客户应收top10</h3>
            <div class="title-action-tip">单位：元</div>
          </div>
          <div class="con con7">
            <el-table :data="tableData1" stripe>
              <el-table-column label="排名" width="80" align="center">
                <template slot-scope="scope">
                  <span
                    :class="{['ph-color'+ (scope.$index + 1)]: scope.$index<3}"
                    class="ph-color"
                  >{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column label="客户名称" prop="companyName" class-name="title-name" show-overflow-tooltip>
                <!--                                <template slot-scope="scope">-->
                <!--                                    <span class="canClick" @click="$gotoReceivablesDetail()">{{ scope.row.companyName }}</span>-->
                <!--                                </template>-->
              </el-table-column>
              <el-table-column label="应收账款金额" prop="oweMoney" width="130" align="right">
                <template slot-scope="scope">{{ $toMoney(scope.row.oweMoney) }}</template>
              </el-table-column>
            </el-table>
          </div>
        </section>
      </div>
    </div>
    <div style="display: flex; margin-top: 15px">
      <div class="flex-primary" style="padding-right: 10px">
        <el-row :gutter="20" class="row">
          <el-col :span="12">
            <section class="area8 flex col">
              <div class="title">
                <h3 class="title-name flex-primary">预期应收分布情况</h3>
                <router-link :to="{name: 'warningReport'}" class="action-btn">详情>></router-link>
              </div>
              <div class="con con8 flex-primary">
                <EchartsModelIns modelId="TB-2004-00006" :query="query6"></EchartsModelIns>
              </div>
            </section>
          </el-col>
          <el-col :span="12">
            <section class="area9 flex col">
              <div class="title">
                <h3 class="title-name flex-primary">逾期应收分布情况</h3>
                <router-link :to="{name: 'overdueReport'}" class="action-btn">详情>></router-link>
              </div>
              <div class="con con9 flex-primary">
                <EchartsModelIns modelId="TB-2004-00007" :query="query7"></EchartsModelIns>
              </div>
            </section>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="row">
          <el-col>
            <section class="area10 flex col">
              <div class="title">
                <h3 class="title-name flex-primary">客户信用预警分析</h3>
                <router-link :to="{name: 'creditAlert'}" class="action-btn">详情>></router-link>
              </div>
              <div class="con con10 flex-primary flex">
                <div class="flex-primary flex col">
                  <EchartsModelIns :query="query8" modelId="TB-2004-00008" class="flex-primary"></EchartsModelIns>
                  <div style="text-align: center">额度占用预警</div>
                </div>
                <div class="flex-primary flex col">
                  <EchartsModelIns :query="query9" modelId="TB-2004-00009" class="flex-primary"></EchartsModelIns>
                  <div style="text-align: center">逾期额度预警</div>
                </div>
                <div class="flex-primary flex col">
                  <EchartsModelIns :query="query10" modelId="TB-2004-00010" class="flex-primary"></EchartsModelIns>
                  <div style="text-align: center">逾期天数预警</div>
                </div>
              </div>
            </section>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="row">
          <el-col :span="12">
            <section class="area11 flex col">
              <div class="title">
                <h3 class="title-name flex-primary">客户授信趋势</h3>
                <router-link :to="{name: 'creditAnalysis'}" class="action-btn">详情>></router-link>
              </div>
              <div class="con con11 flex-primary">
                <EchartsModelIns modelId="TB-2004-00011" :query="query11"></EchartsModelIns>
              </div>
            </section>
          </el-col>
          <el-col :span="12">
            <section class="area12 flex col">
              <div class="title">
                <h3 class="title-name flex-primary">客户用信趋势</h3>
                <router-link :to="{name: 'letterAnalysis'}" class="action-btn">详情>></router-link>
              </div>
              <div class="con con12 flex-primary">
                <EchartsModelIns modelId="TB-2004-00012" :query="query12"></EchartsModelIns>
              </div>
            </section>
          </el-col>
        </el-row>
        <el-row>
          <section class="area13 flex col">
            <div class="title">
              <h3 class="title-name flex-primary">授信申请分析</h3>
              <router-link :to="{name: 'applicationAnalysis'}" class="action-btn">详情>></router-link>
            </div>
            <div class="con con13">
              <el-row :gutter="20">
                <el-col :span="8">
                  <div class="flex item">
                    <div class="l">
                      <EchartsModelIns modelId="TB-2004-00013" :query="query13"></EchartsModelIns>
                    </div>
                    <div class="r flex-primary">
                      <h3>
                        <span class="n">{{ creditApplicationAnalysis.a }}</span>
                        <span class="u">条</span>
                      </h3>
                      <p class="t">信管人员申请数</p>
                    </div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="flex item">
                    <div class="l">
                      <EchartsModelIns modelId="JG-2004-00001" :query="query14"></EchartsModelIns>
                    </div>
                    <div class="r flex-primary">
                      <h3>
                        <span class="n">{{ creditApplicationAnalysis.b }}</span>
                        <span class="u">条</span>
                      </h3>
                      <p class="t">初审记录数</p>
                    </div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="flex item">
                    <div class="l">
                      <EchartsModelIns modelId="JG-2004-00002" :query="query15"></EchartsModelIns>
                    </div>
                    <div class="r flex-primary">
                      <h3>
                        <span class="n">{{ creditApplicationAnalysis.c }}</span>
                        <span class="u">条</span>
                      </h3>
                      <p class="t">终审记录数</p>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </section>
        </el-row>
      </div>
      <div class="right-content">
        <div>
          <section class="right-area area14">
            <div class="title">
              <h3 class="title-name">客户逾期top10</h3>
              <div class="title-action-tip">单位：元</div>
            </div>
            <div class="con con2">
              <el-table :data="tableData2" stripe>
                <el-table-column label="排名" width="80" align="center">
                  <template slot-scope="scope">
                    <span
                      :class="{['ph-color'+ (scope.$index + 1)]: scope.$index<3}"
                      class="ph-color"
                    >{{ scope.$index + 1 }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="客户名称" prop="companyName" class-name="title-name">
                  <template slot-scope="scope">
                    <span class="canClick" @click="goOverdueReport(scope.row)">{{ scope.row.companyName }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="逾期账款金额" prop="overdueMoney" width="130" align="right"></el-table-column>
              </el-table>
            </div>
          </section>
          <section class="right-area area15">
            <div class="title">
              <h3 class="title-name">客户授信集中度</h3>
              <div class="title-action-tip">单位：元</div>
              <router-link :to="{name: 'creditAlert'}" class="action-btn" style="margin-left: 15px;">详情>></router-link>
            </div>
            <div class="con con2">
              <el-table :data="tableData3" :span-method="spanMethod3" stripe class="table3">
                <el-table-column label="排名" width="80" align="center">
                  <template slot-scope="scope">
                    <span
                      :class="{['ph-color'+ (scope.$index + 1)]: scope.$index<3}"
                      class="ph-color"
                    >{{ scope.$index + 1 }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="客户名称" prop="key1">
                  <template slot-scope="scope">
                    <div class="flex">
                      <span
                        class="flex-primary title-name"
                        @click="$gotoCustomerDetail(scope.row.id)"
                      >{{ scope.row.companyName }}</span>
                      <span style="width: 100px;text-align: right">{{ scope.row.creditQuota }}</span>
                    </div>
                    <div class="bar-wrap">
                      <div class="bar-inner" :style="{'width': scope.row.percent+'%'}"></div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="授信比例" prop="creditQuota" width="100" align="right"></el-table-column>
              </el-table>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { addResizeListener, removeResizeListener } from "@/utils/resize-event";
import EchartsModelIns from "@/components/EchartsModelIns";
import {
  Api_situationStatisticsOverMoney,
  Api_situationStatisticsOweMoney,
  Api_situationStatisticsOverdueMoneyTop,
  Api_situationStatisticsCreditCrn,
  Api_situationStatisticsCreditApply,
} from "@/api/creditManagement/statisticsAnalysis/statisticsOverview.js";
import { Api_ReportStatistics } from "@/api/creditManagement/statisticsAnalysis/receivablesReport.js";
import { Api_GetWarningStatistics } from "@/api/creditManagement/statisticsAnalysis/statisticsAnalysis.js";
import { Api_turnoverReportStatistics } from "@/api/creditManagement/statisticsAnalysis/receivablesTurnover.js";

export default {
  name: "StatisticsOverview",
  components: {
    EchartsModelIns,
  },
  data() {
    return {
      overallReceivables: {
        turnDay: null,
        averagePayDay: null,
        creditQuota: null,
        occupyQuota: null,
        oweMoney: null,
        undueMoney: null,
        overdueMoney: null,
        daysOverdueAmount: null,
      },
      creditApplicationAnalysis: {
        a: null,
        b: null,
        c: null,
      },
      query1: {},
      query2: {},
      query3: {},
      query4: {},
      query5: {},
      query6: {},
      query7: {},
      query8: {},
      query9: {},
      query10: {},
      query11: {},
      query12: {},
      query13: {},
      query14: {},
      query15: {},
      tableData1: [],
      tableData2: [],
      tableData3: [],
      time1: "",
      disabledTooltip1: true,
      disabledTooltip2: true,
      disabledTooltip3: true,
      disabledTooltip4: true,
      disabledTooltip5: true,
      disabledTooltip6: true,
      disabledTooltip7: true,
      disabledTooltip8: true,
    };
  },
  mounted() {
    this.getOverallReceivables();
    this.getSituationStatisticsOweMoney();
    this.getSituationStatisticsOverdueMoneyTop();
    this.getSituationStatisticsCreditCrn();
    this.getSituationStatisticsCreditApply();
    this.$nextTick(() => {
      addResizeListener(this.$refs.money1, this.setTooltipDisabled.bind(this, "money1", "disabledTooltip1"));
      addResizeListener(this.$refs.money2, this.setTooltipDisabled.bind(this, "money2", "disabledTooltip2"));
      addResizeListener(this.$refs.money3, this.setTooltipDisabled.bind(this, "money3", "disabledTooltip3"));
      addResizeListener(this.$refs.money4, this.setTooltipDisabled.bind(this, "money4", "disabledTooltip4"));
      addResizeListener(this.$refs.money5, this.setTooltipDisabled.bind(this, "money5", "disabledTooltip5"));
      addResizeListener(this.$refs.money6, this.setTooltipDisabled.bind(this, "money6", "disabledTooltip6"));
      addResizeListener(this.$refs.money7, this.setTooltipDisabled.bind(this, "money7", "disabledTooltip7"));
      addResizeListener(this.$refs.money8, this.setTooltipDisabled.bind(this, "money8", "disabledTooltip8"));
    });
  },
  beforeDestory() {
    removeResizeListener(this.$refs.money1, this.setTooltipDisabled);
    removeResizeListener(this.$refs.money2, this.setTooltipDisabled);
    removeResizeListener(this.$refs.money3, this.setTooltipDisabled);
    removeResizeListener(this.$refs.money4, this.setTooltipDisabled);
    removeResizeListener(this.$refs.money5, this.setTooltipDisabled);
    removeResizeListener(this.$refs.money6, this.setTooltipDisabled);
    removeResizeListener(this.$refs.money7, this.setTooltipDisabled);
    removeResizeListener(this.$refs.money8, this.setTooltipDisabled);
  },
  methods: {
    setTooltipDisabled(ref, disabled) {
      const container = this.$refs[ref];
      if (!container) return;
      const trueWidth = container.scrollWidth;
      const { width } = container.getBoundingClientRect();
      this[disabled] = trueWidth <= Math.ceil(width);
    },
    getOverallReceivables() {
      Api_situationStatisticsOverMoney().then((res) => {
        this.overallReceivables.daysOverdueAmount = res;
      });
      Api_ReportStatistics().then((res) => {
        this.overallReceivables.oweMoney = res.oweMoney;
        this.overallReceivables.undueMoney = res.undueMoney;
        this.overallReceivables.overdueMoney = res.overdueMoney;
      });
      Api_GetWarningStatistics().then((res) => {
        this.overallReceivables.creditQuota = res.creditQuota;
        this.overallReceivables.occupyQuota = res.occupyQuota;
      });
      Api_turnoverReportStatistics().then((res) => {
        this.overallReceivables.turnDay = res.turnDay;
        this.overallReceivables.averagePayDay = res.averagePayDay;
      });
    },
    getSituationStatisticsOweMoney() {
      Api_situationStatisticsOweMoney().then((res) => {
        this.tableData1 = res;
      });
    },
    getSituationStatisticsOverdueMoneyTop() {
      Api_situationStatisticsOverdueMoneyTop().then((res) => {
        this.tableData2 = res;
      });
    },
    getSituationStatisticsCreditCrn() {
      Api_situationStatisticsCreditCrn().then((res) => {
        this.tableData3 = res;
      });
    },
    getSituationStatisticsCreditApply() {
      Api_situationStatisticsCreditApply(1).then((res) => {
        this.creditApplicationAnalysis.a = res[1];
      });
      Api_situationStatisticsCreditApply(2).then((res) => {
        this.creditApplicationAnalysis.b = res[1];
      });
      Api_situationStatisticsCreditApply(3).then((res) => {
        this.creditApplicationAnalysis.c = res[1];
      });
    },
    spanMethod3({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        return [1, 2];
      } else if (columnIndex === 2) {
        return [0, 0];
      }
    },
    // 跳转"逾期就收报表"
    goOverdueReport(row) {
      this.$router.push({
        name: "overdueReport",
        query: {
          companyName: row.companyName,
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
/*@import '~@/styles/element-variables.scss';*/
$--color-primary: #4b9df3;
.wrap {
  background-color: #f7f8fa;
  padding: 0 !important;

  .flex-primary {
    flex: 1;
  }

  .row {
    margin-bottom: 20px;

    &.row2 {
      height: 644px;
    }
  }

  .row:last-child {
    margin-bottom: 0;
  }

  section {
    padding: 0 0 20px;
    background-color: #fff;

    &.right-area {
      height: 100%;

      .con {
        padding-left: 30px;
        padding-right: 30px;
      }

      .title {
        margin-bottom: 20px;
      }
    }

    &.area3 {
      margin-bottom: 20px;
    }

    &.area4,
    &.area5,
    &.area6 {
      height: 245px;
    }

    &.area8,
    &.area9,
    &.area10,
    &.area11,
    &.area12 {
      height: 379px;
    }

    &.area13 {
      padding-bottom: 30px;

      .title {
        /*margin-bottom: 10px;*/
      }
    }

    &.area14,
    &.area15 {
      height: 644px;
    }

    &.area15 {
      margin-top: 20px;
      height: 775px;
    }

    .title {
      padding: 26px 30px 18px;
      display: flex;
      /*line-height: 35px;*/

      .title-name {
        font-size: 16px;
        color: #333333;
        padding-left: 19px;
        position: relative;

        &::before {
          content: "";
          display: inline-block;
          position: absolute;
          left: 0;
          top: 50%;
          margin-top: -10px;
          width: 4px;
          height: 20px;
          background-color: $--color-primary;
        }
      }

      .action-btn {
        cursor: pointer;
        font-size: 13px;
        color: $--color-primary;
        margin-left: auto;
      }

      .title-action-tip {
        margin-left: auto;
        font-size: 12px;
        color: #999999;
      }
    }

    .con {
      &.con1 {
        padding: 0 30px;

        .unit {
          font-size: 15px;
          vertical-align: text-bottom;
        }

        .item {
          padding: 22px 0 34px 19px;
          margin-top: 10px;
          margin-bottom: 10px;

          h1 {
            font-size: 25px;
            margin: 0;
            line-height: 24px;
          }

          h5 {
            font-size: 14px;
            margin-bottom: 38px;
          }

          &.item1,
          &.item6,
          &.item8 {
            background: url("~@/assets/images/creditManagement/light-purple.png") no-repeat 0 / cover;
          }

          &.item2 {
            background: url("~@/assets/images/creditManagement/light-yellow.png") no-repeat 0 / cover;
          }

          &.item3,
          &.item5 {
            background: url("~@/assets/images/creditManagement/light-green.png") no-repeat 0 / cover;
          }

          &.item4,
          &.item7 {
            background: url("~@/assets/images/creditManagement/light-blue.png") no-repeat 0 / cover;
          }
        }
      }

      &.con3 {
        /*height: 100%;*/
      }

      &.con13 {
        padding: 0 30px;

        .item {
          height: 150px;
          display: flex;

          .l {
            width: 40%;
            background-color: #eaedf4;
          }

          .r {
            background-color: #f7f8f9;
            text-align: right;
            padding-right: 10%;
            padding-bottom: 25px;
            color: #606266;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;

            .n {
              font-size: 20px;
            }

            .u {
              font-size: 12px;
              margin-left: 5px;
            }

            .t {
              margin-top: 15px;
              color: #606266;
            }
          }
        }
      }
    }
  }

  /deep/ .el-table {
    .ph-color {
      display: inline-block;
      width: 18px;
      height: 18px;
      line-height: 18px;
      text-align: center;
      border-radius: 3px;

      &.ph-color1 {
        background-color: rgba(253, 104, 113, 1);
        color: #fff;
      }

      &.ph-color2 {
        background-color: rgba(248, 155, 55, 1);
        color: #fff;
      }

      &.ph-color3 {
        background-color: rgba(244, 214, 15, 1);
        color: #fff;
      }
    }

    .bar-wrap {
      margin-top: 10px;
      margin-bottom: 3px;
      background-color: rgba(234, 237, 244, 1);
      height: 5px;
      border-radius: 2px;

      .bar-inner {
        width: 0;
        transition: all 0.2s;
        background-color: rgba(132, 202, 255, 1);
        height: 5px;
        border-radius: 2px;
      }
    }

    &.table3 {
      td {
        vertical-align: top;
      }
    }

    &::before {
      content: none;
    }

    tbody .title-name {
      color: rgba(132, 202, 255, 1);
    }
  }
}

.right-content {
  flex: 0 480px;
  padding-left: 10px;
}
</style>
