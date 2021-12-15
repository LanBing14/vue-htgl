<template>
    <div>
        <el-row style="margin: 17px 0 30px 15px">
            <el-col :span="24">
                <h2 class="font24 overH">
                    班级详情
                    <div class="floatR">
                        <el-button
                            type="text"
                            icon="el-icon-arrow-left"
                            size="small"
                            @click="goBack()"
                        >返回</el-button>
                    </div>
                </h2>
            </el-col>
        </el-row>

        <div class="class-panel overH" v-loading="infoLoading">
            <div class="img-box class-cover floatL">
                <img :src="classInfo.CLASS_COVER" alt="封面图片" />
            </div>
            <div class="class-desc floatR">
                <div class="desc-title overH" style="margin-top: 13px;">
                    <h2 class="floatL font20">{{ classInfo.CLASS_NAME }}</h2>
                    <div class="floatR marR20">
                        <el-button
                            type="primary"
                            size="medium"
                            @click="joinClick()"
                            v-if="classInfo.JOIN_STATUS !== '1'"
                        >{{ (classInfo.JOIN_STATUS === '0') ? '审核中' : (classInfo.JOIN_STATUS === '1') ? '已参加课程' : '立即参加' }}</el-button>
                    </div>
                </div>
                <div class="desc-price lightBlue">
                    <span>价格</span>
                    <span class="blue">￥{{ classInfo.TRAIN_PRICE }}</span>
                    <span>学员</span>
                    <span class="fxb-333">{{ classInfo.MEMBER_COUNT }}</span>
                </div>
                <p class="lightBlue">班级介绍</p>
                <div class="desc-content fxb.fxb-666">{{ classInfo.CLASS_INFO }}</div>
            </div>
        </div>

        <div class="class-course-teacher overH">
            <div class="class-course-title font20">课程大纲</div>
            <div class="class-course-list padT35" v-loading="courseLoading">
                <div class="class-class borderb" v-for="(item,index) in courseInfo" :key="index">
                    <div class="dFlex class-course1">
                        <div :span="2" class="font14 lightGray lessonOrder">{{ '课程' + (index + 1) }}</div>
                        <div :span="14" class="lessonName">
                            <h2 class="ellipsis font16">{{ item.COURSE_NAME }}</h2>
                        </div>
                        <div class="lessonPercent">
                            <el-progress
                                :show-text="false"
                                :stroke-width="15"
                                :percentage="percentLength(item.LESSONS)"
                                status="success"
                            ></el-progress>
                        </div>
                    </div>

                    <div style="margin-top: 29px; margin-left: 63px;">
                        <ul class="class-course2">
                            <li class="dFlex" v-for="(iitem,iindex) in item.LESSONS" :key="iindex">
                                <div class="font12 lightGray classOrder">{{ iitem.LESSON_NO }}</div>
                                <div class="className">
                                    <h3 class="ellipsis">{{ iitem.FILE_NAME }}</h3>
                                </div>
                                <div
                                    class="font12 lightGray classDate"
                                >{{ ((iitem.DURATION_MINUTE*1)*60 + iitem.DURATION_SECOND*1) | formatSeconds }}</div>
                                <div class="font12 lightGray learnState">
                                    <!--  null或者0:未学习 1:学习中 2:已学习 -->
                                    {{ (iitem.LEARNING_STATUS === '1') ? '学习中': (iitem.LEARNING_STATUS === '2') ? '已学习':'未学习' }}
                                </div>
                                <div>
                                    <span class="icon-play" @click="videoClick(iitem)"></span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="class-course-list marB40" v-loading="testLoading">
                <el-row
                    class="class-class"
                    :gutter="10"
                    type="flex"
                    align="middle"
                    v-for="(item,index) in testInfo"
                    :key="index"
                >
                    <el-col :span="2" class="lightGray">考试</el-col>
                    <el-col :span="12">
                        <h2 class="ellipsis">{{ item.NAME }}</h2>
                    </el-col>
                    <el-col
                        :span="3"
                        :offset="1"
                        class="font12 lightGray"
                    >{{ (item.EXAM_DURATION*1)*60 | formatSeconds }}</el-col>
                    <el-col :span="2" class="font12 lightGray">
                        <!-- 1:考试合格 2:考试未通过 -->
                        {{ (item.TEST_RESULT === '1') ? '考试合格': (item.TEST_RESULT === '2') ? '考试未通过' : '' }}
                    </el-col>
                    <el-col :span="2" :offset="2">
                        <span class="icon-test" @click="testClick(item)"></span>
                    </el-col>
                </el-row>
            </div>
        </div>

        <!-- 信用修复弹窗 开始 -->
        <el-dialog
            title="信用修复培训申请"
            :visible.sync="fixCreditDialogVisible"
            :close-on-click-modal="false"
            width="560px"
            top="10px"
            :before-close="handleClose"
        >
            <el-form
                ref="fixCreditForm"
                :model="fixCreditForm"
                :rules="fixCreditRules"
                label-width="110px"
            >
                <el-row :gutter="60">
                    <el-col :span="24">
                        <el-form-item
                            :rules="[
                        { required: true, message: '请输入公司名称', trigger: 'blur' }
                    ]"
                            label="公司名称"
                            prop="companyName"
                        >
                            <el-autocomplete
                                v-model="fixCreditForm.companyName"
                                placeholder="请输入您的公司名称"
                                :fetch-suggestions="querySearch"
                                :trigger-on-focus="false"
                                @select="handleSelect"
                                style="width: 100%;"
                                :disabled="roleStatus"
                            ></el-autocomplete>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item
                            label="联系人"
                            prop="linkman"
                            :rules="[
                        { required: true, message: '请输入您的姓名', trigger: 'blur' },
                        { max:20, message: '长度不超过20个字', trigger: 'change' }
                    ]"
                        >
                            <el-input v-model="fixCreditForm.linkman" placeholder="请输入您的姓名"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item
                            :rules="[
                        { required: true, message: '请输入您的手机号码', trigger: 'blur' },
                        { pattern: /^1[3456789]\d{9}$/,message: '请输入正确的手机号', trigger:['blur' ,'change'] }
                    ]"
                            label="手机号码"
                            prop="phoneNo"
                        >
                            <el-input v-model="fixCreditForm.phoneNo" placeholder="请输入您的手机号码"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" v-if="roleStatus">
                        <el-form-item
                            :rules="[
                        { pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/, message: '请输入正确的电子邮箱', trigger: ['blur', 'change']}
                    ]"
                            label="电子邮箱"
                            prop="email"
                        >
                            <el-input placeholder="请输入电子邮箱" v-model="fixCreditForm.email"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item
                            label="失信描述"
                            prop="dishonestDesc"
                            :rules="[
                        { required: true, message: '请输入您的失信描述', trigger: 'blur' },
                        { max:200, message: '长度不超过200个字', trigger: 'change' }
                    ]"
                        >
                            <el-input
                                :rows="4"
                                placeholder="请输入您的失信描述"
                                type="textarea"
                                v-model="fixCreditForm.dishonestDesc"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="培训信息">
                            <el-input v-model="fixCreditForm.className" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="课程价格(元)" style="margin-bottom:0">
                            <el-input v-model="fixCreditForm.classPrice" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: center;">
                <el-button type="primary" @click="submitForm()" :loading="submitLoading">确定</el-button>
                <el-button @click="resetForm()">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { formatSeconds } from "@/utils/index";
