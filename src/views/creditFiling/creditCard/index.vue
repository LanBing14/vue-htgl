<template>
    <div>
        <div class="line">
            <CompanyInfo />
        </div>
        <div class="line">
            <Contact />
        </div>
        <div class="line">
            <ProductAndService />
        </div>
        <div class="line">
            <Honor />
        </div>
        <div class="line">
            <History />
        </div>
        <div class="line">
            <Notice />
        </div>
    </div>
</template>

<script>
import CompanyInfo from "./CompanyInfo";
import Contact from "./Contact";
import ProductAndService from "./ProductAndService";
import Honor from "./Honor";
import History from "./History";
import Notice from "./Notice";

export default {
    name: "CreditCard",
    components: {
        CompanyInfo,
        Contact,
        ProductAndService,
        Honor,
        History,
        Notice
    },
    computed: {}
};
</script>

<style scoped lang="scss">
@import "@/styles/creditFiling.scss";

.line {
    padding-bottom: 30px;
    margin-bottom: 30px;
    border-bottom: 1px solid #ebebeb;
}
</style>
