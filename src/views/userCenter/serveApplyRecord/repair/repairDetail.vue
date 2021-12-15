<template>
    <div class="detail-content-wrapper">
        <div class="title-name">
            <span class="name-1">报修详情</span>
            <el-button class="name-back" @click="returnNotice">返回</el-button>
        </div>
        <div class="apply-see-content">
            <el-row>
                <el-col :span="12">
                    <div class="see-wrapper">
                        <p class="apply-name">报修企业</p>
                        <p class="apply-enclosure">{{repairDetail.ENTERPRISENAME}}</p>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="see-wrapper">
                        <p class="apply-name">报修时间</p>
                        <p class="apply-enclosure">{{repairDetail.CREATETIME}}</p>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <div class="see-wrapper">
                        <p class="apply-name">报修房间</p>
                        <p class="apply-enclosure">{{repairDetail.ROOMNO}}</p>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="see-wrapper">
                        <p class="apply-name">报修类型</p>
                        <p class="apply-enclosure">{{repairDetail.TYPE == 0? "强电维修" : 
                                                    repairDetail.TYPE == 1
                                                    ? "质量检查"
                                                    : repairDetail.TYPE == 2
                                                    ? "排水维修"
                                                    : repairDetail.TYPE == 3
                                                    ? "清洁"
                                                    : repairDetail.TYPE == 4
                                                    ? "暖通空调维修"
                                                    : "其他"}}
                        </p>
                    </div>
                </el-col>
            </el-row>
          
            <el-row>
                <div class="see-wrapper">
                    <p class="apply-name">报修内容</p>
                    <div class="apply-enclosure" style="width: 80%; ">
                        <div> 
                            {{ isExpand ? wholeMessageText : repairDetail.CONTENTS }}
                            <span style="color: #4b9df3;margin-left: 10px;" @click="handleExpand" v-if="hasxian">{{isExpand? '...展开': '收起'}}</span>
                        </div>
                    </div>
                </div>
            </el-row>
            <el-row>
                <div class="see-wrapper">
                    <p class="apply-name">故障图片</p>
                    <div class="apply-enclosure img-some" style="width: 80%; ">
                        <div class="img-item fl" v-for="item in repairDetail.REPAIRURL" :key="item.id" @click='checkPics(item)'>
                            <img :src="imgUrl + item.filePath" alt="" />
                        </div>
                    </div>
                    <div class="demo-image__preview" style="position: fixed; top: -200px; left: -200px; z-index: 2000">
                        <el-image
                          ref="ref_Img"
                          style="width: 100px; height: 100px"
                          :src="srcList[0]"
                          :preview-src-list="srcList"
                        ></el-image>
                      </div>
                </div>
            </el-row>
        </div>
        <p class="title-p leftline">处理进度</p>
        <div class="apply-see-content">
            <el-row>
                <el-col :span="24">
                    <div class="see-wrapper">
                        <p class="apply-name">处理时间</p>
                        <p class="apply-enclosure">{{repairDetail.HANDLETIME}}</p>
                    </div>
                </el-col>
            </el-row>
              <el-row>
                <div class="see-wrapper">
                    <p class="apply-name">处理凭证</p>
                    <div class="apply-enclosure img-some" style="width: 80%; ">
                        <div class="img-item fl"  v-for="item in repairDetail.PROCESSINGCERTIFICATE" :key="item.id" @click='checkPics2(item)'>
                            <img :src="imgUrl + item.filePath" alt="" />
                        </div>
                    </div>
                    <div class="demo-image__preview" style="position: fixed; top: -200px; left: -200px; z-index: 2000">
                        <el-image
                          ref="ref_Img"
                          style="width: 100px; height: 100px"
                          :src="srcList[0]"
                          :preview-src-list="srcList"
                        ></el-image>
                      </div>
                </div>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <div class="see-wrapper">
                        <p class="apply-name">备注</p>
                        <div class="apply-enclosure" style="width: 80%; ">
                            <div> 
                                {{ isExpand1 ? wholeMessageText1 : repairDetail.REMARKS }}
                                <span style="color: #4b9df3;margin-left: 10px;" @click="handleExpand" v-if="hasxian1">{{isExpand1? '...展开': '收起'}}</span>
                            </div>
                       </div>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <div class="see-wrapper">
                        <p class="apply-name">相关附件</p>
                        <div class="apply-enclosure" style="width: 80%; ">
                            <div class="img-item fl" v-for="item in repairDetail.ANNEXURL" :key="item.id" >
                                <a class="a-block" :href="downUrl + item.filePath" download>{{item.fileName}}</a>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
    import textMore  from "@/components/textMore/textMore"
    import { Api_getRepairDetail } from "@/api/userCenter/propertyRepair.js";
    export default {
        props:{
            modelId:  {
                type: String,
            },
        },
        data() {
           return {
            imgUrl: process.env.VUE_APP_FILE_IMG_API,
            downUrl: process.env.VUE_APP_FILE_IMG_API,
            repairDetail:{
                CONTENTS:'',
                REMARKS:''
            },
            isExpand: true,
            hasxian:false,
            isExpand1: true,
            hasxian1:false,
            wholeMessage:'',
            srcList:[]
          }
          
        },
        components: {
            textMore
        },
        computed: {
            wholeMessageText:function() {
                if (this.repairDetail.CONTENTS.length > 80){
                    this.wholeMessage = this.repairDetail.CONTENTS.slice(0,80) 
                    this.isExpand = true
                    this.hasxian = true
                }else if ( this.repairDetail.CONTENTS.length < 80){
                    this.isExpand = null
                    this.hasxian = false
                }else {
                    this.wholeMessage = this.repairDetail.CONTENTS
                    this.hasxian = true
                    this.isExpand = false
                }
                return this.wholeMessage
            },
            wholeMessageText1:function() {
                if (this.repairDetail.REMARKS.length > 80){
                    this.wholeMessage1 = this.repairDetail.REMARKS.slice(0,80) 
                    this.isExpand1 = true
                    this.hasxian1 = true
                }else if ( this.repairDetail.REMARKS.length < 80){
                    this.isExpand1 = null
                    this.hasxian1 = false
                }else {
                    this.wholeMessage = this.repairDetail.REMARKS
                    this.hasxian1 = true
                    this.isExpand1 = false
                }
                return this.wholeMessage1
            }
        },
        watch:{
            
        },
        methods: {
            handleExpand(){
                this.isExpand = !this.isExpand
                if (this.repairDetail.CONTENTS.length < 80){
                    this.hasxian = false
                }else {
                    this.hasxian = true 
                }
            },
            handleExpand1(){
                this.isExpand1 = !this.isExpand1
                if (this.repairDetail.REMARKS.length < 80){
                    this.hasxian1 = false
                }else {
                    this.hasxian1 = true 
                }
            },
            returnNotice(){
                this.$emit('handleReturn',false)
            }, 
              /**更多与收起 */
            moreClick() {
                this.isLimitHeight = !this.isLimitHeight;
            },
            checkPics(_row) {
                this.srcList = this.repairDetail.REPAIRURL.map((item) => this.imgUrl + item.filePath)
                this.$nextTick(() => {
                    this.$refs.ref_Img.clickHandler();
                });
              
            },
             checkPics2(_row) {
                this.srcList = this.repairDetail.PROCESSINGCERTIFICATE.map((item) => this.imgUrl + item.filePath)
                this.$nextTick(() => {
                    this.$refs.ref_Img.clickHandler();
                });
              
            },

            getListDetail(){
                Api_getRepairDetail(this.modelId).then(res=>{
                    this.repairDetail = res
                })
            }
        },
        mounted() {
          this.getListDetail()
        },
    }
