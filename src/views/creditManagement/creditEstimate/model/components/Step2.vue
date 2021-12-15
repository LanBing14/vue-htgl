<template>
    <div @click.self="clearCurrentNodeKey">
        <el-row style="max-width: 650px;margin: auto">
            <el-col :span="12" style="text-align: right;padding-right: 20px;">
                <el-card shadow="never" class="box-card">
                    <div slot="header" class="clearfix" style="text-align: left">
                        备选指标
                    </div>
                    <div style="margin-bottom: 15px;">
                        <el-input v-model="filterTextLeft" suffix-icon="el-icon-search"/>
                    </div>
                    <el-tree
                        ref="treeLeft"
                        v-loading="treeLoading"
                        :data="treeDataLeft"
                        :filter-node-method="filterNode"
                        :allow-drop="allowDrop"
                        :allow-drag="allowDrag"
                        node-key="id"
                        highlight-current
                        draggable
                        @node-drag-start="ondragstart"
                        @node-drag-end="curHover = ''"
                        @current-change="currentChangeLeft"
                    >
                        <div class="custom-tree-node" slot-scope="{ node, data }"
                             @dragstart.stop.prevent="ondragstart($event, node, data)">
                            <span>
                                <i v-if="data.isFenLei" class="el-icon-reading"></i>
                                {{ data.label || data.classifyName || data.kpiName }}
                            </span>
                        </div>
                    </el-tree>
                </el-card>
            </el-col>
            <el-col :span="12" style="padding-left: 20px;">
                <el-card shadow="never" class="box-card">
                    <div slot="header" class="clearfix">
                        <div class="flex">
                            <span class="flex-primary">模型指标</span>
                            <div class="action">
                                <el-button type="text" @click.stop="addFenlei">新增分类</el-button>
                                <!--                                <el-button type="text" icon="el-icon-plus">指标</el-button>-->
                                <!--                                <el-button type="text" icon="el-icon-delete">删除</el-button>-->
                            </div>
                        </div>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <el-input v-model="filterTextRight" suffix-icon="el-icon-search"/>
                    </div>
                    <el-tree
                        ref="treeRight"
                        :data="treeDataRight"
                        :filter-node-method="filterNode"
                        :loading="treeLoadingRight"
                        @node-expand="onNodeExpand"
                        node-key="id"
                        highlight-current
                    >
                        <div class="custom-tree-node"
                             slot-scope="{ node, data }"
                             :allow-drop="allowDropRight"
                             :class="{hover: curHover === node.data.id}"
                             @drop="ondrop(node, $event)"
                             @dragover="ondragover($event, node)"
                             >
                            <div style="padding-right: 10px;">
                                <i v-if="data.isFenLei" class="el-icon-reading"></i>
                                {{ data.label }}
                            </div>
                            <div class="tree-item-action">
                                <template v-if="data.isFenLei">
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click.stop="editFenlei(node, data)"
                                    >
                                        编辑
                                    </el-button>
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click.stop="deleteFenlei(node, data)"
                                    >
                                        删除
                                    </el-button>
                                </template>
                                <el-button
                                    v-else
                                    type="text"
                                    size="mini"
                                    @click.stop="delZhibiao(node, data)"
                                >
                                    删除
                                </el-button>
                            </div>
                        </div>
                    </el-tree>
                </el-card>
            </el-col>
        </el-row>
        <Dialog
            :title="modelStatus?'新增分类':'修改分类'"
            :visible.sync="visible"
            :onOk="handleFenleiOk"
            width="500px"
            @close="handleFenleiClose">
            <el-form ref="fenleiForm" :model="fenleiFormData" label-width="7em" @submit.native.prevent>
                <el-form-item
                    :rules="[{
                        required: true,message: '分类名称必填',trigger: 'change'
                    }]"
                    label="分类名称"
                    prop="name">
                    <el-input v-model="fenleiFormData.name" placeholder="请输入分类名称"></el-input>
                </el-form-item>
            </el-form>
        </Dialog>
    </div>
</template>

