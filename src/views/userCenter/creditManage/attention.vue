<template>
<div class="usercenter-container">
    <el-row class="fxb-table-tool">
        <el-form>
            <el-form-item>
                <el-row :gutter="10" type="flex" align="middle">
                    <el-col :span="6">
                        <el-input placeholder="请输入企业名称" size="small" v-model="searchParams.companyName">
                            <el-button @click="loadAttentionList" icon="el-icon-search" slot="append"></el-button>
                        </el-input>
                    </el-col>
                    <el-col :span="20" align="right">
                        <el-button @click="addCompanyDialogVisible = true" icon="el-icon-plus" size="small">
                            添加企业
                        </el-button>
                        <el-button @click="batchSetGroupDialogVisible = true" icon="el-icon-edit" size="small">
                            批量设置分组
                        </el-button>
                        <el-button @click="removeAttention" icon="el-icon-minus" size="small">移除企业</el-button>
                    </el-col>
                </el-row>
                <el-row :gutter="10" type="flex" align="middle" style="margin-top:18px">
                    <el-col :span="24">
                        <el-button :plain="searchParams.groupId!==''" type="primary" size="small" @click="changeGroupIdCondition">全部
                        </el-button>
                        <el-button class="active" :plain="searchParams.groupId!==item.id" type="primary" :key="item.id" size="small" v-for="item in $store.getters.attentionGroup" v-show="item.groupType===searchParams.groupType" @click="changeGroupIdCondition(item)">
                            {{ item.name }}（{{ item.attenSum }}）
                        </el-button>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
    </el-row>
    <el-table class="fxb-table" :data="attentionList" :expand-row-keys="expands" @cell-mouse-enter="handelEnter" @selection-change="handleSelectionChange" ref="attentionTable" row-key="id" style="width: 100%" tooltip-effect="dark" v-loading="listLoading">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="企业名称" prop="companyName" show-overflow-tooltip></el-table-column>
        <el-table-column label="统一社会信用代码" prop="creditCode" width="200"></el-table-column>
        <el-table-column label="法定代表人" prop="legalPerson" width="120"></el-table-column>
        <el-table-column label="信用评价" prop="creditLevel" width="120"></el-table-column>
        <el-table-column label="客户分组" prop="depart" width="120">
            <template slot-scope="scope">
                <el-tag :key="item.id" size="mini" v-for="item in scope.row.groups" v-show="item.name && item.groupType===searchParams.groupType">{{ item.name }}
                </el-tag>
                <i @click="openEditGroup(scope.row)" class="el-icon-edit"></i>
            </template>
        </el-table-column>
        <!--<el-table-column label="列入时间" width="120">
                    <template slot-scope="scope">{{ scope.row.createDate | dateFormat('yyyy-MM-dd') }}</template>
                </el-table-column>-->
        <el-table-column type="expand" width="1">
            <template slot-scope="props">
                <div class="row-tool-panel">
                    <router-link :to="{name:'infomaintain',params:{id:props.row.id,comid:props.row.companyId}}" tag="a">
                        <svg-icon icon-class="edit" />
                        维护信息
                    </router-link>
                </div>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination :current-page.sync="searchParams.pageNo" :page-size="searchParams.pageSize"
                   :total="searchParams.totalRecords" @current-change="loadAttentionList" class="fxb-page"
                   v-show="searchParams.totalRecords>0"/>

    <MyConcernGroup :groupType="searchParams.groupType" @submitEditGroup="editGroupConfirm" ref="editGroupDialog"/>

    <el-dialog :before-close="beforeBatchSetClose" :visible.sync="batchSetGroupDialogVisible"
               :close-on-click-modal="false"
               title="批量设置分组" top="10vh" width="55%">
        <el-table :data="attentionList" max-height="400" ref="attentionTable1">
            <el-table-column fixed label="企业名称" prop="companyName" width="260">
            </el-table-column>
            <el-table-column :key="item.id" :label="item.name" v-for="item in $store.getters.attentionGroup" width="100"
                             v-if="item.groupType===searchParams.groupType">
                <template slot-scope="scope">
                    <el-checkbox :checked="groupIsCheck(scope.row.groups,item.id)"
                                 @change="setGroupCheck($event,scope.row.groups,item.id)"></el-checkbox>
                </template>
            </el-table-column>
        </el-table>
        <div class="dialog-footer" slot="footer">
            <el-button @click="beforeBatchSetClose" size="small">取消</el-button>
            <el-button :loading="batchSetLoading" @click="batchSetGroup" size="small" type="primary">保存并关闭
            </el-button>
        </div>
    </el-dialog>

    <el-dialog :before-close="beforeBatchSetClose"
               :close-on-click-modal="false"
               :visible.sync="addCompanyDialogVisible" title="请选择添加方式" top="10vh" width="480px">
        <el-row style="text-align: center;">
            <el-col :span="8">
                <router-link :to="{name:'accurate'}">
                    <div class="imgCM1"></div>
                    精确添加
                </router-link>
            </el-col>
            <el-col :span="8">
                <router-link :to="{name:'batchimport'}">
                    <div class="imgCM2"></div>
                    批量导入
                </router-link>
            </el-col>
            <el-col :span="8">
                <router-link :to="'/advanceSearch'">
                    <div class="imgCM3"></div>
                    企业查找
                </router-link>
            </el-col>
        </el-row>
        <br>
    </el-dialog>
