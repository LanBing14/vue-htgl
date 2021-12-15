<template>
  <div>
    <h4 class="flex">
      <span class="flex-primary">专利信息</span>
      <el-button size="mini" @click="openModal()" v-if="!isFxb ">新增</el-button>
    </h4>
    <el-row>
      <TableWrapper
        ref="table"
        :fetchDataFn="Api_GetPatentDetailByPage"
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
        <el-form-item label="专利名称" prop="title" :rules="$createRules({required:true,msg:'专利名称'})">
          <el-input v-model="formData.title"></el-input>
        </el-form-item>
        <el-form-item label="公示号" prop="publicationNumber">
          <el-input v-model="formData.publicationNumber"></el-input>
        </el-form-item>
        <el-form-item label="专利类型" prop="kindCodeDesc">
          <el-input v-model="formData.kindCodeDesc"></el-input>
        </el-form-item>
        <el-form-item label="公开日期" prop="publicationDate">
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
import { Api_GetPatentDetailByPage } from "@/api/creditManagement/customerProfile/customerManagemCustomer/knowledgePro";
import {
  Api_PatentDetailAdd,
  Api_PatentDetailUpdate,
  Api_PatentDetailDelete
} from "@/api/creditManagement/customerProfile/customerManagemCustomer/knowledgePro.js";

export default {
  name: "Comp1",
  props: {
    companyName: String, // 客户名称
    companyId: String,
    isFxb:Boolean,
    isDelete:Boolean
  },
  data() {
    const createRules = this.$createRules;
    return {
      visible: false,
      modelStatus: "add",
      listQuery: {
        companyId: this.companyId
      },
      tableCol1: [
        {
          key: "title",
          label: "专利名称"
        },
        {
          key: "publicationNumber",
          label: "公示号"
        },
        {
          key: "kindCodeDesc",
          label: "专利类型"
        },
        {
          key: "publicationDate",
          label: "公开日期",
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
        companyId: this.companyId,
        companyName: "",
        publicationDate: "",
        category: "",
        party: "",
        content: "",
        title: null,
        publicationNumber: null,
        kindCodeDesc: null,
        publicationDate: null
      },
      formRules: {
        party: createRules({
          msg: "当事人",
          required: true
        })
      },
      detailData: {}
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.listQuery.companyId = this.companyId;
      this.$nextTick(() => {
        this.getList();
      });
    });
  },
  methods: {
    Api_GetPatentDetailByPage,
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
          this.formData.title = row.title;
          this.formData.publicationNumber = row.publicationNumber;
          this.formData.kindCodeDesc = row.kindCodeDesc;
          this.formData.publicationDate = row.publicationDate;
          console.log(this.formData);
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
          ? Api_PatentDetailAdd(this.formData.companyId, postData)
          : Api_PatentDetailUpdate(id, this.formData.companyId, {
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
        Api_PatentDetailDelete(row.id, this.formData.companyId)
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
