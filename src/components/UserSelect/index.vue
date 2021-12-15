<template>
<div>
    <el-row>
        <el-col :span="12">
            <el-row>
                <el-col :span="10">
                    <el-radio-group v-model="kind">
                        <el-radio-button label="1">部门</el-radio-button>
                        <el-radio-button label="2">角色</el-radio-button>
                    </el-radio-group>
                </el-col>
                <el-col :span="14">
                    <InputSearch
                        ref="inputSearch"
                        :defaultData="selectDefaultData"
                        :data.sync="selectSearchResList"
                        @selectChange="selectChange"
                        placeholder="请选择文章标签"></InputSearch>
                </el-col>
            </el-row>
            <el-row class="select-left">
                <keep-alive>
                    <template v-if="kind==='1'">
                    <el-tree
                        ref="depTree"
                        :data="depData"
                        :highlight-current="true"
                        node-key="id"
                        show-checkbox
                        check-strictly
                        default-expand-all
                        @check="checkChange"
                    />
                    </template>
                    <template v-else>
                    <el-checkbox-group v-model="roleCheckList">
                        <ul class="roleList">
                            <li v-for="el in roleData" :key="el.value">
                                <span>{{ el.label }}</span>
                                <el-checkbox :label="el.value" @change="roleChange(el.value)">&nbsp;</el-checkbox>
                            </li>
                        </ul>
                    </el-checkbox-group>
                    </template>
                </keep-alive>
            </el-row>
        </el-col>
        <el-col :span="12" style="padding-left: 20px;">
            <div class="title-border-left">待选人员</div>
            <div class="people-wrap">
                <el-scrollbar>
                    <ul class="wait-choose">
                        <li v-for="el in waitChooseList" :key="el.value" @click="addWaitChecked(el)">
                            <a>{{ el.label }}</a>
                            <label
                                v-if="filterWaitChoose(el.value)"
                                class="status-label">
                                <i class="success el-icon-circle-check"></i>
                            </label>
                        </li>
                    </ul>
                </el-scrollbar>
            </div>
            <div class="title-border-left" style="margin-top: 20px;">已选人员</div>
            <div class="people-wrap">
                <el-scrollbar>
                    <ul class="be-choose">
                        <li v-for="el in waitCheckedList" :key="el.value">
                            <a>{{ el.label }}</a>
                            <label class="status-label" @click="handleDel(el.value)">
                                <i class="close el-icon-close"></i>
                            </label>
                        </li>
                    </ul>
                </el-scrollbar>
            </div>
        </el-col>
    </el-row>
</div>
</template>

