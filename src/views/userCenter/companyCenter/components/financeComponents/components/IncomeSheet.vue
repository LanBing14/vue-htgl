<template>
  <el-form ref="incomeSheetForm" :model="incomeSheetForm" :rules="incomeSheetRules" label-width="0">
    <div style="text-align: right">
      <a :href="baseUrl+fxb+'/ecm/customer/financial/downloadTemplate'" target="_blank">
        <el-button size="small" type="primary"  style="position: relative; left: -18px;">下载模版</el-button>
      </a>
      <el-button size="small" type="primary" @click="excelImport" :loading="loading">EXCEL导入</el-button>
      <el-upload
        class="upload-demo2"
        :headers="uploadHeaders"
        :action="baseUrl+fxb+'/ecm/customer/financial/importProfitSheet'"
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
          <th width="170px">本期数</th>
          <th width="170px">期末余额</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="font-weight: bold">一、营业收入</td>
          <td>
            <el-form-item prop="customerProfitcRemark.orOperatingReceipt">
              <el-input v-model="incomeSheetForm.customerProfitcRemark.orOperatingReceipt"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcCurrent.orOperatingReceipt">
              <el-input
                v-model="incomeSheetForm.customerProfitcCurrent.orOperatingReceipt"
                @change="countOperatingProfitCurrent"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcYear.orOperatingReceipt">
              <el-input
                v-model="incomeSheetForm.customerProfitcYear.orOperatingReceipt"
                @change="countOperatingProfitRest"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="padding-left: 24px">减：营业成本</td>
          <td>
            <el-form-item prop="customerProfitcRemark.orOperatingCosts">
              <el-input v-model="incomeSheetForm.customerProfitcRemark.orOperatingCosts"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcCurrent.orOperatingCosts">
              <el-input
                v-model="incomeSheetForm.customerProfitcCurrent.orOperatingCosts"
                @change="countOperatingProfitCurrent"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcYear.orOperatingCosts">
              <el-input
                v-model="incomeSheetForm.customerProfitcYear.orOperatingCosts"
                @change="countOperatingProfitRest"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="padding-left: 36px">税金及附加</td>
          <td>
            <el-form-item prop="customerProfitcRemark.orTaxesSurcharges">
              <el-input v-model="incomeSheetForm.customerProfitcRemark.orTaxesSurcharges"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcCurrent.orTaxesSurcharges">
              <el-input
                v-model="incomeSheetForm.customerProfitcCurrent.orTaxesSurcharges"
                @change="countOperatingProfitCurrent"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcYear.orTaxesSurcharges">
              <el-input
                v-model="incomeSheetForm.customerProfitcYear.orTaxesSurcharges"
                @change="countOperatingProfitRest"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="padding-left: 36px">销售费用</td>
          <td>
            <el-form-item prop="customerProfitcRemark.orSellingExpenses">
              <el-input v-model="incomeSheetForm.customerProfitcRemark.orSellingExpenses"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcCurrent.orSellingExpenses">
              <el-input
                v-model="incomeSheetForm.customerProfitcCurrent.orSellingExpenses"
                @change="countOperatingProfitCurrent"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcYear.orSellingExpenses">
              <el-input
                v-model="incomeSheetForm.customerProfitcYear.orSellingExpenses"
                @change="countOperatingProfitRest"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="padding-left: 36px">管理费用</td>
          <td>
            <el-form-item prop="customerProfitcRemark.orOverheadExpense">
              <el-input v-model="incomeSheetForm.customerProfitcRemark.orOverheadExpense"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcCurrent.orOverheadExpense">
              <el-input
                v-model="incomeSheetForm.customerProfitcCurrent.orOverheadExpense"
                @change="countOperatingProfitCurrent"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcYear.orOverheadExpense">
              <el-input
                v-model="incomeSheetForm.customerProfitcYear.orOverheadExpense"
                @change="countOperatingProfitRest"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="padding-left: 36px">研发费用</td>
          <td>
            <el-form-item prop="customerProfitcRemark.orDevelopmentExpense">
              <el-input v-model="incomeSheetForm.customerProfitcRemark.orDevelopmentExpense"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcCurrent.orDevelopmentExpense">
              <el-input
                v-model="incomeSheetForm.customerProfitcCurrent.orDevelopmentExpense"
                @change="countOperatingProfitCurrent"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcYear.orDevelopmentExpense">
              <el-input
                v-model="incomeSheetForm.customerProfitcYear.orDevelopmentExpense"
                @change="countOperatingProfitRest"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="padding-left: 36px">财务费用</td>
          <td>
            <el-form-item prop="customerProfitcRemark.orFinancialExpense">
              <el-input v-model="incomeSheetForm.customerProfitcRemark.orFinancialExpense"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcCurrent.orFinancialExpense">
              <el-input
                v-model="incomeSheetForm.customerProfitcCurrent.orFinancialExpense"
                @change="countOperatingProfitCurrent"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcYear.orFinancialExpense">
              <el-input
                v-model="incomeSheetForm.customerProfitcYear.orFinancialExpense"
                @change="countOperatingProfitRest"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="padding-left: 48px">其中：利息费用</td>
          <td>
            <el-form-item prop="customerProfitcRemark.orFinancialInterestExpense">
              <el-input v-model="incomeSheetForm.customerProfitcRemark.orFinancialInterestExpense"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcCurrent.orFinancialInterestExpense">
              <el-input v-model="incomeSheetForm.customerProfitcCurrent.orFinancialInterestExpense"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcYear.orFinancialInterestExpense">
              <el-input v-model="incomeSheetForm.customerProfitcYear.orFinancialInterestExpense"></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="padding-left: 48px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;利息收入</td>
          <td>
            <el-form-item prop="customerProfitcRemark.orFinancialInterestIncome">
              <el-input v-model="incomeSheetForm.customerProfitcRemark.orFinancialInterestIncome"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcCurrent.orFinancialInterestIncome">
              <el-input v-model="incomeSheetForm.customerProfitcCurrent.orFinancialInterestIncome"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcYear.orFinancialInterestIncome">
              <el-input v-model="incomeSheetForm.customerProfitcYear.orFinancialInterestIncome"></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="padding-left: 24px">加：其他收益</td>
          <td>
            <el-form-item prop="customerProfitcRemark.orOtherBenefit">
              <el-input v-model="incomeSheetForm.customerProfitcRemark.orOtherBenefit"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcCurrent.orOtherBenefit">
              <el-input
                v-model="incomeSheetForm.customerProfitcCurrent.orOtherBenefit"
                @change="countOperatingProfitCurrent"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcYear.orOtherBenefit">
              <el-input
                v-model="incomeSheetForm.customerProfitcYear.orOtherBenefit"
                @change="countOperatingProfitRest"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="padding-left: 36px">投资收益（损失以“－”号填列）</td>
          <td>
            <el-form-item prop="customerProfitcRemark.orInvestmentBenefit">
              <el-input v-model="incomeSheetForm.customerProfitcRemark.orInvestmentBenefit"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcCurrent.orInvestmentBenefit">
              <el-input
                v-model="incomeSheetForm.customerProfitcCurrent.orInvestmentBenefit"
                @change="countOperatingProfitCurrent"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcYear.orInvestmentBenefit">
              <el-input
                v-model="incomeSheetForm.customerProfitcYear.orInvestmentBenefit"
                @change="countOperatingProfitRest"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="padding-left: 48px">其中：对联营企业和合营企业的投资收益</td>
          <td>
            <el-form-item prop="customerProfitcRemark.orJointVentureIncome">
              <el-input v-model="incomeSheetForm.customerProfitcRemark.orJointVentureIncome"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcCurrent.orJointVentureIncome">
              <el-input
                v-model="incomeSheetForm.customerProfitcCurrent.orJointVentureIncome"
                @change="countOperatingProfitCurrent"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcYear.orJointVentureIncome">
              <el-input
                v-model="incomeSheetForm.customerProfitcYear.orJointVentureIncome"
                @change="countOperatingProfitRest"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="padding-left: 36px; color: #F56C6C">净敞口套期收益</td>
          <td>
            <el-form-item prop="customerProfitcRemark.orNetExposureIncome">
              <el-input v-model="incomeSheetForm.customerProfitcRemark.orNetExposureIncome"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcCurrent.orNetExposureIncome">
              <el-input
                v-model="incomeSheetForm.customerProfitcCurrent.orNetExposureIncome"
                @change="countOperatingProfitCurrent"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcYear.orNetExposureIncome">
              <el-input
                v-model="incomeSheetForm.customerProfitcYear.orNetExposureIncome"
                @change="countOperatingProfitRest"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="padding-left: 36px">公允价值变动收益（损失以“－”号填列）</td>
          <td>
            <el-form-item prop="customerProfitcRemark.orFairValueChangesIncome">
              <el-input v-model="incomeSheetForm.customerProfitcRemark.orFairValueChangesIncome"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcCurrent.orFairValueChangesIncome">
              <el-input
                v-model="incomeSheetForm.customerProfitcCurrent.orFairValueChangesIncome"
                @change="countOperatingProfitCurrent"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcYear.orFairValueChangesIncome">
              <el-input
                v-model="incomeSheetForm.customerProfitcYear.orFairValueChangesIncome"
                @change="countOperatingProfitRest"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="padding-left: 36px; color: #F56C6C">信用减值损失（损失以“－”号填列）</td>
          <td>
            <el-form-item prop="customerProfitcRemark.orCreditImpairment">
              <el-input v-model="incomeSheetForm.customerProfitcRemark.orCreditImpairment"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcCurrent.orCreditImpairment">
              <el-input
                v-model="incomeSheetForm.customerProfitcCurrent.orCreditImpairment"
                @change="countOperatingProfitCurrent"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcYear.orCreditImpairment">
              <el-input
                v-model="incomeSheetForm.customerProfitcYear.orCreditImpairment"
                @change="countOperatingProfitRest"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="padding-left: 36px; color: #F56C6C">资产减值损失（损失以“－”号填列）</td>
          <td>
            <el-form-item prop="customerProfitcRemark.orAssetsImpairmentLoss">
              <el-input v-model="incomeSheetForm.customerProfitcRemark.orAssetsImpairmentLoss"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcCurrent.orAssetsImpairmentLoss">
              <el-input
                v-model="incomeSheetForm.customerProfitcCurrent.orAssetsImpairmentLoss"
                @change="countOperatingProfitCurrent"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcYear.orAssetsImpairmentLoss">
              <el-input
                v-model="incomeSheetForm.customerProfitcYear.orAssetsImpairmentLoss"
                @change="countOperatingProfitRest"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="padding-left: 36px">资产处置收益（损失以“-”号填列）</td>
          <td>
            <el-form-item prop="customerProfitcRemark.orAssetDisposalProceeds">
              <el-input v-model="incomeSheetForm.customerProfitcRemark.orAssetDisposalProceeds"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcCurrent.orAssetDisposalProceeds">
              <el-input
                v-model="incomeSheetForm.customerProfitcCurrent.orAssetDisposalProceeds"
                @change="countOperatingProfitCurrent"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcYear.orAssetDisposalProceeds">
              <el-input
                v-model="incomeSheetForm.customerProfitcYear.orAssetDisposalProceeds"
                @change="countOperatingProfitRest"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="font-weight: bold">二、营业利润（亏损以“－”号填列）</td>
          <td>
            <el-form-item prop="customerProfitcRemark.opOperatingProfit">
              <el-input v-model="incomeSheetForm.customerProfitcRemark.opOperatingProfit"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcCurrent.opOperatingProfit">
              <el-input disabled v-model="incomeSheetForm.customerProfitcCurrent.opOperatingProfit"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcYear.opOperatingProfit">
              <el-input disabled v-model="incomeSheetForm.customerProfitcYear.opOperatingProfit"></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="padding-left: 24px">加：营业外收入</td>
          <td>
            <el-form-item prop="customerProfitcRemark.opNonbusinessIncome">
              <el-input v-model="incomeSheetForm.customerProfitcRemark.opNonbusinessIncome"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcCurrent.opNonbusinessIncome">
              <el-input
                v-model="incomeSheetForm.customerProfitcCurrent.opNonbusinessIncome"
                @change="countTotalProfitCurrent"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcYear.opNonbusinessIncome">
              <el-input
                v-model="incomeSheetForm.customerProfitcYear.opNonbusinessIncome"
                @change="countTotalProfitRest"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="padding-left: 24px">减：营业外支出</td>
          <td>
            <el-form-item prop="customerProfitcRemark.opNonbusinessExpense">
              <el-input v-model="incomeSheetForm.customerProfitcRemark.opNonbusinessExpense"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcCurrent.opNonbusinessExpense">
              <el-input
                v-model="incomeSheetForm.customerProfitcCurrent.opNonbusinessExpense"
                @change="countTotalProfitCurrent"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcYear.opNonbusinessExpense">
              <el-input
                v-model="incomeSheetForm.customerProfitcYear.opNonbusinessExpense"
                @change="countTotalProfitRest"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="font-weight: bold">三、利润总额（亏损总额以“－”号填列）</td>
          <td>
            <el-form-item prop="customerProfitcRemark.tpTotalProfit">
              <el-input v-model="incomeSheetForm.customerProfitcRemark.tpTotalProfit"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcCurrent.tpTotalProfit">
              <el-input disabled v-model="incomeSheetForm.customerProfitcCurrent.tpTotalProfit"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcYear.tpTotalProfit">
              <el-input disabled v-model="incomeSheetForm.customerProfitcYear.tpTotalProfit"></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="padding-left: 24px">减：所得税费用</td>
          <td>
            <el-form-item prop="customerProfitcRemark.tpIncomeTaxExpense">
              <el-input v-model="incomeSheetForm.customerProfitcRemark.tpIncomeTaxExpense"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcCurrent.tpIncomeTaxExpense">
              <el-input
                v-model="incomeSheetForm.customerProfitcCurrent.tpIncomeTaxExpense"
                @change="countNetProfitCurrent"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcYear.tpIncomeTaxExpense">
              <el-input
                v-model="incomeSheetForm.customerProfitcYear.tpIncomeTaxExpense"
                @change="countNetProfitRest"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="font-weight: bold">四、净利润（净亏损以“－”号填列）</td>
          <td>
            <el-form-item prop="customerProfitcRemark.rpRetainedProfits">
              <el-input v-model="incomeSheetForm.customerProfitcRemark.rpRetainedProfits"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcCurrent.rpRetainedProfits">
              <el-input disabled v-model="incomeSheetForm.customerProfitcCurrent.rpRetainedProfits"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcYear.rpRetainedProfits">
              <el-input disabled v-model="incomeSheetForm.customerProfitcYear.rpRetainedProfits"></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="font-weight: bold">五、每股收益</td>
          <td>
            <el-form-item prop="customerProfitcRemark.epsEarningsPerShare">
              <el-input v-model="incomeSheetForm.customerProfitcRemark.epsEarningsPerShare"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcCurrent.epsEarningsPerShare">
              <el-input v-model="incomeSheetForm.customerProfitcCurrent.epsEarningsPerShare"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcYear.epsEarningsPerShare">
              <el-input v-model="incomeSheetForm.customerProfitcYear.epsEarningsPerShare"></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="padding-left: 24px">（一）基本每股收益</td>
          <td>
            <el-form-item prop="customerProfitcRemark.epsBase">
              <el-input v-model="incomeSheetForm.customerProfitcRemark.epsBase"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcCurrent.epsBase">
              <el-input v-model="incomeSheetForm.customerProfitcCurrent.epsBase"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcYear.epsBase">
              <el-input v-model="incomeSheetForm.customerProfitcYear.epsBase"></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="padding-left: 24px">（二）稀释每股收益</td>
          <td>
            <el-form-item prop="customerProfitcRemark.epsDiluted">
              <el-input v-model="incomeSheetForm.customerProfitcRemark.epsDiluted"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcCurrent.epsDiluted">
              <el-input v-model="incomeSheetForm.customerProfitcCurrent.epsDiluted"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerProfitcYear.epsDiluted">
              <el-input v-model="incomeSheetForm.customerProfitcYear.epsDiluted"></el-input>
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
  name: "IncomeSheet",
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
      incomeSheetForm: {
        customerProfitcCurrent: {
          orOperatingReceipt: null,
          orOperatingCosts: null,
          orTaxesSurcharges: null,
          orSellingExpenses: null,
          orOverheadExpense: null,
          orDevelopmentExpense: null,
          orFinancialExpense: null,
          orFinancialInterestExpense: null,
          orFinancialInterestIncome: null,
          orOtherBenefit: null,
          orInvestmentBenefit: null,
          orJointVentureIncome: null,
          orNetExposureIncome: null,
          orFairValueChangesIncome: null,
          orCreditImpairment: null,
          orAssetsImpairmentLoss: null,
          orAssetDisposalProceeds: null,
          opOperatingProfit: null,
          opNonbusinessIncome: null,
          opNonbusinessExpense: null,
          tpTotalProfit: null,
          tpIncomeTaxExpense: null,
          rpRetainedProfits: null,
          epsEarningsPerShare: null,
          epsBase: null,
          epsDiluted: null
        },
        customerProfitcYear: {
          orOperatingReceipt: null,
          orOperatingCosts: null,
          orTaxesSurcharges: null,
          orSellingExpenses: null,
          orOverheadExpense: null,
          orDevelopmentExpense: null,
          orFinancialExpense: null,
          orFinancialInterestExpense: null,
          orFinancialInterestIncome: null,
          orOtherBenefit: null,
          orInvestmentBenefit: null,
          orJointVentureIncome: null,
          orNetExposureIncome: null,
          orFairValueChangesIncome: null,
          orCreditImpairment: null,
          orAssetsImpairmentLoss: null,
          orAssetDisposalProceeds: null,
          opOperatingProfit: null,
          opNonbusinessIncome: null,
          opNonbusinessExpense: null,
          tpTotalProfit: null,
          tpIncomeTaxExpense: null,
          rpRetainedProfits: null,
          epsEarningsPerShare: null,
          epsBase: null,
          epsDiluted: null
        },
        customerProfitcRemark: {
          orOperatingReceipt: null,
          orOperatingCosts: null,
          orTaxesSurcharges: null,
          orSellingExpenses: null,
          orOverheadExpense: null,
          orDevelopmentExpense: null,
          orFinancialExpense: null,
          orFinancialInterestExpense: null,
          orFinancialInterestIncome: null,
          orOtherBenefit: null,
          orInvestmentBenefit: null,
          orJointVentureIncome: null,
          orNetExposureIncome: null,
          orFairValueChangesIncome: null,
          orCreditImpairment: null,
          orAssetsImpairmentLoss: null,
          orAssetDisposalProceeds: null,
          opOperatingProfit: null,
          opNonbusinessIncome: null,
          opNonbusinessExpense: null,
          tpTotalProfit: null,
          tpIncomeTaxExpense: null,
          rpRetainedProfits: null,
          epsEarningsPerShare: null,
          epsBase: null,
          epsDiluted: null
        }
      },
      incomeSheetRules: {
        customerProfitcCurrent: {
          orOperatingReceipt: createRules({ msg: "", numberFloat: true }),
          orOperatingCosts: createRules({ msg: "", numberFloat: true }),
          orTaxesSurcharges: createRules({ msg: "", numberFloat: true }),
          orSellingExpenses: createRules({ msg: "", numberFloat: true }),
          orOverheadExpense: createRules({ msg: "", numberFloat: true }),
          orDevelopmentExpense: createRules({ msg: "", numberFloat: true }),
          orFinancialExpense: createRules({ msg: "", numberFloat: true }),
          orFinancialInterestExpense: createRules({ msg: "", numberFloat: true }),
          orFinancialInterestIncome: createRules({ msg: "", numberFloat: true }),
          orOtherBenefit: createRules({ msg: "", numberFloat: true }),
          orInvestmentBenefit: createRules({ msg: "", numberFloat: true }),
          orJointVentureIncome: createRules({ msg: "", numberFloat: true }),
          orNetExposureIncome: createRules({ msg: "", numberFloat: true }),
          orFairValueChangesIncome: createRules({ msg: "", numberFloat: true }),
          orCreditImpairment: createRules({ msg: "", numberFloat: true }),
          orAssetsImpairmentLoss: createRules({ msg: "", numberFloat: true }),
          orAssetDisposalProceeds: createRules({ msg: "", numberFloat: true }),
          opNonbusinessIncome: createRules({ msg: "", numberFloat: true }),
          opNonbusinessExpense: createRules({ msg: "", numberFloat: true }),
          tpIncomeTaxExpense: createRules({ msg: "", numberFloat: true }),
          epsEarningsPerShare: createRules({ msg: "", numberFloat: true }),
          epsBase: createRules({ msg: "", numberFloat: true }),
          epsDiluted: createRules({ msg: "", numberFloat: true })
        },
        customerProfitcYear: {
          orOperatingReceipt: createRules({ msg: "", numberFloat: true }),
          orOperatingCosts: createRules({ msg: "", numberFloat: true }),
          orTaxesSurcharges: createRules({ msg: "", numberFloat: true }),
          orSellingExpenses: createRules({ msg: "", numberFloat: true }),
          orOverheadExpense: createRules({ msg: "", numberFloat: true }),
          orDevelopmentExpense: createRules({ msg: "", numberFloat: true }),
          orFinancialExpense: createRules({ msg: "", numberFloat: true }),
          orFinancialInterestExpense: createRules({ msg: "", numberFloat: true }),
          orFinancialInterestIncome: createRules({ msg: "", numberFloat: true }),
          orOtherBenefit: createRules({ msg: "", numberFloat: true }),
          orInvestmentBenefit: createRules({ msg: "", numberFloat: true }),
          orJointVentureIncome: createRules({ msg: "", numberFloat: true }),
          orNetExposureIncome: createRules({ msg: "", numberFloat: true }),
          orFairValueChangesIncome: createRules({ msg: "", numberFloat: true }),
          orCreditImpairment: createRules({ msg: "", numberFloat: true }),
          orAssetsImpairmentLoss: createRules({ msg: "", numberFloat: true }),
          orAssetDisposalProceeds: createRules({ msg: "", numberFloat: true }),
          opNonbusinessIncome: createRules({ msg: "", numberFloat: true }),
          opNonbusinessExpense: createRules({ msg: "", numberFloat: true }),
          tpIncomeTaxExpense: createRules({ msg: "", numberFloat: true }),
          epsEarningsPerShare: createRules({ msg: "", numberFloat: true }),
          epsBase: createRules({ msg: "", numberFloat: true }),
          epsDiluted: createRules({ msg: "", numberFloat: true })
        }
      }
    };
  },
  methods: {
    validForm(cb) {
      this.$refs["incomeSheetForm"].validate(valid => {
        if (valid) {
          cb(this.incomeSheetForm);
        } else {
          this.$message({
            message: "利润表有信息未填写正确！",
            type: "warning"
          });
        }
      });
    },
    setData(_customerProfitcCurrent, _customerProfitcYear, _customerProfitcRemark) {
      _customerProfitcCurrent && (this.incomeSheetForm.customerProfitcCurrent = _customerProfitcCurrent);
      _customerProfitcYear && (this.incomeSheetForm.customerProfitcYear = _customerProfitcYear);
      _customerProfitcRemark && (this.incomeSheetForm.customerProfitcRemark = _customerProfitcRemark);
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
        this.incomeSheetForm.customerProfitcCurrent = res.data.customerProfitcCurrent;
        this.incomeSheetForm.customerProfitcYear = res.data.customerProfitcYear;
        this.incomeSheetForm.customerProfitcRemark = res.data.customerProfitcRemark;
      } else {
        this.$message.error("解析文件失败，请检查文件是否按照要求填写！");
      }
    },
    /**
     * @计算合计
     */
    countOperatingProfitCurrent() {
      this.incomeSheetForm.customerProfitcCurrent.opOperatingProfit = this.$add(
        this.$add(
          this.$add(
            this.$add(
              this.$add(
                this.$add(
                  this.$add(
                    this.$add(
                      this.$subtract(
                        this.$subtract(
                          this.$subtract(
                            this.$subtract(
                              this.$subtract(
                                this.$subtract(
                                  this.incomeSheetForm.customerProfitcCurrent.orOperatingReceipt,
                                  this.incomeSheetForm.customerProfitcCurrent.orOperatingCosts
                                ),
                                this.incomeSheetForm.customerProfitcCurrent.orTaxesSurcharges
                              ),
                              this.incomeSheetForm.customerProfitcCurrent.orSellingExpenses
                            ),
                            this.incomeSheetForm.customerProfitcCurrent.orOverheadExpense
                          ),
                          this.incomeSheetForm.customerProfitcCurrent.orDevelopmentExpense
                        ),
                        this.incomeSheetForm.customerProfitcCurrent.orFinancialExpense
                      ),
                      this.incomeSheetForm.customerProfitcCurrent.orOtherBenefit
                    ),
                    this.incomeSheetForm.customerProfitcCurrent.orInvestmentBenefit
                  ),
                  this.incomeSheetForm.customerProfitcCurrent.orJointVentureIncome
                ),
                this.incomeSheetForm.customerProfitcCurrent.orNetExposureIncome
              ),
              this.incomeSheetForm.customerProfitcCurrent.orFairValueChangesIncome
            ),
            this.incomeSheetForm.customerProfitcCurrent.orCreditImpairment
          ),
          this.incomeSheetForm.customerProfitcCurrent.orAssetsImpairmentLoss
        ),
        this.incomeSheetForm.customerProfitcCurrent.orAssetDisposalProceeds
      );
      this.countTotalProfitCurrent();
    },
    countOperatingProfitRest() {
      this.incomeSheetForm.customerProfitcYear.opOperatingProfit = this.$add(
        this.$add(
          this.$add(
            this.$add(
              this.$add(
                this.$add(
                  this.$add(
                    this.$add(
                      this.$subtract(
                        this.$subtract(
                          this.$subtract(
                            this.$subtract(
                              this.$subtract(
                                this.$subtract(
                                  this.incomeSheetForm.customerProfitcYear.orOperatingReceipt,
                                  this.incomeSheetForm.customerProfitcYear.orOperatingCosts
                                ),
                                this.incomeSheetForm.customerProfitcYear.orTaxesSurcharges
                              ),
                              this.incomeSheetForm.customerProfitcYear.orSellingExpenses
                            ),
                            this.incomeSheetForm.customerProfitcYear.orOverheadExpense
                          ),
                          this.incomeSheetForm.customerProfitcYear.orDevelopmentExpense
                        ),
                        this.incomeSheetForm.customerProfitcYear.orFinancialExpense
                      ),
                      this.incomeSheetForm.customerProfitcYear.orOtherBenefit
                    ),
                    this.incomeSheetForm.customerProfitcYear.orInvestmentBenefit
                  ),
                  this.incomeSheetForm.customerProfitcYear.orJointVentureIncome
                ),
                this.incomeSheetForm.customerProfitcYear.orNetExposureIncome
              ),
              this.incomeSheetForm.customerProfitcYear.orFairValueChangesIncome
            ),
            this.incomeSheetForm.customerProfitcYear.orCreditImpairment
          ),
          this.incomeSheetForm.customerProfitcYear.orAssetsImpairmentLoss
        ),
        this.incomeSheetForm.customerProfitcYear.orAssetDisposalProceeds
      );
      this.countTotalProfitRest();
    },
    countTotalProfitCurrent() {
      this.incomeSheetForm.customerProfitcCurrent.tpTotalProfit = this.$subtract(
        this.$add(
          this.incomeSheetForm.customerProfitcCurrent.opOperatingProfit,
          this.incomeSheetForm.customerProfitcCurrent.opNonbusinessIncome
        ),
        this.incomeSheetForm.customerProfitcCurrent.opNonbusinessExpense
      );
      this.countNetProfitCurrent();
    },
    countTotalProfitRest() {
      this.incomeSheetForm.customerProfitcYear.tpTotalProfit = this.$subtract(
        this.$add(
          this.incomeSheetForm.customerProfitcYear.opOperatingProfit,
          this.incomeSheetForm.customerProfitcYear.opNonbusinessIncome
        ),
        this.incomeSheetForm.customerProfitcYear.opNonbusinessExpense
      );
      this.countNetProfitRest();
    },
    countNetProfitCurrent() {
      this.incomeSheetForm.customerProfitcCurrent.rpRetainedProfits = this.$subtract(
        this.incomeSheetForm.customerProfitcCurrent.tpTotalProfit,
        this.incomeSheetForm.customerProfitcCurrent.tpIncomeTaxExpense
      );
    },
    countNetProfitRest() {
      this.incomeSheetForm.customerProfitcYear.rpRetainedProfits = this.$subtract(
        this.incomeSheetForm.customerProfitcYear.tpTotalProfit,
        this.incomeSheetForm.customerProfitcYear.tpIncomeTaxExpense
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
