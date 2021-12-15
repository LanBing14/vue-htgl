<template>
    <Dialog
        ref="drawer"
        title="移出详情"
        :visible.sync="visible"
        onlyClose
        width="500px"
    >
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="客户编码">{{ customerNo }}</el-form-item>
            <el-form-item label="客户名称">{{ companyName }}</el-form-item>
            <el-form-item label="移出原因">
                <el-input disabled v-model="form.dealRemark" type="textarea" placeholder="请输入移出原因"/>
            </el-form-item>
            <el-form-item label="客户状态">{{ form.status }}</el-form-item>
            <el-form-item label="申请时间">{{ form.applyDate | dateFormat('yyyy-MM-dd') }}</el-form-item>
            <el-form-item v-show="form.removeDate" label="移出时间">{{ form.removeDate | dateFormat('yyyy-MM-dd') }}</el-form-item>
        </el-form>
    </Dialog>
</template>

<script>
    import {
        Api_GetCustomerDetail
    } from "@/api/creditManagement/customerProfile/customerBad.js";
    import { dateFormat } from "@/utils/index";

    export default {
        name: "RemoveDetail",
        filters: { dateFormat },
        data() {
            return {
                visible: false,
                id: '',
                customerNo: '',
                companyName: '',
                form: {
                    dealRemark: '',
                    applyDate: '',
                    removeDate: '',
                    status: ''
                }
            }
        },
        methods: {
            open(row) {
                this.id = row.id;
                this.customerNo = row.customerNo;
                this.companyName = row.companyName;
                this.visible = true;
                Api_GetCustomerDetail(this.id).then(res => {
                    this.form.dealRemark = res.dealRemark;
                    this.form.applyDate = res.applyDate;
                    this.form.removeDate = res.deleteDate;
                    if (res.status === '0') {
                        this.form.status = '不良待审';
                    }
                    if (res.status === '1') {
                        this.form.status = '不良客户';
                    }
                    if (res.status === '2') {
                        this.form.status = '移出待审';
                    }
                    if (res.status === '3') {
                        this.form.status = '已移出';
                    }
                    if (res.status === '4') {
                        this.form.status = '列入退回';
                    }
                }).catch(res => {
                    console.log(res)
                })
            },
            closeDialog() {
                this.visible = false;
            }
        }
    }
</script>

<style scoped>

</style>
