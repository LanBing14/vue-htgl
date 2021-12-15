<template>
    <div class="nav-container">
        <!-- 头像、信息 -->
        <div class="nav-top marB20 bgWhite taCenter">
            <div class="img-box">
                <img src="@/assets/images/creditFiling/cat.gif" alt width="86" height="86" />
            </div>
            <div
                class="font14"
                style="color: #032c59; margin: 8px 0 5px 0;"
            >企业信用名片企业信用名片企业信用名片企业信用名片</div>
            <div class="font12" style="color: rgba(3,44,89,.5);">913205006978992544</div>
        </div>

        <!-- 导航 -->
        <ul>
            <li
                :class="['ico' + index, {'active': $route.path.indexOf(item.url)>=0 }]"
                :key="item.index"
                @click="changeClass(item)"
                v-for="(item, index) in userNavList"
            >
                <div class="name">{{ item.name }}</div>
                <div class="filing-nav-submenu">
                    <div
                        class="filing-suba"
                        v-for="(iitem,iindex) in item.child"
                        :key="iindex"
                        :class="[{'act': $route.path.indexOf(iitem.url)>=0 }]"
                    >
                        <a :index="iitem.url">{{ iitem.name }}</a>
                    </div>
                </div>
            </li>
        </ul>
    </div>
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
            showSub: false,
            userNavList: [
                {
                    name: "企业信用名片",
                    url: "/companyFiling/creditCard"
                },
                {
                    name: "企业资料清单",
                    url: "/companyFiling/dataList",
                    hasSub: true,
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
                    url: "/companyFiling/training",
                    hasSub: true,
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
    watch: {
        $route(to) {
            // 对路由变化作出响应...
        }
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

<style lang="scss" scoped>
.nav-top {
    padding: 20px;

    .img-box {
        border-radius: 50%;
        width: 86px;
        height: 86px;
        margin: 0 auto;
    }
}

.nav-container {
    overflow: hidden;
    width: 180px;

    .user-header {
        margin-bottom: 20px;
        padding: 13px;
        background-color: #dadeea;
        text-align: center;

        .imgBox {
            margin: 0 auto;
            overflow: hidden;
            width: 100px;
            height: 100px;
            border-radius: 50%;
        }

        h4 {
            margin: 0;
            margin-top: 13px;
            margin-bottom: 5px;
            color: #032c59;
        }

        p {
            margin: 0;
            font-size: 12px;
            color: #8b96ab;
        }
    }

    ul {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    li {
        a {
            display: block;
        }

        .name {
            padding-left: 62px;
            height: 60px;
            line-height: 60px;
            background-color: #fff;
            font-weight: bold;
            color: #5f7b9a;
        }

        &:hover .name,
        &.active .name {
            cursor: pointer;
            color: #fff;
            background-color: #4b9df3 !important;
        }

        $positionX: 39px;
        @each $ico,
            $positionY
                in (
                    0: 26px,
                    1: -35px,
                    2: -98px,
                    3: -159px,
                    4: -220px,
                    5: -280px
                )
        {
            &.ico#{$ico} .name {
                background: #ffffff
                    url(../../../assets/images/creditFiling/nav-ico.png)
                    no-repeat
                    $positionX
                    $positionY;

                &:hover .name,
                &.active .name {
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

.filing-nav-submenu {
    display: none;
    font-size: 12px;
    color: #032c59;
    background-color: #eaedf4;

    .filing-suba {
        height: 60px;
        line-height: 60px;
        padding-left: 62px;

        &.act {
            background-color: #d6dcec;
        }
    }
}
</style>
