<template>
    <Dialog ref="drawer" title="编辑分组" :visible.sync="visible" :btns="drawerBtns" width="500px" :close="closeDialog" class="size-btn-change">
        <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="企业分组" prop="groupIds">
                <el-select v-model="form.groupIds" multiple placeholder="请选择企业分组" style="width: 100%">
                    <el-option v-for="item in groupIdsOptions" :key="item.id" :label="item.group_name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script>
import { Api_QuickEditGroup, Api_GetCustomerGroup } from "@/api/creditManagement/customerProfile/customerManagement.js";

export default {
    name: "QuickEditGroup",
    data() {
        return {
            visible: false,
            rowData: {},
            form: {
                groupIds: [],
                isBloc: false
            },
            groupIdsOptions: [],
            drawerBtns: [
                {
                    text: "确定",
                    type: "primary",
                    click: () => {
                        this.form.isBloc = this.form.groupIds.indexOf("c4608ef8-8007-43f5-9a2d-90daa57f1e50") !== -1;
                        const loading = this.$openLoading();
                        Api_QuickEditGroup(this.rowData.id, this.form)
                            .then(() => {
                                loading.close();
                                this.$message.success("修改成功！");
                                this.visible = false;
                                this.$emit("getList");
                            })
                            .catch(res => {
                                loading.close();
                                this.$message.error(res);
                            });
                    }
                },
                {
                    text: "取消",
                    click: () => {
                        this.visible = false;
                    }
                }
            ]
        };
    },
    methods: {
        open(_row) {
            this.rowData = _row;
            this.form.groupIds = [];
            this.visible = true;
            Api_GetCustomerGroup().then(res => {
                this.groupIdsOptions = res;
                this.$nextTick(() => {
                    if (_row.group_id){
                        const _groupIds = _row.group_id.split(",");
                        for (let i = 0; i < _groupIds.length; i++) {
                            this.form.groupIds.push(_groupIds[i]);
                        }
                    }
                });
            });
        },
        closeDialog() {
            this.visible = false;
        }
    }
};
</script>

<style>
</style>
