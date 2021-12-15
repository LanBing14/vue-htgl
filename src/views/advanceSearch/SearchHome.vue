<template>
  <div class="advance-container">
    <div class="search-bg">
      <el-main class="search-content">
        <div class="search-wrap">
          <ul class="search-type">
            <li
              v-for="(item, index) in typeList"
              :key="index"
              :class="{checked:item.value === currentType}"
              @click="handleTypeChange(item.value)"
            >{{ item.label }}</li>
          </ul>
          <el-form
            ref="searchForm"
            :model="searchFormData"
            class="search-form-wrap"
            auto-complete="on"
            @submit.native.prevent
          >
            <!-- 已登录用户当鼠标获取焦点的时候显示搜索历史 -->
            <el-autocomplete
              ref="searchAutocomplete"
              v-if="isLoginState"
              v-model.trim="searchFormData.keyword"
              :popper-append-to-body="false"
              :placeholder="placeholderTxt"
              :fetch-suggestions="querySearch"
              :disabled="searchDisabled"
              size="large"
              class="input-wrap"
              clearable
              @keyup.enter.native="jump()"
              @select="selectJump"
            >
              <template slot-scope="{ item }">
                <div class="name" v-html="optionsColorful(item.name,searchFormData.keyword)"></div>
              </template>
              <el-button slot="append" @click="jump()">查询</el-button>
            </el-autocomplete>

            <el-input
              v-else
              :placeholder="placeholderTxt"
              class="input-wrap"
              v-model.trim="searchFormData.keyword"
              :disabled="searchDisabled"
              size="large"
              clearable
              id="search-input"
              @keyup.enter.native="jump()"
            >
              <el-button slot="append" :disabled="searchDisabled" @click="jump()">查 询</el-button>
            </el-input>
          </el-form>
          <div class="hot-wrap">
            <RadioText :options="hotSearchOptions" valueKey="value" @change="hotSearchChange">
              <span slot="name" class="hot-label">热搜关键词：</span>
            </RadioText>
        
          </div>
        </div>
         <div style="position:absolute;top:80%;left:177px;z-index: -1;" class="clearfix">
           <!-- 高级搜索 -->
            <div class="fl" style="width:220px"> 
                  <div class="btnSearch advancedSearch" @click="jumpToAdvancedSearch">
                      <div class="font">
                          <div class="mainFont">高级搜索</div>
                          <div class="smallFont">支持多条件查询企业</div>
                      </div>
                  </div>
            </div>

           <!-- 批量查询 -->
           <div class="fl" style="width:220px">
                <div class="btnSearch  batchQuery"  @click="()=>{this.$router.push({path:'/checkAll'})}">
                    <div class="font">
                        <div class="mainFont">批量查询</div>
                        <div class="smallFont">批量查询企业信息</div>
                    </div>
                </div>
           </div>

         </div>
      </el-main>
     
    </div>
    <el-main>
      <div class="search-result-container">
        <div class="flex fx-wrap">
          <span class="label">最新风险</span>
          <div class="flex-primary con">
            <el-tabs v-model="curNews">
              <el-tab-pane label="行政处罚" name="1"></el-tab-pane>
              <el-tab-pane label="经营异常" name="2"></el-tab-pane>
              <el-tab-pane label="失信被执行人" name="3"></el-tab-pane>
              <el-tab-pane label="裁判文书" name="4"></el-tab-pane>
              <el-tab-pane label="工商变更" name="6"></el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <el-tabs v-model="curNews" class="main-tabs-wrap">
          <el-tab-pane label="行政处罚" name="1">
            <List code-desc="1" @toCompanyInfo="selectJump"></List>
          </el-tab-pane>
          <el-tab-pane label="经营异常" name="2">
            <List code-desc="2" @toCompanyInfo="selectJump"></List>
          </el-tab-pane>
          <el-tab-pane label="失信被执行人" name="3">
            <List code-desc="3" @toCompanyInfo="selectJump"></List>
          </el-tab-pane>
          <el-tab-pane label="裁判文书" name="4">
            <List code-desc="4" @toCompanyInfo="selectJump"></List>
          </el-tab-pane>
          <el-tab-pane label="工商变更" name="6">
            <List code-desc="5" @toCompanyInfo="selectJump"></List>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-main>
  </div>
</template>

<script>
import { dateFormat } from "@/utils/index";
import MyConcernGroup from "@/views/userCenter/components/MyConcernGroup";
import AdvancedSearch from "@/components/AdvancedSearch";
import FxbHeader from "@/views/layouts/fxb/components/FxbHeader";
import RadioText from "@/components/RadioText";
import List from "./components/Comp1";
import { Api_earningQueryKey, Api_earningQueryRisk } from "@/api/advanceSearch";
import { Api_AddAttention, Api_UpdateAttention } from "@/api/userCenter/creditManage";

import { Api_SearchCompany } from "@/api/creditManagement/customerProfile/customerManagement.js";

