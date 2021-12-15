<template>
  <div id="advancedSearch">
    <div :class="{'advance-bg': $route.path === '/advanceSearch/result'}">
      <div id="advanced-search-container">
        <el-form
          ref="searchForm"
          :model="searchForm"
          class="search-form"
          auto-complete="on"
          @submit.native.prevent
        >
          <div class="type-select-wrap">
            <el-select v-model="current" @change="getTypeName">
              <el-option
                v-for="(el, index) in typeList"
                :key="index"
                :label="el.type"
                :value="el.value"
              ></el-option>
            </el-select>
          </div>
          <div id="advanced-search-input">
            <!-- 已登录用户当鼠标获取焦点的时候显示搜索历史 -->
            <el-autocomplete
              ref="searchAutocomplete"
              v-if="isLoginState"
              :placeholder="placeholderTxt"
              class="inline-input search-input"
              v-model.trim="searchForm.keyword"
              :fetch-suggestions="querySearch"
              :popper-append-to-body="false"
              :disabled="searchDisabled"
              size="large"
              clearable
              @keyup.enter.native="jump()"
              @select="handleSelect"
            >
              <template slot-scope="{ item }">
                <div class="name" v-html="optionsColorful(item.name,searchForm.keyword)"></div>
              </template>
            </el-autocomplete>
            <el-button
              ref="ref_search_btn_a"
              v-if="isLoginState"
              type="primary"
              class="input-search"
              :disabled="searchDisabled"
              @click="jump()"
            >查 &nbsp; 询</el-button>

            <el-input
              v-if="!isLoginState"
              :placeholder="placeholderTxt"
              class="inline-input search-input"
              v-model.trim="searchForm.keyword"
              :disabled="searchDisabled"
              size="large"
              clearable
              @keyup.enter.native="jump()"
              @select="handleSelect"
            ></el-input>
            <el-button
              ref="ref_search_btn_b"
              v-if="!isLoginState"
              type="primary"
              class="input-search"
              :disabled="searchDisabled"
              @click="jump()"
            >查 询</el-button>
          </div>

          <a
            v-if="$route.path === '/advanceSearch/result'"
            href="javascript:void(0);"
            id="show-advanced-search-more"
            @click="showSearchDetail()"
            :style="{color: show?'#a2a3ae':'#333'}"
          >{{ show ? '收起':'高级搜索' }}</a>
        </el-form>
      </div>
    </div>

    <!-- 高级搜索展开 -->
    <div id="search-box" v-if="show">
      <el-row class="condition-tag">
        <el-col :span="3" class="font16 fxb-grey">企业高级查询</el-col>
        <el-col :span="1" class="font12" v-if="searchTags.length > 0">已选条件</el-col>
        <el-col :span="18" v-if="searchTags.length > 0">
          &nbsp;
          <el-tag
            size="medium"
            v-for="(tag, index) in searchTags"
            :key="tag.index"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
            :type="tag.type"
            style="margin: 0 5px;"
            :data-index="index"
          >{{ tag }}</el-tag>
        </el-col>
        <el-col :span="2" align="right" v-if="searchTags.length > 0">
          <el-button type="text" size="small" @click="resetCondition()">重置条件</el-button>
        </el-col>
      </el-row>

      <el-form id="condition-box" label-width="6em">
        <el-form-item label="注册资本：" class="fxb-tag">
          <!-- <span
            v-for="(item, index) in registeredCapital"
            :key="index"
            :class="{active: index === searchCurrent1}"
            @click="addTag($event, index, '1')"
          >{{ item }}</span>-->
          <el-checkbox-group size="medium" v-model="registeredCapitalValue">
            <el-checkbox-button
              v-for="(item,index) in registeredCapital"
              :label="item"
              :key="index"
            >{{item}}</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="成立日期：" class="fxb-tag">
          <!-- <span
            v-for="(item, index) in setTime"
            :key="index"
            :class="{active: index === searchCurrent2}"
            @click="addTag($event, index, '2')"
          >{{ item }}</span>-->
          <el-checkbox-group size="medium"  v-model="setTimeValue">
            <el-checkbox-button v-for="(item,index) in setTime" :label="item" :key="index">{{item}}</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="省份地区：" class="fxb-tag" style="position: relative;">
          <div :class="{setHeight: !isShowMoreArea}">
            <!-- <span
              v-for="(item, index) in provinceArea"
              :key="index"
              :class="{active: index === searchCurrent3}"
              @click="addTag($event, index, '3')"
            >{{ item }}</span>-->
            <el-checkbox-group size="medium" v-model="provinceAreaValue">
              <el-checkbox-button
                v-for="(item,index) in provinceArea"
                :label="item"
                :key="index"
              >{{item}}</el-checkbox-button>
            </el-checkbox-group>
          </div>
          <i
            :class="{'el-icon-arrow-down': !isShowMoreArea, 'el-icon-arrow-up': isShowMoreArea}"
            @click="showMoreArea()"
            style="position: absolute; right: 0; bottom: 15px;"
          ></i>
        </el-form-item>
        <el-form-item label="行业门类：" class="fxb-tag" style="position: relative;">
          <div :class="{setHeight: !isShowMoreCategory}">
            <!-- <span
              v-for="(item, index) in industry"
              :key="index"
              :class="{active: index === searchCurrent4}"
              @click="addTag($event, index, '4')"
            >{{ item }}</span>-->
            <el-checkbox-group size="medium" v-model="industryValue">
              <el-checkbox-button
                v-for="(item,index) in industry"
                :label="item"
                :key="index"
              >{{item}}</el-checkbox-button>
            </el-checkbox-group>
            <i
              :class="{'el-icon-arrow-down': !isShowMoreCategory, 'el-icon-arrow-up': isShowMoreCategory}"
              @click="showMoreCategory()"
              style="position: absolute; right: 0; bottom: 15px;"
            ></i>
          </div>
        </el-form-item>

        <!-- 高级查询 融资信息 -->
        <el-form-item label="融资信息：" class="fxb-tag" style="position: relative;">
          <div>
            <el-checkbox-group size="medium" v-model="financingValue">
              <el-checkbox-button
                v-for="(item,index) in financing"
                :label="item"
                :key="index"
              >{{item}}</el-checkbox-button>
            </el-checkbox-group>
          </div>
        </el-form-item>

        <div class="moreScreening" v-if="true">
          <el-form :inline="true" :model="moreDetail" label-width="6em">
            <el-form-item label="更多筛选："></el-form-item>
            <el-form-item class="fxb-tag" style="position: relative;">
              <el-select v-model="moreDetail.contact" placeholder="请选择联系方式" size="small">
                <el-option :label="item.prop" v-for="(item,index) in contact" :key="index" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="fxb-tag" style="position: relative;">
              <el-select v-model="moreDetail.taxcredit" placeholder="请选择纳税信用等级" size="small">
                <el-option
                  :label="item.prop"
                  v-for="(item,index) in creditRating"
                  :key="index"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="fxb-tag" style="position: relative;">
              <el-select v-model="moreDetail.list" placeholder="请选择上市信息" size="small">
                <el-option
                  :label="item.prop"
                  v-for="(item,index) in listingInformation"
                  :key="index"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="fxb-tag" style="position: relative;">
              <el-select v-model="moreDetail.scale" placeholder="请选择企业规模" size="small">
                <el-option
                  :label="item.prop"
                  v-for="(item,index) in enterpriseScale"
                  :key="index"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="fxb-tag" style="position: relative;">
              <el-select v-model="moreDetail.tminfo" placeholder="请选择商标信息" size="small">
                <el-option
                  :label="item.prop"
                  v-for="(item,index) in trademarkInformation"
                  :key="index"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="fxb-tag" style="position: relative;margin-left: 94px;">
              <el-select v-model="moreDetail.patentdetail" placeholder="请选择专利信息" size="small">
                <el-option
                  :label="item.prop"
                  v-for="(item,index) in patentInformation"
                  :key="index"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="fxb-tag" style="position: relative;">
              <el-select v-model="moreDetail.softwarecopyrights" placeholder="请选择软件著作权" size="small">
                <el-option
                  :label="item.prop"
                  v-for="(item,index) in softwareCopyright"
                  :key="index"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="fxb-tag" style="position: relative;">
              <el-select v-model="moreDetail.shixin" placeholder="请选择失信信息" size="small">
                <el-option
                  :label="item.prop"
                  v-for="(item,index) in dishonestInformation"
                  :key="index"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="fxb-tag" style="position: relative;">
              <el-select v-model="moreDetail.zhixing" placeholder="请选择被执行信息" size="small">
                <el-option
                  :label="item.prop"
                  v-for="(item,index) in executedInformation"
                  :key="index"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="fxb-tag" style="position: relative;">
              <el-select v-model="moreDetail.penalty" placeholder="请选择行政处罚" size="small">
                <el-option
                  :label="item.prop"
                  v-for="(item,index) in administrativeSanction"
                  :key="index"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="fxb-tag" style="position: relative;margin-left: 94px;">
              <el-select v-model="moreDetail.opexception" placeholder="请选择经营异常" size="small">
                <el-option
                  :label="item.prop"
                  v-for="(item,index) in abnormalOperation"
                  :key="index"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="fxb-tag" style="position: relative;">
              <el-select v-model="moreDetail.mpledge" placeholder="请选择动产抵押" size="small">
                <el-option
                  :label="item.prop"
                  v-for="(item,index) in chattelMortgage"
                  :key="index"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="fxb-tag" style="position: relative;">
              <el-select v-model="moreDetail.pledge" placeholder="请选择股权出质" size="small">
                <el-option
                  :label="item.prop"
                  v-for="(item,index) in equityPledge"
                  :key="index"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="fxb-tag" style="position: relative;">
              <el-select v-model="moreDetail.liquidation" placeholder="请选择清算信息"  size="small">
                <el-option
                  :label="item.prop"
                  v-for="(item,index) in clearInformation"
                  :key="index"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script type="text/jsx">
