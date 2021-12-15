<template>
    <div>
        <el-form ref="form" :model="formData" :rules="formRules" label-width="6em">
<!--            <p class="form-info-split">-->
<!--                <span class="l"></span>-->
<!--                <span class="t">节点详情</span>-->
<!--                <span class="r"></span>-->
<!--            </p>-->
            <el-form-item label="节点名称" prop="name">
                <el-input v-model="formData.name"/>
            </el-form-item>
        </el-form>
        <div style="text-align: center">
            <el-button type="primary" @click="save">保存节点信息</el-button>
        </div>
    </div>
</template>

<script>
    import {merge} from 'lodash';
    import {Api_RolesCombobox} from "@/api/baseApi";

    export default {
        name: 'EllipseNodeInfo',
        props: {
            data: Object
        },
        data() {
            const createRules = this.$createRules;
            return {
                formData: {
                    name: '',
                    dept: true,
                    roleId: []
                },
                formRules: {
                    name: createRules({
                        msg: "节点名称",
                        required: true,
                        max: 80
                    })
                },
                labelCol: {span: 4},
                wrapperCol: {span: 20},
                roleIdOptions: [], // 角色下拉框数据
                formKeyOptions: [] // 表单下拉框数据
            };
        },
        watch: {
            data(val) {
                this.mergeData(merge({}, val));
            }
        },
        mounted() {
            Api_RolesCombobox().then(res => {
                this.roleIdOptions = res;
            });
            this.mergeData(merge({}, this.data));
        },
        methods: {
            // 合并父组件传递过来的默认数据
            mergeData(d) {
                this.formData.name = d.label;
            },
            // 保存节点数据
            save() {
                // return new Promise(resolve => {
                    this.$refs.form.validate(valid => {
                        if (valid) {
                            const values = this.formData;
                            // const {metaInfo} = this.selectData;
                            // const metaInfoJSON = JSON.parse(metaInfo);
                            this.$emit('save', [this.data.id, {
                                ...this.data,
                                label: values.name,
                                data: {
                                    id: this.data.id,
                                    type: 'endTask',
                                    name: values.name
                                    // formKey: metaInfoJSON.formKey || '',
                                    // callback: metaInfoJSON.callback || ''
                                }
                            }]);
                        }
                    });
                // })
            }
        }
    };
</script>
