<template>
    <el-row>
        <div class="filing-tool">
            <h3>企业基本信息</h3>
        </div>
        <el-form
            class="filing-form"
            label-width="160px"
            label-position="left"
            :model="formLabelAlign"
        >
            <el-row :gutter="35">
                <el-col :span="11">
                    <el-form-item label="统一社会信用代码"></el-form-item>
                    <el-form-item label="工商注册号"></el-form-item>
                    <el-form-item label="注册资本"></el-form-item>
                    <el-form-item label="登记机关"></el-form-item>
                    <el-form-item label="成立日期"></el-form-item>
                    <el-form-item label="核准日期"></el-form-item>
                    <el-form-item label="人员规模"></el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="法定代表人"></el-form-item>
                    <el-form-item label="组织机构代码"></el-form-item>
                    <el-form-item label="企业类型"></el-form-item>
                    <el-form-item label="经营状态"></el-form-item>
                    <el-form-item label="经营期限"></el-form-item>
                    <el-form-item label="所属行业"></el-form-item>
                    <el-form-item label="参保人数"></el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="企业地址"></el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="经营范围"></el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </el-row>
</template>

<script>
import { getUserInfo } from "@/utils/auth";

export default {
    name: "BasicInfo",
    components: {},
    data() {
        return {
            userInfo: getUserInfo(),
            formLabelAlign: {
                name: "",
                region: "",
                type: ""
            }
        };
    },
    mounted() {},
    methods: {
        changeClass(item) {
            this.$router.push({
                path: item.url
            });
        }
    }
};
</script>
