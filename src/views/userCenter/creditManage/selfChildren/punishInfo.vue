<template>
<div>
    <el-table v-loading="penaltyData.loading" :data="penaltyData.result" border class="fxb-el-table" style="width: 100%">
        <el-table-column label="序号" width="50">
            <template slot-scope="scope">
                <span>{{ scope.$index + 1 + (penaltyData.pageNo - 1) * penaltyData.pageSize }}</span>
            </template>
        </el-table-column>
        <el-table-column label="决定文书号" prop="caseNo">
            <template slot-scope="scope">
                <div @click="showDetail(scope.row)" style="color: #4b9df3; cursor: pointer;">{{ scope.row.caseNo }}</div>
            </template>
        </el-table-column>
        <!-- <el-table-column label="决定机关" prop="officeName"></el-table-column> -->
        <el-table-column label="决定日期" width="110">
            <template slot-scope="scope">{{ scope.row.liandate | dateFormat('yyyy-MM-dd') }}</template>
        </el-table-column>
    </el-table>
    <br/>
    <el-pagination class="fxb-page padB0 marT20" v-show="penaltyData.totalRecords > 0" :total="penaltyData.totalRecords"
                   :page-size="penaltyData.pageSize" :current-page.sync="penaltyData.pageNo"
                   @current-change="getDetailOperationPenaltyByPage"/>

    <!-- 处罚详情 开始 -->
    <el-dialog title="处罚详情" :visible.sync="dialogVisible" width="560px" top="10px"
               :close-on-click-modal="false"
               :before-close="closeDialog" v-loading="penaltyDialogData.loading2">
        <el-form ref="penaltyDialogData" :model="penaltyDialogData" :rules="rules" label-width="110px">
            <el-row :gutter="60">
                <el-col :span="24">
                    <el-form-item label="处罚名称">
                        <el-input v-model="penaltyDialogData.name" readonly></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="决定书文号">
                        <el-input v-model="penaltyDialogData.caseNo" readonly></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="处罚事由">
                        <el-input :rows="4" type="textarea" v-model="penaltyDialogData.caseReason" readonly></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="处罚状态">
                        <div v-if="penaltyDialogData.status">
                            <el-input v-model="penaltyDialogData.status" readonly></el-input>
                        </div>
                        <div v-else>
                            <span>-</span>
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="决定日期">
                        <span style="color: #999;">{{ penaltyDialogData.decidedate | dateFormat('yyyy-MM-dd') }}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="处罚类别1">
                        <div v-if="penaltyDialogData.type1">
                            <el-input v-model="penaltyDialogData.type1" readonly></el-input>
                        </div>
                        <div v-else>
                            <span class="inlineInput">-</span>
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="处罚类别2">
                        <div v-if="penaltyDialogData.type2">
                            <el-input v-model="penaltyDialogData.type2" readonly></el-input>
                        </div>
                        <div v-else>
                            <span class="inlineInput">-</span>
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="处罚依据">
                        <div v-if="penaltyDialogData.according">
                            <el-input :rows="4" type="textarea" v-model="penaltyDialogData.according" readonly></el-input>
                        </div>
                        <div v-else>
                            <span class="inlineInput">-</span>
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="处罚结果">
                        <!-- <div v-if="penaltyDialogData.result">
                                <el-input v-model="penaltyDialogData.result" readonly></el-input>
                            </div>-->
                        <!-- <div v-else> -->
                        <span class="inlineInput">-</span>
                        <!-- </div> -->
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="处罚机关">
                        <div v-if="penaltyDialogData.executeGov">
                            <el-input v-model="penaltyDialogData.executeGov" readonly></el-input>
                        </div>
                        <div v-else>
                            <span class="inlineInput">-</span>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </el-dialog>
</div>
</template>

<script>
    import {Api_GetDetailOperationPenalt, Api_GetDetailOperationPenaltByCreditChina} from "@/api/creditRepair";
    import {dateFormat} from "@/utils/index";
    import {getUserInfo} from "@/utils/auth";

    export default {
    name: "BusinessRisk",
    filters: {
        dateFormat
    },
    data() {
        return {
            companyId: null,
            companyName: null,
            // 行政处罚信息，包括列表和分页信息
            penaltyData: {
                pageNo: 1,
                pageSize: 10,
                totalRecords: 0,
                result: [],
                loading: true
            },
            dialogVisible: false,
            rules: {},
            penaltyDialogData: {}
        };
    },
    created: function () {
        // 获取参数
        this.companyId = getUserInfo().companyId;
        this.companyName = getUserInfo().companyName;

        // 调用接口
        this.getDetailOperationPenaltyByPage();
    },
    methods: {
        // 行政处罚信息
        getDetailOperationPenaltyByPage() {
            if (this.companyId) {
                this.penaltyData.loading = true;
                Api_GetDetailOperationPenalt({
                        companyId: this.companyId,
                        companyName: this.companyName,
                        pageNo: this.penaltyData.pageNo,
                        pageSize: this.penaltyData.pageSize
                    })
                    .then(res => {
                        if (res.stateCode === "60111" && res.data) {
                            this.penaltyData.result = res.data.result;
                            this.penaltyData.totalRecords =
                                res.data.totalRecords;
                        } else {
                            this.penaltyData.result = [];
                            this.penaltyData.totalRecords = 0;
                        }
                    })
                    .finally(() => {
                        this.penaltyData.loading = false;
                    });
            } else {
                this.penaltyData.loading = false;
            }
        },
        showDetail(row, id) {
            this.dialogVisible = true;

            if (this.companyId) {
                this.penaltyDialogData.loading = true;
                Api_GetDetailOperationPenaltByCreditChina({
                        penaltyId: row.id
                    })
                    .then(res => {
                        if (res.stateCode === "60111" && res.data) {
                            this.penaltyDialogData = res.data.result[0];
                        } else if (res.stateCode === "60100") {
                            this.$message.warning("暂时没有数据");
                        } else {
                            this.penaltyDialogData = {};
                        }
                    })
                    .finally(() => {
                        this.penaltyDialogData.loading2 = false;
                    });
            } else {
                this.penaltyDialogData.loading2 = false;
            }
        },
        closeDialog(done) {
            this.dialogVisible = false;
        }
    }
};
</script>
