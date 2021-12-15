<template>
    <el-container style="background-color: #fff">
        <el-header>
            <FxbHeader />
        </el-header>

        <!-- banner -->
        <div class="banner-box">
            <div class="animated fadeIn banner-img"></div>
        </div>

        <div style="width: 1140px; margin: 35px auto 7px auto; ">
            <el-main>
                <div class="creditrepair-div" style="margin-top: -50px; margin-bottom: 26px;">
                    <h1 class="taCenter">信用修复介绍</h1>
                    <div class="overH">
                        <img
                            class="floatL"
                            src="@/assets/images/creditrepair2.png"
                            alt
                            style="margin-left: 14px;"
                        />
                        <div class="creditrepair-panel one" style="margin-top: 2px;">
                            <h2 class="font20">培训范围</h2>
                            <p class="font12">涉及严重失信行为的行政处罚信息</p>
                            <ul class="fxb-666 font14">
                                <li>因严重损害自然人身体健康和生命安全等行为被处以行政处罚信息</li>
                                <li>因严重破坏市场公平竞争秩序和社会正常秩序的行为被处以行政处罚信息</li>
                                <li>在司法机关、行政机关做出裁判或者决定后，因有履行能力但拒不履行、逃避执行，且情节严重的行为被处以行政处罚信息</li>
                                <li>因拒不履行国防义务，损害国防利益，破坏国防设施的行为被处以行政处罚信息</li>
                            </ul>
                        </div>
                        <div class="creditrepair-panel" style="width: 200px; margin-left: 70px;">
                            <h2 class="font20" style="margin-top: 2px;">培训内容</h2>
                            <p class="font12">涉及严重失信行为的行政处罚信息</p>
                            <ul class="fxb-666 font14">
                                <li>社会信用体系建设法规政策</li>
                                <li>失信联合惩戒措施</li>
                                <li>信用修复方式和程序等</li>
                                <li>培训不少于3个学时</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="creditrepair-div">
                    <h1 class="taCenter">信用报告介绍</h1>
                    <div class="overH">
                        <img class="floatL marL30" src="@/assets/images/creditrepair3.png" alt />
                        <div class="creditrepair-panel one">
                            <h2 class="font20" style="margin-top: 2px;">出具报告对象</h2>
                            <p class="font12">包含以下内容</p>
                            <ul class="fxb-666 font14">
                                <li>经未至科技完成信用修复培训的主体</li>
                                <li>经其他信用服务机构（国家公共信用信息中心公示的）完成信用修复培训的主体</li>
                            </ul>
                        </div>
                        <div class="creditrepair-panel" style="width: 200px; margin-left: 70px;">
                            <h2 class="font20" style="margin-top: 2px;">报告内容</h2>
                            <p class="font12">包含但不限于以下内容</p>
                            <ul class="fxb-666 font14">
                                <li>信用修复承诺书</li>
                                <li>信用修复培训记录表</li>
                                <li>基础信用质量信息</li>
                                <li>信用履约信息</li>
                                <li>已履行行政处罚相关证明材料</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </el-main>
        </div>

        <div style="background-color: #f7f8f9; margin-top: 22px; margin-bottom: -9px;">
            <h1 class="taCenter" style="padding-top: 18px;padding-bottom: 43px;">信用修复流程</h1>
            <ul class="creditrepair-step">
                <div class="creditrepair-btn">信用修复公示</div>
                <li>
                    <h2>提交申请</h2>
                    <span>
                        申请主体提交信用
                        <br />修复申请
                    </span>
                </li>
                <li>
                    <h2>修复认定</h2>
                    <span>
                        未至科技认定申请主体是
                        <br />否可修复
                    </span>
                </li>
                <li>
                    <h2>修复培训</h2>
                    <span>
                        未至科技进行信用修复培
                        <br />训，并出具培训证明材料
                    </span>
                </li>
                <li>
                    <h2>信用报告</h2>
                    <span>
                        未至科技对完成修复培训的
                        <br />主体出具信用报告
                    </span>
                </li>
                <li>
                    <h2>实施修复</h2>
                    <span>
                        “信用中国”审核通过
                        <br />撤销公示
                    </span>
                </li>
            </ul>
        </div>

        <div style="width: 1140px; margin: 35px auto 65px auto; ">
            <el-main>
                <div class="creditrepair-div">
                    <h1 class="taCenter" style="padding-top:30px;padding-bottom:103px;">申请信用修复</h1>

                    <div class="creditrepair-form overH">
                        <el-form
                            :model="repairForm"
                            :rules="rules"
                            label-width="100px"
                            ref="repairForm"
                        >
                            <el-row>
                                <el-col :span="8" class="form-input">
                                    <el-form-item
                                        :rules="[
                                    { required: true, message: '请输入公司名称', trigger: 'blur' }
                                ]"
                                        label="公司名称："
                                        prop="companyName"
                                    >
                                        <el-autocomplete
                                            v-model="repairForm.companyName"
                                            placeholder="请输入您的公司名称"
                                            :fetch-suggestions="querySearch"
                                            :trigger-on-focus="false"
                                            @select="handleSelect"
                                            style="width: 100%;"
                                        ></el-autocomplete>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8" class="form-input">
                                    <el-form-item
                                        :rules="[
                                    { required: true, message: '请输入姓名', trigger: 'blur' },
                                    { max:20, message: '长度不超过20个字', trigger: 'change' }
                                ]"
                                        label="联系人："
                                        prop="linkman"
                                    >
                                        <el-input
                                            placeholder="请输入您的姓名"
                                            v-model="repairForm.linkman"
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8" class="form-input">
                                    <el-form-item
                                        :rules="[
                                    { required: true, message: '请输入手机号码', trigger: 'blur' },
                                    { pattern: /^1[3456789]\d{9}$/,message: '请输入正确的手机号'}
                                ]"
                                        label="手机号码"
                                        prop="phoneNo"
                                    >
                                        <el-input
                                            placeholder="请输入您的手机号码"
                                            v-model="repairForm.phoneNo"
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                                <!-- <el-col :span="6" class="form-input">
                                <el-form-item label="行政处罚" prop="penaltyNo">
                                    <el-select placeholder="请选择您要修复的处罚决定书文号" style="width:100%;" v-model="repairForm.penaltyNo">
                                        <el-option :key="item.id" :value="item.caseNo" v-for="item in repairNos"></el-option>
                                    </el-select>
                                </el-form-item>
                                </el-col>-->
                                <el-col :span="24" class="form-input form-desc">
                                    <el-form-item
                                        :rules="[
                                    { required: true, message: '请输入失信描述', trigger: 'blur' },
                                    { max:200, message: '长度不超过200个字', trigger: 'change' }
                                ]"
                                        label="失信描述"
                                        prop="dishonestDesc"
                                    >
                                        <el-input
                                            :rows="6"
                                            placeholder="请输入您的失信描述"
                                            type="textarea"
                                            v-model="repairForm.dishonestDesc"
                                            style="padding-top: 11px;"
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24" align="center">
                                    <el-button
                                        @click="submitForm('repairForm');"
                                        class="form-btn"
                                        type="primary"
                                        :disabled="curSubmit"
                                        :loading="submitLoading"
                                    >立即申请</el-button>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                </div>
            </el-main>
        </div>

        <el-footer>
            <FxbFooter />
        </el-footer>
    </el-container>
