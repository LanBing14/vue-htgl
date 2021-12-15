<template>
    <div>
        <div class="paper-content" v-for="(item, index) in list" :key="index">
            <h3>
                <span class="order">{{ index + 1 }}</span>
                {{ item.name }}
            </h3>
            <div style="margin-left: 32px;">
                <ul>
                    <li v-for="(i, idx) in item.options" :key="idx">
                        {{ i.optionOrder }}. {{ i.optionName }}
                    </li>
                </ul>
                <div style="padding-left: 29px;">
                    <Child :row="item.options" :order="index" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Child from "./Child";

export default {
    name: "MCQ",
    components: {
        Child
    },
    props: {
        list: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {};
    },
    created() {},
    mounted() {},
    methods: {}
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
