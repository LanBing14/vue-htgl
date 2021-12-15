<template>
  <div >
    <!-- 监测动态统计 -->
    <div class="monitoringDynamic"   v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
      <span class="title">监测动态统计</span>
      <div style="margin-top:17px">
        <ul class="dynamicList">
          <li
            v-for="(item,index) in dynamicData"
            :key="index"
            :style="{borderColor:colors[index%10].brColor,backgroundImage:'url('+colors[index%10].bgImg+')',backgroundColor:colors[index%10].bgColor}"
          >
            <div class="dynamicName">{{item.dynamicName}}</div>
            <div  :style="{'color':colors[index%10].text}">
              <span class="num">{{item.num}}</span>
              <span class="danwei">{{item.company}}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import blue from "@/assets/images/jianceO/1blue.png";
import orange from "@/assets/images/jianceO/2orange.png";
import green from "@/assets/images/jianceO/3green.png";
import cyan from "@/assets/images/jianceO/4cyan.png";
import {Api_GetmonitoringDy} from "@/api/monitor/overView.js"
export default {
  props:['res'],
  data() {
    return {
      dynamicData: [],
      loading:false,
      colors: [
        {bgColor: "#fff",brColor: "#ebf4fc",text: "#3e8ee0",bgImg: blue},
        { bgColor: "#ebf4fc", brColor: "#ebf4fc", text: "#3e8ee0",bgImg: blue },
        { bgColor: "#fbf4ee", brColor: "#fbf4ee", text: "#f7a44b",bgImg:orange},
        { bgColor: "#e7faf9", brColor: "#e7faf9", text: "#28cd59",bgImg: green },
        { bgColor: "#eaf8fe", brColor: "#eaf8fe", text: "#0eacdd",bgImg: cyan },
        { bgColor: "#fff", brColor: "#e7faf9", text: "#28cd59",bgImg: green  },
        { bgColor: "#e7faf9", brColor: "#e7faf9", text: "#28cd59",bgImg: green  },
        { bgColor: "#ebf4fc", brColor: "#ebf4fc", text: "#3e8ee0",bgImg: blue },
        { bgColor: "#eaf8fe", brColor: "#eaf8fe", text: "#0eacdd",bgImg: cyan },
        { bgColor: "#ebf4fc", brColor: "#ebf4fc", text: "#3e8ee0",bgImg: blue }
      ]
    };
  },
  watch:{
    res:{
      handler(newVal){
         this.dynamicData=[   
          { dynamicName: "全部动态", num: newVal.allDynamics, company: "条" },
          { dynamicName: "正面信息", num: newVal.positiveMessage, company: "条" },
          { dynamicName: "负面信息", num: newVal.negativeMessage, company: "条" },
          { dynamicName: "企业经营", num: newVal.businessManagement, company: "条" },
          { dynamicName: "业务变更", num: newVal.businessChange, company: "条" },
          { dynamicName: "监控企业", num: newVal.monitoringEnterprise, company: "个" },
          { dynamicName: "重大预警", num: newVal.majorWarning, company: "个" },
          { dynamicName: "警示预警", num: newVal.warning, company: "个" },
          { dynamicName: "关注预警", num: newVal.attentionWarning, company: "个" },
          { dynamicName: "提示预警", num: newVal.promptWarning, company: "个" }
        ]       
      },
      deep:true
      // immediate:true
    }
  },
  mounted(){
   
      this.dynamicData=[   
          { dynamicName: "全部动态", num: this.res.allDynamics, company: "条" },
          { dynamicName: "正面信息", num: this.res.positiveMessage, company: "条" },
          { dynamicName: "负面信息", num: this.res.negativeMessage, company: "条" },
          { dynamicName: "企业经营", num: this.res.businessManagement, company: "家" },
          { dynamicName: "业务变更", num: this.res.businessChange, company: "家" },
          { dynamicName: "监控企业", num: this.res.monitoringEnterprise, company: "个" },
          { dynamicName: "重大预警", num: this.res.majorWarning, company: "个" },
          { dynamicName: "警示预警", num: this.res.warning, company: "个" },
          { dynamicName: "关注预警", num: this.res.attentionWarning, company: "个" },
          { dynamicName: "提示预警", num: this.res.promptWarning, company: "个" }
       ]   
  },
  methods:{
    // 调用接口获取数据
    // getData:function(newVal){
    //   this.loading=true;
    //   Api_GetmonitoringDy({...newVal}).then((res)=>{
    //     this.loading=false;
    //     this.dynamicData=[   
    //       { dynamicName: "全部动态", num: res.allDynamics, company: "条" },
    //       { dynamicName: "正面信息", num: res.positiveMessage, company: "条" },
    //       { dynamicName: "负面信息", num: res.negativeMessage, company: "条" },
    //       { dynamicName: "企业经营", num: res.businessManagement, company: "家" },
    //       { dynamicName: "业务变更", num: res.businessChange, company: "家" },
    //       { dynamicName: "监控企业", num: res.monitoringEnterprise, company: "个" },
    //       { dynamicName: "重大预警", num: res.majorWarning, company: "个" },
    //       { dynamicName: "警示预警", num: res.warning, company: "个" },
    //       { dynamicName: "关注预警", num: res.attentionWarning, company: "个" },
    //       { dynamicName: "提示预警", num: res.promptWarning, company: "个" }
    //     ]
    //   }).catch(err=>{
    //     this.loading=false;
    //     this.$message.error(err);
    //   })
    // }
  }
};
</script>

<style lang="scss" scoped>
// 监测动态统计
.monitoringDynamic {
  height: 373px;
  background-color: #fff;
  padding: 25px;
  .title {
    padding-left: 15px;
    font-size: 16px;
    color: #333;
    font-weight: 400;
    border-left: 4px solid #3399e6;
    margin-right: 15px;
  }

  .dynamicList {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    li {
      width: calc(20% - 16px);
      height: 134px;
      padding-left: 20px;
      padding-top: 23px;
      margin: 0 10px 20px;
      border-width: 2px;
      border-style: solid;
      background-repeat: no-repeat;
      background-position: 85% 147%;
      .dynamicName {
        font-size: 14px;
        color: #333333;
        padding-bottom: 37px;
      }

      .num {
        font-size: 25px;
      }

      .danwei {
        font-size: 15px;
        display: inline-block;
        padding-left: 8px;
      }
    }

    li:nth-child(1),
    li:nth-child(6) {
      margin-left: 0;
    }
    li:nth-child(5),
    li:nth-child(10) {
      margin-right: 0;
    }
  }
}
</style>