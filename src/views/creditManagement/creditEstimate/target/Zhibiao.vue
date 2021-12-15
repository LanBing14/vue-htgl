<template>
    <!--    <Dialog :visible.sync="visible" :title="modelStatus ? '新增指标':'修改指标'" :onOk="handleSure" width="900px" @close="onClose">-->
    <div>
        <el-alert :closable="false">{{ modelStatus ? '新增指标' : '修改指标' }}</el-alert>
        <el-form ref="form" :model="formData" :rules="formRules" label-width="7em" class="form-wrap">
            
            <el-form-item label="分类名称" v-if="modelStatus">{{ selectFenlei.classifyName }}</el-form-item>

            <el-form-item label="分类名称" v-else>
                  <el-select v-model="classifyId" placeholder="请选择">
                    <el-option
                        v-for="item in treeData"
                        :key="item.id"
                        :label="item.classifyName"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="指标名称" prop="kpiName">
                <el-input v-model="formData.kpiName" placeholder="请输入指标名称"></el-input>
            </el-form-item>
            <el-form-item label="指标描述" prop="kpiDesc">
                <el-input v-model="formData.kpiDesc" :rows="4" type="textarea" placeholder="请输入指标描述"></el-input>
            </el-form-item>
            <el-form-item label="系统指标" v-if="modelStatus">
                <el-tag
                    v-if="formData.elementName"
                  closable
                  style="cursor:pointer"
                  @click.native="chooseIndex"
                 :disable-transitions="false"
                 @close="handleClose"
                >
                {{formData.elementName}}
                </el-tag>
                
                <span @click="chooseIndex"  style="color: #409eff;cursor: pointer;display:inline-block;margin-left:4px" >选择指标</span>
                <!-- <p style="color: #409eff;"> 
                   <span style="margin-right: 20px;cursor:pointer" v-if="formData.elementName" @click="chooseIndex">{{ formData.elementName}}</span>
                   <span @click="chooseIndex" style="cursor: pointer;" >选择指标</span></p> 
                -->
            </el-form-item>
            <el-form-item label="系统指标" v-else>
                <p> 
                    <el-tag
                        v-if="formData.elementName"
                        style="cursor:pointer"
                        @click.native="chooseIndex(formData.elementName)"
                        :disable-transitions="false"
                        >
                        {{formData.elementName}}
                    </el-tag>
                    <!-- <span style="margin-right: 20px;color: #409eff;cursor:pointer"  @click="chooseIndex(formData.elementName)" v-if="formData.elementName">{{ formData.elementName}}</span> -->
                    <span v-if="!formData.elementName" style="cursor: pointer;" >-</span>
                </p>
             </el-form-item>
            <el-form-item label="指标类型" prop="kpiType">
      
                <el-radio-group v-model="formData.kpiType">
                    <!-- <el-radio label="1" :disabled="isSure">定性</el-radio>
                    <el-radio label="0" :disabled="isLiang">定量</el-radio> -->
                    <!-- <el-radio label="1" :disabled="formData.kpiType=='0'&& formData.elementName!==''">定性</el-radio>
                    <el-radio label="0" :disabled="formData.kpiType=='1'&& formData.elementName!==''">定量</el-radio> -->
                    <el-radio label="1" value="1" :disabled="formData.kpiType=='0'&& formData.elementName!==''">定性</el-radio>
                    <el-radio label="0" value="0" :disabled="formData.kpiType=='1'&& formData.elementName!==''">定量</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="单位">
                <el-form-item prop="kpiUnit">
                    <el-input v-model="formData.kpiUnit" placeholder="单位"></el-input>
                </el-form-item>
            </el-form-item>
            <div class="sub-title">评分标准</div>
            <el-table v-if="formData.kpiType==='0'"
                      :data="formData.scoreList" stripe class="score-table table-no-hidden">
                <el-table-column type="index" label="序号" width="60"></el-table-column>
                <!-- <el-table-column prop="scoreStandard" label="评分标准" v-if="!formData.elementName">
                    <template slot-scope="scope">
                        <el-form-item
                            label-width="0"
                            class="table-form-item"
                            :prop="'scoreList.'+scope.$index+'.scoreStandard'"
                            :rules="[{required:true,message: '评分标准必填',trigger:'blur'},{max:20,message: '评分标准最大长度不能超过20',trigger:'blur'}]"
                        >
                            <el-input v-model="scope.row.scoreStandard" placeholder="请输入评分标准" ></el-input>
                        </el-form-item>
                    </template>
                </el-table-column> -->
                <el-table-column prop="valueBegin" label="实际数值起">
                    <template slot-scope="scope">
                        <el-form-item
                            label-width="0"
                            class="table-form-item"
                            :prop="'scoreList.'+scope.$index+'.valueBegin'"
                            :rules="[{validator: validatorStart,trigger:'blur'}]"
                        >
                            <el-input v-model="scope.row.valueBegin" placeholder="实际数值起"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column prop="valueEnd" label="实际数值至">
                    <template slot-scope="scope">
                        <el-form-item
                            label-width="0"
                            class="table-form-item"
                            :prop="'scoreList.'+scope.$index+'.valueEnd'"
                            :rules="[{validator: validatorEnd,trigger:'blur'}]"
                        >
                            <el-input v-model="scope.row.valueEnd" placeholder="实际数值止"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column prop="scoreProportion" label="得分比例" width="100"
                                 align="center">
                    <template slot-scope="scope">
                        <el-form-item
                            label-width="0"
                            class="table-form-item"
                            :prop="'scoreList.'+scope.$index+'.scoreProportion'"
                            :rules="[{required: true,message: '得分比例必填',trigger:'blur'},{type: 'number',min: 0,max: 100,message: '请输入0-100之间的数字',trigger:'blur'}]"
                        >
                            <el-input v-model.number="scope.row.scoreProportion" placeholder="得分比例"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column width="100" label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-plus" size="mini" circle  @click="addRow2(scope.$index)" class="public"></el-button>
                        <el-button icon="el-icon-minus" class="public" size="mini" circle @click="delRow(scope.$index)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-table v-else :data="formData.scoreList" stripe class="score-table table-no-hidden">
                <el-table-column type="index" label="序号" width="60"></el-table-column>
                <el-table-column prop="scoreStandard" label="评分标准">
                    <template slot-scope="scope">
                        <el-form-item
                            label-width="0"
                            class="table-form-item"
                            :prop="'scoreList.'+scope.$index+'.scoreStandard'"
                            :rules="[{required:true,message: '评分标准必填'},{max:20,message: '评分标准最大长度不能超过20'}]"
                        >
                            <el-input v-model="scope.row.scoreStandard" placeholder="请输入评分标准" :disabled="isJin"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column prop="scoreProportion" label="得分比例" width="100" align="center">
                    <template slot-scope="scope">
                        <el-form-item
                            label-width="0"
                            class="table-form-item"
                            :prop="'scoreList.'+scope.$index+'.scoreProportion'"
                            :rules="[{required: true,message: '得分比例必填'},{type: 'number',min: 0,max: 100,message: '请输入0-100之间的数字'}]"
                        >
                            <el-input v-model.number="scope.row.scoreProportion" placeholder="得分比例" ></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column width="100" label="操作">
                    <template slot-scope="scope">
                        <el-button class="public" type="primary" icon="el-icon-plus" size="mini" circle @click="addRow(scope.$index)" :disabled="isJin"></el-button>
                        <el-button class="public" icon="el-icon-minus"  :disabled="isJin" size="mini" circle @click="delRow(scope.$index)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-form-item style="text-align: center;margin-top: 20px;" class="size-btn-change">
                <el-button type="primary" @click="handleSure" >确定</el-button>
                <el-button type="" @click="closeWin">取消</el-button>
            </el-form-item>
            <!--<el-form-item label="评分标准" prop="scoreList">
                <div v-for="(el, index) in formData.scoreList" :key="index" class="list-item">
                    <el-row>
                        <el-col :span="formData.kpiType==='1'?2:1" style="text-align: center">{{ index+1 }}</el-col>
                        <el-col :span="formData.kpiType==='1'?10:6">
                            <el-form-item
                                :prop="'scoreList.'+index+'.scoreStandard'"
                                :rules="[{required:true,message: '评分标准必填'},{max:20,message: '评分标准最大长度不能超过20'}]"
                            >
                                <el-input v-model="el.scoreStandard" placeholder="请输入评分标准"></el-input>
                            </el-form-item>
                        </el-col>
                        <template v-if="formData.kpiType==='0'">
                            <el-col :span="4">
                                <el-form-item
                                    :prop="'scoreList.'+index+'.valueBegin'"
                                    :rules="[{required: true,message: '必填'}, {type:'number',message: '请输入数字',}, {validator: validatorStart}]"
                                >
                                    <el-input v-model.number="el.valueBegin" placeholder="实际数值起"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-form-item
                                    :prop="'scoreList.'+index+'.valueEnd'"
                                    :rules="[{required: true,message: '必填'}, {type:'number',message: '请输入数字',},{validator: validatorEnd}]"
                                >
                                    <el-input v-model.number="el.valueEnd" placeholder="实际数值止"></el-input>
                                </el-form-item>
                            </el-col>
                        </template>
                        <el-col :span="formData.kpiType==='1'?8:5">
                            <el-form-item
                                :prop="'scoreList.'+index+'.scoreProportion'"
                                :rules="[{required: true,message: '得分比例必填'},{type: 'number',min: 0,max: 100,message: '请输入0-100之间的数字'}]"
                            >
                                <el-input v-model.number="el.scoreProportion" placeholder="得分比例">
                                    <template slot="append">%</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item>
                                <el-button type="primary" icon="el-icon-plus" size="mini" circle
                                           @click="addRow"></el-button>
                                <el-button icon="el-icon-minus" size="mini" circle @click="delRow(index)"></el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </el-form-item>
            <el-form-item style="text-align: center;margin-top: 20px;">
                <el-button type="primary" @click="handleSure">确定</el-button>
                <el-button type="" @click="closeWin">取消</el-button>
            </el-form-item>-->
        </el-form>


        <xitong ref="xitong" @ok="ok"   :formData="formData" :modelStatus="modelStatus"></xitong>
        <!-- <el-dialog -->
            <!-- title="指标选取"
            :visible.sync="dialogVisible"
            width="60%"
            > -->
           <!-- <el-row class="contentModel" :gutter="20">
                <el-col :span="12">
                    <div class="item">
                        <el-col :span="12" style="padding:0">
                            <el-scrollbar style="height: 318px;">
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
                    </div>
                </el-col>
           </el-row >
            <el-row style="text-align: center;margin: 20px 0 15px 0; ">
                <el-button type="primary" @click="onOk">确 定</el-button>
  
            </el-row> -->
      
        <!-- </el-dialog> -->
    </div>
    <!--    </Dialog>-->
