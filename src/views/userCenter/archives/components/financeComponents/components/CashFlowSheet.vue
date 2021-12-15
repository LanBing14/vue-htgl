<template>
  <el-form ref="cashFlowSheetForm" :model="cashFlowSheetForm" :rules="cashFlowSheetRules" label-width="0">
    <div style="text-align: right">
      <a :href="baseUrl+fxb+'/ecm/customer/financial/downloadTemplate'" target="_blank">
        <el-button size="small" type="primary" style="position: relative; left: -18px;">下载模版</el-button>
      </a>
      <el-button size="small" type="primary" @click="excelImport" :loading="loading">EXCEL导入</el-button>
      <el-upload
        class="upload-demo2"
        :headers="uploadHeaders"
        :action="baseUrl+fxb+'/ecm/customer/financial/importCashSheet'"
        :data="uploadData"
        name="file"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :on-success="handleUploadSuccess"
        multiple
        :limit="1"
        :on-exceed="handleExceed"
        :file-list="uploadList"
        :before-upload="handleBefore"
        :on-error="handleError"
      >
        <el-button size="small" type="success" ref="ref_upload">文件导入</el-button>
      </el-upload>
    </div>
    <p style="font-size: 14px; color: #606266; margin: 0 0 8px">单位：元</p>
    <table class="standard-table" cellspacing="0" border="1">
      <thead>
        <tr>
          <th>项目</th>
          <th>附注</th>
          <th width="170px">金额</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="font-weight: bold">一、经营活动产生的现金流量</td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>销售商品、提供劳务收到的现金</td>
          <td>
            <el-form-item prop="customerCashFlowRemark.baSalesCash">
              <el-input v-model="cashFlowSheetForm.customerCashFlowRemark.baSalesCash"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerCashFlow.baSalesCash">
              <el-input
                v-model="cashFlowSheetForm.customerCashFlow.baSalesCash"
                @change="countSubtotalOperatingIncome"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>收到的税费返还</td>
          <td>
            <el-form-item prop="customerCashFlowRemark.baTaxRefund">
              <el-input v-model="cashFlowSheetForm.customerCashFlowRemark.baTaxRefund"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerCashFlow.baTaxRefund">
              <el-input
                v-model="cashFlowSheetForm.customerCashFlow.baTaxRefund"
                @change="countSubtotalOperatingIncome"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>收到其他与经营活动有关的现金</td>
          <td>
            <el-form-item prop="customerCashFlowRemark.baReceiveOtherActivitiesCash">
              <el-input v-model="cashFlowSheetForm.customerCashFlowRemark.baReceiveOtherActivitiesCash"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerCashFlow.baReceiveOtherActivitiesCash">
              <el-input
                v-model="cashFlowSheetForm.customerCashFlow.baReceiveOtherActivitiesCash"
                @change="countSubtotalOperatingIncome"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="padding-left: 64px; font-weight: bold">经营活动现金流入小计</td>
          <td>
            <el-form-item prop="customerCashFlowRemark.baBusinessActivitiesInflow">
              <el-input v-model="cashFlowSheetForm.customerCashFlowRemark.baBusinessActivitiesInflow"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerCashFlow.baBusinessActivitiesInflow">
              <el-input disabled v-model="cashFlowSheetForm.customerCashFlow.baBusinessActivitiesInflow"></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>购买商品、接受劳务支付的现金</td>
          <td>
            <el-form-item prop="customerCashFlowRemark.baPurchaseCash">
              <el-input v-model="cashFlowSheetForm.customerCashFlowRemark.baPurchaseCash"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerCashFlow.baPurchaseCash">
              <el-input
                v-model="cashFlowSheetForm.customerCashFlow.baPurchaseCash"
                @change="countSubtotalOperatingExpenses"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>支付给职工以及为职工支付的现金</td>
          <td>
            <el-form-item prop="customerCashFlowRemark.baEmployeePaysCash">
              <el-input v-model="cashFlowSheetForm.customerCashFlowRemark.baEmployeePaysCash"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerCashFlow.baEmployeePaysCash">
              <el-input
                v-model="cashFlowSheetForm.customerCashFlow.baEmployeePaysCash"
                @change="countSubtotalOperatingExpenses"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>支付的各项税费</td>
          <td>
            <el-form-item prop="customerCashFlowRemark.baTaxPayment">
              <el-input v-model="cashFlowSheetForm.customerCashFlowRemark.baTaxPayment"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerCashFlow.baTaxPayment">
              <el-input
                v-model="cashFlowSheetForm.customerCashFlow.baTaxPayment"
                @change="countSubtotalOperatingExpenses"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>支付其他与经营活动有关的现金</td>
          <td>
            <el-form-item prop="customerCashFlowRemark.baPayOtherActivitiesCash">
              <el-input v-model="cashFlowSheetForm.customerCashFlowRemark.baPayOtherActivitiesCash"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerCashFlow.baPayOtherActivitiesCash">
              <el-input
                v-model="cashFlowSheetForm.customerCashFlow.baPayOtherActivitiesCash"
                @change="countSubtotalOperatingExpenses"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="padding-left: 64px; font-weight: bold">经营活动现金流出小计</td>
          <td>
            <el-form-item prop="customerCashFlowRemark.baBusinessActivitiesOutflow">
              <el-input v-model="cashFlowSheetForm.customerCashFlowRemark.baBusinessActivitiesOutflow"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerCashFlow.baBusinessActivitiesOutflow">
              <el-input disabled v-model="cashFlowSheetForm.customerCashFlow.baBusinessActivitiesOutflow"></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="padding-left: 64px; font-weight: bold">经营活动产生的现金流量净额</td>
          <td>
            <el-form-item prop="customerCashFlowRemark.baBusinessNetCashFlow">
              <el-input v-model="cashFlowSheetForm.customerCashFlowRemark.baBusinessNetCashFlow"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerCashFlow.baBusinessNetCashFlow">
              <el-input disabled v-model="cashFlowSheetForm.customerCashFlow.baBusinessNetCashFlow"></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="font-weight: bold">二、投资活动产生的现金流量</td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>收回投资收到的现金</td>
          <td>
            <el-form-item prop="customerCashFlowRemark.iaDisinvestment">
              <el-input v-model="cashFlowSheetForm.customerCashFlowRemark.iaDisinvestment"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerCashFlow.iaDisinvestment">
              <el-input
                v-model="cashFlowSheetForm.customerCashFlow.iaDisinvestment"
                @change="countSubtotalOfInvestmentIncome"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>取得投资收益收到的现金</td>
          <td>
            <el-form-item prop="customerCashFlowRemark.iaInvestmentIncome">
              <el-input v-model="cashFlowSheetForm.customerCashFlowRemark.iaInvestmentIncome"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerCashFlow.iaInvestmentIncome">
              <el-input
                v-model="cashFlowSheetForm.customerCashFlow.iaInvestmentIncome"
                @change="countSubtotalOfInvestmentIncome"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>处置固定资产、无形资产和其他长期资产收回的现金净额</td>
          <td>
            <el-form-item prop="customerCashFlowRemark.iaWithdrawalAssets">
              <el-input v-model="cashFlowSheetForm.customerCashFlowRemark.iaWithdrawalAssets"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerCashFlow.iaWithdrawalAssets">
              <el-input
                v-model="cashFlowSheetForm.customerCashFlow.iaWithdrawalAssets"
                @change="countSubtotalOfInvestmentIncome"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>处置子公司及其他营业单位收到的现金净额</td>
          <td>
            <el-form-item prop="customerCashFlowRemark.iaSubsidiaryCorporationAssets">
              <el-input v-model="cashFlowSheetForm.customerCashFlowRemark.iaSubsidiaryCorporationAssets"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerCashFlow.iaSubsidiaryCorporationAssets">
              <el-input
                v-model="cashFlowSheetForm.customerCashFlow.iaSubsidiaryCorporationAssets"
                @change="countSubtotalOfInvestmentIncome"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>收到其他与投资活动有关的现金</td>
          <td>
            <el-form-item prop="customerCashFlowRemark.iaOtherActivities">
              <el-input v-model="cashFlowSheetForm.customerCashFlowRemark.iaOtherActivities"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerCashFlow.iaOtherActivities">
              <el-input
                v-model="cashFlowSheetForm.customerCashFlow.iaOtherActivities"
                @change="countSubtotalOfInvestmentIncome"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="padding-left: 64px; font-weight: bold">投资活动现金流入小计</td>
          <td>
            <el-form-item prop="customerCashFlowRemark.iaInvestmentActivitiesInflow">
              <el-input v-model="cashFlowSheetForm.customerCashFlowRemark.iaInvestmentActivitiesInflow"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerCashFlow.iaInvestmentActivitiesInflow">
              <el-input disabled v-model="cashFlowSheetForm.customerCashFlow.iaInvestmentActivitiesInflow"></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>购建固定资产、无形资产和其他长期资产支付的现金</td>
          <td>
            <el-form-item prop="customerCashFlowRemark.iaPurchaseFixedAssets">
              <el-input v-model="cashFlowSheetForm.customerCashFlowRemark.iaPurchaseFixedAssets"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerCashFlow.iaPurchaseFixedAssets">
              <el-input
                v-model="cashFlowSheetForm.customerCashFlow.iaPurchaseFixedAssets"
                @change="countSubtotalOfInvestmentExpenditure"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>投资支付的现金</td>
          <td>
            <el-form-item prop="customerCashFlowRemark.iaInvestmentPayCash">
              <el-input v-model="cashFlowSheetForm.customerCashFlowRemark.iaInvestmentPayCash"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerCashFlow.iaInvestmentPayCash">
              <el-input
                v-model="cashFlowSheetForm.customerCashFlow.iaInvestmentPayCash"
                @change="countSubtotalOfInvestmentExpenditure"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>取得子公司及其他营业单位支付的现金净额</td>
          <td>
            <el-form-item prop="customerCashFlowRemark.iaSubsidiaryCorporationIncome">
              <el-input v-model="cashFlowSheetForm.customerCashFlowRemark.iaSubsidiaryCorporationIncome"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerCashFlow.iaSubsidiaryCorporationIncome">
              <el-input
                v-model="cashFlowSheetForm.customerCashFlow.iaSubsidiaryCorporationIncome"
                @change="countSubtotalOfInvestmentExpenditure"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>支付其他与投资活动有关的现金</td>
          <td>
            <el-form-item prop="customerCashFlowRemark.iaPayOtherActivities">
              <el-input v-model="cashFlowSheetForm.customerCashFlowRemark.iaPayOtherActivities"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerCashFlow.iaPayOtherActivities">
              <el-input
                v-model="cashFlowSheetForm.customerCashFlow.iaPayOtherActivities"
                @change="countSubtotalOfInvestmentExpenditure"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="padding-left: 64px; font-weight: bold">投资活动现金流出小计</td>
          <td>
            <el-form-item prop="customerCashFlowRemark.iaInvestmentActivitiesOutflow">
              <el-input v-model="cashFlowSheetForm.customerCashFlowRemark.iaInvestmentActivitiesOutflow"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerCashFlow.iaInvestmentActivitiesOutflow">
              <el-input disabled v-model="cashFlowSheetForm.customerCashFlow.iaInvestmentActivitiesOutflow"></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="padding-left: 64px; font-weight: bold">投资活动产生的现金流量净额</td>
          <td>
            <el-form-item prop="customerCashFlowRemark.iaInvestmentNetCashFlow">
              <el-input v-model="cashFlowSheetForm.customerCashFlowRemark.iaInvestmentNetCashFlow"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerCashFlow.iaInvestmentNetCashFlow">
              <el-input disabled v-model="cashFlowSheetForm.customerCashFlow.iaInvestmentNetCashFlow"></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="font-weight: bold">三、筹资活动产生的现金流量</td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>吸收投资收到的现金</td>
          <td>
            <el-form-item prop="customerCashFlowRemark.faAbsorbInvestment">
              <el-input v-model="cashFlowSheetForm.customerCashFlowRemark.faAbsorbInvestment"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerCashFlow.faAbsorbInvestment">
              <el-input
                v-model="cashFlowSheetForm.customerCashFlow.faAbsorbInvestment"
                @change="countSubtotalOfFinancingIncome"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>取得借款收到的现金</td>
          <td>
            <el-form-item prop="customerCashFlowRemark.faBorrowMoney">
              <el-input v-model="cashFlowSheetForm.customerCashFlowRemark.faBorrowMoney"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerCashFlow.faBorrowMoney">
              <el-input
                v-model="cashFlowSheetForm.customerCashFlow.faBorrowMoney"
                @change="countSubtotalOfFinancingIncome"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="color: #F56C6C">发行债券收到的现金</td>
          <td>
            <el-form-item prop="customerCashFlowRemark.faFloatBonds">
              <el-input v-model="cashFlowSheetForm.customerCashFlowRemark.faFloatBonds"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerCashFlow.faFloatBonds">
              <el-input
                v-model="cashFlowSheetForm.customerCashFlow.faFloatBonds"
                @change="countSubtotalOfFinancingIncome"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>收到其他与筹资活动有关的现金</td>
          <td>
            <el-form-item prop="customerCashFlowRemark.faOtherActivities">
              <el-input v-model="cashFlowSheetForm.customerCashFlowRemark.faOtherActivities"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerCashFlow.faOtherActivities">
              <el-input
                v-model="cashFlowSheetForm.customerCashFlow.faOtherActivities"
                @change="countSubtotalOfFinancingIncome"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="padding-left: 64px; font-weight: bold">筹资活动现金流入小计</td>
          <td>
            <el-form-item prop="customerCashFlowRemark.faFinancialActivitiesInflow">
              <el-input v-model="cashFlowSheetForm.customerCashFlowRemark.faFinancialActivitiesInflow"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerCashFlow.faFinancialActivitiesInflow">
              <el-input disabled v-model="cashFlowSheetForm.customerCashFlow.faFinancialActivitiesInflow"></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>偿还债务支付的现金</td>
          <td>
            <el-form-item prop="customerCashFlowRemark.faRepayDebt">
              <el-input v-model="cashFlowSheetForm.customerCashFlowRemark.faRepayDebt"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerCashFlow.faRepayDebt">
              <el-input
                v-model="cashFlowSheetForm.customerCashFlow.faRepayDebt"
                @change="countSubtotalOfFinancingExpenditure"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>分配股利、利润或偿付利息支付的现金</td>
          <td>
            <el-form-item prop="customerCashFlowRemark.faPayInterest">
              <el-input v-model="cashFlowSheetForm.customerCashFlowRemark.faPayInterest"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerCashFlow.faPayInterest">
              <el-input
                v-model="cashFlowSheetForm.customerCashFlow.faPayInterest"
                @change="countSubtotalOfFinancingExpenditure"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>支付其他与筹资活动有关的现金</td>
          <td>
            <el-form-item prop="customerCashFlowRemark.faPayOtherActivities">
              <el-input v-model="cashFlowSheetForm.customerCashFlowRemark.faPayOtherActivities"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerCashFlow.faPayOtherActivities">
              <el-input
                v-model="cashFlowSheetForm.customerCashFlow.faPayOtherActivities"
                @change="countSubtotalOfFinancingExpenditure"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="padding-left: 64px; font-weight: bold">筹资活动现金流出小计</td>
          <td>
            <el-form-item prop="customerCashFlowRemark.faFinancialActivitiesOutflow">
              <el-input v-model="cashFlowSheetForm.customerCashFlowRemark.faFinancialActivitiesOutflow"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerCashFlow.faFinancialActivitiesOutflow">
              <el-input disabled v-model="cashFlowSheetForm.customerCashFlow.faFinancialActivitiesOutflow"></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="padding-left: 64px; font-weight: bold">筹资活动产生的现金流量净额</td>
          <td>
            <el-form-item prop="customerCashFlowRemark.faFinancialNetCashFlow">
              <el-input v-model="cashFlowSheetForm.customerCashFlowRemark.faFinancialNetCashFlow"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerCashFlow.faFinancialNetCashFlow">
              <el-input disabled v-model="cashFlowSheetForm.customerCashFlow.faFinancialNetCashFlow"></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="font-weight: bold">四、汇率变动对现金及现金等价物的影响</td>
          <td>
            <el-form-item prop="customerCashFlowRemark.ermExchangeRateMovement">
              <el-input v-model="cashFlowSheetForm.customerCashFlowRemark.ermExchangeRateMovement"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerCashFlow.ermExchangeRateMovement">
              <el-input
                v-model="cashFlowSheetForm.customerCashFlow.ermExchangeRateMovement"
                @change="countEndingBalance"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="font-weight: bold">五、现金及现金等价物净增加额</td>
          <td>
            <el-form-item prop="customerCashFlowRemark.ceCashEquivalent">
              <el-input v-model="cashFlowSheetForm.customerCashFlowRemark.ceCashEquivalent"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerCashFlow.ceCashEquivalent">
              <el-input
                v-model="cashFlowSheetForm.customerCashFlow.ceCashEquivalent"
                @change="countEndingBalance"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>加：期初现金及现金等价物余额</td>
          <td>
            <el-form-item prop="customerCashFlowRemark.iinitabala">
              <el-input v-model="cashFlowSheetForm.customerCashFlowRemark.iinitabala"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerCashFlow.iinitabala">
              <el-input v-model="cashFlowSheetForm.customerCashFlow.iinitabala" @change="countEndingBalance"></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="font-weight: bold">六、期末现金及现金等价物余额</td>
          <td>
            <el-form-item prop="customerCashFlowRemark.caClosingAmount">
              <el-input v-model="cashFlowSheetForm.customerCashFlowRemark.caClosingAmount"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerCashFlow.caClosingAmount">
              <el-input disabled v-model="cashFlowSheetForm.customerCashFlow.caClosingAmount"></el-input>
            </el-form-item>
          </td>
        </tr>
      </tbody>
    </table>
  </el-form>
