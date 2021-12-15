<template>
    <div>
        <div class="paper-content" v-for="(item, index) in list" :key="index">
            <h3>
                <span class="order">{{ index + 1 }}</span>
                {{ item.name }}
            </h3>
            <el-row
                type="flex"
                justify="center"
                align="middle"
                style="margin-left: 60px;"
            >
                <el-col :span="3">填空答案</el-col>
                <el-col :span="21">
                    <Child :order="index" :id="item.id" />
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import Child from "./Child";

export default {
    name: "Completion",
    components: {
        Child
    },
    props: {
        list: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {};
    },
    methods: {}
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
