<template>
    <div class="xinyi-product-detail">
        <div class="overH">
            <span class="font20 fontwb">基本信息</span>
            <router-link
                class="fxb-blue floatR"
                :to="'/xinYiLoan/productList'"
                target="_self"
                >返回产品列表
            </router-link>
        </div>
        <el-row id="product-info" v-loading="isLoading">
            <el-table
                :data="tableData"
                style="width: 100%"
                :show-header="false"
            >
                <el-table-column align="center" width="200">
                    <template slot-scope="scope" class="company-img">
                        <img
                            src="../../assets/images/clogo.jpg"
                            alt="logo"
                            width="130"
                            height="48"
                        />
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot-scope="scope" class="company-info">
                        <router-link
                            :to="{
                                path: '/xinYiLoan/productDetail',
                                query: { id: scope.row.id }
                            }"
                            target="_self"
                        >
                            <h2 class="marB15 fontwb cGreyC">
                                {{ scope.row.name }}
                            </h2>
                        </router-link>
                        <p>贷款额度： {{ scope.row.edu }}</p>
                        <p>担保方式： {{ scope.row.dbfs }}</p>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot-scope="scope">
                        <div class="company-tags marB15">
                            <el-tag type="primary" size="small">纯信用</el-tag>
                            <el-tag type="danger" size="small">周期长</el-tag>
                            <el-tag type="success" size="small">无抵押</el-tag>
                        </div>
                        <p>参考利率： {{ scope.row.cklv }}</p>
                        <p>发布机构： {{ scope.row.fbjg }}</p>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot-scope="scope">
                        <p class="marT15">贷款期限： {{ scope.row.dkqx }}</p>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot-scope="scope">
                        <el-button
                            @click="goApply(scope.row)"
                            type="primary"
                            size="medium"
                        >
                            立即申请
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row class="info-introduce">
                <el-col :span="24" class="marB20">
                    <el-col :span="4" class="font16 lineH30" align="center">
                        产品简介:
                    </el-col>
                    <el-col :span="20" class="fxb-666 lineH30">
                        小微创业贷是由省财政支持,省工行开发的服务于江苏小微企业创业,创新发展的一款融资产品.
                        该产品是以江苏小微企业创业创新发展融资基金作为增信手段,按照一定放大倍数对小微企业发放贷款,
                        解决企业成长发展过程中正常生产经营所需资金的一项融资业务.
                    </el-col>
                </el-col>
                <el-col :span="24" class="marB20">
                    <el-col :span="4" class="font16 lineH30" align="center">
                        产品特点:
                    </el-col>
                    <el-col :span="20" class="fxb-666 lineH30">
                        1.受众广：符合“四有”要求客户。即有适销对路的产品及合同(订单)，有稳定的现金流(银行流水单)，有健全的财务会记合算(账表齐全)，有正常的纳税记录
                        <br />
                        2.成本低：除贷款利率外无其他担保费
                        <br />
                        3.额度高：最高可达500万
                    </el-col>
                </el-col>
                <el-col :span="24" class="marB20">
                    <el-col :span="4" class="font16 lineH30" align="center">
                        申请条件:
                    </el-col>
                    <el-col :span="20" class="fxb-666 lineH30">
                        1.具备申办理工行信贷业务的基本条件
                        <br />
                        2.借款人信用等级A级(含)以上
                        <br />
                        3.在工行开立基本结算账户或一般结算账户
                        <br />
                        4.贷款行的其他要求
                    </el-col>
                </el-col>
            </el-row>
        </el-row>
        <div class="marT30 marB30">
            <span class="font20 fontwb">产品推荐</span>
        </div>
        <el-row :gutter="35" v-loading="isLoading">
            <el-col :span="6" v-for="(item, key) in recomData" :key="key">
                <div class="product-recom marB25">
                    <router-link
                        :to="{
                            path: '/xinYiLoan/productDetail',
                            query: { id: item.id }
                        }"
                        target="_self"
                    >
                        <h2 class="font18 marB15 fontwb cGreyC">
                            {{ item.name }}
                        </h2>
                    </router-link>
                    <div class="company-tags marB15">
                        <el-tag type="primary" size="small">纯信用</el-tag>
                        <el-tag type="danger" size="small">周期长</el-tag>
                        <el-tag type="success" size="small">无抵押</el-tag>
                    </div>
                    <p>贷款额度： {{ item.edu }}</p>
                    <p>担保方式： {{ item.dbfs }}</p>
                    <p>参考利率： {{ item.cklv }}</p>
                    <p>发布机构： {{ item.fbjg }}</p>
                    <p>贷款期限： {{ item.dkqx }}</p>
                    <el-button
                        class="marT15"
                        @click="goApply(item)"
                        type="primary"
                        size="medium"
                    >
                        立即申请
                    </el-button>
                </div>
            </el-col>
        </el-row>
        <el-pagination
            class="fxb-page"
            v-show="totalRecords > 0"
            :total="totalRecords"
            :page-size="pageSize"
            :current-page.sync="pageNo"
            @current-change="pageChange"
        />
    </div>
