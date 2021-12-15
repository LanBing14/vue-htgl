<template>
  <div>
    <div class="title-name">
      <span class="name-1">催款通知单</span>
    </div>
    <div class="search-wrap">
      <el-form :model="listQuery" :inline="true">
        <el-form-item>
          <el-input
            style="width: 200px"
            :clearable="true"
            v-model="listQuery.code"
            placeholder="催款单编号"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            :clearable="true"
            value-format="yyyy-MM-dd"
            style="width： 320px"
            @change="dateChange"
            v-model="daterange"
            type="daterange"
            range-separator="至"
            start-placeholder="生成开始日期"
            end-placeholder="生成截止日期"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search"
            >查询</el-button
          >
          <el-button icon="el-icon-refresh" @click="handleRest">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="title">
      催款单列表
      <div class="btns">
        <el-button type="success" @click="exportFn">导出</el-button>
      </div>
    </div>

    <div class="accountDetails">
      <div class="mt20 tab-wrap">
        <TableWrapper
          @onCheckedChange="onCheckedChange"
          :isShowIndex="false"
          :checkbox="true"
          ref="table"
          :fetchDataFn="api_getDunningNotice"
          :query="listQuery"
          :columns="tableCol"
        />
      </div>
    </div>
    <img
      src="@/assets/images/bg/no.jpg"
      style="margin: 0 auto; display: block; display: none"
    />
  </div>
</template>
<script>
import { api_getDunningNotice } from "@/api/creditManagement/companyAccount/companyAccount";
export default {
  data() {
    return {
      api_getDunningNotice,
      listQuery: {
        code: "",
        startDate: "",
        endDate: "",
      },
      activityIds: [],
      daterange: [],
      tableCol: [
        { key: "CODE", label: "催款单编号", align: "left",
         render: (h, data, row) => {
            return (
              <span onClick={this.rowClick.bind(this, row)} style="color:#4b9df3;cursor:pointer">
                {data}
              </span>
            );
          },

         },
        { key: "ENTERPRISE_NAME", label: "欠费总计", align: "left",
          render: (h, data, row) => {
            return (
              <span>
                {row.AMOUNT_RECEIVABLE}
              </span>
            );
          },
         },
        {
          key: "ARRIVAL_AMOUNT_RECEIVED",
          label: "累计付款（元）",
          align: "left",
          render: (h, data, row) => {
            return (
              <span>
                {data || 0}
              </span>
            );
          },
        },
        {
          key: "BUILD_TIME2",
          label: "收到日期",
          align: "left",
          render: (h, data, row) => {
            return (
              <span>
                {data.slice(0,10)}
              </span>
            );
          },
        },
        // { key: "CUMULATIVE_SETTLEMENT_STATUE", label: "催款状态", align: "left" },
      ],
    };
  },
  computed: {
    userInfo() {
      return this.$store.getters.userInfo;
    },
  },
  created() {},
  methods: {
    handleRest() {
      this.listQuery.code = "";
      this.daterange = [];
      this.listQuery.startDate = "";
      this.listQuery.endDate = "";
      this.$refs.table.fetchData();
    },
    onCheckedChange(data) {
      this.activityIds = data.map((v) => v.ID) || [];
    },
    exportFn() {
      let activityIds = this.activityIds.join(",");
      window.location =  `${process.env.VUE_APP_BASE_API}/park/dunningNotice/excel?activityIds=${activityIds}&code=${this.listQuery.code}&startDate=${this.listQuery.startDate}&endDate=${this.listQuery.endDate}&saasCode=${this.userInfo.parkCode}&enterpriseId=${this.userInfo.saasCode}`
      // window.open(
      //   `${process.env.VUE_APP_BASE_API}/park/dunningNotice/excel?activityIds=${activityIds}&code=${this.listQuery.code}&startDate=${this.listQuery.startDate}&endDate=${this.listQuery.endDate}&saasCode=${this.userInfo.parkCode}&enterpriseId=${this.userInfo.saasCode}`
      // );
    },
    rowClick(row) {
      this.$router.push({
        name: "reminderNoticeDetail",
        params: {
          id: row.ID,
        },
      });
    },
    dateChange() {
      if (!this.daterange) {
        this.daterange = []
      };
      this.listQuery.startDate = this.daterange[0] || "";
      this.listQuery.endDate = this.daterange[1] || "";
    },
    search() {
      this.$refs.table.fetchData();
    },
  },
  mounted() {
    this.$refs.table.fetchData();
  },
};
</script>
<style scoped lang="scss">
.accountTitle {
  line-height: 30px;
}
.title {
  font-size: 16px;
  line-height: 20px;
  padding-left: 20px;
  border-left: 4px solid $--color-primary;
  .btns {
    float: right;
  }
}
.filters {
  height: 50px;
  display: flex;
  align-items: center;
  span {
    font-weight: 700;
  }
  ul > li {
    float: left;
    margin-left: 40px;
    cursor: pointer;
    &.active {
      color: $--color-primary;
    }
  }
}
/deep/.el-card__header {
  border-bottom: 0;
  padding: 18px 20px 0;
}
.accountLists {
  background: #f5f7fa;
  margin-bottom: 20px;
}
.accountLists .item {
  display: flex;
  align-items: center;
  line-height: 30px;
}
.accountLists .item > span {
  flex: 0 0 33.33%;
  display: block;
}
.pagination {
  float: right;
}
</style>
