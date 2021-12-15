<template>
    <div>
        <div class="page-header">
            <h1 class="page-name">
                <span>应收账款确认审批</span>
            </h1>
            <div>
                <el-button @click="backClick">返回</el-button>
            </div>
        </div>
        <div class="page-content">
            <el-form ref="displayInfo" :model="displayInfo" label-width="100px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="应收编码" prop="code">
                            <el-input v-model="displayInfo.code" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="客户名称" prop="customerName">
                            <el-input v-model="displayInfo.customerName" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="合同名称" prop="contractName">
                            <el-input :value="displayInfo.contractName" disabled>
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="应收金额">
                            <el-input
                                :value="displayInfo.money>displayInfo.waitDeductionMoney?$toMoney(displayInfo.money-displayInfo.waitDeductionMoney):'0.00'"
                                disabled
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="付款条件" prop="payConditionName">
                            <el-input v-model="displayInfo.payConditionName" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="确认状态" prop="state">
                            <el-input v-model="displayInfo.state" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="确认日期" prop="confirmDate">
                            <el-input v-model="displayInfo.confirmDate" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="到期日" prop="endDate">
                            <el-input v-model="displayInfo.endDate" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- table payment BEGIN -->
                <div class="sub-title">
                    付款计划
                    <div>
                        <el-button @click="addPlan" v-if="pageStatus!=='info'">新增</el-button>
                    </div>
                </div>
                <div class="payment-plan">
                    <div class="payment-plan-thead">
                        <div style="flex: 0 50px" class="payment-plan-th payment-plan-th-color">序号</div>
                        <div style="flex: 2" class="payment-plan-th payment-plan-th-color">付款描述</div>
                        <div style="flex: 1.2" class="payment-plan-th payment-plan-th-color">计划付款金额(元)</div>
                        <div style="flex: 1.2" class="payment-plan-th payment-plan-th-color">计划付款比例(%)</div>
                        <div style="flex: 1.2" class="payment-plan-th payment-plan-th-color">确认日期</div>
                        <div style="flex: 1.2" class="payment-plan-th payment-plan-th-color">到期日</div>
                        <div style="flex: 1.2" class="payment-plan-th payment-plan-th-color">最近收款时间</div>
                        <div style="flex: 0 100px" class="payment-plan-th payment-plan-th-color" v-if="pageStatus!=='info'">操作</div>
                    </div>
                    <div class="payment-plan-tbody" v-for="(item, index) in paymentPlans" :key="index">
                        <div style="flex: 0 50px" class="payment-plan-th">{{ index + 1 }}</div>
                        <div style="flex: 2" class="payment-plan-th">
                            <el-input
                                v-model="item.paymentDescribe"
                                class="plan-input"
                                :disabled="pageStatus==='info'"
                                placeholder="付款描述"
                            ></el-input>
                        </div>
                        <div style="flex: 1.2" class="payment-plan-th">
                            <el-input v-model="item.planAmount" :disabled="pageStatus==='info'" class="plan-input"></el-input>
                        </div>
                        <div
                            style="flex: 1.2"
                            class="payment-plan-th"
                        >{{ (item.planAmount&&displayInfo.money)?(item.planAmount*100/displayInfo.money+'%'):'' }}</div>
                        <div style="flex: 1.2" class="payment-plan-th">
                            <el-date-picker
                                v-model="item.payDate"
                                value-format="yyyy-MM-dd"
                                class="plan-input"
                                type="date"
                                :disabled="pageStatus==='info'"
                                placeholder="选择日期"
                            ></el-date-picker>
                        </div>
                        <div style="flex: 1.2" class="payment-plan-th">
                            <el-date-picker
                                v-model="item.endDate"
                                value-format="yyyy-MM-dd"
                                class="plan-input"
                                type="date"
                                :disabled="pageStatus==='info'"
                                placeholder="选择日期"
                            ></el-date-picker>
                        </div>
                        <div style="flex: 1.2" class="payment-plan-th">
                            <el-date-picker
                                v-model="item.lastPayTime"
                                value-format="yyyy-MM-dd"
                                class="plan-input"
                                type="date"
                                :disabled="pageStatus==='info'"
                                placeholder="最近收款时间"
                            ></el-date-picker>
                        </div>
                        <div style="flex: 0 100px" class="payment-plan-th" v-if="pageStatus!=='info'">
                            <el-button type="danger" @click="paymentPlanDel(index)">删除</el-button>
                        </div>
                    </div>
                </div>
                <!-- table payment END -->
                <!-- table shipping BEGIN -->
                <div class="sub-title">出库情况登记</div>
                <TableWrapper
                    ref="child"
                    :data="shippingApplications"
                    :query="{}"
                    :columns="shippingApplicationsCol"
                    style="margin-bottom: 20px"
                />
                <!-- table shipping END -->
                <el-form-item label="出库备注" prop="outRemark">
                    <el-input
                        v-model="displayInfo.outRemark"
                        disabled
                        placeholder="请输入发货备注"
                        type="textarea"
                        :rows="4"
                        style="top: 0"
                    ></el-input>
                </el-form-item>
                <el-form-item label="出库日期" prop="outTime">
                    <el-date-picker
                        v-model="displayInfo.outTime"
                        disabled
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="请输入拟定出库日期"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="出库附件" prop="outUrls">
                    <ImgView :urls="displayInfo.outUrls"></ImgView>
                </el-form-item>
            </el-form>
            <slot></slot>
        </div>
    </div>
