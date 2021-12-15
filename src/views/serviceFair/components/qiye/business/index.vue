<template>
    <div class="item-wrap-title">
        <div class="pro-item-title">
            <span>商务服务</span>
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
import jieji from "./components/jieji"
import qydzs from "./components/qydzs"
import lyfw from "./components/lyfw"
import hysfw from "./components/hysfw"
export default{
    data(){
        return{
            currentTabSecond:0,
            
            tabs2:[
                {
                    icon:'iconfont icon-tubiao-',
                    name:'接送机服务',
                    component:jieji
                },
                {
                    icon:'iconfont icon-shui',
                    name:'企业定制水',
                    component:qydzs
                },  
                {
                    icon:'iconfont icon-woshou1',
                    name:'礼仪服务',
                    component:lyfw
                }, 
                {
                    icon:'iconfont icon-huiyishi',
                    name:'会议室服务',
                    component:hysfw
                }
            ],

        }
    },
    components: {
        // tabs切换
        tabs,
        // 接机服务
        jieji,
        // 企业定制水
        qydzs,
        //礼仪服务
        lyfw,
        //会议室服务
        hysfw
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

