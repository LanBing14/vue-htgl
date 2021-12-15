<template>
  <div>
    <div v-show="!showGroupMembers">
      <div class="page-header">
        <h1 class="page-name">
          <span>客户管理</span>
        </h1>
        <div>
          <el-button size="small" @click="addBusiness"  class="btn-color-blue" icon="el-icon-plus">添加企业</el-button>
          <el-button size="small" @click="batchAddBusiness" class="btn-color-orange" icon="el-icon-document-copy">批量添加</el-button>
          <!--          <el-dropdown @command="handleCommand">-->
          <!--            <el-button @click="addBusiness">-->
          <!--              添加企业-->
          <!--              <i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
          <!--            </el-button>-->
          <!--            <el-dropdown-menu slot="dropdown">-->
          <!--              <el-dropdown-item command="addBusiness">添加企业</el-dropdown-item>-->
          <!--              <el-dropdown-item command="batchAddBusiness">批量添加</el-dropdown-item>-->
          <!--            </el-dropdown-menu>-->
          <!--          </el-dropdown>-->
        </div>
      </div>
      <div class="page-content">
        <el-form
          ref="searchForm"
          :model="listQuery"
          :inline="true"
          class="demo-form-inline searchForm-wrap  search-btn"
        >
          <el-form-item prop="companyName">
            <el-input
              v-model="listQuery.companyName"
              placeholder="企业名称"
              class="filter-item"
              @keyup.enter.native="handleFilter"
            />
          </el-form-item>
          <el-form-item class="btns">
            <el-button
              class="filter-item"
              type="primary"
              icon="el-icon-search"
              @click="handleFilter"
            >查询</el-button>
            <el-button
              class="filter-item"
              icon="el-icon-refresh"
              @click="handleReset('searchForm')"
            >重置</el-button>
          </el-form-item>
          <RadioText :options="groupIdsOptions" labelKey="group_name" @change="switchBusinessGroup">
            <div class="radio-item colorBg" @click="groupManagement">自定义
              <el-link icon="el-icon-edit" type="primary" >
              </el-link>
            </div>
          </RadioText>
        </el-form>
        <div class="page-content-body">
          <TableWrapper
            ref="child"
            :fetchDataFn="Api_GetCustomerPage"
            :query="listQuery"
            :columns="tableCol"
          />
        </div>
      </div>
    </div>
    <AddBusiness ref="ref_addBusiness" @getList="getList"></AddBusiness>
    <ManageGroup ref="ref_manageGroup" @getGroups="getGroups"></ManageGroup>
    <AddSupervise ref="refAddSupervise" @getList="getList"></AddSupervise>
    <QuickEditGroup ref="ref_QuickEditGroup" @getList="getList"></QuickEditGroup>
    <FollowUpInves ref="ref_FollowUpInves" @getList="getList"></FollowUpInves>
    <GroupMembers
      ref="ref_GroupMembers"
      @getList="getList"
      v-show="showGroupMembers && showType === 1"
      @hideGroupMembers="hideGroupMembers"
    ></GroupMembers>
    <CustomerProfiles v-if="showGroupMembers && showType === 2" :id="customerId"></CustomerProfiles>
    <BatchAddBusiness ref="ref_BatchAddBusiness" @getList="getList"></BatchAddBusiness>
  </div>
</template>

<script type="text/jsx">
import PageHead from "@/components/PageHead";
import AddBusiness from "./AddBusiness";
import ManageGroup from "./ManageGroup";
import AddSupervise from "./AddSupervise";
import GroupMembers from "./GroupMembers";
import QuickEditGroup from "./QuickEditGroup";
import CustomerProfiles from "./CustomerProfiles";
import FollowUpInves from "./FollowUpInves";
import {
  Api_GetCustomerPage,
  Api_GetCustomerGroup,
  Api_RemoveCustomer,
} from "@/api/creditManagement/customerProfile/customerManagement.js";
import EchartsComp from "@/components/Echarts";
import RadioText from "@/components/RadioText";
import BatchAddBusiness from "./BatchAddBusiness";

