<template>
    <div class="container">
        <div class="item-container" v-for="(item, index) in col" :key="index">
            <div class="item-content" :style="{'background-image':'url('+colors[index%4].bg+')'}">
                <div class="title">{{ item.title }}</div>
                <div
                    class="text"
                    :style="{'color':colors[index%4].text}"
                >{{ item.isMoney?($toMoney(res[item.key])):res[item.key] }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import lightBlue from "@/assets/images/creditManagement/light-blue.png";
import lightGreen from "@/assets/images/creditManagement/light-green.png";
import lightYellow from "@/assets/images/creditManagement/light-yellow.png";
import lightPurple from "@/assets/images/creditManagement/light-purple.png";

export default {
    name: "HeadStatistics",
    props: {
        col: { type: Array, default: () => [] },
        fn: { type: Function, default: () => null }
    },
    data() {
        return {
            res: {},
            colors: [
                { bg: lightBlue, text: "#409EFF" },
                { bg: lightGreen, text: "#67C23A" },
                { bg: lightYellow, text: "#E6A23C" },
                { bg: lightPurple, text: "#2b84dd" }
            ]
        };
    },
    mounted() {
        this.getData();
    },
    methods: {
        getData() {
            this.fn().then(res => {
                this.res = res;
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.container {
    display: flex;
    margin: 0 -10px 22px;

    .item-container {
        // flex: 0 20%;
        // dayu修改
           flex:0 19%;
        // 修改结束
        padding: 0 10px;

        .item-content {
            height: 95px;
            padding: 20px;

            .title {
                font-size: 14px;
            }

            .text {
                font-size: 21px;
                padding-top: 18px;
            }

            background-repeat: no-repeat;
            background-position:0 -39px;
            
        }
    }
}
</style>
