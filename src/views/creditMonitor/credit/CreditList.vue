<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>监测列表</span>
      </h1>
      <div>
         <el-button @click="addMonitoring('')" class="btn-color-blue" icon="el-icon-plus">添加监测</el-button>
         <el-button @click="batchAddMonitoring" class="btn-color-orange" icon="el-icon-document-copy">批量添加</el-button>
<!--        <el-dropdown @command="handleCommand">-->
<!--          <el-button @click="addMonitoring('')">-->
<!--            添加监测-->
<!--            <i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
<!--          </el-button>-->
<!--          <el-dropdown-menu slot="dropdown">-->
<!--            <el-dropdown-item command="addMonitoring">添加监测</el-dropdown-item>-->
<!--            <el-dropdown-item command="batchAddMonitoring">批量添加</el-dropdown-item>-->
<!--          </el-dropdown-menu>-->
<!--        </el-dropdown>-->
      </div>
    </div>
    <div class="page-content">
      <div class="page-content">
        <el-form ref="searchForm" :model="listQuery" :inline="true">
          <el-form-item prop="name">
            <el-input
              v-model="listQuery.name"
              placeholder="企业名称"
              class="filter-item"
              style="width: 300px"
              @keyup.enter.native="handleFilter"
            />
          </el-form-item>
          <el-form-item class="btns">
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
            <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset('searchForm')">重置</el-button>
          </el-form-item>
          <RadioText
            :options="groupIdsOptions"
            newName="企业分组"
            labelKey="group_name"
            @change="switchBusinessGroup"
          ></RadioText>
        </el-form>
        <div class="page-content-body">
          <TableWrapper ref="child" :fetchDataFn="Api_GetMonitorList" :query="listQuery" :columns="tableCol" />
        </div>
      </div>
      <Dialog
        ref="drawer"
        :title="newTitle"
        :visible.sync="visibleAdd"
        :onOk="sureAdd"
        @close="onclose"
        class="size-btn-change"
        width="500px"
      >
        <el-form ref="addForm" :model="addForm" :rules="rules" label-width="80px">
          <el-form-item label="企业名称" prop="companyId" v-if="editShow">
            <el-select
              v-model="addForm.companyId"
              placeholder="请输入企业全称"
              filterable
              remote
              reserve-keyword
              :remote-method="querySearchAsync"
              :loading="loading"
              style="width: 100%"
              @change="searchObj"
              @focus="onFocus"
            >
              <el-option
                v-for="item in companyNameOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="企业分组" prop="groupIds">
            <el-select v-model="addForm.groupIds" multiple placeholder="请选择企业分组" style="width: 100%">
              <el-option
                v-for="item in groupIdsOptionsAdd"
                :key="item.id"
                :label="item.group_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </Dialog>
      <Dialog ref="set" title="动态接收设置" class="size-btn-change" :visible.sync="visibleSet" :onOk="sureSet" width="700px">
        <el-form ref="setForm" :model="setForm" label-width="80px">
          <el-form-item label="监测企业" prop="companyName">{{ companyName }}</el-form-item>
          <div class="payment-plan">
            <div class="payment-plan-thead">
              <div style="flex: 0 50px" class="payment-plan-th payment-plan-th-color">序号</div>
              <div style="flex: 1" class="payment-plan-th payment-plan-th-color">部门</div>
              <div style="flex: 1" class="payment-plan-th payment-plan-th-color">姓名</div>
              <div style="flex: 2" class="payment-plan-th payment-plan-th-color">操作</div>
            </div>
            <div class="payment-plan-tbody" v-for="(item, index) in setList" :key="index">
              <div style="flex: 0 50px" class="payment-plan-th">{{ index + 1 }}</div>
              <div style="flex: 1" class="payment-plan-th">
                <el-popover
                  ref="popoverQuery"
                  visible-arrow="false"
                  placement="bottom-start"
                  trigger="click"
                  :disabled="index === 0"
                >
                  <el-tree
                    ref="ref_trees"
                    :data="treeData"
                    :render-content="renderContent"
                    node-key="id"
                    @node-click="(node)=>handleNodeClickQuery(node, item)"
                  ></el-tree>
                  <el-input
                    slot="reference"
                    type="text"
                    readonly
                    placeholder="所属部门"
                    v-model="item.deptName"
                    :disabled="index === 0"
                  ></el-input>
                </el-popover>
              </div>
              <div style="flex: 1" class="payment-plan-th">
                <el-select v-model="item.userId" placeholder="登录人员姓名" :disabled="index === 0">
                  <el-option
                    :key="item.id"
                    :value="item.id"
                    :label="item.name || item.username"
                    v-for="item in item.departmentUsers"
                  ></el-option>
                </el-select>
              </div>
              <div style="flex: 1" class="payment-plan-th">
                <el-button size="small" v-if="index === 0" @click="addSetInfo(item, index)">添加</el-button>
                <el-button
                  size="small"
                  v-if="item.deleteAble&&index!==0"
                  type="danger"
                  @click="delSetInfo(item, index)"
                >删除</el-button>
                <el-button
                  size="small"
                  v-if="item.deleteFlag&&index!==0"
                  type="danger"
                  @click="delSetInfo(item, index)"
                >删除</el-button>
              </div>
            </div>
          </div>
        </el-form>
      </Dialog>
    </div>
    <ContentDetail ref="ref_ContentDetail"></ContentDetail>
    <BatchAddMonitor ref="ref_BatchAddMonitor" @getList="getList"></BatchAddMonitor>
  </div>
