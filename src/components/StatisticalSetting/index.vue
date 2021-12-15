<template>
    <div class="bg" v-loading="loading">
        <ScrollBtn ref="ref_ScrollBtn">
            <div class="container">
                <div class="item-container" v-for="(item, index) in res" :key="index">
                    <div
                        class="item-content"
                        :style="{'background':'url('+colors[index%4].bg+') no-repeat 0 / cover'}"
                    >
                        <div class="title">{{ item.name }}</div>
                        <div class="text" :style="{'color':colors[index%4].text}">
                            {{ item.name.indexOf('金额')!==-1?$toMoney(item.value):item.value }}
                            <span
                                style="font-size: 15px"
                            >{{item.name.indexOf('金额')!==-1?'元':''}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </ScrollBtn>
        <div class="set-icon" @click="setting">
            <i class="el-icon-setting" style="color: #c0c4cc"></i>
        </div>
        <Setting
            ref="ref_Setting"
            :editFn="editFn"
            :saveFn="saveFn"
            :getQuery="getQuery"
            @getData="getData"
        ></Setting>
    </div>
</template>

<script>
import Setting from "./Setting";
import lightBlue from "@/assets/images/creditManagement/light-blue.png";
import lightGreen from "@/assets/images/creditManagement/light-green.png";
import lightYellow from "@/assets/images/creditManagement/light-yellow.png";
import lightPurple from "@/assets/images/creditManagement/light-purple.png";
import ScrollBtn from "@/components/ScrollBtn/index.vue";

export default {
    name: "StatisticalSetting",
    components: { Setting, ScrollBtn },
    props: {
        getFn: [Function, Object],
        editFn: {type: Function, default: () => null},
        saveFn: {type: Function, default: () => null},
        getQuery: {type: Object, default: () => ({})}
    },
    data() {
        return {
            res: {},
            loading: false,
            colors: [
                { bg: lightBlue, text: "#409EFF" },
                { bg: lightGreen, text: "#67C23A" },
                { bg: lightYellow, text: "#E6A23C" },
                { bg: lightPurple, text: "#2b84dd" }
            ]
        };
    },
    methods: {
        getData() {
            if (typeof this.getFn === "function") {
                this.loading = true;
                this.getFn(this.getQuery).then(res => {
                    this.loading = false;
                    this.res = res;
                });
            } else {
                this.res = this.getFn;
            }
        },
        setting() {
            this.$refs.ref_Setting.setup();
        }
    }
};
</script>

<style lang="scss" scoped>
.bg {
    margin: 0 0 22px;
    position: relative;
    overflow: hidden;
    &:hover{
        .set-icon{
            opacity: 1;
        }
    }
    .set-icon {
        position: absolute;
        opacity: 0;
        transition: 0.2s;
        right: -8px;
        top: -8px;
        border-bottom-left-radius: 50rem;
        width: 45px;
        height: 45px;
        line-height: 45px;
        text-align: center;
        background-color: #fff;
        font-size: 18px;
        cursor: pointer;
    }
}

.container {
    display: flex;
    width: fit-content;

    .item-container {
        width: 248px;
        // float: left;
        margin: 0 10px;

        .item-content {
            padding: 22px 30px 30px;

            .title {
                font-size: 14px;
            }

            .text {
                font-size: 25px;
                padding-top: 33px;
            }
        }
    }

    .item-container:first-child {
        margin-left: 0;
    }

    .item-container:last-child {
        margin-right: 0;
    }
}
</style>
