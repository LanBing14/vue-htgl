<template>
    <div class="contractPerformance">
        <div class="contractMain">
             <span class="title">负面信息分布</span>
             <div id="negativeInfo"  
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading" 
                ref="negativeInfo" style="height:206px;width:100%;margin-top:77px">
             </div>
        </div>
    </div>
</template>
<script>
// import echarts from 'echarts';
import resize from './mixins/resize'
import {negativeInformation} from "@/api/monitor/overView.js"
export default{
    mixins: [resize],
    props:['query'],
    data(){
        return {
            loading:false,
            chart:null
        }
    },
    watch:{
        query:{
            handler(newVal,oldVal){
                this.getData(newVal)
            },
            deep:true
            // immediate:true
        }
    },
    mounted(){
        this.chart = echarts.init(this.$refs.negativeInfo);
        this.getData(this.query)
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
            // var myChart = echarts.init(document.getElementById('negativeInfo'));

            // 指定图表的配置项和数据
             var  option = {
                title: {
                    text: '负面信息',
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
                color:['#3fb1f3','#32ddd9','#89ddfb','#a7b9e3',"#fe7e86","#f6de5a","#6ce28f","#fb9f3c","#7c8290"],
   
                legend: {
                    orient: 'vertical',
                    left: 17,
                    top:36,
                    icon:'circle',
                    itemGap:20,
                    color:'#343434',
                    data: ['失信被执行人', '被执行人','法院公告', '裁判文书','行政处罚','经营异常','严重违法失信','欠税欠缴','黑名单']
                },
   
                series: [

                    {
                        name: '负面信息分布',
                        type: 'pie',
                        radius: ['80%', '100%'],
                        center: ['65%', '50%'],//设置饼图位置
                        avoidLabelOverlap: false,
                        hoverAnimation:false,
                        itemStyle:{
                            borderWidth:10,
                            borderColor:"#fff",
                        },
                        // left:300,
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
                        data: dynamicData
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
            this.loading=true;
      
            negativeInformation({...newVal}).then((res)=>{
                this.loading=false;
                
                var  dynamicData=[   
                            {value: res.dishonestPerson, name: '失信被执行人'},
                            {value: res.executedPerson, name: '被执行人'},
                            {value: res.courtAnnouncement, name: '法院公告'},
                            {value: res.judgement, name: '裁判文书'},
                            {value: res.administrativePenalties, name: '行政处罚'},
                            {value: res.businessException, name: '经营异常'},
                            {value: res.seriousViolation, name: '严重违法失信'},
                            {value: res.owedTax, name: '欠税欠缴'},
                            {value: res.blacklist, name: '黑名单'}
                ]
                 this.$nextTick(()=>{
                   if(this.chart){
                      this.init(dynamicData)
                   }
                 })
            }).catch(err=>{
                this.loading=false;
                this.$message.error(err);
            })

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