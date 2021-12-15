<template>
    <div class="usercenter-container">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="基本资料" name="info">
                <BasicInfo/>
            </el-tab-pane>
            <el-tab-pane label="部门设置" name="departmentSetting">
                <DepartmentSetting/>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import BasicInfo from "./BasicInfo.vue";
import DepartmentSetting from "./DepartmentSetting.vue";

export default {
    name: "UserInfo",
    components: {
        BasicInfo,
        DepartmentSetting
    },
    data() {
        return {
            activeName: "info"
        };
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event);
        }
    }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
