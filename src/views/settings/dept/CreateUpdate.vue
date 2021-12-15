<template>
  <Dialog
    ref="drawer"
    :visible.sync="visible"
    :title="modelStatus | filterTitle"
    :onOk="handleSure"
    width="500px"
    class="size-btn-change"
    @close="onClose"
  >
    <el-form ref="form" :rules="addFormRules" :model="addFormData" label-position="right" label-width="6em">
      <el-form-item label="账号" prop="username">
        <el-input v-model="addFormData.username" :disabled="modelStatus!=='add'" placeholder="请输入员工账号" />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="addFormData.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentId">
        <el-tree
          ref="depTree"
          :data="depList"
          :default-checked-keys="[addFormData.departmentId]"
          show-checkbox
          check-strictly
          default-expand-all
          node-key="id"
          @check="handleCheckChange"
        />
      </el-form-item>
      <el-form-item label="职务" prop="roleIds">
        <el-select v-model="addFormData.roleIds" multiple placeholder="请选择" filterable style="width: 100%;">
          <el-option v-for="item in rolesList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="addFormData.mobile" placeholder="请输入手机号码" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addFormData.email" placeholder="请输入邮箱" />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script>
import {
  Api_DepartmentsFetchTreeParent,
  Api_UserDetail,
  Api_UserAdd,
  Api_UserUpdate,
} from "@/api/settings/dept";
import { Api_RolesCombobox } from "@/api/baseApi.js";

export default {
  name: "CreateUpdate",
  filters: {
    filterTitle(val) {
      if (val === "add") {
        return "添加成员";
      } else if (val === "update") {
        return "修改成员";
      }
    },
  },
  props: {
    modelStatus: { type: String, default: "" },
    selectData: {
      type: Object,
      default() {
        return {};
      },
    },
    treeId: String,
  },
  data() {
    const createRules = this.$createRules;
    return {
      visible: false,
      addFormRules: {
        username: createRules({ msg: "账号", required: true }),
        name: createRules({ msg: "姓名", required: true, max: 10 }),
        mobile: createRules({ msg: "手机号码", required: true, mobile: true }),
        departmentId: createRules({ msg: "部门", required: true }),
        // roleIds: createRules({ msg: "角色", required: true }, 'change','array'),
        roleIds: [
          {
            required: true,
            message: "角色必填",
            type: "array",
          },
        ],
        position: createRules({ msg: "职务", required: true }),
        email: createRules({ msg: "邮箱", required: true, email: true }),
      },
      addFormData: {
        // 新增用户的表单数据
        username: "",
        name: "",
        mobile: "",
        departmentId: "",
        roleIds: [],
        position: "",
        email: "",
      },
      depList: [], // 部门树列表
      rolesList: [], // 角色列表
      difRolesSave: [], // 接口数据中不需要在页面上展示的数据，但在传参时要传递
    };
  },
  computed: {
    isView() {
      return this.modelStatus === "view";
    },
  },
  created() {
    this.getRolesList();
  },
  methods: {
    // 打开模态框
    openModel(id) {
      this.getDepList();
      if (id) {
        this.getDetail(id);
      } else {
        this.visible = true;
        this.addFormData.departmentId = this.treeId;
      }
    },
    // 获取部门树列表
    getDepList() {
      Api_DepartmentsFetchTreeParent().then((res) => {
        this.depList = res;
      });
    },
    // 获取角色列表
    getRolesList() {
      Api_RolesCombobox({ saasCode: "super", isFront: true }).then((res) => {
        this.rolesList = res;
      });
    },
    // 获取单个角色信息
    getDetail(id) {
      const loading = this.$openLoading();
      Api_UserDetail(id)
        .then((res) => {
          this.visible = true;
          this.addFormData.username = res.username;
          this.addFormData.name = res.name;
          this.addFormData.mobile = res.mobile;
          this.addFormData.departmentId = res.departmentId;
          const { roleIds } = res;
          const dif = [];
          roleIds.forEach((r, index) => {
            const f = this.rolesList.find((i) => i.value === r);
            if (!f) {
              dif.push(r);
              roleIds.splice(index, 1);
            }
          });
          this.difRolesSave = dif;
          this.addFormData.roleIds = roleIds;
          this.addFormData.position = res.position;
          this.addFormData.email = res.email;
          this.visible = true;
          loading.close();
        })
        .catch(() => {
          loading.close();
        });
    },
    // 点击确认
    handleSure() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const { modelStatus } = this; // add新增，update修改
          const { id, version } = this.selectData;
          const postData = {
            ...this.addFormData,
            roleIds: [...this.addFormData.roleIds, ...this.difRolesSave].join(","),
          };
          const loading = this.$openLoading();
          const promiseRes =
            modelStatus === "add"
              ? Api_UserAdd(postData)
              : Api_UserUpdate(id, {
                  ...postData,
                  version,
                });
          promiseRes
            .then((msg) => {
              if (modelStatus === "add") {
                this.$alert(
                  `员工[${this.addFormData.name}]账号添加成功，账号：[${this.addFormData.username}]，初始密码：abcd.1234，请知悉。`
                );
              }
              this.$emit("getList");
              this.onClose();
              this.visible = false;
              this.$message.success(msg);
              loading.close();
            })
            .catch((e) => {
              loading.close();
              this.$message.error(e);
            });
        }
      });
    },
    // 部门树的选择事件
    handleCheckChange(node) {
      this.addFormData.departmentId = node.id;
      this.$refs.depTree.setCheckedKeys([node.id]);
      this.$nextTick(() => {
        this.$refs.form.validateField("departmentId");
      });
    },
    onClose() {
      this.$refs["form"].resetFields();
      Object.keys(this.addFormData).forEach((key) => {
        this.addFormData[key] = key === "roleIds" ? [] : "";
      });
      this.$refs.depTree.setCheckedKeys([]);
    },
    filterDeptId(arr = this.depList) {
      let f = "";
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === this.addFormData.departmentId) {
          f = arr[i].label;
          break;
        }
        if (arr[i].children) {
          f = this.filterDeptId(arr[i].children);
        }
      }
      return f;
    },
    filteroleIds(ids) {
      if (!ids) {
        return "";
      }
      const names = ids.map((id) => {
        const findRes = this.rolesList.find((r) => r.value === id);
        return findRes ? findRes.label : "";
      });
      // for (let i = 0; i < ids.length; i++) {
      //     for (let j = 0; j < this.rolesList.length; j++) {
      //         this.rolesList[j].id === ids[i] && names.push(this.rolesList[j].name);
      //     }
      // }
      // console.log(ids, this.rolesList);
      return names.join("、");
    },
  },
};
</script>

<style scoped>
</style>
