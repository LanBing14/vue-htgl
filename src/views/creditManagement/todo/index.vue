<template>
    <div style="padding-top: 1px;">
        <Main
            ref="ref_main"
            :header="header"
            :activeName="activeName"
            :current-pages="currentPages"
            v-if="!editing"
            @edit="onEdit"
        ></Main>
    </div>
</template>

<script>
import Main from "./Main";
import {
    Api_AgencyMattersDeal,
    Api_AgencyMattersReject,
    Api_AgencyMattersGetAuditPage
} from "@/api/creditManagement/todo/index";

export default {
    name: "Todo",
    components: {
        Main
    },
    props: {
        header: {
            // 是否显示tabs头
            type: Boolean,
            default: true
        },
        activeName: {
            // 控制显示tab
            type: String,
            default: ""
        }
    },
    data() {
        const createRules = this.$createRules;
        return {
            editing: false, // 是否处于编辑页面
            modelStatus: true, // 是处理或查看
            formKey: "", // 0、1、2，对应“合同签订审批”、“合同变更审批”、“授信额度审批”
            curRowData: {},
            currentPages: {
                currentPage1: 1,
                currentPage2: 1,
                currentPage3: 1
            }
        };
    },
    methods: {
        // 编辑中，处理或查看，当前行数据
        onEdit(editing, modelStatus, formKey, row) {
            this.$emit("dealing", false, editing, modelStatus, formKey, row);

            // this.modelStatus = modelStatus;
            // this.curRowData = row;
            // if (editing) {
            //     this.currentPages = this.$refs.ref_main.getCurrentPage();
            //     if (!formKey) {
            //         this.$message.warning("该流程缺少formKey！");
            //         return;
            //     }
            //     if (!Object.keys(compKeys).includes(formKey)) {
            //         this.$message.warning(`formKey配置错误：${formKey}`);
            //         return;
            //     }
            //     this.editing = true;
            //     this.formKey = formKey;
            //     this.$emit("dealing", true, editing, modelStatus, formKey, row);
            // } else {
            //     this.editing = false;
            //     this.formKey = "";
            //     this.$emit("dealing", false, editing, modelStatus, formKey, row);
            // }
            // if (row) {
            //     this.getSignList(row);
            // }
        }
    }
};
</script>

<style scoped lang="scss">
/deep/ {
    .area {
        background-color: rgba(51, 153, 230, 0.2);
        margin: 0 0px 22px -36px;
        padding: 10px 0px 10px 36px;
        border: 1px solid rgba(51, 153, 230, 0.2);

        & > .el-col {
            position: relative;
        }

        .el-form-item {
            margin-bottom: 0;

            /deep/ .el-form-item__label {
                font-size: 12px;
                padding-right: 0;
            }
        }

        .area-btn {
            position: absolute;
            left: 60%;
            font-size: 16px;
            line-height: 1.5;
            text-align: left;
            top: 50%;
            transform: translate(-50%, -50%);
        }
    }

    .btns {
        margin-bottom: 20px;
        text-align: center;
    }

    .unit-number {
        color: #333;
    }

    .el-form-item__content {
        color: #666666;
    }
}
/deep/ .page-header {
    margin-top: 25px;
}
</style>
