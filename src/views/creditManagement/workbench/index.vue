<template>
    <div>
        <!-- <p class="workbench-title">今日，2021年12月09日，欢迎登录企业中心平台</p> -->

        <div class="workbench-content">
            <div class="workbench-flex">
                <div class="workbenchflex-left">
                    <div class="workbench-top">
                        <div class="workbench-img-box">
                            <img src="../../../assets/images/default1-logo.png" alt="">
                        </div>
                        <div class="workbench-company">
                            <p class="company-name">江苏未至科技股份有限公司</p>
                            <p class="company-code">统一社会信用代码：<span>913205006978992544</span></p>
                            <div class="work-btn-status">
                                <el-dropdown>
                                    <span class="work-btn1 work-btn" style="padding: 4px 10px;">曾用名<i
                                            class="el-icon-arrow-down el-icon--right"></i></span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item>黄金糕</el-dropdown-item>
                                        <el-dropdown-item disabled>双皮奶</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>

                                <span class="work-btn2 work-btn">高新技术企业</span>
                                <span class="work-btn3 work-btn">独角兽企业</span>
                                <span class="work-btn4 work-btn">瞪羚企业</span>
                                <span class="work-btn5 work-btn">创新型企业</span>
                                <span class="work-btn6 work-btn">科技小巨人企业</span>
                            </div>
                        </div>
                    </div>
                    <div class="company-service">
                        <div class="header-title">企业服务</div>

                        <div class="work-flex">
                            <div class="work-flex-item">
                                <img src="../../../assets/images/workbench/fkyyIcon.png" alt="">
                                <p class="work-name">访客预约</p>
                            </div>
                            <div class="work-flex-item">
                                <img src="../../../assets/images/workbench/wybxIcon.png" alt="">
                                <p class="work-name">物业报修</p>
                            </div>
                            <div class="work-flex-item">
                                <img src="../../../assets/images/workbench/zxfwIcon.png" alt="">
                                <p class="work-name">装修服务</p>
                            </div>
                            <div class="work-flex-item">
                                <img src="../../../assets/images/workbench/zzsbIcon.png" alt="">
                                <p class="work-name">资质申报</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="workbenchflex-right">
                    <div class="header-title">征集信息</div>
                    <div class="workbench-right-top">
                        <p class="workbench-right-top-title">通知公告标题通知公告标题通知公告标题公告标题</p>
                        <div>
                            <div class="workbench-right-content">
                                通知公告摘要信息通知公告摘要信息通知公告摘要信息通知公告摘要信息通知公告摘要信息通知公告摘要信息
                            </div>
                            <div class="workbench-right-content">
                                通知公告摘要信息通知公告摘要信息通知公告摘要信息通知公告摘要信息通知公告摘要信息通知公告摘要信息
                            </div>
                        </div>
                    </div>
                    <div class="workbench-right-ul">
                        <swiper class="swiper" :options="swiperTitle" ref="mySwiperTitle">
                            <swiper-slide class="slide-item" v-for="(item,index) in swiperListTz" :key="item.id">
                                <div class="titleP">{{item.title}} </div>
                            </swiper-slide>
                        </swiper>
                    </div>

                </div>
            </div>
            <div class="workbench-flex mgt20">
                <div class="workbenchflex-zj">
                    <div class="apply-info">
                        <div class="header-title">征集信息</div>
                        <div class="work-flex-info">
                            <swiper :options="swiperOptionZj" ref="mySwiperZj">
                                <swiper-slide class="work-flex-info-item" v-for="(item,index) in swiperListZj"
                                    :key="item.id">
                                    <div class="clearfix">
                                        <img class="fl icon-title" src="../../../assets/images/workbench/title.png"
                                            alt="">
                                        <p class="info-item-title">{{item.title}}</p>
                                    </div>
                                    <p class="info-zy">{{item.content}}</p>
                                    <span class="work-btn-no" v-if="item.status==1">未填报</span>
                                    <span class="work-btn-has" v-if="item.status==2">已填报</span>
                                    <p class="time"> <i class="el-icon-alarm-clock"></i> 下发时间: {{item.time}}</p>
                                </swiper-slide>
                            </swiper>

                        </div>
                    </div>
                </div>
                <div class="workbenchflex-zj-swiper">
                    <div class="workbench-swiper">
                        <swiper :options="swiperOption" ref="mySwiperZjRight">
                            <swiper-slide class="slide-item" v-for="(item,index) in swiperListZjRight" :key="item.id">
                                <img :src="item.img" alt="" style="width: 100%;height: 100%">
                                <div class="swiper-shadow"> </div>
                                <div class="opca-shadow">
                                    <div class="shadow-title">{{item.title}}</div>
                                    <div class="shadow-title2">
                                        <img class="shadow-title2-img" src="../../../assets/images/workbench/time.png"
                                            alt="">
                                        <span class="ft14">{{item.time}}</span>
                                    </div>
                                    <div class="shadow-title3">
                                        <img class="shadow-title-img"
                                            src="../../../assets/images/workbench/position.png" alt="">
                                        <span class="ft14">{{item.address}}</span>
                                    </div>
                                </div>
                            </swiper-slide>

                        </swiper>
                    </div>
                </div>
            </div>

            <div class="pad25">
                <div class="header-title">付款通知单</div>
            </div>

            <div class="workbench-bottom">
                <div class="workbench-bottom-left">
                    <div class="workbench-bottom-left-content">
                        <p class="park1">与园区已发生</p>
                        <p class="park2">1000000.00 元</p>
                        <p class="park3">财务往来情况</p>
                    </div>
                </div>
                <div class="workbench-bottom-right">
                    <div class="workbench-bottom-right-item">
                        <span class="zdbtn-status1">收款通知</span>
                        <div class="img-box-left">
                            <img class="workbench-img1" src="../../../assets/images/workbench/wenjian.png" alt="">
                        </div>
                        <div>
                            <div class="workbench-htinfo">
                                <img src="../../../assets/images/workbench/ssht.png" alt="">
                                <span class="ht-info-name">所属合同：HT20201010-[续租]</span>
                            </div>
                            <div class="workbench-htinfo">
                                <img src="../../../assets/images/workbench/jfzq.png" alt="">
                                <span class="ht-info-name">计费周期：2020/10/10 ~ 2021/10/10</span>

                            </div>
                            <div class="workbench-htinfo">
                                <img src="../../../assets/images/workbench/qfje.png" alt="">
                                <span class="ht-info-name">欠费金额：</span> <span class="colorPub ft14">9999.99 元</span>
                            </div>
                        </div>
                    </div>
                    <div class="workbench-bottom-right-item">
                        <span class="zdbtn-status2">催款通知</span>
                        <div class="img-box-left">
                            <img class="workbench-img1" src="../../../assets/images/workbench/wenjian.png" alt="">
                        </div>
                        <div>
                            <div class="workbench-htinfo">
                                <img src="../../../assets/images/workbench/ssht.png" alt="">
                                <span class="ht-info-name">所属合同：HT20201010-[续租]</span>
                            </div>
                            <div class="workbench-htinfo">
                                <img src="../../../assets/images/workbench/jfzq.png" alt="">
                                <span class="ht-info-name">计费周期：2020/10/10 ~ 2021/10/10</span>

                            </div>
                            <div class="workbench-htinfo">
                                <img src="../../../assets/images/workbench/qfje.png" alt="">
                                <span class="ht-info-name">欠费金额：</span> <span class="colorPub ft14">9999.99 元</span>
                            </div>
                        </div>
                    </div>
                    <div class="workbench-bottom-right-item">
                        <span class="zdbtn-status2">催款通知</span>
                        <div class="img-box-left">
                            <img class="workbench-img1" src="../../../assets/images/workbench/wenjian.png" alt="">
                        </div>
                        <div>
                            <div class="workbench-htinfo">
                                <img src="../../../assets/images/workbench/ssht.png" alt="">
                                <span class="ht-info-name">所属合同：HT20201010-[续租]</span>
                            </div>
                            <div class="workbench-htinfo">
                                <img src="../../../assets/images/workbench/jfzq.png" alt="">
                                <span class="ht-info-name">计费周期：2020/10/10 ~ 2021/10/10</span>

                            </div>
                            <div class="workbench-htinfo">
                                <img src="../../../assets/images/workbench/qfje.png" alt="">
                                <span class="ht-info-name">欠费金额：</span> <span class="colorPub ft14">9999.99 元</span>
                            </div>
                        </div>
                    </div>
                    <div class="workbench-bottom-right-item">
                        <span class="zdbtn-status2">催款通知</span>
                        <div class="img-box-left">
                            <img class="workbench-img1" src="../../../assets/images/workbench/wenjian.png" alt="">
                        </div>
                        <div>
                            <div class="workbench-htinfo">
                                <img src="../../../assets/images/workbench/ssht.png" alt="">
                                <span class="ht-info-name">所属合同：HT20201010-[续租]</span>
                            </div>
                            <div class="workbench-htinfo">
                                <img src="../../../assets/images/workbench/jfzq.png" alt="">
                                <span class="ht-info-name">计费周期：2020/10/10 ~ 2021/10/10</span>

                            </div>
                            <div class="workbench-htinfo">
                                <img src="../../../assets/images/workbench/qfje.png" alt="">
                                <span class="ht-info-name">欠费金额：</span> <span class="colorPub ft14">9999.99 元</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>
