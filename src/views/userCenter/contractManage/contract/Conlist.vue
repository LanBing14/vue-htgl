<template>
<div class="fxb-edit-table" v-loading="tableLoading">
    <!-- 名称(*)、类型、品牌/型号、单位、数量(*)、单价(元)、状态(*)、备注 -->
    <el-table class="fxb-table" :data="tableData" :expand-row-keys="expands" @cell-mouse-enter="handelEnter" row-key="ID" stripe>
        <el-table-column label="名称" prop="NAME"></el-table-column>
        <el-table-column label="类型">
            <template slot-scope="scope">
                <!-- 0:产品 1:服务 2:其他 -->
                {{ scope.row.TYPE === '0' ? '产品' : scope.row.TYPE === '1' ? '服务' : '其他' }}
            </template>
        </el-table-column>
        <el-table-column label="品牌/型号" prop="BRAND"></el-table-column>
        <el-table-column label="单位" prop="UNIT"></el-table-column>
        <el-table-column label="数量" prop="QUANTITY"></el-table-column>
        <el-table-column label="单价(元)" prop="UNIT_PRICE"></el-table-column>
        <el-table-column label="状态">
            <template slot-scope="scope">
                <!-- 0:未完成 1:已完成. -->
                {{ scope.row.COMPLETION_STATUS === '0' ? '未完成' : '已完成' }}
            </template>
        </el-table-column>
        <el-table-column label="备注">
            <template slot-scope="scope">
                {{ (scope.row.REMARK.length > 10 ) ? (scope.row.REMARK.substring(0,10) + '...') : scope.row.REMARK }}
            </template>
        </el-table-column>

        <el-table-column type="expand" width="1">
            <template slot-scope="props">
                <div class="row-tool-panel">
                    <span @click="editList(props.row)">
                        <svg-icon icon-class="edit" /> 编辑</span>
                    <span @click="deleteList(props.row)">
                        <svg-icon icon-class="delete" /> 删除</span>
                </div>
            </template>
        </el-table-column>
    </el-table>

    <el-pagination :current-page.sync="postData.pageNo" :page-size="postData.pageSize" :total="totalRecords" @current-change="changeCurrentPage" class="fxb-page" v-show="totalRecords>0" />

    <el-collapse-transition>
        <div class="table-window-panel" v-show="show">
            <el-form :label-position="'top'" :model="listForm" :rules="rules" ref="listForm">
                <el-row :gutter="60">
                    <el-col :span="8">
                        <el-form-item :rules="[
                            { required: true, message: '请输入产品/服务名称', trigger: 'blur' },
                            { max:20, message: '长度不超过20个字', trigger: 'change' }
                        ]" label="名称" prop="name">
                            <el-input placeholder="请输入产品/服务名称" v-model="listForm.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="类型" prop="type">
                            <el-radio-group v-model="listForm.type">
                                <el-radio label="0">产品</el-radio>
                                <el-radio label="1">服务</el-radio>
                                <el-radio label="2">其他</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :rules="[
                            { max:20, message: '长度不超过20个字', trigger: 'change' }
                        ]" label="品牌/型号" prop="brand">
                            <el-input placeholder="请输入品牌/型号" v-model="listForm.brand"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="8">
                        <el-form-item :rules="[
                            { max:10, message: '长度不超过10个字', trigger: 'change' }
                        ]" label="单位" prop="unit">
                            <el-input placeholder="请输入单位" v-model="listForm.unit"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :rules="[
                            { max:10, message: '长度不超过10个字', trigger: 'change' },
                            { pattern: /^(0|\+?[1-9][0-9]*)$/, message: '数量只能为正整数' }
                        ]" label="数量" prop="quantity">
                            <el-input placeholder="请输入数量" v-model="listForm.quantity"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :rules="[
                            { max:10, message: '长度不超过10个字', trigger: 'change' },
                            { type:'number', message: '单价只能为数字', trigger: 'change',
                                transform (value) {
                                    return value * 1
                                }
                            }
                        ]" label="单价(元)" prop="unitPrice">
                            <el-input v-model="listForm.unitPrice"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="状态" prop="completionStatus">
                            <el-radio-group v-model="listForm.completionStatus">
                                <el-radio label="0">未完成</el-radio>
                                <el-radio label="1">已完成</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="24">
                        <el-form-item :rules="[
                            { max:200, message: '长度不超过200个字', trigger: 'change' }
                        ]" label="备注" prop="remark">
                            <el-input :rows="5" placeholder="请输入备注" type="textarea" v-model="listForm.remark"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" align="center" class="window-panel-foot">
                        <el-form-item>
                            <el-button @click="submitForm('listForm')" type="primary" :loading="submitLoading">保存</el-button>
                            <el-button @click="resetForm('listForm')">取消</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </el-collapse-transition>

    <el-row :gutter="10" class="tab-bottom-abb" v-if="!infomodel">
        <el-col :span="24">
            <el-button :disabled="!conStatus" @click="addList" icon="el-icon-plus" size="mini" style="width:100%;" v-if="!show">新增合同清单</el-button>
        </el-col>
    </el-row>
