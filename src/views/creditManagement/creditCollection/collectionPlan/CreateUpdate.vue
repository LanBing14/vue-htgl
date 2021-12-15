<template>
    <Dialog
        :visible.sync="visible"
        :title="modelStatus | filterTitle"
        :onOk="handleSure"
        :onlyClose="modelStatus==='view'"
        width="500px"
        
        class="size-btn-change"
        @close="onClose"
    >
        <el-form
            ref="form"
            :model="formData"
            :rules="formRules"
            label-width="7em"
        >
            <el-form-item label="催收类型" prop="collectionType">
                <el-input v-model="formData.collectionType" :disabled="isView" placeholder="请输入催收类型名称"></el-input>
            </el-form-item>
            <el-form-item label="逾期天数" prop="overdueDay">
                <el-input v-model="formData.overdueDay" :disabled="isView" placeholder="请输入逾期天数，负数代表预警"></el-input>
            </el-form-item>
            <el-form-item label="执行人员" prop="executePerson">
                <el-radio-group v-model="formData.executePerson" :disabled="isView" class="radios-wrap">
                    <el-radio label="0">业务员执行</el-radio>
                    <el-radio label="1">指定执行角色</el-radio>
                    <el-radio label="2">指定执行用户</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-if="formData.executePerson==='1'" :disabled="isView" label="选择角色" prop="roles">
                <el-select v-model="formData.roles" multiple placeholder="请选择角色" style="width: 100%;">
                    <el-option
                        v-for="(el, index) in rolesOptions"
                        :key="el.id"
                        :label="el.name"
                        :value="el.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="formData.executePerson==='2'" :disabled="isView" label="选择用户" prop="userId">
                <el-select v-model="formData.userId" placeholder="请选择用户" style="width: 100%;">
                    <el-option
                        v-for="(el, index) in userIdOptions"
                        :key="el.id"
                        :label="el.name || el.username"
                        :value="el.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="方案描述" prop="remark">
                <el-input v-model="formData.remark" :rows="4" :disabled="isView" type="textarea"
                          placeholder="请输入催收方案描述"></el-input>
            </el-form-item>
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
            }
        },
        props: {
            selectData: Object,
            key:0,
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
                        max: 20,
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
                            this.onClose()
                        }).catch(e => {
                            loading.close();
                            this.$message.error(e);
                            this.onClose()
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
                               // 清空所有的数据跟验证
                this.formData= {
                    collectionType: "",
                    overdueDay: "",
                    executePerson: '',
                    roles: [],
                    userId: '',
                    remark: ''
                };
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
