<template>
    <el-container>
        <el-header>
            <FxbHeader />
        </el-header>
        <div class="xinyi-content">
            <div class="content-center">
                <div class="overH">
                    <span class="font40 fxb-wihte fontwb">信易贷</span>
                    <div class="floatR">
                        <el-button
                            @click="goRouter('/xinYiLoan/xinYiStep')"
                            type="primary"
                            size="medium"
                        >
                            <svg-icon icon-class="money2" /> 我要融资
                        </el-button>
                        <el-button
                            @click="goRouter('/xinYiLoan/productList')"
                            size="medium"
                        >
                            <svg-icon icon-class="collection" /> 金融产品
                        </el-button>
                    </div>
                </div>
                <div class="overH">
                    <div class="content-title floatL">
                        <h1>聚力</h1>
                        <h1>金融资源</h1>
                        <h2>助力中小微<br />企业发展</h2>
                    </div>
                    <div class="content-introduce floatR">
                        <h2>信易贷是什么?</h2>
                        <p>
                            “服务小企业，成就大事业”承载着北京银行与小微企业共同成长的美好愿景。
                            作为国内较早确定小微企业战略定位的金融机构，北京银行在发展中几级充当“小微企业成长好伙伴”的探索者和实践者。
                            统计显示，北京银行小微企业公司贷款规模从2006年94亿元发展到目前2352亿元，9年间增张了25倍。
                            目前，北京银行为近10万家微小企业提供金融服务，累计为4万户微小企业发放贷款超的客户。
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="xinyi-data">
            <ul class="font18">
                <li>
                    <h2 class="font40 fxb-red">12</h2>
                    <p>金融产品 <span>家</span></p>
                </li>
                <li>
                    <h2 class="font40 fxb-green2">1991</h2>
                    <p>企业用户 <span>家</span></p>
                </li>
                <li>
                    <h2 class="font40 fxb-blue">368</h2>
                    <p>融资需求 <span>个</span></p>
                </li>
                <li>
                    <h2 class="font40 fxb-purple">517</h2>
                    <p>解决需求 <span>个</span></p>
                </li>
                <li>
                    <h2 class="font40 fxb-organic">10.7</h2>
                    <p>融资金额 <span>亿</span></p>
                </li>
            </ul>
        </div>
        <el-main>
            <div class="xinyi-partners overH ">
                <div class="partners-title">
                    <div class="taCenter">
                        <h1 class="font35">合作伙伴</h1>
                        <p>至真至诚，欢迎您的加盟</p>
                    </div>
                </div>
                <ul class="partners-list">
                    <li class="bank zggsyh"><!--中国工商银行--></li>
                    <li class="bank zgnyyh"><!--中国农业银行--></li>
                    <li class="bank zgyh"><!--中国银行--></li>
                    <li class="bank zgjsyh"><!--中国建设银行--></li>
                    <li class="bank jtyh"><!--交通银行--></li>
                    <li class="bank shpfyh"><!--上海浦发银行--></li>
                    <li class="bank gsyh"><!--招商银行--></li>
                    <li class="bank gsyh"><!--中信银行--></li>
                    <li class="bank gsyh"><!--中国邮政银行--></li>
                    <li class="bank gsyh"><!--中国民生银行--></li>
                    <li class="bank gsyh"><!--中国光大银行--></li>
                    <li class="bank gsyh"><!--广发银行--></li>
                    <li class="bank gsyh"><!--华夏银行--></li>
                    <li class="bank gsyh"><!--兴业银行--></li>
                    <li class="bank gsyh"><!--苏州银行--></li>
                    <li class="bank gsyh"><!--上海银行--></li>
                    <li class="bank gsyh"><!--宁波银行--></li>
                    <li class="bank gsyh"><!--江苏银行--></li>
                </ul>
            </div>
        </el-main>
        <el-footer>
            <FxbFooter />
        </el-footer>
    </el-container>
</template>

