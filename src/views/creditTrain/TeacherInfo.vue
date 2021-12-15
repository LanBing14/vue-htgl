<template>
    <div>
        <el-row style="margin: 36px 0 44px 0;" v-loading="teacherLoading">
            <el-col :span="24">
                <div class="teacher-head floatL">
                    <div class="img-box">
                        <img :src="teacherInfo.headPortrait" alt />
                    </div>
                </div>
                <div class="clearfix overH marL5" style="width: 755px;">
                    <h3 class="font24 fxb-333 marT15" style="margin-bottom: 12px;">
                        {{ teacherInfo.nickName }}
                        <span
                            class="font14"
                            style="padding-left: 30px; color: #c0c4d1;"
                        >{{ teacherInfo.title }}</span>
                    </h3>
                    <div class="font12 fxb-666" style="line-height: 24px;">
                        <p>{{ teacherInfo.intro }}</p>
                    </div>
                </div>
            </el-col>
        </el-row>

        <h3 class="online-title">在线课程</h3>

        <div
            class="innerContainer"
            style="border-bottom: 1px solid #f7f8f9;"
            v-loading="courseLoading"
        >
            <div class="class-panel">
                <ul>
                    <li class="dFlex" v-for="( item, index ) in pageList" :key="index">
                        <span
                            class="font14 setColorGray classOrder"
                        >{{ index +(pageNo - 1) * pageSize + 1 }}</span>
                        <span class="font14 fxb-333 className">
                            <a @click="routerToCourse(item.ID)">{{ item.COURSE_NAME }}</a>
                        </span>
                        <span
                            class="font12 setColorGray classTime"
                        >{{ (item.MINUTES*60 + item.SECONDS) | formatSeconds }}</span>
                        <span class="font12 setColorGray classDate">{{ item.PUBLISH_DATE }}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="innerContainer" style="padding: 9px 45px;">
            <div class="class-panel">
                <div class="clearfix">
                    <el-pagination
                        class="fxb-page floatR"
                        v-show="totalRecords>0"
                        :total="totalRecords"
                        :page-sizes="[10, 20, 30, 40]"
                        :page-size="pageSize"
                        :current-page.sync="pageNo"
                        @size-change="handleSizeChange"
                        @current-change="changeCurrentPage"
                        layout="total, sizes, prev, pager, next, jumper"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Api_GetDetail, Api_GetCourseList } from "@/api/creditTeacher";
import { formatSeconds } from "@/utils/index";

export default {
    filters: { formatSeconds },
    data() {
        return {
            teacherLoading: false,
            courseLoading: false,
            // 教师id
            teacherId: this.$route.query.id,
            teacherInfo: {},
            pageList: [],
            pageNo: 1,
            pageSize: 10,
            totalRecords: 1
        };
    },
    mounted() {
        this.getTeacherInfo();
        this.getPageData();
    },
    methods: {
        routerToCourse(id) {
            this.$router.push({
                path:
                    "/creditTrain/trainCourse/courseInfo?id=" +
                    id +
                    "&type=2&teacherId=" +
                    this.teacherId
            });
        },
        getPageData() {
            this.courseLoading = true;
            Api_GetCourseList(this.teacherId, this.pageNo, this.pageSize).then(
                data => {
                    this.courseLoading = false;
                    if (data.stateCode === "1") {
                        this.pageNo = data.data.currentPage;
                        this.pageSize = data.data.pageSize;
                        this.totalRecords = data.data.totalRecords;
                        this.pageList = data.data.list;
                    } else {
                        this.$message.error("服务器偷懒了");
                    }
                }
            );
        },
        getTeacherInfo() {
            this.teacherLoading = true;
            Api_GetDetail(this.teacherId).then(data => {
                this.teacherLoading = false;
                if (data.stateCode === "1") {
                    this.teacherInfo = data.data;
                } else {
                    this.$message.error("服务器偷懒了");
                }
            });
        },
        changeCurrentPage() {
            this.getPageData();
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.getPageData();
        }
    }
};
</script>

<style lang="scss" scoped>
$setColorGray: #c0c4d1;

.setColorGray {
    color: $setColorGray;
}

.innerContainer {
    background-color: #fff;
    padding: 31px 45px 45px 39px;
}

.ellipsisMul {
    line-height: 24px;
    min-height: 48px;
}

.teacher-box {
    margin-bottom: 30px;

    .el-card__body {
        padding: 0;
    }

    .img-box {
        padding-top: 120px;
        width: 120px;
        margin: 20px auto;
        border-radius: 50%;
        overflow: hidden;
    }

    .bg {
        margin: -40px -20px 25px -20px;
        padding-top: 20px;
        background-color: #f7f8f9;
    }

    .font18 {
        margin-bottom: 16px;
    }

    .font12 {
        padding-bottom: 25px;
    }

    .teacher-info {
        line-height: 24px;
    }

    &:hover .img-box img {
        transform: scale(1.1);
        transition: all 0.2s linear;
    }
}

.online-title {
    margin-bottom: 25px;
    background-color: #ffffff;
    height: 60px;
    line-height: 60px;
    padding: 0 40px;
    font-size: 20px;
    color: #333333;
}

.teacher-head {
    margin: 0 36px;

    .img-box {
        padding-top: 90px;
        width: 90px;
        border-radius: 50%;
    }
}

.class-panel {
    li {
        line-height: 40px;
    }

    .classOrder {
        width: 80px;
    }

    .className {
        width: 730px;
    }

    .classTime {
        width: 183px;
    }
}
</style>
