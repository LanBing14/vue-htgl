<template>
    <div class="user-center custom-group-div">
        <el-row class="user-center-top">
            <el-col :span="18">
                <ul class="center-tab">
                    <span v-if="roleAuthInfo.role == null || roleAuthInfo.role === '0'">
                        <router-link tag="li" :to="{name:'self'}" :class="{'active': $route.path.indexOf('self')>=0 }">自身管理</router-link>
                    </span>
                    <router-link
                        tag="li"
                        :to="{name:'attention',params:{groupType:'1'}}"
                        :class="{'active': ($route.path.indexOf('attention')>=0 || $route.path.indexOf('accurate')>=0 || $route.path.indexOf('batchimport')>=0 || $route.path.indexOf('infomaintain')>=0 ) && $route.params.groupType==='1' }"
                    >供应商管理</router-link>
                    <router-link
                        tag="li"
                        :to="{name:'attention',params:{groupType:'0'}}"
                        :class="{'active': ($route.path.indexOf('attention')>=0 || $route.path.indexOf('accurate')>=0 || $route.path.indexOf('batchimport')>=0 || $route.path.indexOf('infomaintain')>=0 ) && $route.params.groupType==='0' }"
                    >客户管理</router-link>
                </ul>
            </el-col>
            <el-col :span="6" align="right">
                <div
                    v-if="($route.path === '/userCenter/creditManage/attention/1' || $route.path === '/userCenter/creditManage/attention/0') && hasEditAttentionGroupPermission"
                >
                    <el-button icon="el-icon-document" size="small" @click="openCustomGroup">自定义分组</el-button>
                </div>
                <!-- v-else -->
                <!--<div
                    v-if="$route.path == '/userCenter/creditManage/accurate/1' || $route.path == '/userCenter/creditManage/batchimport/1'">
                    <el-button size="small" @click="$router.push('/userCenter/creditManage/attention/1')">返回</el-button>
                </div>
                <div
                    v-if="$route.path == '/userCenter/creditManage/accurate/0' || $route.path == '/userCenter/creditManage/batchimport/0'">
                    <el-button size="small" @click="$router.push('/userCenter/creditManage/attention/0')">返回</el-button>
                </div>-->
                <div
                    v-if="$route.path.indexOf('accurate')>=0 || $route.path.indexOf('batchimport')>=0 || $route.path.indexOf('infomaintain')>=0"
                >
                    <el-button
                        size="small"
                        @click="$router.push('/userCenter/creditManage/attention/'+$route.path.split('/')[4])"
                    >返回</el-button>
                </div>
            </el-col>
        </el-row>

        <div class="user-center-content">
            <router-view id="user-content" name="creditManage" v-if="isRouterAlive" />
        </div>

        <el-dialog
            title="自定义分组"
            :visible.sync="customGroupDialogVisible"
            :close-on-click-modal="false"
            width="30%"
            center
            :before-close="closeCustomGroupDialog"
        >
            <el-tabs class="custom-group-tab" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane class="custom-group-item" label="供应商" name="1">
                    <CustomGroup ref="supplierCustomGroup" :groupType="1" />
                </el-tab-pane>
                <el-tab-pane class="custom-group-item" label="客户" name="0">
                    <CustomGroup ref="customerCustomGroup" :groupType="0" />
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
    </div>
</template>
<script>
import CustomGroup from "../components/CustomGroup";
import { getRoleAuthInfo } from "@/utils/auth";

export default {
    components: { CustomGroup },
    data() {
        return {
            activeName: "1",
            isRouterAlive: true,
            customGroupDialogVisible: false,
            hasEditAttentionGroupPermission: false,
            roleAuthInfo: getRoleAuthInfo()
        };
    },
    created() {
        // 是否有编辑分组权限
        const roleAuthInfo = getRoleAuthInfo();
        this.hasEditAttentionGroupPermission =
            roleAuthInfo.role === undefined ||
            roleAuthInfo.role == null ||
            roleAuthInfo.role === "null" ||
            roleAuthInfo.role === "0";
        console.log(this.hasEditAttentionGroupPermission);
    },
    updated() {
        this.activeName = this.$route.params.groupType;
    },
    methods: {
        // 自定义分组弹框关闭控制
        closeCustomGroupDialog(done) {
            // 合并两个分组编辑页签的Promise
            let customPromise = this.$refs.supplierCustomGroup.customPromise.concat(
                this.$refs.customerCustomGroup.customPromise
            );
            const close = () => {
                if (typeof done === "function") {
                    done();
                } else {
                    this.customGroupDialogVisible = false;
                }
            };
            if (customPromise && customPromise.length > 0) {
                Promise.all(customPromise).then(res => {
                    customPromise = [];
                    this.$refs.supplierCustomGroup.customPromise = [];
                    this.$refs.customerCustomGroup.customPromise = [];
                    // 刷新全局变量里的分组
                    this.$store.dispatch("updateAttentionGroup");
                    // 刷新列表
                    this.reload();
                    close();
                });
            } else {
                // 没有发生接口调用，无需刷新页面
                close();
            }
        },
        // 打开自定义分组弹窗
        openCustomGroup() {
            this.customGroupDialogVisible = true;
        },
        handleClick(tab, event) {
            // console.log(tab, event);
        },
        reload() {
            this.isRouterAlive = false;
            this.$nextTick(() => (this.isRouterAlive = true));
        }
    }
};
</script>
<style rel="stylesheet/scss" lang="scss">
.custom-group-div .el-dialog__body {
    padding: 15px 20px 0 20px !important;
}

.custom-group-tab > .el-tabs__header {
    border-bottom: 1px solid #eaedf4 !important;
    margin-bottom: 1px !important;
    font-size: 16px !important;
}

.custom-group-tab .el-tabs__nav {
    width: 100% !important;
}

.custom-group-tab .el-tabs__item {
    font-size: 16px !important;
    width: 50% !important;
    text-align: center;
}
</style>
<style lang="scss" scoped>
.el-row {
    margin-bottom: 20px;

    &:last-child {
        margin-bottom: 0;
    }
}

.el-pagination {
    margin-top: 15px;
}
</style>
