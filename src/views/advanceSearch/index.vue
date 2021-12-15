<template>
    <el-container>
        <el-header :class="{isHome: isHome}">
            <FxbHeader/>
        </el-header>
        <keep-alive>
            <router-view :key="key"/>
        </keep-alive>
        <el-footer>
            <FxbFooter/>
        </el-footer>
    </el-container>
</template>

<script>
    import FxbFooter from "@/views/layouts/fxb/components/FxbFooter";
    import FxbHeader from "@/views/layouts/fxb/components/FxbHeader/index";
    import FxbMain from "@/views/layouts/fxb/components/FxbMain";

    export default {
        name: "AdvanceSearch",
        components: {FxbHeader, FxbMain, FxbFooter},
        computed: {
            isHome() {
                return this.$route.path === '/advanceSearch'
            },
            key() {
                return this.$route.path
            }
        }

    };
</script>
<style scoped lang="scss">
    .isHome /deep/ {
        .fxb-header2 {
            background-color: transparent;
        }
    }
</style>
