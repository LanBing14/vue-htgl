<template>
  <el-container>
    <el-header>
      <FxbHeader />
    </el-header>
    <div class="credit-company" v-loading="loading">
      <div class="fxb-container">
        <el-row :span="24" :gutter="20" type="flex" align="bottom">
          <el-col :span="3">
            <span
              class="font13 fxb-grey2"
              v-if="companyInfo.updateddate"
              style="margin-left: 3px;"
            >更新：{{ companyInfo.updateddate ? companyInfo.updateddate.split(' ')[0] : '' }}</span>
            <div class="company-avator">
              <img v-if="!companyInfo.ImageUrl" src="../../assets/images/default1-logo.png" alt />
              <img v-if="companyInfo.ImageUrl" :src="companyInfo.ImageUrl" alt />
            </div>
          </el-col>
          <el-col :span="13">
            <h2 class="font30 fontwb fxb-wihte">
              <span style="position: relative">
                {{ companyInfo.name || '-' }}
                <div
                  v-if="companyInfo.certStatus==='2'"
                  style="font-size: 13px; position: absolute; left: calc(100% + 12px); bottom: 8px; width: 100px; color: #5E9DEC"
                >
                  <img src="@/assets/images/certified.png" alt style="vertical-align: text-top" />
                  已认证
                </div>
                <div
                  v-else-if="companyInfo.certStatus==='1'"
                  style="font-size: 13px; position: absolute; left: calc(100% + 12px); bottom: 8px; width: 100px; color: #5E9DEC"
                >
                  <img src="@/assets/images/uncertified.png" alt style="vertical-align: text-top" />
                  认证中
                </div>
                <div v-else style="position: absolute; left: calc(100% + 12px); bottom: 3px">
                  <el-button
                    size="small"
                    style="padding: 6px 24px 6px 12px; color: #5E9DEC"
                    @click="gotoCertify"
                  >
                    <img src="@/assets/images/uncertified.png" alt style="display: inline" />
                    <span style="font-size: 13px; vertical-align: top; margin-left: 4px">我要认证</span>
                  </el-button>
                </div>
              </span>
            </h2>
            <div style="margin: 23px 0 13px;color: #abb7c5;">
              <img
                src="../../assets/images/xianxing.png"
                alt
                class="marR10"
                style="vertical-align: middle"
              />
              <span
                style="vertical-align: middle;font-size: 13px;"
              >统一社会信用代码 : {{ companyInfo.creditCode }}</span>
            </div>
            <!--<div class="company-attribute">-->
            <!--    <span class="spanGreen" v-if="companyInfo.status==='存续'"><i class="el-icon-bell"></i>{{ companyInfo.status || '-' }}</span>-->
            <!--    <span class="spanRed" v-else-if="companyInfo.status==='吊销'"><i class="el-icon-bell"></i>{{ companyInfo.status || '-' }}</span>-->
            <!--    <span class="spanGrey" v-else><i class="el-icon-bell"></i>{{ companyInfo.status || '-' }}</span>-->
            <!--</div>-->
            <div class="company-tags">
              <el-tag class="spanGreen" v-if="companyInfo.status==='存续'">
                <i class="el-icon-bell"></i>
                {{
                companyInfo.status || '-' }}
              </el-tag>
              <el-tag class="spanRed" v-else-if="companyInfo.status==='吊销'">
                <i class="el-icon-bell"></i>
                {{
                companyInfo.status || '-' }}
              </el-tag>
              <el-tag class="spanGrey" v-else>
                <i class="el-icon-bell"></i>
                {{ companyInfo.status || '-' }}
              </el-tag>
              <el-popover placement="bottom" trigger="hover" v-if="originalnames.length>0">
                <div>
                  <p v-for="(n,i) in originalnames" :key="i">{{ n }}</p>
                </div>
                <el-tag class="spanYellow" slot="reference">
                  曾用名
                  <i class="el-icon-caret-bottom"></i>
                </el-tag>
              </el-popover>
              <el-tag
                v-for="(el, index) in companyTags"
                :key="index"
                :type="el.color"
                size="small"
              >{{ el.label }}</el-tag>
            </div>
          </el-col>
          <el-col class="company-tools" :span="8" align="right">
            <el-button
              :loading="superviseLoading"
              v-if="isSupervise === '0'"
              @click="superviseCompany(-1)"
              type="primary"
              size="medium"
              title="取消监测"
            >
              <svg-icon icon-class="jiance" />已监测
            </el-button>
            <el-button
              :loading="superviseLoading"
              v-if="isSupervise === '-1'"
              @click="superviseCompany(0)"
              type="primary"
              size="medium"
              title="添加监测"
            >
              <svg-icon icon-class="jiance" style="vertical-align: middle" />
              <span style="vertical-align: middle;margin-left: 5px;">添加监测</span>
            </el-button>
            <el-button
              v-if="!companyInfo.isCustomer"
              icon="el-icon-plus"
              type="success"
              @click="openAddCustomer"
            >加入客户</el-button>
            <el-button v-else icon="el-icon-delete" @click="delCustomer">移除客户</el-button>
            <el-button
              v-if="companyInfo.attentionId"
              icon="el-icon-star-off"
              title="取消关注"
              size="medium"
              @click="cancleAttention"
            >已关注</el-button>
            <el-button
              v-if="!companyInfo.attentionId"
              icon="el-icon-star-off"
              title="添加关注"
              size="medium"
              @click="openAddAttentionDialog"
            >添加关注</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-main style="padding-bottom: 50px;">
      <el-row class="credit-risk" type="flex" align="bottom">
        <el-col :span="3" class="font16">
          <img src="../../assets/images/jinggao.png" alt class="marR10" />
          风险预警
        </el-col>
        <el-col :span="9" class="font13">
          <div class="flex">
            <div class="flex-primary">
              自身风险 :
              <span class="font30 fxb-red num">{{ ownRiskCount }}</span>项
            </div>
            <div class="flex-primary">
              关联方风险 :
              <span class="font30 fxb-red num">{{ relationRiskCount }}</span>项
            </div>
          </div>
        </el-col>
        <el-col :span="9" class="font13">
          <!--                    <div class="flex-primary">-->
          <span style="vertical-align: bottom">风险速递：</span>
          <template v-if="result.dtName">
            <el-tooltip :content="result.dtName" placement="top">
              <span class="dt-c ellipsis">{{ result.dtName }}</span>
            </el-tooltip>
            <span v-if="result.dtDate" class="dt-d">[{{ result.dtDate }}]</span>
          </template>
          <div v-else style="display: inline-block" class="no-dt">暂无动态</div>
          <!--                    </div>-->
        </el-col>
        <el-col :span="3" class="fxb-grey2">
          <router-link
            tag="a"
            target="_self"
            :to="'/creditFile/dynamicMon?id='+companyId"
            class="marL40"
          >查看更多...</router-link>
        </el-col>
      </el-row>
      <el-col :span="22" style="padding-right: 34px;">
        <!-- <div ref="menuWrap" :class="{fixed: fixedMenu}" :style="menuFixedStyle" class="menu-wrap"> -->
          <!-- 用粘性吸附改写 -->
        <div ref="menuWrap" class="menu-wrap">
          <ul class="credit-tab" style="margin-bottom: 0;border: 1px solid #e0e3ec">
            <router-link
              @click.native="showSecond('0')"
              tag="li"
              :to="'/creditFile/basicArchive?id='+companyId"
            >{{ '基本信息'+ filterCount('jbxxCnt')}}</router-link>
            <router-link
              @click.native="showSecond('1')"
              tag="li"
              :to="'/creditFile/companyMap?id='+companyId"
            >企业画像</router-link>
            <router-link
              @click.native="showSecond('2')"
              tag="li"
              :to="'/creditFile/judicialInfo?id='+companyId"
            >{{ '司法风险' + filterCount('sffxCnt')}}</router-link>
            <router-link
              @click.native="showSecond('3')"
              tag="li"
              :to="'/creditFile/businessRisk?id='+companyId"
            >{{ '经营风险' + filterCount('jyfxCnt')}}</router-link>
            <router-link
              @click.native="showSecond('4')"
              tag="li"
              :to="'/creditFile/operateCond?id='+companyId"
            >{{ '经营状况' + filterCount('jyzkCnt')}}</router-link>
            <router-link
              @click.native="showSecond('5')"
              tag="li"
              :to="'/creditFile/knowledgePro?id='+companyId"
            >{{ '知识产权' + filterCount('zscqCnt')}}</router-link>
            <router-link
              @click.native="showSecond('6')"
              tag="li"
              :to="'/creditFile/dynamicMon?id='+companyId"
            >动态监测</router-link>
            <router-link
              @click.native="showSecond('7')"
              tag="li"
              :to="'/creditFile/creditEval?id='+companyId"
            >信用评价</router-link>
          </ul>
          <ul ref="subMenu" class="second" @click="subMenuClick">
           
            <template v-if="val === '0'">
              <li
                v-for="(el,index) in liObjects[0]"
                :yuIndex="index"
                :key="index"
              >{{ el + filterCount(liliObjectsCount[0][index]) }}</li>
            </template>
            <template v-if="val === '1'">
              <router-link tag="li"   yuIndex="0" :to="'/creditFile/companyMap/qiYe?id='+companyId">企业图谱</router-link>
              <router-link tag="li"  yuIndex="1" :to="'/creditFile/companyMap/guanLian?id='+companyId">关联链图</router-link>
              <router-link tag="li"  yuIndex="2" :to="'/creditFile/companyMap/guQuan?id='+companyId">股权结构</router-link>
              <router-link
                tag="li"
                 yuIndex="3"
                :to="'/creditFile/companyMap/beneficiaryShareholders?id='+companyId"
              >受益股东</router-link>
            </template>
            <template v-if="val === '2'">
              <li
                v-for="(el,index) in liObjects[2]"
                :key="index"
                :yuIndex="index"
              >{{ el + filterCount(liliObjectsCount[2][index]) }}</li>
            </template>
            <template v-if="val === '3'">
              <li
                v-for="(el,index) in liObjects[3]"
                :key="index"
                :yuIndex="index"
              >{{ el + filterCount(liliObjectsCount[3][index]) }}</li>
            </template>
            <template v-if="val === '4'">
              <li
                v-for="(el,index) in liObjects[4]"
                :key="index"
                :yuIndex="index"
              >{{ el + filterCount(liliObjectsCount[4][index]) }}</li>
            </template>
            <template v-if="val === '5'">
              <li
                v-for="(el,index) in liObjects[5]"
                :key="index"
                :yuIndex="index"
              >{{ el + filterCount(liliObjectsCount[5][index]) }}</li>
            </template>
            <template v-if="val === '6'">
              <li  :yuIndex="0" @click="$refs.routerView.changeType(true)">自身动态</li>
              <li  :yuIndex="1" @click="$refs.routerView.changeType(false)">关联动态</li>
            </template>
            
            <template v-if="val === '7'"></template>
          </ul>
        </div>
        <!-- <div v-if="fixedMenu" :style="{height: menuHeight+'px'}"></div> -->
        <router-view ref="routerView" class="router-view" v-if="isRouterAlive" />
      </el-col>
      <el-col :span="2" align="right">
        <ul class="credit-report">
          <li @click="openDownloadReportDialog('基础信息报告')">
            <img src="../../assets/images/basicreport.png" alt />
            <p>基础信息报告</p>
          </li>
          <li @click="openDownloadReportDialog('标准信用报告')">
            <img src="../../assets/images/secondreport.png" alt />
            <p>标准信用报告</p>
          </li>
          <li @click="openDownloadReportDialog('风险评级报告')">
            <img src="../../assets/images/threereport.png" alt />
            <p>风险评级报告</p>
          </li>
        </ul>
      </el-col>
    </el-main>
    <el-footer>
      <FxbFooter />
    </el-footer>
    <MyConcernGroup
      ref="addAttentionDialog"
      :addGroup="true"
      @submitEditGroup="addAttentionConfirm"
    />
    <MySuperviseGroup
      ref="addSuperviseDialog"
      :addGroup="true"
      @submitEditGroup="addSuperviseGroupConfirm"
    />
    <DownloadReport
      ref="downloadReportDialog"
      @submitDownloadType="downloadReportConfirm"
      :companyName="companyInfo.name"
    />
    <EnterpriseCertify ref="ref_EnterpriseCertify" @loadCompany="loadCompany"></EnterpriseCertify>
    <QuickAddCustomer ref="ref_QuickAddCustomer" @loadCompany="loadCompany"></QuickAddCustomer>
  </el-container>
