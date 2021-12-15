<template>
    <div class="contractPerformance">
        <div class="contractMain">
             <span class="title">合同履约情况</span>
             <div id="main" 
                ref="hetong" 
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading" 
                style="height:206px;width:100%;margin-top:77px">
             </div>
        </div>
    </div>
</template>
<script>
// import echarts from 'echarts'
 import resize from '@/components/Echarts/mixins/resize'
 import {conPerform}from  '@/api/creditManagement/todo/index.js'
export default{
    mixins: [resize],
    data(){
        return {
            delay:0,//延迟动数据
            performing:0,//进行中
            chart:null,
            loading:false
        }
    },
    // created(){
    //      this.init();
    // },
    mounted(){
        this.chart = echarts.init(this.$refs.hetong)
        this.getData()
       
    },
    beforeDestroy () {
        if (!this.chart) {
            return
        }
        this.chart.dispose()
        this.chart = null
    },
    methods: { 
        // 合同履约接口调用
       getData(){
           this.loading=true;
           conPerform().then((res)=>{
               this.loading=false;
               // 拿到数据之后赋值
               this.delay=res[0].delay;
               this.performing=res[0].performing;
              // 重新画echarts
              this.$nextTick(()=>{
                if(this.chart){
                    this.init();
                }

              })

           })
       },
        init(){
            // 基于准备好的dom，初始化echarts实例
            // var myChart = echarts.init(document.getElementById('main'));

            // 指定图表的配置项和数据
             var  option = {
                title: {
                    text: '合同履约',
                    textStyle: {
                        fontSize: 16,
                        color: '#606266',
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
                color:['#32dcd9','#fd7e85'],
                legend: {
                    orient: 'vertical',
                    left: 0,
                    right:'60%',
                    top:36,
                    icon:'circle',
                    itemGap:28,
                    color:'#343434',
                    data: ['进行中', '延迟']
                },
        
                series: [

                    {
                        name: '合同履约',
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
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            {value: this.performing, name: '进行中'},
                            {value: this.delay, name: '延迟'}
                        ]
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
    margin-top:20px;
    padding-left: 20px;

    .contractMain{
        background:#fff;
        padding: 24px 25px 54px;
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