</template>

<script type="text/jsx">
import {
  Api_GetMonitorList,
  Api_AddMonitorInfo,
  Api_SetMonitorInfo,
  Api_DelMonitorList,
  Api_GetReceiverList,
  Api_EditMonitorInfo,
} from "@/api/creditManagement/monitoring/monitoring";
import RadioText from "@/components/RadioText";
import {
  Api_GetCustomerGroup,
  Api_SearchCompany,
} from "@/api/creditManagement/customerProfile/customerManagement.js";
import { Api_DepartmentsFetchTreeParent, Api_DepartmentUserList } from "@/api/settings/dept.js";
import ContentDetail from "@/views/creditMonitor/credit/creditInfo/ContentDetail.vue";
import BatchAddMonitor from "./BatchAddMonitor";

export default {
  name: "EnterpriseList",
  components: { RadioText, ContentDetail, BatchAddMonitor },
  data() {
    return {
      Api_GetMonitorList,
      loading: false,
      listQuery: { name: "", groupId: "" },
      groupIdsOptions: [{ group_name: "全部", id: "" }],
      tableCol: [
        {
          key: "companyName",
          label: "企业名称",
          align: "left",
          width: 160,
          props: { showOverflowTooltip: true },
          render: (h, data,row) => {
          
            return (
              <span class="canClick" onClick={this.gotoInfo.bind(this, row)}>
                {data}
              </span>
            );
          },
        },
        {
          key: "groupNames",
          label: "企业分组",
          align: "left",
          render: (h, data, row) => {
            const _list = row.groupNames ? row.groupNames.split(",") : ['未分组'];
              return [
                <span>
                    {_list.map(item => {
                        return (
                            <el-tag size="mini" style="margin-right: 2px">
                                {item}
                            </el-tag>
                        );
                    })}
                </span>,
                <el-link icon="el-icon-edit" type="primary" onClick={this.addMonitoring.bind(this, row)}></el-link>
              ];
          }
        },
        { 
          key: "selfCount",
          label: "自身风险", 
          width: 100,
          render: (h, data,row) => {
            return (
              <span class="canClick" onClick={this.gotoSelf.bind(this, row)}>
                {data}
              </span>
            );
          },
        },
        { 
          key: "refCount",
          label: "关联风险", 
          width: 100,
          render: (h, data,row) => {
            return (
              <span class="canClick" onClick={this.gotoOther.bind(this, row)}>
                {data}
              </span>
            );
          },
        },
        {
          key: "fxbMonitor",
          label: "最新动态",
          props: { "show-overflow-tooltip": true },
          render: (h, data, row) => {
            if (!data) {
              return "-";
            }
            if (
              row.typeCode === "A010101" ||
              row.typeCode === "A010104" ||
              row.typeCode === "A010201" ||
              row.typeCode === "A010202"
            ) {
              return (
                <router-link
                  to={{ path: "/creditFile/dynamicMon", query: { id: row.codeCompanyId } }}
                  target="_blank"
                >
                  <span style="color: #4b9df3;cursor: pointer">{data.monitorContent}</span>
                </router-link>
              );
            } else {
              if (row.typeCode === "A010301") {
                // 商标注册
                return (
                  <span
                    style="color: #4b9df3;cursor: pointer"
                    onClick={this.openWin.bind(this, row, "1")}
                  >
                    {data.monitorContent}
                  </span>
                );
              } else if (row.typeCode === "A010401") {
                // 专利申请
                return (
                  <span
                    style="color: #4b9df3;cursor: pointer"
                    onClick={this.openWin.bind(this, row, "2")}
                  >
                    {data.monitorContent}
                  </span>
                );
              } else if (row.typeCode === "A020101") {
                // 失信被执行人
                return (
                  <span
                    style="color: #4b9df3;cursor: pointer"
                    onClick={this.openWin.bind(this, row, "3")}
                  >
                    {data.monitorContent}
                  </span>
                );
              } else if (row.typeCode === "A020201") {
                // 被执行人
                return (
                  <span
                    style="color: #4b9df3;cursor: pointer"
                    onClick={this.openWin.bind(this, row, "4")}
                  >
                    {data.monitorContent}
                  </span>
                );
              } else if (row.typeCode === "A020301") {
                // 法院公告
                return (
                  <span
                    style="color: #4b9df3;cursor: pointer"
                    onClick={this.openWin.bind(this, row, "5")}
                  >
                    {data.monitorContent}
                  </span>
                );
              }
              if (row.typeCode === "A020401") {
                // 裁判文书
                return (
                  <span
                    style="color: #4b9df3;cursor: pointer"
                    onClick={this.openWin.bind(this, row, "6")}
                  >
                    {data.monitorContent}
                  </span>
                );
              } else if (row.typeCode === "A010501") {
                // 软著申请
                return (
                  <span
                    style="color: #4b9df3;cursor: pointer"
                    onClick={this.openWin.bind(this, row, "7")}
                  >
                    {data.monitorContent}
                  </span>
                );
              } else if (row.typeCode === "A020501") {
                // 行政处罚
                return (
                  <span
                    style="color: #4b9df3;cursor: pointer"
                    onClick={this.openWin.bind(this, row, "8")}
                  >
                    {data.monitorContent}
                  </span>
                );
              } else if (row.typeCode === "A020601") {
                // 经营异常
                return (
                  <span
                    style="color: #4b9df3;cursor: pointer"
                    onClick={this.openWin.bind(this, row, "9")}
                  >
                    {data.monitorContent}
                  </span>
                );
              } else if (row.typeCode === "A030101") {
                // 股权出质
                return (
                  <span
                    style="color: #4b9df3;cursor: pointer"
                    onClick={this.openWin.bind(this, row, "10")}
                  >
                    {data.monitorContent}
                  </span>
                );
              } else if (row.typeCode === "A030401") {
                // 动产抵押
                return (
                  <span
                    style="color: #4b9df3;cursor: pointer"
                    onClick={this.openWin.bind(this, row, "11")}
                  >
                    {data.monitorContent}
                  </span>
                );
              } else {
                return data.monitorContent;
              }
            }
          },
        },
        {
          key: "fxbMonitor",
          label: "最近变动时间",
          width: 120,
          render: (h, data) => {
            return data ? data.modifyDate.substr(0, 10) : "-";
          },
        },
        {
          key: "receiver",
          label: "风险动态接收者",
          render: (h, data, row) => {
            return [
              <span class="canClick"> {data} </span>,
              <el-link icon="el-icon-edit" type="primary" onClick={this.openSet.bind(this, row)}></el-link>
            ];
          },
        },
        {
          key: "",
          label: "操作",
          width: 80,
          render: (h, data, row) => {
            return (
              <el-link title="移出监测" type="primary" onClick={this.removeMonitoring.bind(this, row)}>移出</el-link>
            );
          },
        },
      ],
      visibleAdd: false,
      newTitle: "添加监测",
      visibleSet: false,
      addForm: {
        companyName: "",
        groupIds: [],
        companyId: "",
      },
      editId: "",
      editShow: true,
      rules: {
        companyId: [{ required: true, message: "请输入企业全称" }],
        groupIds: [{ required: true, message: "请选择企业分组" }],
      },
      companyName: "",
      groupIdsOptionsAdd: [],
      companyNameOptions: [],
      setForm: {},
      setList: [],
      // department & user BEGIN
      treeShowQuery: false,
      treeData: [],
      departmentUsers: [],
      lengthFlag: true,
      firstLength: 0,
      // department & user END
    };
  },
  created() {
    this.$nextTick(() => {
      this.getList();
    });
  },
  mounted() {
    this.getGroups();
    // this.getPageList();
    // // 获取分组列表
    // this.getSuperviseGroupList();
  },
  methods: {
    // 获取列表数据
    getList() {
      this.$refs.child.fetchData();
    },
    // 获取分组企业
    getGroups() {
      Api_GetCustomerGroup().then((res) => {
        this.groupIdsOptions = this.groupIdsOptions.concat(res || []);
      });
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
    // 切换企业分组
    switchBusinessGroup(_id) {
      this.listQuery.groupId = _id;
      this.getList();
    },
    // 打开添加监测窗口
    addMonitoring(row) {
      if (row) {
        this.newTitle = "分组设置";
      }
      this.editShow = true;
      if (row) {
        this.visibleAdd = true;
        this.editId = row.id;
        this.editShow = false;
        Api_GetCustomerGroup().then((res) => {
          this.groupIdsOptionsAdd = res;
          for (let i = 0; i < row.transientGroups.length; i++) {
            this.addForm.groupIds.push(row.transientGroups[i].id);
          }
        });
      } else {
        if (this.$isVip()) {
          this.visibleAdd = true;
          Api_GetCustomerGroup().then((res) => {
            this.groupIdsOptionsAdd = res;
          });
        } else {
          this.$vipExpireConfirm();
        }
      }
    },
    // 搜索企业
    querySearchAsync(queryString, cd) {
      if (queryString !== "") {
        this.loading = true;
        Api_SearchCompany({ companyName: queryString }).then((res) => {
          this.loading = false;
          this.companyNameOptions = res.returnData;
          for (let i = 0; i < this.companyNameOptions.length; i++) {
            this.companyNameOptions[i].value = this.companyNameOptions[i].name;
          }
          this.$nextTick(() => {
            cd && cd();
          });
        });
      } else {
        this.companyNameOptions = [];
      }
    },
    searchObj(value) {
      for (let i = 0; i < this.companyNameOptions.length; i++) {
        if (value === this.companyNameOptions[i].id) {
          this.addForm.companyName = this.companyNameOptions[i].name;
        }
      }
    },
    onFocus() {
      if (!this.addForm.companyId) {
        this.companyNameOptions = [];
      }
    },
    // 确定添加监测
    sureAdd() {
      if (this.editId) {
        this.$refs["addForm"].validate((valid) => {
          if (valid) {
            const loading = this.$openLoading();
            Api_EditMonitorInfo(this.editId, this.addForm)
              .then((res) => {
                this.$message.success(res);
                this.visibleAdd = false;
                this.$refs["addForm"].resetFields();
                this.getList();
                loading.close();
              })
              .catch((res) => {
                this.$message.error(res);
                loading.close();
              });
          }
        });
      } else {
        this.$refs["addForm"].validate((valid) => {
          if (valid) {
            const loading = this.$openLoading();
            Api_AddMonitorInfo(this.addForm)
              .then((res) => {
                this.$message.success(res);
                this.visibleAdd = false;
                this.$refs["addForm"].resetFields();
                this.getList();
                loading.close();
              })
              .catch((res) => {
                this.$message.error(res);
                loading.close();
              });
          }
        });
      }
    },
    onclose() {
      this.$refs["addForm"].resetFields();
      this.visibleAdd = false;
    },
    // 打开动态接收设置窗口
    openSet(row) {
      this.visibleSet = true;
      this.formId = row.id;
      this.companyName = row.companyName;
      // department & user BEGIN
      Api_DepartmentsFetchTreeParent().then((res) => {
        this.treeData = res;
      });
      // department & user END
      Api_GetReceiverList(row.id)
        .then((res) => {
          if (this.$store.state.user.userInfo.id === res[0].userId) {
            this.lengthFlag = true;
          } else {
            this.lengthFlag = false;
            this.firstLength = res.length;
          }
          this.setList = res.map((item) => ({
            ...item,
            deptName: item.deptName,
            departmentUsers: [],
          }));
          this.$nextTick(() => {
            this.setList.forEach((item, index) => {
              this.$refs.ref_trees[index].setCurrentKey(item.deptId);
              const nodeData = this.$refs.ref_trees[index].getNode(item.deptId);
              item.deptName = nodeData.data.label;
              this.handleNodeClickQuery(nodeData.data, item, item.userId);
            });
          });
        })
        .catch((res) => {
          this.$message.error(res);
        });
    },
    // 动态接收设置
    sureSet() {
      const newData = [];
      for (let i = 0; i < this.setList.length; i++) {
        if (this.setList[i].userId) {
          newData.push(this.setList[i].userId);
        } else {
          this.$message.warning("请选择部门/姓名");
          return;
        }
      }
      const loading = this.$openLoading();
      Api_SetMonitorInfo(this.formId, { receiverIds: newData })
        .then((res) => {
          this.$message.success(res);
          this.visibleSet = false;
          this.setList = [];
          this.getList();
          loading.close();
        })
        .catch((res) => {
          loading.close();
          this.$message.error(res);
        });
    },
    // 移出监测
    removeMonitoring(row) {
      this.$confirm("确定移出监测吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const loading = this.$openLoading();
          Api_DelMonitorList(row.id)
            .then((res) => {
              loading.close();
              this.$message.success(res);
              this.getList();
            })
            .catch((res) => {
              loading.close();
              this.$message.error(res);
            });
        })
        .catch(() => {});
    },
    // 添加动态列表信息
    addSetInfo() {
      if (this.lengthFlag) {
        this.setList.push({
          deptId: "",
          deptName: "",
          userId: "",
          departmentUsers: [],
          deleteFlag: true,
        });
      } else {
        if (this.setList.length > this.firstLength) {
          this.$message.error("只能添加一条记录");
        } else {
          this.setList.push({
            deptId: "",
            deptName: "",
            userId: "",
            departmentUsers: [],
            deleteFlag: true,
          });
        }
      }
    },
    // 删除动态列表信息
    delSetInfo(_row, _index) {
      this.setList.splice(_index, 1);
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
    handleNodeClickQuery(node, item, userId = "") {
      item.deptId = node.id;
      item.deptName = node.label;
      Api_DepartmentUserList({
        currentPage: 1,
        pageSize: 100,
        departmentIds: node.id,
      }).then((res) => {
        item.departmentUsers = res.data;
        item.userId = userId;
      });
    },
    // 跳转企业风险
    gotoInfo(row) {
      this.$router.push({
        path: "/creditFile/basicArchive",
        query: {
          id:row.companyId
        },
      });
    },
    //gotoSelf 风险动态  自身
    gotoSelf(row){
      this.$router.push({
        path: "/monitor/creditInfo",
        query: {
          name:row.companyName,
          tab:{
            name:'0'
          }
        },
      });
    },

    // 关联风险
    gotoOther(row){
      this.$router.push({
        path: "/monitor/creditInfo",
        query: {
          name:row.companyName,
          tab:{
            name:'1'
          }
        },
      });
    },
    // 打开详情窗口
    openWin(row, _isShow) {
     if(row.monitorContentId){
       this.$refs.ref_ContentDetail.open({monitorContentId: row.monitorContentId , typeCode: row.typeCode , sercondId: row.sercondId }, _isShow);
     }else{
       this.$refs.ref_ContentDetail.open({monitorContentId: row.fxbMonitor.monitorContentId , typeCode: row.typeCode , sercondId: row.sercondId }, _isShow);
     }
    },
    batchAddMonitoring() {
      this.$refs.ref_BatchAddMonitor.open();
    },
    handleCommand(command) {
      if (command === "addMonitoring") {
        this.addMonitoring();
      } else if (command === "batchAddMonitoring") {
        this.batchAddMonitoring();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/*.batchAddBorder {*/
/*    border: 1px solid #ebeef5;*/
/*    border-bottom: none;*/
/*}*/
/*.btnBox {*/
/*    overflow: hidden;*/
/*    padding: 10px;*/
/*    border-bottom: 1px solid #ebeef5;*/
/*}*/
.text-blue {
  color: #4a9df2;
}

.payment-plan {
  margin-bottom: 20px;
  border-top: 1px solid #dee2e6;
  border-left: 1px solid #dee2e6;
  border-right: 1px solid #dee2e6;

  .payment-plan-thead {
    display: flex;
    height: 48px;
    align-items: center;
    background-color: #eaedf4;
    border-bottom: 1px solid #dee2e6;
  }

  .payment-plan-tbody {
    display: flex;
    height: 48px;
    align-items: center;
    border-bottom: 1px solid #dee2e6;
  }

  .payment-plan-th-color {
    color: #7088a4;
    font-weight: bold;
  }

  .payment-plan-th {
    text-align: center;
    padding: 0 4px;
    // height: 48px;
    // line-height: 48px;
    // border-right: 1px solid #dee2e6;

    .plan-input {
      width: 100%;
    }
  }
}

/deep/ .payment-plan .el-input__icon {
  line-height: 30px !important;
}
</style>
