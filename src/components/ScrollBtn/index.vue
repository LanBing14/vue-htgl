<template>
  <div ref="scrollWrap" class="scroll-wrap">
    <div ref="scrollInner" class="scroll-inner">
      <slot></slot>
    </div>
    <span v-if="show && notLeftEnd" class="left" @click="toLeft">
      <i class="el-icon-arrow-left"></i>
    </span>
    <span v-if="show && notRightEnd" class="right" @click="toRight">
      <i class="el-icon-arrow-right"></i>
    </span>
  </div>
</template>

<script>
import { addResizeListener, removeResizeListener } from "@/utils/resize-event";

export default {
  name: "ScrollBtn",
  data() {
    return {
      scrollWrap: null,
      scrollInner: null,
      step: 268,
      show: true,
      notLeftEnd: false,
      notRightEnd: true,
      maxWidth: 0,
    };
  },
  mounted() {
    this.scrollWrap = this.$refs.scrollWrap;
    this.scrollInner = this.$refs.scrollInner;
    addResizeListener(this.scrollInner, this.toggleShow);
  },
  beforeDestory() {
    removeResizeListener(this.scrollInner, this.toggleShow);
  },
  methods: {
    toggleShow() {
      const innerWidth = this.scrollInner.scrollWidth;
      const { width: wrapWidth } = this.scrollWrap.getBoundingClientRect();
      this.show = innerWidth > wrapWidth;
    },
    toLeft() {
      const curTranslateX = parseInt(anime.get(this.scrollInner, "translateX"));
      let newTranslateX = curTranslateX + this.step;
      if (newTranslateX >= 0) {
        newTranslateX = 0;
      }
      this.ani(newTranslateX);
    },
    toRight() {
      const maxWidth =
        this.$refs.scrollWrap.getBoundingClientRect().width -
        this.$refs.scrollInner.getBoundingClientRect().width;
      const curTranslateX = parseInt(anime.get(this.scrollInner, "translateX"));
      let newTranslateX = curTranslateX - this.step;
      if (newTranslateX <= maxWidth) {
        newTranslateX = maxWidth;
      }
      this.maxWidth = maxWidth;
      this.ani(newTranslateX);
    },
    ani(newTranslateX) {
      this.notRightEnd = newTranslateX !== this.maxWidth;
      this.notLeftEnd = newTranslateX < 0;
      anime({
        targets: this.$refs.scrollInner,
        translateX: newTranslateX,
        easing: "easeOutQuart",
      });
    },
  },
};
</script>

<style scoped lang="scss">
.scroll-btn-base {
  position: absolute;
  width: 16px;
  height: 40px;
  line-height: 40px;
  background-color: rgba(3, 44, 89, 0.2);
  top: 50%;
  margin-top: -20px;
  cursor: pointer;
  color: #fff;
  /*opacity: 0.2;*/
  transition: opacity 0.3s;
  &:hover {
    opacity: 0.8;
  }
}
.scroll-wrap {
  position: relative;
  overflow: hidden;
  .scroll-inner {
    width: fit-content;
  }
  .left,
  .right {
    @extend .scroll-btn-base;
  }
  .left {
    left: 0;
  }
  .right {
    right: 0;
  }
}
</style>
