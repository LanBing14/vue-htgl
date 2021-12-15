<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>监测预警</span>
      </h1>
    </div>
    <div class="page-content">
      <el-row>
        <el-row class="fxb-table">
          <el-form class="marB0" :inline="true">
            <el-form-item class="marB13">
              <el-input placeholder="输入查询企业名称" v-model="searchData.companyName" size="small" style="width: 300px"></el-input>
            </el-form-item>
            <el-form-item class="marB13">
              <el-button type="primary" icon="el-icon-search" @click="getPageList()">查询</el-button>
              <el-button icon="el-icon-refresh" @click="reSetPageList()">重置</el-button>
            </el-form-item>
          </el-form>
          <el-form label-width="100px">
            <el-form-item label="企业分组：" class="fxb-tag-change marT-2 marB10">
              <span :class="{ 'active': searchData.groupId === ''}" @click="getPageList({ groupId:'' })">全部</span>
              <template v-for="(group,index) in groupList">
                <span
                  :key="index"
                  :class="{'active': searchData.groupId === group.id}"
                  @click="getPageList({ groupId:group.id })"
                >{{ group.group_name }}</span>
              </template>
            </el-form-item>
            <el-form-item label="预警时间：" class="fxb-tag-change marT-2 marB10">
              <div class="block">
                <el-date-picker
                  v-model="dateRange"
                  type="daterange"
                  :picker-options="pickerOptions"
                  range-separator="~"
                  start-placeholder="预警时间起"
                  end-placeholder="预警时间止"
                  format="yyyy-MM-dd"
                  @change="getPageList"
                  size="small"
                  align="center"
                ></el-date-picker>
              </div>
            </el-form-item>
            <el-form-item label="预警级别：" class="fxb-tag-change marT-2">
              <span
                :class="{'active': searchData.warningLevel === ''}"
                @click="getPageList({ warningLevel:'' })"
              >全部</span>
              <template v-for="(risk,index) in riskList">
                <span
                  :key="index"
                  :class="{'active': searchData.warningLevel === risk.value}"
                  @click="getPageList({ warningLevel:risk.value })"
                >{{ risk.name }}</span>
              </template>
            </el-form-item>
          </el-form>
        </el-row>

        <el-table v-loading="loading"     element-loading-text="拼命加载中"  element-loading-spinner="el-icon-loading" :data="pageList" stripe class="fxb-table">
          <template slot="empty">
            <img src="../../../assets/images/bg/no.jpg" alt="" style="width: 300px;height:280px">
          </template>

          <el-table-column type="index" label="序号" width="80">
            <template slot-scope="scope">
              <span>{{ scope.$index+(searchData.pageNo - 1) * searchData.pageSize + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="company_name" label="企业名称" show-overflow-tooltip>
            <template slot-scope="scope">
              <div
                class="canClick"
                @click="$gotoCustomerDetail(scope.row.company_id)"
              >{{scope.row.company_name}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="groups" label="企业分组">
            <template slot-scope="scope">
              <!-- <el-tag
                size="small"
                v-for="item in scope.row.group_names.split(',')"
                :key="item.id"
                v-show="item"
              >{{ item }}</el-tag>-->
              <span>{{scope.row.group_names}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="warning_name" label="预警名称"></el-table-column>
          <el-table-column label="预警级别">
            <template slot-scope="scope">
              <span v-if="scope.row.warning_level==='0'">重大预警</span>
              <span v-if="scope.row.warning_level==='1'">警示预警</span>
              <span v-if="scope.row.warning_level==='2'">关注预警</span>
              <span v-if="scope.row.warning_level==='3'">提示预警</span>
            </template>
          </el-table-column>
          <el-table-column prop="create_date" label="预警时间" width="130">
            <template slot-scope="scope">{{ scope.row.create_date | dateFormat('yyyy-MM-dd') }}</template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="fxb-page"
        
          v-show="totalRecords>0"
          :total="totalRecords"
          :page-size="searchData.pageSize"
          :current-page.sync="searchData.pageNo"
          @current-change="getPageList"
        />
      </el-row>
    </div>
  </div>
</template>

<script>
import { Api_GetSuperviseGroup, Api_GetWarningList } from "@/api/creditMonitor";
import { Api_GetCustomerGroup } from "@/api/creditManagement/customerProfile/customerManagement.js";
import { dateFormat } from "@/utils/index";

export default {
  name: "CreditWarning",
  filters: {
    dateFormat,
  },
  data() {
    return {
      loading: false,
      groupList: [],
      dateRange: "",
      // 预警级别
      riskList: [
        { name: "重大预警", value: "0" },
        { name: "警示预警", value: "1" },
        { name: "关注预警", value: "2" },
        { name: "提示预警", value: "3" },
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: "今日",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setMonth(start.getMonth() - 1);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "近一年",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setFullYear(start.getFullYear() - 1);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      companyDepart: "",
      // 列表数据
      searchData: {
        pageNo: 1,
        pageSize: 10,
        companyName: "",
        groupId: "",
        warningLevel: "",
        startData: null,
        endData: null,
      },
      pageList: [],
      totalRecords: 1,
    };
  },
  computed: {
    key() {
      return this.$route.fullPath;
    },
  },
  // 初始化数据
  mounted() {
    Api_GetCustomerGroup().then((res) => {
      this.groupList = res;
    });
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 1);
    this.dateRange = [start, end];
    // 获取列表数据
    this.getPageList();
  },
  methods: {
    getPageList(option) {
      this.$nextTick(() => {
        this.loading = true;
        if (this.dateRange && this.dateRange.length > 0) {
          this.searchData.startDate = dateFormat(this.dateRange[0].getTime(), "yyyy-MM-dd");
          this.searchData.endDate = dateFormat(this.dateRange[1].getTime(), "yyyy-MM-dd");
        } else {
          this.searchData.startDate = null;
          this.searchData.endDate = null;
        }
        Api_GetWarningList(Object.assign(this.searchData, option))
          .then((data) => {
            this.loading = false;
            this.pageList = data.data;
            this.totalRecords = data.totalRecordNumber;
          })
          .catch(() => {
            this.loading = false;
          });
      });
    },
    reSetPageList() {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 1);
      this.dateRange = [start, end];
      this.searchData = {
        pageNo: 1,
        pageSize: 10,
        companyName: "",
        groupId: "",
        warningLevel: "",
        startData: "",
        endData: "",
      };
    },
  },
};
</script>
<style lang="scss" scoped>
.fxb-tag-change.second .el-form-item__content {
  background-color: #f7f8fb;
}

.fxb-tag-change span {
  display: inline-block;
  line-height: 30px;
  padding: 0 10px;
  border-radius: 5px;
  margin-right: 20px;
  cursor: pointer;
}

.fxb-tag-change span:first-child.active {
  color: #409eff;
}

.fxb-tag-change span:not(:first-child):hover,
.fxb-tag-change span:not(:first-child).active {
  // color: #fff;
  // background-color: #409eff;
  color:#409eff
}
</style>
