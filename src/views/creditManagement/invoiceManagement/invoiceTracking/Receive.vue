<template>
  <Dialog
    ref="drawer"
    title="发票领取"
    :visible.sync="visible"
    :onOk="handleSure"
    width="500px"
    :close="closeDialog"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="110px">
      <el-form-item label="发票领取" prop="isReceive">
        <el-radio-group v-model="form.isReceive">
          <el-radio label="1">已领取发票</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="领取日期" prop="invoiceDate">
        <el-date-picker
          v-model="form.invoiceDate"
          value-format="yyyy-MM-dd"
          type="date"
          :picker-options="setEffectiveDate"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="领取备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入领取备注信息"></el-input>
      </el-form-item>
      <el-form-item label="快递公司" prop="expressCompany">
        <el-input v-model="form.expressCompany" placeholder="请输入快递公司"></el-input>
      </el-form-item>
      <el-form-item label="快递单号" prop="expressCode">
        <el-input v-model="form.expressCode" placeholder="请输入快递单号"></el-input>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script>
import { Api_invoiceReceive } from "@/api/creditManagement/invoice/invoiceTracking.js";

export default {
  name: "Receive",
  data() {
    return {
      visible: false,
      form: {
        invoiceId: "",
        remark: "",
        invoiceDate: this.$dateFormat(new Date(), "yyyy-MM-dd"),
        isReceive: "1",
        expressCompany: "",
        expressCode: "",
      },
      // 设置生效日期范围
      setEffectiveDate: {
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 1000 * 60 * 60 * 24;
        },
      },
      rules: {
        isReceive: [
          {
            required: true,
            message: "必填",
          },
        ],
        invoiceDate: [
          {
            required: true,
            message: "领取日期必填",
          },
        ],
        remark: [
          {
            max: 200,
            message: "不超过200字",
          },
        ],
        expressCompany: [
          {
            max: 20,
            message: "不超过20字",
          },
        ],
        expressCode: [
          {
            max: 20,
            message: "不超过20字",
          },
        ],
      },
    };
  },
  methods: {
    open(_row) {
      this.form.invoiceId = _row.id;
      this.visible = true;
    },
    handleSure() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const loading = this.$openLoading();
          Api_invoiceReceive(this.form)
            .then((res) => {
              this.$message.success(res);
              loading.close();
              this.visible = false;
              this.$emit("back");
            })
            .catch((res) => {
              this.$message.error(res);
              loading.close();
            });
        }
      });
    },
    closeDialog() {
      this.visible = false;
    },
    checkFiles(row) {
      if (!row || !row.length) {
        this.$message.error("没有上传图片！");
        return false;
      }
      this.srcList = row.map((item) => process.env.VUE_APP_FILE_API + item.url);
      this.$refs.ref_Img.clickHandler();
    },
  },
};
</script>

<style scoped>
</style>
