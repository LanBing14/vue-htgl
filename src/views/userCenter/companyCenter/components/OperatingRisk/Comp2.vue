<template>
  <div>
    <h4 class="flex">
      <span class="flex-primary">股权出质信息</span>
      <el-button size="mini" @click="openModal()" v-if="!isFxb">新增</el-button>
    </h4>
    <el-row>
      <TableWrapper
        ref="table"
        :fetchDataFn="Api_CustomerArchivesPledgeInfo"
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
        <el-form-item label="登记编号" prop="registerNo">
          <el-input v-model="formData.registerNo"></el-input>
        </el-form-item>
        <el-form-item label="出质人" prop="pledgor">
          <el-input v-model="formData.pledgor"></el-input>
        </el-form-item>
        <el-form-item label="出质股权数额" prop="pledgedAmount">
          <el-input v-model="formData.pledgedAmount"></el-input>
        </el-form-item>
        <el-form-item label="质权人" prop="pledgee">
          <el-input v-model="formData.pledgee"></el-input>
        </el-form-item>
        <el-form-item label="证照/证件号码" prop="pledgeeNo">
          <el-input v-model="formData.pledgeeNo"></el-input>
        </el-form-item>
        <el-form-item label="登记日期" prop="regDate">
          <el-date-picker
            type="date"
            v-model="formData.regDate"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-input v-model="formData.status"></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script type="text/jsx">
import {
  Api_CustomerArchivesPledgeInfo,
  Api_CustomerArchivesPledgeAdd,
  Api_CustomerArchivesPledgeUpdate,
  Api_CustomerArchivesPledgeDelete
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
          key: "registerNo",
          label: "登记编号"
        },
        {
          key: "pledgor",
          label: "出质人"
        },
        {
          key: "pledgedAmount",
          label: "出质股权数额"
        },
        {
          key: "pledgee",
          label: "质权人"
        },
        {
          key: "pledgeeNo",
          label: "证照/证件号码"
        },
        {
          key: "regDate",
          label: "登记日期",
          render: (h, data) => {
            return this.$dateFormat(data);
          }
        },
        {
          key: "status",
          label: "状态"
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
        registerNo: "",
        pledgor: "",
        pledgedAmount: "",
        pledgee: "",
        pledgeeNo: "",
        regDate: "",
        status: ""
      },
      formRules: {
        registerNo: createRules({
          msg: "登记编号",
          required: true
        }),
        pledgedAmount: createRules({
          msg: "出质股权数额",
          numberFloatUp: true
        })
      },
      detailData: {}
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    Api_CustomerArchivesPledgeInfo,
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
            if (key === "regDate") {
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
          ? Api_CustomerArchivesPledgeAdd(this.formData.companyId, postData)
          : Api_CustomerArchivesPledgeUpdate(id, this.formData.companyId, {
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
        Api_CustomerArchivesPledgeDelete(row.id, this.formData.companyId)
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
