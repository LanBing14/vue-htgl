<template>
    <div class="step-demand-fill">
        <el-form
            class="form-step one"
            ref="fillForm"
            :model="fillForm"
            :rules="fillRules"
            label-width="150px"
        >
            <el-form-item v-if="productId" disabled label="产品名称">
                <router-link
                    :to="'/xinYiLoan/productDetail?id=' + productId"
                    tag="a"
                    target="_blank"
                >
                    产品名称
                </router-link>
            </el-form-item>
            <el-form-item v-if="productId" disabled label="发布机构">
                发布机构
            </el-form-item>
            <el-form-item
                prop="loanAmount"
                :label="productId ? '贷款规模' : '需求规模'"
            >
                <el-row :span="24">
                    <el-col :span="18">
                        <el-input v-model="fillForm.loanAmount"></el-input>
                    </el-col>
                    <el-col :span="2" :offset="1">万元</el-col>
                </el-row>
            </el-form-item>
            <el-form-item
                prop="term"
                :label="productId ? '贷款期限' : '用款期限'"
            >
                <el-row :span="24">
                    <el-col :span="18">
                        <el-input v-model="fillForm.term"></el-input>
                    </el-col>
                    <el-col :span="2" :offset="1">个月</el-col>
                </el-row>
            </el-form-item>
            <el-form-item prop="amountPurpose" label="资金用途">
                <el-select
                    v-model="fillForm.amountPurpose"
                    placeholder="请选择资金用途"
                >
                    <el-option
                        v-for="(item, index) in amountPurposeList"
                        :key="index"
                        :label="item.dictValue"
                        :value="item.dictKey"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="guaranteeWayOther" label="担保方式">
                <el-radio-group v-model="fillForm.guaranteeWayOther">
                    <el-radio
                        v-for="(item, index) in guaranteeWayOtherList"
                        :key="index"
                        :label="item.dictKey"
                        >{{ item.dictValue }}</el-radio
                    >
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="nextStep()">下一步</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { Api_GetPurposeAndGuarantee } from "@/api/xinYiLoan";

export default {
    data() {
        return {
            loading: false,
            productId: null,
            amountPurposeList: [],
            guaranteeWayOtherList: [],
            fillForm: {
                loanAmount: "", // 需求规模
                term: "", // 用款期限
                amountPurpose: "", // 资金用途  传 dictKey
                guaranteeWayOther: "" // 担保方式 传 dictKey
            },
            fillRules: {
                loanAmount: [
                    {
                        required: true,
                        trigger: "change",
                        message: "请选填写规模"
                    }
                ],
                term: [
                    {
                        required: true,
                        trigger: "change",
                        message: "请选填写期限"
                    }
                ],
                amountPurpose: [
                    {
                        required: true,
                        trigger: "change",
                        message: "请选择资金用途"
                    }
                ],
                guaranteeWayOther: [
                    {
                        required: true,
                        trigger: "change",
                        message: "请选择担保方式"
                    }
                ]
            }
        };
    },
    mounted() {
        this.productId = this.$route.query.id || null;
        this.loadPurposeAndGuarantee();
    },
    methods: {
        loadPurposeAndGuarantee() {
            // 接口调用
            Api_GetPurposeAndGuarantee()
                .then(res => {
                    if (res.stateCode === "1") {
                        this.amountPurposeList = res.data.amountPurpose;
                        this.guaranteeWayOtherList = res.data.guaranteeWayOther;
                    }
                })
                .catch(() => {
                    this.amountPurposeList = [];
                    this.guaranteeWayOtherList = [];
                });
        },
        nextStep() {
            // 接口调用
            this.$refs["fillForm"].validate(valid => {
                if (valid) {
                    this.$store.commit("SAVE_STEP_DATA", this.fillForm);
                    this.$router.push({
                        path: "/xinYiLoan/xinYiStep/onlineAuthor",
                        query: {}
                    });
                } else {
                    return false;
                }
            });
        }
    }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.form-step {
    width: 550px;
    margin: 0 auto;
}
</style>
