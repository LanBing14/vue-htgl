<template>
  <div class="my-tab">
    <el-tabs value="1">
      <el-tab-pane label="授信策略" name="1">
        <Tactics></Tactics>
      </el-tab-pane>
      <el-tab-pane label="现金折扣方案" name="2">
        <DiscountPlan></DiscountPlan>
      </el-tab-pane>
      <el-tab-pane label="信用检查规则" name="3">
        <CreditRule></CreditRule>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Tactics from "./Tactics";
import DiscountPlan from "./DiscountPlan";
import CreditRule from "./CreditRule";

export default {
  name: "creditPolicy",
  components: {
    Tactics,
    DiscountPlan,
    CreditRule
  }
};
</script>

<style scoped lang="scss">
</style>
