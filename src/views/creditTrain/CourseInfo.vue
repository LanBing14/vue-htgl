<template>
    <div class="marB25">
        <el-row style="margin: 17px 0 30px 15px">
            <el-col :span="24">
                <h2 class="font24 overH">
                    课程详情
                    <span class="floatR">
                        <el-button type="text" icon="el-icon-arrow-left" size="small" @click="goBack()">返回</el-button>
                    </span>
                </h2>
            </el-col>
        </el-row>

        <div class="class-panel overH">
            <div class="img-box class-cover floatL">
                <img v-if="couserInfo.picurl" :src="fileUrlBase + couserInfo.picurl" alt="封面图片"/>
                <img v-else src="~@/assets/images/no-pic.png" class="image" />
            </div>
            <div class="class-desc floatR" v-loading="infoLoading">
                <div class="desc-title overH marT20">
                    <h2 class="floatL font20">{{ couserInfo.name }}</h2>
                    <div class="floatR">
                        <!--                        <el-button-->
                        <!--                            type="primary"-->
                        <!--                            size="small"-->
                        <!--                            @click="joinClick()"-->
                        <!--                            :disabled="couserInfo.JOIN_STATUS === '1'"-->
                        <!--                        >{{ (couserInfo.JOIN_STATUS === '0') ? '审核中' : (couserInfo.JOIN_STATUS === '1') ? '已参加课程' :-->
                        <!--                            '立即参加' }}-->
                        <!--                        </el-button>-->
                    </div>
                </div>
<!--                <div class="desc-price lightBlue">-->
                <!--                    <span>价格</span>-->
                <!--                    <span class="blue">￥{{ $toMoney(couserInfo.price, 2) }}</span>-->
                <!--                    <span>学员</span>spa-->
                <!--                    <span class="fxb-333">{{ couserInfo.MEMBER_COUNT }}</span>-->
                <!--                </div>-->
                <p class="lightBlue">课程介绍</p>
                <div class="desc-content fx.fxb-666">{{ couserInfo.intro }}</div>
            </div>
        </div>

        <div class="class-course-teacher overH">
            <div class="class-teacher floatR" v-loading="teacherLoading">
                <span>讲师简介</span>
                <div class="overH">
                    <img class="teacher-avatar floatL" v-if="teacherInfo.picurl" :src="fileUrlBase + teacherInfo.picurl" alt/>
                    <img v-else src="~@/assets/images/no-pic.png" style="width:56px;height:56px"  class="image"/> 
                    <div class="teacher-name floatL">
                        <h3 class="font16">{{ teacherInfo.name }}</h3>
                        <!--                        <p class="fxb.fxb-999 font12">{{ teacherInfo.TITLE }}</p>-->
                    </div>
                </div>
                <div class="teacher-desc fx.fxb-666">
                    <p>{{ teacherInfo.intro }}</p>
                </div>
            </div>

            <div class="class-course-leftbox overH">
                <el-row :gutter="10" class="class-course-title" type="flex" align="middle" v-loading="lessonLoading">
                    <el-col :span="3" class="font20 fontwb">课程大纲</el-col>
                    <el-col :span="15" :offset="1" style="margin-left: 70px;">
                        <el-progress :show-text="false" :stroke-width="12" :percentage="percentLength()" status="success"></el-progress>
                        <span class="fxb.fxb-999 font12 marT10 floatL">目前已经完成 {{ lessonComplete }} 个课时，继续加油!</span>
                        <!--                        <span-->
                        <!--                            class="fxb.fxb-999 font12 marT10 floatR ellipsis"-->
                        <!--                            style="max-width:300px;"-->
                        <!--                            v-if="lessonNext"-->
                        <!--                        >下一课时: {{ lessonNext.LESSON_NO || '无' }}</span>-->
                    </el-col>
                    <el-col
                        :span="3"
                        :offset="1"
                        v-if="userInfo.userId && (couserInfo.JOIN_STATUS === '1')"
                        style="margin-left: 18px;"
                    >
                        <el-button
                            type="success"
                            size="default"
                            @click="continueClick()"
                            v-if="lessonCurrent"
                            :disabled="allLessonFinish"
                        >{{ allLessonFinish ? '学习完成' : '继续学习' }}</el-button>
                    </el-col>
                </el-row>

                <div class="class-course-list" v-loading="lessonLoading">
                    <ul class="class-course">
                        <li class="dFlex" v-for="( item, index ) in couserInfo.lessonVoList" :key="index">
                            <span class="lightGray classOrder">{{ item.LESSON_NO }}</span>
                            <span class="fxb-333 ellipsis className">{{ item.name }}</span>
                            <span
                                class="font12 lightGray classDate"
                            >{{ item.learning && formatSeconds(item.learning.durationSecond) }}</span>
                            <span class="font12 lightGray learnState">
                                <!--  null或者0:未学习 1:学习中 2:已学习 -->
                                {{ item.learning | filterState(item.durationSecond) }}
                            </span>
                            <span class="icon-play" @click="videoClick(item)" :disabled="!userInfo.userId"></span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- 信用修复弹窗 开始 -->
        <el-dialog title="课程申请" :visible.sync="courseDialogVisible"
                   :close-on-click-modal="false"
                   width="560px" top="10px" :before-close="handleClose">
            <el-form ref="courseForm" :model="courseForm" :rules="courseRules" label-width="130px">
                <el-form-item label="课程名称：">
                    <el-input v-model="courseForm.courseName" disabled></el-input>
                </el-form-item>
                <el-form-item label>
                    <img :src="fileUrlBase + courseForm.courseCover" alt/>
                </el-form-item>
                <el-form-item label="课程价格(元)：">
                    <el-input v-model="courseForm.coursePrice" disabled></el-input>
                </el-form-item>
                <el-form-item label="请选择支付方式：">
                    <div class="pay-type" :class="{'active': courseForm.payType === '1' }" @click="courseForm.payType = '1'">
                        <img src="@/assets/images/pay/AliLogo.png" width="66px" alt />
                    </div>
                    <div class="pay-type" :class="{'active': courseForm.payType === '2' }">
                        <el-tooltip class="item" effect="dark" content="暂时尚不支持微信支付，正在对接中..." placement="top-start">
                            <img src="@/assets/images/pay/WePayLogo.png" width="80px" alt />
                        </el-tooltip>
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: center;">
                <el-button type="primary" @click="submitForm('courseForm')" :loading="submitLoading">确定</el-button>
                <el-button @click="resetForm('courseForm')">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { formatSeconds, toAliPay } from "@/utils/index";
