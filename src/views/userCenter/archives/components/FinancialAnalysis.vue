<template>
  <div class="credit-tab-content">
    <!-- BEGIN -->
    <h4 class="small-title" style="margin-bottom: 20px">
      财务报表管理
      <div style="height: 5px;">
        <el-button size="small" type="primary" @click="addReport">新增报表</el-button>
      </div>
    </h4>
   <TableWrapper
     ref="ref_financeReport"
     :fetchDataFn="Api_financialGetReportList"
     :query="{companyId:id}"
     :columns="col_financeReport"
   />
    <!-- END -->
    <h4 class="small-title">
      财务报表简析
      <div class="search-title">
          <div class="search-label">财报期间</div>
          <el-select
              v-model="financeEasyDataSearch"
              placeholder="选择财报期间"
              class="search-param"
              @change="getEasyAnalysis"
          >
              <el-option v-for="item in yearOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
      </div>
    </h4>
    <el-row >
      <table border="0" cellpadding="0" cellspacing="0" class="fxb-info-table">
          <tr>
              <th>年报年度</th><td>{{ financeEasyDataSearch }}</td>
              <th>资产总额(元)</th><td>{{ easydata.totalAssets || '-' }}</td>
              <th>营业总收入(元)</th><td>{{ easydata.grossRevenue || '-' }}</td>
          </tr>
          <tr>
              <th>利润总额(元)</th><td>{{ easydata.totalProfit || '-' }}</td>
              <th>所有者权益合计(元)</th><td>{{ easydata.totalOwnersEquity || '-' }}</td>
              <th>主营业收入(元)</th><td>{{ easydata.mainOperatingIncome || '-' }}</td>
          </tr>
          <tr>
              <th>净利润(元)</th><td>{{ easydata.retainedProfits || '-' }}</td>
              <th>负债总额(元)</th><td>{{ easydata.totalLiabilities || '-' }}</td>
              <th></th><td></td>
          </tr>
      </table>
    </el-row>
    <!-- BEGIN -->
    <h4 class="small-title">
      财务数据分析
      <div class="search-title">
        <div class="search-label">财报期间</div>
        <el-select
          v-model="financeDataSearch"
          placeholder="选择财报期间"
          class="search-param"
          @change="getAnalysis"
        >
          <el-option v-for="item in yearOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
    </h4>
    <div class="finance-data-container" style="margin-bottom: 20px">
      <div class="finance-data-content" style="padding-right: 15px">
        <div class="finance-data-out">
          <div class="finance-data-in-title">
            <img src="@/assets/images/financeA.png" alt />
            <br />
            <br />偿债能力
          </div>
          <div class="finance-data-in">
            <div class="finance-data-in-content">
              <p class="finance-data-in-subtitle">流动比率</p>
              {{ solvency.currentRatio }}
            </div>
            <div class="finance-data-in-content">
              <p class="finance-data-in-subtitle">现金比率</p>
              {{ solvency.cashRatio }}
            </div>
          </div>
          <div class="finance-data-in">
            <div class="finance-data-in-content">
              <p class="finance-data-in-subtitle">速动比率</p>
              {{ solvency.snapRatio }}
            </div>
            <div class="finance-data-in-content">
              <p class="finance-data-in-subtitle">应收账款周转率</p>
              {{ solvency.turnover }}
            </div>
          </div>
          <div class="finance-data-in">
            <div class="finance-data-in-content">
              <p class="finance-data-in-subtitle">保守速动比率</p>
              {{ solvency.conservativeSnapRatio }}
            </div>
            <div class="finance-data-in-content">
              <p class="finance-data-in-subtitle">应收账款周转天数</p>
              {{ solvency.turnoverDays }}
              <span style="font-size: 13px">天</span>
            </div>
          </div>
        </div>
      </div>
      <div class="finance-data-content" style="padding-left: 15px">
        <div class="finance-data-out">
          <div class="finance-data-in-title">
            <img src="@/assets/images/financeB.png" alt />
            <br />
            <br />现金保障
          </div>
          <div class="finance-data-in">
            <div class="finance-data-in-content">
              <p class="finance-data-in-subtitle">销售商品收到现金与主营业务收入比率</p>
              {{ cashProtection.incomeRatio }}
            </div>
            <div class="finance-data-in-content">
              <p class="finance-data-in-subtitle">营业现金流量净额对短期有息负债比率</p>
              {{ cashProtection.debtRatio }}
            </div>
          </div>
          <div class="finance-data-in">
            <div class="finance-data-in-content">
              <p class="finance-data-in-subtitle">经营活动产生的现金流量净额与净利润比率</p>
              {{ cashProtection.netProfitRatio }}
            </div>
            <div class="finance-data-in-content">
              <p class="finance-data-in-subtitle">现金及现金等价物净增加额</p>
              {{ cashProtection.netIncrease/100000>1?Math.round(cashProtection.netIncrease/100)/100:cashProtection.netIncrease }}
              <span
                style="font-size: 13px"
              >{{cashProtection.netIncrease/100000>1?'万元':'元'}}</span>
            </div>
          </div>
          <div class="finance-data-in">
            <div class="finance-data-in-content">
              <p class="finance-data-in-subtitle">净利润直接现金保障倍数</p>
              {{ cashProtection.guaranteeMultiple }}
            </div>
            <div class="finance-data-in-content"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="finance-data-container">
      <div class="finance-data-content" style="padding-right: 15px">
        <div class="finance-data-out">
          <div class="finance-data-in-title">
            <img src="@/assets/images/financeC.png" alt />
            <br />
            <br />盈利能力
          </div>
          <div class="finance-data-in">
            <div class="finance-data-in-content">
              <p class="finance-data-in-subtitle">营业成本比率</p>
              {{ profitability.currentRatio }}
              <span style="font-size: 13px">%</span>
            </div>
            <div class="finance-data-in-content">
              <p class="finance-data-in-subtitle">税前利润率</p>
              {{ profitability.profitBeforeTax }}
              <span style="font-size: 13px">%</span>
            </div>
            <div class="finance-data-in-content">
              <p class="finance-data-in-subtitle">净资产收益率</p>
              {{ profitability.Roe }}
              <span style="font-size: 13px">%</span>
            </div>
          </div>
          <div class="finance-data-in">
            <div class="finance-data-in-content">
              <p class="finance-data-in-subtitle">营业利润率</p>
              {{ profitability.operatingMargin }}
              <span style="font-size: 13px">%</span>
            </div>
            <div class="finance-data-in-content">
              <p class="finance-data-in-subtitle">税后利润率</p>
              {{ profitability.profitAfterTax }}
              <span style="font-size: 13px">%</span>
            </div>
            <div class="finance-data-in-content">
              <p class="finance-data-in-subtitle">主营业务利润率</p>
              {{ profitability.OPE }}
              <span style="font-size: 13px">%</span>
            </div>
          </div>
          <div class="finance-data-in">
            <div class="finance-data-in-content">
              <p class="finance-data-in-subtitle">销售毛利率</p>
              {{ profitability.grossProfitMargin }}
              <span style="font-size: 13px">%</span>
            </div>
            <div class="finance-data-in-content">
              <p class="finance-data-in-subtitle">资产收益率</p>
              {{ profitability.returnOnAssets }}
              <span style="font-size: 13px">%</span>
            </div>
            <div class="finance-data-in-content">
              <p class="finance-data-in-subtitle">总资产回报率</p>
              {{ profitability.returnOnTotalAssets }}
              <span style="font-size: 13px">%</span>
            </div>
          </div>
        </div>
      </div>
      <div class="finance-data-content" style="padding-left: 15px">
        <div class="finance-data-out">
          <div class="finance-data-in-title">
            <img src="@/assets/images/financeD.png" alt />
            <br />
            <br />经营效率
          </div>
          <div class="finance-data-in">
            <div class="finance-data-in-content">
              <p class="finance-data-in-subtitle">销售费用率</p>
              {{ operatingEfficiency.sellingExpenseRatio }}
              <span style="font-size: 13px">%</span>
            </div>
            <div class="finance-data-in-content">
              <p class="finance-data-in-subtitle">存货周转天数</p>
              {{ operatingEfficiency.inventoryTurnoverDays }}
              <span style="font-size: 13px">天</span>
            </div>
            <div class="finance-data-in-content">
              <p class="finance-data-in-subtitle">其他应收账款与流动资产比率</p>
              {{ operatingEfficiency.otherAccountsReceivableRatio }}
              <span style="font-size: 13px">%</span>
            </div>
          </div>
          <div class="finance-data-in">
            <div class="finance-data-in-content">
              <p class="finance-data-in-subtitle">财务费用率</p>
              {{ operatingEfficiency.financialExpenseRatio }}
              <span style="font-size: 13px">%</span>
            </div>
            <div class="finance-data-in-content">
              <p class="finance-data-in-subtitle">固定资产周转率</p>
              {{ operatingEfficiency.turnoverRateOfFixedAssets }}
            </div>
            <div class="finance-data-in-content">
              <p class="finance-data-in-subtitle">主营业务收入增长率</p>
              {{ operatingEfficiency.mainBusinessIncomeGrowthRate }}
              <span style="font-size: 13px">%</span>
            </div>
          </div>
          <div class="finance-data-in">
            <div class="finance-data-in-content">
              <p class="finance-data-in-subtitle">存货周转率</p>
              {{ operatingEfficiency.inventoryTurnover }}
              <span style="font-size: 13px">%</span>
            </div>
            <div class="finance-data-in-content">
              <p class="finance-data-in-subtitle">总资产周转率</p>
              {{ operatingEfficiency.totalAssetTurnover }}
            </div>
            <div class="finance-data-in-content">
              <p class="finance-data-in-subtitle">三项费用增长率</p>
              {{ operatingEfficiency.threeCostGrowthRates }}
              <span style="font-size: 13px">%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- END -->
    <!-- BEGIN -->
    <h4 class="small-title">
      破产风险预测
      <div class="search-title">
        <div class="search-label">财报期间</div>
        <el-select
          v-model="bankruptcyRiskSearch"
          placeholder="选择财报期间"
          class="search-param"
          @change="getBankruptcyRiskPrediction"
        >
          <el-option v-for="item in yearOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
    </h4>
    <el-row :gutter="30">
      <el-col :span="8">
        <div class="risk-forecast-container">
          <p class="risk-forecast-title">
            Z计分模型
            <el-select
              v-model="zModelSearch"
              class="risk-forecast-search"
              @change="getBankruptcyRiskPrediction"
            >
              <el-option
                v-for="item in zModelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </p>
          <div
            class="risk-forecast-chart"
            :style="{'height':'16px','background-image':'linear-gradient(to right,#f34a49 0%,#f3c649 '+((zModel.max+zModel.min)*100/8)+'%,#2bc4c1 100%)'}"
          >
            <!-- <img
                            src="@/assets/images/bluePin.png"
                            :style="{'left':'calc('+(zModel.val*100/4)+'% - 7px)'}"
                            class="blue-pin"
                            alt
            />-->
            <!--<div class="pin-number">{{ zModel.val }}</div>-->
            <div class="triangle-up blue-pin" :style="{'left':'calc('+(zModel.val*100/6)+'% - 6px)'}">
              <div class="pin-number">{{ zModel.val }}</div>
            </div>
            <!-- <div class="risk-forecast-strip strip-red" :style="{flex: zModel.red}"></div>
                        <div class="risk-forecast-strip strip-white" :style="{flex: zModel.white}">
                            <div class="risk-forecast-min" v-if="zModel.min">{{ zModel.min }}</div>
                            <div class="risk-forecast-max" v-if="zModel.max">{{ zModel.max }}</div>
                        </div>
            <div class="risk-forecast-strip strip-green" :style="{flex: zModel.green}"></div>-->
          </div>
          <p class="risk-forecast-tip">{{ zModel.tip }}</p>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="risk-forecast-container">
          <p class="risk-forecast-title">巴萨利模型</p>
          <div
            class="risk-forecast-chart"
            style="height: 16px; background-image: linear-gradient(to right, #f34a49, #f3c649, #2bc4c1)"
          >
            <!-- <img
                            src="@/assets/images/bluePin.png"
                            :style="{'left':'calc('+(barsaliModel.val*100/4)+'% - 7px)'}"
                            class="blue-pin"
                            alt
            />-->

            <div class="triangle-up blue-pin" :style="{'left':'calc('+(barsaliModel.val*100/4)+'% - 6px)'}">
              <div class="pin-number">{{ barsaliModel.val }}</div>
            </div>
            <!-- <div class="risk-forecast-strip strip-red" :style="{flex: barsaliModel.red}"></div>
                        <div class="risk-forecast-strip strip-white" :style="{flex: barsaliModel.white}">
                            <div class="risk-forecast-min" v-if="barsaliModel.min!==null">{{ barsaliModel.min }}</div>
                            <div class="risk-forecast-max" v-if="barsaliModel.max">{{ barsaliModel.max }}</div>
                        </div>
            <div class="risk-forecast-strip strip-green" :style="{flex: barsaliModel.green}"></div>-->
          </div>
          <p class="risk-forecast-tip">{{ barsaliModel.tip }}</p>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="risk-forecast-container">
          <p class="risk-forecast-title">营运资产分析模型</p>
          <div
            class="risk-forecast-chart"
            style="height: 16px; background-image: linear-gradient(to right, #f34a49, #f3c649, #2bc4c1)"
          >
            <!-- <img
                            src="@/assets/images/bluePin.png"
                            :style="{'left':'calc('+(analysisModel.val*100/4)+'% - 7px)'}"
                            class="blue-pin"
                            alt
            />-->

            <div class="triangle-up blue-pin" :style="{'left':'calc('+(analysisModel.val*100/4)+'% - 6px)'}">
              <div class="pin-number">{{ analysisModel.val }}</div>
            </div>
            <!-- <div class="risk-forecast-strip strip-red" :style="{flex: analysisModel.red}"></div>
                        <div class="risk-forecast-strip strip-white" :style="{flex: analysisModel.white}">
                            <div class="risk-forecast-min" v-if="analysisModel.min!==null">{{ analysisModel.min }}</div>
                            <div class="risk-forecast-max" v-if="analysisModel.max">{{ analysisModel.max }}</div>
                        </div>
            <div class="risk-forecast-strip strip-green" :style="{flex: analysisModel.green}"></div>-->
          </div>
          <p class="risk-forecast-tip">{{ analysisModel.tip }}</p>
        </div>
      </el-col>
    </el-row>
    <!-- END -->
  </div>