<script>
    import InputSearch from './InputSearch'
    import {
        Api_fetchMenusTree // 查询菜单树
    } from '@/api/admin/system/index'

    export default {
        name: 'UserSelect',
        components: {InputSearch},
        data() {
            return {
                username: '',
                kind: '1',
                selectDefaultData: [], // 搜索条件默认数据
                selectOptions: [], // 根据搜索文字查询的option
                selectLoading: false, // 远程搜索loading状态
                selectSearchResList: [{label: 'aew', value: 'aew'},
                    {label: 'werd', value: 'werd'},
                    {label: 'oop', value: 'oop'},
                    {label: 'qwe', value: 'qwe'},
                    {label: 'per', value: 'per'},
                    {label: 'uzz', value: 'uzz'},
                    {label: 'mnv', value: 'mnv'},
                    {label: 'mxd', value: 'mxd'}], // 远程搜索返回的结果数据

                depData: [], // 左侧部门数据
                roleData: [{ // 左侧角色数据
                    label: '我是人',
                    value: 'aaa'
                }, {
                    label: '我是w',
                    value: 'bbb'
                }],
                depCheckList: [], // 左侧筛选条件部门选中的数据
                roleCheckList: [], // 左侧筛选条件角色选中的数据
                waitChooseList: [], // 右侧待选数据
                waitCheckedList: [] // 右侧选中的数据
            }
        },
        mounted() {
            // 获取左侧树部门
            Api_fetchMenusTree().then(res => {
                this.depData = res;
            })
        },
        methods: {
            // 部门树节点选中事件
            checkChange(node) {
                const currKey = node.id;
                this.$refs.depTree.setCheckedKeys([currKey]);
                this.waitChooseList = [{
                    label: '人有有',
                    value: '11'
                }, {
                    label: '有地要',
                    value: '22'
                }]
            },
            // 角色列表选中切换事件
            roleChange(v) {
                this.roleCheckList = [v]
            },
            // 更新选中人员数据
            updateSelected(newDataList) {
                this.waitCheckedList = newDataList;
                this.selectDefaultData = [...newDataList]
            },
            // 右侧待选人员选中事件
            addWaitChecked(row) {
                const {value} = row;
                let flag = false;
                let index = 0;
                this.waitCheckedList.forEach((item, i) => {
                    if (item.value === value) {
                        flag = true;
                        index = i;
                    }
                });
                if (flag) {
                    this.waitCheckedList.splice(index, 1)
                } else {
                    this.waitCheckedList.push(row)
                }
            },
            // 右侧已选择人员删除事件
            handleDel(value) {
                this.waitCheckedList = this.waitCheckedList.filter((item) => {
                    return item.value !== value
                });
            },
            // 根据选中的待选人员显示对应的选中状态
            filterWaitChoose(value) {
                let flag = false;
                this.waitCheckedList.forEach((item) => {
                    if (item.value === value) {
                        flag = true;
                    }
                });
                return flag;
            },
            // 搜索数据改变时
            selectChange(row) {
                for (let i = 0; i < this.selectSearchResList.length; i++) {
                    if (row.label === this.selectSearchResList[i].label) {
                        this.addWaitChecked(this.selectSearchResList[i]);
                        break;
                    }
                }
            },
            // 返回当前已选择的人员
            getSelectData() {
                return this.waitCheckedList
            },
            // 重置所有数据状态
            reset() {
                this.waitChooseList = [];
                this.waitCheckedList = [];
                this.$refs.depTree.setCheckedKeys([]);
                this.$refs.inputSearch.clearInputVal()
            }
        }
    }
</script>

<style rel="stylesheet/scss" scoped lang="scss">
    @import '../../styles/element-variables.scss';

    .select-left {
        overflow: hidden;
        padding: 15px 0;

        /deep/ .el-checkbox {
            position: absolute;
            right: 0;
        }
    }

    /*左侧角色列表*/
    ul.roleList {
        padding-left: 0;

        li {
            cursor: pointer;
            overflow: hidden;
            font-size: 14px;
            padding: 5px 8px;

            &:hover {
                background-color: #f5f7fa;
            }

            .el-checkbox {
                margin-right: 8px;
            }

            /deep/ .el-checkbox__label {
                display: none;
            }
        }
    }

    /*标题左边线*/
    .title-border-left {
        border-left: 3px solid $--color-primary;
        padding: 2px 10px;
        margin: 4px 0 10px 0;
    }

    .people-wrap {
        height: 200px;
        border: 1px solid #EBEEF5;

        /deep/ .el-scrollbar__wrap {
            max-height: 200px;
        }
    }

    /*待选人员*/
    ul.wait-choose, ul.be-choose {
        list-style: none;
        padding: 10px;
        margin: 0;

        li + li {
            border-top: 1px solid #EBEEF5;
        }

        li {
            overflow: hidden;
            padding: 5px 8px;
            cursor: pointer;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;

            &:hover {
                background-color: #f5f7fa;
            }

            a {
                display: inline-block;
                float: left;
                max-width: calc(100% - 20px);
            }

            .status-label {
                float: right;

                i {
                    cursor: pointer;
                }

                i.success {
                    color: #67c23a;
                }
            }
        }
    }
</style>
