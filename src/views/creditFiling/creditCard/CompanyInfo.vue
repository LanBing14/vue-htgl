<template>
    <div>
        <Level1Title title="企业简介" />

        <el-form :model="form" ref="form" label-width="0">
            <el-form-item
                prop="info"
                :rules="[
                    { required: true, message: '不能为空'}
                ]"
            >
                <el-input
                    class="div-input"
                    type="textarea"
                    :rows="5"
                    placeholder="请输入内容"
                    v-model="form.info"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item class="taCenter">
                <el-button type="primary" size="small" @click="submitForm('form')">提交</el-button>
                <el-button size="small" @click="resetForm('form')">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import Level1Title from "../components/Level1Title";

export default {
    name: "CompanyInfo",
    components: {
        Level1Title
    },
    data() {
        return {
            textarea:
                "江苏未至科技股份有限公司，国家发改委首批综合信用服务试点机构，国家发改委“双公示”第三方评估机构，国家公共信用信息中心首批可为信用修复申请人出具信用报告的信用服务机构。公司基于信用信息化、大数据分析技术与云计算应用创建产品体系和解决方案，是一家面向各级政府、行业协会、企业机构等提供信用建设咨询规划及综合解决方案、信用管理服务、信用评价服务、金融交易服务、企业风险管理、信用修复培训等多维度综合信用服务商。砥砺十年，展望未来。未至科技坚持以“信用，引领商业智能”为目标，秉承诚信、协作、拼搏、创新的服务理念，为推动社会信用体系建设快速发展做出自己的贡献。",
            form: {
                info: ""
            }
        };
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    alert("submit!");
                } else {
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
};
</script>

<style scoped lang="scss">
.div-input {
    font-size: 14px;
    color: #333333;
    line-height: 28px;
}
</style>
