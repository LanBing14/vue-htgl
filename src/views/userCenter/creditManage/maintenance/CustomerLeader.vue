import router from '@/router';
<template>
<div class="fxb-edit-table">
    <!--  姓名、手机号码、所属部门  -->
    <el-table :data="cusLeadTableData" :expand-row-keys="expands" @cell-mouse-enter="handelEnter" row-key="id" stripe>
        <el-table-column label="姓名" prop="realName"></el-table-column>
        <el-table-column label="手机号码" prop="phoneNo"></el-table-column>
        <el-table-column label="所属部门" prop="deptName"></el-table-column>
        <el-table-column type="expand" width="1">
            <template slot-scope="props">
                <div class="row-tool-panel">
                    <span @click="cusLeadDelete(props.row)">
                        <svg-icon icon-class="delete" /> 删除</span>
                </div>
            </template>
        </el-table-column>
    </el-table>

    <br>
    <el-pagination :current-page.sync="cusLeadPostData.pageNo" :page-size="cusLeadPostData.pageSize" :total="cusLeadTotalRecords" @current-change="cusLeadChangeCurrentPage" class="fxb-page" v-show="cusLeadTotalRecords>0" />

    <el-collapse-transition>
        <div class="table-window-panel" v-show="show">
            <el-form :label-position="'top'" :model="cusLeadForm" :rules="rules" ref="cusLeadForm">
                <el-row :gutter="60">
                    <el-col :span="8">
                        <el-form-item :rules="[
                            { required: true, message: '请选择所属部门', trigger: 'change' },
                        ]" label="所属部门" prop="deptName">
                            <el-popover placement="bottom" ref="popover" trigger="click" v-model="deparmentProps" visible-arrow="false" width="250">
                                <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                                <el-button slot="reference" style="width:100%">{{ cusLeadForm.deptName ? cusLeadForm.deptName : '请选择所属部门' }} </el-button>
                            </el-popover>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :rules="[
                            { required: true, message: '请选择企业成员', trigger: 'change' },
                        ]" label="姓名" prop="userId">
                            <el-select :disabled="!deparmentUsers||deparmentUsers.length===0" placeholder="请选择企业成员" style="width:100%;" v-model="cusLeadForm.userId">
                                <el-option :key="item.id" :label="item.realName" :value="item.id" @click.native="handleUserClick(item)" v-for="item in deparmentUsers">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="手机号码">
                            <el-input disabled v-model="cusLeadForm.userPhone"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" align="center">
                        <el-form-item>
                            <el-button @click="submitForm('cusLeadForm')" style="width:100px;" type="primary">保存</el-button>
                            <el-button @click="resetForm('cusLeadForm')" style="width:100px;">取消</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </el-collapse-transition>

    <el-row :gutter="10" style="margin-top:20px;">
        <el-col :span="24">
            <el-button @click="addItem" icon="el-icon-plus" size="mini" style="width:100%;" v-if="!show">新增客户负责人</el-button>
        </el-col>
    </el-row>
</div>
</template>

<script>
    import {
        Api_AddResponsiblePerson,
        Api_DeleteResponsiblePerson,
        Api_GetResponsiblePersonByPage
    } from "@/api/userCenter/creditManage";
    import {Api_GetUserByDeptId, Api_GetDepartListUser} from "@/api/userCenter/contractManage";

    export default {
    name: "CustomerLeader",
    props: {
        attentionid: String
        // 查看详情时不显示编辑
    },
    data() {
        return {
            treeData: [],
            defaultProps: {
                children: 'DEPART_CHILD_LIST',
                label: 'DEPT_NAME'
            },
            deparmentProps: false,
            deparmentUsers: [],
            // 表格状态 新增，编辑时表格不能进行删除编辑
            tableLock: false,
            show: false,
            expands: [],
            rules: {},
            cusLeadLoading: false,
            cusLeadTableData: [],
            cusLeadPostData: {
                attentionId: '',
                pageNo: 1,
                pageSize: 5
            },
            cusLeadTotalRecords: 0,
            cusLeadForm: {
                attentionId: "", // 合同主键id
                userName: "",
                userId: "", // 名称.
                userPhone: "",
                deptId: "", // 事项类型 0:发货 1:收货 2:其他.
                deptName: ""
            }
        };
    },
    mounted() {
        if (this.$route.params.id) {
            this.cusLeadPostData.attentionId = this.$route.params.id;
            this.cusLeadForm.attentionId = this.$route.params.id;
            this.cusLeadGetlist();
        } else {
            this.$message.warning("获取客户负责人失败");
        }

        // 获取部门
        Api_GetDepartListUser().then(res => {
            if (res.stateCode === "1") {
                this.treeData = res.data;
            } else {
                this.$message.warning("获取部门失败");
            }
        })
    },
    methods: {
        handelEnter(row, column, cell, event) {
            const cindex = this.expands.indexOf(row.id);
            if (!this.tableLock) {
                if (cindex < 0) {
                    this.expands.shift();
                    this.expands.push(row.id);
                }
            }
        },
        // 部门选择
        handleNodeClick(item) {
            console.log(item)
            this.cusLeadForm.deptName = item.DEPT_NAME;
            this.cusLeadForm.deptId = item.ID;
            this.cusLeadForm.userId = "";
            // this.deparmentUsers = item.userList;
            Api_GetUserByDeptId({
                deptId: item.ID
            }).then(res => {
                if (res.stateCode === "1") {
                    this.userName = "";
                    this.deparmentUsers = res.data;
                    this.deparmentProps = false;
                } else {
                    this.$message.warning("获取部门人员失败");
                }
            });
        },
        // 人员选择
        handleUserClick(item) {
            this.cusLeadForm.userPhone = item.phoneNo;
        },
        cusLeadGetlist(option) {
            this.cusLeadLoading = true;
            Api_GetResponsiblePersonByPage(Object.assign(this.cusLeadPostData, option)).then(res => {
                this.cusLeadLoading = false;
                if (res.stateCode === "1") {
                    const data = res.data;
                    this.cusLeadTableData = data.list;
                    this.cusLeadTotalRecords = data.totalRecords;
                } else {
                    // this.$message.error('数据加载失败');
                }
            });
        },
        cusLeadChangeCurrentPage() {
            this.cusLeadGetlist()
        },
        cusLeadDelete(row) {
            this.$confirm('确定删除该财务数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'

            }).then(() => {
                Api_DeleteResponsiblePerson({
                    id: row.id
                }).then(res => {
                    if (res.stateCode === "1") {
                        this.$message.success('删除成功');
                        this.cusLeadGetlist({
                            pageNo: 1,
                            pageSize: 5
                        })
                    } else {
                        this.$message.error('删除失败');
                    }
                })
            })
        },
        addItem() {
            this.tableLock = true;
            this.expands = [];
            this.$refs['cusLeadForm'].resetFields();
            this.show = !this.show;
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    Api_AddResponsiblePerson(this.cusLeadForm).then(res => {
                        if (res.stateCode === "1") {
                            this.$message.success('添加成功');
                            this.cusLeadGetlist({
                                pageNo: 1,
                                pageSize: 5
                            })
                        } else {
                            this.$message.error('添加失败');
                        }
                    });
                    this.show = !this.show;
                    this.tableLock = false;
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.show = false;
            this.tableLock = false;
            this.$refs[formName].resetFields();
        }
    }
};
</script>