export default {
  name: "SearchHome",
  filters: {
    dateFormat,
  },
  components: {
    AdvancedSearch,
    FxbHeader,
    MyConcernGroup,
    RadioText,
    List,
  },
  data() {
    const textObj = {
      0: "输入企业名称或统一社会信用代码查询",
      1: "输入法人姓名查询",
      6: "输入高管/股东姓名查询",
      3: "输入注册地址查询",
      5: "输入经营范围关键词查询",
    };
    return {
      isLoading: false,
      attentionInfo: "",
      showTotals: 0, // 实际的查询总量
      tableData: [],
      pageNo: 1,
      pageSize: 10,
      totalRecords: 0, // 经过处理的查询总量
      saveInfo1: {},

      currentType: "0",
      typeList: [
        {
          label: "查企业",
          value: "0",
        },
        {
          label: "查法人",
          value: "1",
        },
        {
          label: "查高管/股东",
          value: "6",
        },
        {
          label: "查注册地址",
          value: "3",
        },
        {
          label: "查经营范围",
          value: "5",
        },
      ],
      searchFormData: {
        keyword: "",
      },
      searchDisabled: false,
      hotSearchOptions: [], // 热搜关键词
      curNews: "1", // 当前选中的最新风险
      placeholderTxt: textObj["0"],
      placeholderTxtObj: textObj,
    };
  },
  computed: {
    isLoginState() {
      return !!this.$store.getters.userInfo.id;
    },
    // placeholderTxt() {
    //     return this.typeList.find(i => i.value === this.currentType).label + '查询'
    // }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
    tableData: {
      handler: function () {},
      immediate: true,
    },
  },
  created() {
    Api_earningQueryKey().then((res) => {
      this.hotSearchOptions = res.map((item) => ({
        label: item.content,
        value: item.content,
      }));
    });
    Api_earningQueryRisk().then((res) => {});
  },
  methods: {
    changeCurrentPage() {
      this.$refs.advancedSearch.advanceSearch(this.pageNo);
    },
    // 添加关注-确认
    addAttentionConfirm(groupIds) {
      this.$refs.addAttentionDialog.openLoading();
      Api_AddAttention({
        companyId: this.saveInfo1.id,
        companyName: this.saveInfo1.name.replace(/<[^>]+>/g, ""),
        city: this.saveInfo1.city,
        creditCode: this.saveInfo1.creditCode,
        legalPerson: this.saveInfo1.operName,
        groupIds: groupIds,
      }).then((res) => {
        this.$refs.addAttentionDialog.closeLoading();
        this.$refs.addAttentionDialog.closeDialog();
        if (res.stateCode === "1") {
          this.$message.success("添加关注成功");
          this.$set(this.saveInfo1, "attentionId", res.data.id);
        } else {
          this.$message.success("添加关注失败");
        }
      });
    },
    // 取消关注
    cancleAttention(row) {
      this.$confirm("确认取消关注该企业吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        Api_UpdateAttention({
          attentionId: row.attentionId,
          status: "-1", // 0 关注 -1 取消关注
        }).then((res) => {
          if (res.stateCode === "1") {
            this.$message.success("取消关注成功");
            this.$set(row, "attentionId", "");
          } else {
            this.$message.success("取消关注失败");
          }
        });
      });
    },
    // 添加关注-选择分组
    openAddAttentionDialog(row) {
      this.saveInfo1 = row;
      this.$refs.addAttentionDialog.openDialog();
    },
    getResultList(data) {
      if (data) {
        this.tableData = data.returnData;
        this.showTotals = data.realTotalCount > 1000 ? 1000 : data.realTotalCount;
        this.totalRecords = data.totalCount;
        this.isLoading = false;
      }
    },
    getLoadingState(state) {
      this.isLoading = state;
    },
    // 查询类型change
    handleTypeChange(value) {
      this.currentType = value;
      this.placeholderTxt = this.placeholderTxtObj[value];
    },
    querySearch(queryString, cb) {
      if (!queryString) {
        cb([]);
        return;
      }
      Api_SearchCompany({ companyName: queryString })
        .then((res) => {
          const options = res.returnData.map((item) => ({
            name: item.name,
            value: item.name,
            id: item.id,
            creditCode: item.creditCode,
          }));
          cb(options);
        })
        .catch((e) => {
          cb([]);
        });
      // // 调用接口返回数据
      // Api_HistorySearch({
      //     key: this.searchFormData.keyword
      // }).then(res => {
      //     if (res !== "" && res !== null) {
      //         const arr = res.map(value => ({
      //             value
      //         }));
      //         cb(arr);
      //     } else {
      //         cb([{
      //             "value": '暂无搜索记录'
      //         }]);
      //     }
      // });
    },


    // 跳转到高级搜索
    jumpToAdvancedSearch(){
      this.$router.push({
          path: "/advanceSearch/result",
          //  自动展开高级搜索
          query:{
            isShow:true
          }
      })
    },
    jump() {
      if (!this.isLoginState) {
        this.$login.login();
        return;
      }
      if (!this.searchFormData.keyword) {
        this.$message.warning("请输入查询关键词");
        return false;
      } else {
        if (this.searchFormData.keyword.length < 2) {
          this.$message.warning("关键词长度不少于2个字");
          return false;
        }
        this.$router.push({
          path: "/advanceSearch/result",
          query: {
            keyword: this.searchFormData.keyword,
            // type: this.searchParamsConditions.queryType,
            idx: this.currentType,
            
          },
        });
      }
    },
    selectJump(data) {
      if (!this.isLoginState) {
        this.$login.login();
        return;
      }
      this.$router.push({
        path: "/creditFile/basicArchive",
        query: {
          creditCode: data.creditCode,
          id: data.id,
        },
      });
    },
    hotSearchChange(value) {
      if (!this.isLoginState) {
        this.$login.login();
        return;
      }
      const findRes = this.hotSearchOptions.find((item) => item.value === value);
      this.$router.push({
        path: "/advanceSearch/result",
        query: {
          keyword: findRes.label,
          idx: this.currentType,
        },
      });
    },
    fetchDataFn() {},
    optionsColorful(val, keyWord) {
      return val.replace(keyWord, `<span style="color:#F56C6C">${keyWord}</span>`);
    },
  },
};
</script>
<style lang="scss" scoped>
.advance-container {
  height: 100%;
  margin-bottom: 45px;
}

