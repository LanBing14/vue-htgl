<template>
    <div>
        <div class="page-header">
            <h1 class="page-name"><span>催收预警详情</span></h1>
            <div>
                <el-button size="small" @click="back">返回</el-button>
            </div>
        </div>
        <div class="page-content">
            <el-form ref="form" label-width="7em">
                <el-form-item label="客户名称">
                    <span class="canClick"
                          @click="$gotoCustomerDetail(formData.companyId)">{{ formData.companyName }}</span>
                </el-form-item>
                <el-divider class="detail-divider"></el-divider>
                <el-form-item label="合同名称">
                    <span class="canClick" @click="getContractFn">
                        {{ formData.contractNo }}/{{ formData.contractName }}
                    </span>
                </el-form-item>
                <el-divider class="detail-divider"></el-divider>
                <el-form-item label="应收编码">
                    <span class="canClick" @click="$gotoReceivablesDetail(formData.receivableId)">
                        {{ formData.receivableCode }}
                    </span>
                </el-form-item>
                <el-divider class="detail-divider"></el-divider>
                <ReceivableDetail :data="formData" :type="true"></ReceivableDetail>
                <el-form-item label="催收编码">{{ formData.collectionCode }}</el-form-item>
                <el-divider class="detail-divider"></el-divider>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="催收状态">{{ formData.processStatus | filterStatus }}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="负责人">{{ formData.username }}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="创建时间">{{ $dateFormat(formData.createDate) }}</el-form-item>
                    </el-col>
                </el-row>
                <el-divider class="detail-divider"></el-divider>
            </el-form>
            <el-alert
                :closable="false"
                title="催收登记信息"
                type="info"
                style="margin-bottom: 0;border-bottom: 1px solid #EBEEF5;"
            >
            </el-alert>
            <el-form ref="form" label-width="7em">
                <el-form-item label="催收类型">{{ formData.collectionType }}</el-form-item>
                <el-divider class="detail-divider"></el-divider>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="还款意愿">{{ formData.returnDesire | filterRegisterDate }}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="催收日期">{{ $dateFormat(formData.registerDate) }}</el-form-item>
                    </el-col>
                </el-row>
                <el-divider class="detail-divider"></el-divider>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="催收描述">{{ formData.remark }}</el-form-item>
                    </el-col>
                </el-row>
                <el-divider class="detail-divider"></el-divider>
                <el-form-item label="催收附件">
                    <a v-for="(el,index) in formData.warningFile" :key="index" :href="el.url" class="a-link" download>
                        {{ el.name }}
                    </a>
                </el-form-item>
                <el-divider class="detail-divider"></el-divider>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="催收登记人">{{ formData.username }}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="登记时间">{{ $dateFormat(formData.modifyDate) }}</el-form-item>
                    </el-col>
                </el-row>
                <el-divider class="detail-divider"></el-divider>
            </el-form>
        </div>
    </div>
</template>

<script>
    import ReceivableDetail from '@/components/ReceivableDetail';
    import {
        Api_CollectionWarningDetail
    } from '@/api/creditManagement/creditCollection/collectionWarning';

    export default {
        name: "Detail",
        components: {
            ReceivableDetail
        },
        filters: {
            filterStatus(val) {
                return val === '0' ? '待处理' : '已处理';
            },
            filterRegisterDate(val) {
                if (val === '0') {
                    return '积极';
                } else if (val === '1') {
                    return '消极';
                } else if (val === '2') {
                    return '不清楚';
                }
                return ''
            }
        },
        props: {
            id: String,
            typeOptions: Array // 催收类型下拉数据
        },
        data() {
            return {
                formData: {
                    receivableCode: '',
                    companyName: '',
                    contractName: '',
                    payAmount: '',
                    receivable: '',
                    startDate: '',
                    endDate: '',
                    oweMoney: '',
                    processStatus: '',
                    username: '',
                    createDate: '',
                    collectionType: '',
                    returnDesire: '',
                    modifyDate: '',
                    registerDate: '',
                    remark: '',
                    warningFile: []
                }
            };
        },
        created() {
            Api_CollectionWarningDetail(this.id).then(res => {
                this.formData = res
                // Object.keys(this.formData).forEach(key => {
                //     this.formData[key] = res[key];
                // });
            });
        },
        methods: {
            back() {
                this.$emit("edit", false);
            },
            // 转换催收类型为中文
            getCollectionType(value) {
                const findRes = this.typeOptions.find(item => item.id === value);
                return findRes ? findRes.collectionType : '';
            },
            getContractFn() {
                const {orders, contractId} = this.formData
                const fn = orders ? this.$gotoOrderDetail(contractId) : this.$gotoContractDetail(contractId)
                return fn
            }
        }
    };
</script>

<style scoped>

</style>