</template>

<script>
import { fxb } from "@/utils/variables";
// 文件导入
import { getToken } from "@/utils/auth";

export default {
  name: "CashFlowSheet",
  data() {
    const createRules = this.$createRules;
    return {
      loading: false,
      fxb,
      baseUrl: process.env.VUE_APP_BASE_API,
      uploadHeaders: {
        Authorization: "Bearer " + getToken()
      },
      uploadData: {},
      uploadList: [],
      cashFlowSheetForm: {
        customerCashFlow: {
          ermExchangeRateMovement: null,
          ceCashEquivalent: null,
          iinitabala: null,
          baSalesCash: null,
          baTaxRefund: null,
          baReceiveOtherActivitiesCash: null,
          baBusinessActivitiesInflow: null,
          baPurchaseCash: null,
          baEmployeePaysCash: null,
          baTaxPayment: null,
          baPayOtherActivitiesCash: null,
          baBusinessActivitiesOutflow: null,
          baBusinessNetCashFlow: null,
          iaDisinvestment: null,
          iaInvestmentIncome: null,
          iaWithdrawalAssets: null,
          iaSubsidiaryCorporationAssets: null,
          iaOtherActivities: null,
          iaInvestmentActivitiesInflow: null,
          iaPurchaseFixedAssets: null,
          iaInvestmentPayCash: null,
          iaSubsidiaryCorporationIncome: null,
          iaPayOtherActivities: null,
          iaInvestmentActivitiesOutflow: null,
          iaInvestmentNetCashFlow: null,
          faAbsorbInvestment: null,
          faBorrowMoney: null,
          faFloatBonds: null,
          faOtherActivities: null,
          faFinancialActivitiesInflow: null,
          faRepayDebt: null,
          faPayInterest: null,
          faPayOtherActivities: null,
          faFinancialActivitiesOutflow: null,
          faFinancialNetCashFlow: null,
          caClosingAmount: null
        },
        customerCashFlowRemark: {
          ermExchangeRateMovement: null,
          ceCashEquivalent: null,
          iinitabala: null,
          baSalesCash: null,
          baTaxRefund: null,
          baReceiveOtherActivitiesCash: null,
          baBusinessActivitiesInflow: null,
          baPurchaseCash: null,
          baEmployeePaysCash: null,
          baTaxPayment: null,
          baPayOtherActivitiesCash: null,
          baBusinessActivitiesOutflow: null,
          baBusinessNetCashFlow: null,
          iaDisinvestment: null,
          iaInvestmentIncome: null,
          iaWithdrawalAssets: null,
          iaSubsidiaryCorporationAssets: null,
          iaOtherActivities: null,
          iaInvestmentActivitiesInflow: null,
          iaPurchaseFixedAssets: null,
          iaInvestmentPayCash: null,
          iaSubsidiaryCorporationIncome: null,
          iaPayOtherActivities: null,
          iaInvestmentActivitiesOutflow: null,
          iaInvestmentNetCashFlow: null,
          faAbsorbInvestment: null,
          faBorrowMoney: null,
          faFloatBonds: null,
          faOtherActivities: null,
          faFinancialActivitiesInflow: null,
          faRepayDebt: null,
          faPayInterest: null,
          faPayOtherActivities: null,
          faFinancialActivitiesOutflow: null,
          faFinancialNetCashFlow: null,
          caClosingAmount: null
        }
      },
      cashFlowSheetRules: {
        customerCashFlow: {
          ermExchangeRateMovement: createRules({ msg: "", numberFloat: true }),
          ceCashEquivalent: createRules({ msg: "", numberFloat: true }),
          baSalesCash: createRules({ msg: "", numberFloat: true }),
          baTaxRefund: createRules({ msg: "", numberFloat: true }),
          baReceiveOtherActivitiesCash: createRules({ msg: "", numberFloat: true }),
          baPurchaseCash: createRules({ msg: "", numberFloat: true }),
          baEmployeePaysCash: createRules({ msg: "", numberFloat: true }),
          baTaxPayment: createRules({ msg: "", numberFloat: true }),
          baPayOtherActivitiesCash: createRules({ msg: "", numberFloat: true }),
          iaDisinvestment: createRules({ msg: "", numberFloat: true }),
          iaInvestmentIncome: createRules({ msg: "", numberFloat: true }),
          iaWithdrawalAssets: createRules({ msg: "", numberFloat: true }),
          iaSubsidiaryCorporationAssets: createRules({ msg: "", numberFloat: true }),
          iaOtherActivities: createRules({ msg: "", numberFloat: true }),
          iaPurchaseFixedAssets: createRules({ msg: "", numberFloat: true }),
          iaInvestmentPayCash: createRules({ msg: "", numberFloat: true }),
          iaSubsidiaryCorporationIncome: createRules({ msg: "", numberFloat: true }),
          iaPayOtherActivities: createRules({ msg: "", numberFloat: true }),
          faAbsorbInvestment: createRules({ msg: "", numberFloat: true }),
          faBorrowMoney: createRules({ msg: "", numberFloat: true }),
          faFloatBonds: createRules({ msg: "", numberFloat: true }),
          faOtherActivities: createRules({ msg: "", numberFloat: true }),
          faRepayDebt: createRules({ msg: "", numberFloat: true }),
          faPayInterest: createRules({ msg: "", numberFloat: true }),
          faPayOtherActivities: createRules({ msg: "", numberFloat: true }),
          caClosingAmount: createRules({ msg: "", numberFloat: true })
        }
      }
    };
  },
  methods: {
    validForm(cb) {
      this.$refs["cashFlowSheetForm"].validate(valid => {
        if (valid) {
          cb(this.cashFlowSheetForm);
        } else {
          this.$message({
            message: "现金流量表有信息未填写正确！",
            type: "warning"
          });
        }
      });
    },
    setData(_customerCashFlow, _customerCashFlowRemark) {
      _customerCashFlow && (this.cashFlowSheetForm.customerCashFlow = _customerCashFlow);
      _customerCashFlowRemark && (this.cashFlowSheetForm.customerCashFlowRemark = _customerCashFlowRemark);
    },
    // excel 导入
    excelImport() {
      this.uploadList = [];
      this.$refs.ref_upload.$el.click();
    },
    handleBefore() {
      this.loading = true;
    },
    handleError() {
      this.loading = false;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`只能上传1个文件！`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleUploadSuccess(res) {
      this.loading = false;
      if (!res.success) {
        this.$message.error(res.error);
        return false;
      }
      if (res) {
        this.cashFlowSheetForm.customerCashFlow = res.data.customerCashFlow;
        this.cashFlowSheetForm.customerCashFlowRemark = res.data.customerCashFlowRemark;
      } else {
        this.$message.error("解析文件失败，请检查文件是否按照要求填写！");
      }
    },
    /**
     * @计算合计
     */
    countSubtotalOperatingIncome() {
      this.cashFlowSheetForm.customerCashFlow.baBusinessActivitiesInflow = this.$add(
        this.$add(
          this.cashFlowSheetForm.customerCashFlow.baSalesCash,
          this.cashFlowSheetForm.customerCashFlow.baTaxRefund
        ),
        this.cashFlowSheetForm.customerCashFlow.baReceiveOtherActivitiesCash
      );
      this.countNetOperating();
      this.countEndingBalance();
    },
    countSubtotalOperatingExpenses() {
      this.cashFlowSheetForm.customerCashFlow.baBusinessActivitiesOutflow = this.$add(
        this.$add(
          this.$add(
            this.cashFlowSheetForm.customerCashFlow.baPurchaseCash,
            this.cashFlowSheetForm.customerCashFlow.baEmployeePaysCash
          ),
          this.cashFlowSheetForm.customerCashFlow.baTaxPayment
        ),
        this.cashFlowSheetForm.customerCashFlow.baPayOtherActivitiesCash
      );
      this.countNetOperating();
      this.countEndingBalance();
    },
    countNetOperating() {
      this.cashFlowSheetForm.customerCashFlow.baBusinessNetCashFlow = this.$subtract(
        this.cashFlowSheetForm.customerCashFlow.baBusinessActivitiesInflow,
        this.cashFlowSheetForm.customerCashFlow.baBusinessActivitiesOutflow
      );
    },
    countSubtotalOfInvestmentIncome() {
      this.cashFlowSheetForm.customerCashFlow.iaInvestmentActivitiesInflow = this.$add(
        this.$add(
          this.$add(
            this.$add(
              this.cashFlowSheetForm.customerCashFlow.iaDisinvestment,
              this.cashFlowSheetForm.customerCashFlow.iaInvestmentIncome
            ),
            this.cashFlowSheetForm.customerCashFlow.iaWithdrawalAssets
          ),
          this.cashFlowSheetForm.customerCashFlow.iaSubsidiaryCorporationAssets
        ),
        this.cashFlowSheetForm.customerCashFlow.iaOtherActivities
      );
      this.countNetInvestment();
      this.countEndingBalance();
    },
    countSubtotalOfInvestmentExpenditure() {
      this.cashFlowSheetForm.customerCashFlow.iaInvestmentActivitiesOutflow = this.$add(
        this.$add(
          this.$add(
            this.cashFlowSheetForm.customerCashFlow.iaPurchaseFixedAssets,
            this.cashFlowSheetForm.customerCashFlow.iaInvestmentPayCash
          ),
          this.cashFlowSheetForm.customerCashFlow.iaSubsidiaryCorporationIncome
        ),
        this.cashFlowSheetForm.customerCashFlow.iaPayOtherActivities
      );
      this.countNetInvestment();
      this.countEndingBalance();
    },
    countNetInvestment() {
      this.cashFlowSheetForm.customerCashFlow.iaInvestmentNetCashFlow = this.$subtract(
        this.cashFlowSheetForm.customerCashFlow.iaInvestmentActivitiesInflow,
        this.cashFlowSheetForm.customerCashFlow.iaInvestmentActivitiesOutflow
      );
    },
    countSubtotalOfFinancingIncome() {
      this.cashFlowSheetForm.customerCashFlow.faFinancialActivitiesInflow = this.$add(
        this.$add(
          this.$add(
            this.cashFlowSheetForm.customerCashFlow.faAbsorbInvestment,
            this.cashFlowSheetForm.customerCashFlow.faBorrowMoney
          ),
          this.cashFlowSheetForm.customerCashFlow.faFloatBonds
        ),
        this.cashFlowSheetForm.customerCashFlow.faOtherActivities
      );
      this.countNetFinancing();
      this.countEndingBalance();
    },
    countSubtotalOfFinancingExpenditure() {
      this.cashFlowSheetForm.customerCashFlow.faFinancialActivitiesOutflow = this.$add(
        this.$add(
          this.cashFlowSheetForm.customerCashFlow.faRepayDebt,
          this.cashFlowSheetForm.customerCashFlow.faPayInterest
        ),
        this.cashFlowSheetForm.customerCashFlow.faPayOtherActivities
      );
      this.countNetFinancing();
      this.countEndingBalance();
    },
    countNetFinancing() {
      this.cashFlowSheetForm.customerCashFlow.faFinancialNetCashFlow = this.$subtract(
        this.cashFlowSheetForm.customerCashFlow.faFinancialActivitiesInflow,
        this.cashFlowSheetForm.customerCashFlow.faFinancialActivitiesOutflow
      );
    },
    countEndingBalance() {
      this.cashFlowSheetForm.customerCashFlow.caClosingAmount = this.$add(
        this.$add(
          this.$add(
            this.$add(
              this.$add(
                this.cashFlowSheetForm.customerCashFlow.baBusinessNetCashFlow,
                this.cashFlowSheetForm.customerCashFlow.iaInvestmentNetCashFlow
              ),
              this.cashFlowSheetForm.customerCashFlow.faFinancialNetCashFlow
            ),
            this.cashFlowSheetForm.customerCashFlow.ermExchangeRateMovement
          ),
          this.cashFlowSheetForm.customerCashFlow.ceCashEquivalent
        ),
        this.cashFlowSheetForm.customerCashFlow.iinitabala
      );
    }
  }
};
</script>

<style lang="sass" scoped>
// 文件导入
.upload-demo2
  display: none
</style>
