<template>
    <div>
        <el-row class="fxb-table-tool">
            <el-form>
                <el-form-item>
                    <el-row :gutter="10" type="flex" align="middle">
                        <el-col :span="5">
                            <el-select v-model="orderState" placeholder="订单状态" size="small">
                                <el-option v-for="item in orderStates" :key="item.value" :label="item.label"
                                           :value="item.value"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="5">
                            <el-input v-model="courseName" placeholder="订单名称" size="small"></el-input>
                        </el-col>
                        <el-col :span="10">
                            <el-date-picker v-model="orderDateTime" type="datetimerange" size="small"
                                            style="width: 100%;" range-separator="~" start-placeholder="订单开始时间"
                                            end-placeholder="订单结束时间" value-format="yyyy-MM-dd" format="yyyy-MM-dd">
                            </el-date-picker>
                        </el-col>
                        <el-col :span="6">
                            <el-button type="primary" icon="el-icon-search" @click="searchQuery()" size="small">查询
                            </el-button>
                            <el-button icon="el-icon-refresh" size="small" @click="resetSearch()">重置</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <!-- 表格内容展示开始 -->
            <el-table stripe class="fxb-table" v-loading="listLoading" :data="list" :expand-row-keys="expands"
                      @cell-mouse-enter="handelEnter" row-key="ID">
                <el-table-column label="订单编号" prop="orderNo"></el-table-column>
                <el-table-column label="订单名称" prop="orderName"></el-table-column>
                <el-table-column label="订单状态" prop="orderStatusDesc"></el-table-column>
                <el-table-column label="订单金额" prop="orderPrice"></el-table-column>
                <el-table-column label="订单时间" prop="createDate"></el-table-column>
                <el-table-column type="expand" width="1">
                    <template slot-scope="props">
                        <div class="row-tool-panel">
                        <span v-if="props.row.orderStatus === '0'"
                              @click="openOrderPayDialog(props.row.orderNo, props.row.orderName, props.row.orderPrice, props.row.actualAmount, props.row.createDate, props.row.payType)">
                            <svg-icon icon-class="edit"/> 去付款</span>
                            <span @click="deleteOrder(props.row.id)">
                            <svg-icon icon-class="delete"/> 删除</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination class="fxb-page" v-show="totalRecords>0" :total="totalRecords" :page-size="pageSize"
                           :current-page.sync="pageNo" @current-change="changeCurrentPage"/>
        </el-row>
        <OrderPay ref="orderPayDialog"/>
    </div>
</template>

<script>
    import {Api_DeleteOrder, difference, Api_FindOrderListByPage} from '@/api/userCenter/orderManage';
    import {getUserInfo} from '@/utils/auth';
    import {dateFormat} from '@/utils/index';
    import OrderPay from "./OrderPay";

    export default {
        name: "Course",
        components: {
            OrderPay
        },
        filters: {
            dateFormat
        },
        data() {
            return {
                listLoading: false,
                // 订单开始时间/结束时间
                orderDateTime: [],
                expands: [],
                // 订单状态 0:待付款 1:已付款 -1:已关闭 2:已完成
                orderStates: [{
                    value: "0",
                    label: "待付款"
                },
                    {
                        value: "1",
                        label: "已付款"
                    },
                    {
                        value: "-1",
                        label: "已关闭"
                    }
                ],
                // 订单状态
                orderState: '',
                // 公司名称
                courseName: '',
                // 列表数据
                list: [],
                pageNo: 1,
                pageSize: 10,
                totalRecords: 1
            };
        },
        // 初始化数据
        created: function () {
            // 获取分页列表
            this.getPageList();
        },
        methods: {
            // 重置搜索条件
            resetSearch() {
                this.orderDateTime = [];
                this.orderState = '';
                this.courseName = '';
            },
            // 条件搜索
            searchQuery() {
                this.getPageList();
            },
            handelEnter(row, column, cell, event) {
                // 如果订单状态是已付款，不显示是操作栏
                if (row.ORDER_STATUS === 1) {
                    // 收起当前行
                    this.expands.shift();
                    return;
                }
                const cindex = this.expands.indexOf(row.ID);
                if (!this.tableLock) {
                    if (cindex < 0) {
                        this.expands.shift();
                        this.expands.push(row.ID);
                    }
                }
            },
            // 改变分页
            changeCurrentPage() {
                this.getPageList();
            },
            // 获取列表数据
            getPageList() {
                this.listLoading = true;
                Api_FindOrderListByPage({
                    currentPage: this.pageNo,
                    pageSize: this.pageSize,
                    orderType: '4', // 培训课程申请订单类型
                    orderStatus: this.orderState,
                    orderName: this.courseName,
                    startDate: this.orderDateTime[0],
                    endDate: this.orderDateTime[1]
                }).then(data => {
                    this.listLoading = false;
                    this.list = data.data;
                    this.totalRecords = data.totalRecordNumber;
                }).catch(e => {
                    this.listLoading = false;
                });
            },
            // 撤销订单
            deleteOrder(orderId) {
                this.$confirm('确认删除？', '提示', {
                    type: 'warning'
                }).then(() => {
                    Api_DeleteOrder(orderId).then(res => {
                        this.getPageList();
                        this.$message.success("订单已删除");
                    }).catch(e => {
                        this.$message.error(e);
                    });
                });
            },
            // 打开支付弹窗
            openOrderPayDialog(orderNo, content, orderPrice, actualAmount, createDate, payType) {
                // 先判断当前时间差是否超过60分钟，如果是，则不能支付
                const diff = difference(createDate);
                if (diff >= 60) {
                    this.$message.error("该订单超时未支付，订单已关闭，请重新提交申请");
                    return;
                }
                this.$refs.orderPayDialog.openDialog(orderNo, content, orderPrice, actualAmount, payType);
            }
        }
    };
</script>
