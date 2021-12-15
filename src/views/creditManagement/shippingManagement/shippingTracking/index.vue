<template>
  <div>
    <div v-show="!showShippingApplicationDetails&&!showOutboundRegistration&&!showShippingDetails">
      <div class="page-header">
        <h1 class="page-name">
          <span>发货跟踪</span>
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
          <el-form-item prop="contractNo">
            <el-input
              v-model="listQuery.contractNo"
              placeholder="合同名称"
              class="filter-item"
              @keyup.enter.native="handleFilter"
            />
          </el-form-item>
          <el-form-item prop="state">
            <el-select v-model="listQuery.state" placeholder="发货状态">
              <el-option label="待提交" :value="0"></el-option>
              <el-option label="待签收" :value="1"></el-option>
              <el-option label="已签收" :value="2"></el-option>
              <el-option label="签收异常" :value="3"></el-option>
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
              start-placeholder="发货申请日期起"
              end-placeholder="发货申请日期止"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item class="btns">
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
            <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset('searchForm')">重置</el-button>
          </el-form-item>
          <RadioText :options="statusOptions" newName="快捷筛选" labelKey="name" @change="switchStatus"></RadioText>
        </el-form>
        <div class="page-content-body">
          <TableWrapper ref="child" :fetchDataFn="Api_GoodsPage" :query="listQuery" :columns="tableCol" />
        </div>
      </div>
    </div>
    <OutboundRegistration
      ref="ref_OutboundRegistration"
      v-if="showOutboundRegistration"
      @getList="getList"
      @hideOutboundRegistration="hideOutboundRegistration"
    ></OutboundRegistration>
    <!--<ShippingApplicationDetails
            ref="ref_ShippingApplicationDetails"
            v-if="showShippingApplicationDetails"
            @getList="getList"
            @hideShippingApplicationDetails="hideShippingApplicationDetails"
    ></ShippingApplicationDetails>-->
    <ShippingDetails
      ref="ref_ShippingDetails"
      @getList="getList"
      v-if="showShippingDetails"
      @hideShippingDetails="hideShippingDetails"
    ></ShippingDetails>
    <ShippingRegister
      v-if="showShippingApplicationDetails"
      ref="ref_ShippingRegister"
      @getList="getList"
      @hideShippingRegister="hideShippingApplicationDetails"
    ></ShippingRegister>
  </div>
</template>

<script type="text/jsx">
import PageHead from "@/components/PageHead";
import Button from "@/components/Button";
import { Api_judgeOperateAccess } from "@/api/creditManagement/index.js";
import {
  Api_GetCustomerGroup,
  Api_RemoveCustomer,
} from "@/api/creditManagement/customerProfile/customerManagement.js";
// department & user BEGIN
import { Api_DepartmentsFetchTree, Api_DepartmentUserList } from "@/api/settings/dept.js";
// department & user END
import OutboundRegistration from "./OutboundRegistration";
import ShippingApplicationDetails from "./ShippingApplicationDetails";
import ShippingDetails from "./ShippingDetails";
import ShippingRegister from "../pendingOrders/ShippingRegister";
import {
  Api_GoodsPage,
  Api_GoodsCount,
  Api_OrderNoShip,
} from "@/api/creditManagement/shippingManagement/shippingTracking.js";
import RadioText from "@/components/RadioText";
import { Api_orderNoShipDetail } from "@/api/creditManagement/shippingManagement/pendingOrders.js";

