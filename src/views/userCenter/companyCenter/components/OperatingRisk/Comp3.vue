<template>
  <div>
    <h4 class="flex">
      <span class="flex-primary">工商经营异常名录</span>
      <el-button size="mini" @click="openModal()" v-if="!isFxb">新增</el-button>
    </h4>
    <el-row>
      <TableWrapper
        ref="table"
        :fetchDataFn="Api_CustomerArchivesOpexceptionInfo"
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
        <el-form-item label="列入经营异常名录原因" prop="addReason">
          <el-input v-model="formData.addReason" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="列入日期" prop="addDate">
          <el-date-picker
            type="date"
            v-model="formData.addDate"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="移出经营异常原因" prop="romoveReason">
          <el-input v-model="formData.romoveReason" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="移出日期" prop="removeDate">
          <el-date-picker
            type="date"
            v-model="formData.removeDate"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="作出决定机关" prop="decisionOffice">
          <el-input v-model="formData.decisionOffice" type="textarea"></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script type="text/jsx">
import {
  Api_CustomerArchivesOpexceptionInfo,
  Api_CustomerArchivesOpexceptionAdd,
  Api_CustomerArchivesOpexceptionUpdate,
  Api_CustomerArchivesOpexceptionDelete
} from "@/api/creditManagement/customerProfile/customerManagemCustomer/operatingRisk";

export default {
  name: "Comp1",
  props: {
    companyName: String,
    isFxb: Boolean
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
          key: "addReason",
          label: "列入异常名录原因"
        },
        {
          key: "addDate",
          label: "列入日期",
          render: (h, data) => {
            return this.$dateFormat(data);
          }
        },
        {
          key: "romoveReason",
          label: "移出经营异常原因"
        },
        {
          key: "removeDate",
          label: "移出日期",
          render: (h, data) => {
            return this.$dateFormat(data);
          }
        },
        {
          key: "decisionOffice",
          label: "做出决定单位"
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
        companyName: "",
        addReason: "",
        addDate: "",
        romoveReason: "",
        removeDate: "",
        decisionOffice: ""
      },
      formRules: {
        decisionOffice: createRules({
          msg: "作出决定机关",
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
    Api_CustomerArchivesOpexceptionInfo,
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
            if (key === "addDate" || key === "removeDate") {
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
          companyName: this.formData.companyName,
          saasCode: this.$store.getters.saasCode
        };
        const loading = this.$openLoading();
        const promiseRes = !id
          ? Api_CustomerArchivesOpexceptionAdd(this.formData.companyId, postData)
          : Api_CustomerArchivesOpexceptionUpdate(id, this.formData.companyId, {
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
        Api_CustomerArchivesOpexceptionDelete(row.id, this.formData.companyId)
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
