<template>
    <Dialog
        :visible.sync="visible"
        title="复制模型"
        :onOk="handleSure"
        @close="onClose"
        class="size-btn-change"
    >
        <el-form
            ref="form"
            :model="formData"
            :rules="formRules"
            label-width="6em"
        >
            <el-form-item label="模型名称" prop="modelName">
                <el-input v-model="formData.modelName" placeholder="请输入模型名称"></el-input>
            </el-form-item>
            <el-form-item label="模型描述" prop="modelDesc">
                <el-input v-model="formData.modelDesc" :rows="4" placeholder="请输入模型描述" type="textarea"></el-input>
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script>
    import {Api_EvaluateModelCopy} from '@/api/creditManagement/creditEstimate/model';
    export default {
        name: 'CopyModel',
        data() {
            const createRules = this.$createRules;
            return {
                visible: false,
                selectData: {},
                formRules: {
                    modelName: createRules({
                        msg: '模型名称',
                        required: true,
                        max: 20
                    }),
                    modelDesc: createRules({
                        msg: '模型描述',
                        max: 200
                    })
                }, // 表单验证规则
                // 表单数据
                formData: {
                    modelName: '',
                    modelDesc: ''
                },
                menuKeyDisable: true, // 菜单key是否可以填写
                treeLoading: false, // 树组件的loading状态
                lastSelectedId: undefined // 上一次选中的数据的id
            };
        },
        methods: {
            // 打开模态框
            openModel(data) {
                this.selectData = data
                this.visible = true;
            },
            // 点击确认
            handleSure() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        const promiseRes = Api_EvaluateModelCopy(this.selectData.id, {
                            ...this.formData
                        });
                        this.handlePostData(promiseRes);
                    }
                });
            },
            handlePostData(promiseRes) {
                const loading = this.$openLoading();
                promiseRes.then(msg => {
                    this.visible = false;
                    this.$message.success(msg);
                    this.$emit('getList');
                    loading.close();
                }).catch(() => {
                    loading.close();
                });
            },
            // 模态框关闭时
            onClose() {
                this.$refs.form.resetFields();
            }
        }
    };
</script>

<style scoped>
    .showSelectIcon {
        margin-right: 10px;
        font-size: 22px;
        vertical-align: middle;
    }
</style>
