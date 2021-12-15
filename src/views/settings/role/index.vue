<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>职务管理</span>
      </h1>
    </div>
    <div class="page-content" style="position: relative">
      <div class="left" style="position: sticky; top: 20px">
        <el-card
          ref="card"
          :style="{height: (height + 40)+'px'}"
          v-loading="roleListLoading"
          shadow="never"
          class="box-card"
        >
          <div slot="header" class="clearfix">
            <div class="flex">
              <span class="flex-primary">职务</span>
              <div class="action">
                <el-button type="text" class="tree-btn-font" @click="addRow">新增</el-button>
                <el-button type="text" class="tree-btn-font" @click="editRow">修改</el-button>
                <el-button type="text" class="tree-btn-font" @click="delRow">删除</el-button>
              </div>
            </div>
          </div>
          <el-scrollbar
            ref="scrollWrapLeft"
            style="height: 100%; overflow: hidden"
            @mouseover.native="onMouseOverLeft"
          >
            <el-radio-group v-model="roleId" @change="onSelectChange">
              <el-radio-button v-for="el in roleList" :key="el.id" :label="el.id">{{ el.name }}</el-radio-button>
            </el-radio-group>
          </el-scrollbar>
        </el-card>
      </div>
      <div class="content-wrap" v-loading="loadingPermissions">
        <!-- <div :style="{height: (height - 20) +'px'}"> -->
        <!-- <el-scrollbar
            ref="scrollWrapRight"
            style="height: 100%; overflow: hidden"
            @mouseover.native="onMouseOverRight"
        >-->
        <div class="title-tip">
          <span>功能权限</span>
        </div>
        <div v-for="el in grantData" :key="el.id" class="row flex">
          <div class="row-label">
            <i class="el-icon-arrow-right"></i>
            {{ el.label }}
          </div>
          <div class="row-content flex-primary">
            <div
              v-for="c in el.children"
              :key="c.id"
              :class="{'has-selected': getChecked(c).length}"
              class="list-item"
            >
              <span v-if="getChecked(c).length" class="icon-check">
                <i class="el-icon-check"></i>
              </span>
              <div class="item-label flex" @click="setDefaultChecked(c)">
                <span class="flex-primary">{{ c.label }}</span>
                <el-popover placement="bottom-end" popper-class="pop">
                  <el-button slot="reference" @click="setDefaultChecked(c)">高级</el-button>
                  <div>
                    <div v-for="(el, index) in c.attributes.permissions" :key="index" class="switch-item">
                      <el-switch v-model="el.checked"></el-switch>
                      <span>{{ el.text }}</span>
                    </div>
                  </div>
                </el-popover>
              </div>
            </div>
          </div>
        </div>
        <el-alert v-if="!grantData.length" :closable="false" title="暂无数据" type="info" show-icon></el-alert>
        <!-- </el-scrollbar> -->
        <!-- </div> -->
        <div v-if="grantData.length" class="btns size-btn-change" style="text-align: center; margin-top: 20px">
          <el-button :loading="btnLoading" type="primary" @click="savePermissions">保存</el-button>
        </div>
      </div>
    </div>
    <CreateUpdate
      ref="createUpdateModel"
      :model-status="modelStatus"
      :select-data="selectData"
      :roleNames="roleNames"
      @getList="getList"
    />
  </div>
</template>

<script>
import axios from "axios";
import CreateUpdate from "./CreateUpdate";
import {
  Api_RolesFetchList,
  Api_RolesGetPermissions,
  Api_RolesUpdatePermissions,
  Api_RolesDel,
} from "@/api/settings/role";

