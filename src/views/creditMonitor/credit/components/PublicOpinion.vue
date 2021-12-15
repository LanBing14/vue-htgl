<template>
    <div>
        <div class="page-header">
            <h1 class="page-name">
                <span>新闻舆情</span>
                <span style="border: 0;color: #4b9df3;font-size: 16px;padding: 6px 0">{{ companyName }}</span>
                <span style="border: 0;color: #4b9df3;font-size: 14px;padding: 6px 0">{{ number }}</span>
            </h1>
            <div>
                <el-button @click="returnMain" size="small">返回</el-button>
            </div>
        </div>
        <div class="page-content">
            <div class="con con10 flex-primary flex">
                <div class="flex-primary flex col">
                    <div style="border-left: 5px solid #4b9df3;padding: 5px 15px;line-height: 25px">情感类型分布</div>
                    <EchartsModelIns
                        ref="echarts1"
                        style="height: 200px"
                        :query="query1"
                        modelId="TB-2004-00016"
                        class="flex-primary"
                    ></EchartsModelIns>
                </div>
                <div class="flex-primary flex col">
                    <div style="border-left: 5px solid #4b9df3;padding: 5px 15px;line-height: 25px">新闻类型分布</div>
                    <EchartsModelIns
                        ref="echarts2"
                        style="height: 200px"
                        :query="query2"
                        modelId="TB-2004-00017"
                        class="flex-primary"
                    ></EchartsModelIns>
                </div>
                <div class="flex-primary flex col">
                    <div style="border-left: 5px solid #4b9df3;padding: 5px 15px;line-height: 25px">新闻趋势分析</div>
                    <EchartsModelIns
                        ref="echarts3"
                        style="height: 200px"
                        :query="query3"
                        modelId="TB-2004-00018"
                        class="flex-primary"
                    ></EchartsModelIns>
                </div>
            </div>
            <div class="con con10 flex-primary flex">
                <div style="width: 66.7%">
                    <div style="border-left: 5px solid #4b9df3;padding: 5px 15px;line-height: 25px">
                        <span>新闻列表</span>
                        <span style="float: right">
                            <el-select v-model="type" @change="changeType" placeholder="请选择">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </span>
                    </div>
                    <div v-for="(item, index) in tableList" :key="index" style="padding-right: 20px">
                        <div style="line-height: 50px">
                            <router-link
                                style="font-size: 18px"
                                tag="a"
                                target="_blank"
                                :to="{name: 'news', query: {id: item.newsBase.newsId, companyId: rowId}}"
                            >
                                {{
                                item.newsBase.title }}
                            </router-link>
                            <!--                            <a href="" @click="test" target="_blank" style="display: inline-block;font-size: 18px;color: #333333">xxxxxxxxxxxxxx</a>-->
                            <span
                                style="font-size: 12px;background: #C1DDF0;color: #4b9df3;border: 1px solid rgba(224, 227, 236, 1);border-radius:2px 2px 2px 2px;padding: 5px 10px"
                            >{{ item.newsBase.negative }}</span>
                        </div>
                        <div style="line-height: 30px">
                            <span
                                style="padding: 5px 10px;background: #F4F4F5;color: #606266;margin-left: 10px"
                                v-for="(item1, index1) in item.newsKeywords"
                                :key="index1"
                            >#{{ item1.keyword }}</span>
                        </div>
                        <div style="line-height: 30px;font-size: 15px;color: #888888">{{ item.newsBase.summary }}</div>
                        <div style="line-height: 30px;font-size: 13px;color: #999999">
                            <span>来源:</span>
                            <span>{{ item.newsBase.siteName }}</span>
                            <span style="margin-left: 20px">发布时间:</span>
                            <span>{{ item.newsBase.publishTime }}</span>
                        </div>
                        <div style="line-height: 30px;font-size: 13px">
                            <span style="color: #999999">相关企业:</span>
                            <span style="color: #4b9df3" v-for="(item2, index2) in item.newsRelations" :key="index2">
                                <span style="margin-left: 20px">{{ item2.companyName }}</span>
                            </span>
                        </div>
                    </div>
                    <el-pagination
                        :total="total"
                        :current-page.sync="currentPage"
                        :page-size.sync="pageSize"
                        @size-change="fetchData"
                        @current-change="fetchData"
                        background
                        layout="prev, pager, next"
                        style="text-align: right;padding-right: 50px"
                    ></el-pagination>
                </div>
                <div style="width: 32.5%">
                    <div style="border-left: 5px solid #4b9df3;padding: 5px 15px;line-height: 25px">关联企业TOP10</div>
                    <el-table :data="tableData" :span-method="spanMethod3" stripe class="table3">
                        <el-table-column label="排名" align="center">
                            <template slot-scope="scope">
                                <span
                                    :class="{['ph-color'+ (scope.$index + 1)]: scope.$index<3}"
                                    class="ph-color"
                                >{{ scope.$index + 1 }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="客户名称" prop="key1">
                            <template slot-scope="scope">
                                <div class="flex">
                                    <span class="flex-primary title-name">{{ scope.row.relationCompanyName }}</span>
                                    <span style="width: 100px;text-align: right">{{ scope.row.zb }}</span>
                                </div>
                                <div class="bar-wrap">
                                    <div class="bar-inner" :style="{width: scope.row.zb}"></div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="关联比例" prop="key2" align="right"></el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import EchartsModelIns from "@/components/EchartsModelIns";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import { Api_GetNewsList, Api_GetTopList } from "@/api/creditManagement/monitoring/monitoring";

export default {
    name: "PubliOpinion",
    components: {
        EchartsModelIns,
        Pagination
    },
    props: {
        rowId: String,
        companyName: String
    },
    data() {
        return {
            query1: {
                id: this.rowId
            },
            query2: {
                id: this.rowId
            },
            query3: {
                id: this.rowId
            },
            tableData: [],
            type: "全部",
            currentPage: 1,
            pageSize: 10,
            tableList: [],
            total: 0,
            options: [
                {
                    value: "全部",
                    label: "全部"
                },
                {
                    value: "正面",
                    label: "正面"
                },
                {
                    value: "中性",
                    label: "中性"
                },
                {
                    value: "负面",
                    label: "负面"
                }
            ],
            number: ""
        };
    },
    mounted() {
        setTimeout(() => {
            this.$refs["echarts1"].resize();
            this.$refs["echarts2"].resize();
            this.$refs["echarts3"].resize();
        }, 1000);
        this.fetchData(1);
        this.getTop();
    },
    methods: {
        returnMain() {
            this.$emit("onChange", true, "");
        },
        spanMethod3({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 1) {
                return [1, 2];
            } else if (columnIndex === 2) {
                return [0, 0];
            }
        },
        fetchData(currentPage) {
            const query = {
                currentPage: currentPage,
                pageSize: this.pageSize,
                type: this.type
            };
            Api_GetNewsList(this.rowId, query)
                .then(res => {
                    if (res.totalRecords > 999) {
                        this.number = "999+++";
                    } else {
                        this.number = res.totalRecords;
                    }
                    this.total = res.totalRecords;
                    this.tableList = res.result;
                })
                .catch(res => {
                    this.$message.error(res);
                });
        },
        getTop() {
            Api_GetTopList({ id: this.rowId })
                .then(res => {
                    this.tableData = res.result;
                })
                .catch(res => {
                    this.$message.error(res);
                });
        },
        changeType() {
            this.fetchData(1);
        }
    }
};
</script>

<style scoped lang="scss">
/deep/ .el-table {
    .ph-color {
        display: inline-block;
        width: 18px;
        height: 18px;
        line-height: 18px;
        text-align: center;
        border-radius: 3px;

        &.ph-color1 {
            background-color: rgba(253, 104, 113, 1);
            color: #fff;
        }

        &.ph-color2 {
            background-color: rgba(248, 155, 55, 1);
            color: #fff;
        }

        &.ph-color3 {
            background-color: rgba(244, 214, 15, 1);
            color: #fff;
        }
    }

    .bar-wrap {
        margin-top: 10px;
        margin-bottom: 3px;
        background-color: rgba(234, 237, 244, 1);
        height: 5px;
        border-radius: 2px;

        .bar-inner {
            width: 0;
            transition: all 0.2s;
            background-color: rgba(132, 202, 255, 1);
            height: 5px;
            border-radius: 2px;
        }
    }

    &.table3 {
        td {
            vertical-align: top;
        }
    }

    &::before {
        content: none;
    }

    tbody .title-name {
        color: rgba(132, 202, 255, 1);
    }
}
</style>
