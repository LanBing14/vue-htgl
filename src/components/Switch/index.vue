<template>
<el-switch
    v-model="row.enable"
    :active-color="activeColor"
    :inactive-color="inactiveColor"
    @change="change(row)"
/>
</template>

<script>
    export default {
        props: {
            row: {
                type: Object,
                default: () => {
                }
            },
            activeColor: {
                type: String,
                default() {
                    return '#13ce66'
                }
            },
            inactiveColor: {
                type: String,
                default() {
                    return '#ff4949'
                }
            },
            change: Function
        }
    }
</script>

<style scoped>

</style>
