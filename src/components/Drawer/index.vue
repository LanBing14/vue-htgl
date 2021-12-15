<template>
    <div
        :class="drawerWrapClassObj"
        :style="{ zIndex: zIndex }"
        class="drawer-wrap"
    >
        <div
            v-if="mask"
            :style="maskStyle"
            class="drawer-mask"
            @click="maskClose ? handleMackClick() : null"
        />
        <div
            :style="[drawerContentWrapperStyle, transformProp, bodyStyle]"
            class="drawer-content-wrapper"
        >
            <div class="drawer-content">
                <div class="drawer-wrapper-body">
                    <div class="drawer-header">
                        <div class="drawer-title">
                            {{ title }}
                        </div>
                        <div class="drawer-actions">
                            <template v-if="btn.length && !onlyCloseBtn">
                                <el-button
                                    v-for="(el, index) in btn"
                                    :key="index"
                                    :type="el.type"
                                    style="margin-left: 10px"
                                    @click="el.click()"
                                >
                                    {{ el.text }}
                                </el-button>
                            </template>
                            <template v-else>
                                <el-button @click="handleCancel()">
                                    关闭
                                </el-button>
                                <el-button
                                    v-if="!onlyCloseBtn"
                                    type="primary"
                                    @click="handleOk()"
                                >
                                    确定
                                </el-button>
                            </template>
                        </div>
                    </div>
                    <div class="drawer-body">
                        <el-scrollbar>
                            <slot/>
                        </el-scrollbar>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {wordTips} from "@/utils/variables";

    export default {
        name: "Drawer",
        props: {
            title: {
                type: String,
                default: () => "标题"
            },
            width: {
                type: String,
                default: () => ""
            },
            height: {
                type: String,
                default: () => "400px"
            },
            fullscreen: Boolean,
            visible: {
                type: Boolean,
                default: () => null
            },
            // 按钮数组
            btn: {
                type: Array,
                default: () => []
                // []
            },
            // 可用于设置 Drawer 的样式，调整浮层位置等
            bodyStyle: {
                type: Object,
                default: () => ({})
            },
            // 设置 Drawer 的 z-index
            zIndex: {
                type: String,
                default: () => ""
            },
            // 是否显示右上角的叉号
            closable: {
                type: Boolean,
                default: () => true
            },
            // 抽屉方向
            placement: {
                type: String,
                default: () => "right"
            },
            // 是否显示遮罩
            mask: {
                type: Boolean,
                default: () => true
            },
            maskStyle: {
                type: Object,
                default: () => ({})
            },
            // 点击遮罩是否关闭
            maskClose: {
                type: Boolean,
                default: () => true
            },
            // 点击遮罩的提示，如果传了则代表使用confirm提示是否关闭
            maskConfirmTip: {
                type: String,
                default: () => 'drawerLeaveTip'
            },
            // 点击遮罩的回调
            maskClick: Function,
            // 传递过来的点击确认的方法
            onOk: {
                type: Function,
                default: () => null
            },
            // 是否只使用“关闭按钮”
            onlyCloseBtn: Boolean,
            // 是否开启esc关闭抽屉
            esc: {
                type: Boolean,
                default: () => true
            }
        },
        data() {
            return {
                selfVisible: false,
                drawerWrapPlacementClass: `'drawer-'${this.placement}`,
                placementArr: ["left", "top", "right", "bottom"] // 抽屉的显示位置方向
            };
        },
        computed: {
            showStatus: function () {
                if (this.visible === null) {
                    return this.selfVisible;
                }
                return this.visible;
            },
            // 抽屉最外层元素样式类名
            drawerWrapClassObj: function () {
                return [`drawer-${this.placement}`, {[`drawer-open`]: this.showStatus}];
            },
            // 抽屉主体内容内联样式属性
            drawerContentWrapperStyle: function () {
                const {placement} = this;
                let w = null;
                let h = null;
                if (placement === "left" || placement === "right") {
                    w = this.width;
                } else if (placement === "top" || placement === "bottom") {
                    h = this.height;
                }
                if (this.fullscreen) {
                    w = "100%";
                    h = "100%";
                }
                return {
                    width: w,
                    height: h
                };
            },
            // 计算位移方向
            transformProp: function () {
                const {placement, showStatus} = this;
                if (showStatus) {
                    return null;
                }
                let t = "translate";
                switch (placement) {
                    case "left":
                        t = "translateX(-100%)";
                        break;
                    case "right":
                        t = "translateX(100%)";
                        break;
                    case "top":
                        t = "translateY(-100%)";
                        break;
                    case "bottom":
                        t = "translateY(100%)";
                        break;
                    default:
                        break;
                }
                return {
                    transform: t
                };
            }
        },
        watch: {
            visible(isShow) {
                const bodyHidden = isShow ? "hidden" : "";
                document.body.style.overflow = bodyHidden;
                if (isShow) {
                    if (this.esc) {
                        this.bindEsc();
                    }
                } else {
                    if (this.esc) {
                        this.unbindEsc();
                    }
                }
            }
        },
        methods: {
            // 打开抽屉，适用于调用地方没有传入visible，通过方法调用的情况
            open() {
                if (this.hasVisibleProp()) {
                    this.selfVisible = true;
                }
            },
            // 遮罩click事件
            handleMackClick() {
                if (this.maskClick) {
                    const res = this.maskClick();
                    if (res && res.then) {
                        res.then(() => {
                            this.handleMaskClose();
                        });
                    } else if (res) {
                        this.handleMaskClose();
                    }
                } else {
                    this.handleMaskClose();
                }
            },
            handleMaskClose() {
                if (this.maskConfirmTip) {
                    this.$confirm(wordTips[this.maskConfirmTip], "提示", {
                        type: "warning"
                    }).then(() => {
                        this.close();
                    });
                } else {
                    this.close();
                }
            },
            // 确认
            handleOk() {
                if (this.onOk) {
                    this.onOk();
                } else {
                    if (this.hasVisibleProp()) {
                        this.selfVisible = false;
                    }
                    this.$emit("update:visible", false);
                }
            },
            // 关闭
            handleCancel() {
                this.close();
            },
            // 关闭抽屉
            close() {
                if (this.hasVisibleProp()) {
                    this.selfVisible = false;
                }
                this.$emit("close");
                this.$emit("update:visible", false);
            },
            // 判断是否传了visible属性
            hasVisibleProp() {
                return this.visible === null;
            },
            // 绑定esc关闭抽屉
            bindEsc() {
                document.addEventListener("keydown", this.handlerEsc, false);
            },
            unbindEsc() {
                document.removeEventListener("keydown", this.handlerEsc);
            },
            handlerEsc(e) {
                if (e.keyCode === 27) {
                    this.close();
                }
            }
        }
    };
