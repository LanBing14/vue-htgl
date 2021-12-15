<template>
    <section>
        <div class="header flex">
            <div class="flex-primary">
                <span class="title">常用功能</span>
            </div>
            <!--            <div>-->
            <!--                <el-button type="text" @click="setup">设置</el-button>-->
            <!--            </div>-->
        </div>
        <div class="content flex v-center">
            <div v-for="(el, index) in tags" :key="index" class="item" @click="toPage(el)">
                <img :src="el.icon" alt />
                <span>{{ el.label }}</span>
            </div>
        </div>
    </section>
</template>

<script>
import g1 from "../../../assets/images/home/g-1.png";
import g2 from "../../../assets/images/home/g-2.png";
import g3 from "../../../assets/images/home/g-3.png";
import g4 from "../../../assets/images/home/g-4.png";
import g5 from "../../../assets/images/home/g-5.png";

export default {
    name: "Section2",
    data() {
        return {
            tags: [
                {
                    label: "新增客户",
                    name: "customerManagement",
                    icon: g1,
                    query: { new: true }
                },
                {
                    label: "新增合同",
                    name: "contractLedger",
                    icon: g2,
                    query: { new: true }
                },
                {
                    label: "新增订单",
                    name: "orderManagement",
                    icon: g3,
                    query: { new: true }
                },
                {
                    label: "授信申请",
                    name: "creditApplication",
                    icon: g5,
                    query: { new: true }
                },
                {
                    label: "收款登记",
                    name: "receiptRecords",
                    icon: g4,
                    query: { new: true }
                }
            ]
        };
    },
    methods: {
        toPage(el) {
            this.$router.push({
                name: el.name,
                query: el.query
            });
        },
        setup() {}
    }
};
</script>

<style scoped lang="scss">
/*@import '~@/styles/element-variables.scss';*/

.content {
    height: 80px;
    background-color: #f7f8fb;
    justify-content: space-between;

    .item {
        cursor: pointer;
        padding: 10px 50px 10px 20px;

        span {
            font-size: 18px;
            vertical-align: middle;
        }

        img {
            vertical-align: middle;
            margin-right: 12px;
        }

        &:hover {
            color: $--color-primary;
            /*color: $--color-primary;*/
        }
    }
}
</style>
