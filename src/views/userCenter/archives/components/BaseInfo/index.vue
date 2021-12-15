<template>
    <el-row class="credit-tab-content">
        <Comp1 ref="comp1" @updateBaseInfo="updateBaseInfo" :companyId="id" :isreadOnly="isreadOnly"></Comp1>
        <Comp2 :companyId="id" :isreadOnly="isreadOnly"></Comp2>
        <Comp3 :baseInfo="baseInfo" :isreadOnly="isreadOnly"></Comp3>
        <Comp4 :baseInfo="baseInfo" :isreadOnly="isreadOnly"></Comp4>
        <Comp5 :baseInfo="baseInfo" :isreadOnly="isreadOnly"></Comp5>
        <Comp6 :baseInfo="baseInfo" :isreadOnly="isreadOnly"></Comp6>
    </el-row>
</template>

<script>
    import Comp1 from "./Comp1";
    import Comp2 from "./Comp2";
    import Comp3 from "./Comp3";
    import Comp4 from "./Comp4";
    import Comp5 from "./Comp5";
    import Comp6 from "./Comp6";
    import {
        Api_CustomerArchivesGetPartners,
        Api_CustomerArchivesGetOperation,
        Api_CustomerArchivesGetBranches,
        Api_CustomerArchivesGetChangeRecords
    } from "@/api/creditManagement/customerProfile/customerManagemCustomer/baseInfo";

    export default {
        name: "BaseInfo",
        components: {
            Comp1,
            Comp2,
            Comp3,
            Comp4,
            Comp5,
            Comp6,
        },
        props: {
            id: String,// 客户id，用于查询详情数据
            isreadOnly:Boolean
         
        },
        data() {
            return {
                baseInfo: {},
                searchData: {
                    companyId: "",
                    companyName: ""
                },
                listQuery: {
                    companyId: this.$store.getters.userInfo.companyId,
                },
                scopeChangeLoading: false
            };
        },
        mounted() {
        },
        methods: {
            Api_CustomerArchivesGetPartners,
            Api_CustomerArchivesGetOperation,
            Api_CustomerArchivesGetBranches,
            Api_CustomerArchivesGetChangeRecords,
            getDetail() {
                this.$refs.comp1.getDetail()
            },
            updateBaseInfo(baseInfo) {
                this.baseInfo = baseInfo
            }
        }
    };
</script>

<style scoped>
</style>