import { Api_CompanySearch } from "@/api/creditRepair";
import {
    Api_GetTrainById, // 获取培训班详情信息
    Api_GetCoursesByTrainId, // 根据培训班ID获取培训课程
    Api_GetExaminationByTrainId, // 根据培训班ID获取考试信息
    Api_RepairApplicatSave // 信用修复培训申请
} from "@/api/creditTrain";
import { getUserInfo } from "@/utils/auth";
import { Api_GetCompanyInfoById } from "@/api/baseApi";
import { Api_GenExamination } from "@/api/onlineTest";

export default {
    filters: { formatSeconds },
    data() {
        return {
            roleStatus: false,
            userInfo: getUserInfo(),
            fixCreditDialogVisible: false,
            fixCreditRules: {},
            classInfo: {},
            infoLoading: false,
            courseInfo: {},
            courseLoading: false,
            testInfo: {},
            testLoading: false,
            submitLoading: false,
            fixCreditForm: {
                linkman: "",
                type: "0",
                email: "",
                companyId: "",
                companyName: "",
                creditCode: "",
                phoneNo: "",
                dishonestDesc: "",
                serviceType: "1",
                trainId: "",
                className: "",
                classPrice: ""
            }
        };
    },
    computed: {},
    mounted() {
        this.infoLoading = true;
        Api_GetTrainById({
            trainId: this.$route.query.id
        }).then(res => {
            this.infoLoading = false;
            if (res.stateCode === "1") {
                this.classInfo = res.data;
            } else {
                //
            }
        });
        this.infoLoading = true;
        Api_GetCoursesByTrainId({
            trainId: this.$route.query.id
        }).then(res => {
            this.infoLoading = false;
            if (res.stateCode === "1") {
                this.courseInfo = res.data;
            } else {
                //
            }
        });
        this.infoLoading = true;
        Api_GetExaminationByTrainId({
            trainId: this.$route.query.id
        }).then(res => {
            this.infoLoading = false;
            if (res.stateCode === "1") {
                this.testInfo = res.data;
            } else {
                //
            }
        });
    },
    methods: {
        goBack() {
            if (this.$route.query.type === "1") {
                this.$router.push({
                    path: "/trainClass"
                });
            } else if (this.$route.query.type === "0") {
                this.$router.push({
                    path: "/creditTrain"
                });
            } else if (this.$route.query.type === "3") {
                this.$router.push({
                    path: "/userCenter/training"
                });
            }
        },
        percentLength(lesson) {
            let count = 0;
            lesson.forEach(item => {
                if (item.LEARNING_STATUS === "2") {
                    count++;
                }
            });
            return (count / lesson.length) * 100;
        },
        joinClick() {
            if (!this.userInfo.userName) {
                this.$login.login();
            } else {
                if (this.classInfo.JOIN_STATUS === "0") {
                    this.$confirm(
                        "您已提交申请，正在审核中，请耐心等待...",
                        "提示",
                        {
                            showCancelButton: false,
                            confirmButtonText: "确定",
                            type: "warning"
                        }
                    );
                    return false;
                }

                const role = this.userInfo.roleAuthInfo.role;

                this.fixCreditForm.trainId = this.classInfo.ID;
                this.fixCreditForm.className = this.classInfo.CLASS_NAME;
                this.fixCreditForm.classPrice = this.classInfo.TRAIN_PRICE;

                // 认证过
                if (role) {
                    this.roleStatus = true;
                    this.fixCreditForm.companyId = this.userInfo.companyId;
                    this.fixCreditForm.companyName = this.userInfo.companyName;
                    this.fixCreditForm.creditCode = this.userInfo.creditCode;

                    Api_GetCompanyInfoById({
                        userId: this.userInfo.userId
                    }).then(data => {
                        this.fixCreditForm.linkman = data.data.realName;
                        this.fixCreditForm.phoneNo = data.data.phoneNo;
                        this.fixCreditForm.email = data.data.email;
                    });
                }
                setTimeout(() => {
                    this.fixCreditDialogVisible = true;
                }, 500);
            }
        },
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
            this.fixCreditForm.companyId = item.companyId;
            this.fixCreditForm.companyName = item.value;
            this.fixCreditForm.creditCode = item.creditCode;
        },
        videoClick(item) {
            if (this.classInfo.JOIN_STATUS === "1") {
                this.$router.push({
                    path: "/creditTrain/video",
                    query: {
                        lesson: item.ID,
                        class: this.$route.query.id
                    }
                });
            } else {
                this.joinClick();
            }
        },
        testClick(item) {
            const finishCourse = [];
            let unfinishCourse = 0;
            this.courseInfo.forEach(item => {
                item.LESSONS.forEach(iitem => {
                    if (iitem.LEARNING_STATUS === "2") {
                        finishCourse.push(iitem);
                    } else {
                        unfinishCourse++;
                    }
                });
            });
            if (this.classInfo.JOIN_STATUS !== "1") {
                this.joinClick();
                return false;
            } else if (this.classInfo.JOIN_STATUS === "0") {
                this.$confirm(
                    "您已提交申请，正在审核中，请耐心等待...",
                    "提示",
                    {
                        showCancelButton: false,
                        confirmButtonText: "确定",
                        type: "warning"
                    }
                );
                return false;
            }
            if (item.TEST_RESULT !== "1") {
                if (!item.START_DATE) {
                    // 未完成
                    if (unfinishCourse !== 0) {
                        // 完成
                        this.$confirm(
                            "您尚有" +
                                unfinishCourse +
                                "个课时任务未学习，请完成后再考试",
                            "提示",
                            {
                                showCancelButton: false,
                                confirmButtonText: "确定",
                                type: "success"
                            }
                        );
                    } else {
                        // 完成
                        this.$confirm(
                            "您已完成本班级所有课时学习任务，可以进行考试，考试时长 " +
                                item.EXAM_DURATION +
                                " 分，确定要立即开始考试吗",
                            "提示",
                            {
                                showCancelButton: false,
                                confirmButtonText: "确定",
                                type: "success"
                            }
                        ).then(() => {
                            this.startTest(item.ID);
                        });
                    }
                } else {
                    this.$confirm(
                        "您上次考试意外中断/未通过，可以重新进行考试，考试时长" +
                            item.EXAM_DURATION +
                            " 分，确定要立即开始考试吗？",
                        {
                            confirmButtonText: "确定",
                            showCancelButton: false,
                            type: "warning"
                        }
                    )
                        .then(() => {
                            this.startTest(item.ID);
                        })
                        .catch(() => {
                            return false;
                        });
                }
            }
        },
        startTest(id) {
            Api_GenExamination({
                id: id,
                trainId: this.classInfo.ID
            }).then(res => {
                if (res.stateCode === "1") {
                    this.$router.push({
                        path: "/onlineTest/" + id + "/" + this.classInfo.ID
                    });
                } else if (res.stateCode === "0") {
                    //
                } else if (res.stateCode === "4") {
                    this.$confirm(
                        "您的考试机会已经用尽，请联系客服处理，客服电话：0512-88880812。",
                        {
                            confirmButtonText: "确定",
                            showCancelButton: false,
                            type: "warning"
                        }
                    ).catch(() => {
                        return false;
                    });
                } else {
                    this.$message.error(res.message);
                }
            });
        },
        handleClose() {
            this.fixCreditDialogVisible = false;
            this.resetForm("fixCreditForm");
        },
        submitForm() {
            this.$refs["fixCreditForm"].validate(valid => {
                if (valid) {
                    if (!this.fixCreditForm.creditCode) {
                        this.$message.error("该企业查找不到");
                        return false;
                    }
                    this.submitLoading = true;
                    Api_RepairApplicatSave(this.fixCreditForm).then(res => {
                        if (res.stateCode === "1") {
                            this.$confirm(
                                "培训班申请提交成功，客服会尽快联系您，请耐心等候。客服电话：0512-88880812",
                                "提示",
                                {
                                    showCancelButton: false,
                                    confirmButtonText: "确定",
                                    type: "success"
                                }
                            );
                            this.classInfo.JOIN_STATUS = "0";
                        } else {
                            this.$message.error("培训班申请提交失败");
                        }
                        this.$refs["fixCreditForm"].resetFields();
                        this.fixCreditDialogVisible = false;
                        this.submitLoading = false;
                    });
                } else {
                    this.submitLoading = false;
                    return false;
                }
            });
        },
        resetForm() {
            this.fixCreditDialogVisible = false;
            this.$refs["fixCreditForm"].resetFields();
        }
    }
};
</script>