</template>

<script>
import {
    Api_ReceivableApplyDetailTodo,
    Api_ReceivableApplySubmit
} from "@/api/creditManagement/accountsReceivable/receivableConfirmation.js";
import { Api_PaymentConditionsDetail } from "@/api/creditManagement/accountsReceivable/paymentManagement.js";
import ImgView from "@/components/ImgView/index.vue";

export default {
    name: "ReceivablesEditDetail",
    components: { ImgView },
    props: {
        row: Object
    },
    data() {
        return {
            pageStatus: "info",
            rowData: {},
            /**
             * display@displayInfo
             */
            displayInfo: {
                code: "",
                customerName: "",
                contractAvailable: "",
                contractName: "",
                payAmount: 0,
                waitDeductionMoney: 0,
                money: 0,
                payConditionName: "",
                state: "",
                confirmDate: "",
                endDate: "",
                outRemark: "",
                outTime: "",
                url: "",
                outUrls: []
            },
            paymentPlans: [],
            shippingApplications: [],
            shippingApplicationsCol: [
                { label: "产品/服务名称", key: "name" },
                { label: "规格型号", key: "type" },
                { label: "销售单位", key: "company" },
                {
                    label: "单价(元)",
                    key: "unitPrice",
                    align: "right",
                    render: (h, data, row) => {
                        return this.$toMoney(data);
                    }
                },
                { label: "应发数量", key: "thisSendNum" },
                {
                    label: "应发金额(元)",
                    key: "thisMoneyOfSend",
                    align: "right",
                    render: (h, data, row) => {
                        return this.$toMoney(data);
                    }
                },
                { label: "实发数量", key: "thisSendNumAct" },
                {
                    label: "实发金额(元)",
                    key: "thisMoneyOfSendAct",
                    align: "right",
                    render: (h, data, row) => {
                        return this.$toMoney(data);
                    }
                }
            ]
        };
    },
    mounted() {
        this.initPage(this.row);
    },
    methods: {
        initPage(_rowData) {
            this.rowData = _rowData;
            /**
             * a@empty
             */
            this.displayInfo = {
                code: "",
                customerName: "",
                contractName: "",
                payAmount: 0,
                waitDeductionMoney: 0,
                money: 0,
                payConditionName: "",
                state: "",
                confirmDate: "",
                endDate: "",
                outRemark: "",
                outTime: "",
                url: "",
                outUrls: []
            };
            this.paymentPlans = [];
            this.shippingApplications = [];
            /**
             * @showDetail
             */
            Api_ReceivableApplyDetailTodo(_rowData.business_key).then(res => {
                this.displayInfo.code = res.code;
                this.displayInfo.customerName = res.contractInfo.customerName;
                this.displayInfo.contractAvailable = res.contractInfo.contractAvailable;
                this.displayInfo.contractName = res.contractInfo.contractName + "/" + res.contractInfo.contractCode;
                this.displayInfo.payAmount = res.contractInfo.payAmount;
                this.displayInfo.waitDeductionMoney = res.outGoodsInfo.waitDeductionMoney;
                this.displayInfo.payConditionName = res.contractInfo.payConditionName;
                this.displayInfo.money = res.outGoodsInfo.money;
                this.displayInfo.state =
                    res.state === "1"
                        ? "待提交"
                        : res.state === "2"
                        ? "待审核"
                        : res.state === "3"
                        ? "已确认"
                        : res.state === "0"
                        ? "已打回"
                        : "";
                this.displayInfo.confirmDate = this.$dateFormat(res.confirmDate, "yyyy-MM-dd");
                this.displayInfo.endDate = this.$dateFormat(res.endDate, "yyyy-MM-dd");
                // payCondition
                for (let i = 0; i < res.transientPaymentList.length; i++) {
                    this.paymentPlans.push({
                        code: res.transientPaymentList[i].code,
                        paymentDescribe: this.pageStatus === "info" ? res.transientPaymentList[i].paymentDescribe : "",
                        planAmount: res.transientPaymentList[i].planAmount,
                        prepaid: 0,
                        lastPayTime: this.$dateFormat(res.transientPaymentList[i].lastPayTime),
                        receivable: 0,
                        payDate: this.$dateFormat(res.transientPaymentList[i].payDate, "yyyy-MM-dd"),
                        endDate: this.$dateFormat(res.transientPaymentList[i].endDate, "yyyy-MM-dd")
                    });
                }
                // shippingApplications
                this.shippingApplications = res.outGoodsInfo.goods;
                this.displayInfo.outRemark = res.outGoodsInfo.remark;
                this.displayInfo.outTime = this.$dateFormat(res.outGoodsInfo.time, "yyyy-MM-dd");
                this.displayInfo.outUrls = res.outGoodsInfo.urls;
                this.displayInfo.url = res.outGoodsInfo.urls ? res.outGoodsInfo.urls[0] : "";
            });
        },
        backClick() {
            this.$emit("edit", false);
        },
        /**
         * method@增加计划
         */
        addPlan() {
            this.paymentPlans.push({
                code: "",
                paymentDescribe: "",
                planAmount: 0,
                prepaid: 0,
                lastPayTime: "",
                receivable: 0,
                payDate: this.$dateFormat(new Date(), "yyyy-MM-dd"),
                endDate: this.$dateFormat(new Date(), "yyyy-MM-dd")
            });
        },
        /**
         * method@删除计划
         */
        paymentPlanDel(_index) {
            this.paymentPlans.splice(_index, 1);
        },
        /**
         * method@应收确认编辑
         */
        recieveSubmit() {
            const timeArr = [];
            for (let i = 0; i < this.paymentPlans.length; i++) {
                timeArr.push(new Date(this.paymentPlans[i].endDate).getTime());
            }
            Api_ReceivableApplySubmit(this.rowData.business_key, {
                endDate: this.$dateFormat(Math.min.apply(null, timeArr), "yyyy-MM-dd"),
                plans: this.paymentPlans
            })
                .then(() => {
                    this.$message.success("编辑成功！");
                    this.$emit("hideReceivablesEditDetail");
                    this.$emit("getList");
                })
                .catch(res => {
                    this.$message.error(res);
                });
        }
    }
};
</script>

<style lang="scss" scoped>
.payment-plan {
    margin-bottom: 20px;
    border-top: 1px solid #dee2e6;
    border-left: 1px solid #dee2e6;
    border-right: 1px solid #dee2e6;

    .payment-plan-thead {
        display: flex;
        height: 48px;
        align-items: center;
        background-color: #eaedf4;
        border-bottom: 1px solid #dee2e6;
    }

    .payment-plan-tbody {
        display: flex;
        height: 48px;
        align-items: center;
        border-bottom: 1px solid #dee2e6;
    }

    .payment-plan-th-color {
        color: #7088a4;
        font-weight: bold;
    }

    .payment-plan-th {
        text-align: center;
        padding: 0 4px;
        // height: 48px;
        // line-height: 48px;
        // border-right: 1px solid #dee2e6;

        .plan-input {
            width: 100%;
        }
    }
}

/deep/ .payment-plan .el-input__icon {
    line-height: 30px !important;
}

.alert-title {
    border: 1px solid #ddd;
    color: #606266;
    font-weight: bold !important;
    border-radius: 0;
    margin-top: 20px;
}
</style>
