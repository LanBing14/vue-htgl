<template>
    <div>
        <div class="page-header">
            <h1 class="page-name">
                <span>舆情动态</span>
            </h1>
            <div>
                <el-button @click="openSubscription" size="small" class="btn-color-blue" icon="el-icon-plus">舆情订阅</el-button>
            </div>
        </div>
        <div class="page-content">
            <el-form ref="searchForm" :model="listQuery" :inline="true">
                <el-form-item prop="companyName">
                    <el-input
                        v-model="listQuery.companyName"
                        placeholder="企业名称"
                        class="filter-item"
                        @keyup.enter.native="handleFilter"
                    />
                </el-form-item>
                <el-form-item prop="title">
                    <el-input
                        v-model="listQuery.title"
                        placeholder="新闻标题"
                        class="filter-item"
                        @keyup.enter.native="handleFilter"
                    />
                </el-form-item>
                <el-form-item prop="emotionalType">
                    <el-select v-model="listQuery.emotionalType" placeholder="请选择情感类型">
                        <el-option
                            v-for="item in emotionalOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="comboDate">
                    <el-date-picker
                        v-model="comboDate"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="发布日期起"
                        end-placeholder="发布日期止"
                        value-format="yyyy-MM-dd"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
                    <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset('searchForm')">重置</el-button>
                </el-form-item>
            </el-form>
            <div class="page-content-body">
                <TableWrapper ref="child" :fetchDataFn="Api_GetSentimentList" :query="listQuery" :columns="tableCol" />
            </div>
        </div>
        <Subscription ref="ref_subscription"></Subscription>
    </div>
</template>

<script type="text/jsx">
import Subscription from "./Subscription";
import { Api_GetSentimentList } from "@/api/creditManagement/monitoring/monitoring";

export default {
    name: "Main",
    components: { Subscription },
    data() {
        return {
            Api_GetSentimentList,
            comboDate: [],
            listQuery: {
                companyName: "",
                title: "",
                emotionalType: "",
                information: "",
                beginDate: "",
                endDate: ""
            },
            tableCol: [
                {
                    key: "newsBase",
                    label: "企业名称",
                    props: {
                        "show-overflow-tooltip": true,
                        "min-width": 150
                    },
                    render: (h, data, row) => {
                        return (
                            <div
                                style="color: #4b9df3;cursor: pointer"
                                onClick={this.openPublicOpinion.bind(this, row)}
                            >
                                {data.companyName}
                            </div>
                        );
                    }
                },
                {
                    key: "newsBase",
                    label: "新闻标题",
                    render: (h, data) => {
                        return data.title;
                    }
                },
                {
                    key: "newsBase",
                    label: "情感类型",
                    render: (h, data) => {
                        return data.negative;
                    }
                },
                {
                    key: "newsBase",
                    label: "发布时间",
                    render: (h, data) => {
                        return data.publishTime;
                    }
                },
                {
                    key: "newsBase",
                    label: "新闻来源",
                    render: (h, data) => {
                        return data.siteName;
                    }
                }
            ],
            emotionalOptions: [
                {
                    label: "正面",
                    value: "0"
                },
                {
                    label: "中性",
                    value: "1"
                },
                {
                    label: "负面",
                    value: "2"
                }
            ]
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.listQuery.beginDate = this.comboDate.length > 0 ? this.comboDate[0] : "";
            this.listQuery.endDate = this.comboDate.length > 0 ? this.comboDate[1] : "";
            this.getList();
        });
    },
    methods: {
        // 获取主列表数据
        getList() {
            this.$refs.child.fetchData();
        },
        // 根据查询条件获取数据
        handleFilter() {
            this.getList();
        },
        // 重置查询条件
        handleReset(formName) {
            this.comboDate = [];
            this.$refs[formName].resetFields();
        },
        // 打开舆情订阅
        openSubscription() {
            this.$nextTick(() => {
                this.$refs.ref_subscription.open();
            });
        },
        // 打开新闻舆情
        openPublicOpinion(row) {
            this.$emit("onChange", false, row);
        }
    }
};
</script>

<style scoped>
</style>
