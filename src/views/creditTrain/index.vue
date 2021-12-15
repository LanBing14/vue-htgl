<template>
    <el-container style="background-color: #fff" id="train-index-box">
        <!-- header -->
        <el-header>
            <FxbHeader @reload="reload"/>
        </el-header>

        <!-- banner -->
        <div class="banner-box">
            <div class="animated fadeIn banner-img"></div>
        </div>

        <!-- main -->
        <!--<el-main>
            &lt;!&ndash; 信用修复班 &ndash;&gt;
            <div class="taCenter train-title">
                <h3>信用修复班</h3>
                <p>全力打造信用修复学习体系，给你更多的课程相关服务</p>
            </div>
            <el-row :gutter="56">
                <el-col :span="8" v-for="o in hotTrainClassList" :key="o.ID">
                    <el-card
                        shadow="hover"
                        class="train-class-box"
                        @click.native="goDetail('class', o.ID)"
                    >
                        <div class="img-box">
                            <img :src="o.CLASS_COVER" class="image" />
                        </div>
                        <div style="padding: 14px 14px 10px 14px;">
                            <p class="ellipsisMul">{{ o.CLASS_NAME }}</p>
                            <div class="bottom clearfix dFlex train-class">
                                <span>
                                    <p class="num">{{ o.classCount }}</p>
                                    <p class="name">课时</p>
                                </span>
                                <span>
                                    <p class="num">{{ o.memberCount }}</p>
                                    <p class="name">学员</p>
                                </span>
                                <span>
                                    <p
                                        class="num blue"
                                    >{{ o.TRAIN_PRICE !== null ? ("￥ " + o.TRAIN_PRICE): "暂无价格" }}</p>
                                    <p class="name">价格</p>
                                </span>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>

            <div class="taCenter wow fadeInUp">
                <router-link :to="'/trainClass'">
                    <el-button type="info" plain class="more">
                        更多班级
                        <i class="el-icon-arrow-right el-icon&#45;&#45;right"></i>
                    </el-button>
                </router-link>
            </div>
        </el-main>-->

        <!--<br />

        <div id="num-show">
            <div class="el-main">
                <div class="dFlex taCenter">
                    <div class="num-li wow fadeInDown">
                        <h3>100+</h3>
                        <p>城市服务覆盖</p>
                    </div>
                    <div class="num-li wow fadeInUp">
                        <h3>500M+</h3>
                        <p>市场主体信息</p>
                    </div>
                    <div class="num-li wow fadeInDown">
                        <h3>N+</h3>
                        <p>信用应用服务</p>
                    </div>
                    <div class="num-li wow fadeInUp">
                        <h3>50+</h3>
                        <p>合作金融机构</p>
                    </div>
                    <div class="num-li wow fadeInDown">
                        <h3>1000M+</h3>
                        <p>数据量</p>
                    </div>
                </div>
            </div>
        </div>-->

        <el-main v-if="isRouterAlive">
            <!-- 信用培训 -->
            <div class="taCenter train-title" aos="fade-up" aos-anchor-placement="top-center">
                <h3>信用培训</h3>
                <p>精选信用课程，满足你的学习兴趣</p>
            </div>

            <div class="clearfix marB30">
                <ul class="train-tabli floatL">
                    <li
                        v-for="(o, index) in courseTypeList"
                        :key="o.value"
                        :class="{ 'on': isActive === index }"
                        @click="setClass(index, o)"
                    >{{ o.label }}
                    </li>
                </ul>

                <el-radio-group
                    v-model="defaultHotkey"
                    size="small"
                    class="floatR"
                    style="line-height: 45px;"
                    @change="setHotType"
                >
                    <el-radio-button
                        v-for="hotkey in hotkeys"
                        :label="hotkey.id"
                        :key="hotkey.id"
                    >{{ hotkey.label }}
                    </el-radio-button>
                </el-radio-group>
            </div>

            <el-row :gutter="40">
                <el-col :span="6" v-for="o in courseList" :key="o.id" class="item">
                    <el-card
                        shadow="hover"
                        class="train-box"
                        @click.native="goDetail('course', o.id)"
                    >
                        <div class="img-box">
                            <img v-if="o.picurl" :src="`${o.picurl}`" class="image"/>
                            <img v-else src="~@/assets/images/no-pic.png" class="image"/> 
                        </div>
                        <div style="padding: 14px;">
                            <p class="ellipsisMul">{{ o.name }}</p>
                            <!--                            <div class="bottom clearfix dFlex trains">-->
                            <!--                                <span-->
                            <!--                                    class="taLeft blue font16"-->
                            <!--                                >{{ o.price !== null? ("￥ " + $toMoney(o.price, 2)): "暂无价格" }}</span>-->
                            <!--                                &lt;!&ndash;                                <span class="taRight font13 fxb-999">{{ o.memberCount }}</span>&ndash;&gt;-->
                            <!--                            </div>-->
                        </div>
                    </el-card>
                </el-col>
            </el-row>

            <div class="taCenter wow fadeInUp">
                <router-link :to="'/creditTrain/trainCourse'">
                    <el-button type="primary" plain class="more">
                        更多课程
                        <i class="el-icon-arrow-right el-icon--right"></i>
                    </el-button>
                </router-link>
            </div>
            <br/>
        </el-main>

        <!--<div style="background: #f7f8f9; width: 100%;">
            <el-main style="padding: 0; padding-bottom: 40px;">
                &lt;!&ndash; 信用动态 &ndash;&gt;
                <div class="taCenter train-title">
                    <h3 style="margin-top: 57px;">信用动态</h3>
                    <p>参与小组，结交更多同学，关注课程动态</p>
                </div>

                <el-row :gutter="24">
                    <el-col :span="12" class="train-news">
                        <el-card shadow="hover">
                            <div slot="header" class="clearfix">
                                <span class="font16 fxb-333" style="padding-left: 5px;">热门小组</span>
                                <el-button
                                    style="float: right; padding: 0 5px 0 0; font-size: 20px; line-height: 15px;"
                                    type="text"
                                    icon="el-icon-more"
                                    class="fxb-999"
                                ></el-button>
                            </div>
                            <ul class="pic-newslist taLeft">
                                <li>
                                    <div class="img-box">
                                        <img
                                            src="@/assets/images/creditTrain/demo7.jpg"
                                            class="image"
                                        />
                                    </div>
                                    <div class="info">
                                        <h3
                                            class="ellipsis"
                                        >信用修复话题第一小组信用修复话题第一小组信用修复话题第一小组信用修复话题第一小组</h3>
                                        <div class="people">666</div>
                                    </div>
                                </li>
                                <li>
                                    <div class="img-box">
                                        <img
                                            src="@/assets/images/creditTrain/demo7.jpg"
                                            class="image"
                                        />
                                    </div>
                                    <div class="info">
                                        <h3 class="ellipsis">信用修复话题第一小组</h3>
                                        <div class="people">666</div>
                                    </div>
                                </li>
                                <li>
                                    <div class="img-box">
                                        <img
                                            src="@/assets/images/creditTrain/demo7.jpg"
                                            class="image"
                                        />
                                    </div>
                                    <div class="info">
                                        <h3 class="ellipsis">信用修复话题第一小组</h3>
                                        <div class="people">666</div>
                                    </div>
                                </li>
                                <li>
                                    <div class="img-box">
                                        <img
                                            src="@/assets/images/creditTrain/demo7.jpg"
                                            class="image"
                                        />
                                    </div>
                                    <div class="info">
                                        <h3 class="ellipsis">信用修复话题第一小组</h3>
                                        <div class="people">666</div>
                                    </div>
                                </li>
                                <li>
                                    <div class="img-box">
                                        <img
                                            src="@/assets/images/creditTrain/demo7.jpg"
                                            class="image"
                                        />
                                    </div>
                                    <div class="info">
                                        <h3 class="ellipsis">信用修复话题第一小组</h3>
                                        <div class="people">666</div>
                                    </div>
                                </li>
                                <li>
                                    <div class="img-box">
                                        <img
                                            src="@/assets/images/creditTrain/demo7.jpg"
                                            class="image"
                                        />
                                    </div>
                                    <div class="info">
                                        <h3 class="ellipsis">信用修复话题第一小组</h3>
                                        <div class="people">666</div>
                                    </div>
                                </li>
                            </ul>
                        </el-card>
                    </el-col>
                    <el-col :span="12" class="train-news">
                        <el-card shadow="hover">
                            <div slot="header" class="clearfix">
                                <span class="font16 fxb-333" style="padding-left: 5px;">最新资讯报道</span>
                                <el-button
                                    style="float: right; padding: 0 5px 0 0; font-size: 20px; line-height: 15px;"
                                    type="text"
                                    icon="el-icon-more
