<template>
    <el-dropdown ref="dropDown" placement="bottom" :trigger="trigger">
        <div>
            <svg-icon iconClass="setting"/>
        </div>
        <el-dropdown-menu slot="dropdown">
            <template v-for="(el, index) in data">
                <template v-if="el">
                    <el-dropdown-item v-if="el.children&&el.children.length" :key="index">
                        <el-dropdown placement="left" trigger="hover">
                            <span>
                                {{ el.text }}
                                <i class="el-icon-arrow-right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <template v-for="(xl, xi) in el.children">
                                    <el-dropdown-item :key="xi" @click.native="xl.click">{{ xl.text }}</el-dropdown-item>
                                </template>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-dropdown-item>
                    <el-dropdown-item v-else :key="index" @click.native="el.click">{{ el.text }}</el-dropdown-item>
                </template>
            </template>
        </el-dropdown-menu>
    </el-dropdown>
</template>

<script>
export default {
    name: "ButtonDropdown",
    props: {
        data: Array,
        trigger: {
            type: String,
            default: 'hover'
        }
    },
    data() {
        return {};
    }
};
</script>

<style scoped>
</style>
