<template>
    <div>
        <el-row :gutter="10" class="train-list-title">
            <el-col :span="12">
                <h2 class="fxb-333 font24">信用教师</h2>
            </el-col>
            <el-col :span="12" align="right">
                <el-button type="primary" size="default" @click="classClick()">培训班级</el-button>
                <el-button type="default" size="default" @click="courseClick()">培训课程</el-button>
            </el-col>
        </el-row>

        <div class="innerContainer">
            <div class="class-panel">
                <el-row :gutter="40" style="margin-bottom: 20px;" v-loading="loading">
                    <el-col :span="6" v-for="( item, index ) in pageList" :key="index">
                        <router-link tag="a" :to="'/creditTeacherList/teacherInfo?id=' + item.ID">
                            <el-card shadow="hover" class="teacher-box">
                                <div class="bg">
                                    <div class="img-box">
                                        <img :src="item.HEAD_PORTRAIT" class="image" />
                                    </div>
                                    <div class="taCenter">
                                        <div class="font18 fxb-666">{{ item.NICK_NAME }}</div>
                                        <div class="font12 fxb-999">{{ item.TITLE }}</div>
                                    </div>
                                </div>
                                <div
                                    class="taCenter fxb-999 ellipsisMul teacher-info"
                                >{{ item.INTRO }}</div>
                            </el-card>
                        </router-link>
                    </el-col>
                </el-row>

                <div class="clearfix">
                    <el-pagination
                        class="fxb-page nobod"
                        v-show="totalRecords>0"
                        :total="totalRecords"
                        :page-sizes="[8, 16, 32, 40]"
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
import { Api_GetPageList } from "@/api/creditTeacher";

export default {
    data() {
        return {
            loading: false,
            classesList: {},
            pageList: [],
            pageNo: 1,
            pageSize: 8,
            totalRecords: 1
        };
    },
    computed: {},
    mounted() {
        this.getPageData(this.pageNo, this.pageSize);
    },
    methods: {
        getPageData(no, size) {
            this.loading = true;
            Api_GetPageList(no, size).then(data => {
                this.loading = false;
                if (data.stateCode === "1") {
                    this.pageNo = data.data.currentPage;
                    this.pageSize = data.data.pageSize;
                    this.totalRecords = data.data.totalRecords;
                    this.pageList = data.data.list;
                } else {
                    this.$message.error("服务器偷懒了");
                }
            });
        },
        courseClick() {
            this.$router.push({
                path: "/creditTrain/trainCourse"
            });
        },
        classClick() {
            this.$router.push({
                path: "/trainClass"
            });
        },
        handleSizeChange(val) {
            this.getPageData(this.pageNo, val);
        },
        changeCurrentPage() {
            this.getPageData(this.pageNo, this.pageSize);
        }
    }
};
</script>

<style lang="scss" scoped>
.innerContainer {
    background-color: #fff;
    padding: 44px 45px 41px 45px;
    margin-bottom: 25px;
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
</style>
