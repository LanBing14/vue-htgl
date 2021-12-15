<template>
  <div class="usercenter-container">
    <Dialog
      ref="drawer"
      title="请选择企业分组"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :onOk="confirm"
      width="500px"
      @close="closeDialog"
    >
      <el-form ref="form" v-loading="loading" :model="form" label-width="90px">
        <el-form-item prop="groupIds" label-width="20px">
          <el-checkbox-group v-model="form.groupIds">
            <el-checkbox
              v-for="(el, index) in superviseGroupList"
              :key="index"
              :label="el.id"
            >{{el.group_name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script>
// import {Api_GetSuperviseGroup, Api_SaveSuperviseGroup} from "@/api/creditMonitor";
import { Api_GetCustomerGroup } from "@/api/creditManagement/customerProfile/customerManagement.js";
import { uuid } from "@/utils/index";
import { arrayIsNull } from "@/utils/commonUtils";

export default {
  name: "MySuperviseGroup",
  props: {
    addGroup: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      confirmLoading: false,
      dialogVisible: false,
      // addGroupVisible: false,
      superviseGroupList: [],
      groupItem: {
        id: uuid(),
        name: "",
        loading: false,
        error: false,
        success: false,
        canAdd: false,
      },
      form: { groupIds: [] },
      loading: false,
    };
  },
  methods: {
    getSuperviseGroupList(groupIds) {
      this.loading = true;
      Api_GetCustomerGroup()
        .then((res) => {
          this.loading = false;
          this.superviseGroupList = res.filter((i) => i.group_name !== "未分组");
          let i = 0;
          this.superviseGroupList.forEach((data) => {
            if (!arrayIsNull(groupIds)) {
              this.$set(this.superviseGroupList[i], "checked", groupIds.indexOf(data.id) !== -1);
            } else {
              this.$set(this.superviseGroupList[i], "checked", false);
            }
            i++;
          });
        })
        .catch((res) => {
          this.loading = false;
        });
    },
    confirm() {
      if (!arrayIsNull(this.form.groupIds)) {
        this.$emit("submitEditGroup", this.form.groupIds);
      } else {
        this.$message.warning("至少选择一个分组");
      }
    },
    openDialog(groupIds) {
      // 初始化数据
      this.groupItem.name = "";
      this.groupItem.loading = false;
      this.groupItem.error = false;
      this.groupItem.success = false;
      this.groupItem.canAdd = false;
      this.getSuperviseGroupList(groupIds);
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["form"].resetFields();
      });
    },
    // 自定义分组输入框失去焦点
    inputChange() {
      if (this.groupItem.name !== null && this.groupItem.name !== "") {
        setTimeout(() => {
          this.groupItem.canAdd = true;
        }, 200);
      } else {
        setTimeout(() => {
          this.groupItem.canAdd = false;
        }, 200);
      }
    },
    // 保存分组名
    // saveGroup() {
    //     this.groupItem.loading = true;
    //     this.groupItem.success = false;
    //     this.groupItem.error = false;
    //     this.groupItem.canAdd = false;
    //     if (!this.groupItem.name || !this.groupItem.name.trim()) {
    //         this.groupItem.loading = false;
    //         return;
    //     }
    //     if (this.groupItem.name.trim().length > 10) {
    //         this.groupItem.loading = false;
    //         this.groupItem.error = true;
    //         this.$message.error('分组名称长度不能超过10');
    //         return;
    //     }
    //     this.groupItem.name = this.groupItem.name.trim();
    //     Api_SaveSuperviseGroup('', this.groupItem.name).then(res => {
    //         this.groupItem.loading = false;
    //         this.groupItem.success = true;
    //         this.$message.success('保存分组成功');
    //         // this.addGroupVisible = false;
    //         this.groupItem.name = '';
    //         this.getSuperviseGroupList();
    //     }).catch(e => {
    //         this.groupItem.loading = false;
    //         this.groupItem.error = true;
    //         this.$message.error(e);
    //     });
    // },
    beforeCloseDialog(done) {
      done();
      // this.addGroupVisible = false;
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
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-row {
  margin-bottom: 0;

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
