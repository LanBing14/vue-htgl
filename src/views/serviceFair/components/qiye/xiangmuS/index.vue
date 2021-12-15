<template>
    <div class="item-wrap-title">
        <div class="pro-item-title">
            <span>项目申报服务</span>
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
//高新技术企业申报
import companySheng from "./components/companySheng"
import peiyuCompany from "./components/peiyuCompany"
import kejiCompany from "./components/kejiCompany"
import gcJshu from "./components/gcJshu"
import dujiao from "./components/dujiao"
export default{
    data(){
        return{
            currentTabSecond:0,
            
            tabs2:[
                {
                    icon:'iconfont icon-faqi',
                    name:'高新技术企业申报',
                    component:companySheng
                },
                {
                    icon:'iconfont icon-xinjingjiqiyepeiyu',
                    name:'高新培育企业申报',
                    component:peiyuCompany
                },  
                {
                    icon:'iconfont icon-beian',
                    name:'科技企业服务业备案',
                    component:kejiCompany
                }, 
                {
                    icon:'iconfont icon-ziyuan2',
                    name:'工程技术研究中心',
                    component:gcJshu
                },
                {
                    icon:'iconfont icon-guomiao',
                    name:'独角兽（培育）申报',
                    component:dujiao
                }
            ],

        }
    },
    components: {
        // tabs切换
        tabs,
        // 高新技术企业申报
        companySheng,
        // 高新培育企业申报
        peiyuCompany,
        //科技企业服务业备案
        kejiCompany,
        //工程技术
        gcJshu,
        //独角
        dujiao
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



