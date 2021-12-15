<template>
    <div class="serve-content-wrapper">
        <div class="title-name">
            <span class="name-1">物业报修</span>
        </div>
        <el-form ref="searchForm" :model="listQuery" :inline="true">
            <el-form-item prop="noticeTitle">
              <el-input v-model="listQuery.noticeTitle" placeholder="报修房间" class="filter-item"  @keyup.enter.native="handleFilter"/>
            </el-form-item>
            <el-form-item prop="comboDate">
                <el-date-picker
                v-model="comboDate"
                type="date"
                placeholder="报修日期"></el-date-picker>
            </el-form-item>
            <el-form-item class="btns">
              <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
              <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset('searchForm')">重置</el-button>
            </el-form-item>
          </el-form>
        <p class="title1-mechanism">物业报修列表</p>
        <div class=" clearfix tabWrap">
            <p class=" is-active " @click='searchStatus($event,"")'>全部</p>
            <p @click='searchStatus($event,"1")'>未处理</p>
            <p @click='searchStatus($event,"2")'>已处理</p>
        </div>
        <TableWrapper
           ref="child" 
           :fetchDataFn="Api_GetNoticeList"
           :query="listQuery"
           :columns="tableCol"
        />
    </div>
</template>
<script>
    import {Api_GetNoticeList} from "@/api/creditManagement/companyNotice/index";
    export default {
        data() {
           return {
            comboDate: '',
            listQuery: {
                noticeTitle: '',
                pushTimeBegin : '',
                reportEndDate:''
            },
            tableCol: [
                {
                    key: "noticeTitle",
                    label: "报修内容",
                    width: 150,
                    render: (h, data, row) => {
                        return (
                          2
                        );
                    }
                },
                {
                    key: "createDate",
                    label: "报修房间",
                    align: "left",
                },
                {
                    key: "createDate",
                    label: "报修时间",
                    align: "left",
                },
                {
                    key: "status",
                    label: "报修状态",
                    align: "left",
                },
                {
                    key: null,
                    label: "操作",
                    render: (h, data, row) => {
                        return (
                            <span class="btn-see" style="color: #409eff"  onClick={this.handleSee.bind(this, row)}>查看</span>
                        );
                    }
                }
            ],
           }
        },
        computed: {
           
        },
        methods: {
            handleSee(row) {
                this.$emit("edit", true, 1, row);
            },      
            Api_GetNoticeList,
            handleFilter(){},
            handleReset(formName){
                this.$refs[formName].resetFields();
                this.comboDate = []
                this.listQuery = {
                    reportName: '',
                    reportStartDate:'',
                    reportEndDate:'',
                    status:''
                }
                // this.getList()
            },
            handleClick(){
                this.getList()
            },
            searchStatus(event, id) {
                var divAll = document.getElementsByClassName('tabWrap')[0].children;
                for (var i = 0; i < divAll.length; i++) {
                    divAll[i].className = ""
                }
                event.target.className = 'is-active';
                // this.getList(id)
            },
        },
        mounted() {
            this.$nextTick(() => {
                this.$refs.child.fetchData();
            });
          
        },
    }
</script>
<style lang="scss" scoped>
.serve-content-wrapper{
    padding: 12px 25px;
    background-color: #fff;
    /deep/ .el-input__inner {
        line-height: 30px;
        height: 30px;
    }
    /deep/ .el-button{
        padding: 7px 20px;
    }
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
    .title1-mechanism {
        line-height: 54px;
        font-size: 16px;
        color: #606266;
    }
    .tabWrap {
        display: flex;
        margin-bottom: 10px;
        p.is-active {
            color: $light-blue;
        }

        p {
            margin-right: 38px;
            line-height: 30px;
            cursor: pointer;
        }
    }
  
}
</style>