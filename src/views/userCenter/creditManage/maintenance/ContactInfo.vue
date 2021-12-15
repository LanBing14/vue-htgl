<template>
<div class="fxb-edit-table">
    <!--  联系人姓名、部门、职务、手机号码、办公电话、电子邮箱、操作(编辑、删除)  -->
    <el-table :data="conInfoTableData" :expand-row-keys="expands" @cell-mouse-enter="handelEnter" row-key="id" stripe>
        <el-table-column label="联系人姓名" prop="linkman"></el-table-column>
        <el-table-column label="部门" prop="deptName"></el-table-column>
        <el-table-column label="职务" prop="job"></el-table-column>
        <el-table-column label="手机号码" prop="phoneNo"></el-table-column>
        <el-table-column label="办公电话" prop="officeTelephone"></el-table-column>
        <el-table-column label="电子邮箱" prop="email"></el-table-column>
        <el-table-column type="expand" width="1">
            <template slot-scope="props">
                <div class="row-tool-panel">
                     <span @click="conInfoEdit(props.row)">
                        <svg-icon icon-class="edit" /> 编辑</span>
                    <span @click="conInfoDelete(props.row)">
                        <svg-icon icon-class="delete" /> 删除</span>
                </div>
            </template>
        </el-table-column>
    </el-table>

    <br>
    <el-pagination :current-page.sync="conInfoPostData.pageNo" :page-size="conInfoPostData.pageSize" :total="conInfoTotalRecords" @current-change="conInfoChangeCurrentPage" class="fxb-page" v-show="conInfoTotalRecords>0" />

    <el-collapse-transition>
        <div class="table-window-panel" v-show="show">
            <el-form :label-position="'top'" :model="conInfoForm" :rules="rules" ref="conInfoForm">
                <el-row :gutter="60">
                    <el-col :span="8">
                        <el-form-item :rules="[
                            { required: true, message: '请输入联系人姓名', trigger: 'blur' },
                            { max:10, message: '长度不超过10个字', trigger: 'change' }
                        ]" label="联系人姓名" prop="linkman">
                            <el-input placeholder="请输入联系人姓名" v-model="conInfoForm.linkman"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :rules="[
                            { required: true, message: '请输入部门', trigger: 'blur' },
                            { max:10, message: '长度不超过10个字', trigger: 'change' }
                        ]" label="部门" prop="deptName">
                            <el-input placeholder="请输入部门" v-model="conInfoForm.deptName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :rules="[
                            { required: true, message: '请输入职务', trigger: 'blur' },
                            { max:10, message: '长度不超过10个字', trigger: 'change' }
                        ]" label="职务" prop="job">
                            <el-input placeholder="请输入职务" v-model="conInfoForm.job"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :rules="[
                            { pattern: /^1[3456789]\d{9}$/,message: '请输入正确的手机号'}
                        ]" label="手机号码" prop="phoneNo">
                            <el-input placeholder="请输入手机号码" v-model="conInfoForm.phoneNo"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :rules="[
                            { pattern: /^((0\d{2,3}-\d{7,8}))$/,message: '请输入正确的办公电话'}
                        ]" label="办公电话" prop="officeTelephone">
                            <el-input placeholder="请输入办公电话" v-model="conInfoForm.officeTelephone"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :rules="[
                            { pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/, message: '请输入正确的电子邮箱', trigger: ['blur', 'change']}
                        ]" label="电子邮箱" prop="email">
                            <el-input placeholder="请输入电子邮箱" v-model="conInfoForm.email"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item :rules="[
                            { max:200, message: '长度不超过200个字', trigger: 'change' }
                        ]" label="备注" prop="remark">
                            <el-input :rows="5" placeholder="请输入备注" type="textarea" v-model="conInfoForm.remark"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" align="center">
                        <el-form-item>
                            <el-button @click="submitForm('conInfoForm')" style="width:100px;" type="primary" v-if="!editModel">保存</el-button>
                            <el-button @click="submitEditForm('conInfoForm')" style="width:100px;" type="primary" v-if="editModel">保存</el-button>
                            <el-button @click="resetForm('conInfoForm')" style="width:100px;">取消</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </el-collapse-transition>

    <el-row :gutter="10" style="margin-top:20px;">
        <el-col :span="24">
            <el-button @click="addItem" icon="el-icon-plus" size="mini" style="width:100%;" v-if="!show">新增联络信息</el-button>
        </el-col>
    </el-row>
</div>
</template>

<script>
    import {
        Api_AddContactInfo,
        Api_DeleteContactInfo,
        Api_EditContactInfo,
        Api_GetContactInfoByPage
    } from "@/api/userCenter/creditManage";

    export default {
    name: "ContactInfo",
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
            editModel: false,
            conInfoLoading: false,
            conInfoTableData: [],
            conInfoPostData: {
                attentionId: '',
                pageNo: 1,
                pageSize: 5
            },
            conInfoTotalRecords: 0,
            conInfoForm: {
                id: "", // 主键id
                attentionId: "", // 合同主键id
                linkman: "", // 联系人姓名
                deptName: "", // 部门.
                job: "", // 职务
                phoneNo: "", // 联系号码
                officeTelephone: "", // 办公电话
                email: "", // 电子邮箱
                remark: "" // 备注
            }
        };
    },
    mounted() {
        if (this.$route.params.id) {
            this.conInfoPostData.attentionId = this.$route.params.id;
            this.conInfoGetlist();
        } else {
            this.$message.warning("获取联络信息失败");
        }
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
        conInfoGetlist(option) {
            this.conInfoLoading = true;
            this.conInfoForm.attentionId = this.attentionid;
            Api_GetContactInfoByPage(Object.assign(this.conInfoPostData, option)).then(res => {
                this.conInfoLoading = false;
                if (res.stateCode === "1") {
                    const data = res.data;
                    this.conInfoTableData = data.list;
                    this.conInfoTotalRecords = data.totalRecords;
                } else {
                    // this.$message.error('数据加载失败');
                }
            });
        },
        conInfoChangeCurrentPage() {
            this.conInfoGetlist()
        },
        conInfoDelete(row) {
            this.$confirm('确定删除该联络信息数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'

            }).then(() => {
                Api_DeleteContactInfo({
                    id: row.id
                }).then(res => {
                    if (res.stateCode === "1") {
                        this.$message.success('删除成功');
                        this.conInfoGetlist({
                            pageNo: 1,
                            pageSize: 5
                        })
                    } else {
                        this.$message.error('删除失败');
                    }
                })
            })
        },
        conInfoEdit(row) {
            this.tableLock = true;
            this.expands = [];
            this.show = !this.show;
            this.editModel = true;
            this.conInfoForm = row;
        },
        addItem() {
            this.tableLock = true;
            this.expands = [];
            this.editModel = false;
            this.$refs['conInfoForm'].resetFields();
            this.show = !this.show;
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.conInfoForm.attentionId = this.$route.params.id;
                    Api_AddContactInfo(this.conInfoForm).then(res => {
                        if (res.stateCode === "1") {
                            this.$message.success('添加成功');
                            this.conInfoGetlist({
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
        submitEditForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    Api_EditContactInfo(this.conInfoForm).then(res => {
                        if (res.stateCode === "1") {
                            this.$message.success('编辑成功');
                            this.conInfoGetlist({
                                pageNo: 1,
                                pageSize: 5
                            })
                        } else {
                            this.$message.error('编辑失败');
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
            this.conInfoForm.id = "";
            this.conInfoGetlist()
        }
    }
};
</script>
