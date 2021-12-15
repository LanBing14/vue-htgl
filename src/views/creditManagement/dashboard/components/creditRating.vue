<template>
    <div>
        <div id="credit" ref="credit"   style="height:195px;width:100%;margin-top:34px">
        </div>
    </div>
</template>
<script>
import echarts from 'echarts'
import resize from '@/components/Echarts/mixins/resize'
import {Api_getCreditScore} from '@/api/creditManagement/todo/index.js'
export default{
    mixins: [resize],
    props:['value','title'],
    data(){
        return {
            loading:false, // 加载
            interval:null,  // 用来装定时器
            // value:0,  //数值
            // title:""  //信用等级
        }
    },
    computed:{
        //  百分比
        percentage(){
            return  this.value/100;
        }
    },
    watch:{
        value(val){
            this.$nextTick(()=>{
                this.init()
            })
        }
    },
    mounted(){
        this.chart = echarts.init(this.$refs.credit)
        // this.$nextTick(()=>{
        //     this.loadTableData(this.companyId)
        // })
     
        this.init()
        
    },
    beforeDestroy () {
        if (!this.chart) {
            return
        }
        this.chart.dispose()
        this.chart = null;
        clearInterval(this.interval);
        this.interval=null;
    },


    methods: { 
        // 调用接口获取数据
        // loadTableData(companyId){
        //     this.loading=true;
        //     Api_getCreditScore({ companyId: companyId }).then((res) => {
        //             // 若是返回的数据不等于null就正常执行，不然按照不存在来执行
        //             if(res){
        //                 this.loading=false;
        //                 this.value=res.totalScore;
        //                 this.title=res.level;
        //             }else{
        //                 this.loading=false;
        //                 this.value=0;
        //                 this.title=''
        //             }
        //              this.init()
        //     }).catch(err=>{
        //         this.loading=false;
        //         console.log(err)
        //     })
        // },

        // 画图
        init(){
            // 基于准备好的dom，初始化echarts实例
            // var myChart = echarts.init(document.getElementById('credit'));
            var option = {

                series: [{
                        name: '刻度',
                        type: 'gauge',
                        radius: '85%',
                        min: 0,
                        max: 100,
                        splitNumber: 5, //刻度数量
                        startAngle: 220,
                        endAngle: -40,
                        axisLine: {
                            show: false,
                            lineStyle: {
                                width: 1,
                                color: [
                                    [1, 'rgba(0,0,0,0)']
                                ]
                            }
                        }, //仪表盘轴线
                        axisLabel: {
                            show: true,
                            color:'#a9b3d4',
                            distance: -14,
                            fontSize: 11
                        }, //刻度标签。
                        axisTick: {
                            show: true,
                            lineStyle: {
                                color: '#3B53A2',
                                width: 1
                            },
                            length: -2
                        }, //刻度样式
                        splitLine: {
                            show: true,
                            length: -4,
                            lineStyle: {
                                color:'#d7dcec',
                                width: 1
                            }
                        }, //分隔线样式
                        detail: {
                            show: false
                        },

                        pointer: {
                            show: false
                        }
                    },
                    {
                        type: 'gauge',
                        radius: '75%',
                        min: 0,
                        max: 100,
                        center: ['50%', '50%'],
                        splitNumber: 0, //刻度数量
                        startAngle: 220,
                        endAngle: -40,
                        axisLine: {
                            show: true,
                            lineStyle: {
                                width: 8,
                                color: [
                                    [
                                        this.percentage, new echarts.graphic.LinearGradient(
                                            0, 0, 1, 0, [{
                                                    offset: 0,
                                                    color: '#8dc2fb'
                                                },
                                                {
                                                    offset: 1,
                                                    color: '#8dc2fb'
                                                }
                                            ]
                                        )
                                    ],
                                    [
                                        1, '#DAE1F4'
                                    ]
                                ]
                            }
                        },
                        //分隔线样式。
                        splitLine: {
                            show: false,
                        },
                        axisLabel: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        pointer: {
                            show: true,
                            width: "8%",
                            length: '40%',
                        },
                        itemStyle: {
                            normal: {
                                color: '#8dc2fb'
                            }
                        },
                        title : {               
                                fontSize: 20,
                                color:"#4b9df3",
                                offsetCenter : [0, '70%']
                        },
                        //仪表盘详情，用于显示数据。
                        detail: {
                            show: true,
                            offsetCenter: [0, 0],
                            color: '#ddd',
                            formatter: function() {
                                return "信用评级"
                            },
                            offsetCenter: [0, '95%'],
                            textStyle: {
                                fontSize: 13,
                                color:'#606266'
                            }
                        },
                        data: [{
                            name: this.title,
                            value: this.value,
                     
                        }]
                    }
                ]
            };
             this.chart.setOption(option, true);

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

