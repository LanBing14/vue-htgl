<template slot>
    <Dialog
        ref="drawer"
        :visible.sync="visible"
        :onOk="handleSure"
        title="添加审批人或职务"
        width="500px"
        @close="onClose"
    >
        <el-tabs v-model="activeName">
            <el-tab-pane label="选择审批人" name="1">
                <el-form ref="form" :model="listQuery" @submit.native.prevent>
                    <el-row>
                        <el-col :span="18">
                            <el-form-item prop="name">
                                <el-input v-model="listQuery.name"
                                          placeholder="请输入用户名或团队成员姓名"
                                          @keyup.enter.native="search"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item prop="name">
                                <el-button type="primary" @click="search">查询</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-table ref="table1" v-loading="loading" :data="usersOptions" stripe
                          @selection-change="handleSelectionChange1">
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column label="用户名" prop="username"></el-table-column>
                    <el-table-column label="团队成员姓名/部门">
                        <template slot-scope="scope">
                            {{ scope.row.name }}/{{ scope.row.departmentName }}
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="选择职务" name="2">
                <el-table ref="table2" :data="rolesOptions" stripe @selection-change="handleSelectionChange2">
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column label="职务" prop="label"></el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </Dialog>
</template>

<script>
    import {merge, trim} from 'lodash'
    import {Api_UsersConditionList} from '@/api/baseApi';

    export default {
        name: "CreateUpdate",
        props: {
            selectData: {
                type: Object,
                default() {
                    return {};
                }
            },
            rolesOptions: {
                type: Array,
                default: () => []
            },
            selectedRoles: {
                type: Array,
                default: () => []
            },
            selectedUsers: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                visible: false,
                activeName: '1',
                tableSelected1: [],
                tableSelected2: [],
                listQuery: {
                    name: ''
                },
                usersOptions: [],
                loading: false,
                saasCode: this.$store.getters.saasCode
            };
        },
        mounted(){
            this.search()
        },
        methods: {
            // 打开模态框
            openModel() {
                this.visible = true
                this.$nextTick(() => {
                    this.tableSelected1 = this.selectedUsers
                    this.tableSelected2 = this.selectedRoles
                    this.selectedUsers.forEach(u => {
                        const row = this.usersOptions.find(i => i.id === u)
                        if (row) {
                            this.$refs.table1.toggleRowSelection(row, true)
                        }
                    })
                    this.selectedRoles.forEach(u => {
                        const row = this.rolesOptions.find(i => i.value === u)
                  
                        if (row) {
                            this.$refs.table2.toggleRowSelection(row, true)
                        }
                    })
                })
            },
            // 点击确认
            handleSure() {
                
                this.$emit('ok', merge([], this.tableSelected1), merge([], this.tableSelected2))
                this.visible = false
            },
            handleSelectionChange1(arr) {
                this.tableSelected1 = arr.map(item => item.id)
            },
            handleSelectionChange2(arr) {
                this.tableSelected2 = arr.map(item => item.value)
            },
            search() {
                this.loading = true
                Api_UsersConditionList({
                    saasCode: this.saasCode,
                    name: trim(this.listQuery.name)
                }).then(res => {
                    this.loading = false
                    this.usersOptions = res
                }).catch(e => {
                    this.loading = false
                })
            },
            onClose() {
                this.tableSelected1 = [];
                this.tableSelected2 = [];
                this.$refs.table1.clearSelection()
                this.$refs.table2.clearSelection()
            }
        }
    };
</script>

<style scoped>
</style>
