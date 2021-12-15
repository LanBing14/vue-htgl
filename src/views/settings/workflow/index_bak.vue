<template>
    <div class="wrap">
        <div class="page-header">
            <h1 class="page-name">
                <span>流程管理</span>
            </h1>
            <div v-if="selectData.id">
                <el-button
                    size="mini"
                    style="height: 36px;width: 99px;margin-top: -15px;"
                    @click="handleNodeReset"
                >
                    重置
                </el-button>
                <el-button
                    type="primary"
                    size="mini"
                    style="height: 36px;width: 99px;margin-top: -15px;"
                    @click="handleDeployment"
                >
                    部署
                </el-button>
                <el-button
                    type="primary"
                    size="mini"
                    style="height: 36px;width: 99px;margin-top: -15px;"
                    @click="handleSure"
                >
                    保存
                </el-button>
            </div>
        </div>
        <div class="page-content">
            <div class="con">
                <div class="left">
                    <div class="t">
                        <h5 class="left-title">业务流程</h5>
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
                    </div>
                    <div v-if="listData.length && selectData.id" class="b">
                        <h5 class="left-title">工具箱</h5>
                        <div class="drag-wrap">
                            <div
                                v-for="el in list"
                                :key="el.type"
                                class="drag-item"
                                draggable="true"
                                @dragstart="dragstart($event, el)"
                            >
                                <img :src="pics[el.pic]" alt="">
                                <div>{{ el.label }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div ref="mid" class="mid">
                    <G6Editor
                        v-if="width && height"
                        v-loading="detailLoading"
                        ref="editor"
                        :data="data"
                        :width.sync="width"
                        :height.sync="height"
                        :disWidth="40"
                        line-type="polyline2"
                        @dragover="dragover"
                        @drop="drop"
                        @nodeSelect="nodeSelect"
                        @zoom="onZoom"
                        class="g6-editor"
                    ></G6Editor>
                </div>
                <div ref="right" :class="{show: showRight}" class="right">
                    <span class="toggleRight-span" @click="toggleShowRight">{{ showRight ? '>' : '<' }}</span>
                    <component
                        ref="modelInfoBody"
                        :is="modelInfoKey"
                        :data="currentNodeData"
                        :selectData="selectData"
                        :lineTypes="lineTypes"
                        @save="saveNode"
                    />
                    <el-alert
                        v-if="isDefaultModelInfo"
                        :closable="false"
                        title="暂未选择节点"
                        type="info"
                        show-icon
                    ></el-alert>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {uniqueId} from "lodash";
    import G6Editor from "@/components/G6Editor";
    import dataMenu from "./dataMenu";
    import DiamondNodeInfo from "./components/DiamondNodeInfo";
    import RectNodeInfo from "./components/RectNodeInfo";
    import EllipseNodeInfo from "./components/EllipseNodeInfo";
    import LineInfo from "./components/LineInfo";
    import {switchColors} from "@/utils/variables";
    import {
        Api_ActModelGetList,
        Api_ActModelGetModel,
        Api_ActModelGetModelUpdate,
        Api_ActModelDeployment
    } from "@/api/userCenter/actModel";
    import {Api_comboboxDict} from '@/api/baseApi';
    import workflowStart from '@/assets/images/workflow-start.png';
    import workflowTask from '@/assets/images/workflow-task.png';
    import workflowEnd from '@/assets/images/workflow-end.png';

    export default {
        name: "Workflow",
        components: {
            G6Editor,
            RectNodeInfo,
            DiamondNodeInfo,
            EllipseNodeInfo,
            LineInfo
        },
        data() {
            return {
                pics: {
                    workflowStart,
                    workflowTask,
                    workflowEnd
                },
                switchColors,
                visible: false,
                list: dataMenu,
                curZoom: 1,
                editor: null,
                isDefaultModelInfo: true, // 指示当前是否为默认模型信息，false时指示当前是具体节点的模型信息
                modelInfoKey: "", // 模型详情信息组件名key
                currentNodeData: null, // 点击当前图形节点时的数据
                data: {}, // 画布数据
                width: 0, // 画布宽
                height: 0, // 画布高
                listData: [], // 企业列表数据
                selectData: {}, // 当前选中的企业
                detailLoading: false, // 画布详情loading
                dialogVisible: false, // 节点详情弹框
                showRight: false, // 展示右边详情
                lineTypes: [] // 线的类型
            };
        },
        mounted() {
            const {width, height} = this.$refs.mid.getBoundingClientRect();
            this.width = width - 40;
            this.height = height;
            this.$nextTick(() => {
                this.editor = this.$refs.editor;
            });
            Api_ActModelGetList().then(({data}) => {
                this.listData = data;
            });
            Api_comboboxDict('line_type').then(res => {
                this.lineTypes = res
            })
        },
        methods: {
            // 展示模型画布数据
            openModel() {
                this.detailLoading = true;
                Api_ActModelGetModel(this.selectData.id, 'wf_actmodel').then(res => {
                    let {text: model} = res;
                    if (model) {
                        model = JSON.parse(model);
                        if (model.tasks) {
                            model.tasks = model.tasks.map(item => {
                                const findRes = dataMenu.find(i => i.type === item.type);
                                return {
                                    ...findRes,
                                    id: item.id,
                                    label: item.name,
                                    x: item.x,
                                    y: item.y,
                                    data: {
                                        ...item
                                    }
                                };
                            });
                        }
                        if (model.lines) {
                            model.lines = model.lines.map(item => {
                                return {
                                    id: item.id,
                                    shape: item.type ? (item.type === '0' ? 'line' : 'polyline2') : 'line',
                                    type: 'edge',
                                    source: item.startId,
                                    target: item.endId,
                                    points: item.points,
                                    data: {
                                        ...item
                                    }
                                };
                            });
                        }
                        this.data = {
                            nodes: model.tasks,
                            edges: model.lines
                        };
                    }
                    this.detailLoading = false;
                }).catch(e => {
                    this.detailLoading = false;
                    this.$message.error(e);
                });
            },
            // 抓取元素
            dragstart(e, row) {
                e.dataTransfer.setData("Text", JSON.stringify(row));
            },
            dragover(e) {
                e.preventDefault();
            },
            onZoom(zoom) {
                this.curZoom = Number(zoom);
            },
            // 放置元素
            drop(e) {
                e.preventDefault();
                const {pageX, pageY} = e;
                let row = e.dataTransfer.getData("Text");
                const editorOffset = this.editor.$el.getBoundingClientRect();
                const editorLeft = pageX - editorOffset.left;
                const editorTop = pageY - editorOffset.top - window.scrollY;
                if (row) {
                    try {
                        row = JSON.parse(row);
                        if (row.shape) {
                            const point = this.editor.graph.getPointByCanvas(
                                editorLeft,
                                editorTop
                            );
                            const id = uniqueId();
                            const model = {
                                ...row,
                                id: id,
                                x: point.x,
                                y: point.y,
                                data: {
                                    id,
                                    x: point.x,
                                    y: point.y,
                                    type: row.type,
                                    name: row.label
                                }
                            };
                            this.editor.addItem("node", model);
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }
            },
            // 手动放大/缩小画布, type: true 放大，false 缩小
            scale(type) {
                if (type) {
                    this.curZoom = this.$add(this.curZoom, 0.1);
                } else {
                    this.curZoom = this.$subtract(this.curZoom, 0.1);
                }
                this.editor.graph.zoomTo(this.curZoom);
            },
            // 保存节点或线编辑的信息
            saveNode([nodeId, nodeData]) {
                if (nodeData.hasOwnProperty('type')) {
                    if (nodeData.type === '0') {
                        nodeData.shape = 'line'
                    } else {
                        nodeData.shape = 'polyline2'
                    }
                }
                this.editor.updateItem(nodeId, nodeData);
                this.$message.success("更新节点信息成功！");
            },
            // 抽屉确认
            handleSure() {
                const data = this.editor.getData(); // 获取所有节点/线数据
                let {nodes: tasks, edges: lines} = data;
                tasks = tasks.map(item => {
                    return {
                        ...item.data,
                        x: item.x,
                        y: item.y
                    };
                });
                lines = lines.map(item => {
                    return {
                        ...item.data,
                        startId: item.source,
                        endId: item.target,
                        points: item.points
                    };
                });
                Api_ActModelGetModelUpdate(this.selectData.id, 'wf_actmodel', {
                    text: JSON.stringify({
                        tasks,
                        lines
                    })
                }).then(() => {
                    this.$message.success('保存成功');
                    this.onDrawerClose();
                }).catch(e => {
                    this.$message.success(e);
                });
            },
            // 重置画布数据
            handleNodeReset() {
                this.$confirm('此操作将丢失当前可能操作过的数据', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.openModel();
                });
            },
            // 节点或线被选择
            nodeSelect(data, type, selected) {
                if (selected) {
                    this.currentNodeData = data;
                    this.isDefaultModelInfo = false;
                    this.dialogVisible = true;
                    let k = "";
                    switch (data.type) {
                        case "startTask":
                            k = "RectNodeInfo";
                            break;
                        case "userTask":
                            k = "DiamondNodeInfo";
                            break;
                        case "endTask":
                            k = "EllipseNodeInfo";
                            break;
                        default:
                            break;
                    }
                    if (type === 'line') {
                        k = "LineInfo";
                    }
                    this.modelInfoKey = k;
                    this.showRight = true;
                } else {
                    this.currentNodeData = null;
                    this.isDefaultModelInfo = true;
                    this.modelInfoKey = null;
                    this.showRight = false;
                }
                this.changeSize();
            },
            onDrawerClose() {
                this.curZoom = 1;
                this.isDefaultModelInfo = true;
                // this.data = {};
                // this.$refs.editor.clear();
            },
            // 选中企业
            handleSelectItem(el) {
                this.selectData = el;

                this.openModel();
            },
            // 节点弹框关闭时
            onDialogClose() {
                // this.editor.clearSelected()
            },
            // 改变画布大小
            changeSize() {
                const rightWidth = this.$refs.right.getBoundingClientRect().width;
                if (this.showRight) {
                    this.width = this.width - rightWidth;
                } else {
                    this.width = this.width + rightWidth;
                }
            },
            toggleShowRight() {
                this.showRight = !this.showRight;
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
                            this.$message.success(msg);
                            loading.close();
                        })
                        .catch(() => {
                            loading.close();
                        });
                });
            }
        }
    };
</script>
<style lang="scss" scoped>
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
            background-color: #3D8EE0;
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
            border: 1px solid #d2d4d4;
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
