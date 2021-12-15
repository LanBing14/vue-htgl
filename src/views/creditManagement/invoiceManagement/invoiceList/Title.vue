<template>
    <div>
        <Dialog
            ref="drawer"
            title="选择发票抬头"
            :visible.sync="visible"
            :onOk="handleSure"
            width="500px"
            :close="closeDialog"
        >
            <el-form>
                <el-radio-group v-model="form.radio" style="width: 100%">
                    <div v-for="item in radioList" :key="item.id" class="choose-dialog-container">
                        <el-row>
                            <el-col :span="3" style="text-align: center; padding-top: 23px">
                                <el-radio :label="item.id"></el-radio>
                            </el-col>
                            <el-col :span="21" style="padding: 15px 0 10px;">
                                <div class="choose-dialog-text">
                                    <el-form-item>{{ item.companyName }}</el-form-item>
                                    <el-form-item label="税号">{{ item.taxId }}</el-form-item>
                                    <el-form-item label="企业地址">{{ item.unitAddress||'-' }}</el-form-item>
                                    <el-form-item label="企业电话">{{ item.phone || '-' }}</el-form-item>
                                    <el-form-item label="开户银行">{{ item.bankName }}</el-form-item>
                                    <el-form-item label="银行账号">{{ item.bankAccount }}</el-form-item>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </el-radio-group>
            </el-form>
            <div class="canClick" style="text-align: center" @click="openNewBill">+ 添加发票抬头</div>
        </Dialog>
        <NewBill ref="ref_NewBill" @getList="getList"></NewBill>
    </div>
</template>

<script>
import { Api_GetInvoiceTitle } from "@/api/creditManagement/invoice/invoice.js";
import NewBill from "@/views/creditManagement/customerProfile/customerManagement/components/OtherComponents/NewBill";

export default {
    name: "Title",
    components: { NewBill },
    data() {
        return {
            companyId: "",
            companyName: "",
            visible: false,
            form: {
                invoice: "",
                radio: ""
            },
            radioList: []
        };
    },
    methods: {
        open(companyId, companyName, customerId) {
            this.companyId = companyId;
            this.companyName = companyName;
            this.customerId = customerId;
            this.visible = true;
            this.$nextTick(() => {
                this.getList();
            });
        },
        getList() {
            Api_GetInvoiceTitle(this.customerId)
                .then(res => {
                    this.radioList = res;
                })
                .catch(res => {
                    this.$message.error(res);
                });
        },
        openNewBill() {
            this.$refs.ref_NewBill.open("add", this.companyId, this.companyName);
        },
        handleSure() {
            if (this.form.radio) {
                for (let i = 0; i < this.radioList.length; i++) {
                    if (this.form.radio === this.radioList[i].id) {
                        this.form.invoice = this.radioList[i].invoice;
                    }
                }
                this.$emit("getInfo", this.form);
                this.visible = false;
            } else {
                this.$message.info("请选择抬头");
            }
        },
        closeDialog() {
            this.visible = false;
        }
    }
};
</script>

<style scoped type="text/css">
/deep/.el-radio__label {
    display: none;
}
</style>
