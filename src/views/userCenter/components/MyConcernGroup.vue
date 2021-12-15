<template>
  <div class="usercenter-container custom-group-div">
    <Dialog
      ref="drawer"
      title="请选择企业分组"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      :onOk="confirm"
      width="500px"
      @close="closeDialog"
      append-to-body
    >
      <div style="margin-bottom: 8px; margin-left: 20px">
        <el-checkbox
          v-for="item in attentionGroup"
          :key="item.id"
          v-model="item.checked"
          style="line-height: 40px"
        >{{ item.group_name }}</el-checkbox>
      </div>
      <el-row :gutter="10" v-if="addGroupVisible" class="custom-group-add">
        <el-col :span="14">
          <el-input
            :class="{error: groupItem.error,success: groupItem.success}"
            v-model="groupItem.name"
            size="small"
          >
            <i slot="suffix" class="el-input__icon el-icon-loading" v-show="groupItem.loading"></i>
            <i slot="suffix" class="el-input__icon el-icon-error" v-show="groupItem.error"></i>
            <i slot="suffix" class="el-input__icon el-icon-success" v-show="groupItem.success"></i>
          </el-input>
        </el-col>
        <el-col :span="10">
          <el-button
            style="margin-left: 0"
            type="success"
            icon="el-icon-check"
            size="small"
            :loading="groupItem.loading"
            @click="saveGroup()"
          ></el-button>
          <el-button icon="el-icon-delete" size="small" :disabled="groupItem.loading" @click="deleteGroup()"></el-button>
        </el-col>
      </el-row>
    </Dialog>
  </div>
</template>

<script>
import { merge } from "lodash";
import { Api_SaveGroup } from "@/api/userCenter/creditManage";
import { getRoleAuthInfo } from "@/utils/auth";

export default {
  name: "MyConcernGroup",
  props: {
    groupType: "",
    addGroup: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeName: "1",
      thisBlocType: "1",
      confirmLoading: false,
      dialogVisible: false,
      addGroupVisible: false,
      groupItem: {
        name: "",
        loading: false,
        error: false,
        success: false
      },
      hasEditAttentionGroupPermission: false,
      attentionGroup: []
    };
  },
  watch: {
    "$store.getters.attentionGroup"(val) {
      this.attentionGroup = merge([], val).map(item => ({
        ...item,
        checked: false
      }));
    }
  },
  created() {
    // 是否有编辑分组权限
    const roleAuthInfo = getRoleAuthInfo();
    this.hasEditAttentionGroupPermission =
      roleAuthInfo.role === undefined ||
      roleAuthInfo.role === null ||
      roleAuthInfo.role === "null" ||
      roleAuthInfo.role === "0";
  },
  methods: {
    confirm() {
      let newGroupIds = "";
      // eslint-disable-next-line no-return-assign
      this.attentionGroup.forEach(item => (newGroupIds += item.checked ? item.id + "," : ""));
      if (newGroupIds) {
        this.$emit("submitEditGroup", newGroupIds);
      } else {
        this.$message({ type: "warning", message: "至少选择一个分组" });
      }
    },
    openDialog(groupIds) {
      this.$store.dispatch("updateAttentionGroup");
      // 每次打开清除选中
      this.attentionGroup.forEach(item => (item.checked = false));
      // 默认选中分组
      if (groupIds) {
        this.attentionGroup.forEach(item => (item.checked = groupIds.indexOf(item.id) !== -1));
      }
      this.dialogVisible = true;
    },
    // 保存分组
    saveGroup() {
      this.groupItem.loading = true;
      this.groupItem.success = false;
      this.groupItem.error = false;
      if (!this.groupItem.name || !this.groupItem.name.trim()) {
        this.groupItem.loading = false;
        return;
      }
      if (this.groupItem.name.trim().length > 10) {
        this.groupItem.loading = false;
        this.groupItem.error = true;
        this.$message.error("分组名称长度不能超过10");
        return;
      }
      this.groupItem.name = this.groupItem.name.trim();
      // 新的分组，保存分组
      Api_SaveGroup(this.groupItem.name, this.thisBlocType).then(res => {
        this.groupItem.loading = false;
        if (res.stateCode === "1") {
          this.groupItem.success = true;
          this.$message.success("保存分组成功");
          this.addGroupVisible = false;
          this.resetAddGroup();
          this.$store.dispatch("updateAttentionGroup");
        } else if (res.stateCode === "70001") {
          this.groupItem.error = true;
          this.$message.error("保存分组失败，分组名称重复");
        } else {
          this.groupItem.error = true;
          this.$message.error("保存分组失败");
        }
      });
    },
    // 关闭保存分组
    deleteGroup() {
      this.addGroupVisible = false;
      this.resetAddGroup();
    },
    // 重置保存分组输入框
    resetAddGroup() {
      this.groupItem.name = "";
      this.groupItem.loading = false;
      this.groupItem.error = false;
      this.groupItem.success = false;
    },
    beforeCloseDialog(done) {
      done();
      this.addGroupVisible = false;
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    openLoading() {
      this.confirmLoading = true;
    },
    closeLoading() {
      this.confirmLoading = false;
    },
    handleClick(tab, event) {
      this.thisBlocType = tab.name;
      this.deleteGroup();
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
.custom-group-div .el-dialog__body {
  padding: 15px 20px 0 20px !important;
}

.custom-group-add {
  padding-left: 20px;
  margin-bottom: 15px !important;
}

.custom-group-tab > .el-tabs__header {
  border-bottom: 1px solid #eaedf4 !important;
  margin-bottom: 1px !important;
  font-size: 16px !important;
}

.custom-group-tab .el-tabs__nav {
  width: 100% !important;
}

.custom-group-tab .el-tabs__item {
  font-size: 16px !important;
  width: 50% !important;
  text-align: center;
}

.error > .el-input__inner {
  border-color: #f56c6c;
}

.success > .el-input__inner {
  border-color: #67c23a;
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
.el-row {
  margin-bottom: 0;

  &:last-child {
    margin-bottom: 0;
  }
}

.el-icon-error {
  color: #f56c6c;
}

.el-icon-success {
  color: #67c23a;
}

.dialog-footer {
  padding-right: 16px !important;
}
</style>
