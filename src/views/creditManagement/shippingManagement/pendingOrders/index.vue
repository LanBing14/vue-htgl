<template>
  <div>
    <div v-show="!showShippingRegister">
      <div class="page-header">
        <h1 class="page-name">
          <span>待发货订单</span>
        </h1>
      </div>
      <div class="page-content">
        <el-form ref="searchForm" :model="listQuery" :inline="true">
          <el-form-item prop="contractName">
            <el-input
              v-model="listQuery.contractName"
              placeholder="订单名称/编码"
              class="filter-item"
              @keyup.enter.native="handleFilter"
            />
          </el-form-item>
          <el-form-item prop="customerName">
            <el-input
              v-model="listQuery.customerName"
              placeholder="客户名称"
              class="filter-item"
              @keyup.enter.native="handleFilter"
            />
          </el-form-item>
          <el-form-item prop="sendState">
            <el-select v-model="listQuery.sendState" placeholder="订单状态">
              <el-option value="0" label="待发货"></el-option>
              <el-option value="1" label="已发货"></el-option>
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
              <el-input slot="reference" type="text" readonly placeholder="所属部门" v-model="listQuery.deptName"></el-input>
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
              value-format="yyyy-MM-dd"
              start-placeholder="订单签订日期起"
              end-placeholder="订单签订日期止"
            ></el-date-picker>
          </el-form-item>
          <el-form-item class="btns">
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
            <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset('searchForm')">重置</el-button>
          </el-form-item>
          <RadioText :options="statusOptions" newName="快捷筛选" labelKey="name" @change="switchStatus"></RadioText>
        </el-form>
        <TableWrapper ref="child" :fetchDataFn="Api_orderNoShipPage" :query="listQuery" :columns="tableCol" />
      </div>
    </div>
    <ShippingRegister
      v-if="showShippingRegister"
      ref="ref_ShippingRegister"
      @getList="getList"
      @hideShippingRegister="hideShippingRegister"
    ></ShippingRegister>
  </div>
</template>

<script type="text/jsx">
import ShippingRegister from "./ShippingRegister";
import RadioText from "@/components/RadioText";
// department & user BEGIN
import { Api_DepartmentsFetchTree, Api_DepartmentUserList } from "@/api/settings/dept.js";
// department & user END
import {
  Api_orderNoShipPage,
  Api_orderNoShipCount,
  Api_orderNoShipDetail,
} from "@/api/creditManagement/shippingManagement/pendingOrders.js";
import { Api_judgeOperateAccess } from "@/api/creditManagement/index.js";

