<template>
    <div>
        <Main v-if="!editing" @edit="onEdit"></Main>
        <!--详情-->
        <Detail
            v-else-if="editing"
            ref="refCreateUpdateModel"
            :select-data="selectData"
            @edit="onEdit"
        />
    </div>
</template>
<script type="text/jsx">
    import Main from './Main';
    import Detail from './Detail';

    export default {
        name: 'Model',
        components: {Main, Detail},
        data() {
            return {
                modelStatus: '', // 模态框标题
                selectData: undefined, // 选择的数据
                editing: false
            };
        },
        methods: {
            // 编辑中(详情)，行数据
            onEdit(editing, row) {
                this.editing = editing;
                this.selectData = row
            }
        }

    };
</script>

