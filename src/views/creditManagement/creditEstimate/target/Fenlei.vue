<template>
    <!--        分类弹框-->
    <!--    <Dialog-->
    <!--        :visible.sync="visible"-->
    <!--        :title="modelStatus ? '新增分类':'修改分类'"-->
    <!--        :onOk="fenleiSure"-->
    <!--        width="600px"-->
    <!--        @close="fenleiClose"-->
    <!--    >-->
    <div>
        <el-alert :closable="false">{{ modelStatus ? '新增分类' : '修改分类' }}</el-alert>
        <el-form ref="form" :model="formData" :rules="formRules" label-width="7em" class="form-wrap">
            <el-form-item label="分类名称" prop="classifyName">
                <el-input v-model="formData.classifyName" placeholder="请输入分类名称"></el-input>
            </el-form-item>
            <el-form-item label="分类描述" prop="classifyDesc">
                <el-input v-model="formData.classifyDesc" :rows="4" type="textarea" placeholder="请输入分类描述"></el-input>
            </el-form-item>
            <el-form-item style="text-align: center;margin-top: 20px;" class="size-btn-change">
                <el-button type="primary" @click="fenleiSure">确定</el-button>
                <el-button type="" @click="closeWin">取消</el-button>
            </el-form-item>
        </el-form>
    </div>

    <!--    </Dialog>-->
</template>

<script>
    import {
        Api_EvaluateEstimateClassifyAdd,
        Api_EvaluateEstimateClassifyUpdate
    } from '@/api/creditManagement/creditEstimate/target';

    export default {
        name: "Fenlei",
        props: {
            currentNode: Object
        },
        data() {
            return {
                loading: false,
                visible: false, // 分类弹框显示与否
                modelStatus: true, // 新增或修改分类
                selectData: {}, // 当前选中的数据
                formData: { // 新增分类表单数据
                    classifyName: '',
                    classifyDesc: ''
                },
                formRules: { // 新增分类表单验证
                    classifyName: this.$createRules({
                        msg: '分类名称',
                        required: true,
                        max: 20
                    }),
                    classifyDesc: this.$createRules({
                        msg: '分类描述',
                        max: 200
                    })
                }
            };
        },
        methods: {
            open(modelStatus, data) {
                this.modelStatus = modelStatus;
                this.visible = true;
                this.$nextTick(() => {
                    this.fenleiClose()
                    if (data) {
                        this.formData.classifyName = data.classifyName;
                        this.formData.classifyDesc = data.classifyDesc;
                        this.selectData = Object.assign({}, data);
                    }
                })
            },
            // 新增、修改分类弹框确认
            fenleiSure() {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        const {classifyName, classifyDesc} = this.formData;
                        const {version, id} = this.selectData;
                        let apiRes = null;
                        const postData = {
                            classifyName,
                            classifyDesc,
                            level: this.modelStatus ? this.currentNode.level + 1 : this.currentNode.level,
                            isFenLei: true,
                            init: false
                        };
                        const loading = this.$openLoading();
                        if (this.modelStatus) {
                            apiRes = Api_EvaluateEstimateClassifyAdd(postData);
                        } else {
                            postData.version = version
                            apiRes = Api_EvaluateEstimateClassifyUpdate(id, postData);
                        }
                        apiRes.then(res => {
                            const msg = this.modelStatus ? '新增成功' : '修改成功';
                            this.$message.success(msg);
                            this.visible = false;
                            this.$emit("showDetail", true, postData, res);
                            this.$emit('getTreeData');
                            loading.close();
                        }).catch(e => {
                            this.$message.error(e);
                            loading.close();
                        });
                    }
                });
            },
            // 新增、修改关闭
            fenleiClose() {
                this.$refs.form.resetFields();
            },
            // 关闭窗口
            closeWin() {
                this.visible = false;
                this.$emit("showDetail", true);
            }
        }
    };
</script>

<style scoped>

</style>
