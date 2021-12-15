<template>
    <el-row class="credit-tab-content">
        <h3 class="font20 fontwb">经营风险</h3>

        <h4>动产抵押</h4>
        <el-table
            v-loading="mPledgeData.loading"
            :data="mPledgeData.result"
            border
            class="fxb-el-table"
            style="width: 100%"
        >
            <el-table-column label="序号" width="50">
                <template slot-scope="scope">
                    <span>{{ scope.$index + 1 + (mPledgeData.pageNo - 1) * mPledgeData.pageSize }}</span>
                </template>
            </el-table-column>
            <el-table-column label="登记编号" prop="registerNo"></el-table-column>
            <el-table-column label="登记日期" width="110">
                <template slot-scope="scope">{{ scope.row.registerDate | dateFormat('yyyy-MM-dd') }}</template>
            </el-table-column>
            <el-table-column label="登记机关" prop="registerOffice"></el-table-column>
            <el-table-column label="被担保债权数额" prop="debt_securedAmount"></el-table-column>
            <el-table-column label="状态" width="70">
                <template slot-scope="scope">
                    <span>{{ statusDesc[scope.row.status] || '其他' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="公示日期" width="110">
                <template slot-scope="scope">{{ scope.row.registerDate | dateFormat('yyyy-MM-dd') }}</template>
            </el-table-column>
        </el-table>
        <el-pagination
            class="fxb-page"
            v-show="mPledgeData.totalRecords > 0"
            :total="mPledgeData.totalRecords"
            :page-size="mPledgeData.pageSize"
            :current-page.sync="mPledgeData.pageNo"
            @current-change="getOperationMpledgeByPage"
        />

        <h4>股权出质</h4>
        <el-table
            v-loading="pledgeData.loading"
            :data="pledgeData.result"
            border
            class="fxb-el-table"
            style="width: 100%"
        >
            <el-table-column label="序号" width="50">
                <template slot-scope="scope">
                    <span>{{ scope.$index + 1 + (pledgeData.pageNo - 1) * pledgeData.pageSize }}</span>
                </template>
            </el-table-column>
            <el-table-column label="登记编号" prop="registNo"></el-table-column>
            <el-table-column label="出质人" prop="pledgor"></el-table-column>
            <el-table-column label="出质股权数额" prop="pledgedAmount" width="120"></el-table-column>
            <el-table-column label="质权人" prop="pledgee"></el-table-column>
            <el-table-column label="证照/证件号码" prop="pledgeeNo"></el-table-column>
            <el-table-column label="登记日期" width="100">
                <template slot-scope="scope">{{ scope.row.regDate | dateFormat('yyyy-MM-dd') }}</template>
            </el-table-column>
            <el-table-column label="状态" width="70">
                <template slot-scope="scope">
                    <span>{{ statusDesc[scope.row.status] || '其他' }}</span>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            class="fxb-page"
            v-show="pledgeData.totalRecords > 0"
            :total="pledgeData.totalRecords"
            :page-size="pledgeData.pageSize"
            :current-page.sync="pledgeData.pageNo"
            @current-change="getOperationPledgeByPage"
        />

        <h4>清算信息</h4>
        <el-table
            v-loading="liquidationData.loading"
            :data="liquidationData.result"
            border
            class="fxb-el-table"
            style="width: 100%"
        >
            <el-table-column label="序号" width="50">
                <template slot-scope="scope">
                    <span>{{ scope.$index + 1 + (liquidationData.pageNo - 1) * liquidationData.pageSize }}</span>
                </template>
            </el-table-column>
            <el-table-column label="清算组负责人" prop="leader"></el-table-column>
            <el-table-column label="清算组成员" prop="member"></el-table-column>
        </el-table>
        <el-pagination
            class="fxb-page"
            v-show="liquidationData.totalRecords > 0"
            :total="liquidationData.totalRecords"
            :page-size="liquidationData.pageSize"
            :current-page.sync="liquidationData.pageNo"
            @current-change="getOperationPledgeByPage"
        />

        <h4>工商异常名录</h4>
        <el-table
            v-loading="opExceptionData.loading"
            :data="opExceptionData.result"
            border
            class="fxb-el-table"
            style="width: 100%"
        >
            <el-table-column label="序号" width="50">
                <template slot-scope="scope">
                    <span>{{ scope.$index + 1 + (opExceptionData.pageNo - 1) * opExceptionData.pageSize }}</span>
                </template>
            </el-table-column>
            <el-table-column label="列入异常名录原因" prop="addReason"></el-table-column>
            <el-table-column label="列入日期" width="110">
                <template slot-scope="scope">{{ scope.row.addDate | dateFormat('yyyy-MM-dd') }}</template>
            </el-table-column>
            <el-table-column label="移出经营异常原因" prop="removeReason"></el-table-column>
            <el-table-column label="移出日期" width="110">
                <template slot-scope="scope">{{ scope.row.removeDate | dateFormat('yyyy-MM-dd') }}</template>
            </el-table-column>
            <el-table-column label="作出决定单位" prop="decisionOffice"></el-table-column>
        </el-table>
        <el-pagination
            class="fxb-page"
            v-show="opExceptionData.totalRecords > 0"
            :total="opExceptionData.totalRecords"
            :page-size="opExceptionData.pageSize"
            :current-page.sync="opExceptionData.pageNo"
            @current-change="getCompanyOpexceptionByPage"
        />

        <h4>行政处罚信息</h4>
        <el-table
            v-loading="penaltyData.loading"
            :data="penaltyData.result"
            border
            class="fxb-el-table"
            style="width: 100%"
        >
            <el-table-column label="序号" width="50">
                <template slot-scope="scope">
                    <span>{{ scope.$index + 1 + (penaltyData.pageNo - 1) * penaltyData.pageSize }}</span>
                </template>
            </el-table-column>
            <el-table-column label="决定文书号" prop="docNo"></el-table-column>
            <el-table-column label="违法行为类型" prop="penaltyType" :formatter="stringFormat"></el-table-column>
            <el-table-column label="行政处罚内容" prop="content" :formatter="stringFormat"></el-table-column>
            <el-table-column label="决定单位" prop="officeName" :formatter="stringFormat"></el-table-column>
            <el-table-column label="决定日期" width="110">
                <template slot-scope="scope">{{ scope.row.penaltyDate | dateFormat('yyyy-MM-dd') }}</template>
            </el-table-column>
        </el-table>
        <el-pagination
            class="fxb-page"
            v-show="penaltyData.totalRecords > 0"
            :total="penaltyData.totalRecords"
            :page-size="penaltyData.pageSize"
            :current-page.sync="penaltyData.pageNo"
            @current-change="getDetailOperationPenaltyByPage"
        />
    </el-row>
</template>

<script>
    import {Api_getBasicInfo} from "@/api/advanceSearch";
    import {dateFormat} from "@/utils/index";
    import {trim} from "lodash";

    export default {
        name: "BusinessRisk",
        filters: {dateFormat},
        data() {
            return {
                statusDesc: {
                    1: "有效",
                    0: "无效"
                },
                companyId: null,
                companyName: null,
                // 动产抵押信息，包括列表和分页信息
                mPledgeData: {
                    pageNo: 1,
                    pageSize: 10,
                    totalRecords: 0,
                    result: [],
                    loading: true
                },
                // 股权出质信息，包括列表和分页信息
                pledgeData: {
                    pageNo: 1,
                    pageSize: 10,
                    totalRecords: 0,
                    result: [],
                    loading: true
                },
                // 清算信息，包括列表和分页信息
                liquidationData: {
                    pageNo: 1,
                    pageSize: 10,
                    totalRecords: 0,
                    result: [],
                    loading: true
                },
                // 工商异常信息，包括列表和分页信息
                opExceptionData: {
                    pageNo: 1,
                    pageSize: 10,
                    totalRecords: 0,
                    result: [],
                    loading: true
                },
                // 行政处罚信息，包括列表和分页信息
                penaltyData: {
                    pageNo: 1,
                    pageSize: 10,
                    totalRecords: 0,
                    result: [],
                    loading: true
                }
            };
        },
        created: function () {
            // 获取参数
            this.companyId = this.$route.query.id;

            // 调用接口
            this.getOperationMpledgeByPage();
            this.getOperationPledgeByPage();
            this.getOperationLiquidationByPage();
            this.getCompanyOpexceptionByPage();
            this.getDetailOperationPenaltyByPage();
        },
        methods: {
            // 动产抵押信息
            getOperationMpledgeByPage() {
                this.mPledgeData.loading = true;
                Api_getBasicInfo(9, {
                    companyId: this.companyId,
                    companyName: this.companyName,
                    pageNo: this.mPledgeData.pageNo,
                    pageSize: this.mPledgeData.pageSize
                }).then(res => {
                    if (res) {
                        this.mPledgeData.result = res.result;
                        this.mPledgeData.totalRecords = res.totalRecords;
                    } else {
                        this.mPledgeData.result = [];
                        this.mPledgeData.totalRecords = 0;
                    }
                }).finally(() => {
                    this.mPledgeData.loading = false;
                });
            },
            // 股权出质信息
            getOperationPledgeByPage() {
                this.pledgeData.loading = true;
                Api_getBasicInfo(10, {
                    companyId: this.companyId,
                    companyName: this.companyName,
                    pageNo: this.pledgeData.pageNo,
                    pageSize: this.pledgeData.pageSize
                }).then(res => {
                    if (res) {
                        this.pledgeData.result = res.result;
                        this.pledgeData.totalRecords = res.totalRecords;
                    } else {
                        this.pledgeData.result = [];
                        this.pledgeData.totalRecords = 0;
                    }
                }).finally(() => {
                    this.pledgeData.loading = false;
                });
            },
            // 清算信息
            getOperationLiquidationByPage() {
                this.liquidationData.loading = true;
                Api_getBasicInfo(18, {
                    companyId: this.companyId,
                    companyName: this.companyName,
                    pageNo: this.liquidationData.pageNo,
                    pageSize: this.liquidationData.pageSize
                }).then(res => {
                    if (res) {
                        this.liquidationData.result = res.result;
                        this.liquidationData.totalRecords =
                            res.totalRecords;
                    } else {
                        this.liquidationData.result = [];
                        this.liquidationData.totalRecords = 0;
                    }
                }).finally(() => {
                    this.liquidationData.loading = false;
                });
            },
            // 工商异常信息
            getCompanyOpexceptionByPage() {
                this.opExceptionData.loading = true;
                Api_getBasicInfo(11, {
                    companyId: this.companyId,
                    companyName: this.companyName,
                    pageNo: this.opExceptionData.pageNo,
                    pageSize: this.opExceptionData.pageSize
                }).then(res => {
                    if (res) {
                        this.opExceptionData.result = res.result;
                        this.opExceptionData.totalRecords =
                            res.totalRecords;
                    } else {
                        this.opExceptionData.result = [];
                        this.opExceptionData.totalRecords = 0;
                    }
                }).finally(() => {
                    this.opExceptionData.loading = false;
                });
            },
            // 行政处罚信息
            getDetailOperationPenaltyByPage() {
                this.penaltyData.loading = true;
                Api_getBasicInfo(27, {
                    companyId: this.companyId,
                    companyName: this.companyName,
                    pageNo: this.penaltyData.pageNo,
                    pageSize: this.penaltyData.pageSize
                }).then(res => {
                    if (res) {
                        this.penaltyData.result = res.result;
                        this.penaltyData.totalRecords = res.totalRecords;
                    } else {
                        this.penaltyData.result = [];
                        this.penaltyData.totalRecords = 0;
                    }
                }).finally(() => {
                    this.penaltyData.loading = false;
                });
            },
            stringFormat: function (row, column, cellValue) {
                var value = trim(cellValue);
                if (value == null || value === 'null' || value === '') {
                    return '-';
                } else  {
                    return cellValue;
                }
            }
        }
    };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
