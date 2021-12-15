<template>
    <Dialog ref="drawer" title="查看地址" :visible.sync="visible" onlyClose width="600px" :close="closeDialog">
        <el-form v-model="rowData" label-width="80px" class="choose-dialog-container" style="padding: 15px 0 10px">
            <el-form-item label="姓名">{{rowData.name}}</el-form-item>
            <el-form-item label="手机号">{{rowData.phone}}</el-form-item>
            <el-form-item label="地址">{{rowData.address}}</el-form-item>
        </el-form>
    </Dialog>
</template>

<script>
export default {
    name: "ViewAddress",
    data() {
        return { visible: false, rowData: {} };
    },
    methods: {
        open(_r) {
            this.rowData = _r;
            this.visible = true;
        },
        closeDialog() {
            this.visible = false;
        }
    }
};
</script>

<style>
</style>