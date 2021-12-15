<template>
    <div class="dialogRisk" v-show="isShow">
        <div  class="dialogRisk-container" v-show="step == 1" >
            <div class="close-wrap"  @click="hideModel" style="cursor:pointer">
                <span>
                 <i class="el-dialog__close el-icon el-icon-close"></i>
               </span>
          </div>
            <div  class="dialogRisk-wrap">
             <p class="title">企业风险早知道，快用风信标体检一下</p>
             <p class="info">您还没有体检过，可能有信用风险隐患</p>
            <div class="btn">
                <span class="goExamination" @click="goExperience" style="cursor: pointer;">立即体检</span>
                <span class="fullInfo" @click="hideModel"  style="cursor: pointer;">暂不体检</span>
            </div>
            </div>
        </div>
        <div class="dialogRisk-dong" v-show="step == 2">
            <!-- <embed src="/static/video/zhuan.swf" autostart="true" width="100%" height="100%" /> -->
            <video ref="video" src="../../assets/video/zhuan.mp4" style="width: 100%;height: 100%"></video>
            <p class="dong-after">正在体检中，请稍后........</p>
        </div>
        <div  class="dialogRisk-xiu" v-show="step == 3" >
            <div class="close-wrap" @click="hideModel"  style="cursor:pointer">
                <span>
                   <i class="el-dialog__close el-icon el-icon-close"></i>
                </span>
              </div>
            <div class="dialogRisk-top">
                <p class="dialogRisk-top-title">经过风信标风险引擎全面体检</p>
                <p class="dialogRisk-top-title1">贵司信用指数 <span class="common">{{companyInfo.totalScore ? companyInfo.totalScore : 0}}</span> ，超过了全国 <span class="common">{{companyInfo.sumScorePlace ? companyInfo.sumScorePlace : '0%'}}</span> 的企业</p>
                <p class="dialogRisk-top-title2" >
                    <img src="../../assets/images/help.png" alt="">
                    <span class="infoWarn"> 信用指数满分100分，依据企业当前信用数据执行评估，并不能完全反应贵司当前信用风险情况，您可通过完善企业资料获得更准确的信用风险评估结果。</span></p>
                <div class="button1" @click="addInfo">完善资料</div>
            </div>
            <div class="dialogRisk-bottom">
                <div class="left" id="leftCharts" ></div>
                <div class="right">
                    <div class="title_right"  style="margin-bottom: 13px;">主要评估维度信用水平</div>
                    <div class="item_right">基本情况
                        <div class="process" @mouseenter="OnMouseOver( isShowXian1 = true)" @mouseleave="leave"> 
                        <el-progress  :stroke-width="8" :percentage="basicInfoScorePlace" ></el-progress> 
                        <span class="item_right_over" v-if="isShowXian1">超过全国{{basicInfoScorePlace}}%的企业</span>
                    </div><span class="common itemM " style="float: right;"> {{ companyInfo.baseInfo ? companyInfo.baseInfo.score : 0 }}  &nbsp&nbsp <span style="color: #000;">分</span></span> </div>
                    <div class="item_right">技术创新
                        <div class="process"  @mouseenter="OnMouseOver( isShowXian2 = true)" @mouseleave="leave"> 
                        <el-progress  :stroke-width="8" :percentage="innovateScorePlace" ></el-progress> 
                        <span class="item_right_over" v-if="isShowXian2">超过全国{{innovateScorePlace}}%的企业</span>
                    </div><span class="common itemM"  style="float: right;"> {{ companyInfo.techInnovation ? companyInfo.techInnovation.score : 0 }} &nbsp&nbsp <span style="color: #000;">分</span></span></div>
                    <div class="item_right">经营状况
                        <div class="process"  @mouseenter="OnMouseOver( isShowXian3 = true)" @mouseleave="leave">
                         <el-progress  :stroke-width="8" :percentage="operationStatusScorePlace" >
                         </el-progress> 
                         <span class="item_right_over" v-if="isShowXian3">超过全国{{operationStatusScorePlace}}%的企业</span>
                        </div><span class="common itemM"  style="float: right;"> {{ companyInfo.manageState ? companyInfo.manageState.score : 0 }} &nbsp&nbsp <span style="color: #000;">分</span></span></div>
                    <div class="item_right">关联结构
                        <div class="process"  @mouseenter="OnMouseOver( isShowXian4 = true)" @mouseleave="leave">
                         <el-progress  :stroke-width="8" :percentage="relationScorePlace" >
                         </el-progress>
                         <span class="item_right_over" v-if="isShowXian4">超过全国{{relationScorePlace}}%的企业</span>
                         </div><span class="common itemM"  style="float: right;"> {{ companyInfo.relatedStructure ? companyInfo.relatedStructure.score : 0 }} &nbsp&nbsp <span style="color: #000;">分</span></span></div>
                    <div class="item_right">公共信用
                        <div class="process"  @mouseenter="OnMouseOver( isShowXian5 = true)" @mouseleave="leave"> 
                        <el-progress  :stroke-width="8" :percentage="publicCreditScorePlace" >
                        </el-progress> 
                        <span class="item_right_over" v-if="isShowXian5">超过全国{{publicCreditScorePlace}}%的企业</span>
                    </div><span class="common itemM"  style="float: right;"> {{ companyInfo.publicCredit ? companyInfo.publicCredit.score : 0 }} &nbsp&nbsp <span style="color: #000;">分</span></span></div>
                </div> 
            </div>
            <div class="ProcessBase">
               <div  class="itemProcessBase">
                    <div class="itemProcessBase_item">
                        <span  class="itemProcessBase_title">基础信息</span>
                        <span class="itemProcessBase_num"><span class="numColor">{{dataCount.jbxxCnt}}</span>&nbsp;&nbsp;条</span>
                        <span class="item_btn " @click="baseInfoClick">完善信息 >></span>
                    </div>
                    <div class="itemProcessBase_item">
                        <span class="itemProcessBase_title">司法风险</span>
                        <span class="itemProcessBase_num"><span class="numColor">{{dataCount.sffxCnt}}</span>&nbsp;&nbsp;条</span>
                        <span class="item_btn "  @click="businessRiskClick">完善信息 >></span>
                    </div>
               </div>
                <div  class="itemProcessBase">
                    <div class="itemProcessBase_item">
                        <span  class="itemProcessBase_title">经营风险</span>
                        <span class="itemProcessBase_num"><span class="numColor">{{dataCount.jyfxCnt}}</span>&nbsp;&nbsp;条</span>
                        <span class="item_btn active"  @click="CustomerClick">完善信息 >></span>
                    </div>
                    <div class="itemProcessBase_item">
                        <span class="itemProcessBase_title">知识产权</span>
                        <span  class="itemProcessBase_num"><span class="numColor">{{dataCount.zscqCnt}}</span>&nbsp;&nbsp;条</span>
                        <span class="item_btn active" @click="supplierClick">完善信息 >></span>
                    </div>
                </div>
                <div  class="itemProcessBase">
                    <div class="itemProcessBase_item">
                        <span class="itemProcessBase_title">生产情况</span>
                        <span  class="itemProcessBase_num"><span class="numColor">{{dataCount.scjycsCnt}}</span>&nbsp;&nbsp;条</span>
                        <span class="item_btn numColor" @click="prodectClick">完善信息 >></span>
                    </div>
                    <div class="itemProcessBase_item">
                        <span  class="itemProcessBase_title">供应商信息</span>
                        <span class="itemProcessBase_num"><span class="numColor">{{dataCount.supCnt}}</span>&nbsp;&nbsp;条</span>
                        <span class="item_btn numColor" @click="provideClick">完善信息 >></span>
                    </div>
                </div>
                <div  class="itemProcessBase">
                    <div class="itemProcessBase_item">
                        <span class="itemProcessBase_title">主要业务及收入</span>
                        <span  class="itemProcessBase_num"><span class="numColor">{{dataCount.mainCut}}</span>&nbsp;&nbsp;条</span>
                        <span class="item_btn numColor" @click="mainClick">完善信息 >></span>
                    </div>
                    <div class="itemProcessBase_item">
                        <span  class="itemProcessBase_title">客户信息</span>
                        <span class="itemProcessBase_num"><span class="numColor">{{dataCount.custCnt}}</span>&nbsp;&nbsp;条</span>
                        <span class="item_btn numColor" @click="userClick">完善信息 >></span>
                    </div>
                </div>
                <div  class="itemProcessBase">
                    <div class="itemProcessBase_item">
                        <span class="itemProcessBase_title">公司治理及内控</span>
                        <span  class="itemProcessBase_num"><span class="numColor">{{dataCount.compConCnt}}</span>&nbsp;&nbsp;条</span>
                        <span class="item_btn numColor" @click="conpanyTreatClick">完善信息 >></span>
                    </div>
                    <div class="itemProcessBase_item">
                        <span  class="itemProcessBase_title">员工构成</span>
                        <span class="itemProcessBase_num"><span class="numColor">{{dataCount.yggcCnt}}</span>&nbsp;&nbsp;条</span>
                        <span class="item_btn numColor" @click="staffClick">完善信息 >></span>
                    </div>
                </div>
                <div  class="itemProcessBase">
                    <div class="itemProcessBase_item">
                        <span class="itemProcessBase_title">高层管理人员</span>
                        <span  class="itemProcessBase_num"><span class="numColor">{{dataCount.gcglryCnt}}</span>&nbsp;&nbsp;条</span>
                        <span class="item_btn numColor" @click="managementClick">完善信息 >></span>
                    </div>
                    <div class="itemProcessBase_item">
                        <span  class="itemProcessBase_title">财务报表</span>
                        <span class="itemProcessBase_num"><span class="numColor">{{dataCount.cwbbCnt}}</span>&nbsp;&nbsp;条</span>
                        <span class="item_btn numColor" @click="statementsClick" >完善信息 >></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="dialogRisk-company" v-show="step == 4">
            <div class="close-wrap" @click="hideModel1">
                <span>
                    <i class="iconfont icon-close"></i>
                </span>
            </div>
            <div  class="dialogRisk-wrap">
                <p class="title" style="color: #333">企业认证提交成功 !</p>
                <p class="info1">您的认证已经提交，通过审核后，您的企业将获得企业认证标识</p>
                <p class="info1">同时平台将免费为您提供 <span style="color: #000;">风险体检</span> ，帮助您获取当前最新的风险信息，同时为你提供更多服务，帮助您更好的管理信用风险</p>
                <div class="btn" style="margin-top: 25px;">
                    <span class="goExamination"  style="cursor: pointer;" @click="atOnceExp">现在体检</span>
                    <span class="fullInfo"  style="cursor: pointer;" @click="atOnceUse">立即使用</span>
                </div>
            </div>
        </div>
        </div>
