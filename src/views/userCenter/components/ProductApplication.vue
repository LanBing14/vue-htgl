<template>
    <div id="FinancingNeedsBox">
        <el-row>
            <el-col :span="2" style="line-height: 30px;">办理进度：</el-col>
            <el-col :span="10">
                <div id="progressStateBox">
                    <el-radio-group v-model="progressState" size="small">
                        <el-radio-button label="全部"></el-radio-button>
                        <el-radio-button label="待处理"></el-radio-button>
                        <el-radio-button label="已签约"></el-radio-button>
                        <el-radio-button label="已撤销"></el-radio-button>
                        <el-radio-button label="已下线"></el-radio-button>
                    </el-radio-group>
                </div>
            </el-col>
            <el-col :span="12" style="text-align: right;">
                <el-button icon="el-icon-document" size="small">我要申请</el-button>
            </el-col>
        </el-row>
        <br>
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="date" label="申请日期"></el-table-column>
            <el-table-column prop="name" label="产品名称"></el-table-column>
            <el-table-column prop="cooperation" label="合作机构"></el-table-column>
            <el-table-column prop="money" label="申请金额（万元）"></el-table-column>
            <el-table-column prop="month" label="用款期限（月）"></el-table-column>
            <el-table-column prop="progress" label="办理进度"></el-table-column>
            <el-table-column prop="operation" label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="showDetail(scope.row.ID)">查看</el-button>
                    <el-button size="mini" type="text" @click="showDetail(scope.row.ID)">撤销</el-button>
                </template>
            </el-table-column>
        </el-table>
        <br>
        <el-pagination
            class="fxb-page"
            v-show="totalRecords>0"
            :total="totalRecords"
            :page-size="pageSize"
            :current-page.sync="pageNo"
            @current-change="changeCurrentPage"
        />

        <el-dialog
            title="产品申请查看"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            width="470px"
            :before-close="beforeBatchSetClose"
        >
            <el-row>
                <el-col :span="4" style="line-height: 30px;">产品名称：</el-col>
                <el-col :span="20" style="line-height: 30px;">十五字十五字十五字十五字十五字</el-col>
            </el-row>
            <el-row>
                <el-col :span="4" style="line-height: 30px;">发布机构：</el-col>
                <el-col :span="20" style="line-height: 30px;">建设银行苏州支行</el-col>
            </el-row>
            <el-row>
                <el-col :span="4" style="line-height: 30px;">办理进度：</el-col>
                <el-col :span="8" style="line-height: 30px;">待处理</el-col>
                <el-col :span="4" style="line-height: 30px;">发布时间：</el-col>
                <el-col :span="8" style="line-height: 30px;">2019-4-9 14:21:36</el-col>
            </el-row>

            <br>
            <el-tabs
                type="card"
                id="dialogTabs"
                v-model="dialogActiveName"
                @tab-click="dialogHandleClick"
            >
                <el-tab-pane label="申请信息" name="first">
                    <el-row>
                        <el-col :span="5" style="line-height: 30px;">贷款金额：</el-col>
                        <el-col :span="19" style="line-height: 30px;">500.00万元</el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="5" style="line-height: 30px;">贷款期限：</el-col>
                        <el-col :span="19" style="line-height: 30px;">12个月</el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="5" style="line-height: 30px;">资金用途：</el-col>
                        <el-col :span="19" style="line-height: 30px;">研发投入</el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="5" style="line-height: 30px;">担保方式：</el-col>
                        <el-col :span="19" style="line-height: 30px;">抵押</el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="报送信息" name="second">
                    <el-row>
                        <el-col :span="5" style="line-height: 30px;">征信报告：</el-col>
                        <el-col :span="19" style="line-height: 30px;">
                            <a href="javascript:void(0);">2018年财务报表.xlsx</a>
                            <a href="javascript:void(0);">2018年财务报表.xlsx</a>
                            <a href="javascript:void(0);">2018年财务报表.xlsx</a>
                            <a href="javascript:void(0);">2018年财务报表.xlsx</a>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="5" style="line-height: 30px;">财务报告：</el-col>
                        <el-col :span="19" style="line-height: 30px;">
                            <a href="javascript:void(0);">2018年财务报表.xlsx</a>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="签约情况" name="third">
                    <!-- 已签约 -->
                    <div class="signBox">
                        <span>签约机构</span>
                        <span>1</span>
                        <span>签约产品</span>
                        <span>1</span>
                        <span>放贷金额</span>
                        <span>
                            1
                            <i class="unit" style="color: #409efe;">万元</i>
                        </span>
                        <span>年化利率</span>
                        <span>
                            1
                            <i class="unit">(%)</i>
                        </span>
                        <span>担保方式</span>
                        <span>1</span>
                        <span>用款期限</span>
                        <span>
                            1
                            <i class="unit">个月</i>
                        </span>
                        <span>签约时间</span>
                        <span>1</span>
                        <span>放款时间</span>
                        <span>1</span>
                    </div>

                    <!-- 已拒绝 -->
                    <div id="refuseBox">
                        <el-row>
                            <el-col :span="5" style="line-height: 30px;">审核时间：</el-col>
                            <el-col :span="19" style="line-height: 30px;">12个月</el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="5" style="line-height: 30px;">审核意见：</el-col>
                            <el-col :span="19" style="line-height: 30px;">信用状况不满足产品要求，没有与客户达成一致意见。信用状况不满足产品要求，没有与客户达成一致意见。</el-col>
                        </el-row>
                    </div>
                </el-tab-pane>
            </el-tabs>

            <div slot="footer" class="dialog-footer" style="text-align: center;">
                <el-button type="primary" :loading="batchSetLoading" size="small">确定</el-button>
                <el-button @click="beforeBatchSetClose" size="small">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "ProductApplication",
    components: {},
    data() {
        return {
            progressState: "全部",
            tableData: [
                {
                    date: "2016-05-02",
                    name: "10.00万元",
                    cooperation: "10.00万元",
                    money: "12",
                    month: "10.00万元",
                    progress: "待处理"
                },
                {
                    date: "2016-05-02",
                    name: "10.00万元",
                    cooperation: "10.00万元",
                    money: "12",
                    month: "10.00万元",
                    progress: "待处理"
                },
                {
                    date: "2016-05-02",
                    name: "10.00万元",
                    cooperation: "10.00万元",
                    money: "12",
                    month: "10.00万元",
                    progress: "待处理"
                },
                {
                    date: "2016-05-02",
                    name: "10.00万元",
                    cooperation: "10.00万元",
                    money: "12",
                    month: "10.00万元",
                    progress: "待处理"
                }
            ],
            pageNo: 1,
            pageSize: 10,
            totalRecords: 1,
            dialogVisible: false,
            dialogActiveName: "first",
            batchSetLoading: false
        };
    },
    methods: {
        showDetail() {
            this.dialogVisible = true;
        },
        dialogHandleClick() {},
        beforeBatchSetClose() {
            this.dialogVisible = false;
        },
        changeCurrentPage() {}
    }
};
</script>

