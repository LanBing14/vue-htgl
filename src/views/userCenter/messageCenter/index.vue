<template>
<div class="user-center">
    <el-row class="user-center-top">
        <el-col :span="18">
            <ul class="center-tab">
                <router-link tag="li" :to="'message'" :class="{'active': $route.path.indexOf('message')>=0 }">消息中心</router-link>
            </ul>
        </el-col>
    </el-row>

    <div class="user-center-content">
        <router-view id="user-content" name="messageManage" />
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {

        };
    },
    mounted() {},
    methods: {}
};
</script>
