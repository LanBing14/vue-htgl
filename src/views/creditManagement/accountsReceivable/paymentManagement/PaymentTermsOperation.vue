<template>
    <div>
        <div class="page-header">
            <h1 class="page-name">
                <span>{{ dialogStatus === 'add' ? '新增付款条件' : dialogStatus === 'edit' ? '编辑付款条件' : '查看付款条件' }}</span>
            </h1>
            <div>
                <el-button @click="closeDialog">返回</el-button>
            </div>
        </div>
        <div class="page-content">
            <el-form ref="form" :model="form" :rules="rules" label-width="150px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="付款条件名称" prop="name">
                            <el-input
                                v-model="form.name"
                                :disabled="dialogStatus==='info'"
                                placeholder="请输入付款条件名称"
                                :maxlength="20"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="当前版本号" prop="transientConditionVersion">
                            <el-input v-model="form.transientConditionVersion" disabled placeholder="请输入当前版本号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="多到期日设置标准" prop="standard">
                            <el-radio-group v-model="form.standard">
                                <el-radio label="1">按比例</el-radio>
                                <!-- <el-radio label="2">按金额</el-radio> -->
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="付款条件描述" prop="describe">
                            <el-input
                                v-model="form.describe"
                                type="textarea"
                                :rows="3"
                                :disabled="dialogStatus==='info'"
                                placeholder="请输入付款条件描述"
                                :maxlength="200"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- table payment BEGIN -->
                <div class="sub-title">
                    付款条件明细
                    <el-button v-if="dialogStatus==='add'||dialogStatus==='edit'" @click="newPaymentConditions">新增</el-button>
                </div>
                <div class="payment-plan">
                    <div class="payment-plan-thead">
                        <div style="flex: 0 50px" class="payment-plan-th payment-plan-th-color">序号</div>
                        <div
                            style="flex: 1"
                            class="payment-plan-th payment-plan-th-color"
                        >* {{ form.standard === '1' ? '比例' : '金额' }}</div>
                        <div style="flex: 1" class="payment-plan-th payment-plan-th-color">* 是否预收</div>
                        <div style="flex: 1" class="payment-plan-th payment-plan-th-color">* 到期日确定方式</div>
                        <div style="flex: 2" class="payment-plan-th payment-plan-th-color">到期日确定方式描述</div>
                        <div
                            style="flex: 1"
                            class="payment-plan-th payment-plan-th-color"
                            v-if="dialogStatus==='add'||dialogStatus==='edit'"
                        >操作</div>
                    </div>
                    <div class="payment-plan-tbody" v-for="(item, index) in conditionListVosData" :key="index">
                        <div style="flex: 0 50px" class="payment-plan-th">{{ index + 1 }}</div>
                        <div style="flex: 1" class="payment-plan-th">
                            <el-input
                                v-model="item.num"
                                class="plan-input"
                                :disabled="dialogStatus==='info'"
                                style="height: 30px !important"
                            >
                                <template slot="append">{{ form.standard === '1' ? '%' : '万元' }}</template>
                            </el-input>
                        </div>
                        <div style="flex: 1" class="payment-plan-th">
                            <el-select
                                v-model="item.prepaid"
                                placeholder="请选择"
                                style="width: 100%"
                                :disabled="dialogStatus==='info'"
                            >
                                <el-option label="是" :value="1"></el-option>
                                <el-option label="否" :value="0"></el-option>
                            </el-select>
                        </div>
                        <div style="flex: 1" class="payment-plan-th">
                            <el-select v-model="item.method.type" placeholder="请选择到期日确定方式" style="width: 100%" disabled>
                                <el-option label="交易日" value="1"></el-option>
                                <el-option label="N天后" value="2"></el-option>
                                <el-option label="月结" value="3"></el-option>
                                <el-option label="固定日" value="4"></el-option>
                            </el-select>
                        </div>
                        <div style="flex: 2" class="payment-plan-th">
                            {{
                            item.method.type === '1'
                            ? '-'
                            : item.method.type === '2'
                            ? '月数='+item.method.month+';天数='+item.method.day+';月底='+(item.method.endMonth===1?"是":"否")+';距离月底天数='+(item.method.endToMonth||'-')+';'
                            : item.method.type === '3'
                            ? '账单结算日='+item.method.settlementDay+';月数='+item.method.month+';天数='+item.method.day+';月底='+(item.method.endMonth===1?"是":"否")+';距离月底天数='+(item.method.endToMonth||'-')+';'
                            : item.method.type === '4'
                            ? '月数='+item.method.month+';天数='+item.method.day+';固定日1='+item.method.fixedDays[0].day+(item.method.matchType==="2"?",区间["+item.method.fixedDays[0].startDay+","+item.method.fixedDays[0].endDay+"]":"")+';固定日2='+item.method.fixedDays[1].day+(item.method.matchType==="2"?",区间["+item.method.fixedDays[1].startDay+","+item.method.fixedDays[1].endDay+"]":"")+';固定日3='+item.method.fixedDays[2].day+(item.method.matchType==="2"?",区间["+item.method.fixedDays[2].startDay+","+item.method.fixedDays[2].endDay+"]":"")+';固定日匹配方式='+(item.method.matchType==="1"?"向后匹配":"按区间匹配")+';'
                            : ''
                            }}
                        </div>
                        <div style="flex: 1" class="payment-plan-th" v-if="dialogStatus==='add'||dialogStatus==='edit'">
                            <el-button size="small" @click="setPaymentTerm(item, index)">设置</el-button>
                            <el-button size="small" type="danger" @click="delPaymentTerm(item, index)">删除</el-button>
                        </div>
                    </div>
                </div>
                <!-- table payment END -->
                <div style="text-align: center" v-if="dialogStatus==='add'||dialogStatus==='edit'">
                    <el-button type="success" @click="createPaymentConditions">提交</el-button>
                </div>
            </el-form>
        </div>
        <DetermineDueDate ref="ref_DetermineDueDate" @getPaymentConditions="getPaymentConditions"></DetermineDueDate>
    </div>
