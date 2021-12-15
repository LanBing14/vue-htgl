<template>
    <!--    <Dialog-->
    <!--        :visible.sync="visible"-->
    <!--        title="生成催收函"-->
    <!--        :onOk="handleSure"-->
    <!--        width="500px"-->
    <!--        @close="onClose"-->
    <!--    >-->
    <div>
        <div class="page-header">
            <h1 class="page-name">
                <span>生成催收函</span>
            </h1>
            <div>
                <el-button @click="cancel">返回</el-button>
            </div>
        </div>
        <div class="page-content">
            <el-form
                ref="form"
                :model="formData"
                :rules="formRules"
                label-width="7em"
            >
                <el-form-item label="客户名称">
                    <span class="canClick"
                          @click="$gotoCustomerDetail(baseData.companyId)">{{ baseData.companyName }}</span>
                </el-form-item>
                <el-form-item label="合同名称">
                    <span class="canClick" @click="getContractFn">
                        {{ baseData.contractNo }}/{{ baseData.contractName }}
                    </span>
                </el-form-item>
                <el-form-item label="应收编码">
                    <span class="canClick" @click="$gotoReceivablesDetail(baseData.receivableId)">
                        {{ baseData.receivableCode }}
                    </span>
                </el-form-item>
                <ReceivableDetail :data="baseData" :type="false"></ReceivableDetail>
                <el-form-item label="催收类型" prop="formWork">
                    <!--                    {{ getCollectionType(baseData.collectionType) }}-->
                    {{ formData.type === '1' ? '预警' : '催收' }}
                </el-form-item>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="催收函模板" prop="formWork">
                            <el-select v-model="formData.formWork" placeholder="请选择催收函模板" style="width: 100%;"
                                       @change="onChange">
                                <el-option
                                    v-for="(el, index) in formWorkOptions"
                                    :key="index"
                                    :label="el.name"
                                    :value="el.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="催收描述" prop="desc">
                    <el-input v-model="formData.desc" :rows="4" type="textarea" placeholder="请输入催收描述"></el-input>
                </el-form-item>
            </el-form>
            <div ref="modelTexts" style="display: none;padding: 20px;">
                <h2 style="text-align: center;">催收函</h2>
                <p style="margin: 10px 0;">{{ baseData.companyName }}</p>
                <div style="text-indent: 2em;">
                    {{ formData.desc }}
                </div>
                <div style="text-align: right;">{{ curDate }}</div>
            </div>
            <div class="form-bottom-btns">
                <el-button type="success" @click="handleSave">保存</el-button>
                <el-button type="primary" @click="handleSure">提交</el-button>
            </div>
        </div>
    </div>
    <!--    </Dialog>-->
</template>

<script>
    import ReceivableDetail from '@/components/ReceivableDetail';
    import {
        Api_CollectionOverduePdf,
        Api_CollectionOverdueSave,
        Api_CollectionOverdueSubmit,
        Api_CollectionOverdueDetail
    } from '@/api/creditManagement/creditCollection/overdueCollection';
    import {
        Api_CollectionPlanModel
    } from '@/api/creditManagement/creditCollection/collectionPlan';
    import {
        Api_CollectionWarningDetail
    } from '@/api/creditManagement/creditCollection/collectionWarning';

    export default {
        name: "Create",
        components: {
            ReceivableDetail
        },
        props: {
            id: String,
            letterShow:Boolean,
            typeOptions: Array // 催收类型下拉数据
        },
        data() {
            return {
                visible: false,
                baseData: {},
                formData: {
                    formWork: '',
                    desc:null
                },
                formRules: {
                    desc: [{
                        required: true,
                        message: '催收描述必填'
                    }, {
                        max: 1000,
                        message: '催收描述最大长度为1000个字'
                    }]
                },
                formWorkOptions: [], // 催收函模板下拉框数据
                curDate: this.$dateFormat(new Date()) // 当前时间
            };
        },
        created() {
            Api_CollectionPlanModel().then(res => {
                this.formWorkOptions = res;
            });
            Api_CollectionOverdueDetail(this.id).then(res => {
                this.formData.formWork = res.schemeId;
                this.formData.desc = res.text;
            });
            const loading = this.$openLoading();
            Api_CollectionWarningDetail(this.id).then(res => {
                this.baseData = res
                loading.close()
            }).then(e => {
                loading.close();
                if(e){
                    this.$message.error(e);
                }
            });
        },
        methods: {
            // 保存
            handleSave() {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        const loading = this.$openLoading();
                        Api_CollectionOverdueSave(this.baseData.id, {
                            text: this.formData.desc,
                            schemeId: this.formData.formWork
                        }).then(() => {
                            this.visible = false;
                            loading.close();
                            this.$message.success('保存成功');
                            this.cancel();
                        }).catch(e => {
                            loading.close();
                            this.$message.error(e);
                        });
                    }
                });
            },
            // 提交
            handleSure() {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        const html = this.$refs.modelTexts.outerHTML;
                        const loading = this.$openLoading();
                        Api_CollectionOverdueSubmit(this.baseData.id, {
                            html,
                            text: this.formData.desc,
                            schemeId: this.formData.formWork
                        }).then(url => {
                            this.visible = false;
                            loading.close();
                            Api_CollectionWarningDetail(this.id).then(res => {
                                // 触发父组件事件，传过去
                                this.$emit('changeXiazai',res)

                            }).then(e => {
                                if(e){
                                    this.$message.error(e);
                                }
                            });
                            this.$confirm('生成催收函成功！', '提示', {
                                confirmButtonText: '下载催收函',
                                cancelButtonText: '取消',
                                type: 'success'
                            }).then(() => {
                                // 触发父组件的事件，修改下载的函数
                                window.open(process.env.VUE_APP_FILE_API + url);
                                this.cancel();
                            }).catch(() => {
                                this.cancel();
                            });
                        }).catch(e => {
                            loading.close();
                            this.$message.error(e);
                        });
                    }
                });
            },
            cancel() {
                // this.$emit('edit', false);
                this.$emit( "update:letterShow", false );
            },
            onClose() {
                this.$refs.form.resetFields();
            },
            onChange(val) {
                const findRes = this.formWorkOptions.find(i => i.id === val);
                this.formData.desc = findRes.textVo ? findRes.textVo.text : '';
            },
            // 转换催收类型为中文
            getCollectionType(value) {
                const findRes = this.typeOptions.find(item => item.id === value);
                return findRes ? findRes.collectionType : '';
            },
            getContractFn() {
                const {orders, contractId} = this.baseData
                const fn = orders ? this.$gotoOrderDetail(contractId) : this.$gotoContractDetail(contractId)
                return fn
            }
        }
    };
</script>
