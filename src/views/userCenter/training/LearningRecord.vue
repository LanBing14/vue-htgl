<template>
    <div class="fxb-edit-table">


        <el-row class="user-center-top">
            <div style="float:left">
                <ul class="center-tab">
                    <router-link tag="li" :to="'training'" :class="{'active': $route.path.indexOf('training')>=0 }">学习记录</router-link>
                </ul>
            </div>

            <div style="float:right"   id="changeBtnSize">
                <el-input size="small" v-model="searchData.name" placeholder="搜索我加入的课程" style="width: 178px; margin-right: 6px;vertical-align:top"></el-input>
                <el-button size="small" style="vertical-align:middle" type="primary" icon="el-icon-search" @click="getQueryList()">查询
                </el-button>
                <el-button size="small" style="vertical-align:middle" icon="el-icon-refresh" @click="resetData()">重置</el-button>
            </div>

        </el-row>
        <!-- 搜索 -->
        <!-- <el-row class="fxb-table-tool">
            <el-form>
                <el-form-item>
                    <el-row :gutter="10" type="flex" align="middle" style="margin-top:10px">
                        <el-col :span="11" align="left" :offset="17">
                           
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
        </el-row> -->

        <div v-loading="listLoading">
            <el-row :gutter="40" style="margin-top:40px;">
                <el-col :span="8" v-for="(o, index) in learnList" :key="index">
                    <el-card shadow="hover" class="train-box" @click.native="goLink(o.TYPE, o.id)">
                        <div class="img-box">
                            <img v-if="o.picurl" :src="fileBase + o.picurl" class="image"/>
                            <img v-else src="~@/assets/images/no-pic.png" class="image"/>
                        </div>
                        <!-- 1：课程（书）；2：培训班（黑板） -->
                        <div :class="'course-ico course-ico1'"></div>
                        <div style="padding: 14px;">
                            <p class="ellipsisMul">{{ o.name }}</p>
                            <div class="bottom clearfix dFlex trains">
                                <span class="taLeft blue font15">继续学习</span>
                                <span
                                    class="taRight font12 fxb-999">已学习{{ o.learningLessonNum }}/ {{ o.lessonNum }}课时</span>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <div v-if="!learnList.length" class="no-data">
                 <img src="../../../assets/images/bg/no.jpg" alt="" style="width: 300px;height:280px">
            </div>
            <el-pagination class="fxb-page marT0" v-show="totalRecords>0" :total="totalRecords"
                           :page-size="searchData.pageSize" :current-page.sync="searchData.currentPage"
                           @current-change="changeCurrentPage"/>
        </div>
    </div>
</template>

<script>
    import {Api_GetLearnPageList} from "@/api/creditTrain";

    export default {
        data() {
            return {
                listLoading: false,
                fileBase: process.env.VUE_APP_FILE_API,
                learnList: [],
                totalRecords: 1,
                searchData: {
                    pageSize: 6,
                    currentPage: 1,
                    name: ""
                }
            };
        },
        beforeMount() {
        },
        mounted() {
            this.getPageData();
        },
        methods: {
            /**
             * 查询
             * @param financialType 财务类型 0:回款 1:付款 2:开票 3:收票 4:其他
             */
            getQueryList() {
                this.getPageData();
            },
            // 重置搜索数据
            resetData() {
                this.searchData.name = "";
            },
            changeCurrentPage() {
                this.getPageData();
            },
            getPageData() {
                this.listLoading = true;
                Api_GetLearnPageList(this.searchData).then(res => {
                    this.learnList = res.data;
                    this.totalRecords = res.totalRecordNumber;
                    this.listLoading = false;
                }).catch(e => {
                    this.listLoading = false;
                    this.$message.error(e);
                });
            },
            resetForm(formName) {
                if (this.$refs[formName] !== undefined) {
                    this.$refs[formName].resetFields();
                }
            },
            goLink(type, id) {
                // 1：课程（书）；2：培训班（黑板）
                // if (type === 1) {
                this.$router.push({
                    path: "/creditTrain/trainCourse/courseInfo?id=" + id + "&type=3"
                });
                // } else {
                //     this.$router.push({
                //         path: "/trainClass/classInfo/?id=" + id + "&type=3"
                //     });
                // }
            }
        }
    };
</script>

<style lang="scss">
    .train-box .el-card__body {
        padding: 0 !important;
    }

    #changeBtnSize {
        .el-button--small {
            vertical-align: top!important;
        }
    }

    
</style>
<style lang="scss" scoped>
    $blue: #1d8ce0;

    .fxb-edit-table {
        position: relative;

        .fxb-table-tool {
            position: absolute;
            top: -41px;
            right: 0;
            margin-top: -51px;
            width: 100%;
        }
    }

    .bottom {
        margin-top: 13px;
        padding-top: 20px;
        border-top: 1px dashed #eeeeee;

        &.dFlex {
            span {
                flex: 1;
            }

            .num {
                margin-bottom: 10px;
                font-size: 14px;
                color: #333333;
            }

            .name {
                font-size: 13px;
                color: #666666;
            }

            .blue {
                color: $blue;
            }
        }
    }

    .train-box {
        margin-bottom: 30px;
        position: relative;

        .img-box {
            padding-top: 167px;
        }

        &:hover .img-box img {
            transform: scale(1.1);
            transition: all 0.2s linear;
        }
    }

    .ellipsisMul {
        line-height: 24px;
        min-height: 48px;
    }

    .course-ico {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        position: absolute;
        right: 20px;
        margin-top: -22px;

        &.course-ico1 {
            background: #ffffff url(../../../assets/images/creditTrain/course1.jpg) no-repeat center;
        }

        &.course-ico2 {
            background: #ffffff url(../../../assets/images/creditTrain/course2.jpg) no-repeat center;
        }
    }

    .train-box {
        cursor: pointer;
    }
    .no-data{
        text-align: center;
        color: #909399;
        line-height: 100px;
    }
</style>

