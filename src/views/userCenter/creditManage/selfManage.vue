<template>
<div>
    <el-row type="flex" align="bottom" style="margin:13px 0 28px 10px;">
        <el-col :span="3">
            <h2 class="add-title">信用评价</h2>
        </el-col>
    </el-row>

    <table border="0" cellpadding="0" cellspacing="0" class="fxb-info-table">
        <thead>
            <tr>
                <th>信用主体</th>
                <th>评估等级</th>
                <th>评估得分</th>
                <th>评价日期</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{{ companyName ? companyName : '-' }}</td>
                <td>{{ companyInfo.baseInfo ? companyInfo.level : '-' }}</td>
                <td>{{ companyInfo.baseInfo ? companyInfo.baseInfo.totalScore : '-' }}</td>
                <td>{{ companyInfo.updateDate ? companyInfo.updateDate : '-' }}</td>
            </tr>
        </tbody>
    </table>
    <br />
    <el-row :gutter="20">
        <el-col :span="9">
            <div id="XYPF" class="eval-chart" style="width: 100%; height: 400px;"></div>
        </el-col>
        <el-col :span="15">
            <table border="0" cellpadding="0" cellspacing="0" class="fxb-info-table">
                <thead>
                    <tr>
                        <th style="width:100px;">评价维度</th>
                        <th>结语</th>
                        <th>得分</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="width:100px;">基本情况</td>
                        <td style="text-align: left;">{{ companyInfo.baseInfo ? companyInfo.baseInfo.comment : '-' }}</td>
                        <td>{{ companyInfo.baseInfo ? companyInfo.baseInfo.score : '-' }}</td>
                    </tr>
                    <tr>
                        <td style="width:100px;">技术创新</td>
                        <td style="text-align: left;">{{ companyInfo.techInnovation ? companyInfo.techInnovation.comment : '-' }}</td>
                        <td>{{ companyInfo.techInnovation ? companyInfo.techInnovation.score : '-' }}</td>
                    </tr>
                    <tr>
                        <td style="width:100px;">经营状况</td>
                        <td style="text-align: left;">{{ companyInfo.manageState ? companyInfo.manageState.comment : '-' }}</td>
                        <td>{{ companyInfo.manageState ? companyInfo.manageState.score : '-' }}</td>
                    </tr>
                    <tr>
                        <td style="width:100px;">关联结构</td>
                        <td style="text-align: left;">{{ companyInfo.relatedStructure ? companyInfo.relatedStructure.comment : '-' }}</td>
                        <td>{{ companyInfo.relatedStructure ? companyInfo.relatedStructure.score : '-' }}</td>
                    </tr>
                    <tr>
                        <td style="width:100px;">公共信用</td>
                        <td style="text-align: left;">{{ companyInfo.publicCredit ? companyInfo.publicCredit.comment : '-' }}</td>
                        <td>{{ companyInfo.publicCredit ? companyInfo.publicCredit.score : '-' }}</td>
                    </tr>
                    <tr>
                        <td style="width:100px;">财务状况</td>
                        <td style="text-align: left;">暂无财务相关信息</td>
                        <td>{{ '-' }}</td>
                    </tr>
                </tbody>
            </table>
        </el-col>
    </el-row>
    <br />
    <el-row type="flex" align="bottom" style="margin:13px 0 28px 10px;">
        <el-col :span="3">
            <h2 class="add-title">风险提示</h2>
        </el-col>
    </el-row>
    <div style="position: relative;margin-bottom:20px;">
        <el-button v-if="userInfo.roleAuthInfo.role !== null" type="text" style="z-index: 9; position: absolute; right: 20px;" @click="open">信用修复</el-button>
        <el-tabs type="border-card" id="tabs">
            <el-tab-pane label="行政处罚">
                <PunishInfo />
            </el-tab-pane>
            <el-tab-pane label="被执行人">
                <ExecuteeInfo/>
            </el-tab-pane>
            <el-tab-pane label="失信信息">
                <BreakFaithInfo/>
            </el-tab-pane>
        </el-tabs>
    </div>

    <!-- 信用修复弹窗 开始 -->
    <el-dialog title="信用修复" :visible.sync="fixCreditDialogVisible"
               :close-on-click-modal="false"
               width="560px" top="10px" :before-close="handleClose">
        <el-form ref="fixCreditForm" :model="fixCreditForm" :rules="fixCreditRules" label-width="110px">
            <el-row :gutter="60">
                <el-col :span="24">
                    <el-form-item label="企业名称">
                        <el-input v-model="fixCreditForm.companyName" readonly></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="联系人" prop="linkman">
                        <el-input v-model="fixCreditForm.linkman"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="手机号码" prop="phoneNo">
                        <el-input v-model="fixCreditForm.phoneNo"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="电子邮箱" prop="email">
                        <el-input v-model="fixCreditForm.email"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="失信描述" prop="dishonestDesc">
                        <el-input :rows="4" placeholder="请输入您的失信描述" type="textarea" v-model="fixCreditForm.dishonestDesc"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="服务类型" prop="serviceType">
                        <el-radio-group v-model="fixCreditForm.serviceType">
                            <el-radio label="0">信用修复报告</el-radio>
                            <el-radio label="1">信用修复培训</el-radio>
                            <el-radio label="2">培训&报告</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="24" v-if="fixCreditForm.serviceType === '2' || fixCreditForm.serviceType === '0'">
                    <el-form-item label="行政处罚">
                        <el-select placeholder="请选择行政处罚决定书文号" style="width:100%;" v-model="fixCreditForm.penaltyNo">
                            <el-option :key="item.value" :value="item.value" v-for="item in repairNos"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <div v-if="fixCreditForm.serviceType === '2' || fixCreditForm.serviceType === '1'" key="serviceChange">
                    <el-col :span="24">
                        <el-form-item label="培训方式" prop="trainType">
                            <el-radio v-model="fixCreditForm.trainType" label="2" @change="getTransInfoList">线上培训</el-radio>
                            <el-radio v-model="fixCreditForm.trainType" label="1" @change="getTransInfoList">线下培训</el-radio>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item label="所属区域" prop="areaCode">
                            <el-cascader placeholder="所属区域" v-model="fixCreditForm.areaCode" :options="options" :props="treeProps" filterable change-on-select style="width:100%;" @change="getTransInfoList"></el-cascader>
                        </el-form-item>
                    </el-col>
                    <div v-if="fixCreditForm.trainType && fixCreditForm.areaCode && !trainInfoShowTip" key="trains">
                        <el-col :span="24">
                            <el-form-item label="培训信息" class="lesson-list">
                                <el-radio-group v-model="fixCreditForm.trainId">
                                    <el-radio v-for="(radio, index) in trainInfos" :key="index" :type="radio.trainType" :label="radio.id" :title="radio.classNo + '(' + radio.className +')'">
                                        {{ radio.classNo }}({{ (radio.className.length > 15 ) ? (radio.className.substring(0,15) + '...') : radio.className }})
                                    </el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </div>
                </div>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center;">
            <el-button type="primary" @click="submitForm('fixCreditForm')" :disabled="curSubmit" >确定</el-button>
            <el-button @click="resetForm('fixCreditForm');fixCreditDialogVisible = false;">取消</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
    import {Api_getCreditScore} from "@/api/advanceSearch";
    import {
        Api_CreditRepairSave,
        Api_GetDetailOperationPenalt,
        Api_GetTrainInfoList,
        Api_GetTreeList
    } from "@/api/creditRepair";
    import {getUserInfo} from "@/utils/auth";
    import {Api_GetCompanyInfoById} from "@/api/baseApi";

    import echarts3 from "echarts";

    import PunishInfo from "./selfChildren/punishInfo"; // 行政处罚
    import ExecuteeInfo from "./selfChildren/executeeInfo"; // 被执行人
    import BreakFaithInfo from "./selfChildren/breakFaithInfo"; // 失信信息

    export default {
    components: {
        PunishInfo,
        ExecuteeInfo,
        BreakFaithInfo
    },
    data() {
        return {
            userInfo: getUserInfo(),
            userApiInfo: {},
            raddarChartData: {},
            loading: false,
            companyId: "",
            companyName: "",
            companyInfo: {},
            curSubmit: false,
            fixCreditDialogVisible: false,
            repairNos: [],
            fixCreditForm: {
                linkman: "",
                type: "1",
                id: "",
                companyName: "",
                penaltyNo: "",
                phoneNo: "",
                email: "",
                dishonestDesc: "",
                serviceType: "0",
                trainType: "2",
                areaCode: []
            },
            fixCreditRules: {
                linkman: [{
                        required: true,
                        message: "请输入姓名",
                        trigger: "blur"
                    },
                    {
                        max: 20,
                        message: "长度不超过20个字",
                        trigger: "change"
                    }
                ],
                phoneNo: [{
                        required: true,
                        message: "请输入手机号码",
                        trigger: "blur"
                    },
                    {
                        pattern: /^1[3456789]\d{9}$/,
                        message: "请输入正确的手机号",
                        trigger: 'change'
                    }
                ],
                email: [
                    {
                        pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                        message: '请输入正确的电子邮箱',
                        trigger: ['blur', 'change']
                    }
                ],
                dishonestDesc: [{
                        required: true,
                        message: "请输入失信描述",
                        trigger: "blur"
                    },
                    {
                        max: 200,
                        message: "长度不超过200个字",
                        trigger: "change"
                    }
                ],
                serviceType: [{
                    required: true,
                    message: "请选择",
                    trigger: "change"
                }],
                trainType: [{
                    required: true,
                    message: "请选择",
                    trigger: "change"
                }],
                areaCode: [{
                    required: true,
                    message: "请选择",
                    trigger: "change"
                }]
            },
            treeProps: {// 菜单树的显示规则
                children: 'childrenList',
                value: 'id',
                label: 'name'
            },
            options: [],
            trainInfos: [],
            trainInfoShowTip: false
        };
    },
    mounted() {
        Api_GetCompanyInfoById({
            userId: this.userInfo.userId
        }).then(data => {
            this.userApiInfo = data;
        });
        this.companyId = this.userInfo.companyId;
        this.companyName = this.userInfo.companyName;
        const role = this.userInfo.roleAuthInfo.role;
        if (role === null) {
            this.$confirm('您尚未完成企业认证，暂时查找不到任何信息，请前往企业认证...', '提示', {
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$router.push({
                    path: "/userCenter/setting/basicinfo"
                });
            })
        }

        this.loadTableData();
        this.getCascader();
    },
    methods: {
        loadTableData() {
            this.loading = true;
            Api_getCreditScore({
                        companyId: this.companyId
                    })
                    .then(res => {
                        const chartData = [];
                        this.loading = false;
                            this.companyInfo = res;
                            chartData.push(this.companyInfo.baseInfo.score);
                            chartData.push(
                                this.companyInfo.techInnovation.score
                            );
                            chartData.push(this.companyInfo.manageState.score);
                            chartData.push(
                                this.companyInfo.relatedStructure.score
                            );
                            chartData.push(this.companyInfo.publicCredit.score);
                            chartData.push(0);

                            const myChart = echarts3.init(
                                document.getElementById("XYPF")
                            );
                            const option = {
                                tooltip: {},
                                color: ["#032c59"],
                                radar: {
                                    radius: "65%",
                                    indicator: [{
                                            name: "基本情况",
                                            max: this.companyInfo.baseInfo
                                                .totalScore
                                        },
                                        {
                                            name: "技术创新",
                                            max: this.companyInfo.techInnovation
                                                .totalScore
                                        },
                                        {
                                            name: "经营状况",
                                            max: this.companyInfo.manageState
                                                .totalScore
                                        },
                                        {
                                            name: "关联结构",
                                            max: this.companyInfo
                                                .relatedStructure.totalScore
                                        },
                                        {
                                            name: "公共信用",
                                            max: this.companyInfo.publicCredit
                                                .totalScore
                                        }
                                    ]
                                },
                                series: [{
                                    type: "radar",
                                    data: [{
                                        name: "评价信息",
                                        value: chartData
                                    }]
                                }]
                            };
                            myChart.setOption(option);
                    })
                    .catch(() => {
                        this.loading = false;
                    });
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.fixCreditDialogVisible = false;
                    this.curSubmit = true;
                    Api_CreditRepairSave(this.fixCreditForm).then(data => {
                        this.curSubmit = false;
                        if (data.stateCode === "1") {
                            this.$message.success("提交成功");
                            this.fixCreditDialogVisible = false;
                            this.resetForm("fixCreditForm");
                        } else {
                            this.$message.error("服务器偷懒了");
                            this.fixCreditDialogVisible = false;
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        handleClose(done) {
            this.fixCreditDialogVisible = false;
            // this.resetForm("fixCreditForm");
        },
        open() {
            this.fixCreditDialogVisible = true;
            this.fixCreditForm.linkman = this.userApiInfo.realName;
            this.fixCreditForm.phoneNo = this.userApiInfo.phoneNo;
            this.fixCreditForm.email = this.userApiInfo.email;

            this.fixCreditForm.companyId = this.userInfo.companyId;
            this.fixCreditForm.companyName = this.userInfo.companyName;

            this.getSelectOptions();
        },
        // 获取文书号
        getSelectOptions() {
            Api_GetDetailOperationPenalt({
                pageSize: "50",
                pageNo: "1",
                companyId: this.companyId
            }).then(res => {
                if (res.stateCode === "60111") {
                    this.repairNos = [];
                    for (let i = 0; i < res.data.result.length; i++) {
                        this.repairNos.push({
                            value: res.data.result[i].caseNo,
                            label: res.data.result[i].caseNo
                        });
                    }
                } else if (res.stateCode === "60100") {
                    return false;
                }
            });
        },
        // 获取级联
        getCascader() {
            Api_GetTreeList().then(res => {
                if (res.stateCode === "1") {
                    this.options = res.data;
                } else {
                    return false;
                }
            });
        },
        getTransInfoList() {
            if (this.fixCreditForm.trainType && (this.fixCreditForm.areaCode.length > 0)) {
                // 级联插件拿到的是数组，所以需要获取最后一个值
                const areaCode = this.fixCreditForm.areaCode[
                    this.fixCreditForm.areaCode.length - 1
                ];
                Api_GetTrainInfoList({
                    trainType: this.fixCreditForm.trainType,
                    areaCode: areaCode
                }).then(res => {
                    if (res.stateCode === "1") {
                        if (res.data && res.data.length > 0) {
                            this.trainInfos = res.data;
                            this.trainInfoShowTip = false;
                        } else {
                            this.$message.warning(
                                "该区域暂无可选培训班，可先提交申请"
                            );
                            this.trainInfoShowTip = true;
                        }
                    } else {
                        this.$message.warning(res.message);
                        return false;
                    }
                });
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.fxb-info-table {
    text-align: center;
    width: 100%;
    border-left: 1px solid #e4e4e4;
    border-right: 1px solid #e4e4e4;
    border-top: 1px solid #e4e4e4;

    th,
    td {
        line-height: 20px;
        padding: 15px;
        border-bottom: 1px solid #e4e4e4;
    }

    th {
        text-align: center;
        width: 180px;
        background: #f7f8fc;
        color: #333;
        white-space: nowrap;
        font-weight: normal;
    }

    td {
        color: #888;
        font-size: 13px;
    }
}
.lesson-list{
    .el-radio-group {
        display: inline-block;
        line-height: 1;
        vertical-align: initial;
        font-size: 0;
    }
    .el-radio + .el-radio{
        margin: 13px 0 13px;
        display: block;
    }
}
</style><style lang="scss">
.usercenter-container #tabs .el-tabs__item {
    font-size: 16px;
    line-height: 38px;
}

.usercenter-container #tabs .el-tabs__header {
    margin-bottom: 0;
}
</style>
