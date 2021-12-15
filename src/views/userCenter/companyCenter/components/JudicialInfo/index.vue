<template>
    <el-row class="credit-tab-content">
        <Comp1 :companyName="companyName" :isFxb="isFxb"></Comp1>
        <Comp2 :companyName="companyName" :isFxb="isFxb"></Comp2>
        <Comp3 :companyName="companyName" :isFxb="isFxb"></Comp3>
        <Comp4 :companyName="companyName" :isFxb="isFxb"></Comp4>
    </el-row>
</template>

<script>
    import Comp1 from './Comp1'
    import Comp2 from './Comp2'
    import Comp3 from './Comp3'
    import Comp4 from './Comp4'
    import {
        Api_GetExecutionInfoByPage,
        Api_GetBrokenPromiseInfoByPage,
        Api_GetRefereeInfoByPage,
        Api_GetCourtNoticeInfoByPage
    } from "@/api/creditManagement/customerProfile/customerManagemCustomer/judicialInfo";
    import {dateFormat} from "@/utils";

    export default {
        name: "JudicialInfo",
        components: {
            Comp1,
            Comp2,
            Comp3,
            Comp4,
        },
        filters: {dateFormat},
        props: {
            id: String, // 客户id，用于查询详情数据
            companyName: String, // 客户名称
            isFxb: Boolean
        },
        data() {
            return {
                listQuery: {
                    companyId: this.$store.getters.userInfo.companyId,
                },
                // caseTypeData: {
                //     ms: "民事案件",
                //     zx: "执行案件",
                //     xz: "行政案件",
                //     zscq: "知识产权案件"
                // },
                // searchData: {
                //     companyId: "",
                //     companyName: ""
                // },
                // // 被执行人信息
                // executeData: {
                //     pageNo: 1,
                //     pageSize: 10,
                //     totalRecords: 0,
                //     result: []
                // },
                // executeLoading: false,
                // // 失信被执行人信息
                // loseCreditExecuteData: {
                //     pageNo: 1,
                //     pageSize: 10,
                //     totalRecords: 0,
                //     result: []
                // },
                // loseCreditExecuteLoading: false,
                // // 裁判文书信息
                // caseData: { pageNo: 1, pageSize: 10, totalRecords: 0, result: [] },
                // caseLoading: false,
                // // 法院公告信息
                // chinacourtData: {
                //     pageNo: 1,
                //     pageSize: 10,
                //     totalRecords: 0,
                //     result: []
                // },
                // chinacourtLoading: false
            };
        },
        mounted() {
            // this.searchData.companyId = this.$route.query.id;
            // 被执行人信息
            // this.loadTableData(12, { pageNo: 1 });
            // // // 失信被执行人信息
            // this.loadTableData(13, { pageNo: 1 });
            // // // 裁判文书信息
            // this.loadTableData(14, { pageNo: 1 });
            // // // 法院公告信息
            // this.loadTableData(15, { pageNo: 1 });
            this.listQuery.companyId = this.id;
            // this.$refs.table1.fetchData();
            // this.$refs.table2.fetchData();
            // this.$refs.table3.fetchData();
            // this.$refs.table4.fetchData();
        },
        methods: {
            // loadTableData(type, option) {
            //     Api_getBasicInfo(
            //         type,
            //         Object.assign(
            //             this.searchData,
            //             { pageNo: 1, pageSize: 10 },
            //             option
            //         )
            //     )
            //         .then(res => {
            //             if (res) {
            //                 switch (type) {
            //                     case 12: // 被执行人信息
            //                         this.executeData = res;
            //                         this.executeLoading = false;
            //                         break;
            //                     case 13: // 失信被执行人信息
            //                         this.loseCreditExecuteData = res;
            //                         this.loseCreditExecuteLoading = false;
            //                         break;
            //                     case 14: // 裁判文书信息
            //                         this.caseData = res;
            //                         this.caseLoading = false;
            //                         break;
            //                     case 15: // 法院公告信息
            //                         this.chinacourtData = res;
            //                         this.chinacourtLoading = false;
            //                         break;
            //                 }
            //             }
            //         })
            //         .catch(() => {
            //             switch (type) {
            //                 case 12: // 被执行人信息
            //                     this.executeLoading = false;
            //                     break;
            //                 case 13: // 失信被执行人信息
            //                     this.loseCreditExecuteLoading = false;
            //                     break;
            //                 case 14: // 裁判文书信息
            //                     this.caseLoading = false;
            //                     break;
            //                 case 15: // 法院公告信息
            //                     this.chinacourtLoading = false;
            //                     break;
            //             }
            //         });
            // },
            // pageChange(val, type) {
            //     this.loadTableData(type, { pageNo: val });
            // }
            Api_GetExecutionInfoByPage,
            Api_GetBrokenPromiseInfoByPage,
            Api_GetRefereeInfoByPage,
            Api_GetCourtNoticeInfoByPage
        }
    }
</script>

<style scoped>

</style>
