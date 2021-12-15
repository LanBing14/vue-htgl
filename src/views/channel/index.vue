<template>
    <el-container style="background-color:#fff;">
        <el-header class="header-no-color">
            <FxbHeader @reload="reload"/>
        </el-header>
        <!--        banner轮播图-->
        <div class="banner-wrap" style="width:100%;">
            <swiper :options="swiperOption" :style="{height: swiperHeight + 'px'}" ref="mySwiper">
                <swiper-slide class="slide-item slide-item-1">
                    <el-main class="banner-content">
                        <div class="banner-img-wrap">
                            <img class="img-title" src="../../assets/images/channel/qd-title.png" alt="">
                            <img class="img-text" src="../../assets/images/channel/qd-text.png" alt="">
                        </div>
                        <!--                        <div class="b-text">-->
                        <!--                            <span>风信标合作伙伴</span><span>全国招募中</span>-->
                        <!--                        </div>-->
                        <!--                        <div class="text">-->
                        <!--                            <span>开放</span>-->
                        <!--                            <span>合作</span>-->
                        <!--                            <span>成长</span>-->
                        <!--                            <span>共赢</span>-->
                        <!--                        </div>-->
                        <el-button class="btn" @click="openApply">
                            <span>立即申请</span>
                            <img class="icon arror-right" src="../../assets/images/home/arrow-right.png" alt="">
                        </el-button>
                    </el-main>
                </swiper-slide>
                <!--                <swiper-slide class="slide-item slide-item-2">-->
                <!--                    <el-main class="banner-content">-->
                <!--                        <div class="b-text">-->
                <!--                            <span>风信标合作伙伴</span><span>全国招募中</span>-->
                <!--                        </div>-->
                <!--                        <div class="text">-->
                <!--                            <span>开放</span>-->
                <!--                            <span>合作</span>-->
                <!--                            <span>成长</span>-->
                <!--                            <span>共赢</span>-->
                <!--                        </div>-->
                <!--                        <el-button class="btn" @click="openApply">-->
                <!--                            <span>立即申请</span>-->
                <!--                            <img class="icon arror-right" src="../../assets/images/home/arrow-right.png" alt="">-->
                <!--                        </el-button>-->
                <!--                    </el-main>-->
                <!--                </swiper-slide>-->
                <!--                <swiper-slide class="slide-item slide-item-3">-->
                <!--                    <el-main class="banner-content">-->
                <!--                        <div class="b-text">-->
                <!--                            <span>风信标合作伙伴</span><span>全国招募中</span>-->
                <!--                        </div>-->
                <!--                        <div class="text">-->
                <!--                            <span>开放</span>-->
                <!--                            <span>合作</span>-->
                <!--                            <span>成长</span>-->
                <!--                            <span>共赢</span>-->
                <!--                        </div>-->
                <!--                        <el-button class="btn" @click="openApply">-->
                <!--                            <span>立即申请</span>-->
                <!--                            <img class="icon arror-right" src="../../assets/images/home/arrow-right.png" alt="">-->
                <!--                        </el-button>-->
                <!--                    </el-main>-->
                <!--                </swiper-slide>-->
                <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
        </div>
        <el-main class="content" v-if="isRouterAlive">
            <section class="section-1">
                <h2 class="title">
                    合作优势
                </h2>
                <div class="list flex">
                    <div class="list-item">
                        <div class="h">
                            <img src="../../assets/images/channel/img-1.png" alt="">
                            <span>丰厚返利</span>
                        </div>
                        <div class="p">
                            <p>根据合作伙伴业绩予以返佣，</p>
                            <p>高回报返利体系，</p>
                            <p>季/年度优秀代理商激励</p>
                        </div>
                    </div>
                    <div class="list-item">
                        <div class="h">
                            <img src="../../assets/images/channel/img-2.png" alt="">
                            <span>市场支持</span>
                        </div>
                        <div class="p">
                            <p>适宜有效的推广策略，协助合作</p>
                            <p>伙伴扩大知名度及品牌影响力，</p>
                            <p>销售支持优先</p>
                        </div>
                    </div>
                    <div class="list-item">
                        <div class="h">
                            <img src="../../assets/images/channel/img-3.png" alt="">
                            <span>服务支持</span>
                        </div>
                        <div class="p">
                            <p>提供演示系统，并配备</p>
                            <p>专属客服代表，</p>
                            <p>实现实时响应无障碍沟通</p>
                        </div>
                    </div>
                    <div class="list-item">
                        <div class="h">
                            <img src="../../assets/images/channel/img-4.png" alt="">
                            <span>体系培训</span>
                        </div>
                        <div class="p">
                            <p>丰富的培训课程及实践，</p>
                            <p>定期线上产品培训，</p>
                            <p>渠道经理定期走访辅导</p>
                        </div>
                    </div>
                </div>
            </section>
            <section class="section-2">
                <h2 class="title">
                    合作条件及流程
                </h2>
                <div class="content flex">
                    <div class="left">
                        <img class="d-left" src="../../assets/images/channel/d-left.png" alt="">
                        <img class="d-right" src="../../assets/images/channel/d-right.png" alt="">
                        <ul class="list">
                            <li><span>1</span><span class="">公司资质</span><span>有营业执照和独立法定代表人，有良好商业信誉和口碑；</span></li>
                            <li><span>2</span><span class="">行业背景</span><span>具有信用行业背景或者为企业客户提供管理咨询服务；</span></li>
                            <li><span>3</span><span class="">服务能力</span><span>有高标准、严要求的销售能力、服务能力和专业水平；</span></li>
                            <li><span>4</span><span class="">业务能力</span><span>在当地拥有丰富的客户资源和持续拓展市场的能力；</span></li>
                            <li><span>5</span><span class="">合作意愿</span><span>认同未至科技产品价值和文化理念，愿意开展长期合作；</span></li>
                        </ul>
                    </div>
                    <div class="right">
                        <img class="d-left" src="../../assets/images/channel/workflow.png" alt="">
                    </div>
                </div>
                <div class="btn">
                    <el-button type="primary" @click="openApply">立即申请</el-button>
                </div>
            </section>
        </el-main>
        <el-footer>
            <div class="flex v-center concat">
                <div class="phone">
                    <svg-icon icon-class="mobile2"/>
                    <span>0512-88880812</span>
                </div>
                <div class="email">
                    <svg-icon icon-class="mail"/>
                    <span>marketing@citgc.com</span>
                </div>
            </div>
            <FxbFooter/>
        </el-footer>
        <el-dialog
            title="申请信息"
            :visible.sync="visible"
            width="500px"
            class="size-btn-change"
            @close="closeDialog"
        >
      <!--  <Dialog title="申请信息" :visible.sync="visible" :onOk="handleSure" width="500px" @close="closeDialog">-->
            <el-form ref="form" :model="formData" :rules="formRules" label-width="90px" style="width: 90%;">
                <el-form-item label="公司全称" prop="companyName">
                    <el-input v-model="formData.companyName" placeholder="以营业执照名称为准"></el-input>
                </el-form-item>
                <el-form-item label="公司地址" prop="companyAddress">
                    <el-input v-model="formData.companyAddress" placeholder="请输入公司地址"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="formData.name" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="phone">
                    <el-input v-model="formData.phone" placeholder="请输入手机号码"></el-input>
                </el-form-item>
                <el-form-item label="申请描述" prop="applyReason">
                    <el-input v-model="formData.applyReason" :rows="4" type="textarea"
                              placeholder="请输入申请描述信息"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="primary"
                        @click="handleSure('form')" style="transition: none 0s ease 0s;  position: relative; left: 92px; top: -4px;margin-bottom:23px"
                    >提交申请</el-button>
                </el-form-item>
            </el-form>

       <!-- </Dialog>-->
        </el-dialog>
    </el-container>
