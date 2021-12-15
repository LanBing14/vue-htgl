<template>
    <Dialog ref="drawer" title="延长到期日" :visible.sync="visible" :btns="drawerBtns" width="500px" :close="closeDialog">
        <el-form ref="form" :model="form" label-width="90px">
            <el-form-item label="应收编码">{{ rowData.payPlanCode }}</el-form-item>
            <el-form-item label="客户名称">{{ rowData.companyName }}</el-form-item>
            <el-form-item label="合同名称">{{ rowData.contractName }}/{{ rowData.contractNo }}</el-form-item>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="确认日期">{{ $dateFormat(rowData.payDate, 'yyyy-MM-dd') }}</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="到期日"
                    >{{ $dateFormat(rowData.endDateOld ? rowData.endDateOld : rowData.endDate, 'yyyy-MM-dd') }}</el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="应收未收">{{ $toMoney(rowData.payAmount - rowData.receivable) }} 元</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="逾期金额">{{ $toMoney(rowData.overDueMoney) }} 元</el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="累计延长">{{ rowData.overDueDay }}</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="当前到期日">{{ $dateFormat(rowData.endDate, 'yyyy-MM-dd') }}</el-form-item>
                </el-col>
            </el-row>
            <el-form-item
                label="申请天数"
                prop="delayDay"
                :rules="[{required:true,message:'请输入申请天数'},{type:'integer',min:1,max:30,message:'请输入大于等于1小于等于30的正整数'}]"
            >
                <el-input v-model.number="form.delayDay" placeholder="请输入申请天数">
                    <template slot="append">天</template>
                </el-input>
            </el-form-item>
            <el-form-item label="延长说明" prop="remarks" :rules="$createRules({msg:'延长说明',required:true,max:200})">
                <el-input v-model="form.remarks" type="textarea" :rows="3" placeholder="请输入延长说明"></el-input>
            </el-form-item>
            <el-form-item label="附件上传">
                <Upload v-model="fileList" fileType="png,jpg" :limit="3" :fileSize="10" style="margin-top: 6px"></Upload>
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script>
import { Api_PlanDelayApp } from "@/api/creditManagement/accountsReceivable/overdueManagement.js";
import Upload from "@/components/Upload/index.vue";

export default {
    name: "ExtendDueDate",
    components: { Upload },
    data() {
        return {
            visible: false,
            rowData: {},
            form: {
                delayDay: 0, // 延期天数
                overDueMoney: 0, // 逾期金额
                timeOld: "", // 原时间
                remarks: "", // 说明
                urls: [] // 附件
            },
            fileList: [],
            drawerBtns: [
                {
                    text: "确定",
                    type: "primary",
                    click: () => {
                        this.$refs["form"].validate(valid => {
                            if (valid) {
                                this.form.urls = this.fileList.map(item => item.url);
                                this.form.overDueMoney = this.rowData.overDueMoney;
                                this.form.timeOld = this.$dateFormat(
                                    this.rowData.endDateOld ? this.rowData.endDateOld : this.rowData.endDate,
                                    "yyyy-MM-dd"
                                );
                                const loading = this.$openLoading();
                                Api_PlanDelayApp(this.rowData.payPlanId, this.form)
                                    .then(() => {
                                        loading.close();
                                        this.$message.success("提交成功！");
                                        this.$emit("getList");
                                        this.visible = false;
                                    })
                                    .catch(res => {
                                        loading.close();
                                        this.$message.error(res);
                                    });
                            }
                        });
                    }
                },
                {
                    text: "返回",
                    click: () => {
                        this.visible = false;
                    }
                }
            ]
        };
    },
    methods: {
        open(_rowData) {
            this.rowData = _rowData;
            this.visible = true;
            this.form = {
                delayDay: 0, // 延期天数
                overDueMoney: 0, // 逾期金额
                timeOld: "", // 原时间
                remarks: "", // 说明
                urls: [] // 附件
            };
        },
        closeDialog() {
            this.visible = false;
        }
    }
};
</script>

<style>
</style>
