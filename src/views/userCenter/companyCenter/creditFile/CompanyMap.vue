<template>
  <el-row class="credit-tab-content">
    <!-- <ul class="credit-tab">
      <router-link tag="li" :to="'/creditFile/companyMap/qiYe?id='+companyId">企业图谱</router-link>
      <router-link tag="li" :to="'/creditFile/companyMap/guanLian?id='+companyId">关联链图</router-link>
      <router-link tag="li" :to="'/creditFile/companyMap/guQuan?id='+companyId">股权结构</router-link>
      <router-link tag="li" :to="'/creditFile/companyMap/beneficiaryShareholders?id='+companyId">受益股东</router-link>
    </ul> -->
    <router-view name="creditMap" />
  </el-row>
</template>

<script>
import QiYe from "./map/QiYe";
import GuanLian from "./map/GuanLian";
import GuQuan from "./map/GuQuan";
import BeneficiaryShareholders from "./map/BeneficiaryShareholders";

export default {
  name: "CompanyMap",
  components: {
    QiYe,
    GuanLian,
    GuQuan,
    BeneficiaryShareholders
  },
  data() {
    return {
      activeName: "first",
      companyId: ""
    };
  },
  mounted() {
    this.companyId = this.$route.query.id;
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
