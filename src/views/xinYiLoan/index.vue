<template>
    <el-container>
        <el-header>
            <FxbHeader />
        </el-header>

        <div class="xinyi-top">
            <div class="top-content">
                <span class="font40 fxb-wihte fontwb floatL">信易贷</span>
                <div class="content-text floatL">
                    <h3>聚力金融资源</h3>
                    <h3>助力中小微企业发展</h3>
                </div>
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
        </div>

        <el-main>
            <router-view />
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
            // 监测加载
        };
    },
    computed: {},
    mounted() {},
    methods: {
        goRouter(route) {
            // 判断认证状态

            this.$router.push({
                path: route
            });
        }
    }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.xinyi-top {
    margin-top: -1px;
    background-image: url("../../assets/images/xytbg.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    .top-content {
        width: 1280px;
        height: 56px;
        margin: 40px auto;
        .content-text {
            color: #fff;
            font-size: 22px;
            margin-left: 150px;
            border-left: 15px solid #ffb900;
            h3 {
                letter-spacing: 3px;
                &:first-child {
                    margin-left: 25px;
                }
                &:last-child {
                    margin-left: 100px;
                }
            }
        }
    }
}
</style>
