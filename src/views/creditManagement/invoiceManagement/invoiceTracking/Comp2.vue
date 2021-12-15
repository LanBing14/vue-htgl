<template>
  <Dialog ref="drawer" title="打回发票登记信息" :visible.sync="visible" :close="closeDialog">
    <el-form ref="form" :model="form" label-width="110px">
      <el-form-item label="发票抬头">{{ form.invoice }}</el-form-item>
      <el-form-item label="税号">{{ form.taxId }}</el-form-item>
      <el-form-item label="发票类型">{{ form.invoiceType === '0' ? '增值税普通发票' : '增值税专用发票' }}</el-form-item>
      <el-form-item label="发票号码">{{ form.invoiceCode }}</el-form-item>
      <el-form-item label="申请开票金额">{{ form.applyContractMoney }}元</el-form-item>
      <el-form-item label="开票日期">{{ $dateFormat(form.invoiceDate, 'yyyy-MM-dd') }}</el-form-item>
      <el-form-item label="附件上传">
        <span style="cursor: pointer;color: #00BFF3" @click="checkFiles(form.invoiceRegisterFileUrls)">查看附件</span>
      </el-form-item>
      <el-form-item label="备注">{{ form.remark }}</el-form-item>
    </el-form>
    <div class="demo-image__preview" style="position: fixed; top: -200px; left: -200px;">
      <el-image
        ref="ref_Img"
        style="width: 100px; height: 100px"
        :src="srcList[0]"
        :preview-src-list="srcList"
      ></el-image>
    </div>
  </Dialog>
</template>

<script>
export default {
  name: "Comp2",
  data() {
    return {
      visible: false,
      form: {
        invoice: "",
        taxId: "",
        invoiceType: "",
        invoiceCode: "",
        applyContractMoney: "",
        invoiceDate: "",
        invoiceRegisterFileUrls: [],
        remark: "",
      },
      srcList: [],
    };
  },
  methods: {
    open(row) {
      this.form.invoice = row.invoice;
      this.form.taxId = row.taxId;
      this.form.invoiceType = row.invoiceType;
      this.form.invoiceCode = row.invoiceCode;
      this.form.applyContractMoney = row.applyContractMoney;
      this.form.invoiceDate = row.invoiceDate;
      this.form.invoiceRegisterFileUrls = row.attachment;
      this.form.remark = row.remark;
      this.visible = true;
    },
    checkFiles(row) {
      if (!row || !row.length) {
        this.$message.error("没有上传图片！");
        return false;
      }
      this.srcList = row.map((item) => process.env.VUE_APP_FILE_API + item.url);
      this.$nextTick(() => {
        this.$refs.ref_Img.clickHandler();
      });
    },
    closeDialog() {
      this.visible = false;
    },
  },
};
</script>

<style scoped>
</style>
