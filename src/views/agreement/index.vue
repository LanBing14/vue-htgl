<template>
    <el-container style="height: 100%;background-color:#fff;">
        <el-header>
            <FxbHeader/>
        </el-header>
        <el-main>
            协议协议
        </el-main>
        <el-footer>
            <FxbFooter/>
        </el-footer>
    </el-container>
</template>

<script>
    import FxbHeader from "@/views/layouts/fxb/components/FxbHeader";
    import FxbFooter from "@/views/layouts/fxb/components/FxbFooter";

    export default {
        name: "Agreement",
        components: {
            FxbHeader,
            FxbFooter
        }
    }
</script>

<style scoped lang="scss">
    .main {
        padding: 50px 0;
    }
</style>