</script>

<style lang="scss" scoped>
    .detail-content-wrapper {
      padding:12px  25px;
      background-color: #fff;
        a {
            display: block;
            margin-left: 20px;
            color: #409eff;
        }
      .title-name {
        margin-bottom: 20px;
  
        .name-1 {
          height: 42px;
          display: inline-block;
          line-height: 42px;
          font-size: 16px;
          border-bottom: 2px solid $light-blue;
        }
  
        .name-back {
        //   padding: 6px 14px;
          float: right;
          padding: 7px 20px;
          margin-top: 12px;
        //   border: 1px solid #dcdfe6;
        //   border-radius: 4px;
        //   color: #606266;
        }
      }
      .title-p {
            color: #333;
            font-size: 16px;
            padding-left: 20px;
            line-height: 21px;
            width: 100%;
            position: relative;
            margin: 10px 0 15px 0;
         
        }
        .title-p::before  {
            content:'';
            position: absolute;
            top:0;
            left: 0;
            width: 4px;
            height: 21px;
            background-color: #3399e6;
        }
        .apply-see-content{
            .see-wrapper{
                display: flex;
                color: #606266;
                margin-top: 5px;
                line-height: 35px;
                font-size: 14px;
                .apply-name{
                    width: 110px;
                    margin-right: 25px;
                    text-align: right;
                }

                .apply-explain{
                    width: 83%;
                }

                .apply-enclosure {
                   width: 80%;
                    .apply-pass {
                        padding: 4px 7px;
                        background: #67c23a;
                        border-radius: 3px;
                        font-size: 14px;
                        color: #fff;
                    }
                }
                .img-some {
                    img {
                        width: 195px;
                        height: 125px;
                        margin-right: 10px;
                        margin-bottom: 10px;
                    }
                }

            }
        }
     
    }
  </style>