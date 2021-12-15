<template>
    <div class="fxb-edit-table" v-loading="tableLoading">
        <!-- 名称(*)、事项类型(发货、收货、其他) (*)、计划合同量、预计时间(*)、实际合同量、执行时间、状态(未完成、已完成)(*)、备注 -->
        <el-table class="fxb-table" :data="tableData" :expand-row-keys="expands" @cell-mouse-enter="handelEnter"
                  row-key="ID" stripe>
            <el-table-column label="名称" prop="NAME"></el-table-column>
            <el-table-column label="事项类型">
                <template slot-scope="scope">
                    <!-- 0:发货 1:收货 2:其他. -->
                    {{ scope.row.ITEM_TYPE === '0' ? '发货' : scope.row.ITEM_TYPE === '1' ? '收货' : '其他' }}
                </template>
            </el-table-column>
            <el-table-column label="计划合同量" prop="ESTIMATED_QUANTITY"></el-table-column>
            <el-table-column label="预计时间">
                <template slot-scope="scope">
                    {{ scope.row.ESTIMATED_DATE | dateFormat('yyyy-MM-dd') }}
                </template>
            </el-table-column>
            <el-table-column label="实际合同量" prop="ACTUAL_QUANTITY"></el-table-column>
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
                    <span @click="editItem(props.row)">
                        <svg-icon icon-class="edit"/>编辑</span>
                        <span @click="deleteItem(props.row)">
                        <svg-icon icon-class="delete"/> 删除</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination :current-page.sync="postData.pageNo" :page-size="postData.pageSize" :total="totalRecords"
                       @current-change="changeCurrentPage" class="fxb-page" v-show="totalRecords>0"/>

        <el-collapse-transition>
            <div class="table-window-panel" v-show="show">
                <el-form :label-position="'top'" :model="itemForm" :rules="rules" ref="itemForm">
                    <el-row :gutter="60">
                        <el-col :span="8">
                            <el-form-item :rules="[
                            { required: true, message: '请输入名称', trigger: 'blur' },
                            { max:10, message: '长度不超过10个字', trigger: 'change' }
                        ]" label="名称" prop="name">
                                <el-input placeholder="请输入名称" v-model="itemForm.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="16">
                            <el-form-item label="事项类型" prop="itemType">
                                <el-radio-group v-model="itemForm.itemType">
                                    <el-radio label="0">发货</el-radio>
                                    <el-radio label="1">收货</el-radio>
                                    <el-radio label="2">其他</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="8">
                            <el-form-item :rules="[
                            { required: true, message: '请输入预计金额', trigger: 'blur' },
                            { validator: validTotal , trigger:[ 'blur' ,'change' ]},
                        ]" label="预计合同量" prop="estimatedQuantity">
                                <el-input placeholder="请输入预计金额" v-model="itemForm.estimatedQuantity"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item :rules="[
                            { type: 'date', required: true, message: '请选择预计时间', trigger: 'change' }
                        ]" label="预计时间" prop="estimatedDate">
                                <el-date-picker placeholder="请选择预计时间" style="width: 100%;" type="date"
                                                v-model="itemForm.estimatedDate"></el-date-picker>
                            </el-form-item>
                        </el-col>

                        <el-col :span="8">
                            <el-form-item :rules="[
                            { required: itemForm.completionStatus === '1', message: '请输入实际合同量', trigger: 'blur' },
                            { validator: validTotal , trigger:[ 'change' ]},
                        ]" label="实际合同量" prop="actualQuantity">
                                <el-input placeholder="请输入实际合同量" v-model="itemForm.actualQuantity"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item :rules="[
                            { required: itemForm.completionStatus === '1', message: '请选择执行时间', trigger: 'blur' },
                        ]" label="执行时间" prop="executionTime">
                                <el-date-picker placeholder="请选择执行时间" style="width: 100%;" type="date"
                                                v-model="itemForm.executionTime"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="状态" prop="completionStatus">
                                <el-radio-group v-model="itemForm.completionStatus">
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
                                          v-model="itemForm.remark"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24" class="item-upload">
                            <el-form-item label="附件">
                                <el-upload :action="uploadUrl"
                                           :before-upload="beforeUpload"
                                           :file-list="itemForm.uploadFileList"
                                           :http-request="handleUpload"
                                           :limit="3"
                                           :on-exceed="handleExceed"
                                           :on-preview="handlePictureCardPreview"
                                           :on-remove="handleRemove"
                                           accept=".jpg, .jpeg, .png, .JPG, .JPEG, .PNG"
                                           list-type="picture-card"
                                           multiple>
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                                <el-dialog :visible.sync="dialogVisible">
                                    <img :src="dialogImageUrl" alt="" width="100%">
                                </el-dialog>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24" align="center" class="window-panel-foot">
                            <el-form-item>
                                <el-button @click="submitForm('itemForm');" type="primary" :loading="submitLoading">保存
                                </el-button>
                                <el-button @click="resetForm('itemForm');">取消</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </el-collapse-transition>

        <el-row :gutter="10" class="tab-bottom-abb" v-if="!infomodel">
            <el-col :span="24">
                <el-button :disabled="!conStatus" @click="addItem" icon="el-icon-plus" size="mini" style="width:100%;"
                           v-if="!show">新增事项管理
                </el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {
        Api_ItemDelete,
        Api_ItemGetDetail,
        Api_ItemGetList,
        Api_ItemSave
    } from "@/api/userCenter/contractManage";
    import {Api_upload, Api_fileUrl} from "@/api/baseApi";
    import {dateFormat} from '@/utils/index';
    import {isNull} from '@/utils/commonUtils';
    import {patterns} from "@/utils/validate";

    export default {
        name: "ContractItem",
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
                // 表格状态 新增，编辑时表格不能进行删除编辑
                tableLock: false,
                show: false,
                expands: [],
                rules: {},
                dialogImageUrl: '',
                dialogVisible: false,
                itemForm: {
                    id: "", // 事项管理 主键id （传主键 就是更新；不传就是新增）
                    contractId: "", // 合同主键id
                    name: "", // 名称.
                    itemType: "0", // 事项类型 0:发货 1:收货 2:其他.
                    estimatedQuantity: "", // 计划合同量.
                    estimatedDate: "", // 预计时间.
                    actualQuantity: "", // 实际合同量.
                    executionTime: "", // 执行时间.
                    completionStatus: "0", // 状态 0:未完成 1:已完成.
                    remark: "", // 备注.
                    uploadFileList: []
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
                    this.itemForm.contractId = val;
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
                    if (this.itemForm.completionStatus === '0') {
                        // 未完成状态 下 为 空不需要判断
                        callback();
                    }
                }
                if (!patterns.contractPrice.test(value)) {
                    callback(new Error('请输入数字'));
                } else if (value.toString().split(".")[0].length > 9) {
                    callback(new Error('长度不超过9位'));
                } else if ((value.toString().split(".")[1] === undefined ? false : value.toString().split(".")[1].length > 2)) {
                    callback(new Error('保留2位小数'));
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
                Api_ItemGetList(Object.assign(this.postData, option)).then(res => {
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
                this.itemForm.uploadFileList = fileList;
            },
            handleUpload(content) {
                this.curUploadFileNum++;
                const formData = new FormData();
                formData.append("file", content.file);
                Api_upload(this.uploadUrl + this.curUploadFileNum, formData).then(res => {
                    this.itemForm.uploadFileList.push(res.url);
                }).catch(e => {
                    this.$message.error(e);
                });
            },
            handleExceed(files, fileList) {
                this.$message.warning('最多可以上传3张图片');
            },
            addItem() {
                this.tableLock = true;
                this.expands = [];
                this.itemForm.id = "";
                this.itemForm.uploadFileList = [];
                this.$refs['itemForm'].resetFields();
                this.show = !this.show;
            },
            editItem(row) {
                this.tableLock = true;
                this.expands = [];
                this.show = !this.show;

                Api_ItemGetDetail({
                    id: row.ID
                }).then(res => {
                    if (res.stateCode === "1") {
                        const data = res.data;
                        if (data.uploadFileList.length > 0) {
                            data.uploadFileList.forEach(file => {
                                file.url = file.path;
                            });
                        }
                        this.itemForm = {
                            id: data.ID, // 事项管理 主键id （传主键 就是更新；不传就是新增）
                            contractId: data.CONTRACT_ID, // 合同主键id
                            name: data.NAME, // 名称.
                            itemType: data.ITEM_TYPE, // 事项类型 0:发货 1:收货 2:其他.
                            estimatedQuantity: data.ESTIMATED_QUANTITY, // 计划合同量.
                            estimatedDate: new Date(data.ESTIMATED_DATE), // 预计时间.
                            actualQuantity: data.ACTUAL_QUANTITY, // 实际合同量.
                            executionTime: data.EXECUTION_TIME ? new Date(data.EXECUTION_TIME) : data.EXECUTION_TIME, // 执行时间.
                            completionStatus: data.COMPLETION_STATUS, // 状态 0:未完成 1:已完成.
                            remark: data.REMARK, // 备注.
                            uploadFileList: data.uploadFileList
                        };
                    } else {
                        this.$message.warning("获取事项失败");
                    }
                });
            },
            deleteItem(row) {
                this.$confirm('确定删除该事项数据?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'

                }).then(() => {
                    Api_ItemDelete({
                        id: row.ID
                    }).then(res => {
                        if (res.stateCode === "1") {
                            this.$message.success("删除事项成功");
                            this.getTableList({
                                pageNo: 1,
                                pageSize: 5
                            });
                        } else {
                            this.$message.warning("删除事项失败");
                        }
                    });
                });
            },
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        if (this.$route.query.id) {
                            this.itemForm.contractId = this.$route.query.id;
                        }
                        this.submitLoading = true;
                        Api_ItemSave(this.itemForm).then(res => {
                            this.submitLoading = false;
                            if (res.stateCode === "1") {
                                if (this.itemForm.id === "") {
                                    this.$message.success("新增事项成功");
                                } else {
                                    this.$message.success("编辑事项成功");
                                }
                                this.getTableList({
                                    pageNo: 1,
                                    pageSize: 5
                                });
                            } else {
                                if (this.itemForm.id === "") {
                                    this.$message.warning("新增事项失败");
                                } else {
                                    this.$message.warning("编辑事项失败");
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
<style lang="scss">
    .item-upload {
        .el-upload-list__item.is-ready {
            display: none;
        }

        .el-list-leave-active {
            display: none;
        }
    }
</style>
<style lang="scss" scoped>

</style>
