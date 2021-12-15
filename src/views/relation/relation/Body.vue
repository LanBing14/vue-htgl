<template>
    <Dialog
        ref="drawer"
        title="添加主体"
        :visible.sync="visible"
        :onOk="handleSure"
        width="500px"
        @close="onClose"
    >
        <el-form
            ref="form"
            :model="formData"
            :inline="true"
            label-width="120px"
            @submit.native.prevent
        >
            <el-form-item prop="queryValue" style="">
                <el-input
                    v-model="formData.queryValue"
                    placeholder="请输入主体查询关键字"
                    class="input-with-select"
                    @keyup.enter.native="handleFilter">
                    <el-select v-model="formData.queryType" slot="prepend" placeholder="请选择">
                        <el-option label="企业" value="1"></el-option>
                        <el-option label="自然人" value="2" disabled></el-option>
                    </el-select>
                </el-input>
            </el-form-item>
            <div style="display: inline-block">
                <el-button
                    class="filter-item"
                    type="primary"
                    icon="el-icon-search"
                    @click="handleFilter"
                >查询
                </el-button>
                <el-button
                    class="filter-item"
                    icon="el-icon-refresh"
                    @click="handleReset"
                >重置
                </el-button>
            </div>
        </el-form>
        <div v-loading="loading">
            <template v-if="list.length">
                <div class="choose-info">
                    当前已添加 {{ addRows.length }} 条数据
                </div>
                <ul class="result">
                    <li v-for="(el, index) in list" :key="index" class="item flex">
                        <div class="flex-primary">
                            <h5 v-if="el.queryType==='1'" v-html="el.name" class="name"></h5>
                            <h5 v-else v-html="el.emname" class="name"></h5>
                            <div class="info">
                                <template v-if="el.queryType === '1'">
                                    <div>法定代表人：<span v-html="el.operName"></span></div>
                                    <div>企业状态：{{ el.status }}</div>
                                </template>
                                <template v-else>
                                    <div>{{ el.name }}</div>
                                </template>
                            </div>
                        </div>
                        <div>
                            <el-button :class="{disabled: el.isAdd}" type="primary" @click="toggleAdd(el)">
                                {{ el.isAdd ? '取消' : '添加' }}
                            </el-button>
                        </div>
                    </li>
                </ul>
                <div class="pagination-wrap">
                    <el-pagination
                        @size-change="handleCurrentChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-size="pageSize"
                        :pager-count="5"
                        :total="total"
                        layout="total, prev, pager, next"
                    >
                    </el-pagination>
                </div>
            </template>
            <div v-else style="margin: 20px 0 60px;">
                <el-alert
                    :closable="false"
                    :title="filterStatus | filterTip"
                    type="info"
                    show-icon>
                </el-alert>
            </div>
        </div>

    </Dialog>
</template>

<script>
    import {merge} from 'lodash';
    import {Api_AdvanceSearch} from '@/api/advanceSearch';
    import {Api_SubjectAdd} from '@/api/relation';

    export default {
        name: "Body",
        filters: {
            filterStatus(val) {
                return val === '0' ? '存续' : '';
            },
            filterTip(val) {
                if (val) {
                    return '未搜索到相关数据';
                } else {
                    return '请输入关键词进行查询数据';
                }
            }
        },
        props: {
            data: Array // 主体列表已经存在的数据
        },
        data() {
            return {
                visible: false,
                loading: false, // 搜索loading
                filterStatus: false, // 是否进行搜索过的状态
                currentPage: 1,
                pageSize: 5,
                total: 0,
                formData: {
                    queryType: '1', // 默认查询类别为全部， 0：全部  1：企业名称 2：法人代表  3：注册地址  4：品牌产品   5：经营范围  6：股东高管   7：信用代码
                    queryValue: '' // 查询的值
                },
                list: [],
                addRows: [] // 已经添加的数据
            };
        },
        created() {
        },
        methods: {
            // 打开弹框
            openModel() {
                this.visible = true;
                this.addRows = merge([], this.data);
            },
            // 获取列表数据
            getList() {
                this.loading = true;
                Api_AdvanceSearch({
                    ...this.formData,
                    pageNo: this.currentPage,
                    pageSize: this.pageSize
                }).then(res => {
                    const data = res.returnData;
                    data.forEach(item => {
                        const findRes = this.addRows.find(i => i.id === item.id);
                        if (findRes) {
                            item.isAdd = true;
                        } else {
                            item.isAdd = false;
                        }
                        item.queryType = this.formData.queryType;
                    });
                    this.list = data;
                    this.total = res.totalCount;
                    this.filterStatus = true;
                    this.loading = false;
                }).catch(e => {
                    this.loading = false;
                });
            },
            // 确定
            handleSure() {
                const infos = this.addRows.map(item => ({
                    companyId: item.id,
                    companyName: item.name
                }))
                const loading = this.$openLoading()
                Api_SubjectAdd({
                    infos
                }).then(res => {
                    loading.close()
                    this.visible = false;
                    this.$emit('ok', merge([], this.addRows));
                    this.$message.success(res)
                }).catch(e => {
                    loading.close()
                    this.$message.error(e)
                })
            },
            // 查询
            handleFilter() {
                if (this.formData.queryValue) {
                    this.getList();
                } else {
                    this.$message.warning('请输入主体查询关键字');
                }
            },
            // 重置
            handleReset() {
                this.filterStatus = false;
                this.addRows = [];
                this.currentPage = 1;
                this.formData.queryValue = '';
                this.formData.queryType = '1';
                this.list = [];
            },
            // 添加/取消
            toggleAdd(row) {
                row.isAdd = !row.isAdd;
                if (row.isAdd) {
                    this.addRows.push(row);
                } else {
                    const findIndex = this.addRows.findIndex(item => item.id === row.id);
                    this.addRows.splice(findIndex, 1);
                }
            },
            // 页码大小改变
            handleCurrentChange() {
                this.getList();
            },
            onClose() {
                this.handleReset()
                this.$refs.form.resetFields();
                // this.list = [];
                // this.addRows = [];
                // this.currentPage = 1;
            }
        }
    };
</script>

<style scoped lang="scss">
    .result {
        list-style: none;

        li.item {
            margin-bottom: 15px;
            border: 1px solid #ddd;
            padding: 15px;
            align-items: center;

            .name {
                font-size: 16px;
                margin-bottom: 10px;
            }

            .info {
                color: #999;

                & > div {
                    display: inline-block;
                    min-width: 10em;
                }
            }

            button.disabled {
                background-color: #999;
                color: #fff;
                border-color: #999;
            }
        }
    }

    .input-with-select {
        .el-input-group__prepend {
            .el-select {
                width: 70px;

                /deep/ {
                    .el-input__inner {
                        padding: 0 8px;
                    }

                    .el-input__suffix {
                        right: 0;
                    }
                }
            }
        }
    }

    .pagination-wrap {
        text-align: right;
    }

    /deep/ {
        .el-input__inner {
            line-height: 30px;
            height: 30px;
        }

        .el-button:not(.el-button--text) {
            padding-top: 7px;
            padding-bottom: 7px;
        }
    }

    .choose-info {
        padding: 8px;
        border: 1px solid #66b1ff;
        background-color: rgba(102, 177, 255, 0.2);
        border-radius: 4px;
        margin-bottom: 5px;
    }
</style>
