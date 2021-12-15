<template>
  <div>
    <div v-show="!showPaymentDetail&&!showExtendedExpiryDate&&!showReceiptRegistration">
      <div class="page-header">
        <h1 class="page-name">
          <span>应收账款管理</span>
        </h1>
      </div>
      <div class="page-content">
        <HeadStatistics ref="ref_HeadStatistics" :fn="Api_PaymentStatistics" :col="HeadStatisticsCol"></HeadStatistics>
        <el-form ref="searchForm" :model="listQuery" :inline="true" style="margin-bottom:0">
          <el-form-item prop="contractInfo">
            <el-input
              v-model="listQuery.contractInfo"
              placeholder="订单名称"
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
            <el-select v-model="listQuery.state" placeholder="状态">
              <el-option
                v-for="item in stateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
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
          <el-form-item prop="date">
            <el-date-picker
              v-model="comboDate"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="-"
              start-placeholder="预计付款日期起"
              end-placeholder="预计付款日期止"
            ></el-date-picker>
          </el-form-item>
          <el-form-item class="btns">
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
            <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset('searchForm')">重置</el-button>
          </el-form-item>
        </el-form>
        <RadioText :options="statusOptions" newName="快捷筛选" labelKey="name" @change="switchStatus"></RadioText>
        <div class="page-content-body">
          <TableWrapper ref="child" :fetchDataFn="Api_PaymentGetList" :query="listQuery" :columns="tableCol" />
        </div>
      </div>
    </div>
    <!--        <ReceiptRegistration ref="ref_receiptRegistration" @getList="getList"></ReceiptRegistration>-->
    <FinancialWriteOff ref="ref_FinancialWriteOff" @getList="getList" @getStatisticsData="getStatisticsData"></FinancialWriteOff>
    <PaymentDetail
      ref="ref_paymentDetail"
      v-if="showPaymentDetail"
      @hidePaymentDetail="hidePaymentDetail"
      @getList="getList"
    ></PaymentDetail>
    <ExtendedExpiryDate
      ref="ref_ExtendedExpiryDate"
      v-if="showExtendedExpiryDate"
      @getList="getList"
      @hideExtendedExpiryDate="hideExtendedExpiryDate"
    ></ExtendedExpiryDate>
    <ReceiptRegistration
      ref="ref_ReceiptRegistration"
      v-if="showReceiptRegistration"
      :defaultCustomerName="curCustomerName"
      :defaultCustomerId="curCustomerId"
      :curPayPlanCode="curPayPlanCode"
      :curPayPlanId="curPayPlanId"
      :curContractId="curContractId"
      :curContractNo="curContractNo"
      :curContractName="curContractName"
      @getList="getList"
      @hideReceiptRegistration="hideReceiptRegistration"
    ></ReceiptRegistration>
  </div>
</template>

<script type="text/jsx">
import PageHead from "@/components/PageHead";
import RadioText from "@/components/RadioText";
import PaymentDetail from "./PaymentDetail";
import FinancialWriteOff from "./FinancialWriteOff";
import ReceiptRegistration from "../../accountsReceivable/receiptRecords/ReceiptRegistration";
import HeadStatistics from "@/components/HeadStatistics";
import ExtendedExpiryDate from "./ExtendedExpiryDate";
import {
  Api_PaymentGetList,
  Api_PaymentStatistics,
  Api_getPaymentCount
} from "@/api/creditManagement/contractManagement/contract.js";
// department & user BEGIN
import { Api_DepartmentsFetchTree, Api_DepartmentUserList } from "@/api/settings/dept.js";
// department & user END
import { Api_delayReview } from "@/api/creditManagement/accountsReceivable/overdueManagement.js";
import { Api_judgeOperateAccess } from "@/api/creditManagement/index.js";

