<template>
    <el-container style="height: 100%;">
        <el-header>
            <FxbHeader headerStyle="width: auto; padding: 0 39px" @reload="reload"/>
        </el-header>
        <el-container class="main">
            <el-aside width="210px">
                <el-scrollbar style="height:100%">
                    <Sidebar :basePath="basePath" :curRoutes="curRoutes" @reload="reload"></Sidebar>
                </el-scrollbar>
            </el-aside>
            <el-container style="height: auto">
                <div class="app-container" style="margin-left: 20px; width: calc(100% - 20px)">
                    <router-view
                        v-if="isRouterAlive"
                        style="height: 100%; padding: 20px 30px; overflow-y: auto; overflow-x: hidden"
                    />
                </div>
            </el-container>
        </el-container>
    </el-container>
</template>

<script>
    import FxbHeader from "@/views/layouts/fxb/components/FxbHeader";
    import settingsIds from "@/router/routerGroup/settingsIds";
    import Sidebar from "@/views/layouts/fxb/components/Sidebar/index";
    import {merge} from 'lodash';

    export default {
        name: "Settings",
        components: {
            Sidebar,
            FxbHeader
        },
        data() {
            return {
                basePath: '',
                isRouterAlive: true,
                // curRoutes: CreditManagement[0].children
            };
        },
        computed: {
            curRoutes() {
                let {settingsRouters} = this.$store.state.permission;
                settingsRouters = merge([], settingsRouters);
                const r = !settingsRouters.length ? [settingsIds.settings().children[0]]
                    : [
                        settingsIds.settings().children[0],
                        ...settingsRouters[0].children
                    ];
                return r
            }
        },
         methods: {
            reload() {
                this.isRouterAlive = false;
                this.$nextTick(() => (this.isRouterAlive = true));
            }
        },
    };
</script>

<style scoped lang="scss">
    @import "src/styles/mixin.scss";
    /deep/ {
        @include elCustom;
    }
    /deep/ .box-card {
        border-color: #DCDFE6;
        /deep/ {
            .el-card__header {
                border-color: #DCDFE6;
            }
        }
    }
</style>
