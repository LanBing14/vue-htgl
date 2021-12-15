<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>客户信用预警</span>
      </h1>
      <div>
        <el-button @click="recreateApi" size="small" icon="el-icon-refresh">重新生成</el-button>
      </div>
    </div>
    <div class="page-content">
      <el-form ref="searchForm" :model="listQuery" :inline="true">
        <el-form-item label="客户名称:" prop="name">
          <el-input
            v-model="listQuery.name"
            placeholder="客户名称"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item class="btns">
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset('searchForm')">重置</el-button>
        </el-form-item>
        <div style="margin-bottom: 15px; margin-top: 6px; display: flex; color: #606266">
          <span style="padding: 0 15px 0 0; font-weight: bold; line-height: 24px; height: 24px">预警类型</span>
          <span style="padding: 0 15px">
            <span
              :class="{'text-blue': listQuery.type===''}"
              style="cursor: pointer; line-height: 24px; height: 24px"
              @click="switchType('')"
            >全部</span>
          </span>
          <span style="padding: 0 15px" v-for="(item, index) in typeOptions" :key="index">
            <span
              :class="{'text-blue': listQuery.type===item.id}"
              style="cursor: pointer; line-height: 24px; height: 24px"
              @click="switchType(item.id)"
            >{{ item.name }}</span>
          </span>
        </div>
      </el-form>
      <StatisticsBlock
        :col="statisticCol"
        :query="listQuery"
        :fn="Api_GetWarningStatistics"
        ref="ref_StatisticsBlock"
      ></StatisticsBlock>
      <!-- <div style="padding-bottom: 15px;">
                 <el-row :gutter="15">
                     <el-col :span="6">
                         <div class="title-msg">
                             <el-row :gutter="8" style="margin: 0px">
                                 <el-col :span="8">
                                     <div class="newStyle1" style="background-color: #f2b04f"></div>
                                 </el-col>
                                 <el-col :span="16" style="padding: 15px 30px">
                                     <div>
                                         授信总额
                                         <div style="color: #000;margin-top: 6px;text-align: right">{{
                                             $toMoney(creditQuota) }}
                                             万元
                                         </div>
                                     </div>
                                 </el-col>
                             </el-row>
                         </div>
                     </el-col>
                     <el-col :span="6">
                         <div class="title-msg">
                             <el-row :gutter="8" style="margin: 0px">
                                 <el-col :span="8">
                                     <div class="newStyle2" style="background-color: #28b5be"></div>
                                 </el-col>
                                 <el-col :span="16" style="padding: 15px 30px">
                                     <div>
                                         占用总额
                                         <div style="color: #000;margin-top: 6px;text-align: right">{{
                                             $toMoney(occupyQuota) }} 万元
                                         </div>
                                     </div>
                                 </el-col>
                             </el-row>
                         </div>
                     </el-col>
                     <el-col :span="6">
                         <div class="title-msg">
                             <el-row :gutter="8" style="margin: 0px">
                                 <el-col :span="8">
                                     <div class="newStyle3" style="background-color: #4ad381"></div>
                                 </el-col>
                                 <el-col :span="16" style="padding: 15px 30px">
                                     <div>
                                         逾期金额
                                         <div style="color: #000;margin-top: 6px;text-align: right">{{
                                             $toMoney(overdueMoney) }} 万元
                                         </div>
                                     </div>
                                 </el-col>
                             </el-row>
                         </div>
                     </el-col>
                     <el-col :span="6">
                         <div class="title-msg">
                             <el-row :gutter="8" style="margin: 0px">
                                 <el-col :span="8">
                                     <div class="newStyle4" style="background-color: #4996de"></div>
                                 </el-col>
                                 <el-col :span="16" style="padding: 15px 30px">
                                     <div>
                                         逾期笔数
                                         <div style="color: #000;margin-top: 6px;text-align: right">{{ overdueDays }} 笔
                                         </div>
                                     </div>
                                 </el-col>
                             </el-row>
                         </div>
                     </el-col>
                 </el-row>
      </div>-->
      <div class="page-content-body">
        <TableWrapper
          ref="child"
          :fetchDataFn="Api_GetWarningPage"
          :query="listQuery"
          :columns="tableCol"
          :order="order"
          :orderProperty="orderProperty"
          :sort-change="onChange"
        />
      </div>
    </div>
  </div>
</template>

<script type="text/jsx">
import {
  Api_GetWarningPage,
  Api_GetWarningStatistics,
  Api_GetWarningRecreate,
} from "@/api/creditManagement/statisticsAnalysis/statisticsAnalysis";
import StatisticsBlock from "@/components/StatisticsBlock/index.vue";

