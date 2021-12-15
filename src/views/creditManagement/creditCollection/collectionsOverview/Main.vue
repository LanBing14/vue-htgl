<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>催收总览</span>
      </h1>
    </div>
    <div class="page-content">
      <el-form ref="searchForm" :model="listQuery" :inline="true">
        <el-form-item prop="companyName">
          <el-input
            v-model="listQuery.companyName"
            placeholder="企业名称"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <!-- department & user BEGIN -->
        <el-form-item prop="deptId">
          <el-popover ref="popoverQuery" visible-arrow="false" placement="bottom-start" trigger="click">
            <el-tree :data="treeData" :render-content="renderContent" @node-click="handleNodeClickQuery"></el-tree>
            <el-input slot="reference" type="text" readonly placeholder="所属部门" :value="deptName"></el-input>
          </el-popover>
        </el-form-item>
        <el-form-item prop="userId">
          <el-select v-model="listQuery.userId" filterable placeholder="负责人">
            <el-option
              :key="item.id"
              :label="item.name || item.username"
              :value="item.name || item.username"
              v-for="item in departmentUsers"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- department & user END -->
        <el-form-item>
          <el-date-picker
            v-model="dateArr"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="催收日期起"
            end-placeholder="催收日期止"
          ></el-date-picker>
        </el-form-item>
        <el-form-item class="btns">
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset('searchForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <TableWrapper
        ref="table"
        :fetchDataFn="Api_CollectionOverviewPage"
        :query="listQuery"
        :columns="tableCol"
      />
    </div>
  </div>
</template>

<script type="text/jsx">
import { Api_CollectionOverviewPage } from "@/api/creditManagement/creditCollection/collectionsOverview";
import { Api_DepartmentsFetchTree, Api_DepartmentUserList } from "@/api/settings/dept.js";

export default {
  name: "Main",
  components: {},
  data() {
    return {
      treeData: [],
      departmentUsers: [],
      deptName: "",
      dateArr: null,
      listQuery: {
        companyName: "", // 合作方企业名称
        deptId: "", // 部门id
        userId: "", // 用户id
        startDate: "", // 催收日期起
        endDate: "" // 催收日期止
      },
      tableCol: [
        {
          key: "companyName",
          label: "企业名称",
          align: "left",
          props: { "show-overflow-tooltip": true, "min-width": 150 },
          render: (h, data, row) => {
            return (
              <span class="canClick" onClick={this.handleDetail.bind(this, row)}>
                {data}
              </span>
            );
          }
        },
        {
          key: "overdueMoney",
          label: "逾期金额(元)",
          align: "right",
          render: (h, data) => {
            return this.$toMoney(data);
          }
        },
        {
          key: "day",
          label: "最大逾期天数",
          align: "right"
        },
        {
          key: "count",
          label: "逾期笔数",
          align: "right"
        },
        {
          key: "addCount",
          label: "新增笔数",
          align: "right"
        },
        {
          key: "newDate",
          label: "逾期更新时间",
          render: (h, data) => {
            return data ? this.$dateFormat(data) : "-";
          }
        },
        {
          key: "registerDate",
          label: "最近催收日期",
          render: (h, data) => {
            return data ? this.$dateFormat(data) : "-";
          }
        },
        {
          key: "userName",
          label: "客户负责人",
          render: (h, data, row) => {
            return (
              <el-tooltip class="item" effect="dark" content={data + "/" + row.deptName} placement="top">
                <span>{data}</span>
              </el-tooltip>
            );
          }
        }
      ],
      pickerOptionsStart: {
        disabledDate: time => {
          const { endDate } = this.listQuery;
          if (endDate) {
            return time.getTime() > new Date(endDate).getTime();
          } else {
            return false;
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          const { startDate } = this.listQuery;
          if (startDate) {
            return time.getTime() < new Date(startDate).getTime();
          } else {
            return false;
          }
        }
      }
    };
  },
  watch: {
    dateArr(date) {
      if (date) {
        this.listQuery.startDate = date[0];
        this.listQuery.endDate = date[1];
      } else {
        this.listQuery.startDate = "";
        this.listQuery.endDate = "";
      }
    }
  },
  mounted() {
    this.getList();
    this.handleNodeClickQuery({});
    // department & user BEGIN
    Api_DepartmentsFetchTree().then(res => {
      this.treeData = res;
    });
    // department & user END
  },
  methods: {
    Api_CollectionOverviewPage,
    handleDetail(row) {
      this.$emit("edit", true, row);
    },
    // 获取主列表数据
    getList(flag) {
      this.$refs.table.fetchData(flag);
    },
    // 根据查询条件获取数据
    handleFilter() {
      this.getList(true);
    },
    // 重置查询条件
    handleReset(formName) {
      this.dateArr = null;
      this.listQuery.startDate = "";
      this.listQuery.endDate = "";
      this.deptName = "";
      this.$refs[formName].resetFields();
      this.handleNodeClickQuery({});
    },
    // department & user BEGIN
    renderContent(h, { node, data }) {
      let name = data.label;
      if (data.label.length > 11) {
        name = data.label.substring(0, 11) + "...";
      }
      return (
        <span class="custom-tree-node" title={data.label}>
          {" "}
          {name}{" "}
        </span>
      );
    },
    handleNodeClickQuery(item) {
      this.listQuery.deptId = item.id;
      this.deptName = item.label;
      Api_DepartmentUserList({
        currentPage: 1,
        pageSize: 100,
        departmentIds: item.id
      }).then(res => {
        this.listQuery.userId = "";
        this.departmentUsers = res.data;
      });
    }
    // department & user END
  }
};
</script>

<style scoped>
</style>
