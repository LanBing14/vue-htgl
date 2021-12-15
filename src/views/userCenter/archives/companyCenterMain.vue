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
                    >当前企业</router-link>
                </ul>
            </div>
        </el-row>
      </div>
      <div class="page-content" style="position: relative">
      
        <div class="top-wrap">
          <div class="qy-img">
            <div class="box-img"></div>
          </div>
          <div class="qy-info">
            <h4 class="company-name">
                {{information.enterpriseName? information.enterpriseName:userInfo.saasName}}
            </h4>

            <div style="tydm">
              统一社会信用代码：{{information.createCode? information.createCode:'-'}}
            </div>
            <div class="tips-wrap">


            <el-dropdown size="mini" placement="bottom-start">
              <span class="el-dropdown-link tags">
                曾用名<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">

                <el-dropdown-item v-for="(el,index) in information.oldName" :key="index">
                  {{el}}
                </el-dropdown-item>
                
              </el-dropdown-menu>
            </el-dropdown>
              <span
                v-for="(el, index) in information.enterprisesType"
                :key="index"
                class="tags"
                :style="{'background-color':tagsBgC[index%5]}"
              >{{el}}</span>
            
            </div>
          </div>
      
        </div>
        
        <!--公司信息介绍 -->
        <div class="company-detail-info">
            <div class="company-detail-top"> 
                <div class="detail-item item20">
                    <div>注册时间</div>
                    <div>{{information.incorporationDate || '-'}}</div>
                </div>
                <div class="detail-item item20">
                    <div>注册资本</div>
                    <div>{{$toMoney(information.registeredCapital)}}{{danwei[information.registeredCapitalUnit]}}</div>
                </div>
                <div class="detail-item item20"> 
                    <div>行业类型</div>
                    <div>{{information.industryType2Value || '-'}}</div>
                </div>
                <div class="detail-item item40">
                    <div>注册地址</div>
                    <div>{{information.registeredAddress || '-'}}</div>
                </div>
                <div class="detail-item item20">
                    <div>入驻状态</div>
                    <div>{{information.entryStatus==0? '正常':information.entryStatus==1? '挂靠再管':information.entryStatus==2? '挂靠不再管':information.entryStatus==3? '已迁出':information.entryStatus==4? '注销':information.entryStatus==5? '不运作':'-'}}</div>
                </div>
                <div class="detail-item item20">
                    <div>孵化性质</div>
                    <div>{{information.hatchingNature==0? '科创载体':information.hatchingNature==1? '非科创载体':information.hatchingNature==2? '科创载体下企业':'-'}}</div>
                </div>
                <div class="detail-item item20">
                    <div>孵化状态</div>
                    <div>{{information.hatchingState==0? '中心在孵化':information.hatchingState==1? '留创园在孵化':information.hatchingState==2? '中心毕业':information.hatchingState==3? '留创园毕业':'-'}}</div>
                </div>
                <div class="detail-item item40">
                    <div>入驻时间</div>
                    <div>{{information.leaseAgreementStarttime || '-'}}</div>
                </div>

                <div class="detail-item qyjs" style="flex:0 0 100%;align-items: baseline;">
                    <div>企业简介</div>
                    <div class="qyjs" v-if='information.companyProfile'>           
                      <text-more
                      :testText="information.companyProfile"
                      :maxRow="1"
                      :isLimitHeight="isLimitHeight"
                      :isOver.sync="isOver"
                      @moreClick="moreClick"
                    >
                    <span slot="after" v-if="isOver">{{isLimitHeight? '...展开':'收起'}}</span>
                      </text-more>
                  </div>
                  <div v-else>-</div>

                </div>
            </div>

        </div>



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
   
        <component 
          v-if="companyId"
          ref="dayComp"
          :is="compKey"
          :id="companyId"
          :isreadOnly="isreadOnly"
          :companyName="formData.companyName"
        ></component>
      </div>
    </div>
    
    <el-dialog v-if="dialogVisibleModel" :show-close="false" :visible.sync="dialogVisibleModel" :close-on-click-modal="false" :append-to-body="true" width="495px"
      :before-close="closeDialog" center title="所属机构确认弹窗">
      <el-row class="confirm-container">
        <p class="first-title">请确认当前在租的所属机构:</p>
        <p class="second-title">若后续发生机构迁出情况，可发起迁出申请。</p>

        <div class="confirm-item-f">
          <div class="confirm-item" v-for="(item,index) in confirmlist" :key="index">
             <el-input v-model="item.name" readonly></el-input>
             <el-button :type="currentClick===index? 'primary':''" @click.stop="choseHandle(item,index)">{{currentClick===index? '已选择':'请选择'}}</el-button>
          </div>
        </div>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sendSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/**基本信息 */