import {
  Api_AdvanceSearch,
  Api_HistorySearch,
  Api_IndustryCategory,
  Api_Province
} from "@/api/advanceSearch";
import { Api_SearchCompany } from "@/api/creditManagement/customerProfile/customerManagement.js";

export default {
  name: "AdvancedSearch",
  props: {
    nowPage: Number,
    show:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      placeholderTxt: "请输入关键词",
      current: "0",
      typeList: [
        { type: "全部", value: "0" },
        { type: "企业名称", value: "1" },
        { type: "法定代表人", value: "2" },
        { type: "股东/高管", value: "6" },
        { type: "注册地址", value: "3" },
        { type: "经营范围", value: "5" }
      ],
      searchForm: { keyword: "" },
      searchDisabled: false,
      searchParamsConditions: {
        isFromSearch: "",
        pageNo: "1",
        pageSize: "10",
        status: "",
        registCapi: "",
        startYear: "",
        province: "",
        industry: "",
        financing:'', //融资
        queryValue: "", // 查询的值
        queryType: 0 // 默认查询类别为全部， 0：全部  1：企业名称 2：法人代表  3：注册地址  4：品牌产品   5：经营范围  6：股东高管   7：信用代码
      },
      moreShowOrHide: true, //更多筛选是不是显示
      // show: false,
      searchTags: [],
      tagsId: "",
      searchCurrent1: null,
      searchCurrent2: null,
      searchCurrent3: null,
      searchCurrent4: null,
      registeredCapitalValue: [],
      setTimeValue: [],
      provinceAreaValue: [],
      industryValue: [],
      financingValue: [], // 融资  v-model 绑定的
      registeredCapital: [
        "100万以下",
        "100-500万",
        "500-1000万",
        "1000-5000万",
        "5000万以上"
      ],
      setTime: ["不足1年", "1-5年", "5-10年", "10-20年", "20-30年", "30年以上"],
      provinceArea: [],
      industry: [], //行业门类的循环数组
      //  融资信息的循环数组
      financing: [
        "天使/种子轮",
        "Pre-A至A+轮",
        "Pre-B至B+轮",
        "C轮及以上",
        "收购/并购/被并购",
        "战略投资",
        "其他"
      ],
      contact: [{prop:"有联系方式",value:1}, {prop:"无联系方式",value:0}], // 联系方式循环数组
      creditRating: [{prop:'A级纳税人',value:'1'}, {prop:"非A级纳税人",value:'0'}], // 纳税信用等级循环数组
      listingInformation: [{prop:"A股上市企业",value:'1'}, {prop:"非上市企业",value:'0'}], // 上市信息循环数组
      enterpriseScale: [{prop:'超大型企业',value:'5'},{prop:"大型企业",value:'4'}, {prop:"中型企业",value:'3'}, {prop:"小型企业",value:'2'}, {prop:"微型企业",value:'1'}], // 企业规模循环数组
      trademarkInformation: [{prop:"有商标信息",value:'1'}, {prop:"无商标信息",value:'0'}], //商标信息循环数组
      patentInformation: [{prop:"有专利信息",value:'1'}, {prop:"无专利信息",value:'0'}], //专利信息
      softwareCopyright: [{prop:"有软件著作权",value:'1'}, {prop:"无软件著作权",value:'0'}], // 著作权
      dishonestInformation: [{prop:"有失信信息",value:'1'}, {prop:"无失信信息",value:0}], // 失信信息
      executedInformation: [{prop:"有被执行信息",value:'1'}, {prop:"无被执行信息",value:'0'}], // 被执行信息
      administrativeSanction: [{prop:"有行政处罚",value:'1'}, {prop:"无行政处罚",value:'0'}], // 行政处罚
      abnormalOperation: [{prop:"有经营异常",value:'1'}, {prop:"无经营异常",value:'0'}], //经营异常
      chattelMortgage: [{prop:"有动产抵押",value:'1'}, {prop:"无动产抵押",value:'0'}], //动产抵押
      equityPledge: [{prop:"有股权出质",value:'1'}, {prop:"无股权出质",value:'0'}], // 股权出质
      clearInformation: [{prop:"有清算信息",value:'1'}, {prop:"无清算信息",value:'0'}], //清算信息

      moreDetail: {
        //更多选择
        contact: "",
        taxcredit: "",
        list: "",
        scale: "",
        tminfo: "",
        patentdetail: "",
        softwarecopyrights: "",
        shixin: "",
        zhixing: "",
        penalty: "",
        opexception: "",
        mpledge: "",
        pledge: "",
        liquidation: ""
      },

      isShowMoreArea: false,
      isShowMoreCategory: false,
      restaurants: [],
      state1: "",
      state2: "",
      isLoading: false
    };
  },
  computed: {
    isLoginState() {
      return !!this.$store.getters.userInfo.id;
    }
  },
  watch: {
    $route(route) {
      if (route.query.keyword) {
        this.searchForm.keyword = this.$route.query.keyword;
        this.searchByConditon();
      }
    },

    //监听注册资本
    registeredCapitalValue() {
      this.setTagsList();
      this.setSearchParamsConditions();
      this.searchByConditon();
    },
    //监听成立日期
    setTimeValue() {
      this.setTagsList();
      this.setSearchParamsConditions();
      this.searchByConditon();
    },
    //监听省份
    provinceAreaValue() {
      this.setTagsList();
      this.setSearchParamsConditions();
      this.searchByConditon();
    },
    //监听行业分类
    industryValue() {
      this.setTagsList();
      this.setSearchParamsConditions();
      this.searchByConditon();
    },

    //监听融资信息
    financingValue() {
      this.setTagsList();
      this.setSearchParamsConditions();
      this.searchByConditon();
    },

    // 监听更多筛选
     moreDetail:{//深度监听，可监听到对象、数组的变化
        handler(val, oldVal){
          // 设置标签
          this.setTagsList();
          // 调用接口查询数据
          this.searchByConditon();
      },
        deep:true
     }
  },
  created() {
    this.getProvince();
    this.getIndustryCategory();
    if (!this.searchForm.keyword) {
      this.searchForm.keyword = this.$route.query.keyword;
    }
    // this.searchForm.keyword ? this.searchForm.keyword : this.$route.query.keyword;
  },

  mounted() {
    this.searchForm.keyword = this.$route.query.keyword
      ? this.$route.query.keyword
      : this.searchForm.keyword;
    this.searchParamsConditions.queryType = this.$route.query.type
      ? this.$route.query.type
      : this.searchParamsConditions.queryType;
    this.current = this.$route.query.type ? this.$route.query.type : "0";
    if (this.$route.query.keyword) {
      this.searchByConditon();
    }
    this.restaurants = this.loadAll();
  },

  methods: {
    showOrhideMore() {},
    jump(val, tag) {
      // this.$nextTick(() => {
      //   console.log(document.querySelector(".el-autocomplete-suggestion"));
      //   document.querySelector(".el-autocomplete-suggestion").style.display = "none";
      // });
      if (this.$route.path !== "/advanceSearch/result") {
        if (!this.searchForm.keyword) {
          this.$message.warning("请输入查询关键词");
          return false;
        } else {
          // if (tag) {
          //   this.$router.push({
          //     path: "/creditFile/basicArchive",
          //     query: { id: val.id, creditCode: val.creditCode },
          //   });
          // } else {
          this.$router.push({
            path: "/advanceSearch/result",
            query: {
              keyword: this.searchForm.keyword,
              type: this.searchParamsConditions.queryType,
              idx: this.current
            }
          });
          // }
        }
      } else {
        if (tag) {
          this.$router.push({
            path: "/creditFile/basicArchive",
            query: { id: val.id, creditCode: val.creditCode }
          });
        } else {
          this.searchByConditon();
        }
      }
    },
    // handleLogin() {
    //     isLogin(data => {
    //         this.isLoginState = data;
    //         if (data) {
    //             this.$router.push({
    //                 path: this.redirect || "/" + route
    //             });
    //         } else {
    //             this.$login.login();
    //         }
    //     });
    // },
    getTypeName(value) {
      // this.current = value;
      const typeName = this.typeList.find(item => item.value === value).type;
      // const elVal = e.target.innerHTML.replace(/\s+/g, '');
      this.searchParamsConditions.queryType = value;
      if (typeName !== "全部") {
        this.placeholderTxt =
          "请输入" + typeName.replace(/\s+/g, "") + "关键词";
      } else {
        this.placeholderTxt = "请输入关键词";
      }
    },
    // 根据条件分页查询
    searchByConditon() {
      this.$nextTick(() => {
        if (this.$refs.searchAutocomplete) {
          this.$refs.searchAutocomplete.activated = false;
        }
      });

      if (!this.searchForm.keyword) {
        this.$message.warning("请输入查询关键词");
        return false;
      } else {
        if (this.searchForm.keyword.length < 2) {
          this.$message.warning("关键词长度不少于2个字");
          return false;
        } else {
          this.searchParamsConditions.queryValue = this.searchForm.keyword;
          this.searchParamsConditions.pageNo = "1";
          this.advanceSearch();

          /**
           * 搜索的时候更新URL里的参数
           * @param keyword: 关键词
           * @param type: 用户选择的搜索类型的value
           * @param idx: 选择的类型的index
           */
          // this.$router.go({
          //     path: "/advanceSearch",
          //     query: {
          //         keyword: this.searchForm.keyword,
          //         type: this.searchParamsConditions.queryType,
          //         idx: this.current
          //     }
          // });

          // window.history.pushState(null, null,
          //     '/advanceSearch/result?keyword=' + this.searchForm.keyword +
          //     '&type=' + this.searchParamsConditions.queryType +
          //     '&idx=' + this.current);
        }
      }
    },
    advanceSearch(nowPage) {
      this.$emit("loadingState", true);
      if (nowPage) {
        this.searchParamsConditions.pageNo = nowPage;
      }

      // this.searchDisabled = true;
      Api_AdvanceSearch(
        {...this.searchParamsConditions,...this.searchParamsConditions.queryType,...this.moreDetail}
      )
        .then(res => {
          this.searchDisabled = false;
          const keywordReg = new RegExp(this.searchForm.keyword, "i");
          res.returnData.forEach(item => {
            const name = item.name || "";
            const nameWord = name.match(keywordReg);
            // 匹配企业名称
            if (nameWord) {
              item.name = name.replace(
                keywordReg,
                `<span style="color: #ff4c38;">${nameWord[0]}</span>`
              );
            }
            const operName = item.operName || "";
            const operNameWord = operName.match(keywordReg);
            // 匹配法定代表人
            if (operNameWord) {
              item.operName = operName.replace(
                keywordReg,
                `<span style="color: #ff4c38;">${operNameWord[0]}</span>`
              );
            }
            const address = item.address || "";
            const addressWord = address.match(keywordReg);
            // 匹配地址
            if (addressWord) {
              item.address = address.replace(
                keywordReg,
                `<span style="color: #ff4c38;">${addressWord[0]}</span>`
              );
            }
          });
          this.$emit("showResultList", res);
        })
        .catch(e => {
          this.enterpList = [];
          this.moreThan = true;
          this.showPrompt = true;
          this.showTotals = 0;
          this.totals = 0;
          this.searchDisabled = false;
          this.$emit("showResultList", []);
          this.$emit("loadingState", false);
        });
    },
    // 展开高级搜索详情
    showSearchDetail() {
      if (this.searchDisabled) return false;
      // this.show = !this.show;
      this.$emit('update:show',!this.show)
    },
    // 重置选项
    resetCondition() {
      this.searchTags = [];
      // this.searchCurrent1 = null;
      // this.searchCurrent2 = null;
      // this.searchCurrent3 = null;
      // this.searchCurrent4 = null;
      this.searchParamsConditions.registCapi = "";
      this.searchParamsConditions.startYear = "";
      this.searchParamsConditions.province = "";
      this.searchParamsConditions.industry = "";
      this.searchParamsConditions.financing = "";


      // 更多选择全部清空
      for(var i in this.moreDetail){
        this.moreDetail[i]=""
      }
      
      this.registeredCapitalValue=[];
      this.setTimeValue= [];
      this.provinceAreaValue=[];
      this.industryValue= [];
      this.financingValue= [], // 融资  v-model 绑定的
      this.isShowMoreArea = false;
      this.isShowMoreCategory = false;
      this.searchByConditon();
    },
    // addTag(e, index, searchCurrentName) {
    //   const getChooseName = e.currentTarget.innerHTML;

    //   // 注册资本
    //   if (searchCurrentName === "1") {
    //     this.searchCurrent1 = index;

    //     const hasTagCapital = this.registeredCapital.filter(
    //       item => this.searchTags.indexOf(item) > -1
    //     );
    //     const getIndex1 = this.searchTags.indexOf(hasTagCapital[0]);

    //     if (this.searchTags.length !== 0 && hasTagCapital.length !== 0) {
    //       this.searchTags.splice(getIndex1, 1, getChooseName);
    //     } else {
    //       this.searchTags.push(getChooseName);
    //     }
    //     // if(this.searchTags.indexOf(getChooseName)<0){
    //     //   this.searchTags.push(getChooseName);
    //     // }

    //     this.searchParamsConditions.registCapi = getChooseName;
    //     this.searchByConditon();
    //   }

    //   // 成立日期
    //   if (searchCurrentName === "2") {
    //     this.searchCurrent2 = index;

    //     const hasTime = this.setTime.filter(
    //       item => this.searchTags.indexOf(item) > -1
    //     );
    //     const getIndex2 = this.searchTags.indexOf(hasTime[0]);

    //     if (this.searchTags.length !== 0 && hasTime.length !== 0) {
    //       this.searchTags.splice(getIndex2, 1, getChooseName);
    //     } else {
    //       this.searchTags.push(getChooseName);
    //     }

    //     this.searchParamsConditions.startYear = getChooseName;
    //     this.searchByConditon();
    //   }

    //   // 省份地区
    //   if (searchCurrentName === "3") {
    //     this.searchCurrent3 = index;

    //     const hasArea = this.provinceArea.filter(
    //       item => this.searchTags.indexOf(item) > -1
    //     );
    //     const getIndex3 = this.searchTags.indexOf(hasArea[0]);

    //     if (this.searchTags.length !== 0 && hasArea.length !== 0) {
    //       this.searchTags.splice(getIndex3, 1, getChooseName);
    //     } else {
    //       this.searchTags.push(getChooseName);
    //     }

    //     this.searchParamsConditions.province = getChooseName;
    //     this.searchByConditon();
    //   }

    //   // 行业门类
    //   if (searchCurrentName === "4") {
    //     this.searchCurrent4 = index;

    //     const hasIndustry = this.industry.filter(
    //       item => this.searchTags.indexOf(item) > -1
    //     );
    //     const getIndex4 = this.searchTags.indexOf(hasIndustry[0]);

    //     if (this.searchTags.length !== 0 && hasIndustry.length !== 0) {
    //       this.searchTags.splice(getIndex4, 1, getChooseName);
    //     } else {
    //       this.searchTags.push(getChooseName);
    //     }

    //     this.searchParamsConditions.industry = getChooseName;
    //     this.searchByConditon();
    //   }
    // },

    // 关闭搜索条件
    handleClose(tag) {
      var transTag = tag.replace("...", "");
      this.searchTags.splice(this.searchTags.indexOf(tag), 1);

      const hasTagCapital = this.registeredCapital.includes(transTag);
      const hasTime = this.setTime.includes(transTag);
      const hasArea = this.provinceArea.includes(transTag);
      const hasIndustry = this.industry.includes(transTag);
      const hasFinancing= this.financing.includes(transTag);


      // 联系方式
      var contactArr=this.contact.map(item=>{
        return item.prop
      })
      const hasContact=contactArr.includes(transTag);


      // 纳税信用等级
      var creditRatingArr=this.creditRating.map(item=>{
        return item.prop
      })
      const hasCreditRating=creditRatingArr.includes(transTag);

      // clearInformation: [{prop:"有清算信息",value:'1'}, {prop:"无清算信息",value:'0'}], //清算信息

      // 上市信息
      var listingInformationArr=this.listingInformation.map(item=>{
        return item.prop
      })
      const haslistingInformation=listingInformationArr.includes(transTag);

      //  企业规模
      var enterpriseScaleArr=this.enterpriseScale.map(item=>{
        return item.prop
      })
      const hasScale=enterpriseScaleArr.includes(transTag);

      //  商标信息
      var trademarkArr=this.trademarkInformation.map(item=>{
        return item.prop
      })
      const hasTrademark=trademarkArr.includes(transTag);


      //  专利信息
      var patentArr=this.patentInformation.map(item=>{
        return item.prop
      })
      const hasPatent=patentArr.includes(transTag);


      //  著作权
      var softwareArr=this.softwareCopyright.map(item=>{
        return item.prop
      })
      const hasSoftwareArr=softwareArr.includes(transTag);

      //  失信信息
      var dishonestArr=this.dishonestInformation.map(item=>{
        return item.prop
      })
      const hasDishonest=dishonestArr.includes(transTag);

      //  被执行信息
      var executedArr=this.executedInformation.map(item=>{
        return item.prop
      })
      const hasExecuted=executedArr.includes(transTag);

      //  行政处罚
      var administrativeArr=this.administrativeSanction.map(item=>{
        return item.prop
      })
      const hasAdministrative=administrativeArr.includes(transTag);


      // 经营异常
      var abnormalArr=this.abnormalOperation.map(item=>{
        return item.prop
      })
      const hasAbnormal=abnormalArr.includes(transTag);      

      //动产抵押
      var mpledgeArr=this.chattelMortgage.map(item=>{
        return item.prop
      })
      const hasMpledge=mpledgeArr.includes(transTag);

      //股权出质
      var pledgeArr=this.equityPledge.map(item=>{
        return item.prop
      })
      const hasPledge=pledgeArr.includes(transTag);


      //股权出质
      var clearInformationArr=this.clearInformation.map(item=>{
        return item.prop
      })
      const hasLiquidation=clearInformationArr.includes(transTag);

      if (hasTagCapital) {
        this.searchCurrent1 = null;
        this.searchParamsConditions.registCapi = "";
        this.registeredCapitalValue = [];
        this.searchByConditon();
      }
      if (hasTime) {
        this.searchCurrent2 = null;
        this.searchParamsConditions.startYear = "";
        this.setTimeValue = [];
        this.searchByConditon();
      }
      if (hasArea) {
        this.searchCurrent3 = null;
        this.searchParamsConditions.province = "";
        this.provinceAreaValue = [];
        this.searchByConditon();
      }
      if (hasIndustry) {
        this.searchCurrent4 = null;
        this.searchParamsConditions.industry = "";
        this.industryValue = [];
        this.searchByConditon();
      }

      if (hasFinancing) {
        this.searchParamsConditions.financing = "";
        this.financingValue = [];
        this.searchByConditon();
      }

      if(hasContact){
        this.searchParamsConditions.contact = "";
        this.moreDetail.contact = "";
        this.searchByConditon();
      }

      if(hasCreditRating){
        this.searchParamsConditions.taxcredit = "";
        this.moreDetail.taxcredit = "";
        this.searchByConditon();
      }

      if(haslistingInformation){
        this.searchParamsConditions.list = "";
        this.moreDetail.list = "";
        this.searchByConditon();
      }

      if(hasScale){
        this.searchParamsConditions.scale = "";
        this.moreDetail.scale = "";
        this.searchByConditon();
      }

      if(hasTrademark){
        this.searchParamsConditions.tminfo = "";
        this.moreDetail.tminfo = "";
        this.searchByConditon();
      }
      if(hasPatent){
        this.searchParamsConditions.patentdetail = "";
        this.moreDetail.patentdetail = "";
        this.searchByConditon();
      }

      if(softwareArr){
        this.searchParamsConditions.softwarecopyrights = "";
        this.moreDetail.softwarecopyrights = "";
        this.searchByConditon();
      }


      if(hasDishonest){
        this.searchParamsConditions.shixin = "";
        this.moreDetail.shixin = "";
        this.searchByConditon();
      }

      if(hasExecuted){
        this.searchParamsConditions.zhixing = "";
        this.moreDetail.zhixing = "";
        this.searchByConditon();
      }

      if(hasAdministrative){
        this.searchParamsConditions.penalty = "";
        this.moreDetail.penalty = "";
        this.searchByConditon();
      }

      if(hasAbnormal){
        this.searchParamsConditions.opexception = "";
        this.moreDetail.opexception = "";
        this.searchByConditon();
      }

      if(hasMpledge){
        this.searchParamsConditions.mpledge = "";
        this.moreDetail.mpledge = "";
        this.searchByConditon();
      }
      if(hasPledge){
        this.searchParamsConditions.pledge = "";
        this.moreDetail.pledge = "";
        this.searchByConditon();
      }

      if(hasLiquidation){
        this.searchParamsConditions.liquidation = "";
        this.moreDetail.liquidation = "";
        this.searchByConditon();
      }
    },
    // 获取各省数据
    getProvince() {
      Api_Province().then(res => {
        this.provinceArea = res.map(item => item.name);
        // if (res.stateCode === "1") {
        //     for (const elem of res.data.values()) {
        //         this.provinceArea.push(elem.name);
        //     }
        // } else if (res.stateCode === "0") {
        //     this.$message.error("省份条件查询失败");
        // }
      });
    },
    // 获取行业数据
    getIndustryCategory() {
      Api_IndustryCategory().then(res => {
        this.industry = res.map(item => item.label);
        // if (res.stateCode === "1") {
        //     for (const elem of res.data.values()) {
        //         this.industry.push(elem.industryName);
        //     }
        // }
      });
    },
    //设置搜索条件
    setSearchParamsConditions() {
      this.searchParamsConditions.registCapi = this.registeredCapitalValue.join(
        ","
      );
      this.searchParamsConditions.startYear = this.setTimeValue.join(",");
      this.searchParamsConditions.province = this.provinceAreaValue.join(",");
      this.searchParamsConditions.industry = this.industryValue.join(",");
      // 用来匹配字典发给后端
      let financingObj={
      "天使/种子轮":"1",
      "Pre-A至A+轮":"2",
      "Pre-B至B+轮":"3",
      "C轮及以上":"4",
      "收购/并购/被并购":"5",
      "战略投资/融资":"6",
      "其他":"7"
      }
      var arr=[];
      for(var i=0;i<this.financingValue.length;i++){
        var item=this.financingValue[i];
        arr.push(financingObj[item]);
      }
      //  发给后端
      this.searchParamsConditions.financing=arr.join(',')
    },


    // // 设置标签通用
    // commonSetTags(value,title){
      
    //   if (value.length > 1) {
    //      title = value[0] + "...";
    //   } else if (value.length == 1) {
    //      title = value[0];
    //   }
    //   return title
    // },

    //设置tags
    setTagsList() {
      var registeredCapitalTitle = "";
      var setTimeTitle = "";
      var provinceAreaTitle = "";
      var industryTitle = "";
      var financingTitle = ""; //融资tags

     
      if (this.registeredCapitalValue.length > 1) {
         registeredCapitalTitle = this.registeredCapitalValue[0] + "...";
      } else if (this.registeredCapitalValue.length == 1) {
         registeredCapitalTitle = this.registeredCapitalValue[0];
      }
      if (this.setTimeValue.length > 1) {
         setTimeTitle = this.setTimeValue[0] + "...";
      } else if (this.setTimeValue.length == 1) {
         setTimeTitle = this.setTimeValue[0];
      }
      if (this.provinceAreaValue.length > 1) {
         provinceAreaTitle = this.provinceAreaValue[0] + "...";
      } else if (this.provinceAreaValue.length == 1) {
         provinceAreaTitle = this.provinceAreaValue[0];
      }
      if (this.industryValue.length > 1) {
         industryTitle = this.industryValue[0] + "...";
      } else if (this.industryValue.length == 1) {
         industryTitle = this.industryValue[0];
      }
      if (this.financingValue.length > 1) {
         financingTitle = this.financingValue[0] + "...";
      } else if (this.financingValue.length == 1) {
         financingTitle = this.financingValue[0];
      }

      // 这里是更多筛选
      // 联系方式
      var contactTitle=[];
      if(this.moreDetail.contact!==''){
         contactTitle[0] = this.moreDetail.contact=='1'? '有联系方式':'无联系方式'
      }
      // 纳税信用等级
      var taxcreditTitle=[];
      if(this.moreDetail.taxcredit!==''){
         taxcreditTitle[0] = this.moreDetail.taxcredit=='1'? 'A级纳税人':'非A级纳税人'
      }
     
      // 上市信息
      var listTitle=[];
       if(this.moreDetail.list!==''){
         listTitle[0] = this.moreDetail.list=='1'? 'A股上市企业':'非上市企业'
      }

      // 上市信息
      var listTitle=[];
       if(this.moreDetail.list!==''){
         listTitle[0] = this.moreDetail.list=='1'? 'A股上市企业':'非上市企业'
      }

      // 企业规模
      var scaleTitle=[];
      if(this.moreDetail.scale!==''){
        if(this.moreDetail.scale=='1'){
          scaleTitle[0]='微型企业'
        }else if(this.moreDetail.scale=='2'){
           scaleTitle[0]='小型企业'
        }else if(this.moreDetail.scale=='3'){
           scaleTitle[0]='中型企业'
        }else if(this.moreDetail.scale=='4'){
          scaleTitle[0]='大型企业'
        }else if(this.moreDetail.scale=='5'){
          scaleTitle[0]='超大型企业'
        }
      }

      // 商标信息
      var tminfoTitle=[];
       if(this.moreDetail.tminfo!==''){
         tminfoTitle[0] = this.moreDetail.tminfo=='1'? '有商标信息':'无商标信息'
      }


      // 专利信息
      var patentdetailTitle=[];
       if(this.moreDetail.patentdetail!==''){
         patentdetailTitle[0] = this.moreDetail.patentdetail=='1'? '有专利信息':'无专利信息'
      }


      // 软件著作权
      var softwarecopyTitle=[];
       if(this.moreDetail.softwarecopyrights!==''){
         softwarecopyTitle[0] = this.moreDetail.softwarecopyrights=='1'? '有软件著作权':'无软件著作权'
      }


      // 失信信息
      var shixinTitle=[];
       if(this.moreDetail.shixin!==''){
         shixinTitle[0] = this.moreDetail.shixin=='1'? '有失信信息':'无失信信息'
      }

      // 被执行信息
      var zhixingTitle=[];
       if(this.moreDetail.zhixing!==''){
         zhixingTitle[0] = this.moreDetail.zhixing=='1'? '有被执行信息':'无被执行信息'
      }

      // 行政处罚
      var penaltyTitle=[];
      if(this.moreDetail.penalty!==''){
         penaltyTitle[0] = this.moreDetail.penalty=='1'? '有行政处罚':'无行政处罚'
      }

      // 经营异常
      var opexceptionTitle=[];
      if(this.moreDetail.opexception!==''){
         opexceptionTitle[0] = this.moreDetail.opexception=='1'? '有经营异常':'无经营异常'
      }

      // 动产抵押
      var mpledgeTitle=[];
      if(this.moreDetail.mpledge!==''){
         mpledgeTitle[0] = this.moreDetail.mpledge=='1'? '有动产抵押':'无动产抵押'
      }


      // 股权出资
     var pledgeTitle=[];
      if(this.moreDetail.pledge!==''){
         pledgeTitle[0] = this.moreDetail.pledge=='1'? '有股权出质':'无股权出质'
      }



      // 清算信息
     var liquidationTitle=[];
      if(this.moreDetail.liquidation!==''){
         liquidationTitle[0] = this.moreDetail.liquidation=='1'? '有清算信息':'无清算信息'
      }
      
      var arr = [];
      arr = arr.concat(
        registeredCapitalTitle,
        setTimeTitle,
        provinceAreaTitle,
        industryTitle,
        financingTitle,
        contactTitle,
        taxcreditTitle,
        listTitle,
        scaleTitle,
        tminfoTitle,
        patentdetailTitle,
        softwarecopyTitle,
        shixinTitle,
        zhixingTitle,
        penaltyTitle,
        opexceptionTitle,
        mpledgeTitle,
        pledgeTitle,
        liquidationTitle
      );
      arr = arr.filter(function(item) {
        return item != "";
      });
      
      this.searchTags = arr;
    },
    //  是不是显示更多省份地区
    showMoreArea() {
      this.isShowMoreArea = !this.isShowMoreArea;
    },
    // 是不是显示更多行业门类
    showMoreCategory() {
      this.isShowMoreCategory = !this.isShowMoreCategory;
    },

    querySearch(queryString, cb) {
      if (queryString) {
        Api_SearchCompany({ companyName: queryString })
          .then(res => {
            // const options = res.returnData.map((item) => ({
            //   value: item.name,
            // }));
            cb(res.returnData);
          })
          .catch(e => {
            cb([]);
          });
      } else {
        cb([]);
      }

      // // 调用接口返回数据
      // Api_HistorySearch({
      //     key: this.searchForm.keyword
      // }).then(res => {
      //     if (res.stateCode === "1") {
      //         if (res.data !== "" && res.data !== null) {
      //             const arr = [];
      //             for (const elem of res.data) {
      //                 arr.push({
      //                     value: elem
      //                 });
      //                 this.restaurants = arr;
      //                 cb(this.restaurants);
      //             }
      //         } else {
      //             this.restaurants = [{
      //                 "value": '暂无搜索记录'
      //             }];
      //             cb(this.restaurants);
      //         }
      //     }
      // });
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    loadAll() {
      return this.restaurants;
    },
    handleSelect(val) {
      this.jump(val, 1);
    },
    optionsColorful(val, keyWord) {
      return val.replace(
        keyWord,
        `<span style="color:#ff4c38;font-weight: bold;">${keyWord}</span>`
      );
    }
  }
};
</script>

