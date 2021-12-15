<template>
  <div class="breadcrumb">
     <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item v-for="(route,index) in routes" :key="index" 
     @click.native ="linkTo(route,index)"
    >{{route.labelText}}</el-breadcrumb-item>
  </el-breadcrumb>
   <div class="btns"><slot></slot></div>
  </div>
</template>
<script>
export default {
  props: {
    routes:{
      type: Array
    }
  },
  methods: {
    linkTo(route, params = {}) {
      this.$router.push({
        name: route.pathName,
        params: route.params ? route.params : {}
      });
    }
  },
};
</script>
<style lang="scss" scoped>
/*.breadcrumb{*/
   /*@include flexContainer(between);*/
/*}*/
 /deep/.el-breadcrumb__item{
   cursor: pointer;
 }
  /deep/.el-breadcrumb__item:last-child{
    cursor: default;
  }
  /deep/ .el-breadcrumb__inner{
    color: #909195;
  }
 /deep/.el-breadcrumb__item:last-child .el-breadcrumb__inner{
    color: #333;
  }

</style>
