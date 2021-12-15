<template>
  <Dialog ref="drawer" title="移出不良客户" :visible.sync="visible" :onOk="handleRemove" width="500px">
    <el-form ref="form" :model="form" label-width="80px">
      <!-- <el-form-item label="客户编码">{{ customerNo }}</el-form-item> -->
      <el-form-item label="客户名称">{{ companyName }}</el-form-item>
      <el-form-item label="列入原因">{{ lryy||'-' }}</el-form-item>
      <el-form-item label="限制措施">{{ xzcs||'-' }}</el-form-item>
      <el-form-item label="申请理由" prop="remark" :rules="$createRules({msg:'申请理由',required:true,max:200})">
        <el-input v-model="form.remark" type="textarea" placeholder="请输入移出客户不良原因" />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script>
import { Api_customerRemove } from "@/api/creditManagement/customerProfile/customerBad.js";

export default {
  name: "BadCustomerRemove",
  data() {
    return {
      visible: false,
      id: "",
      // customerNo: '',
      lryy: null,
      xzcs: null,
      companyName: "",
      form: { remark: "" }
    };
  },
  mounted() {},
  methods: {
    open(row) {
      this.form = { remark: "" };
      this.id = row.id;
      // this.customerNo = row.customerNo;
      this.lryy = row.badType;
      this.xzcs = (row.isCredit ? ["停止赊销"] : [])
        .concat(row.isSend ? ["停止发货"] : [])
        .concat(row.isWork ? ["停止签约"] : [])
        .join(",");
      this.companyName = row.companyName;
      this.visible = true;
    },
    handleRemove() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const loading = this.$openLoading();
          Api_customerRemove(this.id, this.form)
            .then(data => {
              loading.close();
              this.$message.success({
                  dangerouslyUseHTMLString: true,
                  message: data,
              });
              this.visible = false;
              this.$emit("getList");
            })
            .catch(data => {
              loading.close();
              console.log(data);
            });
        }
      });
    },
    closeDialog() {
      this.visible = false;
    }
  }
};
</script>

<style scoped>
</style>
