<template>
    <el-input
        v-model.trim="input"
        type="textarea"
        autosize
        maxlength="40"
        placeholder="请输入内容"
        @change="handleBlur(input, order)"
    ></el-input>
</template>

<script>
export default {
    name: "ChildLi",
    props: {
        order: {
            type: Number,
            default: 0
        },
        id: {
            type: String,
            default: () => ""
        }
    },
    data() {
        return {
            input: ""
        };
    },
    methods: {
        // 获取选中的答案的id
        handleBlur(val, index) {
            const id = this.id;
            this.$store.dispatch("AddCompletionAns", { val, index, id });
            // this.$store.dispatch("EditCompletionQuestions", index);
        }
    }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