</template>

<script>
import { Api_CompanySearch, Api_CreditRepairSave } from "@/api/creditRepair";
import { getUserInfo } from "@/utils/auth";
import FxbHeader from "@/views/layouts/fxb/components/FxbHeader";
import FxbMain from "@/views/layouts/fxb/components/FxbMain";
import FxbFooter from "@/views/layouts/fxb/components/FxbFooter";

export default {
    components: {
        FxbHeader,
        FxbMain,
        FxbFooter
    },
    data() {
        return {
            userInfo: getUserInfo(),
            repairNos: [],
            rules: {},
            curCompany: {},
            curSubmit: false,
            submitLoading: false,
            repairForm: {
                companyId: "", // 公司id
                companyName: "", // 公司名称
                linkman: "", // 联系人
                phoneNo: "", // 手机号码
                email: "", // 电子邮箱
                serviceType: "0", // 服务类型 0:信用修复报告 1:信用修复培训 2:培训&报告.
                // penaltyNo: "", // 行政处罚文书号
                creditCode: "", // 统一社会信用代码
                dishonestDesc: "" // 失信描述
            }
        };
    },
    computed: {},
    methods: {
        // 企业模糊查询
        querySearch(queryString, cb) {
            if (!this.userInfo) {
                cb([]);
                this.$login.login();
                return false;
            }

            Api_CompanySearch({
                queryValue: queryString
            }).then(res => {
                if (res.stateCode === "50001") {
                    const temp = [];
                    for (const elem of res.data.returnData) {
                        temp.push({
                            value: elem.name,
                            companyId: elem.id,
                            operName: elem.operName,
                            creditCode: elem.creditCode
                        });
                    }
                    cb(temp);
                } else if (res.stateCode === "50003") {
                    this.$message.warning("请输入更详细的关键词");
                    cb([]);
                }
            });
        },
        handleSelect(item) {
            if (!item.creditCode) {
                this.$message.error("您填写的企业没有统一社会信用代码");
            }
            this.repairForm.companyId = item.companyId;
            this.repairForm.companyName = item.value;
            this.repairForm.creditCode = item.creditCode;
            this.curCompany = item;
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if (!this.userInfo) {
                        this.$login.login();
                        return false;
                    }

                    this.submitLoading = true;
                    this.curSubmit = true;
                    Api_CreditRepairSave(this.repairForm).then(res => {
                        this.curSubmit = false;
                        this.submitLoading = false;
                        //  1：保存成功 0：失败；2：统一社会信用代码空；3：企业信息不正确
                        if (res.stateCode === "1") {
                            this.$message.success("申请成功");
                            this.$refs[formName].resetFields();
                        }
                        if (res.stateCode === "0") {
                            this.$message.error("申请失败");
                        }
                        if (res.stateCode === "2") {
                            this.$message.warning("您填写的企业查找不到");
                        }
                        if (res.stateCode === "3") {
                            this.$message.warning("您填写的企业不存在");
                        }
                    });
                } else {
                    return false;
                }
            });
        }
    }
};
</script>

