<template>
  <div id="companyCenterMain">
    <div v-if="!isShowNewReport&&!showReportDetail" style="padding-right: 20px">
      <div class="page-header">
        <el-row class="user-center-top clearfix" style="width:100%">
            <div style="float:left">
                <ul class="center-tab">
                    <router-link
                        tag="li"
                        :to="'companyCenterMain'"
                        :class="{'active': $route.path.indexOf('companyCenterMain')>=0 }"
                    >我的企业</router-link>
                </ul>
            </div>
            <div style="float:right">
                <span style="margin-right: 10px; vertical-align: middle">
                  <i
                    class="el-icon-refresh"
                    style="color: #409EFF; margin-right: 4px; cursor: pointer"
                    @click="update"
                  ></i>
                  <span
                    style="font-size: 13px; color: #606266"
                    v-if="companyId"
                  >更新：{{newformData.updateddate?$dateFormat(newformData.updateddate):'-'}}</span>
              </span>
            </div>
        </el-row>

      </div>
      <div class="page-content" style="position: relative">
        <el-form ref="form" class="base-form" label-width="90px" label-position="left">
          <div style="display: flex; height: 90px">
            <div style="flex: 0 90px; height: 100%; padding: 15px; background-color: #F6F9FA">
              <div class="box-img"></div>
            </div>
            <div style="flex: 1; height: 100%; padding: 0 20px; position: relative">
              <h4 style="font-size: 22px; margin-bottom: 16px">
                {{formData.companyName||userInfo.saasName}}
                <el-tag
                  size="mini"
                  type="success"
                  v-if="userInfo.certStatus =='2'"
                  style="vertical-align: middle; margin-right: 6px"
                >认证成功</el-tag>
                  <div style="display: inline-block;vertical-align: top;" @click="conpanyReg">
                    <el-button type="warning"  style="vertical-align: top" size="mini" v-if="userInfo.certStatus!='2'">企业认证</el-button>
                  </div>
              </h4>

              <div style="color: #606266">
                <i class="el-icon-office-building" style="margin-right: 4px"></i>
                统一社会信用代码：{{newformData.creditCode == null ? "-" : (newformData.creditCode === 'NULL' ? "-" : newformData.creditCode)}}
              </div>
              <div style="position: absolute; bottom: 3px; left: 20px">
                <span
                  style="padding: 3px 6px; margin-right: 6px; background-color: #53B7B3; color: #fff; border-radius: 2px; font-size:12px"
                >
                  <i class="el-icon-bell"></i>
                  {{newformData.status}}
                </span>
                <span
                  v-for="(el, index) in companyTags"
                  :key="index"
                  style="padding: 3px 6px; margin-right: 6px; color: #fff; border-radius: 2px; font-size:12px"
                  :style="{'background-color': el.color==='primary'?'#409EFF':el.color==='success'?'#53B7B3':'#F56C6C'}"
                >{{el.label}}</span>
                <!-- <el-tag
                  v-for="(el, index) in companyTags"
                  :key="index"
                  :type="el.color"
                  size="small"
                >{{ el.label }}</el-tag>-->
              </div>
            </div>
            <div style="flex: 0 400px; text-align: right; align-self: flex-end">
              <el-button size="small"  icon="el-icon-warning" type="danger" @click="riskExp">
                风险体检
              </el-button>

              <el-button size="mini" style="display:none" @click="!formData.isSupervise?addSupervise():null">
                <svg-icon icon-class="jiance" style="margin: 0; vertical-align: sub" />
                {{!formData.isSupervise?'添加监测':'监测中...'}}
              </el-button>
              <el-button
                icon="el-icon-download"
                type="primary"
                size="small"
                @click="openDownloadReportDialog('基础信息报告')"
              >下载报告</el-button>
            </div>
          </div>
          <div style="display: flex; margin-top: 15px; margin-bottom: 20px">
            <div
              style="flex: 0 90px; text-align: center; align-self: flex-end; padding-bottom: 2px;"
            >
              <span style>
                <img src="../../../assets/images/jinggao.png" alt style="vertical-align: top" />
                风险信息
              </span>
            </div>
            <div style="flex: 1; padding: 0 20px">
              <span style="margin-right: 30px">
                自身风险：
                <span
                  style="color: #F56C6C; margin-right: 6px; font-size: 24px"
                >{{ownRiskCount}}</span>项
              </span>
              <span style="margin-right: 30px">
                关联方风险：
                <span
                  style="color: #F56C6C; margin-right: 6px; font-size: 24px"
                >{{relationRiskCount}}</span>项
              </span>
            </div>
          </div>

          <!-- <EnterpriseFile :enterpriseID="id" @show="onDetailShow"></EnterpriseFile> -->
        </el-form>
        <div ref="menuWrap" class="fixed menu-wrap" style="top: 0">
          <div
            :class="{hover:isHover}"
            class="list-wrap"
            @mouseover="onMouseOver"
            @mouseout="onMouseOut"
          >
            <div class="list-head">
              <div
                v-for="(el,index) in chooseListHead"
                :key="index"
                :style="{width: getItemWidth(index)}"
                :class="{selected: el.compKey === compKey,hover: index === hoverIndex}"
                class="item-head"
                @mouseover="onHeadMouseOver(index)"
              >{{ el.text + filterCount(el.cname) }}</div>
            </div>
            <div class="list-body">
              <div
                v-for="(el,index) in chooseList"
                :key="index"
                :style="{width: getItemWidth(index), left: getItemLeft(index)}"
                :class="{selected: index === selectIndex,hover: index === hoverIndex}"
                class="list-item"
                @mouseover="onHeadMouseOver(index)"
              >
                <div
                  v-for="(item,itemIndex) in el"
                  :key="itemIndex"
                  :class="{selected: index === selectIndex &&itemIndex === subSelectIndex}"
                  class="item-block"
                  @click="renderComp(index, itemIndex)"
                >{{ item.text + filterCount(item.cname) }}</div>
              </div>
            </div>
          </div>
          <div class="menu-selected-sub">
            <el-button
              size="small"
              v-for="(el,index) in menuSelected"
              :key="index"
              :class="{selected: index === subSelectIndex}"
              @click="renderComp(selectIndex, index)"
            >{{ el.text + filterCount(el.cname) }}</el-button>
          </div>
        </div>
        <!-- <div v-if="fixedMenu" :style="{height: menuHeight+'px'}"></div> -->
        <component 
          v-if="companyId"
          ref="dayComp"
          :is="compKey"
          :id="companyId"
          :isFxb="isFxb"
          :companyName="formData.companyName"
          @newReport="newReport"
          @editReport="editReport"
          @viewReport="viewReport"
          @updateCount="updateCount"
        ></component>
      </div>
    </div>
    
    <NewReport ref="ref_NewReport" @hideReport="hideReport" v-if="isShowNewReport" ></NewReport>
    <ReportDetail
      ref="ref_ReportDetail"
      @hideReportDetail="hideReportDetail"
      v-if="showReportDetail"
    ></ReportDetail>
   
    <DownloadReport
      ref="downloadReportDialog"
      @submitDownloadType="downloadReportConfirm"
      :companyName="formData.companyName?formData.companyName:userInfo.saasName"
    />
    <!-- v-show="noexperience" -->
    <RiskModel  :risk="true" ref="riskCenter" @hide="hideRiskModel" @renderScroll="renderScroll"></RiskModel>
  </div>