<script>
    import img1 from '../../../assets/images/workbench/activity.png'
    export default {
        data() {
            return {
                swiperListTz: [
                    {
                        id: 0,
                        title: '0通知公告标题通知公告标题通知公告标题通知'
                    },
                    {
                        id: 1,
                        title: '1通知公告标题通知公告标题通知公告标题通知'
                    },
                    {
                        id: 2,
                        title: '2通知公告标题通知公告标题通知公告标题通知'
                    },
                    {
                        id: 3,
                        title: '3通知公告标题通知公告标题通知公告标题通知'
                    },
                    {
                        id: 4,
                        title: '4通知公告标题通知公告标题通知公告标题通知'
                    }

                ],
                swiperTitle: {
                    direction: 'vertical',
                    slidesPerView: 4,
                    loop: false,
                    speed: 1500,
                    observer: true,
                    observeParents: true,
                    // autoplay: {
                    //     delay: 3000,
                    //     disableOninteraction: true
                    // },

                },
                swiperListZjRight: [
                    {
                        id: 0,
                        title: '园区活动名称园区活动名称x活动名称',
                        time: '2021-10-12',
                        address: '苏州竹园路209号苏州创业园3号楼',
                        img: img1
                    },
                    {
                        id: 1,
                        title: '园区活动名称园区活动名称x活动名称',
                        time: '2021-10-12',
                        address: '苏州竹园路209号苏州创业园3号楼',
                        img: img1
                    }
                ],
                swiperListZj: [
                    {
                        id: 0,
                        title: '2021年度高新技术企业申报高新技术企业申报',
                        content: '摘要信息摘要信息摘要信息摘要信息摘要信息摘要信息摘要信息摘要信息',
                        time: '2021-10-12',
                        status: 1
                    },
                    {
                        id: 1,
                        title: '2021年度高新技术企业申报高新技术企业申报',
                        content: '摘要信息摘要信息摘要信息摘要信息摘要信息摘要信息摘要信息摘要信息',
                        time: '2021-10-12',
                        status: 2
                    },
                    {
                        id: 3,
                        title: '2021年度高新技术企业申报高新技术企业申报',
                        content: '摘要信息摘要信息摘要信息摘要信息摘要信息摘要信息摘要信息摘要信息',
                        time: '2021-10-12',
                        status: 2
                    }
                ],
                swiperOptionZj: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                    noSwiping: false,
                    // autoplay:{
                    //     delay: 2000,
                    //     stopOnLastSlide: false,
                    //     /* 触摸滑动后是否继续轮播 */
                    //     disableOnInteraction: false
                    // },
                },
                swiperOption: {
                    // autoplay: {
                    //     delay: 8000,
                    //     disableOninteraction: true
                    // },
                    loop: true,
                    speed: 1500,
                    observer: true,
                    observeParents: true,
                    pagination: {
                        el: ".swiper-pagination",
                        clickable: true,
                    },
                }
            }
        }
    }
