<template>
  <div>
    <div v-show="!showBadCustomerDetail">
      <div class="page-header">
        <h1 class="page-name">
          <span>不良客户</span>
        </h1>
        <div>
          <el-button @click="addBadCustomer('add')"  class="btn-color-blue" icon="el-icon-plus">添加不良客户</el-button>
        </div>
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
          <el-form-item prop="status">
            <el-select v-model="listQuery.status" style="width: 100%" placeholder="客户状态">
              <el-option label="待审批" value="0"></el-option>
              <el-option label="限制中" value="1"></el-option>
              <el-option label="已移出" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="badType">
            <el-select v-model="listQuery.badType" style="width: 100%" placeholder="列入原因">
              <el-option label="一年以上没有与本公司交易者" value="0"></el-option>
              <el-option label="拖欠货款逾期一年且无意归还者" value="1"></el-option>
              <el-option label="破产、倒闭、经营严重亏损者" value="2"></el-option>
              <el-option label="有严重违反国家法律法规行为，或不正当经营者" value="3"></el-option>
              <el-option label="其他有严重损坏本公司形象、业务情形者" value="4"></el-option>
              <el-option label="逾期额度超标" value="5"></el-option>
              <el-option label="逾期天数超标" value="6"></el-option>
              <el-option label="被列入失信被执行人" value="7"></el-option>
              <el-option label="被吊销营业执照或注销" value="8"></el-option>
              <el-option label="被列入经营异常名录" value="9"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="dealMethod">
            <el-select v-model="listQuery.dealMethod" style="width: 100%" placeholder="限制措施">
              <el-option label="停止签约" value="2"></el-option>
              <el-option label="停止赊销" value="0"></el-option>
              <el-option label="停止发货" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="btns">
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
            <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset('searchForm')">重置</el-button>
          </el-form-item>
          <RadioText :options="groupIdsOptions" labelKey="group_name" @change="switchBusinessGroup"></RadioText>
        </el-form>
        <div class="page-content-body">
          <TableWrapper ref="child" :fetchDataFn="Api_GetCustomerBad" :query="listQuery" :columns="tableCol" />
        </div>
      </div>
    </div>
    <BadCustomerDetail
      v-if="showBadCustomerDetail"
      @hideBadCustomerDetail="hideBadCustomerDetail"
      ref="ref_badCustomerDetail"
    ></BadCustomerDetail>
    <BadCustomerRemove ref="ref_badCustomerRemove" @getList="getList"></BadCustomerRemove>
    <BadCustomerEdit ref="ref_badCustomerEdit" @getList="getList"></BadCustomerEdit>
    <RemoveDetail ref="ref_removeDetail" @getList="getList"></RemoveDetail>
    <AddBadCustomer ref="ref_AddBadCustomer" @getList="getList"></AddBadCustomer>
  </div>
</template>

