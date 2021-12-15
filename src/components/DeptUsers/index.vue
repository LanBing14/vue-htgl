<template>
  <el-popover v-model="visible" width="500" trigger="manual">
    <el-input slot="reference" :value="valueName" :placeholder="placeholder" @focus="visible=true" readonly></el-input>
    <div class="flex">
      <div style="width: 50%;padding-right: 10px;">
        <el-tree
          ref="tree"
          v-loading="treeLoading"
          :data="treeData"
          :expand-on-click-node="false"
          show-checkbox
          default-expand-all
          node-key="id"
          highlight-current
          check-strictly
          check-on-click-node
          @check="onCheckChange"
        ></el-tree>
      </div>
      <div v-loading="userLoading" class="flex-primary group-wrap">
        <el-checkbox-group v-model="userId" class="radio-group-wrap" @change="checkboxChange">
          <el-checkbox v-for="el in userOptions" :key="el.id" :label="el.id">{{ el.name }}</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div class="btns">
      <el-button type="primary" size="mini" @click="sure">确定</el-button>
      <el-button type="primary" size="mini" @click="clear">清除</el-button>
    </div>
  </el-popover>
</template>

<script>
import {
  Api_DepartmentUserList, // 用户列表
  Api_DepartmentsFetchTree, // 查询部门树
} from "@/api/settings/dept";

export default {
  name: "DeptUsers",
  props: {
    placeholder: String,
  },
  data() {
    return {
      visible: false,
      treeLoading: false, // 部门树loading
      treeData: [], // 部门树数据
      deptId: "", // 树选中的id
      userLoading: false, // 用户列表loading
      userOptions: [], // 用户列表数据
      userId: [], // 选中的用户id
      valueName: "", // 选中数据的name
    };
  },
  created() {
    this.getDeptTree();
    this.getUserList("");
  },
  methods: {
    getDeptTree() {
      this.treeLoading = true;
      Api_DepartmentsFetchTree()
        .then((res) => {
          this.treeData = res;
          this.treeLoading = false;
        })
        .catch(() => {
          this.treeLoading = false;
        });
    },
    // 部门树选择事件
    onCheckChange(row) {
      this.$refs.tree.setCheckedKeys([]);
      this.$refs.tree.setChecked(row.id, row.id !== this.deptId);

      if (row.id === this.deptId) {
        this.deptId = "";
      } else {
        this.deptId = row.id;
      }
      this.getUserList(this.deptId);
    },
    // 获取用户
    getUserList(id) {
      this.userLoading = true;
      Api_DepartmentUserList({
        departmentIds: id,
      })
        .then((res) => {
          this.userLoading = false;
          this.userOptions = res.data;
        })
        .catch((e) => {
          this.userLoading = false;
          this.$message.error(e);
        });
    },
    checkboxChange(value) {
      const lastValue = value.pop();
      this.userId = lastValue ? [lastValue] : [];
    },
    // 保存数据，通知父级
    sure() {
      let data = {};
      let valueName = "";
      if (this.userId.length) {
        data = {
          deptId: this.deptId,
          userId: this.userId[0],
        };
        valueName = this.userOptions.find((item) => item.id === this.userId[0]).name;
      } else if (this.deptId) {
        data = {
          deptId: this.deptId,
          userId: "",
        };
        valueName = this.$refs.tree.getNode(this.deptId).data.label;
      } else {
        data = {
          deptId: "",
          userId: "",
        };
        valueName = "";
      }
      this.valueName = valueName;
      this.$emit("select", data);
      this.visible = false;
    },
    clear() {
      this.deptId = "";
      this.userId = [];
      this.$refs.tree.setCheckedKeys([]);
      this.getUserList("");
    },
  },
};
</script>

<style scoped lang="scss">
/deep/ .el-tree-node__label {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.group-wrap {
  position: relative;
}

.radio-group-wrap {
  display: block;
  padding-left: 10px;

  &::before {
    content: "";
    border-left: 1px dashed #ccc;
    height: 100%;
    display: block;
    position: absolute;
    left: 0;
    top: 0;
  }

  .el-checkbox {
    display: block;
    margin-right: 0;
    line-height: 26px;
    padding-left: 10px;

    &:hover {
      background-color: #f5f7fa;
    }
  }
}

.btns {
  margin-top: 10px;
  text-align: center;
}
</style>
