<template>
    <div>
        <Main v-if="!editing" @edit="onEdit"></Main>
        <!--模板配置-->
        <FormWork
            v-else-if="editing"
            @edit="onEdit"
        />
    </div>
</template>
<script type="text/jsx">
    import Main from './Main';
    import FormWork from './FormWork';

    export default {
        name: 'Model',
        components: {Main, FormWork},
        data() {
            return {
                editing: false
            };
        },
        methods: {
            // 编辑中(详情)，行数据
            onEdit(editing, row) {
                this.editing = editing;
            }
        }

    };
</script>

