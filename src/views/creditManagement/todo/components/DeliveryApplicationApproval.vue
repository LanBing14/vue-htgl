<template>
    <div>
        <div class="page-header">
            <h1 class="page-name">
                <span>发货申请审批{{ modelStatus ? '':'——查看' }}</span>
            </h1>
            <div>
                <el-button @click="back">返回</el-button>
            </div>
        </div>
        <div class="page-content">
            <!-- document BEGIN -->
            <el-form ref="form" :model="displayInfo" label-width="100px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="客户名称">
                            <el-select
                                v-model="displayInfo.customerId"
                                filterable
                                remote
                                reserve-keyword
                                placeholder="请输入客户名称关键字"
                                :remote-method="remoteMethod"
                                :loading="loading"
                                class="w-100"
                                disabled
                            >
                                <el-option
                                    v-for="item in clientOptions"
                                    :key="item.company_id"
                                    :label="item.company_name"
                                    :value="item.company_id"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="合同名称">
                            <el-select
                                v-model="displayInfo.contractId"
                                filterable
                                remote
                                reserve-keyword
                                class="filter-item"
                                placeholder="请输入合同名称"
                                disabled
                                :remote-method="remoteMethod2"
                                :loading="loading2"
                                @change="getContractInfo"
                            >
                                <el-option
                                    v-for="item in contract_options"
                                    :key="item.id"
                                    :label="item.contractName"
                                    :value="item.id"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- ?! -->
                <EnterpriseFile :enterpriseID="displayInfo.customerId"></EnterpriseFile>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="合同金额">
                            <el-input :value="$toMoney(displayInfo.contractAvailable)" disabled placeholder="请输入合同金额">
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="付款条件">
                            <el-input v-model="displayInfo.payConditionName" disabled placeholder="请选择付款条件"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="是否预付">
                            <el-radio-group v-model="displayInfo.prepaid">
                                <el-radio :label="1" disabled>是</el-radio>
                                <el-radio :label="0" disabled>否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="预付金额">
                            <el-input :value="$toMoney(displayInfo.payAmount)" disabled placeholder="请输入预付金额">
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="是否到账">{{ displayInfo.payed }}</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="已发货金额">
                            <el-input :value="$toMoney(displayInfo.moneyOfSend)" disabled placeholder="请输入已发货金额">
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="未结清金额">
                            <el-input :value="$toMoney(displayInfo.moneyOfWait)" disabled placeholder="请输入未结清金额">
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="逾期金额">
                            <el-input :value="$toMoney(displayInfo.moneyOfOver)" disabled placeholder="请输入逾期金额">
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="发货状态">申请发货</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="申请人">{{ nowPerson }}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="申请时间">{{ nowDate }}</el-form-item>
                    </el-col>
                </el-row>
                <div class="sub-title">合同发货清单</div>
                <TableWrapper ref="child" :data="tableColShippingData" :query="{}" :columns="tableColShippingList" />
                <div class="sub-title">本次发货申请</div>
                <TableWrapper ref="child" :data="thisShippingList" :query="{}" :columns="thisShippingListCol" />
            </el-form>
            <el-form ref="form" :model="form" label-width="120px">
                <el-form-item label="发货备注">
                    <el-input
                        v-model="form.remark"
                        type="textarea"
                        :rows="4"
                        disabled
                        style="top: 0"
                        placeholder="请输入发货备注信息,比如超额发货理由、超限发货的理由等,或者其他特殊说明"
                    ></el-input>
                </el-form-item>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="发货金额">
                            <el-input :value="$toMoney(form.money)" disabled placeholder="请输入发货金额">
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="拟定出库日期">
                            <el-date-picker
                                v-model="form.time"
                                type="date"
                                disabled
                                value-format="yyyy-MM-dd"
                                placeholder="请输入拟定出库日期"
                            ></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <!-- out display info -->
            <div v-if="outDetail.time">
                <el-alert
                    title="发货申请及出库情况"
                    style="border: 1px solid #ddd; color: #606266; font-weight: bold; border-radius: 0; margin-top: 20px"
                    type="info"
                    :closable="false"
                ></el-alert>
                <TableWrapper ref="table_out" :data="outDetail.outTableData" :query="{}" :columns="outDetail.outTableCol" />
                <el-form ref="outDetail" :model="outDetail" label-width="120px" style="margin-top: 14px">
                    <el-form-item label="发货备注">
                        <el-input
                            v-model="outDetail.remark"
                            type="textarea"
                            :rows="4"
                            disabled
                            style="top: 0"
                            placeholder="请输入发货备注信息,比如超额发货理由、超限发货的理由等,或者其他特殊说明"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="出库日期">
                        <el-date-picker
                            v-model="outDetail.time"
                            type="date"
                            disabled
                            value-format="yyyy-MM-dd"
                            placeholder="请输入拟定出库日期"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="出库附件">
                        <div class="demo-image__preview" v-if="outDetail.srcList.length">
                            <el-image
                                style="width: 100px; height: 100px"
                                :src="outDetail.url"
                                :preview-src-list="outDetail.srcList"
                            ></el-image>
                        </div>
                        <span v-if="!outDetail.srcList.length">无</span>
                    </el-form-item>
                </el-form>
            </div>
            <div v-if="inDetail.time">
                <el-alert
                    title="发货申请及出库情况"
                    style="border: 1px solid #ddd; color: #606266; font-weight: bold; border-radius: 0; margin-top: 20px"
                    type="info"
                    :closable="false"
                ></el-alert>
                <TableWrapper ref="table_out" :data="inDetail.inTableData" :query="{}" :columns="inDetail.inTableCol" />
                <el-form ref="inDetail" :model="inDetail" label-width="120px" style="margin-top: 14px">
                    <el-form-item label="到货备注">
                        <el-input
                            v-model="inDetail.remark"
                            type="textarea"
                            :rows="4"
                            disabled
                            style="top: 0"
                            placeholder="请输入发货备注信息,比如超额发货理由、超限发货的理由等,或者其他特殊说明"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="签收日期">
                        <el-date-picker
                            v-model="inDetail.time"
                            disabled
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请输入拟定出库日期"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="签收附件">
                        <div class="demo-image__preview" v-if="inDetail.srcList.length">
                            <el-image
                                style="width: 100px; height: 100px"
                                :src="inDetail.url"
                                :preview-src-list="inDetail.srcList"
                            ></el-image>
                        </div>
                        <span v-if="!inDetail.srcList.length">无</span>
                    </el-form-item>
                </el-form>
            </div>
            <!-- document END -->
            <div style="text-align: center" class="size-btn-change">
                <el-button type="primary" @click="handleSign(true)">签批</el-button>
                <el-button @click="handleSign(false)">打回</el-button>
            </div>
            <Dialog
                v-if="modelStatus"
                :title="isSign?'签批':'退回'"
                :visible.sync="visibleSign"
                :onOk="signSure"
                class="size-btn-change"
                @close="signClose"
            >
                <el-form ref="signForm" :model="signFormData" :rules="signFormRules" label-width="100px">
                    <el-form-item label="审核意见：" prop="auditOpinion">
                        <el-input v-model="signFormData.auditOpinion" :rows="4" type="textarea" placeholder="请输入审核意见"></el-input>
                    </el-form-item>
                </el-form>
            </Dialog>
        </div>
    </div>
