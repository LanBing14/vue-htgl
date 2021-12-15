<template>
<div class="user-center">
    <el-row class="user-center-top">
        <el-col :span="18">
            <ul class="center-tab">
                <router-link tag="li" :to="'creditrepair'" :class="{'active': $route.path.indexOf('creditrepair')>=0 }">申请记录</router-link>
                <li @click="onClick" :class="{'active': $route.path.indexOf('trainrecord')>=0 }">培训记录</li>
                <router-link tag="li" :to="'creditreport'" :class="{'active': $route.path.indexOf('creditreport')>=0 }">信用修复报告</router-link>
            </ul>
        </el-col>
    </el-row>

    <div class="user-center-content">
        <router-view id="user-content" name="creditPepairing" />
    </div>
</div>
</template>

<script>
    import {getUserInfo} from "@/utils/auth";

    export default {
    data() {
        return {
               userInfo: getUserInfo()
        };
    },
    mounted() {},
    methods: {
        onClick() {
            const role = this.userInfo.roleAuthInfo.role;
            if (role === null) {
                this.$confirm('您尚未完成企业认证，当前仅可查看', '提示', {
                    showCancelButton: true,
                    confirmButtonText: '前往认证',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$router.push({path: "/userCenter/setting/basicinfo"});
                })
            } else {
                this.$router.push({path: "/userCenter/creditPepairing/trainrecord"});
            }
        }
    }
};
</script>