</template>

<script>
import xitong from './compontent/xitong'
import {merge} from "lodash";
import {
    Api_EvaluateEstimateTree,
    Api_EvaluateEstimateQuotaAdd,
    Api_EvaluateEstimateQuotaUpdate,
    Api_EvaluateEstimateKpiTree
} from "@/api/creditManagement/creditEstimate/target";

export default {
    name: "Zhibiao",
    props: {
        treeData: Array,
        selectFenlei: Object,
    },
    components:{
        xitong
    },
    data() {
        const createRules = this.$createRules;
        return {
            classifyId:'',
            firstExpand:'',
            elementName:'',
            isSure:false,
            isJin:false,
            isLiang:false,
            treeLoading:false,
            activeIndex:0,
            elementType:'',
            elementUnit:'',
            rightDataTree:[],
            defaultExpandedKeys: [], 
            echartData:[],
            treeDataModel:[],
            formTreeData:{},
            defaultkey:'',
            currentNode: {},  
            dialogVisible: false,
            visible: false, // 指标弹框显示与否
            modelStatus: true, // 新增或修改指标
            selectData: {}, // 当前选中的数据
            isClick:false,
            formData: {
                // 新增指标表单数据
                kpiName: "",
                kpiDesc: "",
                kpiType: "1",
                kpiUnit: '',
                elementName:'',
                elementCode:'',
                scoreList: [
                    {
                        scoreStandard: "",
                        scoreProportion: "",
                        valueBegin: "",
                        valueEnd: ""
                    }
                ]
            },
            formRules: {
                // 新增指标表单验证
                kpiName: createRules({
                    msg: "指标名称",
                    required: true,
                    max: 20,
                    validator: this.validatorName
                }),
                kpiDesc: createRules({
                    msg: "指标描述",
                    max: 200
                }),
                kpiUnit: createRules({
                    msg: "单位",
                    max: 5
                })
            }
        };
    },

    mounted() {
        this.classifyId=this.selectFenlei.id;
        this.getTreeDataInit() 
    },
    watch:{},
    methods: {
        // 关闭tags后面的x
        handleClose(){
            this.formData={
                kpiName: "",
                kpiDesc: "",
                kpiType: "1",
                kpiUnit: '',
                elementName:'',
                elementCode:'',
                scoreList: [
                    {
                        scoreStandard: "",
                        scoreProportion: "",
                        valueBegin: "",
                        valueEnd: ""
                    }
                ]
            }
            // 移除所有的校验结果
            this.$refs.form.resetFields();

        },

        // 当xitong点击了确定按钮之后，接收传过来的数据
        ok(formTreeData,echartData){
            this.$refs.form.resetFields();
            this.formData.kpiType =  formTreeData.element_type;
            this.formData.kpiUnit = formTreeData.element_unit
            this.formData.elementName =formTreeData.element_name
            this.formData.elementCode  =formTreeData.element_columns 
            if(echartData.length!=0){
               
                this.formData.scoreList = echartData.map(item =>{
                    return {
                        scoreStandard: item.name,
                        scoreProportion: ""
                    }
                })
            }

            if (formTreeData.element_type == 1){
                if (this.formData.elementName){
                    this.isJin = true
                }
            }



        },









        // onOk(){
        //     this.dialogVisible = false
        //     this.isClick = true
        //     this.elementType = this.formTreeData.element_type
        //     this.elementUnit = this.formTreeData.element_unit
        //     this.formData.kpiType = this.elementType
        //     this.formData.kpiUnit = this.elementUnit
        //     this.formData.elementName =this.formTreeData.element_name
        //     this.formData.elementCode  =this.formTreeData.element_columns 
        //     this.$refs.treeModel.setCurrentKey(this.defaultkey);
        //     if (this.elementType == 1){
        //         this.isLiang = true
        //         this.isSure = false
        //         if (this.formData.elementName){
        //             this.isJin = true
        //         }
        //         this.formData.scoreList = this.echartData.map(item =>{
        //             return {
        //                 scoreStandard: item.name,
        //                 scoreProportion: +item.value,
        //             }
        //         })
        //     }else {
        //         this.isSure = true
        //         this.isLiang = false
        //         this.formData.scoreList = this.echartData.map(item =>{
        //             return {
        //                 scoreStandard: item.name,
        //                 scoreProportion: +item.value,
        //             }
        //         })
        //     }
        // },
        cancelOk(){
            this.dialogVisible = false
            this.$refs.treeModel.setCurrentKey(this.defaultkey);
        },
        clickRightEchart(index,data){
            this.activeIndex = index
            this.formTreeData = data
            this.echartData = data.child
            this.initEcharts(this.echartData)
        },
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

        addRow2(index){
            this.formData.scoreList.splice(index+1,0,{
                  scoreStandard: "",
                  scoreProportion: "",
                  valueBegin: "",
                  valueEnd: ""
            })
        },
        chooseIndex(elementName){
            // this.dialogVisible = true

            this.$refs.xitong.open(elementName)

            // this.$nextTick(() => {
            //     this.getTreeDataInit(elementName)
            // })
        },
        open(modelStatus, data) {
            this.modelStatus = modelStatus;
            this.visible = true;
            this.$nextTick(() => {
                if (data) {
                    this.formData.kpiName = data.kpiName;
                    this.formData.kpiDesc = data.kpiDesc;
                    this.formData.kpiType = data.kpiType;
                    this.formData.kpiUnit = data.kpiUnit;
                    this.formData.elementName = data.elementName;
                    this.formData.elementCode  = data.elementCode 
                    if (this.formData.elementName){
                        this.isJin = true
                    }
                    
                    this.formData.scoreList = data.scoreList.map(
                        ({ scoreStandard, scoreProportion, valueBegin, valueEnd, kpiUnit }) => ({
                            scoreStandard,
                            scoreProportion,
                            valueBegin,
                            valueEnd
                        })
                    );
                    this.selectData = Object.assign({}, data);
                   
                }
            });
        },
        // 新增、修改指标弹框确认
        handleSure() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    const formData = merge({}, this.formData);
            
                     let lastData;
                     let firstData;
                    if(formData.scoreList.length>1){
                           lastData=formData.scoreList[formData.scoreList.length-1];
                           firstData=formData.scoreList[0];
                           if(firstData.valueBegin!==""){
                               formData.scoreList[0].valueBegin= firstData.valueBegin
                           }else{
                               formData.scoreList[0].valueBegin=null
                           }
                        
                            if(lastData.valueEnd!=""){
                                formData.scoreList[formData.scoreList.length-1].valueEnd=lastData.valueEnd
                            }else{
                                formData.scoreList[formData.scoreList.length-1].valueEnd=null
                            }
                          
                    }else {
                        if(formData.scoreList[0].valueBegin!==""){
                            formData.scoreList[0].valueBegin=formData.scoreList[0].valueBegin
                        }else{
                            formData.scoreList[0].valueBegin=null
                        }
                        if(formData.scoreList[0].valueEnd!==""){
                            formData.scoreList[0].valueEnd=formData.scoreList[0].valueEnd
                        }else{
                            formData.scoreList[0].valueEnd=null
                        }
                      
                    }

                
                    const { id, version } = this.selectData;
                    // const { id: classifyId } = this.selectFenlei;
                    let apiRes = null;
                    const postData = {
                        classifyId:this.classifyId,
                        ...formData,
                        scores: formData.scoreList,
                        level: 2,
                        init: false
                    };
                    delete postData.scoreList;
                    const loading = this.$openLoading();
                    if (this.modelStatus) {
                        apiRes = Api_EvaluateEstimateQuotaAdd(postData);
                    } else {
                        postData.version = version;
                        apiRes = Api_EvaluateEstimateQuotaUpdate(id, postData);
                    }
                    apiRes
                        .then(res => {
                            const msg = this.modelStatus ? '新增成功' : '修改成功';
                            this.$message.success(msg);
                            this.visible = false;
                            this.$emit("showDetail", false, postData, res);
                            this.$emit("getTreeData");
                            loading.close();
                        })
                        .catch(e => {
                            this.$message.error(e);
                            loading.close();
                        });
                }
            });
        },
        // 添加授权
        addRow() {
            this.formData.scoreList.push({});
        },
        // 删除授权
        delRow(index) {
            if (this.formData.scoreList.length > 1) {
                this.formData.scoreList.splice(index, 1);
            }
        },
        // 验证指标名称是否重复
        validatorName(rule, value, callback) {
            if (!value) {
                callback();
                return;
            }
            let flag = false;
            this.treeData.forEach(tree1 => {
                if (!tree1.children) {
                    return;
                }
                tree1.children.forEach(tree2 => {
                    if (!tree2.children) {
                        return;
                    }
                    tree2.children.forEach(tree3 => {
                        if (tree3.label === value) {
                            flag = true;
                        }
                    });
                });
            });
            if (flag) {
                callback(new Error("指标名称重复"));
            } else {
                callback();
            }
        },
        validatorStart({ field }, value, callback) {
            
            const index = field.split(".")[1];
            var reg = /^-?\d{1,16}(?:\.\d{1,4})?$/;  
            if(this.formData.scoreList.length==1){
               if(!value){
                if(this.formData.scoreList[0].valueEnd){
                    callback()
                }else{
                     callback(new Error("起止值必填其一"));
                }
               }else{
                    if (reg.test(value)) {
                        
                        const { valueEnd } = this.formData.scoreList[index];
                    
                        if (+valueEnd && +value > +valueEnd) {
                            callback(new Error("起始不得大于结束"));
                        }else if (value.length > 9){
                            callback(new Error("内容不得超过九位数"));
                        }else {
                            callback();
                        }
                    } else {
                        callback(new Error("输入正确的数字,小数点后可1到4位"));
                    }
               }
                 
            }else{
             if(!value && index==0){

                callback()

                }else if(!value && index!==0){
                    callback(new Error("必填"));

                }else if(value){
                    if(index>=1){
                        // 得到上一个尾部的值
                        let lastWei=this.formData.scoreList[index-1].valueEnd;
                        if(!lastWei){
                             callback(new Error("先填写上一个的止值"));
                        }else{
                            if(value!=lastWei){
                                callback(new Error("必须与上一个止值一致"));
                            }else{

                                const { valueEnd } = this.formData.scoreList[index];

                                if (+valueEnd && +value > +valueEnd) {
                                    callback(new Error("起始不得大于结束"))
                                }else{
                                    callback()
                                }
                                
                            }
                        }
                       
                    }else{
                        if(value){
                             if (reg.test(value)) {
                                const { valueEnd } = this.formData.scoreList[index];
                                if (+valueEnd && +value > +valueEnd) {
                                    callback(new Error("起始不得大于结束"));
                                }else if (value.length > 9){
                                    callback(new Error("内容不得超过九位数"));
                                }else {
                                    callback();
                                }
                            } else {
                                callback(new Error("输入正确的数字,小数点后可1到4位"));
                            }
                        }else{
                            callback()
                        }
                    }
                }
        
            }

    


                  
        },
        validatorEnd({ field }, value, callback) {

            const index = field.split(".")[1];
            const { valueBegin } = this.formData.scoreList[index];
            var reg = /^-?\d{1,16}(?:\.\d{1,4})?$/;



            if(this.formData.scoreList.length==1){
                if(value){
                    if (reg.test(value)) {

                        if (+valueBegin && +value < +valueBegin) {
                            callback(new Error("结束不得小于起始"));
                        } else if (value.length > 9){
                            callback(new Error("内容不得超过九位数"));
                        }else {
                            callback();
                        }
                    } else {
                        callback(new Error("输入正确的数字,小数点后可1到4位"));
                    }
                }else{
                    if(valueBegin){
                         callback()
                         
                    }else{
                       callback(new Error("起止值必填其一"));
                    }
                }
            }else{
                if(!value && index==this.formData.scoreList.length-1){
                    callback()
                }else if(!value && index!=this.formData.scoreList.length-1){
                    callback(new Error("必填"));
                }else if(value){
                    if (reg.test(value)) {

                        if (+valueBegin && +value < +valueBegin) {
                            callback(new Error("结束不得小于起始"));
                        } else if (value.length > 9){
                            callback(new Error("内容不得超过九位数"));
                        }else {
                            callback();
                        }
                    } else {
                        callback(new Error("输入正确的数字,小数点后可1到4位"));
                    }
                }
            }
        },
        // 新增、修改关闭
        onClose() {
            // this.formData.scoreList = [
            //     {
            //         scoreStandard: "",
            //         scoreProportion: "",
            //         valueBegin: "",
            //         valueEnd: ""
            //     }
            // ];
            this.$refs.form.resetFields();
        },
        // 关闭窗口
        closeWin() {
            this.visible = false;
            this.$emit("showDetail", false);
        }
    }
};
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
.hide_two{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
}
</style>
