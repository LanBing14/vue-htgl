<template>
  <div class="menu-wrap">
      <el-menu
          ref="menu"
          :show-timeout="200"
          :default-active="$route.path"
          :style="{width:menuWidth?menuWidth+'px':'auto'}"
          unique-opened
          text-color="#62676b"
          active-text-color="#fff"
      >
          <sidebar-item
              ref="sidebarItem"
              v-for="route in userNavList"
              :key="route.path"
              :item="route"
              @reload="reload"
              :base-path="itemBasePath(route)"
          />
      </el-menu>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SideBarItem";

export default {
  components: { SidebarItem },
  props: {
      // curRoutes: Array,
      // basePath: String,
      // textColor: String,
      // activeTextColor: {
      //     type: String,
      //     default: () => "#fff"
      // }
  },
  data() {
      return {
          menuWidth: "",
          userNavList: [
          // {
          //   name: "信用管理",
          //   url: "/userCenter/creditManage"
          // },
          // {
          //   name: "信用修复",
          //   url: "/userCenter/creditPepairing"
          // },

          // {
          //   name: "我的关注",
          //   url: "/userCenter/concern",
          //   icon: "icon-star"
          // },
          // {
          //   name: "订单管理",
          //   url: "/userCenter/order",
          //   icon: "icon-shopping"
          // },

          {
            path: '/userCenter/archives/companyCenterMain',
            meta:{
              icon: 'icon-qiye3',
              title:'当前企业'
            }
          },
          // {
            
          //   path: '/userCenter/mechanism',
          //   meta:{
          //     title: '所属机构',
          //     icon: 'icon-jigou2'
          //   }
          // },
          {
            path: '/userCenter/serveApply',
            meta:{
              title: '服务记录',
              icon: 'icon-shenqingjilu'
            },
            children: [
              {
              
                path: '/userCenter/serveApply',
                meta:{
                  title: '访客预约',
                  icon: 'icon-weibiaoti-1-12'
                },
              },
              {
                path: '/userCenter/serveRepair',
                meta:{
                  title: '物业报修',
                  icon: 'icon-baoxiu'
                },
              },
               {
                path: '/userCenter/serveDecoration',
                meta:{
                  title: '装修服务',
                  icon: 'icon-zhuangxiu'
                },
              }
            ]
          },
          // {
          //   name: "信用培训",
          //   url: "/userCenter/training",
          //   icon: "icon-read"
          // },
          // {
          //   name: "会员信息",
          //   url: "/userCenter/vip",
          //   icon: "icon-user"
          // },
           {
            path: '/userCenter/business',
            meta:{
              icon: 'icon-qiye3',
              title:'企业关系绑定'
            }
          },
          {
            path: "/userCenter/message",
            meta:{
              title: '消息中心',
              icon: 'icon-bell'
            },
          },
          // {
          //   name: "资料设置",
          //   url: "/userCenter/basic",
          //   icon: "icon-snippets"
          // },
          // {
          //   name: "意见反馈",
          //   url: "/userCenter/contact",
          //   icon: "icon-message"
          // }
          ]

      };
  },
  computed: {
      ...mapGetters([
          // 'super_routers',
          "sidebar"
      ]),
      isCollapse() {
          return !this.sidebar.opened;
      }
  },
  // mounted() {
  //
  // },
  watch: {
      // curRoutes () {
      //     const menu = this.$refs.menu
      //     const sidebarItems = this.$refs.sidebarItem
      //     const menuWrapWidth = parseFloat(this.getStyle(menu.$el, 'width'))
      //     let itemsWidth = 0
      //     sidebarItems.forEach(item => {
      //         const w = parseFloat(this.getStyle(item.$el, 'width'))
      //         itemsWidth += w
      //     })
      //     console.log(itemsWidth, menuWrapWidth)
      //     if (itemsWidth > menuWrapWidth) {
      //         this.menuWidth = itemsWidth
      //     }
      // }
  },
  methods: {
      itemBasePath(route) {
          if (route.children && route.children.length) {
              return this.basePath + "/" + route.path;
          } else {
              return this.basePath;
          }
      },
      reload() {
          this.$emit('reload')
      }
  }
};
</script>
<style rel="stylesheet/scss" scoped lang="scss">
#app .menu-wrap {
  /deep/ .el-submenu.is-active {
      & > div.el-submenu__title {
          background-color: transparent;
          position: relative;
          color: $--color-primary !important;

          .icon {
              color: $--color-primary;
          }

          // &::before {
          //   content: "";
          //   display: block;
          //   position: absolute;
          //   left: 0;
          //   width: 3px;
          //   height: 100%;
          //   background-image: linear-gradient(to bottom, #417ff1, #55fff8);
          // }
      }
  }

  /deep/.el-menu-item {
      height: 50px;
      line-height: 50px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      i {
          color: #b7c5d6;
      }

      .svg-icon {
          fill: #b2c0ce;
      }
  }

  /deep/ {
      .el-menu-item.is-active {
          background-color: $--color-primary;
          position: relative;

          i {
              color: #fff;
          }
      }
      .el-menu-item:focus,
      .el-menu-item:hover {
          color: #fff !important;
          background-color: $--color-primary;

          i {
              color: #fff;
          }
      }
  }
}

/deep/ .el-submenu__icon-arrow {
  right: 18px;
  margin-top: -5px;
}

.el-menu--horizontal .el-menu-item:not(.is-disabled):hover,
.el-menu--horizontal .el-menu-item:not(.is-disabled):focus {
  background-color: rgba(0, 0, 0, 0.1);
}

/deep/.el-submenu__title {
  height: 50px;
  line-height: 47px;
  color: #374a5d !important;
  font-size: 14px;
  padding-right: 40px;

  .svg-icon {
      fill: #b2c0ce;
  }

  i {
    color: #b2c0ce;
  }
}
</style>
