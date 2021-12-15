<template>
  <section ref="guideWrap" class="guide-wrap">
    <component ref="guide" :is="guideCompKey" class="comp-content" @onInfo="onInfo"></component>
    <div class="guide-mask">
      <div :style="highLightStyle" class="highlight-block"></div>
      <div :style="jiantouStyle" :class="{down: jiantouDir === 'down'}" class="jiantou"></div>
      <div ref="infoContent" :style="infoStyle" class="info-content" style="line-height: 20px">
        <div class="text">{{ text }}</div>
        <div class="btns">
          <el-button plain @click="jump" class="jump">跳过介绍</el-button>
          <el-button v-if="guideIndex>0" plain class="p-n" @click="prev" style="border: 1px solid #FFF">上一步</el-button>
          <el-button
            v-if="guideIndex<maxStepNum"
            plain
            class="p-n"
            @click="next"
            style="border: 1px solid #FFF"
          >下一步</el-button>
          <el-button v-if="guideIndex===maxStepNum" plain class="p-n" @click="jump">我知道啦</el-button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Step6 from "./Step6";
import Step7 from "./Step7";
import Step8 from "./Step8";
import Step9 from "./Step9";
import Step10 from "./Step10";
import { Api_MarkGuided } from "@/api/baseApi";

export default {
  name: "Guide",
  components: {
    Step1,
    Step2,
    Step3,
    Step4,
    Step5,
    Step6,
    Step7,
    Step8,
    Step9,
    Step10,
  },
  data() {
    const compKeys = [
      "Step1",
      "Step2",
      "Step3",
      "Step4",
      "Step5",
      "Step6",
      "Step7",
      "Step8",
      "Step9",
      "Step10",
    ];
    return {
      containerLeft: 230,
      containerWidth: 0,
      containerHeight: 0,
      guideIndex: "",
      compKeys,
      maxStepNum: compKeys.length - 1,
      highLightStyle: {
        width: "0px",
        height: "0px",
        left: "0px",
        top: "0px",
      },
      text: "",
      jiantouDir: "up", // 箭头方向
      infoStyle: {}, // 信息体样式
      timer: null, // resizeTimer
    };
  },
  computed: {
    // 当前引导页的组件
    guideCompKey() {
      return this.compKeys[this.guideIndex];
    },
    // 箭头
    jiantouStyle() {
      const dis = 10;
      const l = parseInt(this.highLightStyle.left) + parseInt(this.highLightStyle.width) / 2 - 10;
      let t = parseInt(this.highLightStyle.top) + parseInt(this.highLightStyle.height) + dis;
      const infoContent = this.$refs.infoContent;
      if (infoContent) {
        if (this.jiantouDir === "down") {
          t = parseInt(this.highLightStyle.top) - 20;
        }
      }
      return {
        left: l + "px",
        top: t + "px",
      };
    },
  },
  mounted() {
    this.setContainerStyle();
    this.guideIndex = 0;
    window.addEventListener("resize", this.onResize, false);
  },
  methods: {
    onResize() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.setContainerStyle();
        if (this.$refs.guide) {
          this.$refs.guide.setInfo && this.$refs.guide.setInfo();
        }
      }, 300);
    },
    // 获得区域宽高
    setContainerStyle() {
      if (this.$refs.guideWrap) {
        const { width, height } = this.$refs.guideWrap.getBoundingClientRect();
        this.containerWidth = width;
        this.containerHeight = height;
      }
    },
    // 跳过引导
    jump() {
      const { id: userId } = this.$store.getters.userInfo;
      Api_MarkGuided(userId)
        .then((res) => {
          this.$emit("close");
          this.$router.push({ name: "creditManagement" });
        })
        .catch((e) => {
          this.$message.error(e);
        });
    },
    // 上一步
    prev() {
      this.guideIndex = this.guideIndex === 0 ? 0 : this.guideIndex - 1;
    },
    // 下一步
    next() {
      this.guideIndex = this.guideIndex >= this.max ? this.max : this.guideIndex + 1;
    },
    // 加载引导页面信息成功后的回调
    onInfo(style, text, url) {
      const { left, top, width, height } = style;
      const disY = 50;
      this.highLightStyle = {
        left: left + "px",
        top: top - disY + "px",
        width: width + "px",
        height: height + "px",
      };
      this.text = text;
      this.$route.path !== url && this.$router.push(url);
      this.$nextTick(() => {
        this.setInfoStyle(style);
      });
    },
    setInfoStyle(highLightStyle) {
      const containerOffsetTop = 50;
      let w = 340;
      let l = highLightStyle.left - (w - highLightStyle.width) / 2;
      let t = highLightStyle.top - containerOffsetTop + highLightStyle.height + 20;
      const infoContent = this.$refs.infoContent;
      const { height } = infoContent.getBoundingClientRect();
      if (t + height > this.containerHeight) {
        const dis = 20; // 减去箭头的间隔距离
        t = highLightStyle.top - containerOffsetTop - height - dis;
        this.jiantouDir = "down";
      } else {
        this.jiantouDir = "up";
      }

      if (l + w > this.containerWidth) {
        l = this.containerWidth - w - 10;
      }

      this.infoStyle = {
        left: l + "px",
        top: t + "px",
        width: w + "px",
      };
    },
  },
};
</script>

<style scoped lang="scss">
.guide-wrap {
  width: 100%;
  position: absolute;
  height: 100%;
  left: 0;
  padding-left: 250px;
  top: 0;

  .comp-content {
    height: 100%;
    overflow: hidden;
    padding: 20px 25px;
    background-color: #fff;
  }

  .guide-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2000;
    background-color: rgba(0, 0, 0, 0.3);
  }

  .highlight-block {
    background-color: #fff;
    position: absolute;
    transition: all 0.4s;
    border-radius: 4px;
  }

  .jiantou {
    display: block;
    position: absolute;
    border-bottom: 10px solid $--color-primary;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    transition: all 0.4s;

    &.down {
      border-bottom-color: transparent;
      border-top: 10px solid $--color-primary;
    }
  }

  .info-content {
    position: absolute;
    padding: 15px;
    background-color: $--color-primary;
    color: #fff;
    transition: all 0.4s;
    border-radius: 8px;

    .text {
      margin-bottom: 30px;
    }

    .btns {
      text-align: right;

      button {
        margin-left: 10px;
      }
    }

    .jump {
      background-color: transparent;
      border-color: #fff;
      color: #fff;
    }

    .p-n {
      background-color: #fff;
      color: $--color-primary;
      border-radius: 2px;
    }
  }
}

/deep/ {
  .highlight-item {
    position: relative;
    z-index: 2001;
  }
}
</style>
<style lang="scss">
.popover-wrap {
  min-width: auto;
  padding-left: 0;
  padding-right: 0;
}
</style>
