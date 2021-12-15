<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>客户授信分析</span>
      </h1>
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
        <el-form-item label="统计月度:" prop="time">
          <el-date-picker
            v-model="time"
            type="month"
            :clearable="false"
            class="filter-item"
            @keyup.enter.native="handleFilter"
            placeholder="选择月"
          ></el-date-picker>
        </el-form-item>
        <el-form-item class="btns">
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset('searchForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <StatisticsBlock
        :col="statisticCol"
        :query="listQuery"
        :fn="Api_GetEffectStatistics"
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
                                <el-col :span="16" style="padding: 15px">
                                    <div>
                                        期初授信额度
                                        <div style="color: #000;margin-top: 6px;text-align: right">{{ $toMoney(creditBegin) }} 万元</div>
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
                                <el-col :span="16" style="padding: 15px">
                                    <div>
                                        本月生效额度
                                        <div style="color: #000;margin-top: 6px;text-align: right">{{ $toMoney(creditValid) }} 万元</div>
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
                                <el-col :span="16" style="padding: 15px">
                                    <div>
                                        本月失效额度
                                        <div style="color: #000;margin-top: 6px;text-align: right">{{ $toMoney(creditInvalid) }} 万元</div>
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
                                <el-col :span="16" style="padding: 15px">
                                    <div>
                                        期末授信额度
                                        <div style="color: #000;margin-top: 6px;text-align: right">{{ $toMoney(creditEnd) }} 万元</div>
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
          :fetchDataFn="Api_GetEffectPage"
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
  Api_GetEffectPage,
  Api_GetEffectStatistics,
} from "@/api/creditManagement/statisticsAnalysis/statisticsAnalysis";
import StatisticsBlock from "@/components/StatisticsBlock/index.vue";

export default {
  name: "CreditAnalysis",
  components: { StatisticsBlock },
  data() {
    let nowYear = new Date().getFullYear();
    let lastMonth = new Date().getMonth();
    if (lastMonth < 1) {
      nowYear = nowYear - 1;
      lastMonth = 12;
    }
    return {
      Api_GetEffectPage,
      time: nowYear + "-" + lastMonth,
      listQuery: {
        name: "",
        time: "",
      },
      tableCol: [
        {
          key: "companyNo",
          label: "客户编码",
          width: 100,
          props: {
            "show-overflow-tooltip": true,
          },
        },
        {
          key: "companyName",
          label: "客户名称",
          align: "left",
          width: 120,
          props: {
            "show-overflow-tooltip": true,
          },
          render: (h, data, row) => {
            return (
              <span class="canClick" onClick={this.gotoCustomerDetail.bind(this, row)}>
                {data}
              </span>
            );
          },
        },
        {
          key: "creditBegin",
          label: "期初授信额度",
          props: {
            sortable: "custom",
          },
          align: "right",
          render: (h, data) => {
            return this.$toMoney(data);
          },
        },
        {
          key: "creditValid",
          label: "本月生效额度",
          props: {
            sortable: "custom",
          },
          align: "right",
          render: (h, data) => {
            return this.$toMoney(data);
          },
        },
        {
          key: "creditInvalid",
          label: "本月失效额度",
          props: {
            sortable: "custom",
          },
          align: "right",
          render: (h, data) => {
            return this.$toMoney(data);
          },
        },
        {
          key: "creditEnd",
          label: "期末授信额度",
          props: {
            sortable: "custom",
          },
          align: "right",
          render: (h, data) => {
            return this.$toMoney(data);
          },
        },
        {
          key: "month",
          label: "统计月度",
        },
        {
          key: "transientResponse",
          label: "客户负责人",
          render: (h, data) => {
            if (data) {
              const newData = data.substring(0, data.indexOf("/"));
              return <span title={data}>{newData}</span>;
            } else {
              return "-";
            }
          },
        },
      ],
      orderProperty: "",
      order: "",
      statisticCol: [
        { name: "期初授信额度", key: "creditBegin", isMoney: true },
        { name: "本月生效额度", key: "creditValid", isMoney: true },
        { name: "本月失效额度", key: "creditInvalid", isMoney: true },
        { name: "期末授信额度", key: "creditEnd", isMoney: true },
      ],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getList();
    });
  },
  methods: {
    Api_GetEffectStatistics,
    // 获取主列表数据
    getList() {
      this.listQuery.time = this.$dateFormat(this.time, "yyyy-MM").replace("-", "");
      this.$refs.child.fetchData();
      this.$refs.ref_StatisticsBlock.fetch();
      // this.getInfo()
    },
    // 根据查询条件获取数据
    handleFilter() {
      this.getList();
    },
    // 重置查询条件
    handleReset(formName) {
      let nowYear = new Date().getFullYear();
      let lastMonth = new Date().getMonth();
      if (lastMonth < 1) {
        nowYear = nowYear - 1;
        lastMonth = 12;
      }
      this.$refs[formName].resetFields();
    },
    // 获取统计信息
    // getInfo() {
    //     Api_GetEffectStatistics(this.listQuery).then(res => {
    //         this.creditBegin = res.creditBegin;
    //         this.creditValid = res.creditValid;
    //         this.creditInvalid = res.creditInvalid;
    //         this.creditEnd = res.creditEnd;
    //     }).catch(res => {
    //         this.$message.error(res)
    //     })
    // },
    // 排序
    onChange({ column, prop, order }) {
      this.orderProperty = prop;
      this.order = order;
      this.$nextTick(() => {
        this.getList();
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
.new_row > .el-col {
  width: 20%;
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
