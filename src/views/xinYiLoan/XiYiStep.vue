<template>
    <div class="xinyi-financial">
        <div class="financial-step overH marB30">
            <div
                class="floatL taCenter"
                :class="{ active: curStep === 'demandFill' }"
            >
                <img src="../../assets/images/step1.png" alt="" />
                <p class="font16 marT15">
                    {{ productId ? "产品申请" : "需求填写" }}
                </p>
            </div>
            <div class="step-line floatL"></div>
            <div
                class="floatL taCenter"
                :class="{ active: curStep === 'onlineAuthor' }"
            >
                <img src="../../assets/images/step2.png" alt="" />
                <p class="font16 marT15">在线授权</p>
            </div>
            <div class="step-line floatL"></div>
            <div
                class="floatL taCenter"
                :class="{ active: curStep === 'infoPush' }"
            >
                <img src="../../assets/images/step3.png" alt="" />
                <p class="font16 marT15">信息报送</p>
            </div>
        </div>
        <router-view name="step" />
    </div>
</template>

<script>
export default {
    data() {
        return {
            curStep: "demandFill",
            productId: ""
        };
    },
    watch: {
        $route: {
            handler: function() {
                this.curStep = this.$route.name;
            },
            immediate: true
        }
    },
    mounted() {
        this.productId = this.$route.query.id || null;
    }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.form-step {
    .el-form-item__label {
        font-size: 16px;
        padding-right: 40px;
    }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.xinyi-financial {
    background-color: #fff;
    padding: 50px 0;
    margin-top: 20px;
    margin-bottom: 60px;
    .financial-step {
        border-bottom: 1px solid #ebeef5;
        padding-bottom: 30px;
        text-align: center;
        div:nth-child(1) {
            margin-left: calc((100% - (125px * 3 + 148px * 2 + 20px * 4)) / 2);
        }
        div:nth-child(1).active {
            color: #4c5ee5;
        }
        div:nth-child(3).active {
            color: #f9a834;
        }
        div:nth-child(5).active {
            color: #40c92b;
        }
        .step-line {
            width: 148px;
            margin: calc(125px / 2) 20px 0;
            border-top: 1px dashed #ddd;
        }
    }
}
</style>
