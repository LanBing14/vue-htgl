<template>
    <Dialog ref="drawer" title="关联成员" :visible.sync="visible" :btns="drawerBtns" width="500px" :close="closeDialog">
        <el-form
            ref="searchForm"
            :model="listQuery"
            :inline="true"
            class="demo-form-inline searchForm-wrap"
            @submit.native.prevent
        >
            <el-form-item>
                <el-input
                    v-model="listQuery.companyName"
                    placeholder="请输入企业名称"
                    class="filter-item"
                    @keyup.enter.native="handleFilter"
                />
            </el-form-item>
            <el-form-item class="btns">
                <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
                <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset('searchForm')">重置</el-button>
            </el-form-item>
        </el-form>
        <div class="member-container" v-for="(item, index) in listData" :key="index">
            <div class="member-content">
                <p>{{ item.company_name }}</p>
                <el-row :gutter="20" class="member-content-font">
                    <el-col :span="12">法定代表人: {{ item.oper_name }}</el-col>
                    <el-col :span="12">企业状态: {{ item.status }}</el-col>
                </el-row>
            </div>
            <div class="member-btn">
                <el-button type="primary" @click="addMember(item)" :disabled="item.is_gl==='1'">
                    <i class="el-icon-plus"></i>
                    添加
                </el-button>
            </div>
        </div>
        <div v-if="paginationTotal===0" class="empty-data-tip">没有结果，请输入企业名称搜索</div>
        <el-pagination
            v-if="paginationTotal!==0"
            class="pagination"
            :page-size="5"
            background
            layout="prev, pager, next"
            :total="paginationTotal"
            @current-change="getList"
        ></el-pagination>
    </Dialog>
</template>

<script>
import { Api_SearchGroupsMembers, Api_RelateGroup } from "@/api/creditManagement/customerProfile/customerManagement.js";

export default {
    name: "AssociatedMember",
    /* eslint-disable */
    props: ["rowData"],
    /* eslint-enable */
    data() {
        return {
            visible: false,
            listRow: {},
            listQuery: {
                companyName: ""
            },
            paginationTotal: 0,
            listData: [],
            drawerBtns: [
                {
                    text: "返回",
                    click: () => {
                        this.visible = false;
                    }
                }
            ]
        };
    },
    methods: {
        open(_listRow) {
            this.listRow = _listRow;
            this.paginationTotal = 0;
            this.listQuery.companyName = "";
            this.listData = [];
            this.visible = true;
            this.getList(1);
        },
        closeDialog() {
            this.visible = false;
        },
        // 根据查询条件获取数据
        handleFilter() {
            this.getList(1);
        },
        // 重置查询条件
        handleReset(formName) {
            this.$refs[formName].resetFields();
            this.getList();
        },
        // 重置form表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        getList(_currentPage) {
            Api_SearchGroupsMembers(this.listRow.id, {
                currentPage: _currentPage,
                pageSize: 5,
                companyName: this.listQuery.companyName
            }).then(res => {
                this.listData = res.data;
                this.paginationTotal = res.totalRecordNumber;
            });
        },
        addMember(_row) {
            const loading = this.$openLoading();
            Api_RelateGroup(_row.id, { pid: this.rowData.id })
                .then(() => {
                    loading.close();
                    this.$message.success("添加关联成功！");
                    this.getList(1);
                    this.$emit("getList");
                })
                .catch(res => {
                    loading.close();
                    this.$message.error(res);
                });
        }
    }
};
</script>

<style lang="scss" scoped>
.member-container {
    margin-top: 10px;
    display: flex;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
}

.member-content {
    flex: 1;
    padding: 15px 0 15px 20px;
    font-size: 14px;

    p {
        color: #333;
        margin-bottom: 13px;
    }

    .member-content-font {
        color: #999;
    }
}

.member-btn {
    flex: 0 120px;
    padding: 0 20px;
    text-align: center;
    align-self: center;
}

.pagination {
    margin-top: 15px;
    text-align: right;
}

.empty-data-tip {
    text-align: center;
    padding: 20px 0 10px;
    color: #999;
}
</style>
