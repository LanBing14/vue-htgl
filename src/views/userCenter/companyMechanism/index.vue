<template>
    <div class="notice-content-wrapper">
        <div class="title-name">
            <span class="name-1"></span>
            <!-- <span class="name-back">返回</span> -->
        </div>
        <p class="title-mechanism">当前所属机构：{{name}}</p>
        <p class="title1-mechanism">所属机构列表</p>
        <div class="mechanism-list">
            <div class="mechanism-list-item " v-for="(item,index) in mechanismList"  :key="item.id"   :class="{active: item.id === currentId}" @click="handleClick(item.id)">
                <p class="list-name">{{ item.name }}</p>
                <p class="list-time">{{ item.rzTimeBegin }} ~ {{item.rzTimeEnd}}</p>
            </div>
        </div>
    </div>
</template>
<script>
     import {Api_GetMechainList,Api_GetCurrentMechain} from "@/api/creditManagement/companyMechanism/index"
    export default {
        data() {
           return {
               currentId:0,
               name:'',
               mechanismList:[],
           }
        },
        computed: {
            companyId(){
               return this.$store.getters.userInfo.companyId
            },
        },
        methods: {
            handleClick(id){
                this.currentId = id
            },
        },
        created() {
            Api_GetCurrentMechain(this.companyId).then(res=>{
                if (res){
                    this.name = res.name
                }
              
            }).catch(err=>{
                this.$message.error(err);
            })
            Api_GetMechainList(this.companyId).then(res=>{
                if (res){
                    this.mechanismList = res
                }
               
            }).catch(err=>{
                this.$message.error(err);
            })
           
        },
    }
</script>
<style lang="scss" scoped>
.notice-content-wrapper{
    padding: 12px 25px;
    background-color: #fff;

    .page-mechanism {
        text-align: right;
        margin-top: 15px;
    }
    .title-name {
        margin-bottom: 20px;
        .name-1 {
            height: 42px;
            display:inline-block;
            line-height: 42px;
            font-size: 16px;
            border-bottom: 2px solid $light-blue;
        }
        .name-back{
            padding: 6px 14px;
            float: right;
            border: 1px solid #dcdfe6;
            border-radius: 4px;
            color: #606266;
        }
    }
    .title-mechanism {
        line-height: 45px;
        font-size: 14px;
        color: #333;
        background: #f4f4f5;
        padding-left: 20px;
        border: 1px solid #eaedf4;
        margin-bottom: 15px;
    }
    .title1-mechanism {
        line-height: 54px;
        font-size: 16px;
        color: #606266;
    }

    .mechanism-list {

        .mechanism-list-item.active{
            background-color: #f5f7fa;
        }
        .mechanism-list-item {
            height: 43px;
            line-height: 43px;
            padding: 0 40px;
            border-top: 1px solid #eaedf4;
            border-left: 1px solid #eaedf4;
            border-right: 1px solid #eaedf4;
            .list-name {
                float: left;
                font-size: 15px;
                color: #606266;
            }
            .list-time {
                float: right;
                font-size: 14px;
                color: #666666;
            }
        }

        .mechanism-list-item:last-child{
            border-bottom:1px solid #eaedf4 ;
        }
    }
}
</style>