</template>

<script>
    import FxbHeader from "@/views/layouts/fxb/components/FxbHeader";
    import FxbFooter from "@/views/layouts/fxb/components/FxbFooter";
    import {Api_SendCooperationMail} from '@/api/channel'

    export default {
        name: "Channel",
        components: {
            FxbHeader,
            FxbFooter
        },
        data() {
            const createRules = this.$createRules;
            const swiperHeight = 565
            return {
                isRouterAlive: true,
                visible: false,
                formData: {
                    companyName: '',
                    companyAddress: '',
                    name: '',
                    phone: '',
                    applyReason: ''
                },
                formRules: {
                    companyName: createRules({
                        msg: '公司全称',
                        required: true,
                        max: 100
                    }),
                    companyAddress: createRules({
                        msg: '公司地址',
                        required: true,
                        max: 100
                    }),
                    name: createRules({
                        msg: '姓名',
                        required: true,
                        max: 20
                    }),
                    phone: createRules({
                        msg: '手机号码',
                        required: true,
                        mobile: true
                    }),
                    applyReason: createRules({
                        msg: '申请描述',
                        required: true,
                        max: 200
                    })
                },
                swiperHeight,
                swiperOption: {
                    // direction: 'vertical',
                    // autoplay: true,
                    // loop: true,
                    // speed: 1500,
                    // observer: true,
                    // observeParents: true,
                    // height: swiperHeight,
                    // pagination: {
                    //     el: '.swiper-pagination',
                    //     clickable: true
                    // }
                }
            }
        },
        methods: {
            openApply() {
                this.visible = true
            },
            handleSure() {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        const postData = this.formData
                        // 提交成功，我们将尽快和您联系。fffffffffffffff
                        const loading = this.$openLoading()
                        Api_SendCooperationMail(postData).then(res => {
                            loading.close()
                            this.$message.success(res)
                            this.closeDialog()
                            this.visible = false
                        }).catch(e => {
                            loading.close()
                            this.$message.error(e)
                        })
                    }
                })
            },
            closeDialog() {
                this.$refs.form.resetFields();
            },
            reload() {
                this.isRouterAlive = false;
                this.$nextTick(() => (this.isRouterAlive = true));
            }
        }
    }
