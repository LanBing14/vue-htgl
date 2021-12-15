<template>
    <div>
        <div id="radarChart"  v-loading="loading"  element-loading-spinner="el-icon-loading" ref="radarChart"  style="height:195px;width:100%;margin-top:34px">
        </div>
    </div>
</template>
<script>
import echarts from 'echarts'
import resize from '@/components/Echarts/mixins/resize'
import {Api_getCreditScore} from '@/api/creditManagement/todo/index.js'
export default{
    mixins: [resize],
    props:['value2','companyInfo'],
    data(){
        return {
            loading:false,//加载
            interval:null,  // 用来装定时器
            chart:null
            // value2:[],
            // companyInfo:{}  //企业信息数据
        }
    },

    mounted(){
        this.chart = echarts.init(this.$refs.radarChart)
        // this.$nextTick(()=>{
        //     this.loadTableData(this.companyId)
        // })

         this.init(this.companyInfo);
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
    // watch:{
    //     companyInfo(val){
    //        this.init(val);
    //        console.log(this.value2)
    //     }
    // },

    watch:{
      companyInfo:{
        handler:function(val){
            this.$nextTick(()=>{
                this.init(val);
            })
        },
        deep:true//对象内部的属性监听，也叫深度监听
        // immediate:true
      }
    },
    
    methods: { 
        // 调用接口获取数据
        // loadTableData(companyId){
        //      this.loading=true;
        //     Api_getCreditScore({ companyId: companyId }).then((res) => {
                   
        //             // console.log(res,'返回的数据')
        //             // 若是返回的数据不等于null就正常执行，不然按照不存在来执行
        //             if(res){
        //                 this.loading=false;
        //                 this.companyInfo = res;
        //                 this.value2=[
        //                         res.baseInfo.score,
        //                         res.techInnovation.score,
        //                         res.manageState.score,
        //                         res.relatedStructure.score,
        //                         res.publicCredit.score
        //                     ];
                       
        //             }else{
        //                 this.loading=false;
        //                 this.value2=[0,0,0,0,0]
                        
        //             }
        //              this.init()
        //     }).catch(err=>{
        //          this.loading=false;
        //          console.log(err)
        //     })
        // },


        init(val){
            // 基于准备好的dom，初始化echarts实例
            // var myChart = echarts.init(document.getElementById('radarChart'));
                // 指定图表的配置项和数据
                var option = {
                    radar: {
                        radius: "70%",
                        name: {
                            textStyle: {
                                color: '#7a7c7f',
                                borderRadius: 3,
                            }
                        },
                        indicator: [
                            { name: "基本情况", max: val.baseInfo?val.baseInfo.totalScore:100},
                            { name: "技术创新", max: val.techInnovation?val.techInnovation.totalScore:100},
                            { name: "经营状况", max: val.manageState?val.manageState.totalScore:100},
                            { name: "关联结构", max: val.relatedStructure?val.relatedStructure.totalScore:100 },
                            { name: "公共信用", max: val.publicCredit?val.publicCredit.totalScore:100},
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
                            color : "#e2e5ed", // 图表中各个图区域的边框线拐点颜色
                            lineStyle: {
                                color:"#e2e5ed" // 图表中各个图区域的边框线颜色
                            }
                        },
                                        
                    },
                    areaStyle: {
                        color: '#91c6fe',
                        normal: {
                            color : "rgba(0,0,0,0)",
                            lineStyle: {
                                color:"#e2e5ed" // 图表中各个图区域的边框线颜色
                            },
                        }
                    },
                    data: [
                        {
                            name: "能力值",
                            value: this.value2,
                            areaStyle:{
                                color: '#238dfd',
                                opacity: 0.5,
                            },
                            lineStyle:{
                                color:"#e2e5ed"
                            }
                        }
                    ]
                }]
                }
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

