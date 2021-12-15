<template>
  <div class="contract-add-tab">
    <el-tabs @tab-click="handleTabClick" type="card" v-model="activeName">
      <el-tab-pane v-if="$route.params.groupType == 0" label="客户负责人" name="first">
        <CustomerLeader ref="customerleader" />
      </el-tab-pane>
      <el-tab-pane v-if="$route.params.groupType != 0" label="供应商负责人" name="first">
        <CustomerLeader ref="customerleader" />
      </el-tab-pane>
      <el-tab-pane label="联络信息" name="second">
        <ContactInfo ref="contactinfo" />
      </el-tab-pane>
      <el-tab-pane label="银行账户" name="third">
        <BankAccount ref="bankaccount" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import BankAccount from "./maintenance/BankAccount.vue";
import ContactInfo from "./maintenance/ContactInfo.vue";
import CustomerLeader from "./maintenance/CustomerLeader.vue";
// import OtherInfor from "./maintenance/OtherInfor.vue";
export default {
  name: "ContractAddTab",
  components: {
    BankAccount,
    ContactInfo,
    CustomerLeader
    // OtherInfor
  },
  props: {
    attentionid: String
  },
  data() {
    return {
      activeName: "first"
    };
  },
  mounted() {},
  methods: {
    handleTabClick(tab, event) {
      switch (tab.name) {
        case "first":
          this.$refs.customerleader.cusLeadGetlist({
            pageNo: 1,
            pageSize: 5
          });
          break;
        case "second":
          this.$refs.contactinfo.conInfoGetlist({
            pageNo: 1,
            pageSize: 5
          });
          break;
        case "third":
          this.$refs.bankaccount.bankAccGetlist({
            pageNo: 1,
            pageSize: 5
          });
          break;
      }
    }
  }
};
</script>

<style lang="scss">
.contract-add-tab {
  .el-tabs__nav-scroll {
    background-color: #f7f8fa;
  }

  .el-tabs__header {
    margin-left: 10px;
    margin-right: 10px;
  }

  .el-tabs--card > .el-tabs__header .el-tabs__nav,
  .el-tabs--card > .el-tabs__header .el-tabs__item {
    border: 0;
  }

  .el-tabs__item {
    height: 48px;
    padding: 0 30px;
    line-height: 48px;
    font-size: 16px;
    color: #333;
  }

  .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
    color: #fff;
    background-color: #1478f0;
  }

  .el-tabs__content {
    padding: 0;
  }
}
</style>
<style lang="scss" rel="stylesheet/scss" scoped>
</style>