<style lang="scss">
$light-blue: #20a0ff;

.search-form {
  .input-search {
    // background-color: #20a0ff;
    // color: #ffffff;
    // border-color: #fff;
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    height: 48px;
    vertical-align: baseline;
    width: 100px;
    font-size: 17px;
    // padding: 0 30px;

    /*&:hover {*/
    /*    background-color: lighten(#fff, 3%);*/
    /*}*/

    // button {
    //   font-size: 17px;
    //   color: #fff;
    //   border-radius: 0;
    //   border: 0;

    //   i {
    //     font-size: 28px;
    //     margin-right: 10px;
    //     color: #555;
    //   }
    // }
  }

  .search-input input {
    width: 500px;
    height: 48px;
    border-radius: 0;
  }
}

.el-icon-arrow-down:hover,
.el-icon-arrow-up:hover {
  cursor: pointer;
}

#advanced-search-input {
  // .el-button.is-disabled,
  // .el-button.is-disabled:hover,
  // .el-button.is-disabled:focus {
  //   background-color: transparent !important;
  //   border-color: transparent !important;
  // }

  /deep/ {
    input {
      border: none;
    }
  }
}

#condition-box {
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>
<style lang="scss" scoped>
$light-blue: #4b9df3;
$light-red: #ee6867;


