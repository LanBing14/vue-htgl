<template>
  <div>
    <h4 class="flex">
      <span class="flex-primary">行政处罚信息</span>
      <el-button size="mini" @click="openModal()" v-if="!isFxb">新增</el-button>
    </h4>
    <el-row>
      <TableWrapper
        ref="table"
        :fetchDataFn="Api_CustomerArchivesPenaltyInfo"
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
      <el-form ref="form" :model="formData" :rules="formRules" label-width="8em" label-position="right">
        <el-form-item label="决定文书号" prop="docNo">
          <el-input v-model="formData.docNo"></el-input>
        </el-form-item>
        <el-form-item label="违法行为类型" prop="penaltyType">
          <el-input v-model="formData.penaltyType"></el-input>
        </el-form-item>
        <el-form-item label="行政处罚内容" prop="content">
          <el-input v-model="formData.content"></el-input>
        </el-form-item>
        <el-form-item label="决定单位" prop="officeName">
          <el-input v-model="formData.officeName"></el-input>
        </el-form-item>
        <el-form-item label="决定日期" prop="penaltyDate">
          <el-date-picker
            type="date"
            v-model="formData.penaltyDate"
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
  Api_CustomerArchivesPenaltyInfo,
  Api_CustomerArchivesPenaltyAdd,
  Api_CustomerArchivesPenaltyUpdate,
  Api_CustomerArchivesPenaltyDelete
} from "@/api/creditManagement/customerProfile/customerManagemCustomer/operatingRisk";

export default {
  name: "Comp1",
  props: {
    companyName: String , // 客户名称
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
        {
          key: "docNo",
          label: "决定文书号"
        },
        {
          key: "penaltyType",
          label: "违法行为类型"
        },
        {
          key: "content",
          label: "行政处罚内容"
        },
        {
          key: "officeName",
          label: "决定单位"
        },
        {
          key: "penaltyDate",
          label: "决定日期",
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
        companyId: this.$route.query.id,
        companyName: "",
        docNo: "",
        penaltyType: "",
        content: "",
        officeName: "",
        penaltyDate: ""
      },
      formRules: {
        docNo: createRules({
          msg: "决定文书号",
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
    Api_CustomerArchivesPenaltyInfo,
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
            if (key === "penaltyDate") {
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
          ? Api_CustomerArchivesPenaltyAdd(this.formData.companyId, postData)
          : Api_CustomerArchivesPenaltyUpdate(id, this.formData.companyId, {
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
        Api_CustomerArchivesPenaltyDelete(row.id, this.formData.companyId)
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
