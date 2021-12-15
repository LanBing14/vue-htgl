<template>
    <div class="fxb-edit-table" v-loading="tableLoading">
        <!-- 名称(*)、财务类型(回款、付款、开票、收票、其他) (*)、预计金额(*)、预计时间(*)、实际金额、执行时间、状态(未完成、已完成) (*) -->
        <el-table class="fxb-table" :data="tableData" :expand-row-keys="expands" @cell-mouse-enter="handelEnter"
                  row-key="ID" stripe>
            <el-table-column label="名称" prop="NAME"></el-table-column>
            <el-table-column label="财务类型">
                <template slot-scope="scope">
                    <!-- 0:回款 1:付款 2:开票 3:收票 4:其他. -->
                    {{ scope.row.FINANCIAL_TYPE === '0' ? '回款' :scope.row.FINANCIAL_TYPE === '1' ? '付款'
                    :scope.row.FINANCIAL_TYPE === '2' ? '开票' : scope.row.FINANCIAL_TYPE === '3' ? '收票' : '其他' }}
                </template>
            </el-table-column>
            <el-table-column label="预计金额" prop="ESTIMATED_AMOUNT"></el-table-column>
            <el-table-column label="预计时间">
                <template slot-scope="scope">
                    {{ scope.row.ESTIMATED_DATE | dateFormat('yyyy-MM-dd') }}
                </template>
            </el-table-column>
            <el-table-column label="实际金额" prop="ACTUAL_AMOUNT"></el-table-column>
            <el-table-column label="执行时间">
                <template slot-scope="scope">
                    {{ scope.row.EXECUTION_TIME | dateFormat('yyyy-MM-dd') }}
                </template>
            </el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <!-- 0:未完成 1:已完成. -->
                    {{ scope.row.COMPLETION_STATUS === '0' ? '未完成' : '已完成' }}
                </template>
            </el-table-column>
            <el-table-column label="备注">
                <template slot-scope="scope">
                    {{ (scope.row.REMARK.length > 10 ) ? (scope.row.REMARK.substring(0,10) + '...') : scope.row.REMARK
                    }}
                </template>
            </el-table-column>

            <el-table-column type="expand" width="1">
                <template slot-scope="props">
                    <div class="row-tool-panel">
                    <span @click="editFinancial(props.row)">
                        <svg-icon icon-class="edit"/> 编辑</span>
                        <span @click="deleteFinancial(props.row)">
                        <svg-icon icon-class="delete"/> 删除</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination :current-page.sync="postData.pageNo" :page-size="postData.pageSize" :total="totalRecords"
                       @current-change="changeCurrentPage" class="fxb-page" v-show="totalRecords>0"/>

        <el-collapse-transition>
            <div class="table-window-panel" v-show="show">
                <el-form :label-position="'top'" :model="financialForm" :rules="rules" ref="financialForm">
                    <el-row :gutter="60">
                        <el-col :span="8">
                            <el-form-item :rules="[
                            { required: true, message: '请输入名称', trigger: 'blur' },
                            { max:10, message: '长度不超过10个字', trigger: 'change' }
                        ]" label="名称" prop="name">
                                <el-input placeholder="请输入名称" v-model="financialForm.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="16">
                            <el-form-item label="财务类型" prop="financialType">
                                <el-radio-group v-model="financialForm.financialType">
                                    <el-radio label="0">回款</el-radio>
                                    <el-radio label="1">付款</el-radio>
                                    <el-radio label="2">开票</el-radio>
                                    <el-radio label="3">收票</el-radio>
                                    <el-radio label="4">其他</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="8">
                            <el-form-item :rules="[
                            { required: true, message: '请输入预计金额', trigger: 'blur' },
                            { validator: validTotal , trigger: [ 'blur' ,'change' ]},
                        ]" label="预计金额(万元)" prop="estimatedAmount">
                                <el-input placeholder="请输入预计金额" v-model="financialForm.estimatedAmount"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item :rules="[
                            { type: 'date', required: true, message: '请选择预计时间', trigger: 'change' }
                        ]" label="预计时间" prop="estimatedDate">
                                <el-date-picker placeholder="请选择预计时间" style="width: 100%;" type="date"
                                                v-model="financialForm.estimatedDate"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item :rules="[
                            { required: financialForm.completionStatus === '1', message: '请输入实际金额', trigger: 'blur' },
                            { validator: validTotal , trigger: [ 'change' ]},
                        ]" label="实际金额(万元)" prop="actualAmount">
                                <el-input placeholder="请输入实际金额" v-model="financialForm.actualAmount"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item :rules="[
                            { required: financialForm.completionStatus === '1', message: '请选择执行时间', trigger: 'blur' },
                        ]" label="执行时间" prop="executionTime">
                                <el-date-picker placeholder="请选择执行时间" style="width: 100%;" type="date"
                                                v-model="financialForm.executionTime"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="状态" prop="completionStatus">
                                <el-radio-group v-model="financialForm.completionStatus">
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
                                <el-input :rows="5" placeholder="请输入备注" type="textarea"
                                          v-model="financialForm.remark"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24" class="finalical-upload">
                            <el-form-item label="附件">
                                <el-upload :action="uploadUrl"
                                           :before-upload="beforeUpload"
                                           :file-list="financialForm.uploadFileList"
                                           :http-request="handleUpload"
                                           :limit="3" :on-exceed="handleExceed"
                                           :on-preview="handlePictureCardPreview"
                                           :on-remove="handleRemove" accept=".jpg, .jpeg, .png, .JPG, .JPEG, .PNG"
                                           list-type="picture-card" multiple>
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                                <el-dialog :visible.sync="dialogVisible">
                                    <img :src="dialogImageUrl" alt="" width="100%">
                                </el-dialog>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24" align="center" class="window-panel-foot">
                            <el-form-item>
                                <el-button @click="submitForm('financialForm');" type="primary"
                                           :loading="submitLoading">保存
                                </el-button>
                                <el-button @click="resetForm('financialForm');">取消</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </el-collapse-transition>

        <el-row :gutter="10" class="tab-bottom-abb" v-if="!infomodel">
            <el-col :span="24">
                <el-button :disabled="!conStatus" @click="addFinancial" icon="el-icon-plus" size="mini"
                           style="width:100%;" v-if="!show">新增财务管理
                </el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {
        Api_FinancialDelete,
        Api_FinancialGetDetail,
        Api_FinancialGetList,
        Api_FinancialSave
    } from "@/api/userCenter/contractManage";
    import {Api_upload, Api_fileUrl} from "@/api/baseApi";
    import {dateFormat} from '@/utils/index';
    import {isNull} from '@/utils/commonUtils';
    import {patterns} from "@/utils/validate";

    export default {
        name: "ContractFinancial",
        filters: {
            dateFormat
        },
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
                dialogImageUrl: '',
                dialogVisible: false,
                financialForm: {
                    id: "", // 财务管理 主键id （传主键 就是更新；不传就是新增）
                    contractId: "", // 合同主键id
                    name: "", // 名称.
                    financialType: "0", // 财务类型 0:回款 1:付款 2:开票 3:收票 4:其他.
                    estimatedAmount: "", // 预计金额.
                    estimatedDate: "", // 预计时间.
                    actualAmount: "", // 实际金额.
                    executionTime: "", // 执行时间.
                    completionStatus: "0", // 状态 0:未完成 1:已完成.
                    remark: "", // 备注.
                    uploadFileList: [] // 附件上列表.
                },
                uploadUrl: Api_fileUrl() + 'image/',
                curUploadFileNum: -1, // 传递给后台的图片顺序
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
                    this.financialForm.contractId = val;
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
            validTotal(rule, value, callback) {
                if (isNull(value)) {
                    if (this.financialForm.completionStatus === '0') {
                        // 未完成状态 下 为 空不需要判断
                        callback();
                    }
                }
                const store = this.$store.state;
                const priceTotal = store.contract.contractinfo.contractPrice * 1;
                if (!patterns.contractPrice.test(value)) {
                    callback(new Error('请输入数字'));
                } else if (value.toString().split(".")[0].length > 9) {
                    callback(new Error('长度不超过9位'));
                } else if ((value.toString().split(".")[1] === undefined ? false : value.toString().split(".")[1].length > 2)) {
                    callback(new Error('保留2位小数'));
                } else if ((value * 1) > priceTotal) {
                    callback(new Error('金额不能超过合同金额'));
                } else {
                    callback();
                }
            },
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
                Api_FinancialGetList(Object.assign(this.postData, option)).then(res => {
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
            beforeUpload(file) {
                const isMatch = /\.(jpg|jpeg|png|JPG|JPEG|PNG)$/.test(file.name);
                const isLt2M = file.size / 1024 < (1024 * 2);
                if (!isMatch) {
                    this.$message.warning("仅支持jpg、jpeg、png格式");
                }
                if (!isLt2M) {
                    this.$message.warning("图片大小不超过2M");
                }
                return isMatch && isLt2M;
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleRemove(file, fileList) {
                this.financialForm.uploadFileList = fileList;
            },
            handleUpload(content) {
                this.curUploadFileNum++;
                const formData = new FormData();
                formData.append("file", content.file);
                Api_upload(this.uploadUrl + this.curUploadFileNum, formData).then(res => {
                    this.financialForm.uploadFileList.push(res.url);
                }).catch(e => {
                    this.$message.error(e);
                });
            },
            handleExceed(files, fileList) {
                this.$message.warning('最多可以上传3张图片');
            },
            addFinancial() {
                this.tableLock = true;
                this.expands = [];
                this.financialForm.id = "";
                // 清空附件
                this.financialForm.uploadFileList = [];
                this.$refs['financialForm'].resetFields();
                this.show = !this.show;
            },
            editFinancial(row) {
                this.tableLock = true;
                this.expands = [];
                this.show = !this.show;

                Api_FinancialGetDetail({
                    id: row.ID
                }).then(res => {
                    if (res.stateCode === "1") {
                        const data = res.data;
                        if (data.uploadFileList.length > 0) {
                            data.uploadFileList.forEach(file => {
                                file.url = file.path;
                            });
                        }
                        this.financialForm = {
                            id: data.ID, // 财务管理 主键id （传主键 就是更新；不传就是新增）
                            contractId: data.CONTRACT_ID, // 合同主键id
                            name: data.NAME, // 名称.
                            financialType: data.FINANCIAL_TYPE, // 财务类型 0:回款 1:付款 2:开票 3:收票 4:其他.
                            estimatedAmount: data.ESTIMATED_AMOUNT, // 预计金额.
                            estimatedDate: new Date(data.ESTIMATED_DATE), // 预计时间.
                            actualAmount: data.ACTUAL_AMOUNT, // 实际金额.
                            executionTime: data.EXECUTION_TIME ? new Date(data.EXECUTION_TIME) : data.EXECUTION_TIME, // 执行时间.
                            completionStatus: data.COMPLETION_STATUS, // 状态 0:未完成 1:已完成.
                            remark: data.REMARK, // 备注.
                            uploadFileList: data.uploadFileList // 附件上列表.
                        };
                    } else {
                        this.$message.warning("获取财务管理失败");
                    }
                });
            },
            deleteFinancial(row) {
                this.$confirm('确定删除该财务数据?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Api_FinancialDelete({
                        id: row.ID
                    }).then(res => {
                        if (res.stateCode === "1") {
                            this.$message.success("删除财务管理成功");
                            this.getTableList({
                                pageNo: 1,
                                pageSize: 5
                            });
                        } else {
                            this.$message.warning("删除财务管理失败");
                        }
                    });
                });
            },
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        if (this.$route.query.id) {
                            this.financialForm.contractId = this.$route.query.id;
                        }
                        this.submitLoading = true;
                        Api_FinancialSave(this.financialForm).then(res => {
                            this.submitLoading = false;
                            if (res.stateCode === "1") {
                                if (this.financialForm.id === "") {
                                    this.$message.success("新增财务管理成功");
                                } else {
                                    this.$message.success("编辑财务管理成功");
                                }
                                this.getTableList({
                                    pageNo: 1,
                                    pageSize: 5
                                });
                            } else {
                                if (this.financialForm.id === "") {
                                    this.$message.warning("新增财务管理失败");
                                } else {
                                    this.$message.warning("编辑财务管理失败");
                                }
                            }
                        });
                        // this.show = !this.show;
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
<style lang="scss">
    .finalical-upload {
        .el-upload-list__item.is-ready {
            display: none;
        }

        .el-list-leave-active {
            display: none;
        }
    }
</style>
