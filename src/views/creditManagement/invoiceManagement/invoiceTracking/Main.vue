<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>发票跟踪</span>
      </h1>
    </div>
    <div class="page-content">
      <el-form ref="searchForm" :model="listQuery" :inline="true" class="xiu-form">
        <el-form-item prop="companyName">
          <el-input
            v-model="listQuery.companyName"
            placeholder="客户名称"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item prop="contractCodeName">
          <el-input
            v-model="listQuery.contractCodeName"
            placeholder="订单名称"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
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
        <el-form-item prop="status">
          <el-select v-model="listQuery.status" placeholder="发票状态">
            <el-option :key="item.id" :value="item.id" :label="item.label" v-for="item in statusOptions"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="comboDate">
          <div class="block">
            <el-date-picker
              v-model="comboDate"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item class="btns">
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset('searchForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="radio-text-wrap">
        <div class="radio-text-label">
          <template>快捷筛选</template>
        </div>
        <div class="radio-text-item">
          <div
            :class="{'text-blue': listQuery.searchType === ''}"
            class="radio-item"
            @click="changeOption('')"
          >全部</div>
          <div
            :class="{'text-blue': listQuery.searchType === 1}"
            class="radio-item"
            @click="changeOption(1)"
          >我负责的</div>
          <div :class="{'text-blue': listQuery.searchType === 2}" class="radio-item" @click="changeOption(2)">
            <span>待我处理</span>
            <span v-if="count !== 0">{{ '(' + count + ')' }}</span>
          </div>
        </div>
      </div>
      <div class="page-content-body">
        <TableWrapper ref="child" :fetchDataFn="Api_GetTrackingList" :query="listQuery" :columns="tableCol" />
      </div>
    </div>
  </div>
</template>

<script type="text/jsx">
import PageHead from "@/components/PageHead";
import RadioText from "@/components/RadioText";
import {
  Api_GetTrackingList,
  Api_invoiceWaitBack,
  Api_invoiceReceiveBack,
  Api_invoiceInvalid,
  Api_invoiceCount,
} from "@/api/creditManagement/invoice/invoiceTracking.js";
// department & user BEGIN
import { Api_DepartmentsFetchTree, Api_DepartmentUserList } from "@/api/settings/dept.js";
// department & user END
import Edit from "./Edit";
import Receive from "./Receive";
import Registration from "./Registration";
import Signed from "./Signed";

export default {
  name: "Main",
  components: { PageHead, RadioText, Edit, Receive, Registration, Signed },
  data() {
    return {
      Api_GetTrackingList,
      comboDate: [],
      statusOptions: [
        { id: "0", label: "开票申请" },
        { id: "1", label: "发票待开" },
        { id: "2", label: "待领取" },
        { id: "3", label: "待签收" },
        { id: "4", label: "已签收" },
        { id: "5", label: "签收异常" },
        { id: "6", label: "已作废" },
      ],
      listQuery: {
        companyName: "",
        contractCodeName: "",
        dutyId: "",
        status: "",
        // department & user BEGIN
        headDept: "",
        headId: "",
        deptName: "",
        userName: "",
        // department & user END
        searchType: "",
      },
      tableCol: [
        {
          key: "invoiceCode",
          label: "开票申请编码",
          width: 150,
          props: {
            "show-overflow-tooltip": true,
          },
          render: (h, data, row) => {
            return [
                // (row.editable && row.status !== "1" && row.status !== "0") ?
                <el-link type="primary" onClick={this.openDetail.bind(this, row)}> {data} </el-link> 
                // :
                // <el-link type="info" disabled> {data} </el-link>
            ]
          },
        },
        {
          key: "companyName",
          label: "客户名称",
          align: "left",
          props: {
            "show-overflow-tooltip": true,
            "min-width": 150,
          },
          render: (h, data, row) => {
            return (
              <span class="a-link" onClick={this.$gotoCustomerDetail.bind(this, row.companyId)}>
                {data}
              </span>
            );
          },
        },
        {
          key: "contractName",
          label: "订单名称",
          align: "left",
          width: 150,
          props: {
            "show-overflow-tooltip": true,
          },
          render: (h, data, row) => {
            return (
              <span class="canClick" onClick={this.$gotoOrderDetail.bind(this, row.contractId)}>
                {data}
              </span>
            );
          },
        },
        {
          key: "applyContractMoney",
          label: "开票金额(元)",
          align: "right",
          render: (h, data) => {
            return this.$toMoney(data, 2);
          },
        },
        {
          key: "invoiceDate",
          label: "申请开票日期",
          render: (h, data) => {
            return this.$dateFormat(data, "yyyy-MM-dd");
          },
        },
        {
          key: "status",
          label: "发票状态",
          render: (h, data, row) => {
            return data === "0"
              ? "开票申请"
              : data === "1"
              ? "发票待开"
              : data === "2"
              ? "待领取"
              : data === "3"
              ? "待签收"
              : data === "4"
              ? "已签收"
              : data === "5"
              ? "签收异常"
              : data === "6"
              ? "已作废"
              : "";
          },
        },
        {
          key: "signDate",
          label: "签收日期",
          render: (h, data) => {
            return this.$dateFormat(data, "yyyy-MM-dd");
          },
        },
        {
          key: "dutyName",
          label: "负责人",
          render: (h, data, row) => {
            return (
              <el-tooltip class="item" effect="dark" content={data + "/" + row.deptName} placement="top">
                <span>{data}</span>
              </el-tooltip>
            );
          },
        },
        {
          key: null,
          label: "操作",
          width: 260,
          render: (h, data, row) => {
              return [
                  (row.editable && row.status === "0") ?
                      <el-link type="primary" onClick={this.openEdit.bind(this, row)}> 编辑 </el-link> :
                      <el-link type="info" disabled> 编辑 </el-link>,
                  (row.editable && (row.status === "0" || row.status === "5")) ?
                      <el-link type="primary" onClick={this.invalid.bind(this, row)}> 作废 </el-link> :
                      <el-link type="info" disabled> 作废 </el-link>,
                  (row.editable && row.status === "1") ?
                      <el-link type="primary" onClick={this.openRegistration.bind(this, row)}> 登记 </el-link> :
                      "",
                 /* (row.editable && row.status === "1") ?
                      <el-link type="primary" onClick={this.waitBack.bind(this, row)}> 打回 </el-link> :
                      "",*/
               /*   (row.editable && row.status === "2") ?
                      <el-link type="primary" onClick={this.receiveBack.bind(this, row)}> 打回 </el-link> :
                      "",*/
                  (row.editable && row.status === "2") ?
                      <el-link type="primary" onClick={this.openReceive.bind(this, row)}> 登记 </el-link> :
                      "",
                  (row.editable && (row.status === "3" || row.status === "5")) ?
                      <el-link type="primary" onClick={this.openSigned.bind(this, row)}> 登记 </el-link> :
                      "",
              ]
          },
        },
      ],
      // department & user BEGIN
      treeShowQuery: false,
      treeData: [],
      departmentUsers: [],
      // department & user END
      count: 0,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getList();
      this.handleNodeClickQuery({});
      // department & user BEGIN
      Api_DepartmentsFetchTree().then((res) => {
        this.treeData = res;
      });
      // department & user END
    });
  },
  methods: {
    // 获取主列表数据
    getList() {
      this.listQuery.registerDateStart = this.comboDate.length > 0 ? this.comboDate[0] : "";
      this.listQuery.registerDateEnd = this.comboDate.length > 0 ? this.comboDate[1] : "";
      this.$refs.child.fetchData();
      Api_invoiceCount({ searchType: 2 })
        .then((res) => {
          if (res !== 0) {
            this.count = res;
          }
        })
        .catch((res) => {
          this.$message.error(res);
        });
    },
    // 根据查询条件获取数据
    handleFilter() {
      this.getList();
    },
    // 重置查询条件
    handleReset(formName) {
      this.comboDate = [];
      // this.listQuery.status = '';
      this.$refs[formName].resetFields();
      // department & user BEGIN
      this.listQuery.headId = "";
      this.listQuery.headDept = "";
      // department & user END
      this.handleNodeClickQuery({});
    },
    // status
    onStatusChange(val) {
      this.listQuery.status = val;
      this.getList();
    },
    // 跟踪详情
    openDetail(row) {
      this.$emit("edit", true, row, "0");
    },
    // 打开发票登记
    openRegistration(row) {
      this.$emit("edit", true, row, "2");
    },
    // 打开发票领取
    openReceive(row) {
      this.$emit("edit", true, row, "1");
    },
    // 打开发票签收
    openSigned(row) {
      this.$emit("edit", true, row, "3");
    },
    // 打开编辑
    openEdit(row) {
      this.$emit("edit", true, row, "4");
    },
    // 发票待开-打回
    waitBack(row) {
      this.$prompt("请输入打回原因，不超过200字", "打回", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^.{1,200}$/,
        inputErrorMessage: "打回原因字符不得超过200字",
      })
        .then(({ value }) => {
          Api_invoiceWaitBack(row.id, value)
            .then((res) => {
              this.$message.success(res);
              this.getList();
            })
            .catch((res) => {
              this.$message.error(res);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    // 待领取-打回
    receiveBack(row) {
      this.$prompt("请输入打回原因，不超过200字", "打回", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^.{1,200}$/,
        inputErrorMessage: "打回原因字符不得超过200字",
      })
        .then(({ value }) => {
          Api_invoiceReceiveBack(row.id, value)
            .then((res) => {
              this.$message.success(res);
              this.getList();
            })
            .catch((res) => {
              this.$message.error(res);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    // 作废
    invalid(row) {
      this.$confirm("确定作废该条信息吗？").then(() => {
        Api_invoiceInvalid(row.id)
          .then((res) => {
            this.$message.success(res);
            this.getList();
          })
          .catch(() => {
            this.$message.error(res);
          });
      });
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
        departmentIds: item.id,
      }).then((res) => {
        this.listQuery.userName = "";
        this.listQuery.headId = "";
        this.departmentUsers = res.data;
        this.treeShowQuery = false;
      });
    },
    selectClick(id) {
      this.listQuery.headId = id;
    },
    // department & user END
    changeOption(value) {
      this.listQuery.searchType = value;
      this.getList();
    },
  },
};
</script>

<style scoped lang="scss">
.radio-text-wrap {
  margin-bottom: 15px;
  margin-top: 6px;
  display: flex;
  color: #606266;
  align-items: center;

  .radio-text-label {
    font-weight: bold;
    line-height: 24px;
    height: 24px;
    margin-right: 10px;
  }

  .radio-text-item {
    flex: 1;
    display: flex;
    align-items: center;

    .radio-item {
      cursor: pointer;
      line-height: 24px;
      height: 24px;
      margin-right: 10px;
      padding: 0 15px;
    }
  }
}

.text-blue {
  color: #4a9df2;
}
</style>
