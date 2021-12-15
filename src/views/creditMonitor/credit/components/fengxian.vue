<template>
    <div class="contractPerformance">
        <div class="contractMain">
             <span class="title">风险维度分析</span>
             <div id="fengxian"
              ref="fengxian"
              style="height:206px;width:100%;margin-top:77px"
              v-loading="loading"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading" 
            >
             </div>
        </div>
    </div>
</template>
<script>
import echarts from 'echarts'
import resize from './mixins/resize'
import {Api_GetmonitoringDy} from "@/api/monitor/overView.js"
export default{
    props:['res'],
    mixins: [resize],
    data(){
        return {
            loading:false,
            chart:null
        }
    },
    watch:{
        res:{
            handler(newVal){
                this.getData(newVal)
            },
            deep:true
            // immediate:true
        }
    },
    mounted(){
        this.chart = echarts.init(this.$refs.fengxian);
        // this.getData(this.res)
    },
    beforeDestroy () {
        if (!this.chart) {
            return
        }
        this.chart.dispose()
        this.chart = null
    },
    methods: { 

        init(dynamicData){
            // 基于准备好的dom，初始化echarts实例
            // var myChart = echarts.init(document.getElementById('fengxian'));

            // 指定图表的配置项和数据
             var  option = {
                 title: {
                    text: '风险维度分析',
                    textStyle: {
                        fontSize: 16,
                        color: '#6e6f73',
                        fontWeight:'normal'
                    },
                    textAlign: 'center',
                    left: '64%',
                    top: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                color:['#32ddd9','#fe7e86','#3fb1f3','#89ddfb'],

                legend: {
                    orient: 'vertical',
                    left: 78,
                    top:36,
                    icon:'circle',
                    itemGap:28,
                    color:'#343434',
                    data: ['正面信息', '负面信息','企业经营', '业务变更']
                },
   
                series: [

                    {
                        name: '风险维度分析',
                        type: 'pie',
                        radius: ['80%', '100%'],
                        center: ['65%', '50%'],//设置饼图位置
                        avoidLabelOverlap: false,
                        hoverAnimation:false,
                        itemStyle:{
                            borderWidth:10,
                            borderColor:"#fff",
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: false,
                                fontSize: '16',
                               
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data:dynamicData
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
        },
        // 调用接口获取数据
        getData(newVal){

            var   dynamicData=[   
                { name: "正面信息", value: newVal.positiveMessage },
                { name: "负面信息", value: newVal.negativeMessage},
                { name: "企业经营", value: newVal.businessManagement },
                { name: "业务变更", value: newVal.businessChange}
            ]
            this.$nextTick(()=>{
                if(this.chart){
                    this.init(dynamicData)
                }
                
            })

            // this.loading=true;
   
            // Api_GetmonitoringDy({...newVal}).then((res)=>{
            //     this.loading=false;
            //   var   dynamicData=[   
            //         { name: "正面信息", value: res.positiveMessage },
            //         { name: "负面信息", value: res.negativeMessage},
            //         { name: "企业经营", value: res.businessManagement },
            //         { name: "业务变更", value: res.businessChange}
            //     ]
            //      this.$nextTick(()=>{
            //         if(this.chart){
            //             this.init(dynamicData)
            //         }
                      
            //      })

            // }).catch(err=>{
            //     this.loading=false;
            //     this.$message.error(err);
            // })

    
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
        margin-right: 10px;
        padding-bottom: 54px;
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