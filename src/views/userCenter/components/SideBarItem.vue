<template>
    <div v-if="!item.hidden" class="menu-wrapper">
      <template v-if="!item.children || !item.children.length || item.hiddenChildren">
        <!-- 这里为了点击同路由页面刷新修改 -->
        <a @click="linkClick(resolvePath(item.hiddenChildren?'':(item.alias||item.path)))">
          <el-menu-item
            :index="resolvePath(item.hiddenChildren?'':(item.alias||item.path))"
            :class="{'submenu-title-noDropdown':!isNest}"
          >
            <item v-if="item.meta" :icon="item.meta.icon||item.meta.icon" :title="item.meta.title" />
          </el-menu-item>
        </a>
      </template>
  
      <el-submenu v-else ref="submenu" :index="resolvePath(item.alias||item.path)">
        <template slot="title">
          <item v-if="item.meta" :icon="item.meta.icon" :title="item.meta.title" />
        </template>
  
        <template v-for="child in item.children" v-if="!child.hidden">
          <sidebar-item
            v-if="child.children&&child.children.length>0"
            :is-nest="true"
            :item="child"
            :key="child.path"
            :base-path="resolvePath(child.alias||child.path)"
            class="nest-menu"
          />
          <!-- 这里为了点击同路由页面刷新修改 -->
          <a :key="child.name" @click="linkClick(resolvePath(child.alias||child.path))">
            <el-menu-item :index="resolvePath(child.alias||child.path)">
              <item v-if="child.meta" :icon="child.meta.icon" :title="child.meta.title" />
            </el-menu-item>
          </a>
        </template>
      </el-submenu>
    </div>
  </template>
  
  <script>
  import path from "path";
  import { isExternal } from "@/utils";
  import Item from "./Item";
//   import AppLink from "./Link";
//   import FixiOSBug from "./FixiOSBug";
  
  export default {
    name: "SidebarItem",
    components: { Item },
    // mixins: [FixiOSBug],
    props: {
      // route object
      item: {
        type: Object,
        required: true
      },
      isNest: {
        type: Boolean,
        default: false
      },
      basePath: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        onlyOneChild: null
      };
    },
    methods: {
      hasOneShowingChild(children, parent) {
        if (!children) {
          return false;
        }
        const showingChildren = children.filter(item => {
          if (item.hidden) {
            return false;
          } else {
            // Temp set(will be used if only has one showing child)
            this.onlyOneChild = item;
            return true;
          }
        });
  
        // When there is only one child router, the child router is displayed by default
        if (showingChildren.length === 1) {
          return true;
        }
  
        // Show parent if there are no child router to display
        if (showingChildren.length === 0) {
          this.onlyOneChild = { ...parent, path: "", noShowingChildren: true };
          return true;
        }
  
        return false;
      },
      resolvePath(routePath) {
        if (this.isExternalLink(routePath)) {
          // console.log(routePath)
          return routePath;
        }
        return path.resolve(this.basePath, routePath);
      },
      isExternalLink(routePath) {
        return isExternal(routePath);
      },
      linkClick(route) {
        this.$router.push({
          path: route
        });
        this.$emit('reload');
      }
    }
  };
  </script>
  
  <style rel="stylesheet/scss" scoped lang="scss">
  /deep/ .el-submenu__title {
    height: 50px;
    line-height: 50px;
    color: #5e7b99;
  }
  
  .menu-wrapper > .el-submenu /deep/ .el-submenu__title:hover {
    background-color: transparent;
  }

  .menu-wrapper span {
      margin-left: 5px;
  }
  </style>
  