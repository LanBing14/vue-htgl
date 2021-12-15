<template>
    <Dialog
        title="授信总额限制"
        :visible.sync="visible"
        :onOk="handleSure"
        width="500px"
        @close="onClose"
    >
        <el-form
            ref="form"
            :model="formData"
            :rules="formRules"
            label-width="6em"
            label-position="left"
            class="form"
            style="width: 80%;margin: auto"
        >
            <el-form-item label="授信总额" prop="totalCredit">
                <el-input v-model="formData.totalCredit" placeholder="请填写授信总额">
                    <template slot="append">元</template>
                </el-input>
            </el-form-item>
            <el-form-item label="应收总额" prop="totalReceivable">
                <el-input v-model="formData.totalReceivable" placeholder="请输入应收账款控制上限">
                    <template slot="append">元</template>
                </el-input>
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script>
    export default {
        name: "Comp1",
        data() {
            return {
                visible: false,
                formData: {
                    totalCredit: '',
                    totalReceivable: ''
                },
                formRules: {
                    totalCredit: [{
                        required: true,
                        message: '授信总额必填'
                    }, {
                        pattern: /^\d{1,9}$|^\d{1,9}\.\d{1,2}$/,
                        message: '授信总额必须为整数或小数，且整数部分不超过9位，小数部分不超过2位'
                    }],
                    totalReceivable: [{
                        required: true,
                        message: '应收总额'
                    }, {
                        pattern: /^\d{1,9}$|^\d{1,9}\.\d{1,2}$/,
                        message: '应收总额必须为整数或小数，且整数部分不超过9位，小数部分不超过2位'
                    }, {
                        validator: this.validatorMoney
                    }]
                }
            };
        },
        methods: {
            open(totalCredit, totalReceivable) {
                this.visible = true;
                this.formData.totalCredit = this.$turnMoney(totalCredit, false);
                this.formData.totalReceivable = this.$turnMoney(totalReceivable, false);
            },
            // 验证“应收总额”是否超过
            validatorMoney(rule, value, callback) {
                if (this.formData.totalCredit && Number(value) > Number(this.formData.totalCredit)) {
                    callback(new Error('不能超过授信总额'));
                    return;
                }
                callback();
            },
            handleSure() {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        this.formData.totalCredit = this.$turnMoney(this.formData.totalCredit, true);
                        this.formData.totalReceivable = this.$turnMoney(this.formData.totalReceivable, true);
                        this.$emit('ok', Object.assign({}, this.formData));
                        this.visible = false;
                    }
                });
            },
            onClose() {
                this.$refs.form.resetFields()
            }
        }
    };
</script>

<style scoped>

</style>
