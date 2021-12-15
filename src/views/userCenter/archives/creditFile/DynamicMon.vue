<template>
  <el-row class="credit-tab-content" v-loading="loading">
    <h4 v-if="checked">自身动态</h4>
    <h4 v-else>关联动态</h4>
    <el-col style="margin:15px 0;">
      <!-- <RadioText :options="riskList" newName="风险项" @change="onRiskChange"></RadioText> -->
      <div class="fxb-tag-list marT-2 marB10">
        <span style="width: 60px; padding: 0; margin: 0">风险项：</span>
        <span
          :class="{ 'active': listQuery.risksType === ''}"
          @click="listQuery.risksType = ''; riskSmallItems=[]; onRiskChange('')"
        >全部</span>
        <template v-for="(risk,index) in riskItems">
          <span
            :key="index"
            :class="{'active': listQuery.risksType === risk.firstLevelCode}"
            @click="riskSmallItems=risk.children; onRiskChange(risk.firstLevelCode, risk.firstLevelName)"
          >{{ risk.firstLevelName }}</span>
        </template>
      </div>
      <div v-if="riskSmallItems.length" class="fxb-tag-list marT-2 marB10">
        <span style="width: 60px; padding: 0; margin: 0"></span>
        <template v-for="(risk2,index) in riskSmallItems">
          <span
            :key="index"
            :class="{'active': listQuery.risksType === risk2.typeCode}"
            @click="onRiskChange(risk2.typeCode,risk2.typeName)"
          >{{ risk2.typeName }}</span>
        </template>
      </div>
    </el-col>
    <el-col style="margin-bottom: 15px">
      <el-col :span="24">
        时间：
        <el-date-picker
          v-model="comboDate"
          type="daterange"
          align="right"
          unlink-panels
          value-format="yyyy-MM-dd"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :clearable="false"
          :picker-options="pickerOptions"
          @change="timeChange"
        ></el-date-picker>
      </el-col>
    </el-col>
    <div class="list-table" v-if="checked">
      <TableWrapper
        ref="table1"
        key="1"
        :fetchDataFn="Api_newGetComPageMonitor"
        :query="listQuery"
        :columns="tableCol1"
      />
    </div>
    <div class="list-table" v-else>
      <TableWrapper
        ref="table2"
        key="2"
        :fetchDataFn="Api_newGetComPageMonitorCor"
        :query="listQuery"
        :columns="tableCol2"
      />
    </div>
    <ContentDetail ref="ref_ContentDetail"></ContentDetail>
  </el-row>
</template>

<script>
import { Api_newGetAllMonitor } from "@/api/creditMonitor";
import { Api_newGetComPageMonitor, Api_newGetComPageMonitorCor } from "@/api/creditMonitor";
import { dateFormat } from "@/utils/index";
import RadioText from "@/components/RadioText";
import ContentDetail from "@/views/creditMonitor/credit/creditInfo/ContentDetail.vue";
import { Api_GetRiskItems } from "@/api/creditManagement/monitoring/monitoring";