.fxb-tag span{
  line-height: initial!important;
}
.advance-bg {

  #advanced-search-container {
    position: relative;

    .top-tip {
      position: absolute;
      top: 19px;
      left: 24px;
      font-size: 18px;
      color: #fff;
    }
  }
}

.advanced-search-type {
  width: 824px;
  margin: 0 0 16px 290px;
  display: flex;

  li {
    margin-right: 8px;
    padding: 0 17px;
    height: 25px;
    line-height: 25px;
    list-style: none;
    text-align: center;
    font-size: 14px;
    color: #ffffff;

    &.checked {
      background: #fff;
      border-radius: 3px;
      color: #57559f;
    }

    &:hover {
      cursor: pointer;
    }
  }
}

.search-form {
  /*width: 1100px;*/
  margin: 0 auto;
  display: flex;

  #advanced-search-input {
    /*width: 824px;*/
    /*margin: 0 0 0 142px;*/
  }

  #show-advanced-search-more {
    /*color: #ffffff;*/
    line-height: 48px;
    font-size: 16px;
    margin-left: 25px;
    user-select: none;
  }
}

// .input-search {
//   background-color: $light-blue;
// }

.condition-tag {
  line-height: 32px;
  padding: 0 30px;
  margin-bottom: 9px;
  margin-top: 22px;
  color: #999;
}

