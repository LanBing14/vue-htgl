<template>
    <div>
        <Main v-if="!editing" :typeOptions="typeOptions" @edit="onEdit"></Main>
        <CheckIn
            v-if="editing && pageType === 1"
            ref="checkIn"
            :id="row.id"
            :row="row"
            :typeOptions="typeOptions"
            @edit="onEdit"
        ></CheckIn>
        <!-- <Create
            v-if="editing && pageType === 2"
            ref="create"
            :id="row.id"
            :typeOptions="typeOptions"
            @edit="onEdit"
        ></Create> -->
        <!--详情-->
        <Detail
            v-if="editing && pageType === 3"
            :id="row.id"
            @edit="onEdit"
        />
    </div>
</template>
<script type="text/jsx">
    import Main from './Main';
    import CheckIn from './CheckIn';
    import Create from './Create';
    import Detail from './Detail';
    import {
        Api_CollectionOverdueType
    } from '@/api/creditManagement/creditCollection/overdueCollection';

    export default {
        name: 'OverdueCollection',
        components: {
            Main,
            Detail,
            CheckIn,
            Create
        },
        data() {
            const {id} = this.$route.query
            const t = id ? 3 : 1
            const e = !!id
            return {
                typeOptions: [],
                editing: e,
                pageType: t, // 1、逾期催收登记，2、生成催收函，3、详情
                row: {
                    id
                } // 当前行数据
            };
        },
        created() {
            Api_CollectionOverdueType().then(res => {
                this.typeOptions = res;
            });
        },
        methods: {
            // 编辑中，页面标识，行数据
            onEdit(editing, pageType, row) {
                this.editing = editing;
                this.pageType = pageType
                this.row = row
            }
        }

    };
</script>

