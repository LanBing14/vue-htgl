<template>
  <div>
    <div v-show="!showApplicationHandle&&!showApplicationDetail">
      <div class="page-header">
        <h1 class="page-name">
          <span>特殊发货管理</span>
        </h1>
        <div>
          <el-button @click="gotoApplicationHandle(null,'add')" class="btn-color-blue" icon="el-icon-plus">特殊发货申请</el-button>
        </div>
      </div>
      <div class="page-content">
        <el-form ref="searchForm" :model="listQuery" :inline="true" style="margin-bottom:0">
          <el-form-item prop="contractName">
            <el-input
              v-model="listQuery.contractName"
              placeholder="订单名称"
              class="filter-item"
              @keyup.enter.native="handleFilter"
            />
          </el-form-item>
          <el-form-item prop="companyName">
            <el-input
              v-model="listQuery.companyName"
              placeholder="客户名称"
              class="filter-item"
              @keyup.enter.native="handleFilter"
            />
          </el-form-item>
          <el-form-item prop="state">
            <el-select v-model="listQuery.state" placeholder="申请状态">
              <el-option label="全部" value></el-option>
              <el-option label="待提交" :value="1"></el-option>
              <el-option label="待审批" :value="2"></el-option>
              <el-option label="审批通过" :value="3"></el-option>
              <el-option label="审批驳回" :value="4"></el-option>
            </el-select>
          </el-form-item>
          <!-- department & user BEGIN -->
          <el-form-item prop="deptName">
            <el-popover
              ref="popoverQuery"
              visible-arrow="false"
              placement="bottom-start"
              trigger="click"
              v-model="treeShowQuery"
            >
              <el-tree :data="treeData" :render-content="renderContent" @node-click="handleNodeClickQuery"></el-tree>
              <el-input
                v-popover:popoverQuery
                slot="reference"
                type="text"
                readonly
                placeholder="所属部门"
                v-model="listQuery.deptName"
              ></el-input>
            </el-popover>
          </el-form-item>
          <el-form-item prop="userName">
            <el-select v-model="listQuery.userName" filterable placeholder="负责人">
              <el-option
                :key="item.id"
                @click.native="selectClick(item.id)"
                :label="item.name || item.username"
                :value="item.name || item.username"
                v-for="item in departmentUsers"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- department & user END -->
          <el-form-item prop="comboDate">
            <el-date-picker
              v-model="comboDate"
              type="daterange"
              range-separator="-"
              start-placeholder="申请日期起"
              end-placeholder="申请日期止"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item class="btns">
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
            <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset('searchForm')">重置</el-button>
          </el-form-item>
        </el-form>
        <RadioText :options="statusOptions" newName="快捷筛选" labelKey="name" @change="switchStatus"></RadioText>
        <div class="page-content-body">
          <TableWrapper
            ref="child"
            :fetchDataFn="Api_specialSendList"
            :query="listQuery"
            :columns="tableCol"
          />
        </div>
      </div>
    </div>
    <ApplicationHandle
      v-if="showApplicationHandle"
      ref="ref_ApplicationHandle"
      @hideApplicationHandle="hideApplicationHandle"
      @getList="getList"
    ></ApplicationHandle>
    <ApplicationDetail
      v-if="showApplicationDetail"
      ref="ref_ApplicationDetail"
      @hideApplicationDetail="hideApplicationDetail"
      @getList="getList"
    ></ApplicationDetail>
  </div>
</template>

<script type="text/jsx">
import PageHead from "@/components/PageHead";
import Button from "@/components/Button";
import ApplicationHandle from "./ApplicationHandle";
import ApplicationDetail from "./ApplicationDetail";
import RadioText from "@/components/RadioText";
import {
  Api_GetCustomerGroup,
  Api_RemoveCustomer
} from "@/api/creditManagement/customerProfile/customerManagement.js";
// department & user BEGIN
import { Api_DepartmentsFetchTree, Api_DepartmentUserList } from "@/api/settings/dept.js";
// department & user END
import {
  Api_specialSendList,
  Api_specialSendCount
} from "@/api/creditManagement/shippingManagement/overstayShipment.js";
import { Api_OrderNoShip } from "@/api/creditManagement/shippingManagement/shippingTracking.js";

