<template>
    <div class="wrap">
        <div class="page-header">
            <h1 class="page-name">
                <span>流程管理</span>
            </h1>
            <div v-if="selectData.id">
                <!--                <el-button-->
                <!--                    type="primary"-->
                <!--                    size="mini"-->
                <!--                    style="height: 36px;width: 99px;margin-top: -15px;"-->
                <!--                    @click="handleDeployment"-->
                <!--                >-->
                <!--                    部署-->
                <!--                </el-button>-->
                <el-button
                    style="width: 99px;"
                    @click="handleSure"
                    class="btn-color-blue"
                >
                    保存
                </el-button>
            </div>
        </div>
        <div class="page-content">
            <div class="con">
                <div class="left">
                    <el-card ref="card" v-loading="listLoading" :style="{height: height +'px'}" shadow="never"
                             class="box-card left-card-body">
                        <div slot="header" class="clearfix" style="font-size:14px;color:#333">
                            业务流程
                        </div>
                        <el-scrollbar ref="scrollWrapLeft" style="height: 100%; overflow: hidden"
                                      @mouseover.native="onMouseOverLeft">
                            <ul class="list">
                                <li v-for="el in listData"
                                    :key="el.id"
                                    :class="{selected: selectData.id===el.id}"
                                    class="list-item"
                                    @click="handleSelectItem(el)"
                                >
                                    {{ el.name }}
                                </li>
                            </ul>
                        </el-scrollbar>
                    </el-card>
                    <!--                    <div class="t">-->
                    <!--                        <h5 class="left-title">业务流程</h5>-->
                    <!--                        <ul v-loading="listLoading" class="list">-->
                    <!--                            <li v-for="el in listData"-->
                    <!--                                :key="el.id"-->
                    <!--                                :class="{selected: selectData.id===el.id}"-->
                    <!--                                class="list-item"-->
                    <!--                                @click="handleSelectItem(el)"-->
                    <!--                            >-->
                    <!--                                {{ el.name }}-->
                    <!--                            </li>-->
                    <!--                        </ul>-->
                    <!--                    </div>-->
                </div>
                <div ref="mid" class="mid">
                    <div class="clearfix" style="margin-top: 0;color:#333;font-size:14px;font-weight:normal">

                        <div class="fl">
                            {{ selectData.name }}
                        </div>

                        <div class="fr">
                            <el-button type="primary" @click="newAdd" plain>新增</el-button>
                        </div>

                    </div>
                    <el-table ref="dragTable" :data="tableData"  row-key="id" stripe style="width: 100%" v-if="saasCode">
                        <el-table-column key="k1" type="index" label="流程顺序" align="center"
                                         width="100"></el-table-column>
                        <el-table-column key="k2" label="审批人/职务">
                            <template slot-scope="scope">
                                
                                <div class="flex">
                                    <el-tag
                                        v-for="(el, index) in scope.row.userIds"
                                        :key="el"
                                        closable
                                        style="margin-right: 5px;"
                                        @close="handleCloseTag(scope.row, index, true)">

                                     {{ el | filterUsers(usersOptions) }}
                                    </el-tag>
                                    <el-tag
                                        v-for="(el, index) in scope.row.roleIds"
                                        :key="el"
                                        closable
                                        style="margin-right: 5px;"
                                        @close="handleCloseTag(scope.row, index, false)">
                                    {{ el | filterRoles(rolesOptions) }}
                                    </el-tag>
                                    <el-button size="small" @click="addTag(scope.row)">添加</el-button>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column key="k3" label="操作" width="100">
                            <template slot-scope="scope">
                                <!-- <el-button size="mini" type="text" @click="addRow(scope.$index,scope.row, scope.column, scope.store)">新增</el-button> -->
                                <el-button size="mini" type="text" :disabled="tableData.length===1"   @click="delRow(scope.$index,scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <CreateUpdate
            ref="CreateUpdate"
            :rolesOptions="rolesOptions"
            :selectedRoles="selectedRoles"
            :selectedUsers="selectedUsers"
            
            @ok="onTagAddOk"/>
    </div>
</template>

