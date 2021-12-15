<template>
    <div>
        <div class="page-header">
            <h1 class="page-name">
                <span>{{ pageStatus==='add'?'新增财务报表':pageStatus==='edit'?'编辑财务报表':'财务报表详情' }}</span>
            </h1>
            <div>
                <el-button @click="back">返回</el-button>
            </div>
        </div>
        <div class="page-content">
            <el-form ref="displayInfo" :model="displayInfo" label-width="100px" style="margin-bottom: 0">
                <!-- <el-row>
                    <el-col :span="8">
                        <el-form-item label="客户编码">{{ displayInfo.companyCode }}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="客户名称">{{ displayInfo.companyName }}</el-form-item>
                    </el-col>
                </el-row> -->
            </el-form>
            <el-form ref="form" :model="form" label-width="100px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="财报类型" prop="type" :rules="{required:true,message:'请选择财报类型'}">
                            <el-radio-group v-model="form.type" @change="type_onchange">
                                <el-radio label="0">年报</el-radio>
<!--                                <el-radio label="1">半年报</el-radio>-->
<!--                                <el-radio label="2">月报</el-radio>-->
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item
                            label="财报期间"
                            :prop="form.type==='2'?'month':'year'"
                            :rules="{required:true,message:'请选择财报期间'}"
                        >
                            <el-date-picker
                                v-if="form.type==='0'||form.type==='1'"
                                v-model="form.year"
                                value-format="yyyy"
                                type="year"
                                placeholder="选择日期"
                            ></el-date-picker>
                            <el-date-picker
                                v-if="form.type==='2'"
                                v-model="form.month"
                                value-format="yyyy-MM"
                                type="month"
                                placeholder="选择日期"
                            ></el-date-picker>
                            <el-radio-group v-if="form.type==='1'" v-model="form.semiAnnual" style="margin-left: 16px">
                                <el-radio label="1">上半年</el-radio>
                                <el-radio label="2">下半年</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="附件上传" prop="fsInfos" :rules="{required:true,message:'请上传财报附件'}">
                            <Upload v-model="form.fsInfos" fileType="jpg,png,pdf" :limit="5" :fileSize="10"></Upload>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-tabs type="border-card">
                <el-tab-pane label="资产负债表">
                    <BalanceSheet ref="ref_BalanceSheet"></BalanceSheet>
                </el-tab-pane>
                <el-tab-pane label="利润表">
                    <IncomeSheet ref="ref_IncomeSheet"></IncomeSheet>
                </el-tab-pane>
                <el-tab-pane label="现金流量表">
                    <CashFlowSheet ref="ref_CashFlowSheet"></CashFlowSheet>
                </el-tab-pane>
            </el-tabs>
            <!-- buttons -->
            <div style="text-align: center; margin-top: 16px">
                <el-button type="primary" @click="submitForm">提交</el-button>
                <el-button type="success" @click="saveForm">保存</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import Upload from "@/components/Upload/index.vue";
import BalanceSheet from "./components/BalanceSheet";
import IncomeSheet from "./components/IncomeSheet";
import CashFlowSheet from "./components/CashFlowSheet";
import {
    Api_financialAddReports,
    Api_financialGetDetails,
    Api_financialSaveReports
} from "@/api/creditManagement/customerProfile/customerManagemCustomer/FinancialAnalysis.js";