import { getUserInfo } from "@/utils/auth";
import { Api_GetCompanyInfoById } from "@/api/baseApi";
import {
    Api_ApplyCourse,
    Api_GetCourseById,
    Api_GetLessonsByCourseId,
    Api_GetTeacherByCourseId,
    Api_CoursesPublishedDetail,
    Api_CoursesPublishedLessonDetail,
    Api_TeachersDetail
} from "@/api/creditTrain";

export default {
    filters: {
        filterState(value, all) {
            if (!value || !value.durationSecond) {
                return "未学习";
            } else if (value.durationSecond > 0 && value.durationSecond < all) {
                return "学习中";
            } else if (value.durationSecond === all) {
                return "已学习";
            }
        }
    },
    data() {
        return {
            fileUrlBase: process.env.VUE_APP_FILE_API,
            userInfo: getUserInfo(),
            courseDialogVisible: false,
            lessonComplete: 0,
            courseRules: {},
            couserInfo: {},
            infoLoading: false,
            lessonCurrent: {},
            lessonNext: {},
            lessonInfo: {},
            allLessonFinish: false,
            lessonLoading: false,
            teacherInfo: {},
            teacherLoading: false,
            submitLoading: false,
            courseForm: {
                courseId: "",
                linkman: "",
                phoneNo: "",
                applyInfo: "",
                courseName: "",
                coursePrice: "",
                courseCover: "",
                payType: "1"
            }
        };
    },
    computed: {},
    mounted() {
        const { id } = this.$route.query;

        // 课程信息
        this.infoLoading = true;
        Api_CoursesPublishedDetail(id)
            .then(res => {
                this.infoLoading = false;
                this.couserInfo = res;
                // 讲师信息
                if (res.teacherId) {
                    this.teacherLoading = true;
                    Api_TeachersDetail(res.teacherId)
                        .then(res => {
                            this.teacherLoading = false;
                            this.teacherInfo = res;
                        })
                        .catch(e => {
                            this.teacherLoading = false;
                            this.$message.error(e);
                        });
                }
            })
            .catch(e => {
                this.infoLoading = false;
                this.$message.error(e);
            });
        /* this.lessonLoading = true;
            Api_CoursesPublishedLessonDetail(id).then(res => {
                this.lessonLoading = false;
                this.lessonInfo = res;
                if (res.length > 0) {
                    const finishLesson = [];
                    const learnLesson = [];
                    const unfinishLesson = [];
                    for (let i = 0; i < res.data.length; i++) {
                        if (res.data[i].LEARNING_STATUS === "2") {
                            finishLesson.push(res.data[i]);
                        } else if (res.data[i].LEARNING_STATUS === "1") {
                            learnLesson.push(res.data[i]);
                        } else {
                            unfinishLesson.push(res.data[i]);
                        }
                    }
                    this.allLessonFinish =
                        finishLesson.length === res.data.length;
                    if (learnLesson.length === 0) {
                        this.lessonCurrent =
                            finishLesson[finishLesson.length - 1];
                        this.lessonNext = unfinishLesson[0];
                    } else {
                        this.lessonCurrent = learnLesson[0];
                        for (let j = 0; j < res.data.length; j++) {
                            if (learnLesson[0].ID === res.data[j].ID) {
                                this.lessonNext = res.data[j + 1];
                            }
                        }
                    }
                }
            });*/
    },
    methods: {
        formatSeconds,
        goBack() {
            if (this.$route.query.type === "1") {
                this.$router.push({
                    path: "/creditTrain/trainCourse"
                });
            } else if (this.$route.query.type === "0") {
                this.$router.push({
                    path: "/creditTrain"
                });
            } else if (this.$route.query.type === "2") {
                this.$router.push({
                    path: "/creditTeacherList/teacherInfo?id=" + this.$route.query.teacherId
                });
            } else if (this.$route.query.type === "3") {
                this.$router.push({
                    path: "/userCenter/training"
                });
            }
        },
        percentLength() {
            if (this.couserInfo.lessonVoList) {
                const { lessonVoList } = this.couserInfo;
                const count = lessonVoList.filter(i => i.learning && i.learning.finished).length;
                this.lessonComplete = count;
                return (count / lessonVoList.length) * 100;
            }
        },
        joinClick() {
            if (!this.userInfo.userName) {
                this.$login.login();
            } else {
                if (this.couserInfo.JOIN_STATUS === "0") {
                    this.$confirm("您已提交申请，正在审核中，请耐心等待...", "提示", {
                        showCancelButton: false,
                        confirmButtonText: "确定",
                        type: "warning"
                    });
                    return false;
                }

                this.courseForm.courseId = this.$route.query.id;

                if (this.couserInfo.COURSE_PRICE) {
                    this.courseForm.courseName = this.couserInfo.COURSE_NAME;
                    this.courseForm.coursePrice = this.$turnMoney(this.couserInfo.COURSE_PRICE, false);
                    this.courseForm.courseCover = this.couserInfo.COURSE_COVER;

                    Api_GetCompanyInfoById({
                        userId: this.userInfo.userId
                    }).then(data => {
                        this.courseForm.linkman = data.data.realName;
                        this.courseForm.phoneNo = data.data.phoneNo;
                    });

                    this.courseDialogVisible = true;
                } else {
                    Api_ApplyCourse({
                        courseId: this.$route.query.id
                    }).then(res => {
                        if (res.stateCode === "1") {
                            this.couserInfo.JOIN_STATUS = "1";
                            this.$message.warning("已参加课程");
                        } else {
                            this.$confirm("您的考试机会已经用尽，请联系客服处理，客服电话：0512-88880812", "提示", {
                                showCancelButton: false,
                                confirmButtonText: "确定",
                                type: "warning"
                            });
                        }
                    });
                }
            }
        },
        handleClose() {
            this.courseDialogVisible = false;
            this.resetForm("courseForm");
        },
        continueClick() {
            if (this.couserInfo.JOIN_STATUS === "1") {
                if (this.lessonNext) {
                    this.$router.push({
                        path: "/creditTrain/video",
                        query: {
                            course: this.$route.query.id,
                            lesson: this.lessonNext.ID
                        }
                    });
                } else {
                    this.$router.push({
                        path: "/creditTrain/video",
                        query: {
                            course: this.$route.query.id,
                            lesson: this.lessonCurrent.ID
                        }
                    });
                }
            } else {
                this.joinClick();
            }
        },
        videoClick(item) {
            // if (this.couserInfo.JOIN_STATUS === "1") {
            this.$router.push({
                path: "/creditTrain/video",
                query: {
                    id: item.id
                    // course: this.$route.query.id,
                    // lesson: item.id
                }
            });
            // } else {
            //     this.joinClick();
            // }
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    // 微信支付暂时禁用
                    if (this.courseForm.payType === "2") {
                        this.$message.warning("暂时尚不支持微信支付，正在对接中...");
                        return;
                    }
                    this.submitLoading = true;
                    Api_ApplyCourse(this.courseForm).then(res => {
                        if (res.stateCode === "1") {
                            if (this.courseForm.payType === "1") {
                                // TODO 去支付宝支付
                                toAliPay(res.data);
                            } else {
                                // TODO 微信支付
                                this.$confirm("微信支付期待中", "提示", {
                                    showCancelButton: false,
                                    confirmButtonText: "确定",
                                    type: "success"
                                });
                            }
                            this.$confirm("支付完成后，请根据支付情况点击以下按钮", "网上支付提示", {
                                distinguishCancelAndClose: true,
                                confirmButtonText: "支付成功",
                                cancelButtonText: "支付遇到问题"
                            })
                                .then(() => {
                                    location.reload();
                                    // this.$router.push("/userCenter/order/report");
                                })
                                .catch(action => {
                                    if (action === "cancel") {
                                        this.$router.push({
                                            path: "/userCenter/contact"
                                        });
                                    }
                                });
                            this.couserInfo.JOIN_STATUS = "0";
                        } else {
                            this.$message.error("课程申请提交失败");
                        }
                        this.$refs[formName].resetFields();
                        this.courseDialogVisible = false;
                        this.submitLoading = false;
                    });
                } else {
                    this.submitLoading = false;
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.courseDialogVisible = false;
            this.$refs[formName].resetFields();
        },
        teacherClick() {
            this.$router.push({
                path: "/creditTeacherList/teacherInfo?id=" + this.teacherInfo.ID
            });
        }
    }
};
</script>

