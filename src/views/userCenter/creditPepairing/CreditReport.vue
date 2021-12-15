<template>
    <div>
        <el-row style="margin-top: 24px;">
            <!-- 序号、报告编号、报告目标企业、报告名称、当前状态、报告出具日期、报告有效期 -->
            <el-table stripe class="fxb-table" v-loading="listLoading" :data="list" :expand-row-keys="expands"
                      @cell-mouse-enter="handelEnter" row-key="ID">
                <el-table-column label="序号" width="50">
                    <template slot-scope="scope">
                        <span>{{ scope.$index+(postData.pageNo - 1) * postData.pageSize + 1 }} </span>
                    </template>
                </el-table-column>
                <el-table-column label="报告编号" prop="REPORT_NO"></el-table-column>
                <el-table-column label="报告目标企业" prop="COMPANY_NAME"></el-table-column>
                <el-table-column label="报告名称">
                    <template slot-scope="scope">
                    <span v-if="scope.row.FILE_PATH !== ''">
                        {{ getFileName(scope.row.FILE_PATH) }}
                    </span>
                    </template>
                </el-table-column>
                <el-table-column label="当前状态" prop="STATUS">
                    <template slot-scope="scope">
                        <!-- 0:待生成 1:生成成功 -1:生成失败" -->
                        <span>{{ scope.row.STATUS === 0 ? '待生成' : scope.row.STATUS === 1 ? '生成成功' : scope.row.STATUS === -1 ? '生成失败' : '' }} </span>
                    </template>
                </el-table-column>
                <el-table-column label="报告出具日期" prop="UPDATE_DATE">
                    <template slot-scope="scope">
                        {{ scope.row.UPDATE_DATE | dateFormat('yyyy-MM-dd') }}
                    </template>
                </el-table-column>
                <el-table-column label="报告有效期">
                    <template slot-scope="scope">
                    <span v-if="scope.row.FILE_PATH !== ''">
                        {{ getDataTime(scope.row.UPDATE_DATE) | dateFormat('yyyy-MM-dd') }}
                    </span>
                    </template>
                </el-table-column>
                <el-table-column type="expand" width="1">
                    <template slot-scope="props">
                        <div class="row-tool-panel">
                        <span @click="downLoadFile(props.row.FILE_PATH)">
                            <svg-icon icon-class="download"/> 下载报告</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination class="fxb-page" v-loading="listLoading" v-show="totalRecords>0" :total="totalRecords"
                           :page-size="postData.pageSize" :current-page.sync="postData.pageNo"
                           @current-change="changeCurrentPage"/>

        </el-row>
    </div>
</template>

<script>
    import {dateFormat} from '@/utils/index';
    import {Api_GetReportList} from '@/api/creditRepair';
    import {Api_DownloadFileByPath} from '@/api/baseApi';

    export default {
        name: "MyOrder",
        filters: {dateFormat},
        components: {},
        data() {
            return {
                // 表格状态 新增，编辑时表格不能进行删除编辑
                tableLock: false,
                listLoading: false,
                detailForm: {},
                show: false,
                // 订单开始时间/结束时间
                repairDateTime: [],
                postData: {
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
            // 获取列表数据
            getPageList(option) {
                this.listLoading = true;
                Api_GetReportList(Object.assign(this.postData, option)).then(data => {
                    this.listLoading = false;
                    this.list = data.list;
                    this.totalRecords = data.totalRecords;
                }).catch(e => {
                    this.listLoading = false;
                    // 没有返回数据
                    this.list = [];
                    this.totalRecords = 1;
                });
            },
            getFileName(path) {
                var file = path.lastIndexOf('/');
                var fileName = path.substring(file + 1);
                var pattern = /\.{1}[a-z]{1,}$/;
                return (fileName.slice(0, pattern.exec(fileName).index));
            },
            getDataTime(time) {
                var date = new Date(time);
                date.setDate(date.getDate() - 1);
                var month = date.getMonth() + 1;
                var day = date.getDate();
                return (date.getFullYear() + 1) + '-' + this.getFormatDate(month) + '-' + this.getFormatDate(day);
            },
            getFormatDate(arg) {
                if (arg === undefined || arg === '') {
                    return '';
                }

                var re = arg + '';
                if (re.length < 2) {
                    re = '0' + re;
                }

                return re;
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
