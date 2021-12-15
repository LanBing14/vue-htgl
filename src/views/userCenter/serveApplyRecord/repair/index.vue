<template>
  <div class="">
    <repairDetail
      v-if="isShow"
      ref="ref_detail"
      @handleReturn="handleReturn"
      :modelId="modelDetailId"
    ></repairDetail>
    <repairList
      v-if="!isShow"
      @handleFromNotice="handleFromNotice"
    ></repairList>
  </div>
</template>
  
  <script>
import repairList from "./repairList.vue";
import repairDetail from "./repairDetail.vue";
export default {
  name: "appointindex",
  components: { repairList, repairDetail },
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