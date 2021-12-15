<template>
    <div>
        <TableWrapper
            ref="table"
            :data="tableData"
            :query="listQuery"
            :columns="tableCol"
            :tableProps="{
                rowKey: 'nid',
                defaultSort:{prop: 'priority', order: 'descending'}
            }"
        />
    </div>
</template>

<script type="text/jsx">
    import {uniqueId, merge} from 'lodash';
    import Button from '@/components/Button';
    import {Api_EvaluateModelFour, Api_EvaluateModelFourGet} from '@/api/creditManagement/creditEstimate/model';

    export default {
        name: "StepDetail4",
        props: {
            rowId: String, // 当前记录id
            defaultData: Array // 默认数据，当前步骤返回上一层时有可能作了保存数据的操作，由此重新获得上一次保存的值
        },
        data() {
            const createRules = this.$createRules;
            return {
                visible: false,
                modelStatus: true,
                listQuery: {},
                formData: {
                    priority: '',
                    gradeName: '',
                    gradeDesc: '',
                    scoreBegin: '',
                    scoreEnd: '',
                    nid: '',
                    id: ''
                },
                tableData: merge([], this.defaultData),
                tableCol: [
                //     {
                //     key: 'priority',
                //     label: '优先级'
                // },
                {
                    key: 'gradeName',
                    label: '信用等级名称'
                }, {
                    key: 'gradeDesc',
                    label: '信用等级说明'
                }, {
                    key: 'scoreBegin',
                    label: '分值范围自'
                }, {
                    key: 'scoreEnd',
                    label: '分值范围至'
                }]
            };
        },
        created() {
            if (this.rowId) {
                Api_EvaluateModelFourGet(this.rowId).then(res => {
                    this.tableData = res.map(({priority, gradeName, gradeDesc, scoreBegin, scoreEnd, id, nid}) => {
                        return {
                            priority,
                            gradeName,
                            gradeDesc,
                            scoreBegin,
                            scoreEnd,
                            id,
                            nid
                        };
                    });
                });
            }
        },
        methods: {
            // 只获取数据，不作验证
            getData() {
                return this.tableData;
            },
            editChange() {
                if (this.tableData.length) {
                    return true;
                } else {
                    return false;
                }
            },
            clearData() {
                // this.$refs.form.resetFields()
            }
        }
    }
</script>

<style scoped>

</style>
