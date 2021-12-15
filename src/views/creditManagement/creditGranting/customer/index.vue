<template>
    <div>
        <Main v-if="!editing" @edit="onEdit" @detailData="onDetailData" @isAdd="TacticsIsAdd"></Main>
        <Tactics v-else-if="editing && pageType===1" :tacticsStatus="tacticsStatus" @edit="onEdit"></Tactics>
        <Detail v-else-if="editing && pageType===2" @edit="onEdit" :company="selectCompany"></Detail>
        <CreateUpdate v-else-if="editing && pageType===3" @edit="onEdit" :row="row"></CreateUpdate>
    </div>
</template>

<script type="text/jsx">
    import Main from './Main';
    import Tactics from './Tactics';
    import Detail from './Detail';
    import CreateUpdate from './CreateUpdate';

    export default {
        name: "Customer",
        components: {
            Main,
            Tactics,
            Detail,
            CreateUpdate
        },
        data() {
            return {
                editing: false,
                pageType: 1, // 1：授信策略，2：详情
                selectCompany: {}, // 选中行的客户数据
                tacticsStatus: true,
                row: {}
            };
        },
        methods: {
            // 编辑中，授信策略/详情，当前行数据
            onEdit(editing, pageType, row) {
                this.editing = editing;
                this.pageType = pageType;
                this.row = row
            },
            onDetailData(data) {
                this.selectCompany = data;
            },
            // 子组件过来的，授信策略是否新增或修改
            TacticsIsAdd(flag) {
                this.tacticsStatus = flag;
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
