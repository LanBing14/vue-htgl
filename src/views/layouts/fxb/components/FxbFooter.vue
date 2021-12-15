<template>
  <el-row class="fxb-footer">
    <span>
      版权归
      <a href="https://www.udatech.com/" target="_blank">江苏未至科技股份有限公司</a> 所有&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </span>
    <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">
      <span>苏ICP备 15011632号-1</span>
    </a>
    <span>增值电信业务经营许可证 :&nbsp;苏B2-20150010</span>
    <span>
      &nbsp;
      <router-link to="/about" class="nav-link">联系我们</router-link>&nbsp;
    </span>
  </el-row>
</template>

<script>
export default {
  name: "FxbFooter",
};
</script>

<style scoped lang="scss">
.fxb-footer {
  color: #abb7c5;
  height: 60px;
  line-height: 60px;
  font-size: 13px;
  text-align: center;
  background-color: #2c4159;

  & > a,
  & > span {
    display: inline-block;
    margin: 0 6px;
  }
}

.fxb-footer-2 {
  line-height: 35px;
  height: 35px;
  text-align: left;
  padding-left: 20px;
}
</style>
