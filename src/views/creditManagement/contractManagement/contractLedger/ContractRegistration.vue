<template>
    <Dialog ref="drawer" title="签约登记" :visible.sync="visible" :onOk="handleSure" width="500px" :close="closeDialog">
        <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="客户名称">
                <span class="canClick" @click="goCustomerNameDetail(rowData.customerId)">{{ rowData.customerName }}</span>
            </el-form-item>
            <el-form-item label="合同名称">
                <span class="canClick" @click="goContractNameDetail(rowData.id)">{{ rowData.contractName }}</span>
            </el-form-item>
            <el-form-item label="签约日期" prop="signDate" :rules="$createRules({msg:'签约日期',required:true})">
                <el-date-picker
                    v-model="form.signDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择合同签约日期"
                    style="width: 100%"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="有效期始" prop="effectiveDateStart" :rules="$createRules({msg:'有效期始',required:true})">
                <el-date-picker
                    v-model="form.effectiveDateStart"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="请输入有效日期始"
                    style="width: 100%"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="有效期止" prop="effectiveDateEnd" :rules="$createRules({msg:'有效期止',required:true})">
                <el-date-picker
                    v-model="form.effectiveDateEnd"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择有效日期止"
                    style="width: 100%"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="附件(已签章)">
                <Upload id="upload-btn-size" v-model="additionalUploadFileUrls" fileType="pdf" :limit="5" :fileSize="10"></Upload>
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script>
import Upload from "@/components/Upload/index.vue";
import { Api_ChangeContractSign } from "@/api/creditManagement/contractManagement/contract.js";

export default {
    name: "ContractRegistration",
    components: { Upload },
    data() {
        return {
            visible: false,
            rowData: {},
            form: {
                signDate: this.$dateFormat(new Date().getTime()),
                effectiveDateStart: this.$dateFormat(new Date().getTime()),
                effectiveDateEnd: null,
                additionalUploadFileUrls: []
            },
            additionalUploadFileUrls: []
        };
    },
    methods: {
        /**
         * @打开
         */
        open(_rowData) {
            this.visible = true;
            this.rowData = _rowData;
            this.form.signDate = this.$dateFormat(_rowData.signDate);
            this.form.effectiveDateStart = this.$dateFormat(_rowData.effectiveDateStart);
            this.form.effectiveDateEnd = this.$dateFormat(_rowData.effectiveDateEnd);
        },
        /**
         * @确定
         */
        handleSure() {
            const loading = this.$openLoading();
            this.form.additionalUploadFileUrls = this.additionalUploadFileUrls.map(item => item.url);
            Api_ChangeContractSign(this.rowData.id, this.form)
                .then(res => {
                    loading.close();
                    this.$message.success({
                        dangerouslyUseHTMLString: true,
                        message: res,
                    });
                    this.visible = false;
                    this.$emit("getList");
                })
                .catch(res => {
                    loading.close();
                    this.$message.error(res);
                });
        },
        /**
         * @跳详情
         */
        goCustomerNameDetail(_l) {
            this.$gotoCustomerDetail(_l);
        },
        goContractNameDetail(_l) {
            this.$gotoContractDetail(_l);
        },
        /**
         * @取消
         */
        closeDialog() {
            this.visible = false;
        }
    }
};
</script>

<style>
</style>
