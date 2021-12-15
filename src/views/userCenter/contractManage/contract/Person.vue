<template>
<div class="fxb-edit-table" v-loading="tableLoading">
    <!-- 联系人姓名(*)、部门(*)、职务、手机号码(*)、办公电话、电子邮箱 -->
    <el-table class="fxb-table" :data="tableData" :expand-row-keys="expands" @cell-mouse-enter="handelEnter" row-key="ID" stripe>
        <el-table-column label="联系人姓名" prop="LINKMAN"></el-table-column>
        <el-table-column label="部门" prop="DEPT_NAME"></el-table-column>
        <el-table-column label="职务" prop="JOB"></el-table-column>
        <el-table-column label="手机号码" prop="PHONE_NO"></el-table-column>
        <el-table-column label="办公电话" prop="OFFICE_TELEPHONE"></el-table-column>
        <el-table-column label="电子邮箱" prop="EMAIL"></el-table-column>

        <el-table-column type="expand" width="1">
            <template slot-scope="props">
                <div class="row-tool-panel">
                    <span @click="editPerson(props.row)">
                        <svg-icon icon-class="edit" /> 编辑</span>
                    <span @click="deletePerson(props.row)">
                        <svg-icon icon-class="delete" /> 删除</span>
                </div>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination v-show="totalRecords > 0" :current-page.sync="postData.pageNo" :page-size="postData.pageSize" :total="totalRecords" @current-change="changeCurrentPage" class="fxb-page"/>

    <el-collapse-transition>
        <div class="table-window-panel" v-show="show">
            <el-form :label-position="'top'" :model="personForm" :rules="rules" ref="personForm">
                <el-row :gutter="60">
                    <el-col :span="8">
                        <el-form-item :rules="[
                            { required: true, message: '请输入联系人姓名', trigger: 'blur' },
                            { max:10, message: '长度不超过10个字', trigger: 'change' }
                        ]" label="联系人姓名" prop="linkman">
                            <el-input placeholder="请输入联系人姓名" v-model="personForm.linkman"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :rules="[
                            { required: true, message: '请输入部门', trigger: 'blur' },
                            { max:10, message: '长度不超过10个字', trigger: 'change' }
                        ]" label="部门" prop="deptName">
                            <el-input placeholder="请输入部门" v-model="personForm.deptName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :rules="[
                            { max:10, message: '长度不超过10个字', trigger: 'change' }
                        ]" label="职务" prop="job">
                            <el-input placeholder="请输入职务" v-model="personForm.job"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :rules="[
                            { required: true, message: '请输入手机号码', trigger: 'blur' },
                            { pattern: /^1[3456789]\d{9}$/,message: '请输入正确的手机号'}
                        ]" label="手机号码" prop="phoneNo">
                            <el-input placeholder="请输入手机号码" v-model="personForm.phoneNo"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :rules="[
                            { pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/,message: '请输入正确的办公电话'}
                        ]" label="办公电话" prop="officeTelephone">
                            <el-input placeholder="请输入办公电话" v-model="personForm.officeTelephone"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :rules="[
                            { pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/, message: '请输入正确的电子邮箱', trigger: ['blur', 'change']}
                        ]" label="电子邮箱" prop="email">
                            <el-input placeholder="请输入电子邮箱" v-model="personForm.email"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" align="center" class="window-panel-foot">
                        <el-form-item>
                            <el-button @click="submitForm('personForm');" type="primary" :loading="submitLoading">保存</el-button>
                            <el-button @click="resetForm('personForm');" >取消</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </el-collapse-transition>

    <el-row :gutter="10" class="tab-bottom-abb" v-if="!infomodel">
        <el-col :span="24">
            <el-button :disabled="!conStatus" @click="addPerson" icon="el-icon-plus" size="mini" style="width:100%;" v-if="!show">新增联系人</el-button>
        </el-col>
    </el-row>
</div>
</template>

