<template>
<el-dialog
    :visible.sync="visible"
    title="图标"
    width="1000px"
    @close="onClose"
>
    <ul class="icon-list">
        <li v-for="(el, index) in iconData"
            :key="el"
            :class="selectIcon | filterSelectClass(el)"
            @click="handleSelect(el, index)"
        >
        <span>
            <i :class="'icon iconfont ' + el"/>
            <span class="icon-name">{{ el }}</span>
        </span>
        </li>
    </ul>
    <div
        slot="footer"
        class="dialog-footer">
        <el-button @click="visible=false">关闭</el-button>
        <el-button
            type="primary"
            @click="handleSure()">确认
        </el-button>
    </div>
</el-dialog>

</template>

<script>
    import iconData from './iconData';

    export default {
        name: 'IconSelect',
        filters: {
            filterSelectClass: function (selectIcon, eachName) {
                if (selectIcon === eachName) {
                    return 'active'
                }
            }
        },
        data() {
            return {
                visible: false,
                iconData,
                selectIcon: undefined
            }
        },
        methods: {
            openModel() {
                this.visible = true;
            },
            handleSure() {
                this.visible = false;
                this.$emit('handleOk', this.selectIcon)
            },
            handleSelect(iconName, index) {
                this.selectIcon = iconName
            },
            onClose() {

            }
        }
    }
</script>

<style scoped lang="scss">
    ul.icon-list {
        overflow: hidden;
        list-style: none;
        padding: 0;
        border: 1px solid #eaeefb;
        border-radius: 4px;
        border-right: none;

        li {
            float: left;
            width: 12.5%;
            text-align: center;
            height: 120px;
            line-height: 120px;
            color: #666;
            font-size: 13px;
            border-right: 1px solid #eee;
            border-bottom: 1px solid #eee;
            -webkit-transition: all .2s linear;
            -moz-transition: all .2s linear;
            -ms-transition: all .2s linear;
            -o-transition: all .2s linear;
            transition: all .2s linear;
            cursor: pointer;

            &:hover {
                background-color: #e6f7ff;
            }

            &.active {
                background-color: #e6f7ff;
            }

            &::after {
                display: inline-block;
                content: "";
                height: 100%;
                vertical-align: middle;
            }

            span {
                display: inline-block;
                line-height: normal;
                vertical-align: middle;
                font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
                color: #99a9bf;
            }

            i {
                display: block;
                font-size: 32px;
                margin-bottom: 15px;
                color: #606266;
            }

            .icon-name {
                display: inline-block;
                padding: 0 3px;
                height: 1em;
                color: #606266;
            }
        }
    }
</style>