</script>

<style rel="stylesheet/scss" lang="scss">
    .drawer-wrap {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        overflow: auto;
        z-index: 1000;
    }

    .drawer-wrap > * {
        -webkit-transition: -webkit-transform 0.3s cubic-bezier(0.9, 0, 0.3, 0.7);
        transition: -webkit-transform 0.3s cubic-bezier(0.9, 0, 0.3, 0.7);
        transition: transform 0.3s cubic-bezier(0.9, 0, 0.3, 0.7);
        transition: transform 0.3s cubic-bezier(0.9, 0, 0.3, 0.7),
        -webkit-transform 0.3s cubic-bezier(0.9, 0, 0.3, 0.7);
    }

    .drawer-mask {
        position: fixed;
        width: 100%;
        height: 0;
        opacity: 0;
        background-color: rgba(0, 0, 0, 0.65);
        filter: alpha(opacity=50);
        -webkit-transition: opacity 0.3s linear, height 0s ease 0.3s;
        transition: opacity 0.3s linear, height 0s ease 0.3s;
    }

    .drawer-open {
        -webkit-transition: -webkit-transform 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
        transition: -webkit-transform 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
        transition: transform 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
        transition: transform 0.3s cubic-bezier(0.7, 0.3, 0.1, 1),
        -webkit-transform 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
    }

    .drawer-wrap.drawer-open > .drawer-mask {
        opacity: 0.3;
        height: 100%;
        -webkit-animation: antdDrawerFadeIn 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
        animation: antdDrawerFadeIn 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
        -webkit-transition: none;
        transition: none;
    }

    .drawer-content {
        position: relative;
        background-color: #fff;
        border: 0;
        background-clip: padding-box;
        z-index: 1;
    }

    .drawer-wrap .drawer-content {
        width: 100%;
        height: 100%;
    }

    .drawer-header {
        min-height: 45px;
        padding: 0 24px;
        border-radius: 4px 4px 0 0;
        background: #fff;
        color: rgba(0, 0, 0, 0.65);
        border-bottom: 1px solid #e8e8e8;
        position: relative;

        .drawer-title {
            min-height: 44px;
            line-height: 44px;
        }

        .drawer-actions {
            float: right;
            position: absolute;
            top: 0;
            right: 10px;
            height: 45px;
            line-height: 45px;
        }
    }

    .drawer-body {
        height: calc(100% - 45px); /*减去头和尾高度*/
        font-size: 14px;
        line-height: 1.5;
        word-wrap: break-word;
        overflow: hidden;
    }

    .drawer-close {
        cursor: pointer;
        border: 0;
        background: transparent;
        position: absolute;
        right: 0;
        top: 0;
        z-index: 10;
        font-weight: 700;
        text-decoration: none;
        -webkit-transition: color 0.3s;
        transition: color 0.3s;
        color: rgba(0, 0, 0, 0.45);
        outline: 0;
        padding: 0;
        display: block;
        font-style: normal;
        text-align: center;
        text-transform: none;
        text-rendering: auto;
        width: 44px;
        height: 44px;
        line-height: 44px;
        font-size: 16px;
    }

    .drawer-content-wrapper {
        position: fixed;
        min-width: 450px;
        width: 35%;
    }

    @media screen and (min-width: 1026px) {
        .drawer-content-wrapper {
            width: 50%;
        }
    }

    @media screen and (min-width: 1366px) {
        .drawer-content-wrapper {
            width: 40%;
        }
    }

    @media screen and (min-width: 1920px) {
        .drawer-content-wrapper {
            width: 35%;
        }
    }

    .mobile .drawer-content-wrapper {
        min-width: 100%;
    }

    .drawer-left,
    .drawer-right {
        width: 0%;
        height: 100%;
    }

    .drawer-top,
    .drawer-bottom {
        width: 100%;
        height: 0%;
    }

    .drawer-right .drawer-content-wrapper {
        right: 0;
    }

    .drawer-bottom .drawer-content-wrapper {
        bottom: 0;
    }

    .drawer-right.drawer-open .drawer-content-wrapper {
        -webkit-box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
        box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
    }

    .drawer-left .drawer-content-wrapper,
    .drawer-right .drawer-content-wrapper {
        height: 100%;
    }

    .drawer-top .drawer-content-wrapper,
    .drawer-bottom .drawer-content-wrapper {
        width: 100%;
    }

    .drawer-wrapper-body {
        height: 100%;
    }

    .drawer-footer {
        position: absolute;
        bottom: 0;
        padding: 10px 20px;
        text-align: right;
        width: 100%;
    }

    .drawer-footer .el-button + .el-button {
        margin-left: 10px;
    }

    .drawer-body .el-scrollbar {
        height: 100%;
    }

    .drawer-body .el-scrollbar__wrap {
        overflow-x: hidden;
    }

    .drawer-body .el-scrollbar__view {
        padding: 24px;
    }
</style>