<script>
    import {merge} from 'lodash'
    import {
        Api_ActModelGetList,
        Api_ActModelGetModel,
        Api_ActModelGetModelUpdate,
        Api_ActModelDeployment,
        DeploymentProcess,
        getCircleAndLine
    } from "@/api/userCenter/actModel";
    import {Api_RolesCombobox, Api_UsersConditionList} from '@/api/baseApi';
    import CreateUpdate from './CreateUpdate'


    // 表格可以拖拽
    import Sortable from 'sortablejs'


    export default {
        name: "Workflow",
        components: {
            CreateUpdate
        },
        filters: {
            filterUsers(val, options) {
                const findRes = options.find(i => i.id === val)
                return findRes ? findRes.name : ''
            },
            filterRoles(val, options) {
                const findRes = options.find(i => i.value === val)
                return findRes ? findRes.label : ''
            }
        },
        data() {
            return {
                show: true,
                loadingQuan:false,
                visible: false,
                listLoading: false,
                isDefaultModelInfo: true, // 指示当前是否为默认模型信息，false时指示当前是具体节点的模型信息
                modelInfoKey: "", // 模型详情信息组件名key
                currentNodeData: null, // 点击当前图形节点时的数据
                data: {}, // 画布数据
                width: 0, // 画布宽
                height: 0, // 画布高
                listData: [], // 企业列表数据
                selectData: {}, // 当前选中的企业
                detailLoading: false, // 画布详情loading
                curTagRowId: null, // 当前添加tag的行id
                tableData: [], // 表格数据
                detailData: {}, // 当前选中流程的详情数据
                rolesOptions: [],
                usersOptions: [],
                selectedRoles: [],
                selectedUsers: [],
                // saasCode: this.$store.getters.saasCode,
                cardHeight: 0,
                resizeTimer: null,
                miskArr:[],

                // 保存初始化的点的坐标的数组
                initalPositionArr:[]
            };
        },
        computed:{  
            saasCode(){
                return this.$store.getters.saasCode
            }
        },
        watch:{
            saasCode:{
               handler(val){
                   if(val){
                        Api_UsersConditionList({
                            saasCode: val,
                            name: ''
                        }).then(res => {
                           
                            this.usersOptions = res;
                        });
                   }
               },
                immediate: true
                
            }
        },
        mounted() {
            const {width, height} = this.$refs.mid.getBoundingClientRect();
            this.width = width - 40;
            this.height = height;
            this.listLoading = true
            Api_ActModelGetList().then(({data}) => {
                this.listData = data;
                this.listLoading = false
                if (data[0]) {
                    this.handleSelectItem(data[0])
                }
            }).catch(e => {
                this.listLoading = false
                // this.$message.error(e)
                console.log(e)
            });
            Api_RolesCombobox().then(res => {
                this.rolesOptions = res;
            });


            window.addEventListener('resize', this.getHeight, false)
        },
        methods: {
            // 设置排序
            setSort() {
                const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
                this.sortable = Sortable.create(el, {
                    ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
                    setData: function(dataTransfer) {
                    // to avoid Firefox bug
                    // Detail see : https://github.com/RubaXa/Sortable/issues/1012
                    dataTransfer.setData('Text', '')
                    },
                    onEnd: evt => {
                        const targetRow = this.tableData.splice(evt.oldIndex, 1)[0]
                        this.tableData.splice(evt.newIndex, 0, targetRow)
                    }
                })
            },

           async newAdd(){

                // 新增数据
                let startId=this.tableData[this.tableData.length-1].id;
                let startX=this.initalPositionArr[this.tableData.length-1].x;
                let startY=this.initalPositionArr[this.tableData.length-1].y;


                let endId='266end';
                let endX=360;
                let endY=490;                
              
                this.miskArr.forEach((child)=>{
                    if(child.type==='endTask'){
                        endId=child.id;
                        endX=child.x;
                        endY=child.y
                    }
                })


            
                let nextId=endId;
                let nextX=endX;
                let nextY=endY;

              


                let params={
                    startId,
                    startX,
                    startY,
                    endId:nextId,
                    endX:nextX,
                    endY:nextY
                }



          
                // startId, endId, startX, startY, endX, endY
              await  getCircleAndLine(params).then(res=>{
                    
                    this.tableData.push({
                        userIds: [],
                        roleIds: [],
                       ...res[0]
                    })

                    // 将点的坐标保存起来
                    this.initalPositionArr.push({
                        x:res[0].x,
                        y:res[0].y
                    })


                })
               

            },



            getHeight() {
                clearTimeout(this.resizeTimer)
                this.resizeTimer = setTimeout(() => {
                    if (!this.$refs.card) {
                        return
                    }
                    const {top: t} = this.$getOffset(this.$refs.card.$el)
                    this.cardHeight = window.innerHeight - t - 75
                }, 100)
            },
            onMouseOverLeft() {
                this.$refs.scrollWrapLeft.update()
            },
            onMouseOverRight() {
                this.$refs.scrollWrapRight.update()
            },
            // 展示模型画布数据
            getItemDetail() {
                this.detailLoading = true;
                Api_ActModelGetModel(this.selectData.id, 'wf_actmodel').then(res => {
                    const {text} = res;
                    
                    if (text) {
                        const model = JSON.parse(text);
                        this.detailData = model
                        this.miskArr=[];
                        if(model.tasks){
                            this.tableData = model.tasks.filter(item => item.type === "userTask");
                             model.tasks.forEach(child=>{
                                if(child.type==="startTask"||child.type==="endTask"){
                                    this.miskArr.push(child)
                                }
                            })
                        }
                    }
                    this.detailLoading = false;



                    // 循环tableData,将点放入initalPositionArr

                    if(this.tableData.length>0){
                       this.tableData.forEach(child=>{
                           this.initalPositionArr.push({
                               x:child.x,
                               y:child.y,
                           })
                       })
                    }
                
                    this.$nextTick(() => {
                        setTimeout(()=>{
                            this.setSort()
                        })
                        
                    })
                }).catch(e => {
                    this.detailLoading = false;
                    // this.$message.error(e);
                    console.log(e)
                });
            },
            // 抽屉确认
            handleSure() {

                // 判断一下若是有数据没有填写,则弹框提示

                 for(let i=0;i<this.tableData.length;i++){
                     if(this.tableData[i].roleIds.length==0&&this.tableData[i].userIds.length==0){
                          this.$message({
                            showClose: true,
                            message: '有数据没有填写',
                            type: 'error'
                          });
                          
                         return 
                     }
                 }

                // 循环this.tableData 对里面的每一项的x,y重新赋值
                for(let i=0;i<this.tableData.length;i++){

                    for(let j=0;j<this.initalPositionArr.length;j++){
                        if(i==j){
                            this.tableData[i].x=this.initalPositionArr[j].x
                            this.tableData[i].y=this.initalPositionArr[j].y
                        }
                    }

                }

               





                let strT=JSON.parse(JSON.stringify(this.tableData));
                   strT.forEach(i=>{
                   
                    var nameArr=[];
                    if(i.roleIds && i.roleIds.length>0){
                       
                        for(var j=0;j<i.roleIds.length;j++){
                            const name = this.rolesOptions.find(v => v.value === i.roleIds[j])
                            nameArr.push(name.label)
                        }
                    }
                   
                    i.name=nameArr.join(',')

                })

               if(this.miskArr.length===0){
                   strT.unshift({"id":"245start","type":"startTask","name":"提交","formKey":"","userIds":[],"roleIds":[],"dept":false,"callback":"","x":398,"y":98})
                   strT.push({"id":"266end","type":"endTask","name":"完成","formKey":null,"userIds":[],"roleIds":[],"dept":false,"callback":null,"x":360,"y":490})
               }else if(this.miskArr.length===2){
                    this.miskArr.forEach((child)=>{
                        if(child.type==='startTask'){
                            strT.unshift(child)
                        }
                        if(child.type==='endTask'){
                            strT.push(child)
                        }
                    })
               }else if(this.miskArr.length===1){
                   if(this.miskArr[0].type==='startTask'){
                        strT.unshift(this.miskArr[0]);
                        strT.push({"id":"266end","type":"endTask","name":"完成","formKey":null,"userIds":[],"roleIds":[],"dept":false,"callback":null,"x":360,"y":490})
                   }else if(this.miskArr[0].type==='endTask'){
                        strT.unshift({"id":"245start","type":"startTask","name":"提交","formKey":"","userIds":[],"roleIds":[],"dept":false,"callback":"","x":398,"y":98})
                        strT.push(this.miskArr[0])
                   }
               }

           



                // 生成传给后台的线
                let lines=[];
                for(let i=0;i<strT.length;i++){
                 
                    if(i!==strT.length-1){
                        lines.push({
                            startId:strT[i].id,
                            endId:strT[i+1].id
                        })
                    }
                }

                Api_ActModelGetModelUpdate(this.selectData.id, 'wf_actmodel', {
                    text: JSON.stringify({
                        tasks: strT,
                        lines: lines
                    })
                }).then(() => {
                    // this.$message({
                    //     message: '保存成功',
                    //     type: 'success'
                    // });
                    DeploymentProcess(this.selectData.id).then((res)=>{
                        this.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                    })
                    this.onDrawerClose();
                }).catch(e => {
                    console.log(e)
                    // this.$message.success(e);
                });
            },
            // 重置画布数据
            handleNodeReset() {

            },
            onDrawerClose() {

            },
            // 选中企业
            handleSelectItem(el) {
                this.selectData = el;
                this.getItemDetail();
            },
            // 节点弹框关闭时
            onDialogClose() {

            },
            // 部署流程
            handleDeployment(row) {
                this.$confirm("确定部署该流程?", "提示", {
                    type: "warning"
                }).then(() => {
                    const {id} = row;
                    const loading = this.$openLoading();
                    Api_ActModelDeployment(id)
                        .then(msg => {
                            // this.$message.success(msg);
                            this.$message({
                                message: msg,
                                type: 'success'
                            });
                            loading.close();
                        })
                        .catch(() => {
                            loading.close();
                        });
                });
            },
            // 新增一行数据
         async  addRow(index,row, column, $index,store) {
         

                let startId=row.id;
                let startX=row.x;
                let startY=row.y;


                let endId='266end';
                let endX=360;
                let endY=490;                
              
                this.miskArr.forEach((child)=>{
                    if(child.type==='endTask'){
                        endId=child.id;
                        endX=child.x;
                        endY=child.y
                    }
                })


                var copyTableData=JSON.parse(JSON.stringify(this.tableData));
    

                let nextId=endId;
                let nextX=endX;
                let nextY=endY;
                if(copyTableData[index+2]){
                    nextId=copyTableData[index+2].id;
                    nextX=copyTableData[index+2].x;
                    nextY=copyTableData[index+2].y;
                }


                let params={
                    startId,
                    startX,
                    startY,
                    endId:nextId,
                    endX:nextX,
                    endY:nextY
                }



                var lineAdd=[];
                // startId, endId, startX, startY, endX, endY
              await  getCircleAndLine(params).then(res=>{
                
                //    this.tableData[index+1]={...this.tableData[index+1],...res[0]}
                    this.tableData.splice(index + 1, 0, {
                        userIds: [],
                        roleIds: [],
                       ...res[0]
                    })
                   lineAdd=[res[1],res[2]];
                })
                // 删除startId是当前row.id的线
                var needTodeleteLineIndex=  this.detailData.lines.findIndex((child)=>{
                    return child.startId==row.id
                })
                this.detailData.lines.splice(needTodeleteLineIndex,1);

                // 将新增的线添加到数组
                var currentLineEndIndex= this.detailData.lines.findIndex((child)=>{
                    return child.endId==row.id
                })
                this.detailData.lines.splice(currentLineEndIndex + 1, 0,lineAdd[0],lineAdd[1])
        },



            // 删除一行
            delRow(index,row) {
               

                let endIdLineIndex=this.detailData.lines.findIndex(child=>{
                    return child.endId==row.id
                })

                // 删除以row.id为结束的线
                 this.detailData.lines.splice(endIdLineIndex,1)
                
                // 删除以row.id为开始的线
                let  startIdLindeIndex=this.detailData.lines.findIndex(child=>{
                    return child.startId==row.id;
                })

                this.detailData.lines.splice(startIdLindeIndex,1)

                // 拷贝原始数据
                let copyTableDataList=JSON.parse(JSON.stringify(this.tableData));
               

                // 生成新的line的数据
                let lineOne={
                    startId:'245start',
                    endId:'266end'
                }


                // 若是上一条数据存在，则找到上一条数据
                if(copyTableDataList[index-1]){
                    let lastData=copyTableDataList[index-1];
                    
                    // 给lineOne的起始点赋值
                    lineOne.startId=lastData.id;
                }else{
                    // 若是上一条的数据不存在说明删除的是第一条数据。那么startId就是开始的id，endId就是下一条数据的id
                 
                    // 若是本来就有头，那么就直接赋值
                    if(this.miskArr.length>0){
                        this.miskArr.forEach(child=>{
                            if(child.type==='startTask'){
                                lineOne.startId=child.id
                            }
                        })
                    }
                }


                // 若是下一条数据存在，则找到下一条数据
                if(copyTableDataList[index+1]){
                    let nextData=copyTableDataList[index+1];
                    // 给lineOne的结束点赋值
                    lineOne.endId=nextData.id;
                }else{
                    // 若是下一条数据不存在,说明删除的是最后一条数据。那么endId就是结束的id。
                    // 若是本来就有尾，那么就直接赋值
                    if(this.miskArr.length>0){
                        this.miskArr.forEach(child=>{
                            if(child.type==='endTask'){
                                lineOne.endId=child.id
                            }
                        })
                    }
                }

                //  把lineOne放进this.detailData.lines
                  this.detailData.lines.push(lineOne);

        
                // 删除当前的数据
                this.tableData.splice(index,1)
            },
            // 删除标签,flag:true为删除userId,false:为删除角色
            handleCloseTag(row, tagIndex, flag) {
                if (flag) {
                    row.userIds.splice(tagIndex, 1)
                } else {
                    row.roleIds.splice(tagIndex, 1)
                }
            },
            addTag(row) {
                
                let  {id, userIds, roleIds}=row;
                console.log(id,'1');
                console.log(userIds,'2');
                console.log(roleIds,'3');
                this.curTagRowId = id
                this.selectedUsers = merge([], userIds)
                this.selectedRoles = merge([], roleIds)
                this.$refs.CreateUpdate.openModel()
            },
            // 标签新增成功的回调
            onTagAddOk(userIds, roleIds) {
                // console.log(userIds,'99');
                // console.log(roleIds,'9992222')
                // 找到当前要添加标签的那一行的数据
                for(let i=0;i<this.tableData.length;i++){
                    let every=this.tableData[i];
                    if(every.id==this.curTagRowId){
                        this.selectedRoles = [];
                        this.selectedUsers = [];
                        every.userIds=userIds;
                        every.roleIds=roleIds;
                    }
                }
                // this.tableData.forEach(item => {
                 
                //     if (item.id ==this.curTagRowId ) {
                      
                //         this.selectedRoles = []
                //         this.selectedUsers = []
                //         item.userIds = userIds
                //         item.roleIds = roleIds
                //     }
                // })
            }
        }
    };
