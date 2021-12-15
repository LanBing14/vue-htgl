<template>
    <section>
        <div v-if="!dealing" class="header flex todoTabs">
            <div style="width:100%" class="clearfix">
                <div class="fixed-width fl">
                    <span class="title">工作事项</span>
                </div>
                <div class="fr">
                    <el-tabs v-model="activeName" class="flex-primary btns">
                        <el-tab-pane :label="approveByMe" name="todo"></el-tab-pane>
                        <el-tab-pane :label="hasApproval" name="done"></el-tab-pane>
                        <el-tab-pane :label="startByMe" name="my"></el-tab-pane>
                    </el-tabs>
                </div>

            </div>
        </div>
        <div class="content">
            <Todo :header="false" ref="ref_Todo" :activeName="activeName" @dealing="onDealing"></Todo>
        </div>
    </section>
</template>

<script>
import Todo from "../todo/index";
import {Api_credit} from "@/api/creditManagement/todo/index";
export default {
    name: "Section3",
    components: { Todo },
    data() {
        return {
            activeName: "todo",
            approveByMe: "待我审批",
            hasApproval: "我已审批",
            startByMe: "我发起的",
            dealing: false
        };
    },
    created() {
        Api_credit().then(res=>{
            this.approveByMe = "待我审批(" + res.todo + ")"
            this.hasApproval = "我已审批"
            this.startByMe = "我发起的"
        })
    },
    methods: {
        onDealing(flag, editing, modelStatus, formKey, row) {
            this.dealing = flag;
            this.$emit("handleEdit", editing, modelStatus, formKey, row);
        }
    }
};
</script>


<style  lang="scss">

.todoTabs{
    #tab-todo,#tab-done,#tab-my{
        width: 102px;
        height: 30px;
        background-color: #f7f8fb;
        color:#606266;
        border:1px solid #ebeef4;
        text-align: center;
        line-height: 30px;
    }
     #tab-todo,#tab-done{
         margin-right: 10px;
     }
    .el-tabs__item{
        padding: 0;
    }

    .is-active{
        background-color: #4b9df3!important;
        color:#fff!important;
        border-color:#4b9df3!important;
    }

    .btns{
        margin-top:-5px;
    }
}

</style>