<template>
    <Dialog
        :visible.sync="visible"
        title="评估历史"
        :btns="btns"
        @close="onClose"
    >
        <el-form
            ref="form"
            :model="formData"
            label-width="5em"
        >
            <el-row>
                <el-col :span="12">
                    <el-form-item label="客户编码" prop="saasCode">
                        {{ formData.saasCode }}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="客户名称" prop="companyName">
                        {{ formData.companyName }}
                    </el-form-item>
                </el-col>
            </el-row>
            <TableWrapper
                ref="table"
                :fetchDataFn="Api_EvaluateRecordHistory"
                :query="listQuery"
                :columns="tableCol"
            />
        </el-form>
    </Dialog>
</template>

<script>
    import {Api_EvaluateRecordHistory} from '@/api/creditManagement/creditEstimate/record';

    export default {
        name: "History",
        data() {
            return {
                visible: false,
                btns: [{
                    text: '确定',
                    type: 'primary',
                    click: () => {
                        this.visible = false;
                    }
                }],
                listQuery: {
                    id: ''
                },
                tableCol: [{
                    key: 'evaluationDate',
                    label: '评估时间',
                    render: (h, data) => {
                        return this.$dateFormat(data, 'yyyy-MM-dd');
                    }
                }, {
                    key: 'modelName',
                    label: '评估模型'
                }, {
                    key: 'score',
                    label: '信用评分'
                }, {
                    key: 'grade',
                    label: '信用等级'
                }, {
                    key: 'evaluationName',
                    label: '评估人员'
                }],
                formData: {
                    saasCode: '',
                    companyName: ''
                }
            };
        },
        methods: {
            Api_EvaluateRecordHistory,
            open({id, customerNo, companyName}) {
                this.visible = true;
                this.formData.saasCode = customerNo;
                this.formData.companyName = companyName;
                this.listQuery.id = id;
                this.$nextTick(() => {
                    this.$refs.table.fetchData();
                });
            },
            onClose() {
                this.formData.saasCode = '';
                this.formData.companyName = '';
            }
        }
    };
</script>

<style scoped>

</style>
