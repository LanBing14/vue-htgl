<template>
    <Dialog
        ref="drawer"
        :visible.sync="visible"
        :title="modelStatus?'新增角色':'修改角色'"
        :onOk="handleSure"
        width="500px"
        class="size-btn-change"
        @close="onClose"
    >
        <el-form
            ref="dataForm"
            :rules="addFormRules"
            :model="addFormData"
            label-position="right"
            label-width="8em"
        >
            <el-form-item
                label="角色"
                prop="name"
            >
                <el-input
                    v-model="addFormData.name"
                    placeholder="请输入角色"
                />
            </el-form-item>
            <el-form-item label="数据查看权限" prop="viewPermission">
                <el-select v-model="addFormData.viewPermission" placeholder="请选择角色类型" style="width: 100%;">
                    <el-option
                        v-for="item in authorityOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="数据操作权限" prop="editPermission">
                <el-select v-model="addFormData.editPermission" placeholder="请选择角色类型" style="width: 100%;">
                    <el-option
                        v-for="item in authorityOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script>
    import {
        Api_RolesDetail,
        Api_RolesAdd,
        Api_RolesUpdate
    } from '@/api/settings/role';
    import {Api_comboboxDict} from '@/api/baseApi';
    import Dialog from "../../../components/Dialog/index";

    export default {
        name: 'CreateUpdate',
        components: {Dialog},
        props: {
            modelStatus: {
                type: Boolean,
                default: true
            },
            selectData: {
                type: Object,
                default() {
                    return {};
                }
            },
            roleNames: {
                type: Array,
                default: () => []
            }
        },
        data() {
            const createRules = this.$createRules;
            return {
                visible: false,
                lastId: undefined,
                addFormRules: {
                    name: createRules({
                        msg: '角色',
                        required: true,
                        max: 10,
                        validator: this.validatorNames
                    }),
                    viewPermission: createRules({
                        msg: '数据查看权限',
                        required: true
                    }),
                    editPermission: createRules({
                        msg: '数据操作权限',
                        required: true
                    })
                },
                addFormData: {// 新增角色的表单数据
                    name: '',
                    viewPermission: '',
                    editPermission: ''
                },
                authorityOptions: [] // 数据权限下拉框数据
            };
        },
        created() {
            this.getDict()
        },
        methods: {
            // 打开模态框
            openModel(id) {
                this.visible = true;
                if (id) {
                    this.getDetail(id);
                }
            },
            // 获取字典数据
            getDict() {
                Api_comboboxDict('role_dp').then(res => {
                    this.authorityOptions = res;
                });
            },
            // 点击确认
            handleSure() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        const {modelStatus} = this; // add新增，update修改
                        const {id, version} = this.selectData;
                        const postData = this.addFormData;
                        const promiseRes = modelStatus ? Api_RolesAdd(postData) : Api_RolesUpdate(id, {
                            ...postData,
                            version
                        });
                        const loading = this.$openLoading();
                        promiseRes.then(msg => {
                            this.visible = false;
                            this.onClose();
                            this.$message.success(msg);
                            this.$emit('getList');
                            loading.close();
                        }).catch((e) => {
                            loading.close();
                            this.$message.error(e)
                        });
                    }
                });
            },
            // 获取单个角色信息
            getDetail(id) {
                const loading = this.$openLoading();
                Api_RolesDetail(id).then(res => {
                    this.addFormData.name = res.name;
                    this.addFormData.viewPermission = String(res.viewPermission);
                    this.addFormData.editPermission = String(res.editPermission);
                    this.visible = true;
                    loading.close();
                }).catch(() => {
                    loading.close();
                });
            },
            // 验证角色名是否重复
            validatorNames(rule, value, callback) {
                const index = this.roleNames.indexOf(value);
                if (this.modelStatus) {
                    if (index !== -1) {
                        callback(new Error('角色名称重复'));
                    } else {
                        callback();
                    }
                } else {
                    const filterRes = this.roleNames.filter(item => item === value);
                    if (filterRes.length > 1) {
                        callback(new Error('角色名称重复'));
                    } else {
                        callback();
                    }
                }
            },
            onClose() {
                this.$refs['dataForm'].resetFields();
            }
        }
    };
</script>

<style scoped>

</style>
