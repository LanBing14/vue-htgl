<template>
    <div class="xinyi-product">
        <div class="product-search">
            <el-input
                placeholder="请输入金融产品名称或合作机构关键词"
                class="font16"
                size="large"
                v-model.trim="searchData.keyword"
                @keyup.enter.native="loadTable()"
            >
                <el-button slot="append" @click="loadTable()"
                    ><svg-icon icon-class="search" />搜索</el-button
                >
            </el-input>
        </div>

        <el-row class="product-condition fxb-table-tool">
            <el-form label-width="100px">
                <el-form-item label="贷款期限：" class="fxb-tag-list">
                    <span class="active">不限</span>
                    <span>3个月以下</span> <span>6个月以下</span>
                    <span>12个月以下</span> <span>36个月以下</span>
                    <span>36个月以上</span>
                </el-form-item>
                <el-form-item label="贷款额度：" class="fxb-tag-list">
                    <span class="active">不限</span>
                    <span>100万以下</span> <span>200万以下</span>
                    <span>300万以下</span> <span>500万以下</span>
                    <span>1000万以下</span> <span>1000万以上</span>
                </el-form-item>
                <el-form-item label="担保方式：" class="fxb-tag-list">
                    <span class="active">不限</span>
                    <span>信用</span> <span>抵押</span> <span>质押</span>
                    <span>担保</span>
                </el-form-item>
            </el-form>
        </el-row>

        <div class="product-list">
            <div class="floatL font12 fxb-999 marB15">
                共为您找到
                <span class="font16 fontwb" style="color: #20a0ff;"> 17 </span
                >个金融产品
            </div>

            <div id="product-table">
                <el-table
                    :data="tableData"
                    style="width: 100%"
                    :show-header="false"
                    v-loading="isLoading"
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
                                <el-tag type="primary" size="small"
                                    >纯信用</el-tag
                                >
                                <el-tag type="danger" size="small"
                                    >周期长</el-tag
                                >
                                <el-tag type="success" size="small"
                                    >无抵押</el-tag
                                >
                            </div>
                            <p>参考利率： {{ scope.row.cklv }}</p>
                            <p>发布机构： {{ scope.row.fbjg }}</p>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template slot-scope="scope">
                            <p class="marT15">
                                贷款期限： {{ scope.row.dkqx }}
                            </p>
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

                <el-pagination
                    class="fxb-page"
                    v-show="totalRecords > 0"
                    :total="totalRecords"
                    :page-size="searchData.pageSize"
                    :current-page.sync="searchData.pageNo"
                    @current-change="pageChange"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { dateFormat } from "@/utils/index";

export default {
    filters: { dateFormat },
    data() {
        return {
            isLoading: false,
            searchData: {
                keyword: "",
                pageNo: 1,
                pageSize: 10
            },
            tableData: [
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
                    id: 2,
                    name: "小微企业创业贷",
                    edu: "300 - 500万元",
                    dbfs: "信用",
                    cklv: "5.27% - 7.0%(年化)",
                    fbjg: "建设银行苏州分行",
                    dkqx: "6-12个月"
                },
                {
                    id: 3,
                    name: "小微企业创业贷",
                    edu: "300 - 500万元",
                    dbfs: "信用",
                    cklv: "5.27% - 7.0%(年化)",
                    fbjg: "建设银行苏州分行",
                    dkqx: "6-12个月"
                },
                {
                    id: 4,
                    name: "小微企业创业贷",
                    edu: "300 - 500万元",
                    dbfs: "信用",
                    cklv: "5.27% - 7.0%(年化)",
                    fbjg: "建设银行苏州分行",
                    dkqx: "6-12个月"
                },
                {
                    id: 5,
                    name: "小微企业创业贷",
                    edu: "300 - 500万元",
                    dbfs: "信用",
                    cklv: "5.27% - 7.0%(年化)",
                    fbjg: "建设银行苏州分行",
                    dkqx: "6-12个月"
                }
            ],
            totalRecords: 100 // 经过处理的查询总量
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
#product-table {
    .el-table tr:nth-child(2n-1) {
        background-color: #f7f8fa;
    }
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
.product-search {
    input {
        border: 0;
        height: 52px;
        padding: 5px 40px;
    }
    .el-input-group__append {
        width: 130px;
        border: 0;
        background-color: #fff;
        left: 5px;
        text-align: right;
        position: relative;
        span {
            font-size: 20px;
            color: #000;
        }
        svg {
            position: absolute;
            bottom: 5px;
            left: 20px;
            font-size: 35px;
            transform: rotate(45deg);
            -ms-transform: rotate(45deg); /* IE 9 */
            -moz-transform: rotate(45deg); /* Firefox */
            -webkit-transform: rotate(45deg); /* Safari 和 Chrome */
            -o-transform: rotate(45deg); /* Opera */
        }
    }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.cGreyC {
    color: #6e87a3;
}
.advance-container {
    height: 100%;
}
.product-search {
    padding: 40px 150px;
}
.product-list {
    background-color: #ffffff;
    padding: 30px;
    margin-bottom: 40px;
    #product-table {
        .el-table .cell {
            h2 {
                cursor: pointer;
            }
            p {
                line-height: 25px;
            }
            .company-tags {
                margin-left: -58px;
            }
        }
    }
}
.fxb-tag-list span {
    display: inline-block;
    line-height: 30px;
    padding: 0 10px;
    border-radius: 5px;
    margin-right: 20px;
    cursor: pointer;
}
.fxb-tag-list span:first-child.active {
    color: #20a0ff;
}
.fxb-tag-list span:not(:first-child):hover,
.fxb-tag-list span:not(:first-child).active {
    color: #fff;
    background-color: #20a0ff;
}
.fxb-tag-list.sub {
    background-color: #f7f8fb;
}
</style>
