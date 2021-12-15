<template>
  <div class="credit-tab-content">
    <Comp1 :companyName="companyName"></Comp1>
    <!-- comp2 -->
    <h4 class="flex">
      <span class="flex-primary">财务信息</span>
      <el-row>
        <el-col :span="11">
          <el-date-picker   style="width:100%"
            size="large"
            format="yyyy"
            v-model="modelForm2.eYear"
            @change="handelChangeDate"
            type="year"
            placeholder="请选择年度"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="11" style="margin-left: 8%">
          <el-select
            size="large"
            v-model="modelForm2.dataClassification"
            @change="handelChangeDate"
            placeholder="选择维度"
          >
            <el-option
              v-for="item in dimensionalityList"
              :key="item.code"
              :label="item.value"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </h4>

    <TableWrapper
      ref="ref_tableComp2"
      :fetchDataFn="Api_FinancialInformationPage"
      :query="modelForm2"
      :showTotalCount="true"
      :columns="col_tableComp2"
    />
    <Dialog
      title="财务信息详情"
      :visible.sync="visibleComp2"
      :showBtn="false"
      width="1100px"
      @close="onCloseComp2"
    >
      <el-form
        ref="ref_formComp2"
        :model="formComp2"
        label-width="8em"
        label-position="right"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="年度：" prop="name">
              <el-input
                :disabled="disabled2"
                v-model="formComp2.eyear"
                :title="formComp2.eyear"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="分类：" prop="registerNo">
              <el-input
                :disabled="disabled2"
                v-model="formComp2.dataClassification_p"
                :title="formComp2.dataClassification_p"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="半年度：" prop="owner">
              <el-input
                :disabled="disabled2"
                v-model="formComp2.dataClassification_two_p"
                :title="formComp2.dataClassification_two_p"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
           
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item
              label="总资产："
              prop="totalLiabilities"
              :title="formComp2.totalLiabilities"
            >
              <el-input
                :disabled="disabled2"
                v-model="formComp2.totalLiabilities"
              >
                <template slot="append"><div>万元</div></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="总负债："
              prop="totalLiabilities"
              :title="formComp2.totalLiabilities"
            >
              <el-input
                :disabled="disabled2"
                v-model="formComp2.totalLiabilities"
              >
                <template slot="append"><div>万元</div></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="净资产："
              prop="netAssets"
              :title="formComp2.netAssets"
            >
              <el-input :disabled="disabled2" v-model="formComp2.netAssets">
                <template slot="append"><div>万元</div></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="货币资金："
              prop="monetaryCapital"
              :title="formComp2.monetaryCapital"
            >
              <el-input
                :disabled="disabled2"
                v-model="formComp2.monetaryCapital"
              >
                <template slot="append"><div>万元</div></template>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item
              label="应收账款："
              prop="accountsReceivable"
              :title="formComp2.accountsReceivable"
            >
              <el-input
                :disabled="disabled2"
                v-model="formComp2.accountsReceivable"
              >
                <template slot="append"><div>万元</div></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="存货：" prop="stock" :title="formComp2.stock">
              <el-input :disabled="disabled2" v-model="formComp2.stock">
                <template slot="append"><div>万元</div></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="流动资产："
              prop="currentAssets"
              :title="formComp2.currentAssets"
            >
              <el-input :disabled="disabled2" v-model="formComp2.currentAssets">
                <template slot="append"><div>万元</div></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="长期投资："
              prop="longTermInvestment"
              :title="formComp2.longTermInvestment"
            >
              <el-input
                :disabled="disabled2"
                v-model="formComp2.longTermInvestment"
              >
                <template slot="append"><div>万元</div></template>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item
              label="短期借款："
              prop="shortTermLoans	"
              :title="formComp2.shortTermLoans"
            >
              <el-input
                :disabled="disabled2"
                v-model="formComp2.shortTermLoans"
              >
                <template slot="append"><div>万元</div></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="长期负债："
              prop="longTermLiabilities	"
              :title="formComp2.longTermLiabilities"
            >
              <el-input
                :disabled="disabled2"
                v-model="formComp2.longTermLiabilities"
              >
                <template slot="append"><div>万元</div></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="流动负债："
              prop="currentLiabilities"
              :title="formComp2.currentLiabilities"
            >
              <el-input
                :disabled="disabled2"
                v-model="formComp2.currentLiabilities"
              >
                <template slot="append"><div>万元</div></template>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item
              label="所有者权益："
              prop="ownerEquity"
              :title="formComp2.ownerEquity"
            >
              <el-input :disabled="disabled2" v-model="formComp2.ownerEquity">
                <template slot="append"><div>万元</div></template>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item
              label="总收入："
              prop="totalRevenue"
              :title="formComp2.totalRevenue"
            >
              <el-input :disabled="disabled2" v-model="formComp2.totalRevenue">
                <template slot="append"><div>万元</div></template>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item
              label="主营收入："
              prop="mainBusinessIncome"
              :title="formComp2.mainBusinessIncome"
            >
              <el-input
                :disabled="disabled2"
                v-model="formComp2.mainBusinessIncome"
              >
                <template slot="append"><div>万元</div></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="营业成本："
              prop="operatingCost"
              :title="formComp2.operatingCost"
            >
              <el-input :disabled="disabled2" v-model="formComp2.operatingCost">
                <template slot="append"><div>万元</div></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="总税收："
              prop="totalTax"
              :title="formComp2.totalTax"
            >
              <el-input :disabled="disabled2" v-model="formComp2.totalTax">
                <template slot="append"><div>万元</div></template>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item
              label="销售费用："
              prop="sellingExpenses"
              :title="formComp2.sellingExpenses"
            >
              <el-input
                :disabled="disabled2"
                v-model="formComp2.sellingExpenses"
              >
                <template slot="append"><div>万元</div></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="管理费用："
              prop="managementExpenses"
              :title="formComp2.managementExpenses"
            >
              <el-input
                :disabled="disabled2"
                v-model="formComp2.managementExpenses"
              >
                <template slot="append"><div>万元</div></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="财务费用："
              prop="financialExpenses	"
              :title="formComp2.financialExpenses"
            >
              <el-input
                :disabled="disabled2"
                v-model="formComp2.financialExpenses"
              >
                <template slot="append"><div>万元</div></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="主营利润："
              prop="mainBusinessProfit"
              :title="formComp2.mainBusinessProfit"
            >
              <el-input
                :disabled="disabled2"
                v-model="formComp2.mainBusinessProfit"
              >
                <template slot="append"><div>万元</div></template>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item
              label="净利润："
              prop="netProfit"
              :title="formComp2.netProfit"
            >
              <el-input :disabled="disabled2" v-model="formComp2.netProfit">
                <template slot="append"><div>万元</div></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="退税信息："
              prop="taxRefundInformation"
              :title="formComp2.taxRefundInformation"
            >
              <el-input
                :disabled="disabled2"
                v-model="formComp2.taxRefundInformation"
              >
                <template slot="append"><div>万元</div></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="开票额："
              prop="billing"
              :title="formComp2.billing"
            >
              <el-input :disabled="disabled2" v-model="formComp2.billing">
                <template slot="append"><div>万元</div></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="拱顶资产投资："
              prop="investmentInFixedAssets"
              :title="formComp2.investmentInFixedAssets"
            >
              <el-input
                :disabled="disabled2"
                v-model="formComp2.investmentInFixedAssets"
              >
                <template slot="append"><div>万元</div></template>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item
              label="销售额："
              prop="salesVolume	"
              :title="formComp2.salesVolume"
            >
              <el-input :disabled="disabled2" v-model="formComp2.salesVolume">
                <template slot="append"><div>万元</div></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="服务外包："
              prop="outsourcingAmount"
              :title="formComp2.outsourcingAmount"
            >
              <el-input
                :disabled="disabled2"
                v-model="formComp2.outsourcingAmount"
              >
                <template slot="append"><div>万元</div></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="货币类型："
              prop="currencyType"
              :title="formComp2.currencyType"
            >
              <el-input :disabled="disabled2" v-model="formComp2.currencyType">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div>企业税务情况:</div>

        <TableWrapper
          ref="ref_tableComp0"
          :data="formComp2.enterpriseTaList"
          :columns="enterpriseTaList"
        />
      </el-form>
    </Dialog>
    <!-- comp3 -->
    <h4 class="flex">
      <span class="flex-primary">资质证书</span>
    </h4>
    <TableWrapper
      ref="ref_tableComp3"
      :showTotalCount="true"
      :fetchDataFn="Api_QualificationCertificatePage"
      :query="{ id: CompanyId }"
      :columns="col_tableComp3"
    />

    <Dialog
      title="资质证书详情"
      :visible.sync="visibleComp3"
      :showBtn="false"
      width="1100px"
      @close="onCloseComp3"
    >
      <el-form
        ref="ref_formComp3"
        :model="formComp3"
        label-width="6em"
        label-position="right"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="证书类型：" prop="certificateType_p">
              <el-input
                :disabled="disabled3"
                v-model="formComp3.certificateType_p"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item label="证书名称：" prop="certificateName">
              <el-input
                :disabled="disabled3"
                v-model="formComp3.certificateName"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="证书编号：" prop="certificateNo">
              <el-input
                :disabled="disabled3"
                v-model="formComp3.certificateNo"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="发证日期：" prop="issueDate">
              <el-date-picker   style="width:100%"
                type="date"
                :disabled="disabled3"
                v-model="formComp3.issueDate"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="截止日期：" prop="closingDate">
              <el-date-picker  
               style="width:100%"
                type="date"
                :disabled="disabled3"
                v-model="formComp3.closingDate"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </Dialog>
    <!-- comp4 -->
    <h4 class="flex">
      <span class="flex-primary">融资信息</span>
    </h4>

    <div>
      <el-timeline ref="ref_formComp4" class="my-timeline">
        <el-timeline-item
          color="#2d8cf0"
          :timestamp="
            index !== formComp4.length - 1 ? item.year.toString() : ''
          "
          placement="top"
          v-for="(item, index) in formComp4"
          :key="index"
        >
          <div class="line-main" v-if="index !== formComp4.length - 1">
            <div v-for="val in item.rzxxList" :key="val.id">
              <el-row>
                <el-col :span="8">
                  <label>资质性质：</label>
                  {{ val.financingNature|emptyMessage }}
                </el-col>
                <el-col :span="8">
                  <label>融资对象：</label>
                  {{ val.financingObject|emptyMessage }}
                </el-col>
                <el-col :span="8">
                  <label>投资金额：</label>
                  {{ val.financingAmount|emptyMessage }}
                </el-col>
              </el-row>
              <el-row class="fujian">
                <el-col>
                  <label> 相关附件：- </label>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>
    <!-- comp5 -->

    <h4 class="flex">
      <span class="flex-primary">合作情况</span>
    </h4>
    <TableWrapper
      ref="ref_tableComp5"
      :fetchDataFn="Api_CooperationPage"
      :query="{ id: CompanyId }"
      :columns="col_tableComp5"
    />
    <Dialog
      title="合作详情"
      :visible.sync="visibleComp5"
      :showBtn="false"
      width="1100px"
      @close="onCloseComp5"
    >
      <el-form
        ref="ref_formComp5"
        :model="formComp5"
        label-width="8em"
        label-position="right"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="合作类型：" prop="cooperationTypes_p">
              <el-input
                :disabled="disabled5"
                v-model="formComp5.cooperationTypes_p"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item label="项目名称：" prop="projectName">
              <el-input
                :disabled="disabled5"
                v-model="formComp5.projectName"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="项目起始日期：" prop="projectStartTime">
              <el-input
                :disabled="disabled5"
                v-model="formComp5.projectStartTime"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="项目结束日期：" prop="projectEndTime">
              <el-input
                :disabled="disabled5"
                v-model="formComp5.projectEndTime"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="合作单位名称：" prop="partnerName">
              <el-input
                :disabled="disabled5"
                v-model="formComp5.partnerName"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="合作联系人：" prop="contactPerson">
              <el-input
                :disabled="disabled5"
                v-model="formComp5.contactPerson"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="合作详情：" prop="cooperationDetails">
              <el-input
                :disabled="disabled5"
                type="textarea"
                :autosize="{ minRows: 4 }"
                v-model="formComp5.cooperationDetails"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </Dialog>

    <!-- comp6 -->
    <h4 class="flex">
      <span class="flex-primary">企业资质</span>
    </h4>
    <TableWrapper
      ref="ref_tableComp6"
      :fetchDataFn="Api_enterpriseQualificationPage"
      :query="{ id: CompanyId }"
      :columns="col_tableComp6"
    />
    <Dialog
      title="企业资质详情"
      :visible.sync="visibleComp6"
      :showBtn="false"
      width="1100px"
      @close="onCloseComp6"
    >
      <el-form
        ref="ref_formComp6"
        :model="formComp6"
        label-width="6em"
        label-position="right"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="企业类型" prop="approvedYear">
              <el-input
                v-model="formComp6.approvedYear"
                :disabled="disabled6"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="获批年度：" prop="approvedYear">
              <el-date-picker   style="width:100%"
                v-model="formComp6.approvedYear"
                :disabled="disabled6"
                type="year"
                placeholder="选择年"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="有效期：" prop="validityTerm">
              <el-date-picker   style="width:100%"
                type="date"
                v-model="formComp6.validityTerm"
                :disabled="disabled6"
              ></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="备注：" prop="remarks">
              <el-input
                type="textarea"
                :autosize="{ minRows: 4 }"
                placeholder="请输入内容"
                v-model="formComp6.remarks"
                :disabled="disabled6"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </Dialog>

    <!-- comp7 -->
    <Comp7 :companyName="companyName" :isreadOnly="isreadOnly"></Comp7>
  </div>
