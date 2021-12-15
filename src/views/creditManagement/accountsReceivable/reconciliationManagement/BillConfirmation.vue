<template>
    <Dialog ref="drawer" title="对账确认" :visible.sync="visible" class="size-btn-change" :btns="drawerBtns" width="500px" :close="closeDialog">
        <el-form ref="form" :model="form" label-width="90px">
            <el-form-item label="对账期间">
                {{ rowData.dateInt }}
                <span class="preview-bill" @click="previewBill">预览账单</span>
            </el-form-item>
            <el-form-item label="客户名称" >  <span class="canClick" @click="$gotoCustomerDetail(rowData.companyId)"
            >{{ rowData.companyName }}</span></el-form-item>
            <el-form-item label="期末余额">{{ $toMoney(rowData.monthEndMoney) }} 元</el-form-item>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="期初余额">{{ $toMoney(rowData.monthBeginMoney) }} 元</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="本期增加">{{ $toMoney(rowData.addMoney) }} 元</el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="本期收款">{{ $toMoney(rowData.receivableMoney) }} 元</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="本期折扣">{{ $toMoney(rowData.discountMoney) }} 元</el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="对账状态" prop="state">
                <el-radio-group v-model="form.state">
                    <el-radio :label="1">确认无差异</el-radio>
                    <el-radio :label="2">确认有差异</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="对账描述" prop="remarks" :rules="$createRules({msg:'对账描述',required:true,max:200})">
                <el-input v-model="form.remarks" type="textarea" :rows="3" placeholder="请输入对账描述" style="top: 0"></el-input>
            </el-form-item>
            <el-form-item label="确认日期" prop="confirmDate" :rules="$createRules({msg:'确认日期',required:true})">
                <el-date-picker v-model="form.confirmDate" type="date" placeholder="请输入确认日期" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
            <el-form-item label="附件上传">
                <Upload id="upload-btn-size" v-model="urls" fileType="png,jpg" :limit="5" :fileSize="10"></Upload>
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script>
import Upload from "@/components/Upload/index.vue";
import {
    Api_ReconciliationConfirm,
    Api_ReconciliationDownload
} from "@/api/creditManagement/accountsReceivable/reconciliationManagement.js";

export default {
    name: "BillConfirmation",
    components: { Upload },
    data() {
        return {
            visible: false,
            rowData: {},
            form: {
                state: 1,
                confirmDate: this.$dateFormat(new Date()),
                remarks: "",
                monthEndMoney: 0,
                urls: []
            },
            baseUrl: process.env.VUE_APP_FILE_API,
            urls: [],
            drawerBtns: [
                {
                    text: "确定",
                    type: "primary",
                    click: () => {
                        this.$refs["form"].validate(valid => {
                            if (valid) {
                                this.form.urls = this.urls.map(item => item.url);
                                this.form.monthEndMoney = this.rowData.monthEndMoney;
                                const loading = this.$openLoading();
                                Api_ReconciliationConfirm(this.rowData.id, this.form)
                                    .then(() => {
                                        loading.close();
                                        this.$message.success("确认成功！");
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
            // empty
            this.form = {
                state: 1,
                confirmDate: this.$dateFormat(new Date()),
                remarks: "",
                urls: []
            };
            this.urls = [];
        },
        closeDialog() {
            this.visible = false;
        },
        previewBill() {
            Api_ReconciliationDownload(this.rowData.id).then(res => {
                window.open(this.baseUrl+res);
            });
        },
        goCustomerDetail(_id) {
            this.$gotoCustomerDetail(_id);
        },
    }
};
</script>

<style lang="scss" scoped>
.preview-bill {
    color: #4a9df2;
    margin-left: 8px;
    cursor: pointer;
}
</style>