</template>

<script>
import FxbHeader from "@/views/layouts/fxb/components/FxbHeader";
import FxbFooter from "@/views/layouts/fxb/components/FxbFooter";
import { Api_getCteditCompanyInfo } from "@/api/advanceSearch";
import { dateFormat } from "@/utils/index";
import {
  Api_GetCompanyRiskCount,
  Api_newHasSupervise,
  Api_newSuperviseCompany,
  Api_GetCompanyTag,
  Api_GetDataCount,
  Api_newGetComPageMonitor
} from "@/api/creditMonitor";
import EnterpriseCertify from "./EnterpriseCertify";
import {
  Api_AddAttention,
  Api_GetAttentionInfo,
  Api_AttentionCancel,
  Api_certJudgment
} from "@/api/userCenter/creditManage";
import MyConcernGroup from "../userCenter/components/MyConcernGroup";
import MySuperviseGroup from "../userCenter/components/MySuperviseGroup";
import DownloadReport from "./creditFile/DownloadReport";
import QuickAddCustomer from "./QuickAddCustomer";
import { Api_RemoveCustomer } from "@/api/creditManagement/customerProfile/customerManagement.js";

export default {
  filters: { dateFormat },
  components: {
    FxbHeader,
    FxbFooter,
    MyConcernGroup,
    MySuperviseGroup,
    DownloadReport,
    EnterpriseCertify,
    QuickAddCustomer
  },
  data() {
    return {
      yutimer:null,//定时器
      isRouterAlive: true,
      loading: false,
      // 监测加载
      superviseLoading: false,
      companyInfo: {},
      //  曾用名
      originalnames: [],
      result: {
        dtName: "",
        dtDate: this.$dateFormat(new Date())
      },
      // -1未监测 0 监测
      isSupervise: "-1",
      attentionInfo: "",
      companyId: "",
      companyName: "",
      // 自身风险个数
      ownRiskCount: 0,
      // 关联风险个数
      relationRiskCount: 0,
      companyTags: [],
      val: "0",
      fixedMenu: false,
      menuHeight: 0, // 菜单区域高度
      appContainerTop: 50,
      menuTop: 0,
      menuWidth: 0,
      menuLeft: 0,
      liObjects: {
        0: [
          "基本信息",
          "股东及出资方",
          "对外投资",
          "分支机构",
          "工商变更记录",
          "经营范围记录"
        ],
        1: ["企业图谱", "关联链图", "股权结构", "受益股东"],
        2: ["被执行人信息", "失信被执行人信息", "裁判文书信息", "法院公告信息"],
        3: ["动产抵押", "股权出质", "清算信息", "工商异常名录", "行政处罚信息"],
        4: ["融资信息", "财务总览信息", "产品信息", "抽查信息", "招聘类信息"],
        5: [
          "专利信息",
          "软件著作权信息",
          "作品著作权信息",
          "网站信息",
          "证书信息",
          "商标信息"
        ],
        6: ["自身动态", "关联动态"],
       
      },
      liliObjectsCount: {
        0: [
          "",
          "partnerCnt",
          "investCnt",
          "branchCnt",
          "changeCnt",
          "changeScopeCnt"
        ], //jbxxCnt
        1: [],
        2: ["zhiXingCnt", "shiXinCnt", "caseCnt", "chinacourtCnt"], //sffxCnt
        3: [
          "mpledgeCnt",
          "pledgeCnt",
          "liquidationCnt",
          "opexceptionCnt",
          "penaltyCnt"
        ], //jyfxCnt
        4: [
          "financingCnt",
          "financingtaxCnt",
          "productCnt",
          "spotcheckVnt",
          "recruitCnt"
        ], //jyzkCnt
        5: [
          "patentCnt",
          "softwareCopyrightsCnt",
          "copyrightCnt",
          "websiteCnt",
          "certificationCnt",
          "tmCnt"
        ], //zscqCnt
        6: []
      },
      dataCount: {}
    };
  },
  computed: {
    menuFixedStyle() {
      return {
        top: this.fixedMenu ? this.appContainerTop + "px" : null,
        width: this.fixedMenu ? this.menuWidth + "px" : null,
        left: this.fixedMenu ? this.menuLeft + "px" : null,
        zIndex:this.fixedMenu ? 2005:'initial'
      };
    }
  },
  watch: {
    // $route:{
    //     handler(){
    //         this.$nextTick(()=>{
    //             this.$refs.subMenu.firstElementChild.className = 'active'
    //         })
    //     },
    //     immediate: true
    // }
  },
  beforeRouteLeave (to, from, next) {
    this.scrollWrap.removeEventListener("scroll", this.onscroll);
    next();
  },
  mounted() {
    this.scrollWrap = document.querySelector(
      "#app .scroll-wrap .el-scrollbar__wrap"
    );
    this.scrollWrap.addEventListener("scroll", this.onscroll, false);
    this.companyId = this.$route.query.id;
    this.loadCompany();
    const { left, top } = this.$getOffset(this.$refs.menuWrap);
    const { width, height } = this.$refs.menuWrap.getBoundingClientRect();
    this.menuTop = top - this.appContainerTop;
    this.menuWidth = width;
    this.menuHeight = height;
    this.menuLeft = left;
 
    this.$nextTick(() => {
      const titles = this.$refs.routerView.$el.querySelectorAll("h4");
 
      if(titles[0]){
        Object.keys(this.liObjects).forEach(key => {
          const arr = this.liObjects[key];
          const find = arr.find(item => item === titles[0].innerHTML);
          if (find) {
            this.val = String(key);
          }
        });
      }else{
        this.val='7'
      }
      this.setDefaultMenuActive();
    });
    Api_GetDataCount({
      companyId: this.$route.query.id
    }).then(res => {
      this.dataCount = res.result[0];
    });
  },
  beforeDestory() {
    window.removeEventListener("scroll", this.onscroll);
  },

  methods: {
    filterCount(name) {
      if (JSON.stringify(this.dataCount) == "{}" || !name) {
        return "";
      } else {
          return "(" + (this.dataCount[name] > 999 ? "999+" : this.dataCount[name]) + ")";
      }
    },
    loadOName() {
      this.originalnames = this.companyInfo.originalName
        ? this.companyInfo.originalName.split(",")
        : [];
    },
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => (this.isRouterAlive = true));
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
    getColor(index) {
      let color = "";
      if (index % 3 === 0) {
        color = "success";
      }
      if (index % 3 === 1) {
        color = "primary";
      } else {
        color = "danger";
      }
      return color;
    },
    /**
     * 添加/取消监测
     * @param status (0:添加监测 ；-1：取消监测)
     */
    superviseCompany(status) {
      if (this.$isVip()) {
        if (status === -1) {
          // 取消监测添加确认框
          this.$confirm("确定将该企业移出监测列表吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.supervise(status);
            })
            .catch(() => {});
        } else {
          this.$refs.addSuperviseDialog.openDialog();
        }
      } else {
        this.$vipExpireConfirm();
      }
    },
    supervise(status, groupIdList) {
      this.superviseLoading = true;
      Api_newSuperviseCompany(
        this.companyId,
        this.companyInfo.name,
        status,
        groupIdList
      )
        .then(res => {
          this.$refs.addSuperviseDialog.closeLoading();
          this.$refs.addSuperviseDialog.closeDialog();
          this.superviseLoading = false;
          this.$message.success(status === 0 ? "添加监测成功" : "取消监测成功");
          this.isSupervise = status === 0 ? "0" : "-1";
        })
        .catch(() => {
          this.$message.error("获取企业信息失败");
          this.superviseLoading = false;
        });
    },
    loadCompany() {
      // 企业信息
      this.loading = true;
      Api_getCteditCompanyInfo({
        companyId: this.companyId,
        companyName: this.companyName
      })
        .then(res => {
          this.loading = false;
          this.companyInfo = res.result[0];
          this.loadOName();
          this.getCompanyTags();
        })
        .catch(() => {
          this.loading = false;
        });
      // 企业是否监测
      Api_newHasSupervise(this.companyId).then(res => {
        this.isSupervise = res;
      });
      /* // 关注信息获取
                 Api_GetAttentionInfo(this.companyId).then(res => {
                     this.attentionInfo = res ? res.attention : "";
                 });*/
      // 获取企业的风险个数
      Api_GetCompanyRiskCount(this.companyId).then(res => {
        this.ownRiskCount = res.ownRiskCount;
        this.relationRiskCount = res.relationRiskCount;
      });
      // Api_newGetComPageMonitor({
      //   pageNo: 1,
      //   pageSize: 10,
      //   companyId: this.companyId
      // })
      //   .then(({ result: data }) => {
      //     if (data && data.length) {
      //       this.result.dtName = data[0].content;
      //       // this.result.dtDate = this.$dateFormat(data[0].change_time);
      //     } else {
      //       this.result.dtName = "";
      //       this.result.dtDate = "";
      //     }
      //   })
      //   .catch(res => {
      //     this.$message.error(res);
      //   });
    },
    // 添加关注-选择分组
    openAddAttentionDialog() {
      if (this.$isVip()) {
        // this.$refs.addAttentionDialog.openDialog();
        this.addAttentionConfirm();
      } else {
        this.$vipExpireConfirm();
      }
    },
    // 添加企业监测
    addSuperviseGroupConfirm(groupIdList) {
      this.$refs.addSuperviseDialog.openLoading();
      this.supervise(0, groupIdList);
    },
    // 添加关注-确认
    addAttentionConfirm() {
      // this.$refs.addAttentionDialog.openLoading();
      const loading = this.$openLoading();
      Api_AddAttention({
        companyId: this.companyId,
        companyName: this.companyInfo.name,
        // city: this.companyInfo.city,
        creditCode: this.companyInfo.creditCode
        // legalPerson: this.companyInfo.operName,
        // groupIds: groupIds
      })
        .then(res => {
          // this.$refs.addAttentionDialog.closeLoading();
          // this.$refs.addAttentionDialog.closeDialog();
          loading.close();
          this.$message.success("添加关注成功");
          this.loadCompany();
        })
        .catch(e => {
          loading.close();
          this.$message.error("添加关注失败");
        });
    },
    // 取消关注
    cancleAttention() {
      this.$confirm("确定取消关注该企业吗？", "提示", { type: "warning" }).then(
        () => {
          const loading = this.$openLoading();
          Api_AttentionCancel(this.companyInfo.attentionId)
            .then(res => {
              loading.close();
              this.$message.success("取消关注成功");
              this.loadCompany();
            })
            .catch(e => {
              loading.close();
              this.$message.error(e);
            });
        }
      );
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
    // 二级菜单显示
    showSecond(val) {
      this.val = val;
      this.reload();
      this.setDefaultMenuActive();
    },
    setDefaultMenuActive() {
      this.$nextTick(() => {

        const filters = [...this.$refs.subMenu.children].forEach(
          li =>li.className = ""
        );
  
        const firstLi = this.$refs.subMenu.firstElementChild;
      
        if(firstLi){
          firstLi.className = "active";
        }
        // const filters = [...this.$refs.subMenu.children].filter(
        //   li => !li.contains(firstLi)
        // );
        // filters.forEach(li => (li.className = ""));

    


      });
    },
    subMenuClick(e) {
      clearTimeout(this.yutimer);
      this.yutimer=null;

      // 点击的时候取消滚动监听
      this.scrollWrap.removeEventListener("scroll", this.onscroll);
     
      if (e.target.tagName === "LI") {
        
        // 获取当前点击的元素的index
        let clickIndex=e.target.getAttribute("yuIndex");

        // const subMenuHTML = e.target.innerHTML;
        const titles = this.$refs.routerView.$el.querySelectorAll("h4");
        // const findTitle = [...titles].findIndex(
        //   item => subMenuHTML.indexOf(item.innerHTML) !== -1
        // );
        [...this.$refs.subMenu.children].forEach((li,index) => {
          li.className = "";
          li.className =
            index== clickIndex ? "active" : "";
        });

        // const findContent = [...titles].find(
        //     item => subMenuHTML.indexOf(item.innerHTML) !== -1
        //   );

        if(this.val!=1&&this.val!=6){
          this.setScrollTop(titles[clickIndex]);
        }
      }

      // 点击完成之后，再添加上滚动监听
      this.yutimer= setTimeout(()=>{
        this.scrollWrap.addEventListener("scroll", this.onscroll);
      })
      
    },
    setScrollTop(scrollTopEl) {
      const offsetTop = this.$getOffset(scrollTopEl);
      this.scrollWrap.scrollTop = offsetTop.top - 50 - this.menuHeight;
    },
    onscroll() {
           const { scrollTop } = this.scrollWrap;
           if(this.val!=1&&this.val!=6){
            // 大清洗
            [...this.$refs.subMenu.children].forEach((li,index) => {
                li.className = "";
            });
              
            //  初始化第一个亮
            if([...this.$refs.subMenu.children][0]){
              [...this.$refs.subMenu.children][0].className="active"
            }

         
              // const titles = this.$refs.routerView.$el.querySelectorAll("h4");
              const titles=document.getElementsByClassName('credit-tab-content')[0].querySelectorAll("h4");
              const findTitle = [...titles].findIndex(
                item => scrollTop - 50 - this.menuTop < item.offsetTop
              );


              if (findTitle) {
                [...this.$refs.subMenu.children].forEach((li,index) => {
                  li.className = "";

                  if(index==findTitle){
                    li.className ="active"
                  }
                });
              }
          }
          this.fixedMenu = scrollTop >= this.menuTop;
    },
    gotoCertify() {
      if (!this.$store.state.user.userInfo.registerFlag) {
        this.$alert("平台暂时不支持企业团队成员申请认证企业。", "提示", {
          type: "warning"
        });
        return false;
      }
      Api_certJudgment(this.companyId)
        .then(res => {
          if (res) {
            // this.$refs.ref_EnterpriseCertify.open(this.companyInfo.name);
            this.$router.push({
                path:'/enterpriseCertification',
                query: {
                  name: this.companyInfo.name
                }
            })
          }
        })
        .catch(res => {
          this.$message.error(res);
        });
    },
    openAddCustomer() {
      this.$refs.ref_QuickAddCustomer.open({
        companyId: this.companyId,
        companyName: this.companyInfo.name,
        status: this.companyInfo.status,
        operName: this.companyInfo.operName,
        creditCode: this.companyInfo.creditCode
      });
    },
    delCustomer() {
      this.$confirm("确定移除企业吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const loading = this.$openLoading();
          Api_RemoveCustomer(this.companyInfo.customerId)
            .then(() => {
              loading.close();
              this.$message.success("移除成功！");
              this.loadCompany();
            })
            .catch(res => {
              loading.close();
              this.$message.error(res);
            });
        })
        .catch(() => {});
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.fxb-page {
  position: relative;
  text-align: right;
  margin-top: 0;

  &.el-pagination {
    padding: 10px 1px;
    border-bottom: 1px solid #f1f1f1;
  }

  &.el-pagination .btn-prev,
  &.el-pagination .btn-next {
    min-width: 30px;
    height: 28px;
    padding: 0;
    background-color: #f4f4f5;
    border-radius: 3px;
    line-height: 28px;
  }

  &.el-pagination::before,
  &.el-pagination::after {
    width: 20px;
    border-top: 1px solid #f1f1f1;
    bottom: -1px;
    position: absolute;
  }

  &.el-pagination::before {
    left: -20px;
  }

  &.el-pagination::after {
    right: -20px;
  }

  .el-pager li {
    margin: 0 10px;
    min-width: 30px;
    border-radius: 3px;
    font-weight: 500;

    &.active,
    &:hover {
      color: #fff;
      background-color: #4b9df3;
    }
  }

  .el-pagination__jump {
    margin-left: 29px;
  }

  .el-pagination__rightwrapper {
    float: initial;
    margin-right: 6px;
    display: inline-block;
  }
}
.company-tags {
  .el-tag {
    vertical-align: middle;
    color: #fff;
    border-radius: 2px;
    margin-right: 5px;
    height: 26px;
    border: none;
    line-height: 26px;

    &.el-tag--success {
      background-color: #0abab6;
    }

    &.el-tag--primary {
      background-color: #448ee7;
    }

    &.el-tag--danger {
      background-color: #ea4747;
    }
  }
}

.fxb-el-table {
  &.el-table th {
    background: #f7f8fc;
    color: #333;
    white-space: nowrap;
    font-weight: normal;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.credit-company {
  padding-top: 85px;
  background-color: #032c59;
}

.company-avator {
  width: 110px;
  padding: 15px 0;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  text-align: center;
  margin-top: 10px;
  margin-left: 2px;
  background-color: #f7f8f9;
}

.company-avator img {
  width: 80px;
  height: 80px;
}

.company-attribute {
  margin: 15px 0 10px;
}

.company-attribute span {
  margin-right: 25px;
}

.company-tags {
  margin-bottom: 31px;
}

.company-tools {
  margin-bottom: 27px;

  button {
    margin-left: 6px;
    height: 36px;
    padding-top: 0;
    padding-bottom: 0;
    vertical-align: middle;

    span {
      vertical-align: middle;
    }
  }
}

.credit-tab {
  background-color: #fff;
  overflow: hidden;
  margin-bottom: 20px;

  li {
    float: left;
    width: calc(100% / 8);
    height: 48px;
    line-height: 48px;
    text-align: center;
    cursor: pointer;

    &:hover {
      color: $--color-primary;
      background-color: #f7f8fb;
    }

    &.router-link-active {
      color: $--color-primary;
      background-color: #f7f8fb;
    }
  }
}

.credit-risk {
  margin-bottom: 24px;
  width: 91%;
  align-items: flex-end;
}

.credit-report {
  li {
    height: 100px;
    width: 100px;
    color: #fff;
    padding-top: 13px;
    text-align: center;
    margin-bottom: 20px;
    margin-left: 0;
    cursor: pointer;

    &:nth-child(1) {
      background: #4083d3 url(../../assets/images/report-bg1.png) no-repeat left
        bottom;
    }

    &:nth-child(2) {
      background: #2daed8 url(../../assets/images/report-bg2.png) no-repeat left
        bottom;
    }

    &:nth-child(3) {
      background: #2bc7c3 url(../../assets/images/report-bg3.png) no-repeat left
        bottom;
    }

    p {
      padding-top: 8px;
      font-size: 12px;
    }
  }
}

.warning-time {
  font-size: 13px;
  color: #a4acb8;
  margin-left: 22px;
}
.spanYellow {
  border-radius: 2px;
  color: #fff;
  background: #f5a623;
}
.spanGreen {
  border-radius: 2px;
  color: #fff;
  background: #0abab6;
}
.spanRed {
  padding: 2px 5px;
  border-radius: 2px;
  color: #fff;
  background: #ea4747;
}
.spanGrey {
  padding: 2px 5px;
  border-radius: 2px;
  color: #fff;
  background: #abb7c5;
}
.second {
  background-color: #fff;
  overflow: hidden;
  border-bottom: 1px solid #e0e3ec;
  border-left: 1px solid #e0e3ec;
  border-right: 1px solid #e0e3ec;
  padding: 0 20px;

  li {
    float: left;
    margin: 14px 10px 14px 0;
    padding: 10px 12px;
    background: #f7f8fb;
    border: 1px solid #e0e3ec;
    cursor: pointer;

    &:last-child {
      margin-right: 0;
    }
  }

  li:hover,
  li.active {
    background: #4b9df3;
    color: #fff;
    border-color:#4b9df3;
  }
}

.num {
  vertical-align: bottom;
  line-height: 26px;
  margin: 0 10px;
}

.dt-c {
  display: inline-block;
  vertical-align: bottom;
  padding-left: 15px;
  position: relative;
  color: #666;
  margin-right: 6px;
  max-width: 165px;

  &::before {
    content: "";
    border: 2px solid red;
    border-radius: 50%;
    position: absolute;
    left: 4px;
    top: 5px;
  }
}

.dt-d {
  color: #a4acb8;
}

.menu-wrap {
  z-index: 2006;
  position: sticky;
  top:50px;
  background-color: #fff;

  &.fixed {
    position: fixed;
    width: 100%;
    left: 0;
    top: 50px;
  }
}
</style>
