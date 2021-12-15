<template>
  <div class="usercenter-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="我的关注" name="first">
        <el-row>
          <el-col :span="6">
            <el-select
              v-model="searchParams.groupId"
              clearable
              placeholder="企业分组"
              size="small"
              @change="loadAttentionList"
            >
              <el-option
                v-for="item in $store.getters.attentionGroup"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
                {{ item.name }}
                <span class="fxb-red">（{{ item.attenSum }}）</span>
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-input placeholder="请输入企业名称" v-model="searchParams.companyName" size="small">
              <el-button slot="append" icon="el-icon-search" @click="loadAttentionList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="12" style="text-align: right;">
            <el-button icon="el-icon-document" size="small" @click="openCustomGroup">自定义分组</el-button>
            <el-button
              icon="el-icon-document"
              size="small"
              @click="batchSetGroupDialogVisible = true"
            >批量设置分组</el-button>
            <el-button icon="el-icon-document" size="small" @click="removeAttention">移出列表</el-button>
          </el-col>
        </el-row>
        <br />
        <el-table
          ref="attentionTable"
          :data="attentionList"
          v-loading="listLoading"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="companyName" label="企业名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="city" label="所属区域" width="120"></el-table-column>
          <el-table-column prop="legalPerson" label="法定代表人" width="120"></el-table-column>
          <el-table-column prop="depart" label="客户分组" width="120">
            <template slot-scope="scope">
              <el-tag
                size="mini"
                v-for="item in scope.row.groups"
                :key="item.id"
                v-show="item.name"
              >{{ item.name }}</el-tag>
              <i class="el-icon-edit" @click="openEditGroup(scope.row)"></i>
            </template>
          </el-table-column>
          <el-table-column label="列入时间" width="120">
            <template slot-scope="scope">{{ scope.row.createDate | dateFormat('yyyy-MM-dd') }}</template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="fxb-page"
          v-show="searchParams.totalRecords>0"
          :total="searchParams.totalRecords"
          :page-size="searchParams.pageSize"
          :current-page.sync="searchParams.pageNo"
          @current-change="loadAttentionList"
        />
      </el-tab-pane>
    </el-tabs>
    <MyConcernGroup ref="editGroupDialog" @submitEditGroup="editGroupConfirm" />
    <el-dialog
      title="自定义分组"
      :visible.sync="customGroupDialogVisible"
      :close-on-click-modal="false"
      width="30%"
      :before-close="closeCustomGroupDialog"
    >
      <el-row
        v-for="item in customGroup"
        :key="item.id"
        :gutter="10"
        style="margin-bottom: 16px; margin-top: 5px"
      >
        <el-col :span="19">
          <el-input
            :class="{error:item.error,success:item.success}"
            v-model="item.name"
            :disabled="item.createBy==='system'"
            @focus="item.canDelete=false"
            @blur="customInputBlur(item)"
            @change="saveGroup(item)"
          >
            <i slot="suffix" class="el-input__icon el-icon-loading" v-show="item.loading"></i>
            <i slot="suffix" class="el-input__icon el-icon-error" v-show="item.error"></i>
            <i slot="suffix" class="el-input__icon el-icon-success" v-show="item.success"></i>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-button
            type="danger"
            icon="el-icon-delete"
            :disabled="item.createBy==='system' || item.loading || !item.canDelete"
            @click="deleteGroup(item)"
            :loading="item.deleteLoading"
            style="width: 100%"
          >删除</el-button>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeCustomGroupDialog" :loading="customCloseLoading">保存并关闭</el-button>
        <el-button type="primary" @click="addGroupInput">添加分组</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="批量设置分组"
      :visible.sync="batchSetGroupDialogVisible"
      :close-on-click-modal="false"
      width="55%"
      top="10vh"
      :before-close="beforeBatchSetClose"
    >
      <el-table ref="attentionTable1" :data="attentionList" max-height="400">
        <el-table-column fixed prop="companyName" label="企业名称" width="260"></el-table-column>
        <el-table-column
          :label="item.name"
          width="100"
          v-for="item in $store.getters.attentionGroup"
          :key="item.id"
        >
          <template slot-scope="scope">
            <el-checkbox
              :checked="groupIsCheck(scope.row.groups,item.id)"
              @change="setGroupCheck($event,scope.row.groups,item.id)"
            ></el-checkbox>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="beforeBatchSetClose">取消</el-button>
        <el-button type="primary" @click="batchSetGroup" :loading="batchSetLoading">保存并关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import {
  Api_BatchSetGroup,
  Api_DeleteGroup,
  Api_EditGroup,
  Api_GetAttentionList,
  Api_RemoveAttention,
  Api_SaveGroup,
  Api_UpdateAttention
} from "@/api/userCenter/creditManage";
import { dateFormat } from "@/utils/index";
import MyConcernGroup from "./MyConcernGroup";
import { uuid } from "@/utils/index";