</div>
</template>

<script>
    import {
        Api_ListDelete,
        Api_ListGetList,
        Api_ListnGetDetail,
        Api_ListSave
    } from "@/api/userCenter/contractManage";

    export default {
    name: "ContractList",
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
            listForm: {
                id: "", // 合同清单 主键id （传主键 就是更新；不传就是新增）
                contractId: "", // 合同主键id
                name: "", // 名称 产品/服务名称.
                type: "0", // 类型 0:产品 1:服务 2:其他
                brand: "", // 品牌/型号
                unit: "", // 单位.
                quantity: "", // 数量.
                unitPrice: "", // 单价.
                completionStatus: "0", // 状态 0:未完成 1:已完成.
                remark: "" // 备注.
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
                this.listForm.contractId = val;
                this.postData.contractId = val;
            }
        }
    },
    mounted() {
        if (this.$route.query.id !== undefined) {
            this.conStatus = true;
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
            if (this.$route.query.id) {
                this.postData.contractId = this.$route.query.id;
            }
            Api_ListGetList(Object.assign(this.postData, option)).then(res => {
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
        addList() {
            this.tableLock = true;
            this.expands = [];
            this.listForm.id = "";
            this.$refs['listForm'].resetFields();
            this.show = !this.show;
        },
        editList(row) {
            this.tableLock = true;
            this.expands = [];
            this.show = !this.show;

            Api_ListnGetDetail({
                id: row.ID
            }).then(res => {
                if (res.stateCode === "1") {
                    this.listForm = res.data;
                    this.listForm.quantity = res.data.quantity + "";
                    this.listForm.unitPrice = res.data.unitPrice + "";
                } else {
                    this.$message.warning("获取合同清单失败");
                }
            })
        },
        deleteList(row) {
            this.$confirm('确定删除该清单?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                Api_ListDelete({
                    id: row.ID
                }).then(res => {
                    if (res.stateCode === "1") {
                        this.$message.success("删除清单成功");
                        this.getTableList({
                            pageNo: 1,
                            pageSize: 5
                        })
                    } else {
                        this.$message.warning("删除清单失败");
                    }
                })
            })
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if (this.$route.query.id) {
                        this.listForm.contractId = this.$route.query.id;
                    }
                    this.submitLoading = true;
                    Api_ListSave(this.listForm).then(res => {
                        this.submitLoading = false;
                        if (res.stateCode === "1") {
                            if (this.listForm.id === "") {
                                this.$message.success("新增清单成功");
                            } else {
                                this.$message.success("编辑清单成功");
                            }
                            this.getTableList({
                                pageNo: 1,
                                pageSize: 5
                            })
                        } else {
                            if (this.listForm.id === "") {
                                this.$message.warning("新增清单失败");
                            } else {
                                this.$message.warning("编辑清单失败");
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
