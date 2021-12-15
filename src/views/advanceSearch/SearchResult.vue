<template>
  <el-main class="advance-container">
    <AdvancedSearch @showResultList="getResultList" :show.sync="isShow" @loadingState="getLoadingState" ref="advancedSearch" />

    <div class="result-box">
      <div class="fl" style="color: #999999; font-size: 12px;">
        共找到
        <span style="color: #20a0ff; font-size: 16px;">
          {{ showTotals }}
          <span v-if="showTotals === 1000">+</span>
        </span>家符合条件的企业
        <span v-if="totalRecords >= 200">，为您展示前200家企业</span>
      </div>
    </div>

    <div id="search-result-container">
      <el-table :data="tableData" id="search-result-table" style="width: 100%" v-loading="isLoading">
        <el-table-column prop="companyInfo" label="公司">
          <template slot-scope="scope" class="company-info">
            <div class="search-img-box">
              <template v-if="scope.row.tmImageUrl">
                <div class="box-img" :style="{backgroundImage:`url(${scope.row.tmImageUrl})`}"></div>
              </template>
              <template v-else>
                <div class="box-img"></div>
              </template>
            </div>
            <router-link
              :to="{path:'/creditFile/basicArchive', query: {id: scope.row.id, creditCode: scope.row.creditCode}}"
              target="_blank"
            >
              <h3 class="box-title" v-html="scope.row.name">{{ scope.row.name }}</h3>
            </router-link>
            <div class="info-text" style="display: flex; overflow: hidden; ">
              <span style="flex: 1;" v-html="scope.row.operName||'-'">法定代表人： {{ scope.row.operName||'-' }}</span>
              <span style="flex: 1;">成立时间： {{ scope.row.startDate | dateFormat('yyyy-MM-dd') }}</span>
              <span style="flex: 1;">注册资本： {{ scope.row.registCapi }}</span>
            </div>
            <p
              style="overflow: hidden; "
              v-html="scope.row.address==='NULL'?'-':scope.row.address"
            >地址： {{ scope.row.address==='NULL'?'-':scope.row.address }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="companyState" label="企业状态" width="120">
          <template slot-scope="scope" class="company-info">
            <el-tag type="success" size="small" effect="plain" v-if="scope.row.status==='存续'"> {{ scope.row.status }} </el-tag>
            <el-tag type="success" size="small" effect="plain" v-else-if="scope.row.status==='在业'"> {{ scope.row.status }} </el-tag>
            <el-tag size="small" type="danger" v-else-if="scope.row.status==='注销'"> {{ scope.row.status }} </el-tag>
            <el-tag type="danger" size="small" v-else> {{ scope.row.status }} </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="companyOperation" label="操作" width="120">
          <template slot-scope="scope">
            <div style="font-size: 24px;color:#d8d8d8;">
              <i
                class="el-icon-star-on"
                v-if="scope.row.attentionId"
                title="取消关注"
                @click="cancleAttention(scope.row)"
              ></i>
              <i class="el-icon-star-off" v-else title="添加关注" @click="openAddAttentionDialog(scope.row)"></i>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="fxb-search-page"
        v-show="totalRecords>0"
        :total="totalRecords"
        :page-size="pageSize"
        :current-page.sync="pageNo"
        @current-change="changeCurrentPage"
      />
    </div>

    <MyConcernGroup ref="addAttentionDialog" :addGroup="true" @submitEditGroup="addAttentionConfirm" />
  </el-main>
</template>

<script>
import MyConcernGroup from "@/views/userCenter/components/MyConcernGroup";
import AdvancedSearch from "@/components/AdvancedSearch";
import FxbHeader from "@/views/layouts/fxb/components/FxbHeader";
import { dateFormat } from "@/utils/index";
import { Api_AddAttention, Api_UpdateAttention, Api_AttentionCancel } from "@/api/userCenter/creditManage";

export default {
  name: "SearchResult",
  filters: {
    dateFormat,
  },
  components: {
    AdvancedSearch,
    FxbHeader,
    MyConcernGroup,
  },
  watch: {
       '$route' :{
          handler(nowR,oldR){
              if(nowR.path=="/advanceSearch/result"){
                if(nowR.query.isShow){
                    this.isShow=true;
                  }
              }
          },
          immediate:true
        },
    },
  data() {
    return {
      isShow:false, // 高级搜索是显示还是隐藏
      isLoading: false,
      attentionInfo: "",
      showTotals: 0, // 实际的查询总量
      tableData: [],
      pageNo: 1,
      pageSize: 10,
      totalRecords: 0, // 经过处理的查询总量
      saveInfo1: {},
    };
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
        // city: this.saveInfo1.city,
        creditCode: this.saveInfo1.creditCode,
        // legalPerson: this.saveInfo1.operName,
        groupIds: groupIds,
      })
        .then((res) => {
          this.$refs.addAttentionDialog.closeLoading();
          this.$refs.addAttentionDialog.closeDialog();
          this.$message.success("添加关注成功");
          // this.$set(this.saveInfo1, "attentionId", res.data.id);
          this.changeCurrentPage();
        })
        .catch((e) => {
          this.$refs.addAttentionDialog.closeLoading();
          this.$message.success("添加关注失败");
        });
    },
    // 取消关注
    cancleAttention(row) {
      this.$confirm("确认取消关注该企业吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        Api_AttentionCancel(row.attentionId)
          .then((res) => {
            this.$message.success("取消关注成功");
            this.changeCurrentPage();
            // this.$set(row, "attentionId", "");
          })
          .catch((e) => {
            this.$message.success(e);
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
  },
};
</script>

<style lang="scss">
.company-info {
  overflow: hidden;

  .info-text {
    display: flex;

    span {
      flex: 1;
    }
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
#search-result-table {
  &.el-table {
    color: #a2a3ae;
  }

  &.el-table th > .cell {
    color: #4b9df3;
  }
}

.fxb-search-page {
  position: relative;
  text-align: right;
  margin-top: 0;

  &.el-pagination {
    padding: 10px 31px;
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
    margin-right: 6px;
    display: inline-block;
  }
}
</style>

<style lang="scss" scoped>
.advance-container {
  height: 100%;
  margin-bottom: 45px;
}

.search-img-box {
  text-align: center;
  float: left;
  width: 133px;
  height: 96px;
  overflow: hidden;
  border: 1px solid #f8f8f8;
  margin-right: 20px;
  margin-left: 12px;

  .box-img {
    width: 100%;
    background-image: url("../../assets/images/default-logo.png");
    height: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
  }
}

.box-title {
  margin: 8px 0;
  font-size: 18px;
  color: #333;
  height: 25px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: 600;
}

#search-result-container {
  background-color: #ffffff;
}

.result-box {
  overflow: hidden;
  line-height: 57px;
  height: 57px;
  padding: 0 28px;
}

.el-icon-star-on:hover,
.el-icon-star-off:hover {
  cursor: pointer;
}
</style>
