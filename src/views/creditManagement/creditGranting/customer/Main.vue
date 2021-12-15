<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>客户授信管理</span>
      </h1>
      <div>
        <el-button @click="handleAdd({})" size="small"  class="btn-color-blue" icon="el-icon-plus">新增授信</el-button>
        <!--<el-button @click="handleTactics" size="small">授信策略</el-button>-->
      </div>
    </div>
    <div class="page-content">
      <HeadStatistics ref="ref_HeadStatistics" :fn="Api_GetStatistics" :col="HeadStatisticsCol"></HeadStatistics>
      <el-form ref="searchForm" :model="listQuery" :inline="true">
        <el-form-item prop="companyName">
          <el-input
            v-model="listQuery.companyName"
            placeholder="授信对象名称"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item prop="creditState">
          <el-select v-model="listQuery.creditState" placeholder="信用状态">
            <el-option value label="全部">全部</el-option>
            <el-option value="0" label="待审核">待审核</el-option>
            <el-option value="1" label="正常">正常</el-option>
            <el-option value="2" label="冻结">冻结</el-option>
            <el-option value="3" label="失效">失效</el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="btns">
          <el-button class="filter-item" type="primary" @click="handleFilter">查询</el-button>
          <el-button class="filter-item" @click="handleReset('searchForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <TableWrapper
        ref="table"
        :fetchDataFn="Api_CreditCustomerGetPage"
        :query="listQuery"
        :columns="tableCol"
      />
    </div>
  </div>
</template>

<script type="text/jsx">
import HeadStatistics from "@/components/HeadStatistics";
import {
  Api_CreditCustomerGetPage,
  Api_CreditCustomerCheckModel,
  Api_CreditCustomerCheckFirst,
  Api_CreditCustomerCheckGrade,
  Api_GetStatistics,
} from "@/api/creditManagement/creditGranting/customer";

export default {
  name: "Main",
  components: { HeadStatistics },
  data() {
    return {
      HeadStatisticsCol: [
        { key: "totalQuota", title: "授信总额", isMoney: true },
        { key: "occupyQuota", title: "占用总额", isMoney: true },
        { key: "oweMoney", title: "应收未收金额", isMoney: true },
        { key: "overdueMoney", title: "客户逾期金额", isMoney: true },
      ],
      listQuery: {
        companyName: "",
        creditState: "",
      },
      tableCol: [
        {
          key: "company_name",
          label: "企业名称",
          align: "left",
          props: {
            "show-overflow-tooltip": true,
            "min-width": 150,
          },
          render: (h, data, row) => {
            if (row.is_bloc === "1") {
              return (
                <div
                  class="ellipsis"
                  style="cursor: pointer;color: #4b9df3"
                  onClick={this.handleDetail.bind(this, row)}
                >
                  {data}
                  <span style="border: 1px solid;border-radius: 5px;padding: 0 5px;">集团</span>
                </div>
              );
            } else {
              return (
                <div
                  class="ellipsis"
                  style="cursor: pointer;color: #4b9df3"
                  onClick={this.handleDetail.bind(this, row)}
                >
                  {data}
                </div>
              );
            }
          },
        },
        {
          key: "credit_state",
          label: "信用状态",
          render: (h, data) => {
            if (data === "0") {
              return "待审核";
            } else if (data === "1") {
              return "生效";
            } else if (data === "2") {
              return "冻结";
            } else if (data === "3") {
              return "失效";
            }
          },
        },
        {
          key: "fixedQuota",
          label: "信用额度(元)",
          align: "right",
          render: (h, data) => {
            return this.$toMoney(data, 2);
          },
        },
        {
          key: "tempQuota",
          label: "临时额度(元)",
          align: "right",
          render: (h, data) => {
            return this.$toMoney(data, 2);
          },
        },
        {
          key: "occupyQuota",
          label: "已占用额度(元)",
          align: "right",
          render: (h, data) => {
            return this.$toMoney(data, 2);
          },
        },
        {
          key: "availableQuoto",
          label: "剩余信用额度(元)",
          align: "right",
          render: (h, data) => {
            return this.$toMoney(data, 2);
          },
        },
        {
          key: "effective_date",
          label: "生效日期",
          render: (h, data) => {
            return this.$dateFormat(data, "yyyy-MM-dd");
          },
        },
        {
          key: "expiration_date",
          label: "有效日期",
          render: (h, data) => {
            return this.$dateFormat(data, "yyyy-MM-dd");
          },
        },
        // {
        //   key: null,
        //   label: "操作",
        //   width: 100,
        //   render: (h, data, row) => {
        //       return (
        //           row.editable &&
        //           (row.process_status === "0" || row.process_status === "3") ?
        //           <el-link type="primary" onClick={this.handleAdd.bind(this, row)}> 编辑 </el-link>
        //               : <el-link type="info"  disabled> 编辑 </el-link>
        //       );
        //   },
        // },
      ],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getList();
    });
  },
  methods: {
    Api_CreditCustomerGetPage,
    Api_GetStatistics,
    getList(flag) {
      this.$refs.table.fetchData(flag);
    },
    // 新增授信
    handleAdd(row) {
      if (this.$isVip()) {
        this.$emit("edit", true, 3, row);
      } else {
        this.$vipExpireConfirm();
      }
    },
    handleTactics() {
      // 判断当前是否有启用的模型
      Api_CreditCustomerCheckModel().then((res) => {
        if (res) {
          // 判断是否是第一次配置授信策略
          Api_CreditCustomerCheckFirst().then((res) => {
            if (res) {
              this.$emit("isAdd", true);
              this.$emit("edit", true, 1);
            } else {
              this.$emit("isAdd", false);
              Api_CreditCustomerCheckGrade().then((res) => {
                if (res) {
                  this.$emit("edit", true, 1);
                } else {
                  this.$alert(
                    "当前启用状态评估模型信用等级方案已经更改，等级授信方案需要重新配置。",
                    "提示",
                    {
                      callback: (action) => {
                        this.$emit("edit", true, 1);
                        this.$emit("isAdd", true);
                      },
                    }
                  );
                }
              });
            }
          });
        } else {
          this.$alert(
            '当前查找不到启用状态的评估模型，请先前往"信用评估"-"评估模型"页面选择评估模型。',
            "提示"
          );
        }
      });
    },
    // 授信详情
    handleDetail(data) {
      this.$emit("edit", true, 2);
      this.$emit("detailData", data);
    },
    // 根据查询条件获取数据
    handleFilter() {
      this.getList(true);
    },
    // 重置查询条件
    handleReset(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scoped>
.newStyle1 {
  border-radius: 72px;
  height: 72px;
  width: 72px;
  background-image: url(../../../../assets/images/ysje.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

.newStyle2 {
  border-radius: 72px;
  height: 72px;
  width: 72px;
  background-image: url(../../../../assets/images/yqje.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

.newStyle3 {
  border-radius: 72px;
  height: 72px;
  width: 72px;
  background-image: url(../../../../assets/images/dayje.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

.newStyle4 {
  border-radius: 72px;
  height: 72px;
  width: 72px;
  background-image: url(../../../../assets/images/yqbs.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

.title-msg {
  background-color: #fff;
  padding: 12px 16px;
  line-height: 34px;
}

.head-img-container {
  padding-bottom: 15px;
  background: #f8f9fa;
  position: relative;
  left: -30px;
  top: -20px;
  width: calc(100% + 60px);
  overflow-x: hidden;
}
</style>
