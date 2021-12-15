<template>
<el-row v-loading="executeLoading">
    <el-table :data="executeData.result" border class="fxb-eltable" style="width: 100%">
        <el-table-column label="案号" prop="anNo"></el-table-column>
        <el-table-column label="立案日期" width="120">
            <template slot-scope="scope">{{ scope.row.liAnDate | dateFormat('yyyy-MM-dd') }}</template>
        </el-table-column>
        <el-table-column label="执行法院" prop="executeGov"></el-table-column>
        <el-table-column label="执行标的" prop="biaoDi" width="150"></el-table-column>
    </el-table>
    <el-pagination class="fxb-page padB0 marT20" v-show="executeData.totalRecords > 0" :total="executeData.totalRecords" :page-size="executeData.pageSize" :current-page.sync="executeData.pageNo" @current-change="((val)=>{ executeLoading=true;pageChange(val, 12) })" />
</el-row>
</template>

<script>
    import {Api_getBasicInfo} from "@/api/advanceSearch";
    import {dateFormat} from "@/utils/index";
    import {getUserInfo} from "@/utils/auth";

    export default {
    name: "ExecuteeInfo",
    filters: {
        dateFormat
    },
    data() {
        return {
            searchData: {
                companyId: "",
                companyName: ""
            },
            // 被执行人信息
            executeData: {
                pageNo: 1,
                pageSize: 10,
                totalRecords: 0,
                result: []
            },
            executeLoading: false
        };
    },
    mounted() {
        this.searchData.companyId = getUserInfo().companyId;

        // 被执行人信息
        this.loadTableData(12, {
            pageNo: 1
        });
    },
    methods: {
        loadTableData(type, option) {
            if (this.searchData.companyId) {
                Api_getBasicInfo(
                        type,
                        Object.assign(
                            this.searchData, {
                                pageNo: 1,
                                pageSize: 10
                            },
                            option
                        )
                    )
                    .then(res => {
                        if (res) {
                            switch (type) {
                                case 12: // 被执行人信息
                                    this.executeData = res;
                                    this.executeLoading = false;
                                    break;
                            }
                        }
                    })
                    .catch(() => {
                        switch (type) {
                            case 12: // 被执行人信息
                                this.executeLoading = false;
                                break;
                        }
                    });
            }
        },
        pageChange(val, type) {
            this.loadTableData(type, {
                pageNo: val
            });
        }
    }
};
</script>