export default {
  name: "CreditAlert",
  components: { StatisticsBlock },
  data() {
    return {
      Api_GetWarningPage,
      listQuery: { name: "", type: "" },
      typeOptions: [
        { id: "1", name: "额度占用预警" },
        { id: "2", name: "逾期金额预警" },
        { id: "3", name: "逾期天数预警" },
      ],
      tableCol: [
        {
          key: "companyNo",
          label: "客户编码",
          width: 100,
          props: { "show-overflow-tooltip": true },
        },
        {
          key: "companyName",
          label: "客户名称",
          align: "left",
          width: 120,
          props: { "show-overflow-tooltip": true },
          render: (h, data, row) => {
            return (
              <span class="canClick" onClick={this.gotoCustomerDetail.bind(this, row)}>
                {data}
              </span>
            );
          },
        },
        {
          key: "creditQuota",
          label: "授信额度(元)",
          align: "right",
          props: { sortable: "custom" },
          render: (h, data) => {
            return this.$toMoney(data);
          },
        },
        {
          key: "creditQuota",
          label: "授信集中度",
          align: "right",
          render: (h, data) => {
            let newData = "-";
            if (data) {
              newData = (this.$divide(data, this.creditQuota) * 100).toFixed(2) + "%";
            }
            return newData;
          },
        },
        {
          key: "overdueQuota",
          label: "允许逾期额度(元)",
          align: "right",
          props: { sortable: "custom" },
          render: (h, data) => {
            return this.$toMoney(data);
          },
        },
        {
          key: "overdueDaysAllow",
          label: "允许逾期天数",
          align: "right",
          props: { sortable: "custom" },
        },
        {
          key: "creditPercent",
          label: "额度占用比例",
          align: "right",
          props: { sortable: "custom" },
          render: (h, data) => {
            if (data) {
              if (data > 80) {
                return <span style="color: red">{data + "%"}</span>;
              } else {
                return data + "%";
              }
            } else {
              return "-";
            }
          },
        },
        {
          key: "moneyPercent",
          label: "逾期金额比例",
          align: "right",
          props: {
            sortable: "custom",
          },
          render: (h, data) => {
            if (data) {
              if (data > 80) {
                return <span style="color: red">{data + "%"}</span>;
              } else {
                return data + "%";
              }
            } else {
              return "-";
            }
          },
        },
        {
          key: "dayPercent",
          label: "逾期天数比例",
          align: "right",
          props: {
            sortable: "custom",
          },
          render: (h, data) => {
            if (data) {
              if (data > 80) {
                return <span style="color: red">{data + "%"}</span>;
              } else {
                return data + "%";
              }
            } else {
              return "-";
            }
          },
        },
        {
          key: "response",
          label: "客户负责人",
          render: (h, data) => {
            const newData = data.substring(0, data.indexOf("/"));
            return <span title={data}>{newData}</span>;
          },
        },
      ],
      orderProperty: "",
      order: "",
      creditQuota: "",
      occupyQuota: "",
      overdueDays: "",
      overdueMoney: "",
      statisticCol: [
        { name: "授信总额", key: "creditQuota", isMoney: true },
        { name: "占用总额", key: "occupyQuota", isMoney: true },
        { name: "逾期金额", key: "overdueMoney", isMoney: true },
        { name: "逾期笔数", key: "overdueDays", isMoney: false },
      ],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getInfo();
      this.getList();
    });
  },
  methods: {
    Api_GetWarningStatistics,
    // 获取主列表数据
    getList() {
      this.$refs.child.fetchData();
      this.$refs.ref_StatisticsBlock.fetch();
    },
    // 根据查询条件获取数据
    handleFilter() {
      this.getList();
    },
    // 重置查询条件
    handleReset(formName) {
      this.listQuery.type = "";
      this.$refs[formName].resetFields();
    },
    // 获取统计信息
    getInfo() {
      Api_GetWarningStatistics(this.listQuery)
        .then((res) => {
          this.creditQuota = res.creditQuota;
          this.occupyQuota = res.occupyQuota;
          this.overdueDays = res.overdueDays;
          this.overdueMoney = res.overdueMoney;
        })
        .catch((res) => {
          this.$message.error(res);
        });
    },
    // 预警类型切换
    switchType(val) {
      this.listQuery.type = val;
      this.getList();
    },
    // 排序
    onChange({ column, prop, order }) {
      this.orderProperty = prop;
      this.order = order;
      this.$nextTick(() => {
        this.getList();
      });
    },
    // 重新生成
    recreateApi() {
      Api_GetWarningRecreate()
        .then((res) => {
          this.$message.success(res);
        })
        .catch((res) => {
          this.$message.error(res);
        });
    },
    gotoCustomerDetail(_row) {
      const newpage = this.$router.resolve({
        name: "customerManagement",
        query: {
          id: _row.companyId,
        },
      });
      window.open(newpage.href, "_blank");
    },
  },
};
</script>

<style scoped>
.text-blue {
  color: #4a9df2;
}

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
