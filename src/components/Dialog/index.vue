<template>
  <el-dialog
    :visible.sync="dialogVisible"
    v-if="dialogVisible"
    :title="title"
     append-to-body
    :close-on-click-modal="false"
    @close="onClose"
    v-bind="{...$props,...$attrs}"
  >
    <template slot="title">
      <slot name="title"></slot>
    </template>
    <slot />
    <div slot="footer" v-if="showBtn" style="text-align: center">
      <el-button
        v-for="(el,index) in defaultBtns"
        :key="index"
        :type="el.type"
        @click="el.click"
      >{{ el.text }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import elDragDialog from '@/directive/el-dragDialog' // base on element-ui

export default {
  name: "Dialog",
  // directives: {elDragDialog},
  props: {
    title: String,
    onOk: {
      type: Function,
      default: () => null,
    },
    visible: {
      type: Boolean,
      default: () => null,
    },
    showBtn: {
      type: Boolean,
      default: () => true,
    },
    handleDrag: {
      type: Function,
      default: () => () => {},
    },
    onlyClose: Boolean,
    btns: Array,
    noBtns:Boolean
  },
  data() {
    return {
      dialogVisible: false,
      popBtn: [],
    };
  },
  computed: {
    defaultBtns() {
      let defaultBtns = [
        {
          text: "确定",
          type: "primary",
          click: this.handleSure,
        },
        {
          text: "取消",
          click: this.handleClose,
        },
      ];
      if (this.onlyClose) {
        defaultBtns = [
          {
            text: "确定",
            type: "primary",
            click: this.handleClose,
          },
        ];
      }

      if(this.noBtns){
        defaultBtns=[]
      }

      return this.btns || defaultBtns;
    },
  },
  watch: {
    visible(isShow) {
      this.dialogVisible = isShow;
    },
    btns(val) {
      this.defaultBtns = val;
    },
    onlyClose(val) {
      // if(val){
      //     this.
      // }
    },
  },
  methods: {
    doOpen: function () {
      this.dialogVisible = true;
    },
    doClose: function () {
      this.dialogVisible = false;
    },
    handleSure() {
      if (this.onOk) {
        this.onOk();
      } else {
        this.$emit("update:visible", false);
      }
    },
    handleClose() {
      this.$emit("update:visible", false);
    },
    onClose() {
      this.$emit("close");
      this.handleClose();
    },
  },
};
</script>

<style scoped lang="scss">
</style>