export default {
  name: "ShippingTracking",
  components: {
    PageHead,
    ShippingApplicationDetails,
    OutboundRegistration,
    ShippingDetails,
    ShippingRegister,
    RadioText,
  },
  data() {
    return {
      Api_GoodsPage,
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
        // department & user END,
        quickQuery: "",
      },
      list: [], // 主列表数据
      statusOptions: [
        { id: "", name: "全部" },
        { id: 0, name: "我负责的" },
        { id: 1, name: "待我处理" },
      ],
      tableCol: [
        {
          key: "ship_code",
          label: "发货编码",
          align: "left",
          props: { "show-overflow-tooltip": true },
          render: (h, data, row) => {
            return (
              <span class="a-link" onClick={this.shippingApplicationDetails.bind(this, row)}>
                {data}
              </span>
            );
          },
        },
        {
          key: "contract_name",
          label: "订单名称",
          align: "left",
          props: { "show-overflow-tooltip": true },
          render: (h, data, row) => {
            return (
              <span class="canClick" onClick={this.$gotoOrderDetail.bind(this, row.contract_id)}>
                {row.contract_no + "/" + data}
              </span>
            );
          },
        },
        {
          key: "company_name",
          label: "客户名称",
          align: "left",
          props: { "show-overflow-tooltip": true },
          render: (h, data, row) => {
            return (
              <span class="a-link" onClick={this.$gotoCustomerDetail.bind(this, row.company_id)}>
                {data}
              </span>
            );
          },
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
          },
        },
        {
          key: "delivery_time",
          label: "发货日期",
          width: "100px",
          render: (h, data, row) => {
            return this.$dateFormat(data);
          },
        },
        {
          key: "state",
          label: "当前状态",
          width: "100px",
          render: (h, data, row) => {
            return data === "0"
              ? "待出库"
              : data === "1"
              ? "待签收"
              : data === "2"
              ? "已签收"
              : data === "3"
              ? "签收异常"
              : "-";
          },
        },
        {
          key: null,
          label: "操作",
          width: 140,
          render: (h, data, row) => {
              return [
                 row.state === "0" ?
                     <el-link type="primary" onClick={this.shippingApplicationDetailsEdit.bind(this, row)}> 编辑 </el-link> :
                     <el-link type="info" disabled> 编辑 </el-link>,
                 row.state === "0" ?
                     <el-link type="primary" onClick={this.shippingApplicationDetailsDel.bind(this, row)}> 删除 </el-link> :
                     <el-link type="info" disabled> 删除 </el-link>,
                 row.state === "1" ?
                     <el-link type="primary" onClick={this.outboundRegistrationArrive.bind(this, row)}> 登记 </el-link> :
                     <el-link type="info" disabled> 登记 </el-link>,
              ]
          },
        },
      ],
      // department & user BEGIN
      treeShowQuery: false,
      treeData: [],
      departmentUsers: [],
      // department & user END
      showShippingApplicationDetails: false,
      showOutboundRegistration: false,
      showShippingDetails: false,
    };
  },
  mounted() {
    if (this.$route.query.id) {
      this.shippingApplicationDetails({
        id: this.$route.query.id,
        contract_id: this.$route.query.contract_id,
      });
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
    // 获取主列表数据
    getList() {
      this.listQuery.startDate = this.comboDate.length > 0 ? this.comboDate[0] : "";
      this.listQuery.endDate = this.comboDate.length > 0 ? this.comboDate[1] : "";
      this.$refs.child.fetchData();
      Api_GoodsCount(this.listQuery).then((res) => {
        this.statusOptions = [
          { id: "", name: "全部" },
          { id: 0, name: "我负责的" },
          { id: 1, name: "待我处理" + (res.dealNum ? "(" + res.dealNum + ")" : "") },
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
      this.listQuery.quickQuery = "";
    },
    switchStatus(_id) {
      this.listQuery.quickQuery = _id;
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
    hideOutboundRegistration() {
      this.showOutboundRegistration = false;
      this.$nextTick(() => {
        this.getList();
      });
    },
    hideShippingApplicationDetails() {
      this.showShippingApplicationDetails = false;
    },
    /**
     * 操作@新增
     */
    // shippingApplicationDetailsNew() {
    //     this.showShippingApplicationDetails = true;
    //     this.$nextTick(() => {
    //         this.$refs.ref_ShippingApplicationDetails.initPage("add");
    //     });
    // },
    /**
     * 操作@编辑
     * _row@行信息
     */
    shippingApplicationDetailsEdit(_row) {
      this.$nextTick(() => {
        const loading = this.$openLoading();
        Api_orderNoShipDetail(_row.contract_id)
          .then((res) => {
            loading.close();
            if (typeof res === "string") {
              this.$alert(res, "提示", {
                confirmButtonText: "确定",
                type: "warning",
              });
              return false;
            }
            this.showShippingApplicationDetails = true;
            this.$nextTick(() => {
              this.$refs.ref_ShippingRegister.open("edit", _row.contract_id, res);
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
      // this.$nextTick(() => {
      //     this.$refs.ref_ShippingApplicationDetails.initPage("edit", _row);
      // });
    },
    /**
     * 操作@删除
     * _row@行信息
     */
    shippingApplicationDetailsDel(_row) {
      Api_OrderNoShip(_row.id)
        .then((res) => {
          this.$message.success(res);
          this.$nextTick(() => {
            this.getList();
          });
        })
        .catch((res) => {
          this.$message.error(res);
        });
    },
    /**
     * method@详情
     */
    shippingApplicationDetails(_row) {
      this.showShippingDetails = true;
      this.$nextTick(() => {
        this.$refs.ref_ShippingDetails.open(_row);
      });
    },
    hideShippingDetails() {
      this.showShippingDetails = false;
      this.$nextTick(() => {
        this.getList();
      });
    },
    /**
     * 操作@出库登记
     * _row@行信息
     */
    outboundRegistrationOut(_row) {
      this.showOutboundRegistration = true;
      this.$nextTick(() => {
        this.$refs.ref_OutboundRegistration.initPage("out", _row);
      });
    },
    /**
     * 操作@到货登记
     * _row@行信息
     */
    outboundRegistrationArrive(_row) {
        const loading = this.$openLoading();
        let id=_row.contract_id;

      Api_judgeOperateAccess(id).then(res=>{
          this.showOutboundRegistration = true;
          this.$nextTick(() => {
            this.$refs.ref_OutboundRegistration.initPage("in", _row);
          });
      }).catch(err=>{
          loading.close();
          this.$alert(err, "提示", { confirmButtonText: "确定", type: "warning" });
      })




    },
  },
};
</script>

<style scoped>
.text-blue {
  color: #4a9df2;
}
</style>
