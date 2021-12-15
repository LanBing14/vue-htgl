<template>
    <div>
        <el-container>
            <!-- header -->
            <el-header>
                <FxbHeader />
            </el-header>

            <div class="test-top-box">
                <el-row class="test-top-inner">
                    <el-col :span="24">
                        <div class="clearfix overH">
                            <h3
                                class="font24 fxb-wihte"
                                style="margin-bottom: 27px;"
                            >
                                在线考试
                            </h3>
                            <table class="dFlex test-info-box">
                                <tr class="test-info">
                                    <td class="font14">试卷名称</td>
                                    <td class="font14">
                                        {{
                                            testPageInfo.name
                                                ? testPageInfo.name
                                                : "-"
                                        }}
                                    </td>
                                </tr>
                                <tr class="test-info">
                                    <td class="font14">考试时长</td>
                                    <td class="font14">
                                        {{
                                            testPageInfo.examDuration
                                                ? testPageInfo.examDuration
                                                : "-"
                                        }}
                                        分钟
                                    </td>
                                </tr>
                                <tr class="test-info">
                                    <td class="font14">剩余时间</td>
                                    <td class="font14">
                                        {{ countdown | formatSeconds }}
                                    </td>
                                </tr>
                                <tr class="test-info">
                                    <td class="font14">企业名称</td>
                                    <td class="font14">
                                        {{
                                            userInfo.companyName
                                                ? userInfo.companyName
                                                : "-"
                                        }}
                                    </td>
                                </tr>
                                <tr class="test-info">
                                    <td class="font14">统一社会信用代码</td>
                                    <td class="font14">
                                        {{
                                            userInfo.creditCode
                                                ? userInfo.creditCode
                                                : "-"
                                        }}
                                    </td>
                                </tr>
                                <tr class="test-info">
                                    <td class="font14">考生姓名</td>
                                    <td class="font14">
                                        {{ realName ? realName : "-" }}
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </el-col>
                </el-row>
            </div>

            <!-- 试卷正文 -->
            <el-main id="paper-main" v-loading="loading">
                <!-- 单选题 -->
                <div v-if="itemRadio">
                    <el-row class="paper-title">
                        <el-col :span="12" class="font20 fxb-333"
                            >单选题</el-col
                        >
                        <el-col :span="12" class="taRight font14 fxb-999"
                            >共
                            {{
                                itemRadio.totalQuestions
                                    ? itemRadio.totalQuestions
                                    : "0"
                            }}
                            题，每题
                            {{
                                itemRadio.singleScore
                                    ? itemRadio.singleScore
                                    : "0"
                            }}
                            分</el-col
                        >
                    </el-row>

                    <div class="paper-box">
                        <radio-box :list="itemRadio.questionBankList" />
                    </div>
                </div>

                <!-- 判断题 -->
                <div v-if="itemJudge">
                    <el-row class="paper-title">
                        <el-col :span="12" class="font20 fxb-333"
                            >判断题</el-col
                        >
                        <el-col :span="12" class="taRight font14 fxb-999"
                            >共
                            {{
                                itemJudge.totalQuestions
                                    ? itemJudge.totalQuestions
                                    : "0"
                            }}
                            题，每题
                            {{
                                itemJudge.singleScore
                                    ? itemJudge.singleScore
                                    : "0"
                            }}
                            分</el-col
                        >
                    </el-row>

                    <div class="paper-box">
                        <true-of-false :list="itemJudge.questionBankList" />
                    </div>
                </div>

                <!-- 多选题 -->
                <div v-if="itemMulti">
                    <el-row class="paper-title">
                        <el-col :span="12" class="font20 fxb-333"
                            >多选题</el-col
                        >
                        <el-col :span="12" class="taRight font14 fxb-999"
                            >共
                            {{
                                itemMulti.totalQuestions
                                    ? itemMulti.totalQuestions
                                    : "0"
                            }}
                            题，每题
                            {{
                                itemMulti.singleScore
                                    ? itemMulti.singleScore
                                    : "0"
                            }}
                            分</el-col
                        >
                    </el-row>

                    <div class="paper-box">
                        <MCQ :list="itemMulti.questionBankList" />
                    </div>
                </div>

                <!-- 填空题 -->
                <div v-if="itemFill">
                    <el-row class="paper-title">
                        <el-col :span="12" class="font20 fxb-333"
                            >填空题</el-col
                        >
                        <el-col :span="12" class="taRight font14 fxb-999"
                            >共
                            {{
                                itemFill.totalQuestions
                                    ? itemFill.totalQuestions
                                    : "0"
                            }}
                            题，每题
                            {{
                                itemFill.singleScore
                                    ? itemFill.singleScore
                                    : "0"
                            }}
                            分</el-col
                        >
                    </el-row>

                    <div class="paper-box">
                        <Completion :list="itemFill.questionBankList" />
                    </div>
                </div>

                <el-col :span="24" align="center" class="marT40">
                    <el-button
                        type="primary"
                        size="medium"
                        @click="getAllAnswer"
                        style="width: 100px; height: 40px;"
                        >交卷</el-button
                    >
                    <!-- <el-button type="default" @click="backToClassInfo">退出</el-button> -->
                </el-col>
            </el-main>

            <!-- footer -->
            <el-footer>
                <FxbFooter />
            </el-footer>
        </el-container>
    </div>
