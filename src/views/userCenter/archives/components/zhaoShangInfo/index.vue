<template>
    <el-row class="credit-tab-content">
        <Comp1 :isreadOnly="isreadOnly" :id="id"></Comp1>


    </el-row>
</template>

<script>
    import Comp1 from './Comp1'

    import {
        Api_CustomerArchivesMpledgeInfo,
        Api_CustomerArchivesPledgeInfo,
        Api_CustomerArchivesOpexceptionInfo,
        Api_CustomerArchivesPenaltyInfo,
        Api_CustomerArchivesLiquidationInfo
    } from '@/api/creditManagement/customerProfile/customerManagemCustomer/operatingRisk';

    export default {
        name: "OperatingRisk",
        components: {
            Comp1
        },
        props: {
            id: String, // 客户id，用于查询详情数据
            companyName: String, // 客户名称
           /**是不是只读 */
            isreadOnly:Boolean
        },
  
        data() {
            return {
                listQuery: {
                    companyId: ''
                }
            };
        },
        mounted() {
            this.listQuery.companyId = this.id
            // this.$refs.table1.fetchData();
            // this.$refs.table2.fetchData();
            // this.$refs.table3.fetchData();
            // this.$refs.table4.fetchData();
            // this.$refs.table5.fetchData();
        },
        methods: {
            Api_CustomerArchivesMpledgeInfo,
            Api_CustomerArchivesPledgeInfo,
            Api_CustomerArchivesOpexceptionInfo,
            Api_CustomerArchivesPenaltyInfo,
            Api_CustomerArchivesLiquidationInfo
        }
    };
</script>

<style scoped>

</style>
