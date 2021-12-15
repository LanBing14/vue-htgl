<template>
<div class="page-head-wrap">
    <div class="title-infos">
        <div class="title">
            <span class="titleText">{{ titleText }}</span>
<!--            <breadcrumb class="breadcrumb-container"/>-->
        </div>
        <div class="actions">
            <el-button
                v-for="(el, $index) in actionBtns"
                :key="$index"
                :icon="'icon iconfont '+ el.icon"
                :type="el.type || 'primary'"
                class="filter-item"
                plain
                @click="el.click"
            >
                {{ el.text }}
            </el-button>
        </div>
    </div>
    <div class="filter-container">
        <slot/>
    </div>
</div>
</template>

<script>
    // import Breadcrumb from '@/components/Breadcrumb'

    export default {
        name: 'PageHead',
        components: {
            // Breadcrumb
        },
        props: {
            title: {
                type: String,
                default: undefined
            },
            actionBtns: {
                type: Array,
                default: undefined
            }
        },
        computed: {
            titleText() {
                const {title} = this.$route.meta;
                return this.title || title
            }
        }
    }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
    @import '../../styles/element-variables.scss';

    .page-head-wrap {
        padding: 0 20px 0px;
    }

    .title-infos {
        height: 72px;
        line-height: 72px;
        font-size: 0;

        &::after {
            content: '';
            display: block;
            clear: both;
        }
    }

    .title {
        float: left;
        padding-left: 25px;
        .titleText{
            float: left;
            font-size: 20px;
            margin-right: 15px;
        }
    }

    .actions {
        float: right;
    }
    .filter-container{
        /deep/ .el-input, /deep/ .el-select{
            overflow: hidden;
            input{
                float: left;
                height: 30px;
                line-height: 30px;
            }
        }
    }
</style>
