<template>
    <div class="overBox">
      <slot name="before"></slot>
      <span class="contentText">{{testText}}</span>
      <!--<slot name="after" class="moreText" @click="handleMore"></slot>-->
    
      <span v-show="isShowMore" class="moreText" @click="handleMore">
        <slot name="after"></slot>
      </span>
    </div>
</template>

<script>
  export default {
    name: 'textMore',
    props: {
      testText: {
        type: String,
        default: '',
      },
      isLimitHeight: {
        type: Boolean,
        default: false,
      },
      maxRow: {
        type: Number,
        default: 1,
      },
    },
    data() {
      return {
        isHide: false, // 以后做是否显示提示语
        isShowMore: false, // 默认不显示'更多'
      };
    },
    mounted() {
      this.init();
    },
    methods: {
      handleMore() {
        this.$emit('moreClick');
      },
      init() {
        // 判断是否需要限制行数（高度）
        if (this.isLimitHeight) {
          this.handleHeight();
        } else {
          const contentDom = this.$el.querySelector('.contentText');
          contentDom.innerText = this.testText;
        }
      },
      handleHeight() {
        this.$nextTick(() => {
          const contentBox = this.$el;
          const contentDom = this.$el.querySelector('.contentText');
          const moreDom = this.$el.querySelector('.moreText');
          // 设置成inline-block显示出来，获取它本身的高度
          moreDom.style.display = 'inline-block';
          // 获取限制maxRow最大行数的高度，以更多按钮的本身高度为参考物
          const maxHeight = this.maxRow * moreDom.offsetHeight;
          // 采用二分法进行判断需要显示多少内容
          let n = 999;
          if (contentBox.offsetHeight > maxHeight) {
            let text = this.testText;
            while (contentBox.offsetHeight > maxHeight && n > 0) {
              if (contentBox.offsetHeight > maxHeight * (this.maxRow + 2)) {
                contentDom.innerText = text = text.substring(0, Math.floor(text.length / 2));
              } else {
                contentDom.innerText = text = text.substring(0, text.length - 1);
              }
              n--;
            }
            this.$emit('update:isOver', true);
          } else {
            this.$emit('update:isOver', false);
          }
        })
      },
    },
    watch: {
      testText() {
        this.init();
      },
      maxHeight() {
        this.init();
      },
      isLimitHeight() {
        this.init();
      },
      maxRow() {
        this.init();
      },
    },
  };
</script>

<style scoped>
 
  .moreText {
    margin-left: 8px;
    cursor: pointer;
    color: #3199F5;
  }
</style>

