<template>
    <div>
        <el-row style="margin:0px 10px">
            <el-col :span="24">
                <h2 class="add-title">{{ $route.params.groupType == 0 ? "客户":"供应商" }}信息维护</h2>
            </el-col>
        </el-row>
        <!-- 企业名称、统一社会信用代码、查看详情（链接）、法定代表人、所属行业、成立时间、列入时间、信用评价等级； -->
        <el-row :gutter="20" class="infomaintain-top-panel" v-loading="loading">
            <el-col :span="8">
                <div>
                    <span>企业名称：</span>
                    {{ companyInfo.name }}
                    <br/>
                    <span></span>
                    {{ companyInfo.creditCode }}
                </div>
                <div>
                    <span>成立时间：</span>
                    {{ companyInfo.startDate }}
                </div>
            </el-col>
            <el-col :span="5">
                <div>
                    <router-link
                        :to="{path:'/creditFile/creditEval', query: {id: companyInfo.companyId, creditCode: companyInfo.creditCode}}"
                        target="_blank"
                    >
                        <span style="color:#1478f0;">查看详情</span>
                    </router-link>
                    <!--                <a :href="'http://' + companyInfo.website"  target="_blank"></a>-->
                    <br/>
                    <span>法定代表人：</span>
                    {{ companyInfo.operName }}
                </div>
                <div>
                    <span>列入时间：</span>
                    {{ companyInfo.updatedDate }}
                </div>
            </el-col>
            <el-col :span="7">
                <span>所属行业：</span>
                {{ companyInfo.subIndustry }}
            </el-col>
            <el-col :span="4" align="right">
                <div class="level-panel" v-loading="leloading">
                    <h2>{{ level }}</h2>
                    <h4>信用等级</h4>
                </div>
            </el-col>
        </el-row>
        <InfoMaintainTab/>
    </div>
</template>

<script>
    import {
        Api_getCreditScore,
        Api_getCteditCompanyInfo
    } from "@/api/advanceSearch";
    import InfoMaintainTab from "./InfoMaintainTab.vue";

    export default {
        components: {
            InfoMaintainTab
        },
        data() {
            return {
                loading: false,
                companyInfo: "",
                leloading: false,
                level: "0"
            };
        },
        mounted() {
            if (this.$route.params.comid) {
                this.leloading = true;
                Api_getCreditScore({companyId: this.$route.params.comid}).then(res => {
                    this.leloading = false;
                    this.level = res.level;
                }).catch(() => {
                    this.leloading = false;
                });
                Api_getCteditCompanyInfo({
                    companyId: this.$route.params.comid
                }).then(res => {
                    this.loading = false;
                    this.companyInfo = res.result[0];
                }).catch(() => {
                    this.loading = false;
                });
            } else {
                this.$message.warning("获取银行账户信息失败");
            }
        },
        methods: {}
    };
</script>

<style lang="scss" scoped>
    .cGrey {
        color: #c0c4cc;
    }

    .fl {
        float: right;
    }

    .add-title {
        font-size: 20px;
        font-weight: 600;
    }

    .infomaintain-top-panel {
        margin-left: 30px !important;
        margin-bottom: 30px !important;
        padding-top: 25px;
        line-height: 28px;

        span {
            display: inline-block;
            width: 85px;
        }

        .level-panel {
            width: 80px;
            margin-right: 10px;
            border-radius: 3px;
            border: 1px solid #ddd;
            color: #1478f0;
            text-align: center;

            h2 {
                padding: 15px 0 8px;
            }
        }
    }
</style>
