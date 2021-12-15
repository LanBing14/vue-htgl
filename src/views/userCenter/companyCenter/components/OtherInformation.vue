<template>
    <div class="credit-tab-content">
        <h4 class="small-title">
            联络信息
            <el-button size="small" type="primary" @click="addContacts">新增</el-button>
        </h4>
        <TableWrapper ref="ref_tableContacts" :fetchDataFn="Api_getContacts" :query="{companyId:id}"
                      :columns="colContacts"/>
        <h4 class="small-title">
            银行账户
            <el-button size="small" type="primary" @click="addBankAccount">新增</el-button>
        </h4>
        <TableWrapper
            ref="ref_tableBankAccount"
            :fetchDataFn="Api_getBankAccount"
            :query="{companyId:id}"
            :columns="colBankAccount"
        />
        <h4 class="small-title">
            发票抬头
            <el-button size="small" type="primary" @click="addBill">新增</el-button>
        </h4>
        <TableWrapper
            ref="ref_tableBill"
            :fetchDataFn="Api_InvoiceGetList"
            :query="{companyId:id}"
            :columns="colBill"
        />
        <h4 class="small-title">
            收货地址
            <el-button size="small" type="primary" @click="addAdress">新增</el-button>
        </h4>
        <TableWrapper
            ref="ref_tableAdress"
            :fetchDataFn="Api_ReceiverGetList"
            :query="{companyId:id}"
            :columns="colAdress"
        />
        <NewContacts ref="ref_NewContacts" @getList1="getList1"></NewContacts>
        <NewBankAccount ref="ref_NewBankAccount" @getList2="getList2"></NewBankAccount>
        <NewBill ref="ref_NewBill" @getList="getList3"></NewBill>
        <NewAdress ref="ref_NewAdress" @getList="getList4"></NewAdress>
    </div>
</template>

