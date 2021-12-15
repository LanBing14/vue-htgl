<template>
  <el-row :class="setClass">
    <el-row  class="fxb-container" :style="headerStyle">
      <el-col :span="18" class="topNav">
        <router-link tag="span" to="/" id="logo">
          <img src="../../../../../assets/enterprise-images/head-top-img.png" alt="logo" class="top-logo"/>
          <span class="top-title">至信云创</span>
        </router-link>
        <!--   @mousemove="onMouseOver"
          @mouseleave="onMouseLeave" -->
        <div
          ref="routerLinkWrap"
          class="router-link-wrap"
        >
          <a
            v-for="(el, index) in menuRoutes"
            :key="index"
            :class="{ 'router-link-active': pageActive(el) }"
            @click="linkClick(el.path)"
          >{{ el.text }}</a>
          <span ref="line" :style="lineStyle" :class="transition" class="line"></span>
        </div>
      </el-col>
      <el-col :span="6">
        <div v-if="!isLoginState" style="text-align: center;" class="top-login-box">

        </div>
        <div v-else class="right-content clearfix">
          <div class="right-bell">
            <!-- <img src="../../../../../assets/enterprise-images/bell.png" alt="">
            <span>3</span> -->
          </div>
          <div class="right-letter">
            <!-- <img src="../../../../../assets/enterprise-images/letter.png" alt="">
            <span>3</span> -->
          </div>
          <el-dropdown class="avatar-container right-menu-item">
             <router-link to="/userInfo">
             <div class="avatar-wrapper">
              <img :src="HeadImageDel" alt=""   class="user-avatar" width="50">
              <span ref="userName" class="user-name" :title="userNameTitle">{{ userName }}</span>
              <i class="el-icon-caret-bottom" />
            </div>
             </router-link>
            <el-dropdown-menu class="usercenter-dropdown" slot="dropdown">
              <el-dropdown-item>
                <router-link to="/userCenter/archives/companyCenterMain">当前企业</router-link>
              </el-dropdown-item>
              <!-- <el-dropdown-item>
                <router-link to="/userCenter/mechanism">所属机构</router-link>
              </el-dropdown-item> -->
              <el-dropdown-item>
                <router-link to="/userCenter/serveApply">服务记录</router-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <router-link to="/userCenter/business">企业关系绑定</router-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <router-link to="/userCenter/message">消息中心</router-link>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <a @click="clickChange">密码重置</a>
              </el-dropdown-item>
              <el-dropdown-item>
                <a @click="logout">退出登录</a>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>
    </el-row>
    <div :class="{show: menuShowStatus}" class="mobile-menu-container" @click="hideMenu">
      <div :class="{show: menuShow}" class="menu-wrap">
        <router-link
          v-for="(el, index) in menuRoutes"
          :key="index"
          :to="el.path"
          :exact="el.path==='/'"
        >{{ el.text }}</router-link>
        <div class="close-wrap">
          <span @click="hideMenu">
            <i class="iconfont icon-close"></i>
          </span>
        </div>
      </div>
    </div>
    <ChangePassword ref="changepassword" />
  </el-row>
</template>

