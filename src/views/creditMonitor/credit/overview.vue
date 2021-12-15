<template>
    <div class="over-view-wrap">
        <div class="header clearfix">
            <div class="headerMain">
                <div class="fl titleWrap">
                    <span class="title">监测概览</span>
                </div>
                <div class="fr">
                    <div class="dateChooseParent">
                        <el-date-picker
                            v-model="dateChoose"
                            type="daterange"
                            unlink-panels
                            style="float:left;margin-top:23px"
                            range-separator="至"
                            :default-value="changeInitVal"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                        <ul class="dateSmallBtn">
                        <li><el-button type="text" v-bind:class="{ activeBtn: isActive==3 }" @click="today">今天</el-button></li>
                        <li><el-button type="text" v-bind:class="{ activeBtn: isActive==1 }" @click="week">近一周</el-button></li>
                        <li><el-button type="text" v-bind:class="{ activeBtn: isActive==2 }" @click="month">近一月</el-button></li>
                        </ul>
                    </div>                    
                </div>
            </div>

        </div>
        <!-- 监测动态统计与监测企业排行 -->
        <div>
            <el-row>
                <el-col :span="16">
                    <monitoringDy 
                    :res="res"
                    v-loading="loading" 
                    element-loading-text="拼命加载中" 
                    element-loading-spinner="el-icon-loading"
                    >
                    </monitoringDy>
                </el-col>
                <el-col :span="8">
                    <monitRank :query="query"></monitRank>
                </el-col>
            </el-row>
        </div>

        <!-- <div class="wrap" style="margin-top:20px">
            <div style="display: flex">
              <div class="flex-primary">
                  <el-row :gutter="20" class="row">
                  <el-col :span="12">
                      <section class="area11 flex col">
                      <div class="title">
                          <h3 class="title-name flex-primary">风险维度分析</h3>
                      </div>
                      <div class="con con11 flex-primary">
                          <EchartsModelIns modelId="TB-2010-00020" :query="query"></EchartsModelIns>
                      </div>
                      </section>
                  </el-col>
                  <el-col :span="12">
                      <section class="area12 flex col">
                      <div class="title">
                          <h3 class="title-name flex-primary">负面信息分布</h3>
                      </div>
                      <div class="con con12 flex-primary">
                          <EchartsModelIns modelId="TB-2010-00021" :query="query"></EchartsModelIns>
                      </div>
                      </section>
                  </el-col>
                  </el-row>
              </div>
            </div>
      </div>  -->

      <el-row style="padding:0 0 0;margin-top:20px;background:#f7f8fa">
          <el-col :xs="12" :sm="12" :lg="12">
            <div class="chart-wrapper">
              <fengxian 
              :res="res"
              v-loading="loading" 
              element-loading-text="拼命加载中" 
              element-loading-spinner="el-icon-loading"
              >
              </fengxian>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="12">
            <div class="chart-wrapper">
              <negativeInfo :query="query"></negativeInfo>
            </div>
          </el-col>
      </el-row> 

      <el-row style="padding:0 0 0;margin-top:20px;background:#f7f8fa">
          <el-col :xs="12" :sm="12" :lg="12">
            <div class="chart-wrapper">
              <riskTrends :query="query"></riskTrends>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="12">
            <div class="chart-wrapper">
              <warning  :query="query"></warning>
            </div>
          </el-col>
      </el-row> 

    </div> 
</template>

<script>
import monitoringDy from "./components/monitoringDynamic"
import monitRank from "./components/monitRank"
// 这是风险维度分析
import fengxian from "./components/fengxian.vue"
//  这是负面信息分布
import negativeInfo from "./components/negativeInfo.vue"
// 这是风险趋势分析
import riskTrends from "./components/riskTrends.vue"

// 预警趋势分析导入
import warning from "./components/warningTrend.vue"

import LineChart from "./components/LineChart"

import {Api_GetmonitoringDy} from "@/api/monitor/overView.js"
import EchartsModelIns from "@/components/EchartsModelIns";

