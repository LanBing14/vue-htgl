<template>
    <el-table :data="data">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="key1" label="标题"></el-table-column>
        <el-table-column prop="key1" label="消息类型"></el-table-column>
        <el-table-column prop="key1" label="时间"></el-table-column>
    </el-table>
</template>

<script>
    export default {
        name: "ExpiredContract",
        data() {
            return {
                data: []
            }
        }
    }
</script>

<style scoped>

</style>
