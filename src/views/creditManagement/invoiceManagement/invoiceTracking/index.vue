<template>
    <div>
        <Main v-if="!showDetail" @edit="onEdit"></Main>
        <Detail v-else-if="showDetail && flag === '0'" ref="ref_Detail" :selectData="selectData" @edit="onEdit"></Detail>
        <RecDetail v-else-if="showDetail && flag === '1'" ref="ref_RecDetail" :selectData="selectData" @edit="onEdit"></RecDetail>
        <RegDetail v-else-if="showDetail && flag === '2'" ref="ref_RegDetail" :selectData="selectData" @edit="onEdit"></RegDetail>
        <SigDetail v-else-if="showDetail && flag === '3'" ref="ref_SugDetail" :selectData="selectData" @edit="onEdit"></SigDetail>
        <BillingApp v-else-if="showDetail && flag === '4'" ref="ref_BillingApplication" :selectData="selectData" @edit="onEdit"></BillingApp>
    </div>
</template>

<script>
    import Main from "./Main";
    import Detail from "./Detail";
    import RecDetail from "./RecDetail";
    import RegDetail from "./RegDetail";
    import SigDetail from "./SigDetail";
    import BillingApp from "./BillingApp";

    export default {
        name: "InvoiceList",
        components: {Main, Detail, RecDetail, RegDetail, SigDetail, BillingApp},
        data() {
            return {
                showDetail: false,
                selectData: {},
                flag: ''
            };
        },
        methods: {
            onEdit(showDetail, row, flag) {
                this.showDetail = showDetail;
                this.selectData = row;
                this.flag = flag
            }
        }
    };
</script>

<style scoped>
    .text-blue {
        color: #4a9df2;
    }
</style>