<script>
import FxbHeader from "@/views/layouts/fxb/components/FxbHeader";
import FxbFooter from "@/views/layouts/fxb/components/FxbFooter";
export default {
    components: {
        FxbHeader,
        FxbFooter
    },
    data() {
        return {
            loading: false
        };
    },
    computed: {},
    mounted() {},
    methods: {
        goRouter(route) {
            this.$router.push({
                path: route
            });
        }
    }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.fxb-red2 {
    color: #f34b4b;
}
.fxb-green2 {
    color: #0cd2d3;
}
.fxb-blue {
    color: #469af8;
}
.fxb-purple {
    color: #f6539c;
}
.fxb-organic {
    color: #fda301;
}
.xinyi-content {
    background-image: url("../../assets/images/banner.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    .content-center {
        width: 1280px;
        height: 658px;
        margin: -1px auto;
        padding: 40px 0;
    }
}
.content-title {
    color: #fff;
    margin-top: 145px;
    position: relative;
    h1 {
        font-size: 100px;
        font-weight: 600;
        margin: 0;
        letter-spacing: 15px;
        &:first-child {
            padding-left: 50px;
            border-left: 20px solid #ffb900;
        }
        &:nth-child(2) {
            margin-top: 35px;
            padding-left: 70px;
        }
    }
    h2 {
        letter-spacing: 5px;
        font-size: 35px;
        position: absolute;
        top: 0;
        right: -15px;
    }
}
.content-introduce {
    position: relative;
    width: 407px;
    padding: 35px;
    color: #fff;
    margin-top: 108px;
    background-color: rgba(0, 0, 0, 0.5);
    h2 {
        margin-bottom: 25px;
        font-weight: 600;
    }
    p {
        line-height: 30px;
    }
    &::after {
        content: "";
        width: 80px;
        height: 16px;
        background: #f34b4b;
        position: absolute;
        top: 0;
        right: 20px;
    }
}
.xinyi-data {
    background-color: #fff;
    ul {
        width: 1280px;
        margin: 0 auto;
        padding: 60px 0;
        overflow: hidden;
    }
    li {
        float: left;
        width: 20%;
        border-left: 1px dashed #abb7c5;
    }
    li:last-child {
        border-right: 1px dashed #abb7c5;
    }
    h2 {
        margin-left: 20px;
        margin-bottom: 35px;
    }
    p {
        margin-left: 20px;
    }
    span {
        font-size: 14px;
        color: #abb7c5;
    }
}
.xinyi-partners {
    width: 1280px;
    margin: 0 auto;
    padding: 40px 0;
    .partners-title {
        h1 {
            margin: 15px 0;
            background-image: url("../../assets/images/tbg.png");
            background-repeat: no-repeat;
            background-position: center;
        }
        p {
            letter-spacing: 2px;
        }
    }
}
.partners-list {
    .bank {
        $partnner_row: -218px;
        $partnner_col: -76px;
        background-image: url("../../assets/images/yh.png");
        background-repeat: no-repeat;
        @for $i from 0 through 18 {
            @if $i < 7 {
                &:nth-child(#{$i}) {
                    background-position: #{$partnner_row *
                        ($i - 1)}
                        #{$partnner_col *
                        0};
                }
            } @else if $i > 12 {
                &:nth-child(#{$i}) {
                    background-position: #{$partnner_row *
                        ($i - 13)}
                        #{$partnner_col *
                        2};
                }
            } @else {
                &:nth-child(#{$i}) {
                    background-position: #{$partnner_row *
                        ($i - 7)}
                        #{$partnner_col *
                        1};
                }
            }
        }
    }
    margin-top: 50px;
    li {
        width: calc((100% - 150px) / 6);
        height: 64px;
        /*padding:10px 0;*/
        text-align: center;
        background-color: #fff;
        float: left;
        margin-right: 30px;
        margin-bottom: 10px;
        &:nth-child(6n) {
            margin-right: 0;
        }
    }
}
</style>
