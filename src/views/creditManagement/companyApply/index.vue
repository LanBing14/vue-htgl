<template>
    <div>
        <applyWrite  ref="ref_write" v-if="isDetailShow == 1" @handleReturn="handleReturn" :modelId="modelId" ></applyWrite>
        <applyDetail  ref="ref_detail" v-if="isDetailShow == 0" @handleReturn="handleReturn"  :modelId="modelId"></applyDetail>
        <apply @handleFromApply="handleFromApply" v-if="isShow"></apply>
    </div>
  </template>
  
  <script>
    import applyDetail from "./applyDetail/index.vue";
    import applyWrite from "./applyWrite/index.vue";
    import apply from "./apply.vue";
    export default {
      name: 'noticeindex',
      components:{applyDetail,apply,applyWrite},
      data() {
        return {
            isShow: true,
            isDetailShow: 2,
            modelDetailId:'',
            modelId: ''
        }
      },
      methods: {
        handleFromApply(modelItem,modelId){
            this.modelId = modelItem.id
            this.isDetailShow = modelItem.status == 1 ? 1: 0
            this.isShow = false
        },
        handleReturn(modelStatus){
            this.isShow = true
            this.isDetailShow = 2
        }
     },
      created() {},
    }
  </script>
  <style lang="scss" scoped>
   
  </style>