</div>
</template>

<script>
    import Pagination from "@/components/Pagination";
    import {
        Api_BatchSetGroup,
        Api_GetAttentionList,
        Api_RemoveAttention,
        Api_UpdateAttention
    } from "@/api/userCenter/creditManage";
    import {dateFormat} from "@/utils/index"
    import MyConcernGroup from "../components/MyConcernGroup";

    export default {
    name: "Attention",
    components: {
        Pagination,
        MyConcernGroup
    },
    filters: {
        dateFormat
    },
    data() {
        return {
            multipleSelection: [],
            attentionList: [],
            searchParams: {
                companyName: '',
                groupId: '',
                groupType: '',
                pageNo: 1,
                pageSize: 10,
                totalRecords: 0
            },
            listLoading: true,
            attentionId: '',
            batchSetGroupDialogVisible: false,
            batchSetLoading: false,
            addCompanyDialogVisible: false,
            expands: [],
            searchAll: true
        };
    },
    created: function () {
        // 更新分组的使用数量统计
        this.$store.dispatch('updateAttentionGroup');
        this.searchParams.groupType = this.$route.params.groupType;
        this.loadAttentionList();
    },
    beforeRouteUpdate(to, from, next) {
        this.searchParams.groupType = to.params.groupType;
        this.attentionList = [];
        this.loadAttentionList();
        next();
    },
    methods: {
        // 获取关注列表数据
        loadAttentionList() {
            this.expands = [];
            this.listLoading = true;
            Api_GetAttentionList(this.searchParams).then(res => {
                this.listLoading = false;
                if (res.stateCode === '1') {
                    this.attentionList = res.data.list;
                    this.searchParams.totalRecords = res.data.totalRecords;
                }
            })
        },
        // 批量移除关注
        removeAttention() {
            if (this.multipleSelection.length === 0) {
                this.$message.info('请先选中要移除的企业');
                return;
            }
            this.$confirm('是否要将选中的企业移除关注列表?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                let attentionIds = '';
                this.multipleSelection.forEach(item => {
                    attentionIds += item.id + ','
                });
                Api_RemoveAttention({
                    attentionIds: attentionIds
                }).then(res => {
                    if (res.stateCode === '1') {
                        // 更新分组的使用数量统计
                        this.$store.dispatch('updateAttentionGroup');
                        this.loadAttentionList();
                        this.$message.success('移除成功');
                    } else {
                        this.$message.error('移除失败');
                    }
                })
            }).catch(() => {});
        },
        // 关注列表多选框事件
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 打开编辑分组弹框
        openEditGroup(row) {
            this.attentionId = row.id;
            let groupIds = '';
            row.groups.forEach(item => {
                groupIds += item.id + ','
            });
            this.$refs.editGroupDialog.openDialog(groupIds);
        },
        // 编辑分组弹框确定事件
        editGroupConfirm(newGroupIds) {
            this.$refs.editGroupDialog.openLoading();
            Api_UpdateAttention({
                attentionId: this.attentionId,
                groupIds: newGroupIds
            }).then(res => {
                this.$refs.editGroupDialog.closeLoading();
                this.$refs.editGroupDialog.closeDialog();
                if (res.stateCode === '1') {
                    // 更新分组的使用数量统计
                    this.$store.dispatch('updateAttentionGroup');
                    this.loadAttentionList();
                    this.$message.success('修改分组成功');
                } else {
                    this.$message.error('修改分组失败');
                }
            })
        },
        // 批量设置分组判断是否已选中
        groupIsCheck(groups, groupId) {
            return groups.findIndex(item => item.id === groupId) > -1;
        },
        // 批量设置分组-切换选择
        setGroupCheck(value, groups, groupId) {
            const index = groups.findIndex(item => item.id === groupId);
            if (index > -1) {
                groups[index].checked = value;
            } else {
                groups.push({
                    id: groupId,
                    checked: value
                });
            }
        },
        // 批量设置分组-关闭窗口前验证
        beforeBatchSetClose(done) {
            const close = () => {
                if (typeof done === 'function') {
                    done();
                } else {
                    this.batchSetGroupDialogVisible = false;
                }
            };
            const params = this.buildBatchSetParams();
            if (params.length > 0) {
                this.$confirm('有修改的分组未提交，是否直接关闭页面？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    // 未选中企业时跳过
                    this.attentionList = [];
                    this.loadAttentionList();
                    close();
                }).catch(() => {});
            } else {
                close();
            }
        },
        // 批量设置分组-保存设置
        batchSetGroup() {
            this.batchSetLoading = true;
            const params = this.buildBatchSetParams();
            console.log(params);
            if (params.length > 0) {
                if (params.findIndex(item => !item.groupIds) > -1) {
                    this.$message.warning('每个企业至少选择一个分组')
                }
                Api_BatchSetGroup(params).then(res => {
                    this.batchSetLoading = false;
                    if (res.stateCode === '1') {
                        this.$message.success('批量设置分组成功');
                        this.batchSetGroupDialogVisible = false;
                        // 刷新全局变量里的分组
                        this.$store.dispatch('updateAttentionGroup');
                        // 刷新列表
                        this.loadAttentionList();
                    } else {
                        this.$message.error('批量设置分组失败');
                    }
                })
            } else {
                // 没有发生接口调用，无需刷新页面
                this.batchSetGroupDialogVisible = false;
            }
        },
        // 批量设置分组-生成待提交数据
        buildBatchSetParams() {
            const params = [];
            this.attentionList.forEach(item => {
                let groupIds = '';
                let needUpdate = false;
                item.groups.forEach(group => {
                    groupIds += group.checked || !('checked' in group) ? group.id + ',' : '';
                    needUpdate = 'checked' in group ? true : needUpdate;
                });
                if (needUpdate) {
                    // 只提交需要更新的数据
                    params.push({
                        id: item.id,
                        groupIds: groupIds
                    })
                }
            });
            return params;
        },
        // 表格鼠标移入事件
        handelEnter(row, column, cell, event) {
            const cindex = this.expands.indexOf(row.id);
            if (cindex < 0) {
                this.expands.shift();
                this.expands.push(row.id);
            }
        },
        // 变更企业分组查询条件
        changeGroupIdCondition(group) {
            this.searchParams.groupId = group ? group.id : '';
            this.loadAttentionList();
        }
    }
};
</script>

<style lang="scss" scoped>
.imgCM1,
.imgCM2,
.imgCM3 {
    margin: 0 auto 15px auto;
    width: 80px;
    height: 82px;
    background-repeat: no-repeat;
    background-size: cover;
}

.imgCM1 {
    background-image: url('../../../assets/images/cmimg1.png');

    &:hover {
        background-image: url('../../../assets/images/cmimg1H.jpg');
    }
}

.imgCM2 {
    background-image: url('../../../assets/images/cmimg2.png');

    &:hover {
        background-image: url('../../../assets/images/cmimg2H.jpg');
    }
}

.imgCM3 {
    background-image: url('../../../assets/images/cmimg3.png');

    &:hover {
        background-image: url('../../../assets/images/cmimg3H.jpg');
    }
}
</style>