export default {
    name: "NewReport",
    components: { Upload, BalanceSheet, IncomeSheet, CashFlowSheet },
    data() {
        const createRules = this.$createRules;
        return {
            rowData: {},
            companyId: "",
            pageStatus: "",
            displayInfo: { companyCode: "-", companyName: "-" },
            form: {
                type: "0",
                year: "",
                semiAnnual: "",
                month: "",
                fsInfos: []
            }
        };
    },
    methods: {
        open(_row, _cID, _state, _data) {
 
            this.rowData = _row || {};
            this.companyId = _cID;
            this.pageStatus = _state;
            this.displayInfo = { companyCode: _data.customerNo, companyName: _data.companyName };
            if (_row) {
                const loading = this.$openLoading();
                Api_financialGetDetails({ id: _row.id }).then(res => {
                    loading.close();
                    this.form.type = res.type;
                    this.form.year = String(res.year);
                    this.form.semiAnnual = String(res.semiAnnual);
                    this.form.month = String(res.month);
                    this.form.fsInfos = res.fsInfos.map(item => ({ url: item.fileUrl, name: item.fileName }));
                    this.$refs.ref_BalanceSheet.setData(
                        res.customerLiabilities,
                        res.customerLiabilitiesEnd,
                        res.customerLiabilitiesRemark
                    );
                    this.$refs.ref_IncomeSheet.setData(
                        res.customerProfitcCurrent,
                        res.customerProfitcYear,
                        res.customerProfitcRemark
                    );
                    this.$refs.ref_CashFlowSheet.setData(res.customerCashFlow, res.customerCashFlowRemark);
                });
            }
        },
        back() {
            this.$emit("hideReport");
        },
        type_onchange(val) {
            this.form.semiAnnual = val === "1" ? "1" : "";
        },
        // 提交
        submitForm() {
            this.$refs["form"].validate(valid => {
                this.$refs.ref_BalanceSheet.validForm(_balanceSheetForm => {
                    this.$refs.ref_IncomeSheet.validForm(_incomeSheetForm => {
                        this.$refs.ref_CashFlowSheet.validForm(_cashFlowSheetForm => {
                            if (valid) {
                                const loading = this.$openLoading();
                                Api_financialAddReports({
                                    id: this.pageStatus === "edit" ? this.rowData.id : "",
                                    companyId: this.companyId,
                                    type: this.form.type,
                                    year:
                                        this.form.type === "0" || this.form.type === "1"
                                            ? this.form.year
                                            : this.form.type === "2"
                                            ? this.form.month.split("-")[0]
                                            : "",
                                    semiAnnual: this.form.type === "1" ? this.form.semiAnnual : "",
                                    month: this.form.type === "2" ? this.form.month.split("-")[1] : "",
                                    fsInfos: this.form.fsInfos.map(item => ({
                                        fileId: item.uid,
                                        fileName: item.name,
                                        fileUrl: item.url
                                    })),
                                    ..._balanceSheetForm,
                                    ..._incomeSheetForm,
                                    ..._cashFlowSheetForm
                                })
                                    .then(res => {
                                        loading.close();
                                        this.$message({
                                            type: "success",
                                            message: this.pageStatus === "edit" ? "修改成功！" : "新增成功！"
                                        });
                                        this.back();
                                    })
                                    .catch(res => {
                                        loading.close();
                                        this.$message.error(res);
                                    });
                            }
                        });
                    });
                });
            });
        },
        // 保存
        saveForm() {
            this.$refs.ref_BalanceSheet.validForm(_balanceSheetForm => {
                this.$refs.ref_IncomeSheet.validForm(_incomeSheetForm => {
                    this.$refs.ref_CashFlowSheet.validForm(_cashFlowSheetForm => {
                        const loading = this.$openLoading();
                        Api_financialAddReports({
                            id: this.pageStatus === "edit" ? this.rowData.id : "",
                            companyId: this.companyId,
                            type: this.form.type,
                            year:
                                this.form.type === "0" || this.form.type === "1"
                                    ? this.form.year
                                    : this.form.type === "2"
                                    ? this.form.month.split("-")[0]
                                    : "",
                            semiAnnual: this.form.type === "1" ? this.form.semiAnnual : "",
                            month: this.form.type === "2" ? this.form.month.split("-")[1] : "",
                            fsInfos: this.form.fsInfos.map(item => ({
                                fileId: item.uid,
                                fileName: item.name,
                                fileUrl: item.url
                            })),
                            ..._balanceSheetForm,
                            ..._incomeSheetForm,
                            ..._cashFlowSheetForm
                        })
                            .then(res => {
                                loading.close();
                                this.$message({
                                    type: "success",
                                    message: this.pageStatus === "edit" ? "修改成功！" : "新增成功！"
                                });
                                this.back();
                            })
                            .catch(res => {
                                loading.close();
                                this.$message.error(res);
                            });
                    });
                });
            });
        }
    }
};
</script>

<style lang="scss" scoped>
/deep/ .standard-table {
    border: 1px solid #d7dae2;
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 16px;

    th {
        color: #7088a4;
        background: #eaedf4;
    }

    td {
        color: #606266;
    }

    th,
    td {
        padding: 13px 12px;
    }

    /deep/ .el-form-item {
        margin: -4px 0 !important;
    }

    /deep/ .el-form-item__content {
        line-height: 23px !important;
    }

    /deep/ .el-input__inner {
        border-left: none;
        border-right: none;
        border-top: none;
        border-radius: 0;
        width: 100%;
        height: 23px;
        line-height: 23px;
        text-align: right;
        padding: 0 4px;
    }

    /deep/ .el-input__inner:focus {
        outline: none;
    }
}

/deep/ .el-tabs__content {
    overflow: initial;
}
</style>
