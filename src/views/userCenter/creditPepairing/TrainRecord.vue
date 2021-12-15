<template>
<div>
    <el-row class="fxb-table-tool">
        <el-form>
            <el-form-item>
                <el-row :gutter="10" type="flex" align="middle">
                    <el-col :span="5">
                        <el-select v-model="postData.trainClass" placeholder="培训课程" size="small">
                            <el-option :label="'黑名单信用修复'" :value="'0'">黑名单信用修复</el-option>
                            <el-option :label="'行政处罚信用修复'" :value="'1'">行政处罚信用修复</el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="5">
                        <el-select v-model="postData.trainType" placeholder="培训方式" size="small">
                            <el-option :label="'线上培训'" :value="'2'">线上培训</el-option>
                            <el-option :label="'线下培训'" :value="'1'">线下培训</el-option>
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
        <!-- 序号、培训期次、培训课程、培训方式、当前进度、考试成绩、培训时间、操作(下载培训证明) -->
        <el-table stripe class="fxb-table" v-loading="listLoading" :data="list" :expand-row-keys="expands" @cell-mouse-enter="handelEnter" row-key="ID">
            <el-table-column label="序号" width="50">
                <template slot-scope="scope">
                    <span>{{ scope.$index+(postData.pageNo - 1) * postData.pageSize + 1 }} </span>
                </template>
            </el-table-column>
            <el-table-column label="培训期次" prop="CLASS_NO"></el-table-column>
            <el-table-column label="培训班名称" prop="CLASS_NAME"></el-table-column>
            <el-table-column label="培训方式">
                <template slot-scope="scope">
                    <!-- 培训方式 1:线下培训 2:线上培训 -->
                    <span>{{ scope.row.TRAIN_TYPE === '1' ? '线下培训' : '线上培训' }} </span>
                </template>
            </el-table-column>
            <el-table-column label="考核结果">
                <template slot-scope="scope">
                    <!-- 0暂无结果，1考试合格，2考试未通过 -->
                    <span>{{ scope.row.TEST_RESULT === '0' ? '暂无结果' : scope.row.TEST_RESULT === '1' ? '考试合格' : '考试未通过' }} </span>
                </template>
            </el-table-column>
            <el-table-column label="考试成绩" prop="TEST_SCORE"></el-table-column>
            <el-table-column label="培训时间" prop="TRAIN_DATE"></el-table-column>
            <el-table-column type="expand" width="1">
                <template slot-scope="props">
                    <div class="row-tool-panel" v-show="!show">
                        <!-- <span @click="detailClick(props.row)">
                            <svg-icon icon-class="edit" /> 查看</span> -->

                        <!-- 线上培训 -->
                        <template v-if="props.row.TRAIN_TYPE === '1'">
                            <!-- <span v-if="props.row.TRAIN_STATUS === '0'">
                                <svg-icon icon-class="edit" /> 开始学习</span>
                            <span v-if="props.row.TRAIN_STATUS === '1'">
                                <svg-icon icon-class="delete" /> 前往学习</span> -->
                            <span v-if="props.row.TEST_RESULT === '1'" @click="downLoadFile(props.row.FILE_PATH)">
                                <svg-icon icon-class="download" /> 下载培训证明</span>
                            <!-- <span v-if="props.row.TEST_RESULT === '2'">
                                <svg-icon icon-class="delete" /> 重新学习</span> -->
                        </template>

                        <!-- 线下培训 -->
                        <template v-if="props.row.TRAIN_TYPE === '2'">
                            <span v-if="(props.row.TEST_RESULT === '1')&&(props.row.FILE_PATH !== '')" @click="downLoadFile(props.row.FILE_PATH)">
                                <svg-icon icon-class="download" /> 下载培训证明</span>
                            <span v-if="(props.row.TEST_RESULT === '1')&&(props.row.FILE_PATH === '')">
                                <svg-icon icon-class="download" /> 培训证明生成中</span>
                        </template>

                    </div>
                    <el-collapse-transition>
                        <div class="table-window-panel" v-show="show">
                            <el-form :label-position="'top'" :model="detailForm">
                                <el-row :gutter="60">
                                    <el-col :span="8">
                                        <el-form-item label="培训班名称">
                                            <el-input disabled v-model="detailForm.CLASS_NAME"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="24">
                                        <el-form-item label="考试成绩">
                                            <el-input :rows="5" type="textarea" disabled v-model="detailForm.TEST_SCORE"></el-input>
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
    import {Api_GetPageList} from '@/api/creditRepair'
    import {Api_DownloadFileByPath} from '@/api/baseApi'
    import {arrayIsNull} from "@/utils/commonUtils";

    export default {
    name: "MyOrder",
    components: {},
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
                trainType: "", // 培训方式 1:线下培训 2:线上培训
                trainClass: "", // 培训课程 0:黑名单信用修复 1:行政处罚信用修复
                // trainStatus: '', // 培训进度 0:尚未开始 1:培训进行中 2:考试合格 3:考试未通过
                trainDateStart: '', // 培训时间起
                trainDateEnd: '', // 培训时间止
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
            this.postData.trainType = '';
            this.postData.trainClass = '';
            // this.postData.trainStatus = '';
            this.postData.trainDateStart = '';
            this.postData.trainDateEnd = '';
        },
        // 获取列表数据
        getPageList(option) {
            this.listLoading = true;
            if (!arrayIsNull(this.repairDateTime)) {
                this.postData.trainDateStart = this.repairDateTime[0];
                this.postData.trainDateEnd = this.repairDateTime[1];
            } else {
                this.postData.trainDateStart = "";
                this.postData.trainDateEnd = "";
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
