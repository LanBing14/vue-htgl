<template>
    <div class="detail-content-wrapper">
        <div class="title-name">
            <span class="name-1">装修申请查看</span>
            <el-button class="name-back" @click="returnNotice">返回</el-button>
        </div>
        <div class="apply-see-content">
            <p class="title-p leftline">装修物业位置</p>
            <el-row>
                <el-col :span="24" v-for="(item,index) in repairDetail.projects" :key="index">
                    <div class="see-wrapper">
                        <p class="apply-name">{{item.BUILD_NAME}}</p>
                        <p class="apply-enclosure wuyePosition">
                            <el-tag type="info" color="#F4F4F4" v-for="(el,ind) in item.ROOMNUM.split(',')" :key="ind">{{el}}</el-tag>
                        </p>
                    </div>
                </el-col>
            </el-row>
        </div>
        <p class="title-p leftline">装修信息</p>
        <div class="apply-see-content">
            <el-row>
                <el-col :span="24">
                    <div class="see-wrapper">
                        <p class="apply-name">装修时间</p>
                        <p class="apply-enclosure">
                            {{repairDetail.decorationStartTime?$moment(repairDetail.decorationStartTime).format('YYYY-MM-DD'):'-'}} ~
                             {{repairDetail.decorationEndTime?$moment(repairDetail.decorationEndTime).format('YYYY-MM-DD'):'-'}}
                        </p>
                    </div>
                </el-col>
            </el-row>
              <el-row>
                <div class="see-wrapper">
                    <p class="apply-name">预计装修时间</p>
                    <div class="apply-enclosure"> {{repairDetail.decorationDayNum}} 天 </div>
                </div>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <div class="see-wrapper">
                        <p class="apply-name">装修面积</p>
                        <div class="apply-enclosure" style="width: 80%; ">
                           {{repairDetail.decorationArea}} ㎡
                       </div>
                    </div>
                </el-col>
            </el-row>
             <el-row>
                <el-col :span="24">
                    <div class="see-wrapper">
                        <p class="apply-name">装修内容</p>
                        <div class="apply-enclosure" style="width: 80%; ">
                            {{repairDetail.content}}
                       </div>
                    </div>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="24">
                    <div class="see-wrapper">
                        <p class="apply-name">相关附件</p>
                        <div class="apply-enclosure" style="width: 80%; ">
                            <div class="img-item fl" v-for="(item,index) in repairDetail.files" :key="index" >
                                <a class="a-block" :href="downUrl + item.filePath" download>{{item.fileName}}</a>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div v-if="repairDetail.state !== '0'">
        <el-divider></el-divider>
         <p class="title-p leftline">审批记录信息</p>
         <div class="apply-see-content">
             <el-row>
                <el-col :span="24">
                    <div class="see-wrapper">
                        <p class="apply-name">审批状态</p>
                        <div class="apply-enclosure" style="width: 80%; ">
                         <el-tag effect="dark">{{repairDetail.state == '1'?'通过':'未通过'}}</el-tag>
                       </div>
                    </div>
                </el-col>
            </el-row>
             <el-row>
                <el-col :span="24">
                    <div class="see-wrapper">
                        <p class="apply-name">备注</p>
                        <div class="apply-enclosure" style="width: 80%; " >
                            {{repairDetail.remarks}}
                       </div>
                    </div>
                </el-col>
            </el-row>
         </div>
         </div>
    </div>
</template>
<script>
    import textMore  from "@/components/textMore/textMore"
    import { Api_getDecorationDetail } from "@/api/userCenter/propertyRepair.js";
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

            getListDetail(){
                Api_getDecorationDetail(this.modelId).then(res=>{
                    this.repairDetail = res
                })
            }
        },
        mounted() {
        
        },
        created(){
            this.getListDetail()
        }
    }
</script>

<style lang="scss" scoped>
    .wuyePosition span{
        margin-right: 8px;
    }
    .detail-content-wrapper {
      padding: 12px 25px;
      background-color: #fff;
      .mgL10{
          margin-left: 10px;
      }
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
          padding: 7px 20px;
          float: right;
          margin-top: 12px;
        //   border: 1px solid #dcdfe6;
        //   border-radius: 4px;
        //   color: #606266;
        //   cursor: pointer;
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