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
                             :class="{hover: curHover === node.data.id}"
                             @dragover="ondragover($event, node)">
                            <div style="padding-right: 10px;">
                                <i v-if="data.isFenLei" class="el-icon-reading"></i>
                                {{ data.label }}
                            </div>
                        </div>
                    </el-tree>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {uniqueId, merge} from 'lodash';
    import {
        Api_EvaluateEstimateTree
    } from '@/api/creditManagement/creditEstimate/target';
    import {Api_EvaluateModelSecond, Api_EvaluateModelSecondGet} from '@/api/creditManagement/creditEstimate/model';

    export default {
        name: "StepDetail2",
        props: {
            rowId: String, // 当前记录id
            isTwo: Boolean, // 两层或三层
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
                curHover: ''
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
                    if (this.isTwo) {
                        this.treeDataRight = this.getLevel2Tree(res);
                    } else {
                        const level1Arr = res.filter(item => !item.pid);
                        const level2Arr = res.filter(item => item.pid);
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
                return new Promise((resolve) => {
                    resolve()
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
            onNodeExpand() {},
            ondragstart(node, e) {
                e.dataTransfer.setData('data', JSON.stringify(node.data));
            },
            ondragover(e, node) {
                e.preventDefault();
                this.curHover = node.data.id
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
    }
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
