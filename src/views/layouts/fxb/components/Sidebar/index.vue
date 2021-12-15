<template>
    <div class="menu-wrap">
        <el-menu
            ref="menu"
            :show-timeout="200"
            :default-active="routerpath"
            :style="{width:menuWidth?menuWidth+'px':'auto'}"
            unique-opened
            text-color="#62676b"
            active-text-color="#fff"
        >
            <sidebar-item
                ref="sidebarItem"
                v-for="route in curRoutes"
                :key="route.path"
                :item="route"
                @reload="reload"
                :base-path="itemBasePath(route)"
            />
        </el-menu>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";

export default {
    components: { SidebarItem },
    props: {
        curRoutes: Array,
        basePath: String,
        textColor: String,
        activeTextColor: {
            type: String,
            default: () => "#fff"
        }
    },
    data() {
        return {
            menuWidth: ""
        };
    },
    computed: {
        ...mapGetters([
            // 'super_routers',
            "sidebar"
        ]),
        isCollapse() {
            return !this.sidebar.opened;
        },
        routerpath(){
            return this.$route.meta.GuidePath? this.$route.meta.JumpPath : this.$route.path
        }
    },
    watch: {
        // curRoutes () {
        //     const menu = this.$refs.menu
        //     const sidebarItems = this.$refs.sidebarItem
        //     const menuWrapWidth = parseFloat(this.getStyle(menu.$el, 'width'))
        //     let itemsWidth = 0
        //     sidebarItems.forEach(item => {
        //         const w = parseFloat(this.getStyle(item.$el, 'width'))
        //         itemsWidth += w
        //     })
        //     console.log(itemsWidth, menuWrapWidth)
        //     if (itemsWidth > menuWrapWidth) {
        //         this.menuWidth = itemsWidth
        //     }
        // }
    },
    methods: {
        itemBasePath(route) {
            if (route.children && route.children.length) {
                return this.basePath + "/" + route.path;
            } else {
                return this.basePath;
            }
        },
        reload() {
            this.$emit('reload')
        }
    }
};
</script>
<style rel="stylesheet/scss" scoped lang="scss">
#app .menu-wrap {
    /deep/ .el-submenu.is-active {
        & > div.el-submenu__title {
            background-color: transparent;
            position: relative;
            color: $--color-primary !important;

            .icon {
                color: $--color-primary;
            }

            // &::before {
            //   content: "";
            //   display: block;
            //   position: absolute;
            //   left: 0;
            //   width: 3px;
            //   height: 100%;
            //   background-image: linear-gradient(to bottom, #417ff1, #55fff8);
            // }
        }
    }

    /deep/.el-menu-item {
        height: 50px;
        line-height: 50px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        i {
            color: #b7c5d6;
        }

        .svg-icon {
            fill: #b2c0ce;
        }
    }

    /deep/ {
        .el-menu-item.is-active {
            background-color: $--color-primary;
            position: relative;

            i {
                color: #fff;
            }
        }
        .el-menu-item:focus,
        .el-menu-item:hover {
            color: #fff !important;
            background-color: $--color-primary;

            i {
                color: #fff;
            }
        }
    }
}

/deep/ .el-submenu__icon-arrow {
    right: 18px;
    margin-top: -5px;
}

.el-menu--horizontal .el-menu-item:not(.is-disabled):hover,
.el-menu--horizontal .el-menu-item:not(.is-disabled):focus {
    background-color: rgba(0, 0, 0, 0.1);
}

/deep/.el-submenu__title {
    height: 50px;
    line-height: 47px;
    color: #374a5d !important;
    font-size: 14px;
    padding-right: 40px;

    .svg-icon {
        fill: #b2c0ce;
    }
}
</style>
