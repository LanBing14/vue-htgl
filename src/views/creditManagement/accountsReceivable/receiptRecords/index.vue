<template>
  <div>
    <div v-show="!showReceiptRegistration&&!showWriteOffRegistration&&!showReceiptDetails">
      <div class="page-header">
        <h1 class="page-name">
          <span>收款记录管理</span>
        </h1>
        <div>
          <el-button @click="receiptRegistration" class="btn-color-blue" icon="el-icon-plus">收款登记</el-button>
        </div>
      </div>
      <div class="page-content">
        <el-form ref="searchForm" :model="listQuery" :inline="true" style="margin-bottom:0">
          <el-form-item prop="customerName">
            <el-input
              v-model="listQuery.customerName"
              placeholder="客户名称"
              class="filter-item"
              @keyup.enter.native="handleFilter"
            />
          </el-form-item>
          <el-form-item prop="contractInfo">
            <el-input
              v-model="listQuery.contractInfo"
              placeholder="订单名称"
              class="filter-item"
              @keyup.enter.native="handleFilter"
            />
          </el-form-item>
          <el-form-item prop="state">
            <el-select v-model="listQuery.state" placeholder="状态">
              <el-option value label="全部"></el-option>
              <el-option :value="-1" label="待提交"></el-option>
              <el-option :value="1" label="待核销"></el-option>
              <el-option :value="2" label="已核销"></el-option>
              <el-option :value="3" label="待审核"></el-option>
              <el-option :value="0" label="核销驳回"></el-option>
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
              start-placeholder="收款日期起"
              end-placeholder="收款日期止"
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
            :fetchDataFn="Api_collectionRecordPage"
            :query="listQuery"
            :columns="tableCol"
          />
        </div>
      </div>
    </div>
    <ReceiptRegistration
      ref="ref_ReceiptRegistration"
      v-if="showReceiptRegistration"
      @getList="getList"

      @hideReceiptRegistration="hideReceiptRegistration"
    ></ReceiptRegistration>
    <WriteOffRegistration
      ref="ref_WriteOffRegistration"
      @getList="getList"
      v-if="showWriteOffRegistration"
      @hideWriteOffRegistration="hideWriteOffRegistration"
    ></WriteOffRegistration>
    <ReceiptDetails
      ref="ref_ReceiptDetails"
      v-if="showReceiptDetails"
      @getList="getList"
      @hideReceiptDetails="hideReceiptDetails"
    ></ReceiptDetails>
  </div>
</template>