</template>

<script>
// 引入在线考试公共样式
import "@/styles/onlineTest.scss";
// 引入公共组件
import FxbHeader from "@/views/layouts/fxb/components/FxbHeader";
import FxbMain from "@/views/layouts/fxb/components/FxbMain";
import FxbFooter from "@/views/layouts/fxb/components/FxbFooter";
// 引入在线考试子组件
import RadioBox from "./pageComponents/Radio/index";
import TrueOfFalse from "./pageComponents/TrueOfFalse/index";
import MCQ from "./pageComponents/MCQ/index";
import Completion from "./pageComponents/Completion/index";
// 引入获取数据接口文件
import { getUserInfo } from "@/utils/auth";
import {
    Api_GetExampaper,
    Api_SubmitPapers,
    Api_GetExamDuration,
    Api_GenExamination
} from "@/api/onlineTest";
import { API_GetInfoByCurrentUser } from "@/api/userCenter/baseInfo";
// 引入filters
import { dateFormat, formatSeconds } from "@/utils/index";

export default {
    filters: { dateFormat, formatSeconds },
    components: {
        FxbHeader,
        FxbMain,
        FxbFooter,
        RadioBox,
        TrueOfFalse,
        MCQ,
        Completion
    },
    data() {
        return {
            radioScore: "",
            testPageInfo: {},
            userInfo: getUserInfo(),
            itemRadio: {
                totalQuestions: 0,
                singleScore: 0,
                questionBankList: []
            },
            itemMulti: {
                totalQuestions: 0,
                singleScore: 0,
                questionBankList: []
            },
            itemJudge: {
                totalQuestions: 0,
                singleScore: 0,
                questionBankList: []
            },
            itemFill: {
                totalQuestions: 0,
                singleScore: 0,
                questionBankList: []
            },
            loading: false,
            exampaperId: "",
            countdown: 0,
            realName: "",
            timeName: null
        };
    },
    computed: {},
    created() {
        // 赋值试卷id
        this.exampaperId = this.$route.params.exampaperId;
        this.trainId = this.$route.params.trainId;
    },
    mounted() {
        // 获取真实姓名
        this.getRealName();

        // 获取试卷内容
        this.getExampaper();
    },
    beforeDestroy() {
        // 清空计时器
        clearInterval(this.timeName);

        // 重置答案计数器
        this.$store.dispatch("ResetAllArr");
    },
    methods: {
        // 获取真实姓名
        getRealName() {
            API_GetInfoByCurrentUser().then(res => {
                if (res.data !== "" && res.stateCode === "1") {
                    this.realName = res.data.legalPerson;
                }
            });
        },
        // 获取倒计时
        getExamDuration() {
            Api_GetExamDuration({
                id: this.$route.params.exampaperId,
                trainId: this.trainId
            }).then(res => {
                if (res.stateCode === "1") {
                    this.countdown = res.data;
                    this.timeName = setInterval(() => {
                        this.countdown--;

                        if (this.countdown <= 0) {
                            this.countdown;
                            clearInterval(this.timeName);
                            this.autoGetAllAnswer();
                        }
                    }, 1000);
                } else if (res.stateCode === "20105") {
                    console.log("用户不存在");
                } else if (res.stateCode === "2") {
                    this.backToClassInfo();
                } else {
                    console.log("系统错误");
                }
            });
        },
        // 获取试卷问题列表
        getExampaper() {
            Api_GetExampaper(this.exampaperId).then(res => {
                if (res.stateCode === "1") {
                    this.testPageInfo = res.data;

                    // 分类题型列表
                    this.itemFill = res.data.itemFill;
                    this.itemJudge = res.data.itemJudge;
                    this.itemMulti = res.data.itemMulti;
                    this.itemRadio = res.data.itemRadio;

                    // 根据接口返回的数据，添加未完成题目[]
                    if (this.itemRadio) {
                        const radioQuestionBankList = new Array(
                            this.itemRadio.questionBankList.length
                        ).fill("false");
                        this.$store.dispatch(
                            "SaveRadioQuestions",
                            radioQuestionBankList
                        );
                    }

                    if (this.itemMulti) {
                        const mulQuestionBankList = new Array(
                            this.itemMulti.questionBankList.length
                        ).fill("false");
                        this.$store.dispatch(
                            "SaveMulQuestions",
                            mulQuestionBankList
                        );
                    }

                    if (this.itemJudge) {
                        const TFQuestionBankList = new Array(
                            this.itemJudge.questionBankList.length
                        ).fill("false");
                        this.$store.dispatch(
                            "SaveTFQuestions",
                            TFQuestionBankList
                        );
                    }

                    if (this.itemFill) {
                        const completionQuestionBankList = new Array(
                            this.itemFill.questionBankList.length
                        ).fill("false");
                        this.$store.dispatch(
                            "SaveCompletionQuestions",
                            completionQuestionBankList
                        );
                    }

                    // 页面获取后调用倒计时
                    this.getExamDuration();
                }
            });
        },
        // 交卷
        getAllAnswer() {
            /**
             * 获取已做题目[],初始化未做题目[]
             */
            const radioDoList = this.$store.getters.radioGroup
                .radioQuestionList;
            const radioAnswerList = this.$store.getters.radioGroup
                .radioAnswerList;
            const notFillRadio = [];

            const mulDoList = this.$store.getters.mulGroup.mulQuestionList;
            const mulAnswerList = this.$store.getters.mulGroup.mulAnswerList;
            const notFillMul = [];

            const TFDoList = this.$store.getters.TFGroup.TFQuestionList;
            const TFAnswerList = this.$store.getters.TFGroup.TFAnswerList;
            const notFillTF = [];

            const completionDoList = this.$store.getters.completionGroup
                .completionQuestionList;
            const completionAnswerList = this.$store.getters.completionGroup
                .completionAnswerList;
            const notFillCompletion = [];

            // 获取未选题目编号
            if (
                this.itemRadio &&
                this.itemRadio.questionBankList.length !== 0
            ) {
                if (
                    radioAnswerList.length !==
                    this.itemRadio.questionBankList.length
                ) {
                    for (let index = 0; index < radioDoList.length; index++) {
                        if (radioDoList[index] === "false") {
                            notFillRadio.push(index + 1);
                        }
                    }
                }
            }

            if (
                this.itemMulti &&
                this.itemMulti.questionBankList.length !== 0
            ) {
                if (
                    mulAnswerList.length !==
                    this.itemMulti.questionBankList.length
                ) {
                    for (let index = 0; index < mulDoList.length; index++) {
                        if (mulDoList[index] === "false") {
                            notFillMul.push(index + 1);
                        }
                    }
                }
            }

            if (
                this.itemJudge &&
                this.itemJudge.questionBankList.length !== 0
            ) {
                if (
                    TFAnswerList.length !==
                    this.itemJudge.questionBankList.length
                ) {
                    for (let index = 0; index < TFDoList.length; index++) {
                        if (TFDoList[index] === "false") {
                            notFillTF.push(index + 1);
                        }
                    }
                }
            }

            if (this.itemFill && this.itemFill.questionBankList.length !== 0) {
                if (
                    completionAnswerList.length !==
                    this.itemFill.questionBankList.length
                ) {
                    for (
                        let index = 0;
                        index < completionDoList.length;
                        index++
                    ) {
                        if (completionDoList[index] === "false") {
                            notFillCompletion.push(index + 1);
                        }
                    }
                }
            }

            /**
             * 根据是否已做完题目，判断显示的提示文字内容
             */

            if (
                this.itemRadio ||
                this.itemMulti ||
                this.itemJudge ||
                this.itemFill
            ) {
                let tipsInfo = "";
                let str = "";

                if (
                    this.itemRadio &&
                    this.itemRadio.questionBankList.length !== 0
                ) {
                    if (notFillRadio.length !== 0) {
                        str += notFillRadio.length + "道选择题，";
                    }
                }

                let toPostMulList = "";
                if (
                    this.itemMulti &&
                    this.itemMulti.questionBankList.length !== 0
                ) {
                    if (notFillMul.length !== 0) {
                        str += notFillMul.length + "道多选题，";
                    } else {
                        // 转换多选题的数据格式为后端格式
                        for (const i in mulAnswerList) {
                            toPostMulList += mulAnswerList[i].toString() + ";";
                        }
                    }
                }

                if (
                    this.itemJudge &&
                    this.itemJudge.questionBankList.length !== 0
                ) {
                    if (notFillTF.length !== 0) {
                        str += notFillTF.length + "道判断题，";
                    }
                }

                let toPostCompletionList = "";
                if (
                    this.itemFill &&
                    this.itemFill.questionBankList.length !== 0
                ) {
                    if (notFillCompletion.length !== 0) {
                        str += notFillCompletion.length + "道填空题，";
                    } else {
                        // 转换多选题的数据格式为后端格式
                        for (const i in completionAnswerList) {
                            toPostCompletionList +=
                                completionAnswerList[i].toString() + ";";
                        }
                    }
                }

                if (
                    notFillRadio.length === 0 &&
                    notFillMul.length === 0 &&
                    notFillTF.length === 0 &&
                    notFillCompletion.length === 0
                ) {
                    tipsInfo = "您已完成全部试题答题，确定要立即交卷吗？";
                } else {
                    tipsInfo =
                        "您尚有" + str + "未完成答题，确定要提前交卷吗？";
                }

                // 打开交卷确认框
                this.$confirm(tipsInfo, {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        Api_SubmitPapers({
                            exampaperId: this.exampaperId,
                            radioList: radioAnswerList.toString(),
                            judgeList: TFAnswerList.toString(),
                            multiList: toPostMulList,
                            fillList: toPostCompletionList,
                            trainId: this.trainId
                        })
                            .then(res => {
                                this.loading = true;
                                if (res.stateCode === "1") {
                                    this.loading = false;

                                    if (res.data.testResult === "1") {
                                        // 清空计时器
                                        clearInterval(this.timeName);

                                        this.$confirm(
                                            "您本次的考试成绩为" +
                                                res.data.testScore +
                                                '分，恭喜您考试合格，您可以稍后关注"信用修复-培训记录"页面下载您的培训结业证书，再次恭喜您。',
                                            {
                                                confirmButtonText: "确定",
                                                type: "warning"
                                            }
                                        )
                                            .then(() => {
                                                this.backToClassInfo();
                                                return;
                                            })
                                            .catch(() => {
                                                this.backToClassInfo();
                                            });
                                    } else {
                                        if (res.examCount === 0) {
                                            // 清空计时器
                                            clearInterval(this.timeName);

                                            this.$confirm(
                                                "您本次考试的考试成绩为" +
                                                    res.data.testScore +
                                                    "分，很遗憾您考试未通过",
                                                {
                                                    confirmButtonText: "确定",
                                                    cancelButtonText: "退出",
                                                    type: "warning"
                                                }
                                            )
                                                .then(() => {
                                                    this.$router.push({
                                                        path:
                                                            "/trainClass/classInfo/?id=" +
                                                            this.trainId
                                                    });
                                                })
                                                .catch(() => {
                                                    this.$router.push({
                                                        path:
                                                            "/trainClass/classInfo/?id=" +
                                                            this.trainId
                                                    });
                                                });
                                        } else {
                                            // 清空计时器
                                            clearInterval(this.timeName);

                                            this.$confirm(
                                                "您本次考试的考试成绩为" +
                                                    res.data.testScore +
                                                    "分，很遗憾您考试未通过，您还有" +
                                                    res.data.examCount +
                                                    "次考试机会，是否立即开始重新考试？",
                                                {
                                                    confirmButtonText:
                                                        "重新考试",
                                                    cancelButtonText:
                                                        "下次再考",
                                                    type: "warning"
                                                }
                                            )
                                                .then(() => {
                                                    // 重新考试
                                                    this.startTest();
                                                })
                                                .catch(() => {
                                                    this.$router.push({
                                                        path:
                                                            "/trainClass/classInfo/?id=" +
                                                            this.trainId
                                                    });
                                                });
                                        }
                                    }
                                } else if (res.stateCode === "4") {
                                    // 清空计时器
                                    clearInterval(this.timeName);

                                    this.$confirm(
                                        "您的考试机会已经用尽，请联系客服处理，客服电话：0512-88880812。",
                                        {
                                            showConfirmButton: false,
                                            showCancelButton: false,
                                            type: "warning"
                                        }
                                    )
                                        .then(() => {
                                            this.$router.push({
                                                path:
                                                    "/trainClass/classInfo/?id=" +
                                                    this.trainId
                                            });
                                        })
                                        .catch(() => {
                                            this.$router.push({
                                                path:
                                                    "/trainClass/classInfo/?id=" +
                                                    this.trainId
                                            });
                                        });
                                } else {
                                    this.$message.error("交卷失败");
                                }
                            })
                            .catch(() => {
                                this.loading = false;
                            });
                    })
                    .catch(() => {
                        this.loading = false;
                    });
            }
        },
        // 自动交卷
        autoGetAllAnswer() {
            if (
                this.itemRadio ||
                this.itemMulti ||
                this.itemJudge ||
                this.itemFill
            ) {
                this.loading = true;
                this.$message.warning("考试时间到，系统自动交卷，");

                /**
                 * 获取已做题目
                 */
                const radioAnswerList = this.$store.getters.radioGroup
                    .radioAnswerList;
                const mulAnswerList = this.$store.getters.mulGroup
                    .mulAnswerList;
                const TFAnswerList = this.$store.getters.TFGroup.TFAnswerList;
                const completionAnswerList = this.$store.getters.completionGroup
                    .completionAnswerList;

                // 转换多选题的数据格式为后端格式
                let toPostMulList = "";
                for (const i in mulAnswerList) {
                    toPostMulList += mulAnswerList[i].toString() + ";";
                }

                let toPostCompletionList = "";
                for (const i in completionAnswerList) {
                    toPostCompletionList +=
                        completionAnswerList[i].toString() + ";";
                }

                Api_SubmitPapers({
                    exampaperId: this.exampaperId,
                    radioList: radioAnswerList.toString(),
                    judgeList: TFAnswerList.toString(),
                    multiList: toPostMulList,
                    fillList: toPostCompletionList,
                    trainId: this.trainId
                })
                    .then(res => {
                        if (res.stateCode === "1") {
                            // 清空计时器
                            clearInterval(this.timeName);

                            this.loading = false;

                            if (res.data.testResult === "1") {
                                this.$confirm(
                                    "您本次的考试成绩为" +
                                        res.data.testScore +
                                        '分，恭喜您考试合格，您可以稍后关注"信用修复-培训记录"页面下载您的培训结业证书，再次恭喜您。',
                                    {
                                        confirmButtonText: "确定",
                                        type: "warning"
                                    }
                                )
                                    .then(() => {
                                        this.backToClassInfo();
                                        return;
                                    })
                                    .catch(() => {
                                        this.backToClassInfo();
                                    });
                            } else {
                                if (res.examCount === 0) {
                                    this.$confirm(
                                        "您本次考试的考试成绩为" +
                                            res.data.testScore +
                                            "分，很遗憾您考试未通过",
                                        {
                                            confirmButtonText: "确定",
                                            cancelButtonText: "退出",
                                            type: "warning"
                                        }
                                    )
                                        .then(() => {
                                            this.$router.push({
                                                path:
                                                    "/trainClass/classInfo/?id=" +
                                                    this.trainId
                                            });
                                        })
                                        .catch(() => {
                                            this.$router.push({
                                                path:
                                                    "/trainClass/classInfo/?id=" +
                                                    this.trainId
                                            });
                                        });
                                } else {
                                    this.$confirm(
                                        "您本次考试的考试成绩为" +
                                            res.data.testScore +
                                            "分，很遗憾您考试未通过，您还有" +
                                            res.data.examCount +
                                            "次考试机会，是否立即开始重新考试？",
                                        {
                                            confirmButtonText: "重新考试",
                                            cancelButtonText: "下次再考",
                                            type: "warning"
                                        }
                                    )
                                        .then(() => {
                                            // 重新考试
                                            this.startTest();
                                        })
                                        .catch(() => {
                                            this.$router.push({
                                                path:
                                                    "/trainClass/classInfo/?id=" +
                                                    this.trainId
                                            });
                                        });
                                }
                            }
                        } else {
                            this.$message.error("交卷失败");
                        }
                    })
                    .catch(() => {
                        this.loading = false;
                    });
            }
        },
        // 退出考试
        backToClassInfo() {
            this.$router.push({
                path: "/trainClass/classInfo/?id=" + this.trainId
            });
        },
        // 重新开始考试
        startTest() {
            Api_GenExamination({
                id: this.exampaperId,
                trainId: this.trainId
            }).then(res => {
                if (res.stateCode === "1") {
                    this.$router.push({
                        path:
                            "/onlineTest/" +
                            this.exampaperId +
                            "/" +
                            this.trainId
                    });
                    this.getExamDuration();
                    this.$router.go(0);
                } else if (res.stateCode === "0") {
                    //
                } else if (res.stateCode === "4") {
                    // 清空计时器
                    clearInterval(this.timeName);

                    this.$confirm(
                        "您的考试机会已经用尽，请联系客服处理，客服电话：0512-88880812。",
                        {
                            showConfirmButton: false,
                            showCancelButton: false,
                            type: "warning"
                        }
                    )
                        .then(() => {
                            this.$router.push({
                                path:
                                    "/trainClass/classInfo/?id=" + this.trainId
                            });
                        })
                        .catch(() => {
                            this.$router.push({
                                path:
                                    "/trainClass/classInfo/?id=" + this.trainId
                            });
                        });
                } else {
                    this.$message.error(res.message);
                }
            });
        }
    }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.test-top-box {
    background-color: #406b9a;

    .test-top-inner {
        margin: 0 auto;
        padding-top: 37px;
        padding-bottom: 13px;
        width: 1123px;
        color: #ffffff;
    }

    .test-info-box {
        flex-wrap: wrap;
    }

    .test-info {
        margin-bottom: 16px;
        flex: 0 0 33.3333%;

        .font14 {
            padding-left: 38px;
            padding-right: 30px;
            min-width: 120px;

            &:nth-child(2) {
                padding-left: 0;
                padding-right: 0;
            }
        }
    }
}

.cfff {
    color: #ffffff;
}

#paper-main {
    width: 897px;
    margin: 0 auto;
}

.paper-title {
    height: 60px;
    line-height: 60px;
    padding-left: 8px;
}

.paper-box {
    padding: 54px 0 25px 0;
    background: #ffffff;
}
</style>