export default{
    data(){
        return {
            // lineChartData: lineChartData.newVisitis,
            dateChoose: '', // 日期选择
            query:{},// 请求的时间
            query12: {},
            query11: {},
            isActive:'',
            loading:false,
            res:{}   // 所有请求返回的数据
        }
    },

    components:{
        monitoringDy,
        monitRank,
        fengxian,
        negativeInfo,
        riskTrends,  // 风险趋势分析
        warning, //预警趋势分析
        EchartsModelIns,
        LineChart
    },
    created(){
      this.week();
    },
    mounted(){
      this.$nextTick(()=>{
         this.isActive=1;
      })
    },
    computed:{
        changeInitVal(){
            var now=new Date();
            var startDate = new Date(Date.UTC(now.getFullYear(), now.getMonth()-1, now.getDate())).toISOString().slice(0, 10);
            var endDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())).toISOString().slice(0, 10);
            this.date=[];
            this.date.push(startDate)
            this.date.push(endDate)
            return  this.date;
        }
    },
    watch:{
      dateChoose(newVal,oldVal){
        if(newVal){
            this.query={
                startDate: this.$dateFormat(newVal.slice(0)[0]),
                endDate: this.$dateFormat(newVal.slice(0)[1]),
            }
            this.getData(this.query);
            this.isActive='';
        }

      }

    },
    methods:{
        // 今天
        today(){
          const start=this.$dateFormat(new Date());
          const end = this.$dateFormat(new Date());
          this.isActive=3;
          this.query={
            startDate:start,
            endDate:end
          }
          this.getData(this.query);
          this.dateChoose='';
        },
        // 近一周
        week(){
            const end = new Date();
            const start = new Date();
            start.setTime(
                start.getTime() - 3600 * 1000 * 24 * 6
            );

          var startWeek= this.$dateFormat(start);
          var endWeek =this.$dateFormat(end);
          this.isActive=1;

          this.query={
            startDate:startWeek,
            endDate:endWeek
          }

          this.getData(this.query);
          this.dateChoose='';
        },
        // 近一月
        month(){
            const end = new Date();
            const start = new Date();
            start.setMonth(start.getMonth() - 1);
            var startMonth=this.$dateFormat(start);
            var endMonth=this.$dateFormat(end);
           
            this.isActive=2;
            this.dateChoose='';
            this.query={
              startDate:startMonth,
              endDate:endMonth
            },
            this.getData(this.query);
            
        },
        // 监测动态统计 与 风险维度分析
        getData(newVal){
          this.loading=true;
          Api_GetmonitoringDy({...newVal}).then((res)=>{
            this.loading=false;
            this.res=res;
          }).catch(err=>{
            this.loading=false;
            this.$message.error(err);
          })
        }

    }
}
</script>



<style>


</style>







