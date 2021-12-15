<template>
  <div>
      <h4 class="flex cp-title-wrap">
          <span class="flex-primary  cp-title">账单信息</span>
      </h4>

      <el-row>
        <TableWrapper
          ref="table"
          :fetchDataFn="Api_ysBillList"
          :query="listQuery"
          :columns="tableCol1"
        >
        </TableWrapper>
      </el-row>
  </div>
</template>
<script>
import {
  Api_ysBillList
} from "@/api/creditManagement/customerProfile/customerManagemCustomer/baseInfo";

export default{
  data(){
    const createRules = this.$createRules;
    return{
        listQuery: {
          companyId: this.$store.getters.userInfo.companyId
        },

        tableCol1: [
          { label: "账单编号", key: "BILL_NO" },
          { label: "对应合同", key: "CONTRACT_NO" },
          { label: "所属项目", key: "projectName" },
          { label: "费用类型", key: "ACCOUNT_TYPE" ,render: (h,data,row)=>{
            return data == 0? '租金' : data == 1? '物业费': "保证金";
          }},
          { label: "计费开始时间", key: "CHARGING_START_TIME" },
          { label: "计费截止日期", key: "CHARGING_END_TIME" },
          { label: "应收金额（元）", key: "RECEIVABLE_FEE" }
      ]
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    Api_ysBillList,
    getList() {
      this.$refs.table.fetchData();
    }
  }
}


</script>