<template>
  <div style="overflow: hidden">
    <div class="page-header">
      <h1 class="page-name">
        <span>部门与员工</span>
      </h1>
    </div>
    <div class="page-content flex">
      <div style="flex: 0 320px">
        <el-card
          ref="card"
          v-loading="roleListLoading"
          :style="{height: height +'px'}"
          shadow="never"
          class="box-card left-card-body"
        >
          <div slot="header" class="clearfix">
            <div class="flex">
              <span class="flex-primary" style="font-size:14px;color:#333">部门</span>
              <div class="action">
                <el-button type="text" class="tree-btn-font" @click="addDept">新增</el-button>
                <!-- <el-button type="text" class="tree-btn-font" @click="editDept">修改</el-button> -->
                <!-- <el-button type="text" class="tree-btn-font" @click="delDept">删除</el-button> -->
              </div>
            </div>
          </div>
          <el-scrollbar
            ref="scrollWrapLeft"
            style="height: 100%; overflow: hidden"
            @mouseover.native="onMouseOverLeft"
          >
            <el-tree
              ref="tree"
              :data="treeData"
              v-loading="treeLoading"
              default-expand-all
              node-key="id"
              highlight-current
              @current-change="onSelectChange"
            >
              <div class="custom-tree-node" slot-scope="{ node, data }">
                <span
                  :title="data.label || data.classifyName || data.kpiName"
                >{{ data.label || data.classifyName || data.kpiName }}</span>
                <template>
                  <div class="tree-item-action">
                    <el-tooltip content="修改" placement="top">
                      <el-button type="text" @click.stop="editDept()">
                        <i class="el-icon-edit"></i>
                      </el-button>
                    </el-tooltip>
                    <el-tooltip content="删除" placement="top">
                      <el-button type="text" @click.stop="delDept()">
                        <i class="el-icon-delete"></i>
                      </el-button>
                    </el-tooltip>
                  </div>
                </template>
              </div>
            </el-tree>
          </el-scrollbar>
        </el-card>
      </div>
      <div style="flex: 1;padding:0 0 0 20px;overflow: auto">
        <div :style="{height: height +'px'}">
          <el-scrollbar
            ref="scrollWrapRight"
            style="height: 100%; overflow: hidden"
            @mouseover.native="onMouseOverRight"
          >
            <div class="sub-title" style="margin-top: 0;color:#333;font-size:14px;font-weight:normal">
              <template v-if="treeSelectData.label">{{ treeSelectData.label }}({{ userListNum }})</template>
              <template v-else>全部({{ userListNum }})</template>
              <el-button @click="userAdd"  class="btn-color-blue" icon="el-icon-plus">添加成员</el-button>
            </div>
            <!-- <div class="flex">
              <div class="flex-primary" style="align-self: center">
                <template v-if="treeSelectData.label">{{ treeSelectData.label }}({{ userListNum }})</template>
                <template v-else>全部({{ userListNum }})</template>
              </div>
              <div class="table-actions">
                <el-button @click="userAdd">添加成员</el-button>
              </div>
            </div>-->
            <TableWrapper
              ref="table"
              :fetchDataFn="Api_DepartmentUserList"
              :query="listQuery"
              :columns="tableCol"
              @onSuccessData="onSuccessData"
            />
          </el-scrollbar>
        </div>
      </div>
    </div>
    <CreateUpdate
      ref="createUpdateModel"
      :model-status="userModelStatus"
      :select-data="userSelectData"
      :treeId="treeSelectData.id"
      @getList="getList"
    />
    <Detail ref="detail" :select-data="userSelectData" :treeId="treeSelectData.id" @getList="getList" />
    <DeptModal
      ref="dept"
      :model-status="treeModelStatus"
      :select-data="treeSelectData"
      :parent-data="treeParentData"
      @getList="getDeptTree"
    />
  </div>
</template>
<script type="text/jsx">
import CreateUpdate from "./CreateUpdate";
import Detail from "./Detail";
import DeptModal from "./DeptModal";
import {
  Api_DepartmentUserList, // 查询部门用户列表
  Api_DepartmentsFetchTreeParent, // 查询部门树
  Api_DepartmentsDel, // 删除部门
  Api_UserChangeStatus,
  Api_UserDel,
} from "@/api/settings/dept";
import imgUrlSuper from '../../../assets/images/super.png'

