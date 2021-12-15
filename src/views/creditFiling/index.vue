<template>
    <el-container style="background-color: #f7f8f9" id="cards-index-box">
        <!-- header -->
        <el-header>
            <FxbHeader />
        </el-header>

        <!-- banner -->
        <div class="banner-box">
            <div class="el-main">
                <div class="bar-title">
                    信用建档
                    <router-link
                        to="/companyFiling/creditCard"
                        tag="div"
                        class="floatR font14"
                        style="margin-top: 4px;"
                    >
                        <el-button type="warning" size="default">
                            <img src="@/assets/images/creditFiling/icon-file.png" class="marR10" />我要建档
                        </el-button>
                    </router-link>
                </div>
                <img src="@/assets/images/creditFiling/bar-title.png" alt style="margin-left: 4px;" />
            </div>
            <div class="banner-img"></div>
        </div>

        <!-- main -->
        <el-main style="width: 1190px;">
            <!-- 功能服务 -->
            <div class="taCenter cards-title">
                <h3>功能服务</h3>
            </div>

            <el-row :gutter="39">
                <el-col :span="6">
                    <el-card shadow="hover" class="func-box">
                        <div class="bg">
                            <div class="spinner">
                                <div class="img-box">
                                    <img
                                        src="@/assets/images/creditFiling/cards-nav1.png"
                                        alt="信用档案管理"
                                    />
                                </div>
                            </div>
                            <div class="taCenter">
                                <div class="font16 fxb-333">信用档案管理</div>
                                <div class="font14 fxb-999">建立标准化企业信用档案</div>
                                <div class="font14 fxb-999">收获商业信任</div>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card shadow="hover" class="func-box">
                        <div class="bg">
                            <div class="spinner">
                                <div class="img-box">
                                    <img
                                        src="@/assets/images/creditFiling/cards-nav2.png"
                                        alt="企业信用名片"
                                    />
                                </div>
                            </div>
                            <div class="taCenter">
                                <div class="font16 fxb-333">企业信用名片</div>
                                <div class="font14 fxb-999">为企业打造专属信用名片</div>
                                <div class="font14 fxb-999">展示企业风采</div>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card shadow="hover" class="func-box">
                        <div class="bg">
                            <div class="spinner">
                                <div class="img-box">
                                    <img
                                        src="@/assets/images/creditFiling/cards-nav3.png"
                                        alt="电子数据保全"
                                    />
                                </div>
                            </div>
                            <div class="taCenter">
                                <div class="font16 fxb-333">电子数据保全</div>
                                <div class="font14 fxb-999">为企业举证、督促履约提供便利</div>
                                <div class="font14 fxb-999">保障合法权益</div>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card shadow="hover" class="func-box">
                        <div class="bg">
                            <div class="spinner">
                                <div class="img-box">
                                    <img
                                        src="@/assets/images/creditFiling/cards-nav4.png"
                                        alt="数据访问授权"
                                    />
                                </div>
                            </div>
                            <div class="taCenter">
                                <div class="font16 fxb-333">数据访问授权</div>
                                <div class="font14 fxb-999">健全非公开数据访问授权机制</div>
                                <div class="font14 fxb-999">保护用户隐私</div>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </el-main>

        <el-main style="padding: 0; padding-bottom: 60px; margin-top: -20px; width: 1190px;">
            <!-- 企业案例 -->
            <div class="taCenter cards-title">
                <h3 style="margin-top: 57px;">企业案例</h3>
            </div>

            <el-row :gutter="40">
                <el-col :span="12" class="card-case">
                    <el-card shadow="hover">
                        <div class="overH">
                            <div class="img-box">
                                <img src="@/assets/images/creditFiling/logo-demo.png" alt="logo" />
                            </div>
                            <div class="overH">
                                <div class="font18 fxb-333 marB10 case-title overH">
                                    <span class="floatL ellipsis">江苏未至科技股份有限公司江苏未至科技股份有限公司</span>
                                    <span class="floatL tag">实名认证</span>
                                </div>
                                <div class="fxb-999" style="line-height: 24px;">
                                    <p>统一社会信用代码：913205006978992544</p>
                                    <p>法定代表人：张子方</p>
                                    <p>成立日期：2019-12-03</p>
                                </div>
                            </div>
                        </div>
                        <div class="fxb-999 overH" style="line-height: 22px; height: 85px;">
                            <p>
                                江苏未至科技股份有限公司，国家发改委首批综合信用服务试点机构，国家发改委“双公示“第三方评估机构，国家公共信用信息中心首批可为信用修复申请人出具信用报告的信用服务机构。
                                公司基于信用信息化、大数据分析技术与云计算应用创建产品体系和解决方案，是一家面向各级政府、行业协会、企业机构等提供信用建设咨询规划及综合解决方...案、信用管理服务、信用评价服务、金融交易服务、企业风险管理、信用修复培训等多维度综合信用服务商。
                            </p>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="12" class="card-case">
                    <el-card shadow="hover">
                        <div class="overH">
                            <div class="img-box">
                                <img src="@/assets/images/creditFiling/logo-demo.png" alt="logo" />
                            </div>
                            <div class="overH">
                                <div class="font18 fxb-333 marB10 case-title overH">
                                    <span class="floatL ellipsis">江苏未至科技股份有限公司</span>
                                    <span class="floatL tag">实名认证</span>
                                </div>
                                <div class="fxb-999" style="line-height: 24px;">
                                    <p>统一社会信用代码：913205006978992544</p>
                                    <p>法定代表人：张子方</p>
                                    <p>成立日期：2019-12-03</p>
                                </div>
                            </div>
                        </div>
                        <div class="fxb-999 overH" style="line-height: 22px; height: 85px;">
                            <p>
                                江苏未至科技股份有限公司，国家发改委首批综合信用服务试点机构，国家发改委“双公示“第三方评估机构，国家公共信用信息中心首批可为信用修复申请人出具信用报告的信用服务机构。
                                公司基于信用信息化、大数据分析技术与云计算应用创建产品体系和解决方案，是一家面向各级政府、行业协会、企业机构等提供信用建设咨询规划及综合解决方...案、信用管理服务、信用评价服务、金融交易服务、企业风险管理、信用修复培训等多维度综合信用服务商。
                            </p>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </el-main>

        <!-- footer -->
        <el-footer>
            <FxbFooter />
        </el-footer>
    </el-container>
