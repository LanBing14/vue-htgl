<template>
    <div>
        <div class="page-header">
            <h1 class="page-name">
                <span>{{ pageStatus==='add'?'新增申请':pageStatus==='edit'?'编辑申请':'发货申请详情' }}</span>
            </h1>
            <div>
                <el-button @click="back">返回</el-button>
            </div>
        </div>
        <div class="page-content">
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
                                :disabled="pageStatus==='info'"
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
                                :disabled="pageStatus==='info'"
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
                <EnterpriseFile :enterpriseID="displayInfo.customerId"></EnterpriseFile>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="合同金额">
                            <el-input :value="$toMoney(displayInfo.contractAvailable,2)" disabled placeholder="请输入合同金额">
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
                            <el-input :value="$toMoney(displayInfo.payAmount,2)" disabled placeholder="请输入预付金额">
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
                            <el-input :value="$toMoney(displayInfo.moneyOfSend,2)" disabled placeholder="请输入已发货金额">
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="未结清金额">
                            <el-input :value="$toMoney(displayInfo.moneyOfWait,2)" disabled placeholder="请输入未结清金额">
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="逾期金额">
                            <el-input :value="$toMoney(displayInfo.moneyOfOver,2)" disabled placeholder="请输入逾期金额">
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="发货状态">{{ pageStatus==='add'?'申请发货':'' }}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="申请人">{{ nowPerson }}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="申请时间">{{ nowDate }}</el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-form ref="form" :model="form" label-width="120px">
                <div class="sub-title">
                    合同发货清单
                    <el-button @click="addShipping" size="small" v-if="pageStatus!=='info'">一键发货</el-button>
                </div>
                <TableWrapper ref="child" :data="tableColShippingData" :query="{}" :columns="tableColShippingList" />
                <div class="sub-title">本次发货申请</div>
                <div class="payment-plan">
                    <div
                        style="display: flex; height: 48px; padding: 0 10px; align-items: center; background-color: #eaedf4; border-bottom: 1px solid #dee2e6;"
                    >
                        <div style="flex: 0 50px" class="payment-plan-th payment-plan-th-color">序号</div>
                        <div style="flex: 1.6" class="payment-plan-th payment-plan-th-color">产品/服务名称</div>
                        <div style="flex: 1" class="payment-plan-th payment-plan-th-color">规格型号</div>
                        <div style="flex: 1" class="payment-plan-th payment-plan-th-color">销售单位</div>
                        <div style="flex: 1" class="payment-plan-th payment-plan-th-color">销售数量</div>
                        <div style="flex: 1; text-align: right" class="payment-plan-th payment-plan-th-color">单价(元)</div>
                        <div style="flex: 1; text-align: right" class="payment-plan-th payment-plan-th-color">销售金额(元)</div>
                        <div style="flex: 1" class="payment-plan-th payment-plan-th-color">未发货数量</div>
                        <div style="flex: 1" class="payment-plan-th payment-plan-th-color">本次发货数量</div>
                        <div style="flex: 1.3; text-align: right" class="payment-plan-th payment-plan-th-color">本次发货金额(元)</div>
                        <div style="flex: 0 80px" class="payment-plan-th payment-plan-th-color" v-if="pageStatus!=='info'">操作</div>
                    </div>
                    <div
                        v-for="(item, index) in form.goods"
                        :key="index"
                        style="display: flex; height: 48px; padding: 0 10px; align-items: center; border-bottom: 1px solid #dee2e6;"
                    >
                        <div style="flex: 0 50px" class="payment-plan-th">{{ index + 1 }}</div>
                        <div style="flex: 1.6" class="payment-plan-th">{{ item.name }}</div>
                        <div style="flex: 1" class="payment-plan-th">{{ item.type }}</div>
                        <div style="flex: 1" class="payment-plan-th">{{ item.company }}</div>
                        <div style="flex: 1" class="payment-plan-th">{{ item.num }}</div>
                        <div style="flex: 1; text-align: right" class="payment-plan-th">{{ $toMoney(item.unitPrice,2) }}</div>
                        <div style="flex: 1; text-align: right" class="payment-plan-th">{{ $toMoney(item.amount,2) }}</div>
                        <div style="flex: 1" class="payment-plan-th">{{ item.unSendNum }}</div>
                        <div style="flex: 1" class="payment-plan-th">
                            <el-form-item
                                label-width="0"
                                :prop="'goods.'+index+'.thisSendNum'"
                                :rules="[{required:true,message:'请输入本次发货数量'},{type:'integer',min:1,message:'请输入正整数'}]"
                            >
                                <el-input
                                    v-model.number="item.thisSendNum"
                                    class="plan-input"
                                    placeholder="本次发货数量"
                                    @change="computeTotal"
                                    v-if="pageStatus!=='info'"
                                ></el-input>
                            </el-form-item>
                            <span v-if="pageStatus==='info'">{{ item.thisSendNum }}</span>
                        </div>
                        <div style="flex: 1.3; text-align: right" class="payment-plan-th">
                            <el-input
                                :value="item.thisMoneyOfSend | computeMoneySend(item, $toMoney)"
                                class="plan-input"
                                disabled
                                v-if="pageStatus!=='info'"
                                placeholder="本次发货金额"
                            ></el-input>
                            <span v-if="pageStatus==='info'">{{ item.thisMoneyOfSend | computeMoneySend(item, $toMoney) }}</span>
                        </div>
                        <div style="flex: 0 80px" class="payment-plan-th" v-if="pageStatus!=='info'">
                            <el-button type="danger" size="small" @click="delThisShippingList(index)">删除</el-button>
                        </div>
                    </div>
                </div>
                <el-form-item label="发货备注" prop="remark" :rules="$createRules({msg:'发货备注',required:true,max:200})">
                    <el-input
                        v-model="form.remark"
                        type="textarea"
                        :rows="4"
                        :disabled="pageStatus==='info'"
                        style="top: 0"
                        placeholder="请输入发货备注信息,比如超额发货理由、超限发货的理由等,或者其他特殊说明"
                    ></el-input>
                </el-form-item>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="发货金额">
                            <el-input :value="form.money" disabled placeholder="请输入发货金额">
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="拟定出库日期" prop="time" :rules="$createRules({msg:'拟定出库日期',required:true})">
                            <el-date-picker
                                v-model="form.time"
                                type="date"
                                :disabled="pageStatus==='info'"
                                value-format="yyyy-MM-dd"
                                placeholder="请输入拟定出库日期"
                            ></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div style="text-align: center" v-if="pageStatus!=='info'">
                <el-button type="primary" v-if="pageStatus==='add'" @click="addSubmit">提交</el-button>
            </div>
            <!-- out display info -->
            <div v-if="pageStatus==='info'&&outDetail.time">
                <div class="sub-title">出库情况登记</div>
                <TableWrapper ref="table_out" :data="outDetail.outTableData" :query="{}" :columns="outDetail.outTableCol" />
                <el-form ref="outDetail" :model="outDetail" label-width="120px" style="margin-top: 14px">
                    <el-form-item label="发货备注">
                        <el-input
                            v-model="outDetail.remark"
                            type="textarea"
                            :rows="4"
                            :disabled="pageStatus==='info'"
                            style="top: 0"
                            placeholder="请输入发货备注信息,比如超额发货理由、超限发货的理由等,或者其他特殊说明"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="出库日期">
                        <el-date-picker
                            v-model="outDetail.time"
                            type="date"
                            :disabled="pageStatus==='info'"
                            value-format="yyyy-MM-dd"
                            placeholder="请输入拟定出库日期"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="出库附件">
                        <ImgView :urls="outDetail.srcList"></ImgView>
                    </el-form-item>
                </el-form>
            </div>
            <div v-if="pageStatus==='info'&&inDetail.time">
                <div class="sub-title">到货签收情况</div>
                <TableWrapper ref="table_out" :data="inDetail.inTableData" :query="{}" :columns="inDetail.inTableCol" />
                <el-form ref="inDetail" :model="inDetail" label-width="120px" style="margin-top: 14px">
                    <el-form-item label="到货备注">
                        <el-input
                            v-model="inDetail.remark"
                            type="textarea"
                            :rows="4"
                            :disabled="pageStatus==='info'"
                            style="top: 0"
                            placeholder="请输入发货备注信息,比如超额发货理由、超限发货的理由等,或者其他特殊说明"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="签收日期">
                        <el-date-picker
                            v-model="inDetail.time"
                            :disabled="pageStatus==='info'"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请输入拟定出库日期"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="签收附件">
                        <ImgView :urls="inDetail.srcList"></ImgView>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script type="text/jsx">