</script>
<style scoped lang="scss">
    .mgt20 {
        margin-top: 20px;
    }

    .ft14 {
        font-size: 14px;
    }

    .colorPub {
        color: #4b9df3;
    }

    .workbench-title {
        font-size: 16px;
        line-height: 50px;
        color: #666666;
        background-color: #f7f8fa;
        width: 105%;
        padding-left: 25px;
        margin-left: -25px;
        margin-top: -20px;
    }

    .pad25 {
        padding-left: 25px;
        margin: 42px 0 20px 0;
    }

    .header-title {
        padding-left: 10px;
        font-size: 16px;
        color: #333;
        font-weight: bold;
        border-left: 4px solid #3399e6;
    }

    .workbench-content {
        margin-top: 48px;

        .workbench-flex {
            display: flex;

            .workbenchflex-left {
                flex: 8;

                .workbench-top {
                    margin-bottom: 20px;

                    .workbench-img-box {
                        float: left;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-right: 30px;
                        width: 100px;
                        height: 100px;
                        border: 1px solid #e9ecf1;
                        border-radius: 4px;
                    }

                    .workbench-company {
                        .company-name {
                            font-size: 22px;
                            font-weight: bold;
                            color: #4b9df3;
                        }

                        .company-code {
                            font-size: 14px;
                            color: #666666;
                            line-height: 45px;
                        }

                        .work-btn-status {
                            font-size: 14px;
                            display: flex;
                            flex-wrap: wrap;

                            .work-btn {
                                padding: 0 10px;
                                height: 24px;
                                line-height: 24px;
                                border-radius: 4px;
                                margin-right: 6px;
                                text-align: center;
                                font-size: 13px;
                                margin-bottom: 5px;
                                cursor: pointer;
                            }

                            .work-btn1 {
                                color: #777a80;
                                background-color: #eef0f2;
                            }

                            .work-btn2 {
                                color: #2d8cf0;
                                background-color: #e5f2ff;
                            }

                            .work-btn3 {
                                color: #9c6ae2;
                                background-color: #eee6fa;
                            }

                            .work-btn4 {
                                color: #f5a623;
                                background-color: #fff2de;
                            }

                            .work-btn5 {
                                color: #1abcb6;
                                background-color: #e3f7f6;
                            }

                            .work-btn6 {
                                color: #5882fc;
                                background-color: #e7ecff;
                            }
                        }
                    }
                }

                .company-service {
                    padding: 20px 25px;
                    border: solid 1px #e9ecf1;
                    border-radius: 8px;

                    .work-flex {
                        display: flex;

                        .work-flex-item {
                            flex: 1;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            margin-top: 15px;

                            .work-name {
                                color: #4b9df3;
                                font-size: 15px;
                                font-weight: bold;
                                margin-top: 18px;
                            }
                        }
                    }
                }



            }

            .workbenchflex-right {
                overflow: hidden;
                padding-left: 25px;
                flex: 5;

                .workbench-right-top {
                    height: 90px;
                    margin-top: 20px;
                    padding: 15px;
                    background-color: #f5f7fb;

                    .workbench-right-top-title {
                        font-size: 16px;
                        font-weight: bold;
                        font-stretch: normal;
                        letter-spacing: 0px;
                        color: #000033;
                    }

                    .workbench-right-content {
                        font-size: 12px;
                        line-height: 20px;
                        color: #2d8cf0;
                        margin-top: 5px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;

                    }

                }

                .workbench-right-ul {
                    margin: 5px 0 0px 0;
                    height: 160px;

                    >.swiper-container {
                        width: 100%;
                        height: 160px;

                        /deep/.swiper-slide.slide-item {
                            width: 100%;
                            height: 40px !important;
                            line-height: 40px;

                            .titleP {
                                width: 95%;
                                padding-left: 15px;
                                height: 40px !important;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;

                            }
                        }
                    }


                }


            }
        }

        .workbench-bottom {
            display: flex;

            .workbench-bottom-left {
                flex: 5;
                height: 324px;

                .workbench-bottom-left-content {
                    height: 324px;
                    background: url('../../../assets/images/workbench/bg.png') no-repeat center center;
                    border-radius: 8px;
                    margin-right: 25px;
                    box-sizing: border-box;
                    padding-left: 39px;
                }

                .park1 {
                    padding-top: 64px;
                    font-size: 15px;
                    font-weight: normal;
                    font-style: italic;
                    font-stretch: normal;
                    letter-spacing: 0px;
                    color: #606266;
                }

                .park2 {
                    font-size: 23px;
                    margin: 20px 0;
                    font-weight: bold;
                    color: #343c62;
                }

                .park3 {
                    color: #ffa001;
                    font-size: 18px;
                    font-weight: bold;
                    font-style: italic;
                }

            }

            .workbench-bottom-right {
                flex: 16;
                display: flex;
                flex-wrap: wrap;
                box-sizing: border-box;

                .workbench-bottom-right-item {
                    margin-right: 25px;
                    box-sizing: border-box;
                    flex: 0 0 48%;
                    padding: 20px 15px 25px 15px;
                    font-size: 13px;
                    display: flex;
                    height: 152px;
                    background-color: #fcfcfc;
                    border: dashed 1px #dcdfe6;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    position: relative;

                    .img-box-left {
                        float: left;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        margin-right: 20px;
                    }

                    .workbench-htinfo {
                        line-height: 40px;

                        img {
                            margin-right: 5px;
                        }

                        .ht-info-name {
                            color: #606266;
                            font-size: 13px;
                        }
                    }

                    .zdbtn-status1 {
                        width: 69px;
                        height: 24px;
                        line-height: 24px;
                        color: #fff;
                        text-align: center;
                        background-color: #ffa001;
                        position: absolute;
                        right: 15px;
                        top: 15px;
                        border-radius: 4px;
                    }

                    .zdbtn-status2 {
                        width: 69px;
                        height: 24px;
                        line-height: 24px;
                        color: #fff;
                        text-align: center;
                        background-color: #f14242;
                        position: absolute;
                        right: 15px;
                        top: 15px;
                        border-radius: 4px;
                    }

                }

                .workbench-bottom-right-item:nth-child(2n) {
                    margin-right: 0;
                }
            }
        }

        .workbenchflex-zj {
            flex: 8;
            padding-right: 20px;
            overflow: hidden;

            .apply-info {
                border: solid 1px #e9ecf1;
                border-radius: 8px;
                padding: 20px 25px;
                background-color: #f5f7fb;
                box-sizing: border-box;

                .work-flex-info {
                    margin-top: 20px;

                    .work-flex-info-item {
                        box-sizing: border-box;
                        height: 220px;
                        padding: 23px 20px;
                        background-color: #fcfcfc;
                        border: dashed 1px #dcdfe6;
                        border-radius: 8px;

                        .icon-title {
                            margin-top: 7px;
                            margin-right: 10px;
                        }

                        .info-item-title {
                            font-size: 16px;
                            font-weight: bold;
                            line-height: 26px;
                            color: #343c62;
                            float: left;
                            width: 88%;
                            display: -webkit-box;
                            -webkit-box-orient: vertical;
                            -webkit-line-clamp: 2;
                            overflow: hidden;
                        }

                        .info-zy {
                            font-size: 14px;
                            line-height: 24px;
                            margin-top: 5px;
                            color: #888888;
                        }


                        .work-btn-no {
                            padding: 5px 9px;
                            font-size: 13px;
                            color: #ffffff;
                            margin-top: 18px;
                            display: inline-block;
                            border-radius: 4px;
                            background-color: #4b9df3;
                        }

                        .work-btn-has {
                            padding: 5px 9px;
                            font-size: 13px;
                            color: #ffffff;
                            margin-top: 18px;
                            display: inline-block;
                            border-radius: 4px;
                            background-color: #67c23a;
                        }

                        .time {
                            font-size: 13px;
                            color: #999999;
                            margin-top: 19px;
                        }
                    }


                }


            }

        }

        .workbenchflex-zj-swiper {
            flex: 5;
            overflow: hidden;

            .slide-item {
                position: relative;
                height: 300px;

                img {
                    height: 300px;
                }

                .swiper-shadow {
                    width: 100%;
                    height: 110px;
                    background-color: #032c59;
                    opacity: 0.6;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    box-sizing: border-box;
                    border-radius: 0 0 8px 8px;
                    z-index: 99;
                }

                .opca-shadow {
                    position: absolute;
                    z-index: 999;
                    bottom: 0;
                    left: 0;
                    box-sizing: border-box;
                    padding: 15px 25px;
                    color: #ffffff;

                    .shadow-title {
                        font-size: 18px;
                        font-weight: bold;
                        font-stretch: normal;
                        letter-spacing: 0px;

                    }

                    .shadow-title2 {
                        font-size: 14px;
                        font-weight: normal;
                        font-stretch: normal;
                        line-height: 20px;
                        letter-spacing: 0px;
                        margin: 15px 0 8px 0;
                    }

                    .shadow-title3 {
                        font-size: 14px;
                        font-weight: normal;
                        font-stretch: normal;
                        line-height: 20px;
                        letter-spacing: 0px;
                    }

                    .shadow-title-img {
                        width: 14px;
                        height: 16px;
                        margin-right: 8px;
                    }

                    .shadow-title2-img {
                        width: 14px;
                        height: 14px;
                        margin-right: 8px;
                    }

                }
            }
        }

        .workbench-swiper {
            height: 300px;
            border-radius: 8px;
        }
    }
</style>