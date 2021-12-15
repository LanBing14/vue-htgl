<template>
    <div>
        <Main v-if="!editing" @edit="onEdit"></Main>
        <Do v-else-if="editing && pageType===1" :data="selectData" @edit="onEdit"></Do>
        <Do v-else-if="editing && pageType===2" :data="selectData" isView @edit="onEdit"></Do>
    </div>
</template>

<script type="text/jsx">
    import Main from './Main';
    import Do from './Do';
    import {
        Api_GetAssessmentDetail
    } from "@/api/creditManagement/creditGranting/customer";

    export default {
        name: "Record",
        components: {
            Main,
            Do,
            History
        },
        data() {
            return {
                editing: false,
                selectData: {},
                pageType: 1 // 1：评估执行，2：评估详情，3：评估历史
            };
        },
        created() {
            const { id } = this.$route.query;
            if (id) {
                Api_GetAssessmentDetail(id).then(res => {
                    this.selectData = res;
                    this.editing = true;
                    this.pageType = 2;
                }).catch(res => {
                    this.$message.error(res)
                });
            }
        },
        methods: {
            // 编辑中，执行/详情，当前行数据
            onEdit(editing, pageType, row) {
                this.editing = editing;
                this.pageType = pageType;
                this.selectData = Object.assign({}, row);
            }
        }
    };
</script>

<style scoped lang="scss">

    .list-item + .list-item {
        margin-top: 15px;
    }

</style>