export default {
  name: "PendingOrders",
  components: { ShippingRegister, RadioText },
  data() {
    return {
      showShippingRegister: false,
      listQuery: {
        contractName: null,
        customerName: null,
        sendState: "0",
        // department & user BEGIN
        headDept: "",
        headId: "",
        deptName: "",
        userName: "",
        // department & user END
        shipDateStart: null,
        shipDateEnd: null,
        quickQuery: "",
      },
      comboDate: [],
      // department & user BEGIN
      treeShowQuery: false,
      treeData: [],
      departmentUsers: [],
      // department & user END
      statusOptions: [
        { id: "", name: "全部" },
        { id: 0, name: "我负责的" },
        { id: 1, name: "待我处理" },
        { id: 2, name: "已到期的" },
        { id: 3, name: "到期提醒" },
      ],
      tableCol: [
        {
          label: "订单编码/名称",
          key: "contractNo",
          align: "left",
          props: { "show-overflow-tooltip": true },
          render: (h, data, row) => {
            return (
              <span class="canClick" onClick={this.$gotoOrderDetail.bind(this, row.id)}>
                {!row.noShipReadFlag && <div class="unread-tag" style="margin-right: 4px"></div>}
                {data + "/" + row.contractName}
              </span>
            );
          },
        },
        {
          label: "客户名称",
          key: "companyName",
          align: "left",
          props: { "show-overflow-tooltip": true },
          render: (h, data, row) => {
            return (
              <span class="canClick" onClick={this.$gotoCustomerDetail.bind(this, row.companyId)}>
                {data}
              </span>
            );
          },
        },
        {
          label: "负责人",
          props: { "show-overflow-tooltip": true },
          width: 140,
          key: "headName",
          render: (h, data, row) => {
            return (
              <el-tooltip class="item" effect="dark" content={data + "/" + row.headDept} placement="top">
                <span>{data}</span>
              </el-tooltip>
            );
          },
        },
        {
          label: "发货日期",
          key: "outGoodsDate",
          width: 100,
          render: (h, data, row) => {
            return data ? this.$dateFormat(data) : "-";
          },
        },
        { label: "销售数量", width: 140, key: "num", align: "right" },
        { label: "已发数量", width: 140, key: "sendNum", align: "right" },
        {
          label: "操作",
          key: null,
          width: 200,
          render: (h, data, row) => {
             console.log(row,'啦啦啦啦')
            return [

                (row.state === null || (row.send === "0" && row.state !== "0")) ?
                    <el-link type="primary" onClick={this.shippingRegister.bind(this, row)}> 登记 </el-link> :
                    <el-link type="info" disabled> 登记 </el-link>,
                (row.state === "0") ?
                    <el-link type="primary" onClick={this.shippingRegisterEdit.bind(this, row)}> 编辑 </el-link> :
                    <el-link type="info" disabled> 编辑 </el-link>,
                (row.isBad) ?
                    <el-link type="primary" onClick={this.gotoSpecialShipment.bind(this, row)}> 特殊发货 </el-link> :
                    <el-link type="info" disabled> 特殊发货 </el-link>,
            ]
          },
        },
      ],
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
    Api_orderNoShipPage,
    /**
     * @get
     * @list
     */
    getList() {
      this.listQuery.shipDateStart = this.comboDate.length > 0 ? this.comboDate[0] : "";
      this.listQuery.shipDateEnd = this.comboDate.length > 0 ? this.comboDate[1] : "";
      this.$refs.child.fetchData();
      Api_orderNoShipCount(this.listQuery).then((res) => {
        this.statusOptions = [
          { id: "", name: "全部" },
          { id: 0, name: "我负责的" },
          { id: 1, name: "待我处理" + (res.dealNum ? "(" + res.dealNum + ")" : "") },
          { id: 2, name: "已到期的" },
          {
            id: 3,
            name: "到期提醒" + (res.expiringSoonNum ? "(" + res.expiringSoonNum + ")" : ""),
          },
        ];
      });
    },
    /**
     * @发货登记
     */
    shippingRegister(row) {
      const loading = this.$openLoading();
      Api_judgeOperateAccess(row.id)
        .then((res) => {
          this.$nextTick(() => {
            Api_orderNoShipDetail(row.id)
              .then((res) => {
                loading.close();
                if (typeof res === "string") {
                  this.$alert(res, "提示", {
                    confirmButtonText: "确定",
                    type: "warning",
                  });
                  return false;
                }
                this.showShippingRegister = true;
                this.$nextTick(() => {
                  this.$refs.ref_ShippingRegister.open("add", row.id, res);
                });
              })
              .catch((res) => {
                loading.close();
                this.$alert(res, "提示", {
                  confirmButtonText: "确定",
                  type: "warning",
                });
                return false;
              });
          });
        })
        .catch((res) => {
          loading.close();
          this.$alert(res, "提示", { confirmButtonText: "确定", type: "warning" });
        });
    },
    /**
     * @编辑发货登记
     */
    shippingRegisterEdit(row) {
      this.$nextTick(() => {
        const loading = this.$openLoading();
        Api_orderNoShipDetail(row.id)
          .then((res) => {
            loading.close();
            if (typeof res === "string") {
              this.$alert(res, "提示", {
                confirmButtonText: "确定",
                type: "warning",
                callback: () => {
                  this.$emit("hideShippingRegister");
                },
              });
              return false;
            }
            this.showShippingRegister = true;
            this.$nextTick(() => {
              this.$refs.ref_ShippingRegister.open("edit", row.id, res);
            });
          })
          .catch((res) => {
            loading.close();
            this.$alert(res, "提示", {
              confirmButtonText: "确定",
              type: "warning",
              callback: () => {
                this.$emit("hideShippingRegister");
              },
            });
            return false;
          });
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
      this.listQuery.shipDateStart = "";
      this.listQuery.shipDateEnd = "";
      this.comboDate = [];
      this.handleNodeClickQuery({});
    },
    // 重置form表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
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
    /**
     * @hide
     * @add
     */
    hideShippingRegister() {
      this.showShippingRegister = false;
    },
    /**
     * @快捷筛选
     */
    switchStatus(_id) {
      this.listQuery.quickQuery = _id;
      this.getList();
    },
    /**
     * 跳转特殊发货申请
     * @rr row data
     */
    gotoSpecialShipment(rr) {
      this.$router.push({
        name: "overstayShipment",
        params: {
          companyId: rr.companyId,
          companyName: rr.companyName,
          contractId: rr.id,
          contractName: rr.contractName,
          contractNo: rr.contractNo,
          sendUserId: rr.userId,
          headDept: rr.headDept,
          headDeptId: rr.headDeptId,
        },
      });
    },
  },
};
</script>

<style>
</style>