</template>
<script>
    import echarts from 'echarts'
    import {
    getToken,
    getUserInfo
} from '../../utils/auth';
    import {
  Api_CheckCompany,
} from "@/api/creditManagement/customerProfile/customerManagement.js";
import {Api_UserSelfInfo} from "@/api/login";
import {
  Api_CustomerArchivesBaseInfo
} from "@/api/creditManagement/customerProfile/customerManagemCustomer/baseInfo";
import { Api_GetDataCount } from "@/api/creditMonitor";
import { Api_getCreditScore } from "@/api/advanceSearch";
    export default {
        props:{
            risk:{
                type:Boolean, 
                default:false,
            },
            isRemind:{
                type:Boolean, 
                default:false,
            }
        },
        data(){
           return {
            step: '1',
            isXian: true,
            visible:true,
            isShowXian1:false,
            isShowXian2:false,
            isShowXian3:false,
            isShowXian4:false,
            isShowXian5:false,
            isUsed: true,
            isExit: true,
            isShow: false,
            companyInfo:{},
            companyId:'',
            dataCount:'',
            relationScorePlace: 0,
            publicCreditScorePlace:0,
            basicInfoScorePlace:0,
            innovateScorePlace:0,
            operationStatusScorePlace:0,
            companyId:''
           }
        },
        computed: {
            userInfo () {
                return this.$store.getters.userInfo.saasName;
            },
        },
        created() {
            if(!this.risk) {
                this.isShow = true
                if (this.isRemind) {
                    this.step = "4"
                    this.isXian = false
                }
            }
        },
        mounted() {
            Api_UserSelfInfo().then(res=>{
                this.companyId = res.companyId
            })
        },
        methods: { 
            OnMouseOver(){},
            leave(){
                this.isShowXian1 = false
                this.isShowXian4 = false
                this.isShowXian3 = false 
                this.isShowXian2 = false
                this.isShowXian5 = false
            },
            handleApi_GetDataCount(param) {
                Api_GetDataCount({
                  companyId: param
                }).then(res => {
                    this.dataCount = res.result[0];
                });
            },
            statementsClick(){
                this.step = ""
                this.isShow = false
                this.$emit('hideRiskModel',false)
                if (this.$route.query.IsShowF||this.$route.fullPath=='/front/creditManagement/todo') {
                    this.$emit('renderScroll',7,0)
                    this.$router.push({
                        path:'/userCenter/companyCenter/companyCenterMain',
                        query:{
                            index: 7,
                            itemindex: 0
                        }
                    })
                }else {
                    this.$emit('renderScroll',7,0)
                } 
            },
            managementClick(){
                this.step = ""
                this.isShow = false
                this.$emit('hideRiskModel',false)
                if (this.$route.query.IsShowF||this.$route.fullPath=='/front/creditManagement/todo') {
                    this.$emit('renderScroll',6,1)
                    this.$router.push({
                        path:'/userCenter/companyCenter/companyCenterMain',
                        query:{
                            index: 6,
                            itemindex: 1
                        }
                    })
                }else {
                    this.$emit('renderScroll',6,1)
                } 
            },
            staffClick(){
                this.step = ""
                this.isShow = false
                this.$emit('hideRiskModel',false)
                if (this.$route.query.IsShowF||this.$route.fullPath=='/front/creditManagement/todo') {
                    this.$emit('renderScroll',6,2)
                    this.$router.push({
                        path:'/userCenter/companyCenter/companyCenterMain',
                        query:{
                            index: 6,
                            itemindex: 2
                        }
                    })
                }else {
                    this.$emit('renderScroll',6,2)
                } 
            },
            conpanyTreatClick(){
                this.step = ""
                this.isShow = false
                this.$emit('hideRiskModel',false)
                if (this.$route.query.IsShowF||this.$route.fullPath=='/front/creditManagement/todo') {
                    this.$emit('renderScroll',6,0)
                    this.$router.push({
                        path:'/userCenter/companyCenter/companyCenterMain',
                        query:{
                            index: 6,
                            itemindex: 0
                        }
                    })
                }else {
                    this.$emit('renderScroll',6,0)
                } 
            },
            userClick(){
                this.step = ""
                this.isShow = false
                this.$emit('hideRiskModel',false)
                if (this.$route.query.IsShowF||this.$route.fullPath=='/front/creditManagement/todo') {
                    this.$emit('renderScroll',5,3)
                    this.$router.push({
                        path:'/userCenter/companyCenter/companyCenterMain',
                        query:{
                            index: 5,
                            itemindex: 3
                        }
                    })
                }else {
                    this.$emit('renderScroll',5,3)
                } 
            },
            mainClick(){
                this.step = ""
                this.isShow = false
                this.$emit('hideRiskModel',false)
                if (this.$route.query.IsShowF||this.$route.fullPath=='/front/creditManagement/todo') {
                    this.$emit('renderScroll',5,0)
                    this.$router.push({
                        path:'/userCenter/companyCenter/companyCenterMain',
                        query:{
                            index: 5,
                            itemindex: 0
                        }
                    })
                }else {
                    this.$emit('renderScroll',5,0)
                } 
            },
            provideClick(){
                this.step = ""
                this.isShow = false
                this.$emit('hideRiskModel',false)
                if (this.$route.query.IsShowF||this.$route.fullPath=='/front/creditManagement/todo') {
                    this.$emit('renderScroll',5,2)
                    this.$router.push({
                        path:'/userCenter/companyCenter/companyCenterMain',
                        query:{
                            index: 5,
                            itemindex: 2
                        }
                    })
                }else {
                    this.$emit('renderScroll',5,2)
                } 
            },
            prodectClick(){
                this.step = ""
                this.isShow = false
                this.$emit('hideRiskModel',false)
                if (this.$route.query.IsShowF||this.$route.fullPath=='/front/creditManagement/todo') {
                    this.$emit('renderScroll',4,0)
                    this.$router.push({
                        path:'/userCenter/companyCenter/companyCenterMain',
                        query:{
                            index: 4,
                            itemindex: 0
                        }
                    })
                }else {
                    this.$emit('renderScroll',4,0)
                } 
            },
            CustomerClick(){
                this.step = ""
                this.isShow = false
                this.$emit('hideRiskModel',false)
                if (this.$route.query.IsShowF||this.$route.fullPath=='/front/creditManagement/todo') {
                    this.$emit('renderScroll',1,0)
                    this.$router.push({
                        path:'/userCenter/companyCenter/companyCenterMain',
                        query:{
                            index: 1,
                            itemindex: 0
                        }
                    })
                }else {
                    this.$emit('renderScroll',1,0)
                } 
            },
            businessRiskClick(){
                this.step = ""
                this.isShow = false
                this.$emit('hideRiskModel',false)
                if (this.$route.query.IsShowF||this.$route.fullPath=='/front/creditManagement/todo') {
                    this.$emit('renderScroll',2,0)
                    this.$router.push({
                        path:'/userCenter/companyCenter/companyCenterMain',
                        query:{
                            index: 2,
                            itemindex: 0
                        }
                    })
                }else {
                    this.$emit('renderScroll',2,0)
                }
            },
            supplierClick(){
                this.step = ""
                this.isShow = false
                this.$emit('hideRiskModel',false)
                if (this.$route.query.IsShowF||this.$route.fullPath=='/front/creditManagement/todo') {
                    this.$emit('renderScroll',3,0)
                    this.$router.push({
                        path:'/userCenter/companyCenter/companyCenterMain',
                        query:{
                            index: 3,
                            itemindex: 0
                        }
                    })
                }else {
                    this.$emit('renderScroll',3,0)
                }
            },
            baseInfoClick(){
                this.step = ""
                this.isShow = false
                this.$emit('hideRiskModel',false)
                if (this.$route.query.IsShowF||this.$route.fullPath=='/front/creditManagement/todo') {
                    this.$emit('renderScroll',0,0)
                    this.$router.push({
                        path:'/userCenter/companyCenter/companyCenterMain',
                        query:{
                            index: 0,
                            itemindex: 0
                        }
                    })
                }else {
                    this.$emit('renderScroll',0,0)
                }
            },
            atOnceUse(){
                this.$router.push('/front/creditManagement/todo')
            },
            atOnceExp(){
                this.step = ''
                this.isShow = true
                this.isUsed = false
                this.step = 2 
                this.handleApi_GetDataCount(this.companyId)
                this.$refs.video.play()
                this.loadTableData(this.companyId).then(res=>{ 
                    if(res){
                        var time = setTimeout(()=>{
                            this.step = 3
                            clearTimeout(time)
                        },3000)
                    }
                })
            },
            addInfo(){
                 this.step = ""
                 this.isShow = false
                 this.$router.push('/userCenter/companyCenter/companyCenterMain')
                // if (this.risk) {
                //     this.step = ""
                //     this.isShow = false
                //     this.$emit('hideRiskModel',false)
                // }else {
                //     this.step = ""
                //     this.isShow = false
                //     this.$router.push('/userCenter/companyCenter/companyCenterMain')
                // }
            },
            strSlice (str){
                let index = str.lastIndexOf("%")
                str =str.substring(0,index);
                return Number(str)
            },
            atonceuse(){
                this.step = ""
                this.$router.push('/front/creditManagement')
                this.isShow = false
                this.$emit('hideRiskModel',false)
            },
            hideModel(){
                // 跳转到信用管理首页,从我的企业进入直接隐藏即可
                if(this.risk){
                    this.step = ''
                    this.isShow = false
                    this.$emit('hideRiskModel',false)
                }else {
                    this.step = ''
                    this.isShow = false
                    this.$emit('hideRiskModel',false)
                    this.$router.push({
                        path:'/front/creditManagement/todo'
                   })
                }
            },
            hideModel1(){
                this.step = ''
                this.isShow = false
                this.$emit('hideRiskModel',false)
            },
            loadTableData(companyId){
                return new Promise(resolve=>{
                    Api_getCreditScore({ companyId: companyId }).then((res) => {
                            // 若是返回的数据不等于null就正常执行，不然按照不存在来执行
                            if(res){
                                this.companyInfo = res;
                                this.relationScorePlace = this.strSlice(this.companyInfo.relationScorePlace)
                                this.publicCreditScorePlace = this.strSlice(this.companyInfo.publicCreditScorePlace)
                                this.basicInfoScorePlace= this.strSlice(this.companyInfo.basicInfoScorePlace)
                                this.innovateScorePlace= this.strSlice(this.companyInfo.innovateScorePlace)
                                this.operationStatusScorePlace= this.strSlice(this.companyInfo.operationStatusScorePlace)
                                const chartData = [];
                                chartData.push(this.companyInfo.baseInfo.score);
                                chartData.push(this.companyInfo.techInnovation.score);
                                chartData.push(this.companyInfo.manageState.score);
                                chartData.push(this.companyInfo.relatedStructure.score);
                                chartData.push(this.companyInfo.publicCredit.score);
                                this.getEcharts(chartData)
                                resolve(true)
                            }else{
                                this.step = 2 
                                this.$refs.video.play()
                                var time = setTimeout(()=>{
                                    this.step = 3
                                    const chartData = [0,0,0,0,0]
                                    this.getEcharts(chartData)
                                    clearTimeout(time)
                                },3000)
                            }
                    })
                }) 
            },
            goExperience(conpanyName){
                if (this.risk) {
                    this.step = ''
                    this.isUsed = false
                } else {
                    this.step = 1
                }
                this.isShow = true
                this.step = 2 
                this.handleApi_GetDataCount(this.companyId)
                this.$refs.video.play()
                this.loadTableData(this.companyId).then(res=>{ 
                    if(res){
                        var time = setTimeout(()=>{
                            this.step = 3
                            clearTimeout(time)
                        },3000)
                    }
                })
            },
            getEcharts(chartData){
                var myChart = echarts.init(document.getElementById('leftCharts'));
                // 指定图表的配置项和数据
                    var option = {
                        radar: {
                            radius: "75%",
                            name: {
                                textStyle: {
                                    color: '#7a7c7f',
                                    borderRadius: 3,
                                }
                            },
                            indicator: [
                            { name: "基本情况", max: this.companyInfo.baseInfo?this.companyInfo.baseInfo.totalScore:100},
                            { name: "技术创新", max: this.companyInfo.techInnovation?this.companyInfo.techInnovation.totalScore:100},
                            { name: "经营状况", max: this.companyInfo.manageState?this.companyInfo.manageState.totalScore:100},
                            { name: "关联结构", max: this.companyInfo.relatedStructure?this.companyInfo.relatedStructure.totalScore:100 },
                            { name: "公共信用", max: this.companyInfo.publicCredit?this.companyInfo.publicCredit.totalScore:100},
                            ],
                            splitArea : {
                                show : true,   
                                areaStyle : {
                                    color: ['#fff', '#f7f8f9','#ffffff', '#f7f8f9', '#fff',]  
                                    // 图表背景网格的颜色
                                }
                            },
                            splitLine: {
                                lineStyle: {
                                    color: ['#e2e5ed']
                                }  
                            }, 
                            axisLine: {
                                lineStyle: {
                                    color: '#e2e5ed' // 分割线
                                }
                            }                            
                        },
 
                        series: [{
                            name: '能力',
                            type: 'radar',
                            symbol: "none",
                            itemStyle: {
                                normal: {
                                color : "rgba(0,0,0,0)", // 图表中各个图区域的边框线拐点颜色
                                lineStyle: {
                                    color:"#e4e7ee" // 图表中各个图区域的边框线颜色
                                }
                            },
                                          
                        },
                        areaStyle: {
                            color: '#91c6fe',
                            normal: {
                                color : "rgba(0,0,0,0)",
                                lineStyle: {
                                    color:"white" // 图表中各个图区域的边框线颜色
                                },
                            }
                        },
                        data: [
                            {
                            name: "能力值",
                            value: chartData,
                            areaStyle:{
                                color: '#238dfd',
                                opacity: 0.5,
                            },
                            lineStyle:{
                                color:"#3a93f1"
                            }
                            }
                        ]
                    }]
                }
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            }
        },
    }
