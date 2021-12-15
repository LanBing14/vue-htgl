<template>
    <div>
        <Main v-if="!editing" @edit="onEdit"></Main>
        <!--新增或修改-->
        <CreateUpdate
            v-else-if="editing && flag"
            ref="refCreateUpdateModel"
            :model-status="modelStatus"
            :select-data="selectData"
            @edit="onEdit"
        />
        <Detail
            v-else-if="editing && !flag"
            ref="ref_Detail"
            :select-data="selectData"
            @edit="onEdit"
        ></Detail>
        <CopyModel ref="refCopyModel" :select-data="selectData"/>
    </div>
</template>
<script type="text/jsx">
    import Main from './Main';
    import CreateUpdate from './CreateUpdate';
    import CopyModel from './CopyModel';
    import Detail from './Detail';

    export default {
        name: 'Model',
        components: {Main, CreateUpdate, CopyModel, Detail},
        data() {
            return {
                modelStatus: '', // 模态框标题
                selectData: undefined, // 选择的数据
                editing: false,
                flag: false
            };
        },
        methods: {
            // 编辑中，新增或修改
            onEdit(editing, modelStatus, row, flag) {
                this.editing = editing;
                this.modelStatus = modelStatus;
                this.selectData = row;
                this.flag = flag
            }
        }

    };
</script>

<style scoped lang="scss">
    @import '~@/styles/variables.scss';

    /deep/ .search-p {
        .el-form-item__label {
            padding-right: 2px;
        }
    }

    .filterInput {
        margin-bottom: 10px;
    }

    .left-right-wrap {
        display: flex;
        height: 100%;
    }

    .tree-minheight {
        min-height: 100%;
        background-color: $bgGreey;
    }

    .filterTree {
        background-color: transparent;
    }

    .page-content .page-content-body {
        min-height: calc(100% - 70px);
    }

    /deep/ .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content, /deep/ .el-tree-node__content:hover {
        background-color: #ddecf4;
    }
</style>