export default {
  name: "Role",
  components: {
    CreateUpdate,
  },
  data() {
    return {
      height: 0,
      resizeTimer: null,
      roleId: "", // 当前选中角色的id
      roleList: [], // 角色列表数据
      roleListLoading: false, // 角色列表加载状态
      activeName: "", // 当前权限展开的
      defaultGruopCheckAllData: {},
      defaultGrantData: [], // 默认的数据权限，不需要展示的，但是在保存时要传给后台
      grantData: [], // 权限数据
      loadingPermissions: false, // 权限列表数据的加载状态
      selectData: {}, // 当前选中的角色数据
      btnLoading: false, // 保存、重置按钮的状态
      modelStatus: true, // 新增或修改
      roleNames: [], // 角色名称集合
      cancelToken: null,
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    this.getHeight();
    window.addEventListener("resize", this.getHeight, false);
  },
  beforeDestory() {
    window.removeEventListener("resize", this.getHeight);
  },
  methods: {
    getHeight() {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        if (!this.$refs.card) {
          return;
        }
        const { top: t } = this.$getOffset(this.$refs.card.$el);
        this.height = window.innerHeight - t - 75 - 40;
      }, 100);
    },
    onMouseOverLeft() {
      this.$refs.scrollWrapLeft.update();
    },
    onMouseOverRight() {
      this.$refs.scrollWrapRight.update();
    },
    // 获取数据
    getList() {
      this.roleListLoading = true;
      Api_RolesFetchList({
        currentPage: 1,
        pageSize: 100,
      })
        .then((res) => {
          const { data } = res;
          this.roleList = data;
          this.roleNames = data.map((item) => item.name);
          this.roleListLoading = false;
          this.$nextTick(() => {
            this.roleId = data[0].id;
            this.onSelectChange(data[0].id);
          });
        })
        .catch((e) => {
          this.roleListLoading = false;
        });
    },
    // 角色选择切换事件
    onSelectChange(id) {
      this.selectData = this.roleList.find((item) => item.id === id);
      this.loadingPermissions = true;
      Api_RolesGetPermissions(id, this.cancelPermissons())
        .then((res) => {
          const frontChildren = res[1].children;
          if (frontChildren.length) {
            const children = frontChildren[0].children;
            // children.forEach(item1 => {
            //     item1.children.forEach(item2 => {
            //         item2.checkedArrs = item2.attributes.permissions.filter(i => i.checked).map(i => i.value);
            //     });
            // });
            this.grantData = children;
          } else {
            this.grantData = [];
          }
          this.loadingPermissions = false;
        })
        .catch((e) => {
          this.loadingPermissions = false;
          this.$message.error(e);
        });
    },
    // 保存权限
    savePermissions() {
      let permissionArr = [];
      this.grantData.forEach((item1) => {
        item1.children.forEach((item2) => {
          const checked = this.getChecked(item2).map((i) => i.value);
          permissionArr = permissionArr.concat(checked);
        });
      });
      this.btnLoading = true;
      Api_RolesUpdatePermissions(this.selectData.id, permissionArr.join(","))
        .then((res) => {
          this.btnLoading = false;
          this.$message.success(res);
        })
        .catch((e) => {
          this.btnLoading = false;
          this.$message.error(e);
        });
    },
    cancelPermissons() {
      const CancelToken = axios.CancelToken;
      return new CancelToken((c) => {
        // executor 函数接收一个 cancel 函数作为参数
        this.cancelToken = c;
      });
    },
    // 新增
    addRow() {
      this.modelStatus = true;
      this.$refs.createUpdateModel.openModel();
    },
    // 修改
    editRow() {
      if (!this.roleId) {
        this.$message.warning("请选择角色");
        return;
      }
      this.modelStatus = false;
      this.$refs.createUpdateModel.openModel(this.roleId);
    },
    // 删除
    delRow() {
      if (!this.roleId) {
        this.$message.warning("请选择角色");
        return;
      }
      this.$confirm("确认删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.cancelToken();
        const loading = this.$openLoading();
        Api_RolesDel(this.roleId)
          .then((res) => {
            loading.close();
            this.$message.success(res);
            this.getList();
            this.roleId = "";
            this.grantData = [];
            this.loadingPermissions = false;
          })
          .catch((e) => {
            loading.close();
            this.$message.error(e);
          });
      });
    },
    getChecked(item) {
      return item.attributes.permissions.filter((i) => i.checked);
    },
    setDefaultChecked(item) {
      const hasChecked = item.attributes.permissions.filter((i) => i.checked);
      if (!hasChecked.length) {
        item.attributes.permissions.forEach((i) => (i.checked = true));
      } else {
        item.attributes.permissions.forEach((i) => (i.checked = false));
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "src/styles/mixin.scss";

$color-primary: #4b9df3;

.el-card {
  height: 100%;
  overflow: auto;

  // /deep/ .el-card__body {
  //   padding-left: 0;
  //   padding-right: 0;
  // }
}

/deep/ {
  @include radioGroupButton;
}

.left {
  // height: 100%;
  width: 242px;
  float: left;
}

.title-tip {
  font-size: 16px;
  line-height: 40px;
}

.content-wrap {
  // flex: 1;
  padding: 0 0 0 20px;
  width: calc(100% - 242px);
  overflow: auto;
  position: relative;
  z-index: 1;
  float: left;

  .row {
    .row-label {
      width: 10em;
      padding: 34px 0 10px 20px;
      color: #606266;

      i {
      }
    }

    .row-content {
      display: flex;
      flex-wrap: wrap;

      .list-item {
        width: 210px;
        margin: 10px;
        border: 1px solid #e8ebf0;
        position: relative;
        background-color: #f7f8f9;

        &.has-selected {
          background-color: #fff;

          .item-label {
            color: #606266;

            .el-button {
              color: $color-primary;
            }
          }
        }

        .item-label {
          padding: 0 10px 0 25px;
          font-size: 13px;
          color: #999;
          align-items: center;
          height: 60px;
          cursor: pointer;

          .el-button {
            border: none;
            font-size: 12px;
            width: 55px;
            padding-left: 0;
            padding-right: 0;
            text-align: center;
            // color: #999;
            background-color: transparent;
          }

          .el-button:hover {
            background-color: #e9e9eb;
          }
        }

        .icon-check {
          position: absolute;
          top: 0;
          left: 0;

          &::before {
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            display: block;
            border-left: 25px solid $--color-primary;
            border-bottom: 25px solid transparent;
            border-right: 25px solid transparent;
          }

          i {
            position: relative;
            color: #fff;
            left: 1px;
          }
        }
      }
    }
  }
}

// .btns {
//   position: absolute;
//   z-index: 2;
//   bottom: 20px;
//   left: 268px;
//   height: 60px;
//   line-height: 60px;
//   text-align: left;
//   padding-left: 20px;
//   width: calc(100% - 295px);
//   background-color: #e9e9e9;

//   button {
//     width: 99px;
//     height: 36px;
//   }
// }
</style>
<style lang="scss">
.pop .switch-item {
  display: block;
  margin-bottom: 10px;
  overflow: hidden;
  margin-left: 8px;
  margin-right: 8px;

  .el-switch {
    margin-right: 12px;
    float: left;
  }

  & > span {
    float: left;
  }

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