</script>
<style scoped lang="scss">
    .ProcessBase{
        width: 700px;
        margin-left: 30px;
        cursor: pointer;
        .itemProcessBase {
            line-height: 30px;
            width: 50%;
            float: left;
            text-align: right;

            .itemProcessBase_title {
                font-size:13px;
                font-size: bold;
                color: #3b3b3b;
                text-align: right;
            }
            .itemProcessBase_num {
                margin-right:28px ;
                width: 100px;
                font-style: italic;
                display: inline-block;

            }
            .numColor{
                color: #4b9df3;
            }
            .item_btn{
                color: #999;
                font-size: 12px;
                &.numColor{
                    color: #4b9df3;
                }
            }
        }
    }
.dialogRisk {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 998;
    &.show {
        display: block;
    }
  }
  .infowarn {
      color: #ff9900;
  }
 .close-wrap {
     position: absolute;
        right: 10px;
        top: 0;
        z-index: 999;
      span {
        display: inline-block;
        padding-top: 24px;
        padding-right: 22px;

        i {
          font-size: 15px;
          color: #9b9fa4;
        }
      }
  }
  .dialogRisk-register{
    width: 900px;
    height: 480px;
    margin: 100px auto;
    padding: 95px 120px 0 107px;
    background-color: #fff;
    /* border-radius: 10px; */
      position: relative;
      background: #fff url(../../assets/images/bg/zc1BG.png) no-repeat center;
      .infotext {
        font-size: 16px;
        color: #999;
      }
  }
  .dialogRisk-noconpany{
    width: 900px;
    height: 480px;
    margin: 100px auto;
    padding: 95px 120px 0 107px;
    background-color: #fff;
    background: #fff url(../../assets/images/bg/zc3BG.jpg) no-repeat center;
    border-radius: 10px;
    position: relative;
  }