<script>
import { isMobile } from "@/utils/index";
import ChangePassword from "./ChangePassword.vue";
// import { Api_LoginByUsername,Api_UserSelfInfo } from "@/api/login";
// import router from "@/router";
import imgUrlDel from '@/assets/images/touxiang_jg.png';
export default {
  name: "FxbHeader",
  components: {
    ChangePassword
  },
  props: {
    headerStyle: String,
    setClass: {
      type: String,
      default: "fxb-header2"
    }
  },
  data() {
    return {
      currentLeft: 0,
      currentWidth: 0,
      imageUrl:'',
      imgUrlDel,
      // isLoginState: true,
      dialogVisible: false,
      // userInfo: getUserInfo(),
      userInputKeyword: "",
      userNameTitle: "",
      opacity: 0,
      transition: "",
      menuShowStatus: false, // 菜单是否显示，纯控制状态
      menuShow: false, // 菜单是否显示，界面控制
      menuRoutes: [
        { path: "/front/workportal/notice", text: "工作门户" },
        { path: "/serviceFair", text: "服务集市" },
        // { path: "/monitor", text: "风险监测" },
        // { path: "/channel", text: "渠道合作" },
        // { path: "/creditTrain", text: "公益培训" },
        // { path: "/buy", text: "产品定价" },
        // { path: "/about", text: "关于我们" }
      ],
      isMobile: isMobile(),
      imgUrlPic: imgUrlDel,
    };
  },
  computed: {
    HeadImageDel(){
      if (this.$store.state.user.HeadImage.indexOf(process.env.VUE_APP_FILE_IMG_API) > 0){
        return this.$store.state.user.HeadImage;
      }else {
        if (this.$store.state.user.HeadImage){
          return process.env.VUE_APP_FILE_IMG_API + this.$store.state.user.HeadImage;
        }else {
          return this.imgUrlDel
        }
      }
    },
    HeadImage() {
      let url = process.env.VUE_APP_FILE_API
      return this.$store.state.user.HeadImage && this.$store.state.user.HeadImage.indexOf(url)? true : false
    },
    userInfo() {
      return this.$store.state.user.userInfo;
    },
    isLoginState() {
      return !!this.userInfo.id;
    },
    userName() {
      return this.userInfo.id
        ? this.userInfo.name || this.userInfo.username
        : "";
    },
    lineStyle() {
      return {
        left: this.currentLeft + "px",
        width: this.currentWidth + "px"
        // opacity: this.opacity
      };
    }
  },
  watch: {
    userName(value) {
      this.$nextTick(() => {
        const userName = this.$refs.userName;
        if (userName) {
          const trueWidth = userName.scrollWidth;
          const width = Math.ceil(
            parseFloat(this.$getStyle(userName, "width"))
          );
          if (trueWidth > width) {
            this.userNameTitle = value;
          }
        }
      });
    }
  },
  mounted() {
    // this.onMouseLeave();
    this.opacity = 1;
    this.$nextTick(() => {
      setTimeout(() => {
        this.transition = "transition";
      }, 300);
    });
    this.$store.commit("SAVE_IS_MOBILE", this.isMobile);
    document.body.className = this.isMobile ? "mobile" : "";
  },
  methods: {
    pageActive(route) {
      const routeA = this.$route.path.split("/");
      const routeC = route.path.split("/");
      return routeA[1] === routeC[1];
    },
    onMouseOver(e) {
      if (e.target.nodeName === "A") {
        if (e.target.offsetLeft){
          this.currentLeft = e.target.offsetLeft;
         this.currentWidth = e.target.getBoundingClientRect().width;
        }
      }
    },
    onMouseLeave() {
      if (this.isMobile) {
        return;
      }
      let activeItem = this.$refs.routerLinkWrap.querySelector(
        ".router-link-active"
      );
      if (!activeItem) {
        activeItem = this.$refs.routerLinkWrap.querySelector("a");
      }
      if(activeItem.offsetLeft){
        this.currentLeft = activeItem.offsetLeft;
        this.currentWidth = activeItem.getBoundingClientRect().width;
      }
    },
    clickChange() {
      this.$refs.changepassword.showClick();
    },
    login() {
      this.$router.push('/login')
      // this.$login.login();
    },
    register() {
      this.$router.push('/register')
      // this.$login.register();
    },
    logout() {
      // 清掉session
      var number=this.$store.getters.userInfo.id+'batchQuery';

      if(sessionStorage.getItem(number)){
          sessionStorage.removeItem(this.$store.getters.userInfo.id+'batchQuery')
      }

      this.$store.dispatch("LogOut").then(() => {
        this.$message.success("退出成功");
        this.$router.push({
            path: "/login"
          });
        // /*dayu修改,若是当前的路由不是在首页，那么就跳转到首页，在原来的直接跳转的基础上加个判断 */

        // if (this.$route.fullPath !== "/") {
        //   this.$router.replace({
        //     path: "/"
        //   });
        // }
        // /*修改结束*/
      });
    },
    showMenu() {
      this.menuShowStatus = true;
      setTimeout(() => {
        this.menuShow = true;
      }, 50);
      // this.$nextTick(() => {
      //     this.menuShow = true
      // })
    },
    hideMenu() {
      this.menuShow = false;
      setTimeout(() => {
        this.menuShowStatus = false;
      }, 300);
    },
    linkClick(route) {
      if(this.$route.fullPath==route){
         this.$emit("reload");
      }else{
         this.$router.push({
          path: route
        });
      }
    },
    isRouteActive(path) {
      const curPath = this.$route.path;
      return curPath.indexOf(path) !== -1;
    }
  }
};
</script>

