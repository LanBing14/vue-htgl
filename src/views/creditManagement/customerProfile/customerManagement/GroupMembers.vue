<template>
    <div>
        <div class="page-header">
            <h1 class="page-name">
                <span>集团成员</span>
            </h1>
            <div>
                <el-button @click="goBack">返回</el-button>
            </div>
        </div>
        <div class="page-content">
            <el-form ref="form" label-width="80px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="客户编号">{{ rowData.customer_no }}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="集团名称">{{ rowData.company_name }}</el-form-item>
                    </el-col>
                </el-row>
                <div class="sub-title">
                    集团成员列表
                    <el-button size="small" @click="associatedMember">关联成员</el-button>
                </div>
                <TableWrapper ref="child" :fetchDataFn="Api_GetGroupsMembers" :query="listQuery" :columns="tableCol" />
            </el-form>
        </div>
        <AssociatedMember ref="ref_AssociatedMember" :rowData="rowData" @getList="getList"></AssociatedMember>
    </div>
</template>

<script type="text/jsx">
import AssociatedMember from "./AssociatedMember";
import { Api_GetGroupsMembers, Api_CancelRelateGroup } from "@/api/creditManagement/customerProfile/customerManagement.js";

export default {
    name: "GroupMembers",
    components: { AssociatedMember },
    data() {
        return {
            rowData: {},
            listQuery: { id: "" },
            tableCol: [
                { key: "customerNo", label: "客户编号" },
                { key: "companyName", label: "客户名称" },
                {
                    key: null,
                    label: "操作",
                    render: (h, data, row) => {
                        return (
                            <el-button size="small" onClick={this.disassociate.bind(this, row)} type="danger">
                                解除关联
                            </el-button>
                        );
                    }
                }
            ]
        };
    },
    methods: {
        Api_GetGroupsMembers,
        initPage(_row) {
            this.rowData = _row;
            this.listQuery.id = _row.id;
            this.$nextTick(() => {
                this.getList();
            });
        },
        goBack() {
            this.$emit("hideGroupMembers");
        },
        getList() {
            this.$refs.child.fetchData();
        },
        associatedMember() {
            this.$nextTick(() => {
                this.$refs.ref_AssociatedMember.open(this.rowData);
            });
        },
        disassociate(_row) {
            this.$confirm("确定将该客户移出集团成员列表吗?移出后该客户将不能使用集团授信额度。", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                const loading = this.$openLoading();
                Api_CancelRelateGroup(_row.id)
                    .then(() => {
                        loading.close();
                        this.$message.success("已解除关联！");
                        this.getList();
                    })
                    .catch(res => {
                        loading.close();
                        this.$message.error(res);
                    });
            });
        }
    }
};
</script>

<style scoped>
.alert-title {
    border: 1px solid #ddd;
    color: #606266;
    font-weight: bold !important;
    border-radius: 0;
    margin-top: 20px;
}
</style>
