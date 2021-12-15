<template>
  <el-container style="height: 100%;">
    <el-header>
      <FxbHeader @reload="reload"/>
    </el-header>
    <el-container class="main has-aside">
      <el-aside width="210px">
        <el-scrollbar style="height:100%">
          <Sidebar basePath="/monitor" :curRoutes="curRoutes" @reload="reload"></Sidebar>
        </el-scrollbar>
      </el-aside>
      <el-container style="height: auto">
        <div class="app-container" style="margin-left: 20px">
          <el-scrollbar ref="scrollWrap" class="scroll-wrap" style="height: 100%; width: 100%">
            <router-view
              id="router-view"
              style="min-height100%;padding: 20px 25px; overflow-y: auto; overflow-x: hidden"
              v-if="isRouterAlive"
            />
          </el-scrollbar>
        </div>
      </el-container>
    </el-container>
    <!-- <FxbFooter></FxbFooter> -->
  </el-container>
</template>

<script>
import FxbHeader from "@/views/layouts/fxb/components/FxbHeader";
import FxbFooter from "@/views/layouts/fxb/components/FxbFooter";
import Sidebar from "@/views/layouts/fxb/components/Sidebar/index";
import monitorRouter from "@/router/routerGroup/Monitor";

export default {
  components: {
    FxbHeader,
    FxbFooter,
    Sidebar,
  },
  data() {
    return {
      activeName: "first",
      isRouterAlive: true,
      curRoutes: monitorRouter[0].children,
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => (this.isRouterAlive = true));
    }
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";

/deep/ {
  @include elCustom;
}
</style>
