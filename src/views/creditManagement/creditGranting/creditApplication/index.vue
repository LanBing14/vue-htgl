<template>
    <div>
        <Main v-if="!editing" @edit="onEdit" :init.sync="init"></Main>
        <AddApplication v-else-if="editing && pageType===1" :isAdd="isAdd" @edit="onEdit"></AddApplication>
        <DetailApplication v-else-if="editing && pageType===2" :isAdd="isAdd" @edit="onEdit"></DetailApplication>
    </div>
</template>

<script type="text/jsx">
import Main from "./Main";
import AddApplication from "./AddApplication";
import DetailApplication from "./DetailApplication";

export default {
    name: "Customer",
    components: {
        Main,
        AddApplication,
        DetailApplication
    },
    data() {
        return {
            editing: false,
            pageType: 1, // 1：新增申请，2：详情
            isAdd: "",
            init: true
        };
    },
    methods: {
        onEdit(editing, pageType, isAdd) {
            console.log(editing);

            this.editing = editing;
            this.pageType = pageType;
            this.isAdd = isAdd;
        }
    }
};
</script>

<style scoped lang="scss">
/deep/ {
    .unit-number {
        color: #333;
    }
    .el-form-item__content {
        color: #666666;
    }
}
</style>