<style lang="scss">
.class-class {
    .el-progress-bar__outer {
        border-radius: 3px;
    }

    .el-progress-bar__inner {
        border-radius: 0;
    }
}
</style>

<style lang="scss" scoped>
.icon-play {
    display: inline-block;
    width: 31px;
    height: 31px;
    background-image: url(../../assets/images/playa.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    cursor: pointer;

    &:hover {
        background-image: url(../../assets/images/play.png);
    }
}

.icon-test {
    display: inline-block;
    width: 31px;
    height: 31px;
    background-image: url(../../assets/images/testa.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    cursor: pointer;

    &:hover {
        background-image: url(../../assets/images/test.png);
    }
}

.desc-title {
    font-size: 14px;
    line-height: 32px;
}

.desc-price {
    padding: 22px 0 18px;
    margin-bottom: 17px;
    border-bottom: 1px solid #e0e3ec;
}

.desc-price .blue,
.desc-price .fxb-333 {
    display: inline-block;
    margin: 0 80px 0 15px;
}

.desc-content {
    margin-top: 11px;
    line-height: 25px;
    text-indent: 2em;
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
    width: calc(100% - 446px - 53px);
}

.class-course-title {
    font-weight: bold;
    font-size: 18px;
    width: 100%;
    float: left;
    background-color: #fff;
    padding: 19px 35px 19px 41px;
    margin-bottom: 25px;
}

.class-course-list {
    width: 100%;
    float: left;
    background-color: #fff;
    padding: 0 35px;
}

.class-course-list.padT35 {
    padding-top: 45px !important;
    padding-left: 40px;
}

.class-class {
    margin-bottom: 25px;
    padding-bottom: 15px;

    &.borderb {
        border-bottom: 1px solid #ddd;
    }

    h2 {
        font-size: 16px;
    }
}

.teacher-avatar {
    width: 56px;
    height: 56px;
    margin: 20px 20px 20px 0;
}

.teacher-name {
    margin-top: 20px;

    h3 {
        margin-top: 5px;
        margin-bottom: 10px;
    }
}

.teacher-desc p {
    line-height: 22px;
    text-indent: 35px;
}

.class-course {
    margin-bottom: 5px;

    h3 {
        font-size: 14px;
    }
}

.class-teacher {
    width: 260px;
    float: right;
    background-color: #fff;
    padding: 15px;
}

.class-course1 {
    .lessonOrder {
        width: 63px;
    }
    .lessonName {
        padding-right: 30px;
        width: 608px;
    }
    .lessonPercent {
        width: 127px;
    }
}

.class-course2 {
    li {
        line-height: 30px;
    }

    .classOrder {
        width: 64px;
    }

    .className {
        padding-right: 30px;
        width: 419px;
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
