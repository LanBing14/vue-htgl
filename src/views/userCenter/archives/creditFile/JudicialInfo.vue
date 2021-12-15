<template>
    <el-row class="credit-tab-content">
        <h3 class="font20 fontwb">司法信息</h3>

        <h4>被执行人信息</h4>
        <el-row v-loading="executeLoading">
            <el-table :data="executeData.result" border class="fxb-el-table" style="width: 100%">
                <el-table-column align="center" label="序号" width="50">
                    <template slot-scope="scope">
                        <span>{{ scope.$index+(executeData.pageNo - 1) * executeData.pageSize + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="案号" prop="anNo"></el-table-column>
                <el-table-column label="执行法院" prop="executeGov"></el-table-column>
                <el-table-column label="执行标的" prop="biaoDi" width="150"></el-table-column>
                <el-table-column label="立案时间" width="120">
                    <template slot-scope="scope">{{ scope.row.liAnDate | dateFormat('yyyy-MM-dd') }}</template>
                </el-table-column>
            </el-table>

            <el-pagination
                class="fxb-page"
                v-show="executeData.totalRecords > 0"
                :total="executeData.totalRecords"
                :page-size="executeData.pageSize"
                :current-page.sync="executeData.pageNo"
                @current-change="((val)=>{ executeLoading=true;pageChange(val, 12) })"
            />
        </el-row>

        <h4>失信被执行人信息</h4>
        <el-row v-loading="loseCreditExecuteLoading">
            <el-table
                :data="loseCreditExecuteData.result"
                border
                class="fxb-el-table"
                style="width: 100%"
            >
                <el-table-column align="center" label="序号" width="50">
                    <template slot-scope="scope">
                        <span>{{ scope.$index+(loseCreditExecuteData.pageNo - 1) * loseCreditExecuteData.pageSize + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="案件编号" prop="anNo"></el-table-column>
                <el-table-column label="被执行人履行情况" prop="executeStatus" width="150"></el-table-column>
                <el-table-column label="法律文书确定的义务" prop="yiWu"></el-table-column>
                <el-table-column label="执行法院" prop="executeGov"></el-table-column>
                <el-table-column label="发布时间" width="120">
                    <template
                        slot-scope="scope"
                    >{{ scope.row.publicDate | dateFormat('yyyy-MM-dd') }}</template>
                </el-table-column>
            </el-table>
            <el-pagination
                class="fxb-page"
                v-show="loseCreditExecuteData.totalRecords > 0"
                :total="loseCreditExecuteData.totalRecords"
                :page-size="loseCreditExecuteData.pageSize"
                :current-page.sync="loseCreditExecuteData.pageNo"
                @current-change="((val)=>{ loseCreditExecuteLoading=true;pageChange(val, 13) })"
            />
        </el-row>

        <h4>裁判文书信息</h4>
        <el-row v-loading="caseLoading">
            <el-table :data="caseData.result" border class="fxb-el-table" style="width: 100%">
                <el-table-column align="center" label="序号" width="50">
                    <template slot-scope="scope">
                        <span>{{ scope.$index+(caseData.pageNo - 1) * caseData.pageSize + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="文书编号" prop="caseNo"></el-table-column>
                <el-table-column label="标题" prop="caseName"></el-table-column>
                <el-table-column label="类型" width="80">
                    <template slot-scope="scope">
                        <span>{{ caseTypeData[scope.row.caseType] || '其他' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="执行法院" prop="court"></el-table-column>
            </el-table>
            <el-pagination
                class="fxb-page"
                v-show="caseData.totalRecords > 0"
                :total="caseData.totalRecords"
                :page-size="caseData.pageSize"
                :current-page.sync="caseData.pageNo"
                @current-change="((val)=>{ caseLoading=true;pageChange(val, 14) })"
            />
        </el-row>

        <h4>法院公告信息</h4>
        <el-row v-loading="chinacourtLoading">
            <el-table :data="chinacourtData.result" border class="fxb-el-table" style="width: 100%">
                <el-table-column align="center" label="序号" width="50">
                    <template slot-scope="scope">
                        <span>{{ scope.$index+(chinacourtData.pageNo - 1) * chinacourtData.pageSize + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="公示时间" prop="date" width="120">
                    <template
                        slot-scope="scope"
                    >{{ scope.row.publishdate | dateFormat('yyyy-MM-dd') }}</template>
                </el-table-column>
                <el-table-column label="分类" prop="category" width="120"></el-table-column>
                <el-table-column label="当事人" width="150">
                    <template slot-scope="scope">
                        <span>{{ scope.row.party }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="法院公告" prop="content"></el-table-column>
            </el-table>
            <el-pagination
                class="fxb-page"
                v-show="chinacourtData.totalRecords > 0"
                :total="chinacourtData.totalRecords"
                :page-size="chinacourtData.pageSize"
                :current-page.sync="chinacourtData.pageNo"
                @current-change="((val)=>{ chinacourtLoading=true;pageChange(val, 15) })"
            />
        </el-row>
    </el-row>
</template>

<script>
import { Api_getBasicInfo } from "@/api/advanceSearch";
import { dateFormat } from "@/utils/index";

export default {
    name: "JudicialInfo",
    filters: { dateFormat },
    data() {
        return {
            caseTypeData: {
                ms: "民事案件",
                zx: "执行案件",
                xz: "行政案件",
                zscq: "知识产权案件"
            },
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
            executeLoading: false,
            // 失信被执行人信息
            loseCreditExecuteData: {
                pageNo: 1,
                pageSize: 10,
                totalRecords: 0,
                result: []
            },
            loseCreditExecuteLoading: false,
            // 裁判文书信息
            caseData: { pageNo: 1, pageSize: 10, totalRecords: 0, result: [] },
            caseLoading: false,
            // 法院公告信息
            chinacourtData: {
                pageNo: 1,
                pageSize: 10,
                totalRecords: 0,
                result: []
            },
            chinacourtLoading: false
        };
    },
    mounted() {
        this.searchData.companyId = this.$route.query.id;

        // 被执行人信息
        this.loadTableData(12, { pageNo: 1 });
        // // 失信被执行人信息
        this.loadTableData(13, { pageNo: 1 });
        // // 裁判文书信息
        this.loadTableData(14, { pageNo: 1 });
        // // 法院公告信息
        this.loadTableData(15, { pageNo: 1 });
    },
    methods: {
        loadTableData(type, option) {
            Api_getBasicInfo(
                type,
                Object.assign(
                    this.searchData,
                    { pageNo: 1, pageSize: 10 },
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
                            case 13: // 失信被执行人信息
                                this.loseCreditExecuteData = res;
                                this.loseCreditExecuteLoading = false;
                                break;
                            case 14: // 裁判文书信息
                                this.caseData = res;
                                this.caseLoading = false;
                                break;
                            case 15: // 法院公告信息
                                this.chinacourtData = res;
                                this.chinacourtLoading = false;
                                break;
                        }
                    }
                })
                .catch(() => {
                    switch (type) {
                        case 12: // 被执行人信息
                            this.executeLoading = false;
                            break;
                        case 13: // 失信被执行人信息
                            this.loseCreditExecuteLoading = false;
                            break;
                        case 14: // 裁判文书信息
                            this.caseLoading = false;
                            break;
                        case 15: // 法院公告信息
                            this.chinacourtLoading = false;
                            break;
                    }
                });
        },
        pageChange(val, type) {
            this.loadTableData(type, { pageNo: val });
        }
    }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.fxb-pageNo {
    padding: 20px 0;
}
</style>