.search-bg {
  height: 453px;
  margin-top: -50px;
  padding-top: 50px;
  background: url("~@/assets/images/search-home-bg.jpg") no-repeat center/cover;

  .search-content {
    height: 100%;
    position: relative;
  }

  .search-wrap {
    width: 920px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    /*搜索类型*/
    .search-type {
      margin-bottom: 16px;

      li {
        display: inline-block;
        margin-right: 50px;
        font-size: 16px;
        cursor: pointer;
        color: #fff;
        border-radius: 3px;
        padding: 0 11px;
        text-align: center;
        line-height: 28px;
      }

      li.checked {
        background-color: #f55f57;
      }
    }

    .search-form-wrap {
      /deep/ .input-wrap {
        width: 100%;

        input::placeholder {
          font-size: 18px;
          color: #c0c4d1;
        }

        .el-input__inner {
          padding-left: 18px;
          height: 60px;
          line-height: 60px;
          border-top-left-radius: 6px;
          border-bottom-left-radius: 6px;
        }

        .el-input-group__append {
          border: none;
          border-top-right-radius: 6px;
          border-bottom-right-radius: 6px;

          button {
            height: 60px;
            width: 134px;
            border: none;
            font-weight: bold;
            font-size: 20px;
            border-radius: 0;
            background-color: #20a0ff;
            color: #fff;
            border-top-right-radius: 6px;
            border-bottom-right-radius: 6px;
          }
        }
      }
    }
  }
}

.hot-wrap {
  margin-top: 26px;
  overflow: hidden;

  .radio-text-wrap {
    color: #fff;
    width: 1300px;
  }

  /deep/ {
    .hot-label {
      padding-right: 5px;
      font-weight: normal;
      padding-left: 22px;
      background: url("~@/assets/images/hot.png") no-repeat 0 0;
    }
  }
}

.search-result-container {
  background-color: #fff;
  padding: 16px 27px;

  .fx-wrap {
    position: relative;
    padding-bottom: 2px;
    color: #333;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 1px;
      background-color: #f5f5f5;
    }

    .label {
      font-size: 16px;
      margin-right: 50px;
    }

    /deep/ {
      .el-tabs__header {
        margin-bottom: 0;
      }

      .el-tabs__active-bar {
        height: 3px;
      }

      .el-tabs__nav-wrap::after {
        content: none;
      }

      .el-tabs__item {
        color: inherit;
        height: auto;
        line-height: normal;
        padding-bottom: 13px;
      }
    }
  }

  .main-tabs-wrap /deep/ {
    .el-tabs__header {
      display: none;
    }

    .el-tabs__content {
      overflow: initial;
    }
  }
}

.clearfix:after{
  display: block;
  clear: both;
  content:''
}

.btnSearch{
    width: 60px;
    height: 60px;
    border-radius: 4px;
    transition: 0.5s;
    transform: all;
    cursor: pointer;
    position: relative;
    &:hover{
      width: 212px;
    }

    .font{
      position:absolute;
      top:10px;
      left:69px;
      width: 146px;

      .mainFont{
        color: #fff;
        font-family: "微软雅黑";
        font-size:16px;
        line-height:16px;
      }
      .smallFont{
        color:#b0c5e7;
        font-size:13px;   
        padding-top: 11px;   
        font-family: "微软雅黑";
      }
    }
}

.advancedSearch{
  background-color: #3c77c8;
  background-image: url("../../assets/images/searchBtn/advancedSearch.png");
  background-repeat: no-repeat;
  background-position: 11px 11px;
}
.batchQuery{
    background-color: #2585b2;
    background-image: url("../../assets/images/searchBtn/222.png");
    background-repeat: no-repeat;
    background-position: 11px 11px;
}
.fl{
  float: left;
}
</style>