import BaseInfo from "./components/BaseInfo/index";
/**招商信息 */
import zhaoShangInfo from "./components/zhaoShangInfo/index";
/**人才项目 */
import rencaiPro from "./components/rencaiPro/index";

// 科技项目
import  kejiPro  from  "./components/kejiPro"

//租赁信息
import zulinInfo from "./components/zulinInfo/index.vue"

import KnowledgePro from "./components/KnowledgePro/index";

import DueDiligence from "./components/DueDiligence/index";
import FinancialAnalysis from "./components/FinancialAnalysis";
import CreditHistory from "./components/CreditHistory";
import TransactionPerformance from "./components/TransactionPerformance";
import OtherInformation from "./components/OtherInformation";
import textMore  from "@/components/textMore/textMore"
//  生产情况
import   ProductionSituation from "./components/ProductionSituation"

/**接口导入 */
import {
  Api_baseInfo,
  Api_isNeedTan,
  Api_bind,
  Api_entInfo
} from "@/api/creditManagement/customerProfile/customerManagemCustomer/baseInfo";

import { getOffset } from "@/utils/index";

import { getUserInfo } from "@/utils/auth";
import { mapGetters,mapState } from 'vuex';

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
    /**展开收起 */
    textMore,
    /**基本信息 */
    BaseInfo,

    /**招商信息 */
    zhaoShangInfo,

    // 科技项目
    kejiPro,

    /**人才项目 */
    rencaiPro,


    zulinInfo,
    KnowledgePro,

    DueDiligence,
    FinancialAnalysis,
    CreditHistory,
    TransactionPerformance,
    OtherInformation,
    // 生产经营情况
    ProductionSituation,
  },
  props: {
    id: String // 客户id，用于查询详情数据
  },
  data() {
    return {
      /**企业信息 */
      information:{},
      danwei:{
        '1':'万元人民币',
        '10':'万加元',
        '11':'万瑞士法郎',
        '12':'万德国马克',
        '13':'万澳门元',
        '14':'万法国法郎',
        '15':'万韩元',
        '16':'万瑞典克朗',
        '17':'万丹麦克朗',
        '18':'万挪威克朗',
        '19':'万智利比索',
        '2':'万美元',
        '20':'万新台湾元',
        '3':'万港元',
        '4':'万欧元',
        '5':'万日元',
        '6':'万阿富汗尼',
        '7':'万澳大利亚元',
        '8':'万新加坡元',
        '9':'万英镑'
      },
      isneedTan:false,
      /**是不是只读 */
      isreadOnly:true,
      currentClick:0,
      /**所属机构列表 */
      confirmlist: [],
      /**弹窗 */
      dialogVisibleModel:false,

      /** 被选中的数据*/
      selectData:'',

      /**tags颜色列表 */
      tagsBgC:['#409eff','#53b7b3','#67c23a','#e6a23c','#9c6ae2'],
   
      /**这里是展开与收起 */
      isLimitHeight:true,
      isOver:true,
     
      /**这里是tab展示 */
      chooseListHead: [
        { text: "基本信息", compKey: "BaseInfo", cname: "jbxxCnt" },
        { text: "招商信息", compKey: "zhaoShangInfo", cname: "jyfxCnt" },
        { text: "租赁信息", compKey: "zulinInfo", cname: "sffxCnt" },
        { text: "经营信息", compKey: "KnowledgePro", cname: "zscqCnt" },
        { text: "知识产权", compKey: "ProductionSituation", cname: "scjycsCnt" },
        { text: "科技项目", compKey: "kejiPro", cname: "" },
        { text: "人才项目", compKey: "rencaiPro", cname: "" },
      ],
      chooseList: [
        [
          { text: "企业概况", type: 1 },
          { text: "联系人信息", type: 2, cname: "partnerCnt" },
          { text: "股权结构", type: 3, cname: "investCnt" },
          { text: "人力资源", type: 4, cname: "branchCnt" },
          { text: "留学生情况", type: 5, cname: "changeCnt" },
          { text: "其他附件", type: 6, cname: "changeCnt" }
        ],
        [
          { text: "招商信息", type: 1, cname: "mpledgeCnt" }
        ],
        [
          { text: "账单信息", type: 1, cname: "zhiXingCnt" },
          { text: "合同台账", type: 2, cname: "zhiXingCnt" }
        ],
        [
          { text: "经济概况", type: 1, cname: "zhiXingCnt" },
          { text: "财务信息", type: 2, cname: "zhiXingCnt" },
          { text: "资质证书", type: 3, cname: "zhiXingCnt" },
          { text: "融资信息", type: 4, cname: "zhiXingCnt" },
          { text: "合作情况", type: 5, cname: "zhiXingCnt" },
          { text: "企业资质", type: 6, cname: "zhiXingCnt" },
          { text: "产品信息", type: 6, cname: "zhiXingCnt" },
        ],
        [
          { text: "知识产权概览", type: 1, cname: "patentCnt" },
          { text: "发明专利", type: 2, cname: "softwareCopyrightsCnt" },
          { text: "软著", type: 3, cname: "copyrightCnt" },
          { text: "商标", type: 4, cname: "websiteCnt" }
        ],
        [
          { text: "科技项目", type: 1}
        ],
        [
          { text: "人才项目", type: 1, cname: "" }
        ]
      ],
      /**当前选中菜单的子分类菜单 */
      menuSelected: [
      { text: "企业概况", type: 1 },
      { text: "联系人信息", type: 2, cname: "partnerCnt" },
      { text: "股权结构", type: 3, cname: "investCnt" },
      { text: "人力资源", type: 4, cname: "branchCnt" },
      { text: "留学生情况", type: 5, cname: "changeCnt" },
      { text: "其他附件", type: 6, cname: "changeCnt" }
    ], 
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
      // 新增财务报表
      isShowNewReport: false,
      isHover: false,
      selectIndex: 0, // 一级菜单选中的index
      subSelectIndex: 0, // 子级菜单选中的index
      hoverIndex: 0,
      showReportDetail: false,
      ownRiskCount: null,
      relationRiskCount: null,
      dataCount: {}
    };
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // beforeRouteEnter不能通过this访问组件实例，但是可以通过 vm 访问组件实例
      
      if(from.fullPath=='/login'||from.fullPath=='/register'){
        vm.isneedTan=true;
      }else{
        vm.isneedTan=false;
      }
    })
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
              /**获取企业基本信息 */
              this.baseInfo(newVal)
              
              /**是否需要弹窗 */
              // this.isTan(newVal)
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
    }
  },
  mounted() {

  },
  beforeDestory() {
    this.scrollWrap.removeEventListener("scroll", this.onscroll);
  },
  methods: {
    /**确认发送 */
    sendSure(){
        if(!isNaN(parseInt(this.currentClick))){
          // 发送请求
          let que={
            entId:this.companyId,
            code:this.confirmlist[this.currentClick].code,
            type:this.confirmlist[this.currentClick].type
          }
          Api_bind(que).then((res)=>{
           
            this.$message({
              message:res,
              type: 'success'
            });
           this.dialogVisibleModel=false
          }).catch(err=>{
              this.$message({
                showClose: true,
                message: err,
                type: 'error'
              });
          })
        }
       
    },
    isTan(newVal){
      Api_isNeedTan({entId:newVal}).then((res)=>{
        if(res.needBullet==1){
          
            Api_entInfo({entId:newVal}).then((res)=>{
            if(res){
              this.dialogVisibleModel=true;
              this.confirmlist=this.$deepCopy(res)
            }
            }).catch(err=>{
              console.log(err)
              this.dialogVisibleModel=false;
            })
        }
      }).catch(err=>{
        console.log(err)
      })
    },

    /**深拷贝*/
     deepCopy(obj) {
      var result = Array.isArray(obj) ? [] : {};
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === 'object' && obj[key]!==null) {
            result[key] = deepCopy(obj[key]);   //递归复制
          } else {
            result[key] = obj[key];
          }
        }
      }
      return result;
    },

    baseInfo(newVal){
      /**基本信息 */
    
      Api_baseInfo(newVal).then((res)=>{
     
          this.information={...this.deepCopy(res)};
          if(this.information.oldName){
              this.information.oldName=this.information.oldName.split(',');
          }
          if(this.information.enterprisesType){
            this.information.enterprisesType=this.information.enterprisesType.split(',');
          }
          if(this.information.incorporationDate){
              this.information.incorporationDate=this.$dateFormat(this.information.incorporationDate, "yyyy年MM月dd日")
          }
          if(this.information.leaseAgreementStarttime){
           
            this.information.leaseAgreementStarttime=this.$dateFormat(this.information.leaseAgreementStarttime, "yyyy年MM月dd日")
          }
      }) .catch((res) => {
          this.$message.error(res);
        });  
    },

    choseHandle(item, index, num) {
        if(index===this.currentClick){
          this.currentClick=''
        }else{
          this.currentClick=index
        }
    },
      /**更多与收起 */
      moreClick() {
        this.isLimitHeight = !this.isLimitHeight;
      },

      closeDialog() {
        this.dialogVisibleModel = false
      },

    filterCount(name) {
      if (!name || Object.keys(this.dataCount).length === 0) return "";
      return "(" + this.dataCount[name] + ")";
    },
    onDetailShow() {
      return this.$getOffset(this.$refs.menuWrap).top - this.appContainerTop;
    },

    // 生成item的宽度
    getItemWidth(index) {
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
          if([...h4Titles].length==1){
             this.subSelectIndex = 0;
          }
        }
      });
      this.fixedMenu = scrollTop >= this.menuTop;
    },

    goBack() {
      this.$router.push(this.$route.path);
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
  box-shadow: 0px 0px 15px 0px 
		rgba(14, 5, 10, 0.04);
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


<style scoped lang="scss">
  .top-wrap{
    display: flex;
    height: 90px;
    margin-bottom: 26px;
    .qy-img{
      flex: 0 90px; 
      height: 100%; 
      padding: 15px; 
      background-color: #F6F9FA;
    }

    .qy-info{
      flex: 1;
      height: 100%;
      padding: 0 20px; 
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }

    .company-name{
      font-size: 22px;
      line-height: 22px; 
    }
    .tydm{
      color: #606266;
      font-family: MicrosoftYaHei;
      font-size: 14px;
      line-height: 14px;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 0px;
      color: #666666;
    }
    .tags{
      padding: 3px 6px; 
      margin-right: 6px; 
      color: #fff; 
      border-radius: 2px; 
      font-size:12px;
    }

    .el-dropdown-link{
        background-color: #eef0f2;
        color: #777a80;
    }
  }

  .company-detail-top{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-left: 37px;
    .item20{
      flex:0 0 23.33%
    }
    .item40{
      flex:0 0 30%;
    }
    .detail-item{
      display: flex;
     	font-family: MicrosoftYaHei;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      line-height: 14px;
      letter-spacing: 0px;
      padding-bottom: 24px;
      &>div:nth-child(1){
          color: #606266;
          width: 5em;
          flex:0 0 5em;
      }
    }
  }


  .qyjs{
    font-family: MicrosoftYaHei;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 28px;
    letter-spacing: 0px;
    color: #333333;
  }






  /* 所属机构确认弹框 */

  /deep/ .el-dialog__header {
    border-bottom: 1px solid #eaedf4 !important;
  }

  .confirm-container {

    .first-title {
      color: #333;
    }

    .second-title {
      color: #aaaaaa;
      line-height: 48px;
    }


    .confirm-item-f {
      .confirm-item.hadchose {
        p.left-list {
          width: 370px;
          height: 38px;
          line-height: 38px;
          padding-left: 10px;
          border: 1px solid #dcdfe6;
          border-radius: 3px;
          background-color: #f5f7fa;
        }

        p.chose {
          width: 80px;
          height: 38px;
          color: #fff;
          background-color: $light-blue;
          line-height: 38px;
          border: 1px solid #dcdfe6;
          text-align: center;
          margin-left: 8px;
          border-radius: 3px;
        }
      }

      .confirm-item {
        display: flex;
        margin-bottom: 10px;

        p.left-list {
          width: 370px;
          height: 38px;
          line-height: 38px;
          padding-left: 10px;
          border: 1px solid #dcdfe6;
          border-radius: 3px;
        }

        p.chose {
          width: 80px;
          height: 38px;
          color: #606266;
          line-height: 38px;
          border: 1px solid #dcdfe6;
          text-align: center;
          margin-left: 8px;
          border-radius: 3px;
          cursor: pointer;
        }


      }
    }
  }




























</style>