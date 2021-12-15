<template>
    <div>
        <div class="page-header">
            <h1 class="page-name">
                <span>财务报表详情</span>
            </h1>
            <div>
                <el-button type="danger" @click="delReport">删除</el-button> 
                <el-button  
                    icon="el-icon-download"
                    type="primary"
                    style="height: 30px"
                   @click="fileDownload">
                    附件下载</el-button> 
                <el-button @click="back">返回</el-button>
            </div>
        </div>
        <div class="page-content">
            <el-form ref="displayInfo" :model="displayInfo" label-width="100px" style="margin-bottom: 0">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="客户编码">{{ displayInfo.companyCode||'-' }}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="客户名称">{{ displayInfo.companyName||'-' }}</el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-form ref="form" :model="form" label-width="100px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="财报类型" prop="type">
                            <el-radio-group v-model="form.type" disabled>
                                <el-radio label="0">年报</el-radio>
                                <!-- <el-radio label="1">半年报</el-radio>
                                <el-radio label="2">月报</el-radio> -->
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item
                            label="财报期间"
                            :prop="form.type==='2'?'month':'year'"
                        >{{form.type==='0'||form.type==='1'?form.year:''}}{{form.type==='1'?form.semiAnnual:''}}{{form.type==='2'?form.month:''}}</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="附件">
                            <span
                                class="canClick"
                                v-if="form.fsInfos&&form.fsInfos.length"
                                @click="checkFiles(form.fsInfos)"
                            >查看附件</span>
                            <span v-else>-</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-tabs type="border-card">
                <el-tab-pane label="资产负债表">
                    <p style="font-size: 14px; color: #606266; margin: 0 0 8px;">单位：元</p>
                    <table class="standard-table" cellspacing="0" border="1">
                        <thead>
                            <tr>
                                <th>资产</th>
                                <th>附注</th>
                                <th width="120px" align="right">年初余额</th>
                                <th width="120px" align="right">期末余额</th>
                                <th>负债和所有者权益(或股东权益)</th>
                                <th>附注</th>
                                <th width="120px" align="right">年初余额</th>
                                <th width="120px" align="right">期末余额</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="font-weight: bold;" colspan="4">流动资产：</td>
                                <td style="font-weight: bold;" colspan="4">流动负债：</td>
                            </tr>
                            <tr>
                                <td>货币资金</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.caMonetaryCapital}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilities.caMonetaryCapital)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.caMonetaryCapital)}}</td>
                                <td>短期借款</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.clShortTermBorrowing}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilities.clShortTermBorrowing)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.clShortTermBorrowing)}}</td>
                            </tr>
                            <tr>
                                <td>交易性金融资产</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.caTradableFinancialAssets}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilities.caTradableFinancialAssets)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.caTradableFinancialAssets)}}</td>
                                <td>交易性金融负债</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.clTradingFinancialLiabilities}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilities.clTradingFinancialLiabilities)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.clTradingFinancialLiabilities)}}</td>
                            </tr>
                            <tr>
                                <td>以公允价值计量且其变动计入当期损益的金融资产</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.caMovableAssets}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilities.caMovableAssets)}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.caMovableAssets)}}</td>
                                <td>以公允价值计量且其变动计入当期损益的金融负债</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.clMovableLiabilities}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilities.clMovableLiabilities)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.clMovableLiabilities)}}</td>
                            </tr>
                            <tr>
                                <td>衍生金融资产</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.caDerivativeFinancialAssets}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilities.caDerivativeFinancialAssets)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.caDerivativeFinancialAssets)}}</td>
                                <td>衍生金融负债</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.clDerivativeFinancialLiabilitsy}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilities.clDerivativeFinancialLiabilitsy)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.clDerivativeFinancialLiabilitsy)}}</td>
                            </tr>
                            <tr>
                                <td>应收票据</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.caNotesReceivable}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilities.caNotesReceivable)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.caNotesReceivable)}}</td>
                                <td>应付票据</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.clNotesPayable}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilities.clNotesPayable)}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.clNotesPayable)}}</td>
                            </tr>
                            <tr>
                                <td>应收账款</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.caReceivables}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilities.caReceivables)}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.caReceivables)}}</td>
                                <td>应付账款</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.clAccountsPayable}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilities.clAccountsPayable)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.clAccountsPayable)}}</td>
                            </tr>
                            <tr>
                                <td>应收款项融资</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.caReceivablesFinancing}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilities.caReceivablesFinancing)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.caReceivablesFinancing)}}</td>
                                <td>预收款项</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.clUnearnedRevenue}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilities.clUnearnedRevenue)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.clUnearnedRevenue)}}</td>
                            </tr>
                            <tr>
                                <td>预付款项</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.caAdvancePayment}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilities.caAdvancePayment)}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.caAdvancePayment)}}</td>
                                <td>应付职工薪酬</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.clPayrollPayable}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilities.clPayrollPayable)}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.clPayrollPayable)}}</td>
                            </tr>
                            <tr>
                                <td>其他应收款</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.caOtherReceivables}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilities.caOtherReceivables)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.caOtherReceivables)}}</td>
                                <td>应交税费</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.clTaxPayable}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilities.clTaxPayable)}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.clTaxPayable)}}</td>
                            </tr>
                            <tr>
                                <td>存货</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.caInventory}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilities.caInventory)}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.caInventory)}}</td>
                                <td>其他应付款</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.clOtherPayables}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilities.clOtherPayables)}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.clOtherPayables)}}</td>
                            </tr>
                            <tr>
                                <td>持有待售资产</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.caHoldingSaleAssets}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilities.caHoldingSaleAssets)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.caHoldingSaleAssets)}}</td>
                                <td>持有待售负债</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.clHoldingLiabilities}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilities.clHoldingLiabilities)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.clHoldingLiabilities)}}</td>
                            </tr>
                            <tr>
                                <td>一年内到期的非流动资产</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.caCurrentAssetsComingDue}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilities.caCurrentAssetsComingDue)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.caCurrentAssetsComingDue)}}</td>
                                <td>一年内到期的非流动负债</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.clCurrentLiabilitiesComingDue}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilities.clCurrentLiabilitiesComingDue)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.clCurrentLiabilitiesComingDue)}}</td>
                            </tr>
                            <tr>
                                <td>其他流动资产</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.caOtherCurrentAssets}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilities.caOtherCurrentAssets)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.caOtherCurrentAssets)}}</td>
                                <td>其他流动负债</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.clOtherCurrentLiability}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilities.clOtherCurrentLiability)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.clOtherCurrentLiability)}}</td>
                            </tr>
                            <tr>
                                <td align="center" style="font-weight: bold;">流动资产合计</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.caCurrentAssetsTotal}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilities.caCurrentAssetsTotal)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.caCurrentAssetsTotal)}}</td>
                                <td align="center" style="font-weight: bold;">流动负债合计</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.clCurrentLiabilitiesTotal}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilities.clCurrentLiabilitiesTotal)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.clCurrentLiabilitiesTotal)}}</td>
                            </tr>
                            <tr>
                                <td style="font-weight: bold;" colspan="4">非流动资产：</td>
                                <td style="font-weight: bold;" colspan="4">非流动负债：</td>
                            </tr>
                            <tr>
                                <td>债权投资</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.ncaBondInvestment}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilities.ncaBondInvestment)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.ncaBondInvestment)}}</td>
                                <td>长期借款</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.nclFundedDebt}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilities.nclFundedDebt)}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.nclFundedDebt)}}</td>
                            </tr>
                            <tr>
                                <td>可供出售金融资产</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.ncaFinancialAssets}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilities.ncaFinancialAssets)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.ncaFinancialAssets)}}</td>
                                <td>应付债券</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.nclBondsPayable}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilities.nclBondsPayable)}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.nclBondsPayable)}}</td>
                            </tr>
                            <tr>
                                <td>其他债权投资</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.ncaOtherDebt}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilities.ncaOtherDebt)}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.ncaOtherDebt)}}</td>
                                <td>其中：优先股</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.nclPreferredStock}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilities.nclPreferredStock)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.nclPreferredStock)}}</td>
                            </tr>
                            <tr>
                                <td>持有至到期投资</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.ncaHeldMaturity}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilities.ncaHeldMaturity)}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.ncaHeldMaturity)}}</td>
                                <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;永续债</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.nclPerpetualBond}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilities.nclPerpetualBond)}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.nclPerpetualBond)}}</td>
                            </tr>
                            <tr>
                                <td>长期应收款</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.ncaLongTermReceivables}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilities.ncaLongTermReceivables)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.ncaLongTermReceivables)}}</td>
                                <td>长期应付款</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.nclLongTermPayable}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilities.nclLongTermPayable)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.nclLongTermPayable)}}</td>
                            </tr>
                            <tr>
                                <td>长期股权投资</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.ncaLongTermEquity}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilities.ncaLongTermEquity)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.ncaLongTermEquity)}}</td>
                                <td>预计负债</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.nclAccruedLiabilities}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilities.nclAccruedLiabilities)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.nclAccruedLiabilities)}}</td>
                            </tr>
                            <tr>
                                <td>其他权益工具投资</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.ncaOtherEquityInstruments}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilities.ncaOtherEquityInstruments)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.ncaOtherEquityInstruments)}}</td>
                                <td>递延收益</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.nclDeferredIncome}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilities.nclDeferredIncome)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.nclDeferredIncome)}}</td>
                            </tr>
                            <tr>
                                <td>其他非流动金融资产</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.ncaOtherNonCurrentFinancial}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilities.ncaOtherNonCurrentFinancial)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.ncaOtherNonCurrentFinancial)}}</td>
                                <td>递延所得税负债</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.nclDeferredIncomeTax}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilities.nclDeferredIncomeTax)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.nclDeferredIncomeTax)}}</td>
                            </tr>
                            <tr>
                                <td>投资性房地产</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.ncaInvestmentProperty}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilities.ncaInvestmentProperty)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.ncaInvestmentProperty)}}</td>
                                <td>其他非流动负债</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.nclOtherOnCurrentLiabilities}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilities.nclOtherOnCurrentLiabilities)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.nclOtherOnCurrentLiabilities)}}</td>
                            </tr>
                            <tr>
                                <td>固定资产</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.ncaFixedAssets}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilities.ncaFixedAssets)}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.ncaFixedAssets)}}</td>
                                <td align="center" style="font-weight: bold;">非流动负债合计</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.nclNonCurrentLiabilities}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilities.nclNonCurrentLiabilities)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.nclNonCurrentLiabilities)}}</td>
                            </tr>
                            <tr>
                                <td>在建工程</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.ncaProcessConstruction}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilities.ncaProcessConstruction)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.ncaProcessConstruction)}}</td>
                                <td align="center" style="font-weight: bold;">负债合计</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.ltLiabilityTotal}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilities.ltLiabilityTotal)}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.ltLiabilityTotal)}}</td>
                            </tr>
                            <tr>
                                <td>生产性生物资产</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.ncaProductiveBiological}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilities.ncaProductiveBiological)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.ncaProductiveBiological)}}</td>
                                <td style="font-weight: bold;" colspan="4">所有者权益(或股东权益)：</td>
                            </tr>
                            <tr>
                                <td>油气资产</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.ncaOilGasAssets}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilities.ncaOilGasAssets)}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.ncaOilGasAssets)}}</td>
                                <td>实收资本(或股本)</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.csCapitalStock}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilities.csCapitalStock)}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.csCapitalStock)}}</td>
                            </tr>
                            <tr>
                                <td>无形资产</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.ncaIntangibleAssets}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilities.ncaIntangibleAssets)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.ncaIntangibleAssets)}}</td>
                                <td>其他权益工具</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.oeiOtherEquityInstruments}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilities.oeiOtherEquityInstruments)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.oeiOtherEquityInstruments)}}</td>
                            </tr>
                            <tr>
                                <td>开发支出</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.ncaDevelopmentExpenditure}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilities.ncaDevelopmentExpenditure)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.ncaDevelopmentExpenditure)}}</td>
                                <td>其中：优先股</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.oeiPreferredStock}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilities.oeiPreferredStock)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.oeiPreferredStock)}}</td>
                            </tr>
                            <tr>
                                <td>商誉</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.ncaGoodwill}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilities.ncaGoodwill)}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.ncaGoodwill)}}</td>
                                <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;永续债</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.oeiPerpetualBond}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilities.oeiPerpetualBond)}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.oeiPerpetualBond)}}</td>
                            </tr>
                            <tr>
                                <td>长期待摊费用</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.ncaLongTermUnamortized}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilities.ncaLongTermUnamortized)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.ncaLongTermUnamortized)}}</td>
                                <td>资本公积</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.crCapitalReserve}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilities.crCapitalReserve)}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.crCapitalReserve)}}</td>
                            </tr>
                            <tr>
                                <td>递延所得税资产</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.ncaDeferredTax}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilities.ncaDeferredTax)}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.ncaDeferredTax)}}</td>
                                <td>减：库存股</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.tsTreasuryStock}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilities.tsTreasuryStock)}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.tsTreasuryStock)}}</td>
                            </tr>
                            <tr>
                                <td>其他非流动资产</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.ncaOtherNonCurrent}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilities.ncaOtherNonCurrent)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.ncaOtherNonCurrent)}}</td>
                                <td>其他综合收益</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.ocoiOtherComprehensiveIncome}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilities.ocoiOtherComprehensiveIncome)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.ocoiOtherComprehensiveIncome)}}</td>
                            </tr>
                            <tr>
                                <td align="center" style="font-weight: bold;">非流动资产合计</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.ncaNonCurrentAssetsTotal}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilities.ncaNonCurrentAssetsTotal)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.ncaNonCurrentAssetsTotal)}}</td>
                                <td>专项储备</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.srSpecialReserve}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilities.srSpecialReserve)}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.srSpecialReserve)}}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>盈余公积</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.esEarnedSurplus}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilities.esEarnedSurplus)}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.esEarnedSurplus)}}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>一般风险准备</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.grpGeneralRiskProvision}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilities.grpGeneralRiskProvision)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.grpGeneralRiskProvision)}}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>未分配利润</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.upUndistributedProfit}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilities.upUndistributedProfit)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.upUndistributedProfit)}}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td align="center" style="font-weight: bold;">所有者权益(或股东权益)合计</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.petOwnersEquityTotal}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilities.petOwnersEquityTotal)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.petOwnersEquityTotal)}}</td>
                            </tr>
                            <tr>
                                <td align="center" style="font-weight: bold;">资产总计</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.assetsTotal}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilities.assetsTotal)}}</td>
                                <td align="right">{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.assetsTotal)}}</td>
                                <td align="center" style="font-weight: bold;">负债和所有者权益(或股东权益)总计</td>
                                <td>{{balanceSheetForm.customerLiabilitiesRemark.peltOwnersEquityLiabilitiesTotal}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilities.peltOwnersEquityLiabilitiesTotal)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(balanceSheetForm.customerLiabilitiesEnd.peltOwnersEquityLiabilitiesTotal)}}</td>
                            </tr>
                        </tbody>
                    </table>
                </el-tab-pane>
                <el-tab-pane label="利润表">
                    <p style="font-size: 14px; color: #606266; margin: 0 0 8px;">单位：元</p>
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
                                <td style="font-weight: bold;">一、营业收入</td>
                                <td>{{incomeSheetForm.customerProfitcRemark.orOperatingReceipt}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(incomeSheetForm.customerProfitcCurrent.orOperatingReceipt)}}</td>
                                <td align="right">{{$toMoney(incomeSheetForm.customerProfitcYear.orOperatingReceipt)}}</td>
                            </tr>
                            <tr>
                                <td style="padding-left: 24px;">减：营业成本</td>
                                <td>{{incomeSheetForm.customerProfitcRemark.orOperatingCosts}}</td>
                                <td align="right">{{$toMoney(incomeSheetForm.customerProfitcCurrent.orOperatingCosts)}}</td>
                                <td align="right">{{$toMoney(incomeSheetForm.customerProfitcYear.orOperatingCosts)}}</td>
                            </tr>
                            <tr>
                                <td style="padding-left: 36px;">税金及附加</td>
                                <td>{{incomeSheetForm.customerProfitcRemark.orTaxesSurcharges}}</td>
                                <td align="right">{{$toMoney(incomeSheetForm.customerProfitcCurrent.orTaxesSurcharges)}}</td>
                                <td align="right">{{$toMoney(incomeSheetForm.customerProfitcYear.orTaxesSurcharges)}}</td>
                            </tr>
                            <tr>
                                <td style="padding-left: 36px;">销售费用</td>
                                <td>{{incomeSheetForm.customerProfitcRemark.orSellingExpenses}}</td>
                                <td align="right">{{$toMoney(incomeSheetForm.customerProfitcCurrent.orSellingExpenses)}}</td>
                                <td align="right">{{$toMoney(incomeSheetForm.customerProfitcYear.orSellingExpenses)}}</td>
                            </tr>
                            <tr>
                                <td style="padding-left: 36px;">管理费用</td>
                                <td>{{incomeSheetForm.customerProfitcRemark.orOverheadExpense}}</td>
                                <td align="right">{{$toMoney(incomeSheetForm.customerProfitcCurrent.orOverheadExpense)}}</td>
                                <td align="right">{{$toMoney(incomeSheetForm.customerProfitcYear.orOverheadExpense)}}</td>
                            </tr>
                            <tr>
                                <td style="padding-left: 36px;">研发费用</td>
                                <td>{{incomeSheetForm.customerProfitcRemark.orDevelopmentExpense}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(incomeSheetForm.customerProfitcCurrent.orDevelopmentExpense)}}</td>
                                <td align="right">{{$toMoney(incomeSheetForm.customerProfitcYear.orDevelopmentExpense)}}</td>
                            </tr>
                            <tr>
                                <td style="padding-left: 36px;">财务费用</td>
                                <td>{{incomeSheetForm.customerProfitcRemark.orFinancialExpense}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(incomeSheetForm.customerProfitcCurrent.orFinancialExpense)}}</td>
                                <td align="right">{{$toMoney(incomeSheetForm.customerProfitcYear.orFinancialExpense)}}</td>
                            </tr>
                            <tr>
                                <td style="padding-left: 48px;">其中：利息费用</td>
                                <td>{{incomeSheetForm.customerProfitcRemark.orFinancialInterestExpense}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(incomeSheetForm.customerProfitcCurrent.orFinancialInterestExpense)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(incomeSheetForm.customerProfitcYear.orFinancialInterestExpense)}}</td>
                            </tr>
                            <tr>
                                <td
                                    style="padding-left: 48px;"
                                >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;利息收入</td>
                                <td>{{incomeSheetForm.customerProfitcRemark.orFinancialInterestIncome}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(incomeSheetForm.customerProfitcCurrent.orFinancialInterestIncome)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(incomeSheetForm.customerProfitcYear.orFinancialInterestIncome)}}</td>
                            </tr>
                            <tr>
                                <td style="padding-left: 24px;">加：其他收益</td>
                                <td>{{incomeSheetForm.customerProfitcRemark.orOtherBenefit}}</td>
                                <td align="right">{{$toMoney(incomeSheetForm.customerProfitcCurrent.orOtherBenefit)}}</td>
                                <td align="right">{{$toMoney(incomeSheetForm.customerProfitcYear.orOtherBenefit)}}</td>
                            </tr>
                            <tr>
                                <td style="padding-left: 36px;">投资收益（损失以“－”号填列）</td>
                                <td>{{incomeSheetForm.customerProfitcRemark.orInvestmentBenefit}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(incomeSheetForm.customerProfitcCurrent.orInvestmentBenefit)}}</td>
                                <td align="right">{{$toMoney(incomeSheetForm.customerProfitcYear.orInvestmentBenefit)}}</td>
                            </tr>
                            <tr>
                                <td style="padding-left: 48px;">其中：对联营企业和合营企业的投资收益</td>
                                <td>{{incomeSheetForm.customerProfitcRemark.orJointVentureIncome}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(incomeSheetForm.customerProfitcCurrent.orJointVentureIncome)}}</td>
                                <td align="right">{{$toMoney(incomeSheetForm.customerProfitcYear.orJointVentureIncome)}}</td>
                            </tr>
                            <tr>
                                <td style="padding-left: 36px; color: #f56c6c;">净敞口套期收益</td>
                                <td>{{incomeSheetForm.customerProfitcRemark.orNetExposureIncome}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(incomeSheetForm.customerProfitcCurrent.orNetExposureIncome)}}</td>
                                <td align="right">{{$toMoney(incomeSheetForm.customerProfitcYear.orNetExposureIncome)}}</td>
                            </tr>
                            <tr>
                                <td style="padding-left: 36px;">公允价值变动收益（损失以“－”号填列）</td>
                                <td>{{incomeSheetForm.customerProfitcRemark.orFairValueChangesIncome}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(incomeSheetForm.customerProfitcCurrent.orFairValueChangesIncome)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(incomeSheetForm.customerProfitcYear.orFairValueChangesIncome)}}</td>
                            </tr>
                            <tr>
                                <td style="padding-left: 36px; color: #f56c6c;">信用减值损失（损失以“－”号填列）</td>
                                <td>{{incomeSheetForm.customerProfitcRemark.orCreditImpairment}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(incomeSheetForm.customerProfitcCurrent.orCreditImpairment)}}</td>
                                <td align="right">{{$toMoney(incomeSheetForm.customerProfitcYear.orCreditImpairment)}}</td>
                            </tr>
                            <tr>
                                <td style="padding-left: 36px; color: #f56c6c;">资产减值损失（损失以“－”号填列）</td>
                                <td>{{incomeSheetForm.customerProfitcRemark.orAssetsImpairmentLoss}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(incomeSheetForm.customerProfitcCurrent.orAssetsImpairmentLoss)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(incomeSheetForm.customerProfitcYear.orAssetsImpairmentLoss)}}</td>
                            </tr>
                            <tr>
                                <td style="padding-left: 36px;">资产处置收益（损失以“-”号填列）</td>
                                <td>{{incomeSheetForm.customerProfitcRemark.orAssetDisposalProceeds}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(incomeSheetForm.customerProfitcCurrent.orAssetDisposalProceeds)}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(incomeSheetForm.customerProfitcYear.orAssetDisposalProceeds)}}</td>
                            </tr>
                            <tr>
                                <td style="font-weight: bold;">二、营业利润（亏损以“－”号填列）</td>
                                <td>{{incomeSheetForm.customerProfitcRemark.opOperatingProfit}}</td>
                                <td align="right">{{$toMoney(incomeSheetForm.customerProfitcCurrent.opOperatingProfit)}}</td>
                                <td align="right">{{$toMoney(incomeSheetForm.customerProfitcYear.opOperatingProfit)}}</td>
                            </tr>
                            <tr>
                                <td style="padding-left: 24px;">加：营业外收入</td>
                                <td>{{incomeSheetForm.customerProfitcRemark.opNonbusinessIncome}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(incomeSheetForm.customerProfitcCurrent.opNonbusinessIncome)}}</td>
                                <td align="right">{{$toMoney(incomeSheetForm.customerProfitcYear.opNonbusinessIncome)}}</td>
                            </tr>
                            <tr>
                                <td style="padding-left: 24px;">减：营业外支出</td>
                                <td>{{incomeSheetForm.customerProfitcRemark.opNonbusinessExpense}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(incomeSheetForm.customerProfitcCurrent.opNonbusinessExpense)}}</td>
                                <td align="right">{{$toMoney(incomeSheetForm.customerProfitcYear.opNonbusinessExpense)}}</td>
                            </tr>
                            <tr>
                                <td style="font-weight: bold;">三、利润总额（亏损总额以“－”号填列）</td>
                                <td>{{incomeSheetForm.customerProfitcRemark.tpTotalProfit}}</td>
                                <td align="right">{{$toMoney(incomeSheetForm.customerProfitcCurrent.tpTotalProfit)}}</td>
                                <td align="right">{{$toMoney(incomeSheetForm.customerProfitcYear.tpTotalProfit)}}</td>
                            </tr>
                            <tr>
                                <td style="padding-left: 24px;">减：所得税费用</td>
                                <td>{{incomeSheetForm.customerProfitcRemark.tpIncomeTaxExpense}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(incomeSheetForm.customerProfitcCurrent.tpIncomeTaxExpense)}}</td>
                                <td align="right">{{$toMoney(incomeSheetForm.customerProfitcYear.tpIncomeTaxExpense)}}</td>
                            </tr>
                            <tr>
                                <td style="font-weight: bold;">四、净利润（净亏损以“－”号填列）</td>
                                <td>{{incomeSheetForm.customerProfitcRemark.rpRetainedProfits}}</td>
                                <td align="right">{{$toMoney(incomeSheetForm.customerProfitcCurrent.rpRetainedProfits)}}</td>
                                <td align="right">{{$toMoney(incomeSheetForm.customerProfitcYear.rpRetainedProfits)}}</td>
                            </tr>
                            <tr>
                                <td style="font-weight: bold;">五、每股收益</td>
                                <td>{{incomeSheetForm.customerProfitcRemark.epsEarningsPerShare}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(incomeSheetForm.customerProfitcCurrent.epsEarningsPerShare)}}</td>
                                <td align="right">{{$toMoney(incomeSheetForm.customerProfitcYear.epsEarningsPerShare)}}</td>
                            </tr>
                            <tr>
                                <td style="padding-left: 24px;">（一）基本每股收益</td>
                                <td>{{incomeSheetForm.customerProfitcRemark.epsBase}}</td>
                                <td align="right">{{$toMoney(incomeSheetForm.customerProfitcCurrent.epsBase)}}</td>
                                <td align="right">{{$toMoney(incomeSheetForm.customerProfitcYear.epsBase)}}</td>
                            </tr>
                            <tr>
                                <td style="padding-left: 24px;">（二）稀释每股收益</td>
                                <td>{{incomeSheetForm.customerProfitcRemark.epsDiluted}}</td>
                                <td align="right">{{$toMoney(incomeSheetForm.customerProfitcCurrent.epsDiluted)}}</td>
                                <td align="right">{{$toMoney(incomeSheetForm.customerProfitcYear.epsDiluted)}}</td>
                            </tr>
                        </tbody>
                    </table>
                </el-tab-pane>
                <el-tab-pane label="现金流量表">
                    <p style="font-size: 14px; color: #606266; margin: 0 0 8px;">单位：元</p>
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
                                <td style="font-weight: bold;">一、经营活动产生的现金流量</td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>销售商品、提供劳务收到的现金</td>
                                <td>{{cashFlowSheetForm.customerCashFlowRemark.baSalesCash}}</td>
                                <td align="right">{{$toMoney(cashFlowSheetForm.customerCashFlow.baSalesCash)}}</td>
                            </tr>
                            <tr>
                                <td>收到的税费返还</td>
                                <td>{{cashFlowSheetForm.customerCashFlowRemark.baTaxRefund}}</td>
                                <td align="right">{{$toMoney(cashFlowSheetForm.customerCashFlow.baTaxRefund)}}</td>
                            </tr>
                            <tr>
                                <td>收到其他与经营活动有关的现金</td>
                                <td>{{cashFlowSheetForm.customerCashFlowRemark.baReceiveOtherActivitiesCash}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(cashFlowSheetForm.customerCashFlow.baReceiveOtherActivitiesCash)}}</td>
                            </tr>
                            <tr>
                                <td style="padding-left: 64px; font-weight: bold;">经营活动现金流入小计</td>
                                <td>{{cashFlowSheetForm.customerCashFlowRemark.baBusinessActivitiesInflow}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(cashFlowSheetForm.customerCashFlow.baBusinessActivitiesInflow)}}</td>
                            </tr>
                            <tr>
                                <td>购买商品、接受劳务支付的现金</td>
                                <td>{{cashFlowSheetForm.customerCashFlowRemark.baPurchaseCash}}</td>
                                <td align="right">{{$toMoney(cashFlowSheetForm.customerCashFlow.baPurchaseCash)}}</td>
                            </tr>
                            <tr>
                                <td>支付给职工以及为职工支付的现金</td>
                                <td>{{cashFlowSheetForm.customerCashFlowRemark.baEmployeePaysCash}}</td>
                                <td align="right">{{$toMoney(cashFlowSheetForm.customerCashFlow.baEmployeePaysCash)}}</td>
                            </tr>
                            <tr>
                                <td>支付的各项税费</td>
                                <td>{{cashFlowSheetForm.customerCashFlowRemark.baTaxPayment}}</td>
                                <td align="right">{{$toMoney(cashFlowSheetForm.customerCashFlow.baTaxPayment)}}</td>
                            </tr>
                            <tr>
                                <td>支付其他与经营活动有关的现金</td>
                                <td>{{cashFlowSheetForm.customerCashFlowRemark.baPayOtherActivitiesCash}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(cashFlowSheetForm.customerCashFlow.baPayOtherActivitiesCash)}}</td>
                            </tr>
                            <tr>
                                <td style="padding-left: 64px; font-weight: bold;">经营活动现金流出小计</td>
                                <td>{{cashFlowSheetForm.customerCashFlowRemark.baBusinessActivitiesOutflow}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(cashFlowSheetForm.customerCashFlow.baBusinessActivitiesOutflow)}}</td>
                            </tr>
                            <tr>
                                <td style="padding-left: 64px; font-weight: bold;">经营活动产生的现金流量净额</td>
                                <td>{{cashFlowSheetForm.customerCashFlowRemark.baBusinessNetCashFlow}}</td>
                                <td align="right">{{$toMoney(cashFlowSheetForm.customerCashFlow.baBusinessNetCashFlow)}}</td>
                            </tr>
                            <tr>
                                <td style="font-weight: bold;">二、投资活动产生的现金流量</td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>收回投资收到的现金</td>
                                <td>{{cashFlowSheetForm.customerCashFlowRemark.iaDisinvestment}}</td>
                                <td align="right">{{$toMoney(cashFlowSheetForm.customerCashFlow.iaDisinvestment)}}</td>
                            </tr>
                            <tr>
                                <td>取得投资收益收到的现金</td>
                                <td>{{cashFlowSheetForm.customerCashFlowRemark.iaInvestmentIncome}}</td>
                                <td align="right">{{$toMoney(cashFlowSheetForm.customerCashFlow.iaInvestmentIncome)}}</td>
                            </tr>
                            <tr>
                                <td>处置固定资产、无形资产和其他长期资产收回的现金净额</td>
                                <td>{{cashFlowSheetForm.customerCashFlowRemark.iaWithdrawalAssets}}</td>
                                <td align="right">{{$toMoney(cashFlowSheetForm.customerCashFlow.iaWithdrawalAssets)}}</td>
                            </tr>
                            <tr>
                                <td>处置子公司及其他营业单位收到的现金净额</td>
                                <td>{{cashFlowSheetForm.customerCashFlowRemark.iaSubsidiaryCorporationAssets}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(cashFlowSheetForm.customerCashFlow.iaSubsidiaryCorporationAssets)}}</td>
                            </tr>
                            <tr>
                                <td>收到其他与投资活动有关的现金</td>
                                <td>{{cashFlowSheetForm.customerCashFlowRemark.iaOtherActivities}}</td>
                                <td align="right">{{$toMoney(cashFlowSheetForm.customerCashFlow.iaOtherActivities)}}</td>
                            </tr>
                            <tr>
                                <td style="padding-left: 64px; font-weight: bold;">投资活动现金流入小计</td>
                                <td>{{cashFlowSheetForm.customerCashFlowRemark.iaInvestmentActivitiesInflow}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(cashFlowSheetForm.customerCashFlow.iaInvestmentActivitiesInflow)}}</td>
                            </tr>
                            <tr>
                                <td>购建固定资产、无形资产和其他长期资产支付的现金</td>
                                <td>{{cashFlowSheetForm.customerCashFlowRemark.iaPurchaseFixedAssets}}</td>
                                <td align="right">{{$toMoney(cashFlowSheetForm.customerCashFlow.iaPurchaseFixedAssets)}}</td>
                            </tr>
                            <tr>
                                <td>投资支付的现金</td>
                                <td>{{cashFlowSheetForm.customerCashFlowRemark.iaInvestmentPayCash}}</td>
                                <td align="right">{{$toMoney(cashFlowSheetForm.customerCashFlow.iaInvestmentPayCash)}}</td>
                            </tr>
                            <tr>
                                <td>取得子公司及其他营业单位支付的现金净额</td>
                                <td>{{cashFlowSheetForm.customerCashFlowRemark.iaSubsidiaryCorporationIncome}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(cashFlowSheetForm.customerCashFlow.iaSubsidiaryCorporationIncome)}}</td>
                            </tr>
                            <tr>
                                <td>支付其他与投资活动有关的现金</td>
                                <td>{{cashFlowSheetForm.customerCashFlowRemark.iaPayOtherActivities}}</td>
                                <td align="right">{{$toMoney(cashFlowSheetForm.customerCashFlow.iaPayOtherActivities)}}</td>
                            </tr>
                            <tr>
                                <td style="padding-left: 64px; font-weight: bold;">投资活动现金流出小计</td>
                                <td>{{cashFlowSheetForm.customerCashFlowRemark.iaInvestmentActivitiesOutflow}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(cashFlowSheetForm.customerCashFlow.iaInvestmentActivitiesOutflow)}}</td>
                            </tr>
                            <tr>
                                <td style="padding-left: 64px; font-weight: bold;">投资活动产生的现金流量净额</td>
                                <td>{{cashFlowSheetForm.customerCashFlowRemark.iaInvestmentNetCashFlow}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(cashFlowSheetForm.customerCashFlow.iaInvestmentNetCashFlow)}}</td>
                            </tr>
                            <tr>
                                <td style="font-weight: bold;">三、筹资活动产生的现金流量</td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>吸收投资收到的现金</td>
                                <td>{{cashFlowSheetForm.customerCashFlowRemark.faAbsorbInvestment}}</td>
                                <td align="right">{{$toMoney(cashFlowSheetForm.customerCashFlow.faAbsorbInvestment)}}</td>
                            </tr>
                            <tr>
                                <td>取得借款收到的现金</td>
                                <td>{{cashFlowSheetForm.customerCashFlowRemark.faBorrowMoney}}</td>
                                <td align="right">{{$toMoney(cashFlowSheetForm.customerCashFlow.faBorrowMoney)}}</td>
                            </tr>
                            <tr>
                                <td style="color: #f56c6c;">发行债券收到的现金</td>
                                <td>{{cashFlowSheetForm.customerCashFlowRemark.faFloatBonds}}</td>
                                <td align="right">{{$toMoney(cashFlowSheetForm.customerCashFlow.faFloatBonds)}}</td>
                            </tr>
                            <tr>
                                <td>收到其他与筹资活动有关的现金</td>
                                <td>{{cashFlowSheetForm.customerCashFlowRemark.faOtherActivities}}</td>
                                <td align="right">{{$toMoney(cashFlowSheetForm.customerCashFlow.faOtherActivities)}}</td>
                            </tr>
                            <tr>
                                <td style="padding-left: 64px; font-weight: bold;">筹资活动现金流入小计</td>
                                <td>{{cashFlowSheetForm.customerCashFlowRemark.faFinancialActivitiesInflow}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(cashFlowSheetForm.customerCashFlow.faFinancialActivitiesInflow)}}</td>
                            </tr>
                            <tr>
                                <td>偿还债务支付的现金</td>
                                <td>{{cashFlowSheetForm.customerCashFlowRemark.faRepayDebt}}</td>
                                <td align="right">{{$toMoney(cashFlowSheetForm.customerCashFlow.faRepayDebt)}}</td>
                            </tr>
                            <tr>
                                <td>分配股利、利润或偿付利息支付的现金</td>
                                <td>{{cashFlowSheetForm.customerCashFlowRemark.faPayInterest}}</td>
                                <td align="right">{{$toMoney(cashFlowSheetForm.customerCashFlow.faPayInterest)}}</td>
                            </tr>
                            <tr>
                                <td>支付其他与筹资活动有关的现金</td>
                                <td>{{cashFlowSheetForm.customerCashFlowRemark.faPayOtherActivities}}</td>
                                <td align="right">{{$toMoney(cashFlowSheetForm.customerCashFlow.faPayOtherActivities)}}</td>
                            </tr>
                            <tr>
                                <td style="padding-left: 64px; font-weight: bold;">筹资活动现金流出小计</td>
                                <td>{{cashFlowSheetForm.customerCashFlowRemark.faFinancialActivitiesOutflow}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(cashFlowSheetForm.customerCashFlow.faFinancialActivitiesOutflow)}}</td>
                            </tr>
                            <tr>
                                <td style="padding-left: 64px; font-weight: bold;">筹资活动产生的现金流量净额</td>
                                <td>{{cashFlowSheetForm.customerCashFlowRemark.faFinancialNetCashFlow}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(cashFlowSheetForm.customerCashFlow.faFinancialNetCashFlow)}}</td>
                            </tr>
                            <tr>
                                <td style="font-weight: bold;">四、汇率变动对现金及现金等价物的影响</td>
                                <td>{{cashFlowSheetForm.customerCashFlowRemark.ermExchangeRateMovement}}</td>
                                <td
                                    align="right"
                                >{{$toMoney(cashFlowSheetForm.customerCashFlow.ermExchangeRateMovement)}}</td>
                            </tr>
                            <tr>
                                <td style="font-weight: bold;">五、现金及现金等价物净增加额</td>
                                <td>{{cashFlowSheetForm.customerCashFlowRemark.ceCashEquivalent}}</td>
                                <td align="right">{{$toMoney(cashFlowSheetForm.customerCashFlow.ceCashEquivalent)}}</td>
                            </tr>
                            <tr>
                                <td>加：期初现金及现金等价物余额</td>
                                <td>{{cashFlowSheetForm.customerCashFlowRemark.iinitabala}}</td>
                                <td align="right">{{$toMoney(cashFlowSheetForm.customerCashFlow.iinitabala)}}</td>
                            </tr>
                            <tr>
                                <td style="font-weight: bold;">六、期末现金及现金等价物余额</td>
                                <td>{{cashFlowSheetForm.customerCashFlowRemark.caClosingAmount}}</td>
                                <td align="right">{{$toMoney(cashFlowSheetForm.customerCashFlow.caClosingAmount)}}</td>
                            </tr>
                        </tbody>
                    </table>
                </el-tab-pane>
            </el-tabs>
        </div>
        <ViewPicPdf ref="ref_ViewPicPdf"></ViewPicPdf>
    </div>