</template>

<script>
import BaseInfo from "./components/BaseInfo/index";
import RiskModel from "@/components/Riskexamination"
import JudicialInfo from "./components/JudicialInfo/index";
import KnowledgePro from "./components/KnowledgePro/index";
import OperatingRisk from "./components/OperatingRisk/index";
import DueDiligence from "./components/DueDiligence/index";
import FinancialAnalysis from "./components/FinancialAnalysis";
import CreditHistory from "./components/CreditHistory";
import TransactionPerformance from "./components/TransactionPerformance";
import OtherInformation from "./components/OtherInformation";

//  生产情况
import   ProductionSituation from "./components/ProductionSituation"
// 业务经营
import  BusinessOperation  from  "./components/BusinessOperation"
// 运营管理
import  OperationManagement from './components/OperationManagement'
import {Api_CustomerArchivesGetCompanyInfo} from "@/api/creditManagement/customerProfile/customerManagemCustomer/baseInfo";
import {
  Api_CustomerArchivesBaseInfo,
  Api_CustomerArchivesUpDate
} from "@/api/creditManagement/customerProfile/customerManagemCustomer/baseInfo";
import NewReport from "./components/financeComponents/NewReport";
import ReportDetail from "./components/financeComponents/ReportDetail";
import EnterpriseFile from "@/components/EnterpriseFile/index.vue";
import { getOffset } from "@/utils/index";
import {
  Api_GetCompanyTag,
  Api_GetCompanyRiskCount,
  Api_GetDataCount
} from "@/api/creditMonitor";
import DownloadReport from "./creditFile/DownloadReport.vue";
import { Api_AddMonitorInfo } from "@/api/creditManagement/monitoring/monitoring";
import { getUserInfo } from "@/utils/auth";
import { mapGetters,mapState } from 'vuex';
import {Api_AddAttention,Api_GetAttentionInfo,Api_AttentionCancel,Api_certJudgment} from "@/api/userCenter/creditManage";
import { Api_CheckCompany } from "@/api/creditManagement/customerProfile/customerManagement.js";
export default {
  name: "CustomerProfiles",
  inject: ["routerWrap"],
  filters: {
    filterStatus(value) {
      if (!value) {
        return "";
      }
      return value === "0" ? "正常" : "冻结";
    }
  },
  components: {
    EnterpriseFile,
    RiskModel,
    BaseInfo,
    JudicialInfo,
    KnowledgePro,
    OperatingRisk,
    DueDiligence,
    FinancialAnalysis,
    CreditHistory,
    TransactionPerformance,
    OtherInformation,
    NewReport,
    ReportDetail,
    DownloadReport,
    // 生产经营情况
    ProductionSituation,
    // 业务经营
    BusinessOperation,
    // 运营管理
    OperationManagement
  },
  props: {
    id: String // 客户id，用于查询详情数据
  },
  data() {
    return {
      isFxb:true,
      noexperience: false,
      fixedMenu: false, // 是否固定菜单
      menuTop: 0, // 菜单top
      menuHeight: 0, // 菜单区域高度
      appContainerTop: 0, // 容器top
      appContainerWidth: 0, // 容器宽
      appContainerLeft: 0, // 容器left
      compKey: "BaseInfo", // tab项av
      formData: {},
      // 增加一个变量用来放更新时间, 统一社会信用代码,以及状态
      newformData:{},
      companyBaseData: {}, // 信用等级及授信情况
      contractPaymentCurrent: {}, // 当前合同付款履约情况
      contractPaymentHistory: {}, // 历史合同付款履约情况
      chooseListHead: [
        { text: "基础档案", compKey: "BaseInfo", cname: "jbxxCnt" },
        { text: "经营风险", compKey: "OperatingRisk", cname: "jyfxCnt" },
        { text: "司法风险", compKey: "JudicialInfo", cname: "sffxCnt" },
        { text: "知识产权", compKey: "KnowledgePro", cname: "zscqCnt" },
        // { text: "尽职调查", compKey: "DueDiligence", cname: "jzdcCnt" },


        { text: "生产情况", compKey: "ProductionSituation", cname: "scjycsCnt" },
        { text: "业务经营", compKey: "BusinessOperation", cname: "" },
        { text: "运营管理", compKey: "OperationManagement", cname: "" },



        { text: "财务分析", compKey: "FinancialAnalysis" },
        { text: "联络信息", compKey: "OtherInformation", cname: "callCnt" }
      ],
      chooseList: [
        [
          { text: "基础信息", type: 1 },
          { text: "股东及出资方", type: 2, cname: "partnerCnt" },
          { text: "对外投资", type: 3, cname: "investCnt" },
          { text: "分支机构", type: 4, cname: "branchCnt" },
          { text: "工商变更记录", type: 5, cname: "changeCnt" }
        ],
        [
          { text: "动产抵押", type: 1, cname: "mpledgeCnt" },
          { text: "股权出质信息", type: 2, cname: "pledgeCnt" },
          { text: "经营异常名录", type: 3, cname: "opexceptionCnt" },
          { text: "行政处罚", type: 4, cname: "penaltyCnt" },
          { text: "清算信息", type: 5, cname: "liquidationCnt" }
        ],
        [
          { text: "被执行人", type: 1, cname: "zhiXingCnt" },
          { text: "失信被执行人", type: 2, cname: "shiXinCnt" },
          { text: "裁判文书", type: 3, cname: "caseCnt" },
          { text: "法院公告", type: 4, cname: "chinacourtCnt" }
        ],
        [
          { text: "专利信息", type: 1, cname: "patentCnt" },
          { text: "软件著作权", type: 2, cname: "softwareCopyrightsCnt" },
          { text: "作品著作权", type: 3, cname: "copyrightCnt" },
          { text: "网站信息", type: 4, cname: "websiteCnt" },
          { text: "证书信息", type: 5, cname: "certificationCnt" },
          { text: "商标信息", type: 6, cname: "tmCnt" }
        ],
        [
          { text: "经营环境", type: 1},
          { text: "生产/经营场所", type: 2,cname: "scjycsCnt" },
          { text: "经营场所视察情况", type: 3 },
        ],
        [
          { text: "业务概况", type: 1, cname: "" },
          { text: "收入构成", type: 2 },
          { text: "前10大供应商", type: 3 },
          { text: "前10大客户", type: 4 },
        ],
        [
          { text: "公司治理和内控制度", type: 1, cname: "" },
          { text: "高层管理人员", type: 2, cname:'gcglryCnt'},
          { text: "员工构成信息", type: 3 },
        ],
        [
          { text: "财务报表管理", type: 1 },
          { text: "财务报表简析", type: 2 },
          { text: "财务数据分析", type: 3 },
          { text: "破产风险预测", type: 4 }
        ],
        // [
        //   { text: "信用评估记录", type: 1, cname: "creditScoreCnt" },
        //   { text: "历史授信记录", type: 2, cname: "hisCreditCnt" },
        //   { text: "临时授信记录", type: 3, cname: "nowCreditCnt" }
        // ],
        // [
        //   { text: "合同签约情况", type: 1, cname: "contractAwardCnt" },
        //   { text: "付款计划跟踪", type: 2, cname: "followPayCnt" },
        //   { text: "付款历史", type: 3, cname: "hisPayCnt" }
        // ],
        [
          { text: "联络信息", type: 1, cname: "llxxCnt" },
          { text: "银行账户", type: 2, cname: "bankIdcardCnt" },
          { text: "发票抬头", type: 3, cname: "invoiceCnt" },
          { text: "收货地址", type: 4, cname: "addressCnt" }
        ]
      ],
      // 新增财务报表
      isShowNewReport: false,
      isHover: false,
      selectIndex: 0, // 一级菜单选中的index
      subSelectIndex: 0, // 子级菜单选中的index
      hoverIndex: 0,
      showReportDetail: false,
      menuSelected: [
        { text: "基础信息", type: 1 },
        { text: "股东及出资方", type: 2, cname: "partnerCnt" },
        { text: "对外投资", type: 3, cname: "investCnt" },
        { text: "分支机构", type: 4, cname: "branchCnt" },
        { text: "工商变更记录", type: 5, cname: "changeCnt" }
      ], // 当前选中菜单的子分类菜单
      companyTags: [],
      ownRiskCount: null,
      relationRiskCount: null,
      dataCount: {}
    };
  },
  beforeRouteLeave(to, from, next) {
    if (this.scrollWrap){
       this.scrollWrap.removeEventListener("scroll", this.onscroll);
    }
    next();
  },
  created() {
  },
  watch:{
    companyId: {
        handler(newVal) {
            if(newVal){
              this.getDetail();
              Api_GetDataCount({
                  companyId: newVal
                }).then(res => {
                  this.dataCount = res.result[0];
                });
              //  若是有companyId了那么就获取更新时间跟统一社会信用代码
              Api_CustomerArchivesGetCompanyInfo(newVal)
              .then(res => {
                this.newformData=res;
                if(res.companyName){
                  this.isFxbByName(res.companyName);
                }else {
                  this.isFxbByName(this.sassName);
                }
              })
              .catch((err) => {
                console.log(err)
              });
              this.$nextTick(() => {
                const appContainer = document.querySelector(".el-scrollbar__wrap");
                const routerView = document.querySelector(".user-center");
                const appPadding = parseInt(
                  this.$getStyle(routerView, "padding").split(" ")[1]
                );
                this.menuHeight = this.$refs.menuWrap.getBoundingClientRect().height;
                this.appContainerTop = this.$getOffset(appContainer).top;
                this.appContainerLeft = this.$getOffset(appContainer).left + appPadding;
                this.appContainerWidth =
                appContainer.getBoundingClientRect().width - appPadding * 2;
                // this.scrollWrap = document.querySelector( ".scroll-wrap-userCenter .el-scrollbar__wrap");
                this.scrollWrap=document.getElementById("user-content").parentNode.parentNode;
                this.scrollWrap.addEventListener("scroll", this.onscroll, false);
              });
            }
        },
        immediate: true
    }
  },
  computed: {
    companyId(){
      return this.$store.getters.userInfo.companyId
    },
    userInfo(){
      return this.$store.getters.userInfo
    },
    sassName(){
       return this.$store.getters.userInfo.saasName;
    },
    menuFixedStyle() {
      return {
        top: this.fixedMenu ? 0 : null,
        width: this.fixedMenu ? this.appContainerWidth + "px" : null,
        left: this.fixedMenu ? this.appContainerLeft + "px" : null
      };
    }
  },
  mounted() {

 
                 
    // this.$nextTick(()=>{
    //   if (this.$route.query.index){
    //     this.renderComp(this.$route.query.index,this.$route.query.itemindex)
    //   }
    // }) 
  },
  beforeDestory() {
    this.scrollWrap.removeEventListener("scroll", this.onscroll);
  },
  methods: {
    updateCount(){
      
        Api_GetDataCount({
          companyId: this.companyId
        }).then(res => {
          console.log(res)
          this.dataCount = res.result[0];
        }).catch(err=>{
           console.log(err)
        });
    },
    renderScroll(index,itemIndex,id){
      this.renderComp(index,itemIndex)
    },
    isFxbByName(companyName){
      Api_CheckCompany({ companyName})
      .then((res) => {
          this.isFxb = res.isFxb;
      });
    },
    conpanyReg(){
      if (!this.$store.state.user.userInfo.registerFlag) {
        this.$alert("平台暂时不支持企业团队成员申请认证企业。", "提示", {
          type: "warning"
        });
        return false;
      }
      Api_certJudgment(this.companyId)
        .then(res => {
          if (res) {
              this.$router.push({
                  path:'/enterpriseCertification',
                  query: {
                    name: this.formData.companyName || this.userInfo.saasName
                  }
              })
          }
        })
        .catch(res => {
          this.$message.error(res);
        });

    },
    hideRiskModel(value){
      this.noexperience = value
    },
    riskExp(){
      this.noexperience = true
      let conpanyName  = this.$store.getters.userInfo.saasName ? this.$store.getters.userInfo.saasName: this.formData.companyName
      this.$refs.riskCenter.goExperience(conpanyName)
    },
    filterCount(name) {
      if (!name || Object.keys(this.dataCount).length === 0) return "";
      return "(" + this.dataCount[name] + ")";
    },
    onDetailShow() {
      return this.$getOffset(this.$refs.menuWrap).top - this.appContainerTop;
    },
    getDetail(cb) {
      
      Api_CustomerArchivesBaseInfo(this.companyId)
        .then(res => {
          // this.formData.companyName = res.companyName;
          // this.formData.creditState = res.creditState;
          // this.formData.customerNo = res.customerNo;
          // this.formData.beginDate = res.beginDate;
         
          if(res){
            this.formData = res;
          }
          
        this.isFxbByName(this.sassName);
        this.$nextTick(()=>{
          if (this.$route.query.index){
            this.renderComp(this.$route.query.index,this.$route.query.itemindex)
          }
        })
          cb && cb();
        })
        .catch(e => {
          console.log(e);
        });
      Api_GetCompanyRiskCount(this.companyId).then(res => {
        this.ownRiskCount = res.ownRiskCount;
        this.relationRiskCount = res.relationRiskCount;
      });
      this.getCompanyTags();
    },
    // 更新档案
    update() {
      const loading = this.$openLoading();

      Api_CustomerArchivesUpDate(this.companyId)
        .then(res => {
          this.$message.success(res);

          Api_CustomerArchivesGetCompanyInfo(this.companyId)
            .then(res => {
              
              this.newformData=res;
            })
            .catch((err) => {
              console.log(err)
          });
          this.getDetail(() => {
            this.compKey === "BaseInfo"
              ? this.$refs.dayComp.getDetail()
              : (this.compKey = "BaseInfo");
    
            loading.close();
          });
        })
        .catch(res => {
          loading.close();
          this.$message.error(res);
        });
    },
    // 生成item的宽度
    getItemWidth(index) {
      if (index === 8) {
        return "12%";
      }
      return (100 / this.chooseList.length) + "%";
    },
    // 生成item的left
    getItemLeft(index) {
      const n = parseInt(100 / this.chooseList.length);
      return n * index + "%";
    },
    // 渲染对应的组件
    renderComp(index, itemIndex) {

      this.selectIndex = index;
      this.subSelectIndex = itemIndex;
      this.compKey = this.chooseListHead[index].compKey;
      this.menuSelected = this.chooseList[index];
      this.fixedMenu = true;
      this.onMouseOut();
      this.$nextTick(() => {
        const comp = this.$refs.dayComp;
        const routerViewContainer = this.scrollWrap;
        const h4Titles = comp.$el.querySelectorAll("h4");
        const { top: routerViewTop } = getOffset(routerViewContainer);
        const { top: titleTop } = getOffset(h4Titles[itemIndex]);
        const chaWidth = this.fixedMenu
          ? this.$refs.menuWrap.getBoundingClientRect().height
          : 0;
        routerViewContainer.scrollTop =
          titleTop - routerViewTop - chaWidth - 28;
      });
    },
    onscroll() {
      const { scrollTop } = this.scrollWrap;
      this.$nextTick(() => {
        const comp = this.$refs.dayComp;
        if (comp) {
          const h4Titles = comp.$el.querySelectorAll("h4");
          const creditTab = getOffset(document.querySelector(".credit-tab-content")).top;
          const scrollWrapTop = getOffset(this.scrollWrap).top;
          const chaWidth = this.fixedMenu? this.$refs.menuWrap.getBoundingClientRect().height: 0;
          const findTitleIndex = [...h4Titles].findIndex(
            item =>(scrollTop - (creditTab - scrollWrapTop) + chaWidth  < item.offsetTop)
          );

          // let findTitleIndex=-1;
          // for(var i=h4Titles.length-1;i>=0;i--){
          //   var item=h4Titles[i];
          //   if((scrollTop - (creditTab - scrollWrapTop) + chaWidth  > item.offsetTop)){
          //        this.subSelectIndex = i
          //        return
          //   }
          // }
          this.subSelectIndex = findTitleIndex;
        }
      });
      this.fixedMenu = scrollTop >= this.menuTop;
    },

    goBack() {
      this.$router.push(this.$route.path);
    },
    // 新增财务报表
    newReport(_state, _cID) {
      this.isShowNewReport = true;
      this.$nextTick(() => {
        this.$refs.ref_NewReport.open(null, _cID, _state, this.formData);
      });
    },
    editReport(_state, _cID, _row) {
      this.isShowNewReport = true;
      this.$nextTick(() => {
        this.$refs.ref_NewReport.open(_row, _cID, _state, this.formData);
      });
    },
    viewReport(_state, _cID, _row) {
      this.showReportDetail = true;
      this.$nextTick(() => {
        this.$refs.ref_ReportDetail.open(_row, _cID, _state, this.formData);
      });
    },
    hideReport() {
      this.isShowNewReport = false;
    },
    hideReportDetail() {
      this.showReportDetail = false;
    },
    onMouseOver() {
      this.isHover = true;
    },
    onMouseOut() {
      this.isHover = false;
      this.hoverIndex = "";
    },
    onHeadMouseOver(index) {
      this.hoverIndex = index;
    },
    getCompanyTags() {
      Api_GetCompanyTag({
        companyId: this.companyId
      }).then(res => {
        if (res) {
          this.companyTags = [
            { label: res[0].taxcredit, color: "success" },
            { label: res[0].company_size, color: "primary" },
            { label: res[0].listed_company, color: "primary" },
            { label: res[0].financing, color: "primary" },
            { label: res[0].opexception, color: "danger" },
            { label: res[0].zhi_xing, color: "danger" },
            { label: res[0].shi_xin, color: "danger" }
          ].filter(item => !!item.label);
        }
      });
    },
    // 打开下载报告弹窗
    openDownloadReportDialog(PDFType) {
      if (PDFType === "风险评级报告") {
        this.$message.warning("报告功能尚未正式发布");
      } else {
        this.$refs.downloadReportDialog.openDialog(PDFType);
      }
    },
    // 确认下载报告
    downloadReportConfirm() {},
    addSupervise() {
      const loading = this.$openLoading();
      Api_AddMonitorInfo({
        companyId:  this.companyId,
        companyName: this.formData.companyName,
        groupIds: this.formData.groupName.map(item => item.id)
      })
        .then(() => {
          loading.close();
          this.$message.success("列入监测成功！");
          this.getDetail();
        })
        .catch(res => {
          loading.close();
          this.$message.error(res);
        });
    }
  }
};
</script>