</template>

<script>
import {
  Api_financialGetReportList,
  Api_financialGetAnalysis,
  Api_getBankruptcyRiskPrediction,
  Api_financialDelReport,
  Api_financialGetEasyDetail,
  Api_financialGetFiles,
  Api_financialGetDetails,
} from "@/api/creditManagement/customerProfile/customerManagemCustomer/FinancialAnalysis.js";
import { fxb } from "@/utils/variables";

export default {
  name: "FinancialAnalysis",
  props: { id: { type: String, default: "" } },
  data() {
    const thisYear = new Date().getFullYear();
    return {
      fxb,
      baseUrl: process.env.VUE_APP_BASE_API,
      col_financeReport: [
        {
          label: "财报类型",
          key: "type",
          render: (h, data, row) => {
            return data === "0" ? "年报" : data === "1" ? "半年报" : data === "2" ? "月报" : "-";
          },
        },
        {
          label: "财报时间",
          key: "type",
          render: (h, data, row) => {
            return data === "0"
              ? row.year
              : data === "1"
              ? row.semiAnnual === "1"
                ? "上半年"
                : row.semiAnnual === "2"
                ? "下半年"
                : ""
              : data === "2"
              ? row.month
              : "-";
          },
        },
        // {
        //   label: "资产总额(元)",
        //   key: "totalAssets",
        //   align: "right",
        //   render: (h, data, row) => {
        //     return this.$toMoney(data);
        //   },
        // },
        // {
        //   label: "营业总收入(元)",
        //   key: "grossRevenue",
        //   align: "right",
        //   render: (h, data, row) => {
        //     return this.$toMoney(data);
        //   },
        // },
        // {
        //   label: "主营业务收入(元)",
        //   key: "mainOperatingIncome",
        //   align: "right",
        //   render: (h, data, row) => {
        //     return this.$toMoney(data);
        //   },
        // },
        // {
        //   label: "所有者权益合计(元)",
        //   key: "totalOwnersEquity",
        //   align: "right",
        //   render: (h, data, row) => {
        //     return this.$toMoney(data);
        //   },
        // },
        // {
        //   label: "利润总额(元)",
        //   key: "totalProfit",
        //   align: "right",
        //   render: (h, data, row) => {
        //     return this.$toMoney(data);
        //   },
        // },
        // {
        //   label: "净利润(元)",
        //   key: "retainedProfits",
        //   align: "right",
        //   render: (h, data, row) => {
        //     return this.$toMoney(data);
        //   },
        // },
        // {
        //   label: "负债总额(元)",
        //   key: "totalLiabilities",
        //   align: "right",
        //   render: (h, data, row) => {
        //     return this.$toMoney(data);
        //   },
        // },
        { label: "填报人", key: "creator", align: "left", width: 100 },
        {
          label: "填报时间",
          key: "createDate",
          width: 150 ,
          render: (h, data, row) => {
            return data ? data.substr(0, 10) : "-";
          },
        },
        {
          label: "操作",
          key: null,
          render: (h, data, row) => {
            return (
              <div>
                <span onClick={this.editReport.bind(this, row)} style="padding: 0 5px;cursor: pointer;color:#409eff">编辑</span>
                <span onClick={this.infoReport.bind(this, row)} style="padding: 0 5px;cursor: pointer;color:#409eff">查看详情</span>
                <span onClick={this.fileDownload.bind(this, row)} style="padding: 0 5px;cursor: pointer">附件下载</span>
              </div>
              // <button-dropdown
              //   data={[
              //     { text: "编辑", click: this.editReport.bind(this, row) },
              //     { text: "删除", click: this.delReport.bind(this, row) },
              //     { text: "查看详情", click: this.infoReport.bind(this, row) },
              //     { text: "附件下载", click: this.fileDownload.bind(this, row) },
              //   ]}
              // />
            );
          },
        },
      ],
      financeEasyDataSearch: thisYear - 1,
      easydata:{
        totalAssets: "-", // 资产总额
        grossRevenue: "-", // 营业总收入
        mainOperatingIncome: "-", // 主英业务收入
        totalOwnersEquity: "-", // 所有者权益合计
        totalProfit: "-", // 利润总额
        retainedProfits: "-", // 净利润
        totalLiabilities: "-" // 负债总额
      },
      financeDataSearch: thisYear - 1,
      bankruptcyRiskSearch: thisYear - 1,
      yearOptions: [
        { label: thisYear + "年度", value: thisYear },
        { label: thisYear - 1 + "年度", value: thisYear - 1 },
        { label: thisYear - 2 + "年度", value: thisYear - 2 },
        { label: thisYear - 3 + "年度", value: thisYear - 3 },
        { label: thisYear - 4 + "年度", value: thisYear - 4 },
      ],
      solvency: {
        currentRatio: "-",
        cashRatio: "-",
        snapRatio: "-",
        turnover: "-",
        conservativeSnapRatio: "-",
        turnoverDays: "-",
      },
      cashProtection: {
        incomeRatio: "-",
        debtRatio: "-",
        netProfitRatio: "-",
        netIncrease: "-",
        guaranteeMultiple: "-",
      },
      profitability: {
        currentRatio: "-",
        profitBeforeTax: "-",
        Roe: "-",
        operatingMargin: "-",
        profitAfterTax: "-",
        OPE: "-",
        grossProfitMargin: "-",
        returnOnAssets: "-",
        returnOnTotalAssets: "-",
      },
      operatingEfficiency: {
        sellingExpenseRatio: "-",
        inventoryTurnoverDays: "-",
        otherAccountsReceivableRatio: "-",
        financialExpenseRatio: "-",
        turnoverRateOfFixedAssets: "-",
        mainBusinessIncomeGrowthRate: "-",
        inventoryTurnover: "-",
        totalAssetTurnover: "-",
        threeCostGrowthRates: "-",
      },
      zModelSearch: "0",
      zModelOptions: [
        { label: "上市公司", value: "0" },
        { label: "非上市公司", value: "1" },
        { label: "非制造企业", value: "2" },
      ],
      zModel: {
        red: "0 45.25%",
        white: "0 21.535%",
        green: 1,
        min: 1.81,
        max: 2.675,
        val: 0,
        tip: "按照当前行业分类“上市公司”对应Z计分模型模型，经测算该客户评估值为3.2，分析认为风险较小。",
      },
      barsaliModel: {
        red: 1,
        white: 0,
        green: 1,
        min: 0,
        max: null,
        val: 0,
        tip: "经测算测算，该客户评估指数为-1.2，分析认为风险较大，该公司前景不妙，请谨慎决策。",
      },
      analysisModel: {
        red: 1,
        white: 0,
        green: 1,
        min: 0,
        max: null,
        val: 0,
        tip:
          "经测算，该客户营运资产为XXX元，风险评估指数为0.8，分析认为风险有限，建议赊销金额占其营运资产比例为20%。",
      },
    };
  },
  mounted() {
    this.getList();
    this.getAnalysis();
    this.getEasyAnalysis();
    this.getBankruptcyRiskPrediction();
  },
  methods: {
    Api_financialGetReportList,
    getList() {
      this.$refs.ref_financeReport.fetchData();
    },
    getAnalysis() {
      Api_financialGetAnalysis({ companyId: this.id, year: this.financeDataSearch }).then((res) => {
        this.solvency = {
          currentRatio: res.solvency.currentRatio === null ? "-" : res.solvency.currentRatio,
          cashRatio: res.solvency.cashRatio === null ? "-" : res.solvency.cashRatio,
          snapRatio: res.solvency.quickRatio === null ? "-" : res.solvency.quickRatio,
          turnover:
            res.solvency.accountReceivableTurnoverRatio === null
              ? "-"
              : res.solvency.accountReceivableTurnoverRatio,
          conservativeSnapRatio:
            res.solvency.conservativeQuickRatio === null ? "-" : res.solvency.conservativeQuickRatio,
          turnoverDays:
            res.solvency.accountsReceivableTurnover === null ? "-" : res.solvency.accountsReceivableTurnover,
        };
        this.cashProtection = {
          incomeRatio:
            res.cashGuarantee.salesToBusinessRatio === null ? "-" : res.cashGuarantee.salesToBusinessRatio,
          debtRatio:
            res.cashGuarantee.operatingToShortTermDebtRatio === null
              ? "-"
              : res.cashGuarantee.operatingToShortTermDebtRatio,
          netProfitRatio:
            res.cashGuarantee.operatingFlowToNetProfitRatio === null
              ? "-"
              : res.cashGuarantee.operatingFlowToNetProfitRatio,
          netIncrease:
            res.cashGuarantee.netIncreaseInCashAndCashEquivalents === null
              ? "-"
              : res.cashGuarantee.netIncreaseInCashAndCashEquivalents,
          guaranteeMultiple:
            res.cashGuarantee.netProfitGuaranteeMultiple === null
              ? "-"
              : res.cashGuarantee.netProfitGuaranteeMultiple,
        };
        this.profitability = {
          currentRatio:
            res.profitability.operatingCostRatio === null ? "-" : res.profitability.operatingCostRatio,
          profitBeforeTax:
            res.profitability.profitBeforeTax === null ? "-" : res.profitability.profitBeforeTax,
          Roe: res.profitability.roe === null ? "-" : res.profitability.roe,
          operatingMargin:
            res.profitability.operatingMargin === null ? "-" : res.profitability.operatingMargin,
          profitAfterTax: res.profitability.profitAfterTax === null ? "-" : res.profitability.profitAfterTax,
          OPE: res.profitability.ope === null ? "-" : res.profitability.ope,
          grossProfitMargin:
            res.profitability.grossProfitMargin === null ? "-" : res.profitability.grossProfitMargin,
          returnOnAssets: res.profitability.returnOnAssets === null ? "-" : res.profitability.returnOnAssets,
          returnOnTotalAssets:
            res.profitability.returnOnTotalAssets === null ? "-" : res.profitability.returnOnTotalAssets,
        };
        this.operatingEfficiency = {
          sellingExpenseRatio:
            res.operatingEfficiency.sellingExpenseRatio === null
              ? "-"
              : res.operatingEfficiency.sellingExpenseRatio,
          inventoryTurnoverDays:
            res.operatingEfficiency.inventoryTurnoverDays === null
              ? "-"
              : res.operatingEfficiency.inventoryTurnoverDays,
          otherAccountsReceivableRatio:
            res.operatingEfficiency.otherAccountsToCurrentAssetsRatio === null
              ? "-"
              : res.operatingEfficiency.otherAccountsToCurrentAssetsRatio,
          financialExpenseRatio:
            res.operatingEfficiency.financialExpenseRatio === null
              ? "-"
              : res.operatingEfficiency.financialExpenseRatio,
          turnoverRateOfFixedAssets:
            res.operatingEfficiency.fixedAssetTurnover === null
              ? "-"
              : res.operatingEfficiency.fixedAssetTurnover,
          mainBusinessIncomeGrowthRate:
            res.operatingEfficiency.mainBusinessIncomeGrowthRate === null
              ? "-"
              : res.operatingEfficiency.mainBusinessIncomeGrowthRate,
          inventoryTurnover:
            res.operatingEfficiency.inventoryTurnover === null
              ? "-"
              : res.operatingEfficiency.inventoryTurnover,
          totalAssetTurnover:
            res.operatingEfficiency.turnoverOfTotalAssets === null
              ? "-"
              : res.operatingEfficiency.turnoverOfTotalAssets,
          threeCostGrowthRates:
            res.operatingEfficiency.threeExpenseGrowthRates === null
              ? "-"
              : res.operatingEfficiency.threeExpenseGrowthRates,
        };
      });
    },
    getEasyAnalysis(){
      Api_financialGetEasyDetail({ companyId: this.id, year: this.financeEasyDataSearch }).then((res) => {
          this.easydata = {
              totalAssets: res.totalAssets, // 资产总额
              grossRevenue: res.grossRevenue, // 营业总收入
              mainOperatingIncome: res.mainOperatingIncome, // 主英业务收入
              totalOwnersEquity: res.totalOwnersEquity, // 所有者权益合计
              totalProfit: res.totalProfit, // 利润总额
              retainedProfits: res.retainedProfits, // 净利润
              totalLiabilities: res.totalLiabilities // 负债总额
          }
      });
    },
    getBankruptcyRiskPrediction() {
      Api_getBankruptcyRiskPrediction({
        companyId: this.id,
        year: this.bankruptcyRiskSearch,
        zType: this.zModelSearch,
      }).then((res) => {
        this.zModel.val = res.modelZ;
        this.barsaliModel.val = res.modelBasali;
        this.analysisModel.val = res.operationPrediction;
        if (this.zModelSearch === "0") {
          this.zModel.tip =
            this.zModel.val < 1.81
              ? "按照当前行业分类“上市公司”对应Z计分模型模型，经测算该客户评估值为" +
                (this.zModel.val === null ? "-" : this.zModel.val) +
                "，分析认为风险较大。"
              : this.zModel.val > 2.675
              ? "按照当前行业分类“上市公司”对应Z计分模型模型，经测算该客户评估值为" +
                this.zModel.val +
                "，分析认为风险较小。"
              : "按照当前行业分类“上市公司”对应Z计分模型模型，经测算该客户评估值为" +
                this.zModel.val +
                "，分析认为风险中等。";
        } else if (this.zModelSearch === "1") {
          this.zModel.tip =
            this.zModel.val < 1.2
              ? "按照当前行业分类“非上市公司”对应Z计分模型模型，经测算该客户评估值为" +
                (this.zModel.val === null ? "-" : this.zModel.val) +
                "，分析认为风险较大。"
              : this.zModel.val > 2.9
              ? "按照当前行业分类“非上市公司”对应Z计分模型模型，经测算该客户评估值为" +
                this.zModel.val +
                "，分析认为风险较小。"
              : "按照当前行业分类“非上市公司”对应Z计分模型模型，经测算该客户评估值为" +
                this.zModel.val +
                "，分析认为风险中等。";
        } else if (this.zModelSearch === "2") {
          this.zModel.tip =
            this.zModel.val < 1.23
              ? "按照当前行业分类“非制造企业”对应Z计分模型模型，经测算该客户评估值为" +
                (this.zModel.val === null ? "-" : this.zModel.val) +
                "，分析认为风险较大。"
              : this.zModel.val > 2.9
              ? "按照当前行业分类“非制造企业”对应Z计分模型模型，经测算该客户评估值为" +
                this.zModel.val +
                "，分析认为风险较小。"
              : "按照当前行业分类“上市公司”对应Z计分模型模型，经测算该客户评估值为" +
                this.zModel.val +
                "，分析认为风险中等。";
        }
        this.barsaliModel.tip = `经测算，该客户巴萨利预测评估值为${
          res.modelBasali === null ? "-" : res.modelBasali
        }，分析认为${res.modelBasali <= 0 ? "风险较高" : "风险一般"}，请谨慎决策。`;
        this.analysisModel.tip = `经测算，该客户营运资产为${this.$toMoney(
          res.modelOperation || 0
        )}元，预测评估指数为${
          res.operationPrediction === null ? "-" : res.operationPrediction
        }，分析认为${this.switchModelOpe(
          res.modelOperation
        )}，建议赊销金额不超过其营运资产的${this.switchModelOpePro(res.operationPrediction)}`;
      });
    },
    // 新增
    addReport() {
      this.$emit("newReport", "add", this.id);
    },
    // 编辑
    editReport(_row) {
      this.$emit("editReport", "edit", this.id, _row);
    },
    // 删除
    delReport(_row) {
      this.$confirm("确定要删除该条财务报表记录吗？删除后不可恢复，请知晓。", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        Api_financialDelReport({ id: _row.id })
          .then((res) => {
            this.$message({
              type: "success",
              message: res,
            });
            this.getList();
          })
          .catch((res) => {
            this.$message.error(res);
          });
      });
    },
    // 查看详情
    infoReport(_row) {
      this.$emit("viewReport", "info", this.id, _row);
    },
    // 附件下载
    fileDownload(_row) {
      window.open(this.baseUrl + this.fxb + "/ecm/customer/financial/getFiles?id=" + _row.id, "_blank");
    },
    switchModelOpe(val) {
      if (!isNaN(val)) {
        return val <= -1.8 ? "风险较高" : val >= 1 ? "风险较低" : "风险有限";
      } else {
        return 0;
      }
    },
    switchModelOpePro(val) {
      if (!isNaN(val)) {
        return val <= -4.6
          ? "0%"
          : val >= -4.59 && val <= -3.9
          ? "2.5%"
          : val >= -3.89 && val <= -3.2
          ? "5.0%"
          : val >= -3.19 && val <= -2.5
          ? "7.5%"
          : val >= -2.49 && val <= -1.8
          ? "10%"
          : val >= -1.79 && val <= -1.1
          ? "12.5%"
          : val >= -1.09 && val <= -0.4
          ? "15.0%"
          : val >= -0.39 && val <= 0.3
          ? "17.5%"
          : val >= 0.31 && val <= 0.9
          ? "20%"
          : val >= 1.0
          ? "25%"
          : "0%";
      } else {
        return "0%";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.small-title {
  position: relative;

  button {
    position: absolute;
    right: 0;
    top: 4px;
  }

  .search-title {
    position: absolute;
    top: -6px;
    right: 0;
    width: 240px;
    display: flex;
    align-items: center;

    .search-label {
      flex: 0 100px;
      text-align: right;
      font-size: 14px;
      padding: 0 12px;
    }

    /deep/ .search-param {
      flex: 1;
    }
  }
}

.finance-data-container {
  display: flex;

  .finance-data-content {
    flex: 1;

    .finance-data-out {
      display: flex;
      border: 1px solid #ebeef5;
      align-items: center;
      background-color: #eaeef5;

      .finance-data-in-title {
        flex: 0 144px;
        text-align: center;
        font-size: 19px;
        font-weight: bold;
        color: #6badf2;
      }

      .finance-data-in {
        flex: 1;

        .finance-data-in-content {
          position: relative;
          height: 110px;
          // line-height: 156px;
          padding-top: 68px;
          font-size: 24px;
          border-left: 1px solid #ebeef5;
          background-color: #f6f8fa;
          color: #6badf2;
          padding-left: 10px;

          .finance-data-in-subtitle {
            position: absolute;
            top: 10px;
            left: 10px;
            font-size: 13px;
            color: #999;
            font-weight: normal;
            text-align: left;
            height: auto;
            line-height: initial;
          }
        }

        .finance-data-in-content:nth-child(n + 2) {
          border-top: 1px solid #ebeef5;
        }
      }
    }
  }
}

.risk-forecast-container {
  border: 1px solid #ebeef5;
  padding: 16px;
  background-color: #f6f8fa;

  .risk-forecast-title {
    font-size: 18px;
    font-weight: bold;
    color: #606266;
    position: relative;

    .risk-forecast-search {
      position: absolute;
      right: 0;
      top: 0;
    }
  }

  .risk-forecast-chart {
    display: flex;
    margin-top: 36px;
    position: relative;

    .pin-number {
      position: absolute;
      top: 10px;
      width: 50px;
      left: -25px;
      color: #666;
      text-align: center;
    }

    .blue-pin {
      position: absolute;
      bottom: -10px;
    }

    .risk-forecast-strip {
      height: 16px;
    }

    .strip-red {
      background-color: #f56c6c;
    }

    .strip-white {
      background-color: #eee;
      position: relative;

      .risk-forecast-min {
        position: absolute;
        width: 100px;
        color: #606266;
        font-size: 14px;
        bottom: -24px;
        left: -50px;
        text-align: center;
      }

      .risk-forecast-max {
        position: absolute;
        width: 100px;
        color: #606266;
        font-size: 14px;
        bottom: -24px;
        right: -50px;
        text-align: center;
      }
    }

    .strip-green {
      background-color: #67c23a;
    }
  }

  .risk-forecast-tip {
    font-size: 14px;
    color: #aaa;
    margin-top: 40px;
  }
}

.triangle-up {
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 7px solid #aaacb0;
}
</style>
