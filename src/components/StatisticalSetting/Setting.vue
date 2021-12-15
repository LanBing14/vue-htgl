<template>
    <Dialog :visible.sync="visible" :on-ok="onSetupOk" title="自定义设置" width="500px" @close="closeDialog">
        <el-form ref="searchForm" :model="form" :inline="true">
            <el-form-item prop="contractInfo">
                <el-select
                    v-model="form.range"
                    placeholder="请选择统计范围"
                    class="filter-item"
                    @keyup.enter.native="handleFilter"
                >
                    <el-option label="不限" :value="1"></el-option>
                    <el-option label="本部门及下属部门" :value="2"></el-option>
                    <el-option label="本部门" :value="3"></el-option>
                    <el-option label="我负责的" :value="4"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <el-table ref="table" :data="tableData" row-key="id">
            <el-table-column width="80px" align="center">
                <template slot-scope="scope">
                    <div class="sort-item">
                        <i class="iconfont icon-menu"></i>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="统计项名称"></el-table-column>
            <el-table-column prop="valid" label="显示/隐藏" width="90px" align="center">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.valid"></el-switch>
                </template>
            </el-table-column>
        </el-table>
    </Dialog>
</template>

<script>
import Sortable from "sortablejs";

export default {
    name: "Setting",
    props: {
        editFn: { type: Function, default: () => null },
        saveFn: { type: Function, default: () => null },
        getQuery: { type: Object, default: () => ({}) }
    },
    data() {
        return {
            form: { range: 1 },
            visible: false,
            sortIns: null,
            tableData: [],
            version: null
        };
    },
    methods: {
        closeDialog() {
            this.visible = false;
        },
        // 打开设置
        setup() {
            this.visible = true;
            this.$nextTick(() => {
                const body = this.$refs.table.$el.querySelector(".el-table__body-wrapper tbody");
                this.sortIns = new Sortable(body, {
                    handle: ".sort-item",
                    onUpdate: e => {
                        const newIndex = e.newIndex;
                        const oldIndex = e.oldIndex;
                        const nItem = this.tableData.splice(oldIndex, 1);
                        this.tableData.splice(newIndex, 0, nItem[0]);
                    }
                });

                this.editFn(this.getQuery).then(res => {
                    this.tableData = res.modelInfos;
                    this.form.range = res.range;
                    this.version = res.version;
                });
            });
        },
        handleFilter() {},
        // 保存设置
        onSetupOk() {
            
            const submitData = JSON.parse(JSON.stringify(this.tableData));
            for (let i = 0; i < submitData.length; i++) {
                submitData[i].sequence = i + 1;
            }
            const loading = this.$openLoading();
            this.saveFn(this.getQuery, { modelInfos: submitData, range: this.form.range, version: this.version })
                .then(res => {
                    loading.close();
                    this.$message.success(res);
                    this.$emit("getData");
                    this.visible = false;
                })
                .catch(res => {
                    loading.close();
                    this.$message.error(res);
                    this.visible = false;
                });
        }
    }
};
</script>

<style scoped lang="scss">
</style>
