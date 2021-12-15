<template>
<div class="fxb-edit-table">
    <!--  开户银行、银行账户、电话号码、单位地址、操作(编辑) -->
    <el-table :data="bankAccTableData" :expand-row-keys="expands" @cell-mouse-enter="handelEnter" row-key="id" stripe>
        <el-table-column label="开户银行" prop="depositBank"></el-table-column>
        <el-table-column label="银行账户" prop="bankAccount"></el-table-column>
        <el-table-column label="电话号码" prop="telephone"></el-table-column>
        <el-table-column label="单位地址" prop="companyAddress"></el-table-column>
        <el-table-column type="expand" width="1">
            <template slot-scope="props">
                <div class="row-tool-panel">
                     <span @click="bankAccEdit(props.row)">
                        <svg-icon icon-class="edit" /> 编辑</span>
                </div>
            </template>
        </el-table-column>
    </el-table>

    <el-pagination :current-page.sync="bankAccPostData.pageNo" :page-size="bankAccPostData.pageSize" :total="bankAccTotalRecords" @current-change="bankAccChangeCurrentPage" class="fxb-page" v-show="bankAccTotalRecords>0" />

    <el-collapse-transition>
        <div class="table-window-panel" v-show="show">
            <el-form :label-position="'top'" :model="bankAccForm" :rules="rules" ref="bankAccForm">
                <el-row :gutter="60">
                    <el-col :span="8">
                        <el-form-item :rules="[
                            { required: true, message: '请输入开户银行', trigger: 'blur' },
                            { max:30, message: '长度不超过30个字', trigger: 'change' }
                        ]" label="开户银行" prop="depositBank">
                            <el-input placeholder="请输入开户银行" v-model="bankAccForm.depositBank"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :rules="[
                            { required: true, message: '请输入银行账户', trigger: 'blur' },
                            { max:20, message: '长度不超过20个字', trigger: 'change' },
                            { type:'number', message: '银行账户只能为数字', trigger: 'change',
                                transform (value) {
                                    return value * 1
                                }
                            }
                        ]" label="银行账户" prop="bankAccount">
                            <el-input placeholder="请输入银行账户" v-model="bankAccForm.bankAccount"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :rules="[
                            { pattern: /^((0\d{2,3}-\d{7,8}))$/,message: '请输入正确的电话号码'}
                        ]" label="电话号码" prop="telephone">
                            <el-input placeholder="请输入电话号码" v-model="bankAccForm.telephone"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :rules="[
                            { max:50, message: '长度不超过50个字', trigger: 'change' }
                        ]" label="单位地址" prop="companyAddress">
                            <el-input placeholder="请输入单位地址" v-model="bankAccForm.companyAddress"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item :rules="[
                            { max:200, message: '长度不超过200个字', trigger: 'change' }
                        ]" label="备注" prop="remark">
                            <el-input :rows="5" placeholder="请输入备注" type="textarea" v-model="bankAccForm.remark"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" align="center">
                        <el-form-item>
                            <el-button @click="submitForm('bankAccForm')" style="width:100px;" type="primary" v-if="!editModel">保存</el-button>
                            <el-button @click="submitEditForm('bankAccForm')" style="width:100px;" type="primary" v-if="editModel">保存</el-button>
                            <el-button @click="resetForm('bankAccForm')" style="width:100px;">取消</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </el-collapse-transition>

    <el-row :gutter="10" style="margin-top:20px;">
        <el-col :span="24">
            <el-button @click="addItem" icon="el-icon-plus" size="mini" style="width:100%;" v-if="!show">新增银行账户</el-button>
        </el-col>
    </el-row>
</div>
</template>

<script>
    import {
        Api_AddBankAccount,
        Api_DeleteBankAccount,
        Api_EditBankAccount,
        Api_GetBankAccountByPage
    } from "@/api/userCenter/creditManage";

    export default {
    name: "BankAccount",
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
            bankAccLoading: false,
            bankAccTableData: [],
            bankAccPostData: {
                attentionId: '',
                pageNo: 1,
                pageSize: 5
            },
            bankAccTotalRecords: 0,
            bankAccForm: {
                id: "", // 主键id
                attentionId: "", // 合同主键id
                depositBank: "", // 开户银行
                bankAccount: "", // 银行账户.
                telephone: "", // 电话号码
                companyAddress: "", // 单位地址
                remark: "" // 备注
            }
        };
    },
    mounted() {
        if (this.$route.params.id) {
            this.bankAccPostData.attentionId = this.$route.params.id;
            this.bankAccGetlist();
        } else {
            this.$message.warning("获取银行账户信息失败");
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
        bankAccGetlist(option) {
            this.bankAccLoading = true;
            Api_GetBankAccountByPage(Object.assign(this.bankAccPostData, option)).then(res => {
                this.bankAccLoading = false;
                if (res.stateCode === "1") {
                    const data = res.data;
                    this.bankAccTableData = data.list;
                    this.bankAccTotalRecords = data.totalRecords;
                } else if (res.stateCode === "0") {
                    this.$message.error('数据加载失败');
                }
            });
        },
        bankAccChangeCurrentPage() {
            this.bankAccGetlist()
        },
        bankAccDelete(row) {
            this.$confirm('确定删除银行账户数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                Api_DeleteBankAccount({
                    id: row.ID
                }).then(res => {
                    if (res.stateCode === "1") {
                        this.$message.success('删除成功');
                        this.bankAccGetlist({
                            pageNo: 1,
                            pageSize: 5
                        })
                    } else {
                        this.$message.error('删除失败');
                    }
                })
            })
        },
        bankAccEdit(row) {
            this.tableLock = true;
            this.expands = [];
            this.show = !this.show;
            this.editModel = true;
            this.bankAccForm = row;
        },
        addItem() {
            this.tableLock = true;
            this.expands = [];
            this.editModel = false;
            this.$refs['bankAccForm'].resetFields();
            this.show = !this.show;
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.bankAccForm.attentionId = this.$route.params.id;
                    Api_AddBankAccount(this.bankAccForm).then(res => {
                        if (res.stateCode === "1") {
                            this.$message.success('添加成功');
                            this.bankAccGetlist({
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
                    this.bankAccForm.attentionId = this.$route.params.id;
                    Api_EditBankAccount(this.bankAccForm).then(res => {
                        if (res.stateCode === "1") {
                            this.$message.success('编辑成功');
                            this.bankAccGetlist({
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
            this.bankAccGetlist();
        }
    }
};
</script>