export default {
  name: "overstayShipment",
  components: { PageHead, ApplicationHandle, ApplicationDetail, RadioText },
  data() {
    return {
      Api_specialSendList,
      updateTime: new Date(),
      comboDate: [],
      listQuery: {
        companyName: null,
        contractName: null,
        startDate: null,
        endDate: null,
        state: null,
        // department & user BEGIN
        headDept: null,
        headId: null,
        deptName: null,
        userName: null,
        // department & user END
        quickQuery: ""
      },
      list: [], // 主列表数据
      statusOptions: [
        { id: "", name: "全部" },
        { id: 1, name: "我负责的" },
        { id: 2, name: "待我处理" }
      ],
      tableCol: [
        {
          key: "code",
          label: "申请编号",
          align: "left",
          width: 140,
          props: { "show-overflow-tooltip": true },
          render: (h, data, row) => {
            return [
                row.editable ?
                <el-link type="primary" onClick={this.gotoApplicationDetail.bind(this, row)}>  {data} </el-link> :
                <el-link type="info" disabled>  {data} </el-link>
            ]
          }
        },
        {
          key: "contractName",
          label: "订单编码/名称",
          align: "left",
          props: { "show-overflow-tooltip": true },
          render: (h, data, row) => {
            return (
              <span class="canClick" onClick={this.$gotoOrderDetail.bind(this, row.contractId)}>
                {row.contractCode + "/" + data}
              </span>
            );
          }
        },
        {
          key: "companyName",
          label: "客户名称",
          align: "left",
          props: { "show-overflow-tooltip": true },
          render: (h, data, row) => {
            return (
              <span class="a-link" onClick={this.$gotoCustomerDetail.bind(this, row.companyId)}>
                {data}
              </span>
            );
          }
        },
        {
          key: "headName",
          label: "负责人/部门",
          props: { "show-overflow-tooltip": true },
          width: 140,
          render: (h, data, row) => {
            return (
              <el-tooltip class="item" effect="dark" content={data + "/" + row.deptName} placement="top">
                <span>{data}</span>
              </el-tooltip>
            );
          }
        },
        {
          key: "createDate",
          label: "申请日期",
          width: "100px",
          render: (h, data, row) => {
            return data ? data.substr(0, 10) : "-";
          }
        },
        {
          key: "state",
          label: "当前状态",
          width: "100px",
          render: (h, data, row) => {
            return data === "1"
              ? "待提交"
              : data === "2"
              ? "待审批"
              : data === "3"
              ? "审批通过"
              : data === "4"
              ? "审批驳回"
              : "-";
          }
        },
        {
          key: null,
          label: "操作",
          width: 100,
          render: (h, data, row) => {
            return [
              (row.editable && row.state === "1") ?
                  <el-link type="primary" onClick={this.gotoApplicationHandle.bind(this, row,'edit')}> 编辑 </el-link> :
                  <el-link type="info" disabled> 编辑 </el-link>,
              (row.editable && row.state === "1") ?
                  <el-link type="primary" onClick={this.gotoDelHandle.bind(this, row)}> 删除 </el-link> :
                  <el-link type="info" disabled> 删除 </el-link>
            ]
          }
        }
      ],
      // department & user BEGIN
      treeShowQuery: false,
      treeData: [],
      departmentUsers: [],
      // department & user END
      showApplicationHandle: false,
      showApplicationDetail: false
    };
  },
  mounted() {
    if (this.$route.params && this.$route.params.companyId) {
      this.gotoApplicationHandle(this.$route.params, "add");
    }
    this.$nextTick(() => {
      this.getList();
      this.handleNodeClickQuery({});
      // department & user BEGIN
      Api_DepartmentsFetchTree().then(res => {
        this.treeData = res;
      });
      // department & user END
    });
  },
  methods: {
    // 获取主列表数据
    getList() {
      this.listQuery.startDate = this.comboDate.length > 0 ? this.comboDate[0] : "";
      this.listQuery.endDate = this.comboDate.length > 0 ? this.comboDate[1] : "";
      this.$refs.child.fetchData();
      Api_specialSendCount({ ...this.listQuery, order: true }).then(res => {
        this.statusOptions = [
          { id: "", name: "全部" },
          { id: 1, name: "我负责的" },
          { id: 2, name: "待我处理" + (res ? "(" + res + ")" : "") }
        ];
      });
    },
    // 根据查询条件获取数据
    handleFilter() {
      this.getList();
    },
    // 重置查询条件
    handleReset(formName) {
      this.$refs[formName].resetFields();
      // department & user BEGIN
      this.listQuery.headId = "";
      this.listQuery.headDept = "";
      // department & user END
      this.handleNodeClickQuery({});
    },
    // 重置form表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.listQuery.groupId = "";
    },
    switchStatus(_id) {
      this.listQuery.groupId = _id;
      this.getList();
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
      this.listQuery.deptName = item.label;
      this.listQuery.headDept = item.id;
      Api_DepartmentUserList({
        currentPage: 1,
        pageSize: 100,
        departmentIds: item.id
      }).then(res => {
        this.listQuery.userName = "";
        this.listQuery.headId = "";
        this.departmentUsers = res.data;
        this.treeShowQuery = false;
      });
    },
    selectClick(id) {
      this.listQuery.headId = id;
    },
    /**
     * @rr row data
     * @st add | edit
     */
    gotoApplicationHandle(rr, st) {
      this.showApplicationHandle = true;
      this.$nextTick(() => {
        this.$refs.ref_ApplicationHandle.open(rr, st);
      });
    },
    /**
     * 关闭
     */
    hideApplicationHandle() {
      this.showApplicationHandle = false;
    },
    /**
     * @rr row data
     */
    gotoDelHandle() {},
    /**
     * @rr row data
     */
    gotoApplicationDetail(rr) {
      this.showApplicationDetail = true;
      this.$nextTick(() => {
        this.$refs.ref_ApplicationDetail.open(rr);
      });
    },
    /**
     * 关闭
     */
    hideApplicationDetail() {
      this.showApplicationDetail = false;
    },
    switchStatus(_id) {
      this.listQuery.quickQuery = _id;
      this.$nextTick(() => {
        this.getList();
      });
    }
  }
};
</script>

<style scoped>
.text-blue {
  color: #4a9df2;
}
</style>
