<template>
    <Dialog ref="drawer" title="应收账款对账单" :visible.sync="visible" :btns="drawerBtns" width="1000px" :close="closeDialog">
        <el-form ref="form" label-width="140px">
            <el-form-item label="客户名称">{{ detailData.companyName }}</el-form-item>
            <el-form-item label="统一社会信用代码">{{ detailData.sassCode }}</el-form-item>
            <el-form-item label="账单期间">{{ detailData.time }}</el-form-item>
            <el-form-item label="账单生成时间">{{ detailData.createDate }}</el-form-item>
            <TableWrapper ref="child" :data="detailData.listInfo" :query="{}" :columns="tableCol" />
        </el-form>
    </Dialog>
</template>

<script>
export default {
    name: "BillPreview",
    data() {
        return {
            visible: false,
            detailData: {},
            drawerBtns: [
                {
                    text: "返回",
                    click: () => {
                        this.visible = false;
                    }
                }
            ],
            tableCol: [
                { label: "日期", key: "date" },
                { label: "类型", key: "type" },
                { label: "发票号/收款号", key: "code" },
                { label: "摘要", key: "summary" },
                { label: "增加金额", key: "addMoney" },
                { label: "收款金额", key: "receivableMoney" },
                { label: "折扣金额", key: "discountMoney" },
                { label: "余额", key: "balanceMoney" }
            ]
        };
    },
    methods: {
        open(res) {
            this.visible = true;
            this.detailData = res;
        },
        closeDialog() {
            this.visible = false;
        }
    }
};
</script>

<style>
</style>
