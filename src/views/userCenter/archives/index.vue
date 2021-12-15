<template>
<div class="user-center">
    <div class="user-center-content">
        <!-- <div ref="scrollbar" class="scroll-wrap-userCenter"> -->
            <router-view id="user-content" name="archives" />
        <!-- </div> -->
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
    provide() {
        return { routerWrap: this };
    },
    mounted() {},
    methods: {
    }
};
</script>
<style scoped lang="scss">
    .user-center-content{
        /* height:calc(100vh - 200px); */
    }
    .scroll-wrap-userCenter{
        height:100%;
    }
</style>
