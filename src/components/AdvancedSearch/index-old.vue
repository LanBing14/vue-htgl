<template>
  <div>
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
              <el-option v-for="(el, index) in typeList" :key="index" :label="el.type" :value="el.value"></el-option>
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

      <el-form id="condition-box" label-width="100px">
        <el-form-item label="注册资本：" class="fxb-tag-list">
          <span
            v-for="(item, index) in registeredCapital"
            :key="index"
            :class="{active: index === searchCurrent1}"
            @click="addTag($event, index, '1')"
          >{{ item }}</span>
        </el-form-item>
        <el-form-item label="成立日期：" class="fxb-tag-list">
          <span
            v-for="(item, index) in setTime"
            :key="index"
            :class="{active: index === searchCurrent2}"
            @click="addTag($event, index, '2')"
          >{{ item }}</span>
        </el-form-item>
        <el-form-item label="省份地区：" class="fxb-tag-list" style="position: relative;">
          <div :class="{setHeight: !isShowMoreArea}">
            <span
              v-for="(item, index) in provinceArea"
              :key="index"
              :class="{active: index === searchCurrent3}"
              @click="addTag($event, index, '3')"
            >{{ item }}</span>
          </div>
          <i
            :class="{'el-icon-arrow-down': !isShowMoreArea, 'el-icon-arrow-up': isShowMoreArea}"
            @click="showMoreArea()"
            style="position: absolute; right: 0; bottom: 15px;"
          ></i>
        </el-form-item>
        <el-form-item label="行业门类：" class="fxb-tag-list" style="position: relative;">
          <div :class="{setHeight: !isShowMoreCategory}">
            <span
              v-for="(item, index) in industry"
              :key="index"
              :class="{active: index === searchCurrent4}"
              @click="addTag($event, index, '4')"
            >{{ item }}</span>
            <i
              :class="{'el-icon-arrow-down': !isShowMoreCategory, 'el-icon-arrow-up': isShowMoreCategory}"
              @click="showMoreCategory()"
              style="position: absolute; right: 0; bottom: 15px;"
            ></i>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script type="text/jsx">
import {
  Api_AdvanceSearch,
  Api_HistorySearch,
  Api_IndustryCategory,
  Api_Province,
} from "@/api/advanceSearch";
import { Api_SearchCompany } from "@/api/creditManagement/customerProfile/customerManagement.js";

