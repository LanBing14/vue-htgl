<template>
 <!--business center-->
  <el-container style="height: 100%;">
    <el-header>
      <FxbHeader @reload="reload"/>
    </el-header>
    <el-container class="main has-aside">
      <el-aside v-loading="menusLoading" width="210px">
          <adminSidebar class="sidebar-container" :basePath="basePath" :curRoutes="curRoutes"></adminSidebar>
      </el-aside>
      <!-- <el-container v-if="guided" style="height: auto"> -->
        <el-container  style="height: auto">
          <div class="app-container"  style="margin-left: 20px;position:relative" @mouseover="onMouseOver">
            <el-scrollbar ref="scrollWrap" class="scroll-wrap" style="height: 100%; width: 100%;">
              <router-view id="router-view" style="padding: 8px 25px;" v-if="isRouterAlive"/>
            </el-scrollbar>
          </div>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { merge } from "lodash";
import FxbHeader from "@/views/layouts/fxb/components/FxbHeader";
import FxbFooter from "@/views/layouts/fxb/components/FxbFooter";
import creditManagementIds from "@/router/routerGroup/creditManagementIds";
import adminSidebar from "@/views/layouts/fxb/components/adminSidebar/index";
import Guide from "./guide/index";

export default {
  name: "CreditManagement",
  components: { adminSidebar, FxbHeader, FxbFooter, Guide },
  data() {
    return { basePath: "", scrollWrap: null, vipTipOpened: true, isRouterAlive: true };
  },
  provide() {
    return { routerWrap: this,reload:this.reload };
  },
  computed: {
    curRoutes() {
      let { creditManagementRouters } = this.$store.state.permission;
      
      creditManagementRouters = merge([], creditManagementRouters);

      const r = !creditManagementRouters.length
        ? [creditManagementIds.creditManagement().children[0]]
        : [creditManagementIds.creditManagement().children[0], ...creditManagementRouters[0].children];
        /**隐藏设置中心菜单 */

        r.forEach(item=>{
          if(item.path=='/front/workportal'){
              let childrens=item.children;
              if(childrens.length>0&&Array.isArray(childrens)){
                childrens.forEach(item2=>{
                  if(item2.meta.title=='设置中心'){
                    item2['hidden']=true;
                  }
                })
              }
          }
        })
     
      return r;
    },
    isTodo() {
      return this.$route.path.includes("todo");
    },
    menusLoading() {
      return this.$store.state.user.menusLoading;
    },
    guided() {
      return this.$store.getters.userInfo.guided;
    },
  },
  watch: {
    guided: {
      handler(value) {
        if (value && this.$refs.scrollWrap) {
          this.scrollWrap = this.$refs.scrollWrap.$el.querySelector(".el-scrollbar__wrap");
        }
      },
      immediate: true,
    },
  },
  methods: {

    onMouseOverMenu() {
      this.$refs.scrollWrapMenu.update();
    },
    onMouseOver() {
      this.$refs.scrollWrap.update();
    },
    onGuideClose() {
      this.$store.commit("UPDATE_GUIDE", true);
    },
    toBuyVip() {
      this.$router.push({ name: "buy" });
    },
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => (this.isRouterAlive = true));
    }
  },
};
</script>

<style scoped lang="scss">
@import "src/styles/mixin.scss";

/deep/ {
  @include elCustom;
}

/deep/ .el-scrollbar__wrap {
  .el-scrollbar__view {
    height: 100%;
  }
}

.app-container.todo {
  background-color: transparent;

  #router-view {
    padding: 0 !important;
  }
}

.vip-config-false {
  color: #fff;
  background-color: #f56c6c;
  height: 40px;
  line-height: 40px;
  padding: 0 25px;
  font-size: 13px;
  font-weight: bold;
  position: relative;

  .el-button {
    padding: 5px 7px;
  }

  .close-btn {
    padding: 5px;
    position: absolute;
    top: 9px;
    right: 20px;
    cursor: pointer;
  }

 
}
</style>
