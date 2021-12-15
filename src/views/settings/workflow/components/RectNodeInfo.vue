<template>
    <div>
        <el-form ref="form" :model="formData" :rules="formRules" label-width="6em">
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

    export default {
        name: 'RectNodeInfo',
        props: {
            data: Object, // 节点数据
            selectData: Object // 列表中的当前行数据
        },
        data() {
            const createRules = this.$createRules;
            return {
                formData: {
                    name: ''
                },
                formRules: {
                    name: createRules({
                        msg: "节点名称",
                        required: true,
                        max: 80
                    })
                },
                anchorPoints: [], // 节点的锚点信息，不用修改，接收即返回
                showCtrlPoints: false, // 是否显示锚点控制配置
                formKeyOptions: [] // 表单下拉框数据
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
                            const {metaInfo} = this.selectData;
                            const metaInfoJSON = JSON.parse(metaInfo);
                            this.$emit('save', [this.data.id, {
                                ...this.data,
                                label: values.name,
                                data: {
                                    id: this.data.id,
                                    type: 'startTask',
                                    name: values.name,
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

