<template>
    <el-container>
        <el-header>
            <FxbHeader />
        </el-header>

        <!-- banner -->
        <div class="marB20">
            <div class="banner-box">
                <div class="animated fadeIn banner-img"></div>
            </div>
        </div>

        <el-main class="overH" style="margin-bottom: 25px;">
            <Nav id="filing-nav" class="floatL marR30" />
            <router-view id="filing-nav-content" class="overH bgWhite" name="filingNav" />
        </el-main>

        <el-footer>
            <FxbFooter />
        </el-footer>
    </el-container>
</template>

<script>
import Nav from "@/views/creditFiling/nav/FilingNav";
import FxbHeader from "@/views/layouts/fxb/components/FxbHeader";
import FxbMain from "@/views/layouts/fxb/components/FxbMain";
import FxbFooter from "@/views/layouts/fxb/components/FxbFooter";

export default {
    name: "CompanyFiling",
    components: {
        Nav,
        FxbHeader,
        FxbMain,
        FxbFooter
    },
    computed: {}
};
</script>

<style scoped lang="scss">
.banner-box {
    position: relative;
    height: 136px;

    .banner-img {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        z-index: 999;
        height: 100%;
        background: url(../../assets/images/creditFiling/filing-banner.png)
            no-repeat center top;
    }
}

#filing-nav-content {
    padding: 29px 43px;
}
</style>
