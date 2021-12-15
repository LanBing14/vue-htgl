<template>
    <div>
        <!-- 项目申报服务 -->
        <xiangmuS></xiangmuS>

        <!-- 创业/经营服务 -->
        <manage></manage>

        <!-- 商务服务 -->
        <business></business>
    </div>
</template>
<script>
/** 项目申报服务*/
import xiangmuS from "./xiangmuS/index"

/** 创业/经营服务*/
import manage from "./management/index"

/** 商务服务*/
import business from "./business/index"

export default{
    data(){
        return {

        }
    },
    components:{
        // 项目申报服务
        xiangmuS,
        // 创业/经营服务
        manage,
        // 商务服务
        business
    }
}

</script>