<style lang="scss">
.class-course-title {
    .el-progress-bar__outer {
        border-radius: 3px;
    }

    .el-progress-bar__inner {
        border-radius: 0;
    }
}
</style>

<style lang="scss" scoped>
.pay-type {
    text-align: center;
    width: 152px;
    height: 54px;
    line-height: 54px;
    border: 1px solid #d3d3d3;
    float: left;
    margin-right: 18px;
    position: relative;
    cursor: pointer;
}

.pay-type.active {
    border: 1px solid #00c800;
}

.pay-type::after {
    content: "";
    width: 26px;
    height: 26px;
    position: absolute;
    top: 0;
    right: 0;
    background-image: url(../../assets/images/pay/paycheck.png);
    background-repeat: no-repeat;
    background-position: -297px -4px;
}

.pay-type.active::after {
    background-position: -129px -4px;
}

.icon-play {
    display: inline-block;
    width: 31px;
    height: 31px;
    background-image: url(../../assets/images/playa.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    cursor: pointer;
}

.icon-play:hover {
    background-image: url(../../assets/images/play.png);
}

.icon-test {
    display: inline-block;
    width: 31px;
    height: 31px;
    background-image: url(../../assets/images/test.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    cursor: pointer;
}

.desc-title {
    font-size: 14px;
    line-height: 32px;
}

.desc-price {
    padding: 25px 0 15px;
    margin-bottom: 15px;
    border-bottom: 1px solid #e0e3ec;
}

.desc-price .blue,
.desc-price .fxb-333 {
    display: inline-block;
    margin: 0 80px 0 15px;
}

.desc-content {
    margin-top: 15px;
    line-height: 25px;
    text-indent: 24px;
    margin-bottom: 10px;
}

.class-panel {
    margin-bottom: 60px;
}

.class-cover {
    width: 446px;
    height: 279px;
}

.class-desc {
    width: calc(100% - 446px - 55px);
    margin-left: 55px;
}

.class-course-title {
    background-color: #fff;
    padding: 15px 35px;
    margin-bottom: 25px;
}

.class-course-list {
    background-color: #fff;
    padding: 35px;
}

.class-class {
    margin-bottom: 25px;
}

.class-class h2 {
    font-size: 16px;
}

.teacher-avatar {
    width: 56px;
    height: 56px;
    margin: 20px 20px 20px 0;
    border-radius: 50%;
}

.teacher-name {
    margin-top: 20px;
}

.teacher-name h3 {
    margin-top: 5px;
    margin-bottom: 10px;
}

.teacher-desc p {
    line-height: 24px;
    text-indent: 2em;
}

.class-course {
    margin-bottom: 5px;
}

.class-course h3 {
    font-size: 14px;
}

.class-teacher {
    margin-left: 30px;
    width: 260px;
    float: right;
    background-color: #fff;
    padding: 24px 20px;
    padding-bottom: 999px;
    margin-bottom: -999px;
}

.class-course {
    li {
        margin-bottom: 7px;
        line-height: 30px;
    }

    .classOrder {
        width: 80px;
    }

    .className {
        padding-right: 30px;
        width: 470px;
    }

    .classTime {
        width: 129px;
    }

    .classDate {
        width: 128px;
    }

    .learnState {
        width: 178px;
    }
}
</style>
