<template>
    <el-row class="credit-tab-content">
        <h3 class="font20 fontwb">经营状况</h3>
        <h4>融资信息</h4>
        <el-table
            v-loading="financingData.loading"
            :data="financingData.result"
            style="width: 100%"
            border
            class="fxb-el-table"
        >
            <el-table-column label="序号" width="50">
                <template slot-scope="scope">
                    <span>{{ scope.$index + 1 + (financingData.pageNo - 1) * financingData.pageSize }}</span>
                </template>
            </el-table-column>
            <el-table-column label="日期" width="110">
                <template slot-scope="scope">{{ scope.row.date | dateFormat('yyyy-MM-dd') }}</template>
            </el-table-column>
            <el-table-column prop="investment" label="投资方"></el-table-column>
            <el-table-column prop="round" label="级别"></el-table-column>
            <el-table-column prop="amount" label="金额"></el-table-column>
        </el-table>
        <el-pagination
            class="fxb-page"
            v-show="financingData.totalRecords > 0"
            :total="financingData.totalRecords"
            :page-size="financingData.pageSize"
            :current-page.sync="financingData.pageNo"
            @current-change="getOperationFinancingByPage"
        />

        <h4>财务总览信息</h4>
        <el-table
            v-loading="financingTaxData.loading"
            :data="financingTaxData.result"
            style="width: 100%"
            border
            class="fxb-el-table"
        >
            <el-table-column label="序号" width="50">
                <template slot-scope="scope">
                    <span>{{ scope.$index + 1 + (financingTaxData.pageNo - 1) * financingTaxData.pageSize }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="revenueRange" label="公司实力等级(元)"></el-table-column>
            <el-table-column prop="taxRange" label="纳税区间(元)"></el-table-column>
            <el-table-column prop="netProfitMargins" label="销售净利润率"></el-table-column>
            <el-table-column prop="grossProfitMargins" label="销售毛利率"></el-table-column>
            <el-table-column prop="year" label="财务年度" width="100"></el-table-column>
        </el-table>
        <el-pagination
            class="fxb-page"
            v-show="financingTaxData.totalRecords > 0"
            :total="financingTaxData.totalRecords"
            :page-size="financingTaxData.pageSize"
            :current-page.sync="financingTaxData.pageNo"
            @current-change="getOperationFinancingTaxByPage"
        />

        <h4>产品信息</h4>
        <el-table
            v-loading="productData.loading"
            :data="productData.result"
            style="width: 100%"
            border
            class="fxb-el-table"
        >
            <el-table-column label="序号" width="50">
                <template slot-scope="scope">
                    <span>{{ scope.$index + 1 + (productData.pageNo - 1) * productData.pageSize }}</span>
                </template>
            </el-table-column>
            <el-table-column label="产品图片">
                <template slot-scope="scope">
                    <img :src="scope.row.imageUrl" :onerror="errorImg" width="50" />
                </template>
            </el-table-column>
            <el-table-column prop="name" label="产品名"></el-table-column>
            <el-table-column prop="domainDesc" label="所属领域"></el-table-column>
            <el-table-column prop="link" label="网址"></el-table-column>
        </el-table>
        <el-pagination
            class="fxb-page"
            v-show="productData.totalRecords > 0"
            :total="productData.totalRecords"
            :page-size="productData.pageSize"
            :current-page.sync="productData.pageNo"
            @current-change="getOperationProductByPage"
        />

        <h4>抽查信息</h4>
        <el-table
            v-loading="spotcheckData.loading"
            :data="spotcheckData.result"
            style="width: 100%"
            border
            class="fxb-el-table"
        >
            <el-table-column label="序号" width="50">
                <template slot-scope="scope">
                    <span>{{ scope.$index + 1 + (spotcheckData.pageNo - 1) * spotcheckData.pageSize }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="executiveOrg" label="检察实施机关"></el-table-column>
            <el-table-column prop="type" label="类型"></el-table-column>
            <el-table-column label="日期" width="110">
                <template slot-scope="scope">{{ scope.row.date | dateFormat('yyyy-MM-dd') }}</template>
            </el-table-column>
        </el-table>
        <el-pagination
            class="fxb-page"
            v-show="spotcheckData.totalRecords > 0"
            :total="spotcheckData.totalRecords"
            :page-size="spotcheckData.pageSize"
            :current-page.sync="spotcheckData.pageNo"
            @current-change="getOperationSpotcheckByPage"
        />

        <!-- <h4>招投标信息</h4>
        <el-table
            v-loading="tenderInfoData.loading"
            :data="tenderInfoData.result"
            style="width: 100%"
            border
            class="fxb-el-table"
        >
            <el-table-column label="序号" width="50">
                <template slot-scope="scope">
                    <span>{{ scope.$index + 1 + (tenderInfoData.pageNo - 1) * tenderInfoData.pageSize }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="title" label="描述"></el-table-column>
            <el-table-column label="发布时间" width="110">
                <template slot-scope="scope">{{ scope.row.publishTime | dateFormat('yyyy-MM-dd') }}</template>
            </el-table-column>
            <el-table-column prop="provinceName" label="所属地区"></el-table-column>
            <el-table-column prop="channelName" label="项目分类"></el-table-column>
        </el-table>
        <el-pagination
            class="fxb-page"
            v-show="tenderInfoData.totalRecords > 0"
            :total="tenderInfoData.totalRecords"
            :page-size="tenderInfoData.pageSize"
            :current-page.sync="tenderInfoData.pageNo"
            @current-change="getOperationTenderInfoByPage"
        />-->

        <h4>招聘类信息</h4>
        <el-table
            v-loading="recruitInfoData.loading"
            :data="recruitInfoData.result"
            style="width: 100%"
            border
            class="fxb-el-table"
        >
            <el-table-column label="序号" width="50">
                <template slot-scope="scope">
                    <span>{{ scope.$index + 1 + (recruitInfoData.pageNo - 1) * recruitInfoData.pageSize }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="title" label="职位名称"></el-table-column>
            <el-table-column prop="area" label="地区" width="100"></el-table-column>
            <el-table-column prop="salary" label="薪资" width="100"></el-table-column>
            <el-table-column prop="education" label="学历" width="100"></el-table-column>
            <el-table-column prop="experience" label="工作经验" width="100"></el-table-column>
            <el-table-column prop="description" label="工作内容（职位要求）" min-width="120"></el-table-column>
            <el-table-column label="发布日期" width="110">
                <template slot-scope="scope">{{ scope.row.publishTime | dateFormat('yyyy-MM-dd') }}</template>
            </el-table-column>
            <el-table-column prop="source" label="数据来源" width="100"></el-table-column>
        </el-table>
        <el-pagination
            class="fxb-page"
            v-show="recruitInfoData.totalRecords > 0"
            :total="recruitInfoData.totalRecords"
            :page-size="recruitInfoData.pageSize"
            :current-page.sync="recruitInfoData.pageNo"
            @current-change="getOperationRecruitInfoByPage"
        />
    </el-row>
</template>
<script>
import { Api_getBasicInfo } from "@/api/advanceSearch";
import { dateFormat } from "@/utils/index";

export default {
    name: "OperateCond",
    filters: { dateFormat },
    data() {
        return {
            errorImg: 'this.src="' + require("@/assets/images/zanwutupian.png") + '"',
            companyId: null,
            companyName: null,
            // 融资信息，包括列表和分页信息
            financingData: {
                pageNo: 1,
                pageSize: 10,
                totalRecords: 0,
                result: [],
                loading: true
            },
            // 财务总览信息，包括列表和分页信息
            financingTaxData: {
                pageNo: 1,
                pageSize: 10,
                totalRecords: 0,
                result: [],
                loading: true
            },
            // 产品信息，包括列表和分页信息
            productData: {
                pageNo: 1,
                pageSize: 10,
                totalRecords: 0,
                result: [],
                loading: true
            },
            // 抽查信息，包括列表和分页信息
            spotcheckData: {
                pageNo: 1,
                pageSize: 10,
                totalRecords: 0,
                result: [],
                loading: true
            },
            // 招投标信息，包括列表和分页信息
            tenderInfoData: {
                pageNo: 1,
                pageSize: 10,
                totalRecords: 0,
                result: [],
                loading: true
            },
            // 招聘类信息，包括列表和分页信息
            recruitInfoData: {
                pageNo: 1,
                pageSize: 10,
                totalRecords: 0,
                result: [],
                loading: true
            }
        };
    },
    created: function() {
        // 获取参数
        this.companyId = this.$route.query.id;

        // 调用接口
        this.getOperationFinancingByPage();
        this.getOperationFinancingTaxByPage();
        this.getOperationProductByPage();
        this.getOperationSpotcheckByPage();
        this.getOperationTenderInfoByPage();
        this.getOperationRecruitInfoByPage();
    },
    methods: {
        // 获取融资信息
        getOperationFinancingByPage() {
            this.financingData.loading = true;
            Api_getBasicInfo(23, {
                companyId: this.companyId,
                companyName: this.companyName,
                pageNo: this.financingData.pageNo,
                pageSize: this.financingData.pageSize
            })
                .then(res => {
                    if (res) {
                        this.financingData.result = res.result;
                        this.financingData.totalRecords = res.totalRecords;
                    } else {
                        this.financingData.result = [];
                        this.financingData.totalRecords = 0;
                    }
                })
                .finally(() => {
                    this.financingData.loading = false;
                });
        },
        // 获取财务总览信息
        getOperationFinancingTaxByPage() {
            this.financingTaxData.loading = true;
            Api_getBasicInfo(24, {
                companyId: this.companyId,
                companyName: this.companyName,
                pageNo: this.financingTaxData.pageNo,
                pageSize: this.financingTaxData.pageSize
            })
                .then(res => {
                    if (res) {
                        this.financingTaxData.result = res.result;
                        this.financingTaxData.totalRecords = res.totalRecords;
                    } else {
                        this.financingTaxData.result = [];
                        this.financingTaxData.totalRecords = 0;
                    }
                })
                .finally(() => {
                    this.financingTaxData.loading = false;
                });
        },
        // 获取产品信息
        getOperationProductByPage() {
            this.productData.loading = true;
            Api_getBasicInfo(25, {
                companyId: this.companyId,
                companyName: this.companyName,
                pageNo: this.productData.pageNo,
                pageSize: this.productData.pageSize
            })
                .then(res => {
                    if (res) {
                        this.productData.result = res.result;
                        this.productData.totalRecords = res.totalRecords;
                    } else {
                        this.productData.result = [];
                        this.productData.totalRecords = 0;
                    }
                })
                .finally(() => {
                    this.productData.loading = false;
                });
        },
        // 获取抽查信息
        getOperationSpotcheckByPage() {
            this.spotcheckData.loading = true;
            Api_getBasicInfo(26, {
                companyId: this.companyId,
                companyName: this.companyName,
                pageNo: this.spotcheckData.pageNo,
                pageSize: this.spotcheckData.pageSize
            })
                .then(res => {
                    if (res) {
                        this.spotcheckData.result = res.result;
                        this.spotcheckData.totalRecords = res.totalRecords;
                    } else {
                        this.spotcheckData.result = [];
                        this.spotcheckData.totalRecords = 0;
                    }
                })
                .finally(() => {
                    this.spotcheckData.loading = false;
                });
        },
        // 获取招投标信息
        getOperationTenderInfoByPage() {
            this.tenderInfoData.loading = true;
            Api_getBasicInfo(19, {
                companyId: this.companyId,
                companyName: this.companyName,
                pageNo: this.tenderInfoData.pageNo,
                pageSize: this.tenderInfoData.pageSize
            })
                .then(res => {
                    if (res) {
                        this.tenderInfoData.result = res.result;
                        this.tenderInfoData.totalRecords = res.totalRecords;
                    } else {
                        this.tenderInfoData.result = [];
                        this.tenderInfoData.totalRecords = 0;
                    }
                })
                .finally(() => {
                    this.tenderInfoData.loading = false;
                });
        },
        // 获取招聘类信息
        getOperationRecruitInfoByPage() {
            this.recruitInfoData.loading = true;
            Api_getBasicInfo(17, {
                companyId: this.companyId,
                companyName: this.companyName,
                pageNo: this.recruitInfoData.pageNo,
                pageSize: this.recruitInfoData.pageSize
            })
                .then(res => {
                    if (res) {
                        this.recruitInfoData.result = res.result;
                        this.recruitInfoData.totalRecords = res.totalRecords;
                    } else {
                        this.recruitInfoData.result = [];
                        this.recruitInfoData.totalRecords = 0;
                    }
                })
                .finally(() => {
                    this.recruitInfoData.loading = false;
                });
        }
    }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
