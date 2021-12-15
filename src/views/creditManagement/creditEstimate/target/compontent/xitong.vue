<template>
    <div>
        <el-dialog
            title="指标选取"
            :visible.sync="dialogVisible"
            width="60%"
            >
           <el-row class="contentModel" :gutter="20">
                <el-col :span="12">
                    <div class="item">
                        <el-col :span="12" style="padding:0">
                                <el-scrollbar
                                    ref="scrollWrapLeft"
                                    style="height: 318px; overflow: hidden"
                                    @mouseover.native="onMouseOverLeft"
                                >
                                <el-tree
                                    v-loading="treeLoading"
                                    element-loading-text="拼命加载中"
                                    element-loading-spinner="el-icon-loading"
                                    class="filter-tree"
                                    :data="treeDataModel"
                                    node-key="id"
                                    highlight-current
                                    @node-click="nodeClick"
                                    default-expand-all
                                    :current-node-key="defaultkey"
                                    ref="treeModel"
                                >
                                <div class="custom-tree-node" slot-scope="{ node, data }">
                                    <span :title="data.label">
                                    <i  class="el-icon-reading"></i>
                                    {{ data.label }}
                                    </span>
                                </div>
                            </el-tree>
                            </el-scrollbar>
                            
                        </el-col>
                        <el-col :span="12" style=" height: 100%;">
                            <ul class="ul">
                                <li 
                                v-for="(item,index) in rightDataTree" 
                                :key="item.id" 
                                class="hideOver"
                                :class="{ active: index === activeIndex}"
                                @click="clickRightEchart(index,item)"
                                >{{item.element_name}}</li>
                            </ul>
                        </el-col>
                    </div>
                </el-col>
                <el-col :span="12">
         
                    <div class="item2">
                        <el-scrollbar
                            ref="scrollWrapLeft2"
                            style="height: 318px; overflow: hidden"
                            @mouseover.native="onMouseOverLeft2"
                        >
                            <el-col :span="2"></el-col>
                            <div class="itemLine lineHeight clearfix">
                                <span class="itemWidth fl ft14">指标名称：</span>
                                <span class="ft12 fl otherWidth">{{formTreeData.element_name}}</span>
                            </div>
                            <div class="itemLine  clearfix">
                                <span class="itemWidth lineHeight fl ft14 " >元素含义： </span>
                                <span class="ft12 fl otherWidth hide_two" style="min-height: 40px;line-height: 24px;">{{formTreeData.element_desc}}</span>
                            </div>
                            <div class="itemLine lineHeight clearfix">
                                <span class="itemWidth fl ft14">指标类型：</span>
                                <span class="ft12 fl otherWidth">{{formTreeData.element_type == "1" ? '定性' : '定量' }}</span>
                            </div>
                            <div class="itemLine lineHeight clearfix">
                                <span class="itemWidth fl ft14">更新周期：  </span>
                                <span class="ft12 fl otherWidth">{{formTreeData.update_cycle}}</span>
                            </div>
                            <div class="itemLine clearfix">
                                <span class="itemWidth fl ft14 lineHeight">数据分布：</span>
                                <div class="fl otherWidth " style="width: 50%;height: 160px;margin-top: -5px;" id="pieCharts"></div>
                            </div>
                        </el-scrollbar>
                    </div>
              
                </el-col>
           </el-row >
            <el-row style="text-align: center;margin: 20px 0 15px 0; ">
                <el-button type="primary" @click="onOk" v-if="modelStatus">确 定</el-button>
                <!-- <el-button @click="cancelOk">取 消</el-button> -->
            </el-row>
      
        </el-dialog>
    </div>
