<template>
  <div>
    <h4 class="flex">
      <span class="flex-primary">裁判文书</span>
      <el-button size="mini" @click="openModal()" v-if="!isFxb ">新增</el-button>
    </h4>
    <el-row>
      <TableWrapper
        ref="table"
        :fetchDataFn="Api_GetRefereeInfoByPage"
        :query="listQuery"
        :columns="tableCol1"
      />
    </el-row>
    <Dialog
      :title="modelStatus === 'add' ? '新增': '修改'"
      :visible.sync="visible"
      :onOk="handleSure"
      width="500px"
      @close="onClose"
    >
      <el-form ref="form" :model="formData" :rules="formRules" label-width="6em" label-position="right">
        <el-form-item label="文书编号" prop="caseNo">
          <el-input v-model="formData.caseNo"></el-input>
        </el-form-item>
        <el-form-item label="标题" prop="caseName">
          <el-input v-model="formData.caseName"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="caseType">
          <el-input v-model="formData.caseType"></el-input>
        </el-form-item>
        <el-form-item label="执行法院" prop="court">
          <el-input v-model="formData.court"></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script type="text/jsx">
import {
  Api_GetRefereeInfoByPage,
  Api_RefereeAdd,
  Api_RefereeUpdate,
  Api_RefereeDelete
} from "@/api/creditManagement/customerProfile/customerManagemCustomer/judicialInfo";

export default {
  name: "Comp1",
  props: {
    companyName: String, // 客户名称
    isFxb:Boolean,
    isDelete:Boolean
  },
  data() {
    const createRules = this.$createRules;
    return {
      visible: false,
      modelStatus: "add",
      listQuery: {
        companyId: this.$route.query.id
      },
      tableCol1: [
        { key: "caseNo", label: "文书编号" },
        { key: "caseName", label: "标题" },
        { key: "caseType", label: "类型" },
        { key: "court", label: "执行法院" },
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
        companyId: this.$route.query.id,
        companyName: "",
        caseNo: "",
        caseName: "",
        caseType: "",
        court: ""
      },
      formRules: {
        caseNo: createRules({ msg: "文书编号", required: true }),
        caseName: createRules({ required: true, msg: "标题" }),
        court: createRules({ required: true, msg: "执行法院" })
      },
      detailData: {}
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    Api_GetRefereeInfoByPage,
    getList() {
      this.$refs.table.fetchData();
    },
    openModal(row) {
      if(this.isDelete){
        this.$alert('该企业不在您当前客户列表，请重新加入','提示', {
          confirmButtonText: '确定',
          type: 'warning'
        });
        return 
    }
      this.visible = true;
      this.$nextTick(() => {
        if (!row) {
          this.detailData = {};
          this.modelStatus = "add";
        } else {
          this.detailData = { ...row };
          this.modelStatus = "update";
          Object.keys(this.formData).forEach(key => {
            if (key === "publicationDate") {
              this.formData[key] = this.$dateFormat(row[key]);
            } else {
              this.formData[key] = row[key];
            }
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
          companyName: this.companyName,
          saasCode: this.$store.getters.saasCode
        };
        const loading = this.$openLoading();
        const promiseRes = !id
          ? Api_RefereeAdd(this.formData.companyId, postData)
          : Api_RefereeUpdate(id, this.formData.companyId, {
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
        Api_RefereeDelete(row.id, this.formData.companyId)
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
