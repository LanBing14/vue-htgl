<template>
    <div class="wuyeService">
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
import tabs from "../common/tabs"
import chewei from "./components/chewei"
import zhuangxiu from "./components/zhuangxiu"
import baoxiu from "./components/baoxiu"
import fangke from "./components/fangke"
export default{
    data(){
        return{
            currentTabSecond:0,
            
            tabs2:[
                {
                    icon:'iconfont icon-chewei',
                    name:'车位服务',
                    component:chewei
                },
                {
                    icon:'iconfont icon-zhuangxiu',
                    name:'装修服务',
                    component:zhuangxiu
                },  
                {
                    icon:'iconfont icon-baoxiu',
                    name:'报修服务',
                    component:baoxiu
                }, 
                {
                    icon:'iconfont icon-weibiaoti-1-12',
                    name:'访客服务',
                    component:fangke
                }
            ],

        }
    },
    components: {
        // tabs切换
        tabs,
        // 车位
        chewei,
        // 装修
        zhuangxiu,
        //报修
        baoxiu,
        //访客
        fangke
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

<style lang="scss" scoped>
.wuyeService{
    padding-bottom: 145px;
}
</style>

