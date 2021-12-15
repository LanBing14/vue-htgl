<template>
    <el-button
        v-if="!isIcon"
        :type="type"
        :size="size"
        @click="click(row)">
        <i
            v-if="iconClass"
            :class="iconClass"
            class="iconfont "/>
        {{ text }}
    </el-button>
    <el-tooltip
        v-else
        :content="text"
        class="item"
        effect="dark"
        placement="top">
        <i
            v-if="iconType==='icon'"
            :class="iconClass"
            @click="click(row)"
            class="iconfont "
            style="cursor:pointer;"
            :style="{color:iconColor}"
        />
        <img v-else src="" alt="">
    </el-tooltip>
</template>

<script>
    export default {
        props: {
            isIcon: { // 是否是以图标列表显示按钮
                type: Boolean,
                default: () => true
            },
            iconType: { // 图标的类型，可以是icon/image
                type: String,
                default: () => 'icon'
            },
            iconColor: { // 是icon时的颜色
                type: String,
                default: () => 'inherit'
            },
            iconUrl: { // 是image时的url
                type: String,
                default: () => ''
            },
            iconClass: { // 图标的类名
                type: String,
                default: () => ''
            },
            row: { // 当前拿到的数据
                type: Object,
                default: () => {
                }
            },
            text: { // 显示的文本
                type: String,
                default() {
                    return '操作';
                }
            },
            size: { // 大小
                type: String,
                default() {
                    return '';
                }
            },
            type: { // 是按钮时的按钮类型
                type: String,
                default() {
                    return 'primary';
                }
            },
            click: Function // 点击事件回调
        }
    };
</script>

<style scoped>

</style>
