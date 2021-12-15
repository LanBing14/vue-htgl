<template>
  <div class="">
    <appointmentList
      v-if="!isShow"
      @handleFromNotice="handleFromNotice"
    ></appointmentList>
    <appointDetail
      v-if="isShow"
      ref="ref_detail"
      @handleReturn="handleReturn"
      :modelId="modelDetailId"
    ></appointDetail>
  </div>
</template>
  
  <script>
import appointmentList from "./appointmentList.vue";
import appointDetail from './appointDetail.vue';
export default {
  name: "appointindex",
  components: { appointmentList, appointDetail },
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