.dialogRisk-company{
    width: 900px;
    height: 480px;
    margin: 100px auto;
    padding: 95px 120px 0 107px;
    background-color: #fff;
    background: #fff url(../../assets/images/bg/zc2BG.png) no-repeat center;
    border-radius: 10px;
    position: relative;
    
}
  .dialogRisk-xiu{
    width: 900px;
    /* height: 500px; */
    margin: 50px auto;
    background-color: #fff;
    border-radius: 10px;
    position: relative;
    overflow: hidden;
    padding-bottom: 10px;
  }
  .dialogRisk-top {
      position: relative;
      background-color: #f7f8f9;
      padding: 14px 38px 14px 38px;
      border-radius: 10px;
      .dialogRisk-top-title{
        color: #b3b4b4;
        font-size: 13px;
        line-height: 34px;
      }
      .dialogRisk-top-title1{
         /* padding-left: 35px;  */
         font-weight: 500;
         font-size: 20px;
         line-height: 34px;
    }
    .dialogRisk-top-title2{
        /* padding-left: 35px;  */
        width: 565px;
        font-weight: 500;
        font-size: 13px;
        line-height: 24px;
    }
      .button1 {
        width: 160px;
        height: 50px;
        cursor: pointer;
        position: absolute;
        right: 51px;
        top: 38px;
        font-size: 20px;
        line-height: 48px;
        text-align: center;
        border-radius: 43px;
        border: 1px solid $--color-primary ;
        background-color: $--color-primary ;
        color: #ffffff;
      }
      .button2 {
         width: 140px;
        height: 48px;
        cursor: pointer;
        position: absolute;
        right: 220px;
        top: 42px;
        font-size: 20px;
        line-height: 48px;
        text-align: center; 
        /* color:  $--color-primary; */
        } 

  }
  .dialogRisk-bottom {
    height: 240px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
    margin-bottom: 10px;
      .left {
          float: left;
          width: 325px;
          height: 240px;
          padding-top: 20px; 
          margin-left: 56px;
      }
      .right {
          float: left;
          padding-top: 37px;
          margin-left: 80px;
          text-align: center;
          .title_right {
            font-size: 16px;
            font-weight: 500;
            line-height: 24px;
          }
          .item_right {
              width: 310px;
              font-size: 13px;
              line-height: 30px;
              text-align: left;
              position: relative;
              .itemM {
                  margin-left: 28px;
              }
          }
      }
  }
  .dialogRisk-container {
    width: 900px;
    height: 480px;
    padding: 100px 0 0 106px;
    margin: 100px auto;
    background-color: #fff;
    background: #fff url(../../assets/images/bg/tj1BG.png);
    border-radius: 10px;
    position: relative;
    .title {
    font-size: 30px;
    line-height: 54px;
    }
    .info {
        font-size: 16px;
        color: #999;
        height: 65px;
    }

} 
.dialogRisk-dong {
    width: 900px;
    height: 480px;
    margin: 100px auto;
    background-color: #fff;
    border-radius: 10px;
    position: relative;
    overflow: hidden;
    .dong-after {
        position: absolute;
        bottom: 14px;
        left: 50%;
        color: grey;
        transform: translateX(-50%);
    }
}
.common {
    color:  $--color-primary ;
}
/deep/ .el-progress__text{
    color: #fff;
    display: none;
}
.title {
    font-size: 30px;
    line-height: 54px;
    }
