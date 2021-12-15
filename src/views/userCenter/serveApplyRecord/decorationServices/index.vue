<template>
  <div class="">
    <decorationDetail
      v-if="isShow"
      ref="ref_detail"
      @handleReturn="handleReturn"
      :modelId="modelDetailId"
    ></decorationDetail>
    <decorationList
      v-if="!isShow"
      @handleFromNotice="handleFromNotice"
    ></decorationList>
  </div>
</template>
  
  <script>
import decorationList from "./decorationList.vue";
import decorationDetail from "./decorationDetail.vue";
export default {
  name: "appointindex",
  components: { decorationList, decorationDetail },
  data() {
    return {
      isShow: false,
      modelDetailId: "",
    };
  },
  methods: {
    handleFromNotice(modelStatus, modelId) {
      this.isShow = modelStatus;
      this.modelDetailId = modelId;
    },
    handleReturn(modelStatus) {
      this.isShow = modelStatus;
    },
  },
  created() {},
};
</script>
  <style lang="scss" scoped>
</style>