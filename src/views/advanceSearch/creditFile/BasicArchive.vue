<template>
  <el-row class="credit-tab-content">
    <h3 class="font20 fontwb">基本档案</h3>
    <h4>基本信息</h4>
    <el-row v-loading="comLoading">
      <table border="0" cellpadding="0" cellspacing="0" class="fxb-info-table">
        <tr>
          <th>企业名称</th>
          <td colspan="3">{{ companyInfo.name }}</td>
        </tr>
        <tr>
          <th>统一信用代码/注册号</th>
          <td colspan="3">{{ companyInfo.creditCode }}</td>
        </tr>
        <tr>
          <th>成立日期</th>
          <td>{{ companyInfo.startDate | dateFormat('yyyy-MM-dd') }}</td>
          <th>最新登记日期</th>
          <td>{{ companyInfo.checkDate | dateFormat('yyyy-MM-dd') }}</td>
        </tr>
        <tr>
          <th>注册资本</th>
          <td>{{ companyInfo.registCapi !== null ? companyInfo.registCapi : '-' }}</td>
          <th>法定代表人</th>
          <td>{{ companyInfo.operName !== null ? companyInfo.operName : '-' }}</td>
        </tr>
        <tr>
          <th>企业类型</th>
          <td colspan="3">{{ companyInfo.econKind !== null ? companyInfo.econKind : '-' }}</td>
          <!--                    <th>是否为纳税信用A级</th>-->
          <!--                    <td>下载报告可见</td>-->
        </tr>
        <tr>
          <th>登记状态</th>
          <td>{{ companyInfo.status !== null ? companyInfo.status : '-' }}</td>
          <th>登记机关</th>
          <td>{{ companyInfo.belongOrg !== null ? companyInfo.belongOrg : '-' }}</td>
        </tr>
        <tr>
          <th>注册地址</th>
          <td colspan="3">{{ companyInfo.address !== null ? companyInfo.address : '-' }}</td>
        </tr>
        <tr>
          <th>经营范围</th>
          <td colspan="3">{{ companyInfo.scope !== null ? companyInfo.scope : '-' }}</td>
        </tr>
        <!--                <tr>-->
        <!--                    <th>企业网站</th>-->
        <!--                    <td colspan="3">-->
        <!--                        <a :href="'http://' + companyInfo.website" target="_blank">{{ companyInfo.website }}</a>-->
        <!--                    </td>-->
        <!--                </tr>-->
      </table>
    </el-row>

    <h4>股东及出资方</h4>
    <el-row v-loading="companyPartnersLoading">
      <el-table :data="companyPartnersData.result" border class="fxb-el-table" style="width: 100%">
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            <span>{{ scope.$index+(companyPartnersData.pageNo - 1) * companyPartnersData.pageSize + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="股东名称">
          <template slot-scope="scope">
            <span>{{ scope.row.stockName !== null ? scope.row.stockName : '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="出资额（万元）" prop="shouldCapi"></el-table-column>
        <el-table-column prop="realCapi" label="实缴额（万元）" :formatter="stringFormat"></el-table-column>
        <el-table-column prop="capiDate" label="实缴出资日期" :formatter="stringFormat"></el-table-column>
        <el-table-column label="比例" prop="stockPercent" width="70" :formatter="stringFormat"></el-table-column>
        <el-table-column label="出资形式" prop="investName" :formatter="stringFormat"></el-table-column>
        <el-table-column label="证照号（企业代码/身份证）" prop="identifyNo" width="220" :formatter="stringFormat"></el-table-column>
      </el-table>
      <el-pagination
        class="fxb-page"
        v-show="companyPartnersData.totalRecords > 0"
        :total="companyPartnersData.totalRecords"
        :page-size="companyPartnersData.pageSize"
        :current-page.sync="companyPartnersData.pageNo"
        @current-change="((val)=>{ companyPartnersLoading=true;pageChange(val, 1) })"
      />
    </el-row>

    <h4>对外投资</h4>
    <el-row v-loading="investInfoLoading">
      <el-table :data="investInfoData.result" border class="fxb-el-table" style="width: 100%">
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            <span>{{ scope.$index+(investInfoData.pageNo - 1) * investInfoData.pageSize + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="被投资企业名称" prop="name" :formatter="stringFormat"></el-table-column>
        <el-table-column label="注册资本（万元）" prop="registCapi" :formatter="stringFormat"></el-table-column>
        <el-table-column label="出资比例" prop="stockpercent" width="120" :formatter="stringFormat"></el-table-column>
        <el-table-column label="统一社会信用代码（注册号）" prop="no" :formatter="stringFormat"></el-table-column>
      </el-table>
      <el-pagination
        class="fxb-page"
        v-show="investInfoData.totalRecords > 0"
        :total="investInfoData.totalRecords"
        :page-size="investInfoData.pageSize"
        :current-page.sync="investInfoData.pageNo"
        @current-change="((val)=>{ investInfoLoading=true;pageChange(val, 2) })"
      />
    </el-row>

    <h4>分支机构</h4>
    <el-row v-loading="branchLoading">
      <el-table :data="branchData.result" border class="fxb-el-table" style="width: 100%">
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            <span>{{ scope.$index+(branchData.pageNo - 1) * branchData.pageSize + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="分支机构名称" prop="name"></el-table-column>
        <el-table-column label="负责人" prop="opername" :formatter="stringFormat"></el-table-column>
        <el-table-column label="统一社会信用代码（注册号）" prop="regNo" :formatter="stringFormat"></el-table-column>
        <el-table-column label="注册机关" prop="belongOrg" :formatter="stringFormat"></el-table-column>
      </el-table>
      <el-pagination
        class="fxb-page"
        v-show="branchData.totalRecords > 0"
        :total="branchData.totalRecords"
        :page-size="branchData.pageSize"
        :current-page.sync="branchData.pageNo"
        @current-change="((val)=>{ branchLoading=true;pageChange(val, 3) })"
      />
    </el-row>

    <!--        <h4>董监高任职信息</h4>-->
    <!--        <p class="font12">（仅在下载报告中显示）</p>-->

    <h4>工商变更记录</h4>
    <el-row v-loading="changeLoading">
      <el-table :data="changeData.result" border class="fxb-el-table" style="width: 100%">
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            <span>{{ scope.$index+(changeData.pageNo - 1) * changeData.pageSize + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="变更事项" prop="projectName" width="200"></el-table-column>
        <el-table-column label="变更前内容" prop="beforeContent">
          <template slot-scope="scope">
            <span v-html="scope.row.beforeContent"></span>
          </template>
        </el-table-column>
        <el-table-column label="变更后内容" prop="afterContent">
          <template slot-scope="scope">
            <span v-html="scope.row.afterContent"></span>
          </template>
        </el-table-column>
        <el-table-column label="变更日期" width="120">
          <template slot-scope="scope">{{ scope.row.changeDate | dateFormat('yyyy-MM-dd') }}</template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="fxb-page"
        v-show="changeData.totalRecords > 0"
        :total="changeData.totalRecords"
        :page-size="changeData.pageSize"
        :current-page.sync="changeData.pageNo"
        @current-change="((val)=>{ changeLoading=true;pageChange(val, 4) })"
      />
    </el-row>

    <h4>经营范围记录</h4>
    <el-row v-loading="scopeChangeLoading">
      <el-table :data="scopeChangeData.result" border class="fxb-el-table" style="width: 100%">
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            <span>{{ scope.$index+(scopeChangeData.pageNo - 1) * scopeChangeData.pageSize + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="变更前内容">
             <template slot-scope="scope">
               <div v-html="scope.row.beforeContent">
              </div>
            </template>
        </el-table-column>
        <el-table-column label="变更后内容" prop="afterContent">
             <template slot-scope="scope">
               <div v-html="scope.row.afterContent">
              </div>
            </template>          
        </el-table-column>
        <el-table-column label="变更日期" width="120">
          <template slot-scope="scope">{{ scope.row.changeDate | dateFormat('yyyy-MM-dd') }}</template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="fxb-page"
        v-show="changeData.totalRecords > 0"
        :total="changeData.totalRecords"
        :page-size="changeData.pageSize"
        :current-page.sync="changeData.pageNo"
        @current-change="((val)=>{ scopeChangeLoading=true;pageChange(val, 5) })"
      />
    </el-row>
  </el-row>
</template>

<script>
import { Api_getBasicInfo, Api_getCteditCompanyInfo } from "@/api/advanceSearch";
import { dateFormat } from "@/utils/index";
import { trim } from "lodash";
const diffJs = require('diff');
export default {
  name: "BasicInfo",
  filters: {
    dateFormat,
  },
  data() {
    return {
      comLoading: false,
      companyInfo: {},
      diffJs,
      searchData: {
        companyId: "",
        companyName: "",
      },
      // 股东及出资方
      companyPartnersData: {
        pageNo: 1,
        pageSize: 10,
        totalRecords: 0,
        result: [],
      },
      companyPartnersLoading: false,
      // 对外投资
      investInfoData: {
        pageNo: 1,
        pageSize: 10,
        totalRecords: 0,
        result: [],
      },
      investInfoLoading: false,
      // 分支机构
      branchData: {
        pageNo: 1,
        pageSize: 10,
        totalRecords: 0,
        result: [],
      },
      branchLoading: false,
      // 工商变更记录
      changeData: {
        pageNo: 1,
        pageSize: 10,
        totalRecords: 0,
        result: [],
      },
      changeLoading: false,
      // 经营范围记录
      scopeChangeData: {
        pageNo: 1,
        pageSize: 10,
        totalRecords: 0,
        result: [],
      },
      scopeChangeLoading: false,
    };
  },
  mounted() {
    this.searchData.companyId = this.$route.query.id;

    // 基本信息
    this.loadCompany();
    // 股东出资方
    this.loadTableData(1, {
      pageNo: 1,
    });
    // 对外投资
    this.loadTableData(2, {
      pageNo: 1,
    });
    // 分支机构
    this.loadTableData(3, {
      pageNo: 1,
    });
    // 工商变更记录
    this.loadTableData(4, {
      pageNo: 1,
    });
    // 经营范围记录
    this.loadTableData(5, {
      pageNo: 1,
    });
  },
  methods: {
    loadCompany() {
      this.comLoading = true;
      // 企业信息
      Api_getCteditCompanyInfo(this.searchData)
        .then((res) => {
          this.comLoading = false;
          this.companyInfo = res.result[0];
        })
        .catch(() => {
          this.comLoading = false;
        });
    },
    loadTableData(type, option) {
      Api_getBasicInfo(
        type,
        Object.assign(
          this.searchData,
          {
            pageNo: 1,
            pageSize: 10,
          },
          option
        )
      )
        .then((res) => {
          if (res) {
            switch (type) {
              case 1: // 股东出资方
                this.companyPartnersData = res;
                this.companyPartnersLoading = false;
                break;
              case 2: // 对外投资
                this.investInfoData = res;
                this.investInfoLoading = false;
                break;
              case 3: // 分支机构
                this.branchData = res;
                this.branchLoading = false;
                break;
              case 4: // 工商变更记录
                this.changeData = res;

                // 将新增和退出标红
                for (const result of this.changeData.result) {
                  const  diffArr = diffJs.diffChars(result["beforeContent"],result["afterContent"]);
                        let addStr="";// 这是用来装变更后的内容
                        let removeStr="";//这是用来装变更前的内容
                        diffArr.map((item, index) => {
                          if(!item.added&&!item.removed){
                            removeStr+=item.value;
                            addStr+=item.value;
                          }else if(item.removed){
                            removeStr+="<span class='removed' style='color:red'>"+item.value+"</span>";
                          }else if(item.added){
                            addStr+="<span class='added' style='color:red'>"+item.value+"</span>";
                          }
                        })
                        result["beforeContent"]=removeStr;
                        result["afterContent"]=addStr;                
                }

                this.changeLoading = false;
                break;
              case 5: // 经营范围记录
                
                this.scopeChangeData = res;

                for (const result of this.scopeChangeData.result) {
        
                    var  diffArr = diffJs.diffChars(result["beforeContent"],result["afterContent"]);
                    var addStr="";// 这是用来装变更后的内容
                    var removeStr="";//这是用来装变更前的内容
                    diffArr.map((item, index) => {
                      if(!item.added&&!item.removed){
                        removeStr+=item.value;
                        addStr+=item.value;
                      }else if(item.removed){
                        removeStr+="<span class='removed' style='color:red'>"+item.value+"</span>";
                      }else if(item.added){
                        addStr+="<span class='added' style='color:red'>"+item.value+"</span>";
                      }
                    })
                    result["beforeContent"]=removeStr;
                    result["afterContent"]=addStr;
                }

                this.scopeChangeLoading = false;
                break;
            }
          }
        })
        .catch(() => {
          switch (type) {
            case 1: // 股东出资方
              this.companyPartnersLoading = false;
              break;
            case 2: // 对外投资
              this.investInfoLoading = false;
              break;
            case 3: // 分支机构
              this.branchLoading = false;
              break;
            case 4: // 工商变更记录
              this.changeLoading = false;
              break;
            case 5: // 经营范围记录
              this.scopeChangeLoading = false;
              break;
          }
        });
    },
    stringFormat: function (row, column, cellValue) {
      var value = trim(cellValue);
      if (value == null || value === "null" || value === "") {
        return "-";
      } else {
        return cellValue;
      }
    },
    pageChange(val, type) {
      this.loadTableData(type, {
        pageNo: val,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.fxb-info-table {
  width: 100%;
  border-left: 1px solid #e4e4e4;
  border-right: 1px solid #e4e4e4;
  border-top: 1px solid #e4e4e4;

  th,
  td {
    line-height: 20px;
    padding: 15px;
    border-bottom: 1px solid #e4e4e4;
  }

  th {
    text-align: center;
    width: 180px;
    background: #f7f8fc;
    color: #333;
    white-space: nowrap;
    font-weight: normal;
  }

  td {
    color: #888;
    font-size: 13px;
  }
}
</style>