"
                                    class="fxb-999"
                                ></el-button>
                            </div>
                            <ul class="newslist">
                                <li v-for="o in newsTxtList" :key="o.id" class="font14 fxb-666">
                                    {{ o.title }}
                                    <span class="floatR fxb-999 font12">2018-08-16</span>
                                </li>
                            </ul>
                        </el-card>
                    </el-col>
                </el-row>
            </el-main>
        </div>-->

        <!--<el-main>
            &lt;!&ndash; 信用教师 &ndash;&gt;
            <div class="taCenter train-title" style="margin-top: 30px;">
                <h3 style="margin-top: 30px;">信用教师</h3>
                <p>名师汇集，保证教学质量与学习效果</p>
            </div>

            <el-row :gutter="40">
                <el-col :span="6" v-for="o in hotTrainTeacherList" :key="o.ID">
                    <router-link tag="a" :to="'/creditTeacherList/teacherInfo?id=' + o.ID">
                        <el-card shadow="hover" class="teacher-box">
                            <div class="bg">
                                <div class="spinner">
                                    <div class="img-box">
                                        <img :src="o.HEAD_PORTRAIT" class="image" />
                                    </div>
                                </div>
                                <div class="taCenter">
                                    <div class="font18 fxb-666">{{ o.NICK_NAME }}</div>
                                    <div class="font12 fxb-999">{{ o.TITLE }}</div>
                                </div>
                            </div>
                            <div class="taCenter fxb-999 teacher-info">
                                <div class="ellipsisMul">{{ o.INTRO }}</div>
                            </div>
                        </el-card>
                    </router-link>
                </el-col>
            </el-row>

            <div class="taCenter wow fadeInUp">
                <router-link :to="'/creditTeacherList'">
                    <el-button type="info" plain class="more">
                        更多教师
                        <i class="el-icon-arrow-right el-icon&#45;&#45;right"></i>
                    </el-button>
                </router-link>
            </div>
            <br />
        </el-main>-->

        <!-- footer -->
        <el-footer>
            <FxbFooter/>
        </el-footer>
    </el-container>
