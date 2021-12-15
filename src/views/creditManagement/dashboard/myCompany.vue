<template>
    <div class="myCompany">
        <div class="page-header">
            <el-row class="header-wrap">
                <el-col :span="12">
                    <!-- <router-link
                    tag="div"
                    class="myCompanyTitle"
                    :to="'/front/creditManagement/todo'"
                    ><span>工作台</span></router-link> -->
                    <div class="page-header">
                        <h1 class="page-name"><span>工作台</span></h1>
                    </div>

                    <div style="display: flex;margin-top:20px">
                        <div style="flex: 0 90px; height: 90px; padding: 15px; background-color: #F6F9FA">
                        <div class="box-img"></div>
                        </div>
                        <div style="flex: 1; height: 100%; padding: 0 20px; position: relative">
                        <h4 style="font-size: 22px; margin-bottom: 16px">
                            {{formData.companyName||userInfo.saasName}}
                            <el-tag
                            size="mini"
                            type="success"
                            v-if="userInfo.certStatus =='2'"
                            style="vertical-align: middle; margin-right: 6px"
                            >认证成功</el-tag>
                            <div style="display: inline-block;vertical-align: top;" @click="conpanyReg">
                                <el-button type="warning"  style="vertical-align: top;padding: 7px 15px;border-radius: 3px;min-width:initial;font-size:inital;top:0"  size="mini" v-if="userInfo.certStatus!='2'">企业认证</el-button>
                            </div>
                        </h4>

                        <div style="color: #606266;margin-bottom:10px">
                            <i class="el-icon-office-building" style="margin-right: 4px"></i>
                            统一社会信用代码：{{newformData.creditCode == null ? "-" : (newformData.creditCode === 'NULL' ? "-" : newformData.creditCode)}}
                        </div>
                        <div>
                            <span
                            style="padding: 3px 6px; margin-right: 6px; background-color: #53B7B3; color: #fff; border-radius: 2px; font-size:12px"
                            >
                            <i class="el-icon-bell"></i>
                            {{newformData.status}}
                            </span>
                            <span
                            v-for="(el, index) in companyTags"
                            :key="index"
                            style="padding: 3px 6px; margin-right: 6px; color: #fff; border-radius: 2px; font-size:12px"
                            :style="{'background-color': el.color==='primary'?'#409EFF':el.color==='success'?'#53B7B3':'#F56C6C'}"
                            >{{el.label}}</span>
                            <!-- <el-tag
                            v-for="(el, index) in companyTags"
                            :key="index"
                            :type="el.color"
                            size="small"
                            >{{ el.label }}</el-tag>-->
                        </div>
                        </div>

                    </div>

                    <div style="display: flex; margin-top: 15px; margin-bottom: 20px">
                        <div
                        style="flex: 0 90px; text-align: center; align-self: flex-end; padding-bottom: 2px;"
                        >
                        <span style>
                            <img src="../../../assets/images/jinggao.png" alt style="vertical-align: top" />
                            风险信息
                        </span>
                        </div>
                        <div style="flex: 1; padding: 0 20px">
                        <span style="margin-right: 30px">
                            自身风险：
                            <span
                            style="color: #F56C6C; margin-right: 6px; font-size: 24px"
                            >{{ownRiskCount}}</span>项
                        </span>
                        <span style="margin-right: 30px">
                            关联方风险：
                            <span
                            style="color: #F56C6C; margin-right: 6px; font-size: 24px"
                            >{{relationRiskCount}}</span>项
                        </span>
                        </div>
                    </div>

                </el-col>
                <el-col :span="12" class="clearfix">
                    <creditRating style="float:left;width:50%" v-if="companyId"   :value="value" :title="title"></creditRating>
                    <radarChart style="float:left;width:50%;" v-if="companyId"   :value2="value2" :companyInfo="companyInfo"></radarChart>
                </el-col>
                <li v-if="false">
                    <div style="flex: 0 400px; text-align: right; align-self: flex-end;margin-top: 136px;">
                        <el-button size="mini"  icon="el-icon-warning" type="danger" @click="riskExp">
                            风险体检
                        </el-button>

                        <el-button size="mini" style="display:none" @click="!formData.isSupervise?addSupervise():null">
                            <svg-icon icon-class="jiance" style="margin: 0; vertical-align: sub" />
                            {{!formData.isSupervise?'添加监测':'监测中...'}}
                        </el-button>
                        <el-button
                            icon="el-icon-download"
                            type="primary"
                            size="mini"
                            @click="openDownloadReportDialog('基础信息报告')"
                        >下载报告</el-button>
                    </div>

                </li>
            </el-row>
        </div>



        <!-- 公司头部结束 -->

    <DownloadReport
      ref="downloadReportDialog"
      @submitDownloadType="downloadReportConfirm"
      :companyName="formData.companyName? formData.companyName:userInfo.saasName"
    />
    <!-- v-show="noexperience" -->
    <RiskModel  :risk="true" ref="riskCenter" @hide="hideRiskModel" ></RiskModel>

    </div>
