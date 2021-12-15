<template>
<div class="fxb-edit-table">
    <el-row class="fxb-table-tool">
        <el-form>
            <el-form-item label="提醒类型：" class="fxb-tag-list  marT-2 marB0">
                <span :class="{'active':remindType === 0}" @click="changeRemindType(0)">全部</span>
                <span :class="{'active':remindType === 1}" @click="changeRemindType(1)">合同到期</span>
                <span :class="{'active':remindType === 2}" @click="changeRemindType(2)">财务到期</span>
                <span :class="{'active':remindType === 3}" @click="changeRemindType(3)">事项到期</span>
            </el-form-item>
            <el-form-item label="计划时间：" class="fxb-tag-list marT5">
                <span :class="{'active':queryType === 0}" @click="changeQueryType(0)">全部</span>
                <span :class="{'active':queryType === 1}" @click="changeQueryType(1)">1-7天</span>
                <span :class="{'active':queryType === 2}" @click="changeQueryType(2)">8-15天</span>
                <span :class="{'active':queryType === 3}" @click="changeQueryType(3)">16-30天</span>
                <span :class="{'active':queryType === 4}" @click="changeQueryType(4)">逾期</span>
                <el-date-picker v-model="dateRange" type="daterange" :picker-options="pickerOptions" range-separator="~" start-placeholder="预计时间起" end-placeholder="预计时间止" size="small" @change="dateRangeChange" align="center" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
        </el-form>
    </el-row>

    <el-table class="fxb-table" v-loading="tableLoading" :data="tableData" stripe row-key="ID" :expand-row-keys="expands" @cell-mouse-enter="handelEnter">
        <el-table-column label="合同名称/编号">
            <template slot-scope="scope">
                <template v-if="scope.row.CONTRACT_NAME.length > 10">
                    <span :title="scope.row.CONTRACT_NAME">{{ scope.row.CONTRACT_NAME.substring(0, 10) + '...' }}</span>
                </template>
                <template v-else>
                    <span>{{ scope.row.CONTRACT_NAME }}</span>
                </template>
                <br />
                <template v-if="scope.row.CONTRACT_NO.length > 10">
                    <span :title="scope.row.CONTRACT_NO">{{ scope.row.CONTRACT_NO.substring(0, 10) + '...' }}</span>
                </template>
                <template v-else>
                    <span>{{ scope.row.CONTRACT_NO }}</span>
                </template>
            </template>
        </el-table-column>
        <el-table-column label="提醒类型" prop="REMIND_TYPE"></el-table-column>
        <el-table-column label="事项类型">
            <template slot-scope="scope">
                <template v-if="scope.row.REMIND_TYPE === '事项到期'">
                    <template v-if="scope.row.ITEM_TYPE === '0'">
                        发货
                    </template>
                    <template v-else-if="scope.row.STATUS === '1'">
                        收货
                    </template>
                    <template v-else-if="scope.row.STATUS === '2'">
                        其他
                    </template>
                </template>
                <template v-else-if="scope.row.REMIND_TYPE === '财务到期'">
                    <template v-if="scope.row.ITEM_TYPE === '0'">
                        回款
                    </template>
                    <template v-else-if="scope.row.STATUS === '1'">
                        付款
                    </template>
                    <template v-else-if="scope.row.STATUS === '2'">
                        开票
                    </template>
                    <template v-else-if="scope.row.STATUS === '3'">
                        收票
                    </template>
                    <template v-else-if="scope.row.STATUS === '4'">
                        其他
                    </template>
                </template>
            </template>
        </el-table-column>
        <el-table-column label="名称" prop="NAME"></el-table-column>
        <el-table-column label="预计时间" prop="TO_DATE"></el-table-column>
        <el-table-column type="expand" width="1">
            <template slot-scope="props">
                <div class="row-tool-panel">
                    <span @click="viewContract(props.row)">
                        <svg-icon icon-class="detail" /> 查看</span>
                </div>
            </template>
        </el-table-column>
    </el-table>

    <el-pagination class="fxb-page" v-loading="tableLoading" v-show="totalRecords>0" :total="totalRecords" :page-size="pageSize" :current-page.sync="pageNo" @current-change="changeCurrentPage" />
</div>
</template>

<script>
    import {Api_ContractRemindPageList} from '@/api/userCenter/contractManage'

    export default {
    data() {
        return {
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
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
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
            remindType: 0,
            queryType: 0
        };
    },
    // 初始化数据
    created: function () {
        // 获取分页列表
        this.getPageList();
    },
    methods: {
        handelEnter(row, column, cell, event) {
            const cindex = this.expands.indexOf(row.ID);
            if (cindex < 0) {
                this.expands.shift();
                this.expands.push(row.ID);
            }
        },
        changeCurrentPage() {
            this.getPageList();
        },
        changeRemindType(remindType) {
            this.remindType = remindType;
            this.getPageList();
        },
        changeQueryType(queryType) {
            this.queryType = queryType;
            this.getPageList();
        },
        dateRangeChange() {
            this.getPageList(this.dateRange[0], this.dateRange[1]);
        },
        infoItem(row) {},
        /**
         * 获取列表数据
         */
        getPageList(startDate, endDate) {
            this.tableLoading = true;
            Api_ContractRemindPageList({
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                startDate: startDate,
                endDate: endDate,
                queryType: this.queryType, // 0:全部 1:表示1-7天 2:表示8-15天 3:表示16-30天 4:表示逾期未完成
                remindType: this.remindType // 0:全部 1:合同提醒 2:财务提醒 3:事项提醒
            }).then(data => {
                this.tableLoading = false;
                this.expands = [];
                if (data.stateCode === '1') {
                    this.tableData = data.data.list;
                    this.totalRecords = data.data.totalRecords;
                } else if (data.stateCode === '80205') {
                    // 权限不够
                    // this.$message.warning('您尚未完成企业认证，当前仅可查看');
                    this.$confirm('您尚未完成企业认证，当前仅可查看', '提示', {
                        showCancelButton: true,
                        confirmButtonText: '前往认证',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$router.push({
                            path: "/userCenter/setting/basicinfo"
                        });
                    })
                    this.tableData = [];
                } else {
                    // 没有返回数据
                    this.tableData = [];
                    this.totalRecords = 0;
                }
            })
        },
        viewContract(row) {
            this.$router.push({
                path: "/userCenter/contract/contractinfo",
                query: {
                    id: row.CONTRACT_ID,
                    route: 'remind'
                }
            });
        }
    }
};
</script>
