<template>
  <div style="background: #fff;padding: 22px 20px 20px 20px;margin-top: 26px;">
    <h3 style="font-weight: bold; font-size: 20px">尽职调查</h3>
    <h4 class="subtitle">
      经营环境
      <el-button
        class="btn-position"
        icon="icon iconfont icon-plus"
        size="small"
        @click="newOperatingEnvironment"
      >新增</el-button>
    </h4>
    <div class="operating-environment">
      <div class="p-txt-position">
        <p>业务覆盖区域：</p>
        <p>所属行业及代码：</p>
        <p>区域信用优势与关注：</p>
        <p>行业政策指向：</p>
        <p>行业市场集中度：</p>
        <p>产业链所处位置：</p>
        <p>行业近期发展趋势：</p>
        <p>行业分析：</p>
        <p>行业风险提示：</p>
      </div>
    </div>
    <el-divider></el-divider>
    <h4 class="subtitle">生产情况</h4>
    <div class="production-status">
      <el-row>
        <el-col :span="5">
          <div class="col" style="font-weight: bold">生产、经营场所</div>
        </el-col>
        <el-col :span="3">
          <div class="col">总计</div>
        </el-col>
        <el-col :span="3">
          <div class="col">自有</div>
        </el-col>
        <el-col :span="3">
          <div class="col">按揭</div>
        </el-col>
        <el-col :span="3">
          <div class="col">租赁</div>
        </el-col>
        <el-col :span="7">
          <div class="col" style="text-align: right">
            <el-button icon="icon iconfont icon-plus" size="small" @click="newProductionStatus">新增</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row v-for="(item, index) in productionStatusData" :key="index">
        <el-col :span="5">
          <div class="td" style="font-weight: bold">{{ item.name }}</div>
        </el-col>
        <el-col :span="3">
          <div class="td">{{ item.total }}</div>
        </el-col>
        <el-col :span="3">
          <div class="td">{{ item.own }}</div>
        </el-col>
        <el-col :span="3">
          <div class="td">{{ item.mortgage }}</div>
        </el-col>
        <el-col :span="3">
          <div class="td">{{ item.rent }}</div>
        </el-col>
      </el-row>
      <el-row style="margin-top: 22px">
        <el-col :span="12">
          <div class="col" style="font-weight: bold">经营场所现场视察情况</div>
        </el-col>
        <el-col :span="12">
          <div class="col" style="text-align: right">
            <el-button icon="icon iconfont icon-plus" size="small" @click="newBuisnessPlace">新增</el-button>
          </div>
        </el-col>
      </el-row>
      <div class="p-txt-position" style="padding-top: 16px">
        <p>占地面积(公顷)：</p>
        <p>地理位置和周边环境：</p>
        <p>经营地址内部环境：</p>
        <p>主要经营设施：</p>
        <p>经营设施使用情况：</p>
        <p>库存及库存质量：</p>
        <p>员工素质：</p>
        <p>员工工作积极性：</p>
        <p>员工对上级评价：</p>
        <p>经营场所所有权：</p>
        <p>管理层素质：</p>
        <p>管理层管理风格和水平：</p>
      </div>
    </div>
    <el-divider></el-divider>
    <h4 class="subtitle">主营业务及收入情况</h4>
    <div class="main-business">
      <el-row style="margin-top: 22px">
        <el-col :span="12">
          <div class="col" style="font-weight: bold">业务概况</div>
        </el-col>
        <el-col :span="12">
          <div class="col" style="text-align: right">
            <el-button icon="icon iconfont icon-plus" size="small" @click="newBusinessOverview">新增</el-button>
          </div>
        </el-col>
      </el-row>
      <div class="p-txt-position" style="padding-top: 16px">
        <p>主要产品和服务：</p>
        <p>主营业务概述：</p>
        <p>地域分布：</p>
        <p>知识产权数量：</p>
        <p>经营效率评价：</p>
      </div>
      <el-row style="margin-top: 22px">
        <el-col :span="5">
          <div class="col">
            <span style="font-weight: bold">收入构成</span> (单位：万元)
          </div>
        </el-col>
        <el-col :span="4">
          <div class="col">营业收入合计</div>
        </el-col>
        <el-col :span="4">
          <div class="col">毛利润合计</div>
        </el-col>
        <el-col :span="4">
          <div class="col">综合毛利率</div>
        </el-col>
        <el-col :span="7">
          <div class="col" style="text-align: right">
            <el-button icon="icon iconfont icon-plus" size="small" @click="newIncomeStructure">新增</el-button>
          </div>
        </el-col>
      </el-row>
      <div v-for="(item, index) in mainBusinessData" :key="index">
        <el-row>
          <el-col :span="5">
            <div class="td">{{ item.year }}</div>
          </el-col>
          <el-col :span="4">
            <div class="td" style="font-weight: bold">{{ item.operatingIncome }}</div>
          </el-col>
          <el-col :span="4">
            <div class="td" style="font-weight: bold">{{ item.grossProfit }}</div>
          </el-col>
          <el-col :span="4">
            <div class="td" style="font-weight: bold">{{ item.margin }}</div>
          </el-col>
        </el-row>
        <div style="margin-left: 10%">
          <el-row :gutter="16">
            <el-col :span="4" v-for="(pro, index) in item.productions" :key="index">
              <div class="main-business-table-col">
                <p class="bottom-title">{{ pro.name }}</p>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <h4 class="subtitle">
      前10大供应商(最近一年度)
      <el-button
        class="btn-position"
        icon="icon iconfont icon-plus"
        size="small"
        @click="newSupplier"
      >新增</el-button>
    </h4>
    <div class="supplier">
      <TableWrapper ref="child" :data="[]" :query="{}" :columns="tableColSupplier" />
    </div>
    <h4 class="subtitle">
      前10大销售客户(最近一年度)
      <el-button
        class="btn-position"
        icon="icon iconfont icon-plus"
        size="small"
        @click="newSalesCustomers"
      >新增</el-button>
    </h4>
    <div class="sales-customers">
      <TableWrapper ref="child" :data="[]" :query="{}" :columns="tableColSalesCustomers" />
    </div>
    <h4 class="subtitle">
      公司治理和内控制度
      <el-button
        class="btn-position"
        icon="icon iconfont icon-plus"
        size="small"
        @click="newCorporateGovernance"
      >新增</el-button>
    </h4>
    <div class="corporate-governance">
      <div class="p-txt-position">
        <p>组织框架图：</p>
        <p>主要内部管理制度简述：</p>
        <p>财务管理制度简述：</p>
        <p>知识产权保护制度简述：</p>
        <p>法律风险防范制度简述：</p>
      </div>
    </div>
    <el-divider></el-divider>
    <h4 class="subtitle">
      高级管理人员信息
      <el-button
        class="btn-position"
        icon="icon iconfont icon-plus"
        size="small"
        @click="newManagerMsg"
      >新增</el-button>
    </h4>
    <div class="manager-msg">
      <div v-for="(item, index) in managerData" :key="index">
        <el-row :gutter="16">
          <el-col :span="2">
            <div
              style="padding: 6px 0; font-weight: bold; text-align: right; color: #606266"
            >{{ item.name }}</div>
          </el-col>
          <el-col :span="22">
            <div style="padding: 6px 0; font-weight: bold; color: #606266">{{ item.position }}</div>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="2">
            <div style="padding: 6px 0; text-align: right; color: #606266">工作简历：</div>
          </el-col>
          <el-col :span="22">
            <div style="padding: 6px 0; color: #606266">{{ item.introduction }}</div>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-divider></el-divider>
    <h4 class="subtitle">员工构成信息</h4>
    <div class="employee-form">
      <el-row style="margin: 22px 0">
        <el-col :span="12">
          <div class="col" style="font-weight: bold">项目信息</div>
        </el-col>
        <el-col :span="12">
          <div class="col" style="text-align: right">
            <el-button
              icon="icon iconfont icon-plus"
              size="small"
              @click="newEmployeeInformation"
            >新增</el-button>
          </div>
        </el-col>
      </el-row>
      <div class="employee-information">
        <TableWrapper ref="child" :data="[]" :query="{}" :columns="tableColEmployeeInformation" />
      </div>
      <el-row style="margin: 22px 0">
        <el-col :span="12">
          <div class="col" style="font-weight: bold">岗位构成</div>
        </el-col>
        <el-col :span="12">
          <div class="col" style="text-align: right">
            <el-button icon="icon iconfont icon-plus" size="small" @click="newPostComposition">新增</el-button>
          </div>
        </el-col>
      </el-row>
      <div class="post-composition">
        <el-row>
          <el-col :span="6">
            <div style="color: #606266">管理人员(人)：</div>
          </el-col>
          <el-col :span="6">
            <div style="color: #606266">生产人员(人)：</div>
          </el-col>
          <el-col :span="6">
            <div style="color: #606266">技术人员(人)：</div>
          </el-col>
          <el-col :span="6">
            <div style="color: #606266">销售人员(人)：</div>
          </el-col>
        </el-row>
      </div>
      <el-divider></el-divider>
      <el-row style="margin: 22px 0">
        <el-col :span="12">
          <div class="col" style="font-weight: bold">学历构成</div>
        </el-col>
        <el-col :span="12">
          <div class="col" style="text-align: right">
            <el-button
              icon="icon iconfont icon-plus"
              size="small"
              @click="newEducationalComposition"
            >新增</el-button>
          </div>
        </el-col>
      </el-row>
      <div class="educational-composition">
        <el-row>
          <el-col :span="6">
            <div style="color: #606266">研究生及以上(人)：</div>
          </el-col>
          <el-col :span="6">
            <div style="color: #606266">本科(人)：</div>
          </el-col>
          <el-col :span="6">
            <div style="color: #606266">大专(人)：</div>
          </el-col>
          <el-col :span="6">
            <div style="color: #606266">大专以下(人)：</div>
          </el-col>
        </el-row>
      </div>
    </div>
    <NewOperatingEnvironment ref="ref_newOperatingEnvironment"></NewOperatingEnvironment>
    <NewProductionStatus ref="ref_newProductionStatus"></NewProductionStatus>
    <NewBuisnessPlace ref="ref_newBuisnessPlace"></NewBuisnessPlace>
    <NewBusinessOverview ref="ref_newBusinessOverview"></NewBusinessOverview>
    <NewIncomeStructure ref="ref_newIncomeStructure"></NewIncomeStructure>
    <NewSupplier ref="ref_newSupplier"></NewSupplier>
    <NewSalesCustomers ref="ref_newSalesCustomers"></NewSalesCustomers>
    <NewCorporateGovernance ref="ref_newCorporateGovernance"></NewCorporateGovernance>
    <NewManagerMsg ref="ref_newManagerMsg"></NewManagerMsg>
    <NewEmployeeInformation ref="ref_newEmployeeInformation"></NewEmployeeInformation>
    <NewPostComposition ref="ref_newPostComposition"></NewPostComposition>
    <NewEducationalComposition ref="ref_newEducationalComposition"></NewEducationalComposition>
  </div>
