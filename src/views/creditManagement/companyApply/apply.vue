<template>
    <div class="apply-wrapper">
        <div class="title-name">
            <span class="name-1">征集信息</span>
            <!-- <span class="name-back">返回</span> -->
        </div>
        <div class="clearfix">
            <div class="fr clearfix">
                <el-form ref="searchForm" :model="listQuery" :inline="true" style="margin-bottom: 20px;">
                    <el-form-item prop="customerName">
                        <el-input v-model="listQuery.reportName" placeholder="征集标题" class="filter-item" />
                    </el-form-item>
                    <el-form-item prop="comboDate">
                        <el-date-picker v-model="comboDate" type="daterange" range-separator="-"
                            value-format="yyyy-MM-dd" start-placeholder="征集下发开始时间" end-placeholder="征集下发结束时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item class="btns">
                        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleClick">查询</el-button>
                        <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset('searchForm')">重置 </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="fl clearfix tabWrap">
                <p class=" is-active " @click='searchStatus($event,"")'>全部</p>
                <p @click='searchStatus($event,"1")'>未填报</p>
                <p @click='searchStatus($event,"2")'>已填报</p>
                <p @click='searchStatus($event,"5")'>已驳回</p>
            </div>
        </div>
        <el-row :gutter="20">
            <el-col :span="6" v-for="(item,index) in applyList" :key="item.id">
                <div class="apply-list-item" @click="handleApply(item)">

                    <div class="list-title clearfix">
                        <img src="../../../assets/enterprise-images/pen.png" alt="">
                        <span class="apply-theme">{{item.declarationSubject}}</span>
                    </div>
                    <div class="list-content">
                        {{item.declarationExplain}}
                    </div>
                    <div class="status_wrap">
                        <span class="list-status-no" v-if="item.status == 1">未填报</span>
                        <span class="list-status" v-if="item.status == 2">已填报</span>
                        <span class="list-status" v-if="item.status == 3">审核通过</span>
                        <span class="list-status no-status"  v-if="item.status == 4">审核不通过</span>
                        <span class="list-status-return" v-if="item.status == 5">已驳回</span>
                    </div>
                    <div class="list-time">
                        下发日期： {{item.createTime}}
                    </div>
                </div>
            </el-col>
        </el-row>
        <img src="../../../assets/images/bg/no.jpg" alt="" v-if="isImgHide" style="margin: 0 auto;display: block;">
    </div>
</template>
<script>
    import {Api_GetApplyList,Api_pushApplyRead, Api_genFill} from "@/api/creditManagement/companyApply/index";
    export default {
        data() {
            return {
                comboDate: [],
                applyList:[],
                isImgHide: false,
                listQuery: {
                    reportName: '',
                    reportStartDate:'',
                    reportEndDate:'',
                    status:''
                }
            }
        },
        methods: {
            getLocalTime(nS) {
                return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
            },
            handleReset(formName){
                this.$refs[formName].resetFields();
                this.comboDate = []
                this.listQuery = {
                    reportName: '',
                    reportStartDate:'',
                    reportEndDate:'',
                    status:''
                }
                this.getList()
            },
            handleClick(){
                this.getList()
            },
            handleApply(item){
                // 先执行一下生成申报记录的方法，然后再跳转
                Api_genFill(item.id, item.declarationId).then((result)=>{
                    item.id = result;
                    // 已读接口
                    Api_pushApplyRead(item.id).then(res=>{
                    })
                    this.$emit('handleFromApply',item)
                })
            },
            searchStatus(event, id) {
                var divAll = document.getElementsByClassName('tabWrap')[0].children;
                for (var i = 0; i < divAll.length; i++) {
                    divAll[i].className = ""
                }
                event.target.className = 'is-active';
                this.getList(id)
            },
             getList(statusId){
                this.listQuery.reportStartDate = this.comboDate.length > 0 ? this.comboDate[0] : "";
                this.listQuery.reportEndDate = this.comboDate.length > 0 ? this.comboDate[1] : "";
                this.listQuery.status  = statusId
                Api_GetApplyList(this.listQuery).then(result=>{
                    this.applyList = result
                    if( this.applyList.length == 0) {
                       this.isImgHide = true
                    } else {
                       this.isImgHide = false
                    }

                })
            }
        },
        created() {
            this.getList()
        },
    }
</script>
<style lang="scss" scoped>
    .apply-wrapper {
        background-color: #fff;

        .title-name {
            margin-bottom: 20px;

            .name-1 {
                display: inline-block;
                font-size: 16px;
                padding-bottom: 11px;
                padding-top: 3px;
                border-bottom: 2px solid $light-blue;
            }

            .name-back {
                padding: 6px 14px;
                float: right;
                border: 1px solid #dcdfe6;
                border-radius: 4px;
                color: #606266;
            }
        }



        .tabWrap {
            display: flex;

            p.is-active {
                color: $light-blue;
            }

            p {
                margin-left: 30px;
                line-height: 30px;
                cursor: pointer;
            }
            p:first-child{
                margin-left:0px;
            }
        }

        .apply-list-item {
            border: dashed 1px #dcdfe6;
            background-color: #fcfcfc;
            border-radius: 6px;
            padding:  20px;
            margin-bottom: 20px;
            height: 220px;
            position: relative;
            cursor: pointer;

            .status_wrap{
                display: flex;
                margin-top: 10px;
            }

            .list-title {
                margin-bottom:10px;
                display: flex;
                line-height: 26px;
                height: 52px;
                img {
                    margin-right: 8px;
                    float: left;
                    width: 16px;
                    height: 12px;
                    margin-top: 8px;
                }
                .apply-theme {
                    color: #5f7b9a;
                    font-size: 16px;
                    font-weight: 700;
                    float: left;
                    display:-webkit-box;
                    -webkit-box-orient:vertical;
                    -webkit-line-clamp:2;//控制行数
                    overflow:hidden;
                    word-break: break-all;

                }

            }

            .list-content {
                font-family: MicrosoftYaHei;
	            font-size: 14px;
                height: 48px;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp:2;
                word-break: break-all;
                overflow: hidden;
               	line-height: 24px;
                color: #888888;
                font-size: 14px;
            }

            .list-time{
                line-height: 24px;
                margin-top: 16px;
                font-size: 13px;
                color: #c0c4cc;
            }

            .list-status{
                padding: 5px 9px;
                background: #67c23a;
                color: #fff;
                border-radius: 3px;
            }
            .no-status{
                 background: #e6a23c;
            }
            .list-status-return{
                padding: 5px 9px;
                background: #f56c6c;
                color: #fff;
                border-radius: 3px;
            }
            .list-status-no{
                padding: 5px 9px;
                background: #409eff;
                color: #fff;
                border-radius: 3px;
            }
        }
        .apply-list-item:nth-child(4n) {
            margin-right: 0px;
        }
    }
</style>
