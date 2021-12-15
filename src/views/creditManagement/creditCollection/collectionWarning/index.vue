<template>
    <div>
        <Main v-if="!editing" @edit="onEdit"></Main>
        <CheckIn
            v-if="editing && pageType === 1"
            ref="checkIn"
            :selectData="row"
            :typeOptions="typeOptions"
            @edit="onEdit"
        />
        <!--详情-->
        <Detail
            v-else-if="editing && pageType === 2"
            :typeOptions="typeOptions"
            :id="row.id"
            @edit="onEdit"
        />
    </div>
</template>
<script type="text/jsx">
    import Main from './Main';
    import Detail from './Detail';
    import CheckIn from "./CheckIn";

    import {
        Api_CollectionWarningType
    } from "@/api/creditManagement/creditCollection/collectionWarning";

    export default {
        name: 'CollectionWarning',
        components: {Main, Detail, CheckIn},
        data() {
            const {id} = this.$route.query
            const t = id ? 2 : 1
            const e = !!id
            return {
                typeOptions: [],
                editing: e,
                pageType: t, // 1、逾期催收登记，2、详情
                row: {
                    id
                } // 当前行数据
            };
        },
        created() {
            Api_CollectionWarningType().then(res => {
                this.typeOptions = res;
            });
        },
        methods: {
            // 编辑中，页面标识，行数据
            onEdit(editing, pageType, row) {
                this.editing = editing;
                this.pageType = pageType;
                this.row = row;
            }
        }

    };
</script>

