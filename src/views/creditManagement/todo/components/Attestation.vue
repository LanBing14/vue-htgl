<template>
    <div>
        <div class="page-header">
            <h1 class="page-name">
                <span>{{ (info.createDate ? info.createDate.substr(0, 10) : '') + ' '+ (info.fddbrSfzh  ? info.fddbrXm :'' )+'-企业认证' }}</span>
            </h1>
            <div>
                <el-button @click="back">返回</el-button>
            </div>
        </div>
        <div class="page-content">
            <el-form ref="info" :model="info" label-width="150px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="企业名称">{{ info.name }}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="统一社会信用代码">{{ info.code ? info.code:   '-'  }}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="姓名">{{ info.fddbrXm  ? info.fddbrXm : '-' }}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="身份证号">{{ info.fddbrSfzh ?info.fddbrSfzh :  '-'}}</el-form-item>
                    </el-col>
                    <!-- <el-col :span="12">
                        <el-form-item label="手机号码">{{ mobile }}</el-form-item>
                    </el-col> -->
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="营业执照">
                            <div class="demo-image__preview" style="margin-top: 10px">
                                <el-image
                                    style="width: 200px; height: 120px"
                                    :src="info.wtsqsAtt"
                                    :preview-src-list="[info.wtsqsAtt]"
                                ></el-image>
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="授权委托书扫描件">
                            <div class="demo-image__preview" style="margin-top: 10px">
                                <el-image
                                    style="width: 200px; height: 120px"
                                    :src="info.yyzzAtt"
                                    :preview-src-list="[info.yyzzAtt]"
                                ></el-image>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <slot></slot>
        </div>
    </div>
</template>

<script>
import store from "@/store/index.js";
import { Api_EnterpriseCerthistory } from "@/api/creditManagement/todo/index.js";

export default {
    name: "Attestation",
    props: {
        modelStatus: Boolean,
        row: Object
    },
    data() {
        return {
            info: {},
            url_front: process.env.VUE_APP_BASE_API,
            mobile: store.state.user.userInfo.mobile
        };
    },
    mounted() {
        Api_EnterpriseCerthistory(this.row.business_key).then(res => {
            this.info = res;
        });
    },
    methods: {
        back() {
            this.$emit("edit", false);
        }
    }
};
</script>

<style>
</style>
