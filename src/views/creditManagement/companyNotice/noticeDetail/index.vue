<template>
    <div class="notice-content-wrapper">
        <div class="title-name">
            <span class="name-1">通知查看</span>
            <el-button class="name-back" @click="returnNotice">返回</el-button>
        </div>
        <div class="notice-detail">
          <div class="detail-title">{{noticeDetail.noticeTitle}}</div>
          <div class="detail-title-1">到达时间：{{noticeDetail.createDate}}</div>
          <div class="downLoad clearfix">
            <div class="fl">附件:</div>
            <div class="fl" > 
              <a
                v-for="(el,index) in uploadFiles"
                :key="index"
                :href="downUrl + el.filePath"
                class=" a-block"
                target="_blank"
                download
                >{{el.fileName}}</a>
            </div>
          </div>
        </div>
        <div class="notice-detail-content">
          <p class="item-list" v-html="noticeDetail.noticeContent"> </p>
        </div>
    </div>
</template>
<script>
    import {Api_GetNoticeDetail} from "@/api/creditManagement/companyNotice/index";
    import ImgView from "@/components/ImgView"
    export default {
        name:'notice',
        coments:{ImgView},
        props:{
          modelId:{
            type: String
          }
        },
        
        data() {
           return {
             noticeDetail:{},
             downUrl: process.env.VUE_APP_FILE_IMG_API,
             uploadFiles:[],
             srcList: [],
              picUrls: [],
              pdfUrls: [],
           }
        },
        methods: {
          returnNotice(){
            this.$emit('handleReturn',false)
          },
          async getList(){
           const result = await Api_GetNoticeDetail(this.modelId)
           this.noticeDetail = result.notice
           this.uploadFiles = result.uploadFiles
          }
        },
        created() {
          this.getList()
        },
    }
</script>
<style lang="scss" scoped>
.notice-content-wrapper{
    background-color: #fff;
    a {
        display: block;
        margin-left: 20px;
        color: #409eff;
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
        .name-back{
            padding: 7px 20px;
            float: right;
            // border: 1px solid #dcdfe6;
            // border-radius: 4px;
            // color: #606266;
        }
    }
    .notice-detail {
      background-color: #f5f7fa;
      padding: 0 20px 12px 20px;
      border: 1px solid #eaedf4;
      .detail-title {
        font-size: 22px;
        line-height: 45px;
        font-weight: 700;
      }
      .downLoad{
        color: #333;
        line-height: 40px;
        font-size: 12px;
        .detail-attach{
          color: $light-blue;
          margin-left: 15px;
        }
      }

      .detail-title-1 {
        color: #888888;
        font-size: 12px;
      }
    }

    .notice-detail-content {
      padding: 20px;

      .item-list{
        line-height: 35px;
        font-size: 13px;
      }
    }
}
</style>