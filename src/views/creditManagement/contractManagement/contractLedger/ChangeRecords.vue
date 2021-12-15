<template>
    <Dialog ref="drawer" title="变更记录" :visible.sync="visible" onlyClose width="700px" :close="closeDialog">
        <TableWrapper ref="child" :data="tableData" :query="{}" :columns="tableCol" />
    </Dialog>
</template>

<script>
import { Api_changeRecords, Api_delApply } from "@/api/creditManagement/contractManagement/orders.js";

export default {
    name: "ChangeRecords",
    data() {
        return {
            visible: false,
            rowData: {},
            tableData: [],
            tableCol: [
                { label: "业务编号", key: "applyCode" },
                {
                    label: "类型",
                    key: "applyType",
                    render: (h, data, row) => {
                        return data === "2"
                            ? "合同变更"
                            : data === "3"
                            ? "履约完成"
                            : data === "4"
                            ? "合同取消"
                            : "创建";
                    }
                },
                {
                    label: "申请时间",
                    key: "createDate",
                    render: (h, data, row) => {
                        return data ? data.substr(0, 10) : "-";
                    }
                },
                {
                    label: "当前状态",
                    key: "applyState",
                    render: (h, data, row) => {
                        return data === "0"
                            ? "驳回"
                            : data === "1"
                            ? "待审核"
                            : data === "2"
                            ? "已签批/有效"
                            : data === "3"
                            ? "无效"
                            : data === "9"
                            ? "待提交"
                            : "-";
                    }
                }
                // {
                //     label: "操作",
                //     key: null,
                //     render: (h, data, row) => {
                //         return row.applyState === "9" ? (
                //             <button-dropdown
                //                 data={[
                //                     {
                //                         text: "编辑",
                //                         click: this.editChange.bind(this, row)
                //                     },
                //                     {
                //                         text: "删除",
                //                         click: this.deleteChange.bind(this, row)
                //                     }
                //                 ]}
                //             />
                //         ) : (
                //             "-"
                //         );
                //     }
                // }
            ]
        };
    },
    methods: {
        open(row) {
            this.rowData = row;
            
            this.visible = true;
            this.rowId = row.id;
            this.$nextTick(() => {
                this.getData();
            });
        },
        getData(row) {
            Api_changeRecords({ id: this.rowId }).then(res => {
                this.tableData = res;
            });
        },
        editChange(row) {
            if (row.applyType === "2") {
                this.$emit("contractChangeChange", this.rowData);
            } else if (row.applyType === "3") {
                this.$emit("contractChangePromise", this.rowData);
            } else if (row.applyType === "4") {
                this.$emit("contractChangeCancel", this.rowData);
            }
            this.visible = false;
        },
        deleteChange(row) {
            const loading = this.$openLoading();
            Api_delApply(row.id)
                .then(res => {
                    this.$message.success({
                        dangerouslyUseHTMLString: true,
                        message: res,
                    });
                    this.getData();
                    loading.close();
                })
                .catch(res => {
                    this.$message.error(res);
                    loading.close();
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
