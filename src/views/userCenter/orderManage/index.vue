<template>
  <div class="user-center">
    <el-row class="user-center-top">
      <el-col :span="18">
        <ul class="center-tab">
          <router-link tag="li" :to="'report'" :class="{'active': $route.path.indexOf('report') >= 0 }">报告订单</router-link>
          <router-link tag="li" :to="'service'" :class="{'active': $route.path.indexOf('service') >= 0 }">服务订单</router-link>
          <!--                <router-link tag="li" :to="'course'" :class="{'active': $route.path.indexOf('course') >= 0 }">培训课程</router-link>-->
        </ul>
      </el-col>
    </el-row>

    <div class="user-center-content">
      <router-view id="user-content" name="orderManage" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {},
  methods: {}
};
</script>
