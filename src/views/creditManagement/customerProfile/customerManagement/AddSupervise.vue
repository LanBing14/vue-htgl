<template>
    <Dialog ref="drawer" title="列入监测" :visible.sync="visible" :btns="drawerBtns" width="500px" :close="closeDialog">
        <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="企业分组" prop="groupIds" :rules="$createRules({required:true,msg:'企业分组'})">
                <el-select v-model="form.groupIds" multiple placeholder="请选择企业分组" style="width: 100%">
                    <el-option v-for="item in groupIdOptions" :key="item.id" :label="item.group_name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script>
    import { Api_AddMonitorInfo } from "@/api/creditManagement/monitoring/monitoring";
import {
    Api_GetCustomerGroup,
    Api_AddSuperviseBatch
} from "@/api/creditManagement/customerProfile/customerManagement.js";
export default {
    name: "AddSupervise",
    data() {
        return {
            visible: false,
            form: {
                companyName: "",
                groupIds: [],
                companyId: ""
            },
            groupIdOptions: [],
            drawerBtns: [
                {
                    text: "确定",
                    type: "primary",
                    click: () => {
                        this.$refs["form"].validate(valid => {
                            if (valid) {
                                this.$confirm("确定列入监测吗?", "提示", {
                                    confirmButtonText: "确定",
                                    cancelButtonText: "取消",
                                    type: "warning"
                                })
                                    .then(() => {
                                        const loading = this.$openLoading();
                                        Api_AddMonitorInfo(this.form)
                                            .then(() => {
                                                loading.close();
                                                this.$message.success("列入成功！");
                                                this.visible = false;
                                                this.$nextTick(() => {
                                                    this.$refs["form"].resetFields();
                                                });
                                                this.$emit("getList");
                                            })
                                            .catch(res => {
                                                loading.close();
                                                this.$message.error(res);
                                            });
                                    })
                                    .catch(() => {});
                            }
                        });
                    }
                },
                {
                    text: "取消",
                    click: () => {
                        this.visible = false;
                        this.$nextTick(() => {
                            this.$refs["form"].resetFields();
                        });
                    }
                }
            ]
        };
    },
    methods: {
        open(row) {
            Api_GetCustomerGroup().then(res => {
                this.groupIdOptions = res;
                this.$nextTick(() => {
                    const _groupIds = row.group_id.split(",");
                    for (let i = 0; i < _groupIds.length; i++) {
                        this.form.groupIds.push(_groupIds[i]);
                    }
                });
            });
            this.form.companyId = row.company_id;
            this.form.companyName = row.company_name;
            this.visible = true;
            // this.$nextTick(() => {
            //     this.$refs["form"].resetFields();
            // });
        },
        closeDialog() {
            this.visible = false;
        }
        // setGroupName() {
        //     this.$nextTick(() => {
        //         for (let i = 0; i < this.groupIdOptions.length; i++) {
        //             if (this.groupIdOptions[i].id === this.form.groupId) {
        //                 this.form.groupName = this.groupIdOptions[i].name;
        //                 break;
        //             }
        //         }
        //     });
        // }
    }
};
</script>

<style>
</style>
