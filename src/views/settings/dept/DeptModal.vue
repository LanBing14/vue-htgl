<template>
  <Dialog
    ref="drawer"
    :visible.sync="visible"
    :title="modelStatus?'新增部门':'修改部门'"
    :onOk="handleSure"
    width="500px"
    class="size-btn-change"
    @close="onClose"
  >
    <el-form ref="form" :rules="formRules" :model="formData" label-position="right" label-width="8em">
      <el-form-item v-if="this.parentData.label" label="父级部门">{{ getParentName() }}</el-form-item>
      <el-form-item label="部门名称" prop="name">
        <el-input prop="name" v-model="formData.name" placeholder="请输入子部门名称" />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script>
import { Api_DepartmentsAdd, Api_DepartmentsUpdate } from "@/api/settings/dept";

export default {
  name: "Dept",
  props: {
    modelStatus: {
      type: Boolean,
      default: true,
    },
    selectData: {
      type: Object,
      default: () => ({}),
    },
    parentData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      formData: {
        name: "",
        pid: "",
      },
      formRules: {
        name: [
          {
            required: true,
            max: 20,
            message: "部门名称必填，且不能超过20个字符",
          },
        ],
      },
      visible: false,
    };
  },
  methods: {
    openModel() {
      this.visible = true;
      this.$nextTick(() => {
        if (!this.modelStatus) {
          this.formData.pid = this.selectData.pid;
          this.formData.name = this.selectData.label;
        } else {
        }
      });
    },
    handleSure() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const { modelStatus } = this; // add新增，update修改
          const {
            id,
            attributes: { version },
          } = this.selectData;
          const postData = this.formData;
          const promiseRes = modelStatus
            ? Api_DepartmentsAdd({
                ...postData,
                pid: this.selectData.id,
              })
            : Api_DepartmentsUpdate(id, {
                ...postData,
                version,
                pid: this.selectData.pid,
              });
          const loading = this.$openLoading();
          promiseRes
            .then((msg) => {
              this.visible = false;
              this.onClose();
              this.$message.success(msg);
              this.$emit("getList");
              loading.close();
            })
            .catch((e) => {
              loading.close();
              this.$message.error(e);
            });
        }
      });
    },
    getParentName() {
      if (this.modelStatus) {
        return this.selectData.label;
      } else {
        return this.parentData.label;
      }
    },
    onClose() {
      this.$refs["form"].resetFields();
    },
  },
};
</script>

<style scoped>
</style>