</script>

<style scoped lang="scss">
    /*@import '~@/styles/element-variables.scss';*/
    .el-main {
        width: 1240px;
    }

    .el-form-item {
        margin-bottom: 20px;

        &:last-child {
            margin-bottom: 0;
        }
    }

    .banner-wrap {
        position: relative;

        .slide-item {
            position: relative;
            height: 565px;

            .banner-content {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);

                .b-text {
                    height: 45px;
                    line-height: 45px;
                    font-size: 45px;
                    font-family: 'siyuan';

                    span:first-child {
                        background-image: linear-gradient(-90deg, rgba(2, 252, 254, 1) 0%, rgba(36, 181, 230, 1) 100%);
                        -webkit-background-clip: text;
                        color: transparent;
                    }

                    span:last-child {
                        margin-left: 20px;
                        font-style: italic;
                        padding-right: 20px;
                        color: #F6BD24;
                    }
                }

                .text {
                    margin: 47px 0 113px;
                    display: flex;
                    height: 30px;
                    font-family: 'siyuan';

                    span {
                        margin-right: 50px;
                        color: #ebeef6;
                        font-size: 30px;
                        font-weight: 500;
                    }
                }

                .banner-img-wrap {
                    img {
                        display: block;
                    }

                    .img-text {
                        margin-top: 48px;
                        margin-bottom: 115px;
                    }
                }

                .btn {
                    background-color: #EEE43E;
                    border-radius: 6px;
                    width: 160px;
                    height: 55px;
                    border: none;
                    color: #0E1C29;
                    font-size: 20px;

                    span {
                        font-size: 20px;
                        vertical-align: middle;
                    }

                    .icon.arror-right {
                        margin-left: 20px;
                    }
                }
            }

            .image {
                display: block;
            }
        }

        .slide-item-1 {
            background: url("../../assets/images/channel/banner-1.png") no-repeat center/cover;
        }

        .slide-item-2 {
            background: url("../../assets/images/channel/banner-1.png") no-repeat center/cover;
        }

        .slide-item-3 {
            background: url("../../assets/images/channel/banner-1.png") no-repeat center/cover;
        }

        .swiper-pagination {
            right: 32px;
            top: auto;
            bottom: 80px;

            /deep/ {
                .swiper-pagination-bullet {
                    background-color: #fff;
                    border-radius: 0;
                    opacity: 1;
                    width: 6px;
                    height: 6px;
                    transition: all .5s;
                }

                .swiper-pagination-bullet-active {
                    height: 56px;
                    background-color: #1FC5D3;
                }
            }
        }

    }

    section {
        h2.title {
            font-size: 30px;
            height: 30px;
            line-height: 30px;
            color: #333;
            margin: 60px 0 40px;
            text-align: center;
        }

        &.section-1 {
            .list {
                justify-content: space-between;

                .list-item {
                    width: 268px;
                    transition: all .2s;
                    border: 1px solid rgba(238, 238, 238, 1);
                    padding: 42px 30px;

                    &:hover {
                        box-shadow: 0px 0px 25px 0px rgba(12, 3, 6, 0.05);
                    }

                    .h {
                        margin-bottom: 40px;

                        span {
                            margin-left: 27px;
                            font-size: 18px;
                            color: #333;
                            font-weight: bold;
                        }
                    }

                    .p {
                        font-size: 14px;
                        color: #999;
                        text-align: center;
                        line-height: 30px;
                        font-weight: 400;
                    }
                }
            }
        }

        &.section-2 {
            .content {
                .left, .right {
                    width: 50%;
                }

                .left {
                    position: relative;
                    padding-top: 35px;

                    .d-left {
                        position: absolute;
                        top: -35px;
                        left: -20px;
                    }

                    .d-right {
                        position: absolute;
                        bottom: 0;
                        left: 500px;
                    }

                    ul.list {
                        margin-left: 35px;

                        li {
                            margin-bottom: 30px;
                            transition: all .2s;

                            &:hover span {
                                color: $--color-primary !important;
                                /*color: $--color-primary;*/
                            }

                            &:last-child {
                                margin-bottom: 0;
                            }

                            span {
                                display: inline-block;
                                color: #999;

                                &:nth-child(1) {
                                    margin-right: 20px;
                                }

                                &:nth-child(2) {
                                    margin-right: 20px;
                                    color: #333;
                                }
                            }
                        }
                    }
                }

                .right {
                    text-align: right;
                }
            }

            .btn {
                text-align: center;
                padding: 50px 0;

                button {

                    height: 36px;
                    padding-top: 0;
                    padding-bottom: 0;
                }
            }
        }
    }

    .concat {
        background-color: $--color-primary;
        height: 190px;
        justify-content: center;
        font-size: 24px;
        color: #fff;

        .phone {
            padding-right: 125px;

            svg {
                width: 40px;
                height: 40px;
                vertical-align: middle;
            }

            span {
                margin-left: 15px;
                vertical-align: middle;
            }
        }

        .email {
            padding-left: 15px;

            svg {
                width: 42px;
                height: 42px;
                vertical-align: middle;
            }

            span {
                margin-left: 18px;
                vertical-align: middle;
            }
        }
    }

    .content {
        width: 1190px;
    }

    body.mobile {
        section.section-1 .list .list-item {
            margin: 0 auto 15px;
        }

        section.section-2 .content {
            width: 100%;

            .left {
                width: 100%;
                padding-top: 0;

                .d-left {
                    left: -5px;
                }
            }

            .right {
                width: 100%;
                margin-top: 30px;
            }
        }

        .concat .phone {
            padding-right: 0;
        }

        .concat .email {
            padding-left: 0;
        }
    }
</style>