</template>

<script>
import NewOperatingEnvironment from "./NewOperatingEnvironment";
import NewProductionStatus from "./NewProductionStatus";
import NewBuisnessPlace from "./NewBuisnessPlace";
import NewBusinessOverview from "./NewBusinessOverview";
import NewIncomeStructure from "./NewIncomeStructure";
import NewSupplier from "./NewSupplier";
import NewSalesCustomers from "./NewSalesCustomers";
import NewCorporateGovernance from "./NewCorporateGovernance";
import NewManagerMsg from "./NewManagerMsg";
import NewEmployeeInformation from "./NewEmployeeInformation";
import NewPostComposition from "./NewPostComposition";
import NewEducationalComposition from "./NewEducationalComposition";
export default {
  name: "DueDiligence",
  components: {
    NewOperatingEnvironment,
    NewProductionStatus,
    NewBuisnessPlace,
    NewBusinessOverview,
    NewIncomeStructure,
    NewSupplier,
    NewSalesCustomers,
    NewCorporateGovernance,
    NewManagerMsg,
    NewEmployeeInformation,
    NewPostComposition,
    NewEducationalComposition
  },
  data() {
    return {
      productionStatusData: [
        {
          name: "企业占地面积(平方米)",
          total: "1000",
          own: "1000",
          mortgage: 0,
          rent: 0
        },
        {
          name: "办公用房面积(平方米)",
          total: "1000",
          own: "1000",
          mortgage: 0,
          rent: 0
        },
        {
          name: "房产原值或年租金(万元)",
          total: "1000",
          own: "1000",
          mortgage: 0,
          rent: 0
        }
      ],
      mainBusinessData: [
        {
          year: 2018,
          operatingIncome: 3200.0,
          grossProfit: 1600.0,
          margin: "50%",
          productions: [
            { name: "2412chanp" },
            { name: "484ngiechanp" },
            { name: "484ngiechanp" },
            { name: "484ngiechanp" },
            { name: "484ngiechanp" }
          ]
        },
        {
          year: 2019,
          operatingIncome: 3200.0,
          grossProfit: 1600.0,
          margin: "50%",
          productions: [{ name: "2412chanp" }, { name: "484ngiechanp" }]
        }
      ],
      tableColSupplier: [
        { key: "name", label: "序号" },
        { key: "name", label: "供应商名称" },
        { key: "name", label: "采购产品" },
        { key: "name", label: "采购金额(万元)" },
        { key: "name", label: "采购金额占比" },
        { key: "name", label: "采购周期" },
        { key: "name", label: "付款方式" },
        { key: "name", label: "合作年限" }
      ],
      tableColSalesCustomers: [
        { key: "name", label: "序号" },
        { key: "name", label: "客户名称" },
        { key: "name", label: "销售产品" },
        { key: "name", label: "销售金额(万元)" },
        { key: "name", label: "销售金额占比" },
        { key: "name", label: "回款周期" },
        { key: "name", label: "收款方式" },
        { key: "name", label: "合作年限" }
      ],
      managerData: [
        {
          name: "张子方",
          position: "总裁",
          introduction:
            "江苏未至科技股份有限公司联合创始人/副总裁，高级信用管理师（一级职业资格），全国多个省市信用智库成员，每年面向城市信用主管部门至少提供15场以上的培训课程。熟悉国内社会信用体系的推进模式及运营策略，精通信用信息共享平台建设、联合奖惩推进、信易+应用推广。在城市社会信用体系建设、信用信息共享平台、企业信用管理建设等方面，拥有丰富的实际操作经验。"
        },
        {
          name: "程亮",
          position: "联合创始人/副总裁",
          introduction:
            "江苏未至科技股份有限公司联合创始人/副总裁，高级信用管理师（一级职业资格），全国多个省市信用智库成员，每年面向城市信用主管部门至少提供15场以上的培训课程。熟悉国内社会信用体系的推进模式及运营策略，精通信用信息共享平台建设、联合奖惩推进、信易+应用推广。在城市社会信用体系建设、信用信息共享平台、企业信用管理建设等方面，拥有丰富的实际操作经验。"
        }
      ],
      tableColEmployeeInformation: [
        { key: "name", label: "起止时间" },
        { key: "name", label: "项目名称" },
        { key: "name", label: "项目人员总数(人)" },
        { key: "name", label: "薪酬总额(万元)" },
        { key: "name", label: "流动率%" }
      ]
    };
  },
  methods: {
    newOperatingEnvironment() {
      this.$nextTick(() => {
        this.$refs.ref_newOperatingEnvironment.open();
      });
    },
    newProductionStatus() {
      this.$nextTick(() => {
        this.$refs.ref_newProductionStatus.open();
      });
    },
    newBuisnessPlace() {
      this.$nextTick(() => {
        this.$refs.ref_newBuisnessPlace.open();
      });
    },
    newBusinessOverview() {
      this.$nextTick(() => {
        this.$refs.ref_newBusinessOverview.open();
      });
    },
    newIncomeStructure() {
      this.$nextTick(() => {
        this.$refs.ref_newIncomeStructure.open();
      });
    },
    newSupplier() {
      this.$nextTick(() => {
        this.$refs.ref_newSupplier.open();
      });
    },
    newSalesCustomers() {
      this.$nextTick(() => {
        this.$refs.ref_newSalesCustomers.open();
      });
    },
    newCorporateGovernance() {
      this.$nextTick(() => {
        this.$refs.ref_newCorporateGovernance.open();
      });
    },
    newManagerMsg() {
      this.$nextTick(() => {
        this.$refs.ref_newManagerMsg.open();
      });
    },
    newEmployeeInformation() {
      this.$nextTick(() => {
        this.$refs.ref_newEmployeeInformation.open();
      });
    },
    newPostComposition() {
      this.$nextTick(() => {
        this.$refs.ref_newPostComposition.open();
      });
    },
    newEducationalComposition() {
      this.$nextTick(() => {
        this.$refs.ref_newEducationalComposition.open();
      });
    }
  }
};
</script>

<style scoped lang="scss">
.subtitle {
  font-size: 16px;
  margin: 20px 0 18px -20px;
  padding: 9px 0 9px 13px;
  border-left: 5px solid #4b9df3;
  position: relative;
}

.btn-position {
  position: absolute;
  right: 0;
  top: 0;
}

.p-txt-position {
  p {
    line-height: 32px;
    color: #606266;
    padding: 0 16px;
  }
}

.production-status,
.main-business,
.employee-form {
  .col {
    height: 44px;
    line-height: 44px;
    padding: 0 16px;
    background-color: rgba(242, 242, 242, 1);
  }

  .td {
    height: 44px;
    line-height: 44px;
    padding: 0 16px;
  }
}

.main-business-table-col {
  border: 1px solid #ddd;
  height: 120px;
  position: relative;

  .bottom-title {
    position: absolute;
    text-align: center;
    color: #606266;
    bottom: 0;
    line-height: 32px;
    width: 100%;
  }
}
</style>
