<template>
  <div class="container">
    <div class="content">
      <section class="section-container">
        <div class="title">
          <h3 class="title-name">整体应收情况</h3>
          <router-link :to="{name: 'receivablesReport'}" class="action-btn canClick">详情>></router-link>
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
                    <span class="unit">¥</span>
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
                    <span class="unit">¥</span>
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
                    <span class="unit">¥</span>
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
                    <span class="unit">¥</span>
                    {{ $toMoney(overallReceivables.daysOverdueAmount) }}
                    <span
                      class="unit"
                    >元</span>
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
                    <span class="unit">¥</span>
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
                    <span class="unit">¥</span>
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
      <section class="section-container">
        <div class="title">
          <h3 class="title-name">应收账款趋势</h3>
        </div>
        <div class="con con3 flex-primary">
          <EchartsModelIns modelId="TB-2004-00001" :query="query2" style="height: 200px"></EchartsModelIns>
        </div>
      </section>
      <div class="flex-container">
        <div class="flex-content">
          <section class="section-container">
            <div class="title">
              <h3 class="title-name">应收周转天数趋势</h3>
              <router-link :to="{name: 'receivablesTurnover'}" class="action-btn canClick">详情>></router-link>
            </div>
            <div class="con con4 flex-primary">
              <EchartsModelIns modelId="TB-2004-00003" :query="query3" style="height: 150px"></EchartsModelIns>
            </div>
          </section>
        </div>
        <div class="flex-content">
          <section class="section-container">
            <div class="title">
              <h3 class="title-name">平均信用账期趋势</h3>
              <router-link :to="{name: 'receivablesTurnover'}" class="action-btn canClick">详情>></router-link>
            </div>
            <div class="con con5 flex-primary">
              <EchartsModelIns modelId="TB-2004-00004" :query="query4" style="height: 150px"></EchartsModelIns>
            </div>
          </section>
        </div>
        <div class="flex-content">
          <section class="section-container">
            <div class="title">
              <h3 class="title-name">平均拖欠天数趋势</h3>
              <router-link :to="{name: 'receivablesTurnover'}" class="action-btn canClick">详情>></router-link>
            </div>
            <div class="con con6 flex-primary">
              <EchartsModelIns modelId="TB-2004-00005" :query="query5" style="height: 150px"></EchartsModelIns>
            </div>
          </section>
        </div>
      </div>
      <div class="flex-container">
        <div class="flex-content">
          <section class="section-container">
            <div class="title">
              <h3 class="title-name flex-primary">预期应收分布情况</h3>
              <router-link :to="{name: 'warningReport'}" class="action-btn canClick">详情>></router-link>
            </div>
            <div class="con con8 flex-primary">
              <EchartsModelIns modelId="TB-2004-00006" :query="query6" style="height: 200px"></EchartsModelIns>
            </div>
          </section>
        </div>
        <div class="flex-content">
          <section class="section-container">
            <div class="title">
              <h3 class="title-name flex-primary">逾期应收分布情况</h3>
              <router-link :to="{name: 'overdueReport'}" class="action-btn canClick">详情>></router-link>
            </div>
            <div class="con con9 flex-primary">
              <EchartsModelIns modelId="TB-2004-00007" :query="query7" style="height: 200px"></EchartsModelIns>
            </div>
          </section>
        </div>
      </div>
      <section class="section-container">
        <div class="title">
          <h3 class="title-name flex-primary">客户信用预警分析</h3>
          <router-link :to="{name: 'creditAlert'}" class="action-btn canClick">详情>></router-link>
        </div>
        <div class="con con10 flex-primary flex">
          <div class="flex-primary flex col">
            <EchartsModelIns
              :query="query8"
              modelId="TB-2004-00008"
              class="flex-primary"
              style="height: 100px"
            ></EchartsModelIns>
            <div style="text-align: center;padding-top: 8px;">额度占用预警</div>
          </div>
          <div class="flex-primary flex col">
            <EchartsModelIns
              :query="query9"
              modelId="TB-2004-00009"
              class="flex-primary"
              style="height: 100px"
            ></EchartsModelIns>
            <div style="text-align: center;padding-top: 8px;">逾期额度预警</div>
          </div>
          <div class="flex-primary flex col">
            <EchartsModelIns
              :query="query10"
              modelId="TB-2004-00010"
              class="flex-primary"
              style="height: 100px"
            ></EchartsModelIns>
            <div style="text-align: center;padding-top: 8px;">逾期天数预警</div>
          </div>
        </div>
      </section>
      <div class="flex-container">
        <div class="flex-content">
          <section class="section-container">
            <div class="title">
              <h3 class="title-name flex-primary">客户授信趋势</h3>
              <router-link :to="{name: 'creditAnalysis'}" class="action-btn canClick">详情>></router-link>
            </div>
            <div class="con con11 flex-primary">
              <EchartsModelIns modelId="TB-2004-00011" :query="query11" style="height: 200px"></EchartsModelIns>
            </div>
          </section>
        </div>
        <div class="flex-content">
          <section class="section-container">
            <div class="title">
              <h3 class="title-name flex-primary">客户用信趋势</h3>
              <router-link :to="{name: 'letterAnalysis'}" class="action-btn canClick">详情>></router-link>
            </div>
            <div class="con con12 flex-primary">
              <EchartsModelIns modelId="TB-2004-00012" :query="query12" style="height: 200px"></EchartsModelIns>
            </div>
          </section>
        </div>
      </div>
      <section class="section-container">
        <div class="title">
          <h3 class="title-name flex-primary">授信申请分析</h3>
          <router-link :to="{name: 'applicationAnalysis'}" class="action-btn canClick">详情>></router-link>
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
      <div class="flex-container">
        <div class="flex-content">
          <section class="section-container" style="height: 100%">
            <div class="title">
              <h3 class="title-name flex-primary">
                客户应收top10
                <span class="title-action-tip">(单位：元)</span>
              </h3>
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
                <!-- <el-table-column
                  label="客户名称"
                  prop="companyName"
                  class-name="title-name"
                  show-overflow-tooltip
                ></el-table-column> -->


                <el-table-column                    
                  label="客户名称"
                  prop="companyName"
                  show-overflow-tooltip
                  class-name="title-name">
                    <template slot-scope="scope">
                      <span class="canClick" @click="goReceivablesReport(scope.row)">{{ scope.row.companyName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="应收账款金额" prop="oweMoney" width="130" align="right">
                  <template slot-scope="scope">{{ $toMoney(scope.row.oweMoney) }}</template>
                </el-table-column>
              </el-table>
            </div>
          </section>
        </div>
        <div class="flex-content">
          <section class="section-container" style="height: 100%">
            <div class="title">
              <h3 class="title-name">
                客户逾期top10
                <span class="title-action-tip">(单位：元)</span>
              </h3>
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
                <el-table-column
                  label="客户名称"
                  prop="companyName"
                  show-overflow-tooltip
                  class-name="title-name"
                >
                  <template slot-scope="scope">
                    <span class="canClick" @click="goOverdueReport(scope.row)">{{ scope.row.companyName }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="逾期账款金额" prop="overdueMoney" width="130" align="right">
                  <template slot-scope="scope">{{$toMoney(scope.row.overdueMoney)}}</template>
                </el-table-column>
              </el-table>
            </div>
          </section>
        </div>
        <div class="flex-content">
          <section class="section-container" style="height: 100%">
            <div class="title">
              <h3 class="title-name">
                客户授信集中度
                <span class="title-action-tip">(单位：元)</span>
              </h3>

              <router-link
                :to="{name: 'creditAlert'}"
                class="action-btn canClick"
                style="margin-left: 15px;"
              >详情>></router-link>
            </div>
            <div class="con con2">
              <el-table :data="tableData3"  stripe class="table3">
                <el-table-column label="排名" width="80" align="center">
                  <template slot-scope="scope">
                    <span
                      :class="{['ph-color'+ (scope.$index + 1)]: scope.$index<3}"
                      class="ph-color"
                    >{{ scope.$index + 1 }}</span>
                  </template>
                </el-table-column>



                <!-- <el-table-column label="客户名称"   prop="key1" show-overflow-tooltip>
                  <template slot-scope="scope">
                      <span
                        @click="$gotoCustomerDetail(scope.row.id)"
                      >{{ scope.row.companyName }}</span> -->
                      <!-- <span style="width: 100px">{{ scope.row.creditQuota }}</span>
                    <span class="bar-wrap">
                      <span class="bar-inner" :style="{'width': scope.row.creditQuota+'%'}"></span>
                    </span> -->
                  <!-- </template>
                </el-table-column> -->

                <el-table-column                    
                  label="客户名称"
                  prop="companyName"
                  show-overflow-tooltip
                  class-name="title-name">
                    <template slot-scope="scope">
                      <span class="canClick" @click="goCreditAlert(scope.row)">{{ scope.row.companyName }}</span>
                    </template>
                </el-table-column>
 
                <el-table-column label="授信比例" prop="percent" width="100" align="right">
                  <template slot-scope="scope">
                      {{ scope.row.percent }}%
                  </template>
                </el-table-column>
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


    // 跳转"应收账款报表"
    goReceivablesReport(row) {
      this.$router.push({
        name: "receivablesReport",
        query: {
          companyName: row.companyName,
        },
      });
    },

    // 跳转"客户授信集中度"
    goCreditAlert(row) {
      this.$router.push({
        name: "creditAlert",
        query: {
          companyName: row.companyName,
        },
      });
    }
  },
};
</script>

<style scoped lang="scss">
.container {
  padding: 0 !important;
  background-color: #f7f8fa;
  .unit {
    font-size: 15px;
    font-weight: normal;
  }
  > .content {
    > .flex-container {
      display: flex;
      margin-bottom: 16px;
      > .flex-content {
        flex: 1;
        // margin: 0 8px;
        margin:0 7px;
        > .section-container {
          background-color: #fff;
        }
      }
      .flex-content:first-child {
        margin-left: 0;
      }
      .flex-content:last-child {
        margin-right: 0;
      }
    }
    > .section-container {
      margin-bottom: 16px;
      background-color: #fff;
    }
    .section-container {
      padding: 20px;
      .title {
        border-left: 4px solid #4b9df3;
        padding-left: 10px;
        font-size: 16px;
        color: #333;
        position: relative;
        margin-bottom: 16px;
      }
      .action-btn {
        position: absolute;
        font-size: 13px;
        top: 4px;
        right: 0;
      }
      .title-action-tip {
        font-size: 13px;
        color: #606266;
      }
      .item {
        padding: 20px;
        margin-top: 9px;
        margin-bottom: 10px;
        // border-radius: 8px;
        h1 {
          font-size: 22px;
          font-weight: bold;
          margin: 0;
        }
        h5 {
          font-size: 15px;
          color: rgba($color: #000000, $alpha: 0.8);
          margin-bottom: 15px;
        }
        &.item1,
        &.item6,
        &.item8 {
          background: url("~@/assets/images/creditManagement/light-purple.png") no-repeat bottom center/ cover;
        }
        &.item2 {
          background: url("~@/assets/images/creditManagement/light-yellow.png") no-repeat bottom center/ cover;
        }
        &.item3,
        &.item5 {
          background: url("~@/assets/images/creditManagement/light-green.png") no-repeat bottom center/ cover;
        }
        &.item4,
        &.item7 {
          background: url("~@/assets/images/creditManagement/light-blue.png") no-repeat bottom center/ cover;
        }
      }
    }
    .con13 {
      .item {
        height: 160px;
        display: flex;
        padding: 0;
        margin: 0;
        .l {
          flex: 0 40%;
          background-color: #eaedf4;
        }
        .r {
          background-color: #f7f8f9;
          text-align: right;
          padding-right: 20px;
          padding-bottom: 20px;
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
      > .section-container {
        padding: 0;
      }
    }
  }
}
</style>
