<template>
  <div class="usercenter-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="融资需求" name="needs">
        <FinancingNeeds />
      </el-tab-pane>
      <el-tab-pane label="金融产品申请" name="application">
        <ProductApplication />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import FinancingNeeds from "./FinancingNeeds.vue";
import ProductApplication from "./ProductApplication.vue";

export default {
  name: "FinancialService",
  components: {
    FinancingNeeds,
    ProductApplication
  },
  data() {
    return {
      activeName: "needs"
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
