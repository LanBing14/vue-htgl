<template>
  <div>
    <Dialog title="选择收货地址" class="size-btn-change" :visible.sync="visible" :onOk="handleSure" width="500px" :close="closeDialog">
      <el-form>
        <el-radio-group v-model="form.radio" style="width: 100%">
          <div v-for="item in radioList" :key="item.id" class="choose-dialog-container">
            <el-row>
              <el-col :span="3" style="text-align: center;padding-top:23px;">
                <el-radio :label="item.id"></el-radio>
              </el-col>
              <el-col :span="21" style="padding: 15px 0 10px;">
                <div class="choose-dialog-text">
                  <el-form-item>{{ item.receiverName }} &nbsp;&nbsp; {{ item.receiverPhone }}</el-form-item>
                  <el-form-item label="地址">{{ item.province + item.city + item.county +item.detailAddress }}</el-form-item>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-radio-group>
      </el-form>
      <div class="canClick" style="text-align: center" @click="openNewBill">+ 添加收货地址</div>
    </Dialog>
    <NewAdress ref="ref_NewAdress" @getList="getList"></NewAdress>
  </div>
</template>

<script>
import { Api_GetInvoiceTitle } from "@/api/creditManagement/invoice/invoice.js";
import { Api_ReceiverGetList } from "@/api/creditManagement/customerProfile/customerManagemCustomer/OtherInformation.js";
import NewAdress from "@/views/creditManagement/customerProfile/customerManagement/components/OtherComponents/NewAdress";

export default {
  name: "Title",
  components: { NewAdress },
  data() {
    return {
      companyId: "",
      companyName: "",
      visible: false,
      form: {
        invoice: "",
        radio: "",
      },
      radioList: [],
    };
  },
  computed: {
    userInfo() {
      return this.$store.getters.userInfo;
    },
  },
  methods: {
    open(companyId, companyName) {
      this.companyId = companyId;
      this.companyName = companyName;
      this.getList();
      this.visible = true;
    },
    getList() {
      Api_ReceiverGetList({
        companyId: this.companyId,
      })
        .then((res) => {
          this.radioList = res.data;
        })
        .catch((res) => {
          this.$message.error(res);
        });
    },
    openNewBill() {
      const { userInfo } = this;
      this.$refs.ref_NewAdress.open("add", this.companyId, this.companyName);
    },
    handleSure() {
      if (this.form.radio) {
        const findRes = this.radioList.find((item) => item.id === this.form.radio);
        const addressText = findRes.province + findRes.city + findRes.county + findRes.detailAddress;
        this.$emit("getInfo", findRes.id, addressText);
        this.visible = false;
      } else {
        this.$message.warning("请选择一个收货地址");
      }
    },
    closeDialog() {
      this.visible = false;
      this.form.radio = "";
    },
  },
};
</script>

<style scoped lang="scss">
/deep/ .el-radio__label {
  display: none;
}
</style>
