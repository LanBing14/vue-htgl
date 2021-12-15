<template>
    <div>
        <el-form ref="form" :model="formData" :rules="formRules" label-width="6em">
            <el-form-item label="节点名称" prop="name">
                <el-input v-model="formData.name"/>
            </el-form-item>
            <el-form-item label="审核人" prop="userIds">
                <el-select v-model="formData.userIds" multiple placeholder="请选择" style="width: 100%;">
                    <el-option
                        v-for="item in checkPersonOptions"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="角色" prop="roleIds">
                <el-select v-model="formData.roleIds" multiple placeholder="请选择" style="width: 100%;">
                    <el-option
                        v-for="item in roleIdOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否同部门" prop="dept">
                <el-switch v-model="formData.dept"/>
            </el-form-item>
        </el-form>
        <div style="text-align: center">
            <el-button type="primary" @click="save">保存节点信息</el-button>
        </div>
    </div>
</template>

<script>
    import {merge} from 'lodash';
    import {Api_RolesCombobox} from '@/api/baseApi';
    import {Api_ActModelGetCheckPerson} from '@/api/userCenter/actModel';

    export default {
        name: 'EMonitorInfo',
        props: {
            data: Object, // 节点数据
            selectData: Object // 列表中的当前行数据
        },
        data() {
            const createRules = this.$createRules;
            return {
                formData: {
                    name: '',
                    userIds: [],
                    dept: true,
                    roleIds: []
                },
                formRules: {
                    name: createRules({
                        msg: "节点名称",
                        required: true,
                        max: 80
                    })
                },
                roleIdOptions: [], // 角色下拉框数据
                checkPersonOptions: [], // 审核人下拉框数据
                anchorPoints: [] // 节点的锚点信息，不用修改，接收即返回
            };
        },
        watch: {
            data(val) {
                if (val) {
                    this.mergeData(merge({}, val));
                }
            }
        },
        mounted() {
            Api_RolesCombobox().then(res => {
                this.roleIdOptions = res;
            });
            Api_ActModelGetCheckPerson().then(res => {
                this.checkPersonOptions = res;
            });
            this.mergeData(merge({}, this.data));
        },
        methods: {
            // 合并父组件传递过来的默认数据
            mergeData(d) {
                this.formData.name = d.label;
                this.formData.dept = d.data.dept;
                this.formData.roleIds = d.data.roleIds ? d.data.roleIds : [];
                this.formData.userIds = d.data.userIds ? d.data.userIds : [];
            },
            // 保存节点数据
            save() {
                // return new Promise(resolve => {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        const values = this.formData;
                        if (!values.userIds.length && !values.roleIds.length) {
                            this.$message.warning('“审核人”和“角色”必须选择一项');
                            return;
                        }
                        const {metaInfo} = this.selectData;
                        const metaInfoJSON = JSON.parse(metaInfo);
                        this.$emit('save', [this.data.id, {
                            ...this.data,
                            label: values.name,
                            data: {
                                id: this.data.id,
                                type: 'userTask',
                                name: values.name,
                                dept: values.dept || false,
                                roleIds: values.roleIds || [],
                                userIds: values.userIds || [],
                                formKey: metaInfoJSON.formKey || '',
                                callback: metaInfoJSON.callback || ''
                            }
                        }]);
                    }
                });
                // });
            }
        }
    };
</script>

