<template>
    <div class="rencai-wrap">

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
//租金补贴
import zjbt from "./components/zjbt"
import anju from "./components/anju"
// 居住证
import jieji from "./components/jieji"
export default{
    data(){
        return{
            currentTabSecond:0,
            
            tabs2:[
                {
                    icon:'iconfont icon-fangwuzujin',
                    name:'租金补贴',
                    component:zjbt
                },
                {
                    icon:'iconfont icon-xiaoqu',
                    name:'人才安居房',
                    component:anju
                },
                {
                    icon:'iconfont icon-juzhuzheng',
                    name:'居住证办理',
                    component:jieji
                }
            ],

        }
    },
    components: {
        // tabs切换
        tabs,
        // 租金补贴
        zjbt,
        anju,
        //居住证
        jieji

 
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
.rencai-wrap{
    margin-bottom: 145px;
}
</style>
