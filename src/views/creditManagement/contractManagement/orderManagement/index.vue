<template>
  <div>
    <div v-show="!showNewOrder&&!showOrderDetail">
      <!-- <el-button @click="testCombo()"></el-button> -->
      <div class="page-header">
        <h1 class="page-name">
          <span>销售订单</span>
        </h1>
        <div>
          <el-button @click="handleAdd" class="btn-color-blue" icon="el-icon-plus">新增订单</el-button>
        </div>
      </div>
      <div class="page-content">
        <StatisticalSetting
          ref="ref_StatisticalSetting"
          :getFn="Api_contractOrderStatistics"
          :editFn="Api_contractOrderStatisticsEdit"
          :saveFn="Api_contractOrderStatisticsSave"
          :getQuery="{order: true}"
        ></StatisticalSetting>
        <el-form ref="searchForm" :model="listQuery" :inline="true">
          <el-form-item prop="contractInfo">
            <el-input
              v-model="listQuery.contractInfo"
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
          <el-form-item prop="state">
            <el-select v-model="listQuery.state" placeholder="订单状态">
              <el-option value="0" label="待提交"></el-option>
              <el-option value="1" label="待审核"></el-option>
              <el-option value="2" label="待签约"></el-option>
              <el-option value="3" label="订单执行"></el-option>
              <el-option value="4" label="订单完成"></el-option>
              <el-option value="5" label="订单取消"></el-option>
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
                :label="item.name || item.usernae"
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
              start-placeholder="合同签订日期起"
              end-placeholder="合同签订日期止"
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
            :fetchDataFn="Api_orderGetList"
            :query="{...listQuery,order:true}"
            :columns="tableCol"
          />
        </div>
      </div>
    </div>
    <NewOrder
      v-if="showNewOrder"
      ref="ref_NewOrder"
      :contractId="contractId"
      @hideNewOrder="hideNewOrder"
      @getList="getList"
    ></NewOrder>
    <OrderDetail v-if="showOrderDetail" ref="ref_OrderDetail" @hideOrderDetail="hideOrderDetail"></OrderDetail>
    <OrderRegistration ref="ref_OrderRegistration" @getList="getList"></OrderRegistration>
    <ChangeRecords
      ref="ref_ChangeRecords"
      @contractChangeChange="orderChange_change"
      @contractChangePromise="orderChange_promise"
      @contractChangeCancel="orderChange_cancel"
    ></ChangeRecords>
  </div>
</template>

<script type="text/jsx">
import NewOrder from "./NewOrder";
import OrderDetail from "./OrderDetail";
import OrderRegistration from "./OrderRegistration";
import StatisticalSetting from "@/components/StatisticalSetting/index.vue";
import RadioText from "@/components/RadioText";
import ChangeRecords from "./ChangeRecords";
// department & user BEGIN
import { Api_DepartmentsFetchTree, Api_DepartmentUserList } from "@/api/settings/dept.js";
// department & user END
import { Api_orderGetList, Api_orderChangeJudge } from "@/api/creditManagement/contractManagement/orders.js";
import { Api_CancelContract } from "@/api/creditManagement/contractManagement/contract.js";
import {
  Api_contractOrderStatistics,
  Api_contractOrderStatisticsEdit,
  Api_contractOrderStatisticsSave,
  Api_contractOrderCount,
} from "@/api/creditManagement/contractManagement/orders.js";
import { Api_comboboxDict } from "@/api/baseApi.js";

