<template>
    <div>
        <el-row :gutter="10" class="train-list-title">
            <el-col :span="12">
                <h2 class="fxb-333 font24">培训课程</h2>
            </el-col>
            <el-col :span="12" align="right">
                <!--                <el-button type="primary" size="default" @click="classClick()">培训班级</el-button>-->
                <!--                <el-button type="default" size="default" @click="teacherClick()">信用教师</el-button>-->
            </el-col>
        </el-row>

        <el-row class="fxb-table-tool" id="pageView">
            <el-form>
                <el-form-item label="课程分类：" class="fxb-tag-list">
                    <span
                        v-for="(item,index) in courseTypeList"
                        :key="index"
                        :class="{'active':courseType === item.value}"
                        @click="getCourseList(item.value)"
                    >{{ item.label }}</span>
                </el-form-item>
            </el-form>
        </el-row>

        <div class="course-panel">
            <el-row :gutter="40" v-loading="listLoading">
                <el-col :span="6" v-for="( item, index ) in courseList" :key="index">
                    <el-card shadow="hover" class="course-item" @click.native="infoClick(item)">
                        <div class="img-box">
                            
                            <img v-if="item.picurl" class="item-cover" :src="fileBase + item.picurl" alt/>
                            <img v-else src="~@/assets/images/no-pic.png" class="image"/>
                        </div>
                        <h3>{{ (item.name.length > 35 ) ? (item.name.substring(0,35) + '...') :
                            item.name }}</h3>
                        <!--                        <div class="course-info">-->
                        <!--                            <h2 class="blue left">￥{{ $toMoney(item.price, 2) }}</h2>-->
                        <!--                            &lt;!&ndash;                            <span class="right">{{ item.MEMBER_COUNT }}</span>&ndash;&gt;-->
                        <!--                        </div>-->
                    </el-card>
                </el-col>
            </el-row>

            <el-pagination
                class="fxb-page nobod"
                v-show="totalRecords>0"
                :total="totalRecords"
                :page-sizes="[8, 16, 32, 40]"
                :page-size="postData.pageSize"
                :current-page.sync="postData.pageNo"
                @size-change="handleSizeChange"
                @current-change="changeCurrentPage"
                layout="total, sizes, prev, pager, next, jumper"
            />
        </div>
    </div>
</template>

<script>
    import {getUserInfo} from "@/utils/auth";
    import {Api_GetDicts, Api_GetPageList, Api_CoursesPublishedPage} from "@/api/creditTrain";
    import {Api_comboboxDict} from '@/api/baseApi';

    export default {
        data() {
            return {
                userInfo: getUserInfo(),
                fileBase: process.env.VUE_APP_FILE_API,
                classesList: {},
                dicts: [],
                listLoading: false,
                postData: {
                    courseType: null,
                    pageNo: 0,
                    pageSize: 8
                },
                pageList: [],
                totalRecords: 1,
                courseType: '',
                courseTypeList: [], // 课程分类
                courseList: [] // 课程列表
            };
        },
        computed: {},
        mounted() {
            // Api_GetDicts({
            //     groupKey: "courseType"
            // }).then(res => {
            //     if (res.stateCode === "1") {
            //         this.dicts = res.data;
            //     } else {
            //         //
            //     }
            // });
            // 获取课程分类
            Api_comboboxDict('course_type').then(res => {
                this.courseTypeList = res;
                this.courseTypeList.unshift({
                    label: '全部',
                    value: ''
                });
                this.getCourseList('');
                // this.getHotTrainCourseLists(
                //     this.courseType,
                //     this.defaultHotkey
                // );
            });
            // this.getPageList();
        },
        methods: {
            // 获取课程列表
            getCourseList(courseType) {
                this.courseType = courseType;
                this.listLoading = true;
                Api_CoursesPublishedPage({
                    type: courseType,
                    currentPage: this.postData.pageNo,
                    pageSize: this.postData.pageSize
                }).then(({data, totalRecordNumber}) => {
                    this.courseList = data;
                    this.totalRecords = totalRecordNumber;
                    this.listLoading = false;
                }).catch(e => {
                    this.listLoading = false;
                    this.$message.error(e);
                });
            },
            getPageList(option) {
                this.listLoading = true;
                Api_GetPageList(Object.assign(this.postData, option)).then(res => {
                    this.listLoading = false;
                    if (res.stateCode === "1") {
                        const data = res.data;
                        this.pageList = data.list;
                        this.totalRecords = data.totalRecords;
                    } else {
                        this.$message.error("数据加载失败");
                    }
                });
            },
            handleSizeChange(val) {
                this.getPageList({pageSize: val});
                // 分页过后回到顶部
                this.$el.querySelector("#pageView").scrollIntoView();
            },
            changeCurrentPage() {
                this.getPageList();

                // 分页过后回到顶部
                this.$el.querySelector("#pageView").scrollIntoView();
            },
            classClick() {
                this.$router.push({
                    path: "/trainClass"
                });
            },
            teacherClick() {
                this.$router.push({
                    path: "/creditTeacherList"
                });
            },
            infoClick(item) {
                this.$router.push({
                    path: "/creditTrain/trainCourse/courseInfo",
                    query: {
                        id: item.id,
                        type: "1"
                    }
                });
            }
        }
    };
</script>

<style lang="scss">
    .course-item {
        .el-card__body {
            padding: 0;
        }
    }
</style>

<style lang="scss" scoped>
    .blue {
        color: #20a0ff;
    }

    .left {
        float: left;
    }

    .right {
        float: right;
    }

    .fxb-page {
        margin-top: 0;
    }

    .course-panel {
        background-color: #fff;
        padding: 44px 45px 41px 45px;
        margin-bottom: 25px;
    }

    .course-item {
        cursor: pointer;
        margin-bottom: 52px;

        .img-box {
            width: 100%;
            height: 168px;
            overflow: hidden;
        }

        img {
            transition: all 0.2s linear;
        }

        &:hover img {
            transform: scale(1.1);
        }
    }

    .course-item h3 {
        font-size: 14px;
        height: 82px;
        border-bottom: 1px dashed #ddd;
        padding-top: 25px;
        padding-bottom: 22px;
        margin: 0 15px;
        text-overflow: ellipsis;
        overflow: hidden;
        // white-space: nowrap;
        word-wrap: break-word;
    }

    .course-info {
        overflow: hidden;
    }

    .course-info h2 {
        font-size: 16px;
        height: 45px;
        line-height: 45px;
        margin-left: 15px;
    }

    .course-info span {
        color: #999;
        font-size: 16px;
        height: 45px;
        line-height: 45px;
        margin-right: 15px;
    }

    .fxb-tag-list span {
        display: inline-block;
        line-height: 30px;
        padding: 0 10px;
        border-radius: 5px;
        margin-right: 20px;
        cursor: pointer;
    }

    .fxb-tag-list span:first-child.active {
        color: #20a0ff;
    }

    .fxb-tag-list span:not(:first-child):hover,
    .fxb-tag-list span:not(:first-child).active {
        color: #fff;
        background-color: #20a0ff;
    }

    #pageView {
        background-color: #fff;
        padding: 24px 45px 3px 45px;
        border-bottom: 1px solid #f8f8f8;
    }
</style>