</template>
<script>
import { dateFormat } from "@/utils/index";

export default {
    filters: { dateFormat },
    data() {
        return {
            isLoading: false,
            tableData: [
                {
                    id: 1,
                    name: "小微企业创业贷",
                    edu: "300 - 500万元",
                    dbfs: "信用",
                    cklv: "5.27% - 7.0%(年化)",
                    fbjg: "建设银行苏州分行",
                    dkqx: "6-12个月"
                }
            ],
            pageNo: 1,
            pageSize: 1,
            recomData: [
                {
                    id: 1,
                    name: "小微企业创业贷",
                    edu: "300 - 500万元",
                    dbfs: "信用",
                    cklv: "5.27% - 7.0%(年化)",
                    fbjg: "建设银行苏州分行",
                    dkqx: "6-12个月"
                },
                {
                    id: 1,
                    name: "小微企业创业贷",
                    edu: "300 - 500万元",
                    dbfs: "信用",
                    cklv: "5.27% - 7.0%(年化)",
                    fbjg: "建设银行苏州分行",
                    dkqx: "6-12个月"
                },
                {
                    id: 1,
                    name: "小微企业创业贷",
                    edu: "300 - 500万元",
                    dbfs: "信用",
                    cklv: "5.27% - 7.0%(年化)",
                    fbjg: "建设银行苏州分行",
                    dkqx: "6-12个月"
                },
                {
                    id: 1,
                    name: "小微企业创业贷",
                    edu: "300 - 500万元",
                    dbfs: "信用",
                    cklv: "5.27% - 7.0%(年化)",
                    fbjg: "建设银行苏州分行",
                    dkqx: "6-12个月"
                },
                {
                    id: 1,
                    name: "小微企业创业贷",
                    edu: "300 - 500万元",
                    dbfs: "信用",
                    cklv: "5.27% - 7.0%(年化)",
                    fbjg: "建设银行苏州分行",
                    dkqx: "6-12个月"
                },
                {
                    id: 1,
                    name: "小微企业创业贷",
                    edu: "300 - 500万元",
                    dbfs: "信用",
                    cklv: "5.27% - 7.0%(年化)",
                    fbjg: "建设银行苏州分行",
                    dkqx: "6-12个月"
                }
            ],
            totalRecords: 100
        };
    },
    methods: {
        loadTable() {},
        goApply(item) {
            this.$router.push({
                path: "/xinYiLoan/xinYiStep",
                query: item
            });
        },
        pageChange() {}
    }
};
</script>

<style rel="stylesheet/scss" lang="scss">
#product-info {
    .el-table .cell {
        overflow: inherit;
    }
    .el-table th,
    .el-table td {
        padding: 25px 0;
    }
    .el-table th.is-leaf,
    .el-table td {
        border-bottom: 0;
    }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.cGreyC {
    color: #6e87a3;
}
.lineH30 {
    line-height: 30px;
}
.advance-container {
    height: 100%;
}
.xinyi-product-detail {
    padding: 30px;
    background-color: #fff;
}
#product-info {
    padding: 15px;
    margin-bottom: 40px;
    .el-table .cell {
        p {
            line-height: 25px;
        }
        .company-tags {
            margin-left: -58px;
        }
    }

    .info-introduce {
        padding: 30px;
        background-color: #ebeef5;
    }
}
.product-recom {
    padding: 30px;
    background-color: #fcfcfc;
    border: 1px solid #ebeef5;
    p {
        line-height: 25px;
    }
}
</style>
