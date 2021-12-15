<template>
<el-dropdown
    :placement="placement"
    :trigger="trigger"
    :hideOnClick="hideOnClick"
>
  <span class="el-dropdown-link">
    {{ text }}<i class="el-icon--right" :class="['el-icon-arrow-'+iconDir]"></i>
  </span>
    <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
            v-for="(el,index) in items"
            :key="index"
            :disabled="el.disabled"
        >
            <div class="item-text" @click="el.click&&el.click(row)">
                <i v-if="el.icon" class="iconfont " :class="el.icon"></i>
                {{ el.label }}
            </div>
        </el-dropdown-item>
    </el-dropdown-menu>
</el-dropdown>
</template>

<script>
    export default {
        name: 'DropdownMenu',
        props: {
            // 当前行的数据
            row: Object,
            // 主要显示的按钮
            text: {
                type: String,
                default: () => '操作'
            },
            // 下拉的每一个内容,items:[{label:'xxx',click:fn,disabled:false,icon:'xxx'}]
            items: {
                type: Array,
                default: () => []
            },
            // 是否带有图标
            icon: {
                type: Boolean,
                default: () => true
            },
            // 图标方向
            iconDir: {
                type: String,
                default: () => 'down'
            },
            // 下拉的方向，可选值top/top-start/top-end/bottom/bottom-start/bottom-end
            placement: {
                type: String,
                default: () => 'bottom-end'
            },
            // 触发下拉的行为
            trigger: {
                type: String,
                default: () => 'hover'
            },
            // 是否在点击菜单项后隐藏菜单
            hideOnClick: {
                type: Boolean,
                default: () => false
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '~@/styles/element-variables.scss';

    .el-dropdown-menu {
        min-width: 85px;
        z-index: 100 !important;

        .item-text {
            text-align: center;
        }
    }

    .el-dropdown-link {
        cursor: pointer;
        color: $--color-primary;

        .el-icon--right {
            color: inherit;
        }
    }
</style>
