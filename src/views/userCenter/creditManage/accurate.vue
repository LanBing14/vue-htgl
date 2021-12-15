<template>
<div class="usercenter-container">
    <el-row class="fxb-table-tool">
        <el-form>
            <el-form-item>
                <el-row :gutter="10" type="flex" align="middle">
                    <el-col :span="6">
                        <h3 class="font18 bold">精确添加{{ $route.params.groupType === 0 ? "客户":"供应商" }}</h3>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="24">
                        <el-autocomplete size="small" class="inline-input" :fetch-suggestions="querySearch" placeholder="请输入企业名称" v-model="searchCompany" :trigger-on-focus="false" @select="handleSelect" style="display: inline;"></el-autocomplete>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
    </el-row>

    <el-table ref="attentionTable" class="fxb-table" :data="addList | pagination(pageParams.pageNo,pageParams.pageSize)" v-loading="listLoading" style="width: 100%" row-key="id" :expand-row-keys="expands" @cell-mouse-enter="handelEnter">
        <el-table-column prop="order" label="序号" type="index" :index="indexMethod"></el-table-column>
        <el-table-column prop="companyName" label="企业名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="creditCode" label="统一社会信用代码"></el-table-column>
        <el-table-column prop="legalPerson" label="法定代表人"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column type="expand" width="1">
            <template slot-scope="props">
                <div class="row-tool-panel">
                    <span @click="delAttention(props.row)">
                        <svg-icon icon-class="edit" />删除
                    </span>
                </div>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination class="fxb-page" v-show="pageParams.totalRecords>0" :total="pageParams.totalRecords" :page-size="pageParams.pageSize" :current-page.sync="pageParams.pageNo" @current-change="changeCurrentPage" />

    <el-row class="fxb-table-footer">
        <el-form>
            <el-form-item>
                <el-row :gutter="10" type="flex" align="middle">
                    <el-col :span="2" align="center">
                        <span>添加到</span>
                    </el-col>
                    <el-col :span="22">
                        <el-select v-model="groupId" clearable placeholder="请选择" size="small" style="width: 100%;">
                            <el-option v-for="item in $store.getters.attentionGroup" :key="item.id" :label="item.name" :value="item.id" v-show="item.groupType !== searchParams.groupType">{{ item.name }}
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item>
                <el-row :gutter="10" type="flex" align="middle">
                    <el-col :span="24" align="center">
                        <el-button type="primary" @click="submitAdd()" :loading="submitLoading">确定</el-button>
                        <el-button @click="$router.push('/userCenter/creditManage/attention/' + $route.params.groupType)">取消
                        </el-button>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
    </el-row>

</div>
</template>

<script>
    import {Api_ExactAddAttention, Api_GetAttentionInfo} from "@/api/userCenter/creditManage";
    import {Api_CompanySearch} from "@/api/creditMonitor";
    import {dateFormat} from "@/utils/index";

    export default {
    name: "Attention",
    filters: {
        dateFormat,
        pagination(addList, pageNo, pageSize) {
            const offset = (pageNo - 1) * pageSize; // 当前页第一条的索引
            return offset + pageSize >= addList.length
                ? addList.slice(offset, addList.length)
                : addList.slice(offset, offset + pageSize);
        }
    },
    data() {
        return {
            multipleSelection: [],
            attentionList: [],
            addList: [],
            pageParams: {
                pageNo: 1,
                pageSize: 5,
                totalRecords: 0
            },
            searchParams: {
                companyName: "",
                groupId: "",
                groupType: "",
                pageNo: 1,
                pageSize: 5,
                totalRecords: 0,
                superviseGroupId: ""
            },
            groupId: "",
            listLoading: true,
            submitLoading: false,
            attentionId: "",
            batchSetGroupDialogVisible: false,
            batchSetLoading: false,
            addCompanyDialogVisible: false,
            expands: [],
            searchCompany: "",
            isHover: false
        };
    },
    created: function () {
        this.searchParams.groupType = this.$route.params.groupType;
        this.listLoading = false;
    },
    beforeRouteUpdate(to, from, next) {
        this.searchParams.groupType = to.params.groupType;
        next();
    },
    methods: {
        changeCurrentPage(val) {
            this.pageParams.pageNo = val;
        },
        submitAdd() {
            this.listLoading = true;
            const addData = {
                groupId: this.groupId,
                groupType: this.searchParams.groupType,
                addList: this.addList
            };

            if (this.addList.length === 0) {
                this.listLoading = false;
                this.$message.warning("请选择需要添加的企业");
                return false;
            } else if (!this.groupId) {
                this.listLoading = false;
                this.$message.warning("请选择分组");
                return false;
            } else {
                this.submitLoading = true;
                Api_ExactAddAttention(addData).then(res => {
                    this.listLoading = false;
                    this.submitLoading = false;
                    if (res.stateCode === "1") {
                        this.listLoading = false;
                        this.$message.success("添加成功");
                        this.addList = [];
                        // 添加成功，返回列表页
                        this.$router.push('/userCenter/creditManage/attention/' + this.$route.params.groupType);
                    } else {
                        this.listLoading = false;
                        this.$message.warning("已加入队列，无需重复添加");
                        this.searchCompany = "";
                        return false;
                    }
                });
            }
        },
        // 表格鼠标移入事件
        showDetail() {
            this.isHover = false;
        },
        cellMouseLeave(row, column, cell, event) {
            setTimeout(() => {
                this.expands = [];
            }, 500);
        },
        handelEnter(row, column, cell, event) {
            this.isHover = true;
            this.isClickShow = false;

            const cindex = this.expands.indexOf(row.id);
            if (cindex < 0) {
                this.expands.shift();
                this.expands.push(row.id);

                this.isHover = true;
            }
        },
        // 删除
        delAttention(row) {
            this.addList.splice(row, 1);
            this.pageParams.totalRecords = this.addList.length;
        },
        // 序号
        indexMethod(index) {
            return index + 1;
        },
        // 搜索下拉内关联企业列表
        querySearch(queryString, cb) {
            Api_CompanySearch(queryString).then(res => {
                if (res.stateCode === "50001") {
                    const temp = [];
                    res.data.returnData.forEach(data => {
                        temp.push({
                            value: data.name,
                            id: data.id,
                            companyId: data.id,
                            companyName: data.name,
                            creditCode: data.creditCode,
                            legalPerson: data.operName,
                            address: data.address
                        });
                    });
                    cb(temp);
                }
            });
        },
        handleSelect(item) {
            // 添加企业之前先判断用户是否已经添加关注了
            /* Api_GetAttentionInfo(item.companyId).then(res => {
                if (res.stateCode === "1") {
                    if (res.data && res.data.groups.findIndex(item => item.groupType === this.searchParams.groupType) !== -1) {
                        // 用户已经添加了
                        this.$message({
                            message: "您已添加该企业了，无需重复添加",
                            type: "warning",
                            duration: 5 * 1000
                        });
                        this.searchCompany = "";
                    } else {
                        // 用户没有添加关注，可以添加
                        // 判断列表是否有重复的
                        let flag = false;
                        this.addList.forEach(data => {
                            if (data.companyId === item.companyId) {
                                flag = true;
                            }
                        });
                        if (flag) {
                            this.$message.warning("已加入队列，无需重复添加");
                            this.searchCompany = "";
                            return;
                        }

                        this.addList.push(item);
                        this.searchCompany = "";
                        this.expands = [];
                        this.pageParams.totalRecords = this.addList.length;
                    }
                }
            });*/
        }
    }
};
</script>