export default {
  name: "OrderManagement",
  components: {
    NewOrder,
    OrderDetail,
    OrderRegistration,
    StatisticalSetting,
    RadioText,
    ChangeRecords,
  },
  data() {
    return {
      showNewOrder: false,
      contractId: null,
      listQuery: {
        contractInfo: null,
        customerName: null,
        state: null,
        // department & user BEGIN
        headDept: "",
        headId: "",
        deptName: "",
        userName: "",
        // department & user END
        startDate: null,
        endDate: null,
        fastFlag: 0,
      },
      comboDate: [],
      // department & user BEGIN
      treeShowQuery: false,
      treeData: [],
      departmentUsers: [],
      // department & user END
      statusOptions: [
        { id: 0, name: "全部" },
        { id: 1, name: "我负责的" },
        { id: 2, name: "待我处理" },
        { id: 3, name: "已到期的" },
        { id: 4, name: "到期提醒" },
      ],
      showOrderDetail: false,
      tableCol: [
        {
          label: "订单编号/名称",
          key: "contractCode",
          align: "left",
          props: { "show-overflow-tooltip": true, "min-width": 150 },
          render: (h, data, row) => {
            return (
              <span class="canClick" onClick={this.orderDetail.bind(this, row)}>
                {!row.readFlag && this.listQuery.fastFlag === 4 && (
                  <div class="unread-tag" style="margin-right: 4px"></div>
                )}
                {data + "/" + row.contractName}
              </span>
            );
          },
        },
        {
          label: "客户名称",
          key: "customerName",
          align: "left",
          props: { "show-overflow-tooltip": true, "min-width": 150 },
          render: (h, data, row) => {
            return (
              <span class="canClick" onClick={this.$gotoCustomerDetail.bind(this, row.customerId)}>
                {data}
              </span>
            );
          },
        },
        {
          label: "订单金额(元)",
          key: "contractAvailable",
          align: "right",
          width: "150px",
          render: (h, data, row) => {
            return this.$toMoney(data);
          },
        },
        {
          label: "回款比例",
          key: "rebate",
          width: "100px",
          align: "right",
          render: (h, data, row) => {
            return row.contractAvailable ? ((data / row.contractAvailable) * 100).toFixed(2) + "%" : "0.00%";
          },
        },
        {
          label: "负责人",
          key: "headName",
          width: "100px",
          render: (h, data, row) => {
            return (
              <el-tooltip
                class="item"
                effect="dark"
                content={row.headName + "/" + row.headDeptName}
                placement="top"
              >
                <span>{data}</span>
              </el-tooltip>
            );
          },
        },
        {
          label: "订单状态",
          width: "100px",
          key: "state",
          render: (h, data) => {
            return data === "0"
              ? "待提交"
              : data === "1"
              ? "待审核"
              : data === "2"
              ? "待签约"
              : data === "3"
              ? "订单执行"
              : data === "4"
              ? "订单完成"
              : data === "5"
              ? "订单取消"
              : "订单作废";
          },
        },
        {
          label: "签约日期",
          width: "100px",
          key: "signDate",
          render: (h, data, row) => {
            return data ? this.$dateFormat(data) : "-";
          },
        },
        {
          label: "操作",
          width: "260px",
          key: null,
          render: (h, data, row) => {
              return [
                  (row.editable && row.state === "0") ?
                      <el-link type="primary" onClick={this.orderEdit.bind(this, row)}> 编辑 </el-link> :
                      <el-link type="info" disabled> 编辑 </el-link>,
                  (row.editable && row.state === "2") ?
                      <el-link type="primary" onClick={this.orderSign.bind(this, row)}> 登记 </el-link> :
                      <el-link type="info" disabled> 登记 </el-link>,
                  // (row.editable && row.state === "0") ?
                  //     <el-link type="primary" onClick={this.orderDelete.bind(this, row)}> 作废 </el-link> :
                  //     <el-link type="info" disabled> 作废 </el-link>,
                  (row.editable && row.state === "3") ?
                      <el-link type="primary" onClick={this.orderChange_change.bind(this, row)}> 变更 </el-link> :
                      <el-link type="info" disabled> 变更 </el-link>,
                  // (row.editable && row.state === "3") ?
                  //     <el-link type="primary" onClick={this.orderChange_promise.bind(this, row)}> 完成 </el-link> :
                  //     <el-link type="info" disabled> 完成 </el-link>,
                  // (row.editable && row.state === "3") ?
                  //     <el-link type="primary" onClick={this.orderChange_cancel.bind(this, row)}> 取消 </el-link> :
                  //     <el-link type="info" disabled> 取消 </el-link>,
                  // (row.editable && row.displayable) ?
                  //     <el-link type="primary" onClick={this.changeRecords.bind(this, row)}> 记录 </el-link> :
                  //     <el-link type="info" disabled> 记录 </el-link>,
              ]
          },
        },
      ],
    };
  },
  mounted() {
    if (this.$route.query.id) {
      this.orderDetail(this.$route.query.id);
    }
    if (this.$route.query.new) {
      this.handleAdd();
    }
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
    Api_orderGetList,
    Api_contractOrderStatistics,
    Api_contractOrderStatisticsEdit,
    Api_contractOrderStatisticsSave,
    /**
     * @get
     * @list
     */
    getList() {
      this.listQuery.startDate = this.comboDate.length > 0 ? this.comboDate[0] : "";
      this.listQuery.endDate = this.comboDate.length > 0 ? this.comboDate[1] : "";
      this.$refs.child.fetchData();
      this.$refs.ref_StatisticalSetting.getData();
      Api_contractOrderCount({ ...this.listQuery, order: true }).then((res) => {
        this.statusOptions = [
          { id: 0, name: "全部" },
          { id: 1, name: "我负责的" },
          { id: 2, name: "待我处理" + (res.todo ? "(" + res.todo + ")" : "") },
          { id: 3, name: "已到期的" },
          { id: 4, name: "到期提醒" + (res.maturity ? "(" + res.maturity + ")" : "") },
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
      this.listQuery.startDate = "";
      this.listQuery.endDate = "";
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
     * @add
     */
    handleAdd() {
      if (this.$isVip()) {
        this.showNewOrder = true;
        this.$nextTick(() => {
          this.$refs.ref_NewOrder.open("add", null, null, null);
        });
      } else {
        this.$vipExpireConfirm();
      }
    },
    /**
     * @订单详情
     */
    orderDetail(row) {
      this.showOrderDetail = true;
      this.$nextTick(() => {
        this.$refs.ref_OrderDetail.open(row.id,row);
      });
    },
    /**
     * @订单编辑
     */
    orderEdit(_r) {
      this.showNewOrder = true;
      this.modelStatus = "edit";
      this.contractId = _r.id;
      this.$nextTick(() => {
        this.$refs.ref_NewOrder.open("edit", _r.id, null, null,_r);
      });
    },
    /**
     * @订单签约
     */
    orderSign(_r) {
      this.$refs.ref_OrderRegistration.open(_r);
    },
    /**
     * @订单删除
     */
    orderDelete(_r) {
      this.$confirm("确定订单作废吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const loading = this.$openLoading();
          Api_CancelContract(_r.id)
            .then(() => {
              loading.close();
              this.$message.success("作废成功！");
              this.getList();
            })
            .catch((res) => {
              loading.close();
              this.$message.error(res);
            });
        })
        .catch(() => {});
    },
    /**
     * @订单变更
     */
    orderChange_change(_r) {
      Api_orderChangeJudge(_r.id, { applyType: "2",tabType:1})
        .then((res) => {
          this.modelStatus = "change";
          this.contractId = _r.id;
          this.showNewOrder = true;
          this.$nextTick(() => {
            this.$refs.ref_NewOrder.open("change", _r.id, res, "2",_r);
          });
        })
        .catch((res) => {
          this.$message.error(res);
        });
    },
    orderChange_promise(_r) {
      Api_orderChangeJudge(_r.id, { applyType: "3" })
        .then((res) => {
          this.modelStatus = "change";
          this.contractId = _r.id;
          this.showNewOrder = true;
          this.$nextTick(() => {
            this.$refs.ref_NewOrder.open("change", _r.id, res, "3");
          });
        })
        .catch((res) => {
          this.$message.error(res);
        });
    },
    orderChange_cancel(_r) {
      Api_orderChangeJudge(_r.id, { applyType: "4" })
        .then((res) => {
          this.modelStatus = "change";
          this.contractId = _r.id;
          this.showNewOrder = true;
          this.$nextTick(() => {
            this.$refs.ref_NewOrder.open("change", _r.id, res, "4");
          });
        })
        .catch((res) => {
          this.$message.error(res);
        });
    },
    changeRecords(row) {
      this.$refs.ref_ChangeRecords.open(row);
    },
    /**
     * @hide
     * @add
     */
    hideNewOrder() {
      this.showNewOrder = false;
    },
    /**
     * @订单详情
     * @隐藏
     */
    hideOrderDetail() {
      this.showOrderDetail = false;
    },
    /**
     * @快捷筛选
     */
    switchStatus(_id) {
      this.listQuery.fastFlag = _id;
        this.getList();
    },
    testCombo() {
      Api_comboboxDict("boolean");
    },
  },
};
</script>

<style>
</style>