.info {
    font-size: 16px;
    color: #999;

}
.goExamination{
    width: 200px;
    height: 60px;
    line-height: 60px;
    font-size: 25px;
    margin-right: 20px;
    text-align: center;
    display: inline-block;
    border-radius: 43px;
    cursor: pointer;
    border: 1px solid $--color-primary ;
    background-color: $--color-primary ;
    color: #ffffff;
}

.fullInfo {
    font-size: 18px;
    color:  $--color-primary;
    font-weight: 500;
    cursor: pointer;
}
.info1 {
    line-height:22px;
    font-size: 16px;
    color: #999;
}
.infoWarn {
    color: #fd9536;
}
.dialogRisk {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 998;
    &.show {
        display: block;
    }
  }
  .infowarn {
      color: #fcab6a;
  }
 
.common {
    color:  $--color-primary ;
}

.title {
    font-size: 30px;
    line-height: 54px;
    }
.info {
    font-size: 16px;
    color: #999;

}
.goExamination{
    width: 200px;
    height: 60px;
    line-height: 60px;
    font-size: 25px;
    margin-right: 20px;
    text-align: center;
    display: inline-block;
    border-radius: 43px;
    cursor: pointer;
    border: 1px solid $--color-primary ;
    background-color: $--color-primary ;
    color: #ffffff;
}

