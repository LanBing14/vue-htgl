<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>授信申请分析</span>
      </h1>
    </div>
    <div class="page-content">
      <el-form ref="searchForm" :model="listQuery" :inline="true">
        <el-form-item label="客户名称:" prop="customerName">
          <el-input
            v-model="listQuery.customerName"
            placeholder="客户名称"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item label="申请日期:" prop="comboDate">
          <div class="block">
            <el-date-picker
              v-model="comboDate"
              type="monthrange"
              value-format="yyyy-MM-dd"
              range-separator="-"
              start-placeholder="申请日期起"
              end-placeholder="申请日期止"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item class="btns">
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset('searchForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <StatisticsBlock
        :col="statisticCol"
        :query="listQuery"
        :fn="Api_GetAnalysisStatistics"
        ref="ref_StatisticsBlock"
      ></StatisticsBlock>
      <!--<div style="padding-bottom: 15px;">
                <el-row :gutter="15">
                    <el-col :span="6">
                        <div class="title-msg">
                            <el-row :gutter="8" style="margin: 0px">
                                <el-col :span="8">
                                    <div class="newStyle1" style="background-color: #f2b04f"></div>
                                </el-col>
                                <el-col :span="16" style="padding: 15px 30px">
                                    <div>
                                        本月申请数
                                        <div style="color: #000;margin-top: 6px;text-align: right">{{ total }} 次</div>
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
                                        信管申请数
                                        <div style="color: #000;margin-top: 6px;text-align: right">{{ fuse }} 次</div>
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
                                        初审通过数
                                        <div style="color: #000;margin-top: 6px;text-align: right">{{ first }} 次</div>
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
                                        终审通过数
                                        <div style="color: #000;margin-top: 6px;text-align: right">{{ end }} 次</div>
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
          :fetchDataFn="Api_GetAnalysisPage"
          :query="listQuery"
          :order="order"
          :orderProperty="orderProperty"
          :columns="tableCol"
          :sort-change="onChange"
        />
      </div>
    </div>
  </div>
</template>

<script type="text/jsx">
import {
  Api_GetAnalysisPage,
  Api_GetAnalysisStatistics,
} from "@/api/creditManagement/statisticsAnalysis/statisticsAnalysis";
import StatisticsBlock from "@/components/StatisticsBlock/index.vue";

export default {
  name: "ApplicationAnalysis",
  components: { StatisticsBlock },
  data() {
    return {
      Api_GetAnalysisPage,
      comboDate: [],
      listQuery: {
        customerName: "",
        startDate: "",
        endDate: "",
      },
      tableCol: [
        {
          key: "khbh",
          label: "客户编码",
          width: 100,
          props: {
            "show-overflow-tooltip": true,
          },
        },
        {
          key: "qymc",
          label: "客户名称",
          width: 120,
          align: "left",
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
          key: "sqsxed",
          label: "授信申请额度",
          align: "right",
          props: {
            sortable: "custom",
          },
          render: (h, data) => {
            return this.$toMoney(data);
          },
        },
        {
          key: "cssxed",
          label: "信用初审额度",
          align: "right",
          props: {
            sortable: "custom",
          },
          render: (h, data) => {
            return this.$toMoney(data);
          },
        },
        {
          key: "percent",
          label: "授信额度比例",
          props: {
            sortable: "custom",
          },
          render: (h, data, row) => {
            if (data) {
              return data * 100 + "%";
            } else {
              return "-";
            }
          },
        },
        {
          key: "zt",
          label: "授信申请状态",
          render: (h, data) => {
            let newData = "";
            if (data === "1") {
              newData = "待提交";
            }
            if (data === "2") {
              newData = "待评估";
            }
            if (data === "3") {
              newData = "初审中";
            }
            if (data === "4") {
              newData = "待审核";
            }
            if (data === "5") {
              newData = "已生效";
            }
            if (data === "6") {
              newData = "已驳回";
            }
            return newData;
          },
        },
        {
          key: "sqr",
          label: "授信申请人"
        },
        {
          key: "createDate",
          label: "申请日期",
          render: (h, data) => {
            return this.$dateFormat(data, "yyyy-MM-dd");
          },
        },
      ],
      orderProperty: "",
      order: "",
      statisticCol: [
        { name: "本月申请数", key: "total", isMoney: false },
        { name: "信管申请数", key: "fuse", isMoney: false },
        { name: "初审通过数", key: "first", isMoney: false },
        { name: "终审通过数", key: "end", isMoney: false },
      ],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getList();
    });
  },
  methods: {
    Api_GetAnalysisStatistics,
    // 获取主列表数据
    getList() {
      this.listQuery.startDate = this.comboDate.length > 0 ? this.comboDate[0] : "";
      this.listQuery.endDate = this.comboDate.length > 0 ? this.comboDate[1] : "";
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
      this.comboDate = [];
      this.$refs[formName].resetFields();
    },
    // 获取统计信息
    // getInfo() {
    //     Api_GetAnalysisStatistics(this.listQuery).then(res => {
    //         this.total = res.total;
    //         this.fuse = res.fuse;
    //         this.first = res.first;
    //         this.end = res.end
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
