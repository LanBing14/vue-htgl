<template>
    <el-row>
        <el-col :span="24">
            <el-menu default-active="1" class="filing-menu" router>
                <div v-for="(litem,lindex) in userNavList" :key="lindex">
                    <el-submenu v-if="litem.child" :index="litem.url">
                        <template slot="title">
                            <i :class="'el-icon-' + lindex"></i>
                            <span>{{ litem.name }}</span>
                        </template>
                        <el-menu-item-group v-for="(iitem,iindex) in litem.child" :key="iindex">
                            <el-menu-item :index="iitem.url">{{ iitem.name }}</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>

                    <el-menu-item v-else :index="litem.url">
                        <i :class="'el-icon-' + lindex"></i>
                        <span slot="title">{{ litem.name }}</span>
                    </el-menu-item>
                </div>
            </el-menu>
        </el-col>
    </el-row>
</template>

<script>
import { getUserInfo } from "@/utils/auth";

export default {
    name: "Nav",
    components: {},
    data() {
        return {
            userInfo: getUserInfo(),
            current: 0,
            userNavList: [
                {
                    name: "企业信用名片",
                    url: "/companyFiling/creditCard"
                },
                {
                    name: "企业资料清单",
                    url: "/companyFiling/dataList",
                    child: [
                        {
                            name: "企业基本信息",
                            url: ""
                        },
                        {
                            name: "生产经营信息-S1",
                            url: ""
                        },
                        {
                            name: "生产经营信息-S2",
                            url: ""
                        }
                    ]
                },
                {
                    name: "I类资料上传",
                    url: "/companyFiling/training"
                },
                {
                    name: "II类资料上传",
                    url: "/companyFiling/contract"
                },
                {
                    name: "企业展示授权",
                    url: "/companyFiling/order"
                },
                {
                    name: "企业资料及附件",
                    url: "/companyFiling/message"
                }
            ]
        };
    },
    methods: {
        changeClass(item) {
            this.$router.push({
                path: item.url
            });
        }
    }
};
</script>

<style lang="scss">
.filing-menu {
    li {

        $positionX: 4px;

        @each $ico,
            $positionY
                in (
                    0: 7px,
                    1: -54px,
                    2: -115px,
                    3: -176px,
                    4: -237px,
                    5: -298px
                )
        {
            .el-icon-#{$ico} {
                height: 24px;
                background: #ffffff
                    url(../../../assets/images/creditFiling/nav-ico.png)
                    no-repeat
                    $positionX
                    $positionY;
            }
        }

        &:hover,
        &.active {
            cursor: pointer;
            color: #fff;
            background-color: #4b9df3 !important;

            @each $ico,
                $positionY
                    in (
                        0: 7px,
                        1: -54px,
                        2: -115px,
                        3: -176px,
                        4: -237px,
                        5: -298px
                    )
            {
                .el-icon-#{$ico} {
                    background: #4b9df3
                        url(../../../assets/images/creditFiling/nav-ico-act.png)
                        no-repeat
                        $positionX
                        $positionY;
                }
            }
        }
    }
}
</style>
