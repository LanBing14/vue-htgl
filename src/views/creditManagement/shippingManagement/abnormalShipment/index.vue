<template>
  <div>
    <div v-show="!showAbnormalHandle&&!showAbnormalDetail">
      <div class="page-header">
        <h1 class="page-name">
          <span>异常发货处理</span>
        </h1>
      </div>
      <div class="page-content">
        <el-form ref="searchForm" :model="listQuery" :inline="true" style="margin-bottom:0">
          <el-form-item prop="contractNo">
            <el-input
              v-model="listQuery.contractNo"
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
            <el-select v-model="listQuery.state" placeholder="异常处理状态">
              <el-option label="待处理" :value="1"></el-option>
              <el-option label="待审批" :value="2"></el-option>
              <el-option label="处理中" :value="3"></el-option>
              <el-option label="处理完成" :value="4"></el-option>
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
              start-placeholder="签收日期起"
              end-placeholder="签收日期止"
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
            :fetchDataFn="Api_getAbnormalPage"
            :query="listQuery"
            :columns="tableCol"
          />
        </div>
      </div>
    </div>
    <AbnormalHandle
      v-if="showAbnormalHandle"
      ref="ref_AbnormalHandle"
      @hideAbnormalHandle="hideAbnormalHandle"
      @getList="getList"
    ></AbnormalHandle>
    <AbnormalDetail
      v-if="showAbnormalDetail"
      ref="ref_AbnormalDetail"
      @hideAbnormalDetail="hideAbnormalDetail"
      @getList="getList"
    ></AbnormalDetail>
  </div>
</template>

<script type="text/jsx">
import PageHead from "@/components/PageHead";
import Button from "@/components/Button";
import AbnormalHandle from "./AbnormalHandle";
import AbnormalDetail from "./AbnormalDetail";
import RadioText from "@/components/RadioText";
import {
  Api_GetCustomerGroup,
  Api_RemoveCustomer
} from "@/api/creditManagement/customerProfile/customerManagement.js";
// department & user BEGIN
import { Api_DepartmentsFetchTree, Api_DepartmentUserList } from "@/api/settings/dept.js";
// department & user END
import {
  Api_getAbnormalPage,
  Api_getAbnormalCount
} from "@/api/creditManagement/shippingManagement/abnormalShipment.js";

export default {
  name: "abnormalShipment",
  components: { PageHead, AbnormalHandle, AbnormalDetail, RadioText },
  data() {
    return {
      Api_getAbnormalPage,
      updateTime: new Date(),
      comboDate: [],
      listQuery: {
        companyName: null,
        contractNo: null,
        startDate: null,
        endDate: null,
        state: null,
        // department & user BEGIN
        headDept: null,
        headId: null,
        deptName: null,
        userName: null,
        // department & user END
        quickQuery: 0
      },
      list: [], // 主列表数据
      statusOptions: [
        { id: 0, name: "全部" },
        { id: 1, name: "我负责的" },
        { id: 2, name: "待我处理" }
      ],
      tableCol: [
        {
          key: "shipmentCode",
          label: "发货编码",
          align: "left",
          width: "150px",
          props: { "show-overflow-tooltip": true },
          render: (h, data, row) => {
            return [
                row.editable ?
                <el-link type="primary" onClick={this.gotoAbnormalDetail.bind(this, row)}> {data} </el-link> :
                <el-link type="info" disabled> {data} </el-link>
            ]
          }
        },
        {
          key: "contractName",
          label: "订单名称",
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
          key: "registerDate",
          label: "签收日期",
          width: "100px",
          render: (h, data, row) => {
            return data ? this.$dateFormat(data) : "-";
          }
        },
        {
          key: "headUser",
          label: "负责人/部门",
          props: { "show-overflow-tooltip": true },
          width: 140,
          render: (h, data, row) => {
            return (
              <el-tooltip class="item" effect="dark" content={data + "/" + row.headDept} placement="top">
                <span>{data}</span>
              </el-tooltip>
            );
          }
        },
        {
          key: "state",
          label: "当前状态",
          width: "100px",
          render: (h, data, row) => {
            return data === "1"
              ? "待处理"
              : data === "2"
              ? "待审批"
              : data === "3"
              ? "处理中"
              : data === "4"
              ? "处理完成"
              : "-";
          }
        },
        {
          key: null,
          label: "操作",
          width: 80,
          render: (h, data, row) => {
              return [
                  (row.editable && row.state === "1") ?
                      <el-link type="primary" onClick={this.gotoAbnormalHandle.bind(this, row)}> 处理 </el-link> :
                      <el-link type="info" disabled> 处理 </el-link>
              ]
          }
        }
      ],
      // department & user BEGIN
      treeShowQuery: false,
      treeData: [],
      departmentUsers: [],
      // department & user END
      showAbnormalHandle: false,
      showAbnormalDetail: false
    };
  },
  mounted() {
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
      Api_getAbnormalCount({ ...this.listQuery, order: true }).then(res => {
        this.statusOptions = [
          { id: 0, name: "全部" },
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
     */
    gotoAbnormalHandle(rr) {
      this.showAbnormalHandle = true;
      this.$nextTick(() => {
        this.$refs.ref_AbnormalHandle.open(rr);
      });
    },
    /**
     * 关闭
     */
    hideAbnormalHandle() {
      this.showAbnormalHandle = false;
    },
    /**
     * @rr row data
     */
    gotoAbnormalDetail(rr) {
      this.showAbnormalDetail = true;
      this.$nextTick(() => {
        this.$refs.ref_AbnormalDetail.open(rr);
      });
    },
    /**
     * 关闭
     */
    hideAbnormalDetail() {
      this.showAbnormalDetail = false;
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
