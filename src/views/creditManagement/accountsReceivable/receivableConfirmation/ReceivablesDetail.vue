<template>
    <div>
        <div class="page-header">
            <h1 class="page-name">
                <span>应收确认详情</span>
            </h1>
            <div>
                <el-button @click="backClick">返回</el-button>
            </div>
        </div>
        <div class="page-content">
            <el-form ref="displayInfo" :model="displayInfo" label-width="100px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="应收编码">{{ displayInfo.code }}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="客户名称">{{ displayInfo.customerName }}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="合同名称">{{ displayInfo.contractName }}</el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-divider class="detail-divider"></el-divider>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="付款条件">{{ displayInfo.payConditionName||'-' }}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="预付金额">{{ $toMoney(displayInfo.payAmount) }} 元</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="待抵扣金额">{{ $toMoney(displayInfo.waitDeductionMoney) }} 元</el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-divider class="detail-divider"></el-divider>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="发货金额">{{ $toMoney(displayInfo.money) }} 元</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="本次应收">
                            {{ displayInfo.money>displayInfo.waitDeductionMoney
                            ?$toMoney(displayInfo.money-displayInfo.waitDeductionMoney)
                            :'0.00' }} 元
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="确认状态">{{ displayInfo.state }}</el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-divider class="detail-divider"></el-divider>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="确认日期">{{ displayInfo.confirmDate }}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="到期日">{{ displayInfo.endDate }}</el-form-item>
                    </el-col>
                </el-row>
                <!-- table payment BEGIN -->
                <el-form ref="form" :model="form">
                    <div class="sub-title">付款计划</div>
                    <TableWrapper ref="ref_paymentPlan" :data="form.paymentPlans" :query="{}" :columns="paymentPlanCol" />
                </el-form>
                <!-- table payment END -->
                <!-- table shipping BEGIN -->
                <div class="sub-title">出库情况登记</div>
                <TableWrapper
                    ref="child_change"
                    :data="shippingApplications"
                    :query="{}"
                    :columns="shippingApplicationsCol"
                    style="margin-bottom: 10px"
                />
                <!-- table shipping END -->
                <el-form-item label="出库备注">{{ displayInfo.outRemark }}</el-form-item>
                <el-divider class="detail-divider"></el-divider>
                <el-form-item label="出库日期">{{ $dateFormat(displayInfo.outTime) }}</el-form-item>
                <el-divider class="detail-divider"></el-divider>
                <el-form-item label="出库附件">
                    <ImgView :urls="displayInfo.outUrls"></ImgView>
                </el-form-item>
                <el-divider class="detail-divider"></el-divider>
            </el-form>
        </div>
    </div>
</template>

<script>
import { Api_ReceivableApplyDetail } from "@/api/creditManagement/accountsReceivable/receivableConfirmation.js";
import ImgView from "@/components/ImgView/index.vue";

export default {
    name: "ReceivablesDetail",
    components: { ImgView },
    data() {
        return {
            pageStatus: "",
            rowData: {},
            /**
             * display@displayInfo
             */
            displayInfo: {
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
            },
            form: {
                paymentPlans: []
            },
            paymentPlanCol: [
                { label: "付款描述", key: "paymentDescribe" },
                {
                    label: "计划付款金额(元)",
                    key: "planAmount",
                    align: "right",
                    render: (h, data, row) => {
                        return this.$toMoney(data);
                    }
                },
                {
                    label: "计划付款比例(%)",
                    key: "planAmount",
                    align: "right",
                    render: (h, data, row) => {
                        return data && this.displayInfo.money
                            ? (
                                  (data * 100) /
                                  (this.displayInfo.money > this.displayInfo.waitDeductionMoney
                                      ? this.displayInfo.money - this.displayInfo.waitDeductionMoney
                                      : 0)
                              ).toFixed(2) + "%"
                            : "";
                    }
                },
                {
                    label: "确认日期",
                    key: "payDate",
                    render: (h, data, row) => {
                        return this.$dateFormat(data);
                    }
                },
                {
                    label: "到期日",
                    key: "endDate",
                    render: (h, data, row) => {
                        return this.$dateFormat(data);
                    }
                }
            ],
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
                { label: "应发数量", key: "thisSendNum", align: "right" },
                {
                    label: "应发金额(元)",
                    key: "thisMoneyOfSend",
                    align: "right",
                    render: (h, data, row) => {
                        return this.$toMoney(data);
                    }
                },
                { label: "实发数量", key: "thisSendNumAct", align: "right" },
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
    methods: {
        initPage(_pageStatus, _rowData) {
            this.pageStatus = _pageStatus;
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
            this.form.paymentPlans = [];
            this.shippingApplications = [];
            /**
             * @showDetail
             */
            const loading = this.$openLoading();
            Api_ReceivableApplyDetail(_rowData.id).then(res => {
                loading.close();
                this.displayInfo.code = res.code;
                this.displayInfo.customerName = res.contractInfo.customerName;
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
                if (res.transientPaymentList && res.transientPaymentList.length) {
                    for (let i = 0; i < res.transientPaymentList.length; i++) {
                        this.form.paymentPlans.push({
                            code: res.transientPaymentList[i].code,
                            paymentDescribe: this.pageStatus === "info" ? res.transientPaymentList[i].paymentDescribe : "",
                            planAmount: res.transientPaymentList[i].planAmount,
                            prepaid: 0,
                            lastPayTime: "",
                            receivable: 0,
                            payDate: this.$dateFormat(res.transientPaymentList[i].payDate, "yyyy-MM-dd"),
                            endDate: this.$dateFormat(res.transientPaymentList[i].endDate, "yyyy-MM-dd")
                        });
                    }
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
            this.$emit("hideReceivablesEditDetail");
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