</template>

<script>
import EnterpriseFile from "@/components/EnterpriseFile/index.vue";
import { Api_AgencyMattersDeal, Api_AgencyMattersReject } from "@/api/creditManagement/todo/index";
import { Api_GoodsInfo, Api_ContractInfo } from "@/api/creditManagement/shippingManagement/shippingTracking.js";
import {
    Api_ClientGetList,
    Api_CreaditRating,
    Api_CurrentContractPayment,
    Api_HistoryContractPayment
} from "@/api/creditManagement/contractManagement/contract.js";
import { Api_GetContractList } from "@/api/creditManagement/customerProfile/customerManagement.js";

export default {
    name: "DeliveryApplicationApproval",
    components: { EnterpriseFile },
    props: {
        modelStatus: Boolean,
        row: Object
    },
    data() {
        const createRules = this.$createRules;
        return {
            isSign: true,
            visibleSign: false,
            signFormData: {
                auditOpinion: ""
            },
            signFormRules: {
                auditOpinion: createRules({
                    msg: "审核意见",
                    required: true,
                    max: 200
                })
            },
            // ??
            /**
             * 字段@展示信息
             */
            displayInfo: {
                customerId: "",
                contractName: "",
                contractId: "",
                contractAvailable: "",
                payConditionName: "",
                prepaid: "",
                payAmount: "",
                payed: "",
                moneyOfSend: "",
                moneyOfWait: "",
                moneyOfOver: "",
                payTime: ""
            },
            contract_options: [],
            nowDate: "",
            nowPerson: "",
            /**
             * 字段@提交表单
             */
            contractId: "",
            form: { id: "", remark: "", money: 0, time: this.$dateFormat(new Date(), "yyyy-MM-dd") },
            /**
             * 清单@表格
             */
            ids: [],
            tableColShippingData: [],
            tableColShippingList: [
                { label: "产品/服务名称", key: "name" },
                { label: "规格型号", key: "type" },
                { label: "销售单位", key: "company" },
                { label: "销售数量", key: "num" },
                {
                    label: "销售单价(元)",
                    key: "unitPrice",
                    align: "right",
                    render: (h, data, row) => {
                        return this.$toMoney(data);
                    }
                },
                {
                    label: "销售金额(元)",
                    key: "amount",
                    align: "right",
                    render: (h, data, row) => {
                        return this.$toMoney(data);
                    }
                },
                {
                    label: "要货日期",
                    key: "time",
                    render: (h, data, row) => {
                        return this.$dateFormat(data, "yyyy-MM-dd");
                    }
                },
                { label: "已发货数量", key: "sendNum" },
                {
                    label: "已发货金额(元)",
                    key: "moneyOfSend",
                    align: "right",
                    render: (h, data, row) => {
                        return this.$toMoney(data);
                    }
                }
            ],
            thisShippingList: [],
            /**
             * 字段@客户信息
             */
            clientOptions: [],
            loading: false,
            loading2: false,
            /**
             * 字段@出库入库展示
             */
            outDetail: {
                outTableCol: [
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
                ],
                outTableData: [],
                remark: "",
                time: "",
                url: "",
                srcList: []
            },
            inDetail: {
                inTableCol: [
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
                    { label: "实发数量", key: "thisSendNumAct" },
                    { label: "实到数量", key: "numOfArrival" },
                    {
                        label: "实到金额(元)",
                        key: "moneyOfArrival",
                        align: "right",
                        render: (h, data, row) => {
                            return this.$toMoney(data);
                        }
                    }
                ],
                inTableData: [],
                remark: "",
                time: "",
                url: "",
                srcList: []
            },
            thisShippingListCol: [
                { label: "产品/服务名称", key: "name" },
                { label: "规格型号", key: "type" },
                { label: "销售单位", key: "company" },
                { label: "销售数量", key: "num" },
                {
                    label: "单价(元)",
                    key: "unitPrice",
                    align: "right",
                    render: (h, data, row) => {
                        return this.$toMoney(data);
                    }
                },
                {
                    label: "销售金额(元)",
                    key: "amount",
                    align: "right",
                    render: (h, data, row) => {
                        return this.$toMoney(data);
                    }
                },
                { label: "未发货数量", key: "unSendNum" },
                { label: "本次发货数量", key: "thisSendNum" },
                {
                    label: "本次发货金额(元)",
                    key: "thisMoneyOfSend",
                    align: "right",
                    render: (h, data, row) => {
                        return this.$toMoney(Number(row.thisSendNum) * Number(row.unitPrice));
                    }
                }
            ]
        };
    },
    mounted() {
        /**
         * 清空@展示数据
         */
        this.displayInfo = {
            customerId: "",
            contractName: "",
            contractId: "",
            contractAvailable: "",
            payConditionName: "",
            prepaid: "",
            payAmount: "",
            payed: "",
            moneyOfSend: "",
            moneyOfWait: "",
            moneyOfOver: "",
            payTime: ""
        };
        this.contract_options = [];
        this.form = { id: "", remark: "", money: 0, time: this.$dateFormat(new Date(), "yyyy-MM-dd") };
        this.clientOptions = [];
        /**
         * 获取@展示数据
         */
        this.nowDate = this.$dateFormat(new Date(), "yyyy-MM-dd");
        this.nowPerson = this.$store.state.user.userInfo.name;
        /**
         * @详情回显
         */
        Api_GoodsInfo(this.row.business_key).then(res => {
            console.log(res);
            this.remoteMethod(res.contractInfo.customerName, () => {
                this.displayInfo.customerId = res.contractInfo.customerId;
                this.remoteMethod2(res.contractInfo.contractName, () => {
                    this.displayInfo.contractId = res.contractId;
                    this.getContractInfo(res.contractId);
                });
            });
            this.tableColShippingData = res.contractInfo.goods;
            this.thisShippingList = res.deliverGoodsInfo.goods;
            this.form.remark = res.deliverGoodsInfo.remark;
            this.form.money = res.deliverGoodsInfo.money;
            this.form.time = this.$dateFormat(res.deliverGoodsInfo.time, "yyyy-MM-dd");
            if (res.outGoodsInfo) {
                this.outDetail.remark = res.outGoodsInfo.remark;
                this.outDetail.time = this.$dateFormat(res.outGoodsInfo.time, "yyyy-MM-dd");
                this.outDetail.srcList = res.outGoodsInfo.urls;
                this.outDetail.url = res.outGoodsInfo.urls.length ? res.outGoodsInfo.urls[0] : "";
                this.outDetail.outTableData = res.outGoodsInfo.goods;
            }
            if (res.arrivalGoodsInfo) {
                this.inDetail.remark = res.arrivalGoodsInfo.remark;
                this.inDetail.time = this.$dateFormat(res.arrivalGoodsInfo.time, "yyyy-MM-dd");
                this.inDetail.srcList = res.arrivalGoodsInfo.urls;
                this.inDetail.url = res.arrivalGoodsInfo.urls.length ? res.arrivalGoodsInfo.urls[0] : "";
                this.inDetail.inTableData = res.arrivalGoodsInfo.goods;
            }
        });
    },
    methods: {
        back() {
            this.$emit("edit", false);
        },
        handleSign(flag) {
            this.isSign = flag;
            this.visibleSign = true;
        },
        // 签批或打回
        signSure() {
            this.$refs.signForm.validate(valid => {
                if (valid) {
                    if (this.isSign) {
                        this.$confirm("确定通过审核吗？", "提示", {
                            type: "warning"
                        }).then(() => {
                            const { id, business_id: businessId } = this.row;
                            const loading = this.$openLoading();
                            Api_AgencyMattersDeal(id, {
                                businessId,
                                processOperate: 2,
                                processRemark: this.signFormData.auditOpinion
                            })
                                .then(msg => {
                                    this.$message.success(msg);
                                    loading.close();
                                    this.visibleSign = false;
                                    this.back();
                                })
                                .catch(e => {
                                    this.$message.error(e);
                                    loading.close();
                                });
                        });
                    } else {
                        this.$confirm("确定打回申请吗？", "提示", {
                            type: "warning"
                        }).then(() => {
                            const { id, business_id: businessId } = this.row;
                            const loading = this.$openLoading();
                            Api_AgencyMattersReject(id, {
                                businessId,
                                processOperate: 4,
                                processRemark: this.signFormData.auditOpinion
                            })
                                .then(msg => {
                                    this.$message.success(msg);
                                    loading.close();
                                    this.visibleSign = false;
                                    this.back();
                                })
                                .catch(e => {
                                    this.$message.error(e);
                                    loading.close();
                                });
                        });
                    }
                }
            });
        },
        signClose() {
            this.$refs.signForm.resetFields();
            this.visibleSign = false;
        },
        getContractInfo(_val) {
            this.contractId = _val;
            Api_ContractInfo(_val).then(res => {
                this.displayInfo.contractAvailable = res.contractAvailable;
                this.displayInfo.payConditionName = res.payConditionName;
                this.displayInfo.prepaid = res.prepaid ? 1 : 0;
                this.displayInfo.payAmount = res.payAmount;
                this.displayInfo.payed = res.payed ? "是" : "否";
                this.displayInfo.moneyOfSend = res.moneyOfSend;
                this.displayInfo.moneyOfWait = res.moneyOfWait;
                this.displayInfo.moneyOfOver = res.moneyOfOver;
                this.displayInfo.payTime = this.$dateFormat(res.payTime, "yyyy-MM-dd");
                this.tableColShippingData = res.goods;
            });
        },
        /**
         * 方法@客户信息
         */
        remoteMethod(query, cb) {
            if (query !== "") {
                this.loading = true;
                setTimeout(() => {
                    Api_ClientGetList({ companyName: query }).then(result => {
                        this.clientOptions = result;
                        this.loading = false;
                        this.$nextTick(() => {
                            cb && cb();
                        });
                    });
                }, 200);
            } else {
                this.clientOptions = [];
            }
        },
        remoteMethod2(query, cb) {
            if (!this.displayInfo.customerId) {
                this.$message("请先选择客户！");
                return false;
            }
            if (query !== "") {
                this.loading2 = true;
                setTimeout(() => {
                    Api_GetContractList({ customerId: this.displayInfo.customerId, contractName: query }).then(res => {
                        this.loading2 = false;
                        this.contract_options = res;
                        this.$nextTick(() => {
                            cb && cb();
                        });
                    });
                    // this.contract_options = this.list.filter(item => {
                    //     return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
                    // });
                }, 200);
            } else {
                this.contract_options = [];
            }
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

    .payment-plan-th-color {
        color: #7088a4;
        font-weight: bold;
    }

    .payment-plan-th {
        text-align: center;
        // height: 48px;
        // line-height: 48px;
        // border-right: 1px solid #dee2e6;

        .plan-input {
            margin: 0 4px;
            width: calc(100% - 8px);
        }
    }
}

/deep/ .no-label {
    .el-form-item__content {
        margin-left: 0 !important;
    }
}

/deep/ .payment-plan .el-input__icon {
    line-height: 30px !important;
}
</style>