export default {
  name: "MyConcern",
  components: {
    Pagination,
    MyConcernGroup
  },
  filters: {
    dateFormat
  },
  data() {
    return {
      activeName: "first",
      multipleSelection: [],
      attentionList: [],
      searchParams: {
        companyName: "",
        groupId: "",
        pageNo: 1,
        pageSize: 10,
        totalRecords: 0
      },
      listLoading: true,
      attentionId: "",
      customGroupDialogVisible: false,
      customCloseLoading: false,
      customGroup: [],
      customPromise: [],
      batchSetGroupDialogVisible: false,
      batchSetLoading: false
    };
  },
  created: function() {
    this.loadAttentionList();
  },
  methods: {
    // 获取关注列表数据
    loadAttentionList() {
      this.listLoading = true;
      Api_GetAttentionList(this.searchParams).then(res => {
        this.listLoading = false;
        if (res.stateCode === "1") {
          this.attentionList = res.data.list;
          this.searchParams.totalRecords = res.data.totalRecords;
        }
      });
    },
    // 批量移除关注
    removeAttention() {
      if (this.multipleSelection.length === 0) {
        this.$message.info("请先选中要移除的企业");
        return;
      }
      this.$confirm("是否要将选中的企业移除关注列表?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          let attentionIds = "";
          this.multipleSelection.forEach(item => {
            attentionIds += item.id + ",";
          });
          Api_RemoveAttention({ attentionIds: attentionIds }).then(res => {
            if (res.stateCode === "1") {
              // 更新分组的使用数量统计
              this.$store.dispatch("updateAttentionGroup");
              this.loadAttentionList();
              this.$message.success("移除成功");
            } else {
              this.$message.error("移除失败");
            }
          });
        })
        .catch(() => {});
    },
    // 关注列表多选框事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 打开编辑分组弹框
    openEditGroup(row) {
      this.attentionId = row.id;
      let groupIds = "";
      row.groups.forEach(item => {
        groupIds += item.id + ",";
      });
      this.$refs.editGroupDialog.openDialog(groupIds);
    },
    // 编辑分组弹框确定事件
    editGroupConfirm(newGroupIds) {
      this.$refs.editGroupDialog.openLoading();
      Api_UpdateAttention({
        attentionId: this.attentionId,
        groupIds: newGroupIds
      }).then(res => {
        this.$refs.editGroupDialog.closeLoading();
        this.$refs.editGroupDialog.closeDialog();
        if (res.stateCode === "1") {
          // 更新分组的使用数量统计
          this.$store.dispatch("updateAttentionGroup");
          this.loadAttentionList();
          this.$message.success("修改分组成功");
        } else {
          this.$message.error("修改分组失败");
        }
      });
    },
    // 打开自定义分组弹窗
    openCustomGroup() {
      // 将全局的企业分组复制一份用于页面编辑
      [...this.customGroup] = this.$store.getters.attentionGroup;
      this.customGroup.forEach(item => {
        this.$set(item, "isOldGroup", true);
        this.$set(item, "loading", false);
        this.$set(item, "error", false);
        this.$set(item, "success", false);
        this.$set(item, "canDelete", true);
        this.$set(item, "deleteLoading", false);
      });
      this.customGroupDialogVisible = true;
    },
    // 自定义分组-添加分组输入框
    addGroupInput() {
      this.customGroup.push({
        id: uuid(),
        name: "",
        isOldGroup: false,
        loading: false,
        error: false,
        success: false,
        canDelete: true,
        deleteLoading: false
      });
    },
    // 保存分组名
    saveGroup(group) {
      group.loading = true;
      group.success = false;
      group.error = false;
      if (!group.name || !group.name.trim()) {
        group.loading = false;
        return;
      }
      if (group.name.trim().length > 10) {
        group.loading = false;
        group.error = true;
        this.$message.error("分组名称长度不能超过10");
        return;
      }
      group.name = group.name.trim();
      if (group.isOldGroup) {
        // 旧的分组，修改名称
        const promise = new Promise((resolve, reject) => {
          Api_EditGroup({ name: group.name, groupId: group.id }).then(res => {
            group.loading = false;
            resolve();
            if (res.stateCode === "1") {
              group.success = true;
              this.$message.success("修改分组成功");
            } else if (res.stateCode === "70001") {
              group.error = true;
              this.$message.error("修改分组失败，分组名称重复");
            } else if (res.stateCode === "70003") {
              // 修改的分组名称未发生改变，页面不修改
            } else {
              group.error = true;
              this.$message.error("修改分组失败");
            }
          });
        });
        this.customPromise.push(promise);
      } else {
        // 新的分组，保存分组
        const promise = new Promise((resolve, reject) => {
          Api_SaveGroup(group.name).then(res => {
            group.loading = false;
            resolve();
            if (res.stateCode === "1") {
              group.success = true;
              group.isOldGroup = true;
              group.id = res.data.id;
              this.$message.success("保存分组成功");
            } else if (res.stateCode === "70001") {
              group.error = true;
              this.$message.error("保存分组失败，分组名称重复");
            } else {
              group.error = true;
              this.$message.error("保存分组失败");
            }
          });
        });
        this.customPromise.push(promise);
      }
    },
    // 删除分组
    deleteGroup(group) {
      if (group.isOldGroup) {
        // 旧的分组，提交数据库
        this.$confirm("确认删除该分组吗？")
          .then(() => {
            const promise = new Promise((resolve, reject) => {
              group.deleteLoading = true;
              Api_DeleteGroup(group.id).then(res => {
                resolve();
                group.deleteLoading = false;
                if (res.stateCode === "1") {
                  this.customGroup = this.customGroup.filter(
                    ({ id }) => id !== group.id
                  );
                  this.$message.success("删除分组成功");
                } else if (res.stateCode === "70002") {
                  this.$message.error("删除分组失败，分组已被使用");
                } else {
                  this.$message.error("删除分组失败");
                }
              });
            });
            this.customPromise.push(promise);
          })
          .catch(_ => {});
      } else {
        this.customGroup = this.customGroup.filter(({ id }) => id !== group.id);
      }
    },
    // 自定义分组弹框关闭控制
    closeCustomGroupDialog(done) {
      const close = () => {
        if (typeof done === "function") {
          done();
        } else {
          this.customGroupDialogVisible = false;
        }
      };
      if (this.customPromise && this.customPromise.length > 0) {
        this.customCloseLoading = true;
        Promise.all(this.customPromise).then(res => {
          this.customPromise = [];
          this.customCloseLoading = false;
          // 刷新全局变量里的分组
          this.$store.dispatch("updateAttentionGroup");
          // 刷新列表
          this.loadAttentionList();
          close();
        });
      } else {
        // 没有发生接口调用，无需刷新页面
        close();
      }
    },
    // 自定义分组输入框失去焦点
    customInputBlur(group) {
      setTimeout(() => {
        group.canDelete = true;
      }, 200);
    },
    // 批量设置分组判断是否已选中
    groupIsCheck(groups, groupId) {
      return groups.findIndex(item => item.id === groupId) > -1;
    },
    // 批量设置分组-切换选择
    setGroupCheck(value, groups, groupId) {
      const index = groups.findIndex(item => item.id === groupId);
      if (index > -1) {
        groups[index].checked = value;
      } else {
        groups.push({ id: groupId, checked: value });
      }
    },
    // 批量设置分组-关闭窗口前验证
    beforeBatchSetClose(done) {
      const close = () => {
        if (typeof done === "function") {
          done();
        } else {
          this.batchSetGroupDialogVisible = false;
        }
      };
      const params = this.buildBatchSetParams();
      if (params.length > 0) {
        this.$confirm("有修改的分组未提交，是否直接关闭页面？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
          .then(() => {
            // 未选中企业时跳过
            this.attentionList = [];
            this.loadAttentionList();
            close();
          })
          .catch(() => {});
      } else {
        close();
      }
    },
    // 批量设置分组-保存设置
    batchSetGroup() {
      this.batchSetLoading = true;
      const params = this.buildBatchSetParams();
      console.log(params);
      if (params.length > 0) {
        if (params.findIndex(item => !item.groupIds) > -1) {
          this.$message.warning("每个企业至少选择一个分组");
        }
        Api_BatchSetGroup(params).then(res => {
          this.batchSetLoading = false;
          if (res.stateCode === "1") {
            this.$message.success("批量设置分组成功");
            this.batchSetGroupDialogVisible = false;
            // 刷新全局变量里的分组
            this.$store.dispatch("updateAttentionGroup");
            // 刷新列表
            this.loadAttentionList();
          } else {
            this.$message.error("批量设置分组失败");
          }
        });
      } else {
        // 没有发生接口调用，无需刷新页面
        this.batchSetGroupDialogVisible = false;
      }
    },
    // 批量设置分组-生成待提交数据
    buildBatchSetParams() {
      const params = [];
      this.attentionList.forEach(item => {
        let groupIds = "";
        let needUpdate = false;
        item.groups.forEach(group => {
          groupIds +=
            group.checked || !("checked" in group) ? group.id + "," : "";
          needUpdate = "checked" in group ? true : needUpdate;
        });
        if (needUpdate) {
          // 只提交需要更新的数据
          params.push({ id: item.id, groupIds: groupIds });
        }
      });
      return params;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.error > .el-input__inner {
  border-color: #f56c6c;
}

.success > .el-input__inner {
  border-color: #67c23a;
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.el-pagination {
  margin-top: 15px;
}

.el-icon-error {
  color: #f56c6c;
}

.el-icon-success {
  color: #67c23a;
}
</style>