</template>

<script>
import ViewPicPdf from "./components/ViewPicPdf";
import { fxb } from "@/utils/variables";
import { Api_financialGetDetails ,Api_financialDelReport} from "@/api/creditManagement/customerProfile/customerManagemCustomer/FinancialAnalysis.js";
export default {
    name: "ReportDetail",
    components: { ViewPicPdf },
    props: {
        isDelete: Boolean
    },
    data() {
        return {
            fxb,
            baseUrl: process.env.VUE_APP_BASE_API,
            delId:'',
            rowData: {},
            companyId: null,
            pageStatus: null,
            displayInfo: {},
            form: {
                type: null,
                year: null,
                semiAnnual: null,
                month: null,
                fsInfos: []
            },
            balanceSheetForm: {
                customerLiabilities: {},
                customerLiabilitiesEnd: {},
                customerLiabilitiesRemark: {}
            },
            incomeSheetForm: {
                customerProfitcCurrent: {},
                customerProfitcYear: {},
                customerProfitcRemark: {}
            },
            cashFlowSheetForm: {
                customerCashFlow: {},
                customerCashFlowRemark: {}
            }
        };
    },
    methods: {
         // 附件下载
        fileDownload() {
        window.open(this.baseUrl + this.fxb + "/ecm/customer/financial/getFiles?id=" + this.delId, "_blank");
        },
        delReport() {
            this.$confirm("确定要删除该条财务报表记录吗？删除后不可恢复，请知晓。", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                Api_financialDelReport({ id: this.delId })
                .then((res) => {
                    this.$message({
                        type: "success",
                        message: res,
                    });
                    // this.getList();
                    this.$emit("hideReportDetail");
                })
                .catch((res) => {
                    this.$message.error(res);
                });
            });
        },
        // 页面初始化
        open(_row, _cID, _state, _data) {
            this.rowData = _row || {};
            this.companyId = _cID;
            this.pageStatus = _state;
            this.delId = _row.id
            this.displayInfo = { companyCode: _data.customerNo, companyName: _data.companyName };
            // 回显
            const loading = this.$openLoading();
            Api_financialGetDetails({ id: _row.id })
                .then(res => {
                    loading.close();
                    this.form.type = res.type;
                    this.form.year = res.year;
                    this.form.semiAnnual = res.semiAnnual;
                    this.form.month = res.month;
                    this.form.fsInfos = res.fsInfos;
                    // balanceSheetForm
                    res.customerLiabilities && (this.balanceSheetForm.customerLiabilities = res.customerLiabilities);
                    res.customerLiabilitiesEnd &&
                        (this.balanceSheetForm.customerLiabilitiesEnd = res.customerLiabilitiesEnd);
                    res.customerLiabilitiesRemark &&
                        (this.balanceSheetForm.customerLiabilitiesRemark = res.customerLiabilitiesRemark);
                    // customerProfitcCurrent
                    res.customerProfitcCurrent &&
                        (this.incomeSheetForm.customerProfitcCurrent = res.customerProfitcCurrent);
                    res.customerProfitcYear && (this.incomeSheetForm.customerProfitcYear = res.customerProfitcYear);
                    res.customerProfitcRemark &&
                        (this.incomeSheetForm.customerProfitcRemark = res.customerProfitcRemark);
                    // cashFlowSheetForm
                    res.customerCashFlow && (this.cashFlowSheetForm.customerCashFlow = res.customerCashFlow);
                    res.customerCashFlowRemark &&
                        (this.cashFlowSheetForm.customerCashFlowRemark = res.customerCashFlowRemark);
                })
                .catch(res => {
                    loading.close();
                });
        },
        /**
         * @查看附件
         * urls@文件列
         */
        checkFiles(urls) {
           
            this.$nextTick(() => {
                this.$refs.ref_ViewPicPdf.open(urls);
            });
        },
        // 返回
        back() {
            this.$emit("hideReportDetail");
        }
    }
};
</script>

<style lang="scss" scoped>
/deep/ .standard-table {
    border: 1px solid #d7dae2;
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 16px;

    th {
        color: #7088a4;
        background: #eaedf4;
    }

    td {
        color: #606266;
    }

    th,
    td {
        padding: 13px 12px;
    }
}
</style>