<script>
    import {uniqueId, merge} from 'lodash';
    import {
        Api_EvaluateEstimateTree
    } from '@/api/creditManagement/creditEstimate/target';
    import {Api_EvaluateModelSecond, Api_EvaluateModelSecondGet} from '@/api/creditManagement/creditEstimate/model';

    export default {
        name: "Step2",
        props: {
            rowId: String, // 当前记录id
            // isTwo: Boolean, // 两层或三层
            defaultData: Array // 默认数据，当前步骤返回上一层时有可能作了保存数据的操作，由此重新获得上一次保存的值
        },
        data() {
            return {
                visible: false,
                modelStatus: true,
                fenleiFormData: {
                    name: ''
                },
                filterTextLeft: '',
                filterTextRight: '',
                treeDataLeft: [],
                treeDataRight: this.defaultData || [],
                data: [],
                listQuery: {},
                tableCol: [{
                    key: 'name',
                    label: '模型名称'
                }, {
                    key: 'name',
                    label: '模型名称'
                }],
                treeLoading: false,
                treeLoadingRight: false,
                curHover: '',
                isTwo: null
            };
        },
        watch: {
            filterTextLeft(val) {
                this.$refs.treeLeft.filter(val);
            },
            filterTextRight(val) {
                this.$refs.treeRight.filter(val);
            }
        },
        created() {
            this.getTreeData();
            if (this.rowId) {
                this.treeLoadingRight = true;
                Api_EvaluateModelSecondGet(this.rowId).then(res => { 
                    this.treeLoadingRight = false;
                    // var dataRight = this.$refs.treeRight.data;
                    // for(var i = 0; i<dataRight.length;i++){
                    //     if(dataRight[i].children){
                    //         for(var n = 0; n<dataRight[i].children.length;n++){ 
                    //             if(dataRight[i].children[n].children){//第二层是分类 则是3层
                    //                this.isTwo = false;
                    //             }else{//第二层是指标 则是2层
                    //                this.isTwo = true;
                    //             }
                    //         }
                    //     }
                    // } 
                    this.isTwo = res.modelLevel == '0' ? true:false;
                    if (this.isTwo) {
                        this.treeDataRight = this.getLevel2Tree(res.waitList);
                    } else {
                        const level1Arr = res.waitList.filter(item => !item.pid);
                        const level2Arr = res.waitList.filter(item => item.pid);
                        level1Arr.forEach(item => {
                            item.label = item.modelClassifyName;
                            item.level = 1;
                            item.isFenLei = true;
                            item.children = [];
                        });
                        level2Arr.forEach(itemLevel2 => {
                            const {pid} = itemLevel2;
                            level1Arr.forEach(itemLevel1 => {
                                if (itemLevel1.id === pid) {
                                    const children2 = itemLevel2.kpiWait.map(({kpiHisId, kpiName, weight}) => {
                                        return {
                                            id: kpiHisId,
                                            label: kpiName,
                                            weight,
                                            level: 3
                                        };
                                    });
                                    itemLevel1.children.push({
                                        id: itemLevel2.id,
                                        label: itemLevel2.modelClassifyName,
                                        classifyName:itemLevel2.modelClassifyName,
                                        isFenLei: true,
                                        weight: itemLevel2.weight,
                                        children: children2,
                                        level: 2
                                    });
                                }
                            });
                        });
                        this.treeDataRight = level1Arr;
                    }
                }).catch(() => {
                    this.treeLoadingRight = false;
                });
            }
        },
        methods: {
            // 只获取数据，不作验证
            getData() {
                return this.treeDataRight;
            },
            validate() {
                return new Promise((resolve, reject) => {
                    let flag = true;
                    if (this.isTwo) {
                        this.treeDataRight.forEach(item1 => {
                            if (!item1.children.length) {
                                flag = false;
                            }
                        });
                    } else {
                        this.treeDataRight.forEach(item1 => {
                            if (!item1.children.length) {
                                flag = false;
                                return;
                            }
                            const children1 = item1.children;
                            children1.forEach(item2 => {
                                if (!item2.children.length) {
                                    flag = false;
                                }
                            });
                        });
                    }
                    if (!flag) {
                        this.$message.warning('请为每层分类添加至少一个指标');
                        reject();
                        return;
                    }
                    if (!this.treeDataRight.length) {
                        this.$message.warning('请添加模型指标');
                        reject();
                        return;
                    }
                    const postData = {};
                    let treeData = merge([], this.treeDataRight);
                    if (this.isTwo) {
                        treeData = treeData.map(item1 => {
                            return {
                                modelClassifyName: item1.label,
                                weight: item1.weight,
                                estimates: item1.children.map(({id, weight}) => ({
                                    id,
                                    weight
                                }))
                            };
                        });
                        postData.estimateTwoVoList = treeData;
                        postData.estimateThreeVoList = [];
                    } else {
                        treeData = treeData.map(item1 => {
                            const estimates = item1.children.map(item2 => {
                                return {
                                    modelClassifyName: item2.label,
                                    weight: item2.weight,
                                    estimates: item2.children.map(({id, weight}) => ({
                                        id,
                                        weight
                                    }))
                                };
                            });
                            return {
                                modelClassifyName: item1.label,
                                weight: item1.weight,
                                estimates
                            };
                        });
                        postData.estimateTwoVoList = [];
                        postData.estimateThreeVoList = treeData;
                    } 
                    postData.isTwo = this.isTwo;
                    Api_EvaluateModelSecond(this.rowId, postData).then(res => {
                        this.$emit('sendFrom',this.isTwo)
                        resolve(this.treeDataRight);
                    }).catch(e => {
                        this.$message.error(e);
                        reject(e);
                    });
                });
            },
            // 获取第二级
            getLevel2Tree(data) {
                return data.map(item1 => {
                    const children = item1.kpiWait.map(({kpiHisId, kpiName, weight}) => {
                        return {
                            id: kpiHisId,
                            label: kpiName,
                            weight,
                            level: 2
                        };
                    });
                    return {
                        id: item1.id,
                        label: item1.modelClassifyName,
                        isFenLei: true,
                        weight: item1.weight,
                        children,
                        level: 1
                    };
                });
            },
            // 获取tree数据
            getTreeData(cb) {
                this.treeLoading = true;
                Api_EvaluateEstimateTree().then(res => {
                    const initArr = [];
                    const notInitArr = [];
                    const arr = res;
                    if (arr) {
                        arr.forEach(item => {
                            item.label = item.classifyName;
                            item.children = item.quotaList.map(q => ({
                                id: q.id,
                                label: q.kpiName,
                                kpiName: q.kpiName
                            }));
                            if (item.init) {
                                initArr.push(item);
                            } else {
                                notInitArr.push(item);
                            }
                        });
                    }
                    this.treeDataLeft = [{
                        id: 1,
                        label: '初始化指标',
                        desc: '',
                        root: true,
                        init: true,
                        level: 0,
                        children: initArr
                    }, {
                        id: 2,
                        label: '自定义指标',
                        desc: '',
                        root: true,
                        init: false,
                        level: 0,
                        children: notInitArr
                    }];
                    if (cb) {
                        this.$nextTick(() => {
                            cb();
                        });
                    }
                    this.treeLoading = false;
                });
            },
            addFenlei() {
                this.modelStatus = true;
                this.visible = true;
            },
            handleFenleiOk() {
                this.$refs.fenleiForm.validate(valid => {
                    if (valid) {
                        const id = uniqueId('tree_');
                        const data = this.$refs.treeRight.getCurrentNode();//右侧选中的值
                        const newData = {
                            id,
                            label: this.fenleiFormData.name,
                            isFenLei: true,  
                            weight: 0,
                            children: [],
                            level :2
                        };
                        if (this.modelStatus) { 
                            if (data) {
                                if(data.classifyName){//当前选中的为二级分类
                                 this.$message.warning('最多两层分类')
                                 return;
                                }
                                var dataRight = this.$refs.treeRight.data;//右侧所有的值  
                                for(var i = 0; i<dataRight.length;i++){ 
                                    if(dataRight[i].children){
                                        if(dataRight[i].children.length >0 ){
                                            for(var n = 0; n<dataRight[i].children.length;n++){ 
                                            if(dataRight[i].children[n].children){//第二层是分类 则是3层
                                                newData.classifyName =   this.fenleiFormData.name;  
                                                this.isTwo = false;
                                            }else{//第二层是指标 则是2层
                                                this.isTwo = true;
                                                newData.classifyName =  '' ;
                                            }
                                          }
                                        }else{
                                            newData.classifyName =  this.fenleiFormData.name;  
                                            this.isTwo = false;//没有子集默认3层
                                        } 
                                    }else{
                                        this.isTwo = true;
                                        newData.classifyName =  '' ;
                                    }
                                } 
                                if(this.isTwo) {
                                 this.$message.warning('最多一层分类')
                                 return;  
                                }  
                                this.$refs.treeRight.append(newData,data); 
                            }else{ 
                                newData.level = 1
                                this.treeDataRight.push(newData); 
                            } 
                        } else {
                            data.label = this.fenleiFormData.name;
                        }
                        this.visible = false;
                    }
                });
            },
            handleFenleiClose() {
                this.visible = false;
                this.$refs.fenleiForm.resetFields();
            },
            // 编辑分类
            editFenlei(node, data) {
                this.modelStatus = false;
                this.visible = true;
                this.fenleiFormData.name = data.label;
            },
            // 删除分类
            deleteFenlei(node) {
               this.$refs.treeRight.remove(node);
               var rightData =  this.$refs.treeRight.data
               var isClear = true;
               if (rightData){
                    rightData.forEach(item=>{
                       if(item.children.length > 0){
                         isClear = false
                       }
                    })
               }
                if (isClear){
                    this.isTwo = null
                }
            },
            // 删除指标
            delZhibiao(node) {
                this.$confirm('确定删除该指标？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$refs.treeRight.remove(node);
                    var isClear = true;
                    if (rightData){
                            rightData.forEach(item=>{
                            if(item.children.length > 0){
                                isClear = false
                            }
                        })
                    }
                    if (isClear){
                        this.isTwo = null
                    }
                });
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            currentChangeLeft(data, node) {
                if (node.expanded) {
                    this.$refs.treeLeft.setCurrentKey(null);
                }
            },
            clearCurrentNodeKey() {
                this.$refs.treeRight.setCurrentKey(null)
            },
            onNodeExpand() {
            },
            allowDrop() {
                return false;
            },
            allowDrag(node) {
                if (node.data.root) {
                    return false;
                }
                return true;
            },
            ondragstart(node, e) {
                e.dataTransfer.setData('data', JSON.stringify(node.data));
            },
            ondragover(e, node) {
                e.preventDefault();
                this.curHover = node.data.id
            },
            allowDropRight(draggingNode, dropNode) {
                return true;
            },
            ondrop(node, e) {
                const data = e.dataTransfer.getData('data');
                if (data) {
                    if (!this.treeDataRight.length) {
                        this.$message.warning('请先建立分类')
                        return;
                    }
                    const parseData = JSON.parse(data); 
                    if (!node.data.children) {
                        this.$message.warning('请拖拽至分类')
                        return;
                    }
                   
                    var dataRight = this.$refs.treeRight.data; 
                    var isClear = true;
                    for(var i = 0; i<dataRight.length;i++){ 
                        if(dataRight[i].children){ 
                            if(dataRight[i].children.length >0 ){
                                isClear = false;
                            for(var n = 0; n<dataRight[i].children.length;n++){ 
                                if(dataRight[i].children[n].children){//第二层是分类 则是3层
                                    if(!parseData.children && !node.data.classifyName){
                                        //当前为指标 指标拖至二层可以 拖至1层不可以
                                            this.$message.warning('请拖至两层分类');
                                            return;
                                    }else if(parseData.children && node.data.classifyName){
                                        this.$message.warning('最多两层分类');
                                        return;
                                    }else{
                                        this.isTwo = false;
                                    }
                                }else{//第二层是指标 则是2层
                                    if(parseData.children){
                                        this.$message.warning('最多一层分类');
                                        return;
                                        } else  {
                                        this.isTwo = true;
                                    }
                                }
                            }} 
                        }else{
                            if(data[0].level == '1'){
                                this.isTwo = false;
                            }else{
                                this.isTwo = true;
                            }
                        }
                    }
                    if(isClear){
                        if(!parseData.children && !node.data.classifyName){
                              this.isTwo = true;
                          }else if(parseData.children && node.data.classifyName){
                              this.isTwo = false;
                          }else{
                              this.isTwo = false;
                          }
                    }
                     // const findRes = node.data.children.find(item => item.label === parseData.kpiName);
                    const findRes = node.data.children.find(item => item.id === parseData.id);
                    // 如找到相同的子节点则不重复添加
                    if (findRes) {
                        return;
                    }

                    // if (this.isTwo) { // 两层
                    //     parseData.label = parseData.classifyName || parseData.kpiName;
                    //     parseData.weight = 0;
                    //     this.$refs.treeRight.append(parseData, node);
                    // } else { 
                    //     const parseData = JSON.parse(data);
                    //     parseData.label = parseData.classifyName || parseData.kpiName;
                    //     parseData.weight = 0;
                    //     this.$refs.treeRight.append(parseData, node);
                    // }
                    parseData.label = parseData.classifyName || parseData.kpiName;
                    parseData.weight = 0;
                    this.$refs.treeRight.append(parseData, node);
                   
                }
                // this.curHover = ''
            },
            editChange() {
                if (this.treeDataRight.length) {
                    return true;
                } else {
                    return false;
                }
            },
            clearData() {
                this.treeDataRight = [];
                this.filterTextLeft = '';
                this.filterTextRight = '';
            }
        }
    };
</script>

<style scoped lang="scss">
    .tree-label-input {
        /deep/ input {
            line-height: normal;
            height: 24px;
            border: none;
        }
    }

    /deep/ .el-tree-node {
        position: relative;
    }

    .custom-tree-node.hover::before {
        content: '';
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        border: 1px dashed #409eff;
    }

    /deep/ {
        .el-card__header {
            padding: 12px 20px;
            font-size: 16px;
            background-color: #F7F8FA;
        }

        .el-card__body {
            min-height: 300px;
        }
    }

</style>