export default {
  name: "DynamicMon",
  components: { RadioText, ContentDetail },
  filters: {
    dateFormat,
  },
  data() {
    return {
      loading: false,
      // 风险项
      riskList: [],
      comboDate: [],
      checked: true,
      // 列表数据
      pageList: [],
      totalRecords: 1,
      riskItems: [],
      riskSmallItems: [],
      listQuery: {
        // 选中的时间区间
        // dateRange: "-1",
        // 公司名称
        companyName: "",
        startDate: "",
        endDate: "",
        pageNo: 1,
        pageSize: 10,
        risksType: "",
        riskContent: "",
        // type: "0",
        companyId: "",
      },
      tableCol1: [
        { key: "change_time", label: "时间", align: "left", width: 150 },
        { key: "code_desc", label: "事项分类/级别", align: "left", width: 150 },
        { key: "type", label: "所属风险项", align: "left", width: 150 },
        {
          key: "content",
          label: "动态内容",
          align: "left",
          props: { "show-overflow-tooltip": true },
          render: (h, data, row) => {
            if (
              row.type_code === "A010101" ||
              row.type_code === "A010104" ||
              row.type_code === "A010201" ||
              row.type_code === "A010202"
            ) {
              return (
                <router-link to={{ name: "dynamicMon", query: { id: row.code_company_id } }} target="_blank">
                  <span style="color: #4b9df3;cursor: pointer">{data}</span>
                </router-link>
              );
            } else {
              if (row.type_code === "A010301") {
                // 商标注册
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "1")}>
                    {data}
                  </span>
                );
              } else if (row.type_code === "A010401") {
                // 专利申请
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "2")}>
                    {data}
                  </span>
                );
              } else if (row.type_code === "A020101") {
                // 失信被执行人
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "3")}>
                    {data}
                  </span>
                );
              } else if (row.type_code === "A020201") {
                // 被执行人
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "4")}>
                    {data}
                  </span>
                );
              } else if (row.type_code === "A020301") {
                // 法院公告
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "5")}>
                    {data}
                  </span>
                );
              }
              if (row.type_code === "A020401") {
                // 裁判文书
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "6")}>
                    {data}
                  </span>
                );
              } else if (row.type_code === "A010501") {
                // 软著申请
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "7")}>
                    {data}
                  </span>
                );
              } else if (row.type_code === "A020501") {
                // 行政处罚
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "8")}>
                    {data}
                  </span>
                );
              } else if (row.type_code === "A020601") {
                // 经营异常
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "9")}>
                    {data}
                  </span>
                );
              } else if (row.type_code === "A030101") {
                // 股权出质
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "10")}>
                    {data}
                  </span>
                );
              } else if (row.type_code === "A030401") {
                // 动产抵押
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "11")}>
                    {data}
                  </span>
                );
              } else {
                return data;
              }
            }
          },
        },
      ],
      tableCol2: [
        { key: "company_name", label: "关联企业/自然人", align: "left" },
        { key: "change_time", label: "时间", align: "left", width: 150 },
        { key: "code_desc", label: "事项分类/级别", align: "left", width: 150 },
        { key: "type", label: "所属风险项", align: "left", width: 150 },
        {
          key: "content",
          label: "动态内容",
          align: "left",
          props: {
            "show-overflow-tooltip": true,
          },
          render: (h, data, row) => {
            if (
              row.type_code === "A010101" ||
              row.type_code === "A010104" ||
              row.type_code === "A010201" ||
              row.type_code === "A010202"
            ) {
              return (
                <router-link to={{ name: "basicArchive", query: { id: row.code_company_id } }} target="_blank">
                  <span style="color: #4b9df3;cursor: pointer">{data}</span>
                </router-link>
              );
            } else {
              if (row.type_code === "A010301") {
                // 商标注册
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "1")}>
                    {data}
                  </span>
                );
              } else if (row.type_code === "A010401") {
                // 专利申请
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "2")}>
                    {data}
                  </span>
                );
              } else if (row.type_code === "A020101") {
                // 失信被执行人
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "3")}>
                    {data}
                  </span>
                );
              } else if (row.type_code === "A020201") {
                // 被执行人
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "4")}>
                    {data}
                  </span>
                );
              } else if (row.type_code === "A020301") {
                // 法院公告
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "5")}>
                    {data}
                  </span>
                );
              }
              if (row.type_code === "A020401") {
                // 裁判文书
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "6")}>
                    {data}
                  </span>
                );
              } else if (row.type_code === "A010501") {
                // 软著申请
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "7")}>
                    {data}
                  </span>
                );
              } else if (row.type_code === "A020501") {
                // 行政处罚
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "8")}>
                    {data}
                  </span>
                );
              } else if (row.type_code === "A020601") {
                // 经营异常
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "9")}>
                    {data}
                  </span>
                );
              } else if (row.type_code === "A030101") {
                // 股权出质
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "10")}>
                    {data}
                  </span>
                );
              } else if (row.type_code === "A030401") {
                // 动产抵押basicArchive
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "11")}>
                    {data}
                  </span>
                );
              } else {
                return data;
              }
            }
          },
        },
      ],
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "近一周",
            onClick: (picker) => {
              const end = new Date();
              const start = new Date();
              // start.setTime(start.getTime() + 3600 * 1000 * 24 * 1);
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
              picker.$emit("pick", [start, end]);
              this.$nextTick(() => {
                this.loadPageList();
              });
            },
          },
          {
            text: "近一个月",
            onClick: (picker) => {
              const end = new Date();
              const start = new Date();
              start.setMonth(start.getMonth() - 1);
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit("pick", [start, end]);
              this.$nextTick(() => {
                this.loadPageList();
              });
            },
          },
          {
            text: "近半年",
            onClick: (picker) => {
              const end = new Date();
              const start = new Date();
              start.setMonth(start.getMonth() - 6);
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit("pick", [start, end]);
              this.$nextTick(() => {
                this.loadPageList();
              });
            },
          },
          {
            text: "近一年",
            onClick: (picker) => {
              const end = new Date();
              const start = new Date();
              start.setMonth(start.getMonth() - 12);
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit("pick", [start, end]);
              this.$nextTick(() => {
                this.loadPageList();
              });
            },
          },
        ],
      },
    };
  },
  mounted() {
    this.listQuery.companyId = this.$route.query.id;
    // this.loadRiskList();
    Api_GetRiskItems().then((res) => {
      this.riskItems = res.filter( item => item.firstLevelName !== "关联风险" );
    });
    const end = new Date();
    const start = new Date();
    // start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
    start.setMonth(start.getMonth() - 12);
    this.comboDate = [this.$dateFormat(start), this.$dateFormat(end)];
    this.loadPageList();
  },
  methods: {
    Api_newGetComPageMonitor,
    Api_newGetComPageMonitorCor,
    // 获取列表数据
    loadPageList() {
      this.listQuery.startDate = this.comboDate.length > 0 ? this.comboDate[0] : "";
      this.listQuery.endDate = this.comboDate.length > 0 ? this.comboDate[1] : "";
      if (this.checked) {
        this.$refs.table1.fetchData();
      } else {
        this.$refs.table2.fetchData();
      }
      // if (value) {
      //     Api_newGetComPageMonitor(Object.assign(this.searchData)).then(data => {
      //         this.loading = false;
      //         this.pageList = data.list;
      //         this.totalRecords = data.totalRecords;
      //     }).catch(() => {
      //         this.loading = false;
      //     });
      // } else {
      //     Api_newGetComPageMonitorCor(Object.assign(this.searchData)).then(data => {
      //         this.loading = false;
      //         this.pageList = data.list;
      //         this.totalRecords = data.totalRecords;
      //     }).catch(() => {
      //         this.loading = false;
      //     });
      // }
      // Api_GetComPageMonitor(Object.assign(this.searchData, option)).then(data => {
      //     this.loading = false;
      //     this.pageList = data.list;
      //     this.totalRecords = data.totalRecords;
      // }).catch(() => {
      //     this.loading = false;
      // });
    },
    loadRiskList() {
      // 获取风险项数据
      this.loading = true;
      Api_newGetAllMonitor()
        .then((res) => {
          this.loading = false;
          const _riskList = [];
          if (res.length > 0) {
            for (let i = 0; i < res.length; i++) {
              _riskList.push({
                id: res[i].key,
                label: res[i].value,
              });
            }
          }
          _riskList.unshift({
            id: "",
            label: "全部",
          });
          this.riskList = _riskList;
        })
        .catch((res) => {
          this.loading = false;
          this.$message.error(res);
        });
    },
    // defaultSet() {
    //     this.comboDate = [];
    //     // this.searchData.dateRange = "-1";
    //     this.searchData.pageNo = 1;
    //     this.searchData.pageSize = 10;
    //     this.searchData.companyName = "";
    //     this.searchData.risksType = "";
    //     this.loadPageList();
    // },
    // pageChange() {
    //     this.loadPageList();
    // },
    onRiskChange(val, name) {
      this.listQuery.risksType = val;
      this.listQuery.riskContent = name;
      this.loadPageList();
    },
    timeChange() {
      this.loadPageList();
    },
    changeType(value) {
      this.checked = value;
      this.$nextTick(() => {
        this.loadPageList();
      });
    },
    // 打开详情窗口
    openWin(row, _isShow) {
      this.$refs.ref_ContentDetail.open({monitorContentId: row.monitor_content_id , typeCode: row.type_code , sercondId: row.sercond_id }, _isShow );
    },
  },
};
</script>
<style lang="scss">
    .el-tooltip__popper {
        max-width: 800px;
    }
</style>
<style lang="scss" scoped>
.checked {
  color: $--color-primary;
}

.fxb-tag-list.second .el-form-item__content {
  background-color: #f7f8fb;
}

.fxb-tag-list span {
  display: inline-block;
  line-height: 30px;
  padding: 0 10px;
  border-radius: 5px;
  margin-right: 20px;
  cursor: pointer;
}

.fxb-tag-list span:hover,
.fxb-tag-list span.active {
  color: #409eff;
}
</style>