<style scoped lang="scss">
@import "src/styles/mixin.scss";

$color-primary: #4b9df3;
$color-grey: #f5f7fa;

@include area;
.area {
  padding-left: 30px;
}
#companyCenterMain {
  // height: calc(100vh - 200px);
}

.base-form /deep/ {
  .el-form-item__label {
    padding-right: 0;
  }
}



.menu-wrap {
  z-index: 10;
  position: relative;
  background-color: #fff;

  &.fixed {
    position: sticky;
    width: 100%;
    left: 0;
  }

  .menu-selected-sub {
    padding: 14px 21px;
    border: 1px solid #eaedf4;
    border-top: none;
    display: flex;

    .el-button {
      border-radius: 0;
      background-color: #f7f8fb;
      color: #606266;
      padding: 9px 11px;
      font-size: 13px;
      margin-right: 4px;

      &:last-child {
        margin-right: 0;
      }

      &.selected {
        background-color: $color-primary;
        color: #fff;
        border-color: $color-primary;
      }
    }
  }
}

.list-wrap {
  font-size: 16px;
  position: relative;
  z-index: 10;
  overflow: hidden;

  &.hover {
    overflow: initial;
  }

  .list-head {
    display: flex;
    cursor: pointer;

    .item-head {
      padding: 11px 15px;
      font-size: 14px;
      border-left: 1px solid #dcdfe6;
      border-top: 1px solid #dcdfe6;
      border-bottom: 1px solid #dcdfe6;
      transition: all 0.2s;

      &.selected {
        background-color: $color-grey;
        color: $color-primary;
      }

      &.hover {
        background-color: $color-grey;
      }
    }

    .item-head:last-child {
      border-right: 1px solid #dcdfe6;
    }
  }

  .list-body {
    position: absolute;
    left: 0;
    top: 100%;
    display: flex;
    width: 100%;
    box-shadow: 0 6px 6px 0 rgba(223, 223, 223, 0.6);

    .list-item {
      background-color: #fff;
      border-bottom: 1px solid #eaedf4;
      border-left: 1px solid #eaedf4;
      transition: all 0.2s;

      &:last-child {
        border-right: 1px solid #eaedf4;
      }

      &.selected,
      &.hover {
        background-color: $color-grey;
      }

      .item-block {
        cursor: pointer;
        padding: 8px 15px;
        transition: all 0.2s;
        font-size: 13px;

        &:hover,
        &.selected {
          background-color: $color-primary;
          color: #fff;
        }
      }
    }
  }
}

/deep/ {
  .tableWrapper-pagination {
    padding-bottom: 0;
  }

  .credit-tab-content {
    padding: 0;
    margin-top: 0;
    position: relative;
    border:1px solid transparent;
    h4 {
      border-left: none;
      padding: 0;
      margin-left: 0;
      margin-bottom: 15px;
      margin-top: 28px;
      
    }
  }
}

.box-img {
  width: 100%;
  background-image: url("../../../assets/images/default1-logo.png");
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}


.clearfix:after{
  display:block;
  content:'';
  clear:both;
}
</style>

<style lang="scss">
#companyCenterMain{
  .el-button--small{
    padding: 7px 15px;
    font-size: 13px;
    vertical-align: middle;
  }

  .menu-selected-sub{
    button{
      height: 30px;
    }
  }
}
</style>