.fullInfo {
    font-size: 20px;
    color:  $--color-primary;
    font-weight: 500;
    cursor: pointer;
}
.info1 {
    line-height:23px;
    font-size: 16px;
    color: #999;
}
.dialogRisk-company{
    width: 900px;
    height: 480px;
    margin: 100px auto;
    padding: 95px 120px 0 106px;
    background-color: #fff;
    background: #fff url(../../assets/images/bg/zc2BG.png) no-repeat center;
    border-radius: 10px;
    position: relative;
    
}

#leftCharts {
    width: 350px;
    height: 240px;
    /* padding-top: 30px;  */
    
}
/deep/ #leftCharts > div{
    width: 330px !important; 
}
/deep/ #leftCharts >div > canvas {
    width: 330px;
    height: 240px; 
    
}
/deep/ .el-progress-bar .el-progress-bar__outer {
    width: 168px;
}
.itemProcess {
    display: flex;
    flex: 1;
    margin-top: 10px;
    cursor: pointer;
   .Process_item {
       height: 35px;
       float: left;
       font-size: 13px;
       padding-left: 90px;
       
   }

   .title1{
    float: left;
    width: 66px;
    text-align: right;
   }
   .activeProcess{
    color: #4b9df3;

    &.active {
        color: #999999;
    }
   }
}
.process {
    position: absolute;
    left: 75px;
    top: 50%;
    margin-top: -8px;
    margin-right: 10px;
}
.item_right_over {
    top: -49px;
    left: 10%;
    width: 150px;
    height: 34px;
    display: block;
    text-align: center;
    background-color: #fff;
    border-radius: 2px;
    position: relative;
    border: 1px solid #d1d4de;
    z-index: 999;
}
.item_right_over::before {
    width: 10px;
    content: '';
    height: 10px;
    border: 1px solid #d1d4de;
    background-color: #fff;
    position: absolute;
    left: 21px;
    bottom: -6px;
    transform: rotate(45deg);
    overflow: hidden;
    z-index: 998;
    border-left:0;
    border-top:0;
}
</style>