</template>

<script>
import DetermineDueDate from "./DetermineDueDate";
import {
    Api_PaymentConditionsCreate,
    Api_PaymentConditionsDetail,
    Api_PaymentConditionsEdit
} from "@/api/creditManagement/accountsReceivable/paymentManagement.js";

export default {
    name: "ReceivablesEditDetail",
    components: { DetermineDueDate },
    props: {
        dialogStatus: ""
    },
    data() {
        return {
            rowId: "",
            form: {
                name: "",
                standard: "1",
                transientConditionVersion: "PT0001",
                describe: ""
            },
            rules: {
                name: [{ required: true, message: "请输入付款条件名称" }]
            },
            conditionListVosData: [
                {
                    num: "",
                    prepaid: "",
                    describe: "",
                    method: {
                        type: ""
                    }
                }
            ]
        };
    },
    methods: {
        initComponent(_row) {
            // empty form BEGIN
            this.rowId = "";
            this.form = {
                name: "",
                standard: "1",
                transientConditionVersion: "PT0001",
                describe: ""
            };
            this.conditionListVosData = [
                {
                    num: "",
                    prepaid: "",
                    describe: "",
                    method: {
                        type: ""
                    }
                }
            ];
            // empty form END
            if (this.dialogStatus === "edit" || this.dialogStatus === "info") {
                this.rowId = _row.id;
                Api_PaymentConditionsDetail(_row.id).then(res => {
                    console.log(res);
                    this.form = {
                        name: res.name,
                        standard: "1",
                        transientConditionVersion: res.transientConditionVersion,
                        describe: res.describe
                    };
                    this.conditionListVosData = [];
                    for (let i = 0; i < res.transientConditionLists.length; i++) {
                        this.conditionListVosData.push({
                            num: res.transientConditionLists[i].num,
                            prepaid: res.transientConditionLists[i].prepaid ? 1 : 0,
                            describe: res.transientConditionLists[i].describe,
                            method:
                                res.transientConditionLists[i].method.type === "2"
                                    ? {
                                          type: res.transientConditionLists[i].method.type,
                                          month: res.transientConditionLists[i].method.month,
                                          day: res.transientConditionLists[i].method.day,
                                          endMonth: res.transientConditionLists[i].method.endMonth ? 1 : 0,
                                          endToMonth: res.transientConditionLists[i].method.endToMonth
                                      }
                                    : res.transientConditionLists[i].method.type === "3"
                                    ? {
                                          type: res.transientConditionLists[i].method.type,
                                          settlementDay: res.transientConditionLists[i].method.settlementDay,
                                          month: res.transientConditionLists[i].method.month,
                                          day: res.transientConditionLists[i].method.day,
                                          endMonth: res.transientConditionLists[i].method.endMonth ? 1 : 0,
                                          endToMonth: res.transientConditionLists[i].method.endToMonth
                                      }
                                    : res.transientConditionLists[i].method.type === "4"
                                    ? {
                                          type: res.transientConditionLists[i].method.type,
                                          month: res.transientConditionLists[i].method.month,
                                          day: res.transientConditionLists[i].method.day,
                                          matchType: res.transientConditionLists[i].method.matchType,
                                          fixedDays: [
                                              {
                                                  day: res.transientConditionLists[i].method.fixedDays[0].day,
                                                  startDay: res.transientConditionLists[i].method.fixedDays[0].startDay,
                                                  endDay: res.transientConditionLists[i].method.fixedDays[0].endDay
                                              },
                                              {
                                                  day: res.transientConditionLists[i].method.fixedDays[1].day,
                                                  startDay: res.transientConditionLists[i].method.fixedDays[1].startDay,
                                                  endDay: res.transientConditionLists[i].method.fixedDays[1].endDay
                                              },
                                              {
                                                  day: res.transientConditionLists[i].method.fixedDays[2].day,
                                                  startDay: res.transientConditionLists[i].method.fixedDays[2].startDay,
                                                  endDay: res.transientConditionLists[i].method.fixedDays[2].endDay
                                              }
                                          ]
                                      }
                                    : {
                                          type: res.transientConditionLists[i].method.type
                                      }
                        });
                    }
                });
            }
        },
        delPaymentTerm(_row, _index) {
            this.conditionListVosData.splice(_index, 1);
        },
        closeDialog() {
            this.$emit("hideCreatePaymentConditions");
        },
        setPaymentTerm(_row, _index) {
            this.$refs.ref_DetermineDueDate.open(
                _row,
                _index,
                this.conditionListVosData[_index].method.type,
                this.conditionListVosData[_index].method
            );
        },
        getPaymentConditions(_type, _conditions, _index) {
            console.log({ type: _type, ..._conditions }, _index);
            this.conditionListVosData[_index].method = {
                type: _type,
                ..._conditions
            };
        },
        newPaymentConditions() {
            this.conditionListVosData.push({
                num: "",
                prepaid: "",
                describe: "",
                method: {
                    type: ""
                }
            });
        },
        createPaymentConditions() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (!this.conditionListVosData.length) {
                        this.$message.error("请至少填写一项付款条件明细！");
                        return false;
                    }
                    let totalPercent = 0;
                    console.log(this.conditionListVosData);
                    for (let i = 0; i < this.conditionListVosData.length; i++) {
                        if (
                            !this.conditionListVosData[i].num ||
                            (this.conditionListVosData[i].prepaid !== 0 && this.conditionListVosData[i].prepaid !== 1) ||
                            !this.conditionListVosData[i].method.type
                        ) {
                            this.$message.error("请将付款条件明细表填写完整！");
                            return false;
                        }
                        totalPercent += Number(this.conditionListVosData[i].num);
                    }
                    if (totalPercent !== 100) {
                        this.$message.error("付款条件明细表比例总和必须为100%！");
                        return false;
                    }
                    if (this.dialogStatus === "add") {
                        const loading = this.$openLoading();
                        Api_PaymentConditionsCreate({
                            name: this.form.name,
                            describe: this.form.describe,
                            conditionListVos: this.conditionListVosData
                        })
                            .then(() => {
                                loading.close();
                                this.$message.success("提交成功！");
                                this.$emit("hideCreatePaymentConditions");
                                this.$emit("getList");
                            })
                            .catch(res => {
                                loading.close();
                                this.$message.error(res);
                            });
                    } else if (this.dialogStatus === "edit") {
                        const loading = this.$openLoading();
                        Api_PaymentConditionsEdit(this.rowId, {
                            name: this.form.name,
                            describe: this.form.describe,
                            conditionListVos: this.conditionListVosData
                        })
                            .then(() => {
                                loading.close();
                                this.$message.success("修改成功！");
                                this.$emit("hideCreatePaymentConditions");
                                this.$emit("getList");
                            })
                            .catch(res => {
                                loading.close();
                                this.$message.error(res);
                            });
                    }
                }
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