export default {
  name: "PlanTracking",
  components: {
    PageHead,
    RadioText,
    PaymentDetail,
    ReceiptRegistration,
    FinancialWriteOff,
    HeadStatistics,
    ExtendedExpiryDate
  },
  data() {
    return {
      Api_PaymentGetList,
      comboDate: [],
      listQuery: {
        contractInfo: null,
        customerName: null,
        state: null,
        startDate: null,
        endDate: null,
        // department & user BEGIN
        headDept: null,
        headId: null,
        deptName: null,
        userName: null,
        // department & user END
        quickFilter: null
      },
      statusOptions: [
        { id: "", name: "全部" },
        { id: "1", name: "我负责的" },
        { id: "2", name: "待我处理" },
        { id: "3", name: "已到期的" },
        { id: "4", name: "到期提醒" }
      ],
      // department & user BEGIN
      treeShowQuery: false,
      treeData: [],
      departmentUsers: [],
      // department & user END
      stateOptions: [
        { label: "未开始", value: "9" },
        { label: "未完成", value: "1" },
        { label: "逾期未完成", value: "2" },
        { label: "正常完成", value: "3" },
        { label: "逾期完成", value: "4" }
      ],
      list: [], // 主列表数据
      HeadStatisticsCol: [
        { key: "planAmount", title: "应收未收金额", isMoney: true },
        { key: "overdueMoney", title: "逾期金额", isMoney: true },
        { key: "maxOverdueMoney", title: "120天+逾期金额", isMoney: true },
        { key: "overdueSize", title: "逾期笔数", isMoney: false },
        { key: "overdueSizeTotal", title: "120天+逾期笔数", isMoney: false }
      ],
      showPaymentDetail: false,
      tableCol: [
        {
          key: "payPlanCode",
          label: "应收编码",
          props: { "show-overflow-tooltip": true },
          render: (h, data, row) => {
            return (
              <span class="canClick" onClick={this.paymentDetail.bind(this, row)}>
                {data}
              </span>
            );
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
                {data}
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
              <span class="a-link" onClick={this.$gotoCustomerDetail.bind(this, row.customerId)}>
                {data}
              </span>
            );
          }
        },
        {
          key: "endDate",
          label: "到期日",
          width: 110,
          render: (h, data, row) => {
            const time = (data ? this.$dateFormat(data, "yyyy-MM-dd") : "-" );
            return time
            // return [
            //   (row.editable && row.planType !== "2" && (row.viewState === "1" || row.viewState === "2")) ?
            //   <el-link type="primary" onClick={this.extendedExpiryDate.bind(this, row)}> { time } </el-link> :
            //   <el-link type="info" disabled> { time } </el-link>
            // ]
          }
        },
        {
          key: "payAmount",
          label: "应收金额(元)",
          align: "right",
          render: (h, data, row) => {
            return this.$toMoney(data);
          }
        },
        {
          key: null,
          label: "收款比例",
          align: "right",
          width: 100,
          render: (h, data, row) => {
            return ((Number(row.receivable) * 100) / Number(row.payAmount)).toFixed(2) + "%";
          }
        },
        {
          key: "lastPayDate",
          label: "最近收款日期",
          width: 110,
          render: (h, data, row) => {
            return data ? this.$dateFormat(data, "yyyy-MM-dd") : "-";
          }
        },
        {
          key: "viewState",
          label: "状态",
          width: 80,
          render: (h, data) => {
            return data === "1"
              ? "未完成"
              : data === "2"
              ? "逾期未完成"
              : data === "3"
              ? "正常完成"
              : data === "4"
              ? "逾期完成"
              : "";
          }
        },
        {
          key: "username",
          label: "负责人",
          width: 100,
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
          width: 100,
          render: (h, data, row) => {
            return [
                (row.editable && (row.viewState === "1" || row.viewState === "2")) ?
                <el-link type="primary" onClick={this.paymentRegister.bind(this, row)}> 收款 </el-link> :
                <el-link type="info" disabled> 收款</el-link>,
                (row.editable && row.planType !== "2" && (row.viewState === "1" || row.viewState === "2")) ?
                <el-link type="primary" onClick={this.extendedExpiryDate.bind(this, row)}> 延期</el-link> :
                <el-link type="info" disabled> 延期</el-link>
            ]
    
          }
        }
      ],
      showExtendedExpiryDate: false,
      showReceiptRegistration: false,
      curCustomerName: null,
      curCustomerId: null,
      curPayPlanCode: null,
      curPayPlanId: null,
      curContractId: null,
      curContractNo: null,
      curContractName: null
    };
  },
  mounted() {
    if (this.$route.query.id) {
      this.paymentDetail({ payPlanId: this.$route.query.id });
    }
    // department & user BEGIN
    Api_DepartmentsFetchTree().then(res => {
      this.treeData = res;
    });
    // department & user END
  },
  created() {
    this.$nextTick(() => {
      this.getList();
      this.handleNodeClickQuery({});
    });
  },
  methods: {
    Api_PaymentStatistics,
    // 获取主列表数据
    getList() {
      this.listQuery.startDate = this.comboDate.length > 0 ? this.comboDate[0] : "";
      this.listQuery.endDate = this.comboDate.length > 0 ? this.comboDate[1] : "";
      this.$refs.child.fetchData();
      Api_getPaymentCount(this.listQuery).then(res => {
        this.statusOptions = [
          { id: "", name: "全部" },
          { id: "1", name: "我负责的" },
          { id: "2", name: "待我处理" + (res[0].pendCount ? "(" + res[0].pendCount + ")" : "") },
          { id: "3", name: "已到期的" },
          { id: "4", name: "到期提醒" + (res[0].remindCount ? "(" + res[0].remindCount + ")" : "") }
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
    },
    paymentRegister(row) {
      console.log(row,'这一行啦啦啦啦啦')
      const loading = this.$openLoading();
      Api_judgeOperateAccess(row.contractId)
        .then(res => {
          loading.close();
          this.curCustomerName = row.companyName;
          this.curCustomerId = row.customerId;
          this.curPayPlanCode = row.payPlanCode;
          this.curPayPlanId = row.payPlanId;
          this.curContractId = row.contractId;
          this.curContractNo = row.contractNo;
          this.curContractName = row.contractName;
          this.showReceiptRegistration = true;
          this.$nextTick(() => {
            this.$refs.ref_ReceiptRegistration.open("add", null);
          });
        })
        .catch(res => {
          loading.close();
          this.$alert(res, "提示", { confirmButtonText: "确定", type: "warning" });
        });
    },
    paymentDetail(row) {
      this.showPaymentDetail = true;
      this.$nextTick(() => {
        this.$refs.ref_paymentDetail.open(row);
      });
    },
    hidePaymentDetail() {
      this.showPaymentDetail = false;
    },
    financialWriteOff(row) {
      this.$nextTick(() => {
        this.$refs.ref_FinancialWriteOff.open("add", row);
      });
    },
    /**
     * @延长到日期
     */
    extendedExpiryDate(_r) {
      const loading = this.$openLoading();
      Api_judgeOperateAccess(_r.contractId)
        .then(res => {
          Api_delayReview(_r.payPlanId)
            .then(res => {
              loading.close();
              if (res && res.length) {
                this.showExtendedExpiryDate = true;
                this.$nextTick(() => {
                  this.$refs.ref_ExtendedExpiryDate.open("add", _r, res);
                });
              } else {
                this.showExtendedExpiryDate = true;
                this.$nextTick(() => {
                  this.$refs.ref_ExtendedExpiryDate.open("add", _r);
                });
              }
            })
            .catch(res => {
              loading.close();
              this.$message.error(res);
              this.$emit("hideExtendedExpiryDate");
            });
        })
        .catch(res => {
          loading.close();
          this.$alert(res, "提示", { confirmButtonText: "确定", type: "warning" });
        });
    },
    hideExtendedExpiryDate() {
      this.showExtendedExpiryDate = false;
    },
    /**
     * @快捷筛选
     */
    switchStatus(_id) {
      this.listQuery.quickFilter = _id;
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
    // department & user END
    getStatisticsData() {
      this.$refs.ref_HeadStatistics.getData();
    },
    hideReceiptRegistration() {
      this.showReceiptRegistration = false;
    }
  }
};
</script>

<style scoped>
.title-msg {
  background-color: #fff;
  padding: 12px 16px;
  line-height: 34px;
}

.newStyle1 {
  border-radius: 72px;
  height: 72px;
  width: 72px;
  background-image: url(../../../../assets/images/ysje.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

.newStyle2 {
  border-radius: 72px;
  height: 72px;
  width: 72px;
  background-image: url(../../../../assets/images/yqje.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

.newStyle3 {
  border-radius: 72px;
  height: 72px;
  width: 72px;
  background-image: url(../../../../assets/images/dayje.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

.newStyle4 {
  border-radius: 72px;
  height: 72px;
  width: 72px;
  background-image: url(../../../../assets/images/yqbs.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

.newStyle5 {
  border-radius: 72px;
  height: 72px;
  width: 72px;
  background-image: url(../../../../assets/images/120yqbs.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

.head-img-container {
  padding-bottom: 15px;
  background: #f8f9fa;
  position: relative;
  left: -30px;
  top: -20px;
  width: calc(100% + 60px);
  overflow-x: hidden;
}
</style>
