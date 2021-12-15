<template>
  <div class="user-center">
    <el-row class="user-center-top">
      <el-col :span="18">
        <ul class="center-tab">
          <router-link tag="li" :to="'contact'" :class="{'active': $route.path.indexOf('contact')>=0 }">我要反馈</router-link>
        </ul>
      </el-col>
    </el-row>
    <div class="user-center-content">
      <router-view id="user-content" name="contactManage" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>
