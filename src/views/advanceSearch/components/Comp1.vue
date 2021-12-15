<template>
  <div v-loading="loading" class="list-content">
    <div class="list">
      <div v-for="(el, index) in list" :key="index" class="item flex" @click="toCompanyInfo(el)">
        <div class="name">
          <el-tooltip
            class="tooltip-wrap"
            effect="dark"
            :offset="-20"
            :content="el.companyName"
            placement="top"
          >
            <span>{{ el.companyName }}</span>
          </el-tooltip>
        </div>
        <div class="person">
          <template v-if="el.operName&&el.operName.length>4">
            <el-tooltip
              class="tooltip-wrap"
              effect="dark"
              :offset="-20"
              :content="el.operName"
              placement="top"
            >
              <span>{{ el.operName?el.operName.substr(0,4)+'...':'-' }}</span>
            </el-tooltip>
          </template>
          <template v-else>{{ el.operName }}</template>
        </div>
        <div class="date">{{ el.changeTime }}</div>
      </div>
    </div>
    <div v-if="!list.length" class="no-data">
      <span>暂无记录！</span>
    </div>
    <div class="pagination-wrap">
      <el-pagination
        v-if="total"
        :total="total"
        :current-page.sync="currentPage"
        :page-size.sync="pageSize"
        background
        class="tableWrapper-pagination"
        layout="total, prev, pager, next, jumper"
        @size-change="fetchData"
        @current-change="fetchData"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { Api_earningQueryRisk } from "@/api/advanceSearch";

export default {
  name: "Comp1",
  props: {
    codeDesc: String,
    dataFn: Function,
  },
  data() {
    return {
      list: [],
      total: 0,
      currentPage: 1,
      pageSize: 20,
      loading: false,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.loading = true;
      Api_earningQueryRisk({
        codeDesc: this.codeDesc,
        currentPage: this.currentPage - 1,
        pageSize: this.pageSize,
      })
        .then((res) => {
          this.loading = false;
          this.list = res.data;
          this.total = res.totalRecordNumber;
        })
        .catch((e) => {
          this.loading = false;
          this.$message.error(e);
        });
    },
    toCompanyInfo({ companyId, creditCode }) {
      this.$emit("toCompanyInfo", {
        id: companyId,
        creditCode: creditCode,
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import "~@/styles/element-variables.scss";

.list {
  display: flex;
  flex-wrap: wrap;
  padding-left: 5px;

  .item {
    width: 50%;
    padding: 15px 0;
    color: #999;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      color: $--color-primary !important;

      .name {
        color: $--color-primary !important;
      }
    }

    &:nth-child(1),
    &:nth-child(2) {
      padding-top: 25px;
    }

    &:nth-last-child(1),
    &:nth-last-child(2) {
      padding-bottom: 20px;
    }

    &:nth-child(2n + 1) {
      border-right: 1px solid #eee;
    }

    &:nth-child(2n) {
      .name {
        margin-left: 40px;
      }
    }

    .name {
      position: relative;
      flex: 1;
      color: #666;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      .tooltip-wrap {
        position: relative;
      }

      &::before {
        content: "";
        display: inline-block;
        width: 4px;
        vertical-align: middle;
        height: 4px;
        margin-right: 12px;
        background-color: $--color-primary;
      }
    }

    .tag {
      width: 100px;
    }

    .person {
      width: 100px;
    }

    .date {
      width: 100px;
    }
  }
}

.pagination-wrap {
  text-align: right;
  border-top: 1px solid #f5f5f5;
  margin-left: -27px;
  margin-right: -27px;
  padding: 10px 27px 0;
}

.no-data {
  text-align: center;
  padding: 50px;
}
</style>
