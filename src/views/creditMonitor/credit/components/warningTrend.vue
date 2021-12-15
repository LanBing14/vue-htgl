<template>
    <div class="contractPerformance">
        <div class="contractMain">
             <span class="title">预警趋势分析</span>
             <div id="warning" 
                ref="warning" 
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading" 
                style="height:339px;width:100%;margin-top:15px;">
             </div>
        </div>
    </div>
</template>
<script>
import echarts from 'echarts'
import resize from './mixins/resize'
import {getWarningTrend} from "@/api/monitor/overView.js"
export default{
    mixins: [resize],
    props:['query'],
    data(){
        return {
            loading:false,
            chart:null
        }
    },
    mounted(){
        this.chart = echarts.init(this.$refs.warning);
        this.getData(this.query);
    },
    beforeDestroy () {
        if (!this.chart) {
            return
        }
        this.chart.dispose()
        this.chart = null
    },
    watch:{
        query:{
            handler(newVal,oldVal){
                this.getData(newVal)
            },
            deep:true
        }
    },
    methods: { 
        getData(newVal){
            this.loading=true;
            getWarningTrend({...newVal}).then((res)=>{
               this.loading=false;
               let  xData = [];
               let  majorWarningData = [];
               let  warningData=[];
               let  attentionWarningData=[];
               let  promptWarning=[];
               res.map(v => {
                    xData.push(v.date);
                    majorWarningData.push(v.majorWarningNum);
                    warningData.push(v.warningNum);
                    attentionWarningData.push(v.attentionWarningNum);
                    promptWarning.push(v.promptWarningNum);
                })
               
                this.$nextTick(()=>{
                    if(this.chart){
                        this.init(xData,majorWarningData,warningData,attentionWarningData,promptWarning);
                    }
                    
                })
               
            }).catch(err=>{
                this.loading=false;
                console.log(err)
            })
        },        
        init(xData,majorWarningData,warningData,attentionWarningData,promptWarning){
            // 基于准备好的dom，初始化echarts实例
            // var myChart = echarts.init(document.getElementById('warning'));

            // 指定图表的配置项和数据
            var option = {
                    xAxis: {
                        type: 'category',
                        data: xData,
                        axisTick:{
                            show:false
                        },
                        axisLabel:{
                            color:'#999999',
                            fontSize:12
                        },
                         //设置轴线的属性
                        axisLine:{
                            lineStyle:{
                                color:'#e8e8e8'
                            }
                        }  
                    },
                    yAxis: {
                        type: 'value',
                        axisTick:{
                            show:false
                        },
                        axisLabel:{
                            color:'#999999',
                            fontSize:12
                        },
                        //设置轴线的属性
                        axisLine:{
                            lineStyle:{
                                color:'#e8e8e8'
                            }
                        },
                        splitLine: { 
                            lineStyle:{
                                color: 'rgba(234, 237, 244, 1)'
                            }
                        }
                    },
                    grid: {
                        containLabel:true,
                        top: 50,
                        bottom:30,
                        left:0,
                        right:20
                    },
                    legend: {
                        data: ['重大预警', '警示预警', '关注预警', '提示预警'],  //图例
                        left:0,
                        icon:'circle',
                        textStyle:{
                            color:'#333333',
                            fontSize:12
                        }
                    },
                    color:['#fe7e86','#f6de5a','#3fb1f3','#32ddd9'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        },
                        // formatter:function(params){
                        // var html=""
                        // for(var i=0;i<params.length;i++){
                        //     var percent=data[params[i].seriesIndex].yPercent[params[i].dataIndex]
                        
                        //     html+="<p>"+params[i].value+"("+percent+")"+"</p>"
                        // }
                        // return html
                        // }
                    },
                    series: [
                        {
                            name: '重大预警',
                            type: 'line',
                            symbol:'none',
                            smooth: true,
                            data: majorWarningData
                        },
                        {
                            name: '警示预警',
                            type: 'line',
                            symbol:'none',
                            smooth: true,
                            data: warningData
                        },
                        {
                            name: '关注预警',
                            type: 'line',
                            symbol:'none',
                            smooth: true,
                            data: attentionWarningData
                        },
                        {
                            name: '提示预警',
                            type: 'line',
                            symbol:'none',
                            smooth: true,
                            data: promptWarning
                        }
                    ]
            };


            // 使用刚指定的配置项和数据显示图表。
            this.chart.setOption(option);
        },
        clear() {
            this.chart.clear()
        },
        resize() {
            this.chart.resize()
        }        
    }
}
</script>

<style scoped lang="scss">
.contractPerformance{
    background: #f7f8fa;
    .contractMain{
        padding-left: 25px;
        background: #fff;
        padding-top: 20px;
        background:#fff;
        margin-left: 10px;
        .title{
            padding-left: 15px;
            font-size: 16px;
            color: #333;
            font-weight: 400;
            border-left: 4px solid #3399e6;
           
            margin-right: 15px;
        }
    }
}
</style>