</template>

<script>
import {Api_CustomerArchivesGetCompanyInfo} from "@/api/creditManagement/customerProfile/customerManagemCustomer/baseInfo";
import { Api_CheckCompany } from "@/api/creditManagement/customerProfile/customerManagement.js";
import {Api_AddAttention,Api_GetAttentionInfo,Api_AttentionCancel,Api_certJudgment} from "@/api/userCenter/creditManage";
import RiskModel from "@/components/Riskexamination"
import creditRating from "./components/creditRating.vue"
import {
  Api_CustomerArchivesBaseInfo,
  Api_CustomerArchivesUpDate
} from "@/api/creditManagement/customerProfile/customerManagemCustomer/baseInfo";
import {
  Api_GetCompanyTag,
  Api_GetCompanyRiskCount,
  Api_GetDataCount
} from "@/api/creditMonitor";
// 导入雷达图
import  radarChart from './components/radarChart.vue'
import DownloadReport from "../../../views/userCenter/companyCenter/creditFile/DownloadReport";
import {Api_getCreditScore} from '@/api/creditManagement/todo/index.js'
export default {
    data(){
        return {
            formData: {},
            // 增加一个变量用来放更新时间, 统一社会信用代码,以及状态
            newformData:{},
            companyTags: [],
            ownRiskCount: null,
            relationRiskCount: null,
            dataCount: {},
            // 下面是关于雷达图与信用评级图的变量
            loading:false, // 加载
            value:0,  //数值
            title:"",  //信用等级
            value2:[0,0,0,0,0],
            companyInfo:{}//企业信息数据
        }
    },
  watch:{
    companyId: {
        handler(newVal) {
            if(newVal){
              this.getDetail();
              Api_GetDataCount({
                  companyId: newVal
                }).then(res => {
                  this.dataCount = res.result[0];
                });
              //  若是有companyId了那么就获取更新时间跟统一社会信用代码
              Api_CustomerArchivesGetCompanyInfo(newVal)
              .then(res => {
                this.newformData=res;
                
                // this.isFxbByName(res.companyName);
              })
              .catch((err) => {
                console.log(err)
              });


              this.loadTableData(newVal)
            }
        },
        immediate: true
    }
  },
    components: {
        RiskModel,
        DownloadReport,
        creditRating,  //信用评级
        radarChart //雷达图
    },
    computed: {
        companyId(){
        return this.$store.getters.userInfo.companyId
        },
        userInfo(){
        return this.$store.getters.userInfo
        },
        sassName(){
        return this.$store.getters.userInfo.saasName;
        }
  },
  methods:{
      // 调用接口获取数据--雷达图与信用评级
      loadTableData(companyId){
          this.loading=true;
          Api_getCreditScore({ companyId: companyId }).then((res) => {
                  // 若是返回的数据不等于null就正常执行，不然按照不存在来执行
                  if(res){
                      this.loading=false;

                      // 这是信用评级
                      this.value=res.totalScore;
                      this.title=res.level;
                      // 信用评级结束

                      // 这是雷达图
                      this.companyInfo = res;
                      this.value2=[
                              res.baseInfo.score,
                              res.techInnovation.score,
                              res.manageState.score,
                              res.relatedStructure.score,
                              res.publicCredit.score
                          ];
                      // 雷达图结束
                  }else{
                      this.loading=false;
                      this.value=0;
                      this.title=''
                      // 雷达图赋值
                      this.value2=[0,0,0,0,0],
                      this.companyInfo={}
                  }
          }).catch(err=>{
              this.loading=false;
              this.value=0;
              this.title=''
              // 雷达图赋值
              this.value2=[0,0,0,0,0],
              this.companyInfo={}
              console.log(err)
          })
      },

    getDetail(cb) {
      Api_CustomerArchivesBaseInfo(this.companyId)
        .then(res => {
          // this.formData.companyName = res.companyName;
          // this.formData.creditState = res.creditState;
          // this.formData.customerNo = res.customerNo;
          // this.formData.beginDate = res.beginDate;
          if(res){
            this.formData = res;
          }

        // this.$nextTick(()=>{
        //   if (this.$route.query.index){
        //     this.renderComp(this.$route.query.index,this.$route.query.itemindex)
        //   }
        // })
          cb && cb();
        })
        .catch(e => {
          console.log(e);
        });
      Api_GetCompanyRiskCount(this.companyId).then(res => {
        this.ownRiskCount = res.ownRiskCount;
        this.relationRiskCount = res.relationRiskCount;
      });
      this.getCompanyTags();
    },      
    conpanyReg(){
        if (!this.$store.state.user.userInfo.registerFlag) {
            this.$alert("平台暂时不支持企业团队成员申请认证企业。", "提示", {
            type: "warning"
            });
            return false;
        }
        Api_certJudgment(this.companyId)
            .then(res => {
            if (res) {
                this.$router.push({
                    path:'/enterpriseCertification',
                    query: {
                        name: this.formData.companyName || this.userInfo.saasName
                    }
                })
            }
            })
            .catch(res => {
            this.$message.error(res);
            });
    },



    getCompanyTags() {
      Api_GetCompanyTag({
        companyId: this.companyId
      }).then(res => {
        if (res) {
          this.companyTags = [
            { label: res[0].taxcredit, color: "success" },
            { label: res[0].company_size, color: "primary" },
            { label: res[0].listed_company, color: "primary" },
            { label: res[0].financing, color: "primary" },
            { label: res[0].opexception, color: "danger" },
            { label: res[0].zhi_xing, color: "danger" },
            { label: res[0].shi_xin, color: "danger" }
          ].filter(item => !!item.label);
        }
      });
    },    
    riskExp(){
      this.noexperience = true
      let conpanyName  = this.$store.getters.userInfo.saasName ? this.$store.getters.userInfo.saasName: this.formData.companyName
      this.$refs.riskCenter.goExperience(conpanyName)
    },
    // 打开下载报告弹窗
    openDownloadReportDialog(PDFType) {
      if (PDFType === "风险评级报告") {
        this.$message.warning("报告功能尚未正式发布");
      } else {
        this.$refs.downloadReportDialog.openDialog(PDFType);
      }
    },
    // renderScroll(index,itemIndex,id){
    //   this.renderComp(index,itemIndex)
    // },
    // 确认下载报告
    downloadReportConfirm() {},
    hideRiskModel(value){
      this.noexperience = value
    }
  }
}
</script>

