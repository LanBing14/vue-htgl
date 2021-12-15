<template>
  <div>
    <h4 class="flex">
      <span class="flex-primary">工商变更记录</span>
      <el-button v-if="!isFxb " size="mini" @click="openModal()">新增</el-button>
    </h4>
    <el-row>
      <TableWrapper
        ref="table"
        :fetchDataFn="Api_CustomerArchivesGetChangeRecords"
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
      <el-form ref="form" :model="formData" :rules="formRules" label-width="7em" label-position="right">
        <el-form-item label="变更事项" prop="projectName">
          <el-input v-model="formData.projectName"></el-input>
        </el-form-item>
        <el-form-item label="变更前内容" prop="beforeContent">
          <el-input v-model="formData.beforeContent" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="变更后内容" prop="afterContent">
          <el-input v-model="formData.afterContent" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="变更日期" prop="changeDate">
          <el-date-picker
            type="date"
            v-model="formData.changeDate"
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
  Api_CustomerArchivesGetChangeRecords,
  Api_CustomerArchivesChangeRecordsAdd,
  Api_CustomerArchivesChangeRecordsUpdate,
  Api_CustomerArchivesChangeRecordsDelete
} from "@/api/creditManagement/customerProfile/customerManagemCustomer/baseInfo";

export default {
  name: "Comp2",
  props: {
    baseInfo: {
      type: Object,
      default: () => ({})
    },
    isFxb :Boolean,
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
      // 股东及出资方
      tableCol1: [
        {
          label: "变更事项",
          key: "projectName"
        },
        {
          label: "变更后内容",
          key: "beforeContent"
        },
        {
          label: "变更后内容",
          key: "afterContent"
        },
        {
          label: "变更日期",
          key: "changeDate",
          width: 120
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
        companyId: this.$route.query.id,
        companyName: "",
        projectName: "",
        beforeContent: "",
        afterContent: "",
        changeDate: ""
      },
      formRules: {
        name: createRules({
          msg: "变更事项",
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
    Api_CustomerArchivesGetChangeRecords,
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
          ? Api_CustomerArchivesChangeRecordsAdd(this.formData.companyId, postData)
          : Api_CustomerArchivesChangeRecordsUpdate(id, this.formData.companyId, {
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
        Api_CustomerArchivesChangeRecordsDelete(row.id, this.formData.companyId)
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
