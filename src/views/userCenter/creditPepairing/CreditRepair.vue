<template>
<div>
    <el-row class="fxb-table-tool">
        <el-form>
            <el-form-item>
                <el-row :gutter="10" type="flex" align="middle">
                    <el-col :span="5">
                        <el-select v-model="postData.progressStatus" placeholder="申请进度" size="small">
                            <el-option :label="'待确认'" :value="'0'">待确认</el-option>
                            <el-option :label="'服务中'" :value="'1'">服务中</el-option>
                            <el-option :label="'服务完成'" :value="'2'">服务完成</el-option>
                            <el-option :label="'已取消'" :value="'3'">已取消</el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="5">
                        <el-select v-model="postData.serviceType" placeholder="服务类型" size="small">
                            <el-option :label="'信用修复报告'" :value="'0'">信用修复报告</el-option>
                            <el-option :label="'信用修复培训'" :value="'1'">信用修复培训</el-option>
                            <el-option :label="'培训&报告'" :value="'2'">培训&报告</el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="10">
                        <el-date-picker v-model="repairDateTime" type="daterange" :picker-options="pickerOptions" range-separator="~" start-placeholder="申请时间起" end-placeholder="申请时间止" value-format="yyyy-MM-dd" size="small" style="width: 100%;" align="center"></el-date-picker>
                    </el-col>
                    <el-col :span="6">
                        <el-button type="primary" icon="el-icon-search" @click="getPageList({ pageNo: 1,pageSize: 10})" size="small">查询</el-button>
                        <el-button icon="el-icon-refresh" size="small" @click="resetSearch()">重置</el-button>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
    </el-row>
    <el-row>
        <!-- 表格内容展示开始  序号、申请编号、服务类型、申请人、服务金额、申请进度、申请时间 -->
        <el-table stripe class="fxb-table" v-loading="listLoading" :data="list" :expand-row-keys="expands" @cell-mouse-enter="handelEnter" row-key="ID">
            <el-table-column label="序号" width="50">
                <template slot-scope="scope">
                    <span>{{ scope.$index+(postData.pageNo - 1) * postData.pageSize + 1 }} </span>
                </template>
            </el-table-column>
            <el-table-column label="申请编号" prop="BUSINESS_NO" width="200"></el-table-column>
            <el-table-column label="服务类型">
                <template slot-scope="scope">
                    <!-- 0:信用修复报告 1:信用修复培训 2:培训&报告. -->
                    <span>{{ scope.row.SERVICE_TYPE === '0' ? '信用修复报告' : scope.row.SERVICE_TYPE === '1' ? '信用修复培训' : '培训&报告' }} </span>
                </template>
            </el-table-column>
            <el-table-column label="申请人" prop="LINKMAN"></el-table-column>
            <el-table-column label="服务金额" prop="SERVICE_AMOUNT"></el-table-column>
            <el-table-column label="申请进度">
                <template slot-scope="scope">
                    <!-- 0:待确认 1:服务中 2:服务完成 3:已取消. -->
                    <span>{{ scope.row.PROGRESS_STATUS === '0' ? '待确认' : scope.row.PROGRESS_STATUS === '1' ? '服务中' : scope.row.PROGRESS_STATUS === '2' ? '服务完成' : '已取消' }} </span>
                </template>
            </el-table-column>
            <el-table-column label="申请时间" prop="APPLICATION_DATE"></el-table-column>
            <el-table-column type="expand" width="1">
                <template slot-scope="props">
                    <div class="row-tool-panel" v-show="!show">
                        <span @click="detailClick(props.row)">
                            <svg-icon icon-class="edit" /> 查看</span>
                        <span v-if="props.row.PROGRESS_STATUS === '0'" @click="cancleClick(props.row)">
                            <svg-icon icon-class="edit" /> 取消申请</span>
                        <span v-if="(props.row.PROGRESS_STATUS === '2')&&props.row.trainPath" @click="downLoadFile(props.row.trainPath)">
                            <svg-icon icon-class="download" /> 培训证明</span>
                        <span v-if="(props.row.PROGRESS_STATUS === '2')&&props.row.reportPath" @click="downLoadFile(props.row.reportPath)">
                            <svg-icon icon-class="download" /> 信用报告</span>
                    </div>
                    <el-collapse-transition>
                        <div class="table-window-panel" v-show="show">

                            <div v-if="detailForm.PROGRESS_STATUS !== '3'">
                                <div class="el-alert el-alert--info">
                                    <span>当前服务状态: &nbsp;&nbsp; </span> {{ detailForm.PROGRESS_STATUS === '0' ? '待确认' : detailForm.PROGRESS_STATUS === '1' ? '服务中' : detailForm.PROGRESS_STATUS === '2' ? '服务完成' : '已取消' }}
                                </div>
                                <br>
                                <el-steps :active="detailForm.PROGRESS_STATUS*1" align-center finish-status="success">
                                    <el-step title="待确认"></el-step>
                                    <el-step title="服务中"></el-step>
                                    <el-step title="服务完成"></el-step>
                                </el-steps>
                            </div>

                            <div v-if="detailForm.PROGRESS_STATUS === '3'">
                                <div class="el-alert el-alert--error">
                                    <span>当前服务状态: &nbsp;&nbsp; </span> {{ detailForm.PROGRESS_STATUS === '0' ? '待确认' : detailForm.PROGRESS_STATUS === '1' ? '服务中' : detailForm.PROGRESS_STATUS === '2' ? '服务完成' : '已取消' }}
                                </div>
                                <br>
                                <el-steps v-if="detailForm.PROGRESS_STATUS === '3'" :active="detailForm.PROGRESS_STATUS*1" align-center finish-status="success">
                                    <el-step title="待确认"></el-step>
                                    <el-step title="已取消"></el-step>
                                </el-steps>
                            </div>

                            <br>
                            <!-- 行政处罚决定书文号、失信描述、审核时间、审核意见 -->
                            <el-form :label-position="'top'" :model="detailForm">
                                <el-row :gutter="60">
                                    <el-col :span="8">
                                        <el-form-item label="行政处罚决定书文号">
                                            <el-input disabled v-model="detailForm.PENALTY_NO"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="24">
                                        <el-form-item label="失信描述">
                                            <el-input :rows="5" type="textarea" disabled v-model="detailForm.DISHONEST_DESC"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="审核时间">
                                            <el-input disabled :value="dateFormatTime(detailForm.AUDIT_DATE)"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="24">
                                        <el-form-item label="审核意见">
                                            <el-input :rows="5" type="textarea" disabled v-model="detailForm.AUDIT_OPINION"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="24" align="center">
                                        <el-form-item>
                                            <el-button @click="sureClick()" style="width:100px;" type="primary">确认</el-button>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </div>
                    </el-collapse-transition>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination class="fxb-page" v-loading="listLoading" v-show="totalRecords>0" :total="totalRecords" :page-size="postData.pageSize" :current-page.sync="postData.pageNo" @current-change="changeCurrentPage" />

    </el-row>