</template>

<script>
    import {WOW} from "wowjs";
    import {getUserInfo} from "@/utils/auth";
    import FxbHeader from "@/views/layouts/fxb/components/FxbHeader";
    import FxbMain from "@/views/layouts/fxb/components/FxbMain";
    import FxbFooter from "@/views/layouts/fxb/components/FxbFooter";

    import {
        Api_GetIndexTrainClass,
        Api_GetIndexTrainCourse,
        Api_GetIndexTrainTeacher,
        Api_CoursesPublishedPage
    } from "@/api/creditTrain";
    import {Api_comboboxDict} from '@/api/baseApi';
    import {Api_GetDicts} from "@/api/creditTrain";

    export default {
        components: {
            FxbHeader,
            FxbMain,
            FxbFooter
        },
        data() {
            return {
                imgUrl: process.env.VUE_APP_FILE_API,
                isRouterAlive: true,
                userInfo: getUserInfo(),
                hotTrainClassList: [],
                hotTrainCourseList: [],
                hotTrainTeacherList: [],
                newsTxtList: [
                    {
                        title: "江苏：环保失信企业将多缴电费"
                    },
                    {
                        title: "又有两家备案企业征信机构退场！"
                    },
                    {
                        title: "国家税务总局累计公布22750件税收违法“黑名单”"
                    },
                    {
                        title: "盘点 | 今年国务院常务会研究的信用事项"
                    },
                    {
                        title: "南京市社会信用调理（草案）公开征求意见"
                    }
                ],
                hotkeys: [
                    {
                        id: 'heat',
                        label: "最热"
                    },
                    {
                        id: 'modifyDate',
                        label: "最新"
                    }
                ],
                defaultHotkey: 'heat',
                courseTypeList: [],
                isActive: 0,
                courseType: "",
                courseList: [] // 课程列表
            };
        },
        computed: {},
        mounted() {
            new WOW().init();

            this.getIndexTrainLists();
        },
        methods: {
            getIndexTrainLists() {
                // 获取热门信用修复班级
                // Api_GetIndexTrainClass().then(res => {
                //     if (res.stateCode === "1" && res.data) {
                //         this.hotTrainClassList = res.data;
                //     }
                // });

                // 获取课程分类
                Api_comboboxDict('course_type').then(res => {
                    this.courseTypeList = res;
                    // 拼一个全部分类
                    this.courseTypeList.unshift({
                        dictKey: "",
                        value: "",
                        label: "全部分类"
                    });
                    this.courseType = '';
                    this.getCourseList('');
                    // this.getHotTrainCourseLists(
                    //     this.courseType,
                    //     this.defaultHotkey
                    // );
                });
                // 获取热门课程分类
                // Api_GetDicts({ groupKey: "courseType" }).then(res => {
                //     if (res.stateCode === "1" && res.data) {
                //         this.courseTypeList = res.data;
                //
                //         // 拼一个全部分类
                //         this.courseTypeList.unshift({
                //             dictKey: "",
                //             id: "",
                //             text: "全部分类"
                //         });
                //
                //         this.courseType = this.courseTypeList[0].dictKey;
                //
                //         this.getHotTrainCourseLists(
                //             this.courseType,
                //             this.defaultHotkey
                //         );
                //     }
                // });

                // 获取热门培训老师列表
                // Api_GetIndexTrainTeacher().then(res => {
                //     if (res.stateCode === "1" && res.data) {
                //         this.hotTrainTeacherList = res.data;
                //     }
                // });
            },
            // 获取课程列表
            getCourseList(courseType) {
                Api_CoursesPublishedPage({
                    type: courseType,
                    currentPage: 1,
                    pageSize: 10,
                    orderProperty: this.defaultHotkey
                }).then(res => {
                    this.courseList = res.data;
                    for(var i=0;i<this.courseList.length;i++){
                        if(this.courseList[i].picurl){
                            this.courseList[i].picurl = this.imgUrl + this.courseList[i].picurl
                        }
                        
                    }
                });
            },
            // 跳转到详情页
            goDetail(type, id) {
                let path = "";

                switch (type) {
                    case "course":
                        path = "/creditTrain/trainCourse/courseInfo";
                        break;

                    case "teacher":
                        path = "/creditTeacherList/teacherInfo";
                        break;

                    default:
                        path = "/trainClass/classInfo";
                        break;
                }

                this.$router.push({
                    path: path,
                    query: {
                        id: id,
                        type: "0"
                    }
                });
            },
            // 设置信用培训热门课程选中的class
            setClass(index, obj) {
                this.isActive = index;

                this.courseType = obj.value;
                this.getCourseList(this.courseType);
                // this.getHotTrainCourseLists(this.courseType, this.defaultHotkey);
            },
            /**
             * 获取热门信用课程
             * @param
             * courseType 课程分类 (和字典表courseType关联)
             * type    0：最新；1：最热
             */
            getHotTrainCourseLists() {
                this.getCourseList(this.courseType)
                // 不传值获取的就是全部
                // Api_GetIndexTrainCourse({
                //     courseType: courseType,
                //     type: type
                // }).then(res => {
                //     if (res.stateCode === "1" && res.data) {
                //         this.hotTrainCourseList = res.data;
                //     }
                // });
            },
            setHotType() {
                this.getCourseList(this.courseType)
            },
            reload() {
                this.isRouterAlive = false;
                this.$nextTick(() => (this.isRouterAlive = true));
            }
        }
    };