#condition-box {
  padding: 29px 20px;
  background: #ffffff;

  .fxb-table-tool {
    padding: 20px 20px 5px 20px;
  }



  .fxb-tag span:first-child.active,
  .fxb-tag span:not(:first-child):hover,
  .fxb-tag span:not(:first-child).active {
    color: #fff;
    background-color: #20a0ff;
  }
}

.setHeight {
  height: 38px;
  overflow: hidden;
}

.type-select-wrap {
  background-color: #fff;
  width: 140px;
  line-height: 48px;
  position: relative;
  padding-right: 5px;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;

  // &::after {
  //   content: "";
  //   position: absolute;
  //   right: 0;
  //   top: 13px;
  //   height: 24px;
  //   border-right: 1px solid #e7ebee;
  // }

  /deep/ .el-select {
    line-height: normal;

    input {
      border: none;
    }
  }
}
</style>
<style lang="scss">
#advancedSearch{
  .el-checkbox-button .el-checkbox-button__inner{
    border-radius:4px;
    border:none;
    box-shadow: none;
  }

  .el-checkbox-button{
    margin-right:20px;
    
  }
  .el-checkbox-button__inner{
      background:none;
  }
  .is-checked{
    .el-checkbox-button__inner{
     
      color:#4b9df3;
    }
  }

}

</style>