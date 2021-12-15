<template>
  <div>
    <h4 class="flex">
      <span class="flex-primary">股东及出资方</span>
      <el-button size="mini" @click="openModal()" v-if="!isFxb">新增</el-button>
    </h4>
    <el-row>
      <TableWrapper
        ref="table"
        :fetchDataFn="Api_CustomerArchivesGetPartners"
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
      <el-form ref="form" :model="formData" :rules="formRules" label-width="120px" label-position="right">
        <el-form-item label="股东名称" prop="stockName">
          <el-input v-model="formData.stockName"></el-input>
        </el-form-item>
        <el-form-item label="出资额" prop="shouldCapi">
          <el-input v-model="formData.shouldCapi">
            <template slot="append">万元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="实缴额" prop="realCapi">
          <el-input v-model="formData.realCapi">
            <template slot="append">万元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="实缴出资日期" prop="capiDate">
          <el-date-picker
            type="date"
            v-model="formData.capiDate"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="比例" prop="stockPercent">
          <el-input v-model="formData.stockPercent">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="出资形式" prop="investName">
          <el-input v-model="formData.investName"></el-input>
        </el-form-item>
        <el-form-item label="证照号(企业代码/身份证)" prop="identifyNo">
          <el-input v-model="formData.identifyNo"></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script type="text/jsx">
import {
  Api_CustomerArchivesGetPartners,
  Api_CustomerArchivesPartnersAdd,
  Api_CustomerArchivesPartnersUpdate,
  Api_CustomerArchivesPartnersDelete
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
        { label: "股东名称", key: "stockName" },
        { label: "出资额(万元)", key: "shouldCapi" },
        { label: "实缴额(万元)", key: "realCapi" },
        { label: "实缴出资日期", key: "capiDate", width: 120 },
        { label: "比例", key: "stockPercent", width: 120 },
        { label: "出资形式", key: "investName" },
        { label: "证照号(企业代码/身份证)", key: "identifyNo" },
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
        stockName: "",
        shouldCapi: "",
        realCapi: "",
        capiDate: "",
        stockPercent: "",
        investName: "",
        identifyNo: ""
      },
      formRules: {
        stockName: createRules({ msg: "股东名称", required: true }),
        shouldCapi: createRules({ msg: "出资额", numberFloatUp: true }),
        realCapi: createRules({ msg: "实缴额", numberFloatUp: true }),
        stockPercent: createRules({ msg: "比例", numberFloatUp: true })
      },
      detailData: {}
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    Api_CustomerArchivesGetPartners,
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
            this.formData[key] = row[key]
              ? row[key].indexOf("%") !== -1
                ? row[key].replace("%", "")
                : row[key]
              : null;
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
          ? Api_CustomerArchivesPartnersAdd(this.formData.companyId, postData)
          : Api_CustomerArchivesPartnersUpdate(id, this.formData.companyId, {
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
        Api_CustomerArchivesPartnersDelete(row.id, this.formData.companyId)
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
