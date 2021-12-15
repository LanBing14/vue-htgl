<template>
  <div>
     <h4 class="flex cp-title-wrap">
      <span class="flex-primary  cp-title">联系人信息</span>
    </h4>
    <el-row>
      <TableWrapper
        ref="table"
        :fetchDataFn="Api_contactInfo"
        :query="listQuery"
        :columns="tableCol1"
        @onSuccessData="dataList"
      />
    </el-row>

  </div>
</template>

<script type="text/jsx">
import {
  Api_contactInfo
} from "@/api/creditManagement/customerProfile/customerManagemCustomer/baseInfo";

export default {
  name: "Comp2",

  props:{
    /**是不是只读 */
    isreadOnly:Boolean,
    companyId:String

  },
  data() {
    const createRules = this.$createRules;
    return {
      listQuery: {
        companyId: this.$store.getters.userInfo.companyId
      },
      // 股东及出资方
      tableCol1: [
        { 
          label: "联系人类别",
          key: "contactCategory" ,
          render: (h, data, row) => {

            return (
               data==0? '日常联系人':data==1? '财务联系人':data==2? '负责人':data==3? '主要负责人':'其他'
            )
          }
        },
        { label: "联系人姓名", key: "contactName"},
        { 
          label: "性别", 
          key: "gender",
          render:(h,data,row)=>{
            return (
              data==0?  '男': data==1? '女':''
            )
          }
        },
        { label: "职务", key: "post" },
        { label: "手机", key: "mobilePhone" },
        { label: "E-mail", key: "email"},
        { label: "传真", key: "fax"}
      ]
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    Api_contactInfo,
    getList() {
      this.$refs.table.fetchData();
    },
    /**成功获取数据后 */
    dataList(res){
     
    }
  }
};
</script>

<style scoped>
</style>