export default {
  name: "Dept",
  components: {
    CreateUpdate,
    DeptModal,
    Detail,
  },
  data() {
    return {
      height: 0,
      imgUrlSuper: imgUrlSuper,
      resizeTimer: null,
      roleListLoading: false, // 部门列表加载状态
      treeModelStatus: true, // 部门树新增或修改
      treeSelectData: {}, // 当前树选中的数据
      treeParentData: {}, // 当前选中树的父数据
      userModelStatus: "add", // 用户列表新增或修改
      userSelectData: {}, // 用户列表选中的数据
      userListNum: 0, // 用户列表数量
      // cancelToken: null,
      treeData: [], // 部门树数据
      treeLoading: [], // 部门树加载状态
      listQuery: {
        departmentIds: "",
      },
      tableCol: [
        { key: "username", label: "用户名" ,
            render: (h, data, row) => {
                return row.adminStatus == '1'?  (
                    <div class="a-link" onClick={this.handleView.bind(this, row)}>
                      <img src={this.imgUrlSuper} style="width: 20px;height: 20px;margin-right: 5px;margin-top: -5px;"/>
                        {data}
                    </div> 
                ): ( 
                  <div class="a-link" onClick={this.handleView.bind(this, row)}>
                    {data}
                  </div> )
            },
        },
        {
          key: "name",
          label: "姓名",
          render: (h, data, row) => {
            return data ? data : "-";
          },
        },
        { key: "departmentName", label: "部门" },
        {
          key: "roleNames",
          label: "职务",
          render: (h, data, row) => {
            return data.length > 10 ? (
              <el-tooltip class="item" effect="dark" content={data} placement="top">
                <span>{data.substr(0, 10)}...</span>
              </el-tooltip>
            ) : (
              data
            );
          },
        },
        { key: "mobile", label: "手机号码" },
        {
          key: "email",
          label: "邮箱",
          render: (h, data, row) => {
            return data ? data : "-";
          },
        },
        {
          key: "enable",
          label: "账号状态",
          render: (h, data, row) => {
            return (
              <el-switch
                value={data === "1"}
                active-color="#409eff"
                inactive-color="#dcdfe6"
                onChange={this.statusChange.bind(this, row)}
              ></el-switch>
            );
          },
        },
        {
          key: null,
          label: "操作",
          width: 80,
          render: (h, data, row) => {
            return  [
                <el-link type="primary" onClick={ this.handleUpdate.bind(this, row)}> 修改 </el-link>,
                <el-link type="primary" onClick={ this.handleDelete.bind(this, row)}> 删除 </el-link>
            ]
          },
        },
      ],
    };
  },
  mounted() {
    this.getDeptTree();
    this.getList();
    this.getHeight();
    window.addEventListener("resize", this.getHeight, false);
  },
  beforeDestory() {
    window.removeEventListener("resize", this.getHeight);
  },
  methods: {
    Api_DepartmentUserList,
    getHeight() {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        if (!this.$refs.card) {
          return;
        }
        const { top: t } = this.$getOffset(this.$refs.card.$el);
        this.height = window.innerHeight - t - 75;
      }, 100);
    },
    onMouseOverLeft() {
      this.$refs.scrollWrapLeft.update();
    },
    onMouseOverRight() {
      this.$refs.scrollWrapRight.update();
    },
    getDeptTree() {
      this.treeLoading = true;
      this.treeSelectData = {};
      Api_DepartmentsFetchTreeParent()
        .then((res) => {
          this.treeData = res;
          this.treeLoading = false;
        })
        .catch(() => {
          this.treeLoading = false;
        });
    },
    // 获取数据
    getList(pageReset) {
      this.$refs.table.fetchData(pageReset);
    },
    // 表格加载数据成功后
    onSuccessData(list, totalRecordNumber) {
      this.userListNum = totalRecordNumber;
    },
    // 部门树选择切换事件
    onSelectChange(row, { parent }) {
      this.treeSelectData = row;
      if (row.pid) {
        this.treeParentData = parent.data;
      } else {
        this.treeParentData = {};
      }
      this.listQuery.departmentIds = row.id;
      this.getList(true);
    },
    statusChange(row) {
      const loading = this.$openLoading();
      Api_UserChangeStatus(row.enable === "1", row.id)
        .then((msg) => {
          this.$message.success(msg);
          this.getList();
          loading.close();
        })
        .catch((e) => {
          loading.close();
          this.$message.error(e);
        });
    },
    // 新增部门
    addDept() {
      if (this.$isVip()) {
        if (!this.treeSelectData.id) {
          this.$message.warning("请选择部门");
          return;
        }
        if (this.treeSelectData.depth >= 3) {
          this.$message.warning("最多建立三层");
          return;
        }
        this.treeModelStatus = true;
        this.$refs.dept.openModel();
      } else {
        this.$vipExpireConfirm();
      }
    },
    // 修改部门
    editDept() {
      if (!this.treeSelectData.id) {
        this.$message.warning("请选择部门");
        return;
      }
      this.treeModelStatus = false;
      this.$refs.dept.openModel(this.treeSelectData.id);
    },
    // 删除部门
    delDept() {
      if (!this.treeSelectData.id) {
        this.$message.warning("请选择部门");
        return;
      }
      if (this.userListNum) {
        this.$message.warning("该部门当前处于启用状态，不可删除");
        return;
      }
      this.$confirm("确定要删除该部门吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then((res) => {
        const loading = this.$openLoading();
        Api_DepartmentsDel(this.treeSelectData.id)
          .then((res) => {
            loading.close();
            this.listQuery.departmentIds = "";
            this.$message.success(res);
            this.getDeptTree();
            this.getList();
          })
          .catch((e) => {
            loading.close();
            this.$message.error(e);
          });
      });
    },
    // 新增成员
    userAdd() {
      if (this.$isVip()) {
        this.userModelStatus = "add";
        this.$refs.createUpdateModel.openModel();
      } else {
        this.$vipExpireConfirm();
      }
    },
    // 打开查看弹框
    handleView(row) {
      // this.userModelStatus = "view";
      // this.userSelectData = row;
      this.$refs.detail.openModel(row.id);
    },
    // 打开修改弹框
    handleUpdate(row) {
      this.userModelStatus = "update";
      this.userSelectData = row;
      this.$refs.createUpdateModel.openModel(row.id);
    },
    // 删除用户
    handleDelete(row) {
      this.$confirm("确定要删除该企业成员吗？删除后账号不可再使用。", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then((res) => {
        const loading = this.$openLoading();
        Api_UserDel(row.id)
          .then((res) => {
            loading.close();
            this.$message.success(res);
            this.getList();
          })
          .catch((e) => {
            loading.close();
            this.$message.error(e);
          });
      });
    },
  },
};
</script>
<style scoped lang="scss">
.el-card {
  height: 100%;
  overflow: auto;
}

.table-actions {
  text-align: right;
  margin-bottom: 15px;
}
</style>
