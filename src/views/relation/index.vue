<template>
    <el-container style="height: 100%;">
        <el-header>
            <FxbHeader/>
        </el-header>
        <el-container class="main has-aside">
<!--            <el-aside width="210px">-->
<!--                <el-scrollbar style="height:100%">-->
<!--                    <Sidebar :basePath="basePath" :curRoutes="curRoutes"></Sidebar>-->
<!--                </el-scrollbar>-->
<!--            </el-aside>-->
            <el-container style="height: auto">
                <div class="app-container" style=" width: 100%;">
                    <router-view
                        style="height: 100%; padding: 20px 30px; overflow-y: auto; overflow-x: hidden"
                    />
                </div>
            </el-container>
        </el-container>
    </el-container>
</template>
<script>
    import FxbHeader from "@/views/layouts/fxb/components/FxbHeader";
    import Sidebar from "@/views/layouts/fxb/components/Sidebar/index";
    import relation from "@/router/routerGroup/relation";

    export default {
        name: "Relation",
        components: {
            FxbHeader,
            Sidebar
        },
        data() {
            return {
                basePath: ''
            };
        },
        computed: {
            curRoutes() {
                return relation[0].children;
            }
        },
        methods: {

        }
    };
</script>