<script>
    import {
        Api_LinkmanDelete,
        Api_LinkmanGetDetail,
        Api_LinkmanGetList,
        Api_LinkmanSave
    } from "@/api/userCenter/contractManage";

    export default {
    name: "ContractPerson",
    props: {
        contractid: String,
        // 查看详情时不显示编辑
        infomodel: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            // 当前合同状态
            conStatus: true,
            // 查看详情时不显示编辑
            infoModel: false,
            // 表格状态 新增，编辑时表格不能进行删除编辑
            tableLock: false,
            show: false,
            expands: [],
            rules: {},
            personForm: {
                id: "", // 对方联系人 主键id （传主键 就是更新；不传就是新增）
                contractId: "", // 合同主键id
                linkman: "", // 联系人姓名.
                deptName: "", // 部门.
                job: "", // 职务.
                phoneNo: "", // 联系号码.
                officeTelephone: "", // 办公电话.
                email: "" // 电子邮箱.
            },
            postData: {
                contractId: "", // 合同主键id
                pageNo: 1, // 当前页
                pageSize: 5 // 分页大小
            },
            tableLoading: false,
            tableData: [],
            totalRecords: 0,
            submitLoading: false
        };
    },
    watch: {
        contractid(val) {
            if (val) {
                this.conStatus = true;
                this.personForm.contractId = val;
                this.postData.contractId = val;
            }
        }
    },
    mounted() {
        if (this.$route.query.id !== undefined) {
            this.conStatus = true;
            this.personForm.contractId = this.$route.query.id;
            this.postData.contractId = this.$route.query.id;
            this.getTableList();
        } else {
            this.conStatus = false;
        }
    },
    methods: {
        handelEnter(row, column, cell, event) {
            const cindex = this.expands.indexOf(row.ID);
            if (!this.tableLock) {
                if (cindex < 0) {
                    this.expands.shift();
                    this.expands.push(row.ID);
                }
            }
        },
        getTableList(option) {
            this.show = false;
            this.tableLock = this.infomodel;
            this.tableLoading = true;
            Api_LinkmanGetList(Object.assign(this.postData, option)).then(res => {
                this.tableLoading = false;
                if (res.stateCode === "1") {
                    const data = res.data;
                    this.tableData = data.list;
                    this.totalRecords = data.totalRecords;
                } else {
                    this.$message.error('数据加载失败');
                }
            });
        },
        changeCurrentPage() {
            this.getTableList();
        },
        addPerson() {
            this.tableLock = true;
            this.expands = [];
            this.personForm.id = "";
            this.$refs['personForm'].resetFields();
            this.show = !this.show;
        },
        editPerson(row) {
            this.tableLock = true;
            this.expands = [];
            this.show = !this.show;

            Api_LinkmanGetDetail({
                id: row.ID
            }).then(res => {
                if (res.stateCode === "1") {
                    this.personForm = res.data;
                } else {
                    this.$message.warning("获取联系人失败");
                }
            })
        },
        deletePerson(row) {
            this.$confirm('确定删除该联系人?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'

            }).then(() => {
                // 请求
                Api_LinkmanDelete({
                    id: row.ID
                }).then(res => {
                    if (res.stateCode === "1") {
                        this.$message.success("删除联系人成功");
                        this.getTableList({
                            pageNo: 1,
                            pageSize: 5
                        })
                    } else {
                        this.$message.warning("删除联系人失败");
                    }
                })
            })
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.submitLoading = true;
                    Api_LinkmanSave(this.personForm).then(res => {
                        this.submitLoading = false;
                        if (res.stateCode === "1") {
                            if (this.personForm.id === "") {
                                this.$message.success("新增联系人成功");
                            } else {
                                this.$message.success("编辑联系人成功");
                            }
                            this.getTableList({
                                pageNo: 1,
                                pageSize: 5
                            })
                        } else {
                            if (this.personForm.id === "") {
                                this.$message.warning("新联系人失败");
                            } else {
                                this.$message.warning("编辑联系人失败");
                            }
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
