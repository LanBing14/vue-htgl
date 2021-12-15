<template>
    <el-radio-group v-model="row.id" @change="handleChange(row.id, order)">
        <el-radio v-for="item in row" :label="item.id" :key="item.id">{{
            item.optionOrder
        }}</el-radio>
    </el-radio-group>
</template>

<script>
export default {
    name: "ChildLi",
    props: {
        order: {
            type: Number,
            default: 0
        },
        row: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        // 获取选中的答案的id
        handleChange(val, index) {
            this.$store.dispatch("AddRadioAns", { val, index });
            this.$store.dispatch("EditRadioQuestions", index);
        }
    }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
