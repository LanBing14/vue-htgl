<template>
    <Dialog
        ref="drawer"
        :title="pageStatus==='info'?'财务核销详情':'财务核销'"
        :visible.sync="visible"
        :btns="drawerBtns"
        :close="closeDialog"
        width="500px"
    >
        <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="应收编码">{{ tableRow.payPlanCode }}</el-form-item>
            <el-form-item label="客户名称">{{ tableRow.companyName }}</el-form-item>
            <el-form-item label="合同名称">{{ tableRow.contractName + '/' + tableRow.contractNo }}</el-form-item>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="待核销金额">{{ $toMoney(tableRow.amount) }} 元</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="最近收款日期">{{ $dateFormat(tableRow.lastPayDate, 'yyyy-MM-dd') }}</el-form-item>
                </el-col>
            </el-row>
            <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" v-if="pageStatus!=='info'"></el-table-column>
                <el-table-column prop="payDate" label="收款日期">
                    <template slot-scope="scope">{{ $dateFormat(scope.row.payDate, 'yyyy-MM-dd') }}</template>
                </el-table-column>
                <el-table-column prop="payAmount" label="收款金额(元)" align="right">
                    <template slot-scope="scope">{{ $toMoney(scope.row.payAmount + scope.row.discountAmount) }}</template>
                </el-table-column>
                <el-table-column prop="payAmount" label="实收金额(元)" align="right">
                    <template slot-scope="scope">{{ $toMoney(scope.row.payAmount) }}</template>
                </el-table-column>
                <el-table-column prop="discountAmount" label="折扣金额(元)" align="right">
                    <template slot-scope="scope">{{ $toMoney(scope.row.discountAmount) }}</template>
                </el-table-column>
            </el-table>
            <el-form-item label="核销选项" prop="state">
                <el-radio-group v-model="form.state" :disabled="pageStatus==='info'">
                    <el-radio label="2">确认核销</el-radio>
                    <el-radio label="0">核销驳回</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="核销备注" prop="remarks" :rules="$createRules({msg:'核销备注',max:200})">
                <el-input type="textarea" v-model="form.remarks" v-show="pageStatus!=='info'" placeholder="请输入备注" :rows="3"></el-input>
                <span v-show="pageStatus==='info'">form.remarks</span>
            </el-form-item>
            <el-form-item label="附件上传" prop="pic">
                <Upload
                    v-model="fileList"
                    fileType="jpg,png"
                    v-show="pageStatus!=='info'"
                    :limit="3"
                    :fileSize="10"
                    style="margin-top: 6px"
                ></Upload>
                <div v-if="pageStatus==='info'&&srcList.length" class="demo-image__preview">
                    <el-image ref="ref_Img" style="width: 100px; height: 100px" :src="srcList[0]" :preview-src-list="srcList"></el-image>
                </div>
                <span v-if="pageStatus==='info'&&!srcList.length">无</span>
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script>
import { Api_upload } from "@/api/baseApi";
import {
    Api_PaymentCancellation,
    Api_PaymentDetails,
    Api_PaymentCancellationDetail
} from "@/api/creditManagement/contractManagement/contract.js";
import Upload from "@/components/Upload/index.vue";

export default {
    name: "FinancialWriteOff",
    components: { Upload },
    data() {
        return {
            visible: false,
            pageStatus: "",
            tableRow: {
                payPlanCode: "",
                companyName: "",
                contractName: "",
                contractNo: "",
                payDate: "",
                endDate: "",
                payAmount: "",
                receivable: ""
            },
            srcList: [],
            form: {
                state: "2",
                remarks: "",
                urls: [],
                ids: []
            },
            fileList: [],
            tableData: [],
            drawerBtns: [
                {
                    text: "返回",
                    click: () => {
                        this.visible = false;
                    }
                }
            ]
        };
    },
    watch: {
        pageStatus(val) {
            if (val === "info") {
                this.drawerBtns = [
                    {
                        text: "返回",
                        click: () => {
                            this.visible = false;
                        }
                    }
                ];
            } else {
                this.drawerBtns = [
                    {
                        text: "返回",
                        click: () => {
                            this.visible = false;
                        }
                    },
                    {
                        text: "确定",
                        type: "primary",
                        click: () => {
                            if (!this.form.ids.length) {
                                this.$alert("请至少勾选一项核销项！", "提示", {
                                    confirmButtonText: "确定",
                                    type: "warning"
                                });
                                return false;
                            }
                            this.$refs["form"].validate(valid => {
                                if (valid) {
                                    this.$confirm("确定提交吗？", "提示", {
                                        confirmButtonText: "确定",
                                        cancelButtonText: "取消",
                                        type: "warning"
                                    })
                                        .then(() => {
                                            this.form.urls = this.fileList.map(item => item.url);
                                            const loading = this.$openLoading();
                                            Api_PaymentCancellation(this.tableRow.payPlanId, this.form)
                                                .then(() => {
                                                    loading.close();
                                                    this.$message.success("提交成功！");
                                                    this.visible = false;
                                                    this.$emit("getList");
                                                    this.$emit("getStatisticsData");
                                                })
                                                .catch(res => {
                                                    loading.close();
                                                    this.$message.error(res);
                                                });
                                        })
                                        .catch(() => {});
                                }
                            });
                        }
                    }
                ];
            }
        }
    },
    methods: {
        open(_status, _row, _detailRow) {
            this.pageStatus = _status;
            this.tableRow = _row;
            this.visible = true;
            // empty
            this.form = {
                state: "2",
                remarks: "",
                urls: [],
                ids: []
            };
            this.fileList = [];
            this.tableData = [];
            // 获取核销信息
            Api_PaymentDetails(_row.payPlanId).then(res => {
                if (this.pageStatus === "info") {
                    this.tableData = res.transientPayRegisters.filter(
                        item => item.transientCancellationId === _detailRow.transientCancellationId
                    );
                    Api_PaymentCancellationDetail(_detailRow.transientCancellationId).then(res2 => {
                        this.form.state = res2.state;
                        this.form.remarks = res2.remarks;
                        // photo
                        this.form.urls = res2.files.map(item => ({ url: item.url, name: item.originalName }));
                        this.srcList = res2.files.map(item => "/" + item.url);
                    });
                } else {
                    this.tableData = res.transientPayRegisters;
                }
            });
        },
        closeDialog() {
            this.visible = false;
        },
        handleSelectionChange(rows) {
            this.form.ids = rows.map(item => item.id);
        }
    }
};
</script>

<style>
</style>