<style lang="scss">
.usercenter-dropdown {
  .el-dropdown-menu__item {
    padding: 0;

    a {
      padding: 9px 20px;
      white-space: nowrap;
    }

    &.el-dropdown-menu__item--divided:before {
      margin: 0 !important;
    }
  }
}
</style>

<style lang="scss" scoped>
$blue: transparent;
$blue2: #032c59;
$light-blue: #20a0ff;
.fxb-container {
  /*dayu添加修改*/
  width: 1280px;
  margin:0 auto;
  /**修改结束 */
  .top-logo {
    float: left;
    margin-top: 10px;
    /**dayu注销 */
    // margin-left: 250px;
    /**注销结束 */
  }
  .top-title {
    color: #fff;
    font-size:20px;
    margin-left: 20px;
    float: left
  }
}



.line {
  position: absolute;
  left: 0;
  bottom: 2px;

  &.transition {
    transition: all 0.3s;
  }
}

.router-link-wrap {
  position: relative;
  flex: 1;
  display: inline-flex;

  .line {
    height: 2px;
    background-color: #fff;
  }
}

#logo {
  cursor: pointer;
  margin-right: 30px;
}

.fxb-header {
  color: #cbcbcb;
  height: 50px;
  line-height: 50px;
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  z-index: 20;
  transition: background-color 0.3s;

  .topNav {
    color: #ffffff;
    display: flex;

    a {
      padding: 0 28px;
      text-align: center;
      display: inline-block;

      &:hover {
        text-shadow: 0 0 4px #ffffff;
      }

      &.router-link-active {
        font-weight: bold;
      }
    }
  }

  :root .el-input-group__append {
    background-color: #ffffff;
  }

  button.el-button--mini i.el-icon-search {
    color: $light-blue;
  }
  .right-content {
      display: flex;
      justify-self: center;
       align-content: center;
      /**dayu添加 */
      justify-content: flex-end;
      /**添加结束 */
    .right-letter{
      margin-left: 35px;
       position: relative;

       span {
         position: absolute;
         text-align: center;
         font-size: 12px;
         top: 6px;
         right: -10px;
         width: 20px;
         height: 20px;
         line-height: 20px;
         border-radius: 50%;
         background-color: #ff5050;
         color: #fff;
       }
    }

    .right-bell{
       margin-left: 55px;
       position: relative;
       span {
         position: absolute;
         font-size: 12px;
         text-align: center;
         top: 6px;
         right: -10px;
         width: 20px;
         height: 20px;
         line-height: 20px;
         border-radius: 50%;
         color: #fff;
         background-color: #67cbfc;
       }
    }
  }

  .right-menu-item {
    text-align: right;

   
  }

  .avatar-container {
    margin-left: 35px;
    cursor: pointer;
  }

  .avatar-wrapper {
    color: #ffffff;
  }

  .user-avatar {
    border-radius: 50%;
    width: 32px;
    height: 32px;
    vertical-align: middle;
    margin-right: 7px;
  }

  .user-name {
    display: inline-block;
    max-width: 60px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    vertical-align: middle;
  }
}

// 首页的背景色是深色
.fxb-header1 {
  @extend .fxb-header;
  background-color: $blue;
}

.fxb-header2 {
  @extend .fxb-header;
  background-color: $blue2;
}

.top-login-box {
  a:hover {
    text-shadow: 0 0 4px rgba(255, 255, 255, 0.5);
  }
}

.mobile {
  .logo-wrap {
    padding-left: 15px;
    display: inline-block;
  }

  .toggle-menu {
    padding: 10px;
    vertical-align: middle;

    i {
      color: #fff;
    }
  }
}

.mobile-menu-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  display: none;

  &.show {
    display: block;
  }

  .menu-wrap {
    transform: translateY(-100%);
    transition: all 0.3s;
    line-height: normal;

    & > a {
      display: block;
      padding: 10px 20px;
      border-top: 1px solid;
      background-color: #032c59;

      &:first-child {
        border-top: none;
      }
    }

    &.show {
      transform: translateY(0);
    }

    .close-wrap {
      text-align: center;

      span {
        padding: 10px;
        display: inline-block;

        i {
          font-size: 24px;
        }
      }
    }
  }
}
</style>
<style scoped>
.el-icon-caret-bottom{
  display: inline-block;
  margin-left:3px !important;
}

</style>