export default {
  name: "CustomerManagement",
  components: {
    PageHead,
    AddBusiness,
    ManageGroup,
    AddSupervise,
    GroupMembers,
    QuickEditGroup,
    CustomerProfiles,
    EchartsComp,
    RadioText,
    FollowUpInves,
    BatchAddBusiness
  },
  data () {
    return {
      updateTime: new Date(),
      listQuery: { companyName: "", groupId: "" },
      list: [], // 主列表数据
      groupIdsOptions: [{ group_name: "全部", id: "" }],
      showGroupMembers: false,
      tableCol: [
        // { key: "customer_no", label: "客户编码", width: 140 },
        {
          key: "company_name",
          label: "企业名称",
          align: "left",
          props: {
            "show-overflow-tooltip": true,
            "min-width": 150,
          },
          render: (h, data, row) => {
            return [
              <el-link type="primary" onClick={this.goDetail.bind(this, row)}> {data} </el-link>,
              //(row.editable && row.is_bloc === "1") ?
              //<el-link type="primary" onClick={this.manageGroupMembers.bind(this, row)}> {data} </el-link> :
              //<div className="canClick"> {data} </div>
            ]
          },
        },
        {
          key: "group_name",
          label: "企业分组",
          align: "left",
          render: (h, data, row) => {
            const _list = row.group_name ? row.group_name.split(",") : [];
            return [
              <span>
                {_list.map((item) => {
                  return (
                    <el-tag size="mini" style="margin-right: 2px">
                      {item}
                    </el-tag>
                  );
                })}
              </span>,
              row.editable && <el-link icon="el-icon-edit" type="primary" onClick={this.quickEditGroup.bind(this, row)}></el-link>
            ]
          },
        },
        //20200529需求要求隐藏
        /*{
                    key: "riskScore",
                    label: "信用预测指数",
                    render: (h, data, row) => {
                        const echartOption = {
                            grid: {
                                top: 10,
                                right: 12,
                                bottom: 0,
                                left: 0,
                                containLabel: true
                            },
                            xAxis: {},
                            yAxis: {},
                            series: [
                                {
                                    data: [
                                        [row.riskPlace.substr(0, row.riskPlace.length - 1), 0],
                                        [row.riskPlace.substr(0, row.riskPlace.length - 1), 100]
                                    ],
                                    markPoint: { data: [{ type: "max", valueIndex: 0 }] },
                                    type: "line"
                                },
                                {
                                    data: [0, 20, [50, 100], [80, 20], [100, 0]],
                                    type: "line",
                                    smooth: true
                                }
                            ]
                        };
                        return (
                            <el-popover placement="top-start" trigger="hover" title="信用预测排名(%)">
                                <div>
                                    <EchartsComp style="width:200px;height:120px" option={echartOption}></EchartsComp>
                                </div>
                                <span class="canClick" slot="reference">
                                    {data}
                                </span>
                            </el-popover>
                        );
                    }
                },*/
        {
          key: "credit_state",
          label: "信用状态",
          width: 100,
          render: (h, data) => {
            return data === "1" ? "冻结" : "正常";
          },
        },
        {
          key: "userName",
          label: "客户负责人",
          render: (h, data, row) => {
            return (
              <el-tooltip
                class="item"
                effect="dark"
                content={data || "-" + "/" + row.deptName}
                placement="top"
              >
                <span>{data || "-"}</span>
              </el-tooltip>
            );
          },
        },
        {
          key: null,
          label: "操作",
          width: 160,
          render: (h, data, row) => {
            return [
              //(row.editable && row.is_bloc === "1") ?
              //  <el-link type="primary" onClick={this.manageGroupMembers.bind(this, row)}> 成员 </el-link> :
              //  <el-link type="info" disabled> 成员 </el-link>,
              //(row.editable && row.is_fxb !== "0" && row.isSupervise === "0") ?
               // <el-link type="primary" onClick={this.includeMonitor.bind(this, row)}> 列入 </el-link> :
              //  <el-link type="info" disabled> 列入 </el-link>,
              row.editable ?
                <el-link type="primary" onClick={this.removeBusiness.bind(this, row)}> 移除 </el-link> :
                <el-link type="info" disabled> 移除 </el-link>,
              row.editable ?
                <el-link type="primary" onClick={this.followUpInves.bind(this, row)}> 跟踪 </el-link> :
                <el-link type="info" disabled> 跟踪 </el-link>,
            ]
          },
        },
      ],
      customerId: "", // 客户id
      showType: 1, // 当前要展示的子页面类别，1：GroupMembers，2：CustomerProfiles
    };
  },
  mounted () {
    this.getGroups();
    if (this.$route.query.new) {
      this.addBusiness();
    }
  },
  created () {
    this.$nextTick(() => {
      this.getList();
    });
    const { id } = this.$route.query;
    if (id) {
      this.customerId = id;
      this.showType = 2;
      this.showGroupMembers = true;
    }
  },
  methods: {
    Api_GetCustomerPage,
    goDetail (row) {
      const url = this.$route.path;
      this.$router.push({
        path: url,
        query: {
          id: row.company_id,
        },
      });
    },
    // 获取主列表数据
    getList () {
      this.$refs.child.fetchData();
    },
    getGroups () {
      Api_GetCustomerGroup().then((res) => {
        this.groupIdsOptions = [{ group_name: "全部", id: "" }].concat(res);
      });
    },
    // 根据查询条件获取数据
    handleFilter () {
      this.getList();
    },
    // 重置查询条件
    handleReset (formName) {
      this.$refs[formName].resetFields();
      this.listQuery.groupId = "";
    },
    // 重置form表单
    resetForm (formName) {
      this.$refs[formName].resetFields();
      this.listQuery.groupId = "";
    },
    // 新增
    groupManagement () {
      this.$nextTick(() => {
        this.$refs.ref_manageGroup.open();
      });
    },
    switchBusinessGroup (_id) {
      this.listQuery.groupId = _id;
      this.getList();
    },
    addBusiness () {
      this.$nextTick(() => {
        if (this.$isVip()) {
          this.$refs.ref_addBusiness.open();
        } else {
          this.$vipExpireConfirm();
        }
      });
    },
    includeMonitor (row) {
      this.$nextTick(() => {
        if (this.$isVip()) {
          this.$refs.refAddSupervise.open(row);
        } else {
          this.$vipExpireConfirm();
        }
      });
    },
    removeBusiness (row) {
      this.$confirm("确定移除企业吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const loading = this.$openLoading();
          Api_RemoveCustomer(row.id)
            .then(() => {
              loading.close();
              this.$message.success("移除成功！");
              this.getList();
            })
            .catch((res) => {
              loading.close();
              this.$message.error(res);
            });
        })
        .catch(() => { });
    },
    manageGroupMembers (_row) {
      this.showType = 1;
      this.showGroupMembers = true;
      this.$refs.ref_GroupMembers.initPage(_row);
    },
    hideGroupMembers () {
      console.log(1);
      this.showGroupMembers = false;
    },
    quickEditGroup (_row) {
      this.$refs.ref_QuickEditGroup.open(_row);
    },
    followUpInves (row) {
      this.$refs.ref_FollowUpInves.open({ id: row.company_id });
    },
    batchAddBusiness () {
      this.$refs.ref_BatchAddBusiness.open();
    },
    handleCommand (command) {
      if (command === "addBusiness") {
        this.addBusiness();
      } else if (command === "batchAddBusiness") {
        this.batchAddBusiness();
      }
    },
  },
};
</script>

<style scoped lang="scss">
.text-blue {
  color: #4a9df2;
}
.colorBg {
  color: $--color-primary
}


.search-btn{
  button{
    padding: 12px 15px;
  }
}
.radio-item {
  cursor: pointer;
  line-height: 24px;
  height: 24px;
  margin-right: 10px;
  padding: 0 15px;

  &:hover {
    color: #4a9df2;
  }
}
</style>
