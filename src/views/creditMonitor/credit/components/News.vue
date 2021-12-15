<template>
    <el-container>
        <el-header>
            <FxbHeader/>
        </el-header>
        <el-main style="padding-bottom: 50px;">
            <el-col :span="22" style="padding: 0 30px;background: #fff">
                <div class="page-header">
                    <h1 class="page-name">
                        <span>新闻详情</span>
                    </h1>
                </div>
                <div class="page-content">
                    <div class="con con10 flex-primary flex">
                        <div class="flex-primary flex col" style="padding: 10px 20px;border: 1px solid">
                            <div style="border-left: 5px solid #4b9df3;padding: 5px 15px">新闻列表</div>
                            <div style="line-height: 50px">
                                <div style="display: inline-block;font-size: 22px;color: #333333">{{ infoData.title }}</div>
                                <span
                                    style="font-size: 12px;background: #C1DDF0;color: #4b9df3;border: 1px solid rgba(224, 227, 236, 1);border-radius:2px 2px 2px 2px;padding: 5px 10px">{{ infoData.negative }}</span>
                            </div>
                            <div style="line-height: 30px;font-size: 13px;color: #999999">
                                <span>来源:</span>
                                <span>{{ infoData.siteName }}</span>
                                <span style="margin-left: 20px">发布时间:</span>
                                <span>{{ infoData.publishTime }}</span>
                            </div>
                            <div style="line-height: 40px">
                                <span style="padding: 5px 10px;background: #F4F4F5;color: #606266" v-for="(item, index) in newsKeywords" :key="index">#{{ item.keyword }}</span>
                            </div>
                            <div v-html="infoData.contentXml" style="font-size: 15px;color: #888888"></div>
                        </div>
                        <div class="flex-primary flex col" style="flex: 0.5">
                            <div style="margin-left: 20px;padding: 10px 20px;border: 1px solid">
                                <div style="border-left: 5px solid #4b9df3;padding: 5px 15px">关联企业</div>
                                <div class="newStyle">
                                    <div v-for="(newsRelations, index) in newsRelations" :key="index" style="line-height: 35px">
                                        <router-link
                                            :to="{path:'/creditFile/creditEval', query: {id: newsRelations.companyId}}"
                                            target="_blank">
                                            {{ newsRelations.companyName }}
                                        </router-link>
                                    </div>
                                </div>
                            </div>
                            <div style="margin-left: 20px;padding: 10px 20px;border: 1px solid;margin-top: 20px">
                                <div style="border-left: 5px solid #4b9df3;padding: 5px 15px">最新舆情</div>
                                <div class="newStyle">
                                    <div v-for="(tableList, index) in tableList" :key="index" @click="getInfo(tableList.newsBase.newsId)" style="line-height: 35px">{{ tableList.newsBase.title }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-main>
        <el-footer>
            <FxbFooter/>
        </el-footer>
    </el-container>
</template>

<script>
    import FxbHeader from "@/views/layouts/fxb/components/FxbHeader";
    import FxbFooter from "@/views/layouts/fxb/components/FxbFooter";
    import {
        Api_GetNewsInfo,
        Api_GetNewsList
    } from "@/api/creditManagement/monitoring/monitoring"

    export default {
        name: "News",
        components: {
            FxbHeader,
            FxbFooter
        },
        data() {
            return {
                id: '',
                companyId: '',
                infoData: {},
                newsKeywords: [],
                newsRelations: [],
                tableList: []
            };
        },
        mounted() {
            this.id = this.$route.query.id;
            this.companyId = this.$route.query.companyId;
            this.getInfo(this.id)
        },
        methods: {
            getInfo(id) {
                Api_GetNewsInfo(id).then(res => {
                    this.infoData = res.result.newsBase;
                    this.newsKeywords = res.result.newsKeywords;
                    this.newsRelations = res.result.newsRelations;
                }).catch(res => {
                    this.$message.error(res)
                });
                const query = {
                    currentPage: 1,
                    pageSize: 5,
                    type: '全部'
                };
                Api_GetNewsList(this.companyId, query).then(res => {
                    this.tableList = res.result
                }).catch(res => {
                    this.$message.error(res)
                })
            }
        }
    }
</script>

<style scoped>
    .el-container {
        height: 100% !important;
    }
    .newStyle {
        margin-top: 20px;
    }
    .newStyle>div:nth-child(odd) {
        background: #E0E3EC;
    }
</style>