</div>
</template>

<script>
    import {Api_CancelApplication, Api_GetPageList} from '@/api/userCenter/orderManage'
    import {Api_DownloadFileByPath} from '@/api/baseApi'
    import {arrayIsNull} from "@/utils/commonUtils";
    import {dateFormat} from '@/utils/index';

    export default {
    name: "MyOrder",
    components: {},
    filters: {
        dateFormat
    },
    data() {
        return {
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
            // 表格状态 新增，编辑时表格不能进行删除编辑
            tableLock: false,
            listLoading: false,
            detailForm: {},
            show: false,
            // 订单开始时间/结束时间
            repairDateTime: [],
            postData: {
                progressStatus: "", // 申请进度 0:待确认 1:服务中 2:服务完成 3:已取消.
                serviceType: "", // 服务类型 0:信用修复报告 1:信用修复培训 2:培训&报告.
                applicationDateStart: '', // 申请时间起
                applicationDateEnd: '', // 申请时间止
                pageNo: 1,
                pageSize: 10
            },
            list: [],
            expands: [],
            totalRecords: 10
        };
    },
    mounted() {
        this.getPageList();
    },
    methods: {
        //  重置搜索条件
        resetSearch() {
            this.repairDateTime = [];
            this.postData.progressStatus = "";
            this.postData.serviceType = "";
            this.postData.applicationDateStart = "";
            this.postData.applicationDateEnd = "";
        },
        dateFormatTime(time) {
            return dateFormat(time, 'yyyy-MM-dd');
        },
        // 获取列表数据
        getPageList(option) {
            this.listLoading = true;
            if (!arrayIsNull(this.repairDateTime)) {
                this.postData.applicationDateStart = this.repairDateTime[0];
                this.postData.applicationDateEnd = this.repairDateTime[1];
            } else {
                this.postData.applicationDateStart = "";
                this.postData.applicationDateEnd = "";
            }
            Api_GetPageList(Object.assign(this.postData, option)).then(data => {
                this.listLoading = false;
                if (data.stateCode === '1') {
                    this.list = data.data.list;
                    this.totalRecords = data.data.totalRecords;
                } else {
                    // 没有返回数据
                    this.list = [];
                    this.totalRecords = 1;
                }
            })
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
        detailClick(row) {
            this.detailForm = row;
            this.show = true;
            this.tableLock = true;
        },
        sureClick() {
            this.show = false;
            this.tableLock = false;
        },
        cancleClick(row) {
            this.$confirm('确定要取消该信用修复申请吗', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                Api_CancelApplication({
                    id: row.ID
                }).then(res => {
                    if (res.stateCode === "1") {
                        this.$message.success("取消该信用修复申请成功");
                        this.getPageList()
                    } else if (res.stateCode === "3") {
                        this.$message.warning("信用修复申请不是待确认状态");
                    } else {
                        this.$message.warning("取消该信用修复申请失败");
                    }
                })
            })
        },
        // 下载方法
        downLoadFile(path) {
            Api_DownloadFileByPath(path);
        },
        changeCurrentPage() {
            this.getPageList();
        }
    }
};
</script>