<script type="text/jsx">
    import PageHead from "@/components/PageHead";
    import {Api_GetCustomerBad, Api_GetCustomerGroup,} from "@/api/creditManagement/customerProfile/customerBad.js";
    import BadCustomerDetail from "./BadCustomerDetail";
    import BadCustomerRemove from "./BadCustomerRemove";
    import BadCustomerEdit from "./BadCustomerEdit";
    import RemoveDetail from "./RemoveDetail";
    import RadioText from "@/components/RadioText";
    import AddBadCustomer from "./AddBadCustomer";

    export default {
  name: "CustomerPerformance",
  components: {
    PageHead,
    BadCustomerDetail,
    BadCustomerRemove,
    BadCustomerEdit,
    RemoveDetail,
    RadioText,
    AddBadCustomer,
  },
  data() {
    return {
      Api_GetCustomerBad,
      listQuery: {
        companyName: "",
        groupId: "",
        dealMethod: "",
        badType: "",
        status: "",
      },
      groupIdsOptions: [{ group_name: "全部", id: "" }],
      tableCol: [
        {
          key: "companyName",
          label: "企业名称",
          align: "left",
          props: { "show-overflow-tooltip": true },
          render: (h, data, row) => {
            return (
              <span class="a-link" onClick={this.openBadCustomer.bind(this, row)}>
                {data}
              </span>
            );
          },
        },
        {
          key: "badType",
          label: "列入原因",
          props: { "show-overflow-tooltip": true },
          align: "left",
        },
        {
          key: null,
          label: "限制措施",
          props: { "show-overflow-tooltip": true },
          align: "left",
          render: (h, data, row) => {
            return (row.isCredit ? ["停止赊销"] : [])
              .concat(row.isSend ? ["停止发货"] : [])
              .concat(row.isWork ? ["停止签约"] : [])
              .join(",");
          },
        },
        {
          key: "status",
          label: "当前状态",
          width: 100,
          render: (h, data, row) => {
            return data === "0"
              ? "待审批"
              : data === "1"
              ? "限制中"
              : data === "2"
              ? "移出待审"
              : data === "3"
              ? "已移出"
              : data === "4"
              ? "列入退回"
              : "-";
          },
        },
        {
          key: "createDate",
          label: "列入时间",
          width: 100,
          render: (h, data) => {
            return this.$dateFormat(data, "yyyy-MM-dd");
          },
        },
        {
          key: "username",
          label: "负责人/部门",
          render: (h, data, row) => {
            return (
              <el-tooltip class="item" effect="dark" content={data + "/" + row.deptname} placement="top">
                <span>{data}</span>
              </el-tooltip>
            );
          },
        },
        {
          key: null,
          label: "操作",
          width: 100,
            render: (h, data, row) => {
                return [
                    row.editable === true &&
                    (row.status === "1" || row.status === "0") ? <el-link type="primary" onClick={this.openBadCustomerEdit.bind(this, row)}> 编辑 </el-link>
                        : <el-link type="info" disabled> 编辑 </el-link>
                    ,
                    row.editable === true &&
                    row.status === "1" ? <el-link type="primary" onClick={this.openBadCustomerRemove.bind(this, row)}> 移除 </el-link>
                        : <el-link type="info" disabled> 移除 </el-link>
                ]
            },
        },
      ],
      showBadCustomerDetail: false,
    };
  },
  mounted() {
    this.getGroups();
  },
  created() {
    this.$nextTick(() => {
      this.getList();
    });
  },
  methods: {
    // 获取主列表数据
    getList() {
      this.$refs.child.fetchData();
    },
    // 获取企业分组
    getGroups() {
      Api_GetCustomerGroup().then((res) => {
        this.groupIdsOptions = this.groupIdsOptions.concat(res || []);
      });
    },
    switchBusinessGroup(_id) {
      this.listQuery.groupId = _id;
      this.getList();
    },
    // 根据查询条件获取数据
    handleFilter() {
      this.getList();
    },
    // 重置查询条件
    handleReset(formName) {
      this.$refs[formName].resetFields();
      this.listQuery.groupId = "";
    },
    // 重置form表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.listQuery.groupId = "";
    },
    // 打开详情页面
    openBadCustomer(row) {
      this.showBadCustomerDetail = true;
      this.$nextTick(() => {
        this.$refs.ref_badCustomerDetail.open(row);
      });
    },
    hideBadCustomerDetail() {
      this.showBadCustomerDetail = false;
    },
    // 打开处理变更
    openBadCustomerEdit(row) {
      this.$nextTick(() => {
        this.$refs.ref_badCustomerEdit.open(row);
      });
    },
    // 移出
    openBadCustomerRemove(row) {
      if (row.status === "1") {
        this.$nextTick(() => {
          this.$refs.ref_badCustomerRemove.open(row);
        });
      }
      if (row.status === "3") {
        this.$nextTick(() => {
          this.$refs.ref_removeDetail.open(row);
        });
      }
    },
    /**
     * @st 'add' | 'edit'
     */
    addBadCustomer(st) {
      if (this.$isVip()) {
        this.$refs.ref_AddBadCustomer.open(st);
      } else {
        this.$vipExpireConfirm();
      }
    },
  },
};
</script>

<style scoped>
.text-blue {
  color: #4a9df2;
}
</style>