</template>

<script>
import Comp1 from "./Comp1";
import Comp7 from "./Comp7";
import {
  Api_FinancialInformationPage,
  Api_FinancialInformationDetail,
  Api_QualificationCertificatePage,
  Api_QualificationCertificateDetail,
  Api_FinancingSituationPage,
  Api_CooperationPage,
  Api_CooperationDetail,
  Api_enterpriseQualificationPage,
  Api_enterpriseQualificationDetail,
} from "@/api/creditManagement/customerProfile/customerManagemCustomer/knowledgePro";
import { dateFormat } from "@/utils";
import Upload from "@/components/Upload/index.vue";
import { mapGetters } from "vuex";
export default {
  name: "KnowledgePro",
  components: { Comp1, Upload ,Comp7},
  filters: { dateFormat },
  props: {
    id: String, // 客户id，用于查询详情数据
    companyName: String,
    isFxb: Boolean,
    isreadOnly:Boolean
  },
  computed: {
    ...mapGetters(["CompanyId"]),
  },
  data() {
    return {
      disabled2: true,
      disabled3: true,
      disabled6: true,
      disabled5: true,
      // 财务信息参数
      modelForm2: {
        eYear: null,
        dataClassification: null,
        enterpriseId: "",
      },
      // 财务信息 维度
      dimensionalityList: [
        {
          code: "",
          value: "全部",
        },
        {
          code: "monthly",
          value: "月度",
        },
        {
          code: "quarter",
          value: "季度",
        },
        {
          code: "hanfYear",
          value: "半年度",
        },
        {
          code: "year",
          value: "年度",
        },
      ],
      // comp2
      visibleComp2: false,
      formComp2: {
        name: null,
        registerNo: null,
        owner: null,
        registerAperDate: null,
        category: null,
        publishDate: null,
      },
      col_tableComp2: [
        { label: "财务年度", key: "eyear" },
        { label: "分类", key: "dataClassification_two_p" },
        { label: "总资产（万）", key: "totalAssets" },
        { label: "总负债（万）", key: "totalLiabilities" },
        { label: "总销售（万）", key: "salesVolume" },
        { label: "净利润（万））", key: "netProfit" },
        { label: "总税收（万）", key: "totalTax" },
        {
          label: "操作",
          key: null,
          render: (h, data, row) => {
            return !this.isFxb
              ? [
                  <el-link
                    type="primary"
                    onClick={this.editComp2.bind(this, row)}
                  >
                    {" "}
                    详情{" "}
                  </el-link>,
                ]
              : "";
          },
        },
      ],
      enterpriseTaList: [
        { label: "税务名称", key: "taxName" },
        { label: "税务代码", key: "taxCode" },
        { label: "税收金额	", key: "taxAmount" },
      ],
      // comp3
      visibleComp3: false,
      formComp3: {
        name: null,
        registerNo: null,
        owner: null,
        registerDate: null,
        category: null,
        publishDate: null,
      },
      certificateList: [
        "高新技术企业",
        "独角兽企业",
        "瞪羚企业",
        "创新型企业",
        "科技小巨人企业",
        "专精特新企业",
        "雏鹰企业",
        "企业技术中心",
        "科技企业孵化器",
        "技术创新示范企业",
        "科技型中小企业",
        "众创空间",
        "隐形冠军企业",
        "技术先进型服务企业",
        "民营科技企业",
        "牛羚企业",
        "专精特新小巨人企业",
      ],
      col_tableComp3: [
        { label: "证书类型", key: "certificateType_p" },
        { label: "证书名称", key: "certificateName" },
        { label: "证书编号", key: "certificateNo" },
        {
          label: "发证日期",
          key: "issueDate	",
          render: (h, data) => (data ? this.$dateFormat(data) : "-"),
        },
        {
          label: "截止日期",
          key: "closingDate",
          render: (h, data) => (data ? this.$dateFormat(data) : "-"),
        },
        {
          label: "操作",
          key: null,
          render: (h, data, row) => {
            return !this.isFxb
              ? [
                  <el-link
                    type="primary"
                    onClick={this.editComp3.bind(this, row)}
                  >
                    {" "}
                    详情{" "}
                  </el-link>,
                ]
              : "";
          },
        },
      ],
      // comp4
      formComp4: [],
      // comp5
      statusComp5: null,
      visibleComp5: false,
      formComp5: {
        name: null,
        certificateNumber: null,
        startDate: null,
        currentState: null,
      },

      col_tableComp5: [
        { label: "合作类型", key: "cooperationTypes_p" },
        { label: "项目名称", key: "projectName" },
        {
          label: "项目起始日期",
          key: "projectStartTime",
          render: (h, data) => (data ? this.$dateFormat(data) : "-"),
        },
        {
          label: "项目结束日期",
          key: "projectEndTime",
          render: (h, data) => (data ? this.$dateFormat(data) : "-"),
        },
        { label: "合作单位名称", key: "partnerName" },
        {
          label: "操作",
          key: null,
          render: (h, data, row) => {
            return !this.isFxb
              ? [
                  <el-link
                    type="primary"
                    onClick={this.editComp5.bind(this, row)}
                  >
                    {" "}
                    详情{" "}
                  </el-link>,
                ]
              : "";
          },
        },
      ],
      col_tableComp6: [
        { label: "企业类型", key: "enterprisesType" },
        { label: "获批年度", key: "approvedYear" },
        {
          label: "有效期",
          key: "validityTerm",
          render: (h, data) => (data ? this.$dateFormat(data) : "-"),
        },
        {
          label: "操作",
          key: null,
          render: (h, data, row) => {
            return !this.isFxb
              ? [
                  <el-link
                    type="primary"
                    onClick={this.editComp6.bind(this, row)}
                  >
                    {" "}
                    详情{" "}
                  </el-link>,
                ]
              : "";
          },
        },
      ],
      // comp6
      statusComp6: null,
      visibleComp6: false,
      formComp6: {
        name: null,
        regNo: null,
        appDate: null,
        applicantCn: null,
        intClsDesc: null,
        status: null,
      },
      // rows
      rowComp2: {},
      rowComp3: {},
      rowComp4: {},
      rowComp5: {},
      rowComp6: {},
    };
  },
  mounted() {
    this.modelForm2.enterpriseId = this.CompanyId;
    this.getComp2();
    this.getComp3();
    this.getComp4();
    this.getComp5();
    this.getComp6();
  },
  methods: {
    Api_FinancialInformationPage,
    Api_QualificationCertificatePage,
    Api_CooperationPage,
    Api_enterpriseQualificationPage,
    getComp2() {
      this.$nextTick(() => {
        this.$refs.ref_tableComp2.fetchData();
      });
    },
    getComp3() {
      this.$nextTick(() => {
        this.$refs.ref_tableComp3.fetchData();
      });
    },
    getComp4() {
      Api_FinancingSituationPage(this.CompanyId).then((res) => {
        if (res || res.success) {
          this.formComp4 = res;
          this.formComp4.push("");
        } else {
          this.$message.error("出现未知错误，请联系管理员");
        }
      });
    },

    getComp5() {
      this.$nextTick(() => {
        this.$refs.ref_tableComp5.fetchData();
      });
    },
    getComp6() {
      this.$nextTick(() => {
        this.$refs.ref_tableComp6.fetchData();
      });
    },
    onCloseComp2() {
      this.$refs["ref_formComp2"].resetFields();
      this.$nextTick(() => {
        this.visibleComp2 = false;
      });
    },
    // comp3
    onCloseComp3() {
      this.$refs.ref_formComp3.resetFields();
      this.$nextTick(() => {
        this.visibleComp3 = false;
      });
    },
    // comp5
    openComp5() {
      this.visibleComp5 = true;
      this.statusComp5 = "add";
    },

    onCloseComp5() {
      this.$refs.ref_formComp5.resetFields();
      this.$nextTick(() => {
        this.visibleComp5 = false;
      });
    },
    // comp6
    openComp6() {
      this.visibleComp6 = true;
      this.statusComp6 = "add";
    },
    onCloseComp6() {
      this.$refs.ref_formComp6.resetFields();
      this.imageUrl = [];
      this.$nextTick(() => {
        this.visibleComp6 = false;
      });
    },
    // ////////// edit
    editComp2(row) {
      Api_FinancialInformationDetail(row.id).then((res) => {
        if (res) {
          this.formComp2 = res;
          this.visibleComp2 = true;
        } else {
          this.$message.error("数据接口异常，请联系管理员");
        }
      });
    },
    editComp3(row) {
      Api_QualificationCertificateDetail(row.id).then((res) => {
        this.formComp3 = res;
        this.visibleComp3 = true;
      });
    },

    editComp5(row) {
      Api_CooperationDetail(row.id).then((res) => {
        if (res || res.success) {
          this.formComp5 = res;
          this.visibleComp5 = true;
        } else {
          this.$message.error("数据接口异常，请联系管理员");
        }
      });
    },
    editComp6(row) {
      Api_enterpriseQualificationDetail(row.id).then((res) => {
        if (res || res.success) {
          this.formComp6 = res;
          this.visibleComp6 = true;
        } else {
          this.$message.error("数据接口异常，请联系管理员");
        }
      });
    },

    // 切换时间或者维度
    handelChangeDate() {
      this.modelForm2.eYear =this.modelForm2.eYear ?this.$moment(this.modelForm2.eYear).format(
        "YYYY"
      ):''
      this.getComp2();
    },
  },
};
</script>
<style lang="scss" >
.my-timeline {
  .el-timeline-item__timestamp {
    font-family: MicrosoftYaHei-Bold;
    font-size: 16px;
    font-weight: bold;
    font-stretch: normal;
    line-height: 16px;
    letter-spacing: 0px;
    color: #333333;
  }
  .el-timeline-item__node:last-child {
    display: none;
  }
}
</style>
<style  lang="scss" scoped>
.my-timeline {
  .line-main {
    background-color: #f7f9fa;
    padding-top: 30px;
    padding-right: 30px;
    padding-left: 74px;
  }
  .fujian {
    margin-top: 15px;
    line-height: 30px;
    padding-bottom: 30px;
  }
}
</style>
