<template>
    <Dialog
        append-to-body
        modal-append-to-body
        ref="drawer"
        title="添加监测"
        :visible.sync="visible"
        :onOk="sureAdd"
        @close="onclose"
        class="size-btn-change"
        width="500px"
    >
        <el-form ref="form" :model="form" label-width="80px" v-loading="loading">
            <el-form-item label="企业名称">
                <el-input v-model="form.companyName" disabled></el-input>
            </el-form-item>
            <el-form-item label="企业分组" prop="groupIds" :rules="$createRules({msg:'企业分组',required:true})">
                <el-select v-model="form.groupIds" multiple placeholder="请选择企业分组" style="width: 100%">
                    <el-option
                        v-for="item in groupIdsOptionsAdd"
                        :key="item.id"
                        :label="item.group_name"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script>
import { Api_AddMonitorInfo } from "@/api/creditManagement/monitoring/monitoring";
import { Api_GetCustomerGroup } from "@/api/creditManagement/customerProfile/customerManagement.js";

export default {
    name: "AddSuper",
    data() {
        return {
            visible: false,
            form: {
                companyName: null,
                companyId: null,
                groupIds: []
            },
            groupIdsOptionsAdd: [],
            loading: false
        };
    },
    methods: {
        open(_d, _s) {
            this.visible = true;
            this.loading = true;
            Api_GetCustomerGroup()
                .then(res => {
                    this.loading = false;
                    this.groupIdsOptionsAdd = res;
                    this.$nextTick(() => {
                        this.form.groupIds = _d.options.map(item => item.id);
                        this.form.companyId = _d.id;
                        this.form.companyName = _d.name;
                    });
                })
                .catch(res => {
                    this.loading = false;
                });
        },
        sureAdd() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    const loading = this.$openLoading();
                    Api_AddMonitorInfo(this.form)
                        .then(res => {
                            this.$message.success(res);
                            this.visible = false;
                            this.$emit("getList");
                            loading.close();
                        })
                        .catch(res => {
                            this.$message.error(res);
                            loading.close();
                        });
                }
            });
        },
        onclose() {
            this.visible = false;
        }
    }
};
</script>

<style>
</style>
