<template>
    <div class="payment-box bgWhite">
        <img
            src="@/assets/images/wxpay.png"
            alt="微信支付"
            style="margin-bottom: 90px;"
        />

        <div class="pay-main overH">
            <div class="floatL pay-left">
                <div class="fxb-333">订单将在60分钟后关闭，请及时付款</div>
                <div class="ewm-box taCenter" v-loading="loading">
                    <img
                        :src="codeImage"
                        alt="二维码"
                        width="208"
                        height="208"
                    />
                </div>
                <div class="marL30 fxb-999">请使用微信扫一扫完成支付</div>
            </div>
            <div class="overH pay-right fxb-333">
                <div class="marB26">
                    <span v-if="orderInfo.ORDER_TYPE === '1'"
                        >信用报告订单</span
                    >
                    <span v-if="orderInfo.ORDER_TYPE === '4'"
                        >培训课程订单</span
                    >
                </div>
                <div class="price-box">
                    <span class="unit fxb-333">¥</span
                    ><span class="price">{{ orderInfo.ACTUAL_AMOUNT }}</span>
                </div>
                <p>
                    <span class="fxb-999">收款方</span
                    ><span>江苏未至科技股份有限公司</span>
                </p>
                <p>
                    <span class="fxb-999">下单时间</span
                    ><span>{{
                        orderInfo.CREATE_DATE
                            | dateFormat("yyyy-MM-dd hh:mm:ss")
                    }}</span>
                </p>
                <p>
                    <span class="fxb-999">订单号</span
                    ><span>{{ orderNo || "-" }}</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import {
    Api_OrderQuery,
    Api_WriterImage,
    Api_WXPay,
    Api_GetOrder
} from "@/api/userCenter/orderManage";
import { dateFormat } from "@/utils/index";

export default {
    name: "Payment",
    filters: {
        dateFormat
    },
    data() {
        return {
            loading: true,
            orderNo: "",
            codeImage: require("../../assets/images/ewm.png"),
            orderInfo: {
                ORDER_NO: "",
                COMPANY_NAME: "",
                COURSE_NAME: "",
                ORDER_TYPE: "",
                ORDER_PRICE: 0,
                ACTUAL_AMOUNT: 0,
                CREATE_DATE: ""
            },
            timer: ""
        };
    },
    created() {
        this.orderNo = this.$route.query.orderNo;
        // 获取订单信息
        Api_GetOrder({ orderNo: this.orderNo }).then(res => {
            if (res.stateCode === "30301") {
                this.orderInfo = res.data;
                if (res.data.ORDER_STATUS === 1) {
                    this.$alert("当前订单已付款，请勿重复支付", {
                        confirmButtonText: "确定",
                        type: "warning"
                    })
                        .then(() => {
                            window.opener = null;
                            window.open("", "_self");
                            window.close();
                        })
                        .catch(() => {
                            window.opener = null;
                            window.open("", "_self");
                            window.close();
                        });
                } else {
                    // 调用微信支付 获取二维码
                    Api_WXPay({ orderNo: this.orderNo }).then(res => {
                        if (res.stateCode === "1") {
                            this.loading = false;
                            // 二维码链接处理成IO流
                            Api_WriterImage({ codeUrl: res.data }).then(
                                image => {
                                    this.codeUrl = image;
                                }
                            );
                            // 定时器 查询订单支付状态
                            this.timer = setInterval(this.orderQuery(), 1000);
                        }
                    });
                }
            }
        });
    },
    mounted() {},
    beforeDestroy() {
        // 页面销毁前 关闭定时器
        clearInterval(this.timer);
    },
    methods: {
        orderQuery() {
            Api_OrderQuery({ orderNo: this.orderNo }).then(res => {
                if (res.stateCode === "1") {
                    clearInterval(this.timer);
                    // 跳转支付成功页
                    this.$router.push({
                        path: "/paySuccess"
                    });
                }
            });
        }
    }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.payment-box {
    width: 1000px;
    margin: 0 auto;
    margin-top: 20px;
    padding: 40px 63px;

    .pay-left {
        margin-left: 73px;
    }

    .marB26 {
        margin-bottom: 26px;
    }

    .ewm-box {
        padding-left: 10px;
        padding-right: 113px;
        padding-top: 26px;
        padding-bottom: 22px;
        border-right: 1px dashed #d1d1d1;
    }

    .pay-right {
        padding-left: 120px;

        p {
            margin-bottom: 20px;
            display: flex;
        }

        span {
            width: calc(100% - 82px);
        }

        span.fxb-999 {
            width: 82px;
        }
    }

    .price-box {
        margin-bottom: 50px;
    }

    .unit {
        margin-right: 15px;
        vertical-align: 17px;
        font-size: 32px;
    }

    .price {
        font-size: 56px;
    }
}
</style>

<style lang="scss">
/* 加载组件 样式修改 */
.el-loading-spinner {
    padding-right: 103px;
}
</style>