</script>

<style lang="scss">
    #train-index-box {
        .el-card__body {
            padding: 0 !important;
        }

        .train-news .el-card__body {
            padding: 20px !important;
        }
    }
</style>

<style scoped lang="scss">
    $blue: #1d8ce0;

    .banner-box {
        position: relative;
        height: 462px;

        .banner-img {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            width: 100%;
            z-index: 999;
            height: 100%;
            background: url(../../assets/images/creditTrain/banner.jpg) no-repeat center top;
        }
    }

    .el-main {
        width: 1190px;
    }

    .ellipsisMul {
        line-height: 24px;
        min-height: 48px;
        overflow: hidden;
    }

    .image {
        width: 100%;
        display: block;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both;
    }

    .dFlex {
        justify-content: space-between;
        text-align: center;
    }

    .train-title {
        margin-top: 38px;
        margin-bottom: 50px;

        h3 {
            margin-bottom: 25px;
            font-size: 30px;
            color: #333333;
        }

        p {
            font-size: 15px;
            color: #999999;
        }
    }

    // card图片下面的div样式
    .bottom {
        margin-top: 13px;
        padding-top: 18px;
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

    // 查看更多按钮
    .more {
        margin-top: 50px;
        margin-bottom: 5px;
        width: 145px;
        height: 44px;
    }

    // 中间的数字
    #num-show {
        color: #ffffff;
        position: relative;
        display: block;
        height: 400px;
        width: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url(../../assets/images/creditTrain/blueBg.jpg) no-repeat center top;

        img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .num-li {
            z-index: 9;
            flex: 1;
            padding-top: 96px;
        }

        h3 {
            margin-bottom: 60px;
            font-size: 73px;
        }

        p {
            font-size: 20px;
        }
    }

    // 信用培训选择分类
    .train-tabli {
        overflow: hidden;

        li {
            float: left;
            color: #333333;
            font-size: 14px;
            width: 142px;
            height: 50px;
            line-height: 50px;
            text-align: center;

            &.on {
                color: #ffffff;
                background-color: #4b9df3;
            }

            &:hover {
                transition: all ease-in 0.15s;
                cursor: pointer;
                color: #ffffff;
                background-color: #4b9df3;
            }
        }
    }

    // 动态
    .train-news {
        .el-card__header {
            padding: 12px 20px;
        }

        .el-card {
            height: 310px;
        }
    }

    .newslist {
        margin-top: -15px;

        li {
            padding-left: 21px;
            background: url(../../assets/images/creditTrain/dot.png) no-repeat 5px center;
            line-height: 45px;
        }
    }

    .train-class-box {
        .img-box {
            padding-top: 244px;
        }

        &:hover {
            cursor: pointer;
        }

        .ellipsisMul {
            line-height: 35px;
            min-height: 35px;
            overflow: hidden;
        }
    }

    .train-box {
        .img-box {
            padding-top: 167px;
        }

        &:hover {
            cursor: pointer;
        }
    }

    .teacher-box {
        .spinner {
            position: relative;
            margin: 20px auto;
            width: 130px;
            height: 130px;
            padding: 5px;
            box-sizing: border-box;
            border-radius: 50%;
            background-image: linear-gradient(#ffffff, #ffffff);
            transition: all 2s ease-in-out;

            &::before {
                content: "";
                opacity: 0;
                position: absolute;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: #ffffff;
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
                left: 17px;
                top: 17px;
                z-index: 999;
            }
        }

        .img-box {
            padding-top: 120px;
            width: 120px;
            border-radius: 50%;
            overflow: hidden;
            transition: all 0.2s linear;
        }

        .bg {
            position: relative;
            margin: -20px -20px 25px -20px;
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
            padding: 0 20px 25px 20px;

            &.ellipsisMul {
                height: 93px;
            }
        }

        &:hover .img-box img {
            transform: scale(1.1);
        }

        &:hover .spinner {
            background-image: linear-gradient(
                    rgba(255, 255, 255, 1),
                    rgba(255, 255, 255, 0.5)
            );
            transform: rotate(360deg);
            transition: all 2s ease-in-out;

            &::before {
                opacity: 1;
            }

            .img-box {
                transform: rotate(-360deg);
            }
        }
    }

    .pic-newslist {
        margin-top: -25px;
        overflow: hidden;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        li {
            margin-top: 17px;
            float: left;
            width: 250px;
            display: flex;
            padding-left: 5px;
        }

        .img-box {
            margin-right: 15px;
            width: 60px;
            padding-top: 60px;
        }

        .info {
            width: calc(100% - 75px);
        }

        .info h3 {
            margin-top: 7px;
            margin-bottom: 10px;
            font-size: 14px;
            color: #666666;
        }

        .people {
            padding-left: 15px;
            background: url(../../assets/images/creditTrain/ico1.jpg) no-repeat left center;
            font-size: 12px;
            color: #c1c1c1;
        }
    }

    .item {
        margin-bottom: 20px;
    }
</style>
