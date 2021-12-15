<template>
    <div>
        <Main v-if="isShow" @onChange="onChange"></Main>
        <PublicOpinion v-if="!isShow" @onChange="onChange" :rowId="id" :companyName="name"></PublicOpinion>
    </div>
</template>

<script>
    import Main from "./components/Main";
    import PublicOpinion from "./components/PublicOpinion";

    export default {
        name: "PublicOpinionDynamics",
        components: {Main, PublicOpinion},
        data() {
            return {
                isShow: true,
                id: '',
                name: ''
            }
        },
        mounted() {},
        methods: {
            onChange(isShow, row) {
                this.isShow = isShow;
                if (row) {
                    this.name = row.newsBase.companyName;
                    this.id = row.newsBase.companyId
                }
            }
        }
    };
</script>

<style>
</style>
