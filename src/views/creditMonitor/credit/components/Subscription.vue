<template>
    <Dialog ref="drawer" title="舆情订阅" class="size-btn-change" :visible.sync="visible" width="500px" :onlyClose="true">
        <div slot="title">
            <span style="font-size: 18px">舆情订阅</span>
            <span style="color: #b1b4bb">功能试用期间，每个用户可免费订阅5家企业</span>
        </div>
        <el-form ref="searchForm" :model="listQuery" :inline="true">
            <el-form-item>
                <!--<el-input
                    v-model="listQuery.companyName"
                    placeholder="请输入企业名称关键词"
                    class="filter-item"
                />-->
                <el-select
                    v-model="listQuery.companyId"
                    placeholder="请输入企业全称"
                    filterable
                    remote
                    size="mini"
                    class="changHeight"
                    style="width: 100%"
                    reserve-keyword
                    :remote-method="querySearchAsync"
                    :loading="loading"
                    @change="searchObj"
                >
                    <el-option
                        v-for="item in companyNameOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="btns" id="upload-btn-size">
                <el-button class="filter-item" size="mini" type="primary" @click="handleFilter">添加订阅</el-button>
            </el-form-item>
        </el-form>
        <TableWrapper ref="child" :fetchDataFn="Api_GetSubscribeList" :query="listQuery" :columns="tableCol"/>
    </Dialog>
</template>

<script type="text/jsx">
    import { Api_SearchCompany } from "@/api/creditManagement/customerProfile/customerManagement.js";
    import {
        Api_GetSubscribeList,
        Api_GetSubscribeAdd,
        Api_GetSubscribeDle
    } from "@/api/creditManagement/monitoring/monitoring"

    export default {
        name: "Subscription",
        data() {
            return {
                Api_GetSubscribeList,
                visible: false,
                loading: false,
                listQuery: {
                    companyName: '',
                    companyId: ''
                },
                companyNameOptions: [],
                tableCol: [{
                    key: 'companyName',
                    label: '订阅企业名称'
                }, {
                    key: '',
                    label: '操作',
                    render: (h, data, row) => {
                        return <span style="color: #4b9df3;cursor: pointer"
                                     onClick={this.delSubscribe.bind(this, row)}>删除</span>
                    }
                }]
            }
        },
        methods: {
            open() {
                this.visible = true;
                this.$nextTick(() => {
                    this.getList();
                });
            },
            getList() {
                this.$refs.child.fetchData();
            },
            handleFilter() {
                Api_GetSubscribeAdd(this.listQuery).then(res => {
                    this.$message.success(res);
                    this.$nextTick(() => {
                        this.getList();
                    });
                }).catch(res => {
                    this.$message.error(res)
                });
            },
            delSubscribe(row) {
                Api_GetSubscribeDle(row.id).then(res => {
                    this.$message.success(res);
                    this.$nextTick(() => {
                        this.getList();
                    });
                }).catch(res => {
                    this.$message.error(res)
                });
            },
            // 搜索企业
            querySearchAsync(queryString, cd) {
                if (queryString !== "") {
                    this.loading = true;
                    Api_SearchCompany({companyName: queryString}).then(res => {
                        this.loading = false;
                        this.companyNameOptions = res.returnData;
                        for (let i = 0; i < this.companyNameOptions.length; i++) {
                            this.companyNameOptions[i].value = this.companyNameOptions[i].name;
                        }
                        this.$nextTick(() => {
                            cd && cd();
                        });
                    });
                } else {
                    this.companyNameOptions = [];
                }
            },
            searchObj(value) {
                for (let i = 0; i < this.companyNameOptions.length; i++) {
                    if (value === this.companyNameOptions[i].id) {
                        this.listQuery.companyName = this.companyNameOptions[i].name
                    }
                }
            }
        }
    }
</script>

<style  lang="scss">
.changHeight{
    .el-input--mini .el-input__inner{
        height: 30px;
    }
}
</style>