<script type="text/jsx">
import PageHead from "@/components/PageHead";
import Button from "@/components/Button";
import RadioText from "@/components/RadioText";
// department & user BEGIN
import { Api_DepartmentsFetchTree, Api_DepartmentUserList } from "@/api/settings/dept.js";
// department & user END
import ReceiptRegistration from "./ReceiptRegistration";
import WriteOffRegistration from "./WriteOffRegistration";
import ReceiptDetails from "./ReceiptDetails";
import {
  Api_collectionRecordPage,
  Api_collectionRecordCount,
  Api_paymentDelete,
} from "@/api/creditManagement/accountsReceivable/receiptRecords.js";
import { Api_judgeOperateAccess } from "@/api/creditManagement/index.js";
export default {
  name: "ContractLedger",
  components: { PageHead, RadioText, ReceiptRegistration, WriteOffRegistration, ReceiptDetails },
  props: {
    id: String,
  },
  data() {
    return {
      listQuery: {
        contractInfo: null,
        customerName: null,
        state: null,
        department: null,
        startDate: null,
        endDate: null,
        // department & user BEGIN
        headDept: null,
        headId: null,
        deptName: null,
        userName: null,
        // department & user END
        quickFilter: 0,
      },
      comboDate: [],
      statusOptions: [
        { id: 0, name: "全部" },
        { id: 1, name: "我负责的" },
        { id: 2, name: "待我处理" },
      ],
      // department & user BEGIN
      treeShowQuery: false,
      treeData: [],
      departmentUsers: [],
      // department & user END
      tableCol: [
        {
          label: "收款编码",
          key: "registerCode",
          align: "left",
          props: { "show-overflow-tooltip": true },
          render: (h, data, row) => {

            return (
              <span class="canClick" onClick={this.$gotoRecordsDetail.bind(this, row.registerId)}>
                {data}
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
              <span class="a-link" onClick={this.$gotoCustomerDetail.bind(this, row.customerId)}>
                {data}
              </span>
            );
          },
        },
        {
          label: "订单编码/名称",
          key: "contractName",
          align: "left",
          props: { "show-overflow-tooltip": true },
          render: (h, data, row) => {
            return (
              <span
                class="canClick"
                onClick={
                  row.orders
                    ? this.$gotoOrderDetail.bind(this, row.contractId)
                    : this.$gotoContractDetail.bind(this, row.contractId)
                }
              >
                {row.contractNo + "/" + data}
              </span>
            );
          },
        },
        {
          label: "收款日期",
          key: "payDate",
          width: 100,
          render: (h, data, row) => {
            return this.$dateFormat(data);
          },
        },
        {
          label: "收款金额(元)",
          key: "payAmount",
          align: "right",
          render: (h, data, row) => {
            return this.$toMoney(data);
          },
        },
        {
          label: "状态",
          key: "state",
          width: 100,
          render: (h, data, row) => {
            return data === "-1"
              ? "待提交"
              : data === "1"
              ? "待核销"
              : data === "2"
              ? "已核销"
              : data === "3"
              ? "待审核"
              : data === "0"
              ? "驳回"
              : "-";
          },
        },
        {
          label: "负责人",
          key: "username",
          width: 100,
          render: (h, data, row) => {
            return (
              <el-tooltip class="item" effect="dark" content={data + "/" + row.deptName} placement="top">
                <span>{data}</span>
              </el-tooltip>
            );
          },
        },
        {
          label: "操作",
          key: null,
          width: 180,
          render: (h, data, row) => {
            return [
                (row.state === "-1") ?
                  <el-link type="primary" onClick={this.editRecord.bind(this, row)}> 编辑 </el-link> :
                  <el-link type="info" disabled> 编辑 </el-link>,
                // row.state === "-1" ?
                //     <el-link type="primary" onClick={this.deleteRecord.bind(this, row)}> 删除 </el-link> :
                //     <el-link type="info" disabled> 删除 </el-link>,
                row.state === "1" ?
                    <el-link type="primary" onClick={this.writeOff.bind(this, row)}> 核销 </el-link> :
                    <el-link type="info" disabled> 核销 </el-link>,
                // row.state === "-1" ?
                //     <el-link type="primary" onClick={this.recordDetail.bind(this, row.registerId)}> 收款 </el-link> :
                //     <el-link type="info" disabled> 收款 </el-link>
            ]
          },
        },
      ],
      showReceiptRegistration: false,
      showWriteOffRegistration: false,
      showReceiptDetails: false,
    };
  },
  mounted() {

    if (this.$route.query.new) {
      this.receiptRegistration();
    }
    if (this.$route.query.id) {
      this.recordDetail(this.$route.query.id);
    }
    this.$nextTick(() => {
      // department & user BEGIN
      Api_DepartmentsFetchTree().then((res) => {
        this.treeData = res;
      });
      // department & user END
      this.getList();
      this.handleNodeClickQuery({});
    });
  },
  methods: {
    Api_collectionRecordPage,
    /**
     * @获取主列表数据
     */
    getList() {
      this.listQuery.startDate = this.comboDate.length > 0 ? this.comboDate[0] : "";
      this.listQuery.endDate = this.comboDate.length > 0 ? this.comboDate[1] : "";
      this.$refs.child.fetchData();
      Api_collectionRecordCount(this.listQuery).then((res) => {
        this.statusOptions = [
          { id: 0, name: "全部" },
          { id: 1, name: "我负责的" },
          { id: 2, name: "待我处理" + (res ? "(" + res + ")" : "") },
        ];
      });
    },

    /**
     * @收款登记
     */
    receiptRegistration() {
      if (this.$isVip()) {
        this.showReceiptRegistration = true;
        this.$nextTick(() => {
          this.$refs.ref_ReceiptRegistration.open("add", null);
        });
      } else {
        this.$vipExpireConfirm();
      }
    },
    hideReceiptRegistration() {
      this.showReceiptRegistration = false;
    },
    hideReceiptDetails() {
      this.showReceiptDetails = false;
    },
    /**
     * @快捷筛选
     */
    switchStatus(_id) {
      this.listQuery.quickFilter = _id;
      this.getList();
    },
    hideWriteOffRegistration() {
      this.showWriteOffRegistration = false;
    },
    /**
     * @编辑收款登记
     */
    editRecord(row) {
      this.showReceiptRegistration = true;
      this.$nextTick(() => {
        this.$refs.ref_ReceiptRegistration.open("edit", row);
      });
    },
    /**
     * @删除收款登记
     */
    // deleteRecord(row) {
    //   this.$confirm("确定要删除此条记录吗？", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   }).then(() => {
    //     Api_paymentDelete(row.registerId)
    //       .then((res) => {
    //         this.$message.success(res);
    //         this.getList();
    //       })
    //       .catch((res) => {
    //         this.$message.error(res);
    //       });
    //   });
    // },
    /**
     * @核销登记
     */
    writeOff(row) {
        const loading = this.$openLoading();
        Api_judgeOperateAccess(row.contractId).then(res=>{
            this.showWriteOffRegistration = true;
            this.$nextTick(() => {
              this.$refs.ref_WriteOffRegistration.open("add", row);
            });
      }).catch(err=>{
            loading.close();
            this.$alert(err, "提示", { confirmButtonText: "确定", type: "warning" });
      })

    },
    /**
     * @收款详情
     */
    recordDetail(rID) {
      this.showReceiptDetails = true;
      this.$nextTick(() => {
        this.$refs.ref_ReceiptDetails.open(rID);
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
  },
};
</script>

<style scoped>
</style>
