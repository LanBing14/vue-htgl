<template>
    <el-container style="background-color: #232C3A">
        <!-- header -->
        <el-header>
            <FxbHeader/>
        </el-header>

        <!-- main -->
        <el-main v-loading="videoLoading">
            <el-row class="video-title" :gutter="10" type="flex" align="middle">
                <el-col :span="20">
                    <h2 class="font24">{{ videoInfo.name }}</h2>
                </el-col>
                <el-col :span="4" align="right">
                    <span @click="back()">
                        <i class="el-icon-arrow-left"></i> 返回
                    </span>
                </el-col>
            </el-row>
            <div class="video-content">
                <video-player
                    class="video-player-box"
                    ref="videoPlayer"
                    :options="playerOptions"
                    :playsinline="true"
                    customEventName="customstatechangedeventname"
                    @play="onPlayerPlay($event)"
                    @pause="onPlayerPause($event)"
                    @ended="onPlayerEnded($event)"
                    @waiting="onPlayerWaiting($event)"
                    @playing="onPlayerPlaying($event)"
                    @loadeddata="onPlayerLoadeddata($event)"
                    @timeupdate="onPlayerTimeupdate($event)"
                    @canplay="onPlayerCanplay($event)"
                    @canplaythrough="onPlayerCanplaythrough($event)"
                    @statechanged="playerStateChanged($event)"
                    @ready="playerReadied"
                ></video-player>
            </div>
            <el-row class="video-page" :gutter="10" type="flex" align="middle" justify="center">
                <el-col :span="12" align="center">
                    <span class="marR15" @click="prevClick()" v-if="preVideoId">
                        <i class="el-icon-arrow-left"></i> 上一节课
                    </span>
                    <span @click="nextClick()" v-if="nexrVideoId">
                        下一节课
                        <i class="el-icon-arrow-right"></i>
                    </span>
                </el-col>
            </el-row>
        </el-main>

        <!-- footer -->
        <el-footer>
            <FxbFooter/>
        </el-footer>
    </el-container>
</template>

