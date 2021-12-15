<template>
    <div>
        <el-form :form="formData" label-width="5em">
            <el-form-item label="线型：">
                <el-select v-model="type" placeholder="请选择线型" style="width: 100%;">
                    <el-option
                        v-for="(el, index) in lineTypes"
                        :key="el.value"
                        :label="el.label"
                        :value="el.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <!--            <el-form-item label="关系："></el-form-item>-->
            <el-table :data="tableData" bordered rowKey="id">
                <el-table-column align="center" label="(" width="60">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.left"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="选项" width="120">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.key" style="width: 100%;">
                            <el-option
                                v-for="(el, index) in keyOptions"
                                :key="index"
                                :label="el.label"
                                :value="el.value">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="条件" width="110">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.tj" style="width: 100%;">
                            <el-option value="==">==</el-option>
                            <el-option value=">">></el-option>
                            <el-option value="<"><</el-option>
                            <el-option value=">=">>=</el-option>
                            <el-option value="<="><=</el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="值" width="100">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.value"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" label=")" width="60">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.right"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="关系" width="110">
                    <template slot-scope="scope">
                        <el-select v-if="scope.$index!==tableData.length-1" v-model="scope.row.gx" style="width: 100%;">
                            <el-option value="&&">与</el-option>
                            <el-option value="||">或</el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column align="center" :render-header="renderHeader" width="50">
                    <template slot-scope="scope">
                        <el-button circle size="mini" icon="el-icon-minus" @click="delRow(scope.$index)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form>
        <div style="text-align: center">
            <el-button type="primary" @click="save">保存线信息</el-button>
        </div>
    </div>
</template>

<script type="text/jsx">
    import {merge, uniqueId} from 'lodash';

    export default {
        name: 'LineInfo',
        props: {
            data: Object,
            lineTypes: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                formData: {},
                type: '0',
                keyOptions: [{
                    label: 'ww',
                    value: '123'
                }], // 选项的下拉框数据
                tableData: [],
                tableCount: 0
            };
        },
        watch: {
            data(val) {
                if (val) {
                    this.mergeData(merge({}, val));
                }
            }
        },
        mounted() {
            console.log(1);
            this.mergeData(merge({}, this.data));
        },
        methods: {
            // 合并父组件传递过来的默认数据
            mergeData({data}) {
                if (data && data.conditions) {
                    this.tableData = data.conditionsObject
                }
                console.log(data, 1);
                if (data && data.type) {
                    this.type = data.type
                }
            },
            // 保存节点数据
            save() {
                // return new Promise(resolve => {
                let conditions = '';
                let names = '';
                this.tableData.forEach(item => {
                    conditions += item.left + '"${' + item.key + '}"' + item.tj + item.value + item.right + item.gx;
                });
                try {
                    // eslint-disable-next-line no-eval
                    const result = eval(conditions);
                    names = this.tableData.map(item => {
                        return this.keyOptions.find(i => i.value === item.key).label;
                    });
                    this.$emit('save', [this.data.id, {
                        label: names.join('、'),
                        data: {
                            id: this.data.id,
                            startId: this.data.source,
                            endId: this.data.target,
                            conditions: conditions.replace(/"/g, ""),
                            conditionsObject: this.tableData,
                            name: names.join('、'),
                            points: this.data.points,
                            type: this.type
                        },
                        shape: this.type === '0' ? 'line' : 'polyline2'
                    }]);
                } catch (e) {
                    this.$message.warning('条件格式不正确');
                }
                // });
            },
            addRow() {
                const {tableData} = this;
                const newData = {
                    id: uniqueId() + new Date().getTime(),
                    key: '',
                    tj: '',
                    value: '',
                    gx: '',
                    left: '',
                    right: ''
                };
                this.tableData = [...tableData, newData];
            },
            delRow(index) {
                this.tableData.splice(index, 1);
            },
            renderHeader() {
                return (<el-button
                    type="primary"
                    circle
                    size="mini"
                    icon="el-icon-plus"
                    onClick={this.addRow.bind(this)}></el-button>);
            }
        }
    };
</script>

<style scoped lang="scss">
    .el-input__inner {
        padding: 0 8px;
    }

    .form-info-split {
        color: #999;
        font-size: 12px;
        position: relative;
        text-align: center;
        display: flex;
        align-items: center;

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

    .list-item {
        display: flex;

        & > div {
            flex: 1;
            text-align: center;
            padding: 0 5px;
        }

        /deep/ .el-form-item__label {
            width: 100% !important;
        }

        .action {
            flex: initial;
            margin-right: 0;

            .el-button + .el-button {
                margin-left: 0;
            }
        }
    }

    .label-right /deep/ {
        label {
            text-align: center;
        }
    }
</style>