export default {
  name: "AdvancedSearch",
  props: {
    nowPage: Number,
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
        { type: "经营范围", value: "5" },
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
        queryValue: "", // 查询的值
        queryType: 0, // 默认查询类别为全部， 0：全部  1：企业名称 2：法人代表  3：注册地址  4：品牌产品   5：经营范围  6：股东高管   7：信用代码
      },
      show: false,
      searchTags: [],
      tagsId: "",
      searchCurrent1: null,
      searchCurrent2: null,
      searchCurrent3: null,
      searchCurrent4: null,
      registeredCapital: ["100万以下", "100-500万", "500-1000万", "1000-5000万", "5000万以上"],
      setTime: ["不足1年", "1-5年", "5-10年", "10-20年", "20-30年", "30年以上"],
      provinceArea: [],
      industry: [],
      isShowMoreArea: false,
      isShowMoreCategory: false,
      restaurants: [],
      state1: "",
      state2: "",
      isLoading: false,
    };
  },
  computed: {
    isLoginState() {
      return !!this.$store.getters.userInfo.id;
    },
  },
  watch: {
    $route(route) {
      if (route.query.keyword) {
        this.searchForm.keyword = this.$route.query.keyword;
        this.searchByConditon();
      }
    },
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
    this.searchForm.keyword = this.$route.query.keyword ? this.$route.query.keyword : this.searchForm.keyword;
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
              idx: this.current,
            },
          });
          // }
        }
      } else {
        if (tag) {
          this.$router.push({
            path: "/creditFile/basicArchive",
            query: { id: val.id, creditCode: val.creditCode },
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
      const typeName = this.typeList.find((item) => item.value === value).type;
      // const elVal = e.target.innerHTML.replace(/\s+/g, '');
      this.searchParamsConditions.queryType = value;
      if (typeName !== "全部") {
        this.placeholderTxt = "请输入" + typeName.replace(/\s+/g, "") + "关键词";
      } else {
        this.placeholderTxt = "请输入关键词";
      }
    },
    // 根据条件分页查询
    searchByConditon() {
      this.$refs.searchAutocomplete.activated = false;
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

      this.searchDisabled = true;
      Api_AdvanceSearch(this.searchParamsConditions, this.searchParamsConditions.queryType)
        .then((res) => {
          this.searchDisabled = false;
          const keywordReg = new RegExp(this.searchForm.keyword, "i");
          res.returnData.forEach((item) => {
            const name = item.name || "";
            const nameWord = name.match(keywordReg);
            // 匹配企业名称
            if (nameWord) {
              item.name = name.replace(keywordReg, `<span style="color: #ff4c38;">${nameWord[0]}</span>`);
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
        .catch((e) => {
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
      this.show = !this.show;
    },
    // 重置选项
    resetCondition() {
      this.searchTags = [];
      this.searchCurrent1 = null;
      this.searchCurrent2 = null;
      this.searchCurrent3 = null;
      this.searchCurrent4 = null;
      this.searchParamsConditions.registCapi = "";
      this.searchParamsConditions.startYear = "";
      this.searchParamsConditions.province = "";
      this.searchParamsConditions.industry = "";
      this.isShowMoreArea = false;
      this.isShowMoreCategory = false;
      this.searchByConditon();
    },
    addTag(e, index, searchCurrentName) {
      const getChooseName = e.currentTarget.innerHTML;

      // 注册资本
      if (searchCurrentName === "1") {
        this.searchCurrent1 = index;

        const hasTagCapital = this.registeredCapital.filter((item) => this.searchTags.indexOf(item) > -1);
        const getIndex1 = this.searchTags.indexOf(hasTagCapital[0]);
        
        if (this.searchTags.length !== 0 && hasTagCapital.length !== 0) {
          this.searchTags.splice(getIndex1, 1, getChooseName);
        } else {
          this.searchTags.push(getChooseName);
        }
        // if(this.searchTags.indexOf(getChooseName)<0){
        //   this.searchTags.push(getChooseName);
        // }
        
        this.searchParamsConditions.registCapi = getChooseName;
        this.searchByConditon();
      }

      // 成立日期
      if (searchCurrentName === "2") {
        this.searchCurrent2 = index;

        const hasTime = this.setTime.filter((item) => this.searchTags.indexOf(item) > -1);
        const getIndex2 = this.searchTags.indexOf(hasTime[0]);

        if (this.searchTags.length !== 0 && hasTime.length !== 0) {
          this.searchTags.splice(getIndex2, 1, getChooseName);
        } else {
          this.searchTags.push(getChooseName);
        }

        this.searchParamsConditions.startYear = getChooseName;
        this.searchByConditon();
      }

      // 省份地区
      if (searchCurrentName === "3") {
        this.searchCurrent3 = index;

        const hasArea = this.provinceArea.filter((item) => this.searchTags.indexOf(item) > -1);
        const getIndex3 = this.searchTags.indexOf(hasArea[0]);

        if (this.searchTags.length !== 0 && hasArea.length !== 0) {
          this.searchTags.splice(getIndex3, 1, getChooseName);
        } else {
          this.searchTags.push(getChooseName);
        }

        this.searchParamsConditions.province = getChooseName;
        this.searchByConditon();
      }

      // 行业门类
      if (searchCurrentName === "4") {
        this.searchCurrent4 = index;

        const hasIndustry = this.industry.filter((item) => this.searchTags.indexOf(item) > -1);
        const getIndex4 = this.searchTags.indexOf(hasIndustry[0]);

        if (this.searchTags.length !== 0 && hasIndustry.length !== 0) {
          this.searchTags.splice(getIndex4, 1, getChooseName);
        } else {
          this.searchTags.push(getChooseName);
        }

        this.searchParamsConditions.industry = getChooseName;
        this.searchByConditon();
      }
    },
    // 关闭搜索条件
    handleClose(tag) {
      this.searchTags.splice(this.searchTags.indexOf(tag), 1);

      const hasTagCapital = this.registeredCapital.includes(tag);
      const hasTime = this.setTime.includes(tag);
      const hasArea = this.provinceArea.includes(tag);
      const hasIndustry = this.industry.includes(tag);

      if (hasTagCapital) {
        this.searchCurrent1 = null;
        this.searchParamsConditions.registCapi = "";
        this.searchByConditon();
      }
      if (hasTime) {
        this.searchCurrent2 = null;
        this.searchParamsConditions.startYear = "";
        this.searchByConditon();
      }
      if (hasArea) {
        this.searchCurrent3 = null;
        this.searchParamsConditions.province = "";
        this.searchByConditon();
      }
      if (hasIndustry) {
        this.searchCurrent4 = null;
        this.searchParamsConditions.industry = "";
        this.searchByConditon();
      }
    },
    // 获取各省数据
    getProvince() {
      Api_Province().then((res) => {
        this.provinceArea = res.map((item) => item.name);
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
      Api_IndustryCategory().then((res) => {
        this.industry = res.map((item) => item.label);
        // if (res.stateCode === "1") {
        //     for (const elem of res.data.values()) {
        //         this.industry.push(elem.industryName);
        //     }
        // }
      });
    },
    showMoreArea() {
      this.isShowMoreArea = !this.isShowMoreArea;
    },
    showMoreCategory() {
      this.isShowMoreCategory = !this.isShowMoreCategory;
    },
    querySearch(queryString, cb) {
      if (queryString) {
        Api_SearchCompany({ companyName: queryString })
          .then((res) => {
            // const options = res.returnData.map((item) => ({
            //   value: item.name,
            // }));
            cb(res.returnData);
          })
          .catch((e) => {
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
      return (restaurant) => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
      };
    },
    loadAll() {
      return this.restaurants;
    },
    handleSelect(val) {
      this.jump(val, 1);
    },
    optionsColorful(val, keyWord) {
      return val.replace(keyWord, `<span style="color:#ff4c38;font-weight: bold;">${keyWord}</span>`);
    },
  },
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
$light-blue: #20a0ff;
$light-red: #ee6867;

.advance-bg {
  /*min-height: 169px;*/
  /*background: #ffffff url(../../assets/images/searchBg2.png) no-repeat center bottom;*/
  /*background-size: cover;*/

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
  line-height: 28px;
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

  .fxb-tag-list span {
    display: inline-block;
    line-height: 30px;
    padding: 0 10px;
    border-radius: 5px;
    margin-right: 20px;
    cursor: pointer;
  }

  .fxb-tag-list span:first-child.active,
  .fxb-tag-list span:not(:first-child):hover,
  .fxb-tag-list span:not(:first-child).active {
    color: #fff;
    background-color: #20a0ff;
  }
}

.setHeight {
  height: 35px;
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

  &::after {
    content: "";
    position: absolute;
    right: 0;
    top: 13px;
    height: 24px;
    border-right: 1px solid #e7ebee;
  }

  /deep/ .el-select {
    line-height: normal;

    input {
      border: none;
    }
  }
}
</style>
