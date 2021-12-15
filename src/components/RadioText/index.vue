<template>
  <div class="radio-text-wrap">
    <div class="radio-text-label">
      <slot v-if="$slots.name" name="name"></slot>
      <template v-else>{{ name }}</template>
    </div>
    <div class="radio-text-item">
      <div
        v-for="(item, index) in options"
        :key="index"
        :class="{'text-blue': value === item[valueKey]}"
        class="radio-item"
        @click="change(item[valueKey])"
      >{{ item[labelKey] }}</div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "RadioText",
  props: {
    options: {
      type: Array,
      default: () => []
    },
    labelKey: {
      type: String,
      default: "label"
    },
    valueKey: {
      type: String,
      default: "id"
    },
    newName: {
      type: String,
      default: "企业分组"
    }
  },
  data() {
    return {
      name: this.newName,
      value: this.options.length ? this.options[0].id : ""
    };
  },
  methods: {
    // 通知父级选项变化
    change(v) {
      this.value = v;
      this.$emit("change", v);
    }
  }
};
</script>

<style scoped lang="scss">
.radio-text-wrap {
  margin-bottom: 15px;
  margin-top: 6px;
  display: flex;
  color: #606266;
  align-content: center;

  .radio-text-label {
    font-weight: bold;
    line-height: 24px;
    height: 24px;
    margin-right: 10px;
    vertical-align: top;
  }

  .radio-text-item {
    flex: 1;
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .radio-item {
      cursor: pointer;
      line-height: 24px;
      height: 24px;
      margin-right: 10px;
      padding: 0 15px;

      &:hover {
        color: #4a9df2;
      }
    }
  }
}

.text-blue {
  color: #4a9df2;
}
</style>
