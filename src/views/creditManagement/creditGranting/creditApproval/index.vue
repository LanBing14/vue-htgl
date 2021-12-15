<template>
    <div>
        <Main v-if="!editing" @edit="onEdit"></Main>
        <Approval v-else-if="editing && pageType===1" :isAdd="isAdd" :applyNo="applyNo" @edit="onEdit"></Approval>
        <Detail v-else-if="editing && pageType===2" :isAdd="isAdd" :applyNo="applyNo" @edit="onEdit"></Detail>
    </div>
</template>

<script type="text/jsx">
    import Main from './Main';
    import Approval from './Approval';
    import Detail from './Detail';

    export default {
        name: "Customer",
        components: {
            Main,
            Approval,
            Detail
        },
        data() {
            return {
                editing: false,
                pageType: 1, // 1：审批，2：详情
                isAdd: '',
                applyNo: ''
            };
        },
        methods: {
            onEdit(editing, pageType, isAdd, applyNo) {
                this.editing = editing;
                this.pageType = pageType;
                this.isAdd = isAdd;
                this.applyNo = applyNo
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
