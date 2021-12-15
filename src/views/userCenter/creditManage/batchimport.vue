<template>
    <div class="usercenter-container">
        <el-row class="fxb-table-tool">
            <el-form>
                <el-form-item>
                    <el-row :gutter="10" type="flex" align="middle">
                        <el-col :span="5">
                            <h3 class="font18 bold">批量导入{{ $route.params.groupType === '0' ? "客户":"供应商" }}</h3>
                        </el-col>
                        <el-col :span="11" offset="7" align="right">
                            <el-upload class="upload-demo" :action="uploadUrl" :before-upload="beforeUpload"
                                       :http-request="myUpload" :on-remove="handleRemove" accept=".xls,.xlsx"
                                       :file-list="fileList">
                                <el-button :loading="batchLoading" size="small" :disabled="uploadFile !== ''">选择导入文件
                                </el-button>
                            </el-upload>
                        </el-col>
                        <el-col :span="2" align="right">
                            <a v-if="$route.params.groupType === '1'" href="../../../../static/template/供应商导入模板.xlsx"
                               class="ml15 fxb-blue">
                                模板下载
                            </a>
                            <a v-if="$route.params.groupType === '0'" href="../../../../static/template/客户导入模板.xlsx"
                               class="ml15 fxb-blue">
                                模板下载
                            </a>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
        </el-row>
        <el-table class="fxb-table" ref="attentionTable" :data="attentionList" v-loading="listLoading"
                  tooltip-effect="dark" style="width: 100%" row-key="index" :expand-row-keys="expands"
                  @cell-mouse-enter="handelEnter">
            <el-table-column prop="order" label="序号" width="50" type="index" :index="indexMethod"></el-table-column>
            <el-table-column prop="companyName" label="企业名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="creditCode" label="统一社会信用代码" width="200"></el-table-column>
            <el-table-column label="匹配结果" width="200">
                <template slot-scope="scope">
                    {{ scope.row.errorMessage ? '匹配失败' : '匹配成功' }}
                </template>
            </el-table-column>
            <el-table-column prop="errorMessage" label="原因分析" width="250"></el-table-column>
            <el-table-column type="expand" width="1">
                <template slot-scope="scope">
                    <el-tag size="mini" v-for="item in scope.row.groups" :key="item.id" v-show="item.name">{{ item.name
                        }}
                    </el-tag>
                    <i class="el-icon-edit" @click="openEditGroup(scope.row)"></i>
                </template>
            </el-table-column>
            <el-table-column type="expand" width="1">
                <template slot-scope="props">
                    <div class="row-tool-panel">
                    <span @click="editAttention(props.row)">
                        <svg-icon icon-class="edit"/> 编辑 </span>
                        <span @click="deleteAttention(props.row)">
                        <svg-icon icon-class="delete"/> 删除 </span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="fxb-page" v-show="searchParams.totalRecords>0" :total="searchParams.totalRecords"
                       :page-size="searchParams.pageSize" :current-page.sync="searchParams.pageNo"/>

        <el-collapse-transition>
            <div class="table-window-panel" v-show="show">
                <el-form :label-position="'top'" :model="attentionForm" ref="attentionForm">
                    <el-row :gutter="60">
                        <el-col :span="8">
                            <el-form-item label="企业名称" prop="companyName">
                                <el-input placeholder="请输入企业名称" v-model="attentionForm.companyName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24" align="center">
                            <el-form-item>
                                <el-button @click="submitForm('attentionForm')" style="width:100px;" type="primary">保存
                                </el-button>
                                <el-button @click="cancelForm" style="width:100px;">取消</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </el-collapse-transition>

        <el-row class="fxb-table-footer">
            <el-form>
                <el-form-item>
                    <el-row :gutter="10" type="flex" align="middle">
                        <el-col :span="2" align="center">
                            <span>添加到</span>
                        </el-col>
                        <el-col :span="22">
                            <el-select v-model="groupId" clearable placeholder="请选择" size="small" style="width: 100%;">
                                <el-option v-for="item in $store.getters.attentionGroup" :key="item.id"
                                           :label="item.name" :value="item.id"
                                           v-show="item.groupType !== searchParams.groupType">{{ item.name }}
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-row :gutter="10" type="flex" align="middle">
                        <el-col :span="24" align="center">
                            <el-button type="primary" @click="submitAdd()">确定</el-button>
                            <el-button
                                @click="$router.push('/userCenter/creditManage/attention/' + $route.params.groupType)">
                                取消
                            </el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
        </el-row>

    </div>
</template>

