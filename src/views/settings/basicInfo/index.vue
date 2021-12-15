<template>
  <div class="user-center">
    <el-row class="user-center-top">
      <el-col :span="18">
        <ul class="center-tab">
          <router-link
            tag="li"
            :to="'basic'"
            v-show="!isRen"
            :class="{'active': $route.path.indexOf('basic')>=0 }"
          >资料设置</router-link>
        </ul>
        <ul class="center-tab">
          <router-link
            tag="li"
            :to="'basic'"
            v-show="isRen"
            :class="{'active': $route.path.indexOf('basic')>=0 }"
          >企业认证</router-link>
        </ul>
      </el-col>
    </el-row>
    <div class="user-center-content">
      <router-view id="user-content" name="basic" />
    </div>
  </div>
</template>

<script>
export default {
  name: "BasicInfo",
  data() {
    return {
      isRen: false
    };
  },
  watch: {
    $route: {
      handler: function(val, oldVal) {
        if(val.fullPath.indexOf("/userCenter/basic/authentication") > -1){
            this.isRen=true
        }else if(val.fullPath =="/userCenter/basic"){
            this.isRen=false;
        }
      },
      // 深度观察监听
      deep: true,
      immediate:true
    }
  }
};
</script>