<script>
    import {getUserInfo} from "@/utils/auth";
    import {
        Api_LessonManagementGetDetail,
        Api_LessonManagementUpdateLearn,
        Api_LessonManagementCompleteLearn,
        Api_CoursesPublishedLessonDetail,
        Api_VideoTime
    } from "@/api/creditTrain";
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
                videoLoading: false,
                videoInfo: {},
                preVideoId: "",
                nexrVideoId: "",
                currentTime: "",
                playFlag: false,
                playInterval: "",
                playerOptions: {
                    height: "720",
                    muted: false,
                    language: "en",
                    controlBar: {
                        timeDivider: false,
                        durationDisplay: false,
                        progressControl: true,
                        customControlSpacer: false
                    },
                    sources: []
                }
            };
        },
        computed: {
            player() {
                const player = this.$refs.videoPlayer.player;
                return player;
            }
        },
        watch: {
            $route: function () {
                this.loadPageData();
            }
        },
        beforeDestroy() {
            clearInterval(this.playInterval);
            this.playInterval = "";
        },
        mounted() {
            this.loadPageData();
        },
        methods: {
            loadPageData() {
                /* this.videoLoading = true;
                Api_LessonManagementGetDetail({
                    lessonId: this.$route.query.lesson,
                    classId: this.$route.query.class
                }).then(res => {
                    this.videoLoading = false;
                    if (res.stateCode === "1") {
                        this.videoInfo = res.data.detail;
                        this.preVideoId = res.data.frontId;
                        this.nexrVideoId = res.data.nextId;
                        this.playerOptions.sources = [
                            {
                                type: "video/mp4",
                                src: res.data.detail.FILE_PATH
                            }
                        ];
                    } else if (res.stateCode === "3") {
                        this.$message.error("该用户没有权限观看");
                    } else {
                        //
                    }
                });*/
                this.videoLoading = true;
                Api_CoursesPublishedLessonDetail(this.$route.query.id).then(res => {
                    this.videoLoading = false;
                    this.videoInfo = {
                        name: res.name
                    };
                    this.preVideoId = res.frontId;
                    this.nexrVideoId = res.nextId;
                    this.playerOptions.sources = [
                        {
                            type: "video/mp4",
                            src:  process.env.VUE_APP_FILE_API + res.fileUrl
                        }
                    ];
                });
                clearInterval(this.playInterval);
                this.playInterval = "";
            },
            prevClick() {
                let queryData = {};
                if (this.$route.query.class) {
                    queryData = {
                        lesson: this.preVideoId,
                        class: this.$route.query.class
                    };
                } else {
                    queryData = {
                        lesson: this.preVideoId,
                        course: this.$route.query.course
                    };
                }
                this.$router.push({
                    path: "/creditTrain/video",
                    query: queryData
                });
            },
            nextClick() {
                let queryData = {};
                if (this.$route.query.class) {
                    queryData = {
                        lesson: this.nexrVideoId,
                        class: this.$route.query.class
                    };
                } else {
                    queryData = {
                        lesson: this.nexrVideoId,
                        course: this.$route.query.course
                    };
                }
                this.$router.push({
                    path: "/creditTrain/video",
                    query: queryData
                });
            },
            back() {
                this.$router.go(-1)
                // if (this.$route.query.class) {
                //     this.$router.push({
                //         path: "/trainClass/classInfo",
                //         query: {
                //             id: this.$route.query.class
                //         }
                //     });
                // } else {
                //     this.$router.push({
                //         path: "/trainCourse/courseInfo",
                //         query: {
                //             id: this.$route.query.course
                //         }
                //     });
                // }
            },
            // listen event
            onPlayerPlay() {
            },
            onPlayerPause() {
            },
            onPlayerEnded() {
                if (this.playFlag) {
                    // Api_LessonManagementCompleteLearn({
                    //     lessonId: this.$route.query.lesson,
                    //     classId: this.$route.query.class
                    // }).then(res => {
                    //     // 1：完成成功；0：系统错误 2：培训班完所有视频学习，返回考试相关信息；3：课时id空；4：用户id空
                    //     if (res.stateCode === "1") {
                    //         if (this.nexrVideoId) {
                    //             this.$confirm(
                    //                 "您已完成本课时学习任务，是否立即开始下一课时",
                    //                 "提示",
                    //                 {
                    //                     confirmButtonText: "下一课时",
                    //                     cancelButtonText: "返回",
                    //                     type: "success"
                    //                 }
                    //             )
                    //                 .then(() => {
                    //                     this.nextClick();
                    //                 })
                    //                 .catch(() => {
                    //                     this.back();
                    //                 });
                    //         } else {
                    //             this.$confirm("您已完成本课时学习任务", "提示", {
                    //                 showCancelButton: false,
                    //                 cancelButtonText: "返回",
                    //                 type: "success"
                    //             }).then(() => {
                    //                 this.back();
                    //             });
                    //         }
                    //     } else if (res.stateCode === "2") {
                    //         let msg = "";
                    //         if (this.$route.query.class) {
                    //             msg = "恭喜您，您已完成本培训班所有课时学习任务";
                    //         } else {
                    //             msg = "恭喜您，您已完成本课程所有课时学习任务";
                    //         }
                    //         this.$confirm(msg, "提示", {
                    //             showCancelButton: false,
                    //             confirmButtonText: "返回",
                    //             type: "success"
                    //         }).then(() => {
                    //             this.back();
                    //         });
                    //     } else {
                    //         this.$message.error("本课时学习任务学习失败");
                    //     }
                    // });
                    Api_LessonManagementUpdateLearn({
                        lessonId: this.$route.query.id,
                        durationSecond: this.currentTime
                    }).then(res => {
                        if (this.nexrVideoId) {
                            this.$confirm(
                                "您已完成本课时学习任务，是否立即开始下一课时",
                                "提示",
                                {
                                    confirmButtonText: "下一课时",
                                    cancelButtonText: "返回",
                                    type: "success"
                                }
                            )
                                .then(() => {
                                    this.nextClick();
                                })
                                .catch(() => {
                                    this.back();
                                });
                        } else {
                            this.$confirm("您已完成本课时学习任务", "提示", {
                                showCancelButton: false,
                                cancelButtonText: "返回",
                                type: "success"
                            }).then(() => {
                                this.back();
                            });
                        }
                    }).catch(e => {
                        this.$message.error(e)
                    });
                    clearInterval(this.playInterval);
                    this.playInterval = "";
                }
            },
            onPlayerLoadeddata() {
            },
            onPlayerWaiting() {
            },
            onPlayerPlaying() {
                this.playFlag = true;
                if (this.playInterval === "") {
                    this.playInterval = setInterval(() => {
                        Api_LessonManagementUpdateLearn({
                            lessonId: this.$route.query.id,
                            durationSecond: this.currentTime
                        }).then(res => {
                        }).catch(e => {
                            this.$message.error(e)
                        });
                    }, 20000);
                }
            },
            onPlayerTimeupdate(player) {
                this.currentTime = Math.floor(player.currentTime());
            },
            onPlayerCanplay() {
            },
            onPlayerCanplaythrough() {
            },
            // or listen state event
            playerStateChanged() {
            },
            // player is ready
            playerReadied(player) {
                Api_VideoTime(this.$route.query.id).then(res => {
                    this.currentTime = res.durationSecond
                    if (res.durationSecond) {
                        if (res.durationSecond < parseInt(player.getCache().duration)) {
                            player.currentTime(res.durationSecond);
                        }
                    }
                })
            }
        }
    };
</script>

<style lang="scss">
    .video-content {
        .video-js .vjs-progress-control {
            pointer-events: none;
        }
    }

    .video-js {
        width: 100%;

        button:focus {
            outline: none;
        }
    }

    video:focus {
        outline: none;
    }
</style>

<style lang="scss" scoped>
    $blue: #1d8ce0;

    .video-title {
        margin-top: 18px;
        margin-bottom: 36px;
    }

    .video-title h2 {
        color: #fff;
        border-left: 15px solid #4c596f;
        padding-left: 15px;
    }

    .video-title span {
        display: inline-block;
        color: #6e8099;
        cursor: pointer;
        padding-top: 10px;
        padding-right: 11px;
    }

    .video-page {
        margin: 25px 0px 10px;
    }

    .video-page span {
        display: inline-block;
        width: 147px;
        height: 44px;
        line-height: 44px;
        color: #6e8099;
        border: 1px solid #6e8099;
        border-radius: 3px;
        cursor: pointer;
    }

    .hover-disabled {
        position: absolute;
        display: block;
        width: calc(100% - 48px * 4 - 52px);
        height: 36px;
        bottom: 0;
        left: 96px;
        background-color: rgba(255, 255, 255, 0.5);
    }


</style>
<style>
    .video-js .vjs-tech {position: relative !important;}
    .video-js .vjs-time-control{display:block;}
    .video-js .vjs-remaining-time{display: none;} 
</style>