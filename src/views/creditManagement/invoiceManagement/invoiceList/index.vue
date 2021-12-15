<template>
  <div>
    <div v-if="!showBillingDetails">
      <div class="page-header">
        <h1 class="page-name">
          <span>发票管理</span>
        </h1>
      </div>
      <div class="page-content">
        <el-form ref="searchForm" :model="listQuery" :inline="true">
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
          <el-form-item class="btns">
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
            <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset('searchForm')">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="page-content-body">
          <TableWrapper ref="child" :fetchDataFn="Api_GetInvoiceList" :query="listQuery" :columns="tableCol" />
        </div>
      </div>
    </div>
    <BillingApplication
      ref="ref_BillingApplication"
      v-else-if="showBillingDetails && flag === '0'"
      :row="selectData"
      @showMain="showMain"
    ></BillingApplication>
    <BillingDetails
      ref="ref_BillingDetails"
      v-else-if="showBillingDetails && flag === '1'"
      :row="selectData"
      @showMain="showMain"
    ></BillingDetails>
  </div>
</template>

<script type="text/jsx">
import PageHead from "@/components/PageHead";
import Button from "@/components/Button";
import { Api_GetInvoiceList, Api_GetInvoiceInfo } from "@/api/creditManagement/invoice/invoice.js";
// department & user BEGIN
import { Api_DepartmentsFetchTree, Api_DepartmentUserList } from "@/api/settings/dept.js";
import { Api_judgeOperateAccess } from "@/api/creditManagement/index.js";
// department & user END
import BillingApplication from "./BillingApplication";
import BillingDetails from "./BillingDetails";

export default {
  name: "InvoiceList",
  components: { PageHead, BillingDetails, BillingApplication },
  data() {
    return {
      Api_GetInvoiceList,
      updateTime: new Date(),
      listQuery: {
        companyName: "",
        contractCodeName: "",
        // department & user BEGIN
        headDept: "",
        headId: "",
        deptName: "",
        userName: ""
        // department & user END
      },
      flag: "0",
      selectData: {},
      list: [], // 主列表数据
      tableCol: [
        {
          key: "companyName",
          label: "客户名称",
          align: "left",
          props: {
            "show-overflow-tooltip": true,
            "min-width": 150
          },
          render: (h, data, row) => {
            return (  
              <span class="a-link" onClick={this.$gotoCustomerDetail.bind(this, row.companyId)}>
                {data}
              </span>
            );
          }
        },
        {
          key: "contractName",
          label: "订单编号/名称",
          align: "left",
          props: {
            "show-overflow-tooltip": true,
            "min-width": 150
          },
          render: (h, data, row) => {
   
            return (
              <span class="canClick" onClick={this.$gotoOrderDetail.bind(this, row.id)}>
              {row.contractNo}/{data}
              </span>
            );
          }
        },
        {
          key: "contractAmount",
          label: "订单金额(元)",
          align: "right",
          render: (h, data) => {
            return this.$toMoney(data, 2);
          }
        },
        {
          key: "dkAmount",
          label: "待开金额(元)",
          align: "right",
          render: (h, data) => {
            return this.$toMoney(data, 2);
          }
        },
        {
          key: "ykAmount",
          label: "已开金额(元)",
          align: "right",
          render: (h, data) => {
            return this.$toMoney(data, 2);
          }
        },
        {
          key: "username",
          label: "负责人",
          render: (h, data, row) => {
            return (
              <el-tooltip class="item" effect="dark" content={data + "/" + row.deptName} placement="top">
                <span>{data}</span>
              </el-tooltip>
            );
          }
        },
        {
          key: null,
          label: "操作",
          width:150,
          render: (h, data, row) => {
            return  [
                row.editable ?
                    <el-link type="primary" onClick={this.billingApplication.bind(this, row)}> 开票申请 </el-link> :
                    <el-link type="info" disabled> 开票申请 </el-link>,
                    <el-link type="primary" onClick={this.billingDetails.bind(this, row)}> 开票详情 </el-link>,
            ]
          }
        }
      ],
      // department & user BEGIN
      treeShowQuery: false,
      treeData: [],
      departmentUsers: [],
      // department & user END
      showBillingDetails: false
    };
  },
  mounted() {
    if (this.$route.query.id) {
      this.selectData = { id: this.$route.query.id };
      this.flag = "1";
      this.showBillingDetails = true;
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
      this.$refs.child.fetchData();
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
    },
    billingApplication(_row) {
      Api_judgeOperateAccess(_row.id)
        .then(res => {
          if (res) {
            Api_GetInvoiceInfo(_row.id)
              .then(res => {
                if (_row.dkAmount - res.ysqAmount > 0) {
                  this.showBillingDetails = true;
                  this.flag = "0";
                  this.selectData = _row;
                  // this.$refs.ref_BillingApplication.open(_row);
                } else {
                  this.$confirm(
                    "当前合同待开发票金额为:" + _row.dkAmount + ",您已经提交了开票申请，无法重复提交"
                  )
                    .then(() => {
                      console.log("已取消");
                    })
                    .catch(() => {});
                }
              })
              .catch(res => {
                this.$message.error(res);
              });
          } else {
            this.$message.info(res);
          }
        })
        .catch(res => {
          this.$message.error(res);
        });
    },
    billingDetails(_row) {
      this.showBillingDetails = true;
      this.flag = "1";
      this.selectData = _row;
      // this.$refs.ref_BillingDetails.initPage(_row);
    },
    // hideBillingDetails() {
    //     this.showBillingDetails = false;
    // },
    showMain() {
      this.showBillingDetails = false;
      this.$nextTick(() => {
        this.getList();
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
    }
    // department & user END
  }
};
</script>

<style scoped>
.text-blue {
  color: #4a9df2;
}
</style>
