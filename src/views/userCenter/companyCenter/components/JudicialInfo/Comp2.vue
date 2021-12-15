<template>
  <div>
    <h4 class="flex">
      <span class="flex-primary">失信被执行人</span>
      <el-button size="mini" @click="openModal()" v-if="!isFxb">新增</el-button>
    </h4>
    <el-row>
      <TableWrapper
        ref="table"
        :fetchDataFn="Api_GetBrokenPromiseInfoByPage"
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
      <el-form ref="form" :model="formData" :rules="formRules" label-width="10em" label-position="right">
        <el-form-item label="案号" prop="anno">
          <el-input v-model="formData.anno"></el-input>
        </el-form-item>
        <el-form-item label="被执行人的履行情况" prop="executeStatus">
          <el-input v-model="formData.executeStatus"></el-input>
        </el-form-item>
        <el-form-item label="法律文书确定的义务" prop="obligation">
          <el-input v-model="formData.obligation"></el-input>
        </el-form-item>
        <el-form-item label="执行法院" prop="court">
          <el-input v-model="formData.court"></el-input>
        </el-form-item>
        <el-form-item label="发布时间" prop="publicationDate">
          <el-date-picker
            type="date"
            v-model="formData.publicationDate"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script type="text/jsx">
import {
  Api_GetBrokenPromiseInfoByPage,
  Api_BrokenPromiseAdd,
  Api_BrokenPromiseUpdate,
  Api_BrokenPromiseDelete
} from "@/api/creditManagement/customerProfile/customerManagemCustomer/judicialInfo";

export default {
  name: "Comp1",
  props: {
    companyName: String ,
    isFxb: Boolean
  },
  data() {
    const createRules = this.$createRules;
    return {
      visible: false,
      modelStatus: "add",
      listQuery: {
        companyId: this.$store.getters.userInfo.companyId,
      },
      tableCol1: [
        { key: "anno", label: "案件编号" },
        { key: "executeStatus", label: "被执行人履行情况" },
        { key: "obligation", label: "法律文书确定的义务" },
        { key: "court", label: "执行法院" },
        {
          key: "publicationDate",
          label: "发布时间",
          render: (h, data) => {
            return this.$dateFormat(data);
          }
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
        companyId:this.$store.getters.userInfo.companyId,
        companyName:'',
        anno: "",
        executeStatus: "",
        obligation: "",
        court: "",
        publicationDate: ""
      },
      formRules: {
        anno: createRules({
          msg: "案号",
          required: true
        }),
        court: createRules({
          required: true,
          msg: "执行法院"
        })
      },
      detailData: {}
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    Api_GetBrokenPromiseInfoByPage,
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
          ? Api_BrokenPromiseAdd(this.formData.companyId, postData)
          : Api_BrokenPromiseUpdate(id, this.formData.companyId, {
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
        Api_BrokenPromiseDelete(row.id, this.formData.companyId)
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
