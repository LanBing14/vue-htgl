<template>
    <div class="payment-box bgWhite">
        <img
            src="@/assets/images/wxpay.png"
            alt="微信支付"
            style="margin-bottom: 90px;"
        />
        <div class="success-box">
            <div class="taCenter">
                <img
                    src="../../assets/images/success.png"
                    alt=""
                    style="margin-bottom: 37px;"
                />
                <div
                    class="font18"
                    style="color: #39393a; margin-bottom: 28px;"
                >
                    支付成功
                </div>
                <div class="fxb-999" style="margin-bottom: 53px;">
                    {{ num }}秒后自动返回商户
                </div>
                <el-button
                    type="success"
                    style="margin-bottom: 171px; background-color: #52cf51; width: 142px; height: 42px;"
                    @click="windowClose()"
                    >立即返回</el-button
                >
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "PaySuccess",
    data() {
        return {
            num: 5,
            timer: ""
        };
    },
    created() {
        // 定时器 查询订单支付状态
        const This = this;
        this.timer = setInterval(function() {
            if (This.num <= 1) {
                This.windowClose();
            } else {
                This.num--;
            }
        }, 1000);
    },
    mounted() {},
    beforeDestroy() {
        // 页面销毁前 关闭定时器
        clearInterval(this.timer);
    },
    methods: {
        windowClose() {
            clearInterval(this.timer);
            window.opener = null;
            window.open("", "_self");
            window.close();
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
}
</style>
