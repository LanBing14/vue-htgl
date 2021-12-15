<template>
    <div>
        <el-form ref="form" :model="formData">
            <el-form-item label="模型满分分值">{{ formData.score }}</el-form-item>
            <el-form-item>
                <el-table
                    :data="formData.tableData"
                    stripe
                    style="width: 100%; margin-top: 20px">
                    <el-table-column
                        type="index"
                        label="序号"
                        width="50">
                    </el-table-column>
                    <el-table-column
                        prop="label"
                        label="一级分类名称">
                    </el-table-column>
                    <el-table-column
                        label="一级权重">
                        <template slot-scope="scope">
                            <el-form-item>{{ scope.row.weight }}</el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                        :label="'二级'+(isTwo?'指标':'分类')+'名称'">
                        <template slot-scope="scope">
                            <div v-for="(el, index) in scope.row.children" :key="index" class="table-td-item">
                                {{ el.label }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="二级权重">
                        <template slot-scope="scope">
                            <el-form-item v-for="(el, index) in scope.row.children"
                                          :key="index"
                                          class="table-td-item"
                            >{{ el.weight }}</el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="!isTwo"
                        label="三级指标名称">
                        <template slot-scope="scope">
                            <div v-for="(el, index) in scope.row.children" :key="index">
                                    <div v-for="(elChild, indexChild) in el.children"  class="table-td-item" :key="index+''+indexChild">
                                        {{ elChild.label }}
                                    </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="!isTwo"
                        label="三级权重">
                        <template slot-scope="scope">
                            <div v-for="(el, index) in scope.row.children" :key="index">
                                <el-form-item v-for="(elChild, indexChild) in el.children"
                                              :key="indexChild"
                                              class="table-td-item"
                                >{{ elChild.weight }}</el-form-item>
                            </div>

                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {merge} from 'lodash';
    import {Api_EvaluateModelThird, Api_EvaluateModelThirdGet} from '@/api/creditManagement/creditEstimate/model';

    export default {
        name: "StepDetail3",
        props: {
            rowId: String, // 当前记录id
            // isTwo: Boolean, // 两层或三层
            // data: Array, // 从step2得到的基础数据
            defaultData: Object // 默认数据，当前步骤返回上一层时有可能作了保存数据的操作，由此重新获得上一次保存的值
        },
        data() {
            const createRules = this.$createRules;
            const data = merge([], this.defaultData ? this.defaultData.waitList : []);

            return {
                isTwo:null,
                formData: {
                    score: this.defaultData ? this.defaultData.score : '',
                    tableData: data
                }
            };
        },
        watch: {
            data(val) {
                this.formData.tableData = val;
            }
        },
        created() {
            if (this.rowId) {
                Api_EvaluateModelThirdGet(this.rowId).then(res => {
                    this.formData.score = res.fullScore;
                    this.isTwo = res.modelLevel==0?true: false
                    if (this.isTwo) {
                        this.formData.tableData = res.waitList.map(item1 => {
                            const children = item1.kpiWait.map(({id, kpiName, weight}) => {
                                return {
                                    id,
                                    weight: weight,
                                    label: kpiName
                                };
                            });
                            return {
                                id: item1.id,
                                label: item1.modelClassifyName,
                                isFenLei: true,
                                weight: item1.weight,
                                children
                            };
                        });
                    } else {
                        const level1Arr = res.waitList.filter(item => !item.pid);
                        const level2Arr = res.waitList.filter(item => item.pid);
                        level1Arr.forEach(item => {
                            item.label = item.modelClassifyName;
                            item.isFenLei = true;
                            item.children = [];
                        });
                        level2Arr.forEach(itemLevel2 => {
                            const {pid} = itemLevel2;
                            level1Arr.forEach(itemLevel1 => {
                                if (itemLevel1.id === pid) {
                                    const children2 = itemLevel2.kpiWait.map(({id, kpiName, weight}) => {
                                        return {
                                            id,
                                            label: kpiName,
                                            weight
                                        };
                                    });
                                    itemLevel1.children.push({
                                        id: itemLevel2.id,
                                        label: itemLevel2.modelClassifyName,
                                        isFenLei: true,
                                        weight: itemLevel2.weight,
                                        children: children2
                                    });
                                }
                            });
                        });
                        this.formData.tableData = level1Arr;
                    }
                });
            }
        },
        methods: {
            // 只获取数据，不作验证
            getData() {
                return {
                    score: this.formData.score,
                    waitList: this.formData.tableData
                };
            },
            validate() {
                return new Promise((resolve) => {
                    resolve()
                });
            },
            objectSpanMethod({row, column, rowIndex, columnIndex}) {
                if (columnIndex === 1) {
                    if (row.rowspan1) {
                        return {
                            rowspan: row.rowspan1,
                            colspan: 1
                        };
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        };
                    }
                }
                if (columnIndex === 3) {
                    if (row.rowspan2) {
                        return {
                            rowspan: row.rowspan2,
                            colspan: 1
                        };
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        };
                    }
                }
            },
            editChange() {
                if (this.formData.tableData.length) {
                    return true;
                } else {
                    return false;
                }
            },
            clearData() {
                this.$refs.form.resetFields();
                this.formData.tableData = [];
            }
        }
    }
</script>

<style scoped lang="scss">
    .table-td-item {
        margin-left: -10px;
        margin-right: -10px;
        padding: 10px;
        height: 60px;
        display: flex;
        align-items: center;

        &:first-child {
            padding-top: 2px;
        }

        &:last-child {
            padding-bottom: 2px;
        }
    }

    /deep/ .el-table {
        overflow: initial;

        .el-table__body-wrapper {
            overflow: initial;
        }

        .cell {
            overflow: initial;
        }
    }
</style>
