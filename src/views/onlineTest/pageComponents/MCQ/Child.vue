<template>
    <el-checkbox-group
        v-model="checkList"
        @change="handleChange(checkList, order)"
    >
        <el-checkbox v-for="item in row" :label="item.id" :key="item.id">{{
            item.optionOrder
        }}</el-checkbox>
    </el-checkbox-group>
</template>

<script>
export default {
    name: "ChildLi",
    props: {
        order: {
            type: Number,
            default: 0
        },
        question: {
            type: String,
            default: () => ""
        },
        row: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            checkList: []
        };
    },
    methods: {
        // 获取选中的答案的id
        handleChange(val, index) {
            this.$store.dispatch("AddMulAns", { val, index });
            this.$store.dispatch("EditMulQuestions", { val, index });
        }
    }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
