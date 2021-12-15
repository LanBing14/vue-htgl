<template>
    <div class="fxb-edit-table">
        <el-row class="fxb-table-tool">
            <el-form>
                <el-form-item label="财务类型：" class="fxb-tag-list marT-2 marB0">
                    <span :class="{'active':searchData.financialType === ''}" @click="getQueryList('')">全部</span>
                    <span :class="{'active':searchData.financialType === '0'}" @click="getQueryList('0')">回款</span>
                    <span :class="{'active':searchData.financialType === '1'}" @click="getQueryList('1')">付款</span>
                    <span :class="{'active':searchData.financialType === '2'}" @click="getQueryList('2')">开票</span>
                    <span :class="{'active':searchData.financialType === '3'}" @click="getQueryList('3')">收票</span>
                    <span :class="{'active':searchData.financialType === '4'}" @click="getQueryList('4')">其他</span>
                </el-form-item>
                <el-form-item>
                    <el-row :gutter="10" type="flex" align="middle" class="marT5">
                        <el-col :span="5">
                            <el-input size="small" v-model="searchData.content" placeholder="合同名称/编号"></el-input>
                        </el-col>
                        <el-col :span="5">
                            <el-input size="small" v-model="searchData.oppositeCompany" placeholder="对方公司名称"></el-input>
                        </el-col>
                        <el-col :span="5">
                            <el-select size="small" v-model="searchData.completionStatus" placeholder="状态">
                                <el-option label="全部" value=" "></el-option>
                                <el-option label="已完成" value="1"></el-option>
                                <el-option label="未完成" value="0"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="10">
                            <el-date-picker v-model="dateRange" type="daterange" :picker-options="pickerOptions"
                                            range-separator="~" start-placeholder="预计时间起" end-placeholder="预计时间止"
                                            value-format="yyyy-MM-dd" size="small" @change="dateRangeChange"
                                            align="center" style="width: 320px;"></el-date-picker>
                        </el-col>

                        <el-col :span="6">
                            <el-button size="small" type="primary" icon="el-icon-search" @click="getPageData()">查询
                            </el-button>
                            <el-button size="small" icon="el-icon-refresh" @click="resetData()">重置</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
        </el-row>

        <el-table :data="tableData" v-loading="tableLoading" stripe row-key="ID" class="fxb-table"
                  :expand-row-keys="expands" @cell-mouse-enter="handelEnter">
            <el-table-column label="合同名称/编号">
                <template slot-scope="scope">
                    <template v-if="scope.row.CONTRACT_NAME.length > 10">
                        <span
                            :title="scope.row.CONTRACT_NAME">{{ scope.row.CONTRACT_NAME.substring(0, 10) + '...' }}</span>
                    </template>
                    <template v-else>
                        <span>{{ scope.row.CONTRACT_NAME }}</span>
                    </template>
                    <br/>
                    <template v-if="scope.row.CONTRACT_NO.length > 10">
                        <span :title="scope.row.CONTRACT_NO">{{ scope.row.CONTRACT_NO.substring(0, 10) + '...' }}</span>
                    </template>
                    <template v-else>
                        <span>{{ scope.row.CONTRACT_NO }}</span>
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="名称" prop="NAME"></el-table-column>
            <el-table-column label="财务类型">
                <template slot-scope="scope">
                    <template v-if="scope.row.FINANCIAL_TYPE === '0'">回款</template>
                    <template v-else-if="scope.row.FINANCIAL_TYPE === '1'">付款</template>
                    <template v-else-if="scope.row.FINANCIAL_TYPE === '2'">开票</template>
                    <template v-else-if="scope.row.FINANCIAL_TYPE === '3'">收票</template>
                    <template v-else>其他</template>
                </template>
            </el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <template v-if="scope.row.COMPLETION_STATUS === '0'">未完成</template>
                    <template v-else>已完成</template>
                </template>
            </el-table-column>
            <el-table-column label="负责人/部门" prop="principal">
                <template slot-scope="scope">
                    {{ scope.row.REAL_NAME }}
                    <br/>
                    {{ scope.row.DEPT_NAME }}
                </template>
            </el-table-column>
            <el-table-column label="预计金额" prop="ESTIMATED_AMOUNT"></el-table-column>
            <el-table-column label="预计时间" prop="ESTIMATED_DATE"></el-table-column>
            <el-table-column type="expand" width="1">
                <template slot-scope="props">
                    <div v-if="!isHover">
                        <el-form label-position="left" inline class="demo-table-expand" label-width="90px">
                            <el-form-item label="实际金额">
                                <span>{{ props.row.ACTUAL_AMOUNT }}</span>
                            </el-form-item>
                            <el-form-item label="执行时间">
                                <span>{{ props.row.EXECUTION_TIME }}</span>
                            </el-form-item>
                            <el-form-item label="操作人">
                            <span>{{ props.row.UPDATE_NAME }}（
                                <template v-if="props.row.UPDATE_ROLE === '0'">
                                    管理员
                                </template>
                                <template v-else-if="props.row.UPDATE_ROLE === '1'">
                                    管理人员
                                </template>
                                <template v-else-if="props.row.UPDATE_ROLE === '2'">
                                    财务人员
                                </template>
                                <template v-else-if="props.row.UPDATE_ROLE === '3'">
                                    销售人员
                                </template>
                                <template v-else-if="props.row.UPDATE_ROLE === '4'">
                                    采购人员
                                </template>
                                <template v-else></template>
                                ）</span>
                            </el-form-item>
                            <el-form-item label="操作时间">
                                <span>{{ props.row.UPDATE_DATE | dateFormat('yyyy-MM-dd') }}</span>
                            </el-form-item>
                            <el-form-item label="备注" style="width: 100%!important;">
                                <span>{{ props.row.REMARK }}</span>
                            </el-form-item>
                            <el-form-item label="附件" style="width: 100%!important;">
                                <el-upload id="view-picture-list" :action="uploadUrl" :before-upload="beforeUpload"
                                           :file-list="props.row.uploadFileList" :http-request="(p)=>handleUpload(p, 1)"
                                           :limit="3" :on-exceed="handleExceed" :on-preview="handlePictureCardPreview"
                                           :on-remove="handleRemove" accept=".jpg, .jpeg, .png, .JPG, .JPEG, .PNG"
                                           list-type="picture-card" multiple disabled>
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                                <el-dialog :visible.sync="dialogVisible">
                                    <img width="100%" :src="dialogImageUrl" alt/>
                                </el-dialog>
                            </el-form-item>
                        </el-form>
                    </div>

                    <div v-if="!isClickShow">
                        <div class="row-tool-panel" @mouseleave="cellMouseLeave">
                        <span @click="editLine(props.row.ID)" v-show="getAuthEdit()">
                            <svg-icon icon-class="edit"/>编辑
                        </span>
                            <span @click="showDetail(props.row.ID,props)">
                            <svg-icon icon-class="detail"/>查看
                        </span>
                        </div>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination class="fxb-page" v-loading="tableLoading" v-show="totalRecords>0" :total="totalRecords"
                       :page-size="pageSize" :current-page.sync="pageNo" @current-change="changeCurrentPage"/>

        <el-dialog title="编辑" :before-close="editDialogBeforeClose"
                   :close-on-click-modal="false"
                   :visible.sync="showEditDialog" width="640px">
            <el-form :model="editDialogForm" v-loading="loading" ref="editDialogForm" label-width="100px"
                     class="change-phone">
                <el-form-item :rules="[
                            { required: editDialogForm.COMPLETION_STATUS === '1', message: '请输入实际金额', trigger: 'blur' },
                            { validator: validTotal , trigger: [ 'change' ]},
                        ]" label="实际金额" prop="ACTUAL_AMOUNT">
                    <el-input placeholder="请输入实际金额" v-model="editDialogForm.ACTUAL_AMOUNT"></el-input>
                </el-form-item>

                <el-form-item :rules="[
                            { required: editDialogForm.COMPLETION_STATUS === '1', message: '请选择执行时间', trigger: 'blur' },
                        ]" label="执行时间" prop="EXECUTION_TIME">
                    <el-date-picker placeholder="请选择执行时间" style="width: 100%;" type="date"
                                    v-model="editDialogForm.EXECUTION_TIME"></el-date-picker>
                </el-form-item>

                <el-form-item :rules="[
                            { max:200, message: '长度不超过200个字', trigger: 'change' }
                        ]" label="备注" prop="REMARK">
                    <el-input :rows="5" placeholder="请输入备注" type="textarea" v-model="editDialogForm.REMARK"></el-input>
                </el-form-item>

                <el-form-item label="上传附件">
                    <el-upload :action="uploadUrl" :before-upload="beforeUpload"
                               :file-list="editDialogForm.uploadFileList" :http-request="(p)=>handleUpload(p, 2)"
                               :limit="3" :on-exceed="handleExceed" :on-preview="handlePictureCardPreview"
                               :on-remove="handleRemove" accept=".jpg, .jpeg, .png, .JPG, .JPEG, .PNG"
                               list-type="picture-card" multiple>
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt/>
                    </el-dialog>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio v-model="editDialogForm.COMPLETION_STATUS" label="0">未完成</el-radio>
                    <el-radio v-model="editDialogForm.COMPLETION_STATUS" label="1">已完成</el-radio>
                </el-form-item>
                <div style="text-align: center;">
                    <el-button type="primary" @click="saveEdit('editDialogForm')" size="small">确定</el-button>
                    <el-button @click="resetForm('editDialogForm'); showEditDialog = false;" size="small">取消</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import {
        Api_FinancialGetDetail,
        Api_FinancialSave,
        Api_FinancialPageList
    } from "@/api/userCenter/contractManage";
    import {Api_upload, Api_fileUrl} from "@/api/baseApi";
    import {dateFormat} from "@/utils";
    import {patterns} from "@/utils/validate";
    import {arrayIsNull, isNull} from '@/utils/commonUtils';
    import {getAuthEdit, getUserInfo} from "@/utils/auth";

    export default {
        filters: {
            dateFormat
        },
        data() {
            return {
                userInfo: getUserInfo(),
                // 选中的时间区间
                dateRange: "",
                pickerOptions: {
                    shortcuts: [{
                        text: "今日",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            picker.$emit("pick", [start, end]);
                        }
                    },
                        {
                            text: "近一周",
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(
                                    start.getTime() - 3600 * 1000 * 24 * 6
                                );
                                picker.$emit("pick", [start, end]);
                            }
                        },
                        {
                            text: "近一个月",
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setMonth(start.getMonth() - 1);
                                picker.$emit("pick", [start, end]);
                            }
                        },
                        {
                            text: "近一年",
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setFullYear(start.getFullYear() - 1);
                                picker.$emit("pick", [start, end]);
                            }
                        }
                    ]
                },
                expands: [],
                tableLoading: false,
                tableData: [],
                pageNo: 1,
                pageSize: 10,
                totalRecords: 1,
                searchData: {
                    content: "",
                    oppositeCompany: "",
                    completionStatus: "",
                    financialType: "",
                    estimatedDateStart: "",
                    estimatedDateEnd: ""
                },
                editDialogForm: {
                    ACTUAL_AMOUNT: "",
                    EXECUTION_TIME: "",
                    REMARK: "",
                    uploadFileList: [],
                    COMPLETION_STATUS: "",
                    ESTIMATED_AMOUNT: ""
                },
                rules: {},
                showEditDialog: false,
                dialogImageUrl: "",
                dialogVisible: false,
                loading: false,
                isHover: false,
                isClickShow: false,
                uploadUrl: Api_fileUrl() + 'image/',
                curUploadFileNum1: -1, // 传递给后台的图片顺序
                curUploadFileNum2: -1 // 传递给后台的图片顺序

            };
        },
        mounted() {
            this.getPageData();
        },
        methods: {
            getAuthEdit() {
                return getAuthEdit();
            },
            validTotal(rule, value, callback) {
                if (isNull(value)) {
                    if (this.editDialogForm.COMPLETION_STATUS === '0') {
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
                } else if ((value * 1) > (this.editDialogForm.CONTRACT_PRICE * 1)) {
                    callback(new Error('金额不能超过合同金额'));
                } else {
                    callback();
                }
            },
            beforeUpload(file) {
                const isMatch = /\.(jpg|jpeg|png|JPG|JPEG|PNG)$/.test(file.name);
                const isLt2M = file.size / 1024 < 1024 * 2;
                if (!isMatch) {
                    this.$message.warning("仅支持jpg、jpeg、png格式");
                }
                if (!isLt2M) {
                    this.$message.warning("图片大小不超过2M");
                }
                return isMatch && isLt2M;
            },
            handleRemove(file, fileList) {
                this.editDialogForm.uploadFileList = fileList;
            },
            handleUpload(content, type) {
                let num = 0;
                if (type === 1) {
                    this.curUploadFileNum1++;
                    num = this.curUploadFileNum1;
                } else {
                    this.curUploadFileNum2++;
                    num = this.curUploadFileNum2;
                }
                const formData = new FormData();
                formData.append("file", content.file);
                Api_upload(this.uploadUrl + num, formData).then(res => {
                    this.editDialogForm.uploadFileList.push(res.url);
                }).catch(e => {
                    this.$message.error(e);
                });
            },
            handleExceed(files, fileList) {
                this.$message.warning('最多可以上传3张图片');
            },
            /**
             * 查询
             * @param financialType 财务类型 0:回款 1:付款 2:开票 3:收票 4:其他
             */
            getQueryList(financialType) {
                this.searchData.financialType = financialType;
                this.getPageData();
            },
            // 重置搜索数据
            resetData() {
                this.searchData.content = "";
                this.searchData.oppositeCompany = "";
                this.searchData.completionStatus = "";
                this.searchData.financialType = "";
                this.searchData.estimatedDateStart = "";
                this.searchData.estimatedDateEnd = "";
                this.dateRange = [];
            },
            getPageData() {
                if (!arrayIsNull(this.dateRange)) {
                    this.searchData.estimatedDateStart = this.dateRange[0];
                    this.searchData.estimatedDateEnd = this.dateRange[1];
                } else {
                    this.searchData.estimatedDateStart = "";
                    this.searchData.estimatedDateEnd = "";
                }
                this.tableLoading = true;
                Api_FinancialPageList(
                    this.pageNo,
                    this.pageSize,
                    this.searchData.financialType,
                    this.searchData.content,
                    this.searchData.oppositeCompany,
                    this.searchData.completionStatus,
                    this.searchData.estimatedDateStart,
                    this.searchData.estimatedDateEnd
                ).then(data => {
                    this.tableLoading = false;
                    if (data.stateCode === "1") {
                        this.pageNo = data.data.currentPage;
                        this.pageSize = data.data.pageSize;
                        this.totalRecords = data.data.totalRecords;
                        this.tableData = data.data.list;
                    } else if (data.stateCode === "80205") {
                        // 权限不够
                        this.tableData = [];
                        // this.$message.warning("您尚未完成企业认证，当前仅可查看");
                        this.$confirm('您尚未完成企业认证，当前仅可查看', '提示', {
                            showCancelButton: true,
                            confirmButtonText: '前往认证',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$router.push({
                                path: "/userCenter/setting/basicinfo"
                            });
                        });
                    } else {
                        this.$message.error("服务器偷懒了");
                    }
                });
            },
            showDetail(id, props) {
                this.isClickShow = true;
                this.isHover = false;

                // 解决上传图片错位问题
                props.row.uploadFileList = [];

                Api_FinancialGetDetail({
                    id: id
                }).then(data => {
                    if (data.stateCode === "1") {
                        if (data.data.uploadFileList.length > 0) {
                            data.data.uploadFileList.forEach(file => {
                                file.url = file.path;
                            });
                        }
                        Object.assign(props.row, data.data);
                        this.tableData.splice([props.$index], 1, props.row);
                    } else {
                        this.$message.error("服务器偷懒了");
                    }
                });
            },
            editLine(id) {
                this.showEditDialog = true;

                Api_FinancialGetDetail({
                    id: id
                }).then(data => {
                    if (data.stateCode === "1") {
                        if (data.data.uploadFileList.length > 0) {
                            data.data.uploadFileList.forEach(file => {
                                file.url = file.path;
                            });
                        }
                        this.editDialogForm.uploadFileList = [];
                        this.editDialogForm = data.data;
                    } else {
                        this.$message.error("服务器偷懒了");
                    }
                });
            },
            cellMouseLeave(row, column, cell, event) {
                setTimeout(() => {
                    this.expands = [];
                }, 500);
            },
            handelEnter(row, column, cell, event) {
                this.isHover = true;
                this.isClickShow = false;

                const cindex = this.expands.indexOf(row.ID);
                if (cindex < 0) {
                    this.expands.shift();
                    this.expands.push(row.ID);

                    this.isHover = true;
                    this.isClickShow = false;
                }
            },
            changeCurrentPage() {
                this.getPageData();
            },
            dateRangeChange() {
            },
            editDialogBeforeClose() {
                this.showEditDialog = false;
                this.resetForm("editDialogForm");
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();

                // 解决上传图片错位问题
                this.editDialogForm.uploadFileList = [];
            },
            saveEdit(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        Api_FinancialSave({
                            id: this.editDialogForm.ID,
                            contractId: this.editDialogForm.CONTRACT_ID,
                            name: this.editDialogForm.NAME,
                            financialType: this.editDialogForm.FINANCIAL_TYPE,
                            estimatedAmount: this.editDialogForm.ESTIMATED_AMOUNT,
                            estimatedDate: this.editDialogForm.ESTIMATED_DATE,
                            actualAmount: this.editDialogForm.ACTUAL_AMOUNT,
                            executionTime: this.editDialogForm.EXECUTION_TIME,
                            completionStatus: this.editDialogForm.COMPLETION_STATUS,
                            remark: this.editDialogForm.REMARK,
                            uploadFileList: this.editDialogForm.uploadFileList
                        }).then(data => {
                            if (data) {
                                if (data.stateCode === "1") {
                                    this.$message.success("保存成功");
                                    this.getPageData();
                                    this.showEditDialog = false;
                                } else {
                                    this.$message.error("服务器偷懒了");
                                    this.showEditDialog = false;
                                }
                            }
                        });
                    }
                });
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            }
        }
    };
</script>

<style lang="scss">
    #view-picture-list .el-upload--picture-card {
        display: none !important;
    }
</style>
<style lang="scss" scoped>
    .innerHeight {
        padding-right: 15px;
        height: 420px;
        overflow: auto;
    }

    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 49%;

        .el-upload--picture-card {
            display: none !important;
        }
    }
</style>
