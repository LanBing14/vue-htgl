<template>
  <div>
    <h4 class="flex">
      <span class="flex-primary">分支机构</span>
      <el-button size="mini" @click="openModal()" v-if="!isFxb">新增</el-button>
    </h4>
    <el-row>
      <TableWrapper
        ref="table"
        :fetchDataFn="Api_CustomerArchivesGetBranches"
        :query="listQuery"
        :columns="tableCol1"
      />
    </el-row>
    <Dialog
      :title="modelStatus === 'add' ? '新增': '修改'"
      :visible.sync="visible"
      :onOk="handleSure"
      width="500px"
       append-to-body
      @close="onClose"
    >
      <el-form ref="form" :model="formData" :rules="formRules" label-width="12.5em" label-position="right">
        <el-form-item label="分支机构名称" prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="operName">
          <el-input v-model="formData.operName"></el-input>
        </el-form-item>
        <el-form-item label="统一社会信用代码（注册号）" prop="regNo">
          <el-input v-model="formData.regNo"></el-input>
        </el-form-item>
        <el-form-item label="注册机关" prop="belongOrg">
          <el-input v-model="formData.belongOrg"></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script type="text/jsx">
import {
  Api_CustomerArchivesGetBranches,
  Api_CustomerArchivesBranchesAdd,
  Api_CustomerArchivesBranchesUpdate,
  Api_CustomerArchivesBranchesDelete
} from "@/api/creditManagement/customerProfile/customerManagemCustomer/baseInfo";

export default {
  name: "Comp2",
  props: {
    baseInfo: {
      type: Object,
      default: () => ({})
    },
    isFxb:Boolean
  },
  data() {
    const createRules = this.$createRules;
    return {
      visible: false,
      modelStatus: "add",
      listQuery: {
        companyId: this.$store.getters.userInfo.companyId
      },
      // 股东及出资方
      tableCol1: [
        {
          label: "分支机构名称",
          key: "name"
        },
        {
          label: "负责人",
          key: "operName"
        },
        {
          label: "统一社会信用代码(注册号)",
          key: "regNo"
        },
        {
          label: "注册机关",
          key: "belongOrg"
        },
        {
          label: "操作",
          key: null,
          render: (h, data, row) => {
              return !this.isFxb ? [<el-link type="primary" onClick={this.openModal.bind(this, row)}> 编辑 </el-link>,
                  <el-link type="primary" onClick={this.handleDelete.bind(this, row)}> 删除 </el-link>
              ] : ""
          }
        }
      ],
      formData: {
        companyId: this.$store.getters.userInfo.companyId,
        companyName:'',
        name: "",
        operName: "",
        regNo: "",
        belongOrg: ""
      },
      formRules: {
        name: createRules({
          msg: "分支机构名称",
          required: true
        })
      },
      detailData: {}
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    Api_CustomerArchivesGetBranches,
    getList() {
      this.$refs.table.fetchData();
    },
    openModal(row) {
      this.visible = true;
      this.$nextTick(() => {
        if (!row) {
          this.detailData = {};
          this.modelStatus = "add";
        } else {
          this.detailData = { ...row };
          this.modelStatus = "update";
          Object.keys(this.formData).forEach(key => {
            this.formData[key] = row[key];
          });
        }
      });
    },
    handleSure() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        const id = this.detailData.id;
        const postData = {
          ...this.formData,
          companyName: this.baseInfo.companyName,
          saasCode: this.$store.getters.saasCode
        };
        const loading = this.$openLoading();
        const promiseRes = !id
          ? Api_CustomerArchivesBranchesAdd(this.formData.companyId, postData)
          : Api_CustomerArchivesBranchesUpdate(id, this.formData.companyId, {
              ...postData,
              version: this.detailData.version
            });
        promiseRes
          .then(res => {
            loading.close();
            this.getList();
            this.visible = false;
            this.$message.success(res);
            this.onClose();
          })
          .catch(e => {
            loading.close();
            this.$message.error(e);
          });
      });
    },
    handleDelete(row) {
      this.$confirm("确认删除？", "提示", {
        type: "warning"
      }).then(() => {
        const loading = this.$openLoading();
        Api_CustomerArchivesBranchesDelete(row.id, this.formData.companyId)
          .then(res => {
            loading.close();
            this.getList();
            this.$message.success(res);
          })
          .catch(e => {
            loading.close();
            this.$message.error(e);
          });
      });
    },
    onClose() {
      this.$refs.form.resetFields();
    }
  }
};
</script>

<style scoped>
</style>