<script>
    import Pagination from "@/components/Pagination";
    import {Api_ExactAddAttention, Api_ImportAttention} from "@/api/userCenter/creditManage";
    import {Api_CompanySearch} from "@/api/creditMonitor";
    import {dateFormat} from "@/utils/index";
    import {Api_upload, Api_DownloadFileByPath, Api_fileUrl} from "@/api/baseApi";

    export default {
        name: "Attention",
        components: {
            Pagination
        },
        filters: {
            dateFormat
        },
        data() {
            return {
                // 表格状态 新增，编辑时表格不能进行删除编辑
                tableLock: false,
                multipleSelection: [],
                attentionList: [],
                searchParams: {
                    companyName: "",
                    groupId: "",
                    groupType: "",
                    pageNo: 1,
                    pageSize: 10,
                    totalRecords: 0,
                    superviseGroupId: ""
                },
                fileList: [],
                listLoading: true,
                attentionId: "",
                batchSetGroupDialogVisible: false,
                batchSetLoading: false,
                addCompanyDialogVisible: false,
                expands: [],
                batchLoading: false,
                groupId: "",
                // 上传得文件
                uploadFile: "",
                uploadUrl: Api_fileUrl(),
                curUploadFileNum: -1, // 传递给后台的图片顺序
                show: false,
                attentionForm: {
                    companyName: ''
                }
            };
        },
        created: function () {
            this.searchParams.groupType = this.$route.params.groupType;
            this.listLoading = false;
        },
        updated: function () {
            // console.log("update");
        },
        beforeRouteUpdate(to, from, next) {
            this.searchParams.groupType = to.params.groupType;
            next();
        },
        methods: {
            // 表格鼠标移入事件
            handelEnter(row, column, cell, event) {
                const cindex = this.expands.indexOf(row.index);
                if (!this.tableLock) {
                    if (cindex < 0) {
                        this.expands.shift();
                        this.expands.push(row.index);
                    }
                }
            },

            // 批量添加
            batchAdd() {
                this.dialogImportVisible = true;
            },
            // 删除文件，初始化信息
            handleRemove() {
                this.fileList = [];
                this.uploadFile = '';
            },
            beforeUpload(file) {
                const isMatch = /\.(xls|xlsx|XLS|XLSX)$/.test(file.name);
                const isLt2M = file.size / 1024 < 500;
                if (!isMatch) {
                    this.$message.warning('请上传xls，xlsx格式的文件');
                }
                if (!isLt2M) {
                    this.$message.warning('文件大小不能超过500kb');
                }
                return isMatch && isLt2M;
            },
            myUpload(content) {
                this.curUploadFileNum++;
                const formData = new FormData();
                formData.append('file', content.file);
                this.batchLoading = true;
                Api_upload(this.uploadUrl + this.curUploadFileNum, formData).then(res => {
                    this.uploadFile = res.url;
                    Api_ImportAttention({
                        groupId: this.groupId,
                        filePath: res.path,
                        groupType: this.$route.params.groupType
                    }).then(res => {
                        this.batchLoading = false;
                        res.forEach((item, index) => {
                            item.index = index;
                        });
                        this.attentionList = res;
                    }).catch(e => {
                        this.batchLoading = false;
                        this.$message.error(e);
                    });
                }).catch(e => {
                    this.batchLoading = false;
                    this.$message.error(e);
                });
            },
            downLoadFile(path) {
                Api_DownloadFileByPath(path);
            },
            // 编辑
            editAttention(row) {
                this.show = true;
                this.expands = [];
                this.tableLock = true;
                this.attentionForm = row;
            },
            deleteAttention(row) {
                this.$confirm('确定删除该企业数据?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.attentionList.forEach((item, index) => {
                        if (item.index === row.index) {
                            this.attentionList.splice(index, 1);
                        }
                    });
                });
            },
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        Api_CompanySearch({
                            queryValue: this.attentionForm.companyName
                        }).then(res => {
                            if (res.stateCode === "1") {
                                this.show = false;
                                this.tableLock = false;
                            } else {
                                this.$message.error('企业不存在');
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            cancelForm() {
                this.show = false;
                this.tableLock = false;
            },
            submitAdd() {
                this.listLoading = true;

                const addData = {
                    groupId: this.groupId,
                    addList: this.attentionList,
                    groupType: this.$route.params.groupType
                };

                if (this.attentionList.length === 0) {
                    this.listLoading = false;
                    this.$message.warning("请选择需要添加的企业");
                    return false;
                } else if (!this.groupId) {
                    this.listLoading = false;
                    this.$message.warning("请选择分组");
                    return false;
                } else {
                    Api_ExactAddAttention(addData).then(res => {
                        this.listLoading = false;
                        if (res.stateCode === "1") {
                            this.listLoading = false;
                            if (res.message) {
                                this.$message.success(res.message);
                            }
                            this.attentionList = [];
                        } else {
                            this.listLoading = false;
                            this.$message.warning("已加入队列，无需重复添加");
                            this.searchCompany = "";
                            return false;
                        }
                    });
                }
            },
            // 序号
            indexMethod(index) {
                return index + 1;
            }
        }
    };
</script>