<script type="text/jsx">
    import {
        Api_getContacts,
        Api_getBankAccount,
        Api_deleteContacts,
        Api_deleteBankAcount,
        Api_InvoiceGetList,
        Api_InvoiceDelete,
        Api_ReceiverGetList,
        Api_ReceiverDelete
    } from "@/api/creditManagement/customerProfile/customerManagemCustomer/OtherInformation.js";
    import NewContacts from "./OtherComponents/NewContacts";
    import NewBankAccount from "./OtherComponents/NewBankAccount";
    import NewBill from "./OtherComponents/NewBill";
    import NewAdress from "./OtherComponents/NewAdress";

    export default {
        name: "OtherInformation",
        components: {NewContacts, NewBankAccount, NewBill, NewAdress},
        props: {
            id: String, // 客户id，用于查询详情数据
            companyName: String // 客户名称
        },
        data() {
            return {
                curBillData: {}, // 当前选中的发票抬头数据
                colContacts: [
                    {label: "联系人姓名", key: "name"},
                    {label: "部门", key: "deptName"},
                    {label: "职务", key: "job"},
                    {label: "手机号码", key: "phone"},
                    {label: "办公电话", key: "officePhone"},
                    {label: "电子邮箱", key: "email"},
                    {
                        label: "操作",
                        key: null,
                        render: (h, data, row) => {
                            return (
                                <button-dropdown
                                    data={[
                                        {text: "编辑", click: this.editContacts.bind(this, row)},
                                        {text: "删除", click: this.delContacts.bind(this, row)}
                                    ]}
                                />
                            );
                        }
                    }
                ],
                colBankAccount: [
                    {label: "开户银行", key: "bankName"},
                    {label: "银行账户", key: "bankAccount"},
                    {label: "电话号码", key: "phone"},
                    {label: "单位地址", key: "unitAddress"},
                    {
                        label: "操作",
                        key: null,
                        render: (h, data, row) => {
                            return (
                                <button-dropdown
                                    data={[
                                        {text: "编辑", click: this.editBankAccount.bind(this, row)},
                                        {text: "删除", click: this.delBankAccount.bind(this, row)}
                                    ]}
                                />
                            );
                        }
                    }
                ],
                colBill: [
                    {label: "发票抬头", key: "invoice"},
                    {label: "税号", key: "taxId"},
                    {label: "开户银行", key: "bankName"},
                    {label: "银行账户", key: "bankAccount"},
                    {label: "电话号码", key: "phone"},
                    {label: "单位地址", key: "unitAddress"},
                    {
                        label: "操作",
                        key: null,
                        render: (h, data, row) => {
                            return (
                                <button-dropdown
                                    data={[
                                        {text: "编辑", click: this.editBill.bind(this, row)},
                                        {text: "删除", click: this.delBill.bind(this, row)}
                                    ]}
                                />
                            );
                        }
                    }
                ],
                colAdress: [
                    {label: "收货人", key: "receiverName"},
                    {
                        label: "所在地区", key: "bankAccount",
                        render: (h, data, row) => {
                            return row.province + row.city + row.county
                        }
                    },
                    {label: "详细地址", key: "detailAddress"},
                    {label: "电话/手机", key: "receiverPhone"},
                    {
                        label: "操作",
                        key: null,
                        render: (h, data, row) => {
                            return (
                                <button-dropdown
                                    data={[
                                        {text: "编辑", click: this.editAdress.bind(this, row)},
                                        {text: "删除", click: this.delAdress.bind(this, row)}
                                    ]}
                                />
                            );
                        }
                    }
                ]
            };
        },
        mounted() {
            this.getList1();
            this.getList2();
            this.getList3();
            this.getList4();
        },
        methods: {
            Api_getContacts,
            Api_getBankAccount,
            Api_InvoiceGetList,
            Api_ReceiverGetList,
            getList1() {
                this.$refs.ref_tableContacts.fetchData();
            },
            getList2() {
                this.$refs.ref_tableBankAccount.fetchData();
            },
            getList3() {
                this.$refs.ref_tableBill.fetchData();
            },
            getList4() {
                this.$refs.ref_tableAdress.fetchData();
            },
            addContacts() {
                this.$refs.ref_NewContacts.open("add", this.id);
            },
            editContacts(_row) {
                this.$refs.ref_NewContacts.open("edit", this.id, _row);
            },
            delContacts(_row) {
                this.$confirm("确定要删除该联系人吗？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    const loading = this.$openLoading();
                    Api_deleteContacts(_row.id)
                        .then(() => {
                            loading.close();
                            this.$message.success("删除成功！");
                            this.getList1();
                        })
                        .catch(res => {
                            loading.close();
                            this.$message.error(res);
                        });
                });
            },
            addBankAccount() {
                this.$refs.ref_NewBankAccount.open("add", this.id);
            },
            editBankAccount(_row) {
                this.$refs.ref_NewBankAccount.open("edit", this.id, _row);
            },
            delBankAccount(_row) {
                this.$confirm("确定要删除该条记录吗？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    const loading = this.$openLoading();
                    Api_deleteBankAcount(_row.id)
                        .then(() => {
                            loading.close();
                            this.$message.success("删除成功！");
                            this.getList2();
                        })
                        .catch(res => {
                            loading.close();
                            this.$message.error(res);
                        });
                });
            },
            addBill() {
                this.$refs.ref_NewBill.open("add", this.id, this.companyName);
            },
            editBill(_row) {
                this.$refs.ref_NewBill.open("edit", this.id, this.companyName, _row);
            },
            delBill(_row) {
                this.$confirm("确定要删除该条记录吗？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    const loading = this.$openLoading();
                    Api_InvoiceDelete(_row.id)
                        .then(() => {
                            loading.close();
                            this.$message.success("删除成功！");
                            this.getList3();
                        })
                        .catch(res => {
                            loading.close();
                            this.$message.error(res);
                        });
                });
            },
            addAdress() {
                this.$refs.ref_NewAdress.open("add", this.id, this.companyName);
            },
            editAdress(_row) {
                this.$refs.ref_NewAdress.open("edit", this.id, this.companyName, _row);
            },
            delAdress(_row) {
                this.$confirm("确定要删除该条记录吗？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    const loading = this.$openLoading();
                    Api_ReceiverDelete(_row.id)
                        .then(() => {
                            loading.close();
                            this.$message.success("删除成功！");
                            this.getList3();
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

<style lang="scss" scoped>
    .small-title {
        position: relative;

        button {
            position: absolute;
            right: 0;
            top: 4px;
        }
    }
</style>
