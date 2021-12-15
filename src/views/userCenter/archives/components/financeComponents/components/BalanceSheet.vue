<template>
  <el-form ref="balanceSheetForm" :model="balanceSheetForm" :rules="balanceSheetRules" label-width="0">
    <div style="text-align: right">
      <a :href="baseUrl+fxb+'/ecm/customer/financial/downloadTemplate'" target="_blank">
        <el-button size="small" type="primary" style="position: relative; left: -18px;">下载模版</el-button>
      </a>
      <el-button size="small" type="primary" @click="excelImport" :loading="loading">EXCEL导入</el-button>
      <el-upload
        class="upload-demo2"
        :headers="uploadHeaders"
        :action="baseUrl+fxb+'/ecm/customer/financial/importDebtSheet'"
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
          <th>资产</th>
          <th>附注</th>
          <th width="170px">年初余额</th>
          <th width="170px">期末余额</th>
          <th>负债和所有者权益(或股东权益)</th>
          <th>附注</th>
          <th width="170px">年初余额</th>
          <th width="170px">期末余额</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="font-weight: bold" colspan="4">流动资产：</td>
          <td style="font-weight: bold" colspan="4">流动负债：</td>
        </tr>
        <tr>
          <td>货币资金</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.caMonetaryCapital">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.caMonetaryCapital"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.caMonetaryCapital">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.caMonetaryCapital"
                @change="countTotalCurrentAssetsEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.caMonetaryCapital">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.caMonetaryCapital"
                @change="countTotalCurrentAssetsEnd"
              ></el-input>
            </el-form-item>
          </td>
          <td>短期借款</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.clShortTermBorrowing">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.clShortTermBorrowing"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.clShortTermBorrowing">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.clShortTermBorrowing"
                @change="countTotalCurrentLiabilitiesEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.clShortTermBorrowing">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.clShortTermBorrowing"
                @change="countTotalCurrentLiabilitiesEnd"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>交易性金融资产</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.caTradableFinancialAssets">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.caTradableFinancialAssets"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.caTradableFinancialAssets">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.caTradableFinancialAssets"
                @change="countTotalCurrentAssetsEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.caTradableFinancialAssets">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.caTradableFinancialAssets"
                @change="countTotalCurrentAssetsEnd"
              ></el-input>
            </el-form-item>
          </td>
          <td>交易性金融负债</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.clTradingFinancialLiabilities">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.clTradingFinancialLiabilities"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.clTradingFinancialLiabilities">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.clTradingFinancialLiabilities"
                @change="countTotalCurrentLiabilitiesEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.clTradingFinancialLiabilities">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.clTradingFinancialLiabilities"
                @change="countTotalCurrentLiabilitiesEnd"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>以公允价值计量且其变动计入当期损益的金融资产</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.caMovableAssets">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.caMovableAssets"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.caMovableAssets">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.caMovableAssets"
                @change="countTotalCurrentAssetsEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.caMovableAssets">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.caMovableAssets"
                @change="countTotalCurrentAssetsEnd"
              ></el-input>
            </el-form-item>
          </td>
          <td>以公允价值计量且其变动计入当期损益的金融负债</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.clMovableLiabilities">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.clMovableLiabilities"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.clMovableLiabilities">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.clMovableLiabilities"
                @change="countTotalCurrentLiabilitiesEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.clMovableLiabilities">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.clMovableLiabilities"
                @change="countTotalCurrentLiabilitiesEnd"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>衍生金融资产</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.caDerivativeFinancialAssets">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.caDerivativeFinancialAssets"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.caDerivativeFinancialAssets">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.caDerivativeFinancialAssets"
                @change="countTotalCurrentAssetsEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.caDerivativeFinancialAssets">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.caDerivativeFinancialAssets"
                @change="countTotalCurrentAssetsEnd"
              ></el-input>
            </el-form-item>
          </td>
          <td>衍生金融负债</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.clDerivativeFinancialLiabilitsy">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.clDerivativeFinancialLiabilitsy"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.clDerivativeFinancialLiabilitsy">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.clDerivativeFinancialLiabilitsy"
                @change="countTotalCurrentLiabilitiesEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.clDerivativeFinancialLiabilitsy">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.clDerivativeFinancialLiabilitsy"
                @change="countTotalCurrentLiabilitiesEnd"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>应收票据</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.caNotesReceivable">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.caNotesReceivable"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.caNotesReceivable">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.caNotesReceivable"
                @change="countTotalCurrentAssetsEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.caNotesReceivable">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.caNotesReceivable"
                @change="countTotalCurrentAssetsEnd"
              ></el-input>
            </el-form-item>
          </td>
          <td>应付票据</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.clNotesPayable">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.clNotesPayable"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.clNotesPayable">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.clNotesPayable"
                @change="countTotalCurrentLiabilitiesEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.clNotesPayable">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.clNotesPayable"
                @change="countTotalCurrentLiabilitiesEnd"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>应收账款</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.caReceivables">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.caReceivables"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.caReceivables">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.caReceivables"
                @change="countTotalCurrentAssetsEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.caReceivables">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.caReceivables"
                @change="countTotalCurrentAssetsEnd"
              ></el-input>
            </el-form-item>
          </td>
          <td>应付账款</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.clAccountsPayable">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.clAccountsPayable"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.clAccountsPayable">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.clAccountsPayable"
                @change="countTotalCurrentLiabilitiesEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.clAccountsPayable">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.clAccountsPayable"
                @change="countTotalCurrentLiabilitiesEnd"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>应收款项融资</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.caReceivablesFinancing">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.caReceivablesFinancing"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.caReceivablesFinancing">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.caReceivablesFinancing"
                @change="countTotalCurrentAssetsEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.caReceivablesFinancing">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.caReceivablesFinancing"
                @change="countTotalCurrentAssetsEnd"
              ></el-input>
            </el-form-item>
          </td>
          <td>预收款项</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.clUnearnedRevenue">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.clUnearnedRevenue"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.clUnearnedRevenue">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.clUnearnedRevenue"
                @change="countTotalCurrentLiabilitiesEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.clUnearnedRevenue">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.clUnearnedRevenue"
                @change="countTotalCurrentLiabilitiesEnd"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>预付款项</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.caAdvancePayment">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.caAdvancePayment"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.caAdvancePayment">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.caAdvancePayment"
                @change="countTotalCurrentAssetsEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.caAdvancePayment">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.caAdvancePayment"
                @change="countTotalCurrentAssetsEnd"
              ></el-input>
            </el-form-item>
          </td>
          <td>应付职工薪酬</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.clPayrollPayable">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.clPayrollPayable"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.clPayrollPayable">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.clPayrollPayable"
                @change="countTotalCurrentLiabilitiesEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.clPayrollPayable">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.clPayrollPayable"
                @change="countTotalCurrentLiabilitiesEnd"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>其他应收款</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.caOtherReceivables">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.caOtherReceivables"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.caOtherReceivables">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.caOtherReceivables"
                @change="countTotalCurrentAssetsEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.caOtherReceivables">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.caOtherReceivables"
                @change="countTotalCurrentAssetsEnd"
              ></el-input>
            </el-form-item>
          </td>
          <td>应交税费</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.clTaxPayable">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.clTaxPayable"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.clTaxPayable">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.clTaxPayable"
                @change="countTotalCurrentLiabilitiesEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.clTaxPayable">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.clTaxPayable"
                @change="countTotalCurrentLiabilitiesEnd"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>存货</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.caInventory">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.caInventory"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.caInventory">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.caInventory"
                @change="countTotalCurrentAssetsEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.caInventory">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.caInventory"
                @change="countTotalCurrentAssetsEnd"
              ></el-input>
            </el-form-item>
          </td>
          <td>其他应付款</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.clOtherPayables">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.clOtherPayables"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.clOtherPayables">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.clOtherPayables"
                @change="countTotalCurrentLiabilitiesEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.clOtherPayables">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.clOtherPayables"
                @change="countTotalCurrentLiabilitiesEnd"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>持有待售资产</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.caHoldingSaleAssets">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.caHoldingSaleAssets"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.caHoldingSaleAssets">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.caHoldingSaleAssets"
                @change="countTotalCurrentAssetsEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.caHoldingSaleAssets">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.caHoldingSaleAssets"
                @change="countTotalCurrentAssetsEnd"
              ></el-input>
            </el-form-item>
          </td>
          <td>持有待售负债</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.clHoldingLiabilities">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.clHoldingLiabilities"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.clHoldingLiabilities">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.clHoldingLiabilities"
                @change="countTotalCurrentLiabilitiesEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.clHoldingLiabilities">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.clHoldingLiabilities"
                @change="countTotalCurrentLiabilitiesEnd"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>一年内到期的非流动资产</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.caCurrentAssetsComingDue">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.caCurrentAssetsComingDue"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.caCurrentAssetsComingDue">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.caCurrentAssetsComingDue"
                @change="countTotalCurrentAssetsEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.caCurrentAssetsComingDue">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.caCurrentAssetsComingDue"
                @change="countTotalCurrentAssetsEnd"
              ></el-input>
            </el-form-item>
          </td>
          <td>一年内到期的非流动负债</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.clCurrentLiabilitiesComingDue">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.clCurrentLiabilitiesComingDue"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.clCurrentLiabilitiesComingDue">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.clCurrentLiabilitiesComingDue"
                @change="countTotalCurrentLiabilitiesEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.clCurrentLiabilitiesComingDue">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.clCurrentLiabilitiesComingDue"
                @change="countTotalCurrentLiabilitiesEnd"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>其他流动资产</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.caOtherCurrentAssets">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.caOtherCurrentAssets"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.caOtherCurrentAssets">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.caOtherCurrentAssets"
                @change="countTotalCurrentAssetsEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.caOtherCurrentAssets">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.caOtherCurrentAssets"
                @change="countTotalCurrentAssetsEnd"
              ></el-input>
            </el-form-item>
          </td>
          <td>其他流动负债</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.clOtherCurrentLiability">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.clOtherCurrentLiability"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.clOtherCurrentLiability">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.clOtherCurrentLiability"
                @change="countTotalCurrentLiabilitiesEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.clOtherCurrentLiability">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.clOtherCurrentLiability"
                @change="countTotalCurrentLiabilitiesEnd"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td align="center" style="font-weight: bold">流动资产合计</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.caCurrentAssetsTotal">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.caCurrentAssetsTotal"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.caCurrentAssetsTotal">
              <el-input disabled v-model="balanceSheetForm.customerLiabilities.caCurrentAssetsTotal"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.caCurrentAssetsTotal">
              <el-input disabled v-model="balanceSheetForm.customerLiabilitiesEnd.caCurrentAssetsTotal"></el-input>
            </el-form-item>
          </td>
          <td align="center" style="font-weight: bold">流动负债合计</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.clCurrentLiabilitiesTotal">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.clCurrentLiabilitiesTotal"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.clCurrentLiabilitiesTotal">
              <el-input disabled v-model="balanceSheetForm.customerLiabilities.clCurrentLiabilitiesTotal"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.clCurrentLiabilitiesTotal">
              <el-input disabled v-model="balanceSheetForm.customerLiabilitiesEnd.clCurrentLiabilitiesTotal"></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="font-weight: bold" colspan="4">非流动资产：</td>
          <td style="font-weight: bold" colspan="4">非流动负债：</td>
        </tr>
        <tr>
          <td>债权投资</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.ncaBondInvestment">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.ncaBondInvestment"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.ncaBondInvestment">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.ncaBondInvestment"
                @change="countTotalNonCurrentAssetsEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.ncaBondInvestment">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.ncaBondInvestment"
                @change="countTotalNonCurrentAssetsEnd"
              ></el-input>
            </el-form-item>
          </td>
          <td>长期借款</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.nclFundedDebt">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.nclFundedDebt"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.nclFundedDebt">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.nclFundedDebt"
                @change="countTotalNonCurrentLiabilitiesEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.nclFundedDebt">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.nclFundedDebt"
                @change="countTotalNonCurrentLiabilitiesEnd"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>可供出售金融资产</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.ncaFinancialAssets">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.ncaFinancialAssets"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.ncaFinancialAssets">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.ncaFinancialAssets"
                @change="countTotalNonCurrentAssetsEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.ncaFinancialAssets">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.ncaFinancialAssets"
                @change="countTotalNonCurrentAssetsEnd"
              ></el-input>
            </el-form-item>
          </td>
          <td>应付债券</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.nclBondsPayable">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.nclBondsPayable"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.nclBondsPayable">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.nclBondsPayable"
                @change="countTotalNonCurrentLiabilitiesEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.nclBondsPayable">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.nclBondsPayable"
                @change="countTotalNonCurrentLiabilitiesEnd"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>其他债权投资</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.ncaOtherDebt">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.ncaOtherDebt"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.ncaOtherDebt">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.ncaOtherDebt"
                @change="countTotalNonCurrentAssetsEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.ncaOtherDebt">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.ncaOtherDebt"
                @change="countTotalNonCurrentAssetsEnd"
              ></el-input>
            </el-form-item>
          </td>
          <td>其中：优先股</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.nclPreferredStock">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.nclPreferredStock"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.nclPreferredStock">
              <el-input v-model="balanceSheetForm.customerLiabilities.nclPreferredStock"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.nclPreferredStock">
              <el-input v-model="balanceSheetForm.customerLiabilitiesEnd.nclPreferredStock"></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>持有至到期投资</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.ncaHeldMaturity">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.ncaHeldMaturity"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.ncaHeldMaturity">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.ncaHeldMaturity"
                @change="countTotalNonCurrentAssetsEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.ncaHeldMaturity">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.ncaHeldMaturity"
                @change="countTotalNonCurrentAssetsEnd"
              ></el-input>
            </el-form-item>
          </td>
          <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;永续债</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.nclPerpetualBond">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.nclPerpetualBond"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.nclPerpetualBond">
              <el-input v-model="balanceSheetForm.customerLiabilities.nclPerpetualBond"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.nclPerpetualBond">
              <el-input v-model="balanceSheetForm.customerLiabilitiesEnd.nclPerpetualBond"></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>长期应收款</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.ncaLongTermReceivables">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.ncaLongTermReceivables"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.ncaLongTermReceivables">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.ncaLongTermReceivables"
                @change="countTotalNonCurrentAssetsEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.ncaLongTermReceivables">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.ncaLongTermReceivables"
                @change="countTotalNonCurrentAssetsEnd"
              ></el-input>
            </el-form-item>
          </td>
          <td>长期应付款</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.nclLongTermPayable">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.nclLongTermPayable"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.nclLongTermPayable">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.nclLongTermPayable"
                @change="countTotalNonCurrentLiabilitiesEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.nclLongTermPayable">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.nclLongTermPayable"
                @change="countTotalNonCurrentLiabilitiesEnd"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>长期股权投资</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.ncaLongTermEquity">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.ncaLongTermEquity"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.ncaLongTermEquity">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.ncaLongTermEquity"
                @change="countTotalNonCurrentAssetsEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.ncaLongTermEquity">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.ncaLongTermEquity"
                @change="countTotalNonCurrentAssetsEnd"
              ></el-input>
            </el-form-item>
          </td>
          <td>预计负债</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.nclAccruedLiabilities">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.nclAccruedLiabilities"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.nclAccruedLiabilities">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.nclAccruedLiabilities"
                @change="countTotalNonCurrentLiabilitiesEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.nclAccruedLiabilities">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.nclAccruedLiabilities"
                @change="countTotalNonCurrentLiabilitiesEnd"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>其他权益工具投资</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.ncaOtherEquityInstruments">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.ncaOtherEquityInstruments"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.ncaOtherEquityInstruments">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.ncaOtherEquityInstruments"
                @change="countTotalNonCurrentAssetsEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.ncaOtherEquityInstruments">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.ncaOtherEquityInstruments"
                @change="countTotalNonCurrentAssetsEnd"
              ></el-input>
            </el-form-item>
          </td>
          <td>递延收益</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.nclDeferredIncome">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.nclDeferredIncome"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.nclDeferredIncome">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.nclDeferredIncome"
                @change="countTotalNonCurrentLiabilitiesEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.nclDeferredIncome">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.nclDeferredIncome"
                @change="countTotalNonCurrentLiabilitiesEnd"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>其他非流动金融资产</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.ncaOtherNonCurrentFinancial">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.ncaOtherNonCurrentFinancial"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.ncaOtherNonCurrentFinancial">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.ncaOtherNonCurrentFinancial"
                @change="countTotalNonCurrentAssetsEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.ncaOtherNonCurrentFinancial">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.ncaOtherNonCurrentFinancial"
                @change="countTotalNonCurrentAssetsEnd"
              ></el-input>
            </el-form-item>
          </td>
          <td>递延所得税负债</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.nclDeferredIncomeTax">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.nclDeferredIncomeTax"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.nclDeferredIncomeTax">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.nclDeferredIncomeTax"
                @change="countTotalNonCurrentLiabilitiesEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.nclDeferredIncomeTax">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.nclDeferredIncomeTax"
                @change="countTotalNonCurrentLiabilitiesEnd"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>投资性房地产</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.ncaInvestmentProperty">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.ncaInvestmentProperty"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.ncaInvestmentProperty">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.ncaInvestmentProperty"
                @change="countTotalNonCurrentAssetsEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.ncaInvestmentProperty">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.ncaInvestmentProperty"
                @change="countTotalNonCurrentAssetsEnd"
              ></el-input>
            </el-form-item>
          </td>
          <td>其他非流动负债</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.nclOtherOnCurrentLiabilities">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.nclOtherOnCurrentLiabilities"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.nclOtherOnCurrentLiabilities">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.nclOtherOnCurrentLiabilities"
                @change="countTotalNonCurrentLiabilitiesEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.nclOtherOnCurrentLiabilities">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.nclOtherOnCurrentLiabilities"
                @change="countTotalNonCurrentLiabilitiesEnd"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>固定资产</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.ncaFixedAssets">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.ncaFixedAssets"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.ncaFixedAssets">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.ncaFixedAssets"
                @change="countTotalNonCurrentAssetsEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.ncaFixedAssets">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.ncaFixedAssets"
                @change="countTotalNonCurrentAssetsEnd"
              ></el-input>
            </el-form-item>
          </td>
          <td align="center" style="font-weight: bold">非流动负债合计</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.nclNonCurrentLiabilities">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.nclNonCurrentLiabilities"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.nclNonCurrentLiabilities">
              <el-input disabled v-model="balanceSheetForm.customerLiabilities.nclNonCurrentLiabilities"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.nclNonCurrentLiabilities">
              <el-input disabled v-model="balanceSheetForm.customerLiabilitiesEnd.nclNonCurrentLiabilities"></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>在建工程</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.ncaProcessConstruction">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.ncaProcessConstruction"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.ncaProcessConstruction">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.ncaProcessConstruction"
                @change="countTotalNonCurrentAssetsEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.ncaProcessConstruction">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.ncaProcessConstruction"
                @change="countTotalNonCurrentAssetsEnd"
              ></el-input>
            </el-form-item>
          </td>
          <td align="center" style="font-weight: bold">负债合计</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.ltLiabilityTotal">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.ltLiabilityTotal"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.ltLiabilityTotal">
              <el-input disabled v-model="balanceSheetForm.customerLiabilities.ltLiabilityTotal"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.ltLiabilityTotal">
              <el-input disabled v-model="balanceSheetForm.customerLiabilitiesEnd.ltLiabilityTotal"></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>生产性生物资产</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.ncaProductiveBiological">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.ncaProductiveBiological"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.ncaProductiveBiological">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.ncaProductiveBiological"
                @change="countTotalNonCurrentAssetsEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.ncaProductiveBiological">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.ncaProductiveBiological"
                @change="countTotalNonCurrentAssetsEnd"
              ></el-input>
            </el-form-item>
          </td>
          <td style="font-weight: bold" colspan="4">所有者权益(或股东权益)：</td>
        </tr>
        <tr>
          <td>油气资产</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.ncaOilGasAssets">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.ncaOilGasAssets"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.ncaOilGasAssets">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.ncaOilGasAssets"
                @change="countTotalNonCurrentAssetsEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.ncaOilGasAssets">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.ncaOilGasAssets"
                @change="countTotalNonCurrentAssetsEnd"
              ></el-input>
            </el-form-item>
          </td>
          <td>实收资本(或股本)</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.csCapitalStock">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.csCapitalStock"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.csCapitalStock">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.csCapitalStock"
                @change="countTotalOwnerSEquityEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.csCapitalStock">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.csCapitalStock"
                @change="countTotalOwnerSEquityEnd"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>无形资产</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.ncaIntangibleAssets">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.ncaIntangibleAssets"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.ncaIntangibleAssets">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.ncaIntangibleAssets"
                @change="countTotalNonCurrentAssetsEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.ncaIntangibleAssets">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.ncaIntangibleAssets"
                @change="countTotalNonCurrentAssetsEnd"
              ></el-input>
            </el-form-item>
          </td>
          <td>其他权益工具</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.oeiOtherEquityInstruments">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.oeiOtherEquityInstruments"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.oeiOtherEquityInstruments">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.oeiOtherEquityInstruments"
                @change="countTotalOwnerSEquityEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.oeiOtherEquityInstruments">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.oeiOtherEquityInstruments"
                @change="countTotalOwnerSEquityEnd"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>开发支出</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.ncaDevelopmentExpenditure">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.ncaDevelopmentExpenditure"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.ncaDevelopmentExpenditure">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.ncaDevelopmentExpenditure"
                @change="countTotalNonCurrentAssetsEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.ncaDevelopmentExpenditure">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.ncaDevelopmentExpenditure"
                @change="countTotalNonCurrentAssetsEnd"
              ></el-input>
            </el-form-item>
          </td>
          <td>其中：优先股</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.oeiPreferredStock">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.oeiPreferredStock"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.oeiPreferredStock">
              <el-input v-model="balanceSheetForm.customerLiabilities.oeiPreferredStock"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.oeiPreferredStock">
              <el-input v-model="balanceSheetForm.customerLiabilitiesEnd.oeiPreferredStock"></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>商誉</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.ncaGoodwill">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.ncaGoodwill"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.ncaGoodwill">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.ncaGoodwill"
                @change="countTotalNonCurrentAssetsEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.ncaGoodwill">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.ncaGoodwill"
                @change="countTotalNonCurrentAssetsEnd"
              ></el-input>
            </el-form-item>
          </td>
          <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;永续债</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.oeiPerpetualBond">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.oeiPerpetualBond"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.oeiPerpetualBond">
              <el-input v-model="balanceSheetForm.customerLiabilities.oeiPerpetualBond"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.oeiPerpetualBond">
              <el-input v-model="balanceSheetForm.customerLiabilitiesEnd.oeiPerpetualBond"></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>长期待摊费用</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.ncaLongTermUnamortized">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.ncaLongTermUnamortized"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.ncaLongTermUnamortized">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.ncaLongTermUnamortized"
                @change="countTotalNonCurrentAssetsEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.ncaLongTermUnamortized">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.ncaLongTermUnamortized"
                @change="countTotalNonCurrentAssetsEnd"
              ></el-input>
            </el-form-item>
          </td>
          <td>资本公积</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.crCapitalReserve">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.crCapitalReserve"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.crCapitalReserve">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.crCapitalReserve"
                @change="countTotalOwnerSEquityEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.crCapitalReserve">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.crCapitalReserve"
                @change="countTotalOwnerSEquityEnd"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>递延所得税资产</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.ncaDeferredTax">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.ncaDeferredTax"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.ncaDeferredTax">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.ncaDeferredTax"
                @change="countTotalNonCurrentAssetsEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.ncaDeferredTax">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.ncaDeferredTax"
                @change="countTotalNonCurrentAssetsEnd"
              ></el-input>
            </el-form-item>
          </td>
          <td>减：库存股</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.tsTreasuryStock">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.tsTreasuryStock"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.tsTreasuryStock">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.tsTreasuryStock"
                @change="countTotalOwnerSEquityEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.tsTreasuryStock">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.tsTreasuryStock"
                @change="countTotalOwnerSEquityEnd"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>其他非流动资产</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.ncaOtherNonCurrent">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.ncaOtherNonCurrent"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.ncaOtherNonCurrent">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.ncaOtherNonCurrent"
                @change="countTotalNonCurrentAssetsEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.ncaOtherNonCurrent">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.ncaOtherNonCurrent"
                @change="countTotalNonCurrentAssetsEnd"
              ></el-input>
            </el-form-item>
          </td>
          <td>其他综合收益</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.ocoiOtherComprehensiveIncome">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.ocoiOtherComprehensiveIncome"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.ocoiOtherComprehensiveIncome">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.ocoiOtherComprehensiveIncome"
                @change="countTotalOwnerSEquityEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.ocoiOtherComprehensiveIncome">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.ocoiOtherComprehensiveIncome"
                @change="countTotalOwnerSEquityEnd"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td align="center" style="font-weight: bold">非流动资产合计</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.ncaNonCurrentAssetsTotal">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.ncaNonCurrentAssetsTotal"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.ncaNonCurrentAssetsTotal">
              <el-input disabled v-model="balanceSheetForm.customerLiabilities.ncaNonCurrentAssetsTotal"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.ncaNonCurrentAssetsTotal">
              <el-input disabled v-model="balanceSheetForm.customerLiabilitiesEnd.ncaNonCurrentAssetsTotal"></el-input>
            </el-form-item>
          </td>
          <td>专项储备</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.srSpecialReserve">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.srSpecialReserve"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.srSpecialReserve">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.srSpecialReserve"
                @change="countTotalOwnerSEquityEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.srSpecialReserve">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.srSpecialReserve"
                @change="countTotalOwnerSEquityEnd"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>盈余公积</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.esEarnedSurplus">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.esEarnedSurplus"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.esEarnedSurplus">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.esEarnedSurplus"
                @change="countTotalOwnerSEquityEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.esEarnedSurplus">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.esEarnedSurplus"
                @change="countTotalOwnerSEquityEnd"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>一般风险准备</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.grpGeneralRiskProvision">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.grpGeneralRiskProvision"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.grpGeneralRiskProvision">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.grpGeneralRiskProvision"
                @change="countTotalOwnerSEquityEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.grpGeneralRiskProvision">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.grpGeneralRiskProvision"
                @change="countTotalOwnerSEquityEnd"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>未分配利润</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.upUndistributedProfit">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.upUndistributedProfit"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.upUndistributedProfit">
              <el-input
                v-model="balanceSheetForm.customerLiabilities.upUndistributedProfit"
                @change="countTotalOwnerSEquityEarly"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.upUndistributedProfit">
              <el-input
                v-model="balanceSheetForm.customerLiabilitiesEnd.upUndistributedProfit"
                @change="countTotalOwnerSEquityEnd"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td align="center" style="font-weight: bold">所有者权益(或股东权益)合计</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.petOwnersEquityTotal">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.petOwnersEquityTotal"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.petOwnersEquityTotal">
              <el-input disabled v-model="balanceSheetForm.customerLiabilities.petOwnersEquityTotal"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.petOwnersEquityTotal">
              <el-input disabled v-model="balanceSheetForm.customerLiabilitiesEnd.petOwnersEquityTotal"></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td align="center" style="font-weight: bold">资产总计</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.assetsTotal">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.assetsTotal"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.assetsTotal">
              <el-input disabled v-model="balanceSheetForm.customerLiabilities.assetsTotal"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.assetsTotal">
              <el-input disabled v-model="balanceSheetForm.customerLiabilitiesEnd.assetsTotal"></el-input>
            </el-form-item>
          </td>
          <td align="center" style="font-weight: bold">负债和所有者权益(或股东权益)总计</td>
          <td>
            <el-form-item prop="customerLiabilitiesRemark.peltOwnersEquityLiabilitiesTotal">
              <el-input v-model="balanceSheetForm.customerLiabilitiesRemark.peltOwnersEquityLiabilitiesTotal"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilities.peltOwnersEquityLiabilitiesTotal">
              <el-input
                disabled
                v-model="balanceSheetForm.customerLiabilities.peltOwnersEquityLiabilitiesTotal"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="customerLiabilitiesEnd.peltOwnersEquityLiabilitiesTotal">
              <el-input
                disabled
                v-model="balanceSheetForm.customerLiabilitiesEnd.peltOwnersEquityLiabilitiesTotal"
              ></el-input>
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
  name: "BalanceSheet",
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
      balanceSheetForm: {
        customerLiabilities: {
          caMonetaryCapital: null,
          clShortTermBorrowing: null,
          caTradableFinancialAssets: null,
          clTradingFinancialLiabilities: null,
          caMovableAssets: null,
          clMovableLiabilities: null,
          caDerivativeFinancialAssets: null,
          clDerivativeFinancialLiabilitsy: null,
          caNotesReceivable: null,
          clNotesPayable: null,
          caReceivables: null,
          clAccountsPayable: null,
          caReceivablesFinancing: null,
          clUnearnedRevenue: null,
          caAdvancePayment: null,
          clPayrollPayable: null,
          caOtherReceivables: null,
          clTaxPayable: null,
          caInventory: null,
          clOtherPayables: null,
          caHoldingSaleAssets: null,
          clHoldingLiabilities: null,
          caCurrentAssetsComingDue: null,
          clCurrentLiabilitiesComingDue: null,
          caOtherCurrentAssets: null,
          clOtherCurrentLiability: null,
          caCurrentAssetsTotal: null,
          clCurrentLiabilitiesTotal: null,
          ncaBondInvestment: null,
          nclFundedDebt: null,
          ncaFinancialAssets: null,
          nclBondsPayable: null,
          ncaOtherDebt: null,
          nclPreferredStock: null,
          ncaHeldMaturity: null,
          nclPerpetualBond: null,
          ncaLongTermReceivables: null,
          nclLongTermPayable: null,
          ncaLongTermEquity: null,
          nclAccruedLiabilities: null,
          ncaOtherEquityInstruments: null,
          nclDeferredIncome: null,
          ncaOtherNonCurrentFinancial: null,
          nclDeferredIncomeTax: null,
          ncaInvestmentProperty: null,
          nclOtherOnCurrentLiabilities: null,
          ncaFixedAssets: null,
          nclNonCurrentLiabilities: null,
          ncaProcessConstruction: null,
          ltLiabilityTotal: null,
          ncaProductiveBiological: null,
          ncaOilGasAssets: null,
          csCapitalStock: null,
          ncaIntangibleAssets: null,
          oeiOtherEquityInstruments: null,
          ncaDevelopmentExpenditure: null,
          oeiPreferredStock: null,
          ncaGoodwill: null,
          oeiPerpetualBond: null,
          ncaLongTermUnamortized: null,
          crCapitalReserve: null,
          ncaDeferredTax: null,
          tsTreasuryStock: null,
          ncaOtherNonCurrent: null,
          ocoiOtherComprehensiveIncome: null,
          ncaNonCurrentAssetsTotal: null,
          srSpecialReserve: null,
          esEarnedSurplus: null,
          grpGeneralRiskProvision: null,
          upUndistributedProfit: null,
          petOwnersEquityTotal: null,
          assetsTotal: null,
          peltOwnersEquityLiabilitiesTotal: null
        },
        customerLiabilitiesEnd: {
          caMonetaryCapital: null,
          clShortTermBorrowing: null,
          caTradableFinancialAssets: null,
          clTradingFinancialLiabilities: null,
          caMovableAssets: null,
          clMovableLiabilities: null,
          caDerivativeFinancialAssets: null,
          clDerivativeFinancialLiabilitsy: null,
          caNotesReceivable: null,
          clNotesPayable: null,
          caReceivables: null,
          clAccountsPayable: null,
          caReceivablesFinancing: null,
          clUnearnedRevenue: null,
          caAdvancePayment: null,
          clPayrollPayable: null,
          caOtherReceivables: null,
          clTaxPayable: null,
          caInventory: null,
          clOtherPayables: null,
          caHoldingSaleAssets: null,
          clHoldingLiabilities: null,
          caCurrentAssetsComingDue: null,
          clCurrentLiabilitiesComingDue: null,
          caOtherCurrentAssets: null,
          clOtherCurrentLiability: null,
          caCurrentAssetsTotal: null,
          clCurrentLiabilitiesTotal: null,
          ncaBondInvestment: null,
          nclFundedDebt: null,
          ncaFinancialAssets: null,
          nclBondsPayable: null,
          ncaOtherDebt: null,
          nclPreferredStock: null,
          ncaHeldMaturity: null,
          nclPerpetualBond: null,
          ncaLongTermReceivables: null,
          nclLongTermPayable: null,
          ncaLongTermEquity: null,
          nclAccruedLiabilities: null,
          ncaOtherEquityInstruments: null,
          nclDeferredIncome: null,
          ncaOtherNonCurrentFinancial: null,
          nclDeferredIncomeTax: null,
          ncaInvestmentProperty: null,
          nclOtherOnCurrentLiabilities: null,
          ncaFixedAssets: null,
          nclNonCurrentLiabilities: null,
          ncaProcessConstruction: null,
          ltLiabilityTotal: null,
          ncaProductiveBiological: null,
          ncaOilGasAssets: null,
          csCapitalStock: null,
          ncaIntangibleAssets: null,
          oeiOtherEquityInstruments: null,
          ncaDevelopmentExpenditure: null,
          oeiPreferredStock: null,
          ncaGoodwill: null,
          oeiPerpetualBond: null,
          ncaLongTermUnamortized: null,
          crCapitalReserve: null,
          ncaDeferredTax: null,
          tsTreasuryStock: null,
          ncaOtherNonCurrent: null,
          ocoiOtherComprehensiveIncome: null,
          ncaNonCurrentAssetsTotal: null,
          srSpecialReserve: null,
          esEarnedSurplus: null,
          grpGeneralRiskProvision: null,
          upUndistributedProfit: null,
          petOwnersEquityTotal: null,
          assetsTotal: null,
          peltOwnersEquityLiabilitiesTotal: null
        },
        customerLiabilitiesRemark: {
          caMonetaryCapital: null,
          clShortTermBorrowing: null,
          caTradableFinancialAssets: null,
          clTradingFinancialLiabilities: null,
          caMovableAssets: null,
          clMovableLiabilities: null,
          caDerivativeFinancialAssets: null,
          clDerivativeFinancialLiabilitsy: null,
          caNotesReceivable: null,
          clNotesPayable: null,
          caReceivables: null,
          clAccountsPayable: null,
          caReceivablesFinancing: null,
          clUnearnedRevenue: null,
          caAdvancePayment: null,
          clPayrollPayable: null,
          caOtherReceivables: null,
          clTaxPayable: null,
          caInventory: null,
          clOtherPayables: null,
          caHoldingSaleAssets: null,
          clHoldingLiabilities: null,
          caCurrentAssetsComingDue: null,
          clCurrentLiabilitiesComingDue: null,
          caOtherCurrentAssets: null,
          clOtherCurrentLiability: null,
          caCurrentAssetsTotal: null,
          clCurrentLiabilitiesTotal: null,
          ncaBondInvestment: null,
          nclFundedDebt: null,
          ncaFinancialAssets: null,
          nclBondsPayable: null,
          ncaOtherDebt: null,
          nclPreferredStock: null,
          ncaHeldMaturity: null,
          nclPerpetualBond: null,
          ncaLongTermReceivables: null,
          nclLongTermPayable: null,
          ncaLongTermEquity: null,
          nclAccruedLiabilities: null,
          ncaOtherEquityInstruments: null,
          nclDeferredIncome: null,
          ncaOtherNonCurrentFinancial: null,
          nclDeferredIncomeTax: null,
          ncaInvestmentProperty: null,
          nclOtherOnCurrentLiabilities: null,
          ncaFixedAssets: null,
          nclNonCurrentLiabilities: null,
          ncaProcessConstruction: null,
          ltLiabilityTotal: null,
          ncaProductiveBiological: null,
          ncaOilGasAssets: null,
          csCapitalStock: null,
          ncaIntangibleAssets: null,
          oeiOtherEquityInstruments: null,
          ncaDevelopmentExpenditure: null,
          oeiPreferredStock: null,
          ncaGoodwill: null,
          oeiPerpetualBond: null,
          ncaLongTermUnamortized: null,
          crCapitalReserve: null,
          ncaDeferredTax: null,
          tsTreasuryStock: null,
          ncaOtherNonCurrent: null,
          ocoiOtherComprehensiveIncome: null,
          ncaNonCurrentAssetsTotal: null,
          srSpecialReserve: null,
          esEarnedSurplus: null,
          grpGeneralRiskProvision: null,
          upUndistributedProfit: null,
          petOwnersEquityTotal: null,
          assetsTotal: null,
          peltOwnersEquityLiabilitiesTotal: null
        }
      },
      balanceSheetRules: {
        customerLiabilities: {
          caMonetaryCapital: createRules({ msg: "", numberFloat: true }),
          clShortTermBorrowing: createRules({ msg: "", numberFloat: true }),
          caTradableFinancialAssets: createRules({ msg: "", numberFloat: true }),
          clTradingFinancialLiabilities: createRules({ msg: "", numberFloat: true }),
          caMovableAssets: createRules({ msg: "", numberFloat: true }),
          clMovableLiabilities: createRules({ msg: "", numberFloat: true }),
          caDerivativeFinancialAssets: createRules({ msg: "", numberFloat: true }),
          clDerivativeFinancialLiabilitsy: createRules({ msg: "", numberFloat: true }),
          caNotesReceivable: createRules({ msg: "", numberFloat: true }),
          clNotesPayable: createRules({ msg: "", numberFloat: true }),
          caReceivables: createRules({ msg: "", numberFloat: true }),
          clAccountsPayable: createRules({ msg: "", numberFloat: true }),
          caReceivablesFinancing: createRules({ msg: "", numberFloat: true }),
          clUnearnedRevenue: createRules({ msg: "", numberFloat: true }),
          caAdvancePayment: createRules({ msg: "", numberFloat: true }),
          clPayrollPayable: createRules({ msg: "", numberFloat: true }),
          caOtherReceivables: createRules({ msg: "", numberFloat: true }),
          clTaxPayable: createRules({ msg: "", numberFloat: true }),
          caInventory: createRules({ msg: "", numberFloat: true }),
          clOtherPayables: createRules({ msg: "", numberFloat: true }),
          caHoldingSaleAssets: createRules({ msg: "", numberFloat: true }),
          clHoldingLiabilities: createRules({ msg: "", numberFloat: true }),
          caCurrentAssetsComingDue: createRules({ msg: "", numberFloat: true }),
          clCurrentLiabilitiesComingDue: createRules({ msg: "", numberFloat: true }),
          caOtherCurrentAssets: createRules({ msg: "", numberFloat: true }),
          clOtherCurrentLiability: createRules({ msg: "", numberFloat: true }),
          ncaBondInvestment: createRules({ msg: "", numberFloat: true }),
          nclFundedDebt: createRules({ msg: "", numberFloat: true }),
          ncaFinancialAssets: createRules({ msg: "", numberFloat: true }),
          nclBondsPayable: createRules({ msg: "", numberFloat: true }),
          ncaOtherDebt: createRules({ msg: "", numberFloat: true }),
          nclPreferredStock: createRules({ msg: "", numberFloat: true }),
          ncaHeldMaturity: createRules({ msg: "", numberFloat: true }),
          nclPerpetualBond: createRules({ msg: "", numberFloat: true }),
          ncaLongTermReceivables: createRules({ msg: "", numberFloat: true }),
          nclLongTermPayable: createRules({ msg: "", numberFloat: true }),
          ncaLongTermEquity: createRules({ msg: "", numberFloat: true }),
          nclAccruedLiabilities: createRules({ msg: "", numberFloat: true }),
          ncaOtherEquityInstruments: createRules({ msg: "", numberFloat: true }),
          nclDeferredIncome: createRules({ msg: "", numberFloat: true }),
          ncaOtherNonCurrentFinancial: createRules({ msg: "", numberFloat: true }),
          nclDeferredIncomeTax: createRules({ msg: "", numberFloat: true }),
          ncaInvestmentProperty: createRules({ msg: "", numberFloat: true }),
          nclOtherOnCurrentLiabilities: createRules({ msg: "", numberFloat: true }),
          ncaFixedAssets: createRules({ msg: "", numberFloat: true }),
          ncaProcessConstruction: createRules({ msg: "", numberFloat: true }),
          ncaProductiveBiological: createRules({ msg: "", numberFloat: true }),
          ncaOilGasAssets: createRules({ msg: "", numberFloat: true }),
          csCapitalStock: createRules({ msg: "", numberFloat: true }),
          ncaIntangibleAssets: createRules({ msg: "", numberFloat: true }),
          oeiOtherEquityInstruments: createRules({ msg: "", numberFloat: true }),
          ncaDevelopmentExpenditure: createRules({ msg: "", numberFloat: true }),
          oeiPreferredStock: createRules({ msg: "", numberFloat: true }),
          ncaGoodwill: createRules({ msg: "", numberFloat: true }),
          oeiPerpetualBond: createRules({ msg: "", numberFloat: true }),
          ncaLongTermUnamortized: createRules({ msg: "", numberFloat: true }),
          crCapitalReserve: createRules({ msg: "", numberFloat: true }),
          ncaDeferredTax: createRules({ msg: "", numberFloat: true }),
          tsTreasuryStock: createRules({ msg: "", numberFloat: true }),
          ncaOtherNonCurrent: createRules({ msg: "", numberFloat: true }),
          ocoiOtherComprehensiveIncome: createRules({ msg: "", numberFloat: true }),
          srSpecialReserve: createRules({ msg: "", numberFloat: true }),
          esEarnedSurplus: createRules({ msg: "", numberFloat: true }),
          grpGeneralRiskProvision: createRules({ msg: "", numberFloat: true }),
          upUndistributedProfit: createRules({ msg: "", numberFloat: true }),
          peltOwnersEquityLiabilitiesTotal: createRules({
            validator: this.validatePeltOwnersEquityLiabilitiesTotal()
          })
        },
        customerLiabilitiesEnd: {
          caMonetaryCapital: createRules({ msg: "", numberFloat: true }),
          clShortTermBorrowing: createRules({ msg: "", numberFloat: true }),
          caTradableFinancialAssets: createRules({ msg: "", numberFloat: true }),
          clTradingFinancialLiabilities: createRules({ msg: "", numberFloat: true }),
          caMovableAssets: createRules({ msg: "", numberFloat: true }),
          clMovableLiabilities: createRules({ msg: "", numberFloat: true }),
          caDerivativeFinancialAssets: createRules({ msg: "", numberFloat: true }),
          clDerivativeFinancialLiabilitsy: createRules({ msg: "", numberFloat: true }),
          caNotesReceivable: createRules({ msg: "", numberFloat: true }),
          clNotesPayable: createRules({ msg: "", numberFloat: true }),
          caReceivables: createRules({ msg: "", numberFloat: true }),
          clAccountsPayable: createRules({ msg: "", numberFloat: true }),
          caReceivablesFinancing: createRules({ msg: "", numberFloat: true }),
          clUnearnedRevenue: createRules({ msg: "", numberFloat: true }),
          caAdvancePayment: createRules({ msg: "", numberFloat: true }),
          clPayrollPayable: createRules({ msg: "", numberFloat: true }),
          caOtherReceivables: createRules({ msg: "", numberFloat: true }),
          clTaxPayable: createRules({ msg: "", numberFloat: true }),
          caInventory: createRules({ msg: "", numberFloat: true }),
          clOtherPayables: createRules({ msg: "", numberFloat: true }),
          caHoldingSaleAssets: createRules({ msg: "", numberFloat: true }),
          clHoldingLiabilities: createRules({ msg: "", numberFloat: true }),
          caCurrentAssetsComingDue: createRules({ msg: "", numberFloat: true }),
          clCurrentLiabilitiesComingDue: createRules({ msg: "", numberFloat: true }),
          caOtherCurrentAssets: createRules({ msg: "", numberFloat: true }),
          clOtherCurrentLiability: createRules({ msg: "", numberFloat: true }),
          ncaBondInvestment: createRules({ msg: "", numberFloat: true }),
          nclFundedDebt: createRules({ msg: "", numberFloat: true }),
          ncaFinancialAssets: createRules({ msg: "", numberFloat: true }),
          nclBondsPayable: createRules({ msg: "", numberFloat: true }),
          ncaOtherDebt: createRules({ msg: "", numberFloat: true }),
          nclPreferredStock: createRules({ msg: "", numberFloat: true }),
          ncaHeldMaturity: createRules({ msg: "", numberFloat: true }),
          nclPerpetualBond: createRules({ msg: "", numberFloat: true }),
          ncaLongTermReceivables: createRules({ msg: "", numberFloat: true }),
          nclLongTermPayable: createRules({ msg: "", numberFloat: true }),
          ncaLongTermEquity: createRules({ msg: "", numberFloat: true }),
          nclAccruedLiabilities: createRules({ msg: "", numberFloat: true }),
          ncaOtherEquityInstruments: createRules({ msg: "", numberFloat: true }),
          nclDeferredIncome: createRules({ msg: "", numberFloat: true }),
          ncaOtherNonCurrentFinancial: createRules({ msg: "", numberFloat: true }),
          nclDeferredIncomeTax: createRules({ msg: "", numberFloat: true }),
          ncaInvestmentProperty: createRules({ msg: "", numberFloat: true }),
          nclOtherOnCurrentLiabilities: createRules({ msg: "", numberFloat: true }),
          ncaFixedAssets: createRules({ msg: "", numberFloat: true }),
          ncaProcessConstruction: createRules({ msg: "", numberFloat: true }),
          ncaProductiveBiological: createRules({ msg: "", numberFloat: true }),
          ncaOilGasAssets: createRules({ msg: "", numberFloat: true }),
          csCapitalStock: createRules({ msg: "", numberFloat: true }),
          ncaIntangibleAssets: createRules({ msg: "", numberFloat: true }),
          oeiOtherEquityInstruments: createRules({ msg: "", numberFloat: true }),
          ncaDevelopmentExpenditure: createRules({ msg: "", numberFloat: true }),
          oeiPreferredStock: createRules({ msg: "", numberFloat: true }),
          ncaGoodwill: createRules({ msg: "", numberFloat: true }),
          oeiPerpetualBond: createRules({ msg: "", numberFloat: true }),
          ncaLongTermUnamortized: createRules({ msg: "", numberFloat: true }),
          crCapitalReserve: createRules({ msg: "", numberFloat: true }),
          ncaDeferredTax: createRules({ msg: "", numberFloat: true }),
          tsTreasuryStock: createRules({ msg: "", numberFloat: true }),
          ncaOtherNonCurrent: createRules({ msg: "", numberFloat: true }),
          ocoiOtherComprehensiveIncome: createRules({ msg: "", numberFloat: true }),
          srSpecialReserve: createRules({ msg: "", numberFloat: true }),
          esEarnedSurplus: createRules({ msg: "", numberFloat: true }),
          grpGeneralRiskProvision: createRules({ msg: "", numberFloat: true }),
          upUndistributedProfit: createRules({ msg: "", numberFloat: true }),
          peltOwnersEquityLiabilitiesTotal: createRules({
            validator: this.validatePeltOwnersEquityLiabilitiesTotalEnd()
          })
        }
      }
    };
  },
  methods: {
    validForm(cb) {
      this.$refs["balanceSheetForm"].validate(valid => {
        if (valid) {
          cb(this.balanceSheetForm);
        } else {
          this.$message({
            message: "资产负债表有信息未填写正确！",
            type: "warning"
          });
        }
      });
    },
    setData(_customerLiabilitie, _customerLiabilitiesEnd, _customerLiabilitiesRemark) {
      _customerLiabilitie && (this.balanceSheetForm.customerLiabilities = _customerLiabilitie);
      _customerLiabilitiesEnd && (this.balanceSheetForm.customerLiabilitiesEnd = _customerLiabilitiesEnd);
      _customerLiabilitiesRemark &&
        (this.balanceSheetForm.customerLiabilitiesRemark = _customerLiabilitiesRemark);
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
        this.balanceSheetForm.customerLiabilities = res.data.customerLiabilities;
        this.balanceSheetForm.customerLiabilitiesEnd = res.data.customerLiabilitiesEnd;
        this.balanceSheetForm.customerLiabilitiesRemark = res.data.customerLiabilitiesRemark;
      } else {
        this.$message.error("解析文件失败，请检查文件是否按照要求填写！");
      }
    },
    /**
     * @计算合计
     */
    countTotalCurrentAssetsEarly() {
      this.balanceSheetForm.customerLiabilities.caCurrentAssetsTotal = this.$add(
        this.$add(
          this.$add(
            this.$add(
              this.$add(
                this.$add(
                  this.$add(
                    this.$add(
                      this.$add(
                        this.$add(
                          this.$add(
                            this.$add(
                              this.balanceSheetForm.customerLiabilities.caMonetaryCapital,
                              this.balanceSheetForm.customerLiabilities.caTradableFinancialAssets
                            ),
                            this.balanceSheetForm.customerLiabilities.caMovableAssets
                          ),
                          this.balanceSheetForm.customerLiabilities.caDerivativeFinancialAssets
                        ),
                        this.balanceSheetForm.customerLiabilities.caNotesReceivable
                      ),
                      this.balanceSheetForm.customerLiabilities.caReceivables
                    ),
                    this.balanceSheetForm.customerLiabilities.caReceivablesFinancing
                  ),
                  this.balanceSheetForm.customerLiabilities.caAdvancePayment
                ),
                this.balanceSheetForm.customerLiabilities.caOtherReceivables
              ),
              this.balanceSheetForm.customerLiabilities.caInventory
            ),
            this.balanceSheetForm.customerLiabilities.caHoldingSaleAssets
          ),
          this.balanceSheetForm.customerLiabilities.caCurrentAssetsComingDue
        ),
        this.balanceSheetForm.customerLiabilities.caOtherCurrentAssets
      );
      this.balanceSheetForm.customerLiabilities.assetsTotal = this.$add(
        this.balanceSheetForm.customerLiabilities.caCurrentAssetsTotal,
        this.balanceSheetForm.customerLiabilities.ncaNonCurrentAssetsTotal
      );
    },
    countTotalCurrentAssetsEnd() {
      this.balanceSheetForm.customerLiabilitiesEnd.caCurrentAssetsTotal = this.$add(
        this.$add(
          this.$add(
            this.$add(
              this.$add(
                this.$add(
                  this.$add(
                    this.$add(
                      this.$add(
                        this.$add(
                          this.$add(
                            this.$add(
                              this.balanceSheetForm.customerLiabilitiesEnd.caMonetaryCapital,
                              this.balanceSheetForm.customerLiabilitiesEnd.caTradableFinancialAssets
                            ),
                            this.balanceSheetForm.customerLiabilitiesEnd.caMovableAssets
                          ),
                          this.balanceSheetForm.customerLiabilitiesEnd.caDerivativeFinancialAssets
                        ),
                        this.balanceSheetForm.customerLiabilitiesEnd.caNotesReceivable
                      ),
                      this.balanceSheetForm.customerLiabilitiesEnd.caReceivables
                    ),
                    this.balanceSheetForm.customerLiabilitiesEnd.caReceivablesFinancing
                  ),
                  this.balanceSheetForm.customerLiabilitiesEnd.caAdvancePayment
                ),
                this.balanceSheetForm.customerLiabilitiesEnd.caOtherReceivables
              ),
              this.balanceSheetForm.customerLiabilitiesEnd.caInventory
            ),
            this.balanceSheetForm.customerLiabilitiesEnd.caHoldingSaleAssets
          ),
          this.balanceSheetForm.customerLiabilitiesEnd.caCurrentAssetsComingDue
        ),
        this.balanceSheetForm.customerLiabilitiesEnd.caOtherCurrentAssets
      );
      this.balanceSheetForm.customerLiabilitiesEnd.assetsTotal = this.$add(
        this.balanceSheetForm.customerLiabilitiesEnd.caCurrentAssetsTotal,
        this.balanceSheetForm.customerLiabilitiesEnd.ncaNonCurrentAssetsTotal
      );
    },
    countTotalNonCurrentAssetsEarly() {
      this.balanceSheetForm.customerLiabilities.ncaNonCurrentAssetsTotal = this.$add(
        this.$add(
          this.$add(
            this.$add(
              this.$add(
                this.$add(
                  this.$add(
                    this.$add(
                      this.$add(
                        this.$add(
                          this.$add(
                            this.$add(
                              this.$add(
                                this.$add(
                                  this.$add(
                                    this.$add(
                                      this.$add(
                                        this.$add(
                                          this.balanceSheetForm.customerLiabilities.ncaBondInvestment,
                                          this.balanceSheetForm.customerLiabilities.ncaFinancialAssets
                                        ),
                                        this.balanceSheetForm.customerLiabilities.ncaOtherDebt
                                      ),
                                      this.balanceSheetForm.customerLiabilities.ncaHeldMaturity
                                    ),
                                    this.balanceSheetForm.customerLiabilities.ncaLongTermReceivables
                                  ),
                                  this.balanceSheetForm.customerLiabilities.ncaLongTermEquity
                                ),
                                this.balanceSheetForm.customerLiabilities.ncaOtherEquityInstruments
                              ),
                              this.balanceSheetForm.customerLiabilities.ncaOtherNonCurrentFinancial
                            ),
                            this.balanceSheetForm.customerLiabilities.ncaInvestmentProperty
                          ),
                          this.balanceSheetForm.customerLiabilities.ncaFixedAssets
                        ),
                        this.balanceSheetForm.customerLiabilities.ncaProcessConstruction
                      ),
                      this.balanceSheetForm.customerLiabilities.ncaProductiveBiological
                    ),
                    this.balanceSheetForm.customerLiabilities.ncaOilGasAssets
                  ),
                  this.balanceSheetForm.customerLiabilities.ncaIntangibleAssets
                ),
                this.balanceSheetForm.customerLiabilities.ncaDevelopmentExpenditure
              ),
              this.balanceSheetForm.customerLiabilities.ncaGoodwill
            ),
            this.balanceSheetForm.customerLiabilities.ncaLongTermUnamortized
          ),
          this.balanceSheetForm.customerLiabilities.ncaDeferredTax
        ),
        this.balanceSheetForm.customerLiabilities.ncaOtherNonCurrent
      );
      this.balanceSheetForm.customerLiabilities.assetsTotal = this.$add(
        this.balanceSheetForm.customerLiabilities.caCurrentAssetsTotal,
        this.balanceSheetForm.customerLiabilities.ncaNonCurrentAssetsTotal
      );
    },
    countTotalNonCurrentAssetsEnd() {
      this.balanceSheetForm.customerLiabilitiesEnd.ncaNonCurrentAssetsTotal = this.$add(
        this.$add(
          this.$add(
            this.$add(
              this.$add(
                this.$add(
                  this.$add(
                    this.$add(
                      this.$add(
                        this.$add(
                          this.$add(
                            this.$add(
                              this.$add(
                                this.$add(
                                  this.$add(
                                    this.$add(
                                      this.$add(
                                        this.$add(
                                          this.balanceSheetForm.customerLiabilitiesEnd.ncaBondInvestment,
                                          this.balanceSheetForm.customerLiabilitiesEnd.ncaFinancialAssets
                                        ),
                                        this.balanceSheetForm.customerLiabilitiesEnd.ncaOtherDebt
                                      ),
                                      this.balanceSheetForm.customerLiabilitiesEnd.ncaHeldMaturity
                                    ),
                                    this.balanceSheetForm.customerLiabilitiesEnd.ncaLongTermReceivables
                                  ),
                                  this.balanceSheetForm.customerLiabilitiesEnd.ncaLongTermEquity
                                ),
                                this.balanceSheetForm.customerLiabilitiesEnd.ncaOtherEquityInstruments
                              ),
                              this.balanceSheetForm.customerLiabilitiesEnd.ncaOtherNonCurrentFinancial
                            ),
                            this.balanceSheetForm.customerLiabilitiesEnd.ncaInvestmentProperty
                          ),
                          this.balanceSheetForm.customerLiabilitiesEnd.ncaFixedAssets
                        ),
                        this.balanceSheetForm.customerLiabilitiesEnd.ncaProcessConstruction
                      ),
                      this.balanceSheetForm.customerLiabilitiesEnd.ncaProductiveBiological
                    ),
                    this.balanceSheetForm.customerLiabilitiesEnd.ncaOilGasAssets
                  ),
                  this.balanceSheetForm.customerLiabilitiesEnd.ncaIntangibleAssets
                ),
                this.balanceSheetForm.customerLiabilitiesEnd.ncaDevelopmentExpenditure
              ),
              this.balanceSheetForm.customerLiabilitiesEnd.ncaGoodwill
            ),
            this.balanceSheetForm.customerLiabilitiesEnd.ncaLongTermUnamortized
          ),
          this.balanceSheetForm.customerLiabilitiesEnd.ncaDeferredTax
        ),
        this.balanceSheetForm.customerLiabilitiesEnd.ncaOtherNonCurrent
      );
      this.balanceSheetForm.customerLiabilitiesEnd.assetsTotal = this.$add(
        this.balanceSheetForm.customerLiabilitiesEnd.caCurrentAssetsTotal,
        this.balanceSheetForm.customerLiabilitiesEnd.ncaNonCurrentAssetsTotal
      );
    },
    countTotalCurrentLiabilitiesEarly() {
      this.balanceSheetForm.customerLiabilities.clCurrentLiabilitiesTotal = this.$add(
        this.$add(
          this.$add(
            this.$add(
              this.$add(
                this.$add(
                  this.$add(
                    this.$add(
                      this.$add(
                        this.$add(
                          this.$add(
                            this.$add(
                              this.balanceSheetForm.customerLiabilities.clShortTermBorrowing,
                              this.balanceSheetForm.customerLiabilities.clTradingFinancialLiabilities
                            ),
                            this.balanceSheetForm.customerLiabilities.clMovableLiabilities
                          ),
                          this.balanceSheetForm.customerLiabilities.clDerivativeFinancialLiabilitsy
                        ),
                        this.balanceSheetForm.customerLiabilities.clNotesPayable
                      ),
                      this.balanceSheetForm.customerLiabilities.clAccountsPayable
                    ),
                    this.balanceSheetForm.customerLiabilities.clUnearnedRevenue
                  ),
                  this.balanceSheetForm.customerLiabilities.clPayrollPayable
                ),
                this.balanceSheetForm.customerLiabilities.clTaxPayable
              ),
              this.balanceSheetForm.customerLiabilities.clOtherPayables
            ),
            this.balanceSheetForm.customerLiabilities.clHoldingLiabilities
          ),
          this.balanceSheetForm.customerLiabilities.clCurrentLiabilitiesComingDue
        ),
        this.balanceSheetForm.customerLiabilities.clOtherCurrentLiability
      );
      this.balanceSheetForm.customerLiabilities.ltLiabilityTotal = this.$add(
        this.balanceSheetForm.customerLiabilities.clCurrentLiabilitiesTotal,
        this.balanceSheetForm.customerLiabilities.nclNonCurrentLiabilities
      );
      this.balanceSheetForm.customerLiabilities.peltOwnersEquityLiabilitiesTotal = this.$add(
        this.balanceSheetForm.customerLiabilities.ltLiabilityTotal,
        this.balanceSheetForm.customerLiabilities.petOwnersEquityTotal
      );
    },
    countTotalCurrentLiabilitiesEnd() {
      this.balanceSheetForm.customerLiabilitiesEnd.clCurrentLiabilitiesTotal = this.$add(
        this.$add(
          this.$add(
            this.$add(
              this.$add(
                this.$add(
                  this.$add(
                    this.$add(
                      this.$add(
                        this.$add(
                          this.$add(
                            this.$add(
                              this.balanceSheetForm.customerLiabilitiesEnd.clShortTermBorrowing,
                              this.balanceSheetForm.customerLiabilitiesEnd.clTradingFinancialLiabilities
                            ),
                            this.balanceSheetForm.customerLiabilitiesEnd.clMovableLiabilities
                          ),
                          this.balanceSheetForm.customerLiabilitiesEnd.clDerivativeFinancialLiabilitsy
                        ),
                        this.balanceSheetForm.customerLiabilitiesEnd.clNotesPayable
                      ),
                      this.balanceSheetForm.customerLiabilitiesEnd.clAccountsPayable
                    ),
                    this.balanceSheetForm.customerLiabilitiesEnd.clUnearnedRevenue
                  ),
                  this.balanceSheetForm.customerLiabilitiesEnd.clPayrollPayable
                ),
                this.balanceSheetForm.customerLiabilitiesEnd.clTaxPayable
              ),
              this.balanceSheetForm.customerLiabilitiesEnd.clOtherPayables
            ),
            this.balanceSheetForm.customerLiabilitiesEnd.clHoldingLiabilities
          ),
          this.balanceSheetForm.customerLiabilitiesEnd.clCurrentLiabilitiesComingDue
        ),
        this.balanceSheetForm.customerLiabilitiesEnd.clOtherCurrentLiability
      );
      this.balanceSheetForm.customerLiabilitiesEnd.ltLiabilityTotal = this.$add(
        this.balanceSheetForm.customerLiabilitiesEnd.clCurrentLiabilitiesTotal,
        this.balanceSheetForm.customerLiabilitiesEnd.nclNonCurrentLiabilities
      );
      this.balanceSheetForm.customerLiabilitiesEnd.peltOwnersEquityLiabilitiesTotal = this.$add(
        this.balanceSheetForm.customerLiabilitiesEnd.ltLiabilityTotal,
        this.balanceSheetForm.customerLiabilitiesEnd.petOwnersEquityTotal
      );
    },
    countTotalNonCurrentLiabilitiesEarly() {
      this.balanceSheetForm.customerLiabilities.nclNonCurrentLiabilities = this.$add(
        this.$add(
          this.$add(
            this.$add(
              this.$add(
                this.balanceSheetForm.customerLiabilities.nclBondsPayable,
                this.balanceSheetForm.customerLiabilities.nclLongTermPayable
              ),
              this.balanceSheetForm.customerLiabilities.nclAccruedLiabilities
            ),
            this.balanceSheetForm.customerLiabilities.nclDeferredIncome
          ),
          this.balanceSheetForm.customerLiabilities.nclDeferredIncomeTax
        ),
        this.balanceSheetForm.customerLiabilities.nclOtherOnCurrentLiabilities
      );
      this.balanceSheetForm.customerLiabilities.ltLiabilityTotal = this.$add(
        this.balanceSheetForm.customerLiabilities.clCurrentLiabilitiesTotal,
        this.balanceSheetForm.customerLiabilities.nclNonCurrentLiabilities
      );
      this.balanceSheetForm.customerLiabilities.peltOwnersEquityLiabilitiesTotal = this.$add(
        this.balanceSheetForm.customerLiabilities.ltLiabilityTotal,
        this.balanceSheetForm.customerLiabilities.petOwnersEquityTotal
      );
    },
    countTotalNonCurrentLiabilitiesEnd() {
      this.balanceSheetForm.customerLiabilitiesEnd.nclNonCurrentLiabilities = this.$add(
        this.$add(
          this.$add(
            this.$add(
              this.$add(
                this.balanceSheetForm.customerLiabilitiesEnd.nclBondsPayable,
                this.balanceSheetForm.customerLiabilitiesEnd.nclLongTermPayable
              ),
              this.balanceSheetForm.customerLiabilitiesEnd.nclAccruedLiabilities
            ),
            this.balanceSheetForm.customerLiabilitiesEnd.nclDeferredIncome
          ),
          this.balanceSheetForm.customerLiabilitiesEnd.nclDeferredIncomeTax
        ),
        this.balanceSheetForm.customerLiabilitiesEnd.nclOtherOnCurrentLiabilities
      );
      this.balanceSheetForm.customerLiabilitiesEnd.ltLiabilityTotal = this.$add(
        this.balanceSheetForm.customerLiabilitiesEnd.clCurrentLiabilitiesTotal,
        this.balanceSheetForm.customerLiabilitiesEnd.nclNonCurrentLiabilities
      );
      this.balanceSheetForm.customerLiabilitiesEnd.peltOwnersEquityLiabilitiesTotal = this.$add(
        this.balanceSheetForm.customerLiabilitiesEnd.ltLiabilityTotal,
        this.balanceSheetForm.customerLiabilitiesEnd.petOwnersEquityTotal
      );
    },
    countTotalOwnerSEquityEarly() {
      this.balanceSheetForm.customerLiabilities.petOwnersEquityTotal = this.$add(
        this.$add(
          this.$add(
            this.$add(
              this.$add(
                this.$subtract(
                  this.$add(
                    this.$add(
                      this.balanceSheetForm.customerLiabilities.csCapitalStock,
                      this.balanceSheetForm.customerLiabilities.oeiOtherEquityInstruments
                    ),
                    this.balanceSheetForm.customerLiabilities.crCapitalReserve
                  ),
                  this.balanceSheetForm.customerLiabilities.tsTreasuryStock
                ),
                this.balanceSheetForm.customerLiabilities.ocoiOtherComprehensiveIncome
              ),
              this.balanceSheetForm.customerLiabilities.srSpecialReserve
            ),
            this.balanceSheetForm.customerLiabilities.esEarnedSurplus
          ),
          this.balanceSheetForm.customerLiabilities.grpGeneralRiskProvision
        ),
        this.balanceSheetForm.customerLiabilities.upUndistributedProfit
      );
      this.balanceSheetForm.customerLiabilities.peltOwnersEquityLiabilitiesTotal = this.$add(
        this.balanceSheetForm.customerLiabilities.ltLiabilityTotal,
        this.balanceSheetForm.customerLiabilities.petOwnersEquityTotal
      );
    },
    countTotalOwnerSEquityEnd() {
      this.balanceSheetForm.customerLiabilitiesEnd.petOwnersEquityTotal = this.$add(
        this.$add(
          this.$add(
            this.$add(
              this.$add(
                this.$$subtract(
                  this.$add(
                    this.$add(
                      this.balanceSheetForm.customerLiabilitiesEnd.csCapitalStock,
                      this.balanceSheetForm.customerLiabilitiesEnd.oeiOtherEquityInstruments
                    ),
                    this.balanceSheetForm.customerLiabilitiesEnd.crCapitalReserve
                  ),
                  this.balanceSheetForm.customerLiabilitiesEnd.tsTreasuryStock
                ),
                this.balanceSheetForm.customerLiabilitiesEnd.ocoiOtherComprehensiveIncome
              ),
              this.balanceSheetForm.customerLiabilitiesEnd.srSpecialReserve
            ),
            this.balanceSheetForm.customerLiabilitiesEnd.esEarnedSurplus
          ),
          this.balanceSheetForm.customerLiabilitiesEnd.grpGeneralRiskProvision
        ),
        this.balanceSheetForm.customerLiabilitiesEnd.upUndistributedProfit
      );
      this.balanceSheetForm.customerLiabilitiesEnd.peltOwnersEquityLiabilitiesTotal = this.$add(
        this.balanceSheetForm.customerLiabilitiesEnd.ltLiabilityTotal,
        this.balanceSheetForm.customerLiabilitiesEnd.petOwnersEquityTotal
      );
    },
    // 配平验证
    validatePeltOwnersEquityLiabilitiesTotal() {
      const _me = this;
      return function(rule, value, callback) {
        if (
          _me.balanceSheetForm.customerLiabilities.peltOwnersEquityLiabilitiesTotal !==
          _me.balanceSheetForm.customerLiabilities.assetsTotal
        ) {
          callback(new Error("负债和所有者权益(或股东权益)总计(年初余额)需与资产总计(年初余额)保持一致！"));
        } else {
          callback();
        }
      };
    },
    validatePeltOwnersEquityLiabilitiesTotalEnd() {
      const _me = this;
      return function(rule, value, callback) {
        if (
          _me.balanceSheetForm.customerLiabilitiesEnd.peltOwnersEquityLiabilitiesTotal !==
          _me.balanceSheetForm.customerLiabilitiesEnd.assetsTotal
        ) {
          callback(new Error("负债和所有者权益(或股东权益)总计(期末余额)需与资产总计(期末余额)保持一致！"));
        } else {
          callback();
        }
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.upload-demo2 {
  display: none;
}
</style>