<style lang="scss">
.creditrepair-form {
    .el-form-item {
        margin-bottom: 0;
    }
    .el-input__inner {
        border: 0;
    }
    .el-textarea__inner {
        border: 0;
        resize: none;
    }
    .el-form-item__label {
        text-align: left;
        padding: 0 0 0 18px;
    }
}
</style>

<style scoped lang="scss">
.banner-box {
    position: relative;
    height: 520px;

    .banner-img {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        z-index: 999;
        height: 100%;
        background: url(../../assets/images/creditrepair.png) no-repeat center
            top;
    }
}

.el-main {
    width: 100%;
    height: auto;
}

.creditrepair-div h1 {
    padding: 48px 0 82px;
    margin: 0;
}

.creditrepair-panel {
    width: 370px;
    float: left;
    margin-left: 107px;
}

.creditrepair-panel p {
    margin: 24px 0 34px;
}

.creditrepair-panel ul {
    padding-left: 20px;
}

.creditrepair-panel li {
    position: relative;
    margin-bottom: 4px;
    line-height: 24px;
}

.creditrepair-panel.one li {
    margin-bottom: 14px;
    line-height: 24px;
}

.creditrepair-panel li::before {
    position: absolute;
    top: 0;
    left: -20px;
    content: "•";
    font-size: 14px;
    color: #40a4f1;
    margin: 0 12px 0 0px;
}

.creditrepair-step {
    position: relative;
    width: 1134px;
    height: 135px;
    margin: 0 auto;
    background-image: url(../../assets/images/creditrepair4.png);
    background-repeat: no-repeat;
}

.creditrepair-step li {
    line-height: 24px;
    width: 176px;
    float: left;
    margin-right: calc((1134px - 176px * 5) / 4);
}

.creditrepair-step li:last-child {
    margin-right: 0;
}

.creditrepair-step h2 {
    color: #40a4f1;
    font-size: 18px;
    text-align: center;
    margin: 45px 0 10px;
}

.creditrepair-step span {
    font-size: 12px;
    text-align: center;
    display: block;
    color: #666;
    line-height: 18px;
}

.creditrepair-btn {
    width: 140px;
    height: 40px;
    border-radius: 3px;
    position: absolute;
    top: -96px;
    right: 0;
    color: #8c96aa;
    line-height: 40px;
    text-align: center;
    background: #e4e7ed url(../../assets/images/arrRepaire.png) no-repeat 90%
        center;
}

.creditrepair-form {
    width: 1133px;
    margin-left: 12px;
}

.creditrepair-form .form-input {
    border: 1px solid #ccc;
    float: left;
    margin-bottom: 10px;
    margin-right: 10px;
    width: calc((100% - 30px) / 3);
}
.creditrepair-form .form-input:nth-child(4) {
    margin-right: 0;
}
.creditrepair-form .form-desc {
    width: calc(100% - 10px);
}

.creditrepair-form input {
    border: 0px solid #ccc;
}

.creditrepair-form textarea {
    width: 93%;
    border: 0px solid #ccc;
}

.creditrepair-form .form-btn {
    width: 193px;
    height: 57px;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    margin: 23px auto 3px -16px;
    color: #fff;
    border-radius: 3px;
    background-color: #40a4f1;
}
</style>
