<template>
    <div>
        <router-view name="dataList" />
    </div>
</template>

<script>
import { getUserInfo } from "@/utils/auth";

export default {
    data() {
        return {
            userInfo: getUserInfo()
        };
    },
    mounted() {},
    methods: {}
};
</script>

<style lang="scss">
.filing-tool {
    h3 {
        font-size: 20px;
    }
}
.filing-form {
    padding-top: 26px;
    .el-form-item {
        margin-bottom: 0;
    }
    .el-form-item__label {
        text-align: left;
        padding-left: 28px;
        font-size: 14px;
        font-weight: 500;
    }
    .el-input__inner {
        width: 281px;
        margin-left: 1px;
    }
    .el-textarea__inner {
        width: 281px;
    }
}
</style>