<style rel="stylesheet/scss" lang="scss">
#progressStateBox {
    .el-radio-button .el-radio-button__inner {
        border: none;
    }
    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        background: none;
        color: #4b9df3;
        box-shadow: none;
    }
}
.usercenter-container #dialogTabs {
    .el-tabs__nav-wrap {
        border-radius: 5px;
    }
    .el-tabs__item {
        padding: 0 43px;
        font-size: 14px;
        line-height: 40px;
        color: #333333;
        &.is-active {
            background-color: #409efe;
            color: #ffffff;
        }
    }
    .el-tabs__header {
        margin-bottom: 0;
    }
    .el-tabs__content {
        padding: 20px 0;
    }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.usercenter-container #dialogTabs {
    a {
        color: #409efe;
    }
}
.signBox {
    display: flex;
    flex-wrap: wrap;
    border: 1px solid #e0e3ec;
    border-bottom: none;
    span {
        flex: 0 0 25%;
        line-height: 40px;
        border-bottom: 1px solid #e0e3ec;
        position: relative;
        &:nth-child(odd) {
            background-color: #f7f8fc;
            text-align: center;
        }
        &:nth-child(even) {
            padding: 0 10px;
        }
        .unit {
            position: absolute;
            right: 10px;
            top: 0;
            bottom: 0;
            font-style: normal;
            font-size: 12px;
        }
    }
}
</style>
