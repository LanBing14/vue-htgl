<template>
  <Dialog
    ref="drawer"
    title="自定义分组"
    :visible.sync="visible"
    width="500px"
    id="changeSize"
    :onOk="handleSure"
    :close="closeDialog"
  >
    <el-table
      v-loading="loading"
      ref="table"
      :data="groupOptions"
      row-key="id"
      @cell-mouse-enter="showBtnsEnter"
    >
      <el-table-column width="80px" align="center">
        <template slot-scope="scope">
          <div class="sort-item">
            <i class="iconfont icon-menu"></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="group_name" label="自定义名称">
        <template slot-scope="scope">
          <div v-if="scope.row.isEdit">
            <el-input v-model="scope.row.group_name"></el-input>
          </div>
          <span v-else>{{scope.row.group_name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header" slot-scope="scope">
          <span>
            <span style="margin-right: 8px">操作</span>
            <el-button
              icon="el-icon-plus"
              circle
              type="primary"
              size="mini"
              @click="addGroup()"
              style="padding: 6px 4px 4px"
            ></el-button>
          </span>
        </template>
        <template slot-scope="scope">
          <div v-if="scope.row.is_default!=='1'&&!scope.row.isEdit" v-show="showBtns===scope.row.id">
            <el-button
              size="mini"
              style="padding: 6px 4px 4px"
              icon="el-icon-edit"
              circle
              @click="editGroup(scope.row, scope.$index)"
            ></el-button>
            <el-button
              size="mini"
              style="padding: 6px 4px 4px"
              icon="el-icon-minus"
              circle
              @click="delGroup(scope.row, scope.$index)"
            ></el-button>
          </div>
          <div v-if="scope.row.is_default!=='1'&&scope.row.isEdit">
            <el-button
              size="mini"
              style="padding: 6px 4px 4px"
              icon="el-icon-check"
              circle
              @click="checkGroup(scope.row, scope.$index)"
            ></el-button>
            <el-button
              size="mini"
              style="padding: 6px 4px 4px"
              icon="el-icon-close"
              circle
              @click="closeGroup(scope.row, scope.$index)"
            ></el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </Dialog>
</template>

<script>
import Sortable from "sortablejs";
import {
  Api_GetCustomerGroup,
  Api_GetCustomerGroupJudge,
  Api_GetCustomerGroupSave,
} from "@/api/creditManagement/customerProfile/customerManagement.js";

export default {
  name: "ManageGroup",
  data() {
    return {
      visible: false,
      sortIns: null,
      loading: false,
      groupOptions: [],
      showBtns: null,
      recordName: null,
    };
  },
  mounted() {},
  methods: {
    open() {
      this.visible = true;
      this.$nextTick(() => {
        this.getGroup();
        if (!this.sortIns) {
          const body = this.$refs.table.$el.querySelector(".el-table__body-wrapper tbody");
          this.sortIns = new Sortable(body, {
            handle: ".sort-item",
            onUpdate: (e) => {
              const newIndex = e.newIndex;
              const oldIndex = e.oldIndex;
              const nItem = this.groupOptions.splice(oldIndex, 1);
              this.groupOptions.splice(newIndex, 0, nItem[0]);
            },
          });
        }
      });
    },
    getGroup() {
      this.loading = true;
      Api_GetCustomerGroup()
        .then((res) => {
          this.groupOptions = res.map((i) => ({ ...i, isEdit: false })).filter((i) => i.is_default !== "1");
          this.loading = false;
        })
        .catch((res) => {
          this.loading = false;
        });
    },
    closeDialog() {
      this.visible = false;
    },
    addGroup() {
      this.groupOptions.push({
        id: null,
        create_date: null,
        group_name: "",
        is_default: "0",
        isEdit: true,
        sequence: null,
      });
      this.recordName = null;
    },
    editGroup(row, i) {
      this.recordName = row.group_name;
      row.isEdit = true;
    },
    delGroup(row, i) {
      if (row.id) {
        const loading = this.$openLoading();
        Api_GetCustomerGroupJudge(row.id)
          .then((res) => {
            this.groupOptions.splice(i, 1);
            loading.close();
          })
          .catch((res) => {
            this.$message.error(res);
            loading.close();
          });
      } else {
        this.groupOptions.splice(i, 1);
      }
    },
    checkGroup(row, i) {
      if (row.group_name) {
        row.isEdit = false;
      } else {
        this.$alert("请先填写此项分组名称！", "提示", { type: "warning" });
      }
    },
    closeGroup(row, i) {
      // if (row.group_name) {
      if (this.recordName === null) {
        this.groupOptions.splice(i, 1);
      } else {
        row.group_name = this.recordName;
        row.isEdit = false;
      }
      // } else {
      // this.$alert("请先填写此项分组名称！", "提示", { type: "warning" });
      // }
      // this.groupOptions.splice(i, 1);
    },
    handleSure() {
      if (this.groupOptions.filter((i) => !i.group_name).length > 0) {
        this.$alert("存在分组名称未填写，请检查！", "提示", { type: "warning" });
        return false;
      }
      const loading = this.$openLoading();
      Api_GetCustomerGroupSave({
        inVos: this.groupOptions.map((i, index) => ({
          groupName: i.group_name,
          id: i.id,
          sequence: index + 1,
        })),
      })
        .then((res) => {
          loading.close();
          this.visible = false;
          this.$message.success(res);
          this.$emit("getGroups");
          this.getList();
        })
        .catch((res) => {
          loading.close();
          this.$message.error(res);
        });
    },
    showBtnsEnter(row, column, cell, event) {
      this.showBtns = row.id;
    },
  },
};
</script>

