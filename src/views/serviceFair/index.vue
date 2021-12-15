<template>
    <div class="service_fair"> 
        <el-container style="background-color:#fff;">
            <el-header>
                <FxbHeader @reload="reload"/>
            </el-header>
            <div v-if="isRouterAlive">
                <div class="banner-wrap" style="width:100%;">
                    <img src="../../assets/images/serviceFair/bg-1.jpg" alt="">
                    <div class="font-wrap">
                        <span class="chinese-font">服务集市</span> <span class="xie"> / </span> <span class="eng-font">SERVICE FAIR</span>
                    </div>
                </div>
        
                <div class="main-conatent">
                    <div class="tab-wrap">
                        <div  
                            v-for="(tab,index) in tabs"
                            v-bind:key="index"
                            v-bind:class="['tab-item', { active: currentTab === index }]"
                            v-on:click="currentTab = index">
                            {{tab.name}}
                        </div>
                    </div>
                </div>
                <!--动态渲染组件 -->
                <keep-alive>
                    <component v-bind:is="currentTabComponent" class="tab"></component>
                </keep-alive>
            </div>
        </el-container>
    </div>
</template>

<script>
    import FxbHeader from "@/views/layouts/fxb/components/FxbHeader";
    import wuyeService from "./components/wuye/wuyeService"
    import qiye from "./components/qiye/qiye"
    import rencai from "./components/rencai/rencai"
    import zhineng from "./components/zhineng"
    export default {
        name: "service",
        components: {
            FxbHeader,
            // 物业服务
            wuyeService,
            // 企业
            qiye,
            // 人才
            rencai,
            //智能应用
            zhineng
        },
        data() {
         
            return {
                // 当前的tab
                currentTab:0,
                // 循环的tabs
                tabs:[
                    {
                        name: "物业服务",
                        component:wuyeService
                    },
                    {
                        name: "企业服务",
                        component:qiye
                    },
                    {
                        name: "人才服务",
                        component:rencai
                    },
                    {
                        name: "智能应用",
                        component:zhineng
                    }
                    
                ],
                isRouterAlive: true,
                visible: false,
            }
        },
        created(){

        },
        computed: {
          currentTabComponent: function() {
            return this.tabs[this.currentTab].component
          }
        },
        methods: {
            reload() {
                this.isRouterAlive = false;
                this.$nextTick(() => (this.isRouterAlive = true));
            }
        },
        // 离开路由之前执行的函数
        beforeRouteLeave(to, from, next) {
            this.scroll = document.querySelector(".el-scrollbar__wrap").scrollTop;
            this.$route.meta.keepAlive=false;
            next()
        },
        
        // 进入路由之前执行的函数
        beforeRouteEnter(to, from, next) {
            next(vm => {
              document.querySelector(".el-scrollbar__wrap").scrollTop = vm.scroll
            })
        },
    }
</script>

<style lang="scss" scoped>
.banner-wrap{
    position:relative;
     .font-wrap{
        position: absolute;
        bottom: 51px;
        width: 1200px;
        left: 50%;
        transform: translateX(-50%);
        color:#fff;
        .chinese-font{
            font-family: MicrosoftYaHei;
	        font-size: 60px;
        }
        .eng-font{
            font-family: MicrosoftYaHei;
	        font-size: 30px;
        }

        .xie{
            font-size: 30px;
            margin-left: 10px;
        }
    }
}
.main-conatent{
    .tab-wrap{
        width: 730px;
        margin:60px auto 48px;
        display:flex;
        justify-content: space-between;
        text-align:center;
        .tab-item{
            width: 178px;
            height: 40px;
            line-height: 40px;
            background-color: #f2f1f7;
            border-radius: 4px;
            font-family: MicrosoftYaHei;
            font-size: 20px;
            color: #666666;
            cursor: pointer;
        }

        .tab-item.active{
            background-color: #4b9df3;
            color: #fff;
        }
    }
} 
</style>

<style lang="scss">
.service_fair{
    .pro-item-title{
        font-size:20px;
        width: 1200px;
        margin:0 auto;
        padding-bottom: 24px;
        font-weight: bold;

        &>span{
            border-left:4px solid #4b9df3;
            padding-left: 10px;
        }
    }

    .chewei-content{
        position: relative;
        width: 1200px;
        height: 251px;
        background-color: #edf5fe;
        padding: 36px;
        margin:0 auto;
        .liucheng{
            display:flex;
            align-items: center;
        }
        .chewei-title{
            font-family: MicrosoftYaHei;
            font-size: 22px;
            font-stretch: normal;
            line-height: 22px;
            padding-bottom: 19px;
            letter-spacing: 0px;
            color: #333333;
        }

        .chewei-tips{
            color:#606266;
            font-size:14px;
            padding-bottom: 30px;
        }
        .che-gong{
            display: flex;
            color: #2d8cf0;
            position: absolute;
            bottom:30px;
            &>div{
                font-family: MicrosoftYaHei;
                font-size: 14px;
                cursor: pointer;
            }

            div:nth-child(1){
                margin-right: 50px;
            }
        }
    }

    .chewei-content .el-step__title.is-finish{
        color: #333333;
        font-family: MicrosoftYaHei;
        font-size: 14px;
    }
    .chewei-content .el-step__icon{
        width: 15px;
        height: 15px;
    }

    .jieshao-content{
        color: #606266;
        font-size: 14px;
        line-height: 30px;
    }

    .item-wrap-title{
       margin-bottom: 50px;
    }

    .shouyi{
        display: flex;
    }
}
</style>