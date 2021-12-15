<template>
    <section>
        <div class="header flex todoTabs">
            <div class="clearfix" style="width:100%">
                <div class="fixed-width fl">
                    <span class="title">到期提醒</span>
                </div>
                <el-tabs v-model="activeName" class="fr">
                    <el-tab-pane :label="allTotal" name="0"></el-tab-pane>
                    <el-tab-pane :label="concatTotal" name="1"></el-tab-pane>
                    <el-tab-pane :label="orderTotal" name="2"></el-tab-pane>
                    <el-tab-pane :label="billTotal" name="3"></el-tab-pane>
                    <el-tab-pane :label="expiredTotal" name="4"></el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <div class="content">
            <el-tabs :value="activeName">
                <el-tab-pane label="全部" name="0">
                    <TableWrapper
                        ref="table0"
                        :fetchDataFn="Api_GetWarnPage"
                        :query="listQuery0"
                        :columns="tableCol"
                    />
                </el-tab-pane>
                <el-tab-pane label="合同预警" name="1">
                    <TableWrapper
                        ref="table1"
                        :fetchDataFn="Api_GetWarnPage"
                        :query="listQuery1"
                        :columns="tableCol"
                    />
                </el-tab-pane>
                <el-tab-pane label="订单预警" name="2">
                    <TableWrapper
                        ref="table2"
                        :fetchDataFn="Api_GetWarnPage"
                        :query="listQuery2"
                        :columns="tableCol"
                    />
                </el-tab-pane>
                <el-tab-pane label="账单预警" name="3">
                    <TableWrapper
                        ref="table3"
                        :fetchDataFn="Api_GetWarnPage"
                        :query="listQuery3"
                        :columns="tableCol"
                    />
                </el-tab-pane>
                <el-tab-pane label="已到期" name="4">
                    <TableWrapper
                        ref="table4"
                        :fetchDataFn="Api_GetWarnPage"
                        :query="listQuery4"
                        :columns="tableCol"
                    />
                </el-tab-pane>
            </el-tabs>
        </div>
    </section>
</template>

<script type="text/jsx">
import { Api_GetWarnPage,Api_warnNum } from "@/api/creditManagement/dashboard";

export default {
    name: "Section4",
    data() {
        return {
            activeName: "0",
            allTotal: "全部",
            concatTotal: "合同预警",
            orderTotal: "订单预警",
            billTotal: "账单预警",
            expiredTotal: "已到期",
            listQuery0: { type: "", deadLine: "" },
            listQuery1: { type: "0", deadLine: "" },
            listQuery2: { type: "1", deadLine: "" },
            listQuery3: { type: "2", deadLine: "" },
            listQuery4: { type: "", deadLine: "1" },
            tableCol: [
                {
                    label: "客户名称",
                    key: "companyName",
                    width:'200',
                    align: "left",
                    render: (h, data, row) => {
                        return (
                            <span class="canClick" onClick={this.$gotoCustomerDetail.bind(this, row.companyId)}>
                                {data}
                            </span>
                        );
                    }
                },
                {
                    label: "事项标题",
                    key: "title",
                    align: "left",
                    width:'320',
                    render: (h, data, row) => {
                        let fn = null;
                        if (row.type === "0") {
                            fn = this.$gotoContractDetail.bind(this, row.id);
                        } else if (row.type === "1") {
                            fn = this.$gotoOrderDetail.bind(this, row.id);
                        } else if (row.type === "2") {
                            fn = this.$gotoReceivablesDetail.bind(this, row.id);
                        }
                        return (
                            <span class="canClick" onClick={fn}>
                                {data}
                            </span>
                        );
                    }
                },
                {
                    label: "消息类型",
                    key: "type",
                    render: (h, data) => {
                        if (data === "0") {
                            return "合同预警";
                        } else if (data === "1") {
                            return "订单预警";
                        } else if (data === "2") {
                            return "账单预警";
                        }
                    }
                },
                { label: "到期时间", key: "endDate", width: 120 }
            ]
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.$refs.table0.fetchData();
            this.$refs.table1.fetchData();
            this.$refs.table2.fetchData();
            this.$refs.table3.fetchData();
            this.$refs.table4.fetchData();
        });
    },
    created(){
        Api_warnNum().then(res=>{
            this.allTotal= "全部(" + res.all +")"
            this.concatTotal= "合同预警(" + res.contract +")"
            this.orderTotal= "订单预警(" + res.order +")"
            this.billTotal= "账单预警(" + res.bill +")"
            this.expiredTotal= "已到期(" + res.overdue +")"
        })
    },

    methods: {
        Api_GetWarnPage
    }
};
</script>

<style scoped lang="scss">
.content {
    /deep/ .el-tabs__header {
        display: none;
    }
}
</style>


<style  lang="scss">
.todoTabs{
    #tab-0,#tab-1,#tab-2,#tab-3,#tab-4{
        width: 102px;
        height: 30px;
        background-color: #f7f8fb;
        color:#606266;
        border:1px solid #ebeef4;
        text-align: center;
        line-height: 30px;
    }
    #tab-0,#tab-1,#tab-2,#tab-3{
         margin-right: 10px;
     }
    .el-tabs__item{
        padding: 0;
    }

    .is-active{
        background-color: #4b9df3!important;
        color:#fff!important;
    }

    .btns{
        margin-top:-5px;
    }
}

</style>