<style scoped lang="scss">
.myCompany{
    background:#fff;
    padding: 20px 25px 0px;
    margin-bottom: 20px;
    .myCompanyTitle{
        span{
            border-bottom: 2px solid #4b9df3;
            padding-bottom: 11px;
            font-size: 16px;
            color: #333;
            font-weight: 500;
        }
    }

    .box-img{
        width: 100%;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MThCMzgyRTgwREREMTFFQkI4N0M5RDhBMkRENDRGQTMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MThCMzgyRTkwREREMTFFQkI4N0M5RDhBMkRENDRGQTMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxOEIzODJFNjBEREQxMUVCQjg3QzlEOEEyREQ0NEZBMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxOEIzODJFNzBEREQxMUVCQjg3QzlEOEEyREQ0NEZBMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnWmY1gAAAHDSURBVHja7Jw7TsNAFEUdhERF5zZb4BcDEqKhh4qSjoYdUKaAhgUA4b8C1gANQhRBkbyFdMggJBqqmIuYBmSbsePYjnOudBVZmYwnR+/Nm5lEboRh6KDsmgIBAAEIQAAiAAIQgABEAAQgAAGI0mh6mA/fP/TW9NKW3QLHHMgH8mMenW2sL5YagUXDc8z92nVJYbekcbt1AcgcmHN/3gjH2qUKs4xBAARgvYuIzeTvZWzzn5bkPflCfiYC0+sbXks+NxA9AKaLvtaf6zMDchmAdtEXB7YjX8krAIzXiXwnD2LeX5BP5Wt5ddyKiJdTmyT58r7clHfkLXkmot28ge2b9H4iAn+rLx8ZgJfye0y7OflYvgFgtN5MNd40QPsJIAGYoE/5Vt42Ke5TRLJpYIrMLjsR9sIcJiAAArAyqstOpLRiRAQCEIAABCCqdBV2Plz7f0DNBj0AWi4xRrmcIYUByBw4lvKIQFIYgGiC50BOY0hhACLWgUQgKQxABEAAAhCAqOh1YOSxfYrfObp535sIrHkKByWN+7Uq/QwL8DDHL2OrF+fnoROV6KfBM1SZAwEIQAAiAAIQgABEAAQgACdMXwIMAKs3Q9OWDW/yAAAAAElFTkSuQmCC);
        height: 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
    }
}
</style>


<style lang="scss" scoped>
/* 头部样式重写 */
.header-wrap{
    // display: flex;
    height: 256px;
    width:100%;
    background-color: #fff;
    justify-content: space-between;
    // li{
    //     flex:1
    // }
}

.page-header .el-button {
    font-size: 12px!important;
}
</style>

