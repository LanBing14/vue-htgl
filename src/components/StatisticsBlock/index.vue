<template>
  <div class="sb-container">
    <div class="sb-content" v-for="(item, index) in col" :key="index">
      <p class="sb-title">{{ item.name }}</p>
      <p class="sb-number">
        <span v-if="sData[item.key]!==null&&item.isMoney" class="sb-unit" style="margin-right: 1px">¥</span>
        {{ sData[item.key]!==null?(item.isMoney?$toMoney(sData[item.key]):sData[item.key]):'-' }}
        <span
          v-if="sData[item.key]!==null&&item.isMoney"
          class="sb-unit"
          style="margin-left: 1px"
        >元</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "StatisticsBlock",
  props: {
    col: { type: Array, default: () => [] },
    query: { type: Object, default: () => ({}) },
    fn: { type: Function, default: () => null },
  },
  data() {
    return { sData: [] };
  },
  methods: {
    fetch() {
      this.$nextTick(() => {
        this.fn(this.query).then((res) => {
          this.sData = res;
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.sb-container {
  display: flex;
  padding: 15px 0;
  background-color: #73b2f5;
  color: #fff;
  .sb-content {
    flex: 0 200px;
    padding: 6px 24px;
    border-right: 1px solid rgba($color: #fff, $alpha: 0.4);
    .sb-title {
      font-size: 13px;
      color: rgba($color: #fff, $alpha: 0.8);
      margin: 0 0 10px;
    }
    .sb-number {
      font-size: 18px;
      font-weight: bold;
    }
    .sb-unit {
      font-size: 13px;
    }
  }
  .sb-content:last-child {
    border-right: none !important;
  }
}
</style>
