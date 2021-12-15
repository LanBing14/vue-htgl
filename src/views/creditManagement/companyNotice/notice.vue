<template>
    <div class="notice-content-wrapper">
      <div class="title-name">
        <span class="name-1">企业通知</span>
        <!-- <span class="name-back">返回</span> -->
      </div>
  
      <el-form ref="searchForm" :model="listQuery" :inline="true">
        <el-form-item prop="noticeTitle">
          <el-input v-model="listQuery.noticeTitle" placeholder="通知标题" class="filter-item"  @keyup.enter.native="handleFilter"/>
        </el-form-item>
        <el-form-item prop="comboDate">
          <el-date-picker v-model="comboDate" type="daterange" range-separator="-" value-format="yyyy-MM-dd"
            start-placeholder="通知到达时间" end-placeholder="通知到达时间"></el-date-picker>
        </el-form-item>
        <el-form-item class="btns">
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset('searchForm')">重置</el-button>
        </el-form-item>
      </el-form>
      
      <div class="notice-list">
        
        <div class="notice-list-item " v-for="(item,index) in mechanismList" :key="item.id"
          :class="{active: item.isRead == 1}" @click="handleClick(item.id)">
          <p class="list-name">{{ item.noticeTitle }}   <span class="list-name-time">{{item.pushTime}}</span><span v-if="item.isRead == 1" class="hasRead">已读</span></p>
          <div class="list-content" >{{item.noticeContentText}}</div>
        </div>
        <img src="../../../assets/images/bg/no.jpg" alt="" v-if="isImgHide" style="margin: 0 auto;display: block;">
      </div>
      <el-pagination
       class="page-mechanism"
       background 
       layout="prev, pager, next" 
       :total="totalRecordNumber"
       :current-page="currentPage"
       :page-size="pageSize"
        v-if="totalRecordNumber>0"
        @current-change="changeCurrentPage" />
    </div>
  </template>
  
  <script>
    import {Api_GetNoticeList} from "@/api/creditManagement/companyNotice/index";
    export default {
      name: 'notice',
      data() {
        return {
          currentId: 0,
          comboDate: [],
          listQuery: {
            noticeTitle: '',
          },
          isImgHide: false,
          mechanismList: [],
          tableData: [],
          pageSize: 10,
          totalRecordNumber: 0,
          pageIndex: 1,
          currentPage:1
        }
      },
      methods: {
        handleFilter(){
          this.pageIndex = 1
          this.currentPage = 1
          this.getList()
        },
         getList() {
          var params = {
            currentPage:this.pageIndex,
            pageSize:this.pageSize,
            noticeTitle: this.listQuery.noticeTitle,
            pushTimeBegin : this.comboDate.length > 0 ? this.comboDate[0] : "",
            pushTimeEnd:this.comboDate.length > 0 ? this.comboDate[1] : ""
          }
          Api_GetNoticeList(params).then(res=>{
             this.mechanismList =  res.data
       
             this.totalRecordNumber = res.totalRecordNumber
            if( this.mechanismList.length == 0) {
                this.isImgHide = true
            } else {
              this.isImgHide = false
            }
          })
        },
        handleReset(formName) {
          this.$refs[formName].resetFields();
          this.listQuery.noticeTitle = "";
          this.comboDate = [];
          this.pageIndex = 1
          this.currentPage = 1
          this.getList()
        },
        handleClick(id) {
          this.currentId = id
          this.$emit('handleFromNotice', true, id)
        },
        changeCurrentPage(page) {
          this.pageIndex = page;
          this.currentPage = page
          this.getList()
        },
      },
      created() {
        this.getList()
      },
    }
  </script>
  <style lang="scss" scoped>
    .notice-content-wrapper {
      background-color: #fff;
  
      .el-form {
        margin-bottom: 0;
      }
  
      .page-mechanism {
        text-align: right;
        margin-top: 15px;
      }
  
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
  
      .notice-list {
  
        .notice-list-item.active {
          color: #a1a3a6;
          .list-name{
            color: #a1a3a6;
          }
        }
  
        .notice-list-item:first-child {
          padding: 10px 0 20px 0;
        }
  
        .notice-list-item {
          padding: 20px 0;
          border-bottom: 1px solid #eaedf4;
  
          .list-name {
            font-size: 16px;
            height: 30px;
            line-height: 30px;
            color: #5f7b9a;
            margin-bottom: 10px;
  
            .list-name-time {
              float: right;
              font-size: 12px;
            }
  
            .hasRead{
              float: right;
              display: block;
              width: 30px;
              text-align: center;
              height: 20px;
              line-height: 20px;
              font-size: 12px;
              background-color: $light-blue;
              color: #fff;
              border-radius: 2px;
              margin-right: 20px;
            }
          }
  
          .list-time {
            font-size: 14px;
            height: 34px;
            line-height: 34px;
            color: #606266;
          }
  
          .list-content{
            overflow: hidden;    
            text-overflow: ellipsis;     
            white-space: nowrap;
            width: 90%; 
          }
        }
  
        .mechanism-list-item:last-child {
          border-bottom: 1px solid #eaedf4;
        }
      }
    }
  </style>