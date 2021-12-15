<template>
    <div>
        <!-- icon列表 -->
        <div class="icons">
            <div class="icon-wrap">
                <div class="icon-item" :class="['iconwrap']" v-for="(item2,index2) in tabs" :key="index2">
                    <div class="iconwrap"  @click="secondClick(index2,item2.component)">   
                        <div class="iconItem-tu"><i :class="[{activeSecond:index2==currentTabSecond},item2.icon]"></i></div>
                        <div :class="[{activeSecond:index2==currentTabSecond},'icon-name']">{{item2.name}}</div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
export default{
    props: {
       tabs:{
        type:Array,
        default:()=>[]
       },
       currentTabSecond:{
           type:Number,
           default:0
       }
    },
        
    
    data(){

        return {

        }
    },
    methods: {
        secondClick(index2){
           
            this.$emit('update:currentTabSecond', index2)
        }
    }
}

</script>

<style lang="scss" scoped>


.icons{
    width: 1200px;
    margin:0 auto;
    .icon-wrap{
        display: flex;
    }
    .icon-item{
        // width: 120px;
        padding: 0 20px 30px;
        // height: 130px;
        text-align:center;

        .iconfont{
            font-size:30px;
            color:#606266;
        }

        .iconItem-tu{
            height: 47px;
        }

        .iconwrap{
            cursor: pointer;
        }
        .icon-fangke{
            font-size:26px;
        }
        .icon-name{
            color: #606266;
            font-family: MicrosoftYaHei;
            font-size: 14px;
        }
    }
}

.activeSecond {
    color:#4b9df3!important
}
</style>