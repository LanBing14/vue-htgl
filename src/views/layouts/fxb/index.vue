<template>
    <el-container>
        <el-header>
            <FxbHeader />
        </el-header>
        <el-main>
            <FxbMain />
        </el-main>
        <el-footer>
            <FxbFooter />
        </el-footer>
    </el-container>
</template>

<script>
import FxbHeader from "./components/FxbHeader";
import FxbMain from "./components/FxbMain";
import FxbFooter from "./components/FxbFooter";

export default {
    name: "FxbLayout",
    components: { FxbHeader, FxbMain, FxbFooter },
    computed: {},
    methods: {}
};
</script>

<style scoped lang="scss"></style>
