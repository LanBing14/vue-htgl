<template>
    <div class="dialogRisk">
        <div class="dialogRisk-company">
            <div class="close-wrap" style="cursor:pointer">
                <span>
                    <i class="el-dialog__close el-icon el-icon-close"></i>
                </span>
            </div>
            <div  class="dialogRisk-wrap">
                <p class="title" style="color: #333">企业认证提交成功 !</p>
                <p class="info1">您的认证已经提交，通过审核后，您的企业将获得企业认证标识</p>
                <p class="info1">同时平台将免费为您提供 <span style="color: #000;">风险体验</span> ，帮助您获取当前最新的风险信息，同时为你提供跟多服务，帮助您更好的管理信用风险</p>
                <div class="btn" style="margin-top: 28px;">
                    <span class="goExamination"  style="cursor: pointer;" @click="atOnceExp">现在体检</span>
                    <span class="fullInfo"  style="cursor: pointer;" @click="atOnceUse">立即使用</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {
    getToken,
    getUserInfo
} from '../../utils/auth';
    import {
  Api_CheckCompany,
} from "@/api/creditManagement/customerProfile/customerManagement.js";
import { Api_getCreditScore } from "@/api/advanceSearch";
    export default {
        props:{
            isShow:{
                type: Boolean
            }
        },
        data(){
           return {
           }
        },
        computed: {
            userInfo () {
                return this.$store.getters.userInfo.saasName;
            },
        },
        created() {
           
        },
        methods: {
            atOnceExp(){
            },
            atOnceUse(){
                this.$router.push('/front/creditManagement/todo')
            }
           
        }
    }
</script>
<style scoped lang="scss">
.dialogRisk {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 998;
    &.show {
        display: block;
    }
  }
  .infowarn {
      color: #fcab6a;
  }
 .close-wrap {
     position: absolute;
        right: 10px;
        top: 0;
        z-index: 999;
      span {
        // padding: 10px;
        // display: inline-block;   
        display: inline-block;
        padding-top: 24px;
        padding-right: 22px;

        i {
          font-size: 15px;
          color: #9b9fa4;
        }
      }
  }
 
.common {
    color:  $--color-primary ;
}

.title {
    font-size: 30px;
    line-height: 54px;
    }
.info {
    font-size: 16px;
    color: #999;

}
.goExamination{
    width: 198px;
    height: 72px;
    line-height: 72px;
    font-size: 26px;
    margin-right: 30px;
    text-align: center;
    display: inline-block;
    border-radius: 43px;
    cursor: pointer;
    border: 1px solid $--color-primary ;
    background-color: $--color-primary ;
    color: #ffffff;
}

.fullInfo {
    font-size: 20px;
    color:  $--color-primary;
    font-weight: 500;
    cursor: pointer;
}
.info1 {
    line-height:23px;
    font-size: 16px;
    color: #999;
}
.dialogRisk-company{
    width: 900px;
    height: 480px;
    margin: 100px auto;
    padding: 95px 120px 0 106px;
    background-color: #fff;
    background: #fff url(../../assets/images/bg/zc2BG.png) no-repeat center;
    border-radius: 10px;
    position: relative;
    
}

</style>