import { Api_PaymentConditionsList } from "@/api/creditManagement/accountsReceivable/paymentManagement.js";
import { Api_GetContractList } from "@/api/creditManagement/customerProfile/customerManagement.js";
import {
    Api_ContractInfo,
    Api_ShippingApplication,
    Api_ClientValid,
    Api_GoodsInfo
} from "@/api/creditManagement/shippingManagement/shippingTracking.js";
import { Api_ClientGetList } from "@/api/creditManagement/contractManagement/contract.js";
import { merge } from "lodash";
import ImgView from "@/components/ImgView/index.vue";
import EnterpriseFile from "@/components/EnterpriseFile/index.vue";

export default {
    name: "ShippingApplicationDetails",
    components: { ImgView, EnterpriseFile },
    filters: {
        /**
         * filter@计算本次发送金额
         * _row@行信息
         */
        computeMoneySend(h, _row, _tm) {
            _row.thisMoneyOfSend = Number(_row.thisSendNum) * Number(_row.unitPrice);
            return _tm(Number(_row.thisSendNum) * Number(_row.unitPrice), 2);
        }
    },
    data() {
        return {
            pageStatus: "add",
            rowData: {},
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
            form: { id: "", remark: "", money: 0, time: this.$dateFormat(new Date(), "yyyy-MM-dd"), goods: [] },
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
                        return this.$toMoney(data, 2);
                    }
                },
                {
                    label: "销售金额(元)",
                    key: "amount",
                    align: "right",
                    render: (h, data, row) => {
                        return this.$toMoney(data, 2);
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
                { label: "已发货金额(元)", key: "moneyOfSend" },
                {
                    label: "操作",
                    key: null,
                    render: (h, data, row) => {
                        return (
                            <el-button
                                onClick={this.shippingListSend.bind(this, row)}
                                disabled={this.ids.indexOf(row.id) !== -1 || this.pageStatus === "info"}
                            >
                                发货
                            </el-button>
                        );
                    }
                }
            ],
            /**
             * 字段@客户信息
             */
            clientOptions: [],
            loading: false,
            loading2: false,
            isShowSituationBox: false,
            creditLevel: "",
            creditPeriod: "",
            creditLine: "",
            temporaryCreditLine: "",
            availableCredit: "",
            amountReceivable: "",
            overdueAmount: "",
            overdueAmountProportion: "",
            maximumOverdueDays: "",
            maximumSingleOverdue: "",
            historicalOverdue: "",
            overdue120: "",
            overdue1year: "",
            overdue1year120: "",
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
            }
        };
    },
    methods: {
        initPage(_pageStatus, _rowData) {
            this.pageStatus = _pageStatus;
            this.rowData = _rowData;
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
            this.form = { id: "", remark: "", money: 0, time: this.$dateFormat(new Date(), "yyyy-MM-dd"), goods: [] };
            this.clientOptions = [];
            this.isShowSituationBox = false;
            /**
             * 获取@展示数据
             */
            this.nowDate = this.$dateFormat(new Date(), "yyyy-MM-dd");
            this.nowPerson = this.$store.state.user.userInfo.name;
            /**
             * @详情回显
             */
            if (_pageStatus === "info") {
                Api_GoodsInfo(_rowData.id).then(res => {
                    this.remoteMethod(res.contractInfo.customerName, () => {
                        this.displayInfo.customerId = res.contractInfo.customerId;
                        // this.customerNameChange();
                        this.remoteMethod2(res.contractInfo.contractName, () => {
                            this.displayInfo.contractId = res.contractId;
                            this.getContractInfo(res.contractId);
                        });
                    });
                    this.tableColShippingData = res.contractInfo.goods;
                    this.form.goods = res.deliverGoodsInfo.goods;
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
            }
        },
        back() {
            this.$emit("hideShippingApplicationDetails");
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
         * method@一键发货
         */
        addShipping() {
            for (let i = 0; i < this.tableColShippingData.length; i++) {
                this.form.goods.push({
                    ...this.tableColShippingData[i],
                    thisSendNum: this.tableColShippingData[i].num - this.tableColShippingData[i].sendNum,
                    unSendNum: this.tableColShippingData[i].num - this.tableColShippingData[i].sendNum,
                    thisMoneyOfSend: 0
                });
                this.ids.push(this.tableColShippingData[i].id);
            }
            this.computeTotal();
        },
        /**
         * method@发货
         * _row@行信息
         */
        shippingListSend(_row) {
            this.form.goods.push({
                ..._row,
                thisSendNum: _row.num - _row.sendNum,
                thisMoneyOfSend: 0,
                unSendNum: _row.num - _row.sendNum
            });
            this.ids.push(_row.id);
            this.computeTotal();
        },
        /**
         * method@删除一项本次发货清单
         * _index@索引
         */
        delThisShippingList(_index) {
            this.form.goods.splice(_index, 1);
            this.ids.splice(_index, 1);
            this.computeTotal();
        },
        /**
         * method@计算总发货金额
         */
        computeTotal() {
            this.$nextTick(() => {
                let sum = 0;
                for (let i = 0; i < this.form.goods.length; i++) {
                    sum += Number(this.form.goods[i].thisMoneyOfSend);
                }
                this.form.money = sum;
                return sum;
            });
        },
        /**
         * method@新增提交
         */
        addSubmit() {
            if (!this.form.goods.length) {
                this.$alert("请至少添加一项本次发货清单！", "提示", {
                    confirmButtonText: "确定",
                    type: "warning"
                });
                return false;
            }
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.displayInfo.payed === "否") {
                        this.$message({
                            message:
                                "本合同约定预付金额" +
                                this.displayInfo.payAmount +
                                "万元，到期日" +
                                this.displayInfo.payTime +
                                "，尚未到账，不允许申请发货。",
                            type: "warning"
                        });
                        return false;
                    }
                    Api_ClientValid(this.contractId).then(res => {
                        if (res.waitSubmitResult.pass) {
                            const loading = this.$openLoading();
                            const _form = JSON.parse(JSON.stringify(this.form));
                            for (let i = 0; i < _form.goods.length; i++) {
                                delete _form.goods[i].time;
                                delete _form.goods[i].sendNum;
                                delete _form.goods[i].moneyOfSend;
                            }
                            Api_ShippingApplication(this.contractId, _form)
                                .then(() => {
                                    loading.close();
                                    this.$message.success("提交申请成功！");
                                    this.$emit("hideShippingApplicationDetails");
                                    this.$emit("getList");
                                })
                                .catch(res => {
                                    loading.close();
                                    this.$message.error(res);
                                });
                        } else {
                            this.$message({
                                message: "当前客户已被列入不良客户，处理措施包含停止发货，暂时系统不允许发货申请。",
                                type: "warning"
                            });
                            return false;
                        }
                    });
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.tip-text {
    color: #4a9df2;
    line-height: 40px;
    cursor: pointer;
}

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