</template>

<script>
import { WOW } from "wowjs";

import FxbHeader from "@/views/layouts/fxb/components/FxbHeader";
import FxbMain from "@/views/layouts/fxb/components/FxbMain";
import FxbFooter from "@/views/layouts/fxb/components/FxbFooter";

export default {
    components: {
        FxbHeader,
        FxbMain,
        FxbFooter
    },
    mounted() {
        new WOW().init();
    }
};
</script>

<style lang="scss">
#cards-index-box {
    .el-card__body {
        padding: 0 !important;
    }

    .card-case .el-card__body {
        padding: 32px !important;
    }
}
</style>

<style scoped lang="scss">
$blue: #1d8ce0;
$yellow: #ffba00;

.el-main {
    color: #ffffff;
    width: 1280px;
}

.banner-box {
    position: relative;
    height: 450px;
    z-index: 1;

    .el-main {
        position: relative;
        z-index: 1000;
    }

    .bar-title {
        font-size: 40px;
        margin-top: 30px;
        margin-bottom: 108px;
    }

    .el-button--warning {
        width: 114px;
        height: 36px;
        padding: 9px 0;
        background-color: $yellow;
        border-color: $yellow;

        &:hover {
            background-color: lighten($yellow, 4%);
            border-color: lighten($yellow, 4%);
        }
    }

    .banner-img {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        z-index: 999;
        height: 100%;
        background: url(../../assets/images/creditFiling/banner.png) no-repeat
            center top;
    }
}

.cards-title {
    margin-top: 40px;
    margin-bottom: 40px;

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

// 查看更多按钮
.more {
    margin-top: 50px;
    margin-bottom: 5px;
    width: 145px;
    height: 44px;
}

// 功能服务
.func-box {
    .spinner {
        position: relative;
        margin: 36px auto 26px auto;
        width: 125px;
        height: 125px;
        padding: 5px;
        box-sizing: border-box;
        border-radius: 50%;
        background-image: linear-gradient(#ffffff, #ffffff);

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
    }

    .bg {
        position: relative;
        margin: -20px -20px 17px -20px;
        padding-top: 20px;
    }

    .font16 {
        margin-bottom: 10px;
    }

    .font14 {
        line-height: 20px;
    }

    &:hover .img-box img {
        transform: scale(1.1);
        transition: all 0.2s linear;
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
            transition: all 2s ease-in-out;
        }
    }
}

.card-case {
    .img-box {
        float: left;
        margin-right: 30px;
        margin-bottom: 23px;
        width: 160px;
        padding-top: 100px;
    }

    .ellipsis {
        margin-right: 10px;
        width: 217px;
    }

    .tag {
        height: 22px;
        line-height: 22px;
        font-size: 12px;
        color: #ffffff;
        padding: 0 5px;
        border-radius: 5px;
        background-color: #1ca7a4;
    }
}
</style>
