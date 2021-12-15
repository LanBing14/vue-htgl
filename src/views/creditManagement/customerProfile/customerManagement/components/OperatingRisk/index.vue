<template>
    <el-row class="credit-tab-content">
        <Comp1 :companyName="companyName" :isFxb="isFxb" :isDelete="isDelete"></Comp1>
        <Comp2 :companyName="companyName" :isFxb="isFxb" :isDelete="isDelete"></Comp2>
        <Comp3 :companyName="companyName" :isFxb="isFxb" :isDelete="isDelete"></Comp3>
        <Comp4 :companyName="companyName" :isFxb="isFxb" :isDelete="isDelete"></Comp4>
        <Comp5 :companyName="companyName" :isFxb="isFxb" :isDelete="isDelete"></Comp5>
    </el-row>
</template>

<script>
    import Comp1 from './Comp1'
    import Comp2 from './Comp2'
    import Comp3 from './Comp3'
    import Comp4 from './Comp4'
    import Comp5 from './Comp5'
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
            Comp1,
            Comp2,
            Comp3,
            Comp4,
            Comp5
        },
        props: {
            id: String, // 客户id，用于查询详情数据
            companyName: String, // 客户名称
            isFxb:Boolean,
            isDelete:Boolean
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
