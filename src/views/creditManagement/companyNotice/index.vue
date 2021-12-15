<template>
  <div class="">
    <noticeDetail v-if="isShow" ref="ref_detail" @handleReturn="handleReturn" :modelId="modelDetailId"></noticeDetail>
    <notice v-if="!isShow" @handleFromNotice="handleFromNotice"></notice>
  </div>
</template>

<script>
  import noticeDetail from "./noticeDetail/index.vue";
  import notice from "./notice.vue";
  export default {
    name: 'noticeindex',
    components:{noticeDetail,notice},
    data() {
      return {
        isShow:false,
        modelDetailId:''
      }
    },
    methods: {
      handleFromNotice(modelStatus,modelId){
          this.isShow = modelStatus
          this.modelDetailId = modelId
      },
      handleReturn(modelStatus){
        this.isShow = modelStatus
      }
   },
    created() {},
  }
</script>
<style lang="scss" scoped>
 
</style>