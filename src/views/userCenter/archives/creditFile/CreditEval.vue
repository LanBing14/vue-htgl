<template>
  <el-row class="credit-tab-content" v-loading="loading">
    <h3 class="font20 fontwb">综合评价</h3>
    <el-col :span="10">
      <div id="XYPF" class="eval-chart"></div>
    </el-col>
    <el-col :span="6" :offset="1" class="eval-info">
      <h3>
        信用等级 &nbsp;
        <!-- <img src="@/assets/images/CLevelIcon1.png" alt /> -->
      </h3>
      <p>
        当前等级：
        <span class="text-blue" style="font-size: 24px; font-weight: bold">{{ companyInfo.level }}</span>
      </p>
      <p>信用记录：{{ companyInfo.record }}</p>
      <!--<p>行业风险：{{ }}</p>-->
      <p>评价结论：{{ companyInfo.conclusion }}</p>
    </el-col>
    <el-col :span="6" :offset="1" class="eval-info">
      <h3>
        主要评估维度信用水平 &nbsp;
        <!-- <img src="@/assets/images/CLevelIcon2.png" alt /> -->
      </h3>
      <p>
        基本情况：
        <span class="text-blue">{{ companyInfo.baseInfo ? companyInfo.baseInfo.score : 0 }}</span> 分
      </p>
      <p>
        技术创新：
        <span class="text-blue">{{ companyInfo.techInnovation ? companyInfo.techInnovation.score : 0 }}</span> 分
      </p>
      <p>
        经营状况：
        <span class="text-blue">{{ companyInfo.manageState ? companyInfo.manageState.score : 0 }}</span> 分
      </p>
      <p>
        关联结构：
        <span
          class="text-blue"
        >{{ companyInfo.relatedStructure ? companyInfo.relatedStructure.score : 0 }}</span> 分
      </p>
      <p>
        公共信用：
        <span class="text-blue">{{ companyInfo.publicCredit ? companyInfo.publicCredit.score : 0 }}</span> 分
      </p>
    </el-col>
    <table border="0" cellpadding="0" cellspacing="0" class="fxb-info-table">
      <tr>
        <th>基本情况</th>
        <td colspan="3">{{ companyInfo.baseInfo ? companyInfo.baseInfo.comment : '-' }}</td>
      </tr>
      <tr>
        <th>技术创新</th>
        <td colspan="3">{{ companyInfo.techInnovation ? companyInfo.techInnovation.comment : '-' }}</td>
      </tr>
      <tr>
        <th>经营状况</th>
        <td colspan="3">{{ companyInfo.manageState ? companyInfo.manageState.comment : '-' }}</td>
      </tr>
      <tr>
        <th>关联结构</th>
        <td colspan="3">{{ companyInfo.relatedStructure ? companyInfo.relatedStructure.comment : '-' }}</td>
      </tr>
      <tr>
        <th>公共信用</th>
        <td colspan="3">{{ companyInfo.publicCredit ? companyInfo.publicCredit.comment : '-' }}</td>
      </tr>
    </table>
  </el-row>
</template>

<script>
import { Api_getCreditScore } from "@/api/advanceSearch";
import echarts3 from "echarts";

export default {
  name: "CreditEval",
  data() {
    return {
      loading: false,
      companyId: "",
      companyInfo: {},
    };
  },
  mounted() {
    this.companyId = this.$route.query.id;
    this.loadTableData();
  },
  methods: {
    loadTableData() {
      this.loading = true;
      Api_getCreditScore({ companyId: this.companyId })
        .then((res) => {
          const chartData = [];
          this.loading = false;
          this.companyInfo = res;
          chartData.push(this.companyInfo.baseInfo.score);
          chartData.push(this.companyInfo.techInnovation.score);
          chartData.push(this.companyInfo.manageState.score);
          chartData.push(this.companyInfo.relatedStructure.score);
          chartData.push(this.companyInfo.publicCredit.score);
          chartData.push(0);

          const myChart = echarts3.init(document.getElementById("XYPF"));
          const option = {
            tooltip: {
              show: false,
            },
            radar: {
              radius: "65%",
              indicator: [
                { name: "基本情况", max: this.companyInfo.baseInfo.totalScore },
                { name: "技术创新", max: this.companyInfo.techInnovation.totalScore },
                { name: "经营状况", max: this.companyInfo.manageState.totalScore },
                { name: "关联结构", max: this.companyInfo.relatedStructure.totalScore },
                { name: "公共信用", max: this.companyInfo.publicCredit.totalScore },
              ],
              name: {
                textStyle: { color: "#606266", fontSize: 13 },
                formatter: function (value) {
                  return (
                    (value === "基本情况"
                      ? "{a|}"
                      : value === "技术创新"
                      ? "{b|}"
                      : value === "经营状况"
                      ? "{c|}"
                      : value === "关联结构"
                      ? "{d|}"
                      : "{e|}") +
                    "\n" +
                    value
                  );
                },
                rich: {
                  a: {
                    width: 26,
                    height: 26,
                    align: "center",
                    backgroundColor: {
                      image: require("../../../assets/images/chart-jbqk.png"),
                    },
                  },
                  b: {
                    width: 30,
                    height: 30,
                    align: "center",
                    backgroundColor: {
                      image: require("../../../assets/images/chart-jscx.png"),
                    },
                  },
                  c: {
                    width: 30,
                    height: 30,
                    align: "center",
                    backgroundColor: {
                      image: require("../../../assets/images/chart-jyzk.png"),
                    },
                  },
                  d: {
                    width: 30,
                    height: 30,
                    align: "center",
                    backgroundColor: {
                      image: require("../../../assets/images/chart-gljg.png"),
                    },
                  },
                  e: {
                    width: 30,
                    height: 30,
                    align: "center",
                    backgroundColor: {
                      image: require("../../../assets/images/chart-ggxy.png"),
                    },
                  },
                },
              },
              axisLine: {
                lineStyle: {
                  color: "#e0e3ec",
                },
              },
              splitLine: {
                lineStyle: {
                  color: "#e0e3ec",
                },
              },
              splitArea: {
                areaStyle: {
                  color: ["#fff", "#f7f8f9"],
                },
              },
            },
            series: [
              {
                type: "radar",
                data: [{ name: "评价信息", value: chartData }],
                itemStyle: {
                  normal: {
                    color: "#67A8F8",
                  },
                },
                areaStyle: {
                  normal: {
                    color: "#76B1F9",
                  },
                },
                label: {
                  show: true,
                  color: "#333",
                },
              },
            ],
          };
          myChart.setOption(option);
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.eval-info {
  padding-top: 70px;
  h3 {
    line-height: 32px;
  }
  p {
    line-height: 24px;
    font-size: 14px;
    color: #606266;
  }
}
.text-blue {
  color: #409eff;
}
</style>
