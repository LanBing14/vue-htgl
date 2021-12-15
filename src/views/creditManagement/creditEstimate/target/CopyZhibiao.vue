<template>
    <!--        复制指标弹框-->
    <Dialog
        :visible.sync="visible"
        title="复制指标"
        :onOk="handleSure"
        width="500px"
        @close="onClose"
    >
        <el-form ref="form" :model="formData" :rules="formRules" label-width="7em">
            <el-form-item label="指标分类" prop="classifyId">
                <el-select v-model="formData.classifyId" placeholder="请选择指标分类">
                    <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="指标名称" prop="kpiName">
                <el-input v-model="formData.kpiName" placeholder="请输入指标名称"></el-input>
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script>
    import {
        Api_EvaluateEstimateQuotaAdd
    } from '@/api/creditManagement/creditEstimate/target';

    export default {
        name: "CopyZhibiao",
        props: {
            treeData: Array
        },
        data() {
            return {
                visible: false,
                modelStatus: true,
                options: [],
                formData: {
                    kpiName: '',
                    classifyId: ''
                },
                formRules: {
                    kpiType: [{
                        required: true,
                        message: '指标分类必选'
                    }],
                    kpiName: this.$createRules({
                        msg: '指标名称',
                        required: true,
                        validator: this.validatorName
                    })
                },
                selectData: {}
            };
        },
        methods: {
            open(options, data) {
                this.options = options;
                this.formData.kpiName = data.label;
                this.selectData = Object.assign({}, data);
                this.visible = true;
            },
            handleSure() {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        const {kpiDesc, kpiType, kpiUnit, scoreList: scores} = this.selectData;
                        const postData = {
                            ...this.formData,
                            kpiDesc,
                            kpiType,
                            kpiUnit,
                            scores: scores.map(
                                ({scoreStandard, scoreProportion, valueBegin, valueEnd, kpiUnit}) => ({
                                    scoreStandard,
                                    scoreProportion,
                                    valueBegin,
                                    valueEnd,
                                    kpiUnit
                                })
                            ),
                            level: 2,
                            init: false
                        };
                        const loading = this.$openLoading()
                        Api_EvaluateEstimateQuotaAdd(postData).then(res => {
                            loading.close()
                            this.$message.success('复制成功');
                            this.visible = false;
                            this.$emit('getTreeData');
                        }).catch(e => {
                            loading.close()
                            this.$message.error(e);
                        });
                    }
                });
            },
            // 验证指标名称是否重复
            validatorName(rule, value, callback) {
                if (!value) {
                    callback();
                    return;
                }
                let flag = false;
                this.treeData.forEach(tree1 => {
                    tree1.children.forEach(tree2 => {
                        if (tree2.label === value) {
                            flag = true;
                        }
                    });
                });
                if (flag) {
                    callback(new Error('指标名称重复'));
                } else {
                    callback();
                }
            },
            onClose() {
                this.$refs.form.resetFields();
            }
        }
    };
</script>

<style scoped>

</style>
