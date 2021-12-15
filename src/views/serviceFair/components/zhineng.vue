<template>
    <div class="intelligent_application">
        <div  class="intelligent_main">
            <div v-for="(item) in inteArr" class="intelligent_wrap" :key="item.title">
                <div :class="['item',{'item-active':item.ishow}]" @mouseenter="showBtn(item)" @mouseleave="hideBtn(item)">
                    <div class="iconwrap">
                        <i :class="item.icon"></i>
                    </div>
                    <div class="item-title">
                        {{item.title}}
                    </div>
                     <el-button v-show="item.ishow"  class="item-button" type="primary">{{item.btnTitle}}</el-button>
                </div>
            </div>

        </div>
    </div>
</template>
<script>
export default{
   data(){
       return{
           inteArr:[
               {
                   icon:'iconfont icon-peixun',
                   title:'培训服务',
                   btnTitle:'立即使用',
                   ishow:false
               },
               {
                   icon:'iconfont icon-xinyongguanli',
                   title:'信用管理服务',
                   btnTitle:'立即使用',
                   ishow:false
               },
               {
                   icon:'iconfont icon-zhengcefuwu',
                   title:'政策服务',
                   btnTitle:'立即使用',
                   ishow:false
               },
               {
                   icon:'iconfont icon-xiangmuluyan',
                   title:'项目路演',
                   btnTitle:'立即使用',
                   ishow:false
               },
               {
                   icon:'iconfont icon-jinrongfuwuguanli',
                   title:'金融服务',
                   btnTitle:'立即使用',
                   ishow:false
               },
               {
                   icon:'iconfont icon-weiwaiguanli',
                   title:'委外服务',
                   btnTitle:'立即使用',
                   ishow:false
               },
               {
                   icon:'iconfont  icon-8dachanyelian',
                   title:'产业链服务',
                   btnTitle:'立即使用',
                   ishow:false
               },
                {
                   icon:'iconfont  icon-zhishichanquan',
                   title:'知识产权',
                   btnTitle:'立即使用',
                   ishow:false
               },
                {
                   icon:'iconfont  icon-ts-falvfuwu',
                   title:'法律服务',
                   btnTitle:'立即使用',
                   ishow:false
               }               
           ]
       }
   },
   methods:{
       showBtn(item){
           item.ishow=true
       },
       hideBtn(item){
           item.ishow=false
       }
   }
}

</script>
<style lang="scss" scoped>
.intelligent_application{
    margin-bottom: 50px;
    .intelligent_main{
        width: 1200px;
        margin:0 auto;
        display: flex;
        flex-wrap: wrap;
    }
    .intelligent_wrap:nth-child(5n){
        margin-right: 0!important;
    }
    .intelligent_wrap{
        margin:20px 20px 0 0;
        .item{
            display: flex;
            border: solid 1px #dcdfe6;
            width: 224px;
            height: 260px;
            position: relative;
            padding: 76px 28px 0;
             border-radius: 4px;
            flex-direction: column;
            align-items: center;

            .iconwrap{
                 height: 60px;
            }
    
            .iconfont{
                font-size:40px;
               
            }

            .item-button{
                width: 100%;
                margin-top: 37px;
                height: 36px;
            }
            
        }

        .item-active{
            box-shadow: 0px 0px 10px 0px 
		rgba(75, 157, 243, 0.53);
           
            border: solid 1px rgba(75, 157, 243, 0.35);
        }
    }
}

</style>