<style scoped lang="scss">
// 实验开始
/*@import '~@/styles/element-variables.scss';*/
$--color-primary: #4b9df3;
.wrap {
  background-color: #f7f8fa;
  padding: 0 !important;

  .flex-primary {
    flex: 1;
  }

  .row {
    margin-bottom: 20px;

    &.row2 {
      height: 644px;
    }
  }

  .row:last-child {
    margin-bottom: 0;
  }

  section {
    padding: 0 0 20px;
    background-color: #fff;

    &.right-area {
      height: 100%;

      .con {
        padding-left: 30px;
        padding-right: 30px;
      }

      .title {
        margin-bottom: 20px;
      }
    }

    &.area3 {
      margin-bottom: 20px;
    }

    &.area4,
    &.area5,
    &.area6 {
      height: 245px;
    }

    &.area8,
    &.area9,
    &.area10,
    &.area11,
    &.area12 {
      height: 379px;
    }

    &.area13 {
      padding-bottom: 30px;

      .title {
        /*margin-bottom: 10px;*/
      }
    }

    &.area14,
    &.area15 {
      height: 644px;
    }

    &.area15 {
      margin-top: 20px;
      height: 775px;
    }

    .title {
      padding: 26px 30px 18px;
      display: flex;
      /*line-height: 35px;*/

      .title-name {
        font-size: 16px;
        color: #333333;
        padding-left: 19px;
        position: relative;

        &::before {
          content: "";
          display: inline-block;
          position: absolute;
          left: 0;
          top: 50%;
          margin-top: -10px;
          width: 4px;
          height: 20px;
          background-color: $--color-primary;
        }
      }

      .action-btn {
        cursor: pointer;
        font-size: 13px;
        color: $--color-primary;
        margin-left: auto;
      }

      .title-action-tip {
        margin-left: auto;
        font-size: 12px;
        color: #999999;
      }
    }

    .con {
      &.con1 {
        padding: 0 30px;

        .unit {
          font-size: 15px;
          vertical-align: text-bottom;
        }

        .item {
          padding: 22px 0 34px 19px;
          margin-top: 10px;
          margin-bottom: 10px;

          h1 {
            font-size: 25px;
            margin: 0;
            line-height: 24px;
          }

          h5 {
            font-size: 14px;
            margin-bottom: 38px;
          }

          &.item1,
          &.item6,
          &.item8 {
            background: url("~@/assets/images/creditManagement/light-purple.png") no-repeat 0 / cover;
          }

          &.item2 {
            background: url("~@/assets/images/creditManagement/light-yellow.png") no-repeat 0 / cover;
          }

          &.item3,
          &.item5 {
            background: url("~@/assets/images/creditManagement/light-green.png") no-repeat 0 / cover;
          }

          &.item4,
          &.item7 {
            background: url("~@/assets/images/creditManagement/light-blue.png") no-repeat 0 / cover;
          }
        }
      }

      &.con3 {
        /*height: 100%;*/
      }

      &.con13 {
        padding: 0 30px;

        .item {
          height: 150px;
          display: flex;

          .l {
            width: 40%;
            background-color: #eaedf4;
          }

          .r {
            background-color: #f7f8f9;
            text-align: right;
            padding-right: 10%;
            padding-bottom: 25px;
            color: #606266;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;

            .n {
              font-size: 20px;
            }

            .u {
              font-size: 12px;
              margin-left: 5px;
            }

            .t {
              margin-top: 15px;
              color: #606266;
            }
          }
        }
      }
    }
  }

  /deep/ .el-table {
    .ph-color {
      display: inline-block;
      width: 18px;
      height: 18px;
      line-height: 18px;
      text-align: center;
      border-radius: 3px;

      &.ph-color1 {
        background-color: rgba(253, 104, 113, 1);
        color: #fff;
      }

      &.ph-color2 {
        background-color: rgba(248, 155, 55, 1);
        color: #fff;
      }

      &.ph-color3 {
        background-color: rgba(244, 214, 15, 1);
        color: #fff;
      }
    }

    .bar-wrap {
      margin-top: 10px;
      margin-bottom: 3px;
      background-color: rgba(234, 237, 244, 1);
      height: 5px;
      border-radius: 2px;

      .bar-inner {
        width: 0;
        transition: all 0.2s;
        background-color: rgba(132, 202, 255, 1);
        height: 5px;
        border-radius: 2px;
      }
    }

    &.table3 {
      td {
        vertical-align: top;
      }
    }

    &::before {
      content: none;
    }

    tbody .title-name {
      color: rgba(132, 202, 255, 1);
    }
  }
}

.right-content {
  flex: 0 480px;
  padding-left: 10px;
}


// 实验结束
</style>
































<style scoped lang="scss">
.clearfix::after{
    display: block;
    content:"";
    clear: both;
}
.over-view-wrap{
    width:100%;
    // height: calc(100vh - 90px);
    background:#f7f8f9;
    padding: initial!important;
}
.fl{
    float: left;
}
.fr{
    float: right;
}

.header{
    height: 78px;
    background-color: #fff;
    padding: 0 25px;
    margin-bottom: 20px;
   .headerMain{
       .titleWrap{
           padding-top: 14px;
           border-bottom: 2px solid #4b9df3;
       }
       .title{
           font-size: 16px;
           color: #333;
           line-height: 40px;
          
       }
   }

   .dateChooseParent{
        float:right;
        line-height: 80px;
        width:600px;
    }
    .dateSmallBtn{
        li{
            float: left;
            font-size: 15px;
            color:#333333;
            padding:0 20px;
        
        }
    }
}



.trendWrap{
    display: flex;
    justify-content: space-between;
    margin-top:20px;
    li{
        width:calc(50% - 10px);
        height: 420px;
        background:#fff;
    }
}


.riskTrendWrap{
    margin-top:20px;
    display: flex;
    li{
        flex:1;
        background:#fff
    }

    li:nth-child(1){
        margin-right:10px
    }
    li:nth-child(2){
        margin-left:10px
    }
}
</style>

<style lang="scss">
.dateSmallBtn{
  .el-button--text{
    color: #343434;
  }
  .el-button--text:active {
    color: #448ddb;
    border-color: transparent;
    background-color: transparent;
  }
  .el-button--text:hover, .el-button--text:focus {
    color: #6fb1f5;
    border-color: transparent;
    background-color: transparent;
  }

  .activeBtn{
    color:#4b9df3!important;
  }
}

</style>