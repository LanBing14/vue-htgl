<template>
    <div class="item-wrap-title">
        <div class="pro-item-title">
            <span>创业/经营服务</span>
        </div>
        <tabs :tabs="tabs2" :currentTabSecond.sync="currentTabSecond"></tabs>
        <!--动态渲染组件 -->
          <keep-alive>
            <component 
                v-bind:is="currentSedTabComponent" 
                class="sub"
            ></component>
           </keep-alive>
    </div>
</template>
<script>
import tabs from "../../common/tabs"
import gszcbg from "./components/gszcbg"
import rsfw from "./components/rsfw"
import kjfw from "./components/kjfw"
import sbdb from "./components/sbdb"
export default{
    data(){
        return{
            currentTabSecond:0,
            
            tabs2:[
                {
                    icon:'iconfont icon-gongshangbiangeng',
                    name:'工商注册/变更',
                    component:gszcbg
                },
                {
                    icon:'iconfont icon-renshi',
                    name:'人事服务',
                    component:rsfw
                },  
                {
                    icon:'iconfont icon-huijihexin',
                    name:'会计服务',
                    component:kjfw
                }, 
                {
                    icon:'iconfont icon-shebao-card',
                    name:'社保代办',
                    component:sbdb
                }
            ],

        }
    },
    components: {
        // tabs切换
        tabs,
        // 工商注册变更
        gszcbg,
        // 人事服务
        rsfw,
        //会计服务
        kjfw,
        //社保代办
        sbdb
    },
    computed: {
        currentSedTabComponent: function() {
            return this.tabs2[this.currentTabSecond].component
        }
    },
    methods: {
       
    }
}


</script>

