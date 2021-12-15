<template>
  <div :class="{'dark-header': darkHeader}" id="app">
    <el-scrollbar ref="scrollbar" class="scroll-wrap">

        <keep-alive>
          <router-view v-if="$route.meta.keepAlive&&isRouterAlive"></router-view>
        </keep-alive>
        <!-- 不可以被缓存的视图组件 -->
        <router-view v-if="!$route.meta.keepAlive&&isRouterAlive"></router-view>
      <BackToTop />
    </el-scrollbar>
  </div>
</template>

<script>
import BackToTop from "@/components/BackToTop";
import { MessageBox } from "element-ui";

export default {
  name: "App",
  components: {
    BackToTop,
  },
  provide() { // 注册一个方法
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      darkHeader: false,
      scrollWrap: null,
      isRouterAlive: true
    };
  },
  watch: {
    $route() {
      this.scrollWrap.scrollTop = 0;
    },
  }, 
  mounted() {
    this.scrollWrap = this.$refs.scrollbar.$el.querySelector(".el-scrollbar__wrap");
    this.scrollWrap.addEventListener("scroll", this.onScroll, false);
    if (this.isIE10()) {
      this.setInfo();
    }
  },
  beforeDestory() {
    this.scrollWrap.removeEventListener("scroll", this.onScroll);
  },
  methods: {
     reload() {
      this.isRouterAlive = false
      this.$nextTick(function() {
        this.isRouterAlive = true
      })
    },
    onScroll() {
      const { scrollTop } = this.scrollWrap;
      if (scrollTop > 100) {
        this.darkHeader = true;
      } else {
        this.darkHeader = false;
      }
    },
    setInfo() {
      const newTime = new Date();
      const tYear = newTime.getFullYear();
      let tMonth = newTime.getMonth() + 1;
      let tDate = newTime.getDate();
      if (tMonth.toString().length === 1) {
        tMonth = "0" + tMonth;
      }
      if (tDate.toString().length === 1) {
        tDate = "0" + tDate;
      }
      if (window.localStorage.getItem("flag") !== "1") {
        const record = new Date(tYear + "-" + tMonth + "-" + tDate + ":00:00:00").getTime();
        window.localStorage.setItem("flag", "1");
        window.localStorage.setItem("record", JSON.stringify(record));
        // alert('需要弹窗提示')
        MessageBox({
          dangerouslyUseHTMLString: true,
          showConfirmButton: false,
          title: "温馨提示",
          message:
            '<div style="text-align: center"><img src="data:image/png;base64,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"></div>\n' +
            '        <p class="text fontWeight">\n' +
            "            您的IE浏览器版本过低,可能会影响产品的使用体验,建议进行升级\n" +
            "        </p>",
        });
      } else {
        if (
          new Date(tYear + "-" + tMonth + "-" + tDate + ":00:00:00").getTime() >
          Number(window.localStorage.getItem("record"))
        ) {
          // alert('需要弹窗提示')
          MessageBox({
            dangerouslyUseHTMLString: true,
            showConfirmButton: false,
            title: "温馨提示",
            message:
              '<div style="text-align: center"><img src="data:image/png;base64,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"></div>\n' +
              '        <p class="text fontWeight">\n' +
              "            您的IE浏览器版本过低,可能会影响产品的使用体验,建议进行升级\n" +
              "        </p>",
          });
        } else {
          // MessageBox({
          //     dangerouslyUseHTMLString: true,
          //     showConfirmButton: false,
          //     title: '温馨提示',
          //     message: '<div style="text-align: center"><img src="data:image/png;base64,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"></div>\n' +
          //         '        <p class="text fontWeight">\n' +
          //         '            您的IE浏览器版本过低,可能会影响产品的使用体验,建议进行升级\n' +
          //         '        </p>'
          // });
          // alert('不需要弹窗提示')
        }
      }
    },
    isIE10() {
      const userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
      const isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE浏览器
      let msg = false;
      if (isIE) {
        const reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        const fIEVersion = parseFloat(RegExp["$1"]);
        if (fIEVersion === 7) {
          msg = true;
        } else if (fIEVersion === 8) {
          msg = true;
        } else if (fIEVersion === 9) {
          msg = true;
        } else if (fIEVersion === 10) {
          msg = false;
        } else if (fIEVersion === 11) {
          msg = false;
        } else {
          msg = true;
        } //IE版本过低
      } else {
        msg = false;
      }
      return msg;
    },
  },
};
</script>

<style lang="scss">
  $dark_gray: #889aa4;
  $orange: #fd4a37;
  $light-blue: #4b9df3;
.el-link{
  &:after{
    border: 0!important;
  }
  padding: 0 3px;
}
.el-dialog__header {
  border-bottom: 1px solid #eaedf4;
  .el-dialog__title {
    color: #333;
    font-size: 16px;
    font-weight: bold;
  }
}
</style>

<style lang="scss" scoped>
#app {
  min-height: 100vh;
  height: 100%;
  position: relative;
  & > .el-container {
    min-height: 100vh;
    padding-top: 50px;
  }
}

.scroll-wrap {
  height: 100%;
  overflow-x: hidden;

  /deep/ .el-scrollbar__view {
    min-height: 100%;
    display: flex;
    flex-direction: column;
  }
}

.dark-header /deep/ {
  .fxb-header1,
  .fxb-header2 {
    background-color: #032c59 !important;
  }
}
</style>