</script>
<style lang="scss" scoped>
    .fl{
        float: left;
    }

    .fr{
        float: right;
    }

    .clearfix::after{
        content:"";
        display: block;
        clear: both;
    }
    .page-header {
        margin-bottom: 0;

        .page-name {
            margin-bottom: 0;
        }
    }

    .wrap {
        padding-bottom: 0 !important;
    }

    .page-content {
        height: calc(100% - 42px);
    }

    /deep/ .scrollbar-wrapper {
        overflow-x: hidden !important;

        .vue-scroll__view {
            height: 100%;
            padding: 10px;
        }
    }

    .no-data-tip {
        padding: 20px;
    }

    .list-item {
        padding: 10px;
        cursor: pointer;
        transition: all 0.2s;

        &.selected {
            background-color: #4b9df3;
            color: #fff;
        }
    }

    .left-title {
        border-bottom: 1px solid #ccc;
        font-size: 16px;
        padding: 10px 15px;
    }

    .title-tip {
        border-bottom: 1px solid #ccc;
        padding: 0 10px;
        height: 45px;
        line-height: 45px;
    }

    .title-info {
        text-align: center;
        height: 30px;
        line-height: 30px;
        transition: all 0.2s;
        margin: 0;
        display: inline-block;
    }

    .defaultModel {
        display: block;
        width: 100%;
    }

    .wrap,
    .con,
    .droppable-wrap {
        height: 100%;
        position: relative;
    }

    .con {
        position: relative;
        padding-top: 20px;
        padding-bottom: 20px;
        overflow: hidden;

        &::after {
            content: "";
            display: block;
            clear: both;
        }

        display: flex;

        .left {
            width: 280px;
            background-color: #F8F8FA;
            display: flex;
            flex-direction: column;

            .t {
                flex: 1;
                display: flex;
                flex-direction: column;

                .list {
                    flex: 1;
                    background-color: #fff;
                    overflow: auto;
                    padding: 10px 15px;
                }
            }

            .b {
                height: 200px;
                display: flex;
                flex-direction: column;
                border-top: 1px solid #ccc;

                .drag-wrap {
                    flex: 1;
                    background-color: #fff;
                    padding: 10px 15px;
                }
            }

        }

        .mid {
            flex: 1;
            /*width: calc(100% - 280px);*/
            /*height: 100%;*/
            overflow: hidden;
            padding: 0 25px 0 15px;
            box-sizing: border-box;
            position: relative;

            .g6-container {
                position: absolute !important;
                width: 100%;
                height: 100%;
                left: 15px;
                right: 25px;
                top: 0;

                /deep/ & > div:nth-child(2) {
                    transition: all 0.2s;
                    border-right: 1px solid #eee;
                    border-bottom: 1px solid #eee;
                }

                .scale-per {
                    right: 25px;
                }
            }
        }

        .right {
            background-color: #fff;
            padding: 20px 0 20px 15px;
            width: 450px;
            height: 100%;
            border-left: 1px solid #DCDFE6;
            position: absolute;
            right: 0;
            top: 0;
            transform: translateX(100%);
            transition: transform 0.3s ease-in;
            z-index: 1;

            &.show {
                transform: translateX(0);
            }

            .toggleRight-span {
                position: absolute;
                width: 15px;
                height: 60px;
                border: 1px solid #ccc;
                left: -15px;
                top: 50%;
                margin-top: -30px;
                line-height: 60px;
                color: #ccc;
                cursor: pointer;
                background-color: #fff;
            }
        }
    }

    .el-tabs__nav {
        & > div {
            width: 50%;
        }
    }

    .action i {
        cursor: pointer;

        &.el-icon-plus:hover {
            color: green;
        }

        &.el-icon-minus:hover {
            color: red;
        }
    }

    .drag-item {
        padding: 10px;
        cursor: pointer;
        border: 1px solid transparent;
        transition: all 0.2s;
        font-size: 14px;
        display: inline-block;
        text-align: center;
        width: 33.33%;

        img {
            margin-bottom: 6px;
        }
    }

    .work {
        border-bottom: 1px solid #d2d4d4;
        padding: 8px;
        height: 45px;
        background-color: rgba(176, 224, 230, 0.5);
        text-align: right;

        & > div {
            margin-left: 8px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            vertical-align: middle;
        }

        i {
            font-size: 18px;
            cursor: pointer;
        }
    }

    .right .el-scrollbar {
        height: 100%;
    }

    /deep/ {
        .el-input-group__append {
            .el-select {
                width: 65px;
            }
        }

        .form-info-split {
            color: #999;
            font-size: 12px;
            position: relative;
            text-align: center;
            display: flex;
            align-items: center;
            margin: 20px 0;

            .l, .r {
                flex: 1;
                border-top: 1px dashed currentColor;
            }

            .t {
                margin: 0 8px;
            }
        }

        .border-wrap {
            display: inline-block;
            width: 80px;
            margin-right: 10px;

            .el-form-item {
                margin-bottom: 0;
            }
        }

        .el-color-picker {
            vertical-align: middle;
        }
    }
</style>
