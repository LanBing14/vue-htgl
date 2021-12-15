<template>
    <Dialog
        :visible.sync="visible"
        title="查看催收方案"
        onlyClose
        width="500px"
        @close="onClose"
    >
        <el-form
            ref="form"
            :model="formData"
            label-width="7em"
        >
            <el-form-item label="催收类型" prop="collectionType">
                {{ formData.collectionType }}
            </el-form-item>
            <el-divider class="detail-divider"></el-divider>
            <el-form-item label="逾期天数" prop="overdueDay">
                {{ formData.overdueDay }}
            </el-form-item>
            <el-divider class="detail-divider"></el-divider>
            <el-form-item label="执行人员" prop="executePerson">
                {{ formData.executePerson | filterPerson }}
            </el-form-item>
            <el-divider class="detail-divider"></el-divider>
            <template v-if="formData.executePerson==='1'">
                <el-form-item :disabled="isView" label="选择角色" prop="roles">
                    {{ formData.roles | filterRoles(rolesOptions) }}
                </el-form-item>
                <el-divider class="detail-divider"></el-divider>
            </template>
            <template v-if="formData.executePerson==='2'">
                <el-form-item :disabled="isView" label="选择用户" prop="userId">
                    {{ formData.userId | filterUserId(userIdOptions) }}
                </el-form-item>
                <el-divider class="detail-divider"></el-divider>
            </template>
            <el-form-item label="方案描述" prop="remark">
                {{ formData.remark }}
            </el-form-item>
            <el-divider class="detail-divider"></el-divider>
        </el-form>
    </Dialog>
</template>

<script>
    import {merge} from 'lodash';
    import {
        Api_RolesFetchList
    } from '@/api/settings/role';
    import {Api_ActModelGetCheckPerson} from '@/api/userCenter/actModel';
    import {
        Api_CollectionPlanAdd,
        Api_CollectionPlanUpdate,
        Api_CollectionPlanDetail
    } from '@/api/creditManagement/creditCollection/collectionPlan';
    import store from "../../../../store";

    export default {
        name: "CreateUpdate",
        filters: {
            filterTitle(val) {
                if (val === 'add') {
                    return '新增催收方案';
                } else if (val === 'update') {
                    return '编辑催收方案';
                } else if (val === 'view') {
                    return '查看催收方案';
                }
                return '';
            },
            filterPerson(val) {
                if (val === '0') {
                    return '业务员执行';
                } else if (val === '1') {
                    return '指定执行角色';
                } else if (val === '2') {
                    return '指定执行用户';
                }
            },
            filterRoles(val, options) {
                const nameArr = val.map(roleItem => {
                    const findRes = (options || []).find(i => i.id === roleItem)
                    return findRes ? findRes.name : ''
                })
                return nameArr.join('、');
            },
            filterUserId(val, options) {
                const findRes = (options || []).find(i => i.id === val);
                return findRes ? (findRes.name || findRes.username) : '';
            }
        },
        props: {
            selectData: Object,
            modelStatus: { // add：新增，update：修改，view：详情
                type: String,
                default: () => 'add'
            }
        },
        data() {
            const createRules = this.$createRules;
            return {
                visible: false,
                deptOptions: [], // 部门下拉框
                rolesOptions: [], // 角色下拉框
                userIdOptions: [], // 用户下拉框
                formData: {
                    collectionType: '',
                    overdueDay: undefined,
                    executePerson: '',
                    roles: [],
                    userId: '',
                    remark: ''
                },
                formRules: {
                    collectionType: createRules({
                        msg: '催收类型',
                        required: true,
                        max: 20
                    }),
                    overdueDay: [{
                        required: true,
                        message: '逾期天数必填'
                    }, {
                        validator: this.validatorDay
                    }],
                    userId: [{
                        required: true,
                        message: '用户必选'
                    }],
                    remark: createRules({
                        msg: '方案描述',
                        max: 200
                    })
                }
            };
        },
        computed: {
            isView() {
                return this.modelStatus === 'view';
            }
        },
        created() {
            this.getOptions();
        },
        methods: {
            openModel(id) {
                if (id) {
                    this.getDetail(id);
                } else {
                    this.visible = true;
                }
            },
            handleSure() {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        const postData = merge({}, this.formData);
                        if (postData.executePerson === '0') {
                            postData.roles = [];
                            postData.userId = store.state.user.userInfo.id;
                        } else if (postData.executePerson === '1') {
                            postData.userId = '';
                        } else if (postData.executePerson === '2') {
                            postData.roles = [];
                        }
                        const loading = this.$openLoading();
                        const promiseRes = this.modelStatus === 'add' ? Api_CollectionPlanAdd(postData)
                            : Api_CollectionPlanUpdate(this.selectData.id, {
                                ...postData
                                // version: this.selectData.version
                            });
                        promiseRes.then(res => {
                            this.visible = false;
                            this.$emit('getList');
                            loading.close();
                            this.$message.success(res);
                        }).catch(e => {
                            loading.close();
                            this.$message.error(e);
                        });
                    }
                });
            },
            getDetail(id) {
                const loading = this.$openLoading();
                Api_CollectionPlanDetail(id).then(res => {
                    this.formData.collectionType = res.collectionType;
                    this.formData.overdueDay = res.overdueDay;
                    this.formData.executePerson = res.executePerson;
                    this.formData.roles = res.roles.map(item => item.roleId);
                    this.formData.userId = res.userId;
                    this.formData.remark = res.remark;
                    this.visible = true;
                    loading.close();
                }).catch(e => {
                    loading.close();
                    this.$message.error(e);
                });
            },
            validatorDay(rule, value, callback) {
                if (!value) {
                    callback();
                    return;
                }
                const reg = /(^\d+$)|(^-\d+$)/g;
                if (!reg.test(value)) {
                    callback(new Error('请输入数字'));
                    return;
                }
                if (Number(value) < -30 || Number(Number > 350)) {
                    callback(new Error('请输入-30到365之间的数字'));
                }
                callback();
            },
            getOptions() {
                Api_RolesFetchList({
                    currentPage: 1,
                    pageSize: 100
                }).then(res => {
                    const {data} = res;
                    this.rolesOptions = data;
                });
                Api_ActModelGetCheckPerson().then(res => {
                    this.userIdOptions = res;
                });
            },
            onClose() {
                this.$refs.form.resetFields();
            }
        }
    };
</script>

<style scoped>
    .radios-wrap .el-radio {
        line-height: 30px;
    }
</style>
