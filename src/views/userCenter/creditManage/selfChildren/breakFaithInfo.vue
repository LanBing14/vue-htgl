<template>
<el-row v-loading="loseCreditExecuteLoading">
    <el-table :data="loseCreditExecuteData.result" border class="fxb-el-table" style="width: 100%">
        <el-table-column label="案号" prop="anNo">
            <template slot-scope="scope">
                <div @click="showDetail(scope.row)" style="color: #4b9df3; cursor: pointer;">{{ scope.row.anNo }}</div>
            </template>
        </el-table-column>
        <el-table-column label="发布日期">
            <template slot-scope="scope">{{ scope.row.publicDate | dateFormat('yyyy-MM-dd') }}</template>
        </el-table-column>
        <el-table-column label="执行法院" prop="executeGov"></el-table-column>
        <el-table-column label="立案日期">
            <template slot-scope="scope">{{ scope.row.liAnDate | dateFormat('yyyy-MM-dd') }}</template>
        </el-table-column>
    </el-table>
    <el-pagination class="fxb-page padB0 marT20" v-show="loseCreditExecuteData.totalRecords > 0"
                   :total="loseCreditExecuteData.totalRecords" :page-size="loseCreditExecuteData.pageSize"
                   :current-page.sync="loseCreditExecuteData.pageNo"
                   @current-change="((val)=>{ loseCreditExecuteLoading=true;pageChange(val, 13) })"/>

    <el-dialog title="失信详情" :visible.sync="dialogVisible" top="10px"
               :close-on-click-modal="false"
               :before-close="closeDialog">
        <el-form ref="breakFaithForm" :model="breakFaithForm" :rules="rules" label-width="190px">
            <el-row :gutter="60">
                <el-col :span="24">
                    <el-form-item label="失信被执行人">
                        <el-input v-model="breakFaithForm.name" readonly></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="组织机构代码">
                        <el-input v-model="breakFaithForm.orgNo" readonly></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="案号">
                        <el-input v-model="breakFaithForm.anNo" readonly></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="执行法院">
                        <el-input v-model="breakFaithForm.executeGov" readonly></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="执行依据文号">
                        <el-input v-model="breakFaithForm.executeno" readonly></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="做出执行依据单位">
                        <el-input v-model="breakFaithForm.executeUnit" readonly></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="立案日期">
                        <span style="color: #999;">{{ breakFaithForm.liandate | dateFormat('yyyy-MM-dd') }}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="发布日期">
                        <span style="color: #999;">{{ breakFaithForm.publicdate | dateFormat('yyyy-MM-dd') }}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="被执行人履行情况">
                        <el-input v-model="breakFaithForm.executestatus" readonly></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="失信被执行人行为具体情形">
                        <el-input :rows="4" type="textarea" v-model="breakFaithForm.actionRemark" readonly></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="生效法律文书确定的义务">
                        <el-input :rows="4" type="textarea" v-model="breakFaithForm.yiWu" readonly></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </el-dialog>
</el-row>
</template>

<script>
    import {Api_getBasicInfo} from "@/api/advanceSearch";
    import {dateFormat} from "@/utils/index";
    import {getUserInfo} from "@/utils/auth";

    export default {
    name: "BreakFaithInfo",
    filters: {
        dateFormat
    },
    data() {
        return {
            searchData: {
                companyId: "",
                companyName: ""
            },
            // 失信被执行人信息
            loseCreditExecuteData: {
                pageNo: 1,
                pageSize: 10,
                totalRecords: 0,
                result: []
            },
            loseCreditExecuteLoading: false,
            dialogVisible: false,
            rules: {},
            breakFaithForm: {
                loading: false
            }
        };
    },
    mounted() {
        this.searchData.companyId = getUserInfo().companyId;

        // 失信被执行人信息
        this.loadTableData(13, {
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
                                case 13: // 失信被执行人信息
                                    this.loseCreditExecuteData = res;
                                    this.loseCreditExecuteLoading = false;
                                    break;
                            }
                        }
                    })
                    .catch(() => {
                        switch (type) {
                            case 13: // 失信被执行人信息
                                this.loseCreditExecuteLoading = false;
                                break;
                        }
                    });
            }
        },
        pageChange(val, type) {
            this.loadTableData(type, {
                pageNo: val
            });
        },
        showDetail(row, id) {
            this.dialogVisible = true;

            this.breakFaithForm = row;
            this.breakFaithForm.loading = false;
        },
        closeDialog(done) {
            this.dialogVisible = false;
        }
    }
};
</script>