</template>
<script>
import {
    Api_EvaluateEstimateTree,
    Api_EvaluateEstimateQuotaAdd,
    Api_EvaluateEstimateQuotaUpdate,
    Api_EvaluateEstimateKpiTree
} from "@/api/creditManagement/creditEstimate/target";
export default{
    props:["formData","modelStatus"],
    data(){
        return {
            dialogVisible: false,
            treeLoading:false,
            treeDataModel:[],
            defaultkey:'',
            rightDataTree:[],
            activeIndex:0,
            formTreeData:{},
            isClick:false
        }
    },
    mounted() {
        // this.getTreeDataInit() 
    },
    methods:{
        nodeClick(data) {
           
            this.activeIndex = 0;
            this.defaultkey = data.id
            if (data.child){
                this.rightDataTree = data.child
                this.formTreeData = data.child[0]
                this.echartData = data.child[0].child
                this.initEcharts(this.echartData)
        
            }
        },
        clickRightEchart(index,data){
            this.activeIndex = index
            this.formTreeData = data
            this.echartData = data.child
            this.initEcharts(this.echartData)
        },
        initEcharts(data){
            if (myChart){
                myChart.clear()
            }
            var myChart = echarts.init(document.getElementById('pieCharts'));
            myChart.setOption( {
                color:['#3fb1f3','#32ddd9','#89ddfb','#a7b9e3',"#fe7e86","#f6de5a","#6ce28f","#fb9f3c","#7c8290"],
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                series: [
                    {
                        name: '数据分布',
                        type: 'pie',
                        radius: '85%',
                        center: ['50%', '50%'],
                        data: data,
                        itemStyle:{
                            borderWidth:1,
                            borderColor:"#fff",
                        },
                        label: {
                            show: false,
                        },
                        emphasis: {
                            label: {
                                show: false,
                            }
                        },
                        labelLine: {
                            show: false
                        },
                    }
                ]
            }
            );
        },
        open(elementName){
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.getTreeDataInit(elementName)
            })
        },
        onMouseOverLeft2() {
            this.$refs.scrollWrapLeft2.update();
        },
        onMouseOverLeft() {
            this.$refs.scrollWrapLeft.update();
        },
        onOk(){
            this.dialogVisible = false
            this.isClick = true
  
            this.$emit("ok",this.formTreeData,this.echartData)
            // this.elementType = this.formTreeData.element_type
            // this.elementUnit = this.formTreeData.element_unit
            // this.formData.kpiType = this.elementType
            // this.formData.kpiUnit = this.elementUnit
            // this.formData.elementName =this.formTreeData.element_name
            // this.formData.elementCode  =this.formTreeData.element_columns 
            this.$refs.treeModel.setCurrentKey(this.defaultkey);
            // if (this.elementType == 1){
            //     if (this.formData.elementName){
            //         this.isJin = true
            //     }
            //     this.formData.scoreList = this.echartData.map(item =>{
            //         return {
            //             scoreStandard: item.name,
            //             scoreProportion: +item.value,
            //         }
            //     })
            // }else {
            //     this.formData.scoreList = this.echartData.map(item =>{
            //         return {
            //             scoreStandard: item.name,
            //             scoreProportion: +item.value,
            //         }
            //     })
            // }
        },
        getTreeDataInit(elementName) {
            this.treeLoading = true;
            Api_EvaluateEstimateKpiTree().then((res) => {
                this.treeDataModel= res;
                this.treeLoading = false;
                if(!this.modelStatus){
                    // 若是elementName存在
                   if(elementName){
                        for(let i=0;i<this.treeDataModel.length;i++){
                            for(let j=0;j<this.treeDataModel[i].children.length;j++){
                                let every=this.treeDataModel[i].children[j];
                                //   循环every的child
                                for(let u=0;u<every.child.length;u++){
                                    if(every.child[u].element_name === elementName){
                                        this.activeIndex = u;
                                        this.defaultkey = every.id;
                                        this.rightDataTree = every.child;
                                        this.formTreeData = every.child[0]
                                        this.echartData = every.child[0].child;
                                        break;
                                    }
                                }
                            }
                            
                        }
                        this.$nextTick(()=>{
                            if ( this.$refs.treeModel){
                                this.$refs.treeModel.setCurrentKey(this.defaultkey);
                                this.initEcharts(this.echartData)
                            }
                        })

                   }

                }else if (!this.isClick){

                    this.defaultExpandedKeys=res[0].id
                    this.defaultkey = res[0].children[0].id
                    this.rightDataTree = res[0].children[0].child
                    this.formTreeData = res[0].children[0].child[0]
                    this.echartData = res[0].children[0].child[0].child
                    this.$nextTick(()=>{
                        if ( this.$refs.treeModel){
                            this.$refs.treeModel.setCurrentKey(res[0].children[0].id);
                            this.initEcharts(this.echartData)
                        }
                    })
                }else {
                    this.$nextTick(()=>{
                        if ( this.$refs.treeModel){
                            this.$refs.treeModel.setCurrentKey(this.defaultkey);
                        }
                    })
                }
            });
        }
    }
}
</script>


<style scoped>
.page-content .el-form .el-button.public{
  padding-left: 10px;
  padding-right: 10px;
}
.el-button:not(.el-button--text) {
    padding-top: 10px;
    padding-bottom: 10px;
}
.el-input-group__append {
    padding-left: 10px;
    padding-right: 10px;
}

.list-item + .list-item {
    margin-top: 25px;
}
.contentModel .item {
    height: 350px;
    padding: 15px;
    box-sizing: border-box;
    border: 1px solid #eaedf4;
}
.contentModel .item2 {
    padding: 15px;
    height: 350px;
    box-sizing: border-box;
    border: 1px solid #eaedf4;
}
.contentModel .item .itemLine {
    min-height: 40px;
}
.itemWidth {
    width: 19%;
}
.ft14{
    font-size: 13px; 
}
.otherWidth{
    width: 75%;
}
.ft12 {
    font-size: 12px;

}
.lineHeight {
    line-height: 24px;
    height: 40px;
}
.contentModel .item .itemLine .lineH {
    line-height: 10px;
    font-size: 12px;
}
.ul {
    padding-left: 10px;
    padding-right: 10px;
    background: #f1f7fe;
    padding: 10px;
    height: 100%;
}
.ul li {
    line-height: 30px;
    cursor: pointer;
    font-size: 12px;
}
.ul li.active {
    background-color: #409eff;
    color: #fff;
}
/deep/ .el-dialog__body{
    padding: 15px 20px;
}
.hideOver {
    overflow:hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
/* .hide_two{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
} */
</style>
