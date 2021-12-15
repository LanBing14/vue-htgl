<template>
<!--  <el-tabs v-model="activeName" class="my-tab">-->
<!--    <el-tab-pane label="自身动态" name="1">-->
<!--      <Main :searchName="defaultSearchName" type="0"></Main>-->
<!--    </el-tab-pane>-->
<!--    <el-tab-pane label="关联动态" name="2">-->
<!--      <Main type="1"></Main>-->
<!--    </el-tab-pane>-->
<!--  </el-tabs>-->

    <Main></Main>
</template>

<script>
import Main from "./Main";

export default {
  name: "CreditInfo",
  components: {
    Main
  },
  data() {
    const { name } = this.$route.query;
    return {
      activeName: "1",
      defaultSearchName: name
    };
  }
};
</script>

<style scoped>
</style>
